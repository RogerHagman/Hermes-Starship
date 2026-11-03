# Manifest: what's in the kit, and what was left out

## Included

| Path | Source on the original ship | Treatment |
|---|---|---|
| `README.md`, `docs/01-architecture.md` | (new) | Written for this kit |
| `docs/02-three-rails.md` | brain roles, rebalance notes | Generalized |
| `docs/03-orders-and-cards.md` | order-flow review, rebalance notes, handover 1.1 | Generalized |
| `docs/04-speed-scale.md` | handover 1.2, speed-scale briefs | Generalized |
| `docs/05-brief-format.md` | four-question format, standard brief lines | Generalized |
| `docs/06-engineering-split.md` | split-review briefs and the A/B scorecard | Generalized |
| `docs/07-conn-handoff.md` | conn handoff draft | Copied, names and surfaces neutralized |
| `docs/08-memory-and-records.md` | Records Inspection, Ship's Muster, mental-model notes | Generalized, no memory contents |
| `docs/lessons-learned.md` | incident notes across all milestones | Rewritten without order numbers, card ids or personal items |
| `docs/roadmap.md` | project plan, handovers | Summarized |
| `crew/crew-manifest.md` | crew manifest v2, roster v2, rebalance notes | Merged and updated with the later hires |
| `crew/SOUL.template.md` | live SOUL rev-3 | Template with placeholders, updated for the Yeoman and the five-tool leash |
| `crew/routing-rules.md` | routing rules v2 plus every line added in patches V and Z | Reconstructed current version |
| `crew/handoff-contract.md` | hand-off contract v2 | Copied, quota lines updated, names neutralized |
| `crew/stations/yeoman.md`, `yeoman-templates/` | Yeoman spec and file templates | Copied with made-up examples; the CSVs are headers only |
| `patches/README.md`, `patches/catalogue.md` | about 60 patch briefs (A to AB) | Folded into nine capabilities with behaviour and tests |
| `setup/setup-guide.md` | crew-rollout handover, handover 1.1, plumbing handover | Rewritten as a build order with placeholders |
| `handovers/handover-2..5.md` | four-question drafts of handovers 2 to 5 | Copied, names neutralized |
| `holodeck/` | idea doc, interface README, stack briefing, design system, concept art, ship plan v4 sources, ultrawide ship plan | Copied (current versions only), sample data scrubbed, rebuilt from sources |

## Generalized everywhere

- The owner's name → "the Captain". Pronouns neutral.
- Specific model ids → tiers ("Codex top / mid / small", "Claude top / mid", "the local model"), with examples where helpful.
- Host names, LAN addresses, NAS make and host paths → placeholders (`<HOST_DATA_DIR>`, `<MODEL_HOST>`, `<LAN_IP>`).
- Time zone and language → `<TIMEZONE>`, "second language".
- Order numbers, card ids and dates of individual incidents → removed.
- Container paths under `/opt/data` are kept: they are Hermes's own data volume, not personal.

## Left out

| What | Why |
|---|---|
| Helm job-seeking plan, CV workspace and tools | Personal (career) |
| Yeoman lists (todos, reminders, waiting, done) | Personal |
| Food, weight and receipt data, meal examples | Personal (health, finance) |
| Uploaded screenshots | Contain chat history and personal context |
| Long-term memory (Hindsight) contents and the mental-model list | Personal; rule 0 |
| Handover 1.1 answer key and the N0 grading | The key is meant never to reach a Hermes; the method is in the setup guide |
| Raw patch briefs, review notes, rollout and memory logs, chat handovers | Full of order numbers, card ids, local paths and incident detail; their substance is in the catalogue and lessons learned |
| NAS / container recovery notes, RAM and portal specifics | Only relevant to the original hardware (the general warning is in `patches/README.md`) |
| Dashboard credential note, chat ids, sign-in details | Secrets or account-specific |
| Codex file-permission lock design | Parked; mentioned in the roadmap |
| `.bak` files, the older ship-plan v3 and v4 backups, the v1 ultrawide | Superseded |
| The live patch diffs | Not in the shared folder; they live on the original ship and are version-specific. The catalogue is the spec to rebuild them from |
