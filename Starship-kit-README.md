# Hermes Starship kit

Everything you need to turn a self-hosted **Hermes Agent** (Nous Research) into a starship run by an agent crew: one orchestrator that only routes, a dozen stations that each own one kind of work, three model "rails" chosen per job, and code (not the model) doing every bookkeeping step that a model tends to get wrong.

This kit is a cleaned copy of a working build. Personal data and everything specific to the original owner's machines has been taken out or replaced with placeholders (see [MANIFEST.md](MANIFEST.md)).

## The idea in one paragraph

You are the **Captain**. **Number One** (Hermes's default profile, on a local model) is the only agent you talk to. It never does the work itself: it files a Kanban card for the right **station** (a Hermes profile with its own model, tools and duty) and answers in seconds with an order number. Stations run on one of three rails: **local** (private, cheap, a model on your own GPU), **Codex** (code and big context) or **Claude** (research, writing and design). A local rule set, **rule 0**, keeps memory, secrets and raw personal data from ever leaving the ship. Everything a small local model fumbles (minting order IDs, stamping cards, reading speed words, parsing times, firing reminders, labelling guesses) is moved into small, reviewed **patches** to Hermes's own code.

## Reading order

| # | File | What you get |
|---|---|---|
| 1 | [docs/01-architecture.md](docs/01-architecture.md) | The whole ship on one page: rails, stations, order flow, patches |
| 2 | [crew/crew-manifest.md](crew/crew-manifest.md) | Every station: alias, profile, rail, duty, rank, department |
| 3 | [crew/SOUL.template.md](crew/SOUL.template.md) | Number One's system prompt, ready to fill in |
| 4 | [crew/routing-rules.md](crew/routing-rules.md) | The rules injected into Number One's prompt |
| 5 | [docs/02-three-rails.md](docs/02-three-rails.md) | What each rail owns, and the stacking pattern |
| 6 | [docs/03-orders-and-cards.md](docs/03-orders-and-cards.md) | ORD numbers, cards, close hook, rollout log, missions and campaigns |
| 7 | [crew/handoff-contract.md](crew/handoff-contract.md) | The envelope for every cloud hand-off, with pre-send checks |
| 8 | [docs/05-brief-format.md](docs/05-brief-format.md) | How every brief and card is written (GOAL / CONTEXT / CONSTRAINTS / DONE WHEN) |
| 9 | [patches/README.md](patches/README.md) and [patches/catalogue.md](patches/catalogue.md) | How core changes are shipped, and the full patch list A to AB with tests |
| 10 | [setup/setup-guide.md](setup/setup-guide.md) | The build order, from a stock Hermes to a working crew |
| 11 | [docs/lessons-learned.md](docs/lessons-learned.md) | What went wrong, and the rule or patch that fixed it |
| 12 | [docs/roadmap.md](docs/roadmap.md) | Milestones done, in flight and parked |

Then, as needed: [docs/04-speed-scale.md](docs/04-speed-scale.md) (speed words and the Dilithium Burn), [docs/06-engineering-split.md](docs/06-engineering-split.md) (plan, build, verify with cheaper models), [docs/07-conn-handoff.md](docs/07-conn-handoff.md) (auto-approval while you're away), [docs/08-memory-and-records.md](docs/08-memory-and-records.md), [crew/stations/yeoman.md](crew/stations/yeoman.md), the future handovers in [handovers/](handovers/) and the interface work in [holodeck/](holodeck/).

## What you need

- A host that can run Docker (the original ran on an 8 GB NAS; 16 GB or more is more comfortable, since every running card is its own Hermes process).
- The Hermes Agent container image (the original used `nousresearch/hermes-agent` v0.22.x).
- A local model served by Ollama or similar on a GPU machine (the original used a 27B Qwen model on a 24 GB card).
- Optional cloud rails: the Codex CLI signed in with a ChatGPT plan, and Claude Code signed in with a Claude plan. Both rails run on subscription sign-ins.
- A chat surface for the Captain: Telegram, the Hermes desktop app and/or the Hermes web dashboard.

## What this kit is not

- **Not the patch code.** The patches were written against one Hermes version and live on the original ship. This kit carries their specifications and acceptance tests ([patches/catalogue.md](patches/catalogue.md)), which is what you hand your own Chief Engineer to rebuild them against your Hermes version.
- **Not a finished product.** It is a working design that grew one fix at a time. The roadmap says what is live, what is in flight and what is only an idea.

## Words used throughout

| Word | Meaning |
|---|---|
| Captain | You, the human. The only one who approves, applies patches or changes models |
| Number One | Hermes's default profile. Routes, tracks and reports; never does station work |
| Station | A Hermes profile with one duty (for example the Chief Engineer = profile `forge`) |
| Rail | Where a model runs: `local`, `codex` or `claude` |
| ORD | An order number (ORD-1001 and up), minted by code when a message arrives |
| Card | A Hermes Kanban task. Every order becomes one or more cards |
| Rule 0 | Memory, secrets, raw personal data and writes to your systems stay on the local rail |
| Patch | A reviewed diff to Hermes's own code, kept in `/opt/data/patches/` and applied by the Captain |
| Speed word | "Warp 9:" and friends at the start of a message; code turns it into a reasoning level |
