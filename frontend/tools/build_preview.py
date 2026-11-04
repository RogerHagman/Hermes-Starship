"""Inline the landing page into one HTML file for a quick look (no server needed).

    python3 frontend/tools/build_preview.py dist/bridge-preview.html

The normal page loads the same files separately; this only bundles them.
Fonts are left out of the bundle, so it falls back to system fonts unless
--fonts is given (adds about 160 KB as base64).
"""
import base64
import json
import re
import sys
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent
FIX = WEB.parent / "fixtures"
args = [a for a in sys.argv[1:] if not a.startswith("--")]
out = Path(args[0] if args else "dist/bridge-preview.html")
with_fonts = "--fonts" in sys.argv

html = (WEB / "index.html").read_text()


def css(name):
    text = (WEB / "css" / name).read_text()
    if name == "tokens.css":
        if with_fonts:
            def embed(m):
                data = base64.b64encode((WEB / "fonts" / m.group(1)).read_bytes()).decode()
                return f"url(data:font/woff2;base64,{data})"
            text = re.sub(r"url\(\.\./fonts/([^)]+)\)", embed, text)
        else:
            text = re.sub(r"@font-face\{[^}]*\}\n?", "", text)
    return f"<style>\n{text}\n</style>"


for name in ("tokens.css", "messhall.css", "landing.css"):
    html = html.replace(f'<link rel="stylesheet" href="css/{name}">', css(name))
html = html.replace('<link rel="icon" href="assets/icon.svg" type="image/svg+xml">', "")
fixtures = {p.stem: json.loads(p.read_text()) for p in FIX.glob("*.json")}
ship = (WEB / "assets" / "ship.svg").read_text()
inline = "window.FIXTURES = %s;\nwindow.SHIP_SVG = %s;\n" % (json.dumps(fixtures), json.dumps(ship))
for name in ("shipmap.js", "landing.js"):
    js = (WEB / "js" / name).read_text()
    if name == "shipmap.js":
        js = inline + js
    html = html.replace(f'<script src="js/{name}"></script>', f"<script>\n{js.replace('</', '<\\/')}\n</script>")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(html)
print(out, len(html), "bytes")
