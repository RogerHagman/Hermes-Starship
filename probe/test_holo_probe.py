"""Tests for the holo probe. Run: python -m unittest discover -s probe"""
import io
import json
import sys
import tempfile
import unittest
import urllib.error
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

import jsonschema

sys.path.insert(0, str(Path(__file__).parent))
import holo_probe  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
NOW = datetime(2026, 11, 7, 20, 0, tzinfo=timezone.utc)
PATHS = holo_probe.read_paths(ROOT / ".github" / "holo-paths.txt")
REPO = "RogerHagman/Hermes-Starship"
WEB = f"https://github.com/{REPO}"


class Fake:
    """Stands in for GitHub: answers GETs from a table of path -> body, and records each request."""

    def __init__(self, table):
        self.table = table
        self.seen = []

    def __call__(self, req, timeout=None):
        self.seen.append(req)
        assert req.get_method() == "GET"
        url = urllib.parse.urlsplit(req.full_url)
        path = url.path.removeprefix(f"/repos/{REPO}")
        query = dict(urllib.parse.parse_qsl(url.query))
        key = path + (f"?ref={query['ref']}" if "ref" in query else "")
        if key not in self.table:
            raise urllib.error.HTTPError(req.full_url, 404, "Not Found", {}, None)
        body = self.table[key]
        return io.BytesIO(body.encode() if isinstance(body, str) else json.dumps(body).encode())


def step(name, conclusion, status="completed"):
    return {"name": name, "status": status, "conclusion": conclusion,
            "started_at": "2026-11-07T19:00:00Z", "completed_at": "2026-11-07T19:00:09Z"}


def pull(number, branch, sha, merged=False, state="open"):
    return {"number": number, "html_url": f"{WEB}/pull/{number}", "state": state, "draft": False, "title": f"PR for {branch}",
            "merged_at": "2026-11-06T21:05:00Z" if merged else None, "updated_at": "2026-11-07T19:30:00Z",
            "head": {"ref": branch, "sha": sha}}


def table():
    return {
        "/branches": [{"name": "main", "commit": {"sha": "0" * 40}},
                      {"name": "holo/ORD-1250", "commit": {"sha": "a" * 40}},
                      {"name": "holo/ORD-1251", "commit": {"sha": "b" * 40}},
                      {"name": "claude/other", "commit": {"sha": "c" * 40}}],
        "/pulls": [pull(40, "holo/ORD-1250", "a" * 40), pull(31, "holo/ORD-1240", "d" * 40, merged=True, state="closed"),
                   pull(39, "claude/other", "c" * 40)],
        "/actions/workflows/holo.yml/runs": {"workflow_runs": [
            {"id": 7, "head_sha": "e" * 40, "status": "completed", "conclusion": "success", "html_url": f"{WEB}/actions/runs/7",
             "run_started_at": "2026-11-07T19:00:00Z", "updated_at": "2026-11-07T19:01:35Z"}]},
        "/actions/runs/7/jobs": {"jobs": [{"id": 70, "conclusion": "success", "steps": [step("Holodeck paths only", "success"), step("Build dist", "success")]}]},
        "/compare/main...holo/ORD-1250": {"commits": [
            {"sha": "e" * 40, "author": {"login": "RogerHagman"}, "commit": {"message": "Ops legend\n\nmore"}},
            {"sha": "a" * 40, "author": {"login": "github-actions[bot]"}, "commit": {"message": "Build dist for holo/ORD-1250"}}], "files": [
            {"filename": "frontend/src/components/ops/Panels.tsx", "additions": 3, "deletions": 1, "patch": "@@ -1 +1 @@\n-a\n+b"},
            {"filename": "__version__.py", "additions": 1, "deletions": 1, "patch": "@@"},
            {"filename": "frontend/dist/index.html", "additions": 1, "deletions": 1, "patch": "@@ built"},
            {"filename": "deploy/compose.yaml", "additions": 1, "deletions": 0, "patch": "@@ +x"}]},
        f"/contents/holodeck/reports/ORD-1250.md?ref={'a' * 40}": "# ORD-1250 · Ops legend\n\nDone.",
        f"/contents/__version__.py?ref={'a' * 40}": '__version__ = "0.2.17"\n',
        "/compare/main...holo/ORD-1251": {"commits": [{"commit": {"message": "Science labels", "committer": {"date": "2026-11-07T18:00:00Z"}}}], "files": []},
        "/pulls/31/files": [{"filename": "frontend/src/x.tsx", "additions": 1, "deletions": 0, "patch": "@@"}],
        "/commits": [main_commit("1" * 40, "Merge pull request #31"), main_commit("2" * 40, "Holodeck legend", login="RogerHagman")],
        f"/commits/{'1' * 40}/pulls": [{"number": 31, "merged_at": "2026-11-07T21:05:00Z", "base": {"ref": "main"}}],
        f"/commits/{'2' * 40}/pulls": [{"number": 31, "merged_at": "2026-11-07T21:05:00Z", "base": {"ref": "main"}}],
    }


def main_commit(sha, message, login=None, name="Holodeck Officer"):
    return {"sha": sha, "html_url": f"{WEB}/commit/{sha}", "author": {"login": login} if login else None,
            "commit": {"message": message, "author": {"name": name, "date": "2026-11-07T21:30:00Z"},
                       "committer": {"date": "2026-11-07T21:30:00Z"}}}


def probe(t):
    fake = Fake(t)
    return holo_probe.Probe(holo_probe.GitHub(REPO, "secret-value", opener=fake), PATHS), fake


class Cycle(unittest.TestCase):
    def test_the_file_matches_the_schema(self):
        data = probe(table())[0].cycle(NOW)
        schema = json.loads((ROOT / "api" / "schema" / "holo.schema.json").read_text())
        jsonschema.Draft202012Validator(schema, format_checker=jsonschema.Draft202012Validator.FORMAT_CHECKER).validate(data)
        self.assertIs(data["synthetic"], False)

    def test_only_holo_work_open_first(self):
        data = probe(table())[0].cycle(NOW)
        self.assertEqual([i["branch"] for i in data["items"]], ["holo/ORD-1250", "holo/ORD-1251", "holo/ORD-1240"])
        self.assertEqual([i["state"] for i in data["items"]], ["ready", "pushed", "merged"])

    def test_ready_item_has_its_run_files_report_and_version(self):
        item = probe(table())[0].cycle(NOW)["items"][0]
        self.assertEqual(item["order"], "ORD-1250")
        self.assertEqual(item["pr"], {"number": 40, "url": f"{WEB}/pull/40", "state": "open", "draft": False})
        self.assertEqual(item["run"]["status"], "passed")
        self.assertEqual(item["run"]["seconds"], 95)
        self.assertEqual([s["state"] for s in item["run"]["steps"]], ["ok", "ok"])
        self.assertEqual(item["report"], "# ORD-1250 · Ops legend\n\nDone.")
        self.assertEqual(item["version"], "0.2.17")
        bounds = {f["path"]: f["inBounds"] for f in item["files"]}
        self.assertFalse(bounds["deploy/compose.yaml"])
        self.assertTrue(bounds["frontend/src/components/ops/Panels.tsx"])
        self.assertNotIn("patch", item["files"][2], "built files carry no diff")

    def test_failed_run_brings_its_log_tail(self):
        t = table()
        t["/actions/workflows/holo.yml/runs"]["workflow_runs"][0].update(conclusion="failure")
        t["/actions/runs/7/jobs"] = {"jobs": [{"id": 70, "conclusion": "failure", "steps": [step("Holodeck paths only", "failure"), step("Build dist", "skipped")]}]}
        t["/actions/jobs/70/logs"] = ("2026-11-07T19:00:01.1Z ##[group]Run git fetch\n2026-11-07T19:00:01.2Z ##[endgroup]\n"
                                      "2026-11-07T19:00:02.0Z   deploy/compose.yaml\n2026-11-07T19:00:02.1Z ##[error]Process completed with exit code 1.\n")
        item = probe(t)[0].cycle(NOW)["items"][0]
        self.assertEqual(item["state"], "failed")
        self.assertEqual([s["state"] for s in item["run"]["steps"]], ["failed", "skipped"])
        self.assertEqual(item["run"]["failLog"], ["  deploy/compose.yaml", "Process completed with exit code 1."])

    def test_running_run_is_building(self):
        t = table()
        t["/actions/workflows/holo.yml/runs"]["workflow_runs"][0].update(status="in_progress", conclusion=None)
        t["/actions/runs/7/jobs"] = {"jobs": [{"id": 70, "conclusion": None, "steps": [step("Holodeck paths only", "success"), step("Build dist", None, "in_progress")]}]}
        item = probe(t)[0].cycle(NOW)["items"][0]
        self.assertEqual(item["state"], "building")
        self.assertIsNone(item["run"]["seconds"])
        self.assertEqual(item["run"]["steps"][1], {"name": "Build dist", "state": "running", "seconds": None})

    def test_finished_work_is_fetched_once(self):
        p, fake = probe(table())
        p.cycle(NOW)
        before = sum("/pulls/31/files" in r.full_url for r in fake.seen)
        p.cycle(NOW)
        self.assertEqual(sum("/pulls/31/files" in r.full_url for r in fake.seen), before)

    def test_signin_goes_only_to_github_and_never_to_a_redirect(self):
        _, fake = probe(table())
        holo_probe.Probe(holo_probe.GitHub(REPO, "secret-value", opener=fake), PATHS).cycle(NOW)
        for req in fake.seen:
            self.assertTrue(req.full_url.startswith("https://api.github.com/repos/"))
            self.assertNotIn("Authorization", req.headers)   # unredirected: dropped on a redirect
            self.assertEqual(req.unredirected_hdrs["Authorization"], "Bearer secret-value")

    def test_nothing_is_written_with_the_signin_in_it(self):
        data = probe(table())[0].cycle(NOW)
        with tempfile.TemporaryDirectory() as out:
            holo_probe.atomic_write(out, data, "holo.json")
            self.assertNotIn("secret-value", (Path(out) / "holo.json").read_text())


class MainWatch(unittest.TestCase):
    def test_main_is_clean_when_every_commit_came_through_a_merged_pr(self):
        main = probe(table())[0].cycle(NOW)["main"]
        self.assertEqual(main, {"since": "2026-11-07T21:00:00Z", "checked": 2, "unreviewed": []})

    def test_a_push_straight_to_main_is_flagged_with_its_author(self):
        t = table()
        t["/commits"].insert(0, main_commit("3" * 40, "Direct push\n\nbody"))
        t[f"/commits/{'3' * 40}/pulls"] = []
        main = probe(t)[0].cycle(NOW)["main"]
        self.assertEqual(main["unreviewed"], [{"sha": "3" * 12, "title": "Direct push", "author": "Holodeck Officer",
                                               "at": "2026-11-07T21:30:00Z", "url": f"{WEB}/commit/{'3' * 40}"}])

    def test_an_open_or_other_base_pr_does_not_count(self):
        t = table()
        t["/commits"].insert(0, main_commit("4" * 40, "Sneaky"))
        t[f"/commits/{'4' * 40}/pulls"] = [{"number": 41, "merged_at": None, "base": {"ref": "main"}},
                                          {"number": 42, "merged_at": "2026-11-07T21:00:00Z", "base": {"ref": "other"}}]
        self.assertEqual(len(probe(t)[0].cycle(NOW)["main"]["unreviewed"]), 1)

    def test_a_cleared_commit_stops_counting_and_reviewed_ones_are_asked_once(self):
        t = table()
        t["/commits"].insert(0, main_commit("3" * 40, "Direct push"))
        t[f"/commits/{'3' * 40}/pulls"] = []
        p, fake = probe(t)
        p.main_ok = {"3" * 12}
        self.assertEqual(p.cycle(NOW)["main"]["unreviewed"], [])
        p.cycle(NOW)
        self.assertEqual(sum(f"/commits/{'1' * 40}/pulls" in r.full_url for r in fake.seen), 1)


class PathsAgree(unittest.TestCase):
    def test_the_workflow_reads_the_same_paths_file_from_main(self):
        flow = (ROOT / ".github" / "workflows" / "holo.yml").read_text()
        self.assertIn("git show origin/main:.github/holo-paths.txt", flow)
        self.assertIn("frontend/src/", PATHS)
        self.assertNotIn("deploy/", PATHS)
        self.assertFalse(any(p.startswith(".github") for p in PATHS))


if __name__ == "__main__":
    unittest.main()
