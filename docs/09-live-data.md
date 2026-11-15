# Live data: what the probes read

The boards start on the sample data in `fixtures/`. Each probe replaces one part with a live file in `deploy/live/`, and a part with no live file keeps its sample. This page lists every file the probes read, in Hermes's data folder (`HERMES_DATA_HOST`, which is `/opt/data` inside Hermes), so you can bring a part live on your own setup. You don't need the original ship's patches for this. You only need something that writes these files in these shapes.

Rules that hold for every source:

- **Missing is fine.** A probe that can't find a file logs one line and writes what it can. That board stays on its sample.
- **Read-only.** No probe changes a Hermes file. SQLite databases are copied or opened as immutable.
- **Headers by name.** CSV files are read by header name, so the column order doesn't matter and extra columns are ignored. Times are UTC ISO 8601 (`2026-11-15T13:00:00Z`) unless a column says `_local`.
- **What a board shows** is fixed by the schema in [`api/schema/`](../api/schema/). Each live file is checked against the same schema as its sample.

## A first test in five minutes

You can see a board go live before you have a crew. With the live stack running (README, "Going live"), write one order by hand into your Hermes data folder:

```sh
mkdir -p "$HERMES_DATA_HOST/handoff"
printf 'order_id,received_at,from_surface,station,kind,status,closed_at,speed\nORD-1001,%s,desktop,forge,ask,open,,\n' \
  "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$HERMES_DATA_HOST/handoff/orders.csv"
```

Within a minute the ship probe writes `deploy/live/orders.json`. Reload the Bridge: the ORDERS chip turns from SAMPLE to live, and ORD-1001 shows as queued at Engineering (`forge` is the Chief Engineer's profile in `fixtures/stations.json`). To go back to the sample, delete both `handoff/orders.csv` and `deploy/live/orders.json`.

## What a stock Hermes gives you, and what you add

A stock Hermes Agent already writes some of what the probes read. The rest came from the original ship's patches, and you can produce it your own way.

| Part | On a stock Hermes | What to add |
|---|---|---|
| Host readings (Ops) | Works | Nothing |
| Local rail (Rails) | Works with Ollama | Set `OLLAMA_URL` |
| Cloud rails' usage (Rails) | Works when the sign-in files are inside the data folder (`home/.claude/` for Claude Code, Hermes's `auth.json` for Codex) | Nothing, or point Claude Code's config folder there |
| Spend meters (Science lab) | Works: Hermes keeps the `sessions` table in `state.db` itself | Name your profiles in `fixtures/stations.json` |
| Kanban cards | Hermes keeps `kanban.db` itself | Cards join an order only when their title carries its `ORD-` number |
| Orders and the ship's log | Not there | Something that appends a row to `handoff/orders.csv` when a message arrives, and sets `status` to `done` when its work is finished |
| Yeoman's list | Not there | The five CSV files in `yeoman/`, written by a skill, a script, or by hand |
| Helm's tracker | Not there | The three CSV files in `helm/app-tracker/` |
| Customs lines, speed, leak share | Not there | `handoff/handoff-log.csv`, one row per hand-off to a cloud rail |
| Burn window | Not there | A small `handoff/burn.json`, written once by hand |

**Hints for the order log**, the part most boards depend on:

- **Let code write it, not the model.** The original ship first let the model mint order numbers. It was slow and it reused numbers. A hook that runs when a message arrives (Hermes loads hooks from its data folder) can append the row in milliseconds. See capability 1 in [patches/catalogue.md](../patches/catalogue.md) for the behaviour and its tests, and [03-orders-and-cards.md](03-orders-and-cards.md) for the design.
- **Start smaller if you like.** A script that scans `kanban.db` every minute and writes one `orders.csv` row per card (inventing an `ORD-` number and putting it in the card's title) gets the Bridge live without touching Hermes's code.
- **Closing matters.** An order stays "in flight" until its row says `done` and has a `closed_at`. The original ship closes it from a hook on card completion.
- **Ask your own crew.** Each row in the table above is a well-sized first job for your Chief Engineer: hand it this page and the matching catalogue entry as the brief.

## Without Hermes data at all

| Part | Probe | Source |
|---|---|---|
| Ops: host memory, CPU, uptime, temperature, disks | `ops-probe` | `/proc`, `/sys`, and one `statvfs` per disk (`OPS_DISKS`) |
| Rails: local GPU use | `rails-probe` | `GET /api/ps` on `OLLAMA_URL` |
| Holodeck Review bay | `holo-probe` | GitHub, with a read-only sign-in (`GITHUB_READ`, `STARSHIP_REPO`) |
| Science lab: local speed | `speed-trial` (run by hand) | The model Ollama has loaded |

These work on any host with nothing else set up.

## Orders and the ship's log (`ship-probe`)

**`handoff/orders.csv`**: one row per order (later rows for the same order win).

| Column | Meaning |
|---|---|
| `order_id` | `ORD-<number>` |
| `received_at` | When the message came in |
| `from_surface` | `telegram`, `desktop`, `dashboard`, ... |
| `station` | The Hermes profile it went to (mapped to a station through [`fixtures/stations.json`](../fixtures/stations.json)) |
| `kind` | Free text. Rows with `test` are skipped |
| `status` | `open` or `done` |
| `closed_at` | When it closed |
| `speed` | The speed word, see [04-speed-scale.md](04-speed-scale.md) |

**`kanban.db`**: Hermes's Kanban cards. A card belongs to the order whose `ORD-` number is in its title. Column names differ between Hermes versions, so the probe takes the first that exists: id (`id`, `task_id`), title (`title`, `name`), body (`body`, `description`, `prompt`), state (`status`, `state`, `column`), worker (`assignee`, `profile`, `worker`), and the `created_at`, `started_at`, `completed_at` and `result` columns. The full list is `CARD_COLUMNS` in [`probe/ship_probe.py`](../probe/ship_probe.py).

**`handoff/handoff-log.csv`**: one row per hand-off to a cloud rail, which shows as the customs lines in the ship's log. The probe reads `sent_at`, `returned_at`, `rail`, `kind`, `status` and `failure_class`. The full envelope is in [crew/handoff-contract.md](../crew/handoff-contract.md).

**`handoff/answers.jsonl`** (optional): one JSON object a line, `{"order_id": "ORD-1234", "at": "...", "by": "<profile>", "text": "..."}`. Lets an order answered in chat, without a card, show its answer.

**`routing/fast-paths.json`** (optional): `{"paths": [{"words": ["sensors"], "profile": "scout", "patch": "P", "example": "sensors, ..."}]}`. These are the first words that route straight to a profile. Number One's post shows them.

## The Yeoman's list (`ship-probe`)

**`yeoman/`**: five CSV files. Empty templates with the right headers are in [crew/stations/yeoman-templates/](../crew/stations/yeoman-templates/):

| File | Columns |
|---|---|
| `todos.csv` | `id, added_at_utc, text, important, due_utc, source_ord` (and an optional `rank`) |
| `reminders.csv` | `id, due_at_utc, text, surface, source_ord, status` |
| `waiting.csv` | `id, since_utc, what, from_whom, nudge_after_utc, source_ord` |
| `recurring.csv` | `id, rule, time_local, text, next_due_utc, surface, source_ord` |
| `done.csv` | `id, kind, text, closed_at_utc, how, source_ord` |

Also optional: `yeoman/.timer-heartbeat` (a timestamp, or just touch the file), and `yeoman/inbox/`, which the Yeoman's desk writes board actions into, with `inbox/results.jsonl` holding what the Yeoman did with them. Rows whose `source_ord` says `test` are skipped. A `chat_id` column is never copied.

## Helm's tracker (`ship-probe`)

**`helm/app-tracker/`** (`HELM_DIR`):

| File | Columns read |
|---|---|
| `job-ads.csv` | `id` (`J-0001`), `found`, `company`, `role`, `status` (found, shortlisted, applying, skipped, parked), `location`, `source`, `deadline`, `match`, `fit`, `notes` |
| `applications.csv` | `id` (`A-0001`), `job`, `created`, `company`, `role`, `status` (drafting, ready, applied, interview, offer, rejected, withdrawn, ghosted), `applied`, `match`, `next_step`, `next_date`, `notes` |
| `application-events.csv` | `date`, `id` (a J- or A- id), `kind`, `text` |

Contact, salary, link and file columns are never read. Email addresses, phone numbers, salary figures and paths in a note are masked.

## Rails and meters (`rails-probe`, `meter-probe`)

| Source | Used for |
|---|---|
| `handoff/burn.json`: `{"allowed_rails": ["claude"], "timezone": "Europe/Stockholm", "reset_day": "thu", "reset_time": "10:00", "window_hours": 24}` | The Claude rail's burn window (the last hours before the weekly reset) |
| `home/.claude/` (Claude Code's sign-in folder) | The Claude rail's 5-hour and weekly use, read from Anthropic with Claude Code's existing sign-in, which is only read |
| `auth.json` files under the data folder, and `home/.codex/sessions/` | The Codex rail's 5-hour and weekly use, from OpenAI with Hermes's Codex sign-in, or from the newest Codex session logs |
| `state.db` and `profiles/*/state.db`, table `sessions` | Spend per rail and station. Only the number columns are selected (`model`, `started_at`, token counts, `api_call_count`, cost). Never a message or a prompt |
| `handoff/handoff-log.csv` | Each cloud rail's tokens per second (tokens over wall time) |
| `handoff/rails/leak-kpis.csv` | The weekly leak share. Columns are matched loosely: a date, total tokens, and wait or restart tokens |

More detail on each probe, including its tests and safety limits, is in [probe/README.md](../probe/README.md).
