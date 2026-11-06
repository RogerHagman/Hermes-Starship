"""Build frontend/src/assets/computer.svg: the computer core (Deck 3), where the Ship's Computer lives, seen from the door.

    python3 frontend/tools/make_computer_svg.py

Left to right: the turbolift door, the memory banks (Hindsight: sealed, only the Computer reads them),
the computer core itself (a column of light rings from deck to ceiling), the records racks (every
order the ship has taken), and the core terminal: a big server screen over its desk. Under the
screen, the minutes reader (the briefing minutes) and the dilithium chamber (the burn window: it
glows while a burn is on). In front, the records board table.

The page lays the records board (a count per order state), and the terminal over this picture by
position, so if you move something here, move it in lib/computer.ts too (TABLE, SCREEN, SPOTS).
Everything is drawn in a 1600 x 740 box. The drive lights come from a fixed seed.
"""
import math
import random
from pathlib import Path

W, H = 1600, 740
OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "computer.svg"
rnd = random.Random(1701)

CORE, GOLD, GOOD, PHOS, DIL, LOCAL = "#7cc4ff", "#e8c37a", "#7fd8a8", "#9cf0b8", "#f2a6d0", "#3fc1a5"
TABLE = (170, 596, 600, 96)     # the records board's top (lib/computer.ts)
SCREEN = (810, 44, 770, 470)    # the core terminal's screen (lib/computer.ts)
CORE_X = 470                     # the core column's centre


def f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


def label(x, y, text, size=10, op=1):
    return (f'<text x="{f(x)}" y="{f(y)}" text-anchor="middle" font-family="monospace" font-size="{size}" '
            f'letter-spacing="2" fill="{CORE}" opacity="{op}">{text}</text>')


# ---------- the room ----------
def room():
    out = [
        f'<rect width="{W}" height="{H}" fill="url(#c-wall)"/>',
        '<rect width="1600" height="34" fill="#05080d"/>',
        '<rect x="150" y="30" width="1300" height="4" rx="2" fill="#d8ecff" opacity=".16"/>',
        '<rect x="150" y="34" width="1300" height="60" fill="url(#c-downlight)"/>',
        "".join(f'<line x1="{x}" y1="34" x2="{x}" y2="560" stroke="#121a26" stroke-width="2"/>' for x in range(140, 1600, 132)),
        '<rect x="0" y="236" width="1600" height="3" fill="#18222f"/>',
        # optical trunking from the core across the ceiling to the terminal
        '<rect x="540" y="58" width="262" height="10" rx="5" fill="#0e1520" stroke="#243246"/>',
        f'<rect class="c-flow" x="544" y="61" width="254" height="4" rx="2" fill="{CORE}" opacity=".45"/>',
        # floor
        '<polygon points="0,560 1600,560 1600,740 0,740" fill="url(#c-floor)"/>',
        '<line x1="0" y1="560" x2="1600" y2="560" stroke="#243246" stroke-width="2"/>',
        "".join(f'<line x1="{800 + (x - 800) * 0.55}" y1="560" x2="{x}" y2="740" stroke="#0f151e" stroke-width="1.5"/>' for x in range(-400, 2001, 200)),
        # the core's light on the floor
        f'<ellipse class="c-pool" cx="{CORE_X}" cy="700" rx="200" ry="26" fill="{CORE}" opacity=".12"/>',
    ]
    for i in range(46):
        x = 150 + i * 28
        if 160 < x < 780 or x > 800:
            continue
        out.append(f'<rect x="{x}" y="{f(546 + rnd.choice([0, 0, 1]))}" width="{f(rnd.uniform(8, 18))}" height="3" rx="1.5" fill="{rnd.choice([CORE, CORE, PHOS, GOLD])}" opacity="{f(rnd.uniform(.3, .75))}"/>')
    return "\n".join(out)


# ---------- the turbolift door ----------
def door():
    x0, x1, top = 22, 132, 150
    mid = (x0 + x1) / 2
    return "\n".join([
        f'<rect x="{x0 - 8}" y="{top - 10}" width="{x1 - x0 + 16}" height="{560 - top + 10}" rx="8" fill="#0d131c" stroke="#243246" stroke-width="2"/>',
        f'<rect x="{x0}" y="{top}" width="{x1 - x0}" height="{560 - top}" rx="4" fill="url(#c-door)"/>',
        f'<line x1="{mid}" y1="{top}" x2="{mid}" y2="560" stroke="#05080d" stroke-width="3"/>',
        f'<rect x="{x0 + 10}" y="{top + 16}" width="{x1 - x0 - 20}" height="6" rx="3" fill="{CORE}" opacity=".7"/>',
        label(mid, top - 18, "TURBOLIFT"),
        f'<rect class="c-lamp" x="{x1 + 2}" y="330" width="6" height="30" rx="3" fill="{LOCAL}"/>',
    ])


# ---------- the memory banks: Hindsight, behind a sealed grille ----------
def memory():
    x, y, w, h = 162, 110, 170, 450
    cx = x + w / 2
    out = [
        f'<ellipse cx="{cx}" cy="566" rx="100" ry="10" fill="url(#c-shadow)"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="url(#c-metal)" stroke="#33445c" stroke-width="2"/>',
        label(cx, y - 12, "MEMORY BANKS"),
        f'<rect x="{x + 12}" y="{y + 14}" width="{w - 24}" height="{h - 90}" rx="8" fill="#060a10" stroke="{CORE}" stroke-opacity=".35"/>',
    ]
    # rows of memory crystals, softly lit behind the grille
    for row in range(8):
        for col in range(4):
            mx, my = x + 24 + col * 34, y + 28 + row * 42
            out.append(f'<rect class="c-mem" x="{mx}" y="{my}" width="24" height="30" rx="4" fill="{CORE}" opacity="{f(rnd.uniform(.08, .22))}" style="animation-delay:{f(rnd.uniform(0, 4))}s"/>')
    # the grille over them
    for gx in range(x + 18, x + w - 12, 12):
        out.append(f'<line x1="{gx}" y1="{y + 16}" x2="{gx}" y2="{y + h - 78}" stroke="#1a2534" stroke-width="3"/>')
    # the seal: a lock plate and its lamp
    ly = y + h - 58
    out += [
        f'<rect x="{x + 22}" y="{ly}" width="{w - 44}" height="44" rx="8" fill="#0d131c" stroke="#33445c"/>',
        f'<path d="M{cx - 9} {ly + 20} v-6 a9 9 0 0 1 18 0 v6" fill="none" stroke="{GOLD}" stroke-width="3"/>',
        f'<rect x="{cx - 13}" y="{ly + 19}" width="26" height="18" rx="3" fill="{GOLD}" opacity=".85"/>',
        f'<circle class="c-lamp" cx="{x + w - 36}" cy="{ly + 22}" r="5" fill="{GOLD}"/>',
        label(cx, ly - 8, "SEALED", 8.5, .8),
    ]
    return "\n".join(out)


# ---------- the computer core: rings of light from the floor to the ceiling ----------
def core():
    cx, r = CORE_X, 74
    out = [
        f'<ellipse cx="{cx}" cy="700" rx="{r + 60}" ry="22" fill="#0d131c" stroke="#243246" stroke-width="2"/>',
        f'<ellipse cx="{cx}" cy="40" rx="{r + 40}" ry="12" fill="#0d131c" stroke="#243246" stroke-width="2"/>',
        f'<rect x="{cx - r}" y="40" width="{2 * r}" height="660" fill="url(#c-glass)"/>',
        f'<rect class="c-shaft" x="{cx - 12}" y="40" width="24" height="660" fill="url(#c-beam)"/>',
        f'<line x1="{cx - r}" y1="40" x2="{cx - r}" y2="700" stroke="#33445c" stroke-width="2"/>',
        f'<line x1="{cx + r}" y1="40" x2="{cx + r}" y2="700" stroke="#33445c" stroke-width="2"/>',
    ]
    # the rings, pulsing up the column one after another
    for i in range(14):
        ry = 82 + i * 44
        out.append(f'<ellipse class="c-ring" cx="{cx}" cy="{ry}" rx="{r - 2}" ry="9" fill="none" stroke="{CORE}" stroke-width="3" style="animation-delay:{f((13 - i) * .18)}s"/>')
    # brackets holding the column
    for by in (150, 420, 640):
        out.append(f'<rect x="{cx - r - 10}" y="{by}" width="{2 * r + 20}" height="10" rx="4" fill="url(#c-metal)" stroke="#33445c"/>')
    out.append(label(cx, 28, "COMPUTER CORE"))
    return "\n".join(out)


# ---------- the records racks: every order on file ----------
def records():
    x, y, w, h = 594, 128, 176, 432
    out = [
        f'<ellipse cx="{x + w / 2}" cy="566" rx="104" ry="10" fill="url(#c-shadow)"/>',
        label(x + w / 2, y - 12, "RECORDS"),
    ]
    for k in range(2):
        rx = x + k * 92
        out.append(f'<rect x="{rx}" y="{y}" width="84" height="{h}" rx="8" fill="url(#c-metal)" stroke="#33445c" stroke-width="2"/>')
        for j in range(16):
            sy = y + 12 + j * 26
            out.append(f'<rect x="{rx + 8}" y="{sy}" width="68" height="20" rx="3" fill="#0a1018" stroke="#1a2534"/>')
            for d in range(4):
                if rnd.random() > .25:
                    c = rnd.choice([PHOS, PHOS, CORE, GOLD])
                    out.append(f'<rect class="c-blink" x="{rx + 13 + d * 15}" y="{sy + 8}" width="8" height="4" rx="1.5" fill="{c}" style="animation-delay:{f(rnd.uniform(0, 2.4))}s"/>')
    return "\n".join(out)


# ---------- the core terminal: the screen, and its desk ----------
def terminal():
    x, y, w, h = SCREEN
    out = [
        f'<rect x="{x - 14}" y="{y - 14}" width="{w + 28}" height="{h + 28}" rx="16" fill="#0d131c" stroke="#243246" stroke-width="2"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#03060a"/>',
        f'<rect x="{x - 14}" y="{y + h + 14}" width="{w + 28}" height="5" rx="2.5" fill="{PHOS}" opacity=".3"/>',
    ]
    # the desk, with its keyboard
    dx, dy, dw = 870, 596, 330
    out += [
        f'<ellipse cx="{dx + dw / 2}" cy="728" rx="{dw / 2 + 20}" ry="12" fill="url(#c-shadow)"/>',
        f'<path d="M{dx - 8} {dy - 10} H{dx + dw + 8} L{dx + dw - 10} 722 H{dx + 10} Z" fill="url(#c-metal)" stroke="#33445c" stroke-width="2"/>',
        f'<rect x="{dx}" y="{dy}" width="{dw}" height="70" rx="8" fill="#060a10" stroke="{PHOS}" stroke-opacity=".35"/>',
    ]
    for row in range(4):
        for k in range(15):
            out.append(f'<rect x="{dx + 14 + k * 20 + row * 4}" y="{dy + 10 + row * 14}" width="16" height="10" rx="2" fill="#132030" stroke="#1f3044"/>')
    out.append(f'<rect class="c-lamp" x="{dx + dw - 40}" y="{dy + 74}" width="24" height="4" rx="2" fill="{PHOS}"/>')
    out.append(label(dx + dw / 2, dy + 100, "CORE TERMINAL", 10, .85))
    return "\n".join(out)


# ---------- the minutes reader: the briefing minutes on a stand ----------
def minutes():
    x, y, w = 1234, 572, 132
    cx = x + w / 2
    out = [
        f'<ellipse cx="{cx}" cy="728" rx="80" ry="10" fill="url(#c-shadow)"/>',
        f'<path d="M{cx - 14} {y + 64} H{cx + 14} L{cx + 22} 724 H{cx - 22} Z" fill="url(#c-metal)" stroke="#33445c" stroke-width="2"/>',
        f'<path d="M{x} {y + 14} L{x + w} {y} L{x + w - 6} {y + 62} L{x + 6} {y + 70} Z" fill="url(#c-metal)" stroke="#33445c" stroke-width="2"/>',
        f'<path d="M{x + 12} {y + 20} L{x + w - 12} {y + 8} L{x + w - 16} {y + 54} L{x + 16} {y + 61} Z" fill="#060a10" stroke="{CORE}" stroke-opacity=".5"/>',
    ]
    for i in range(5):
        lw = rnd.randint(48, 92)
        out.append(f'<rect x="{x + 24}" y="{f(y + 22 + i * 7.5 - i * .9)}" width="{lw}" height="3" rx="1.5" fill="{CORE}" opacity=".6"/>')
    out.append(label(cx, y - 10, "MINUTES"))
    return "\n".join(out)


# ---------- the dilithium chamber: glows while a burn is on ----------
def chamber():
    x, y, w, h = 1420, 548, 150, 176
    cx = x + w / 2
    cy = y + 92
    out = [
        f'<ellipse cx="{cx}" cy="{y + h + 2}" rx="96" ry="10" fill="url(#c-shadow)"/>',
        f'<rect x="{x}" y="{y + h - 26}" width="{w}" height="26" rx="6" fill="url(#c-metal)" stroke="#33445c" stroke-width="2"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="22" rx="6" fill="url(#c-metal)" stroke="#33445c" stroke-width="2"/>',
        f'<rect x="{x + 16}" y="{y + 22}" width="{w - 32}" height="{h - 48}" fill="url(#c-glass)" stroke="#33445c"/>',
        f'<ellipse class="c-burn" cx="{cx}" cy="{cy}" rx="46" ry="56" fill="{DIL}" opacity=".12"/>',
        f'<path class="c-burn c-crystal" d="M{cx} {cy - 44} L{cx + 20} {cy - 6} L{cx + 10} {cy + 40} L{cx - 10} {cy + 40} L{cx - 20} {cy - 6} Z" fill="{DIL}" opacity=".55" stroke="{DIL}"/>',
        f'<path d="M{cx} {cy - 44} L{cx + 4} {cy + 40} M{cx - 20} {cy - 6} L{cx + 20} {cy - 6}" stroke="#fff" stroke-opacity=".25"/>',
        label(cx, y - 10, "DILITHIUM"),
    ]
    return "\n".join(out)


# ---------- the records board table (the page lays a count per order state on it) ----------
def table():
    x, y, w, h = TABLE
    return "\n".join([
        f'<ellipse cx="{x + w / 2}" cy="730" rx="{w / 2 + 30}" ry="12" fill="url(#c-shadow)"/>',
        f'<path d="M{x - 20} {y - 12} H{x + w + 20} L{x + w + 6} 724 H{x - 6} Z" fill="url(#c-metal)" stroke="#33445c" stroke-width="2"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="#060a10" stroke="{CORE}" stroke-opacity=".45"/>',
        f'<rect x="{x - 20}" y="{y - 16}" width="{w + 40}" height="6" rx="3" fill="{CORE}" opacity=".45"/>',
        label(x + w / 2, y + h + 22, "RECORDS BOARD · EVERY ORDER BY STATE", 10, .85),
    ])


# ---------- highlights for the things you can pick (lib/computer.ts SPOTS) ----------
def highlights():
    glow = 'fill="none" stroke="#d8ecff" stroke-width="3" filter="url(#c-blur)"'
    return "\n".join([
        f'<rect id="c-hl-bridge" class="c-hl" x="14" y="140" width="126" height="424" rx="10" {glow}/>',
        f'<rect id="c-hl-memory" class="c-hl" x="154" y="102" width="186" height="466" rx="14" {glow}/>',
        f'<rect id="c-hl-core" class="c-hl" x="{CORE_X - 92}" y="44" width="184" height="660" rx="16" {glow}/>',
        f'<rect id="c-hl-records" class="c-hl" x="586" y="120" width="192" height="448" rx="12" {glow}/>',
        f'<path id="c-hl-desk" class="c-hl" d="M854 580 H1216 L1198 726 H872 Z" {glow}/>',
        f'<rect id="c-hl-minutes" class="c-hl" x="1226" y="560" width="148" height="168" rx="12" {glow}/>',
        f'<rect id="c-hl-burn" class="c-hl" x="1412" y="540" width="166" height="190" rx="12" {glow}/>',
    ])


DEFS = f"""<defs>
<filter id="c-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
<linearGradient id="c-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c121b"/><stop offset=".7" stop-color="#090e15"/><stop offset="1" stop-color="#06090e"/></linearGradient>
<linearGradient id="c-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e141d"/><stop offset="1" stop-color="#04070b"/></linearGradient>
<linearGradient id="c-downlight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8ecff" stop-opacity=".07"/><stop offset="1" stop-color="#d8ecff" stop-opacity="0"/></linearGradient>
<linearGradient id="c-door" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#121a25"/><stop offset=".5" stop-color="#1e2a3a"/><stop offset="1" stop-color="#121a25"/></linearGradient>
<linearGradient id="c-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#101721"/><stop offset=".5" stop-color="#1c2633"/><stop offset="1" stop-color="#0d131c"/></linearGradient>
<linearGradient id="c-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0b1622" stop-opacity=".95"/><stop offset=".5" stop-color="#11263a" stop-opacity=".8"/><stop offset="1" stop-color="#0b1622" stop-opacity=".95"/></linearGradient>
<linearGradient id="c-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{CORE}" stop-opacity="0"/><stop offset=".5" stop-color="{CORE}" stop-opacity=".55"/><stop offset="1" stop-color="{CORE}" stop-opacity="0"/></linearGradient>
<radialGradient id="c-shadow"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="c-vignette" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
</defs>"""


def build():
    body = "\n".join([
        DEFS,
        "<!-- the room -->", room(),
        "<!-- the turbolift door -->", door(),
        "<!-- the memory banks -->", memory(),
        "<!-- the records racks -->", records(),
        "<!-- the computer core -->", core(),
        "<!-- the core terminal -->", terminal(),
        "<!-- the minutes reader -->", minutes(),
        "<!-- the dilithium chamber -->", chamber(),
        "<!-- the records board -->", table(),
        "<!-- highlights -->", highlights(),
        f'<rect width="{W}" height="{H}" fill="url(#c-vignette)" pointer-events="none"/>',
    ])
    return (f'<svg class="computer-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" aria-hidden="true">\n'
            f"{body}\n</svg>\n")


if __name__ == "__main__":
    svg = build()
    OUT.write_text(svg)
    print(OUT, len(svg), "bytes")
