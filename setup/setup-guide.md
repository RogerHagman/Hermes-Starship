# Setup guide: from a stock Hermes to a working crew

The order the original ship was built in, cleaned of its mistakes. Each phase ends with something you can test. Fill in the placeholders for your own setup:

| Placeholder | Meaning |
|---|---|
| `<HOST_DATA_DIR>` | Where your host keeps the Hermes data volume (mounted as `/opt/data` in the container) |
| `<MODEL_HOST>` | Address of your local model server (for example `http://<LAN_IP>:11434` for Ollama). Use the real address: `127.0.0.1` inside the container is the container itself |
| `<LOCAL_MODEL>` | Your local model tag (the original used a 27B Qwen) |
| `<CODEX_TOP>` / `<CODEX_MID>` / `<CODEX_SMALL>` | Codex models for the Chief Engineer / Systems Engineer / Diagnostics Technician |
| `<CLAUDE_TOP>` / `<CLAUDE_MID>` | Claude models for Cartography / Sensors |
| `<TIMEZONE>` | The Captain's time zone, for parsing and display (store UTC) |
| `<CAPTAIN_NAME>`, `<SURFACES>` | Used in SOUL |

## Ground rules before you start

- **Shell commands one at a time**, as root in the container (`docker exec -u root hermes …`), with `sudo` on the host where needed.
- **Back up `config.yaml` before every config change** (`config.yaml.bak-<what>`), and diff afterwards.
- **Say no to model or setting changes that Hermes offers itself.** One such offer rewrote the main config back to a template.
- **Watch memory.** Every running card is its own Hermes process. On an 8 GB host, keep other heavy containers capped and don't run parallel builds.
- **Never put credentials in text meant for Hermes.** The cloud rails use subscription sign-ins (`codex login` with a ChatGPT account, Claude Code sign-in), done by the Captain in the container.

## Phase 0 · Ground truth

1. Run Hermes Agent in Docker with `/opt/data` on a persistent volume. Note the image version; the patches depend on it.
2. Connect the local model through a custom provider pointing at `<MODEL_HOST>`. Default profile = Number One on `<LOCAL_MODEL>`, **thinking off**, with an explicit output budget (`model.max_tokens`, for example 4096).
3. Set `display.busy_input_mode: queue` so messages that arrive mid-turn are queued.
4. Set `kanban.auto_decompose: false`.
5. Put the canon in place: `/opt/data/SOUL.md` from [../crew/SOUL.template.md](../crew/SOUL.template.md) and `/opt/data/attachments/routing-rules.md` from [../crew/routing-rules.md](../crew/routing-rules.md). Keep both short.

**Test:** Number One answers on each surface you use.

## Phase 1 · Safety layer (do this before anything personal crosses a rail)

1. Create the hand-off working area `/opt/data/handoff/` (`orders.csv`, `logs/`, `engineering/`, `ROLLOUT-*.md`).
2. Build the shared **pre-send scan** (Security Chief): credential patterns, `.env` / key filenames, raw ledger rows, memory content, PII (ID number formats, phone, email, IBAN, card numbers, street address). A match blocks the send.
3. Wire it into every cloud send, plus an auth and quota preflight per rail.
4. If you log food: one script strips EXIF and sends only the photo (or the typed meal words) for macros; the row stays local.

**Test:** a planted credential pattern in a hand-off is blocked and reported. See [../crew/handoff-contract.md](../crew/handoff-contract.md).

## Phase 2 · Crew profiles

1. Create one profile per station (`/opt/data/profiles/<id>/config.yaml`) from [../crew/crew-manifest.md](../crew/crew-manifest.md): model, provider, thinking default, toolsets.
2. Cloud stations: forge on Codex `<CODEX_TOP>` (launch flag `--sandbox danger-full-access` inside Docker); scout on `<CLAUDE_MID>`, studio on `<CLAUDE_TOP>` with the largest context the plan allows. Memory **off** on every cloud station.
3. Build an alias registry and a duty map: each station gets an `owns` list of at least five topics and example phrasings. Reserved stations are listed but marked unhired.
4. Build stations in this order: Security's scan → the stations you need most → Cartography (after a short design probe) → the rest.

**Test:** "sensors, …" reaches scout; "sensors, read my receipts" is refused under rule 0.

## Phase 3 · Number One delegates first

The most important behaviour change. A local model on the local rail reads "local by default" as "I do it". Fix it with words first, then with code.

1. SOUL carries the decision procedure, the own list and the self-work budget (one tool call, no file writes, short answer).
2. **Grade a plan before trusting it.** Give Number One a handover and ask only for a delegation plan: for each task, which station, which rail, what it keeps. Grade it against an answer key you keep off the ship (Number One never sees it). Write the mismatches back as lessons. Repeat on the next handover, without the key, to see whether the lessons carried over.
3. Apply capabilities 1 and 2 of [../patches/catalogue.md](../patches/catalogue.md): the order spine and the leash (five-tool `router_readonly`, rules injected into the prompt).

**Test:** three messages ten seconds apart each get an ORD within five seconds while the first is still running; every ask lands on a card titled with its ORD; status questions file nothing.

**Measure for two weeks:** Ops reports the share of requests Number One dispatched rather than did (target 90 %+), its busy time, the median time to dispatch (target under 10 s) and the missing-owner notes. Then have the Ship's Computer replay two weeks of orders against the duty map, locally, and review the mismatches.

## Phase 4 · Cheaper engineering and speed words

1. Profiles `systems` (`<CODEX_MID>`) and `diagnostics` (`<CODEX_SMALL>`); first check which model ids your Codex sign-in actually lists, and whether a card can carry parents and its own reasoning.
2. Capability 5 (guard, `KANBAN_RUN`, split skill, `verify.sh`).
3. Capability 4 (speed words, Burn hold). Add the speed table to the routing rules in the same step.

## Phase 5 · The Captain's Yeoman

Capability 6, from [../crew/stations/yeoman.md](../crew/stations/yeoman.md). Set Telegram's home channel (or your surface's equivalent) so code can send. Until it is live, don't trust any "reminder delivered" from Hermes: keep a backup reminder elsewhere.

## Phase 6 · Clean-ups

Capabilities 3, 7 and 8: the honesty label, dates and words from code, local output budgets and the meal path. Then per-station default speeds.

## After every rebuild or update

Re-apply the patches (`apply.sh`, `check.sh`, restart; see [../patches/README.md](../patches/README.md)). Changing an app's settings in some NAS portals recreates the container and wipes patches from `/opt/hermes`. First start after a rebuild can be slow (ownership walk over profiles, state-DB integrity check after an unclean stop); don't restart during it.

## Ongoing rituals

- **Weekly reset** (Number One): open orders, rollout gaps, Ops' rail usage share, missing-owner notes.
- **Records Inspection** (Ship's Computer): memory against canon, the Captain approves each fix.
- **Dilithium Burn**: in the last day before a rail's weekly reset, held jobs run at Maximum Warp.
