#!/usr/bin/env python3
"""The ship probe: writes live/orders.json and live/shiplog.json for the boards, about once a minute.

Read-only, like the rails probe. It reads four of Hermes' own records and changes none of them:
- orders.csv: every ORD, minted by code (order_id, received_at, from_surface, station, kind,
  status, closed_at, speed).
- The Kanban cards: each card's title, body, state and worker. The card title carries the ORD,
  so this is where an order gets its words. What came back comes from here too: each card's
  result, its runs' summaries (or errors) and its comments, as the order's replies. The database
  is copied to a scratch folder first and read from the copy, so Hermes' own file is never
  opened, locked or written.
- answers.jsonl (once patch AF is in): every answer the Captain was sent, chat or card.
- handoff-log.csv: what crossed to a cloud rail, and whether it came back clean (the customs log).
- The station roster (fixtures/stations.json): which Hermes profile is which station.

The files have the shapes of api/schema/orders.schema.json and shiplog.schema.json, with
"synthetic": false. They are written atomically, so the page never reads half a file. A missing
or unreadable source never stops the probe: it writes what it can and logs one line. No model
runs, and nothing leaves the NAS.

Settings come from the environment: ORDERS_CSV, KANBAN_DB, HANDOFF_LOG, ANSWERS, ROSTER, OUT_DIR, SCRATCH
(where the database copy goes; never inside OUT_DIR, which nginx serves), INTERVAL (seconds; 0 runs
once), DAYS (how far back done orders are kept), KEEP (the most orders the file holds) and RECORDS_KEEP
(the most orders records.json holds: every order on file, any state, for the core terminal).
Standard library only.
"""
import csv
import json
import os
import re
import shutil
import sqlite3
import sys
import tempfile
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

UTC = timezone.utc
ORD = re.compile(r"\bORD-(\d{4})\b")
# orders.csv keeps the reasoning level the Captain's speed word set (docs/04-speed-scale.md).
SPEEDS = {"none": "Thrusters", "minimal": "Quarter Impulse", "low": "Half Impulse", "medium": "Full Impulse",
          "high": "Warp", "xhigh": "Warp 9", "max": "Maximum Warp"}
OPEN_HOURS = 24   # an order with no card that is still open after this was answered without one
LOG_KEEP = 200
BODY_KEEP = 4000   # characters of a card body the board shows
REPLY_KEEP = 12    # the newest replies an order carries (results, runs, comments)
REPLY_TEXT = 4000  # characters of one reply


def log(message):
    print(message, file=sys.stderr, flush=True)


def utc_stamp(value):
    return value.astimezone(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def parse_time(value):
    """A time from a CSV cell or a database column: ISO text, or seconds since 1970."""
    if value is None or value == "":
        return None
    if isinstance(value, (int, float)) or (isinstance(value, str) and re.fullmatch(r"\d{9,13}(\.\d+)?", value)):
        number = float(value)
        return datetime.fromtimestamp(number / 1000 if number > 1e11 else number, UTC)
    try:
        parsed = datetime.fromisoformat(str(value).strip().replace("Z", "+00:00"))
    except ValueError:
        return None
    return (parsed if parsed.tzinfo else parsed.replace(tzinfo=UTC)).astimezone(UTC)


# ---------- the roster: which profile is which station ----------

def key(name):
    """'Number One (router)' -> 'number one'."""
    return re.sub(r"\s*\(.*?\)\s*", " ", str(name or "")).strip().lower()


def read_roster(path):
    """{profile, station id, name or short name (lower case): station id}."""
    names = {}
    try:
        with open(path, encoding="utf-8") as handle:
            stations = json.load(handle)["stations"]
    except (OSError, ValueError, KeyError, TypeError) as error:
        log(f"roster: {error}")
        return names
    for s in stations:
        names[s["id"]] = s["id"]
        for label in (s.get("name"), s.get("short")):
            if label:
                names.setdefault(key(label), s["id"])
        profile = (s.get("profile") or "").split(" ")[0]
        if profile and profile not in ("the", "none", "not", "shared"):
            names.setdefault(profile, s["id"])
    names.setdefault("default", "xo")   # Number One runs on the default profile
    return names


# ---------- what state an order is in ----------

def order_state(*statuses):
    """The board's state for an order, from the words orders.csv and the Kanban card use.

    The card is read first when there is one: it knows more (running, blocked, waiting on review)
    than the order log does. A word nobody recognises counts as queued.
    """
    for raw in statuses:
        word = (raw or "").strip().lower()
        if not word:
            continue
        if word in ("done", "closed", "complete", "completed", "archived"):
            return "done"
        if "captain" in word or word in ("awaiting-approval", "approval", "hail"):
            return "awaiting-captain"
        if "review" in word:
            return "review"
        if word in ("running", "in_progress", "in-progress", "active", "working", "claimed", "doing"):
            return "running"
        if "block" in word or "fail" in word or word in ("error", "cancelled", "canceled", "stuck"):
            return "blocked"
        return "queued"
    return "queued"


# A split job has several cards. The order is as far along as its busiest card says.
BUSIEST = ["running", "review", "awaiting-captain", "blocked", "queued", "done"]


def cards_state(card_states, logged):
    """One state for an order from all its cards, falling back on the order log's status."""
    states = [order_state(s) for s in card_states if s]
    if not states:
        return order_state(logged)
    if all(s == "done" for s in states):
        return "done"
    return min((s for s in states if s != "done"), key=BUSIEST.index)


def speed_of(value):
    return SPEEDS.get((value or "").strip().lower())


def station_of(names, value):
    """The station id for a profile, an id or a station's name. Unknown names pass through."""
    return names.get(str(value or "")) or names.get(key(value)) or str(value or "xo")


# ---------- orders.csv ----------

def read_orders_csv(path):
    """{ORD: row} from orders.csv, or None when it can't be read. Later rows for the same ORD win."""
    rows = {}
    try:
        with open(path, newline="", encoding="utf-8") as handle:
            for row in csv.DictReader(handle):
                row = {(k or "").strip(): (v or "").strip() for k, v in row.items()}
                match = ORD.search(row.get("order_id", ""))
                if match and row.get("kind") != "test":   # done-when test rows are not orders
                    rows[f"ORD-{match.group(1)}"] = row
    except OSError as error:
        log(f"orders: {error}")
        return None
    return rows


# ---------- the Kanban cards ----------

# Column names differ between Hermes versions, so the reader looks for the first that exists.
CARD_COLUMNS = {
    "id": ("id", "task_id", "card_id"),
    "title": ("title", "name", "summary"),
    "body": ("body", "description", "prompt", "content"),
    "state": ("status", "state", "column", "lane"),
    "worker": ("assignee", "profile", "assigned_to", "worker", "agent", "owner"),
    "created": ("created_at", "created", "inserted_at"),
    "result": ("result", "output", "answer"),
}
# Every time column a card may have; the newest of them is when the card last moved.
TIME_COLUMNS = ("updated_at", "modified_at", "completed_at", "started_at", "last_heartbeat_at", "created_at")



def snapshot(db_path, scratch):
    """Copy the database (and its -wal file, which holds the newest changes) and return the copy.

    Hermes' file sits on a read-only mount, where SQLite can't open a database in WAL mode, so the
    probe reads a copy. It copies again only when the file or its -wal has changed.
    """
    source = Path(db_path)
    if not source.is_file():
        raise FileNotFoundError(db_path)
    target = Path(scratch) / "kanban.db"
    for suffix in ("", "-wal"):
        src, dst = Path(f"{source}{suffix}"), Path(f"{target}{suffix}")
        if src.is_file():
            stat = src.stat()
            if not dst.is_file() or (dst.stat().st_mtime, dst.stat().st_size) != (stat.st_mtime, stat.st_size):
                shutil.copy2(src, dst)
        elif dst.exists():
            dst.unlink()
    Path(f"{target}-shm").unlink(missing_ok=True)   # SQLite rebuilds it from the copy
    return target


def card_table(con):
    """(table, {role: column}) for the table that holds the cards: it has a title and a state."""
    best = None
    for (table,) in con.execute("select name from sqlite_master where type = 'table'"):
        columns = {row[1] for row in con.execute(f'pragma table_info("{table}")')}
        found = {role: next((c for c in names if c in columns), None) for role, names in CARD_COLUMNS.items()}
        found["times"] = [c for c in TIME_COLUMNS if c in columns]
        if found["title"] and found["state"]:
            score = sum(1 for v in found.values() if v) + ("task" in table or "card" in table)
            if not best or score > best[0]:
                best = (score, table, found)
    return (best[1], best[2]) if best else (None, None)


def read_cards(db_path, scratch):
    """{ORD: [card, ...]}, each card {id, title, body, state, worker, updated, parent}."""
    cards = {}
    try:
        copy = snapshot(db_path, scratch)
        con = sqlite3.connect(f"file:{copy}?mode=ro", uri=True)   # the copy, never Hermes' own file
        try:
            table, cols = card_table(con)
            if not table:
                log("kanban: no table with a title and a state")
                return cards
            times = cols.pop("times")
            picked = sorted({c for c in cols.values() if c} | set(times))
            listed = ", ".join('"%s"' % c for c in picked)
            for values in con.execute(f'select {listed} from "{table}"'):
                row = dict(zip(picked, values))
                card = {role: row.get(col) if col else None for role, col in cols.items()}
                stamps = [parse_time(row.get(c)) for c in times]
                card["updated"] = max([s for s in stamps if s], default=None)
                match = ORD.search(str(card["title"] or ""))
                if match:
                    cards.setdefault(f"ORD-{match.group(1)}", []).append(card)
            said = read_replies(con)
            for theirs in cards.values():
                for card in theirs:
                    card["replies"] = said.get(str(card.get("id")), [])
        finally:
            con.close()
    except (OSError, sqlite3.Error) as error:
        log(f"kanban: {error}")
    return cards


def columns_of(con, table):
    return {row[1] for row in con.execute(f'pragma table_info("{table}")')}


def read_replies(con):
    """{card id: [reply, ...]}: what came back on each card, from its runs and its comments.

    A run gives its summary (or its error, when it failed); a comment gives its author and words.
    Tables or columns this Hermes doesn't have are skipped.
    """
    said = {}
    tables = {name for (name,) in con.execute("select name from sqlite_master where type = 'table'")}
    if "task_runs" in tables and {"task_id", "summary"} <= columns_of(con, "task_runs"):
        cols = columns_of(con, "task_runs")
        pick = [c for c in ("task_id", "profile", "outcome", "summary", "error", "ended_at", "started_at") if c in cols]
        for values in con.execute(f'select {", ".join(pick)} from task_runs order by id'):
            run = dict(zip(pick, values))
            at = parse_time(run.get("ended_at")) or parse_time(run.get("started_at"))
            if run.get("summary"):
                said.setdefault(str(run["task_id"]), []).append({"at": at, "by": run.get("profile"), "kind": "run", "text": run["summary"]})
            elif run.get("error"):
                said.setdefault(str(run["task_id"]), []).append({"at": at, "by": run.get("profile"), "kind": "error",
                                                                 "text": f"{run.get('outcome') or 'failed'}: {run['error']}"})
    if "task_comments" in tables and {"task_id", "body"} <= columns_of(con, "task_comments"):
        cols = columns_of(con, "task_comments")
        pick = [c for c in ("task_id", "author", "body", "created_at") if c in cols]
        for values in con.execute(f'select {", ".join(pick)} from task_comments order by rowid'):
            note = dict(zip(pick, values))
            if note.get("body"):
                said.setdefault(str(note["task_id"]), []).append({"at": parse_time(note.get("created_at")), "by": note.get("author"),
                                                                  "kind": "comment", "text": note["body"]})
    return said


def read_answers(path):
    """{ORD: [reply, ...]} from answers.jsonl (patch AF): each answer the Captain was sent, chat or card.

    The file doesn't exist until patch AF is applied; then every answer is one JSON line.
    """
    answers = {}
    try:
        with open(path, encoding="utf-8") as handle:
            for line in handle:
                try:
                    item = json.loads(line)
                except ValueError:
                    continue
                match = ORD.search(str(item.get("order_id", ""))) if isinstance(item, dict) else None
                if match and item.get("text"):
                    answers.setdefault(f"ORD-{match.group(1)}", []).append(
                        {"at": parse_time(item.get("at")), "by": item.get("by"), "kind": "answer", "text": item["text"]})
    except FileNotFoundError:
        pass
    except OSError as error:
        log(f"answers: {error}")
    return answers


def replies_of(theirs, names, now, answers=()):
    """The order's replies, oldest first: its answers, and each card's runs, comments and result,
    the newest REPLY_KEEP."""
    out = [{"at": a["at"] or now, "by": station_of(names, a["by"]), "kind": "answer", "text": str(a["text"]).strip()[:REPLY_TEXT]}
           for a in answers]
    for card in theirs:
        mine = list(card.get("replies") or [])
        result = str(card.get("result") or "").strip()
        if result and not any(str(r["text"]).strip() == result for r in mine):
            mine.append({"at": card.get("updated"), "by": card.get("worker"), "kind": "result", "text": result})
        elif result:   # the result repeats a run's summary: show it once, as the result
            next(r for r in reversed(mine) if str(r["text"]).strip() == result)["kind"] = "result"
        for r in mine:
            out.append({"at": r["at"] or card.get("updated") or now, "by": station_of(names, r["by"] or card.get("worker")),
                        "kind": r["kind"], "text": str(r["text"]).strip()[:REPLY_TEXT]})
    out.sort(key=lambda r: r["at"])
    return [{**r, "at": utc_stamp(r["at"])} for r in out[-REPLY_KEEP:]]


def clean_title(title):
    """'ORD-1204 · Fix the reminder' -> 'Fix the reminder'."""
    text = ORD.sub("", str(title or ""))
    return re.sub(r"^[\s:·\-–|]+", "", text).strip()


# ---------- the orders file ----------

def build_orders(rows, cards, names, now, days=7, keep=80, answers=None, archive=False):
    """Orders for the boards: everything not done, plus what closed in the last `days` days.

    With `archive`, every order on file instead (the core terminal's records): nothing drops off
    for age, and an order that never got a card stays too, with a line that says so.
    """
    since = now - timedelta(days=days)
    orders = []
    for oid in sorted(set(rows) | set(cards), reverse=True):
        row = rows.get(oid, {})
        theirs = sorted(cards.get(oid, []), key=lambda c: (parse_time(c.get("created")) or c.get("updated") or now, str(c.get("id"))))
        head = theirs[0] if theirs else {}   # the first card filed for the order carries its words
        state = cards_state([c.get("state") for c in theirs], row.get("status"))
        card = max(theirs, key=lambda c: c.get("updated") or now) if theirs else {}
        when = max([t for t in (parse_time(row.get("closed_at")), parse_time(row.get("received_at")),
                                *(c.get("updated") for c in theirs)) if t] or [now])
        if state == "done" and when < since and not archive:
            continue
        said = (answers or {}).get(oid, [])
        stale = not theirs and not said and state == "queued" and when < now - timedelta(hours=OPEN_HOURS)
        if stale and not archive:
            continue   # still open in the log, but no card was ever filed for it
        worker = card.get("worker") or row.get("station") or "xo"
        order = {
            "id": oid,
            "title": clean_title(head.get("title")) or f"Message on {row.get('from_surface') or 'a surface'}",
            "station": station_of(names, worker),
            "state": state,
            "updatedAt": utc_stamp(when),
        }
        if speed_of(row.get("speed")):
            order["speed"] = speed_of(row.get("speed"))
        if head.get("body"):
            order["body"] = str(head["body"]).strip()[:BODY_KEEP]
        replies = replies_of(theirs, names, now, said)
        if replies:
            order["replies"] = replies
        if len(theirs) > 1:
            order["detail"] = f"{len(theirs)} cards: " + ", ".join(station_of(names, c.get("worker")) for c in theirs)
        elif stale:
            order["detail"] = "No card was filed, and the order log still has it open: answered in chat, or never picked up."
        orders.append(order)
    orders.sort(key=lambda o: o["updatedAt"], reverse=True)
    return orders[:keep]


# ---------- the ship's log ----------

def read_customs(path):
    """Lines for the customs log, from handoff-log.csv: one per payload that came back."""
    lines = []
    try:
        with open(path, newline="", encoding="utf-8") as handle:
            for row in csv.DictReader(handle):
                row = {(k or "").strip(): (v or "").strip() for k, v in row.items()}
                at = parse_time(row.get("returned_at")) or parse_time(row.get("sent_at"))
                if not at:
                    continue
                status = row.get("status") or "sent"
                why = f" ({row['failure_class']})" if row.get("failure_class") else ""
                lines.append({"at": utc_stamp(at), "station": "security", "kind": "customs",
                              "text": f"Customs: {row.get('kind') or 'payload'} to {row.get('rail') or 'a cloud rail'}, {status}{why}"})
    except OSError as error:
        log(f"customs: {error}")
    return lines


def build_log(rows, orders, customs, names):
    """The ship's log: each order opening and closing, and the customs lines. Newest first."""
    titles = {o["id"]: o["title"] for o in orders}
    entries = []
    for oid, row in rows.items():
        station = station_of(names, row.get("station"))
        opened, closed = parse_time(row.get("received_at")), parse_time(row.get("closed_at"))
        title = titles.get(oid)
        if opened:
            entries.append({"at": utc_stamp(opened), "station": station, "kind": "order",
                            "text": f"{oid} opened" + (f": {title}" if title else "")})
        if closed:
            state = order_state(row.get("status"))
            entries.append({"at": utc_stamp(closed), "station": station, "kind": "done",
                            "text": f"{oid} {'done' if state == 'done' else (row.get('status') or 'closed')}" + (f": {title}" if title else "")})
    entries += customs
    entries.sort(key=lambda e: e["at"], reverse=True)
    return entries[:LOG_KEEP]


# ---------- writing ----------

def atomic_write(out_dir, data, name):
    directory = Path(out_dir)
    directory.mkdir(parents=True, exist_ok=True)
    fd, temp = tempfile.mkstemp(dir=directory, prefix=f".{name}.", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump(data, handle, indent=2, ensure_ascii=False)
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.chmod(temp, 0o644)   # nginx runs as another user and must be able to read it
        os.replace(temp, directory / name)
    finally:
        if os.path.exists(temp):
            os.unlink(temp)


def run_once(env, scratch, now=None):
    now = now or datetime.now(UTC)
    names = read_roster(env.get("ROSTER", "/srv/fixtures/stations.json"))
    rows = read_orders_csv(env.get("ORDERS_CSV", "/data/handoff/orders.csv"))
    if rows is None:   # no order log: write nothing, so the boards keep the last file (or the samples)
        return None
    cards = read_cards(env["KANBAN_DB"], scratch) if env.get("KANBAN_DB") else {}
    answers = read_answers(env.get("ANSWERS", "/data/handoff/answers.jsonl"))
    orders = build_orders(rows, cards, names, now, int(env.get("DAYS", "7")), int(env.get("KEEP", "80")), answers)
    entries = build_log(rows, orders, read_customs(env.get("HANDOFF_LOG", "/data/handoff/handoff-log.csv")), names)
    stamp = utc_stamp(now)
    out = env.get("OUT_DIR", ".")
    atomic_write(out, {"asOf": stamp, "synthetic": False, "orders": orders}, "orders.json")
    atomic_write(out, {"asOf": stamp, "synthetic": False, "entries": entries}, "shiplog.json")
    # Every order on file, any state, for the core terminal (same shape as orders.json).
    records = build_orders(rows, cards, names, now, keep=int(env.get("RECORDS_KEEP", "1000")), answers=answers, archive=True)
    atomic_write(out, {"asOf": stamp, "synthetic": False, "orders": records}, "records.json")
    return orders, entries


def main():
    env = dict(os.environ)
    try:
        interval = float(env.get("INTERVAL", "60"))
    except ValueError:
        interval = 60
    scratch = Path(env.get("SCRATCH", "/scratch"))
    scratch.mkdir(parents=True, exist_ok=True)
    said = None
    while True:
        try:
            written = run_once(env, scratch)
            counts = (len(written[0]), len(written[1])) if written else None
            if counts != said:   # a line when something changed, not every minute
                log(f"wrote {counts[0]} orders and {counts[1]} log lines" if counts else "wrote nothing: no order log")
                said = counts
        except Exception as error:   # one bad minute must not stop the probe
            log(f"ship probe: {error}")
        if interval <= 0:
            return
        time.sleep(interval)


if __name__ == "__main__":
    main()
