# Speed scale, Dilithium Burn and Hail the Fleet

## Speed words

The Captain can say how hard a job should think with one word at the start of a message.

| Word on the order | Reasoning | Codex | Claude |
|---|---|---|---|
| Thrusters | none | none | Low |
| Quarter Impulse | minimal | minimal | Low |
| Half Impulse | low | low | Low |
| Full Impulse | medium | medium | Medium |
| Warp | high | high | High |
| Warp 9 | xhigh | xhigh | Extra |
| Maximum Warp | max | xhigh (Codex tops out here) | Full |

**How it works (all code, patches K, L, Q, S):**
- A word counts only at the very start of the Captain's typed text, followed by a colon or a comma ("Warp 9: …", "half impulse, …"). Case-insensitive, extra spaces allowed, longest match first, so "Warp 9:" is xhigh and "Warp:" is high. Anywhere else, or without the colon or comma, it is ordinary text.
- Attachments don't count: the word is read from the typed text, skipping attachment markers.
- The arrival hook stores the level with the ORD (in `live-ack.jsonl` and the `speed` column of `orders.csv`). The message reaches Number One unchanged.
- `kanban_create` sets the card's reasoning from it, capped at what the station's rail offers. No word means the station's default.
- Number One never adds or judges a speed word. Its routing rules carry the table and one line: the word is for code, route the rest as usual. Without that line, a local model asked about "the ship's speeds" invented a scale where Warp meant "send to Codex".

**Default speed per station:** each station gets a default written as a speed word (for example Thrusters for the Yeoman and the Quartermaster, Full Impulse for the Chief Engineer). Proposed per station; the Captain approves each row and edits the configs.

## Dilithium Burn

Weekly cloud allowance that isn't used by the reset is lost. The Dilithium Burn spends it on jobs that can wait.

- The Captain starts a message with **"Burn:"**. Its cloud card waits on the board (in Ready, not Scheduled without a time).
- In the last 24 hours before that rail's weekly reset (the "Starbase Resupply"), held cards start on their own at **Maximum Warp**.
- Not after the reset: that spends next week's budget. If the week is already drained, the burn is a no-op. The 5-hour window still caps each burst, and the dispatcher's cooldown restart lets the queue run overnight.
- Built first for Claude (fixed weekly reset). The Codex weekly reset moves (it starts at first use after a reset), so its burn window should be set from the live fuel gauge (planned).
- Overnight, while the Captain sleeps, Codex and Claude may use their full windows with reasoning raised where it helps. Daytime normal. If a window runs out, wait.

## Hail the Fleet

Not a speed. Claude's "Ultracode" (many agents working in parallel) answers as the **Task Force**. Only the Captain gives the order, on a specific job; no station or Number One adds it. Not built.

## Modifiers for Engineering plans

Two words at the top of a plan file change how a split job is reviewed (see [06-engineering-split.md](06-engineering-split.md)):
- **BIG:** the plan names one or two checkpoints. The Chief Engineer may set it.
- **CRITICAL:** the Chief Engineer reviews every stage and may build a stage itself. Only the Captain sets it, and it never goes to an acting head.
