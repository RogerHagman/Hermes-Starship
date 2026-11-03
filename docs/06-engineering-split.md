# Engineering split: plan, build, verify

Every Codex card used to run on the Chief Engineer's top model, even mechanical work. Two cheaper hires take the parts that need less judgement.

| Role | Profile | Model tier | Does |
|---|---|---|---|
| Chief Engineer | forge | top | Investigates, writes the plan, reviews once at the end. All Hermes-core patches stay with it |
| Systems Engineer | systems | mid (≈ half the cost) | Builds exactly what the plan says, uninterrupted |
| Diagnostics Technician | diagnostics | small (≈ a fifth) | Writes tests from the plan without seeing the code; runs `verify.sh`; writes a short diagnosis on failure |

**Guard (patch I):** only the Chief Engineer can file cards for `systems` and `diagnostics`. Number One's attempts are refused in code. Every worker run prints one `KANBAN_RUN` line showing the profile, model and reasoning it actually used.

## Version 2 of the flow

1. The Chief Engineer writes `/opt/data/handoff/engineering/plans/<ORD>-plan.md` (outside any card workspace, so it outlives the planning card): the exact files and functions, what changes in each, what must not change, and the test cases that prove it.
2. It files four cards and marks its own planning card done, without waiting:
   - **build** (systems): "Build exactly what plan.md says" plus the path. No parents.
   - **tests** (diagnostics): turn the plan's test cases into pytest files, blind to the code. No parents, so it runs beside the build.
   - **verify** (diagnostics): parents = build + tests. Runs `verify.sh` with those tests; on failure writes which step, which test, the first error and the likely cause.
   - **review** (forge): parent = verify. Reads plan.md, the diff and the verify output only. Marks done or files one fix card.
3. If the builder finds the plan can't work, it stops and says why in its report rather than redesigning.
4. **BIG** plans name one or two checkpoints: the build is split into one card per stage, each followed by a short checkpoint card that reads only that stage's diff. **CRITICAL** (Captain only) means review at every stage, and the Chief Engineer may build a stage itself.

## verify.sh

Given a patch file: make a scratch copy of the live patched files, apply the patch, run `check.sh`, re-run `apply.sh` to prove nothing changes, and run the named pytest files in a test venv under the diagnostics profile's cache (pytest and any test deps installed there, never into `/opt/hermes`). One summary line per step, non-zero exit on any failure, never writes outside its scratch folder.

## What was learned

- In one A/B on a small fix, the Chief Engineer alone was faster and used fewer tokens than the first version of the split. The split lost on input re-reads: thin child cards made the builder re-read everything, the planner stayed open while waiting, and the tester had no pytest. The comparison was confounded (the split ran second in the same quota window), so the split stayed the default and the flow was redesigned as above.
- Log cached input tokens separately in every scorecard: in Codex usage data, input tokens include cached ones, and most of them were cached.
- A fair re-test runs a medium-sized task, each arm in a fresh 5-hour window at the same speed word, with three arms: Chief Engineer alone; the v2 split; and chain of command (the Systems Engineer acting as chief, which needs the guard to follow the duty roster).
- Good recurring jobs for the small model: log parsing for scorecards, leftovers lists, report tables, rollout checks, `KANBAN_RUN` audits.
