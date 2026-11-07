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
NAMES = ["stations", "rails", "orders", "shiplog", "ship", "quarters", "raillog", "sensors", "engineering", "science", "ops", "nas", "yeoman",
         "helm", "nav", "viewscreen", "fastpaths"]


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


class EngineeringAgree(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.e = load(FIX / "engineering.json")
        cls.orders = {o["id"]: o for o in load(FIX / "orders.json")["orders"]}

    def test_patch_ids_unique_and_samples_in_the_900s(self):
        ids = [p["id"] for p in self.e["patches"]]
        self.assertEqual(len(ids), len(set(ids)))
        for i in ids:
            self.assertRegex(i, r"-9\d\d$")

    def test_patches_point_at_engineering_orders(self):
        for p in self.e["patches"]:
            for o in p.get("orders", []):
                self.assertIn(o, self.orders)
                self.assertIn(self.orders[o]["station"], {"eng", "sys", "diag"}, o)
            if "checks" in p:
                self.assertLessEqual(p["checks"]["passed"], p["checks"]["total"])
        self.assertLessEqual(self.e["check"]["present"], self.e["check"]["total"])

    def test_commands_are_docker_commands_on_the_nas(self):
        # Manual steps are given as docker commands the Captain runs; nothing is applied live.
        for c in self.e["commands"]:
            self.assertRegex(c["cmd"], r"^sudo docker (exec|restart) ")


class ScienceAgree(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.s = load(FIX / "science.json")
        cls.runs = {r["id"]: r for r in cls.s["runs"]}
        cls.models = {m["id"] for m in cls.s["models"]}
        cls.sets = {d["id"] for d in cls.s["datasets"]}

    def test_ids_unique_and_samples_in_the_900s(self):
        for key in ("models", "evals", "serving", "datasets", "runs", "study"):
            ids = [x["id"] for x in self.s[key]]
            self.assertEqual(len(ids), len(set(ids)), key)
            for i in ids:
                self.assertRegex(i, r"-9\d\d$")

    def test_every_number_has_its_run(self):
        suites = {x["id"] for x in self.s["suites"]}
        for x in self.s["suites"]:
            self.assertIn(x["dataset"], self.sets)
        for e in self.s["evals"]:
            self.assertIn(e["run"], self.runs, e["id"])
            self.assertEqual(self.runs[e["run"]].get("model"), e["model"], e["id"])
            self.assertIn(e["model"], self.models)
            self.assertIn(e["suite"], suites)
        for x in self.s["models"] + self.s["serving"] + [d for d in self.s["datasets"] if "run" in d]:
            self.assertIn(x["run"], self.runs, x["id"])
        for v in self.s["serving"]:
            self.assertIn(v["model"], self.models)
            # A failed serve has no speed to show; the others do.
            self.assertEqual("tokensPerSec" in v, v["state"] != "failed", v["id"])
            self.assertEqual(self.runs[v["run"]]["ok"], v["state"] != "failed", v["id"])
        for r in self.s["runs"]:
            if "model" in r:
                self.assertIn(r["model"], self.models)
            if "dataset" in r:
                self.assertIn(r["dataset"], self.sets)
        for t in self.s["study"]:
            for lesson in t["lessons"]:
                if "run" in lesson:
                    self.assertIn(lesson["run"], self.runs)


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
            # Timestamps and dates are expected; drop them so they don't read as phone numbers.
            text = re.sub(r"\d{4}-\d\d-\d\d(T\d\d:\d\d:\d\dZ)?", "", path.read_text(encoding="utf-8"))
            for label, pattern in self.PATTERNS.items():
                with self.subTest(file=path.name, pattern=label):
                    self.assertIsNone(re.search(pattern, text), f"{label} in {path.name}")

class OpsAgree(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.o = load(FIX / "ops.json")
        cls.hosts = {h["id"] for h in cls.o["hosts"]}
        cls.stations = {s["id"] for s in load(FIX / "stations.json")["stations"]}
        cls.orders = {o["id"] for o in load(FIX / "orders.json")["orders"]}

    def test_ids_unique_and_samples_in_the_900s(self):
        for key in ("disks", "jobs", "backups", "cautions"):
            ids = [x["id"] for x in self.o[key]]
            self.assertEqual(len(ids), len(set(ids)), key)
            for i in ids:
                self.assertRegex(i, r"-9\d\d$")

    def test_everything_sits_on_a_known_host(self):
        things = self.o["containers"] + self.o["disks"] + self.o["network"]["ports"] + [self.o["gpu"]]
        for x in things:
            self.assertIn(x["host"], self.hosts, x)
        for d in self.o["network"]["devices"]:
            if "host" in d:
                self.assertIn(d["host"], self.hosts)
        for d in self.o["disks"]:
            self.assertLessEqual(d["usedGb"], d["totalGb"], d["id"])

    def test_jobs_point_at_stations_orders_and_backups(self):
        backups = {b["id"] for b in self.o["backups"]}
        for j in self.o["jobs"]:
            self.assertIn(j["owner"], self.stations, j["id"])
            if "order" in j:
                self.assertIn(j["order"], self.orders)
            if "backup" in j:
                self.assertIn(j["backup"], backups)

    def test_no_lan_addresses_in_the_sample(self):
        # Ops knows the network, but addresses stay out of the repo.
        text = (FIX / "ops.json").read_text()
        self.assertNotRegex(text, r"\b(10|172|192)\.\d+\.\d+\.\d+\b")


class YeomanAgree(unittest.TestCase):
    """The Yeoman's sample list: ids that never look real, and sample orders only."""

    @classmethod
    def setUpClass(cls):
        cls.y = load(FIX / "yeoman.json")

    def test_ids_unique_and_in_the_900s(self):
        ids = [x["id"] for key in ("todos", "reminders", "waiting", "recurring", "done") for x in self.y[key]]
        self.assertEqual(len(ids), len(set(ids)))
        for i in ids:
            with self.subTest(id=i):
                self.assertRegex(i, r"-9\d\d$")

    def test_source_orders_are_samples(self):
        for key in ("todos", "reminders", "waiting", "recurring", "done"):
            for x in self.y[key]:
                if "sourceOrd" in x:
                    with self.subTest(id=x["id"]):
                        self.assertTrue(x["sourceOrd"].startswith("ORD-9"))


if __name__ == "__main__":
    unittest.main()


class BridgePostsAgree(unittest.TestCase):
    """Helm, Navigation and the Viewscreen samples: ids that never look real, and links that point somewhere."""

    @classmethod
    def setUpClass(cls):
        cls.helm = load(FIX / "helm.json")
        cls.nav = load(FIX / "nav.json")
        cls.vs = load(FIX / "viewscreen.json")
        cls.orders = {o["id"] for o in load(FIX / "orders.json")["orders"]}

    def test_helm_ids_live_in_the_9000s_and_point_at_real_ads(self):
        ads = {a["id"] for a in self.helm["ads"]}
        apps = {a["id"] for a in self.helm["applications"]}
        for i in ads | apps:
            self.assertRegex(i, r"^[JA]-9\d{3}$")
        self.assertEqual(len(ads), len(self.helm["ads"]))
        for a in self.helm["applications"]:
            self.assertIn(a["job"], ads, a["id"])
            if a["status"] in ("applied", "interview", "offer", "rejected", "ghosted"):
                self.assertIn("applied", a, a["id"])
        for e in self.helm["events"]:
            self.assertIn(e["id"], ads | apps, e)

    def test_nav_and_viewscreen_ids_and_orders(self):
        for key in ("events", "trips", "bookings"):
            ids = [x["id"] for x in self.nav[key]]
            self.assertEqual(len(ids), len(set(ids)), key)
            for x in self.nav[key]:
                self.assertRegex(x["id"], r"-9\d\d$")
                if "sourceOrd" in x:
                    self.assertIn(x["sourceOrd"], self.orders)
        for s in self.vs["sessions"]:
            self.assertRegex(s["id"], r"^vs-9\d\d$")
            if "sourceOrd" in s:
                self.assertIn(s["sourceOrd"], self.orders)
            times = [a["at"] for a in s["actions"]]
            self.assertEqual(times, sorted(times), s["id"])
            self.assertTrue(all(t >= s["start"] for t in times), s["id"])
