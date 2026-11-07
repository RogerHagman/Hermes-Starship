#!/usr/bin/env python3
"""The holo probe: writes live/holo.json for the Review bay on the Holodeck board, every 2 minutes.

It reads the Holodeck Officer's work from GitHub and changes nothing there (GET only):
- every holo/ branch, and every pull request made from one (open first, then the last few
  merged or closed ones);
- the newest run of the holo Action on each branch head, step by step, and the last lines of the
  log when a step failed;
- the files each branch changes against main, with their diffs, each one flagged when it is
  outside the Holodeck's paths (.github/holo-paths.txt);
- holo's report, holodeck/reports/<ORD>.md, and the version the branch bumps to.

It never reads Hermes' files. Its one secret is a read-only GitHub sign-in for this repo
(GITHUB_READ, from deploy/.env). It is sent only to api.github.com, never printed, and never
written anywhere. Without it the probe writes nothing and the board keeps its sample.

Work that is finished (merged or closed) is fetched once and kept in memory, so a quiet repo costs
two calls a cycle.

Settings come from the environment: GITHUB_READ, REPO (owner/name), HOLO_PATHS (the paths file),
OUT_DIR, INTERVAL (seconds; 0 runs once), KEEP_DONE (merged or closed items kept). Standard
library only.
"""
import json
import os
import re
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

API = "https://api.github.com"
UTC = timezone.utc
ITEMS_KEEP = 40
FILES_KEEP = 100
PATCH_KEEP = 60000
REPORT_KEEP = 20000
LOG_LINES = 40
ORDER = re.compile(r"^holo/(ORD-\d{3,6})$")
VERSION = re.compile(r"""__version__\s*=\s*["'](\d+\.\d+\.\d+)["']""")
BOT = "github-actions[bot]"
STAMP = re.compile(r"^\d{4}-\d\d-\d\dT[\d:.]+Z ")


def log(message):
    print(message, file=sys.stderr, flush=True)


def utc_stamp(value):
    return value.astimezone(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def iso(value):
    """GitHub's times are already UTC ISO; keep them to the second, or None."""
    if not value:
        return None
    return utc_stamp(datetime.fromisoformat(value.replace("Z", "+00:00")))


def seconds(start, end):
    if not start or not end:
        return None
    a = datetime.fromisoformat(start.replace("Z", "+00:00"))
    b = datetime.fromisoformat(end.replace("Z", "+00:00"))
    return max(0, int((b - a).total_seconds()))


def read_paths(path):
    """The Holodeck's path prefixes, one per line, # for comments."""
    lines = Path(path).read_text(encoding="utf-8").splitlines()
    return [line.strip() for line in lines if line.strip() and not line.startswith("#")]


def in_bounds(name, paths):
    return any(name.startswith(p) for p in paths)


class GitHub:
    """GET only. The sign-in header is never passed on to a redirect (log downloads redirect)."""

    def __init__(self, repo, signin, opener=None):
        self.repo = repo
        self.signin = signin
        self.open = opener or urllib.request.urlopen

    def get(self, path, raw=False, query=None):
        url = f"{API}/repos/{self.repo}{path}"
        if query:
            url += "?" + urllib.parse.urlencode(query)
        req = urllib.request.Request(url, method="GET")
        req.add_header("Accept", "application/vnd.github.raw" if raw else "application/vnd.github+json")
        req.add_header("X-GitHub-Api-Version", "2022-11-28")
        req.add_header("User-Agent", "hermes-starship-holo-probe")
        req.add_unredirected_header("Authorization", f"Bearer {self.signin}")
        with self.open(req, timeout=20) as res:
            body = res.read()
        return body.decode("utf-8", "replace") if raw else json.loads(body)

    def maybe(self, path, raw=False, query=None):
        """Like get, but a missing thing (404) is None."""
        try:
            return self.get(path, raw=raw, query=query)
        except urllib.error.HTTPError as error:
            if error.code == 404:
                return None
            raise


def step_state(step):
    if step.get("status") != "completed":
        return "running" if step.get("status") == "in_progress" else "waiting"
    return {"success": "ok", "skipped": "skipped"}.get(step.get("conclusion"), "failed")


def run_status(run):
    if run["status"] in ("queued", "waiting", "requested", "pending"):
        return "queued"
    if run["status"] != "completed":
        return "running"
    return {"success": "passed", "cancelled": "cancelled"}.get(run.get("conclusion"), "failed")


def log_tail(text):
    """The last lines of a job log that say something: timestamps and group markers dropped."""
    lines = []
    for line in text.splitlines():
        line = STAMP.sub("", line).rstrip()
        if not line or line.startswith("##[group]") or line.startswith("##[endgroup]"):
            continue
        lines.append(line.replace("##[error]", "")[:400])
    return lines[-LOG_LINES:]


def read_run(gh, branch, sha):
    """The newest holo Action run on this head, with its steps, or None."""
    found = gh.get("/actions/workflows/holo.yml/runs", query={"branch": branch, "per_page": 5})
    runs = [r for r in found.get("workflow_runs", []) if r.get("head_sha") == sha]
    if not runs:
        return None
    run = runs[0]
    status = run_status(run)
    jobs = gh.get(f"/actions/runs/{run['id']}/jobs").get("jobs", [])
    steps, fail_log = [], []
    for job in jobs:
        for step in job.get("steps", []):
            steps.append({"name": step["name"][:120], "state": step_state(step),
                          "seconds": seconds(step.get("started_at"), step.get("completed_at")) if step.get("status") == "completed" else None})
        if job.get("conclusion") == "failure" and not fail_log:
            text = gh.maybe(f"/actions/jobs/{job['id']}/logs", raw=True)
            fail_log = log_tail(text) if text else []
    out = {"status": status, "url": run["html_url"], "startedAt": iso(run.get("run_started_at")),
           "seconds": seconds(run.get("run_started_at"), run.get("updated_at")) if status in ("passed", "failed", "cancelled") else None,
           "steps": steps[:40]}
    if fail_log:
        out["failLog"] = fail_log
    return out


def read_files(gh, branch, pr, paths):
    """What the branch changes against main. A deleted branch is read from its PR instead."""
    if pr and pr["state"] != "open":
        listed = gh.get(f"/pulls/{pr['number']}/files", query={"per_page": FILES_KEEP})
        commits = []
    else:
        found = gh.get(f"/compare/main...{urllib.parse.quote(branch, safe='/')}")
        listed, commits = found.get("files", []), found.get("commits", [])
    files = []
    for f in listed[:FILES_KEEP]:
        item = {"path": f["filename"][:300], "add": f.get("additions", 0), "del": f.get("deletions", 0),
                "inBounds": in_bounds(f["filename"], paths)}
        if f.get("patch") and not f["filename"].startswith("frontend/dist/"):
            item["patch"] = f["patch"][:PATCH_KEEP]
        files.append(item)
    subject = commits[0]["commit"]["message"].splitlines()[0] if commits else None
    pushed = iso(commits[-1]["commit"].get("committer", {}).get("date")) if commits else None
    # The holo Action commits the build on top of holo's own commit, and that push starts no run.
    # So the run to show is the one on holo's newest commit, not on the branch head.
    mine = [c for c in commits if (c.get("author") or {}).get("login") != BOT]
    work = mine[-1].get("sha") if mine else None
    return files, subject, pushed, work


def item_state(pr, run):
    if pr and pr["state"] == "merged":
        return "merged"
    if pr and pr["state"] == "closed":
        return "closed"
    if not run:
        return "pushed"
    return {"queued": "building", "running": "building", "passed": "ready"}.get(run["status"], "failed")


def read_item(gh, branch, sha, pr, updated, paths, now):
    """One branch's work. updated is the PR's last change; without a PR, the newest commit's time."""
    order = ORDER.match(branch)
    order = order.group(1) if order else None
    files, subject, pushed, work = read_files(gh, branch, pr, paths)
    run = read_run(gh, branch, work or sha) if not pr or pr["state"] == "open" else None
    updated = updated or pushed or now
    report = gh.maybe(f"/contents/holodeck/reports/{order}.md", raw=True, query={"ref": sha}) if order else None
    version = None
    if any(f["path"] == "__version__.py" for f in files):
        text = gh.maybe("/contents/__version__.py", raw=True, query={"ref": sha})
        found = VERSION.search(text or "")
        version = found.group(1) if found else None
    title = (pr or {}).get("title") or subject or branch
    item = {"branch": branch, "order": order, "title": title[:200], "state": item_state(pr, run), "updatedAt": updated,
            "version": version, "sha": sha[:12], "pr": pr and {k: pr[k] for k in ("number", "url", "state", "draft")},
            "run": run, "files": files, "report": report[:REPORT_KEEP] if report else None}
    return item


def pr_of(raw):
    state = "merged" if raw.get("merged_at") else raw["state"]
    return {"number": raw["number"], "url": raw["html_url"], "state": state, "draft": bool(raw.get("draft")),
            "title": raw["title"], "sha": raw["head"]["sha"], "updatedAt": iso(raw.get("updated_at"))}


class Probe:
    def __init__(self, gh, paths, keep_done=10):
        self.gh = gh
        self.paths = paths
        self.keep_done = keep_done
        self.done = {}   # branch -> item, for merged and closed work (it doesn't change)

    def cycle(self, now):
        branches = [b for b in self.gh.get("/branches", query={"per_page": 100}) if b["name"].startswith("holo/")]
        pulls = [p for p in self.gh.get("/pulls", query={"state": "all", "per_page": 50, "sort": "updated", "direction": "desc"})
                 if p["head"]["ref"].startswith("holo/")]
        prs = {}
        for raw in pulls:   # newest first: the newest PR of a branch wins
            prs.setdefault(raw["head"]["ref"], pr_of(raw))
        heads = {b["name"]: b["commit"]["sha"] for b in branches}
        items = []
        for name in sorted(set(heads) | set(prs)):
            pr = prs.get(name)
            if pr and pr["state"] != "open":
                if name not in self.done or self.done[name]["pr"]["state"] != pr["state"]:
                    self.done[name] = read_item(self.gh, name, pr["sha"], pr, pr["updatedAt"], self.paths, utc_stamp(now))
                items.append(self.done[name])
                continue
            sha = heads.get(name) or pr["sha"]
            items.append(read_item(self.gh, name, sha, pr, (pr or {}).get("updatedAt"), self.paths, utc_stamp(now)))
        open_items = sorted([i for i in items if i["state"] not in ("merged", "closed")], key=lambda i: i["updatedAt"], reverse=True)
        finished = sorted([i for i in items if i["state"] in ("merged", "closed")], key=lambda i: i["updatedAt"], reverse=True)
        return {"asOf": utc_stamp(now), "synthetic": False, "repo": self.gh.repo,
                "items": (open_items + finished[:self.keep_done])[:ITEMS_KEEP]}


def atomic_write(out_dir, data, name):
    directory = Path(out_dir)
    directory.mkdir(parents=True, exist_ok=True)
    fd, temp = tempfile.mkstemp(dir=directory, prefix=f".{name}.", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump(data, handle, indent=2, ensure_ascii=False)
            handle.write("\n")
        os.chmod(temp, 0o644)   # nginx runs as another user and must be able to read it
        os.replace(temp, directory / name)
    finally:
        if os.path.exists(temp):
            os.unlink(temp)


def main():
    env = dict(os.environ)
    signin = env.get("GITHUB_READ", "").strip()
    if not signin:
        log("holo probe: no GITHUB_READ in deploy/.env, so nothing is written and the Review bay stays on its sample")
    try:
        interval = float(env.get("INTERVAL", "120"))
    except ValueError:
        interval = 120
    probe = Probe(GitHub(env.get("REPO", "RogerHagman/Hermes-Starship"), signin),
                  read_paths(env.get("HOLO_PATHS", "/app/holo-paths.txt")), int(env.get("KEEP_DONE", "10")))
    said = None
    while True:
        if signin:
            try:
                data = probe.cycle(datetime.now(UTC))
                atomic_write(env.get("OUT_DIR", "/out"), data, "holo.json")
                counts = tuple(sorted((i["branch"], i["state"]) for i in data["items"]))
                if counts != said:   # a line when something changed, not every cycle
                    log(f"wrote {len(data['items'])} holo items: " + ", ".join(f"{b} {s}" for b, s in counts) if counts else "wrote 0 holo items")
                    said = counts
            except urllib.error.HTTPError as error:   # the message never holds the sign-in
                log(f"holo probe: GitHub said {error.code} {error.reason}")
            except Exception as error:   # one bad cycle must not stop the probe
                log(f"holo probe: {type(error).__name__}: {error}")
        if interval <= 0:
            return
        time.sleep(interval)


if __name__ == "__main__":
    main()
