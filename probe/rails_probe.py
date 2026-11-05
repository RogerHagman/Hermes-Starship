#!/usr/bin/env python3
"""The rails probe: writes live/rails.json for the Bridge, about once a minute.

Read-only. It looks at three things and changes none of them:
- Local: one GET to Ollama's /api/ps (which models are loaded, and their VRAM). Nothing else
  is ever asked of Ollama, so no model runs.
- Codex: the newest Codex session logs, for the last 5-hour and weekly window use they record.
  Only the few newest files are opened, and only their rate-limit records are read.
- Claude: not measured yet. Only the burn window, from burn.json.

The file has the shape of api/schema/rails.schema.json, with "synthetic": false. It is written
atomically (a temp file, then a rename), so the page never reads half a file. A missing source
never stops the probe: that rail shows what it can and the probe logs one line.

Settings come from the environment: OLLAMA_URL, VRAM_GB, CODEX_SESSIONS, BURN_FILE, OUT_DIR
and INTERVAL (seconds; 0 runs once). Standard library only.
"""
import json
import os
import sys
import tempfile
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

UTC = timezone.utc
NEWEST_FILES = 5   # how many of the newest Codex session logs to open


def log(message):
    print(message, file=sys.stderr, flush=True)


def utc_stamp(value):
    """A UTC time in the fixture format, to the second."""
    return value.astimezone(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def percent(value):
    """A whole-number percent between 0 and 100. Anything unreadable is 0."""
    try:
        return max(0, min(100, round(float(value))))
    except (TypeError, ValueError, OverflowError):
        return 0


def parse_time(value):
    if not isinstance(value, str):
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    return (parsed if parsed.tzinfo else parsed.replace(tzinfo=UTC)).astimezone(UTC)


# ---------- Local: Ollama ----------

def read_ollama(ollama_url, vram_gb):
    """('up', VRAM percent) if Ollama answers /api/ps within 3 seconds, else ('out', 0)."""
    if not ollama_url:
        log("ollama: OLLAMA_URL is not set")
        return "out", 0
    try:
        capacity = float(vram_gb) * 1024 ** 3
        if capacity <= 0:
            raise ValueError("VRAM_GB must be above 0")
        with urlopen(Request(ollama_url.rstrip("/") + "/api/ps", method="GET"), timeout=3) as response:
            payload = json.load(response)
        models = payload.get("models", []) if isinstance(payload, dict) else None
        if not isinstance(models, list):
            raise ValueError("unexpected answer from /api/ps")
        used = sum(int(m.get("size_vram", 0) or 0) for m in models if isinstance(m, dict))
        return "up", percent(used * 100 / capacity)
    except (OSError, ValueError, TypeError) as exc:   # URLError and JSONDecodeError are among these
        log(f"ollama unavailable: {exc}")
        return "out", 0


# ---------- Codex: the newest session logs ----------

def newest_logs(sessions_dir, count=NEWEST_FILES):
    """The newest .jsonl files under the sessions folder, newest first."""
    try:
        files = [(p.stat().st_mtime, p) for p in Path(sessions_dir).rglob("*.jsonl")]
    except OSError as exc:
        log(f"codex sessions unavailable: {exc}")
        return []
    return [p for _, p in sorted(files, key=lambda f: f[0], reverse=True)[:count]]


def rate_limits(record):
    """(time, primary, secondary) from one log line, or None if it isn't a full rate-limit record."""
    if not isinstance(record, dict) or record.get("type") != "event_msg":
        return None
    payload = record.get("payload")
    if not isinstance(payload, dict) or payload.get("type") != "token_count":
        return None
    limits = payload.get("rate_limits")
    at = parse_time(record.get("timestamp"))
    if not isinstance(limits, dict) or at is None:
        return None
    windows = limits.get("primary"), limits.get("secondary")
    try:
        for w in windows:
            float(w["used_percent"])
            datetime.fromtimestamp(float(w["resets_at"]), UTC)
    except (KeyError, TypeError, ValueError, OverflowError, OSError):
        return None
    return at, windows[0], windows[1]


def newest_rate_limits(sessions_dir):
    """The newest full rate-limit record in the newest few logs, or None."""
    newest = None
    for path in newest_logs(sessions_dir):
        try:
            with path.open("r", encoding="utf-8") as handle:
                for line in handle:
                    if '"rate_limits"' not in line:
                        continue   # skip everything else without parsing it
                    try:
                        found = rate_limits(json.loads(line))
                    except json.JSONDecodeError:
                        continue
                    if found and (newest is None or found[0] > newest[0]):
                        newest = found
        except (OSError, UnicodeError):
            continue
    return newest


def codex_rail(sessions_dir, now):
    rail = {"id": "codex", "label": "Codex", "engine": "codex top, mid and small models", "host": "cloud",
            "state": "up", "meters": [], "note": "Port nacelle. Engineering and food scans."}
    found = newest_rate_limits(sessions_dir)
    if found is None:
        rail["note"] += " No Codex window record found."
        log("codex: no rate-limit record found")
        return rail
    _, primary, secondary = found
    for meter_id, label, window in (("window", "5 h window", primary), ("week", "Week", secondary)):
        reset = datetime.fromtimestamp(float(window["resets_at"]), UTC)
        used = 0 if reset <= now else percent(window["used_percent"])   # a passed reset starts at 0
        rail["meters"].append({"id": meter_id, "label": label, "percent": used, "resetsAt": utc_stamp(reset)})
        if used >= 100:
            rail["state"] = "out"
    return rail


# ---------- Claude: the burn window only ----------

DAYS = ("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday")


def claude_burn(burn_file, now):
    """Whether the burn window from burn.json is open now, and until when. Usage isn't guessed."""
    try:
        with Path(burn_file).open("r", encoding="utf-8") as handle:
            config = json.load(handle)
        if "claude" not in config.get("allowed_rails", []):
            return {"active": False}
        zone = ZoneInfo(config["timezone"])
        hour, minute = (int(part) for part in config["reset_time"].split(":", 1))
        local = now.astimezone(zone)
        ahead = (DAYS.index(config["reset_day"].lower()) - local.weekday()) % 7
        reset = (local + timedelta(days=ahead)).replace(hour=hour, minute=minute, second=0, microsecond=0)
        if reset <= local:
            reset += timedelta(days=7)
        if reset - timedelta(hours=float(config["window_hours"])) <= local < reset:
            return {"active": True, "until": utc_stamp(reset)}
        return {"active": False}
    except (OSError, KeyError, TypeError, ValueError, AttributeError) as exc:
        log(f"burn schedule unavailable: {exc}")
        return {"active": False}


# ---------- the file ----------

def build_reading(ollama_url, vram_gb, codex_sessions, burn_file, now=None):
    now = now or datetime.now(UTC)
    local_state, vram = read_ollama(ollama_url, vram_gb)
    return {
        "asOf": utc_stamp(now),
        "synthetic": False,
        "rails": [
            {"id": "local", "label": "Local", "engine": "qwen 27B on Ollama", "host": "gpu-host",
             "state": local_state, "meters": [{"id": "vram", "label": "VRAM", "percent": vram}],
             "note": "Warp core. Rule 0 data stays here."},
            codex_rail(codex_sessions, now),
            {"id": "claude", "label": "Claude", "engine": "claude top and mid models", "host": "cloud",
             "state": "up", "meters": [], "burn": claude_burn(burn_file, now), "note": "Not measured yet"},
        ],
    }


def atomic_write(out_dir, reading):
    directory = Path(out_dir)
    directory.mkdir(parents=True, exist_ok=True)
    fd, temp = tempfile.mkstemp(dir=directory, prefix=".rails.", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump(reading, handle, indent=2)
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.chmod(temp, 0o644)   # nginx runs as another user and must be able to read it
        os.replace(temp, directory / "rails.json")
    finally:
        if os.path.exists(temp):
            os.unlink(temp)


def main():
    env = os.environ.get
    try:
        interval = float(env("INTERVAL", "60"))
    except ValueError:
        interval = 60
    while True:
        reading = build_reading(env("OLLAMA_URL", ""), env("VRAM_GB", "24"),
                                env("CODEX_SESSIONS", "/data/codex-sessions"), env("BURN_FILE", "/data/burn.json"))
        atomic_write(env("OUT_DIR", "."), reading)
        if interval <= 0:
            return
        time.sleep(interval)


if __name__ == "__main__":
    main()
