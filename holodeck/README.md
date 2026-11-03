# Hermes Starship

The ship's own interface for Hermes, the Captain's agent crew. Hermes runs as a starship: each agent is a station (Number One, the Chief Engineer, the Quartermaster and the rest), and each station works on one of three rails:

- **local** the local model on Ollama (the GPU host)
- **Codex** the Codex top model
- **Claude** plan sign-in

This repo is the ship you walk around in as Captain: the deck plan, the sector chart, Captain's Quarters and the station consoles. They show who is live, where work is running, and rail health and quotas.

The ship is built on the **Holodeck**. The Holodeck Officer lays the first bricks there, turning the canvas designs into working decks. Once a deck is built, the Captain uses it from the bridge, not from the Holodeck.

> **Status: Milestone 0, static UI.** The boards render from synthetic fixtures with no backend. Next is the MVP, which puts the same boards on live, read-only data (see Roadmap).

## Milestone 0: static UI

The deck plan and the sector chart, built in the real frontend from the design tokens and fed by `fixtures/` only. There's no backend, nothing live, and no model calls. Navigation between boards, picking a station and the detail panels all work.

**Done when:** both boards match the canvas designs, open from a plain local server on fixtures, and the tests pass with 0 skipped. The Captain reviews it on screen.

This milestone needs only the schema and fixtures from H1, so the frontend can start before the backend exists.

## What's in the MVP

| Board | What it shows | Data |
|---|---|---|
| **Deck plan** | Every station as a tile, coloured by its rail, with its live/proposed/future status, aliases and duty | stations, status |
| **Sector chart** | The home network: hosts, rails, health and quotas | health, quotas |

The backend also serves the customs log from `handoff-log.csv` (what crossed a rail, when, and whether Security's scan passed). The Captain's Quarters templates in `design/` are reference only for this version.

## The one rule

**Moving around never calls a model.** Opening a board, filters, tabs, status and display all come from the read API over local files, and they're instant. Only order buttons and free text from the comm badge reach a model, and neither exists in the MVP.

## How it's built

```
Browser (LAN, login) ──> frontend ──────> read API ──────> Hermes files on disk
                         (Holodeck        (Chief            stations, health, quotas,
                          Officer)         Engineer)        handoff-log.csv, runs, jobs
```

| Part | Owner | Rail |
|---|---|---|
| Frontend: components, layout, styles from the canvas boards | Holodeck Officer | Claude |
| Read API over Hermes's files, and every future write-back | Chief Engineer | Codex |
| QA against real data, on the Captain's machine | Security with Ops | local |
| Merges | The Captain | |

The frontend is built only against `api/schema` and the synthetic `fixtures/`. It never sees real data, logs, secrets or memory.

## Footprint

It's hosted on the NAS: 8 GB of RAM, shared with other services. There's no fixed budget yet. This is still a brainstorm.

Rough estimates per stack, to be measured by Ops once something runs:

| Stack | Runtime RAM on the NAS |
|---|---|
| FastAPI or Flask, one worker, templates + HTMX | about 50–90 MB |
| React built to static files, served by the same Python API | about 50–90 MB (no Node at runtime) |
| NiceGUI | about 100–200 MB |
| Streamlit | about 150–300 MB, and it grows with each open session |
| Reflex | 300 MB or more (runs Node and Python) |

- The browser does the drawing on the Captain's own device, so the boards cost the NAS nothing to render.
- Any front-end build runs on the GPU host or in CI, never on the NAS.
- Libraries that bring real quality, such as pandas for lookups (roughly 50–80 MB), are welcome. Weigh them by what they add.

## Repo layout

```
api/schema/      API schema (stations, health, quotas, customs log, runs, jobs)
fixtures/        synthetic data matching the schema. No real values, ever
backend/         read API (Engineering)
frontend/        the ship's decks and consoles (built by the Holodeck Officer)
design/          tokens.json and the HTML/CSS reference templates from the canvas
tests/           both suites. 0 skipped is the bar
```

## Design

The look comes from the **Hermes Starship** design system: dark navy hull, colour means rail (teal local, amber Codex, pink Claude, periwinkle mixed), gold means the captain, and the line style means status (solid live, dashed proposed, dotted future). Fonts are Chakra Petch, Barlow and JetBrains Mono. Tokens live in `design/tokens.json`. Use them rather than raw hex values.

## Running it

The stack is still open. It's being discussed in a Briefing Room session (`briefing-stack.md`) before anything is chosen. Engineering fills this in once it is. It will cover:
- installing dependencies
- running against `fixtures/` (default, safe anywhere)
- running against the real backend (the Captain's machine only)
- running both test suites

## Privacy

- This repo holds code, the schema, design files and synthetic fixtures. Nothing else.
- Never commit national ID number, phone numbers, addresses, emails, account or card numbers, passwords or keys, health readings, receipts, Hindsight memory or real logs.
- Security's pattern scan runs on every PR and blocks a match.
- It's reached from a custom link in the Hermes dashboard's navigation, served on the LAN only, behind a login. Keep the repo private.

## Roadmap

1. **H1:** API schema and fixtures.
2. **Milestone 0:** static UI on fixtures, no backend.
3. **H2 (MVP):** shell, deck plan and sector chart on live data, read-only.
4. **H3:** more read-only boards: Science lab, Sensor array, Main Engineering and crew comms.
5. **H4:** boards that act: Captain's Quarters approvals, the conn handoff and crew loadouts. All writes go through Engineering's backend with the tier rules, the Captain's login and a shadow night first.

Out of scope: the alternative styles, future hires and anything outside the LAN.
