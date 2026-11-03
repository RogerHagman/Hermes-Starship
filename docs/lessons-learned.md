# Lessons learned

Each entry describes what happened on the original ship and the rule or capability that came out of it. The short version: **a small local model fills every gap with a confident invention. Close the gap with code, not with another rule in words.**

## Number One

| What happened | What fixed it |
|---|---|
| Number One did station work itself, because "local by default" sounded like "I do it" | Own list + self-work budget in SOUL; "local" means a local *station* |
| It minted order IDs itself: slow (86 s) and reused numbers | ORDs minted by code on arrival (capability 1) |
| It titled cards with made-up ORDs or none, and pinned skills that don't exist ("code"), so workers crashed twice and blocked | Code stamps the ORD and strips skills, model, provider and priority |
| It read a dozen files, weighed rules, then asked the Captain a routing question built on a wrong fact | Tools cut to five (no read/search); "file the brief as written, ask one line without looking anything up" |
| After its file tools were removed, it could no longer see the routing rules at all (they were never in its prompt) | Rules injected into the prompt by code (capability 2) |
| Asked about the ship's speeds, it invented a scale (Warp = Codex) | The speed table in the routing rules, plus "the word is for code" |
| It said Christmas Eve 2026 was a Tuesday (Thursday), citing `/usr/share/zoneinfo` as a calendar | The "(from memory, unchecked)" label (capability 3) and dates from the clock (capability 7) |
| It planted a wrong date in a card body, and the worker computed from it | "The card body starts with the Captain's words, unchanged. Never add dates or facts" |
| It filed a reminder card to itself; the card ran at once and claimed the reminder "already delivered" hours early | The Yeoman: code parses, stores and fires reminders, and delivery is read from `done.csv` (capability 6) |
| After a restart it ignored the alias line and offered a `sleep 120 && notify-send` timer | Yeoman words routed in code at arrival |
| It filed cards as blocked "pending approval" and cited a memo that doesn't exist | "Cards are filed ready, never blocked by you" |
| It filed unrequested follow-up cards | "Only file cards the Captain asked for" |
| It offered to unblock and archive cards it had no tool for | "Only offer what your tools can do" |
| It named an actor who didn't act ("forge blocked the card") | Planned: status replies name actors only from the board's event data |
| It reworded briefs (a typo in a station's title ended up in an error message) | "Copy everything below into the card body, word for word" |
| It read "file a card for diagnostics" as a job for Ops | Name the profile explicitly in briefs and tests |

## Stations and cards

| What happened | What fixed it |
|---|---|
| A card told the Quartermaster to "post the breakdown to the Captain". With no send tool, it went looking for the bot credentials in the container's env file, tried to call the chat API, crashed twice and blocked. Nothing left the box, but it could have | "A card never asks a station to message the Captain"; the board's notice does it. Keeping workers away from credential files is on the list |
| "Claude review of patch X" was filed to a local-model station, which crashed on output length for 35 minutes | "A Claude review goes back to the Captain. It is never a card" |
| Local stations crashed with "response still truncated" because a thinking model spent the whole output budget thinking | Explicit `max_tokens` on local profiles, thinking off where it isn't needed |
| A one-line rollout note timed out twice at 600 s on the local model (slow disk, the card made it search) | Rollout lines written by a code hook, not a model |
| The Kanban auto-decomposer rewrote a live card's title and body | `kanban.auto_decompose: false` |
| A meal fell back to the local model every time because the Codex probe ran with a different environment | Pin `HOME`, `CODEX_HOME`, `PATH` in scripts that call Codex; report the real error |

## Engineering

| What happened | What fixed it |
|---|---|
| The Chief Engineer asked for a board review of its own patch, reviewed it as "the Ship's Computer", requested changes, reworked… for 3.5 hours | "Mark this card done. Do not request a review." Core patches are reviewed off the board |
| A fix for one review finding caused the next (an import in the dispatcher that triggered a 35 s bootstrap) | Keep patches small; prefer the worker printing its own `KANBAN_RUN` line over dispatcher-side logic |
| `apply.sh` broke on re-run once patches overlaid each other; later patches went in by hand | Idempotent `apply.sh`, `check.sh` that tells overlap from drift (capability 9) |
| Patches lost after the NAS portal recreated the container | Re-apply after every rebuild; `apply.sh`/`check.sh` skip `/opt/data` |
| Most patches worked on Telegram and failed on the desktop app (typed text lost behind attachments, different reply path, streamed deltas before the label, tab title from the system note) | Test every surface in the first round |
| A diagnostics run tried the model server at `127.0.0.1` | Take the address from the profile's `base_url`; no localhost defaults |
| The first split cost more than doing the job alone | Plan file, tests blind to the code, `verify.sh`, no waiting sessions (see [06-engineering-split.md](06-engineering-split.md)) |
| Codex's own read-only sandbox fails inside Docker | Launch with `--sandbox danger-full-access`; accepted risk, logged |

## Memory and process

| What happened | What fixed it |
|---|---|
| Memory stored claims that were later corrected | Records Inspection against canon, Captain approves each fix |
| Rules given only in chat disappeared after compaction | Lasting rules go into SOUL or the routing rules |
| "Never use X" lines in prompts planted X in memory | Phrase rules positively |
| A Hermes-offered "switch to Codex" rewrote the main config to a template | Say no to Hermes-offered setting changes; keep config backups |
| The host ran out of memory with several cards and a media server busy; changing the cap in the portal rebuilt containers | Cap parallel workers; never change portal settings while the crew is busy |
| A fixed cap on recurring research blocked useful daily jobs | No caps; a register of recurring jobs with rail and cadence |
