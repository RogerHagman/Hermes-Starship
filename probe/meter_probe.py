#!/usr/bin/env python3
"""The meter probe: writes live/meters.json for the Science lab, every few minutes.

Read-only, with no network at all. It reads four things and changes none of them:
- Hermes' session records (state.db of the default profile and of every profile under
  profiles/): each session's model, provider, start time and token counts (input, cached,
  output, reasoning), its call count and its cost where Hermes has a price. Only those number
  columns are selected: never a message, a prompt or a title. The file is opened read-only as
  immutable, so SQLite takes no lock and writes nothing, not even a -shm file. The cost of that:
  the newest few seconds still in Hermes' -wal file show on the next read.
- handoff-log.csv: each hand-off to a cloud rail, with its tokens, cost and wall time.
- leak-kpis.csv (the leak-kpis.py script's output): one row per card run, with its tokens and
  the tokens lost to polling, the usage wall and restarts. The probe adds them up per week.
  The column names are matched loosely, and the file says which ones it used ("basis").
- The speed trials' own history (speed-trials.json, written by speed_trial.py, which is run by
  hand): time to first token and tokens a second on the local rail.

Spend is counted over four windows: today, the last 7 days, the last 30 days and everything.
Days start at midnight in Stockholm.

The file has the shape of api/schema/meters.schema.json, with "synthetic": false, written
atomically. A missing source never stops the probe: its meter is empty and "sources" says why.

Settings come from the environment: STATE_DBS (state.db files, ';'-separated, '*' allowed),
HANDOFF_LOG, LEAK_CSV, TRIALS, ROSTER, OUT_DIR and INTERVAL (seconds; 0 runs once).
Standard library only.
"""
import csv
import glob
import json
import os
import re
import sqlite3
import sys
import tempfile
import time
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

UTC = timezone.utc
HOME = ZoneInfo("Europe/Stockholm")
WINDOWS = [("day", "Today"), ("week", "Last 7 days"), ("month", "Last 30 days"), ("all", "Everything")]
RAILS = ["local", "codex", "claude", "other"]
LEAK_WEEKS = 12
TRIALS_KEEP = 30
STATIONS_KEEP = 12
# The number columns of Hermes' sessions table the probe may read. Anything else is never selected.
SESSION_COLUMNS = {
    "id", "source", "model", "billing_provider", "billing_base_url", "started_at",
    "input_tokens", "output_tokens", "cache_read_tokens", "reasoning_tokens",
    "api_call_count", "estimated_cost_usd", "actual_cost_usd",
}


def log(message):
    print(message, file=sys.stderr, flush=True)


def utc_stamp(value):
    return value.astimezone(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def parse_time(value):
    """ISO text, or seconds (or milliseconds) since 1970."""
    if value is None or value == "":
        return None
    if isinstance(value, (int, float)) or (isinstance(value, str) and re.fullmatch(r"\d{9,13}(\.\d+)?", value.strip())):
        number = float(value)
        try:
            return datetime.fromtimestamp(number / 1000 if number > 1e11 else number, UTC)
        except (OverflowError, OSError, ValueError):
            return None
    try:
        parsed = datetime.fromisoformat(str(value).strip().replace("Z", "+00:00"))
    except ValueError:
        return None
    return (parsed if parsed.tzinfo else parsed.replace(tzinfo=UTC)).astimezone(UTC)


def whole(value):
    """A count from a cell: 1,234 or 1234.0 or empty. Anything unreadable is 0."""
    try:
        return max(0, int(float(str(value).replace(",", "").replace("_", "").strip() or 0)))
    except (TypeError, ValueError, OverflowError):
        return 0


def money(value):
    try:
        number = float(str(value).replace("$", "").strip())
    except (TypeError, ValueError):
        return None
    return number if number >= 0 else None


def source(state, note, read_at=None):
    out = {"state": state, "note": note}
    if read_at:
        out["readAt"] = utc_stamp(read_at)
    return out


# ---------- windows and rails ----------

def window_starts(now):
    """{window id: start (UTC) or None}. Days start at midnight in Stockholm."""
    midnight = now.astimezone(HOME).replace(hour=0, minute=0, second=0, microsecond=0)
    return {"day": midnight.astimezone(UTC), "week": (midnight - timedelta(days=6)).astimezone(UTC),
            "month": (midnight - timedelta(days=29)).astimezone(UTC), "all": None}


def windows_of(at, starts):
    return [w for w, start in starts.items() if start is None or (at is not None and at >= start)]


def rail_of(*hints):
    """Which rail a model, provider or base URL belongs to."""
    text = " ".join(str(h or "") for h in hints).lower()
    if not text.strip():
        return "other"
    if "claude" in text or "anthropic" in text:
        return "claude"
    if "codex" in text or "openai" in text or "chatgpt" in text or re.search(r"\bgpt-", text):
        return "codex"
    if any(w in text for w in ("ollama", "qwen", "llama", "gemma", "mistral", "11434", "local", "custom")):
        return "local"
    return "other"


# ---------- the roster: which profile is which station ----------

def read_roster(path):
    """{profile name: station id}. Number One runs on the default profile."""
    names = {"default": "xo"}
    try:
        with open(path, encoding="utf-8") as handle:
            stations = json.load(handle)["stations"]
    except (OSError, ValueError, KeyError, TypeError) as error:
        log(f"roster: {error}")
        return names
    for s in stations:
        profile = (s.get("profile") or "").split(" ")[0]
        if profile and profile not in ("the", "none", "not", "shared"):
            names.setdefault(profile, s["id"])
        names.setdefault(s["id"], s["id"])
    return names


def profile_of(path):
    """'…/profiles/forge/state.db' -> 'forge'; the top-level state.db is the default profile."""
    parts = Path(path).parts
    return parts[-2] if len(parts) >= 3 and parts[-3] == "profiles" else "default"


# ---------- Hermes' session records ----------

def read_sessions(path):
    """The sessions in one state.db: dicts of the number columns only. Raises on an unreadable file."""
    uri = f"file:{Path(path).as_posix()}?mode=ro&immutable=1"
    con = sqlite3.connect(uri, uri=True, timeout=1)
    try:
        have = {row[1] for row in con.execute("pragma table_info(sessions)")}
        if not have:
            raise ValueError("no sessions table")
        cols = sorted(SESSION_COLUMNS & have)
        con.row_factory = sqlite3.Row
        return [dict(r) for r in con.execute(f"select {', '.join(cols)} from sessions")]
    finally:
        con.close()


def blank_spend():
    return {"sessions": 0, "calls": 0, "input": 0, "cached": 0, "output": 0, "reasoning": 0, "costUsd": 0.0,
            "_calls": False, "_cost": False}


def add_session(total, s):
    total["sessions"] += 1
    total["input"] += whole(s.get("input_tokens"))
    total["cached"] += whole(s.get("cache_read_tokens"))
    total["output"] += whole(s.get("output_tokens"))
    total["reasoning"] += whole(s.get("reasoning_tokens"))
    if s.get("api_call_count") is not None:
        total["calls"] += whole(s.get("api_call_count"))
        total["_calls"] = True
    cost = money(s.get("actual_cost_usd"))
    cost = cost if cost is not None else money(s.get("estimated_cost_usd"))
    if cost is not None:
        total["costUsd"] += cost
        total["_cost"] = True


def finish(total):
    out = {k: v for k, v in total.items() if not k.startswith("_")}
    if not total["_calls"]:
        out.pop("calls")
    if total["_cost"] and total["costUsd"] > 0:
        out["costUsd"] = round(total["costUsd"], 2)
    else:
        out.pop("costUsd")
    return out


def build_spend(paths, names, now):
    """(spend rows, station rows, source) from every state.db found."""
    starts = window_starts(now)
    by = {}
    stations = {}
    read, failed = 0, []
    for path in paths:
        try:
            sessions = read_sessions(path)
        except (sqlite3.Error, OSError, ValueError) as error:
            failed.append(f"{profile_of(path)}: {error}")
            continue
        read += 1
        station = names.get(profile_of(path), profile_of(path))
        for s in sessions:
            at = parse_time(s.get("started_at"))
            rail = rail_of(s.get("billing_provider"), s.get("model"), s.get("billing_base_url"))
            for w in windows_of(at, starts):
                add_session(by.setdefault((rail, w), blank_spend()), s)
            if at is not None and at >= starts["week"]:
                add_session(stations.setdefault((station, rail), blank_spend()), s)
    spend = [dict(rail=r, window=w, **finish(by[(r, w)])) for r in RAILS for w, _ in WINDOWS if (r, w) in by]
    rows = []
    for (station, rail), t in stations.items():
        row = {"station": station, "rail": rail, "sessions": t["sessions"], "tokens": t["input"] + t["output"]}
        if t["_cost"] and t["costUsd"] > 0:
            row["costUsd"] = round(t["costUsd"], 2)
        rows.append(row)
    rows.sort(key=lambda r: (-r["tokens"], r["station"]))
    if not paths:
        src = source("missing", "No Hermes session records (state.db) found.")
    elif not read:
        src = source("error", "Could not read the session records: " + "; ".join(failed))
    else:
        note = f"{read} profile{'s' if read != 1 else ''} read"
        src = source("read", note + (f"; could not read {'; '.join(failed)}" if failed else "") + ".", now)
    return spend, rows[:STATIONS_KEEP], src


# ---------- hand-offs ----------

def build_handoffs(path, now):
    """Per rail and window: hand-offs, tokens, wall time, cost and tokens per wall second."""
    starts = window_starts(now)
    by = {}
    try:
        with open(path, newline="", encoding="utf-8") as handle:
            rows = list(csv.DictReader(handle))
    except FileNotFoundError:
        return [], source("missing", "No hand-off log yet.")
    except (OSError, UnicodeError, csv.Error) as error:
        return [], source("error", f"Could not read the hand-off log: {error}")
    for row in rows:
        row = {(k or "").strip(): (v or "").strip() for k, v in row.items()}
        at = parse_time(row.get("sent_at")) or parse_time(row.get("returned_at"))
        rail = rail_of(row.get("rail"))
        for w in windows_of(at, starts):
            t = by.setdefault((rail, w), {"count": 0, "tokens": 0, "wallS": 0.0, "costUsd": 0.0, "_cost": False,
                                          "_rateTokens": 0, "_rateS": 0.0})
            tokens, wall, cost = whole(row.get("usage_tokens")), money(row.get("wall_time_s")) or 0.0, money(row.get("usage_cost"))
            t["count"] += 1
            t["tokens"] += tokens
            t["wallS"] += wall
            if cost is not None and row.get("usage_cost"):
                t["costUsd"] += cost
                t["_cost"] = True
            if tokens and wall:   # only hand-offs with both, so a missing count doesn't drag the rate down
                t["_rateTokens"] += tokens
                t["_rateS"] += wall
    out = []
    for r in RAILS:
        for w, _ in WINDOWS:
            t = by.get((r, w))
            if not t:
                continue
            row = {"rail": r, "window": w, "count": t["count"], "tokens": t["tokens"], "wallS": round(t["wallS"], 1)}
            if t["_cost"] and t["costUsd"] > 0:
                row["costUsd"] = round(t["costUsd"], 2)
            if t["_rateS"] > 0:
                row["tokensPerSec"] = round(t["_rateTokens"] / t["_rateS"], 1)
            out.append(row)
    return out, source("read", f"{len(rows)} hand-offs on file.", now)


# ---------- the leak share ----------

def norm(name):
    return re.sub(r"[^a-z0-9]+", "_", str(name or "").strip().lower()).strip("_")


def pick(columns, *names):
    """The first of these column names the file has."""
    return next((n for n in names if n in columns), None)


def leak_basis(columns):
    """How to read tokens and leak tokens from this file's columns: (date column, all tokens, leak tokens, basis text)."""
    day = pick(columns, "date", "day", "started_at", "run_date", "start", "started")
    total_col = pick(columns, "total_tokens", "tokens", "all_tokens")
    inp = pick(columns, "input", "input_tokens")
    out = pick(columns, "output", "output_tokens")
    if total_col:
        total, total_text = (lambda r: whole(r.get(total_col))), total_col
    elif inp:
        total = lambda r: whole(r.get(inp)) + (whole(r.get(out)) if out else 0)   # noqa: E731
        total_text = f"{inp} + {out}" if out else inp
    else:
        return None
    leak_col = pick(columns, "leak_tokens", "leak")
    wait = pick(columns, "wait_tokens", "wait_call_tokens", "polling_tokens")
    restart = pick(columns, "restart_overhead_tokens", "restart_overhead", "restart_tokens")
    wall = pick(columns, "wall_tokens", "wall_run_tokens")
    if leak_col:
        leak, leak_text = (lambda r: whole(r.get(leak_col))), leak_col
    elif wait or restart:
        # v2 (ORD-1202): wait tokens plus restart overhead, counted once. A wall run's own work isn't leak.
        parts = [c for c in (wait, restart) if c]
        if "overhead" not in (restart or "") and wall:
            parts.append(wall)   # v1 file: wait + wall + restart tokens
        leak = lambda r: sum(whole(r.get(c)) for c in parts)   # noqa: E731
        leak_text = " + ".join(parts)
    else:
        return None
    return day, total, leak, f"leak = {leak_text}; all = {total_text}"


def iso_week(d):
    year, week, _ = d.isocalendar()
    return f"{year}-W{week:02d}", (d - timedelta(days=d.weekday())).isoformat()


def build_leak(path, now):
    try:
        with open(path, newline="", encoding="utf-8") as handle:
            reader = csv.DictReader(handle)
            columns = [norm(c) for c in (reader.fieldnames or [])]
            rows = [{norm(k): (v or "").strip() for k, v in row.items() if k} for row in reader]
    except FileNotFoundError:
        return {"basis": "", "weeks": []}, source("missing", "No leak-kpis.csv yet: leak-kpis.py hasn't written one.")
    except (OSError, UnicodeError, csv.Error) as error:
        return {"basis": "", "weeks": []}, source("error", f"Could not read leak-kpis.csv: {error}")
    basis = leak_basis(set(columns))
    if not basis or not basis[0]:
        return {"basis": "", "weeks": []}, source("error", "leak-kpis.csv has no date, token or leak columns the probe knows: " + ", ".join(columns[:20]))
    day_col, total, leak, text = basis
    weeks = {}
    for row in rows:
        at = parse_time(row.get(day_col))
        if at is None:
            try:
                at = datetime.combine(date.fromisoformat(row.get(day_col, "")[:10]), datetime.min.time(), UTC)
            except ValueError:
                continue
        week, start = iso_week(at.astimezone(HOME).date())
        w = weeks.setdefault(week, {"week": week, "from": start, "runs": 0, "unmatched": 0, "tokens": 0, "leakTokens": 0})
        w["runs"] += 1
        if any("unmatched" in str(v).lower() for v in row.values()):
            w["unmatched"] += 1
            continue
        w["tokens"] += total(row)
        w["leakTokens"] += min(leak(row), total(row)) if total(row) else 0
    out = []
    for w in sorted(weeks.values(), key=lambda x: x["week"], reverse=True)[:LEAK_WEEKS]:
        w["share"] = round(w["leakTokens"] * 100 / w["tokens"], 1) if w["tokens"] else 0.0
        if not w["unmatched"]:
            w.pop("unmatched")
        out.append(w)
    return {"basis": text, "weeks": out}, source("read", f"{len(rows)} card runs in leak-kpis.csv.", now)


# ---------- the speed trials ----------

def read_trials(path):
    try:
        with open(path, encoding="utf-8") as handle:
            trials = json.load(handle).get("trials", [])
    except FileNotFoundError:
        return [], source("missing", "No speed trial run yet. Run the speed-trial service to measure the local rail.")
    except (OSError, ValueError, AttributeError) as error:
        return [], source("error", f"Could not read the speed trials: {error}")
    good = [t for t in trials if isinstance(t, dict) and isinstance(t.get("id"), str) and isinstance(t.get("at"), str)]
    good.sort(key=lambda t: t["at"], reverse=True)
    return good[:TRIALS_KEEP], source("read", f"{len(good)} speed trials on file.")


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


def state_dbs(spec):
    paths = []
    for part in (spec or "").split(";"):
        part = part.strip()
        if part:
            paths += sorted(glob.glob(part)) if any(c in part for c in "*?[") else ([part] if os.path.exists(part) else [])
    return list(dict.fromkeys(paths))


def build(env, now=None):
    now = now or datetime.now(UTC)
    names = read_roster(env["ROSTER"]) if env.get("ROSTER") else {"default": "xo"}
    spend, stations, s_src = build_spend(state_dbs(env.get("STATE_DBS", "")), names, now)
    handoffs, h_src = build_handoffs(env["HANDOFF_LOG"], now) if env.get("HANDOFF_LOG") else ([], source("missing", "HANDOFF_LOG is not set."))
    leak, l_src = build_leak(env["LEAK_CSV"], now) if env.get("LEAK_CSV") else ({"basis": "", "weeks": []}, source("missing", "LEAK_CSV is not set."))
    trials, t_src = read_trials(env["TRIALS"]) if env.get("TRIALS") else ([], source("missing", "TRIALS is not set."))
    starts = window_starts(now)
    windows = [dict(id=w, label=label, **({"from": utc_stamp(starts[w])} if starts[w] else {})) for w, label in WINDOWS]
    return {"asOf": utc_stamp(now), "synthetic": False,
            "sources": {"sessions": s_src, "handoffs": h_src, "leak": l_src, "trials": t_src},
            "windows": windows, "spend": spend, "stations": stations, "handoffs": handoffs, "leak": leak, "trials": trials}


def main():
    env = dict(os.environ)
    try:
        interval = float(env.get("INTERVAL", "300"))
    except ValueError:
        interval = 300
    said = None
    while True:
        try:
            data = build(env)
            atomic_write(env.get("OUT_DIR", "/out"), data, "meters.json")
            summary = " · ".join(f"{k} {v['state']}" for k, v in data["sources"].items())
            if summary != said:   # a line when something changed, not every run
                log(f"wrote meters.json: {summary}")
                said = summary
        except Exception as error:   # one bad run must not stop the probe
            log(f"meter probe: {error}")
        if interval <= 0:
            return
        time.sleep(interval)


if __name__ == "__main__":
    main()
