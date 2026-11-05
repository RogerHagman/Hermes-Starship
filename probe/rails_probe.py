#!/usr/bin/env python3
"""The rails probe: writes live/rails.json for the Bridge, about once a minute.

Read-only. It looks at three things and changes none of them:
- Local: one GET to Ollama's /api/ps (which models are loaded, and their VRAM). Nothing else
  is ever asked of Ollama, so no model runs.
- Codex: the newest Codex session logs, for the last 5-hour and weekly window use they record.
  Only the few newest files are opened, and only their rate-limit records are read.
- Claude: the account's 5-hour and weekly use, asked from Anthropic at most every 5 minutes
  with the sign-in Claude Code already keeps (the same answer as Claude Code's usage screen).
  The sign-in file is only read: never written, refreshed, copied or logged. No model runs.
  Plus the burn window, from burn.json.

The file has the shape of api/schema/rails.schema.json, with "synthetic": false. It is written
atomically (a temp file, then a rename), so the page never reads half a file. A missing source
never stops the probe: that rail shows what it can and the probe logs one line.

Settings come from the environment: OLLAMA_URL, VRAM_GB, CODEX_SESSIONS, BURN_FILE,
CLAUDE_SIGNIN (the .credentials.json Claude Code keeps), CLAUDE_EVERY (seconds between asks),
OUT_DIR and INTERVAL (seconds; 0 runs once). Standard library only.
"""
import json
import os
import sys
import tempfile
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.error import HTTPError
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


# ---------- Claude: the account's usage windows ----------

USAGE_URL = "https://api.anthropic.com/api/oauth/usage"
CLAUDE_EVERY = 300          # ask at most every 5 minutes
CLAUDE_KEEP = 15 * 60       # show the last answer for up to 15 minutes if a later ask fails
WINDOWS = (("five_hour", "window", "5 h window"), ("seven_day", "week", "Week"))


def signin_token(path, now):
    """The access token from Claude Code's sign-in file, or (None, why). The file is only read."""
    try:
        with Path(path).open("r", encoding="utf-8") as handle:
            oauth = json.load(handle).get("claudeAiOauth") or {}
    except (OSError, ValueError, AttributeError):
        return None, "no Claude sign-in file"
    token, expires = oauth.get("accessToken"), oauth.get("expiresAt")
    if not isinstance(token, str) or not token:
        return None, "no token in the Claude sign-in file"
    try:
        if expires and float(expires) / 1000 <= now.timestamp():
            return None, "the Claude sign-in has expired and waits for Claude Code to renew it"
    except (TypeError, ValueError):
        pass
    return token, ""


def usage_meters(payload, now):
    """The two meters from Anthropic's answer, or None if it doesn't have the shape we know."""
    if not isinstance(payload, dict):
        return None
    meters = []
    for key, meter_id, label in WINDOWS:
        window = payload.get(key)
        if not isinstance(window, dict) or window.get("utilization") is None:
            return None
        reset = parse_time(window.get("resets_at"))
        used = 0 if reset and reset <= now else percent(window["utilization"])   # a passed reset starts at 0
        meter = {"id": meter_id, "label": label, "percent": used}
        if reset:
            meter["resetsAt"] = utc_stamp(reset)
        meters.append(meter)
    return meters


class ClaudeGauge:
    """Asks Anthropic for the Claude usage at most every `every` seconds, and keeps the last answer."""

    def __init__(self, signin, every=CLAUDE_EVERY):
        self.signin, self.every = signin, every
        self.wait = every         # seconds until the next ask; longer after Anthropic says "too many"
        self.asked_at = None      # when we last asked (monotonic seconds)
        self.meters, self.got_at = [], None   # the last good answer and when it came (datetime)
        self.why = "not asked yet"

    def read(self, now, clock=time.monotonic):
        if self.asked_at is None or clock() - self.asked_at >= self.wait:
            self.asked_at = clock()
            self.ask(now)
        if self.got_at and (now - self.got_at).total_seconds() > CLAUDE_KEEP:
            self.meters = []      # too old to show
        if self.got_at:   # an answer kept from an earlier ask: let a passed reset show 0
            for m in self.meters:
                reset = parse_time(m.get("resetsAt"))
                if reset and reset <= now:
                    m["percent"] = 0
        return self.meters, self.why

    def ask(self, now):
        token, why = signin_token(self.signin, now)
        if token is None:
            self.why = why
            log(f"claude usage: {why}")
            return
        request = Request(USAGE_URL, method="GET", headers={
            "Authorization": f"Bearer {token}", "anthropic-beta": "oauth-2025-04-20",
            "Accept": "application/json", "User-Agent": "hermes-starship-rails-probe"})
        try:
            with urlopen(request, timeout=8) as response:
                meters = usage_meters(json.load(response), now)
        except HTTPError as exc:          # the status only: never the request, which holds the token
            self.why = f"Anthropic answered {exc.code}"
            if exc.code == 429:           # asked too often: wait three times as long before the next ask
                self.wait = self.every * 3
            log(f"claude usage unavailable: HTTP {exc.code}")
            return
        except (OSError, ValueError) as exc:
            self.why = "Anthropic did not answer"
            log(f"claude usage unavailable: {type(exc).__name__}")
            return
        if meters is None:
            self.why = "Anthropic's answer has a shape the probe doesn't know"
            log("claude usage: unexpected answer")
            return
        self.meters, self.got_at, self.why, self.wait = meters, now, "", self.every


def claude_rail(gauge, burn_file, now):
    meters, why = gauge.read(now) if gauge else ([], "not set up")
    rail = {"id": "claude", "label": "Claude", "engine": "claude top and mid models", "host": "cloud",
            "state": "out" if any(m["percent"] >= 100 for m in meters) else "up",
            "meters": [dict(m) for m in meters], "burn": claude_burn(burn_file, now),
            "note": "Starboard nacelle. The whole account: claude.ai chats count too."}
    if not meters:
        rail["note"] = f"Not measured right now: {why or 'no fresh answer'}."
    return rail


# ---------- Claude: the burn window ----------

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

def build_reading(ollama_url, vram_gb, codex_sessions, burn_file, now=None, claude=None):
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
            claude_rail(claude, burn_file, now),
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
    try:
        every = float(env("CLAUDE_EVERY", str(CLAUDE_EVERY)))
    except ValueError:
        every = CLAUDE_EVERY
    claude = ClaudeGauge(env("CLAUDE_SIGNIN", "/data/claude/.credentials.json"), max(every, 60))
    while True:
        reading = build_reading(env("OLLAMA_URL", ""), env("VRAM_GB", "24"),
                                env("CODEX_SESSIONS", "/data/codex-sessions"), env("BURN_FILE", "/data/burn.json"),
                                claude=claude)
        atomic_write(env("OUT_DIR", "."), reading)
        if interval <= 0:
            return
        time.sleep(interval)


if __name__ == "__main__":
    main()
