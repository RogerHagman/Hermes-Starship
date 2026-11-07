"""Tests for the ship probe. Run: python -m unittest discover -s probe"""
import json
import sqlite3
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path

import jsonschema

sys.path.insert(0, str(Path(__file__).parent))
import ship_probe  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
NOW = datetime(2026, 11, 5, 20, 0, tzinfo=timezone.utc)
HEAD = "order_id,received_at,from_surface,station,kind,status,closed_at,speed\n"


def schema(name):
    return json.loads((ROOT / "api" / "schema" / f"{name}.schema.json").read_text())


def at(text):
    """Seconds since 1970, the way Hermes' Kanban keeps its times."""
    return int(datetime.fromisoformat(text.replace("Z", "+00:00")).timestamp())


def kanban(path, rows, table="tasks", runs=(), comments=(), results=()):
    """A Kanban database with the columns of Hermes' own tables that the probe reads."""
    con = sqlite3.connect(path)
    con.execute(f"create table {table} (id text primary key, title text not null, body text, assignee text, status text not null,"
                " priority integer default 0, created_at integer not null, started_at integer, completed_at integer, last_heartbeat_at integer,"
                " result text)")
    con.execute("create table task_links (parent_id text not null, child_id text not null, primary key (parent_id, child_id))")
    con.execute("create table task_comments (id integer primary key autoincrement, task_id text not null, author text not null,"
                " body text not null, created_at integer not null)")
    con.execute("create table task_runs (id integer primary key autoincrement, task_id text not null, profile text, step_key text,"
                " status text not null, started_at integer not null, ended_at integer, outcome text, summary text, metadata text, error text)")
    con.executemany(f"insert into {table} (id, title, body, status, assignee, created_at, started_at, completed_at) values (?,?,?,?,?,?,?,?)", rows)
    con.executemany(f"update {table} set result = ? where id = ?", [(text, task) for task, text in results])
    con.executemany("insert into task_runs (task_id, profile, status, started_at, ended_at, outcome, summary, error) values (?,?,?,?,?,?,?,?)", runs)
    con.executemany("insert into task_comments (task_id, author, body, created_at) values (?,?,?,?)", comments)
    con.commit()
    con.close()


class Files(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.d = Path(self.dir.name)
        (self.d / "orders.csv").write_text(HEAD
            + "ORD-1201,2026-11-05T18:00:00Z,telegram,Number One (router),inbound-message,open,,high\n"
            + "ORD-1202,2026-11-05T18:10:00Z,desktop,Number One (router),inbound-message,done,2026-11-05T18:20:00Z,none\n"
            + "ORD-1203,2026-11-05T19:00:00Z,dashboard,Number One (router),inbound-message,open,,\n"
            + "ORD-1150,2026-11-01T09:00:00Z,desktop,Number One (router),inbound-message,open,,\n"
            + "ORD-1100,2026-10-20T10:00:00Z,telegram,Number One (router),inbound-message,done,2026-10-20T11:00:00Z,\n"
            + "ORD-1099,2026-11-05T17:00:00Z,done-when,Sensors,test,closed,2026-11-05T17:01:00Z,\n")
        (self.d / "handoff-log.csv").write_text(
            "task_id,rail,kind,sent_at,returned_at,status,failure_class,checks_passed,retries,usage_tokens,usage_cost,wall_time_s,notes\n"
            "t1,codex,code,2026-11-05T18:01:00Z,2026-11-05T18:30:00Z,accepted,,3,0,,,1740,\n")
        kanban(self.d / "kanban.db", [
            ("t_aa", "ORD-1201 · Fix the reminder time", "GOAL: Fire on time.\nDONE WHEN:\n- It fires.", "running", "forge", at("2026-11-05T18:00:05Z"), at("2026-11-05T18:01:00Z"), None),
            ("t_bb", "ORD-1201 tests for the reminder", "", "ready", "diagnostics", at("2026-11-05T18:00:06Z"), None, None),
            ("t_cc", "ORD-1202 log the meal", "", "done", "scribe", at("2026-11-05T18:10:02Z"), at("2026-11-05T18:10:05Z"), at("2026-11-05T18:20:00Z")),
        ], runs=[
            ("t_aa", "forge", "crashed", at("2026-11-05T18:01:00Z"), at("2026-11-05T18:05:00Z"), "crashed", None, "worker exited"),
            ("t_cc", "scribe", "done", at("2026-11-05T18:10:05Z"), at("2026-11-05T18:19:00Z"), "completed", "Logged: pasta, 640 kcal.", None),
        ], comments=[
            ("t_aa", "forge", "Found it: the reminder used UTC.", at("2026-11-05T18:30:00Z")),
        ], results=[("t_cc", "Logged: pasta, 640 kcal.")])
        self.env = {"ORDERS_CSV": str(self.d / "orders.csv"), "KANBAN_DB": str(self.d / "kanban.db"),
                    "HANDOFF_LOG": str(self.d / "handoff-log.csv"), "ANSWERS": str(self.d / "answers.jsonl"), "ROSTER": str(ROOT / "fixtures" / "stations.json"),
                    "OUT_DIR": str(self.d / "live")}

    def tearDown(self):
        self.dir.cleanup()

    def run_probe(self, **over):
        with tempfile.TemporaryDirectory() as scratch:
            return ship_probe.run_once({**self.env, **over}, scratch, NOW)

    def test_writes_files_the_schemas_accept(self):
        self.run_probe()
        for name in ("orders", "shiplog"):
            data = json.loads((self.d / "live" / f"{name}.json").read_text())
            self.assertIs(data["synthetic"], False)
            jsonschema.validate(data, schema(name))

    def test_an_order_takes_its_words_from_its_first_card_and_its_state_from_the_newest(self):
        orders, _ = self.run_probe()
        o = next(x for x in orders if x["id"] == "ORD-1201")
        self.assertEqual("Fix the reminder time", o["title"])
        self.assertTrue(o["body"].startswith("GOAL:"))
        self.assertEqual("eng", o["station"])        # forge is the Chief Engineer's profile
        self.assertEqual("Warp", o["speed"])          # high reasoning is the word Warp
        self.assertEqual("running", o["state"])        # one card running, one ready: running
        self.assertIn("2 cards: eng, diag", o["detail"])
        self.assertEqual("2026-11-05T18:01:00Z", o["updatedAt"])

    def test_what_came_back_is_on_the_order(self):
        orders, _ = self.run_probe()
        o = next(x for x in orders if x["id"] == "ORD-1201")
        self.assertEqual([("error", "eng", "crashed: worker exited"), ("comment", "eng", "Found it: the reminder used UTC.")],
                         [(r["kind"], r["by"], r["text"]) for r in o["replies"]])
        self.assertEqual("2026-11-05T18:05:00Z", o["replies"][0]["at"])
        # The result repeats the run's summary: it shows once, as the result.
        done = next(x for x in orders if x["id"] == "ORD-1202")
        self.assertEqual([("result", "Logged: pasta, 640 kcal.")], [(r["kind"], r["text"]) for r in done["replies"]])
        self.assertNotIn("replies", next(x for x in orders if x["id"] == "ORD-1203"))

    def test_answers_from_patch_af_show_and_keep_a_chat_order(self):
        (self.d / "answers.jsonl").write_text(
            '{"order_id": "ORD-1150", "at": "2026-11-01T09:01:00Z", "by": "default", "path": "chat", "text": "Tuesday."}\n'
            'not json\n'
            '{"order_id": "ORD-1203", "at": "2026-11-05T19:02:00Z", "by": "default", "path": "chat", "text": "Here is the list."}\n')
        orders, _ = self.run_probe()
        o = next(x for x in orders if x["id"] == "ORD-1203")
        self.assertEqual([("answer", "xo", "Here is the list.", "2026-11-05T19:02:00Z")],
                         [(r["kind"], r["by"], r["text"], r["at"]) for r in o["replies"]])
        # ORD-1150 is old and has no card, but it was answered: it stays.
        self.assertIn("ORD-1150", [x["id"] for x in orders])

    def test_old_done_orders_stale_open_ones_and_test_rows_drop_off(self):
        orders, _ = self.run_probe()
        # ORD-1100 closed weeks ago, ORD-1150 is open with no card since days, ORD-1099 is a test row.
        self.assertEqual(["ORD-1201", "ORD-1202", "ORD-1203"], sorted(o["id"] for o in orders))
        o = next(x for x in orders if x["id"] == "ORD-1203")
        self.assertEqual(("queued", "xo", "Message on dashboard"), (o["state"], o["station"], o["title"]))

    def test_the_records_keep_every_order_on_file_in_any_state(self):
        self.run_probe()
        data = json.loads((self.d / "live" / "records.json").read_text())
        self.assertIs(data["synthetic"], False)
        jsonschema.validate(data, schema("orders"))
        recs = {o["id"]: o for o in data["orders"]}
        # The old done order and the stale one with no card stay on file; the test row never does.
        self.assertEqual(["ORD-1100", "ORD-1150", "ORD-1201", "ORD-1202", "ORD-1203"], sorted(recs))
        self.assertEqual("done", recs["ORD-1100"]["state"])
        self.assertIn("No card was filed", recs["ORD-1150"]["detail"])
        # Newest first, like the boards.
        self.assertEqual("ORD-1100", data["orders"][-1]["id"])

    def test_an_order_says_when_it_opened_and_closed_where_from_and_how_many_cards(self):
        orders, _ = self.run_probe()
        o = {x["id"]: x for x in orders}
        self.assertEqual(("2026-11-05T18:00:00Z", "telegram", 2), (o["ORD-1201"]["openedAt"], o["ORD-1201"]["surface"], o["ORD-1201"]["cards"]))
        self.assertNotIn("closedAt", o["ORD-1201"])                     # still running
        self.assertEqual(("2026-11-05T18:10:00Z", "2026-11-05T18:20:00Z", 1),
                         (o["ORD-1202"]["openedAt"], o["ORD-1202"]["closedAt"], o["ORD-1202"]["cards"]))
        self.assertEqual(("dashboard", 0), (o["ORD-1203"]["surface"], o["ORD-1203"]["cards"]))   # answered in chat, or not yet

    def test_the_records_hold_at_most_records_keep(self):
        self.run_probe(RECORDS_KEEP="2")
        data = json.loads((self.d / "live" / "records.json").read_text())
        self.assertEqual(2, len(data["orders"]))

    def test_without_the_kanban_the_order_log_still_gives_every_order(self):
        orders, _ = self.run_probe(KANBAN_DB=str(self.d / "missing.db"))
        o = next(x for x in orders if x["id"] == "ORD-1201")
        self.assertEqual("queued", o["state"])
        self.assertEqual("Message on telegram", o["title"])
        self.assertEqual("xo", o["station"])             # Number One (router) is Number One

    def test_the_log_has_openings_closings_and_customs(self):
        _, entries = self.run_probe()
        kinds = [(e["kind"], e["text"]) for e in entries]
        self.assertIn(("customs", "Customs: code to codex, accepted"), kinds)
        self.assertIn(("done", "ORD-1202 done: log the meal"), kinds)
        self.assertEqual(entries, sorted(entries, key=lambda e: e["at"], reverse=True))

    def test_without_the_order_log_nothing_is_written(self):
        self.assertIsNone(self.run_probe(ORDERS_CSV=str(self.d / "missing.csv")))
        self.assertFalse((self.d / "live" / "orders.json").exists())
        self.assertFalse((self.d / "live" / "records.json").exists())

    def test_the_database_is_read_from_a_copy_and_never_changed(self):
        before = (self.d / "kanban.db").read_bytes()
        self.run_probe()
        self.assertEqual(before, (self.d / "kanban.db").read_bytes())

    def test_a_change_to_a_card_shows_on_the_next_run(self):
        with tempfile.TemporaryDirectory() as scratch:
            ship_probe.run_once(self.env, scratch, NOW)
            con = sqlite3.connect(self.d / "kanban.db")
            con.execute("update tasks set status = 'done', completed_at = ? where id = 't_aa'", (at("2026-11-05T19:30:00Z"),))
            con.execute("update tasks set status = 'done' where id = 't_bb'")
            con.commit()
            con.close()
            orders, _ = ship_probe.run_once(self.env, scratch, NOW)
        self.assertEqual("done", next(x for x in orders if x["id"] == "ORD-1201")["state"])

    def test_finds_the_card_table_whatever_it_is_called(self):
        (self.d / "kanban.db").unlink()
        kanban(self.d / "kanban.db", [("t_aa", "ORD-1201 Fix it", "", "blocked", "forge", at("2026-11-05T18:40:00Z"), None, None)], table="kanban_cards")
        orders, _ = self.run_probe()
        self.assertEqual("blocked", next(x for x in orders if x["id"] == "ORD-1201")["state"])


class Yeoman(unittest.TestCase):
    """The Yeoman's five files, with the headers they have on the NAS (07/11)."""

    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.d = Path(self.dir.name)
        y = self.d / "yeoman"
        y.mkdir()
        (y / "todos.csv").write_text(
            "id,added_at,text,due_at,source_ord,important,status\n"
            "todo-2d2891a07f,2026-10-27T19:38:33Z,ORD-1106 6f throwaway todo one,,ORD-1106-6f-test-1,,done\n"
            "todo-aa01,2026-11-04T10:00:00Z,Write the cover letter,,ORD-1232,,open\n"
            "todo-aa02,2026-11-03T10:00:00Z,\"Pay the bill, today\",2026-11-05T21:00:00Z,ORD-1230,yes,\n"
            "todo-aa03,2026-11-01T10:00:00Z,Sorted already,,ORD-1200,,done\n")
        (y / "reminders.csv").write_text(
            "id,due_at,text,source_ord,status,surface,chat_id\n"
            "rem-7cfa5416c1,2026-10-27T12:51:00Z,test,ORD-1110,cancelled,telegram,\n"
            "rem-bb01,2026-11-06T07:00:00Z,Take the bins out,ORD-1233,open,Telegram,123456789\n"
            "rem-bb02,2026-11-06T08:00:00Z,Call back,ORD-1234,snoozed,desktop,\n")
        (y / "waiting.csv").write_text(
            "id,since,what,from_whom,nudge_after,source_ord,status\n"
            "wait-cc01,2026-11-01T09:00:00Z,The refund,the shop,2026-11-04T09:00:00Z,ORD-1201,open\n")
        (y / "recurring.csv").write_text(
            "id,rule,text,next_due,source_ord,status,surface,chat_id\n"
            "rec-dd01,monthly:25,Pay the rent,2026-11-25T08:00:00Z,ORD-1202,open,telegram,123456789\n")
        (y / "done.csv").write_text(
            "id,kind,text,closed_at,how,source_ord\n"
            "todo-2d2891a07f,todos,ORD-1106 6f throwaway todo one,2026-10-27T19:40:25Z,ticked,ORD-1106-6f-test-1\n"
            "rem-ee01,reminders,Take the bins out,2026-11-05T06:00:09Z,fired,ORD-1220\n"
            "todo-aa03,todos,Sorted already,2026-11-02T10:00:00Z,ticked,ORD-1200\n")
        (y / ".timer-heartbeat").write_text("2026-11-05T19:59:30Z\n")

    def tearDown(self):
        self.dir.cleanup()

    def run_probe(self, **over):
        env = {"ORDERS_CSV": str(self.d / "missing.csv"), "YEOMAN_DIR": str(self.d / "yeoman"), "OUT_DIR": str(self.d / "live"),
               "ROSTER": str(ROOT / "fixtures" / "stations.json"), **over}
        with tempfile.TemporaryDirectory() as scratch:
            ship_probe.run_once(env, scratch, NOW)
        return json.loads((self.d / "live" / "yeoman.json").read_text())

    def test_writes_a_file_the_schema_accepts_even_without_the_order_log(self):
        data = self.run_probe()
        self.assertIs(data["synthetic"], False)
        jsonschema.validate(data, schema("yeoman"))
        self.assertEqual("2026-11-05T19:59:30Z", data["heartbeat"])

    def test_only_open_items_and_never_test_rows_or_chat_ids(self):
        data = self.run_probe()
        self.assertEqual(["todo-aa02", "todo-aa01"], [t["id"] for t in data["todos"]])   # due first, then the rest
        t = data["todos"][0]
        self.assertEqual(("Pay the bill, today", True, "2026-11-05T21:00:00Z", "ORD-1230"), (t["text"], t["important"], t["due"], t["sourceOrd"]))
        self.assertFalse(data["todos"][1]["important"])
        self.assertEqual([("rem-bb01", "open", "telegram"), ("rem-bb02", "snoozed", "desktop")],
                         [(r["id"], r["status"], r["surface"]) for r in data["reminders"]])
        self.assertEqual(("the shop", "2026-11-04T09:00:00Z"), (data["waiting"][0]["fromWhom"], data["waiting"][0]["nudgeAfter"]))
        self.assertEqual(("monthly:25", "2026-11-25T08:00:00Z"), (data["recurring"][0]["rule"], data["recurring"][0]["nextDue"]))
        self.assertNotIn("123456789", json.dumps(data))
        self.assertNotIn("throwaway", json.dumps(data))

    def test_the_done_log_is_newest_first_with_plain_kinds(self):
        data = self.run_probe()
        self.assertEqual([("rem-ee01", "reminder", "fired"), ("todo-aa03", "todo", "ticked")],
                         [(d["id"], d["kind"], d["how"]) for d in data["done"]])

    def test_without_the_folder_nothing_is_written(self):
        with tempfile.TemporaryDirectory() as scratch:
            ship_probe.run_once({"ORDERS_CSV": str(self.d / "missing.csv"), "YEOMAN_DIR": str(self.d / "nope"),
                                 "OUT_DIR": str(self.d / "live")}, scratch, NOW)
        self.assertFalse((self.d / "live" / "yeoman.json").exists())


class Helm(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.d = Path(self.dir.name)
        h = self.d / "helm"
        h.mkdir()
        (h / "job-ads.csv").write_text(
            "id,found,company,role,location,source,url,ad_file,deadline,match,match_cv,fit,status,notes\n"
            "J-9001,2026-10-30,Example Data,Support Engineer,\"Town, on site\",company site,https://example.invalid/jobs,cv/ads/example.txt,,73,example-cv,good,applying,Ask hr@example.invalid or +46 70 123 45 67\n"
            "J-9002,2026-11-01,Example Data,Network Engineer,Town,company site,,,2026-11-09,28,,no,found,\n"
            "J-9003,2026-11-01,Bad Row,Nothing,,,,,,,,,maybe,\n")
        (h / "applications.csv").write_text(
            "id,job,company,role,status,created,applied,cv,letter,match,salary_ask,contact,next_step,next_date,notes\n"
            "A-9001,J-9001,Example Data,Support Engineer,drafting,2026-11-01,,cv/example-cv.pdf,cv/letters/example.md,73,\"about 45,000 SEK/month\",hr@example.invalid,\"Proofread cv/letters/example.md, send to hr@example.invalid\",2026-11-02,Ask 45 000 kr\n")
        (h / "application-events.csv").write_text(
            "date,id,kind,text\n"
            "2026-10-30,J-9001,found,Support Engineer\n"
            "2026-10-30,J-9001,shortlisted,Top of the list\n"
            "2026-11-01,A-9001,created,Drafting\n")

    def tearDown(self):
        self.dir.cleanup()

    def run_probe(self):
        with tempfile.TemporaryDirectory() as scratch:
            ship_probe.run_once({"ORDERS_CSV": str(self.d / "missing.csv"), "HELM_DIR": str(self.d / "helm"),
                                 "OUT_DIR": str(self.d / "live")}, scratch, NOW)
        return json.loads((self.d / "live" / "helm.json").read_text())

    def test_writes_a_file_the_schema_accepts_even_without_the_order_log(self):
        data = self.run_probe()
        self.assertIs(data["synthetic"], False)
        jsonschema.validate(data, schema("helm"))
        self.assertEqual(["J-9002", "J-9001"], [a["id"] for a in data["ads"]])   # newest found first; the bad row is left out
        self.assertEqual(("drafting", "2026-11-02", 73), (data["applications"][0]["status"], data["applications"][0]["nextDate"], data["applications"][0]["match"]))
        self.assertEqual(["A-9001", "J-9001", "J-9001"], [e["id"] for e in data["events"]])
        self.assertEqual("shortlisted", data["events"][1]["kind"])   # same day: the later line first

    def test_never_copies_contact_details_salary_links_or_file_paths(self):
        text = json.dumps(self.run_probe(), ensure_ascii=False)
        for gone in ("hr@example.invalid", "123 45 67", "45,000", "45 000", "SEK", "example.invalid/jobs", "cv/ads", "cv/letters", "example-cv"):
            self.assertNotIn(gone, text)
        self.assertIn("Proofread [file], send to [contact]", text)

    def test_without_the_folder_nothing_is_written(self):
        with tempfile.TemporaryDirectory() as scratch:
            ship_probe.run_once({"ORDERS_CSV": str(self.d / "missing.csv"), "HELM_DIR": str(self.d / "nope"),
                                 "OUT_DIR": str(self.d / "live")}, scratch, NOW)
        self.assertFalse((self.d / "live" / "helm.json").exists())


class FastPaths(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.d = Path(self.dir.name)

    def tearDown(self):
        self.dir.cleanup()

    def run_probe(self, text):
        (self.d / "fast-paths.json").write_text(text)
        with tempfile.TemporaryDirectory() as scratch:
            ship_probe.run_once({"ORDERS_CSV": str(self.d / "missing.csv"), "FAST_PATHS": str(self.d / "fast-paths.json"),
                                 "OUT_DIR": str(self.d / "live")}, scratch, NOW)
        out = self.d / "live" / "fastpaths.json"
        return json.loads(out.read_text()) if out.exists() else None

    def test_copies_the_fast_paths_in_the_schema_shape(self):
        data = self.run_probe(json.dumps({"paths": [
            {"words": ["Remind"], "profile": "yeoman", "patch": "P", "example": "remind me at 21:00", "owner": "forge"},
            {"words": ["todo", "todo!", "todo"], "profile": "yeoman", "patch": "P"},
            {"words": "log meal", "profile": "scribe"},
        ]}))
        jsonschema.validate(data, schema("fastpaths"))
        self.assertIs(data["synthetic"], False)
        self.assertEqual([["remind"], ["todo", "todo!"], ["log meal"]], [p["words"] for p in data["paths"]])
        self.assertNotIn("owner", data["paths"][0])   # only the known fields are copied

    def test_leaves_out_entries_that_do_not_fit(self):
        data = self.run_probe(json.dumps({"paths": [
            {"words": ["ok"], "profile": "yeoman"}, {"words": [], "profile": "yeoman"}, {"words": ["x"], "profile": "Not A Profile"},
            {"profile": "yeoman"}, "junk", {"words": ["<script>"], "profile": "yeoman"},
        ]}))
        self.assertEqual([["ok"]], [p["words"] for p in data["paths"]])

    def test_a_missing_or_broken_file_writes_nothing(self):
        self.assertIsNone(self.run_probe("{not json"))
        with tempfile.TemporaryDirectory() as scratch:
            ship_probe.run_once({"ORDERS_CSV": str(self.d / "missing.csv"), "FAST_PATHS": str(self.d / "nope.json"),
                                 "OUT_DIR": str(self.d / "live2")}, scratch, NOW)
        self.assertFalse((self.d / "live2" / "fastpaths.json").exists())


class States(unittest.TestCase):
    def test_words_map_to_the_boards_states(self):
        s = ship_probe.order_state
        self.assertEqual("running", s("running"))
        self.assertEqual("running", s("in_progress"))
        self.assertEqual("queued", s("ready"))
        self.assertEqual("done", s("done"))
        self.assertEqual("blocked", s("failed"))
        self.assertEqual("review", s("in review"))
        self.assertEqual("awaiting-captain", s("awaiting-captain"))
        self.assertEqual("queued", s("open"))          # orders.csv
        self.assertEqual("done", s("closed"))
        self.assertEqual("running", s("", "running"))   # the card first, then the order log
        self.assertEqual("queued", s(None, None))

    def test_speed_from_a_level_or_the_word(self):
        self.assertEqual(["Warp", "Warp", "Warp 9", "Maximum Warp", "Full Impulse", None, None],
                         [ship_probe.speed_of(v) for v in ("high", " Warp ", "warp  9", "MAX", "full_impulse", "", "fast")])

    def test_times_in_text_or_seconds(self):
        self.assertEqual(datetime(2026, 11, 5, 18, 0, tzinfo=timezone.utc), ship_probe.parse_time("2026-11-05T18:00:00Z"))
        self.assertEqual(datetime(2026, 11, 5, 18, 0, tzinfo=timezone.utc), ship_probe.parse_time(str(int(datetime(2026, 11, 5, 18, 0, tzinfo=timezone.utc).timestamp()))))
        self.assertIsNone(ship_probe.parse_time("soon"))


class NoModelNoNetwork(unittest.TestCase):
    def test_the_probe_opens_no_connection(self):
        text = (Path(__file__).parent / "ship_probe.py").read_text()
        for word in ("urlopen", "socket", "http", "requests"):
            self.assertNotIn(word, text.replace("https://", ""), word)


if __name__ == "__main__":
    unittest.main()
