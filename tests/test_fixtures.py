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
NAMES = ["stations", "rails", "orders", "shiplog", "ship"]


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

    def test_every_department_has_its_head(self):
        heads = {s["dept"] for s in self.stations.values() if s["head"]}
        depts = {s["dept"] for s in self.stations.values() if s["dept"]}
        self.assertEqual(depts - heads, {"command"} - heads)

    def test_synthetic_order_ids(self):
        # Fixture ORDs live in the 9000s so they never look like real orders.
        for oid in self.orders:
            self.assertTrue(oid.startswith("ORD-9"), oid)


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
