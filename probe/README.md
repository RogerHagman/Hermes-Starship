# Rails probe

`rails_probe.py` writes `deploy/live/rails.json` about once a minute, and the Bridge reads it
in place of the sample `fixtures/rails.json`. The Rails panel then says LIVE, or STALE when
the file is over five minutes old, or SAMPLE when there is no live file.

It only reads, and it never runs a model:

| Rail | Where the numbers come from |
|---|---|
| Local | One `GET /api/ps` to Ollama: the VRAM the loaded models use, against `VRAM_GB`. No other Ollama call exists in the code, and a test checks that. |
| Codex | The ChatGPT account's 5-hour and weekly use and their resets, asked from OpenAI (`chatgpt.com/backend-api/wham/usage`, the same answer as Codex's `/status` and Hermes' `/usage`) at most every 5 minutes, with the Codex sign-in Hermes keeps in its `auth.json` (the root one, each profile's, or the Codex CLI's; the freshest unexpired one). Like Claude's, the sign-in is only read: never written, renewed, copied or logged, and an expired one is not used. If there is no answer, the rate-limit records in the newest few Codex CLI session logs, and when that record is over 15 minutes old the rail says "Old reading" with its time: Codex use through Hermes' openai-codex provider (forge) writes no such log. A passed reset shows 0. |
| Claude | The account's 5-hour and weekly use and their resets, asked from Anthropic at most every 5 minutes (3 times longer after a "too many" answer) with the sign-in Claude Code already keeps for the ship's Claude stations. It is the same answer as Claude Code's usage screen, and claude.ai chats count too. The sign-in file is only read: never written, renewed, copied or logged, and a test checks the token never reaches the log or the file. An expired sign-in is not used; the rail says why until Claude Code renews it. Plus the burn window, from Hermes' `burn.json`. |

It also keeps `deploy/live/rail-log.json`: one line each time a rail goes out or comes back
(the newest 500). The page turns it into the Crew Quarters duty log: who went to quarters, and
when they were back at their post. The probe records only the rail; the page works out which
crew needed it. On a restart the probe reads its own log back, so nothing is forgotten or
written twice. A rail that is merely degraded doesn't count as out.

It runs as the `rails-probe` service in `deploy/compose.yaml`: `python:3.12-alpine`, read-only,
no capabilities, 32 MB of RAM (it uses about 15), no ports. It sees the Codex sessions folder,
`burn.json`, Claude Code's sign-in folder and Hermes' data folder (for its `auth.json` files) read-only, and writes only `deploy/live/`.

Settings for the NAS live in `deploy/.env`, which git ignores. Copy `deploy/env.example`.

Tests: `python -m unittest discover -s probe` (CI runs them).

This is Engineering's ORD-1215 probe, with the review fixes: the real NAS paths
(`/DATA/AppData/hermes/...`), only the newest Codex logs opened, the Ollama address out of the
repo, and whole-number percentages.

# Ship probe

`ship_probe.py` writes `deploy/live/orders.json`, `deploy/live/shiplog.json` and `deploy/live/records.json` about once a
minute. With them the boards show the real orders in place of the sample ones: the Bridge
order list, who is working on what (each station's active order is its newest running one),
and the ship's log. Without them the sample fixtures stay, and the header pill says SAMPLE.

It reads three things in Hermes' data folder, and never changes them:

| File | What it gives |
|---|---|
| `handoff/orders.csv` | Every order: its id, when it came in, from which surface (Telegram, desktop, dashboard), its speed and whether it is open or done. Rows of kind `test` are skipped. |
| `kanban.db` | The cards. A card belongs to the order whose `ORD-` number its title carries. The order takes its title and brief from its first card, its station from that card's assignee (`forge` is the Chief Engineer, and so on, through `fixtures/stations.json`) and its state from all its cards: running if any card runs, done only when every card is done. |
| `kanban.db`, again | What came back: each card's result, its runs' summaries (or the error when a run failed) and its comments. They show as the order's replies, oldest first, the newest 12. |
| `handoff/answers.jsonl` | Once patch AF is in: every answer the Captain was sent, in chat or from a card. An order answered in chat with no card stays on the board because of it. Until then the file doesn't exist and nothing is missed. |
| `handoff/handoff-log.csv` | The customs lines in the ship's log: each hand-off to Codex or Claude, and whether it came back accepted. |

What drops off the boards: done orders older than `DAYS` (7), and open orders that never got a
card and are over a day old (Number One answered them in chat). The newest `KEEP` (80) orders
are kept.

Each order also says when it came in (`openedAt`), when it closed (`closedAt`, done orders only),
where the Captain gave it (`surface`) and how many Kanban cards were filed for it (`cards`; 0 means
it was answered in chat, or not picked up yet). The Computer core's numbers are worked out from them.

It also writes `deploy/live/yeoman.json` (schema `api/schema/yeoman.schema.json`) from the Yeoman's
own files in `yeoman/`: the Captain's open todos, reminders, waiting-fors and recurring dates, the
newest 200 closed items from `done.csv`, and when the Yeoman's timer last beat (`.timer-heartbeat`).
Rows whose `source_ord` says test are left out, and the `chat_id` column is never copied. The
Yeoman's post (Deck 2) and the Captain's PADD read it. Each todo carries its `rank` (the Captain's
own order inside a box, set by dragging) when the column has one. Once the Yeoman has its inbox
(patch B2-45), the file also has `desk`: the board's actions still waiting in `yeoman/inbox/*.json`
and the newest 50 results from `inbox/results.jsonl`, so the board can show what is pending and
what the Yeoman refused.

It also writes `deploy/live/helm.json` (schema `api/schema/helm.schema.json`) from Helm's
application tracker in `helm/app-tracker/` (`HELM_DIR`): the job ads, the applications and the
newest 200 lines of `application-events.csv`. The contact, salary ask, ad link, ad file, CV and
letter columns are never read out, and any email address, phone number, salary figure or file path
in a note becomes `[contact]`, `[salary]` or `[file]`. Without the folder nothing is written and the
Helm board shows its sample.

It also writes `deploy/live/fastpaths.json` (schema `api/schema/fastpaths.schema.json`) from Hermes'
`routing/fast-paths.json` (`FAST_PATHS`): the coded fast paths, the first words the arrival hook
routes straight to a profile before Number One reads the message. Only `words`, `profile`, `patch`
and `example` are copied, and an entry that doesn't fit is left out. Without the file nothing is
written and Number One's post shows the sample (patch P's words).

It also writes `deploy/live/records.json`, in the same shape: every order on file, in any state,
for the core terminal on the Computer core board (Deck 3). Nothing drops off it for age. An open
order that never got a card stays, with a line that says so. The newest `RECORDS_KEEP` (1000)
orders are kept. Without it the terminal shows the orders the boards have.

SQLite can't read a live database on a read-only mount, so the probe copies `kanban.db` (and its
`-wal`) into `deploy/scratch/` when it has changed, and reads the copy read-only. Hermes'
database is never opened. A test checks that a run leaves it byte for byte the same.

It runs as the `ship-probe` service in `deploy/compose.yaml`: `python:3.12-alpine`, read-only,
no network at all (`network_mode: none`), no capabilities but reading, 64 MB of RAM. There is no
model call anywhere in it, and a test checks the code opens no connection. Speed words follow
`docs/04-speed-scale.md`. Orders have no tier yet: the boards show NO TIER until a classifier
sets one.

Tests: `python -m unittest discover -s probe` (CI runs them).

## Starting it on the NAS

One line at a time, in the repo folder on the NAS:

```
git pull
sudo docker compose -f deploy/compose.yaml up -d ship-probe
sudo docker logs --tail 20 hermes-starship-ship
sudo head -c 400 deploy/live/orders.json
```

The log should say how many orders and log lines it wrote. Reload the Bridge: the pill turns
green and says LIVE ORDERS.

# Ops probe

`ops_probe.py` writes `deploy/live/nas.json` about once a minute. With it the Ops board shows the
NAS's real figures in place of the samples: in the Hosts view and on the status board (memory,
swap, CPU, uptime, temperature) and in the Storage view (the NAS's disks, and how fast each one
fills). The room's hint then says LIVE NAS AND RAILS. The rest of Ops (the GPU box, the
containers, the network, the schedule, the backups) stays sample data for now.

| Reading | Where it comes from |
|---|---|
| RAM, swap | `/proc/meminfo`. Used RAM is total minus available, what programs actually hold. |
| CPU | `/proc/stat`, between two readings a minute apart. |
| Uptime | `/proc/uptime`. |
| Temperature | The warmest sensor in `/sys/class/thermal` and `/sys/class/hwmon`, if there is one. |
| Disks | One `statvfs` call on a folder or file of each disk, mounted read-only. No file is opened or listed. |
| Fill rate | The probe's own history: one reading a day per disk, the last 8 days, in `deploy/scratch/ops/`. It shows after a day. |

When the file is over five minutes old the NAS says NO READING, so an old figure never passes for
a new one.

It runs as the `ops-probe` service: `python:3.12-alpine`, read-only, no network, no capabilities,
32 MB of RAM. It sees no Hermes data at all. By default it watches `/DATA` and the system disk;
`deploy/env.example` says how to add the backup disk.

Tests: `python -m unittest discover -s probe`. A test checks the code opens no connection, runs
no command and lists no folder.

# Meter probe and speed trial

`meter_probe.py` writes `deploy/live/meters.json` every 5 minutes. With it the Science lab's
Meters panel, and its Speed, Spend and Leak share views, show real figures in place of the
samples (`fixtures/meters.json`). The panel says LIVE, or STALE when the file is over 15 minutes old.

| Meter | Where it comes from |
|---|---|
| Spend | Hermes' session records: `state.db` of the default profile and of each profile in `profiles/`. Per session only its model, provider, start time, token counts (input, cached, output, reasoning), call count and cost where Hermes has a price. Never a message, a prompt or a title. Counted by rail for today, 7 days, 30 days and everything, and by station for the last 7 days. |
| Cloud speed | `handoff/handoff-log.csv`: tokens over wall time per hand-off. That is how fast the work went, tools and waits included, not how fast the model talks. |
| Leak share | `handoff/rails/leak-kpis.csv` from leak-kpis.py, added up per ISO week. The column names are matched loosely (v2: wait tokens + restart overhead; v1: wait + wall + restart tokens), and the file says which it used. An unmatched run is counted as unmatched, never as zero. |
| Local speed | The speed trials' history, `deploy/scratch/trials/speed-trials.json`. |

The session records are opened read-only as immutable: SQLite takes no lock and writes nothing,
not even a `-shm` file, and a test checks every Hermes file is left byte for byte the same. The
price of that: changes still in Hermes' `-wal` file show once Hermes checkpoints them.

It runs as the `meter-probe` service: `python:3.12-alpine`, read-only, no network, no
capabilities but reading, 64 MB of RAM.

`speed_trial.py` is run by hand, as a run, not a probe. It asks the model Ollama already has
loaded (so nothing is pushed out of VRAM) the same short question three times, and records the
median time to first token (measured from sending to the first piece of answer, thinking
included), tokens a second (Ollama's own count and time) and the prompt's tokens a second, as
`SPD-<n>`. A failed trial is kept with its reason. It costs a few seconds of GPU time.

```
sudo docker compose -f deploy/compose.yaml run --rm speed-trial
```

Time to first token on the cloud rails isn't measured: it would take a paid call each time.

Tests: `python -m unittest discover -s probe`.

# Holo probe

`holo_probe.py` writes `deploy/live/holo.json` every 2 minutes for the **Review bay** on the
Holodeck board: the Holodeck Officer's `holo/` branches, the holo Action's run on each (step by
step, with the last log lines when a step failed), the PR the Action opened, the files each
branch changes against main with their diffs (each flagged when it is outside
`.github/holo-paths.txt`), holo's report `holodeck/reports/<ORD>.md` and the version it bumps to.

GET only, to `api.github.com`, with a read-only GitHub sign-in for this one repo (`GITHUB_READ` in
`deploy/.env`). The sign-in is sent only to GitHub (never on to a redirect, such as a log
download), and it is never logged or written. It reads none of Hermes' data. Merged and closed
work is fetched once and kept in memory, so a quiet repo costs two calls a cycle.

It runs as the `holo-probe` service: `python:3.12-alpine`, read-only, no capabilities, 32 MB.
Without `GITHUB_READ` it logs one line, writes nothing, and the Review bay keeps its sample.

# Yeoman's desk

`yeoman_desk.py` is the one way the Yeoman board can change the Captain's list. The board posts one
action to `/desk/action` (nginx passes POST only for `/desk/`, everything else stays GET and HEAD):
tick, cancel, reopen, arrived, important (true/false), due (a UTC time or null), snooze (a UTC
time), edit (the new text), rank (a number) or add ({text, important, due}). The desk checks the
shape, drops unknown keys, and writes the action as one file, `yeoman/inbox/<id>.json`, through a
temp file and a rename. It never opens the Yeoman's CSV files: the Yeoman's own code applies the
inbox on its timer, within about a minute, writes `inbox/results.jsonl`, and sends the Captain one
short Telegram line for what changed (patch B2-45 in Hermes). `GET /desk/health` says whether the
inbox is there; the board shows "desk offline" or "waiting for the Yeoman patch" until it is, and
reads only.

A post from another site is refused (its Origin must name this host, and the body must be JSON),
bodies are at most 8 KB, and texts at most 2000 characters. No model, no Hermes call.

It runs as the `yeoman-desk` service: `python:3.12-alpine`, read-only, no capabilities, 32 MB, as
the Yeoman's user (10000), with only `yeoman/inbox/` mounted read-write and no ports (nginx reaches
it on the compose network). It is in the `desk` profile, so it starts only by name, and the mount
has `create_host_path: false`, so Docker never makes the inbox as root. Start it after the patch:
`sudo docker compose -f /DATA/AppData/hermes-starship/deploy/compose.yaml up -d yeoman-desk`.
