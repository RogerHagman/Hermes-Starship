# Patch catalogue

The original ship reached this behaviour through about 30 patch letters (A to AB), many of them reworks and per-surface follow-ups. This catalogue folds them into **nine capabilities**, each described as its final behaviour with the tests that prove it. Build them in this order. The original letters are listed only as a cross-reference; the story of what broke along the way is in [../docs/lessons-learned.md](../docs/lessons-learned.md).

Every capability must hold on **every surface** you use (Telegram, desktop app, web dashboard). On the original ship most follow-up patches came from fixing Telegram first and finding the desktop path different. Test all surfaces in the first round.

---

## 1 · The order spine

**Behaviour**
- An arrival hook mints the next ORD for every inbound Captain message on every surface, logs it with surface and chat/session to `orders.csv` and `live-ack.jsonl`, and shows "ORD-N received" where the surface allows it.
- The minted ORD is given to the model at the start of its turn on every surface ("Order for this turn: ORD-N").
- `kanban_create`, when the caller is the default profile, puts the ORD of the message that filed the card at the start of the title (replacing any ORD the model wrote; "ORD: none" if there is none), and drops skills, model, provider and priority.
- A card-close hook sets the order row's status and `closed_at`, and appends one rollout line (to the file the card names, else `ROLLOUT-orders.md`). It always closes the row first. A split job closes once, when its last card is done.
- A turn that files no card gets no ORD. The order logs hold no message text.
- Default-profile cards assigned to `default` are refused.

**Tests:** one message per surface mints one row each; a card with a wrong or missing ORD in the model's title gets the right one; a card keeps no skills; closing a card closes its row (done, blocked, failed), also when no rollout file is named; a split job's ORD closes once, after the review card; a status question logs no ORD; a fresh message never inherits a stale ORD.

*Original letters: A, F, G, H, J, parts of AA.*

## 2 · Number One on a leash

**Behaviour**
- A `router_readonly` toolset for the default profile on every surface: `clarify`, `kanban_create`, `kanban_list`, `kanban_show`, `kanban_comment`. No `delegate_task`, no `read_file`, no `search_files`, no terminal, no memory tools. (In v0.22 the toolset was defined in code, not config.)
- The routing rules file is injected into the default profile's system prompt next to SOUL, read fresh each session, under "## Routing rules". Worker profiles don't get it. If the file is missing, the turn runs and one warning is logged.
- SOUL and the routing rules contain no line that tells Number One to read a file.
- Turns that code has already routed (the Yeoman fast path, see 6) skip Number One's model turn.
- Plus any crash fixes the Kanban tools need in your version (the original needed one).

**Tests:** a default-profile prompt contains SOUL and the routing rules; a forge prompt doesn't; a missing rules file gives the old prompt plus a warning; the default profile's tool list is exactly the five tools on every surface; a "remind me" message runs no Number One model turn.

*Original letters: B, B2, C, E, U, V, part of AA.*

## 3 · The honesty label

**Behaviour:** when Number One answers the Captain without filing a card or looking anything up on the board, code appends "(from memory, unchecked)". Never on a turn that filed a card, never on a relayed worker result (unless Number One adds facts the result doesn't contain), never on a board-status answer. Identical on every surface, including streamed desktop replies.

**Tests:** "what weekday is 24/12?" answered directly ends with the label; a hand-off receipt doesn't; a relayed card result doesn't; the desktop shows the same as Telegram.

*Original letters: R, T, T2, W, part of AB.*

## 4 · Speed words and the Dilithium Burn

**Behaviour**
- The arrival hook reads a speed word at the very start of the Captain's typed text (colon or comma after it, case-insensitive, longest match first; attachment markers skipped) and stores the reasoning level with the ORD (`speed` column at the end of `orders.csv`). The message reaches Number One unchanged.
- `kanban_create` sets the card's reasoning from it, capped at the rail's maximum (Codex tops out at xhigh). No word means the profile's default.
- "Burn:" holds a Claude card on the board; it starts by itself at Maximum Warp in the last 24 hours before the rail's weekly reset.

**Tests:** "Warp 9: test" → xhigh, "warp: test" → high, "Maximum Warp, test" → max (xhigh on Codex), "Thrusters: test" → none; "the time warp again", "Warp test" and "Burn: test" store no speed; an old `orders.csv` without the column still reads and gets it added; a speed word typed with an attachment still counts; a Burn card waits, then starts inside the window; a card's `KANBAN_RUN` line shows the reasoning used.

*Original letters: K, L, M, Q, S.* Scale: [../docs/04-speed-scale.md](../docs/04-speed-scale.md).

## 5 · Engineering hires and the guard

**Behaviour**
- Two Codex profiles, `systems` (mid model) and `diagnostics` (small model), created as config by the Captain.
- `kanban_create` refuses cards for `systems` and `diagnostics` unless the caller profile is `forge` (later: whoever the duty roster names as acting head).
- Every worker run prints one `KANBAN_RUN` line after setup: profile, model, reasoning. (Don't resolve the route in the dispatcher: an import there pulled in a 35-second bootstrap.)
- The `split-then-review` skill for forge and `verify.sh`, as in [../docs/06-engineering-split.md](../docs/06-engineering-split.md).

**Tests:** Number One filing for `diagnostics` (name the profile, not the job, or the router sends it to Ops) is refused with a clear message; a forge child card for `diagnostics` runs; `KANBAN_RUN` lines show the expected model; `verify.sh` exits 0 on a good patch and non-zero at the right step on a broken copy; a dry run shows tests written from plan.md alone catching a planted bug.

*Original letters: I, plus the E2, E4 and split-v2 cards.*

## 6 · The Captain's Yeoman

**Behaviour:** the station in [../crew/stations/yeoman.md](../crew/stations/yeoman.md), built as a plugin plus a staged profile:
- Fixed commands only (add, list, tick, cancel, snooze) on five CSVs under `/opt/data/yeoman/`. Its tools must load inside a Kanban worker, and the store must be owned by the container's runtime user, so both the worker and the timer can write it after a rebuild.
- A code time parser turns "at 16:00", "tomorrow morning", "in 3 hours" into UTC in the Captain's time zone, and asks one question if it can't. A bare number is never a clock time.
- A code timer inside the container checks reminders and recurring items every minute, sends due ones to the surface the order came from through the gateway's own send path, writes `fired` to `done.csv`, and re-arms recurring items. A failed or crashing send can never cause a double or endless send.
- Fast path: a message starting with "remind", "todo" or "yeoman" is filed to the yeoman profile by code with the Captain's words unchanged; Number One only sends the receipt.
- "What's on my list?" answers in four Eisenhower boxes (urgent computed by code, important only from the Captain's "!").

**Tests:** fake clock and empty files; "remind me in 2 minutes to test" fires within a minute and writes the `fired` row; "todo buy 2 lamps" doesn't become 02:00; a monthly item fires and re-arms; a send that throws is not retried forever; the list answers in under 10 seconds; no real message is sent during tests.

*Original letters: N, O, P, plus five rework cards.*

## 7 · Dates and words from code

**Behaviour**
- Every date in an order note, a meal row and a weight row comes from the system clock in the Captain's time zone, never from a model.
- The card Number One files carries the Captain's words unchanged (no added dates, weekdays or answers).
- Number One names the crew correctly (the routing rules and SOUL list the hires).

**Tests:** a card body for "what's on 24/12?" contains the Captain's text and no computed weekday; a meal logged near midnight gets the clock's date; Number One only cites ORDs that exist.

*Original letters: AB.*

## 8 · Local model budget and the meal path

**Behaviour**
- Local-model profiles get an explicit output budget (for example `model.max_tokens: 4096`), forwarded to their agents, so a thinking model can't spend its whole output on thinking and crash with "response still truncated".
- Station thinking defaults are set per profile (Number One, Yeoman and Quartermaster: thinking off).
- The Quartermaster logs meals through one script that sends only the meal words or the stripped photo to Codex for macros, falls back to local with the reason logged, keeps its correction path, and writes the row locally.
- A rail preflight script probes Codex with the same pinned environment (`HOME`, `CODEX_HOME`, `PATH`) the real calls use, and reports the real error instead of "quota exhausted".

**Tests:** a long local answer completes; a meal gets Codex macros, and with Codex unreachable falls back with a logged reason; the probe reports a sign-in error as a sign-in error.

*Original letters: X, X2, Y, part of AA.*

## 9 · Patch tooling

**Behaviour:** `apply.sh` is idempotent on a fully patched live tree; `check.sh` prints one OK / MISSING / DRIFTED line per bundle and tells overlap from drift; both skip `/opt/data/*`. See [README.md](README.md).

**Tests:** on a scratch copy of the live tree, a re-run prints everything already applied with checksums unchanged; a deliberately edited file shows DRIFTED; a missing patch shows MISSING.

*Original letters: the S3c and Z cards, the E4 job, and fixes folded into most letters.*

---

## Config, not patches

These are settings the Captain changes, with a backup of `config.yaml` first:
- `display.busy_input_mode: queue` (messages that arrive during a turn are queued, not dropped).
- `kanban.auto_decompose: false`.
- Forge on the Codex provider, top model, reasoning medium. Studio on Claude top model with the largest context the plan allows; Scout on Claude mid model; both with memory off.
- New profiles (`systems`, `diagnostics`, `yeoman`) and per-station default speeds.
- A cap on parallel Kanban workers when memory is tight.

## Planned, not built

- **Fuel gauge per rail:** a local script writes `/opt/data/handoff/rails/<rail>-usage.json` (5-hour and weekly used %, reset times) from local usage data, no model call. Feeds the Main Engineering gauge, sets the Burn window, and lets Number One answer "how much Codex is left?". A small-model job.
- **Four-question brief skill** shared by Number One and forge.
- **Read-only GitHub connector** for the Away Team and forge, scoped to one repo.
- **Board-keeping:** fixed commands for retitle and comment; the Ship's Computer archives at the weekly reset only cards whose ORD is closed with a rollout line; failed or blocked cards go to the Captain.
- **Phrase bank** for instant acks, and a picker.
- **Resume after a quota wall** instead of restarting a card from scratch.
- **Status replies name who acted** only from the board event's actor field.
