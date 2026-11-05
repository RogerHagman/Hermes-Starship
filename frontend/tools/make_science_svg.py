"""Build frontend/src/assets/science.svg: the Science lab (Deck 3), seen from the door.

    python3 frontend/tools/make_science_svg.py

Left to right: the turbolift door (back to the Bridge), the model shelf, the eval chamber
(the page lays the live scores in its glass) over the run console, the serving rack, the
work screen hanging over the study bench, and the dataset archive.

The page lays the scores, the work screen and its buttons over this picture by position,
so if you move something here, move it in lib/science.ts too (CHAMBER, SCREEN, SPOTS).
Everything is drawn in a 1600 x 740 box. The panel lights come from a fixed seed.
"""
import random
from pathlib import Path

W, H = 1600, 740
OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "science.svg"
rnd = random.Random(4077)

LAB, TEAL, GOLD, RED, BLUE = "#4fc8c0", "#7fe0d0", "#e8c37a", "#f08a7a", "#7fb8f0"
LOCAL, CODEX = "#3fc1a5", "#f0a948"
CHAMBER = (360, 110, 220, 360)  # the glass where the page draws the scores (lib/science.ts)
SCREEN = (880, 46, 560, 458)    # lib/science.ts


def f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


# ---------- the room ----------
def room():
    out = [
        f'<rect width="{W}" height="{H}" fill="url(#l-wall)"/>',
        '<rect width="1600" height="34" fill="#040b0c"/>',
        '<rect x="160" y="30" width="1280" height="4" rx="2" fill="#c8fff6" opacity=".2"/>',
        '<rect x="160" y="34" width="1280" height="60" fill="url(#l-downlight)"/>',
        "".join(f'<line x1="{x}" y1="34" x2="{x}" y2="560" stroke="#132427" stroke-width="2"/>' for x in range(140, 1600, 132)),
        '<rect x="0" y="236" width="1600" height="3" fill="#18302f"/>',
        '<polygon points="0,560 1600,560 1600,740 0,740" fill="url(#l-floor)"/>',
        '<line x1="0" y1="560" x2="1600" y2="560" stroke="#22403e" stroke-width="2"/>',
        "".join(f'<line x1="{800 + (x - 800) * 0.55}" y1="560" x2="{x}" y2="740" stroke="#0f1f20" stroke-width="1.5"/>' for x in range(-400, 2001, 200)),
    ]
    for i in range(46):
        x = 150 + i * 28
        if 330 < x < 610 or 860 < x < 1460 or x > 1440:
            continue
        c = rnd.choice([LAB, LAB, TEAL, GOLD, BLUE])
        out.append(f'<rect x="{x}" y="{f(546 + rnd.choice([0, 0, 1]))}" width="{f(rnd.uniform(8, 18))}" height="3" rx="1.5" fill="{c}" opacity="{f(rnd.uniform(.3, .75))}"/>')
    return "\n".join(out)


# ---------- the turbolift door ----------
def door():
    x0, x1, top = 22, 132, 150
    mid = (x0 + x1) / 2
    return "\n".join([
        f'<rect x="{x0 - 8}" y="{top - 10}" width="{x1 - x0 + 16}" height="{560 - top + 10}" rx="8" fill="#0c191a" stroke="#22403e" stroke-width="2"/>',
        f'<rect x="{x0}" y="{top}" width="{x1 - x0}" height="{560 - top}" rx="4" fill="url(#l-door)"/>',
        f'<line x1="{mid}" y1="{top}" x2="{mid}" y2="560" stroke="#040b0c" stroke-width="3"/>',
        f'<rect x="{x0 + 10}" y="{top + 16}" width="{x1 - x0 - 20}" height="6" rx="3" fill="{LAB}" opacity=".7"/>',
        f'<text x="{mid}" y="{top - 18}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{LAB}">TURBOLIFT</text>',
        f'<rect class="l-lamp" x="{x1 + 2}" y="330" width="6" height="30" rx="3" fill="{LOCAL}"/>',
    ])


# ---------- the model shelf: a cartridge per model, its size in its height ----------
def shelf():
    x, y, w, h = 164, 130, 152, 430
    out = [
        f'<ellipse cx="{x + w / 2}" cy="566" rx="{w / 2 + 14}" ry="9" fill="url(#l-shadow)"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="url(#l-metal)" stroke="#2c4c4a" stroke-width="2"/>',
        f'<text x="{x + w / 2}" y="{y - 14}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{LAB}">MODEL SHELF</text>',
    ]
    for j in range(4):
        sy = y + 22 + j * 100
        out.append(f'<rect x="{x + 14}" y="{sy}" width="{w - 28}" height="84" rx="8" fill="#061011" stroke="{LAB}" stroke-opacity=".35"/>')
        tall = [56, 72, 30, 44][j]
        c = [LOCAL, LAB, BLUE, GOLD][j]
        out.append(f'<rect x="{x + 30}" y="{sy + 76 - tall}" width="34" height="{tall}" rx="4" fill="{c}" opacity=".22" stroke="{c}" stroke-opacity=".8"/>')
        out.append(f'<rect class="l-lamp" x="{x + 36}" y="{sy + 70 - tall + 8}" width="22" height="4" rx="2" fill="{c}"/>')
        for k in range(3):
            out.append(f'<rect x="{x + 76}" y="{sy + 18 + k * 18}" width="{rnd.randint(28, 50)}" height="5" rx="2.5" fill="{c}" opacity=".45"/>')
    return "\n".join(out)


# ---------- the eval chamber (the page draws the scores in the glass) ----------
def chamber():
    x, y, w, h = CHAMBER
    cx = x + w / 2
    out = [
        f'<ellipse cx="{cx}" cy="{y + h + 102}" rx="{w / 2 + 40}" ry="14" fill="url(#l-shadow)"/>',
        # the cap and the base
        f'<rect x="{x - 22}" y="{y - 44}" width="{w + 44}" height="40" rx="12" fill="url(#l-metal)" stroke="#2c4c4a" stroke-width="2"/>',
        f'<rect x="{x - 30}" y="{y + h + 4}" width="{w + 60}" height="56" rx="12" fill="url(#l-metal)" stroke="#2c4c4a" stroke-width="2"/>',
        f'<rect x="{x - 10}" y="{y + h + 22}" width="{w + 20}" height="6" rx="3" fill="{LAB}" opacity=".6"/>',
        # the glass
        f'<rect x="{x}" y="{y - 4}" width="{w}" height="{h + 8}" rx="16" fill="url(#l-glass)" stroke="{TEAL}" stroke-opacity=".45" stroke-width="2"/>',
        f'<rect x="{x + 12}" y="{y + 6}" width="10" height="{h - 12}" rx="5" fill="#ffffff" opacity=".06"/>',
        f'<ellipse cx="{cx}" cy="{y + h}" rx="{w / 2 - 20}" ry="10" fill="{LAB}" opacity=".18"/>',
        f'<text x="{cx}" y="{y - 56}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2.4" fill="{LAB}">EVAL CHAMBER</text>',
    ]
    for k in range(5):
        out.append(f'<circle cx="{x - 6 + k * (w + 12) / 4}" cy="{y - 24}" r="3" fill="#4e6e6c"/>')
    return "\n".join(out)


# ---------- the run console in front of the chamber ----------
def run_console():
    x0, x1, y = 330, 610, 600
    out = [
        f'<ellipse cx="{(x0 + x1) / 2}" cy="728" rx="170" ry="12" fill="url(#l-shadow)"/>',
        f'<path d="M{x0} {y + 20} H{x1} L{x1 - 14} {y + 118} H{x0 + 14} Z" fill="url(#l-metal)" stroke="#2c4c4a" stroke-width="2"/>',
        f'<rect x="{x0 + 20}" y="{y + 30}" width="{x1 - x0 - 40}" height="54" rx="6" fill="#061011" stroke="{LAB}" stroke-opacity=".5"/>',
    ]
    for i in range(5):
        out.append(f'<rect x="{x0 + 32}" y="{y + 38 + i * 9}" width="{rnd.randint(80, 200)}" height="4" rx="2" fill="{TEAL}" opacity="{f(.75 - i * .12)}"/>')
    out.append(f'<rect class="l-cursor" x="{x0 + 32}" y="{y + 38 + 5 * 9}" width="10" height="4" rx="1" fill="{TEAL}"/>')
    out.append(f'<text x="{(x0 + x1) / 2}" y="{y + 106}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{LAB}" opacity=".85">RUN CONSOLE · EVERY RUN LOGGED</text>')
    return "\n".join(out)


# ---------- the serving rack ----------
def rack():
    x, y, w, h = 650, 150, 170, 570
    out = [
        f'<ellipse cx="{x + w / 2}" cy="{y + h + 4}" rx="110" ry="12" fill="url(#l-shadow)"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="url(#l-metal)" stroke="#2c4c4a" stroke-width="2"/>',
        f'<text x="{x + w / 2}" y="{y - 14}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{LAB}">SERVING</text>',
    ]
    for j in range(9):
        sy = y + 20 + j * 42
        out.append(f'<rect x="{x + 14}" y="{sy}" width="{w - 28}" height="34" rx="5" fill="#081415" stroke="#1f3a39"/>')
        for k in range(6):
            c = rnd.choice([LOCAL, LOCAL, TEAL, GOLD]) if j < 6 else "#2c4c4a"
            out.append(f'<circle class="{"l-blink" if j < 6 and k % 3 == 0 else ""}" cx="{x + 30 + k * 12}" cy="{sy + 17}" r="3" fill="{c}" opacity="{".9" if j < 6 else ".6"}"/>')
        out.append(f'<rect x="{x + 108}" y="{sy + 12}" width="34" height="10" rx="3" fill="#0d1f20"/>')
    out.append(f'<rect x="{x + 20}" y="{y + 410}" width="{w - 40}" height="130" rx="8" fill="#061011" stroke="{LAB}" stroke-opacity=".4"/>')
    # a GPU card with fans
    for k in range(2):
        out.append(f'<circle cx="{x + 56 + k * 58}" cy="{y + 475}" r="24" fill="#0d1f20" stroke="{LAB}" stroke-opacity=".5"/>')
        out.append(f'<path class="l-fan" d="M{x + 56 + k * 58} {y + 455} v40 M{x + 36 + k * 58} {y + 475} h40" stroke="{LAB}" stroke-opacity=".45" stroke-width="3"/>')
    out.append(f'<text x="{x + w / 2}" y="{y + 528}" text-anchor="middle" font-family="monospace" font-size="9" letter-spacing="1.6" fill="{LAB}" opacity=".85">LOCAL GPU</text>')
    return "\n".join(out)


# ---------- the work screen ----------
def work_screen():
    x, y, w, h = SCREEN
    return "\n".join([
        f'<rect x="{x - 14}" y="{y - 14}" width="{w + 28}" height="{h + 28}" rx="16" fill="#0c191a" stroke="#22403e" stroke-width="2"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#040b0c"/>',
        f'<rect x="{x - 14}" y="{y + h + 14}" width="{w + 28}" height="5" rx="2.5" fill="{LAB}" opacity=".35"/>',
    ])


# ---------- the study bench: a desk with books, a lamp and a PADD ----------
def study():
    x, y, w = 966, 600, 408
    out = [
        f'<ellipse cx="{x + w / 2}" cy="728" rx="{w / 2 + 20}" ry="12" fill="url(#l-shadow)"/>',
        # the desk
        f'<path d="M{x} {y} H{x + w} L{x + w - 14} {y + 22} H{x + 14} Z" fill="#2a2219" stroke="#4a3a28" stroke-width="2"/>',
        f'<rect x="{x + 24}" y="{y + 22}" width="14" height="96" fill="#1f1912"/>',
        f'<rect x="{x + w - 38}" y="{y + 22}" width="14" height="96" fill="#1f1912"/>',
        f'<rect x="{x + 40}" y="{y + 24}" width="140" height="44" rx="4" fill="#241d15" stroke="#3a2e20"/>',
        f'<rect x="{x + 100}" y="{y + 42}" width="20" height="4" rx="2" fill="{GOLD}" opacity=".6"/>',
    ]
    # books, standing
    bx = x + 30
    for i, (bw, bh, c) in enumerate([(14, 54, "#3b6e6a"), (18, 62, "#6a4a2c"), (12, 48, "#2f4f7a"), (16, 58, "#7a3e3a"), (14, 52, GOLD)]):
        out.append(f'<rect x="{bx}" y="{y - bh}" width="{bw}" height="{bh}" rx="2" fill="{c}" opacity="{".55" if c == GOLD else "1"}"/>')
        out.append(f'<rect x="{bx + 2}" y="{y - bh + 8}" width="{bw - 4}" height="3" fill="#000" opacity=".25"/>')
        bx += bw + 3
    # the lamp
    lx = x + w - 70
    out += [
        f'<ellipse cx="{lx - 40}" cy="{y - 2}" rx="70" ry="10" fill="{GOLD}" opacity=".14"/>',
        f'<rect x="{lx - 14}" y="{y - 6}" width="28" height="6" rx="3" fill="#3a2e20"/>',
        f'<path d="M{lx} {y - 6} L{lx - 10} {y - 70} L{lx - 52} {y - 84}" fill="none" stroke="#5a4630" stroke-width="4" stroke-linecap="round"/>',
        f'<path d="M{lx - 74} {y - 70} L{lx - 44} {y - 98} L{lx - 30} {y - 76} Z" fill="#5a4630"/>',
        f'<ellipse class="l-lamp" cx="{lx - 52}" cy="{y - 72}" rx="14" ry="5" fill="{GOLD}" opacity=".9"/>',
    ]
    # the open PADD with a lesson on it
    px, py = x + 170, y - 34
    out += [
        f'<g transform="rotate(-6 {px + 60} {py + 20})">'
        f'<rect x="{px}" y="{py}" width="120" height="34" rx="5" fill="#1a2426" stroke="#3a5a58"/>'
        f'<rect x="{px + 6}" y="{py + 5}" width="108" height="24" rx="2" fill="#061011"/>'
        + "".join(f'<rect x="{px + 12}" y="{py + 9 + k * 6}" width="{rnd.randint(40, 90)}" height="2.5" rx="1" fill="{TEAL}" opacity=".7"/>' for k in range(3))
        + '</g>',
        f'<text x="{x + w / 2}" y="{y + 108}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{GOLD}" opacity=".9">STUDY BENCH</text>',
    ]
    return "\n".join(out)


# ---------- the dataset archive ----------
def archive():
    x, y, w, h = 1462, 150, 124, 570
    out = [
        f'<ellipse cx="{x + w / 2}" cy="{y + h + 4}" rx="90" ry="12" fill="url(#l-shadow)"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="url(#l-metal)" stroke="#2c4c4a" stroke-width="2"/>',
        f'<text x="{x + w / 2}" y="{y + 40}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{LAB}">DATASETS</text>',
    ]
    for j in range(8):
        dy = y + 60 + j * 60
        c = [LAB, LAB, BLUE, GOLD, "#2c4c4a", "#2c4c4a", "#2c4c4a", "#2c4c4a"][j]
        out.append(f'<rect x="{x + 14}" y="{dy}" width="{w - 28}" height="50" rx="6" fill="#0b1718" stroke="#22403e"/>')
        out.append(f'<rect x="{x + w / 2 - 18}" y="{dy + 22}" width="36" height="6" rx="3" fill="#22403e"/>')
        out.append(f'<rect x="{x + 22}" y="{dy + 8}" width="20" height="6" rx="2" fill="{c}" opacity=".8"/>')
    return "\n".join(out)


# ---------- highlights for the things you can pick (lib/science.ts SPOTS) ----------
def highlights():
    glow = 'fill="none" stroke="#c8fff6" stroke-width="3" filter="url(#l-blur)"'
    x, y, w, h = CHAMBER
    return "\n".join([
        f'<rect id="l-hl-bridge" class="l-hl" x="14" y="140" width="126" height="424" rx="10" {glow}/>',
        f'<rect id="l-hl-models" class="l-hl" x="158" y="124" width="164" height="442" rx="14" {glow}/>',
        f'<rect id="l-hl-evals" class="l-hl" x="{x - 34}" y="{y - 50}" width="{w + 68}" height="{h + 116}" rx="18" {glow}/>',
        f'<path id="l-hl-runs" class="l-hl" d="M326 616 H614 L598 722 H342 Z" {glow}/>',
        f'<rect id="l-hl-serving" class="l-hl" x="644" y="144" width="182" height="582" rx="14" {glow}/>',
        f'<rect id="l-hl-study" class="l-hl" x="958" y="500" width="424" height="226" rx="14" {glow}/>',
        f'<rect id="l-hl-datasets" class="l-hl" x="1458" y="146" width="132" height="578" rx="14" {glow}/>',
    ])


DEFS = f"""<defs>
<filter id="l-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
<linearGradient id="l-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1a1b"/><stop offset=".7" stop-color="#081415"/><stop offset="1" stop-color="#050d0e"/></linearGradient>
<linearGradient id="l-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1c1d"/><stop offset="1" stop-color="#040909"/></linearGradient>
<linearGradient id="l-downlight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8fff6" stop-opacity=".08"/><stop offset="1" stop-color="#c8fff6" stop-opacity="0"/></linearGradient>
<linearGradient id="l-door" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#11282a"/><stop offset=".5" stop-color="#1b3a3b"/><stop offset="1" stop-color="#11282a"/></linearGradient>
<linearGradient id="l-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0f2122"/><stop offset=".5" stop-color="#1a3233"/><stop offset="1" stop-color="#0d1c1d"/></linearGradient>
<linearGradient id="l-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d2e2e" stop-opacity=".9"/><stop offset=".5" stop-color="#0a2324" stop-opacity=".75"/><stop offset="1" stop-color="#0d2e2e" stop-opacity=".9"/></linearGradient>
<radialGradient id="l-shadow"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="l-vignette" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
</defs>"""


def build():
    body = "\n".join([
        DEFS,
        "<!-- the room -->", room(),
        "<!-- the turbolift door -->", door(),
        "<!-- the model shelf -->", shelf(),
        "<!-- the eval chamber -->", chamber(),
        "<!-- the run console -->", run_console(),
        "<!-- the serving rack -->", rack(),
        "<!-- the work screen -->", work_screen(),
        "<!-- the study bench -->", study(),
        "<!-- the dataset archive -->", archive(),
        "<!-- highlights -->", highlights(),
        f'<rect width="{W}" height="{H}" fill="url(#l-vignette)" pointer-events="none"/>',
    ])
    return (f'<svg class="science-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" aria-hidden="true">\n'
            f"{body}\n</svg>\n")


if __name__ == "__main__":
    svg = build()
    OUT.write_text(svg)
    print(OUT, len(svg), "bytes")
