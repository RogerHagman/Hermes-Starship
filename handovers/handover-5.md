# Handover 5 · Call stations with @ and / on every surface

**Origin:** draft handover from the original ship, in the four-questions format.
**Status:** Draft, not approved.

## GOAL
The Captain can call any station by name with @ or / from every surface they use: Telegram, the desktop app and the Hermes dashboard.

## CONTEXT
- Every station is a profile behind the one Hermes agent, so no surface has a list of stations to autocomplete. Telegram's @ list only shows real bot usernames and group members.
- Aliases already work as the first word: "sensors, run the price watch". A typed "@sensors" probably fails today, because the router doesn't strip the @.
- The parsing belongs in the router, which every surface goes through. Only the picker differs per surface, and every picker reads the same alias registry.

### Command list
Telegram commands must be lowercase letters, digits or underscores. Each maps to an existing alias.

| Command | Station | Description shown in Telegram |
|---|---|---|
| /xo | First Officer | Number One: status, routing, anything |
| /computer | Ship's Computer | Memory and records |
| /ops | Ops | Systems and quota |
| /qm | Quartermaster | Receipts, budget, stores |
| /engineering | Chief Engineer | Code and fixes (Codex rail) |
| /science | Science Officer | Evals and model runs |
| /sensors | Sensors | Research and watches (Claude rail) |
| /away | Away Team | Read-only look at a remote host |
| /security | Security Chief | Scans and blocks |
| /helm | Helm | Career and openings |
| /cartography | Stellar Cartographer | Design jobs (Claude rail) |
| /archives | Archivist | Library and reading |
| /nav | Navigation | Travel and logistics |
| /onscreen | Main Viewscreen | Show the screen. Every action needs your OK |
| /lounge | Briefing Room | Start a group briefing |

Unhired stations (Comms Officer, Ship's Doctor, Life Support, Chief Strategist) get no commands. Their names stay reserved.

## CONSTRAINTS
- **One bot, no bot per station.** Separate bots would split memory and logs and could let messages get around Number One and the routing rules.
- Aliases and commands never bypass the routing rules or rule 0.
- The station registry stays local and is never sent to a cloud rail.
- **Number One only routes.** Each task has an owner station and goes out on a Kanban card titled with its code-minted ORD.

## DONE WHEN
A1 to A3 are ticked with proof, and the Captain has signed off A2 and A2c.

## START WITH
A1. It works on every surface the moment it ships, even before any picker exists.

## CHECKPOINTS
🛑 the Captain after A2 and A2c. The dashboard picker is built in handover 3 (it reads the station list from A2b).

---

## Tasks

### A1 · @ prefix in the router
- **Goal:** strip one leading @ before alias resolution, case-insensitive. "@number one" and "@numberone" both resolve.
- **Owner:** Engineering on Codex.
- **Done when:** a dry run resolves "@sensors", "@Number One", "@numberone", "@lounge" and "@nobody", and the last one goes to Number One as unknown.

### A2 · Slash commands
- **Goal:** register the list above with Telegram's setMyCommands, scoped to the Captain's private chat only. Text after the command is handled like the rest of an aliased message.
- **Owner:** Engineering on Codex.
- **Done when:** typing "/" in the Captain's chat shows the 15 commands, and "/sensors run the price watch" routes to Sensors. 🛑 the Captain

### A2b · Station list
- **Goal:** serve the registry read-only to local surfaces: station, aliases, command, rail and status.
- **Owner:** Engineering on Codex.
- **Done when:** the desktop app and the dashboard can read the list, it never appears in a cloud-rail log, and a station added to the registry shows up without a code change.

### A2c · Desktop app picker
- **Goal:** typing @ or / in the desktop app suggests stations from the list.
- **Owner:** Engineering on Codex.
- **Start with:** check whether the desktop app's composer accepts a suggestion source. If it doesn't, report why and stop; typed @ already works through A1.
- **Done when:** "@se" suggests Sensors, or Engineering has written down why the app can't do it. 🛑 the Captain

### A3 · Help card
- **Goal:** "/xo help" lists every station with aliases and command, generated from the registry so it can't drift.
- **Owner:** Engineering on Codex builds it; Number One serves it (own list: status reports).
- **Done when:** the card matches the registry and shows the unhired stations as reserved.
