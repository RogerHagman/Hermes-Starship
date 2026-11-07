"""Tests for the meter probe and the speed trial. Run: python -m unittest discover -s probe"""
import hashlib
import json
import os
import sqlite3
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path

import jsonschema

sys.path.insert(0, str(Path(__file__).parent))
import meter_probe  # noqa: E402
import speed_trial  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
NOW = datetime(2026, 11, 7, 10, 0, tzinfo=timezone.utc)   # a Saturday, 11:00 in Stockholm
SCHEMA = json.loads((ROOT / "api" / "schema" / "meters.schema.json").read_text())


def ts(text):
    return datetime.fromisoformat(text.replace("Z", "+00:00")).timestamp()


def state_db(path, rows, extra_columns=True):
    """A state.db with the columns of Hermes' sessions table, plus the text the probe must never read."""
    path.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(path)
    con.execute("pragma journal_mode=wal")
    cost = ", estimated_cost_usd real, actual_cost_usd real, api_call_count integer" if extra_columns else ""
    con.execute("create table sessions (id text primary key, source text, model text, system_prompt text, title text,"
                " billing_provider text, started_at real, input_tokens integer, output_tokens integer,"
                f" cache_read_tokens integer, reasoning_tokens integer{cost})")
    con.execute("create table messages (id integer primary key, session_id text, content text)")
    for r in rows:
        keys = ", ".join(r)
        con.execute(f"insert into sessions ({keys}) values ({', '.join('?' * len(r))})", list(r.values()))
    con.execute("insert into messages (session_id, content) values ('s1', 'SECRET MESSAGE TEXT')")
    con.commit()
    con.execute("pragma wal_checkpoint(truncate)")
    con.close()


def fixture_env(tmp):
    hermes = Path(tmp) / "hermes"
    state_db(hermes / "state.db", [
        {"id": "s1", "model": "qwen3:32b", "billing_provider": "custom", "started_at": ts("2026-11-07T08:00:00Z"),
         "input_tokens": 1000, "output_tokens": 200, "cache_read_tokens": 0, "reasoning_tokens": 0, "system_prompt": "SECRET PROMPT",
         "title": "SECRET TITLE", "api_call_count": 2},
        {"id": "s2", "model": "qwen3:32b", "billing_provider": "custom", "started_at": ts("2026-10-01T08:00:00Z"),
         "input_tokens": 500, "output_tokens": 50, "cache_read_tokens": 0, "reasoning_tokens": 0, "api_call_count": 1},
    ])
    state_db(hermes / "profiles" / "forge" / "state.db", [
        {"id": "f1", "model": "gpt-5.6-sol", "billing_provider": "openai-codex", "started_at": ts("2026-11-05T20:00:00Z"),
         "input_tokens": 400000, "output_tokens": 9000, "cache_read_tokens": 300000, "reasoning_tokens": 2000, "api_call_count": 40},
        {"id": "f2", "model": "claude-sonnet", "billing_provider": "anthropic", "started_at": ts("2026-11-06T20:00:00Z"),
         "input_tokens": 10000, "output_tokens": 1000, "cache_read_tokens": 0, "reasoning_tokens": 0, "estimated_cost_usd": 0.42},
    ])
    (hermes / "handoff" / "rails").mkdir(parents=True)
    (hermes / "handoff" / "handoff-log.csv").write_text(
        "task_id,rail,kind,sent_at,returned_at,status,failure_class,checks_passed,retries,usage_tokens,usage_cost,wall_time_s,notes\n"
        "t_1,codex,build,2026-11-06T10:00:00Z,2026-11-06T10:10:00Z,accepted,,3,0,60000,,600,\n"
        "t_2,codex,build,2026-11-07T09:00:00Z,2026-11-07T09:01:00Z,accepted,,3,0,,,60,\n"
        "t_3,claude,review,2026-11-07T09:00:00Z,2026-11-07T09:02:00Z,accepted,,1,0,12000,0.30,120,\n")
    (hermes / "handoff" / "rails" / "leak-kpis.csv").write_text(
        "date,ord,card,station,model,calls,input,cached,uncached,output,avg_input_per_call,wait_calls,wait_tokens,"
        "whole_file_reads,wall_runs,wall_tokens,restarts,restart_overhead_tokens,pre_post_ad\n"
        "2026-10-31,ORD-1169,t_ceb3707a,forge,gpt-5.6-sol,95,11700000,10000000,1700000,34000,123157,9,1223078,0,1,4706849,1,4706849,pre-AD\n"
        "2026-11-04,ORD-1199,t_0f4bf53c,forge,gpt-5.6-sol,20,990000,800000,190000,10000,49500,0,0,1,0,0,0,0,post-AD\n"
        "2026-11-05,unmatched,,,,3,1000,0,1000,10,333,0,0,0,0,0,0,0,post-AD\n")
    trials = Path(tmp) / "trials" / "speed-trials.json"
    trials.parent.mkdir()
    trials.write_text(json.dumps({"trials": [
        {"id": "SPD-7", "at": "2026-11-06T12:00:00Z", "engine": "ollama", "model": "qwen3:32b", "repeats": 3, "ok": True,
         "ttftMs": 310.0, "tokensPerSec": 34.2}]}))
    roster = Path(tmp) / "stations.json"
    roster.write_text(json.dumps({"stations": [{"id": "eng", "profile": "forge"}, {"id": "xo", "profile": "default"}]}))
    return {"STATE_DBS": f"{hermes}/state.db;{hermes}/profiles/*/state.db", "HANDOFF_LOG": str(hermes / "handoff" / "handoff-log.csv"),
            "LEAK_CSV": str(hermes / "handoff" / "rails" / "leak-kpis.csv"), "TRIALS": str(trials), "ROSTER": str(roster)}, hermes


def row(rows, **match):
    return next(r for r in rows if all(r.get(k) == v for k, v in match.items()))


class MeterProbe(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.env, self.hermes = fixture_env(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def test_the_file_matches_the_schema(self):
        data = meter_probe.build(self.env, NOW)
        jsonschema.Draft202012Validator(SCHEMA, format_checker=jsonschema.Draft202012Validator.FORMAT_CHECKER).validate(data)
        self.assertIs(data["synthetic"], False)
        self.assertTrue(all(s["state"] == "read" for s in data["sources"].values()), data["sources"])

    def test_spend_by_rail_and_window(self):
        spend = meter_probe.build(self.env, NOW)["spend"]
        self.assertEqual(row(spend, rail="local", window="day")["input"], 1000)
        self.assertEqual(row(spend, rail="local", window="all")["sessions"], 2)
        self.assertEqual(row(spend, rail="local", window="all")["calls"], 3)
        codex = row(spend, rail="codex", window="week")
        self.assertEqual((codex["input"], codex["cached"], codex["output"], codex["reasoning"]), (400000, 300000, 9000, 2000))
        self.assertFalse(any(r["rail"] == "codex" and r["window"] == "day" for r in spend))
        self.assertEqual(row(spend, rail="claude", window="week")["costUsd"], 0.42)
        self.assertNotIn("costUsd", codex)   # a subscription rail has no price: never shown as $0

    def test_stations_this_week(self):
        stations = meter_probe.build(self.env, NOW)["stations"]
        self.assertEqual(stations[0], {"station": "eng", "rail": "codex", "sessions": 1, "tokens": 409000})
        self.assertEqual(row(stations, station="xo")["tokens"], 1200)

    def test_no_message_or_prompt_text_is_read(self):
        text = json.dumps(meter_probe.build(self.env, NOW))
        self.assertNotIn("SECRET", text)
        self.assertNotIn("system_prompt", meter_probe.SESSION_COLUMNS)
        self.assertNotIn("title", meter_probe.SESSION_COLUMNS)

    def test_hermes_files_are_left_byte_for_byte(self):
        files = [p for p in self.hermes.rglob("*") if p.is_file()]
        before = {p: hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
        meter_probe.build(self.env, NOW)
        after = {p: hashlib.sha256(p.read_bytes()).hexdigest() for p in self.hermes.rglob("*") if p.is_file()}
        self.assertEqual(before, after)   # same files, same bytes: no -shm, no -wal, no journal

    def test_handoff_speed_skips_rows_without_tokens(self):
        h = meter_probe.build(self.env, NOW)["handoffs"]
        week = row(h, rail="codex", window="week")
        self.assertEqual((week["count"], week["tokens"], week["wallS"]), (2, 60000, 660.0))
        self.assertEqual(week["tokensPerSec"], 100.0)   # 60000 over 600 s; the row with no count is left out
        self.assertEqual(row(h, rail="claude", window="day")["costUsd"], 0.3)

    def test_leak_share_per_week(self):
        leak = meter_probe.build(self.env, NOW)["leak"]
        self.assertEqual(leak["basis"], "leak = wait_tokens + restart_overhead_tokens; all = input + output")
        w44, w45 = leak["weeks"][1], leak["weeks"][0]
        self.assertEqual((w44["week"], w44["from"]), ("2026-W44", "2026-10-26"))
        self.assertEqual(w44["leakTokens"], 1223078 + 4706849)
        self.assertEqual((w44["tokens"], w44["share"]), (11734000, 50.5))   # 5,929,927 of 11,734,000
        self.assertEqual((w45["runs"], w45["unmatched"], w45["share"]), (2, 1, 0.0))

    def test_leak_v1_columns(self):
        Path(self.env["LEAK_CSV"]).write_text("date,input,output,wait_tokens,wall_tokens,restart_tokens\n2026-11-02,900,100,50,30,20\n")
        leak = meter_probe.build(self.env, NOW)["leak"]
        self.assertEqual(leak["basis"], "leak = wait_tokens + restart_tokens + wall_tokens; all = input + output")
        self.assertEqual(leak["weeks"][0]["share"], 10.0)

    def test_unknown_leak_columns_say_so(self):
        Path(self.env["LEAK_CSV"]).write_text("when,what\n2026-11-02,x\n")
        data = meter_probe.build(self.env, NOW)
        self.assertEqual(data["sources"]["leak"]["state"], "error")
        self.assertIn("when, what", data["sources"]["leak"]["note"])
        self.assertEqual(data["leak"]["weeks"], [])

    def test_missing_sources_never_stop_it(self):
        env = {"STATE_DBS": "/nowhere/state.db", "HANDOFF_LOG": "/nowhere.csv", "LEAK_CSV": "/nowhere2.csv", "TRIALS": "/nowhere.json"}
        data = meter_probe.build(env, NOW)
        jsonschema.Draft202012Validator(SCHEMA).validate(data)
        self.assertEqual({s["state"] for s in data["sources"].values()}, {"missing"})

    def test_a_broken_state_db_is_an_error_not_a_crash(self):
        Path(self.hermes / "profiles" / "forge" / "state.db").write_bytes(b"not a database at all" * 100)
        data = meter_probe.build(self.env, NOW)
        self.assertEqual(data["sources"]["sessions"]["state"], "read")
        self.assertIn("could not read forge", data["sources"]["sessions"]["note"])

    def test_rails(self):
        self.assertEqual(meter_probe.rail_of("openai-codex", "gpt-5.6-sol"), "codex")
        self.assertEqual(meter_probe.rail_of("anthropic", "claude-opus"), "claude")
        self.assertEqual(meter_probe.rail_of("custom", "qwen3:32b"), "local")
        self.assertEqual(meter_probe.rail_of("", ""), "other")

    def test_the_probe_opens_no_connection(self):
        code = (Path(__file__).parent / "meter_probe.py").read_text()
        for word in ("urlopen", "socket", "http", "requests", "subprocess"):
            self.assertNotIn(word, code)


class SpeedTrial(unittest.TestCase):
    def test_median_of_the_repeats(self):
        answers = iter([
            {"ttftMs": 2500.0, "loadMs": 2200.0, "promptTokens": 20, "outputTokens": 120, "tokensPerSec": 30.0, "promptTokensPerSec": 400.0},
            {"ttftMs": 300.0, "loadMs": 0.0, "promptTokens": 20, "outputTokens": 128, "tokensPerSec": 35.0, "promptTokensPerSec": 500.0},
            {"ttftMs": 320.0, "loadMs": 0.0, "promptTokens": 20, "outputTokens": 128, "tokensPerSec": 34.0, "promptTokensPerSec": 480.0},
        ])
        t = speed_trial.trial("x", "qwen3:32b", 3, 128, NOW, answer=lambda *a: next(answers))
        self.assertEqual((t["ok"], t["ttftMs"], t["ttftMsMax"], t["tokensPerSec"]), (True, 320.0, 2500.0, 34.0))
        self.assertIn("load", t["note"])
        t = {"id": "SPD-1", **t}
        jsonschema.Draft202012Validator(SCHEMA["properties"]["trials"]["items"]).validate(t)

    def test_a_failure_is_kept_with_its_reason(self):
        def boom(*a):
            raise OSError("connection refused")
        t = speed_trial.trial("x", "qwen3:32b", 3, 128, NOW, answer=boom)
        self.assertEqual((t["ok"], t["note"]), (False, "Failed after 0 of 3: connection refused"))
        self.assertFalse(speed_trial.trial("x", None, 3, 128, NOW)["ok"])

    def test_the_history_keeps_the_newest(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "t.json"
            for i in range(35):
                speed_trial.add(path, {"at": f"2026-11-07T10:{i:02d}:00Z"})
            trials = json.loads(path.read_text())["trials"]
            self.assertEqual((len(trials), trials[0]["id"], trials[-1]["id"]), (30, "SPD-6", "SPD-35"))

    def test_it_only_asks_ollama(self):
        code = (Path(__file__).parent / "speed_trial.py").read_text()
        self.assertEqual(sorted(set(__import__("re").findall(r'"(/api/\w+)"', code))), ["/api/generate", "/api/ps"])
        self.assertNotIn("subprocess", code)


if __name__ == "__main__":
    unittest.main()
