# Rails probe

`rails_probe.py` writes `deploy/live/rails.json` about once a minute, and the Bridge reads it
in place of the sample `fixtures/rails.json`. The Rails panel then says LIVE, or STALE when
the file is over five minutes old, or SAMPLE when there is no live file.

It only reads, and it never runs a model:

| Rail | Where the numbers come from |
|---|---|
| Local | One `GET /api/ps` to Ollama: the VRAM the loaded models use, against `VRAM_GB`. No other Ollama call exists in the code, and a test checks that. |
| Codex | The rate-limit records in the newest few Codex session logs: the 5-hour and weekly window use and their resets. A passed reset shows 0. |
| Claude | Not measured yet. Only the burn window, worked out from Hermes' `burn.json`. |

It runs as the `rails-probe` service in `deploy/compose.yaml`: `python:3.12-alpine`, read-only,
no capabilities, 32 MB of RAM (it uses about 15), no ports. It sees the Codex sessions folder
and `burn.json` read-only, and writes only `deploy/live/`.

Settings for the NAS live in `deploy/.env`, which git ignores. Copy `deploy/env.example`.

Tests: `python -m unittest discover -s probe` (CI runs them).

This is Engineering's ORD-1215 probe, with the review fixes: the real NAS paths
(`/DATA/AppData/hermes/...`), only the newest Codex logs opened, the Ollama address out of the
repo, and whole-number percentages.
