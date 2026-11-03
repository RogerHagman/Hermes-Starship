# Brief format: the four questions

Every brief to Hermes and every card on the ship uses the same headings:

```
GOAL         What should be true when this is done, in one or two sentences.
CONTEXT      What the worker needs to know: current state, known paths, why.
START WITH   (optional) The first move, when it matters: the right file, a read-only question.
CONSTRAINTS  The musts and nevers. Not background.
DONE WHEN    Checkable results. If you can't check it, it's a wish.
```

## Rules of thumb

- **DONE WHEN is the most important section.** "Clean code" fails; "all tests pass and no function over 40 lines" works.
- **Constraints are nevers and musts, not context.** Keep them apart, or the model treats a rule like background.
- **START WITH stops hunting.** Point the model at the right file, or ask it a read-only question first ("answer these three in the report before changing code").
- **Keep it short.** A brief longer than the expected answer is usually hiding a second task. Split it.
- **Out of scope** goes under CONSTRAINTS in a short brief.

## Standard lines for Engineering cards

These lines ended whole classes of failure on the original ship. Put the ones that apply into every patch brief:

- "Write the patch as `/opt/data/patches/patch_<L>.diff` and add it to `apply.sh` and `check.sh` after <previous>. Do NOT apply it to the live code."
- "Never edit live files: `/opt/hermes`, `/opt/data/config.yaml`, SOUL, the routing rules and the live profiles stay untouched."
- "Known paths: … Use these; no disk-wide find or rglob."
- "Tests use made-up messages and fresh, empty copies of the logs. Don't read or copy live logs or the Captain's data."
- "Work in a scratch directory outside the card workspaces. Never create a package with a Hermes module name in a workspace. Delete it when done; if a delete is blocked, list the leftovers in the report."
- "Mark this card done when finished. Do not request a review. Don't close or edit any other card."
- "Reply with one line: ORD, station, card ID, done or not done."
- "Config changes are written up as lines for the Captain, never applied."
- For the split: "Plan and investigate yourself. File one child card to systems for the build and one to diagnostics for the tests. Review their result before marking this card done."

## How a brief reaches the ship

The Captain pastes it to Number One on any surface, starting with:

> File one Kanban card for <station> (<profile>). Copy everything below into the card body, word for word. Do not edit any file yourself.

Code adds the ORD. The station replies with one line. A reviewer reads any patch before the Captain applies it.

## A skill for it

A shared `four-question-brief` skill (planned) makes every card written on the ship follow the format: Number One loads it, and so does the Chief Engineer when it files child cards.

## For designers

The same skeleton in design language: GOAL = what the user should feel or be able to do; CONTEXT = audience, brand, design system, research; CONSTRAINTS = tokens, grid, accessibility (for example WCAG AA), breakpoints, tone; DONE WHEN = number of directions, states covered, checks passed, export format. Useful extras: Fidelity, Directions ("three distinct directions, not variations"), References and anti-references, States (empty, loading, error, long content), and Critique mode.
