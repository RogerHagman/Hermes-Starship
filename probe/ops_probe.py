#!/usr/bin/env python3
"""The Ops probe: writes live/nas.json for the Ops board, about once a minute.

Read-only, like the other probes. It reads the NAS's own numbers and nothing of Hermes':
- /proc/meminfo: RAM and swap. A container sees the whole machine's memory here.
- /proc/stat: how busy the CPU was since the last reading (the first reading has none).
- /proc/uptime: how long the NAS has been up.
- /sys/class/thermal and /sys/class/hwmon: the warmest temperature sensor, when there is one.
- The size of each disk it is told to watch: one statvfs call on a folder or file of that disk,
  mounted read-only. No file on a disk is opened, listed or read.

How fast each disk fills comes from the probe's own history (one reading a day, the last 8 days)
in SCRATCH. The file has the shape of api/schema/nas.schema.json, with "synthetic": false, and is
written atomically. No model runs, and nothing leaves the NAS: the service has no network.

Settings come from the environment:
- HOST_ID, HOST_NAME, HOST_ROLE: how the board names this machine (nas, NAS, ...).
- DISKS: the disks to watch, separated by ";", each "path|id|label|mount": the path inside the
  container, the board's DK- id, its name, and the mount point to show (the NAS's own path).
- PROC, SYS: where /proc and /sys are (tests point them at a folder).
- OUT_DIR, SCRATCH, INTERVAL (seconds; 0 runs once).
Standard library only.
"""
import json
import os
import re
import sys
import tempfile
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

UTC = timezone.utc
GB = 1024 ** 3
DISK_ID = re.compile(r"^DK-\d{3}$")
HISTORY_DAYS = 8


def log(message):
    print(message, file=sys.stderr, flush=True)


def utc_stamp(value):
    return value.astimezone(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def gb(value_bytes):
    return round(value_bytes / GB, 1)


def read_text(path):
    try:
        return Path(path).read_text(encoding="utf-8", errors="replace")
    except OSError:
        return None


# ---------- the machine ----------

def read_memory(proc):
    """(ram, swap) as {usedGb, totalGb}, or (None, None). Used RAM is what programs hold: total minus available."""
    text = read_text(Path(proc) / "meminfo")
    if not text:
        return None, None
    kb = {}
    for line in text.splitlines():
        m = re.match(r"(\w+):\s+(\d+)", line)
        if m:
            kb[m.group(1)] = int(m.group(2)) * 1024
    ram = swap = None
    if kb.get("MemTotal"):
        available = kb.get("MemAvailable", kb.get("MemFree", 0) + kb.get("Buffers", 0) + kb.get("Cached", 0))
        ram = {"usedGb": gb(max(0, kb["MemTotal"] - available)), "totalGb": gb(kb["MemTotal"])}
    if kb.get("SwapTotal"):
        swap = {"usedGb": gb(max(0, kb["SwapTotal"] - kb.get("SwapFree", 0))), "totalGb": gb(kb["SwapTotal"])}
    return ram, swap


def read_cpu_times(proc):
    """(busy, total) jiffies from the first line of /proc/stat, or None."""
    text = read_text(Path(proc) / "stat")
    if not text or not text.startswith("cpu "):
        return None
    numbers = [int(n) for n in text.splitlines()[0].split()[1:]]
    idle = numbers[3] + (numbers[4] if len(numbers) > 4 else 0)   # idle + iowait
    total = sum(numbers[:8])   # guest time is already counted in user
    return total - idle, total


def cpu_percent(before, after):
    if not before or not after or after[1] <= before[1]:
        return None
    return max(0, min(100, round(100 * (after[0] - before[0]) / (after[1] - before[1]))))


def read_uptime_hours(proc):
    text = read_text(Path(proc) / "uptime")
    try:
        return round(float(text.split()[0]) / 3600) if text else None
    except (ValueError, IndexError):
        return None


def read_temperature(sys_dir):
    """The warmest sensor in °C, or None. Readings outside 1..120 °C are ignored (unset sensors)."""
    root = Path(sys_dir)
    found = []
    for pattern in ("class/thermal/thermal_zone*/temp", "class/hwmon/hwmon*/temp*_input"):
        for path in root.glob(pattern):
            text = read_text(path)
            try:
                value = int(text.strip()) / 1000 if text else None
            except ValueError:
                value = None
            if value is not None and 1 <= value <= 120:
                found.append(value)
    return round(max(found)) if found else None


# ---------- the disks ----------

def parse_disks(spec):
    """'path|DK-901|NAS data|/DATA; ...' -> [{path, id, label, mount}]. Bad entries are skipped, with a line in the log."""
    disks = []
    for part in (spec or "").split(";"):
        if not part.strip():
            continue
        fields = [f.strip() for f in part.split("|")]
        if len(fields) != 4 or not DISK_ID.match(fields[1]) or not all(fields):
            log(f"ops probe: skipped disk entry {part.strip()!r} (want path|DK-nnn|label|mount)")
            continue
        disks.append(dict(zip(("path", "id", "label", "mount"), fields)))
    return disks


def read_disk(path):
    """(usedGb, totalGb) of the filesystem that holds path, or None when it can't be read."""
    try:
        st = os.statvfs(path)
    except OSError:
        return None
    total = st.f_blocks * st.f_frsize
    if total <= 0:
        return None
    return gb(total - st.f_bfree * st.f_frsize), gb(total)


def load_history(path):
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except (OSError, ValueError):
        return {}


def remember(history, disk_id, now, used):
    """Keep one reading a day per disk (the first of each day), for the last HISTORY_DAYS days."""
    points = [p for p in history.get(disk_id, []) if isinstance(p, list) and len(p) == 2]
    day = now.strftime("%Y-%m-%d")
    if not points or not points[-1][0].startswith(day):
        points.append([utc_stamp(now), used])
    cutoff = utc_stamp(now - timedelta(days=HISTORY_DAYS))
    history[disk_id] = [p for p in points if p[0] >= cutoff]


def per_day(points, now, used):
    """GB a day from the oldest kept reading to now, once a day has passed. Shrinking counts as 0."""
    if not points:
        return None
    try:
        then = datetime.fromisoformat(points[0][0].replace("Z", "+00:00"))
        days = (now - then).total_seconds() / 86400
        if days < 1:
            return None
        return max(0.0, round((used - float(points[0][1])) / days, 1))
    except (ValueError, TypeError):
        return None


# ---------- one reading ----------

def run_once(env, state, now=None):
    now = now or datetime.now(UTC)
    proc, sys_dir = env.get("PROC", "/proc"), env.get("SYS", "/sys")
    stamp = utc_stamp(now)

    ram, swap = read_memory(proc)
    cpu = read_cpu_times(proc)
    host = {
        "id": env.get("HOST_ID", "nas"),
        "name": env.get("HOST_NAME", "NAS"),
        "role": env.get("HOST_ROLE", "Hermes, the boards and the probes run here."),
        "state": "ok" if ram else "unknown",
        "seenAt": stamp,
    }
    extras = {
        "uptimeH": read_uptime_hours(proc),
        "cpuPct": cpu_percent(state.get("cpu"), cpu),
        "ram": ram,
        "swap": swap,
        "tempC": read_temperature(sys_dir),
    }
    host.update({k: v for k, v in extras.items() if v is not None})
    if not ram:
        host["note"] = "The probe can't read the memory figures."
    state["cpu"] = cpu

    scratch = Path(env.get("SCRATCH", "/scratch"))
    history_file = scratch / "nas-disks.json"
    history = load_history(history_file)
    disks = []
    for d in parse_disks(env.get("DISKS", "")):
        size = read_disk(d["path"])
        if not size:
            log(f"ops probe: can't read the size of {d['id']} ({d['path']})")
            continue
        used, total = size
        rate = per_day(history.get(d["id"]), now, used)
        remember(history, d["id"], now, used)
        disk = {"id": d["id"], "host": host["id"], "label": d["label"], "mount": d["mount"], "usedGb": used, "totalGb": max(1, total)}
        if rate is not None:
            disk["perDayGb"] = rate
        disks.append(disk)
    try:
        atomic_write(scratch, history, "nas-disks.json")
    except OSError as error:
        log(f"ops probe: can't keep the disk history: {error}")

    data = {"asOf": stamp, "synthetic": False, "hosts": [host], "disks": disks}
    atomic_write(env.get("OUT_DIR", "."), data, "nas.json")
    return data


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


def main():
    env = dict(os.environ)
    try:
        interval = float(env.get("INTERVAL", "60"))
    except ValueError:
        interval = 60
    state = {"cpu": read_cpu_times(env.get("PROC", "/proc"))}
    said = None
    while True:
        try:
            data = run_once(env, state)
            summary = (data["hosts"][0]["state"], len(data["disks"]))
            if summary != said:   # a line when something changed, not every minute
                log(f"wrote the NAS reading ({summary[0]}) and {summary[1]} disks")
                said = summary
        except Exception as error:   # one bad minute must not stop the probe
            log(f"ops probe: {error}")
        if interval <= 0:
            return
        time.sleep(interval)


if __name__ == "__main__":
    main()
