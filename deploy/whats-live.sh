#!/bin/sh
# What's live: one read-only check, run on the NAS host, that says for each open item whether it
# is live yet (patches AG/AH/AI, the apply.sh W_b fix, the core terminal update, the Science lab
# meters and speed trial, fast paths from a file, the ship probe).
#
#   sudo sh /DATA/AppData/hermes-starship/deploy/whats-live.sh
#
# It changes nothing. It runs check.sh in Hermes (read-only by design), reads a few files in
# Hermes and in the Starship folder, asks Docker which containers run, and lets
# deploy/whats_live.py judge. Exit code 0 when everything is live, 1 when something is not.
#
# Settings (only if this NAS differs): HERMES_CONTAINER (hermes), STARSHIP_DIR (this checkout),
# DOCKER (docker), PYTHON_IMAGE (python:3.12-alpine, used only when the host has no python3).
set -u

HERE=$(cd "$(dirname "$0")" && pwd)
STARSHIP_DIR=${STARSHIP_DIR:-$(dirname "$HERE")}
HERMES=${HERMES_CONTAINER:-hermes}
DOCKER=${DOCKER:-docker}
PYTHON_IMAGE=${PYTHON_IMAGE:-python:3.12-alpine}

FACTS=$(mktemp -d "${TMPDIR:-/tmp}/whats-live.XXXXXX") || { echo "whats-live: no temp folder" >&2; exit 2; }
trap 'rm -rf "$FACTS"' EXIT INT TERM
mkdir -p "$FACTS/live"

date -u +%s > "$FACTS/now"

# Which containers run.
for name in "$HERMES" hermes-starship hermes-starship-ship hermes-starship-meters; do
  state=$($DOCKER inspect -f '{{.State.Running}}' "$name" 2>/dev/null || echo missing)
  echo "$name $state" >> "$FACTS/containers.txt"
done

# Hermes: patches, the B2-36 report, the fast-path file and whether the hook reads it.
$DOCKER exec -u root "$HERMES" sh /opt/data/patches/check.sh > "$FACTS/check.txt" 2>&1
echo $? > "$FACTS/check.rc"
if $DOCKER exec "$HERMES" test -f /opt/data/handoff/engineering/b236-report.md 2>/dev/null; then
  echo yes > "$FACTS/b236-report"
fi
$DOCKER exec "$HERMES" cat /opt/data/routing/fast-paths.json > "$FACTS/fast-paths.json" 2>/dev/null \
  || rm -f "$FACTS/fast-paths.json"
$DOCKER exec "$HERMES" grep -rl --include='*.py' --exclude-dir=site-packages --exclude-dir=node_modules --exclude-dir=.venv 'fast-paths' /opt/hermes 2>/dev/null \
  | grep -v -e '/tests/' -e '/test/' -e '/test_' > "$FACTS/hook-grep.txt"

# The ship probe's settings (new ones need a compose up, not only a pull).
$DOCKER inspect -f '{{range .Config.Env}}{{println .}}{{end}}' hermes-starship-ship > "$FACTS/ship-env.txt" 2>/dev/null

# The Starship checkout: version, built page, the probes' output, the speed trials.
cp "$STARSHIP_DIR/__version__.py" "$FACTS/" 2>/dev/null
grep -l 'hermes.coreTerminal' "$STARSHIP_DIR"/frontend/dist/assets/*.js > "$FACTS/dist.txt" 2>/dev/null
for f in orders records fastpaths meters; do
  cp "$STARSHIP_DIR/deploy/live/$f.json" "$FACTS/live/" 2>/dev/null
done
cp "$STARSHIP_DIR/deploy/scratch/trials/speed-trials.json" "$FACTS/" 2>/dev/null

echo "Hermes Starship · what's live · $(date -u '+%Y-%m-%d %H:%M UTC')"
echo
if command -v python3 >/dev/null 2>&1; then
  python3 -I "$HERE/whats_live.py" "$FACTS"
else
  # No python on the host: the probes' image, already on the NAS, with no network.
  $DOCKER run --rm --pull never --network none \
    -v "$FACTS:/facts:ro" -v "$HERE/whats_live.py:/app/whats_live.py:ro" \
    "$PYTHON_IMAGE" python -I /app/whats_live.py /facts
fi
