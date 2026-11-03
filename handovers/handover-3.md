# Handover 3 · Holodeck Officer and the Hermes Starship interface

**Origin:** draft handover from the original ship, in the four-questions format.
**Status:** Draft, not approved. The hire, the routing exception and the build each need the Captain's go.
**Order:** after handover 1.1. Phase H4 also waits for handover 2, because it acts on approvals.

## GOAL
Hire a Holodeck Officer and build the Hermes Starship interface on the LAN in small, useful steps: a static UI first, then read-only boards on live data, then boards that act.

## CONTEXT
- The ship's interface is "Hermes Starship". The Holodeck is where the Holodeck Officer builds it, not where the Captain uses it (`holodeck/README.md`, `holodeck/IDEA.md`).
- **The stack is still open.** It's decided in a Briefing Room session in a Hermes group chat (`holodeck/briefing-stack.md`). Nothing in this handover picks a stack. Hosting idea: on the home server, linked from the Hermes dashboard's nav.
- Design source: the design system (tokens, rail colours, components) at `holodeck/design-system/`.
- **GUI rule:** moving around (navigation, display, status) never calls a model. Order buttons may, and canned orders run a saved skill.
- **Package (the Captain, 21/10):** ships with templates for the first version: this file, the design tokens, plain HTML/CSS reference templates (deck plan, sector chart, read-only Quarters), an API schema draft with synthetic fixtures, and a README mapping each board to its endpoint. It's built when the Captain says 1.1 and 1.2 are far enough along.

### The new station (proposed)
| Station | Aliases | Profile | Brain | Duty |
|---|---|---|---|---|
| **Holodeck Officer** | holodeck, holo, ui | `holo` | Claude Code on plan sign-in, own quota slot apart from Sensors and Cartography | Builds and maintains the ship's own interface from the canvas designs |

- Pairs with the Chief Engineer, who owns the backend and data layer. Each reviews the other's PRs (rule 9).
- Differs from Cartography, which designs deliverables for the Captain (PDFs, decks, sheets). Holodeck builds the ship itself.
- Deck plan position: Deck 3, next to Engineering.

### Who does what
| Part | Owner | Rail |
|---|---|---|
| Components, layout and styles from the canvas boards | Holodeck | Claude |
| API and event stream over Hermes's files, plus every write-back | Chief Engineer | Codex |
| QA against real data, on the Captain's machine | Security, with Ops | local qwen |
| Merges | The Captain | n/a |

## CONSTRAINTS
- **Routing exception (proposed, goes into `routing-rules.md` word for word once approved):**
  > **Exception (Holodeck):** Front-end code for the ship's dashboard may go to the Claude rail. The Holodeck Officer receives only design files, an API schema and synthetic fixture data. It never receives real data, logs, secrets, memory or anything from the Captain's systems. Everything else in rule 0 stands. Backend code, and anything that reads Hermes's files or writes back, stays with Engineering on Codex.
- **Number One only routes.** Each task has an owner station and goes out on a Kanban card titled with its code-minted ORD. Progress lives in `/opt/data/handoff/ROLLOUT-3.md`.
- LAN only, behind a login. Nothing in H2 or H3 can approve or change anything.
- Not in scope: the alternative styles (cutaway, holo rings), the original clean deck plan, future hires, and exposing the dashboard outside the LAN.

## DONE WHEN
Every phase below is ticked in `ROLLOUT-3.md` with proof, and the Captain has signed off each 🛑 step.

## CHECKPOINTS
🛑 the Captain after H0.1, M0, H2 and each H4 board.

---

## Tasks

### H0.1 · Hire: the `holo` profile and the exception
- **Goal:** the `holo` profile exists with its aliases and its own Claude quota slot, and the exception above is in `routing-rules.md`.
- **Owner:** Engineering on Codex creates the profile; Security extends the pre-send scan so any Holodeck payload that isn't design files, the schema or fixture files is rejected.
- **Done when:** the profile answers to "holodeck", the exception text is on disk, and a test payload with a real log line is blocked. 🛑 the Captain

### H1.1 · Contract between the halves
- **Goal:** an API schema covering stations, health, quotas, the customs log, runs and jobs, plus synthetic fixtures that match it.
- **Owner:** Engineering on Codex. Security checks the fixtures.
- **Done when:** the schema validates against the fixtures, and Security confirms the fixtures hold no real data.

### M0 · Static UI (Milestone 0)
- **Goal:** a clickable, static version of the interface on fixtures only: shell, deck plan and station tiles, styled from the design system. No backend, no live data, no model calls.
- **Owner:** Holodeck on Claude.
- **Start with:** the stack decision from the Briefing Room session. If it hasn't happened, stop and ask the Captain.
- **Done when:** the Captain can open it on the LAN and move around every board, and nothing in it calls a model or reads Hermes's files. 🛑 the Captain

### H2 · Read-only dashboard on live data
- **H2.1 Goal:** the app shell, shared styles and the kept deck plan (`DeckPlanV2`) on fixtures. **Owner:** Holodeck.
- **H2.2 Goal:** a backend serving live station status, Ops health, rail quotas and the customs log from `handoff-log.csv`. **Owner:** Engineering on Codex.
- **H2.3 Goal:** the sector chart, then run locally against the real backend. **Owner:** Holodeck builds; Security and Ops run QA on qwen.
- **Done when (whole phase):** the deck plan and sector chart show live data on the LAN, both test suites pass with 0 skipped, and nothing in the app can approve or change anything. 🛑 the Captain

### H3 · More read-only boards
- **Goal:** one task per board, each with its backend piece first. Order: Science lab, Sensor array, Main Engineering, crew comms (beams and channels, read-only).
- **Owner:** Engineering (backend) then Holodeck (board).
- **Done when:** each board shows live data and passes QA on the real backend.

### H4 · Boards that act (after handover 2)
- **Goal:** one task per board: Captain's Quarters approvals, the conn handoff, then crew station loadouts.
- **Constraints:** write-backs go only through Engineering's backend, which applies handover 2's tier rules. Every action needs the Captain's login. Each board runs one shadow night before going live.
- **Done when:** the Captain has reviewed each shadow night and signed off the board. 🛑 the Captain
