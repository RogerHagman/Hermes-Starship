# Handover 2 · Conn handoff and acting command

**Origin:** draft handover from the original ship, in the four-questions format.
**Status:** Draft, not approved. Starts only after the Captain's go **and** after handover 1.1 (N4 live) is finished.
**Source docs:** `conn-handoff.md` (canonical for this handover); `crew-manifest.md`, `routing-rules.md` and `handoff-contract.md` take precedence where they overlap.

## GOAL
Let the Captain hand Number One the conn: a time-boxed order under which routine requests are auto-approved while they're away. Also make the ship fail safe when Number One drops to its fallback brain (acting command).

## CONTEXT
- Today every approval waits for the Captain. Until task C2 is signed off, that stays true.
- Risk tiers 0–3 and the hard stops are defined in `conn-handoff.md`. Tier 3 always waits for the Captain.
- The fallback chain is qwen → the Codex top model, and it doesn't change. "Acting command" means Hermes is running on the Codex top model.

## CONSTRAINTS
- **Number One only routes.** Every task below names its owner station; Number One hands it off on a Kanban card titled with the code-minted ORD and holds no work itself (routing-rules.md, 24/10).
- One task at a time, in order. Progress lives in `/opt/data/handoff/ROLLOUT-2.md`, never in the 1.1 checklist.
- Only the Captain writes the conn order. Number One can never create, extend or widen one.
- Old log rows are never rewritten.
- Not in scope: the starship dashboard, and any change to the fallback chain, the routing rules or the future hires.

## DONE WHEN
Every task below is ticked in `ROLLOUT-2.md` with real proof, and the Captain has signed off the D4 drill.

## CHECKPOINTS
🛑 the Captain reviews after A1, C2 and D4. After each 🛑, and at the end, send the Captain a short summary: what was done, the proof, anything that looks off.

---

## Tasks

### A1 · Sync the doc and start the checklist
- **Goal:** `conn-handoff.md` sits with the other canonical docs in the `three-rail-handoff` skill folder, and `ROLLOUT-2.md` lists A1 to D4.
- **Owner:** Ship's Computer.
- **Done when:** both files are on disk and the Captain has seen them. 🛑 the Captain

### B1 · Tier classifier
- **Goal:** a function that gives every request a tier from 0 to 3. When unsure between two tiers, it picks the higher. Every hard stop returns tier 3, whatever the request says about itself.
- **Owner:** Engineering on Codex. Tests first, synthetic requests only.
- **Done when:** the tests cover every hard stop plus at least two examples per tier, all pass with 0 skipped, and Security confirms they ran.

### B2 · Log fields
- **Goal:** `approved_by`, `tier` and `order_id` columns in `handoff-log.csv`. Old rows get blanks.
- **Owner:** Engineering on Codex.
- **Done when:** a test entry shows all three fields and a diff shows the old rows unchanged.

### C1 · The order file and the two commands
- **Goal:** `/opt/data/conn/order.json` holds threshold, duration, ping setting, issue time and expiry. Only the Captain's "Number One, you have the conn" and "I have the conn" (Telegram or Quarters) write it.
- **Owner:** Engineering on Codex.
- **Done when:** both commands work in a test, and an attempt by Number One to write the file is refused and logged.

### C2 · Auto-approval gate, shadow mode first
- **Goal:** approve when tier ≤ threshold, tier < 3, no red alert and acting command off. Hold everything else.
- **Owner:** Engineering on Codex builds it; Security reviews the shadow log.
- **Start with:** one night in shadow mode that logs what *would* have been approved and approves nothing.
- **Done when:** the Captain has reviewed the shadow log and said go. Only then does shadow mode switch off. 🛑 the Captain

### C3 · Pings
- **Goal:** held items reach the Captain the way the order says (ping critical now, batch hourly, or hold until back). Red alert always pings at once and pauses auto-approval.
- **Owner:** Engineering on Codex.
- **Done when:** each ping setting and a red alert have been tested, with the Telegram messages as proof.

### C4 · Expiry, Captain on the bridge, debrief
- **Goal:** when the order ends (expiry or "I have the conn"), auto-approval stops and Number One posts **"Captain on the bridge"**: return time, how the conn came back, items waiting, incidents, then the debrief (auto-approved, waiting, still undoable).
- **Owner:** Engineering on Codex builds it. Number One composes the post (own list: status reports read from the log).
- **Done when:** both endings have been tested and the debrief matches `handoff-log.csv`.

### D1 · Detect the fallback
- **Goal:** Ops probes Ollama every 5 minutes. On the Codex top model, set an `acting_command` flag, suspend any conn order and ping the Captain.
- **Owner:** Ops runs the probe; Engineering on Codex writes it.
- **Done when:** stopping Ollama in a test sets the flag, suspends the order and sends the ping.

### D2 · Seal local-only work
- **Goal:** while the flag is on, refuse reads of Hindsight, secrets, the captain's log and raw personal data; Viewscreen off; Quartermaster queues captures unread; new stacked jobs wait; running cloud jobs may finish.
- **Owner:** Engineering on Codex; Security runs the test.
- **Done when:** a test tries each sealed item while the flag is on, and each attempt is refused and logged.

### D3 · Relief
- **Goal:** when qwen answers, Number One posts **"Number One back on the bridge"** with the held count, confirming nothing was approved and memory stayed sealed. A suspended order resumes for its remaining time. If the Captain returns first, the Chief Engineer hands him the conn under "Captain on the bridge".
- **Owner:** Engineering on Codex.
- **Done when:** both return paths have been tested and logged.

### D4 · Drill with the Captain
- **Goal:** a planned drill with the Captain present: hand over the conn, stop Ollama, bring it back, take the conn back.
- **Owner:** Ops runs the drill; Number One chairs.
- **Done when:** the Captain signs off the drill. 🛑 the Captain
