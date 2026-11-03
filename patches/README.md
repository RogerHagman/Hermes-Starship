# How core changes are shipped

Anything that changes Hermes's own code (`/opt/hermes` in the container) ships as a patch. Nothing else is allowed to touch it.

## The loop

1. **Brief.** The Captain sends a four-question brief to Number One, which files one card for the Chief Engineer ([../docs/05-brief-format.md](../docs/05-brief-format.md)).
2. **Build on a scratch copy.** The Chief Engineer (or the split, [../docs/06-engineering-split.md](../docs/06-engineering-split.md)) writes `/opt/data/patches/patch_<L>.diff`, adds it to `apply.sh` and `check.sh`, and proves it on a scratch copy of the live patched tree. It never edits live files.
3. **Report.** `/opt/data/handoff/engineering/<item>-report.md`: changed files, test output, `KANBAN_RUN` lines, the new `check.sh` output, manual backup / apply / rollback commands, and leftover scratch paths.
4. **Review** outside the board by a stronger reviewer (the original used Claude in a separate chat). GO or a rework brief.
5. **Apply.** The Captain applies as root in the container, restarts, and runs a live test from a real surface.

## apply.sh and check.sh

- `apply.sh` applies every patch in order (A, B, … AB) and must be **idempotent**: re-run on a live tree that already has everything, it prints each patch as already applied and changes nothing (checksums identical before and after).
- `check.sh` is read-only and prints one line per patch bundle: `OK`, `MISSING` or `DRIFTED`. Later patches overlay earlier ones, so it has to tell overlap from real drift.
- Both skip `/opt/data/*`, so they still work after the container is rebuilt.
- Fallback when `apply.sh` breaks: apply each diff by hand from `/` with `git apply --unsafe-paths -p1 --exclude="opt/data/*"`, in order.

**After any container rebuild or Hermes update** (one command at a time, as root):

```sh
docker exec -u root hermes sh /opt/data/patches/apply.sh
docker exec -u root hermes sh /opt/data/patches/check.sh
docker restart hermes
```

Warning: on some NAS app portals, changing an app setting (for example a memory cap) deletes and recreates the container. The data volume survives; the patches inside `/opt/hermes` do not. Re-apply before using the ship.

## Version drift

The original patches were written against Hermes Agent v0.22.x. Hook names, file paths (`agent/system_prompt.py`, `toolsets.py`, the Kanban tools, the desktop session code) and behaviour will differ in your version. Treat each entry in [catalogue.md](catalogue.md) as a spec: give your Chief Engineer the behaviour and the tests, and let it find where your version needs the change. Start each brief with a read-only START WITH that maps the spec onto your code.
