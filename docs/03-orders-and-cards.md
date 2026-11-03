# Orders, cards and logs

## Orders (ORD)

- Every message the Captain sends gets an **ORD** (ORD-1001 and up), minted by code on arrival, on every surface (Telegram, desktop, dashboard). A local model minting IDs at turn start took 86 seconds and reused numbers; code takes nothing.
- A turn that files no card (a status question, a clarifying answer) gets no ORD.
- `orders.csv` is the canonical record: `order_id, received_at, from_surface, station, kind, status, closed_at, speed`. Code writes every row and every timestamp. Old rows are never rewritten, except the status and `closed_at` of the matching ORD.
- `live-ack.jsonl` holds the one thing the CSV doesn't: which chat or session each ORD belongs to, so code can find "the newest ORD for this chat". If you add a `chat` column to the CSV, the JSONL can go.
- The counter lives in its own file; nothing else mints.

## Cards

- Kanban gives dispatch, a worker process per card and card status for free. The ORD in the card title ties the ship's language to the transport.
- Code stamps the right ORD on every card Number One files (replacing any number the model wrote, or "ORD: none"), and strips skills, model, provider and priority, so a model can't pin a skill that doesn't exist and crash the worker.
- Workers mark their own cards done. Briefs say "Mark this card done when finished. Do not request a review."
- Child cards: a card may have parents, and starts only when all its parents are done. The Engineering split uses this (build and tests side by side, verify after both, review after verify).
- The Kanban auto-decomposer is switched off (`kanban.auto_decompose: false`): it rewrote the title and body of a live card.
- Cap parallel workers once memory is tight: each running card is its own Hermes process (about 0.3 to 0.7 GB, more during builds).

## Three messages to the Captain

1. **Received** (from code, on arrival): did it arrive?
2. **Handed to** (Number One's receipt): who has it? This is the proof Number One routed instead of doing the work.
3. **Done** (the board's completion notice): is it finished?

Answers from Number One's own list skip the middle one. Stations never message the Captain themselves.

## Closing an order

The **card-close hook** (code, no model):
- sets the ORD row's status (`done`, `blocked`, `failed`) and `closed_at`;
- appends one line to the rollout file the card names, or to `ROLLOUT-orders.md` if it names none: `ORD | card | station | result`;
- for a split job, closes the ORD once, after the last card (the review) is done, using the board's dependencies.

A rollout line used to be a model call per card; it is now code. The Ship's Computer keeps only the judgement work: the audit (see [08-memory-and-records.md](08-memory-and-records.md)).

## Intent note

When a cloud-rail card closes, the rail writes three lines from its own brief and output, inside the call it already makes: **decided / changed / rejected** ("none" if nothing). It is the only witness to intent that never sees memory, which makes the memory audit two-key under rule 0.

## Orders, missions, campaigns

| Level | ID | What it is | Who opens it |
|---|---|---|---|
| Order | ORD- | One station, one task | code, on every message |
| Mission | MSN- | A named job across stations: parent campaign, tags, done-when, stations, highest tier, status, dates | the Strategist drafts, the Captain approves; Number One may open a small one (three orders or fewer, tier 0 or 1) |
| Campaign | CMP- | An objective with a measure and a target date, 1 to 2 tags from a fixed list (career, health, money, home, travel, reading, ship) | only the Captain, reviewed at the weekly reset |

An order carries its mission and campaign IDs when it belongs to one. "Open as a mission?" fires only on jobs of two or more stations and costs the Captain one word. Briefing Room sessions open with the mission name (or a short topic) and file their minutes under it. Mission and campaign counters are designed, not built.

## Instant acknowledgements (planned)

- The moment a message lands, the gateway posts an ack line from a phrase bank (`/opt/data/voice/phrases.json`, slots `ack`, `dispatch_one`, `dispatch_many`, `ask`, plus time-of-day and urgent buckets). No model.
- The model only returns structured routing (`stations`, `tasks`); the dispatch line is filled from a template ("{stations}, you're up. {order}: {task}").
- On Telegram the ack is edited in place into the dispatch line. No ack when a fast path answers within about a second.
- Cartography writes the lines (about 20 per slot, in the ship's voice); Engineering builds the picker, which never repeats one of the last three.

## Does each piece earn its keep?

The test applied to every piece: what breaks, or who can't answer a question, if we remove it?

| Piece | Verdict |
|---|---|
| Minting in code at arrival | Keep: the only way to get correct IDs and a reply in under 5 s |
| Two logs (CSV + JSONL) | Keep the JSONL only as the chat lookup, until the CSV has a chat column |
| Queued turns, Number One routes | Keep: `display.busy_input_mode: queue` fixed lost messages |
| "Open as a mission?" | Keep: fires only on multi-station jobs |
| Card titled with the ORD | Keep |
| Three messages | Keep: each answers a different question |
| Intent note | Keep: three lines, no extra model call |
| Rollout entry | Keep the entry, drop the model (close hook) |
| Records Inspection | Keep, start with the weekly reset plus on demand |
