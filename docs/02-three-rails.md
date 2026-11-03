# The three rails

A rail is where a model runs. Each station has a home rail; the routing rules pick the rail for a job.

| | **1 · local** | **2 · Codex** | **3 · Claude** |
|---|---|---|---|
| Example | 27B Qwen on Ollama, on your own GPU | Codex CLI, top model (plus mid and small models for the Engineering hires) | Claude Code, top model for design, mid model for research |
| Sign-in | none | ChatGPT plan sign-in | Claude plan sign-in |
| Role | Orchestrator, router, memory, plumbing | Code and big context | Design and styled research |
| Owns | Cron, shell, git, service health, memory, OCR, ingestion, secrets, the final answer to the Captain | Implementation, debugging, refactors, PR work, long-document analysis that outgrows local context | Final design (PDF, deck, dashboard page, SVG, charts), research ending in a styled doc, prose polish when it matters |
| Do not hand it | Polished deliverables or large code changes | Visual design, styled deliverables | Plumbing, memory, secrets, personal data, writes to your systems, multi-step orchestration |

Both cloud rails run as CLIs **on the Hermes host**: "cloud" means the model, not the file transfer.

## Codex in practice

Codex gets **code and the code's context, never the data or the secrets**. It returns a diff or a script; local checks run, then the Captain applies anything that touches Hermes itself.

- Codex launches with `--sandbox danger-full-access` inside the Hermes container. Its own read-only sandbox fails under Docker. This is an accepted risk on stock Docker security; a stricter file-permission lock was designed and parked.
- The Chief Engineer stays on the top model. Two cheaper hires take split work: the Systems Engineer (mid model, about half the cost per token) builds from a written plan, and the Diagnostics Technician (small model, about a fifth) writes tests and runs mechanical checks. See [06-engineering-split.md](06-engineering-split.md).

## Claude in practice

- Claude-rail stations (Sensors, Cartography) have long-term memory switched off: no recall and no memory tools.
- They never file cards to the Ship's Computer and never read its output. When one needs something from memory, the Captain asks the Computer, reads the answer and puts what is needed into that order.
- Their reach into shared container files is an accepted risk, the same as Codex's. A later fix is to keep sensitive stores under a user the stations can't read.
- Food data never goes to Claude.

## The stacking pattern

One job, several rails, orchestrated by Number One:

1. **Codex** writes the logic or script.
2. **Local** runs it on the real data and aggregates.
3. **Claude** designs the output from the aggregate only.
4. **Local** schedules and delivers it.

Cloud rails never call each other.

## Quota

- Codex has a rolling 5-hour window plus a weekly limit. Claude has a 5-hour window plus a weekly limit that resets at a fixed time per account.
- Short on quota → the card waits. The Kanban dispatcher holds rate-limited cards in Ready under a cooldown and restarts them itself, so a queue can span several windows unattended. Give long briefs a "continue from partial work in <path>" line so a restarted run doesn't start over.
- No fixed caps on recurring jobs. Keep a register of recurring jobs with rail and cadence, and let Ops report each rail's usage share.
- Planned: a live fuel gauge per rail (5-hour and weekly bars, reset times) read from local usage data with no model call. For Codex this is the `rate_limits` block in the newest session rollout file (`primary` = 5 h, `secondary` = weekly, `used_percent`, `resets_at`).

## Fallback

local → Codex top model, only when the local model server is down. Claude is not in the chain. While the ship runs on the fallback, rule 0 applies to the orchestrator itself: see "acting command" in [07-conn-handoff.md](07-conn-handoff.md).

## What may cross a rail

- **Fine:** the Captain's first name, mission and campaign names, goals in general terms ("career move"), job titles, city or region.
- **Never:** national ID numbers, phone, home address, email, account and card numbers, passwords and credentials, raw health readings, full receipts, long-term memory.

The never list is enforced by Security's pre-send scan with patterns (ID number formats, phone numbers, IBAN, card numbers, email addresses, credential patterns, `.env` and key filenames). A match blocks the send and is reported to the Captain.
