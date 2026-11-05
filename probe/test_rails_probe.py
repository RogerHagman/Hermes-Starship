"""Tests for the rails probe. Run: python -m unittest discover -s probe"""
import json
import os
import sys
import tempfile
import time
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).parent))
import rails_probe  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
NOW = datetime(2026, 11, 5, tzinfo=timezone.utc)


def record(at, used5, reset5, used_week, reset_week):
    return json.dumps({"timestamp": at, "type": "event_msg", "payload": {"type": "token_count", "rate_limits": {
        "primary": {"used_percent": used5, "window_minutes": 300, "resets_at": reset5},
        "secondary": {"used_percent": used_week, "window_minutes": 10080, "resets_at": reset_week},
    }}}) + "\n"


class Codex(unittest.TestCase):
    def test_reads_both_windows_and_their_resets(self):
        with tempfile.TemporaryDirectory() as d:
            Path(d, "s.jsonl").write_text(record("2026-11-05T01:00:00Z", 51.4, 1793847600, 26.0, 1794452400))
            rail = rails_probe.codex_rail(d, NOW)
        self.assertEqual([51, 26], [m["percent"] for m in rail["meters"]])
        self.assertEqual(["2026-11-05T03:00:00Z", "2026-11-12T03:00:00Z"], [m["resetsAt"] for m in rail["meters"]])
        self.assertEqual("up", rail["state"])

    def test_a_passed_reset_shows_zero(self):
        with tempfile.TemporaryDirectory() as d:
            Path(d, "s.jsonl").write_text(record("2026-11-05T01:00:00Z", 99, 1, 88, 2))
            rail = rails_probe.codex_rail(d, NOW)
        self.assertEqual([0, 0], [m["percent"] for m in rail["meters"]])

    def test_a_full_window_is_out(self):
        with tempfile.TemporaryDirectory() as d:
            Path(d, "s.jsonl").write_text(record("2026-11-05T01:00:00Z", 100, 1793847600, 60, 1794452400))
            self.assertEqual("out", rails_probe.codex_rail(d, NOW)["state"])

    def test_a_newer_broken_record_is_ignored(self):
        broken = json.dumps({"timestamp": "2026-11-05T02:00:00Z", "type": "event_msg", "payload": {
            "type": "token_count", "rate_limits": {"primary": {"used_percent": 99}, "secondary": {}}}}) + "\n"
        with tempfile.TemporaryDirectory() as d:
            Path(d, "s.jsonl").write_text(record("2026-11-05T01:00:00Z", 51, 1793847600, 26, 1794452400) + broken + "not json\n")
            rail = rails_probe.codex_rail(d, NOW)
        self.assertEqual([51, 26], [m["percent"] for m in rail["meters"]])

    def test_only_the_newest_logs_are_opened(self):
        with tempfile.TemporaryDirectory() as d:
            old = Path(d, "2026", "10", "old.jsonl")
            old.parent.mkdir(parents=True)
            old.write_text(record("2026-11-05T03:00:00Z", 90, 1793847600, 90, 1794452400))
            os.utime(old, (time.time() - 86400, time.time() - 86400))
            for i in range(rails_probe.NEWEST_FILES):
                Path(d, f"new{i}.jsonl").write_text(record("2026-11-05T01:00:00Z", 10, 1793847600, 20, 1794452400))
            rail = rails_probe.codex_rail(d, NOW)
        self.assertEqual([10, 20], [m["percent"] for m in rail["meters"]])

    def test_no_logs_leaves_the_meters_out(self):
        with tempfile.TemporaryDirectory() as d:
            rail = rails_probe.codex_rail(d, NOW)
        self.assertEqual([], rail["meters"])
        self.assertIn("No Codex window record found", rail["note"])


class Local(unittest.TestCase):
    def test_ollama_down_is_out(self):
        with patch.object(rails_probe, "urlopen", side_effect=OSError("connection refused")):
            self.assertEqual(("out", 0), rails_probe.read_ollama("http://localhost:9", 24))

    def test_no_address_is_out(self):
        self.assertEqual(("out", 0), rails_probe.read_ollama("", 24))

    def test_vram_is_a_whole_percent(self):
        class Answer:
            def __enter__(self): return self
            def __exit__(self, *a): return False
            def read(self, *a): return json.dumps({"models": [{"size_vram": 17 * 1024 ** 3}]}).encode()
        with patch.object(rails_probe, "urlopen", return_value=Answer()):
            self.assertEqual(("up", 71), rails_probe.read_ollama("http://localhost:9", 24))

    def test_only_api_ps_is_ever_called(self):
        source = Path(rails_probe.__file__).read_text(encoding="utf-8")
        for endpoint in ("/api/generate", "/api/chat", "/api/embed", "/api/pull", "/api/create", "/api/delete"):
            self.assertNotIn(endpoint, source)


class Burn(unittest.TestCase):
    def config(self, d, **over):
        cfg = {"allowed_rails": ["claude"], "timezone": "Europe/Stockholm", "reset_day": "thursday",
               "reset_time": "10:00", "window_hours": 24, **over}
        path = Path(d, "burn.json")
        path.write_text(json.dumps(cfg))
        return path

    def test_open_the_day_before_the_reset(self):
        with tempfile.TemporaryDirectory() as d:
            burn = rails_probe.claude_burn(self.config(d), datetime(2026, 11, 4, 19, 30, tzinfo=timezone.utc))
        self.assertEqual({"active": True, "until": "2026-11-05T09:00:00Z"}, burn)

    def test_shut_after_the_reset(self):
        with tempfile.TemporaryDirectory() as d:
            burn = rails_probe.claude_burn(self.config(d), datetime(2026, 11, 5, 9, 30, tzinfo=timezone.utc))
        self.assertEqual({"active": False}, burn)

    def test_missing_file_is_shut(self):
        self.assertEqual({"active": False}, rails_probe.claude_burn("/nonexistent/burn.json", NOW))


class Claude(unittest.TestCase):
    TOKEN = "sk-test-token-never-logged"

    def signin(self, d, expires_ms=None):
        path = Path(d, ".credentials.json")
        oauth = {"accessToken": self.TOKEN, "refreshToken": "r", "expiresAt": expires_ms or 1893456000000}
        path.write_text(json.dumps({"claudeAiOauth": oauth}))
        return path

    def answer(self, payload):
        class Answer:
            def __enter__(self): return self
            def __exit__(self, *a): return False
            def read(self, *a): return json.dumps(payload).encode()
        return Answer()

    USAGE = {"five_hour": {"utilization": 37.6, "resets_at": "2026-11-05T03:00:00+00:00"},
             "seven_day": {"utilization": 81.2, "resets_at": "2026-11-06T09:00:00.512+00:00"}}

    def test_reads_both_windows_and_their_resets(self):
        with tempfile.TemporaryDirectory() as d:
            gauge = rails_probe.ClaudeGauge(self.signin(d))
            with patch.object(rails_probe, "urlopen", return_value=self.answer(self.USAGE)) as call:
                rail = rails_probe.claude_rail(gauge, "/nonexistent", NOW)
        self.assertEqual([38, 81], [m["percent"] for m in rail["meters"]])
        self.assertEqual(["2026-11-05T03:00:00Z", "2026-11-06T09:00:00Z"], [m["resetsAt"] for m in rail["meters"]])
        request = call.call_args[0][0]
        self.assertEqual(("GET", rails_probe.USAGE_URL), (request.get_method(), request.full_url))
        self.assertEqual("up", rail["state"])

    def test_asks_at_most_every_five_minutes(self):
        clock = [1000.0]
        with tempfile.TemporaryDirectory() as d:
            gauge = rails_probe.ClaudeGauge(self.signin(d))
            with patch.object(rails_probe, "urlopen", return_value=self.answer(self.USAGE)) as call:
                for step in (0, 60, 299, 301):
                    clock[0] = 1000.0 + step
                    gauge.read(NOW, clock=lambda: clock[0])
        self.assertEqual(2, call.call_count)

    def test_a_full_window_is_out_and_a_passed_reset_shows_zero(self):
        usage = {"five_hour": {"utilization": 100, "resets_at": "2026-11-05T03:00:00Z"},
                 "seven_day": {"utilization": 90, "resets_at": "2026-11-04T09:00:00Z"}}
        with tempfile.TemporaryDirectory() as d:
            gauge = rails_probe.ClaudeGauge(self.signin(d))
            with patch.object(rails_probe, "urlopen", return_value=self.answer(usage)):
                rail = rails_probe.claude_rail(gauge, "/nonexistent", NOW)
        self.assertEqual([100, 0], [m["percent"] for m in rail["meters"]])
        self.assertEqual("out", rail["state"])

    def test_an_expired_signin_is_not_used(self):
        with tempfile.TemporaryDirectory() as d:
            gauge = rails_probe.ClaudeGauge(self.signin(d, expires_ms=1000))
            with patch.object(rails_probe, "urlopen") as call:
                rail = rails_probe.claude_rail(gauge, "/nonexistent", NOW)
        call.assert_not_called()
        self.assertEqual([], rail["meters"])
        self.assertIn("expired", rail["note"])

    def test_a_refused_ask_logs_the_status_but_never_the_token(self):
        from urllib.error import HTTPError
        refused = HTTPError(rails_probe.USAGE_URL, 401, "Unauthorized", {}, None)
        with tempfile.TemporaryDirectory() as d, patch("sys.stderr") as err:
            gauge = rails_probe.ClaudeGauge(self.signin(d))
            with patch.object(rails_probe, "urlopen", side_effect=refused):
                rail = rails_probe.claude_rail(gauge, "/nonexistent", NOW)
        logged = "".join(c.args[0] for c in err.write.call_args_list)
        self.assertIn("401", logged)
        self.assertNotIn(self.TOKEN, logged)
        self.assertNotIn(self.TOKEN, json.dumps(rail))
        self.assertIn("Not measured right now", rail["note"])

    def test_too_many_asks_waits_longer(self):
        from urllib.error import HTTPError
        clock = [0.0]
        with tempfile.TemporaryDirectory() as d:
            gauge = rails_probe.ClaudeGauge(self.signin(d))
            with patch.object(rails_probe, "urlopen", side_effect=HTTPError(rails_probe.USAGE_URL, 429, "Too Many", {}, None)) as call:
                for step in (0, 300, 600, 900):
                    clock[0] = step
                    gauge.read(NOW, clock=lambda: clock[0])
        self.assertEqual(2, call.call_count)   # at 0, then not again until 900

    def test_an_unknown_answer_shows_nothing(self):
        with tempfile.TemporaryDirectory() as d:
            gauge = rails_probe.ClaudeGauge(self.signin(d))
            with patch.object(rails_probe, "urlopen", return_value=self.answer({"something": "else"})):
                rail = rails_probe.claude_rail(gauge, "/nonexistent", NOW)
        self.assertEqual([], rail["meters"])

    def test_the_last_answer_is_kept_for_a_while_then_dropped(self):
        clock = [0.0]
        with tempfile.TemporaryDirectory() as d:
            gauge = rails_probe.ClaudeGauge(self.signin(d))
            with patch.object(rails_probe, "urlopen", return_value=self.answer(self.USAGE)):
                gauge.read(NOW, clock=lambda: clock[0])
            with patch.object(rails_probe, "urlopen", side_effect=OSError("down")):
                clock[0] = 600
                kept, _ = gauge.read(NOW + timedelta(minutes=10), clock=lambda: clock[0])
                clock[0] = 1200
                dropped, why = gauge.read(NOW + timedelta(minutes=20), clock=lambda: clock[0])
        self.assertEqual(2, len(kept))
        self.assertEqual([], dropped)
        self.assertIn("did not answer", why)

    def test_the_file_with_claude_meters_matches_the_schema(self):
        import jsonschema
        schema = json.loads((ROOT / "api/schema/rails.schema.json").read_text())
        with tempfile.TemporaryDirectory() as d:
            gauge = rails_probe.ClaudeGauge(self.signin(d))
            with patch.object(rails_probe, "urlopen", return_value=self.answer(self.USAGE)):
                reading = rails_probe.build_reading("http://localhost:9", 24, d, "/nonexistent", NOW, claude=gauge)
        jsonschema.validate(reading, schema)
        self.assertEqual(2, len(reading["rails"][2]["meters"]))

    def test_the_signin_file_is_never_written(self):
        source = Path(rails_probe.__file__).read_text(encoding="utf-8")
        start = source.index("# ---------- Claude: the account's usage windows")
        claude_part = source[start:source.index("# ---------- Claude: the burn window")]
        for writes in ('"w"', "'w'", "write_text", ".write(", "refresh"):
            self.assertNotIn(writes, claude_part.replace("refreshed", ""))


class TheFile(unittest.TestCase):
    def test_matches_the_schema(self):
        try:
            import jsonschema
        except ImportError:
            self.skipTest("jsonschema not installed")
        schema = json.loads((ROOT / "api/schema/rails.schema.json").read_text())
        with tempfile.TemporaryDirectory() as d, patch.object(rails_probe, "urlopen", side_effect=OSError("down")):
            Path(d, "s.jsonl").write_text(record("2026-11-05T01:00:00Z", 51, 1793847600, 26, 1794452400))
            reading = rails_probe.build_reading("http://localhost:9", 24, d, "/nonexistent", NOW)
        jsonschema.validate(reading, schema)

    def test_atomic_write_replaces_and_leaves_no_temp(self):
        with tempfile.TemporaryDirectory() as d:
            Path(d, "rails.json").write_text('{"old": true}')
            rails_probe.atomic_write(d, {"asOf": "2026-11-05T00:00:00Z", "synthetic": False, "rails": []})
            self.assertFalse(json.loads(Path(d, "rails.json").read_text())["synthetic"])
            self.assertEqual([], list(Path(d).glob(".rails.*.tmp")))
            self.assertEqual(0o644, Path(d, "rails.json").stat().st_mode & 0o777)


if __name__ == "__main__":
    unittest.main()
