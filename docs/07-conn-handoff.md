# Conn handoff: auto-approval while the captain is away

Status: draft design, not built on the original ship. Planned for handover 2 ([../handovers/handover-2.md](../handovers/handover-2.md)).

## What it is

Sometimes the Captain steps away and lets Number One approve routine requests on their behalf. The conn handoff is the formal, time-boxed order that allows this. Without an active order, every approval waits for the Captain as it does today.

## The order

The Captain gives the order from Captain's Quarters or a chat surface with "Number One, you have the conn". The order carries four settings:

| Setting | Options | Default |
|---|---|---|
| Threshold | Routine only · Up to Low · Up to Elevated | Up to Low |
| Duration | Until I'm back · 2 hours · 8 hours · Until 08:00 | Until 08:00 |
| Pings for held items | Ping critical now · Batch hourly · Hold until I'm back | Batch hourly |
| Locked, always on | Critical always waits · Red alert recalls the captain · Viewscreen stays look-only | n/a |

The order expires on its own when the duration ends. "I have the conn" ends it early. Either way, the conn returns to the Captain and Number One posts a debrief.

## Captain on the bridge

When the conn returns, by "I have the conn" or by expiry, Number One announces "Captain on the bridge" on the Captain's chat surface and in Quarters before anything else. The announcement gives the return time, how the conn came back, how many items are waiting and whether there was an incident. Auto-approval stops at that moment, and the debrief follows directly under the announcement.

## Risk tiers

Number One assigns each request a tier before acting. When it is unsure between two tiers, it uses the higher one.

| Tier | Examples | While away |
|---|---|---|
| 0 Routine | Read-only checks, scheduled watches, logging, Ship's Computer writes | Auto if threshold ≥ Routine |
| 1 Low | Work in worktrees, opening a PR, aggregates through a passed pre-send scan, Cartography jobs within quota | Auto if threshold ≥ Low |
| 2 Elevated | Restarting a container, clearing caches or old images, long GPU runs | Auto only if threshold is Elevated |
| 3 Critical | See the hard stops below | Always waits for the Captain |

## Hard stops (always Critical)

- Merges to main and deploys
- Anything that spends money or buys something
- Messages or files to anyone outside the ship except the Captain
- Deleting data, backups or logs
- Secrets, keys, OAuth tokens and Hindsight memory
- Rule 0 crossings, and any use of the food-photo or typed-meal exceptions outside its scope
- Viewscreen actions (click, type, drag, scroll, key). Unattended runs can only look, so these are refused anyway.
- Changing loadouts, guardrails, routing rules, the fallback chain or a default model
- Issuing, extending or widening a conn order. Only the Captain can do this.

## Red alert

A pre-send scan block, a rule 0 hit or a rail outage pauses auto-approval at once. Number One pings the Captain immediately, whatever the ping setting, and holds every new request until the Captain has reviewed it.

## Acting command (fallback brain)

The fallback chain does not change: qwen → the Codex top model. This section only covers how the ship behaves while it is on the Codex top model.

When Ollama is down and Hermes falls back to the Codex top model, the Chief Engineer is next in seniority and takes acting command until Number One returns. This applies whether or not a conn order is active.

Everything the acting commander reads goes to Codex, so rule 0 applies to the orchestrator itself:

- **Auto-approval pauses.** Any active conn order is suspended, and every request waits for the Captain.
- **Local-only work is sealed.** That covers Hindsight memory, secrets, the captain's log and raw personal data (receipts, ledger rows, nutrition). Stations that need them hold their work.
- **The Viewscreen is off.** Quartermaster keeps queueing captures but doesn't read them.
- **Work already running elsewhere continues.** Running jobs on the Codex or Claude rails may finish. New stacked jobs wait.
- **The Captain is told straight away.** Number One pings the Captain the moment acting command starts, whatever the ping setting.
- **Ops watches for the way back.** Ops probes Ollama every 5 minutes.

When the local model answers again, Number One relieves the Chief Engineer and announces "Number One back on the bridge". The announcement says how many requests were held and confirms nothing was approved and that memory stayed sealed. Any suspended conn order then comes back into force for the rest of its duration. If the Captain returns while acting command is still on, the Chief Engineer hands them the conn under "Captain on the bridge" and reports that Number One is still offline.

## Record keeping

- Each auto-approval is written to handoff-log.csv with `approved_by: number_one`, the tier and the order id.
- The start and end of acting command are logged with times and the number of held requests.
- The debrief lists everything Number One approved, everything still waiting, and any incidents.
- The Captain can revoke any auto-approved item that can still be undone from the debrief.
