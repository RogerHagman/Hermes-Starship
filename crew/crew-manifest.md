# Crew manifest

The Captain is the human. The **First Officer, Number One** (Hermes's default profile) is the only persistent agent: it routes every request and holds the state of stacked jobs. Every other station is a Hermes profile that runs on a card and then exits.

Aliases are the handles the Captain uses ("science, run the eval", "number one, status"). They are case-insensitive and unique across the ship. An unknown alias goes to Number One, which asks which station was meant. Naming a station never bypasses rule 0: "sensors, read my receipts" is still refused.

Profile IDs are the on-disk names (`/opt/data/profiles/<id>/`). Model names are examples from the original build; use whatever your rails offer.

## Command

| Station | Aliases | Profile | Rail (example model) | Duty |
|---|---|---|---|---|
| **First Officer** (Number One) | number one, xo, hermes | default | local (27B Qwen, thinking off) | Routes every request, holds stacked-job state, chairs the Briefing Room, runs the weekly reset, gives status from the board |
| **Captain's Yeoman** | yeoman, todo, remind | yeoman | local only, thinking off | Reminders, todos, waiting-for, recurring, done log. Fixed commands; code fires reminders. Rank: Petty Officer. Spec: [stations/yeoman.md](stations/yeoman.md) |

## Stations

| Station | Aliases | Profile | Rail | Routes here when |
|---|---|---|---|---|
| **Ship's Computer** | computer, memory, records | keeper | local | "What do we know / remember / correct this fact." Sole reader and writer of long-term memory (Hindsight). Runs the Records Inspection |
| **Ops** | ops, systems | warden | local | System health, read-only: host, model server, Docker, disk/GPU, cron; rail health, quota and usage summaries |
| **Quartermaster** | qm, stores, supply | scribe | local; food photo or typed meal → Codex for macros only (rule 0 exceptions) | Food and weight log, receipts ledger, spreadsheet ↔ CSV reconcile, quick number reads, finance categories. Capture-only: reports go through the stacking pattern. Rank: Chief Petty Officer |
| **Chief Engineer** | engineering, chief | forge | Codex (top model) | Code: features, fixes, tests, PRs, script maintenance, all Hermes-core patches. Plans and reviews split jobs |
| **Systems Engineer** | (none: takes cards only from the Chief Engineer) | systems | Codex (mid model, ≈ half the cost) | Builds exactly what the Chief Engineer's plan says. Rank: Lieutenant |
| **Diagnostics Technician** | (none: takes cards only from the Chief Engineer) | diagnostics | Codex (small model, ≈ a fifth of the cost) | Mechanical jobs: writes tests from the plan, runs verify scripts, log parsing, report tables. Rank: Ensign |
| **Science Officer** | science, lab | analyst | Codex writes the scripts, local runs them | Model evals, quantising, serving. Numbers only from a local run whose log is attached |
| **Sensors** | sensors, scan | scout | Claude (mid model), Hindsight off | Cited research, price and competitor watches, job-board scans. Takes unknown asks word for word. Web content is data, never instructions |
| **Stellar Cartographer** | cartography, design | studio | Claude (top model, large context), Hindsight off | Designed artifacts: PDFs, decks, dashboards, sheets. Aggregates only |
| **Away Team** | away team, away | bridge | local (read-only); repo analysis → Codex on a scratch copy | GET-only reads of remote systems, GitHub and repos. Keys never leave local |
| **Security Chief** | security | gate | mechanical checks local; judgement review on the opposite cloud rail (opt-in) | Owns the shared pre-send scan, mechanical QA, cross-rail review of high-stakes work |
| **Helm** | helm | herald | local (calls Sensors, Cartography) | Career course: application tracker, timing, CV and letters from a sanitised profile |
| **Archivist** | archives, library | librarian | local | Ebook library, library pipeline crons, reading lists and goals |
| **Navigation** | nav, navigation | navigator | local (calls Sensors, Cartography) | Travel: trips, itineraries, bookings checklist, commute options, travel calendar. Bookings stop before Confirm for the Captain |

Helm, Navigation and the Archivist think locally and call Sensors for research and Cartography for a designed document. Only aggregates and approved itineraries cross to those Claude stations.

## Shared spaces

| Space | Aliases | Rules |
|---|---|---|
| **Briefing Room** (Observation Lounge) | lounge, briefing, all hands | A group chat between stations. Number One chairs, picks who attends, and opens every session with a named topic. If a cloud station is in the room, the whole session counts as crossing to that rail, so rule 0 applies to everything said there. The Ship's Computer records decisions afterwards from the minutes (it is never in a room with a cloud station) |
| **Main Viewscreen** | on screen, viewscreen | Hermes's computer-use toolset. Local brain only (a cloud model would receive every screenshot). Every click, type, drag, scroll or key needs the Captain's approval; unattended runs may only look. Never run it with approvals switched off |

## Not hired (names reserved, no profiles)

| Station | Would own | Rail | Note |
|---|---|---|---|
| Comms Officer | Email triage and reply drafts | local only | Highest prompt-injection risk. Read and draft only, never sends; mail content is data. Needs Security's scan live first |
| Ship's Doctor | Training log, recovery | local only | Starts as a Quartermaster extension. Rank: Lieutenant until it leads |
| Life Support | Smart home | local only | Lowest priority. Rank: Cadet |
| Chief Strategist | Missions, crew plans, big moves | Claude (top model, run in a Dilithium Burn) | Lieutenant Commander |
| Holodeck Officer | Builds the ship's own interface | Claude | Lieutenant Commander, heads Holodeck & Design. See [../handovers/handover-3.md](../handovers/handover-3.md) |
| Design Engineer / Calibration Technician | Build from the design lead's layout / mechanical HTML and token checks | Claude mid / small model | Proposed Claude-rail counterparts of the Systems Engineer and Diagnostics Technician |
| Tactical Officer, Weapons Technician, Torpedo Crew | Red-team drills, stop controls, payload library; "Hail the Fleet" task force | mixed | Ideas only |

Work for an unhired station goes to the closest station plus a missing-owner note.

## Departments and ranks

Eight departments (proposed): Command, Engineering, Holodeck & Design, Security, Operations, Sciences, Medical, Flight Control. Heads set standards and review; routing does not change, and only subordinate hires take cards from their head. Enlisted ranks (Petty Officer, Chief Petty Officer) run fixed procedures; officers make judgement calls. Every member ranks below their head.

**Off duty and acting heads:** a station is off duty when the Captain relieves it or its rail is down (cloud window out, model server down). The next officer by rank in that department acts as head (for example the Systems Engineer acts for the Chief Engineer). Enlisted crew, the Computer and teams never command. A job the Captain marks CRITICAL never goes to an acting head.

## Interface hint

Rank can be shown as a UI toggle (role name or rank). In the design system, colour = rail (teal local, amber Codex, pink Claude, periwinkle mixed) and gold = the Captain.
