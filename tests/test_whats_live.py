"""The what's-live check: the judge on made-up facts, and the shell script end to end with a
pretend docker, so it is proven without a NAS."""
import json
import os
import stat
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "deploy"))
import whats_live  # noqa: E402

NOW = 1794063600  # 2026-11-07 15:00 UTC
STAMP = "2026-11-07T14:59:00Z"
OLD = "2026-11-06T09:00:00Z"


def write(folder, name, content):
    path = Path(folder) / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content if isinstance(content, str) else json.dumps(content), encoding="utf-8")


def all_live(folder):
    write(folder, "now", str(NOW))
    write(folder, "containers.txt", "hermes true\nhermes-starship true\nhermes-starship-ship true\nhermes-starship-meters true\n")
    write(folder, "check.txt", "A: OK\nW_b: OK\nAH: OK\nAI: OK\nOK through AI\n")
    write(folder, "apply-fix", "applied\n")
    write(folder, "fast-paths.json", {"paths": [{"words": ["remind"], "profile": "yeoman"},
                                                {"words": ["todo", "todo!"], "profile": "yeoman"}]})
    write(folder, "hook-grep.txt", "/opt/hermes/gateway/arrival.py\n")
    write(folder, "ship-env.txt", "FAST_PATHS=/hermes/routing/fast-paths.json\nHELM_DIR=/x\nRECORDS_KEEP=1000\n")
    write(folder, "__version__.py", '__version__ = "0.2.10"\n')
    write(folder, "dist.txt", "frontend/dist/assets/index.js\n")
    write(folder, "live/orders.json", {"asOf": STAMP, "synthetic": False})
    write(folder, "live/records.json", {"asOf": STAMP})
    write(folder, "live/fastpaths.json", {"asOf": STAMP, "synthetic": False, "paths": []})
    write(folder, "live/meters.json", {"asOf": STAMP, "synthetic": False,
                                       "sources": {"trials": {"state": "read"}},
                                       "trials": [{"id": "SPD-1", "at": "2026-11-07T12:00:00Z"}]})


def states(folder):
    return {name: (state, note) for name, state, note in whats_live.judge(folder)}


class Judge(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.f = Path(self.dir.name)
        all_live(self.f)

    def tearDown(self):
        self.dir.cleanup()

    def test_everything_live(self):
        got = states(self.f)
        self.assertEqual({s for s, _ in got.values()}, {"LIVE"}, got)

    def test_patch_order(self):
        self.assertLess(whats_live.patch_key("Z"), whats_live.patch_key("AA"))
        self.assertLess(whats_live.patch_key("AH"), whats_live.patch_key("AI"))
        self.assertEqual(whats_live.patch_key("W_b"), whats_live.patch_key("W"))
        self.assertEqual(whats_live.patch_key("AD2"), whats_live.patch_key("AD"))

    def test_patches_behind(self):
        write(self.f, "check.txt", "AI: MISSING\nOK through AH\n")
        state, note = states(self.f)["Patches AG, AH, AI"]
        self.assertEqual(state, "NOT YET")
        self.assertIn("AI MISSING", note)

    def test_later_patch_counts(self):
        write(self.f, "check.txt", "OK through AJ\n")
        self.assertEqual(states(self.f)["Patches AG, AH, AI"][0], "LIVE")

    def test_no_check_output(self):
        (self.f / "check.txt").unlink()
        self.assertEqual(states(self.f)["Patches AG, AH, AI"][0], "CHECK")

    def test_apply_wb_not_done(self):
        (self.f / "apply-fix").unlink()
        self.assertEqual(states(self.f)["apply.sh past W_b (B2-36)"][0], "NOT YET")

    def test_apply_wb_built_not_applied(self):
        write(self.f, "apply-fix", "built\n")
        state, note = states(self.f)["apply.sh past W_b (B2-36)"]
        self.assertEqual(state, "NOT YET")
        self.assertIn("not applied", note)

    def test_old_version(self):
        write(self.f, "__version__.py", '__version__ = "0.2.8"\n')
        state, note = states(self.f)["Core terminal (PR #22)"]
        self.assertEqual(state, "NOT YET")
        self.assertIn("v0.2.8", note)

    def test_meters_not_running(self):
        write(self.f, "containers.txt", "hermes true\nhermes-starship true\nhermes-starship-ship true\nhermes-starship-meters missing\n")
        self.assertEqual(states(self.f)["Science lab meters"][0], "NOT YET")

    def test_meters_stale(self):
        write(self.f, "live/meters.json", {"asOf": OLD, "synthetic": False, "trials": []})
        self.assertEqual(states(self.f)["Science lab meters"][0], "NOT YET")
        self.assertEqual(states(self.f)["Speed trial reading"][0], "NOT YET")

    def test_trial_from_raw_file(self):
        write(self.f, "live/meters.json", {"asOf": STAMP, "synthetic": False, "trials": []})
        write(self.f, "speed-trials.json", {"trials": [{"id": "SPD-1", "at": "2026-11-07T10:00:00Z"}]})
        state, note = states(self.f)["Speed trial reading"]
        self.assertEqual(state, "LIVE")
        self.assertIn("1 trial on file", note)

    def test_fast_paths_hook_not_reading(self):
        write(self.f, "hook-grep.txt", "")
        state, note = states(self.f)["Fast paths from a file (B2-35)"]
        self.assertEqual(state, "NOT YET")
        self.assertIn("patch P", note)

    def test_fast_paths_file_missing(self):
        (self.f / "fast-paths.json").unlink()
        self.assertEqual(states(self.f)["Fast paths from a file (B2-35)"][0], "NOT YET")

    def test_fast_paths_broken_json(self):
        write(self.f, "fast-paths.json", "{not json")
        self.assertIn("not valid JSON", states(self.f)["Fast paths from a file (B2-35)"][1])

    def test_ship_probe_old_settings(self):
        write(self.f, "ship-env.txt", "ORDERS_CSV=/x\n")
        state, note = states(self.f)["Ship probe feeding boards"]
        self.assertEqual(state, "NOT YET")
        self.assertIn("FAST_PATHS", note)

    def test_ship_probe_stale(self):
        write(self.f, "live/orders.json", {"asOf": OLD})
        self.assertEqual(states(self.f)["Ship probe feeding boards"][0], "NOT YET")

    def test_exit_codes(self):
        self.assertEqual(whats_live.main(["x", str(self.f)]), 0)
        (self.f / "live" / "meters.json").unlink()
        self.assertEqual(whats_live.main(["x", str(self.f)]), 1)
        self.assertEqual(whats_live.main(["x", str(self.f / "nope")]), 2)


FAKE_DOCKER = r"""#!/bin/sh
# A pretend docker for the test: answers like a NAS where everything but B2-35 is live.
case "$1" in
  inspect)
    case "$*" in
      *Config.Env*) printf 'FAST_PATHS=/hermes/routing/fast-paths.json\nHELM_DIR=/x\nRECORDS_KEEP=1000\n' ;;
      *) echo true ;;
    esac ;;
  exec)
    case "$*" in
      *check.sh*) printf 'AI: OK\nOK through AI\n' ;;
      *"test -f"*) exit 0 ;;
      *patch_B235*) exit 0 ;;
      *fast-paths.json*) exit 1 ;;
      *grep\ -rl*) exit 1 ;;
    esac ;;
  *) echo "unexpected docker $*" >&2; exit 9 ;;
esac
"""


class Script(unittest.TestCase):
    def test_end_to_end(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp = Path(tmp)
            docker = tmp / "docker"
            docker.write_text(FAKE_DOCKER)
            docker.chmod(docker.stat().st_mode | stat.S_IXUSR)
            ship = tmp / "starship"
            (ship / "deploy" / "live").mkdir(parents=True)
            (ship / "frontend" / "dist" / "assets").mkdir(parents=True)
            (ship / "__version__.py").write_text('__version__ = "0.2.10"\n')
            (ship / "frontend" / "dist" / "assets" / "i.js").write_text('k="hermes.coreTerminal"')
            from datetime import datetime, UTC
            now = datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")
            write(ship, "deploy/live/orders.json", {"asOf": now, "synthetic": False})
            write(ship, "deploy/live/meters.json", {"asOf": now, "synthetic": False,
                                                    "trials": [{"id": "SPD-1", "at": now}]})
            env = dict(os.environ, DOCKER=str(docker), STARSHIP_DIR=str(ship), TMPDIR=str(tmp))
            run = subprocess.run(["sh", str(ROOT / "deploy" / "whats-live.sh")], env=env,
                                 capture_output=True, text=True, timeout=60)
            self.assertEqual(run.returncode, 1, run.stdout + run.stderr)
            self.assertIn("6 of 7 live.", run.stdout)
            self.assertRegex(run.stdout, r"Fast paths from a file \(B2-35\)\s+NOT YET")
            self.assertEqual([p.name for p in tmp.iterdir() if p.name.startswith("whats-live.")], [],
                             "the facts folder is cleaned up")


if __name__ == "__main__":
    unittest.main()
