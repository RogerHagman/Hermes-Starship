"""What's live: reads the facts whats-live.sh gathered on the NAS and says, per open item, whether
it is live yet.

Read-only. It opens nothing but the folder it is given (the facts) and prints one line per item:
LIVE, NOT YET (with what is missing) or CHECK (the facts could not tell). Exit code 0 when every
item is live, 1 when one is not, 2 when the facts folder is missing.

    python3 deploy/whats_live.py <facts folder>

The facts folder (all files optional; a missing one means "not found"):
  now                       epoch seconds on the NAS when the facts were gathered
  check.txt, check.rc       check.sh output and exit code
  apply-fix                 "applied" or "built" for /opt/data/patches/patch_B235.diff (the B2-36 fix)
  fast-paths.json           /opt/data/routing/fast-paths.json
  hook-grep.txt             arrival hook files in /opt/data/hooks (not tests) that name fast-paths
  containers.txt            "<name> <running true|false>" per container
  ship-env.txt              the ship probe's environment, one VAR=value a line
  __version__.py            the Starship checkout's version file
  dist.txt                  built page files that carry the core terminal's settings key
  live/*.json               the probes' output (orders, records, fastpaths, meters)
  speed-trials.json         the speed-trial results
"""
import json
import re
import sys
from datetime import datetime
from pathlib import Path

# What each item needs. Bump these when a later item becomes the one to look for.
NEED_PATCH = "AI"          # check.sh must say OK through this one (AG, AH, AI are the last three)
NEED_VERSION = (0, 2, 9)   # PR #22, the core terminal's pages, manual, jump key and settings
SHIP_FRESH_S = 5 * 60      # the ship probe writes every minute
METERS_FRESH_S = 15 * 60   # the meter probe writes every 5 minutes

LIVE, NOT_YET, CHECK = "LIVE", "NOT YET", "CHECK"


def text(facts, name):
    path = facts / name
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return None


def load_json(facts, name):
    raw = text(facts, name)
    if raw is None:
        return None, "not found"
    try:
        return json.loads(raw), ""
    except ValueError:
        return None, "not valid JSON"


def patch_key(letter):
    """A < B < ... < Z < AA < ... < AI. Sub-patches (W_b, AD2, X2) sort with their letter."""
    base = re.match(r"[A-Z]+", letter or "")
    base = base.group(0) if base else ""
    return (len(base), base)


def age_s(stamp, now):
    if not isinstance(stamp, str) or now is None:
        return None
    try:
        when = datetime.fromisoformat(stamp.replace("Z", "+00:00"))
    except ValueError:
        return None
    return now - when.timestamp()


def ago(seconds):
    if seconds is None:
        return "unknown age"
    if seconds < 90:
        return f"{max(0, round(seconds))} s ago"
    if seconds < 90 * 60:
        return f"{round(seconds / 60)} min ago"
    if seconds < 48 * 3600:
        return f"{round(seconds / 3600)} h ago"
    return f"{round(seconds / 86400)} days ago"


def containers(facts):
    out = {}
    for line in (text(facts, "containers.txt") or "").splitlines():
        parts = line.split()
        if len(parts) >= 2:
            out[parts[0]] = parts[1] == "true"
    return out


# --- the items ---------------------------------------------------------------------------------

def item_patches(facts, now):
    out = text(facts, "check.txt")
    if out is None or not out.strip():
        return CHECK, "check.sh gave no output (is the hermes container running?)"
    bad = [m.group(1) + " " + m.group(2) for m in re.finditer(r"^\s*([A-Z][A-Za-z0-9_]*)\s*:\s*(MISSING|DRIFTED)\b", out, re.M)]
    through = re.findall(r"OK through\s+([A-Z][A-Za-z0-9_]*)", out)
    if not through:
        return NOT_YET, "check.sh never says 'OK through'" + (f"; {', '.join(bad)}" if bad else "")
    last = through[-1]
    if patch_key(last) < patch_key(NEED_PATCH):
        return NOT_YET, f"check.sh: OK through {last}, needs {NEED_PATCH}" + (f"; {', '.join(bad)}" if bad else "")
    note = f"check.sh: OK through {last}"
    if bad:
        note += f"; also {', '.join(bad)}"
    return LIVE, note


def item_apply_wb(facts, now):
    # The B2-36 fix is patch_B235.diff (forge filed it under the B2-35 number): it changes only
    # apply.sh, so it is live when it reverse-checks. apply.sh's own words can't tell: B2-31 already
    # had an "under later overlays" line for W_b that failed. Proof: apply.sh ends without an error.
    fix = (text(facts, "apply-fix") or "").strip()
    if fix == "applied":
        return LIVE, "patch_B235.diff is applied to apply.sh (proof: the next apply.sh run ends without an error)"
    if fix == "built":
        return NOT_YET, "patch_B235.diff is built but not applied to apply.sh"
    return NOT_YET, "no patch_B235.diff yet (brief B2-36 not done; apply.sh still stops at W_b)"


def item_core_terminal(facts, now):
    raw = text(facts, "__version__.py")
    if raw is None:
        return CHECK, "no __version__.py in the Starship folder"
    found = re.search(r'__version__\s*=\s*"(\d+)\.(\d+)\.(\d+)"', raw)
    if not found:
        return CHECK, "could not read the version in __version__.py"
    version = tuple(int(x) for x in found.groups())
    shown = ".".join(map(str, version))
    built = bool((text(facts, "dist.txt") or "").strip())
    nginx = containers(facts).get("hermes-starship")
    if version < NEED_VERSION:
        return NOT_YET, f"the NAS has v{shown}, needs v{'.'.join(map(str, NEED_VERSION))}: pull the repo"
    if not built:
        return NOT_YET, f"v{shown} pulled, but the built page has no core-terminal settings"
    if nginx is False:
        return NOT_YET, f"v{shown} pulled, but the board's web server (hermes-starship) is not running"
    return LIVE, f"v{shown} on the NAS, built page has the terminal settings"


def item_meters(facts, now):
    running = containers(facts).get("hermes-starship-meters")
    meters, why = load_json(facts, "live/meters.json")
    if running is not True:
        return NOT_YET, "the meter probe (hermes-starship-meters) is not running" + ("" if meters else ", and no meters.json")
    if meters is None:
        return NOT_YET, f"meter probe running, but live/meters.json is {why}"
    age = age_s(meters.get("asOf"), now)
    sources = meters.get("sources") or {}
    states = ", ".join(f"{k} {v.get('state', '?')}" for k, v in sources.items() if isinstance(v, dict))
    if meters.get("synthetic") is not False:
        return NOT_YET, "live/meters.json is a sample, not the probe's"
    if age is None or age > METERS_FRESH_S:
        return NOT_YET, f"meters.json last written {ago(age)} (stale)"
    return LIVE, f"meters.json written {ago(age)}" + (f"; sources: {states}" if states else "")


def item_speed_trial(facts, now):
    meters, _ = load_json(facts, "live/meters.json")
    trials = []
    if isinstance(meters, dict) and isinstance(meters.get("trials"), list):
        trials = meters["trials"]
    if not trials:
        raw, _ = load_json(facts, "speed-trials.json")
        if isinstance(raw, dict):
            raw = raw.get("trials")
        trials = raw if isinstance(raw, list) else []
    if not trials:
        return NOT_YET, "no speed trial on file: run the speed-trial service once"
    stamps = [t.get("at") for t in trials if isinstance(t, dict) and isinstance(t.get("at"), str)]
    when = max(stamps) if stamps else None
    detail = f"{len(trials)} trial{'s' if len(trials) != 1 else ''} on file"
    if when:
        detail += f", newest {ago(age_s(when, now))}"
    return LIVE, detail


def item_fast_paths(facts, now):
    data, why = load_json(facts, "fast-paths.json")
    paths = data.get("paths") if isinstance(data, dict) else None
    hook = [l for l in (text(facts, "hook-grep.txt") or "").splitlines() if l.strip()]
    board, _ = load_json(facts, "live/fastpaths.json")
    board_live = isinstance(board, dict) and board.get("synthetic") is False
    missing = []
    if not isinstance(paths, list) or not paths:
        missing.append("/opt/data/routing/fast-paths.json " + (why if data is None else "has no paths"))
    if not hook:
        missing.append("the arrival hook in /opt/data/hooks does not read fast-paths.json yet (still patch P's words)")
    if missing:
        extra = "" if board_live else "; board shows SAMPLE"
        return NOT_YET, "; ".join(missing) + extra
    words = sum(len(p.get("words") or []) for p in paths if isinstance(p, dict))
    note = f"{len(paths)} paths ({words} words) in the file, hook reads it ({hook[0]})"
    note += "; board shows them live" if board_live else "; board still shows SAMPLE (restart the ship probe)"
    return LIVE, note


def item_ship_probe(facts, now):
    running = containers(facts).get("hermes-starship-ship")
    if running is not True:
        return NOT_YET, "the ship probe (hermes-starship-ship) is not running"
    orders, why = load_json(facts, "live/orders.json")
    if orders is None:
        return NOT_YET, f"ship probe running, but live/orders.json is {why}"
    age = age_s(orders.get("asOf"), now)
    if age is None or age > SHIP_FRESH_S:
        return NOT_YET, f"orders.json last written {ago(age)} (stale)"
    env = text(facts, "ship-env.txt") or ""
    lacking = [v for v in ("FAST_PATHS", "HELM_DIR", "RECORDS_KEEP") if not re.search(rf"^{v}=", env, re.M)]
    if lacking:
        return NOT_YET, f"orders.json fresh, but the probe runs without {', '.join(lacking)}: run compose up -d ship-probe"
    records = "records.json too" if (facts / "live" / "records.json").exists() else "no records.json"
    return LIVE, f"orders.json written {ago(age)}, {records}"


ITEMS = [
    ("Patches AG, AH, AI", item_patches),
    ("apply.sh past W_b (B2-36)", item_apply_wb),
    ("Core terminal (PR #22)", item_core_terminal),
    ("Science lab meters", item_meters),
    ("Speed trial reading", item_speed_trial),
    ("Fast paths from a file (B2-35)", item_fast_paths),
    ("Ship probe feeding boards", item_ship_probe),
]


def judge(facts):
    facts = Path(facts)
    try:
        now = float((text(facts, "now") or "").strip())
    except ValueError:
        now = None
    rows = []
    for name, check in ITEMS:
        try:
            state, note = check(facts, now)
        except Exception as error:   # one odd fact must not hide the other items
            state, note = CHECK, f"could not judge: {error}"
        rows.append((name, state, note))
    return rows


def main(argv):
    if len(argv) != 2 or not Path(argv[1]).is_dir():
        print("usage: whats_live.py <facts folder>", file=sys.stderr)
        return 2
    rows = judge(argv[1])
    width = max(len(name) for name, _, _ in rows)
    for i, (name, state, note) in enumerate(rows, 1):
        print(f"{i:>2}  {name:<{width}}  {state:<7}  {note}")
    live = sum(1 for _, state, _ in rows if state == LIVE)
    print(f"\n{live} of {len(rows)} live.")
    return 0 if live == len(rows) else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
