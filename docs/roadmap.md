# Roadmap

Where the original ship stood when this kit was made.

## Done

| Milestone | What it gave |
|---|---|
| **1 · Crew rollout** | Brain roles, routing rules, hand-off contract, crew manifest, station profiles and aliases |
| **1.1 · Number One delegates first** | Own list and budget, ORDs from code on every surface, five-tool leash, every ask on a card titled with its ORD, orders that close themselves (capabilities 1 and 2). Two-week measurement and replay review run alongside |
| **1.2 · Cheaper engineering and a speed on every order** | Systems Engineer and Diagnostics Technician with the guard and split skill; speed words and the Dilithium Burn hold; the Captain's Yeoman; Claude stations on Claude with memory off; honesty label; routing rules in the prompt; local output budgets; dates from the clock (capabilities 3 to 9) |

## In flight

- Split-then-review v2 (plan file, blind tests, `verify.sh`) and a fair three-arm re-test in a Burn window.
- Default speed per station.

## 1.3 (listed)

- Board-keeping with fixed commands; the Ship's Computer archives at the weekly reset.
- Codex model upgrade: test on a small card first, then update every place that names the old model.
- Phrase bank for instant acks.
- Parallel worker cap (after a RAM upgrade).
- Four-question brief skill.
- Read-only GitHub connector, one repo.
- Live fuel gauge per rail, feeding the Main Engineering gauge and the Burn window.

## Later handovers (drafts in [../handovers/](../handovers/))

| # | Handover | Gist |
|---|---|---|
| 2 | Conn handoff and acting command | Time-boxed auto-approval by risk tier while the Captain is away; fail-safe behaviour on the fallback brain ([07-conn-handoff.md](07-conn-handoff.md)) |
| 3 | Holodeck Officer and the Hermes Starship interface | A Claude-rail station builds the ship's interface: static UI on fixtures, then read-only boards on live data, then boards that act ([../holodeck/](../holodeck/)) |
| 4 | Navigation runs the calendar | Read freely, write only with approval; anything reaching another person is a hard stop; invites are data |
| 5 | Call stations with @ and / | One alias registry, parsed in the router, with a picker per surface |

## Ideas, not decided

Chief Strategist (missions and crew plans, run in a Burn); Claude-rail hires (Design Engineer, Calibration Technician); Away Team computer use (Captain-only orders); a crew member with a funny bone (fortune lines on about 1 in 10 completed orders, never on errors); RSS watch for Sensors; weapons department (red-team drills and stop controls); mission and campaign counters; a file-permission lock for Codex instead of the accepted sandbox-off risk.
