"""Build frontend/assets/ship.svg from the DeckPlanV4 sources.

The hull art comes from holodeck/ship-plan-v4-src. Run its pipeline first
(rooms.py, messhall.py, gen.py there), then run this script from the repo root:

    python3 frontend/tools/make_ship_svg.py holodeck/ship-plan-v4-src

The design-canvas placeholders ({{ship.*}}) become CSS variables and element
ids, so the landing page can switch the nacelle glow and labels from fixtures.
"""
import re
import sys
from pathlib import Path

src = Path(sys.argv[1] if len(sys.argv) > 1 else "holodeck/ship-plan-v4-src")
out = Path(__file__).resolve().parent.parent / "assets" / "ship.svg"

svg = (src / "hull.svg").read_text()
svg = re.sub(r"<metadata>.*?</metadata>", "", svg, flags=re.S)
svg = svg.replace("%%SEATS%%", (src / "seats.svg").read_text().strip())
svg = svg.replace("%%CABINS%%", (src / "cabins2.svg").read_text().strip())

# Text labels: give each an id and take its colour from a CSS variable.
for key in ("codex", "claude", "core"):
    svg = svg.replace(
        "style=\"fill: {{ship.%sText}}\">{{ship.%sLabel}}" % (key, key),
        "id=\"lbl-%s\" style=\"fill: var(--%s-text)\">" % (key, key),
    )
# Glows and the table: opacity from CSS variables.
for name, var in (("codexGlow", "codex-glow"), ("claudeGlow", "claude-glow"),
                  ("coreGlow", "core-glow"), ("conduit", "conduit"),
                  ("tableGlow", "table-glow")):
    svg = svg.replace("{{ship.%s}}" % name, "var(--%s)" % var)

svg = svg.replace('class="hull"', 'class="hull" xmlns="http://www.w3.org/2000/svg"', 1)
svg = svg.replace(' xmlns:c2pa="http://c2pa.org/manifest"', "")
left = re.findall(r"\{\{[^}]*\}\}|%%[A-Z]+%%", svg)
assert not left, left
out.write_text(svg)
print(out, len(svg), "bytes")
