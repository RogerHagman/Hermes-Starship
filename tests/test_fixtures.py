"""Fixtures match the schema, refer to each other correctly, and hold no real data.

Run from the repo root:  python3 -m unittest discover -s tests -v
Needs: pip install jsonschema
"""
import json
import re
import unittest
from pathlib import Path

import jsonschema

ROOT = Path(__file__).resolve().parent.parent
FIX = ROOT / "fixtures"
SCHEMA = ROOT / "api" / "schema"
NAMES = ["stations", "rails", "orders", "shiplog", "ship", "quarters", "raillog", "sensors"]


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


class FixturesMatchSchema(unittest.TestCase):
    def test_every_fixture_has_a_schema_and_validates(self):
        checker = jsonschema.Draft202012Validator
        for name in NAMES:
            with self.subTest(fixture=name):
                schema = load(SCHEMA / f"{name}.schema.json")
                checker.check_schema(schema)
                checker(schema, format_checker=checker.FORMAT_CHECKER).validate(load(FIX / f"{name}.json"))

    def test_no_stray_files(self):
        self.assertEqual(sorted(p.stem for p in FIX.glob("*.json")), sorted(NAMES))
        self.assertEqual(sorted(p.name.split(".")[0] for p in SCHEMA.glob("*.schema.json")), sorted(NAMES))

    def test_every_fixture_is_marked_synthetic(self):
        for name in NAMES:
            with self.subTest(fixture=name):
                self.assertIs(load(FIX / f"{name}.json")["synthetic"], True)


class FixturesAgree(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.stations = {s["id"]: s for s in load(FIX / "stations.json")["stations"]}
        cls.orders = {o["id"]: o for o in load(FIX / "orders.json")["orders"]}

    def test_station_ids_unique(self):
        ids = [s["id"] for s in load(FIX / "stations.json")["stations"]]
        self.assertEqual(len(ids), len(set(ids)))

    def test_orders_point_at_real_stations(self):
        for order in self.orders.values():
            with self.subTest(order=order["id"]):
                self.assertIn(order["station"], self.stations)
                if "parent" in order:
                    self.assertIn(order["parent"], self.orders)

    def test_active_orders_exist_and_belong_to_that_station(self):
        for sid, st in self.stations.items():
            if st["activeOrder"]:
                with self.subTest(station=sid):
                    self.assertIn(st["activeOrder"], self.orders)
                    self.assertEqual(self.orders[st["activeOrder"]]["station"], sid)

    def test_log_points_at_real_stations(self):
        for entry in load(FIX / "shiplog.json")["entries"]:
            self.assertIn(entry["station"], self.stations)

    def test_duty_and_briefing_lines(self):
        # Duty lines say which way the crew member went; a briefing names who sat at the table.
        for entry in load(FIX / "shiplog.json")["entries"]:
            with self.subTest(entry=entry["at"] + " " + entry["station"]):
                if entry["kind"] == "duty":
                    self.assertIn(entry.get("dir"), ("out", "in"))
                    self.assertEqual(self.stations[entry["station"]]["kind"], "station")
                if entry["kind"] == "briefing":
                    self.assertEqual(entry["station"], "lounge")
                    for sid in entry["attendees"]:
                        self.assertIn(sid, self.stations)
                    self.assertGreater(entry["ends"], entry["at"])
                else:
                    self.assertNotIn("attendees", entry)

    def test_every_department_has_its_head(self):
        heads = {s["dept"] for s in self.stations.values() if s["head"]}
        depts = {s["dept"] for s in self.stations.values() if s["dept"]}
        self.assertEqual(depts - heads, {"command"} - heads)

    def test_synthetic_order_ids(self):
        # Fixture ORDs live in the 9000s so they never look like real orders.
        for oid in self.orders:
            self.assertTrue(oid.startswith("ORD-9"), oid)


class QuartersAgree(unittest.TestCase):
    """The Captain's Quarters board: campaigns, missions and the orders that serve them."""

    @classmethod
    def setUpClass(cls):
        cls.q = load(FIX / "quarters.json")
        cls.stations = {s["id"] for s in load(FIX / "stations.json")["stations"]}
        cls.orders = load(FIX / "orders.json")["orders"]
        cls.campaigns = {c["id"] for c in cls.q["campaigns"]}
        cls.missions = {m["id"] for m in cls.q["missions"]}

    def test_ids_unique(self):
        for key in ("campaigns", "missions", "yeoman"):
            ids = [x["id"] for x in self.q[key]]
            with self.subTest(list=key):
                self.assertEqual(len(ids), len(set(ids)))

    def test_missions_point_at_real_campaigns_and_stations(self):
        for m in self.q["missions"]:
            with self.subTest(mission=m["id"]):
                if "campaign" in m:
                    self.assertIn(m["campaign"], self.campaigns)
                for sid in m["stations"]:
                    self.assertIn(sid, self.stations)

    def test_orders_point_at_real_missions(self):
        for o in self.orders:
            if "mission" in o:
                with self.subTest(order=o["id"]):
                    self.assertIn(o["mission"], self.missions)

    def test_sample_ids_live_in_the_900s(self):
        # Like the ORDs, sample campaigns, missions and Yeoman items never look like real ones.
        for key in ("campaigns", "missions", "yeoman"):
            for x in self.q[key]:
                with self.subTest(id=x["id"]):
                    self.assertRegex(x["id"], r"-9\d\d$")

    def test_reading_adds_up(self):
        r = self.q["reading"]
        self.assertLessEqual(r["read"], r["goal"])
        reading = next(c for c in self.q["campaigns"] if c["name"] == "Reading")
        self.assertEqual(reading["percent"], round(100 * r["read"] / r["goal"]))


class SensorsAgree(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.s = load(FIX / "sensors.json")
        cls.stations = {s["id"] for s in load(FIX / "stations.json")["stations"]}
        cls.orders = {o["id"] for o in load(FIX / "orders.json")["orders"]}

    def test_ids_unique_and_samples_in_the_900s(self):
        for key in ("watches", "findings", "asks", "quarantine"):
            ids = [x["id"] for x in self.s[key]]
            self.assertEqual(len(ids), len(set(ids)), key)
            for i in ids:
                self.assertRegex(i, r"-9\d\d$")

    def test_everything_points_at_real_watches_stations_and_orders(self):
        watches = {w["id"] for w in self.s["watches"]}
        for w in self.s["watches"]:
            self.assertIn(w["forStation"], self.stations)
            self.assertLess(w["lastScan"], w["nextScan"])
            if "order" in w:
                self.assertIn(w["order"], self.orders)
        for x in self.s["findings"] + self.s["quarantine"]:
            self.assertIn(x["watch"], watches)
        for a in self.s["asks"]:
            if "order" in a:
                self.assertIn(a["order"], self.orders)
            # A changed ask shows what was passed on instead.
            self.assertEqual(a["unchanged"], "passed" not in a, a["id"])


class NoRealData(unittest.TestCase):
    PATTERNS = {
        "email": r"[\w.+-]+@[\w-]+\.[\w.]+",
        "phone": r"\+?\d[\d \-]{8,}\d",
        "personnummer": r"\b\d{6,8}[-+]\d{4}\b",
        "ip address": r"\b\d{1,3}(\.\d{1,3}){3}\b",
        "key-like token": r"\b(sk|ghp|gho|xox[bp])[-_][A-Za-z0-9]{10,}",
    }

    def test_fixtures_hold_no_personal_or_secret_patterns(self):
        for path in FIX.glob("*.json"):
            # Timestamps are expected; drop them so they don't read as phone numbers.
            text = re.sub(r"\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ", "", path.read_text(encoding="utf-8"))
            for label, pattern in self.PATTERNS.items():
                with self.subTest(file=path.name, pattern=label):
                    self.assertIsNone(re.search(pattern, text), f"{label} in {path.name}")


if __name__ == "__main__":
    unittest.main()
