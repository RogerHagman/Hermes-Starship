# Frontend · the Bridge and the Captain's Quarters

The first boards of the Hermes Starship interface, each a 2560 × 1440 LCARS
view (responsive down) over **synthetic fixtures only**. There's no backend, no
live data and no model calls. Built with React, TypeScript and Vite by Claude,
standing in for the Holodeck Officer.

- **Bridge** (Deck 1, `#/bridge`): the ship plan with a console under the saucer, rails, hails, orders in flight,
  the duty roster and the ship's log.
- **Captain's Quarters** (Deck 2, `#/quarters`): the room itself is the hero. Pick the chair (hails in full), the
  viewport (the rail windows over the next 24 hours), the log terminal, the Yeoman's PADD, the standing-orders plaque
  or the bookshelf, and its view comes up on the wall screen. Around the room: hails, rails, the duty roster with
  Relieve and Recall, campaigns with their missions, and the order log. The ship model on the desk goes back to the
  Bridge. Approve, Deny, Write and new log entries stay on the screen until orders open in H4.
- **The Bridge posts** (Deck 1): Number One's post (`#/xo`: the routing table, comm channels, fast path, rail
  rules), Helm (`#/helm`: the career course from the application tracker, your gates, follow-ups, the method),
  Navigation (`#/nav`: the next 7 days, trips, bookings held for you, slots for the Yeoman's Schedule box) and the
  Main Viewscreen (`#/viewscreen`: what is on screen, the tape of actions, what waits for your OK). One room, one set of
  parts and one stylesheet for all four (`components/post`, `lib/post.ts`, `styles/posts.css`), each with its own accent.

## Reading the code

Start at `src/App.tsx`, which holds what both boards share and picks the board. Each component is a function that
takes props (its inputs) and returns the markup it draws.

| File | What it does |
|---|---|
| `src/App.tsx` | Loads the fixtures, holds what both boards share (rail filter, drills, who is relieved), shows the Bridge or the Quarters |
| `src/lib/board.ts` | Which board is on screen, kept in the address bar (`#/quarters`). Tested in `board.test.ts` |
| `src/lib/ship.ts` | The ship logic as plain functions: rail state, who is off duty or relieved, who acts as head. Tested in `ship.test.ts` |
| `src/lib/quarters.ts` | Where things sit in the Quarters picture, the greeting, the stardate and the nights for the windows chart. Tested in `quarters.test.ts` |
| `src/lib/fit.ts` | Scales the 2560 × 1440 board to fit a desktop window, like the design boards (F for full screen). Small screens get the reflowing layout. Tested in `fit.test.ts` |
| `src/lib/lookups.ts` | Colours, status line styles, ranks, departments, boards |
| `src/lib/shipmap.ts` | Where each room sits on the ship art, and its icon |
| `src/lib/data.ts` | Reads `fixtures/*.json`. This is the only network code, and it fetches local files only |
| `src/types/fixtures.ts` | Generated from `api/schema` by `npm run types`. Don't edit it by hand |
| `src/components/` | `Frame`, `SideRail`, `Header`, `BridgeBoard`, `ShipPlan`, `ShipConsole` (the console, shared with the wall screen), `CaptainsChair` (the console when you pick the Captain), `Panels` (rails, hails, in flight), `Roster` (roster, log, rank pips), `CommBadge` |
| `src/components/quarters/` | `QuartersBoard`, `Room` (the picture and its buttons), `WallScreen` (one view at a time), `Panels` (duty roster, campaigns, order log) |
| `src/styles/` | Tokens from the design system, the Bridge styles (`landing.css`), the warmer Quarters theme (`quarters.css`), the mess-hall animation |
| `src/assets/ship.svg` | Ship art from DeckPlanV4 (`tools/make_ship_svg.py`). To redraw the ship, swap this file and `shipmap.ts` |
| `src/assets/quarters.svg` | The Captain's Quarters picture, drawn by `tools/make_quarters_svg.py` (`python3 frontend/tools/make_quarters_svg.py`). Move something there, then move its box in `lib/quarters.ts` |
| `src/lib/xo.ts`, `helm.ts`, `nav.ts`, `viewscreen.ts` | Each Bridge post's things in the room and its plain functions (stages, follow-ups, free slots, the tape). Tested next to them |
| `src/components/post/` | `PostRoom` (the picture, its buttons, the desk and the wall screen) and `Parts` (desk tiles, order rows, one order, number tiles, day bars) the four posts share |
| `src/assets/xo.svg`, `helm.svg`, `nav.svg`, `viewscreen.svg` | The four Bridge post rooms, drawn by `tools/make_bridge_posts_svg.py`. Move something there, then move its box in that post's lib file |
| `src/assets/bridge-chair.svg` | The Captain's chair on the Bridge, drawn by `tools/make_bridge_chair_svg.py` from the same chair as the Quarters |
| `dist/` | The built page that the NAS serves. Committed, and CI checks it matches a fresh build |

## Commands

```
npm ci              # install (on Minted Penguin or in CI, never on the NAS)
npm run dev         # http://localhost:8650, with /fixtures/ served from ../fixtures
npm run check       # types up to date + TypeScript + logic tests
npm run build       # writes dist/ — commit it
npm run single      # one-file preview in dist-single/ (fixtures baked in)
npm run board       # that preview as a fixed 2560 × 1440 board (Fit, 1:1, Full screen) in dist-board/
npm run types       # regenerate src/types/fixtures.ts after a schema change
```

The Python tests in `../tests` check the fixtures against the schema and enforce
the one rule on the source (`python3 -m unittest discover -s tests -v` from the repo root).

## On the NAS

`deploy/compose.yaml` runs nginx:alpine serving `frontend/dist` and `fixtures/`.
It has a basic-auth login, read-only mounts, answers GET and HEAD only, and sets a strict Content-Security-Policy.
It uses about 5 MB of RAM (capped at 64 MB) and listens on port 8650 on the LAN. Nothing is built on the NAS.

Fonts (Chakra Petch, Barlow, JetBrains Mono, SIL Open Font License) are self-hosted, so the page makes no outside requests.
