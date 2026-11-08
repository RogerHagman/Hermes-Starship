"""The Yeoman's desk: the one way the Starship board can change the Captain's list.

The board posts one action at a time (tick, cancel, reopen, mark important, set a due date, edit,
add, rank, snooze, arrived). The desk checks its shape and drops it as one small JSON file into the
Yeoman's inbox (yeoman/inbox/ in Hermes' data folder). It never opens the Yeoman's CSV files: the
Yeoman's own code, on its timer, applies each inbox file and writes the result to
inbox/results.jsonl, which the ship probe shows on the board (patch B2-45 in Hermes).

No model, no Hermes call, no network beyond answering nginx. It runs as the Yeoman's user (10000)
with only the inbox folder mounted read-write.

  GET  /desk/health   {"inbox": true|false, "pending": n}
  POST /desk/action   {"op": ..., "item": ..., "value": ...}  ->  202 {"id": ..., "at": ...}

Settings from the environment: INBOX (the folder), PORT (8090).
"""
import json
import math
import os
import re
import sys
import tempfile
import uuid
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

MAX_BODY = 8 * 1024
TEXT_MAX = 2000
ITEM = re.compile(r"[A-Za-z0-9][A-Za-z0-9_.-]{0,63}")
ISO = re.compile(r"\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ")
# Each op and the value it takes. None: no value at all.
OPS = {
    "tick": None, "cancel": None, "reopen": None, "arrived": None,
    "important": "bool", "due": "time-or-null", "snooze": "time", "edit": "text", "rank": "number", "add": "new",
}


class Refused(ValueError):
    pass


def log(message):
    print(f"{datetime.now(timezone.utc):%Y-%m-%dT%H:%M:%SZ} desk: {message}", file=sys.stderr, flush=True)


def stamp(now=None):
    return (now or datetime.now(timezone.utc)).strftime("%Y-%m-%dT%H:%M:%SZ")


def is_time(value):
    if not isinstance(value, str) or not ISO.fullmatch(value):
        return False
    try:
        datetime.strptime(value, "%Y-%m-%dT%H:%M:%SZ")
    except ValueError:
        return False
    return True


def text_of(value):
    if not isinstance(value, str) or not value.strip():
        raise Refused("the text is empty")
    value = value.strip()
    if len(value) > TEXT_MAX:
        raise Refused(f"the text is longer than {TEXT_MAX} characters")
    return value


def check(body):
    """The action as the Yeoman will read it, or Refused with the reason. Unknown keys are dropped."""
    if not isinstance(body, dict):
        raise Refused("not an action")
    op = body.get("op")
    if op not in OPS:
        raise Refused("unknown op")
    kind = OPS[op]
    item = body.get("item", "")
    if op == "add":
        if item:
            raise Refused("add takes no item")
    elif not isinstance(item, str) or not ITEM.fullmatch(item):
        raise Refused("bad item id")
    value = body.get("value")
    if kind is None:
        if value is not None:
            raise Refused(f"{op} takes no value")
    elif kind == "bool":
        if not isinstance(value, bool):
            raise Refused("important takes true or false")
    elif kind == "time-or-null":
        if value is not None and not is_time(value):
            raise Refused("due takes a UTC time (2026-11-08T17:00:00Z) or null")
    elif kind == "time":
        if not is_time(value):
            raise Refused("snooze takes a UTC time (2026-11-08T17:00:00Z)")
    elif kind == "text":
        value = text_of(value)
    elif kind == "number":
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
            raise Refused("rank takes a number")
    elif kind == "new":
        if not isinstance(value, dict):
            raise Refused("add takes {text, important, due}")
        due = value.get("due")
        if due is not None and not is_time(due):
            raise Refused("due takes a UTC time (2026-11-08T17:00:00Z) or null")
        important = value.get("important", False)
        if not isinstance(important, bool):
            raise Refused("important takes true or false")
        value = {"text": text_of(value.get("text")), "important": important, "due": due}
    return {"op": op, "item": item, "value": value}


def drop(inbox, action, now=None):
    """Write the action into the inbox as <id>.json (a temp file, then a rename) and return it."""
    folder = Path(inbox)
    out = {"id": f"b-{uuid.uuid4().hex[:16]}", "at": stamp(now), **action, "from": "board"}
    fd, temp = tempfile.mkstemp(dir=folder, prefix=f".{out['id']}.", suffix=".json.tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump(out, handle, ensure_ascii=False)
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.chmod(temp, 0o660)
        os.replace(temp, folder / f"{out['id']}.json")
    finally:
        if os.path.exists(temp):
            os.unlink(temp)
    return out


def health(inbox):
    folder = Path(inbox)
    ok = folder.is_dir() and os.access(folder, os.W_OK)
    pending = sum(1 for p in folder.glob("*.json")) if ok else 0
    return {"inbox": ok, "pending": pending}


def same_origin(headers):
    """A browser on another site can't post here: no Origin, or one that names this host."""
    origin = headers.get("Origin")
    if not origin:
        return True
    host = headers.get("X-Forwarded-Host") or headers.get("Host") or ""
    return re.sub(r"^https?://", "", origin) == host


class Desk(BaseHTTPRequestHandler):
    inbox = "/inbox"
    server_version = "yeoman-desk"
    sys_version = ""

    def reply(self, code, data):
        body = json.dumps(data).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.rstrip("/") in ("/desk/health", "/health"):
            return self.reply(200, health(self.inbox))
        self.reply(404, {"error": "not here"})

    def do_POST(self):
        if self.path.rstrip("/") not in ("/desk/action", "/action"):
            return self.reply(404, {"error": "not here"})
        if not same_origin(self.headers):
            return self.reply(403, {"error": "another site"})
        if (self.headers.get("Content-Type") or "").split(";")[0].strip() != "application/json":
            return self.reply(415, {"error": "send JSON"})
        try:
            size = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            size = -1
        if size <= 0 or size > MAX_BODY:
            return self.reply(413, {"error": "too big or empty"})
        if not health(self.inbox)["inbox"]:
            return self.reply(503, {"error": "no inbox: the Yeoman patch is not in yet"})
        try:
            action = check(json.loads(self.rfile.read(size)))
        except (ValueError, UnicodeDecodeError) as error:
            return self.reply(400, {"error": str(error) if isinstance(error, Refused) else "not JSON"})
        try:
            out = drop(self.inbox, action)
        except OSError as error:
            log(f"could not write: {error}")
            return self.reply(503, {"error": "could not write to the inbox"})
        log(f"{out['id']} {out['op']} {out['item']}")
        self.reply(202, {"id": out["id"], "at": out["at"]})

    def log_message(self, fmt, *args):   # the requests themselves are not logged
        pass


def main():
    Desk.inbox = os.environ.get("INBOX", "/inbox")
    port = int(os.environ.get("PORT", "8090"))
    log(f"listening on {port}, inbox {Desk.inbox} ({'ready' if health(Desk.inbox)['inbox'] else 'missing'})")
    ThreadingHTTPServer(("0.0.0.0", port), Desk).serve_forever()


if __name__ == "__main__":
    main()
