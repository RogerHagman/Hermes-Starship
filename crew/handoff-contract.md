# Hermes handoff contract (step 3, v2)

One envelope for both cloud rails, so Hermes builds, checks and logs every offload the same way.
The routing rules this contract cites are in **Appendix A**, so this file stands on its own on the Hermes host.

## 0 · Shared terms
- **Rail:** `local` (qwen), `codex` (the Codex top model), `claude` (Claude Code). Both cloud rails run as CLIs **on the Hermes host**; "cloud" means the model, not the file transfer.
- **kind** is rail-independent: `deliverable | research | code | review`. Routing (Appendix A) picks the rail.
- **Cross-rail review:** a `review` task normally goes to a **different rail than the producer**. No agent verifies its own work.
- **Working dir:** `/opt/data/handoff/<task_id>/`. After a task closes, it is archived to bulk storage, which is never the working dir.

## 1 · Outbound task (Hermes → rail)

```yaml
task_id: 2026-10-11-ledger-digest-01   # date-slug-seq, also the log key
rail: claude                            # codex | claude
kind: deliverable                       # deliverable | research | code | review
reviews: null                           # for kind=review: task_id of the work being reviewed
goal: "Monthly finance digest for Sep 2026, one styled PDF page"
inputs:                                 # read-only, chosen on purpose (A.1, A.5)
  - path: /opt/data/handoff/2026-10-11-ledger-digest-01/in/ledger-2026-09-aggregate.json
  - path: /opt/data/brand/hermes-style.md
needs_network: false                    # true for research; drives precheck and quota
constraints:
  format: pdf                           # pdf | pptx | xlsx | svg | html | diff | script | md
  max_pages: 2
done_when:
  - "Budget vs actual per category, with over-budget rows highlighted"
  - "Renders cleanly at A4"
required_strings: ["Groceries", "Budget", "September 2026"]   # used by mechanical QA
return_to: /opt/data/handoff/2026-10-11-ledger-digest-01/out/
```

### Required local prep
- **Personal data → aggregate first.** When a task touches personal data (ledger, nutrition, receipts, reading habits), Hermes must build a sanitised aggregate locally and send only that (A.5). Raw rows never go into `inputs`.

### Pre-send checks (Hermes, local)
1. **Shared pre-send scan (both rails).** This is built once, since nothing exists to port yet. It reuses the static grep patterns from `requesting-code-review`, and blocks the send on any of these:
   - credential patterns (tokens, private key blocks, sign-in secrets)
   - `.env`, `credentials*`, `*.pem`, `id_*`, keyring-class filenames
   - raw ledger rows (merchant + amount + date per line), raw receipt OCR
   - Hindsight / memory content (by path and by marker)
   - PII patterns (national ID number, phone, email, street address)
2. **Scope check.** Every input file is listed explicitly. No home dir or repo root unless `kind: code` needs a repo read, in which case a scratch copy is used.
3. **Size check.** Inputs fit the rail's context; otherwise trim or summarise locally.
4. **Auth preflight (both rails).** The CLI is logged in and the token is valid.
5. **Quota check (both rails).** Codex: the 5-hour window (shared with Codex use in ChatGPT). Claude: the plan's 5-hour and weekly allowance. If the rail is short on quota, the task waits; it does not reroute.

## 2 · Return (rail → Hermes)

```yaml
task_id: 2026-10-11-ledger-digest-01
status: done                            # done | partial | blocked | failed
failure_class: null                     # rail_error | input_error | ambiguity (when not done)
outputs:
  - path: out/digest.pdf
  - path: out/preview-p1.png            # rail's own render: input to QA, not the QA
summary: "One-page digest, 3 categories over budget, highlighted in amber."
sources: []                             # research: URLs used
assumptions:
  - "Treated 'Övrigt' as uncategorised"
blocked_on: null
usage:
  tokens: 48200                         # codex: total_token_usage from rollout JSONL; claude: stream report
  wall_time_s: 212
```

## 3 · Acceptance checks (Hermes, local)

| Check | Applies to |
|---|---|
| Output exists and matches the requested format | all |
| Every `done_when` item is met | all |
| Nothing written outside `return_to` | all |
| Code: diff applies, baseline tests pass, `requesting-code-review` gate passes (secrets, `os.system`, `eval`, `pickle.loads`, SQL injection) | code |
| Code: no new network calls, credentials or hard-coded paths in the produced code | code |
| **Mechanical visual QA** (pymupdf or similar): page count within limit, every `required_strings` entry present, no text clipped at page edges, no overlapping text boxes | deliverable |
| Numbers in the deliverable match the aggregate that was sent | deliverable |
| Every factual claim has a source | research |
| Independent review by a different rail, for risky code or important deliverables | code, deliverable (optional) |

The rail's own renders are **input** to the visual QA, not the QA itself.

### Failure handling
| failure_class | What happens |
|---|---|
| `rail_error` (bad output, crash, missed a `done_when`) | Back to the same rail **once** with the failure attached, then to the Captain |
| `input_error` (wrong or stale aggregate, missing file) | Fixed locally and resubmitted. No retry to the rail |
| `ambiguity` (unclear goal, conflicting requirements) | Straight to the Captain |

## 4 · Applying results
- Each task's `return_to` dir is the rail's **only writable space**. For codex this is a scratch git repo. Everything else is read-only input.
- Hermes applies accepted diffs and scripts. Cron installs, pushes, and any write to services or storage are local actions.
- Accepted deliverables are delivered by Hermes (chat surface, dashboard, storage).

## 5 · Log
Each handoff appends one line to `/opt/data/handoff/handoff-log.csv`:
`task_id, rail, kind, sent_at, returned_at, status, failure_class, checks_passed, retries, usage_tokens, usage_cost, wall_time_s, notes`

## 6 · Pings to the Captain
- **Ping:** when a deliverable is returned and accepted (with the file attached).
- **Ping:** on any failure past the one retry, and on any `ambiguity`.
- **Silent:** pure plumbing and log-only updates.

---

## Appendix A · Routing rules (canonical copy: routing-rules.md)
- **A.0 Standing rule.** Design and research that ends in a styled deliverable → claude. Code and big-context analysis → codex. Internal, cheap, private or secret → local. Hermes orchestrates and can stack rails.
- **A.1 Hard stays-local.** Memory/Hindsight, secrets, keys, OAuth flows, raw personal data, and writes to the Captain's systems never leave the local rail. *Exceptions:* a food photo (EXIF stripped, photo only) or a typed meal description (meal words only) may go to codex for macro estimation.
- **A.2 Codex** gets code tasks and inputs too big for local context.
- **A.3 Claude** gets styled deliverables and research that ends in one.
- **A.4 Stacking.** codex writes the logic → local runs it and aggregates → claude designs from the aggregate → local schedules and delivers. Cloud rails never call each other.
- **A.5 Personal data.** Only locally built aggregates cross to a cloud rail.
- **A.6 Long batches** run locally. Codex fixes the code when they break.
- **A.7 Quota.** Both rails are metered. Recurring jobs are listed with rail and cadence; no fixed cap. A short rail waits; it does not reroute.
- **A.8 Visual QA.** Every deliverable passes the mechanical visual QA in §3.
- **Fallback (unchanged):** qwen → the Codex top model. Claude is not in the chain.
