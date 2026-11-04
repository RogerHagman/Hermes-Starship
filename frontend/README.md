# Frontend · the Bridge landing page (Milestone 0)

The first board of the Hermes Starship interface: a 2560 × 1440 LCARS bridge
view (responsive down) over **synthetic fixtures only**. There's no backend, no
live data and no model calls. Built by Claude, standing in for the Holodeck Officer.

| What | Where |
|---|---|
| Page | `index.html`, `css/landing.css`, `js/landing.js` (plain JS, no build step) |
| Tokens | `css/tokens.css`, copied from `holodeck/design-system/tokens.json` |
| Ship art | `assets/ship.svg`, made from the DeckPlanV4 sources by `tools/make_ship_svg.py` |
| Station positions and icons | `js/shipmap.js` (design data, not fixtures) |
| Data | `../fixtures/*.json`, checked against `../api/schema/*.schema.json` |
| Fonts | `fonts/`: Chakra Petch, Barlow, JetBrains Mono (SIL Open Font License), self-hosted so the page makes no outside requests |

## What's on it

- **Ship plan.** Every station is a room on the cutaway, coloured by its rail. Solid, dashed and dotted lines mean live, approved or proposed, and name reserved. A dot means the station is working on an order. Click any room for its detail drawer.
- **Rails.** Local, Codex and Claude, with 5-hour and weekly window meters and reset times, plus the Dilithium Burn marker.
- **Awaiting your orders.** Hails that stop for the Captain. Approve and Deny are shown but disabled until H4.
- **In flight.** Open ORDs, with split child cards under their parent.
- **Duty roster.** Departments, heads first. When a head is off duty, the next officer by rank shows as ACTING.
- **Ship's log.**
- **Show rail** filter, and **Drill · rail out**, which previews a rail going down: nacelles go dark, crew go off duty, acting heads take over and orders wait. A drill only changes the screen.

The other boards in the side rail are marked with the phase they arrive in (H2 to H4).

## Run it locally

```
python3 frontend/serve.py          # http://127.0.0.1:8650
```

Opening `index.html` straight from disk won't load the fixtures. For a single-file
preview: `python3 frontend/tools/build_preview.py dist/bridge-preview.html --fonts`.

## Tests

```
pip install jsonschema
python3 -m unittest discover -s tests -v
```

These tests check that every fixture validates against its schema, that the fixtures agree with each other, and that they hold no personal or secret-looking patterns. They also check that the page loads only its own files, makes no write requests, and calls no model endpoint.

## On the NAS

`deploy/compose.yaml` runs nginx:alpine (about 5 MB of RAM measured, capped at 64 MB) with basic-auth login,
read-only mounts, GET and HEAD only, and a strict Content-Security-Policy. Port 8650 on the LAN.
