# Rails probe

`rails_probe.py` writes `deploy/live/rails.json` about once a minute, and the Bridge reads it
in place of the sample `fixtures/rails.json`. The Rails panel then says LIVE, or STALE when
the file is over five minutes old, or SAMPLE when there is no live file.

It only reads, and it never runs a model:

| Rail | Where the numbers come from |
|---|---|
| Local | One `GET /api/ps` to Ollama: the VRAM the loaded models use, against `VRAM_GB`. No other Ollama call exists in the code, and a test checks that. |
| Codex | The rate-limit records in the newest few Codex session logs: the 5-hour and weekly window use and their resets. A passed reset shows 0. |
| Claude | The account's 5-hour and weekly use and their resets, asked from Anthropic at most every 5 minutes (3 times longer after a "too many" answer) with the sign-in Claude Code already keeps for the ship's Claude stations. It is the same answer as Claude Code's usage screen, and claude.ai chats count too. The sign-in file is only read: never written, renewed, copied or logged, and a test checks the token never reaches the log or the file. An expired sign-in is not used; the rail says why until Claude Code renews it. Plus the burn window, from Hermes' `burn.json`. |

It runs as the `rails-probe` service in `deploy/compose.yaml`: `python:3.12-alpine`, read-only,
no capabilities, 32 MB of RAM (it uses about 15), no ports. It sees the Codex sessions folder,
`burn.json` and Claude Code's sign-in folder read-only, and writes only `deploy/live/`.

Settings for the NAS live in `deploy/.env`, which git ignores. Copy `deploy/env.example`.

Tests: `python -m unittest discover -s probe` (CI runs them).

This is Engineering's ORD-1215 probe, with the review fixes: the real NAS paths
(`/DATA/AppData/hermes/...`), only the newest Codex logs opened, the Ollama address out of the
repo, and whole-number percentages.
