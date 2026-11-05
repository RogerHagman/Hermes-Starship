"""Build frontend/src/assets/sensors.svg: the Sensor array (Deck 3), seen from the door.

    python3 frontend/tools/make_sensors_svg.py

Left to right: the turbolift door (back to the Bridge), the round scope in its housing with
the array console under it, the asks terminal (word for word), the work screen hanging over
the findings tray, and the sealed quarantine locker.

The page lays the live scope, the work screen and its buttons over this picture by position,
so if you move something here, move it in lib/sensors.ts too (SCOPE, SCREEN, SPOTS).
Everything is drawn in a 1600 x 740 box. The panel lights come from a fixed seed.
"""
import math
import random
from pathlib import Path

W, H = 1600, 740
OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "sensors.svg"
rnd = random.Random(2364)

SCI, CYAN, GOLD, RED = "#5aa4ec", "#7fd8e8", "#e8c37a", "#f08a7a"
LOCAL, CODEX, CLAUDE = "#3fc1a5", "#f0a948", "#e889b6"
SCOPE = (390, 290, 200)        # centre x, centre y, radius of the glass (lib/sensors.ts)
SCREEN = (880, 46, 560, 458)   # lib/sensors.ts


def f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


# ---------- the room ----------
def room():
    out = [
        f'<rect width="{W}" height="{H}" fill="url(#s-wall)"/>',
        # ceiling and its light strip
        '<rect width="1600" height="34" fill="#05080f"/>',
        '<rect x="160" y="30" width="1280" height="4" rx="2" fill="#bcd8ff" opacity=".22"/>',
        '<rect x="160" y="34" width="1280" height="60" fill="url(#s-downlight)"/>',
        # wall panels
        "".join(f'<line x1="{x}" y1="34" x2="{x}" y2="560" stroke="#1a2436" stroke-width="2"/>' for x in range(140, 1600, 132)),
        '<rect x="0" y="236" width="1600" height="3" fill="#1d2a40"/>',
        # floor
        '<polygon points="0,560 1600,560 1600,740 0,740" fill="url(#s-floor)"/>',
        '<line x1="0" y1="560" x2="1600" y2="560" stroke="#2a3a55" stroke-width="2"/>',
        "".join(f'<line x1="{800 + (x - 800) * 0.55}" y1="560" x2="{x}" y2="740" stroke="#152033" stroke-width="1.5"/>' for x in range(-400, 2001, 200)),
        # a band of data lights along the wall
    ]
    for i in range(46):
        x = 150 + i * 28
        if 600 < x < 880 or x > 1440:
            continue
        c = rnd.choice([SCI, SCI, CYAN, GOLD, LOCAL])
        out.append(f'<rect x="{x}" y="{f(546 + rnd.choice([0, 0, 1]))}" width="{f(rnd.uniform(8, 18))}" height="3" rx="1.5" fill="{c}" opacity="{f(rnd.uniform(.3, .75))}"/>')
    return "\n".join(out)


# ---------- the turbolift door ----------
def door():
    x0, x1, top = 22, 132, 150
    mid = (x0 + x1) / 2
    return "\n".join([
        f'<rect x="{x0 - 8}" y="{top - 10}" width="{x1 - x0 + 16}" height="{560 - top + 10}" rx="8" fill="#101827" stroke="#2a3a55" stroke-width="2"/>',
        f'<rect x="{x0}" y="{top}" width="{x1 - x0}" height="{560 - top}" rx="4" fill="url(#s-door)"/>',
        f'<line x1="{mid}" y1="{top}" x2="{mid}" y2="560" stroke="#05080f" stroke-width="3"/>',
        f'<rect x="{x0 + 10}" y="{top + 16}" width="{x1 - x0 - 20}" height="6" rx="3" fill="{SCI}" opacity=".7"/>',
        f'<text x="{mid}" y="{top - 18}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{SCI}">TURBOLIFT</text>',
        f'<rect class="s-lamp" x="{x1 + 2}" y="330" width="6" height="30" rx="3" fill="{LOCAL}"/>',
    ])


# ---------- the scope housing (the page draws the scope itself in the glass) ----------
def scope():
    cx, cy, r = SCOPE
    out = [
        f'<circle cx="{cx}" cy="{cy + 10}" r="{r + 34}" fill="#000" opacity=".45"/>',
        f'<circle cx="{cx}" cy="{cy}" r="{r + 30}" fill="url(#s-housing)" stroke="#33445f" stroke-width="2"/>',
        f'<circle cx="{cx}" cy="{cy}" r="{r + 12}" fill="#0a111c" stroke="#25344c" stroke-width="2"/>',
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#s-glass)"/>',
    ]
    # light segments round the housing
    for k in range(36):
        a = math.radians(k * 10 - 90)
        x1, y1 = cx + (r + 18) * math.cos(a), cy + (r + 18) * math.sin(a)
        x2, y2 = cx + (r + 26) * math.cos(a), cy + (r + 26) * math.sin(a)
        c = GOLD if k % 9 == 0 else SCI
        out.append(f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" stroke="{c}" stroke-width="3" stroke-linecap="round" opacity="{".9" if k % 9 == 0 else ".45"}"/>')
    # bolts
    for k in range(8):
        a = math.radians(k * 45 + 22.5)
        out.append(f'<circle cx="{f(cx + (r + 22) * math.cos(a))}" cy="{f(cy + (r + 22) * math.sin(a))}" r="3" fill="#5a6a85"/>')
    out.append(f'<text x="{cx}" y="{cy - r - 38}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2.4" fill="{SCI}">LONG RANGE SCOPE</text>')
    return "\n".join(out)


# ---------- the array console under the scope ----------
def console():
    x0, x1, y = 170, 610, 560
    out = [
        f'<ellipse cx="{(x0 + x1) / 2}" cy="726" rx="250" ry="14" fill="url(#s-shadow)"/>',
        f'<path d="M{x0} {y + 40} Q{(x0 + x1) / 2} {y + 4} {x1} {y + 40} L{x1 - 14} {y + 150} H{x0 + 14} Z" fill="url(#s-metal)" stroke="#33445f" stroke-width="2"/>',
        f'<path d="M{x0 + 20} {y + 46} Q{(x0 + x1) / 2} {y + 18} {x1 - 20} {y + 46} L{x1 - 26} {y + 92} H{x0 + 26} Z" fill="#081120" stroke="{SCI}" stroke-opacity=".5"/>',
    ]
    # sliders: one per sector
    for i, c in enumerate([GOLD, SCI, CYAN, LOCAL]):
        x = x0 + 60 + i * 52
        v = rnd.uniform(.3, .9)
        out.append(f'<rect x="{x}" y="{y + 52}" width="6" height="34" rx="3" fill="#1a2436"/>')
        out.append(f'<rect x="{x - 5}" y="{f(y + 52 + 30 * (1 - v))}" width="16" height="7" rx="2" fill="{c}"/>')
    # a little dish readout
    dx, dy = x1 - 120, y + 70
    out += [
        f'<path d="M{dx - 26} {dy - 8} Q{dx} {dy + 16} {dx + 26} {dy - 8}" fill="none" stroke="{CYAN}" stroke-width="2"/>',
        f'<line x1="{dx}" y1="{dy + 4}" x2="{dx + 12}" y2="{dy - 14}" stroke="{CYAN}" stroke-width="1.6"/>',
        f'<circle class="s-lamp" cx="{dx + 12}" cy="{dy - 14}" r="2.6" fill="{CYAN}"/>',
        f'<text x="{(x0 + x1) / 2}" y="{y + 124}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{SCI}" opacity=".85">ARRAY CONSOLE · WATCHES</text>',
    ]
    return "\n".join(out)


# ---------- the asks terminal ----------
def terminal():
    x, y, w, h = 664, 250, 176, 470
    out = [
        f'<ellipse cx="{x + w / 2}" cy="{y + h + 4}" rx="110" ry="12" fill="url(#s-shadow)"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="url(#s-metal)" stroke="#33445f" stroke-width="2"/>',
        f'<rect x="{x + 14}" y="{y + 16}" width="{w - 28}" height="150" rx="8" fill="#081120" stroke="{GOLD}" stroke-opacity=".55"/>',
        # quote marks: the words come in as they were said
        f'<text x="{x + w / 2}" y="{y + 104}" text-anchor="middle" font-family="Georgia, serif" font-size="72" fill="{GOLD}" opacity=".85">“ ”</text>',
        f'<rect class="s-cursor" x="{x + 30}" y="{y + 128}" width="{w - 60}" height="5" rx="2.5" fill="{GOLD}" opacity=".6"/>',
        f'<text x="{x + w / 2}" y="{y + 190}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{GOLD}">WORD FOR WORD</text>',
    ]
    # speaker grille
    for j in range(7):
        for i in range(6):
            out.append(f'<circle cx="{x + 38 + i * 20}" cy="{y + 226 + j * 18}" r="3.2" fill="#05080f"/>')
    out.append(f'<rect class="s-lamp" x="{x + 60}" y="{y + 372}" width="56" height="6" rx="3" fill="{LOCAL}"/>')
    out.append(f'<rect x="{x + 24}" y="{y + 400}" width="{w - 48}" height="40" rx="6" fill="#0d1626" stroke="#25344c"/>')
    return "\n".join(out)


# ---------- the work screen ----------
def work_screen():
    x, y, w, h = SCREEN
    return "\n".join([
        f'<rect x="{x - 14}" y="{y - 14}" width="{w + 28}" height="{h + 28}" rx="16" fill="#0d1626" stroke="#2a3a55" stroke-width="2"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#060b14"/>',
        f'<rect x="{x - 14}" y="{y + h + 14}" width="{w + 28}" height="5" rx="2.5" fill="{SCI}" opacity=".35"/>',
    ])


# ---------- the findings tray: cited reports, one PADD each ----------
def findings():
    x, y = 1010, 590
    out = [
        f'<ellipse cx="{x + 130}" cy="{y + 128}" rx="170" ry="14" fill="url(#s-shadow)"/>',
        f'<path d="M{x} {y + 46} H{x + 260} L{x + 244} {y + 120} H{x + 16} Z" fill="url(#s-metal)" stroke="#33445f" stroke-width="2"/>',
        f'<rect x="{x - 6}" y="{y + 38}" width="272" height="10" rx="4" fill="#1d2a40"/>',
    ]
    for i in range(5):
        px = x + 18 + i * 46
        tilt = -8 + i * 4
        c = [SCI, CYAN, GOLD, SCI, LOCAL][i]
        out.append(f'<g transform="rotate({tilt} {px + 20} {y + 40})">'
                   f'<rect x="{px}" y="{y - 14}" width="40" height="56" rx="5" fill="#1a2436" stroke="#3a4a66"/>'
                   f'<rect x="{px + 5}" y="{y - 8}" width="30" height="30" rx="2" fill="{c}" opacity=".55"/>'
                   f'<rect x="{px + 5}" y="{y + 26}" width="20" height="3" rx="1.5" fill="{c}" opacity=".6"/></g>')
    out.append(f'<text x="{x + 130}" y="{y + 92}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{SCI}" opacity=".85">FINDINGS · CITED</text>')
    return "\n".join(out)


# ---------- the quarantine locker ----------
def quarantine():
    x, y, w, h = 1462, 150, 124, 570
    stripes = "".join(f'<path d="M{x + i * 22} {y + 70} l14 0 l-20 22 l-14 0 z" fill="{GOLD}" opacity=".8"/>' for i in range(7))
    return "\n".join([
        f'<ellipse cx="{x + w / 2}" cy="{y + h + 4}" rx="90" ry="12" fill="url(#s-shadow)"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="url(#s-metal)" stroke="#33445f" stroke-width="2"/>',
        f'<clipPath id="s-qclip"><rect x="{x + 2}" y="{y + 70}" width="{w - 4}" height="22"/></clipPath>',
        f'<rect x="{x + 2}" y="{y + 70}" width="{w - 4}" height="22" fill="#14110a"/>',
        f'<g clip-path="url(#s-qclip)">{stripes}</g>',
        f'<text x="{x + w / 2}" y="{y + 50}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{RED}">QUARANTINE</text>',
        # the window, and what is held behind it
        f'<rect x="{x + 16}" y="{y + 120}" width="{w - 32}" height="170" rx="8" fill="#0a0608" stroke="{RED}" stroke-opacity=".55" stroke-width="2"/>',
        f'<rect x="{x + 16}" y="{y + 120}" width="{w - 32}" height="170" rx="8" fill="url(#s-held)"/>',
        f'<rect class="s-held" x="{x + w / 2 - 20}" y="{y + 186}" width="40" height="40" rx="4" fill="none" stroke="{RED}" stroke-width="2" transform="rotate(12 {x + w / 2} {y + 206})"/>',
        f'<rect x="{x + w / 2 - 12}" y="{y + 194}" width="24" height="24" rx="3" fill="{RED}" opacity=".3" transform="rotate(12 {x + w / 2} {y + 206})"/>',
        f'<circle class="s-lamp" cx="{x + w / 2}" cy="{y + 330}" r="7" fill="{RED}"/>',
        f'<text x="{x + w / 2}" y="{y + 362}" text-anchor="middle" font-family="monospace" font-size="9" letter-spacing="1.6" fill="{RED}" opacity=".85">SEALED</text>',
        f'<rect x="{x + 20}" y="{y + 400}" width="{w - 40}" height="120" rx="6" fill="#0d1626" stroke="#25344c"/>',
        f'<rect x="{x + 34}" y="{y + 440}" width="{w - 68}" height="10" rx="5" fill="#1d2a40"/>',
    ])


# ---------- highlights for the things you can pick (lib/sensors.ts SPOTS) ----------
def highlights():
    glow = 'fill="none" stroke="#bfe0ff" stroke-width="3" filter="url(#s-blur)"'
    cx, cy, r = SCOPE
    return "\n".join([
        f'<rect id="s-hl-bridge" class="s-hl" x="14" y="140" width="126" height="424" rx="10" {glow}/>',
        f'<circle id="s-hl-scope" class="s-hl" cx="{cx}" cy="{cy}" r="{r + 32}" {glow}/>',
        f'<path id="s-hl-watches" class="s-hl" d="M170 600 Q390 564 610 600 L596 710 H184 Z" {glow}/>',
        f'<rect id="s-hl-asks" class="s-hl" x="660" y="246" width="184" height="478" rx="16" {glow}/>',
        f'<path id="s-hl-findings" class="s-hl" d="M1004 570 H1276 L1254 712 H1020 Z" {glow}/>',
        f'<rect id="s-hl-quarantine" class="s-hl" x="1458" y="146" width="132" height="578" rx="14" {glow}/>',
    ])


DEFS = f"""<defs>
<filter id="s-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
<linearGradient id="s-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1424"/><stop offset=".7" stop-color="#0a101d"/><stop offset="1" stop-color="#070b14"/></linearGradient>
<linearGradient id="s-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1626"/><stop offset="1" stop-color="#05080f"/></linearGradient>
<linearGradient id="s-downlight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd8ff" stop-opacity=".08"/><stop offset="1" stop-color="#bcd8ff" stop-opacity="0"/></linearGradient>
<linearGradient id="s-door" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#16213a"/><stop offset=".5" stop-color="#22304d"/><stop offset="1" stop-color="#16213a"/></linearGradient>
<linearGradient id="s-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#121b2c"/><stop offset=".5" stop-color="#1f2b42"/><stop offset="1" stop-color="#101827"/></linearGradient>
<radialGradient id="s-housing" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#2a3954"/><stop offset="1" stop-color="#101827"/></radialGradient>
<radialGradient id="s-glass" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#0b2238"/><stop offset=".75" stop-color="#06121f"/><stop offset="1" stop-color="#030912"/></radialGradient>
<radialGradient id="s-held" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="{RED}" stop-opacity=".22"/><stop offset="1" stop-color="{RED}" stop-opacity="0"/></radialGradient>
<radialGradient id="s-shadow"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="s-vignette" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
</defs>"""


def build():
    body = "\n".join([
        DEFS,
        "<!-- the room -->", room(),
        "<!-- the turbolift door -->", door(),
        "<!-- the scope -->", scope(),
        "<!-- the array console -->", console(),
        "<!-- the asks terminal -->", terminal(),
        "<!-- the work screen -->", work_screen(),
        "<!-- the findings tray -->", findings(),
        "<!-- the quarantine locker -->", quarantine(),
        "<!-- highlights -->", highlights(),
        f'<rect width="{W}" height="{H}" fill="url(#s-vignette)" pointer-events="none"/>',
    ])
    return (f'<svg class="sensors-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" aria-hidden="true">\n'
            f"{body}\n</svg>\n")


if __name__ == "__main__":
    svg = build()
    OUT.write_text(svg)
    print(OUT, len(svg), "bytes")
