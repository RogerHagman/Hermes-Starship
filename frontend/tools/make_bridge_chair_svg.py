"""Build frontend/src/assets/bridge-chair.svg: the Captain's chair on the Bridge.

    python3 frontend/tools/make_bridge_chair_svg.py

Seen from behind: the command chair in front, the helm and ops consoles ahead of it, an
empty seat either side, and the main viewscreen filling the far wall. The chair itself is
the same one drawn for the Quarters (make_quarters_svg.py), scaled down, so the two match.
The Bridge console shows this picture when you pick the Captain.

The stars come from a fixed seed, so the picture is the same on every run. Ids start with
"bc-" so they never clash with the Quarters picture. Drawn in a 520 x 440 box.
"""
import random
import re
from pathlib import Path

import make_quarters_svg as q

W, H = 520, 440
OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "bridge-chair.svg"
rnd = random.Random(1864)
f = q.f

SCREEN = (34, 26, 452, 224)   # x, y, w, h of the viewscreen glass


def stars():
    x0, y0, w, h = SCREEN
    out = []
    for i in range(120):
        x, y = rnd.uniform(x0, x0 + w), rnd.uniform(y0, y0 + h)
        r = rnd.choice([0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2, 1.4])
        tint = rnd.choice(["#ffffff", "#ffffff", "#dfe8ff", "#fff1d6"])
        cls = ' class="bc-tw"' if i % 8 == 0 else ""
        delay = f' style="animation-delay:-{f(rnd.uniform(0, 6))}s"' if cls else ""
        out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{tint}" opacity="{f(rnd.uniform(.35, .95))}"{cls}{delay}/>')
    for x, y, r in [(96, 62, 7), (402, 88, 6), (250, 52, 5)]:
        out.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="url(#bc-starglow)"/><circle cx="{x}" cy="{y}" r="1.3" fill="#fff"/>')
    return "\n".join(out)


def streaks():
    """Warp streaks while the burn is on: they rush out from the middle of the screen."""
    out = []
    for i in range(18):
        y = rnd.uniform(40, 236)
        length = rnd.uniform(30, 90)
        dur, delay = rnd.uniform(4, 8), rnd.uniform(0, 8)
        out.append(
            f'<line class="bc-streak" x1="0" y1="{f(y)}" x2="{f(length)}" y2="{f(y)}" stroke="url(#bc-streak)" '
            f'stroke-width="{f(rnd.uniform(.8, 1.5))}" opacity="{f(rnd.uniform(.25, .6))}" '
            f'style="animation-duration:{f(dur)}s;animation-delay:-{f(delay)}s"/>')
    return "\n".join(out)


def viewscreen():
    x, y, w, h = SCREEN
    return "\n".join([
        f'<rect x="{x - 12}" y="{y - 12}" width="{w + 24}" height="{h + 24}" rx="22" fill="#0b1220" stroke="#2e4569" stroke-width="2"/>',
        f'<rect x="{x - 4}" y="{y - 4}" width="{w + 8}" height="{h + 8}" rx="16" fill="none" stroke="{q.GOLD}" stroke-opacity=".35" stroke-width="1.2"/>',
        f'<g clip-path="url(#bc-glass)">',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="url(#bc-space)"/>',
        '<ellipse cx="150" cy="96" rx="150" ry="70" fill="url(#bc-neb-plum)"/>',
        '<ellipse cx="380" cy="170" rx="140" ry="64" fill="url(#bc-neb-teal)"/>',
        stars(),
        f'<g class="bc-streaks" style="opacity:var(--bc-burn,0)">{streaks()}</g>',
        # a planet's lit edge low on the screen
        '<circle cx="410" cy="380" r="200" fill="url(#bc-planet)"/>',
        '<circle cx="410" cy="380" r="200" fill="none" stroke="#9fe0ee" stroke-opacity=".5" stroke-width="1.5"/>',
        # glass reflection
        f'<path d="M{x} {y + 20} L{x + 120} {y} L{x + 170} {y} L{x} {y + 60} Z" fill="#fff" opacity=".035"/>',
        '</g>',
        # small LCARS caps on the frame
        f'<rect x="{x + 18}" y="{y - 10}" width="54" height="5" rx="2.5" fill="{q.GOLD}" opacity=".75"/>',
        f'<rect x="{x + w - 72}" y="{y - 10}" width="54" height="5" rx="2.5" fill="{q.MIXED}" opacity=".75"/>',
    ])


def room():
    out = [
        f'<rect width="{W}" height="{H}" fill="url(#bc-wall)"/>',
        # the floor, lit by the screen
        f'<path d="M0 268 L{W} 268 L{W} {H} L0 {H} Z" fill="url(#bc-floor)"/>',
        f'<ellipse cx="260" cy="276" rx="250" ry="26" fill="url(#bc-screenlight)"/>',
        # the command platform: a low curved step around the chairs
        '<path d="M18 440 C40 352 150 318 260 318 C370 318 480 352 502 440" fill="none" stroke="#2e4569" stroke-width="2"/>',
        f'<path d="M30 440 C52 362 156 330 260 330 C364 330 468 362 490 440" fill="none" stroke="{q.GOLD}" stroke-opacity=".22" stroke-width="1.2"/>',
    ]
    # side walls with rail-coloured light strips
    for x, side in [(0, 1), (W, -1)]:
        out.append(f'<path d="M{x} 0 L{x + side * 22} 0 L{x + side * 22} 268 L{x} 290 Z" fill="#0d1526"/>')
        for i, c in enumerate([q.LOCAL, q.CODEX, q.CLAUDE]):
            y = 70 + i * 46
            out.append(f'<rect x="{min(x, x + side * 18) + 2}" y="{y}" width="14" height="4" rx="2" fill="{c}" opacity=".55"/>')
    return "\n".join(out)


def consoles():
    """Helm on the left, ops on the right, both local stations: teal lights."""
    out = []
    for cx in (150, 370):
        out += [
            f'<path d="M{cx - 64} 300 L{cx - 52} 274 L{cx + 52} 274 L{cx + 64} 300 Z" fill="url(#bc-console)" stroke="#2e4569" stroke-width="1.2"/>',
            f'<rect x="{cx - 46}" y="279" width="92" height="9" rx="3" fill="#0a1a22"/>',
        ]
        for i in range(6):
            out.append(f'<rect x="{cx - 42 + i * 15}" y="281.5" width="9" height="4" rx="2" fill="{q.LOCAL}" opacity="{f(.45 + (i % 3) * .2)}"/>')
        out.append(f'<rect x="{cx - 64}" y="300" width="128" height="10" rx="3" fill="#0b1220"/>')
    return "\n".join(out)


def side_seat(cx, base, s):
    """An empty seat beside the Captain: the chair's shell only, no trim or delta."""
    return (f'<g transform="translate({cx} {base}) scale({s}) translate(-400 -714)" opacity=".85">'
            '<ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#bc-shadow)"/>'
            '<path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#bc-metal)"/>'
            '<rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/>'
            f'<path d="{q.CHAIR_BACK}" fill="url(#bc-seat)"/>'
            f'<path d="{q.CHAIR_RIM}" fill="none" stroke="url(#bc-rim)" stroke-width="3"/>'
            '</g>')


def captains_chair():
    """The Quarters chair, renamed into bc- ids, scaled to the front of the platform."""
    chair = q.chair().replace("url(#q-", "url(#bc-").replace('class="q-armlight"', 'class="bc-armlight"')
    return f'<g transform="translate(260 440) scale(.6) translate(-400 -716)">{chair}</g>'


# The chair's gradients come from the Quarters defs, renamed.
CHAIR_DEFS = "\n".join(
    line.replace('id="q-', 'id="bc-') for line in q.DEFS.splitlines()
    if re.search(r'id="q-(shell|shell-top|arm|rim|metal|shadow|starglow|streak|neb-plum|neb-teal)"', line))

DEFS = f"""<defs>
<clipPath id="bc-glass"><rect x="{SCREEN[0]}" y="{SCREEN[1]}" width="{SCREEN[2]}" height="{SCREEN[3]}" rx="12"/></clipPath>
{CHAIR_DEFS}
<linearGradient id="bc-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="bc-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<radialGradient id="bc-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="bc-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="bc-planet" cx=".3" cy=".05" r="1"><stop offset="0" stop-color="#5fa2b4"/><stop offset=".18" stop-color="#1f5068"/><stop offset=".5" stop-color="#0c2236"/><stop offset="1" stop-color="#050b14"/></radialGradient>
<linearGradient id="bc-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="bc-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<radialGradient id="bc-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
</defs>"""


def build():
    body = "\n".join([
        DEFS,
        "<!-- the bridge -->", room(),
        "<!-- the main viewscreen -->", viewscreen(),
        "<!-- helm and ops -->", consoles(),
        "<!-- the seats either side -->", side_seat(116, 424, .34), side_seat(404, 424, .34),
        "<!-- the Captain's chair -->", captains_chair(),
        f'<rect width="{W}" height="{H}" fill="url(#bc-vignette)" pointer-events="none"/>',
    ])
    return (f'<svg class="bridge-chair-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
            f'preserveAspectRatio="xMidYMid slice" aria-hidden="true">\n{body}\n</svg>\n')


if __name__ == "__main__":
    svg = build()
    OUT.write_text(svg)
    print(OUT, len(svg), "bytes")
