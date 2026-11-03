# Holodeck: the ship's interface (kit notes)

Visual work for the Hermes Starship interface. Everything here runs on **made-up sample data**: nothing reads Hermes's files or calls a model.

| Folder / file | What it is | How to rebuild |
|---|---|---|
| `IDEA.md` | The original idea doc, in the Captain's own voice | — |
| `README.md` | The interface repo README: milestones (static UI on fixtures → read-only live boards → boards that act), footprint, roadmap | — |
| `briefing-stack.md` | A Briefing Room pack for choosing the interface stack (a discussion, not a decision) | — |
| `design-system/` | TNG / LCARS-style tokens (`tokens.json`), principles and component previews. Colour = rail (teal local `#3fc1a5`, amber Codex `#f0a948`, pink Claude `#e889b6`, periwinkle mixed `#8fa8e0`), gold = Captain (`#e8c37a`), red = tier 3 only. Solid / dashed / dotted = live / proposed / future. Fonts: Chakra Petch, Barlow, JetBrains Mono | — |
| `concept-art/` | Animated 3D concept page (three.js r147 from jsDelivr): exterior flyby, bridge, deck plan with customs traffic, crew quarters, a Briefing Room session, engine room, comm badge | `node concept-art/build.js` concatenates `src/` into `hermes-starship.html` |
| `ship-plan-v4-src/` | Master-systems-display cutaway of a saucer-and-hull ship with rooms, mess hall animation, deflector and bussard collectors, and a station console. Board size 2560×1440, responsive down | `cd ship-plan-v4-src && python3 rooms.py && python3 messhall.py && python3 gen.py && python3 build.py` → `DeckPlanV4.dc.html` (a single HTML board; links to other boards in its menu point at files from the original design canvas and won't resolve) |
| `ship-plan-ultrawide/` | Experimental 5120×1440 four-body ship plan with file rooms (SOUL, routing rules, contract, briefs, patch bay…) showing sample snapshots, a GPU bay readout with sample numbers, and proposed weapons rooms | `node ship-plan-ultrawide/build.js` merges `data.js` into `page.tpl.html` → `hermes-ultrawide.html` |

## Interface rules worth keeping

- **Moving around never calls a model.** Boards, filters, tabs, status and display are read from local files through a read API. Order buttons may run a prompt or a saved skill; free text from the comm badge is fully intelligent.
- **Every claim shows where it came from:** order rows carry their ORD (and MSN / CMP) IDs in mono.
- **The comm badge** offers Ask / Order / Approve / Deny / Write. Approve and Deny both clear the hail and log an ORD. Every console card is clickable and opens a detail view.
- **Crew tokens** walk between post, briefing table and cabin. Off duty = relieved by the Captain, or the station's rail is down; the next officer by rank acts as department head.
- Ship registry in the art is `HX-01`; change it to taste.
