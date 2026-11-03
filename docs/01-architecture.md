# Architecture

## 1 · The shape

```
Captain ──(Telegram / desktop / dashboard)──▶ Hermes gateway
                                               │
                         arrival hook (code) ──┤ mints ORD, reads speed word / Yeoman word
                                               ▼
                                     Number One (default profile, local model)
                                     tools: clarify + 4 Kanban tools, nothing else
                                               │ files one card per station
                                               ▼
                         kanban_create (code) ── stamps ORD on title, strips skills/model,
                                               │  sets reasoning from the speed word,
                                               │  guards who may assign whom
                                               ▼
                                     Kanban dispatcher ── worker process per card
                                               │
                     ┌─────────────────────────┼──────────────────────────┐
                     ▼                         ▼                          ▼
              local stations            Codex stations              Claude stations
          (keeper, warden, scribe,   (forge, systems, diagnostics) (scout, studio)
           yeoman, ...)                                            Hindsight off
                     └─────────────────────────┼──────────────────────────┘
                                               ▼
                               card-close hook (code) ── closes the ORD row in orders.csv,
                                                          appends one ROLLOUT line
                                               ▼
                               board completion notice reaches the Captain
```

## 2 · Principles that hold the design together

1. **Number One only routes.** It would rather fail a task than take the wheel. Its toolset is cut to `clarify`, `kanban_create`, `kanban_list`, `kanban_show` and `kanban_comment`. It has no file reads, no search, no terminal and no memory tools. Lasting rules live in SOUL and the routing rules file, never only in chat, because chat rules are lost on compaction.
2. **Code does the bookkeeping.** Anything with one right answer (an ID, a date, a weekday, a speed level, a reminder time, whether a reply was checked) is computed by code. A small local model filling those gaps will invent confident answers and fake sources.
3. **Each station owns one thing, and stops at its edge.** The duty map says who owns what. Unowned work goes to the closest station with a missing-owner note.
4. **Three rails, chosen per job, never chained by the model.** Cloud rails never call each other; the orchestrator stacks them (Codex builds the logic, local runs it on real data, Claude designs from the aggregate, local delivers).
5. **Rule 0 is mechanical.** Memory, secrets, raw personal data and writes to your systems never leave the local rail. A pre-send scan blocks the send on a pattern match; it does not depend on a station's judgement.
6. **Hermes-core changes ship only as patches.** Engineering writes a diff plus tests on a scratch copy and never edits live files. A reviewer reads it. The Captain applies it with a backup.
7. **Config and model changes go through the Captain, with a backup.** Never accept a model or setting change that Hermes itself offers.
8. **A short quota means wait, not reroute.** If a cloud rail is out of window, the card waits. The fallback to the local model is for an outage, not a quota.
9. **Moving around the interface never calls a model.** Display is served from files; only order buttons and free text reach a model.

## 3 · The moving parts

| Part | Where it lives (container paths) | Owner |
|---|---|---|
| SOUL (Number One's prompt) | `/opt/data/SOUL.md` | Captain approves every diff |
| Routing rules (injected into Number One's prompt by patch V) | `/opt/data/attachments/routing-rules.md` | Captain approves; Engineering edits with a backup |
| Station profiles | `/opt/data/profiles/<id>/config.yaml` (+ skills, memory settings) | Captain (config) |
| Order log | `/opt/data/handoff/orders.csv` (`order_id, received_at, from_surface, station, kind, status, closed_at, speed`) | written by code only |
| Per-chat ORD log | `/opt/data/handoff/logs/live-ack.jsonl` | written by code only |
| Rollout logs | `/opt/data/handoff/ROLLOUT-<milestone>.md`, `ROLLOUT-orders.md` | close hook |
| Hooks | `/opt/data/hooks/<name>/` (arrival, card close) | Chief Engineer |
| Patches | `/opt/data/patches/patch_<L>.diff`, `apply.sh`, `check.sh` | Chief Engineer writes, Captain applies |
| Engineering reports | `/opt/data/handoff/engineering/<item>-report.md` | the station that did the work |
| Yeoman lists | `/opt/data/yeoman/*.csv` | Yeoman (code writes timestamps) |

`/opt/data` is the Hermes container's data volume. Map it to wherever your host keeps app data.

## 4 · One order, end to end

1. The Captain sends "Warp: sensors, compare three NAS drives under 2 TB".
2. The **arrival hook** mints `ORD-1204`, logs it per chat, stores `speed=high`, and posts "ORD-1204 received" on surfaces that allow it.
3. **Number One** routes: Sensors is named, so it files one card for `scout` with the Captain's words unchanged, and replies "Handed to Sensors, ORD-1204".
4. **kanban_create** (patched) stamps `ORD-1204` on the title (replacing any number the model wrote), drops skills/model/priority the model tried to set, and sets the card's reasoning to `high`, capped at what the rail offers.
5. The dispatcher runs the card on the Claude rail. If the rail is rate limited, the card waits under a cooldown and restarts itself.
6. When the card finishes, the **close hook** sets the ORD row to `done` (or `failed` / `blocked`) with `closed_at`, and appends `ORD-1204 | <card> | Sensors | done` to the rollout file.
7. The board's completion notice reaches the Captain. Stations never message the Captain themselves.

## 5 · Who reviews what

- **Hermes-core patches:** written by the Chief Engineer (or split to cheaper hires, see [06-engineering-split.md](06-engineering-split.md)), reviewed outside the board by a stronger reviewer (in the original, Claude in a separate chat with the Captain), applied by the Captain.
- **Station work:** mechanical QA always runs locally (render checks, required strings, tests actually ran). Judgement review is opt-in and goes to a different rail from the producer.
- **Never** a board review loop where a station reviews its own patch: it burned hours of Codex window in the original build.
