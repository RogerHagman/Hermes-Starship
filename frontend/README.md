# Frontend · the Bridge landing page (Milestone 0)

The first board of the Hermes Starship interface: a 2560 × 1440 LCARS bridge
view (responsive down) over **synthetic fixtures only**. There's no backend, no
live data and no model calls. Built with React, TypeScript and Vite by Claude,
standing in for the Holodeck Officer.

## Reading the code

Start at `src/App.tsx`, which holds the screen state and lays out the board. Each component is a function that
takes props (its inputs) and returns the markup it draws.

| File | What it does |
|---|---|
| `src/App.tsx` | Loads the fixtures and holds the screen state (rail filter, drills, open station), then lays out the board |
| `src/lib/ship.ts` | The ship logic as plain functions: rail state, who is off duty, who acts as head. Tested in `ship.test.ts` |
| `src/lib/fit.ts` | Scales the 2560 × 1440 board to fit a desktop window, like the design boards (F for full screen). Small screens get the reflowing layout. Tested in `fit.test.ts` |
| `src/lib/lookups.ts` | Colours, status line styles, ranks, departments, boards |
| `src/lib/shipmap.ts` | Where each room sits on the ship art, and its icon |
| `src/lib/data.ts` | Reads `fixtures/*.json`. This is the only network code, and it fetches local files only |
| `src/types/fixtures.ts` | Generated from `api/schema` by `npm run types`. Don't edit it by hand |
| `src/components/` | `Frame`, `SideRail`, `Header`, `ShipPlan`, `Panels` (rails, hails, in flight), `Roster` (roster, log), `StationDrawer` |
| `src/styles/` | Tokens from the design system, the page styles, the mess-hall animation |
| `src/assets/ship.svg` | Ship art from DeckPlanV4 (`tools/make_ship_svg.py`). To redraw the ship, swap this file and `shipmap.ts` |
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
