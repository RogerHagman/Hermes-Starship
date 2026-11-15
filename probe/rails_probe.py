#!/usr/bin/env python3
"""The rails probe: writes live/rails.json for the Bridge, about once a minute.

Read-only. It looks at three things and changes none of them:
- Local: one GET to Ollama's /api/ps (which models are loaded, and their VRAM). Nothing else
  is ever asked of Ollama, so no model runs.
- Codex: the ChatGPT account's 5-hour and weekly use, asked from OpenAI at most every 5 minutes
  with the Codex sign-in Hermes already keeps in its auth.json (the same answer as Codex's
  /status). The sign-in is only read: never written, refreshed, copied or logged. No model runs.
  If that fails, the newest Codex CLI session logs, marked as an old reading when they are.
- Claude: the account's 5-hour and weekly use, asked from Anthropic at most every 5 minutes
  with the sign-in Claude Code already keeps (the same answer as Claude Code's usage screen).
  The sign-in file is only read: never written, refreshed, copied or logged. No model runs.
  Plus the burn window, from burn.json.

It also keeps live/rail-log.json: a line each time a rail goes out or comes back, so the
page can show which crew went to quarters and when (the Crew Quarters duty log). The probe
only records the rail; the page works out who needed it.

The file has the shape of api/schema/rails.schema.json, with "synthetic": false. It is written
atomically (a temp file, then a rename), so the page never reads half a file. A missing source
never stops the probe: that rail shows what it can and the probe logs one line.

Settings come from the environment: OLLAMA_URL, VRAM_GB, CODEX_SESSIONS, CODEX_SIGNIN (Hermes'
data folder, read-only), BURN_FILE,
CLAUDE_SIGNIN (the .credentials.json Claude Code keeps), CLAUDE_EVERY (seconds between asks, both providers),
OUT_DIR and INTERVAL (seconds; 0 runs once). Standard library only.
"""
import base64
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


LOG_FRESH = 15 * 60   # a log record older than this is shown with its time, as an old reading


def codex_rail(sessions_dir, now, gauge=None):
    """The Codex windows: OpenAI's usage answer first, else the newest Codex session log."""
    rail = {"id": "codex", "label": "Codex", "engine": "codex top, mid and small models", "host": "cloud",
            "state": "up", "meters": [], "note": "Port nacelle. Engineering and food scans."}
    meters, why = gauge.read(now) if gauge else ([], "not set up")
    if meters:
        rail["meters"] = [dict(m) for m in meters]
        rail["note"] += " The whole ChatGPT account, as Codex's /status shows it."
    else:
        found = newest_rate_limits(sessions_dir)
        if found is None:
            rail["note"] = f"Not measured right now: {why or 'no fresh answer'}, and no Codex log has a window record."
            log("codex: no usage answer and no rate-limit record found")
            return rail
        at, primary, secondary = found
        for meter_id, label, window in (("window", "5 h window", primary), ("week", "Week", secondary)):
            reset = datetime.fromtimestamp(float(window["resets_at"]), UTC)
            used = 0 if reset <= now else percent(window["used_percent"])   # a passed reset starts at 0
            rail["meters"].append({"id": meter_id, "label": label, "percent": used, "resetsAt": utc_stamp(reset)})
        if (now - at).total_seconds() > LOG_FRESH:
            stamp = at.astimezone(ZoneInfo(os.environ.get("SHIP_TIMEZONE") or "Europe/Stockholm")).strftime("%a %H:%M")
            rail["note"] = (f"Old reading, from the last Codex log ({stamp}): Codex use through Hermes writes no log. "
                            f"OpenAI's usage answer: {why or 'none yet'}.")
    if any(m["percent"] >= 100 for m in rail["meters"]):
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


class UsageGauge:
    """Asks a provider for the account's usage at most every `every` seconds, and keeps the last answer.

    A subclass names the provider (`name`, `url`, `user_agent`) and says how to find the sign-in
    (`credentials`) and read the answer (`meters_from`). The sign-in is only read, never renewed.
    """
    name, provider, url, user_agent = "usage", "the provider", "", "hermes-starship-rails-probe"

    def __init__(self, signin, every=CLAUDE_EVERY):
        self.signin, self.every = signin, every
        self.wait = every         # seconds until the next ask; longer after the provider says "too many"
        self.asked_at = None      # when we last asked (monotonic seconds)
        self.meters, self.got_at = [], None   # the last good answer and when it came (datetime)
        self.why = "not asked yet"

    def credentials(self, now):   # (headers, "") or (None, why)
        raise NotImplementedError

    def meters_from(self, payload, now):   # the meters, or None for an answer of unknown shape
        raise NotImplementedError

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
        headers, why = self.credentials(now)
        if headers is None:
            self.why = why
            log(f"{self.name} usage: {why}")
            return
        request = Request(self.url, method="GET", headers={
            **headers, "Accept": "application/json", "User-Agent": self.user_agent})
        try:
            with urlopen(request, timeout=8) as response:
                meters = self.meters_from(json.load(response), now)
        except HTTPError as exc:          # the status only: never the request, which holds the token
            self.why = f"{self.provider} answered {exc.code}"
            if exc.code == 429:           # asked too often: wait three times as long before the next ask
                self.wait = self.every * 3
            log(f"{self.name} usage unavailable: HTTP {exc.code}")
            return
        except (OSError, ValueError) as exc:
            self.why = f"{self.provider} did not answer"
            log(f"{self.name} usage unavailable: {type(exc).__name__}")
            return
        if meters is None:
            self.why = f"{self.provider}'s answer has a shape the probe doesn't know"
            log(f"{self.name} usage: unexpected answer")
            return
        self.meters, self.got_at, self.why, self.wait = meters, now, "", self.every


class ClaudeGauge(UsageGauge):
    """The Claude account's 5 h and weekly use, from Anthropic, with Claude Code's sign-in."""
    name, provider, url = "claude", "Anthropic", USAGE_URL

    def credentials(self, now):
        token, why = signin_token(self.signin, now)
        if token is None:
            return None, why
        return {"Authorization": f"Bearer {token}", "anthropic-beta": "oauth-2025-04-20"}, ""

    def meters_from(self, payload, now):
        return usage_meters(payload, now)


# ---------- Codex: OpenAI's usage answer ----------

CODEX_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"   # what Codex's /status and Hermes' /usage ask
CODEX_WINDOWS = {18000: ("window", "5 h window"), 604800: ("week", "Week")}   # by limit_window_seconds
CODEX_POSITIONS = (("primary_window", "window", "5 h window"), ("secondary_window", "week", "Week"))


def jwt_claims(token):
    """The claims of a JWT, without checking its signature (only its expiry and account are read)."""
    try:
        part = token.split(".")[1]
        return json.loads(base64.urlsafe_b64decode(part + "=" * (-len(part) % 4)))
    except (AttributeError, IndexError, ValueError, TypeError):
        return {}


def codex_tokens(store):
    """Every Codex access token in one sign-in file: Hermes' auth.json (its openai-codex sign-in and
    credential pool) or the Codex CLI's own auth.json."""
    if not isinstance(store, dict):
        return []
    found = []
    providers = store.get("providers")
    state = providers.get("openai-codex") if isinstance(providers, dict) else None
    for tokens in (state.get("tokens") if isinstance(state, dict) else None, store.get("tokens")):
        if isinstance(tokens, dict):
            found.append(tokens.get("access_token"))
    pool = store.get("credential_pool")
    entries = pool.get("openai-codex") if isinstance(pool, dict) else None
    if isinstance(entries, list):
        found += [e.get("access_token") for e in entries if isinstance(e, dict)]
    return [t for t in found if isinstance(t, str) and t.count(".") == 2]


def codex_signin(hermes_dir, now):
    """The freshest unexpired Codex access token Hermes keeps, or (None, why). Files are only read."""
    root = Path(hermes_dir)
    files = [root / "auth.json", *sorted(root.glob("profiles/*/auth.json")), root / "home" / ".codex" / "auth.json"]
    best, best_exp, seen = None, 0.0, False
    for path in files:
        try:
            with path.open("r", encoding="utf-8") as handle:
                tokens = codex_tokens(json.load(handle))
        except (OSError, ValueError):
            continue
        for token in tokens:
            seen = True
            try:
                exp = float(jwt_claims(token).get("exp") or 0)
            except (TypeError, ValueError):
                continue
            if exp > now.timestamp() and exp > best_exp:
                best, best_exp = token, exp
    if best:
        return best, ""
    if seen:
        return None, "the Codex sign-in has expired and waits for Hermes to renew it"
    return None, "no Codex sign-in found in Hermes' auth.json"


def codex_meters(payload, now):
    """The meters from OpenAI's usage answer, or None if it doesn't have the shape we know."""
    limits = payload.get("rate_limit") if isinstance(payload, dict) else None
    if not isinstance(limits, dict):
        return None
    meters = {}
    for key, meter_id, label in CODEX_POSITIONS:
        window = limits.get(key)
        if not isinstance(window, dict) or window.get("used_percent") is None:
            continue
        try:   # name the window by its length; the answer puts the week first when it is the only one
            meter_id, label = CODEX_WINDOWS.get(int(window.get("limit_window_seconds")), (meter_id, label))
        except (TypeError, ValueError):
            pass
        reset = None
        try:
            if window.get("reset_at") is not None:
                reset = datetime.fromtimestamp(float(window["reset_at"]), UTC)
            elif window.get("reset_after_seconds") is not None:
                reset = now + timedelta(seconds=float(window["reset_after_seconds"]))
        except (TypeError, ValueError, OverflowError, OSError):
            reset = None
        used = 0 if reset and reset <= now else percent(window["used_percent"])   # a passed reset starts at 0
        meter = {"id": meter_id, "label": label, "percent": used}
        if reset:
            meter["resetsAt"] = utc_stamp(reset)
        meters.setdefault(meter_id, meter)
    if not meters:
        return None
    return [meters[i] for i in ("window", "week") if i in meters]


class CodexGauge(UsageGauge):
    """The ChatGPT account's Codex windows, from OpenAI, with the sign-in Hermes keeps for forge."""
    name, provider, url = "codex", "OpenAI", CODEX_USAGE_URL
    user_agent = "codex-cli"   # the same as Hermes' own /usage ask

    def credentials(self, now):
        token, why = codex_signin(self.signin, now)
        if token is None:
            return None, why
        headers = {"Authorization": f"Bearer {token}"}
        account = jwt_claims(token).get("https://api.openai.com/auth") or {}
        if isinstance(account, dict) and isinstance(account.get("chatgpt_account_id"), str):
            headers["ChatGPT-Account-ID"] = account["chatgpt_account_id"]
        return headers, ""

    def meters_from(self, payload, now):
        return codex_meters(payload, now)


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


# ---------- the rail log: when each rail went out and came back ----------

RAIL_LOG = "rail-log.json"
RAIL_LOG_KEEP = 500   # the newest lines kept; older ones drop off


class RailLog:
    """Remembers each rail's last state and adds a line when it changes between out and not out.

    It starts from the file it wrote before, so a restart neither forgets the history nor
    writes a change that didn't happen. The first time it sees a rail it writes a line only if
    the rail is out, so the page knows those crew are in quarters.
    """

    def __init__(self, out_dir):
        self.path = Path(out_dir) / RAIL_LOG
        self.events = []
        try:
            with self.path.open("r", encoding="utf-8") as handle:
                events = json.load(handle).get("events", [])
            self.events = [e for e in events if isinstance(e, dict) and {"at", "rail", "state"} <= e.keys()]
        except (OSError, ValueError, AttributeError):
            pass   # no log yet, or an unreadable one: start a new one
        self.last = {}
        for event in sorted(self.events, key=lambda e: e["at"]):
            self.last[event["rail"]] = event["state"]

    def note(self, reading):
        """Add a line for every rail that changed. True when something was added."""
        added = False
        for rail in reading["rails"]:
            state = "out" if rail["state"] == "out" else "up"
            before = self.last.get(rail["id"])
            if state != before and (before is not None or state == "out"):
                self.events.insert(0, {"at": reading["asOf"], "rail": rail["id"], "state": state})
                added = True
            self.last[rail["id"]] = state
        del self.events[RAIL_LOG_KEEP:]
        return added

    def file(self, now):
        return {"asOf": utc_stamp(now), "synthetic": False, "events": self.events}


# ---------- the file ----------

def build_reading(ollama_url, vram_gb, codex_sessions, burn_file, now=None, claude=None, codex=None):
    now = now or datetime.now(UTC)
    local_state, vram = read_ollama(ollama_url, vram_gb)
    return {
        "asOf": utc_stamp(now),
        "synthetic": False,
        "rails": [
            {"id": "local", "label": "Local", "engine": "qwen 27B on Ollama", "host": "gpu-host",
             "state": local_state, "meters": [{"id": "vram", "label": "VRAM", "percent": vram}],
             "note": "Warp core. Rule 0 data stays here."},
            codex_rail(codex_sessions, now, codex),
            claude_rail(claude, burn_file, now),
        ],
    }


def atomic_write(out_dir, reading, name="rails.json"):
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
        os.replace(temp, directory / name)
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
    codex = CodexGauge(env("CODEX_SIGNIN", "/data/hermes"), max(every, 60))
    out_dir = env("OUT_DIR", ".")
    rail_log = RailLog(out_dir)
    while True:
        reading = build_reading(env("OLLAMA_URL", ""), env("VRAM_GB", "24"),
                                env("CODEX_SESSIONS", "/data/codex-sessions"), env("BURN_FILE", "/data/burn.json"),
                                claude=claude, codex=codex)
        atomic_write(out_dir, reading)
        if rail_log.note(reading) or not rail_log.path.exists():
            atomic_write(out_dir, rail_log.file(datetime.now(UTC)), RAIL_LOG)
        if interval <= 0:
            return
        time.sleep(interval)


if __name__ == "__main__":
    main()
