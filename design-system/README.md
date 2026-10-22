# Hermes Starship

The look of Roger's Hermes crew: a starship whose stations are agents, drawn as a deck plan you can walk around. This guide is taken from the boards already on the Starship Deck canvas (the deck plan, Captain's Quarters, the Strategist console, the viewscreen and the station consoles). It is the reference the Holodeck handover (handover 3) builds from.

## The idea in one line

**A calm ship's console at night.** Dark navy hull, thin lines, one glowing colour per rail, and gold only where the captain is needed.

## Principles

1. **Colour means a rail.** Teal is local qwen, amber is Codex, pink is Claude, periwinkle is a mixed station. A station's tile, icon, top bar and pills all take its rail colour, so you can see where work runs without reading.
2. **Gold means Roger.** Captain gold is spent on Approve, on links and on anything waiting for the captain. One gold primary per view.
3. **Line style means status.** Solid is live, dashed is new or proposed, dotted is a future hire. Proposed tiles also drop to 80% opacity and future ones to 60%.
4. **Red means stop.** Tier 3 and the red alert lamp are the only reds. Errors use the softer `bad` coral.
5. **Moving around never calls a model.** Opening a board, filtering, tabs, status and the viewscreen in display mode are read from local files. Order buttons may run a prompt or a saved skill, and free text from the comm badge is fully intelligent.
6. **Every claim shows where it came from.** Order rows carry their ORD, MSN and CMP IDs in mono so anything on screen can be traced.

## Two decks, one system

| Theme | Where | Ground | Feel |
|---|---|---|---|
| `bridge` | Deck plan, consoles, Strategist, viewscreen, sector chart | navy `#070b14` | cool, technical, starfield |
| `quarters` | Captain's Quarters | aubergine `#0b0d14` with warm panels | private, warmer, more gold |

Both themes share rail, tier, status and captain colours. Only surfaces, borders and text shift.

## Colour

- **Ground** `bg`, with a soft radial glow of `surface-selected` behind the board's focal point. On the bridge, a sparse starfield of 2–3px white dots at 30–60% opacity.
- **Surfaces** step up: `surface` for panels and resting tiles, `surface-raised` for cards inside a panel, `surface-selected` for whatever is picked.
- **Text** is `text` for content, `text-label` for mono labels and IDs, `text-muted` for help lines. All pairs pass 4.5:1 on every surface they sit on.
- **Rails:** `rail-local`, `rail-codex`, `rail-claude`, `rail-mixed`. A selected tile gets a 3px halo of its rail colour at 18% plus a 28px outer glow.
- **Tiers:** `tier-0` to `tier-3` borrow the rail scale (teal, periwinkle, amber) and end in red.
- **Status:** `good` and `bad` for checks, health and results.

## Type

Three families from Google Fonts:

- **Chakra Petch** (display): board titles, panel titles, station names, buttons. Squared and a little military, it carries the ship.
- **Barlow** (body): requests, plans, briefings. Narrow, so long text sits well in panels.
- **JetBrains Mono** (labels): IDs, handles, deck locators, pills, timestamps. Locators are upper case at 0.14em tracking with middle dots: `DECK 1 · PRIVATE · LOCAL ONLY`.

Sizes stay in a tight band from 10.5px to 19px inside panels, with 32px for the board title only.

## Shape and space

- **Radii:** 8px buttons, 10px tiles and inbox cards, 12px campaign cards, 14px panels, full pills.
- **Strokes:** 1.5px on panels, cards and buttons. 2px on station tiles and the focus ring.
- **Spacing:** 4 · 6 · 8 · 10 · 12 · 14 · 18 · 22 · 28. Cards pad 12, panels pad 18, panels sit 22 apart, boards have a 28 margin.
- **Targets:** at least 40px tall for buttons in panels, 44px in the board header.

## Components

- **Station tile.** Rail-coloured 2px border in the status line style, a 3px top bar, a 16px line icon, the short name in Chakra Petch and the handle in mono. A pulsing 6px dot marks a station working right now.
- **Pills.** Mono 10.5–11px in a full-radius outline: rail pills, tier pills (`T0`–`T3`), status pills (`LIVE`, `PROPOSED`, `FUTURE HIRE`) and kind badges on the comm badge (`ASK`, `ORDER`, `APPROVE`).
- **Inbox card.** Who it's from in the station's rail colour, the kind on the right, the request in body type, then Approve (gold, filled), Decline (outline), and on the right an icon-only On screen button and View to expand the full plan.
- **Panel.** `surface`, 1.5px `border`, 14px radius, a panel title with its count in mono on the right and one help line under it.
- **Buttons.** Gold filled for the one captain action, outlined in `border-strong` for the rest, outlined in a rail colour when the button belongs to a station. Navigation is always outlined.
- **Campaign card.** CMP ID in gold mono, name in `card-title`, objective on one line, a 6px progress bar, tags and target date in mono.

## Icons

Line icons on a 24px grid, stroke 1.8–2, round caps and joins, no fill, drawn in the station's rail colour. One icon per station, kept the same on every board (for example a pawn path for the Strategist, a house for Quarters).

## Motion

Only two things move: the working dot pulses and the thrusters glow softly. Both stop under reduced motion.

## Voice

The UI speaks like a calm first officer: short, plain sentences, the captain addressed as "you". Use the ship's names (Number One, Quartermaster, Briefing Room) and keep the jargon out of help lines. Help text says what a panel is for and who decides, for example "Only you open or close one."

## Privacy on screen

The dashboard may show Roger's first name, campaign and mission names, general goals, job titles and city. It never shows personnummer, phone, address, email, account or card numbers, keys, raw health readings or full receipts. Those stay in the local stores and are referred to by ID.
