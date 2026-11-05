"""Build frontend/src/assets/holodeck.svg: the Holodeck (Deck 4), seen from just inside.

    python3 frontend/tools/make_holodeck_svg.py

The classic room: black walls ruled with a gold grid, in perspective. Left to right:
the pattern buffer (the ship's assets, one lit cell each), the emitter on the floor with
the ship's hologram above it, the work screen hanging in the air, the "new section"
console and the safety panel under it, and the arch (the exit, with its program panel).

The page lays the hologram, the work screen and its buttons over this picture by position,
so if you move something here, move it in lib/holodeck.ts too (PROJ, SCREEN, SPOTS).
Everything is drawn in a 1600 x 740 box. The buffer cells come from a fixed seed.
"""
import random
from pathlib import Path

W, H = 1600, 740
OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "holodeck.svg"
rnd = random.Random(1987)

GOLD, AMBER = "#e3b24a", "#f0a948"
LOCAL, CODEX, CLAUDE, MIXED = "#3fc1a5", "#f0a948", "#e889b6", "#8fa8e0"
HOLO = "#7fd8e8"          # hologram blue
VP = (800, 290)           # where the grid lines meet
BACK = (330, 96, 1270, 480)   # back wall: left, top, right, bottom


def f(v):
    """Short numbers keep the file small."""
    return f"{v:.1f}".rstrip("0").rstrip(".")


def line(x1, y1, x2, y2, extra=""):
    return f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}"{extra}/>'


def toward(px, py, t):
    """The point t of the way from the vanishing point out through (px, py)."""
    return VP[0] + (px - VP[0]) * t, VP[1] + (py - VP[1]) * t


# ---------- the grid ----------
DEPTHS = [1, 0.87, 0.74, 0.62, 0.51, 0.41, 0.33]   # back wall = 1, smaller is nearer


def grid():
    l, t, r, b = BACK
    cols, rows = 16, 8
    xs = [l + (r - l) * i / cols for i in range(cols + 1)]
    ys = [t + (b - t) * j / rows for j in range(rows + 1)]
    out = []
    # back wall
    out += [line(x, t, x, b) for x in xs] + [line(l, y, r, y) for y in ys]
    far = 3.2   # long enough to leave the picture
    # floor and ceiling: lines from the back wall's edge toward the viewer, and depth lines across
    for x in xs:
        out.append(line(x, b, *toward(x, b, far)))
        out.append(line(x, t, *toward(x, t, far)))
    for z in DEPTHS[1:]:
        k = 1 / z
        out.append(line(*toward(l, b, k), *toward(r, b, k)))
        out.append(line(*toward(l, t, k), *toward(r, t, k)))
    # side walls: lines out from the wall's edge, and uprights at each depth
    for y in ys:
        out.append(line(l, y, *toward(l, y, far)))
        out.append(line(r, y, *toward(r, y, far)))
    for z in DEPTHS[1:]:
        k = 1 / z
        out.append(line(*toward(l, t, k), *toward(l, b, k)))
        out.append(line(*toward(r, t, k), *toward(r, b, k)))
    # the room's corners, a little brighter
    corners = [line(l, t, *toward(l, t, far)), line(r, t, *toward(r, t, far)),
               line(l, b, *toward(l, b, far)), line(r, b, *toward(r, b, far))]
    lines = "\n".join(out)
    return "\n".join([
        '<rect width="1600" height="740" fill="#050608"/>',
        f'<rect x="{l}" y="{t}" width="{r - l}" height="{b - t}" fill="url(#h-backwall)"/>',
        f'<polygon points="{l},{b} {r},{b} {f(toward(r, b, far)[0])},{f(toward(r, b, far)[1])} {f(toward(l, b, far)[0])},{f(toward(l, b, far)[1])}" fill="url(#h-floor)"/>',
        # glow layer under the crisp lines
        f'<g class="h-grid-glow" stroke="{GOLD}" stroke-width="5" stroke-opacity=".07">{lines}</g>',
        f'<g class="h-grid" stroke="{GOLD}" stroke-width="1.1" stroke-opacity=".5">{lines}</g>',
        f'<g stroke="{GOLD}" stroke-width="2" stroke-opacity=".55">{"".join(corners)}</g>',
        # light falling on the floor from the emitter
        '<ellipse cx="500" cy="660" rx="380" ry="70" fill="url(#h-floorglow)"/>',
    ])


# ---------- the pattern buffer: the assets, one lit cell each ----------
def buffer():
    x0, y0, w, h = 26, 112, 128, 540
    out = [
        f'<rect x="{x0 - 6}" y="{y0 - 8}" width="{w + 12}" height="{h + 18}" rx="14" fill="#000" opacity=".45"/>',
        f'<rect x="{x0}" y="{y0}" width="{w}" height="{h}" rx="12" fill="url(#h-cabinet)" stroke="#2d2a24" stroke-width="2"/>',
        f'<rect x="{x0 + 10}" y="{y0 + 12}" width="{w - 20}" height="22" rx="5" fill="#120f0a" stroke="{GOLD}" stroke-opacity=".5"/>',
        f'<text x="{x0 + w / 2}" y="{y0 + 27}" text-anchor="middle" font-family="monospace" font-size="9" letter-spacing="1.6" fill="{GOLD}">PATTERN BUFFER</text>',
    ]
    cols, rows = 3, 11
    cw, ch, gap = 30, 34, 6
    left = x0 + (w - (cols * cw + (cols - 1) * gap)) / 2
    colours = [GOLD, GOLD, HOLO, LOCAL, CODEX, CLAUDE, MIXED]
    for j in range(rows):
        for i in range(cols):
            x, y = left + i * (cw + gap), y0 + 50 + j * (ch + 8)
            c = rnd.choice(colours)
            lit = rnd.random() > 0.16
            out.append(f'<rect x="{f(x)}" y="{f(y)}" width="{cw}" height="{ch}" rx="4" fill="#0c0b09" stroke="#3a352b"/>')
            if lit:
                cls = ' class="h-cell"' if rnd.random() < 0.3 else ""
                delay = f' style="animation-delay:-{f(rnd.uniform(0, 5))}s"' if cls else ""
                out.append(f'<rect{cls}{delay} x="{f(x + 4)}" y="{f(y + 5)}" width="{cw - 8}" height="{ch - 18}" rx="2" fill="{c}" opacity=".75"/>')
                out.append(f'<rect x="{f(x + 4)}" y="{f(y + ch - 9)}" width="{f(rnd.uniform(8, cw - 8))}" height="3" rx="1.5" fill="{c}" opacity=".45"/>')
    # a soft spill of light onto the floor
    out.append(f'<ellipse cx="{x0 + w / 2}" cy="{y0 + h + 22}" rx="110" ry="16" fill="url(#h-spill)"/>')
    return "\n".join(out)


# ---------- the emitter and the light it throws up to the hologram ----------
PROJ = (150, 128, 700, 337)    # the hologram's box: left, top, width, height (lib/holodeck.ts)


def emitter():
    cx, cy = 500, 690
    px, py, pw, ph = PROJ
    out = [
        # the cone of light, from the emitter up to the bottom of the hologram
        f'<polygon class="h-cone" points="{cx - 70},{cy - 6} {cx + 70},{cy - 6} {px + pw - 40},{py + ph - 8} {px + 40},{py + ph - 8}" fill="url(#h-cone)"/>',
        # the plinth
        f'<ellipse cx="{cx}" cy="{cy + 14}" rx="176" ry="30" fill="url(#h-shadow)"/>',
        f'<ellipse cx="{cx}" cy="{cy + 6}" rx="150" ry="26" fill="#16140f" stroke="#3b352a" stroke-width="2"/>',
        f'<ellipse cx="{cx}" cy="{cy}" rx="150" ry="26" fill="url(#h-plinth)" stroke="#5a5040" stroke-width="1.5"/>',
        f'<ellipse cx="{cx}" cy="{cy - 1}" rx="118" ry="19" fill="none" stroke="{GOLD}" stroke-opacity=".55" stroke-width="1.5"/>',
        f'<ellipse class="h-ring" cx="{cx}" cy="{cy - 1}" rx="96" ry="15" fill="none" stroke="{HOLO}" stroke-width="3" stroke-dasharray="10 9" stroke-opacity=".8"/>',
        f'<ellipse cx="{cx}" cy="{cy - 2}" rx="64" ry="10" fill="url(#h-lens)"/>',
    ]
    # little lights round the rim
    import math
    for k in range(20):
        a = math.pi * 2 * k / 20
        x, y = cx + 134 * math.cos(a), cy + 22.5 * math.sin(a)
        if y < cy - 4:
            continue    # the far side is hidden by the lens glow
        out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="2.2" fill="{GOLD if k % 2 else HOLO}" opacity=".85"/>')
    # the hologram's footprint on the grid
    out.append(f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="6" fill="url(#h-projglow)"/>')
    for (x, y, dx, dy) in [(px, py, 1, 1), (px + pw, py, -1, 1), (px, py + ph, 1, -1), (px + pw, py + ph, -1, -1)]:
        out.append(f'<path d="M{x} {y + 26 * dy} V{y} H{x + 26 * dx}" fill="none" stroke="{HOLO}" stroke-opacity=".6" stroke-width="2"/>')
    out.append(f'<text x="{px + 10}" y="{py - 10}" font-family="monospace" font-size="10" letter-spacing="2" fill="{HOLO}" opacity=".8">PROGRAM RUNNING · THE SHIP</text>')
    return "\n".join(out)


# ---------- the work screen: a sheet of light hanging in the room ----------
SCREEN = (880, 46, 560, 458)   # lib/holodeck.ts


def work_screen():
    x, y, w, h = SCREEN
    return "\n".join([
        f'<rect x="{x - 18}" y="{y - 18}" width="{w + 36}" height="{h + 36}" rx="22" fill="url(#h-screenglow)"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#07090c" stroke="{HOLO}" stroke-opacity=".35" stroke-width="2"/>',
        # thin beams to the ceiling, so it reads as hung by light
        line(x + 80, y, x + 60, 0, f' stroke="{HOLO}" stroke-opacity=".18" stroke-width="2"'),
        line(x + w - 80, y, x + w - 60, 0, f' stroke="{HOLO}" stroke-opacity=".18" stroke-width="2"'),
    ])


# ---------- the new-section console ----------
def new_console():
    x, y = 932, 560
    return "\n".join([
        f'<ellipse cx="{x + 88}" cy="{y + 162}" rx="110" ry="14" fill="url(#h-shadow)"/>',
        # pedestal
        f'<path d="M{x + 56} {y + 160} L{x + 66} {y + 70} H{x + 110} L{x + 120} {y + 160} Z" fill="url(#h-cabinet)" stroke="#3b352a" stroke-width="1.5"/>',
        f'<rect x="{x + 40}" y="{y + 154}" width="96" height="10" rx="3" fill="#1c1912" stroke="#3b352a"/>',
        # the slanted top
        f'<path d="M{x} {y + 70} L{x + 18} {y} H{x + 158} L{x + 176} {y + 70} Z" fill="#14120d" stroke="{GOLD}" stroke-opacity=".7" stroke-width="2"/>',
        f'<path d="M{x + 14} {y + 62} L{x + 28} {y + 9} H{x + 148} L{x + 162} {y + 62} Z" fill="url(#h-glass)"/>',
        # a blank tile with a plus: "spin up a new one"
        f'<path d="M{x + 62} {y + 20} H{x + 114} L{x + 118} {y + 52} H{x + 58} Z" fill="none" stroke="{HOLO}" stroke-width="1.6" stroke-dasharray="4 3"/>',
        f'<path d="M{x + 88} {y + 26} V{y + 46} M{x + 77} {y + 36} H{x + 99}" stroke="{HOLO}" stroke-width="2.4" stroke-linecap="round"/>',
        f'<rect class="h-lamp" x="{x + 30}" y="{y + 48}" width="14" height="5" rx="2" fill="{GOLD}"/>',
        f'<rect x="{x + 132}" y="{y + 48}" width="14" height="5" rx="2" fill="{CLAUDE}" opacity=".8"/>',
    ])


# ---------- the safety panel ----------
def safeties():
    x, y = 1170, 588
    lamps = "".join(
        f'<circle cx="{x + 40 + i * 34}" cy="{y + 38}" r="8" fill="{c}"{cls}/>'
        f'<circle cx="{x + 40 + i * 34}" cy="{y + 38}" r="13" fill="{c}" opacity=".15"/>'
        for i, (c, cls) in enumerate([(LOCAL, ' class="h-lamp"'), (LOCAL, ""), (LOCAL, ""), (GOLD, "")]))
    return "\n".join([
        f'<ellipse cx="{x + 100}" cy="{y + 134}" rx="120" ry="12" fill="url(#h-shadow)"/>',
        f'<path d="M{x} {y + 128} V{y + 20} Q{x} {y} {x + 20} {y} H{x + 180} Q{x + 200} {y} {x + 200} {y + 20} V{y + 128} Z" fill="url(#h-cabinet)" stroke="#3b352a" stroke-width="1.5"/>',
        f'<rect x="{x + 16}" y="{y + 14}" width="168" height="48" rx="8" fill="#0c0b09" stroke="#3a352b"/>',
        lamps,
        f'<text x="{x + 100}" y="{y + 84}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{LOCAL}">SAFETIES ON</text>',
        f'<rect x="{x + 30}" y="{y + 96}" width="140" height="8" rx="4" fill="#0c0b09" stroke="#3a352b"/>',
        f'<rect x="{x + 34}" y="{y + 98}" width="96" height="4" rx="2" fill="{GOLD}" opacity=".8"/>',
    ])


# ---------- the arch ----------
def arch():
    x0, x1, top, base = 1452, 1592, 128, 726
    mid = (x0 + x1) / 2
    return "\n".join([
        f'<rect x="{x0 - 10}" y="{top - 10}" width="{x1 - x0 + 20}" height="{base - top + 16}" rx="70" fill="#000" opacity=".5"/>',
        # pillars and the curve over the top
        f'<path d="M{x0} {base} V{top + 70} A70 70 0 0 1 {x1} {top + 70} V{base} H{x1 - 18} V{top + 72} A52 52 0 0 0 {x0 + 18} {top + 72} V{base} Z" fill="url(#h-arch)" stroke="{GOLD}" stroke-opacity=".75" stroke-width="2"/>',
        # the doors, shut
        f'<path d="M{x0 + 18} {base} V{top + 72} A52 52 0 0 1 {x1 - 18} {top + 72} V{base} Z" fill="#0d0c0a"/>',
        line(mid, top + 22, mid, base, f' stroke="#3b352a" stroke-width="2"'),
        f'<path d="M{x0 + 18} {top + 72} A52 52 0 0 1 {x1 - 18} {top + 72}" fill="none" stroke="{AMBER}" stroke-opacity=".5" stroke-width="3"/>',
        f'<text x="{mid}" y="{top + 64}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{GOLD}">EXIT</text>',
        # the program panel on the doors
        f'<rect x="{x0 + 26}" y="352" width="{x1 - x0 - 52}" height="156" rx="8" fill="#14120d" stroke="{GOLD}" stroke-opacity=".7" stroke-width="1.5"/>',
        f'<rect x="{x0 + 34}" y="362" width="{x1 - x0 - 68}" height="12" rx="6" fill="{AMBER}"/>',
        "".join(f'<rect x="{x0 + 34}" y="{384 + i * 18}" width="{f(rnd.uniform(30, x1 - x0 - 68))}" height="9" rx="4.5" fill="{c}" opacity=".85"/>'
                for i, c in enumerate([GOLD, HOLO, CLAUDE, GOLD, MIXED, HOLO])),
        f'<rect class="h-lamp" x="{x0 + 34}" y="494" width="20" height="6" rx="3" fill="{LOCAL}"/>',
    ])


# ---------- highlights for the things you can pick (lib/holodeck.ts SPOTS) ----------
def highlights():
    glow = f'fill="none" stroke="#ffe3a0" stroke-width="3" filter="url(#h-blur)"'
    return "\n".join([
        f'<rect id="h-hl-assets" class="h-hl" x="22" y="108" width="136" height="548" rx="14" {glow}/>',
        f'<ellipse id="h-hl-ship" class="h-hl" cx="500" cy="690" rx="156" ry="30" {glow}/>',
        f'<path id="h-hl-new" class="h-hl" d="M932 630 L950 560 H1090 L1108 630 Z" {glow}/>',
        f'<rect id="h-hl-safety" class="h-hl" x="1166" y="584" width="208" height="136" rx="20" {glow}/>',
        f'<rect id="h-hl-programs" class="h-hl" x="1474" y="348" width="96" height="164" rx="10" {glow}/>',
        f'<path id="h-hl-bridge" class="h-hl" d="M1452 726 V198 A70 70 0 0 1 1592 198 V726" {glow}/>',
    ])


DEFS = f"""<defs>
<filter id="h-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
<radialGradient id="h-backwall" cx=".5" cy=".6" r=".8"><stop offset="0" stop-color="#16130c"/><stop offset="1" stop-color="#060607"/></radialGradient>
<linearGradient id="h-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0907"/><stop offset="1" stop-color="#030304"/></linearGradient>
<radialGradient id="h-floorglow"><stop offset="0" stop-color="{HOLO}" stop-opacity=".16"/><stop offset=".6" stop-color="{HOLO}" stop-opacity=".04"/><stop offset="1" stop-color="{HOLO}" stop-opacity="0"/></radialGradient>
<radialGradient id="h-spill"><stop offset="0" stop-color="{GOLD}" stop-opacity=".18"/><stop offset="1" stop-color="{GOLD}" stop-opacity="0"/></radialGradient>
<linearGradient id="h-cabinet" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#14120e"/><stop offset=".5" stop-color="#26221a"/><stop offset="1" stop-color="#12100c"/></linearGradient>
<linearGradient id="h-arch" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2418"/><stop offset=".5" stop-color="#4a3f2a"/><stop offset="1" stop-color="#221d14"/></linearGradient>
<linearGradient id="h-cone" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="{HOLO}" stop-opacity=".34"/><stop offset=".55" stop-color="{HOLO}" stop-opacity=".1"/><stop offset="1" stop-color="{HOLO}" stop-opacity=".02"/></linearGradient>
<radialGradient id="h-shadow"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="h-plinth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3326"/><stop offset="1" stop-color="#1a1711"/></linearGradient>
<radialGradient id="h-lens"><stop offset="0" stop-color="#e8fbff" stop-opacity=".95"/><stop offset=".4" stop-color="{HOLO}" stop-opacity=".7"/><stop offset="1" stop-color="{HOLO}" stop-opacity="0"/></radialGradient>
<radialGradient id="h-projglow" cx=".5" cy=".6" r=".65"><stop offset="0" stop-color="{HOLO}" stop-opacity=".08"/><stop offset="1" stop-color="{HOLO}" stop-opacity="0"/></radialGradient>
<radialGradient id="h-screenglow" cx=".5" cy=".5" r=".6"><stop offset=".72" stop-color="{HOLO}" stop-opacity=".1"/><stop offset="1" stop-color="{HOLO}" stop-opacity="0"/></radialGradient>
<linearGradient id="h-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{HOLO}" stop-opacity=".22"/><stop offset="1" stop-color="{HOLO}" stop-opacity=".05"/></linearGradient>
<radialGradient id="h-vignette" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
</defs>"""


def build():
    body = "\n".join([
        DEFS,
        "<!-- the grid -->", grid(),
        "<!-- the pattern buffer -->", buffer(),
        "<!-- the emitter -->", emitter(),
        "<!-- the work screen -->", work_screen(),
        "<!-- the new-section console -->", new_console(),
        "<!-- the safety panel -->", safeties(),
        "<!-- the arch -->", arch(),
        "<!-- highlights -->", highlights(),
        f'<rect width="{W}" height="{H}" fill="url(#h-vignette)" pointer-events="none"/>',
    ])
    return (f'<svg class="holodeck-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" aria-hidden="true">\n'
            f"{body}\n</svg>\n")


if __name__ == "__main__":
    svg = build()
    OUT.write_text(svg)
    print(OUT, len(svg), "bytes")
