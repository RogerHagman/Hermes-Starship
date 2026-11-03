# Memory and records

Hermes has long-term memory (Hindsight in the original build). On the ship, memory is a station's job, not everyone's.

## Who touches memory

- **The Ship's Computer (keeper) is the sole reader and writer**, on the local rail. Number One has no memory tools; fact questions are cards for the Computer.
- **Cloud-rail stations have memory switched off** and never get memory content in a card. When the Captain wants something from memory in a cloud job, the Captain asks the Computer, reads the answer and puts what is needed into that order.
- **Never mention credentials in anything meant for Hermes**, not even as a "never". Memory digests store whatever they read, and a "never use X" line plants X. Phrase rules positively ("Codex signs in with the Captain's ChatGPT account").

## Canon beats memory

The ground truth is a small set of files: SOUL, the routing rules, and decisions in the rollout logs that quote the Captain verbatim. Memory is checked against them, never the other way round.

## Records Inspection (memory audit)

Big jobs leave logs full of claims that were later corrected (a rail "down" that wasn't, a wrong launch flag, a reused ID). A digest can store them as facts.

- **Owner:** the Ship's Computer, locally.
- **When:** at the weekly reset and on demand. Add "after a digest catch-up" once reports prove short and useful.
- **Method:** for each canon topic, ask memory what it knows and compare. One line per mismatch: what memory says, what canon says, where canon lives.
- **Two keys:** cloud rails write an intent note (decided / changed / rejected) when their card closes. The rail never sees memory; the Computer compares locally.
- **Never auto-corrects.** Memory writes wait for the Captain's OK, item by item, which is the guard against memory poisoning.
- **Done when:** zero mismatches, or every mismatch has the Captain's call.

## Ship's Muster (file roll call)

Records Inspection checks what the ship *remembers*; the Muster checks what the ship *has*. Every important file has one owner station that knows it exists, where it lives and what it is for. The result is the ship's own `INDEX.md` on the box, which becomes canon. (Designed, not yet run.)

## Mental models

If your memory layer supports cached summaries injected on every recall, keep them few and narrow, on manual refresh:
- at most one ship model, "Ship operations": how work moves (routing, ORDs, cards, rails, surfaces, rule 0) and where the records are, built from the routing rules and INDEX.md;
- refreshed by hand only after a Muster or a Captain-approved Records Inspection;
- no rollout-status model: the rollout files already do that job.

Auto-refresh was unreliable in the original build.

## Chat rules don't last

Rules given only in chat are lost when a conversation is compacted. Anything lasting goes into SOUL or the routing rules, as a diff the Captain approves.
