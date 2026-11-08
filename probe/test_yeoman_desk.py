"""Tests for the Yeoman's desk. Run: python -m unittest discover -s probe"""
import http.client
import json
import sys
import tempfile
import threading
import unittest
from datetime import datetime, timezone
from http.server import ThreadingHTTPServer
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import yeoman_desk as desk  # noqa: E402

NOW = datetime(2026, 11, 8, 16, 0, tzinfo=timezone.utc)


class CheckTest(unittest.TestCase):
    def ok(self, body):
        return desk.check(body)

    def refused(self, body, word):
        with self.assertRaises(desk.Refused) as caught:
            desk.check(body)
        self.assertIn(word, str(caught.exception))

    def test_every_op_with_a_good_value(self):
        good = [
            {"op": "tick", "item": "todo-101c797c0a"},
            {"op": "cancel", "item": "R-0003"},
            {"op": "reopen", "item": "T-0007"},
            {"op": "arrived", "item": "W-0001"},
            {"op": "important", "item": "T-0001", "value": True},
            {"op": "due", "item": "T-0001", "value": "2026-11-09T17:00:00Z"},
            {"op": "due", "item": "T-0001", "value": None},
            {"op": "snooze", "item": "R-0001", "value": "2026-11-09T07:30:00Z"},
            {"op": "edit", "item": "T-0001", "value": "  Book winter tyres  "},
            {"op": "rank", "item": "T-0001", "value": 20},
            {"op": "add", "value": {"text": "Buy coffee filters", "important": True, "due": None}},
        ]
        for body in good:
            with self.subTest(op=body["op"]):
                out = self.ok(body)
                self.assertEqual(out["op"], body["op"])
        self.assertEqual(self.ok(good[8])["value"], "Book winter tyres")
        self.assertEqual(self.ok({"op": "add", "value": {"text": "x"}})["value"], {"text": "x", "important": False, "due": None})

    def test_bad_actions_are_refused_with_the_reason(self):
        self.refused({"op": "delete", "item": "T-1"}, "unknown op")
        self.refused({"op": "tick", "item": "../todos.csv"}, "bad item")
        self.refused({"op": "tick", "item": ""}, "bad item")
        self.refused({"op": "tick", "item": "T-1", "value": 1}, "takes no value")
        self.refused({"op": "important", "item": "T-1", "value": "yes"}, "true or false")
        self.refused({"op": "due", "item": "T-1", "value": "tomorrow"}, "UTC time")
        self.refused({"op": "due", "item": "T-1", "value": "2026-02-30T10:00:00Z"}, "UTC time")
        self.refused({"op": "snooze", "item": "R-1", "value": None}, "UTC time")
        self.refused({"op": "edit", "item": "T-1", "value": "   "}, "empty")
        self.refused({"op": "edit", "item": "T-1", "value": "x" * 2001}, "longer")
        self.refused({"op": "rank", "item": "T-1", "value": True}, "number")
        self.refused({"op": "rank", "item": "T-1", "value": float("nan")}, "number")
        self.refused({"op": "add", "item": "T-1", "value": {"text": "x"}}, "no item")
        self.refused({"op": "add", "value": {"text": ""}}, "empty")
        self.refused([], "not an action")

    def test_unknown_keys_never_reach_the_inbox(self):
        out = self.ok({"op": "tick", "item": "T-1", "path": "/etc/passwd", "from": "evil"})
        self.assertEqual(set(out), {"op", "item", "value"})


class DropTest(unittest.TestCase):
    def test_one_file_per_action_with_its_id_and_time(self):
        with tempfile.TemporaryDirectory() as inbox:
            out = desk.drop(inbox, {"op": "tick", "item": "T-1", "value": None}, NOW)
            files = list(Path(inbox).iterdir())
            self.assertEqual([f.name for f in files], [f"{out['id']}.json"])
            saved = json.loads(files[0].read_text())
            self.assertEqual(saved, {"id": out["id"], "at": "2026-11-08T16:00:00Z", "op": "tick", "item": "T-1", "value": None, "from": "board"})
            self.assertEqual(desk.health(inbox), {"inbox": True, "pending": 1})

    def test_no_inbox_folder(self):
        self.assertEqual(desk.health("/nonexistent/inbox"), {"inbox": False, "pending": 0})


class ServerTest(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.inbox = Path(self.dir.name) / "inbox"
        self.inbox.mkdir()
        handler = type("D", (desk.Desk,), {"inbox": str(self.inbox)})
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        threading.Thread(target=self.server.serve_forever, daemon=True).start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.dir.cleanup()

    def call(self, method, path, body=None, headers=None):
        con = http.client.HTTPConnection("127.0.0.1", self.server.server_address[1], timeout=5)
        data = body if isinstance(body, (bytes, type(None))) else json.dumps(body).encode()
        con.request(method, path, body=data, headers={"Content-Type": "application/json", **(headers or {})})
        res = con.getresponse()
        out = res.status, json.loads(res.read() or b"{}")
        con.close()
        return out

    def test_a_good_action_lands_in_the_inbox(self):
        code, out = self.call("POST", "/desk/action", {"op": "important", "item": "T-1", "value": True})
        self.assertEqual(code, 202)
        self.assertTrue((self.inbox / f"{out['id']}.json").exists())
        self.assertEqual(self.call("GET", "/desk/health"), (200, {"inbox": True, "pending": 1}))

    def test_refusals(self):
        self.assertEqual(self.call("POST", "/desk/action", {"op": "nope", "item": "T-1"})[0], 400)
        self.assertEqual(self.call("POST", "/desk/action", b"not json")[0], 400)
        self.assertEqual(self.call("POST", "/desk/action", {"op": "tick", "item": "T-1"}, {"Content-Type": "text/plain"})[0], 415)
        self.assertEqual(self.call("POST", "/desk/action", {"op": "tick", "item": "T-1"}, {"Origin": "https://evil.example"})[0], 403)
        self.assertEqual(self.call("POST", "/desk/action", {"op": "edit", "item": "T-1", "value": "x" * 9000})[0], 413)
        self.assertEqual(self.call("POST", "/elsewhere", {"op": "tick", "item": "T-1"})[0], 404)
        self.assertEqual(list(self.inbox.iterdir()), [])

    def test_same_site_origin_is_fine(self):
        host = f"127.0.0.1:{self.server.server_address[1]}"
        code, _ = self.call("POST", "/desk/action", {"op": "tick", "item": "T-1"}, {"Origin": f"http://{host}"})
        self.assertEqual(code, 202)

    def test_without_the_inbox_it_says_the_patch_is_not_in(self):
        self.inbox.rmdir()
        code, out = self.call("POST", "/desk/action", {"op": "tick", "item": "T-1"})
        self.assertEqual(code, 503)
        self.assertIn("patch", out["error"])
        self.assertEqual(self.call("GET", "/desk/health"), (200, {"inbox": False, "pending": 0}))


if __name__ == "__main__":
    unittest.main()
