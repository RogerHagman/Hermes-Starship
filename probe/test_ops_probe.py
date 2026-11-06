"""Tests for the Ops probe. Run: python -m unittest discover -s probe"""
import json
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

import jsonschema

sys.path.insert(0, str(Path(__file__).parent))
import ops_probe  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
NOW = datetime(2026, 11, 6, 13, 0, tzinfo=timezone.utc)
MEMINFO = """MemTotal:        7864320 kB
MemFree:          512000 kB
MemAvailable:    2621440 kB
Buffers:          100000 kB
Cached:          1500000 kB
SwapTotal:       4194304 kB
SwapFree:        3145728 kB
"""


class OpsProbe(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.d = Path(self.tmp.name)
        proc = self.d / "proc"
        proc.mkdir()
        (proc / "meminfo").write_text(MEMINFO)
        (proc / "uptime").write_text("1137600.50 4000000.00\n")
        (proc / "stat").write_text("cpu  100 0 100 800 0 0 0 0 0 0\ncpu0 1 2 3 4\n")
        zone = self.d / "sys" / "class" / "thermal" / "thermal_zone0"
        zone.mkdir(parents=True)
        (zone / "temp").write_text("47000\n")
        hw = self.d / "sys" / "class" / "hwmon" / "hwmon0"
        hw.mkdir(parents=True)
        (hw / "temp1_input").write_text("-273000\n")   # an unset sensor: ignored
        self.disk = self.d / "disk"
        self.disk.mkdir()
        self.env = {
            "PROC": str(proc), "SYS": str(self.d / "sys"), "OUT_DIR": str(self.d / "live"), "SCRATCH": str(self.d / "scratch"),
            "DISKS": f"{self.disk}|DK-901|NAS data|/DATA; /nowhere|DK-902|Backup disk|/media/backup; bad entry",
        }

    def tearDown(self):
        self.tmp.cleanup()

    def run_probe(self, now=NOW, state=None):
        return ops_probe.run_once(self.env, state if state is not None else {}, now)

    def test_writes_a_file_the_schema_accepts(self):
        self.run_probe()
        data = json.loads((self.d / "live" / "nas.json").read_text())
        self.assertIs(data["synthetic"], False)
        jsonschema.validate(data, json.loads((ROOT / "api" / "schema" / "nas.schema.json").read_text()))

    def test_reads_memory_swap_uptime_and_temperature(self):
        host = self.run_probe()["hosts"][0]
        self.assertEqual(host["id"], "nas")
        self.assertEqual(host["state"], "ok")
        self.assertEqual(host["ram"], {"usedGb": 5.0, "totalGb": 7.5})   # total minus available
        self.assertEqual(host["swap"], {"usedGb": 1.0, "totalGb": 4.0})
        self.assertEqual(host["uptimeH"], 316)
        self.assertEqual(host["tempC"], 47)
        self.assertNotIn("cpuPct", host)   # no earlier reading to compare with

    def test_cpu_is_measured_between_two_readings(self):
        state = {}
        self.run_probe(state=state)
        (self.d / "proc" / "stat").write_text("cpu  150 0 150 900 0 0 0 0 0 0\n")
        host = self.run_probe(state=state)["hosts"][0]
        self.assertEqual(host["cpuPct"], 50)

    def test_only_readable_well_formed_disks_are_listed(self):
        disks = self.run_probe()["disks"]
        self.assertEqual([d["id"] for d in disks], ["DK-901"])
        self.assertEqual((disks[0]["label"], disks[0]["mount"], disks[0]["host"]), ("NAS data", "/DATA", "nas"))
        self.assertGreater(disks[0]["totalGb"], 0)
        self.assertNotIn("perDayGb", disks[0])   # no day of history yet

    def test_fill_rate_comes_from_its_own_history(self):
        history = {"DK-901": [[ops_probe.utc_stamp(NOW - timedelta(days=4)), 0.0]]}
        (self.d / "scratch").mkdir()
        (self.d / "scratch" / "nas-disks.json").write_text(json.dumps(history))
        disk = self.run_probe()["disks"][0]
        self.assertAlmostEqual(disk["perDayGb"], round(disk["usedGb"] / 4, 1))
        kept = json.loads((self.d / "scratch" / "nas-disks.json").read_text())["DK-901"]
        self.assertEqual(len(kept), 2)
        self.run_probe(NOW + timedelta(hours=2))   # same day: no second point
        self.assertEqual(len(json.loads((self.d / "scratch" / "nas-disks.json").read_text())["DK-901"]), 2)
        self.run_probe(NOW + timedelta(days=6))   # the 4-day-old point is now over 8 days old
        kept = json.loads((self.d / "scratch" / "nas-disks.json").read_text())["DK-901"]
        self.assertEqual(len(kept), 2)
        self.assertTrue(kept[0][0].startswith("2026-11-06"))

    def test_without_proc_the_host_has_no_reading(self):
        self.env["PROC"] = str(self.d / "missing")
        host = self.run_probe()["hosts"][0]
        self.assertEqual(host["state"], "unknown")
        self.assertNotIn("ram", host)

    def test_the_probe_only_reads_and_opens_no_connection(self):
        text = (Path(__file__).parent / "ops_probe.py").read_text()
        for word in ("urlopen", "socket", "http", "requests", "subprocess", "docker", "listdir", "scandir", "walk("):
            self.assertNotIn(word, text, word)


if __name__ == "__main__":
    unittest.main()
