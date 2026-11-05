"""Build frontend/src/assets/engineering.svg: Main Engineering (Deck 7), seen from the door.

    python3 frontend/tools/make_engineering_svg.py

Left to right: the turbolift door (back to the Bridge), the Chief Engineer's console, the
warp core (its glow follows the local rail), the Systems and Diagnostics consoles, the master
systems table in front (the page lays the live patch line on it), the Chief's wall screen
over the test bench, and the patch bay locker.

The page lays the patch line, the work screen and its buttons over this picture by position,
so if you move something here, move it in lib/engineering.ts too (LINE, SCREEN, SPOTS).
Everything is drawn in a 1600 x 740 box. The panel lights come from a fixed seed.
"""
import math
import random
from pathlib import Path

W, H = 1600, 740
OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "engineering.svg"
rnd = random.Random(1701)

AMBER, GOLD, RED, BLUE = "#f0a948", "#e8c37a", "#f08a7a", "#7fb8f0"
LOCAL, CODEX, CLAUDE = "#3fc1a5", "#f0a948", "#e889b6"
CORE = "#6fd6f0"               # the core's glow; the page recolours it from the local rail
CORE_X = 415                   # the warp core's centre line
LINE = (170, 596, 660, 96)     # the table top where the page lays the patch line (lib/engineering.ts)
SCREEN = (880, 46, 560, 458)   # lib/engineering.ts


def f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


# ---------- the room ----------
def room():
    out = [
        f'<rect width="{W}" height="{H}" fill="url(#e-wall)"/>',
        '<rect width="1600" height="34" fill="#0a0806"/>',
        '<rect x="160" y="30" width="1280" height="4" rx="2" fill="#ffe2b0" opacity=".18"/>',
        '<rect x="160" y="34" width="1280" height="60" fill="url(#e-downlight)"/>',
        "".join(f'<line x1="{x}" y1="34" x2="{x}" y2="560" stroke="#231c14" stroke-width="2"/>' for x in range(140, 1600, 132)),
        '<rect x="0" y="236" width="1600" height="3" fill="#2b2218"/>',
        # power conduits from the core along the ceiling
        f'<rect x="490" y="58" width="390" height="10" rx="5" fill="#1b1610" stroke="#3a2e20"/>',
        f'<rect class="e-glow e-flow" x="494" y="61" width="382" height="4" rx="2" fill="{CORE}" opacity=".55"/>',
        f'<rect x="140" y="58" width="200" height="10" rx="5" fill="#1b1610" stroke="#3a2e20"/>',
        f'<rect class="e-glow e-flow" x="144" y="61" width="192" height="4" rx="2" fill="{CORE}" opacity=".55"/>',
        # floor
        '<polygon points="0,560 1600,560 1600,740 0,740" fill="url(#e-floor)"/>',
        '<line x1="0" y1="560" x2="1600" y2="560" stroke="#3a2e20" stroke-width="2"/>',
        "".join(f'<line x1="{800 + (x - 800) * 0.55}" y1="560" x2="{x}" y2="740" stroke="#1c160f" stroke-width="1.5"/>' for x in range(-400, 2001, 200)),
        # the core's glow on the floor
        f'<ellipse class="e-glow" cx="{CORE_X}" cy="575" rx="190" ry="22" fill="{CORE}" opacity=".16"/>',
    ]
    for i in range(46):
        x = 150 + i * 28
        if 330 < x < 500 or 860 < x < 1460 or x > 1440:
            continue
        c = rnd.choice([AMBER, AMBER, GOLD, BLUE, LOCAL])
        out.append(f'<rect x="{x}" y="{f(546 + rnd.choice([0, 0, 1]))}" width="{f(rnd.uniform(8, 18))}" height="3" rx="1.5" fill="{c}" opacity="{f(rnd.uniform(.3, .75))}"/>')
    return "\n".join(out)


# ---------- the turbolift door ----------
def door():
    x0, x1, top = 22, 132, 150
    mid = (x0 + x1) / 2
    return "\n".join([
        f'<rect x="{x0 - 8}" y="{top - 10}" width="{x1 - x0 + 16}" height="{560 - top + 10}" rx="8" fill="#17120c" stroke="#3a2e20" stroke-width="2"/>',
        f'<rect x="{x0}" y="{top}" width="{x1 - x0}" height="{560 - top}" rx="4" fill="url(#e-door)"/>',
        f'<line x1="{mid}" y1="{top}" x2="{mid}" y2="560" stroke="#0a0806" stroke-width="3"/>',
        f'<rect x="{x0 + 10}" y="{top + 16}" width="{x1 - x0 - 20}" height="6" rx="3" fill="{AMBER}" opacity=".7"/>',
        f'<text x="{mid}" y="{top - 18}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{AMBER}">TURBOLIFT</text>',
        f'<rect class="e-lamp" x="{x1 + 2}" y="330" width="6" height="30" rx="3" fill="{LOCAL}"/>',
    ])


# ---------- a standing console (the Chief's, Systems', Diagnostics') ----------
def standing(x0, x1, top, label, colour, bars):
    mid = (x0 + x1) / 2
    out = [
        f'<ellipse cx="{mid}" cy="566" rx="{(x1 - x0) / 2 + 14}" ry="9" fill="url(#e-shadow)"/>',
        # the stand
        f'<path d="M{mid - 22} {top + 80} H{mid + 22} L{mid + 30} 560 H{mid - 30} Z" fill="url(#e-metal)" stroke="#3a2e20" stroke-width="2"/>',
        # the slanted top
        f'<path d="M{x0} {top + 14} L{x1} {top} L{x1 - 6} {top + 86} L{x0 + 6} {top + 96} Z" fill="url(#e-metal)" stroke="#4a3a28" stroke-width="2"/>',
        f'<path d="M{x0 + 12} {top + 22} L{x1 - 12} {top + 10} L{x1 - 16} {top + 76} L{x0 + 16} {top + 84} Z" fill="#0c0906" stroke="{colour}" stroke-opacity=".55"/>',
    ]
    # little bar readouts on its display
    for i, v in enumerate(bars):
        bx = x0 + 24 + i * 16
        by = top + 74 - i * 0.9
        out.append(f'<rect x="{f(bx)}" y="{f(by - 40 * v)}" width="9" height="{f(40 * v)}" rx="2" fill="{colour}" opacity=".7"/>')
    out.append(f'<rect class="e-lamp" x="{mid - 14}" y="{top + 120}" width="28" height="5" rx="2.5" fill="{colour}"/>')
    out.append(f'<text x="{mid}" y="{top - 14}" text-anchor="middle" font-family="monospace" font-size="9.5" letter-spacing="1.8" fill="{colour}">{label}</text>')
    return "\n".join(out)


def consoles():
    return "\n".join([
        standing(166, 302, 262, "CHIEF ENGINEER", AMBER, [rnd.uniform(.3, .95) for _ in range(7)]),
        standing(522, 662, 300, "SYSTEMS", GOLD, [rnd.uniform(.3, .95) for _ in range(7)]),
        standing(690, 830, 330, "DIAGNOSTICS", BLUE, [rnd.uniform(.3, .95) for _ in range(7)]),
    ])


# ---------- the warp core ----------
def core():
    cx = CORE_X
    out = [
        # the shaft through the ceiling and the floor
        f'<rect x="{cx - 58}" y="0" width="116" height="590" fill="url(#e-shaft)"/>',
        f'<rect x="{cx - 64}" y="0" width="6" height="590" fill="#2b2218"/>',
        f'<rect x="{cx + 58}" y="0" width="6" height="590" fill="#2b2218"/>',
        # the glowing column
        f'<rect class="e-glow" x="{cx - 26}" y="0" width="52" height="590" fill="{CORE}" opacity=".22"/>',
        f'<rect class="e-glow e-pulse" x="{cx - 14}" y="0" width="28" height="590" fill="{CORE}" opacity=".8"/>',
        f'<rect x="{cx - 4}" y="0" width="8" height="590" fill="#e8fbff" opacity=".55"/>',
    ]
    # rings up and down the column, with the bright reaction chamber in the middle
    for y in list(range(18, 210, 26)) + list(range(386, 580, 26)):
        out.append(f'<rect x="{cx - 44}" y="{y}" width="88" height="10" rx="3" fill="#2a2116" stroke="#4a3a28"/>')
        out.append(f'<rect class="e-glow" x="{cx - 40}" y="{y + 3}" width="80" height="4" rx="2" fill="{CORE}" opacity=".45"/>')
    out += [
        f'<rect x="{cx - 70}" y="246" width="140" height="124" rx="22" fill="#1b1610" stroke="#5a4630" stroke-width="3"/>',
        f'<rect class="e-glow" x="{cx - 58}" y="258" width="116" height="100" rx="16" fill="url(#e-chamber)"/>',
        f'<rect class="e-glow e-pulse" x="{cx - 40}" y="270" width="80" height="76" rx="12" fill="{CORE}" opacity=".55"/>',
        f'<circle cx="{cx}" cy="308" r="20" fill="#f4fdff" opacity=".7"/>',
    ]
    for k in range(6):
        y = 258 + k * 20
        out.append(f'<rect x="{cx - 76}" y="{y}" width="8" height="12" rx="2" fill="{AMBER}" opacity=".7"/>')
        out.append(f'<rect x="{cx + 68}" y="{y}" width="8" height="12" rx="2" fill="{AMBER}" opacity=".7"/>')
    return "\n".join(out)


# ---------- the master systems table (the page lays the patch line on its top) ----------
def table():
    x, y, w, h = LINE
    out = [
        f'<ellipse cx="{x + w / 2}" cy="730" rx="{w / 2 + 30}" ry="12" fill="url(#e-shadow)"/>',
        f'<path d="M{x - 20} {y - 12} H{x + w + 20} L{x + w + 6} 724 H{x - 6} Z" fill="url(#e-metal)" stroke="#4a3a28" stroke-width="2"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="#0c0906" stroke="{AMBER}" stroke-opacity=".45"/>',
        f'<rect x="{x - 20}" y="{y - 16}" width="{w + 40}" height="6" rx="3" fill="{AMBER}" opacity=".45"/>',
        f'<text x="{x + w / 2}" y="{y + h + 22}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{AMBER}" opacity=".85">MASTER SYSTEMS · THE PATCH LINE</text>',
    ]
    return "\n".join(out)


# ---------- the Chief's wall screen ----------
def work_screen():
    x, y, w, h = SCREEN
    return "\n".join([
        f'<rect x="{x - 14}" y="{y - 14}" width="{w + 28}" height="{h + 28}" rx="16" fill="#17120c" stroke="#3a2e20" stroke-width="2"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#0a0806"/>',
        f'<rect x="{x - 14}" y="{y + h + 14}" width="{w + 28}" height="5" rx="2.5" fill="{AMBER}" opacity=".35"/>',
    ])


# ---------- the test bench: two rigs side by side, split and solo ----------
def bench():
    x, y = 966, 566
    w = 408
    out = [
        f'<ellipse cx="{x + w / 2}" cy="726" rx="{w / 2 + 20}" ry="12" fill="url(#e-shadow)"/>',
        f'<path d="M{x} {y + 30} H{x + w} L{x + w - 16} {y + 136} H{x + 16} Z" fill="url(#e-metal)" stroke="#4a3a28" stroke-width="2"/>',
        f'<rect x="{x - 6}" y="{y + 22}" width="{w + 12}" height="10" rx="4" fill="#2b2218"/>',
    ]
    for i, (label, c, n) in enumerate([("SOLO", AMBER, 1), ("SPLIT", BLUE, 3)]):
        ry = y + 50 + i * 36
        out.append(f'<rect x="{x + 30}" y="{ry}" width="{w - 60}" height="22" rx="11" fill="#0c0906" stroke="{c}" stroke-opacity=".5"/>')
        out.append(f'<text x="{x + 44}" y="{ry + 15}" font-family="monospace" font-size="9" letter-spacing="1.6" fill="{c}">{label}</text>')
        for k in range(n):
            out.append(f'<circle class="e-lamp" cx="{x + 120 + k * 26}" cy="{ry + 11}" r="5" fill="{c}"/>')
        out.append(f'<rect x="{x + 210}" y="{ry + 8}" width="{rnd.randint(80, 150)}" height="6" rx="3" fill="{c}" opacity=".45"/>')
    out.append(f'<text x="{x + w / 2}" y="{y + 156}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{AMBER}" opacity=".85">TEST BENCH · SPLIT OR SOLO</text>')
    return "\n".join(out)


# ---------- the patch bay locker ----------
def bay():
    x, y, w, h = 1462, 150, 124, 570
    out = [
        f'<ellipse cx="{x + w / 2}" cy="{y + h + 4}" rx="90" ry="12" fill="url(#e-shadow)"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="url(#e-metal)" stroke="#4a3a28" stroke-width="2"/>',
        f'<text x="{x + w / 2}" y="{y + 40}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{AMBER}">PATCH BAY</text>',
        f'<rect x="{x + 14}" y="{y + 60}" width="{w - 28}" height="330" rx="8" fill="#0c0906" stroke="{AMBER}" stroke-opacity=".4"/>',
    ]
    # shelves of patch cartridges
    for j in range(6):
        sy = y + 76 + j * 52
        out.append(f'<rect x="{x + 20}" y="{sy + 34}" width="{w - 40}" height="4" rx="2" fill="#3a2e20"/>')
        for i in range(4):
            c = rnd.choice([AMBER, AMBER, GOLD, LOCAL])
            out.append(f'<rect x="{x + 26 + i * 19}" y="{sy + 4}" width="14" height="30" rx="3" fill="#221a10" stroke="{c}" stroke-opacity=".7"/>')
            out.append(f'<rect x="{x + 29 + i * 19}" y="{sy + 8}" width="8" height="4" rx="1" fill="{c}" opacity=".8"/>')
    out += [
        f'<circle class="e-lamp" cx="{x + w / 2}" cy="{y + 420}" r="7" fill="{LOCAL}"/>',
        f'<text x="{x + w / 2}" y="{y + 452}" text-anchor="middle" font-family="monospace" font-size="9" letter-spacing="1.6" fill="{LOCAL}" opacity=".85">CHECKED</text>',
        f'<rect x="{x + 20}" y="{y + 476}" width="{w - 40}" height="70" rx="6" fill="#17120c" stroke="#3a2e20"/>',
        f'<rect x="{x + 34}" y="{y + 504}" width="{w - 68}" height="10" rx="5" fill="#2b2218"/>',
    ]
    return "\n".join(out)


# ---------- highlights for the things you can pick (lib/engineering.ts SPOTS) ----------
def highlights():
    glow = 'fill="none" stroke="#ffe2b0" stroke-width="3" filter="url(#e-blur)"'
    return "\n".join([
        f'<rect id="e-hl-bridge" class="e-hl" x="14" y="140" width="126" height="424" rx="10" {glow}/>',
        f'<rect id="e-hl-chief" class="e-hl" x="160" y="250" width="148" height="316" rx="12" {glow}/>',
        f'<rect id="e-hl-core" class="e-hl" x="{CORE_X - 80}" y="8" width="160" height="572" rx="18" {glow}/>',
        f'<rect id="e-hl-systems" class="e-hl" x="516" y="288" width="152" height="278" rx="12" {glow}/>',
        f'<rect id="e-hl-diagnostics" class="e-hl" x="684" y="318" width="152" height="248" rx="12" {glow}/>',
        f'<path id="e-hl-line" class="e-hl" d="M146 580 H854 L840 726 H160 Z" {glow}/>',
        f'<path id="e-hl-bench" class="e-hl" d="M960 586 H1380 L1362 708 H978 Z" {glow}/>',
        f'<rect id="e-hl-bay" class="e-hl" x="1458" y="146" width="132" height="578" rx="14" {glow}/>',
    ])


DEFS = f"""<defs>
<filter id="e-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
<linearGradient id="e-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16110b"/><stop offset=".7" stop-color="#120e09"/><stop offset="1" stop-color="#0c0906"/></linearGradient>
<linearGradient id="e-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#18130d"/><stop offset="1" stop-color="#090705"/></linearGradient>
<linearGradient id="e-downlight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe2b0" stop-opacity=".07"/><stop offset="1" stop-color="#ffe2b0" stop-opacity="0"/></linearGradient>
<linearGradient id="e-door" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#221a10"/><stop offset=".5" stop-color="#33271a"/><stop offset="1" stop-color="#221a10"/></linearGradient>
<linearGradient id="e-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1c160f"/><stop offset=".5" stop-color="#2d2318"/><stop offset="1" stop-color="#18130d"/></linearGradient>
<linearGradient id="e-shaft" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c0906"/><stop offset=".5" stop-color="#1b1610"/><stop offset="1" stop-color="#0c0906"/></linearGradient>
<radialGradient id="e-chamber" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="{CORE}" stop-opacity=".9"/><stop offset="1" stop-color="{CORE}" stop-opacity=".15"/></radialGradient>
<radialGradient id="e-shadow"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="e-vignette" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
</defs>"""


def build():
    body = "\n".join([
        DEFS,
        "<!-- the room -->", room(),
        "<!-- the turbolift door -->", door(),
        "<!-- the warp core -->", core(),
        "<!-- the consoles -->", consoles(),
        "<!-- the master systems table -->", table(),
        "<!-- the work screen -->", work_screen(),
        "<!-- the test bench -->", bench(),
        "<!-- the patch bay -->", bay(),
        "<!-- highlights -->", highlights(),
        f'<rect width="{W}" height="{H}" fill="url(#e-vignette)" pointer-events="none"/>',
    ])
    return (f'<svg class="engineering-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" aria-hidden="true">\n'
            f"{body}\n</svg>\n")


if __name__ == "__main__":
    svg = build()
    OUT.write_text(svg)
    print(OUT, len(svg), "bytes")
