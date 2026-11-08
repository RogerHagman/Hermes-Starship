"""Build the pictures for the stations below the Bridge: frontend/src/assets/station-<id>.svg.

    python3 frontend/tools/make_deck_stations_svg.py

The Bridge stations have theirs from make_bridge_stations_svg.py; this file draws one small
scene for every other station and place, deck by deck, with the same pieces (wall, floor,
stars, seats, console lights) so the whole ship reads as one set:

    Deck 2  lounge (Briefing Room), strategist, yeoman, quarters (a crop of the Quarters art)
    Deck 3  computer, archives, science, sensors, doctor (Sickbay)
    Deck 4  holo (Holodeck), carto (Stellar Cartography)
    Deck 5  crewq (Crew Quarters)
    Deck 6  life (Life Support), security, qm (Quartermaster), comms
    Deck 7  away (transporter room), eng (Main Engineering)
    Deck 8  design, calib (Calibration), sys (a Jefferies tube), diag (Diagnostics)

Each station's lights take its rail colour and dim with --sa-glow, which the page lowers while
a station is off duty or not built yet. Ids use a short prefix per scene so no two clash.
Fixed seeds: every run writes the same files. Drawn in 520 x 440 and cropped to fit, so the
important part stays between x 50 and 470.
"""
import math
import random
import re
from pathlib import Path

import make_bridge_stations_svg as b

q = b.q
f, W, H = b.f, b.W, b.H
LOCAL, CODEX, CLAUDE, MIXED, GOLD, LINE, GLOW = b.LOCAL, b.CODEX, b.CLAUDE, b.MIXED, b.GOLD, b.LINE, b.GLOW
RED = "#e8645c"
ASSETS = b.ASSETS
defs, room, seat, lights, finish, stars = b.defs, b.room, b.seat, b.lights, b.finish, b.stars


# ---------- small shared pieces ----------

def panel(x, y, w, h, rx=10, fill="#0b1220"):
    """A framed wall screen."""
    return (f'<rect x="{f(x - 6)}" y="{f(y - 6)}" width="{f(w + 12)}" height="{f(h + 12)}" rx="{rx + 4}" fill="#0b1220" stroke="{LINE}" stroke-width="1.6"/>'
            f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" rx="{rx}" fill="{fill}"/>')


def cap(x, y, w, colour, o=.7):
    """A small LCARS cap on a frame."""
    return f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="5" rx="2.5" fill="{colour}" opacity="{o}"/>'


def desk(p, x0, x1, top, depth=60, trim=LOCAL):
    """A sloped console desk across the room, its front edge lit in the station colour."""
    return (f'<path d="M{x0} {top + depth} L{x0 + 34} {top} L{x1 - 34} {top} L{x1} {top + depth} Z" fill="url(#{p}console)" stroke="{LINE}" stroke-width="1.4"/>'
            f'<path d="M{x0 + 34} {top} L{x1 - 34} {top}" stroke="{trim}" stroke-opacity=".55" stroke-width="1.5" style="{GLOW}"/>'
            f'<rect x="{x0}" y="{top + depth}" width="{x1 - x0}" height="12" rx="4" fill="#0b1220"/>')


def window_strip(p, x, y, w, h, seed, n=2):
    """Viewports on the back wall: dark glass with a few stars."""
    out, gap = [], 14
    pw = (w - gap * (n - 1)) / n
    for i in range(n):
        px = x + i * (pw + gap)
        out.append(f'<rect x="{f(px)}" y="{y}" width="{f(pw)}" height="{h}" rx="12" fill="url(#{p}space)" stroke="{LINE}" stroke-width="1.6"/>')
        out.append(stars(p, (px + 4, y + 4, pw - 8, h - 8), 26, seed + i))
    return "\n".join(out)


def glow_floor(p, cy=420, rx=200):
    return f'<ellipse cx="260" cy="{cy}" rx="{rx}" ry="30" fill="url(#{p}trim-glow)" style="{GLOW}" opacity=".55"/>'


def trim_defs(p, trim):
    """Defs every deck scene adds: a soft glow in the station colour."""
    return (f'<radialGradient id="{p}trim-glow"><stop offset="0" stop-color="{trim}" stop-opacity=".32"/>'
            f'<stop offset="1" stop-color="{trim}" stop-opacity="0"/></radialGradient>')


def scene(p, trim, body, extra="", floor_y=262):
    return finish(p, "\n".join([defs(p, trim_defs(p, trim) + extra), room(p, floor_y), body]))


# ---------- Deck 2 ----------

def lounge():
    """The Briefing Room: the long table, chairs round it, viewports behind."""
    p, out = "br-", []
    out.append(window_strip(p, 50, 34, 420, 120, 5101, n=3))
    out.append(panel(214, 172, 92, 54, 8) + cap(222, 180, 30, GOLD) +
               lights(222, 196, 4, 18, [LOCAL, CODEX, CLAUDE, MIXED], w=12, h=4) +
               lights(222, 208, 3, 18, [MIXED], w=12, h=4))
    # chairs on the far side, then the table, then chairs on the near side
    far = [(150, 300), (205, 296), (260, 295), (315, 296), (370, 300)]
    rails = [LOCAL, CODEX, MIXED, CLAUDE, LOCAL]
    for (x, y), c in zip(far, rails):
        out.append(seat(p, x, y + 40, .2, trim=c))
    out.append(f'<ellipse cx="260" cy="338" rx="196" ry="44" fill="#0e1729" stroke="{LINE}" stroke-width="2"/>')
    out.append(f'<ellipse cx="260" cy="334" rx="178" ry="34" fill="url(#{p}top)"/>')
    out.append(f'<ellipse cx="260" cy="334" rx="120" ry="20" fill="none" stroke="{MIXED}" stroke-opacity=".3"/>')
    for i, c in enumerate([LOCAL, CODEX, MIXED, CLAUDE, LOCAL]):
        x = 156 + i * 52
        out.append(f'<rect x="{x}" y="330" width="22" height="5" rx="2.5" fill="{c}" opacity=".7" style="{GLOW}"/>')
    for x, c in [(120, CODEX), (260, GOLD), (400, CLAUDE)]:
        out.append(seat(p, x, 520, .34, trim=c))
    extra = f'<radialGradient id="{p}top"><stop offset="0" stop-color="#1b2a44"/><stop offset="1" stop-color="#0d1626"/></radialGradient>'
    return scene(p, MIXED, "\n".join(out), extra, floor_y=258)


def strategist():
    """The Chief Strategist's plan wall: a flow of boxes with an owner and a 'done when' each."""
    p, out = "st-", []
    out.append(panel(50, 30, 420, 214, 12, "url(#st-glass)"))
    out.append(cap(64, 24, 54, GOLD) + cap(400, 24, 54, CLAUDE))
    boxes = [(78, 70), (78, 150), (206, 110), (334, 70), (334, 150)]
    for a, z in [(0, 2), (1, 2), (2, 3), (2, 4)]:
        (x1, y1), (x2, y2) = boxes[a], boxes[z]
        out.append(f'<path d="M{x1 + 92} {y1 + 22} C{x1 + 120} {y1 + 22} {x2 - 28} {y2 + 22} {x2} {y2 + 22}" fill="none" '
                   f'stroke="{CLAUDE}" stroke-width="1.4" stroke-dasharray="5 5" class="sa-flow" style="{GLOW}"/>')
    for i, (x, y) in enumerate(boxes):
        out.append(f'<rect x="{x}" y="{y}" width="92" height="44" rx="8" fill="#101a2e" stroke="{CLAUDE if i == 2 else LINE}" stroke-width="1.4"/>')
        out.append(f'<rect x="{x + 8}" y="{y + 9}" width="40" height="5" rx="2.5" fill="{GOLD if i == 2 else MIXED}" opacity=".7"/>')
        out.append(f'<rect x="{x + 8}" y="{y + 21}" width="70" height="3.5" rx="1.75" fill="#8aa0c4" opacity=".4"/>')
        out.append(f'<rect x="{x + 8}" y="{y + 30}" width="52" height="3.5" rx="1.75" fill="#8aa0c4" opacity=".3"/>')
    # a milestone line along the bottom of the wall
    out.append(f'<line x1="78" y1="222" x2="426" y2="222" stroke="{LINE}" stroke-width="2"/>')
    for i, x in enumerate((78, 166, 254, 342, 426)):
        out.append(f'<circle cx="{x}" cy="222" r="5" fill="{GOLD if i < 2 else "#0b1220"}" stroke="{GOLD}" stroke-width="1.4" style="{GLOW}"/>')
    out.append(desk(p, 60, 460, 286, 56, CLAUDE))
    out.append(lights(110, 300, 10, 32, [CLAUDE, MIXED], w=18, h=5))
    out.append(seat(p, 260, 540, .5, trim=CLAUDE))
    extra = '<linearGradient id="st-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1730"/><stop offset="1" stop-color="#080e1e"/></linearGradient>'
    return scene(p, CLAUDE, "\n".join(out), extra)


def yeoman():
    """The Yeoman's desk: the todo screen with ticks, a reminder dial, a stack of PADDs."""
    p, out = "ye-", []
    out.append(panel(60, 36, 250, 200, 12))
    out.append(cap(72, 30, 50, GOLD))
    for i in range(6):
        y = 64 + i * 28
        done = i in (0, 1, 3)
        out.append(f'<rect x="82" y="{y}" width="14" height="14" rx="3.5" fill="{LOCAL if done else "none"}" stroke="{LOCAL}" stroke-width="1.4" style="{GLOW}"/>')
        if done:
            out.append(f'<path d="M85 {y + 7} l3 3 l6 -6" fill="none" stroke="#0b1220" stroke-width="1.8"/>')
        out.append(f'<rect x="106" y="{y + 4}" width="{150 - (i % 3) * 30}" height="5" rx="2.5" fill="#8aa0c4" opacity="{.25 if done else .55}"/>')
    # the reminder dial: a ring with the next reminder lit
    cx, cy = 390, 120
    out.append(f'<circle cx="{cx}" cy="{cy}" r="70" fill="#0b1220" stroke="{LINE}" stroke-width="2"/>')
    for k in range(12):
        a = math.radians(k * 30 - 90)
        out.append(f'<line x1="{f(cx + 58 * math.cos(a))}" y1="{f(cy + 58 * math.sin(a))}" x2="{f(cx + 64 * math.cos(a))}" y2="{f(cy + 64 * math.sin(a))}" stroke="#8aa0c4" stroke-opacity=".5" stroke-width="1.4"/>')
    out.append(f'<path d="M{cx} {cy - 48} A48 48 0 0 1 {f(cx + 48 * math.cos(math.radians(30)))} {f(cy + 48 * math.sin(math.radians(30)))}" fill="none" stroke="{GOLD}" stroke-width="4" stroke-linecap="round" style="{GLOW}"/>')
    out.append(f'<line x1="{cx}" y1="{cy}" x2="{cx}" y2="{cy - 40}" stroke="#dfe8ff" stroke-width="2" stroke-linecap="round" class="sa-spin" style="transform-origin:{cx}px {cy}px"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="4" fill="{GOLD}"/>')
    # the desk with a stack of PADDs
    out.append(f'<path d="M30 330 L80 280 L440 280 L490 330 Z" fill="url(#{p}console)" stroke="{LINE}" stroke-width="1.4"/>')
    out.append(f'<rect x="30" y="330" width="460" height="12" rx="4" fill="#0b1220"/>')
    for i in range(3):
        out.append(f'<path d="M{150 + i * 4} {304 - i * 6} l70 -4 l10 14 l-70 4 Z" fill="#1a2742" stroke="{LINE}"/>')
    out.append(f'<path d="M158 292 l70 -4 l10 14 l-70 4 Z" fill="url(#{p}padd)" style="{GLOW}"/>')
    out.append(f'<rect x="330" y="290" width="30" height="20" rx="4" fill="#1a2742" stroke="{LINE}"/>')
    out.append(seat(p, 260, 560, .5, trim=LOCAL))
    extra = f'<linearGradient id="{p}padd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{LOCAL}" stop-opacity=".8"/><stop offset="1" stop-color="{LOCAL}" stop-opacity=".45"/></linearGradient>'
    return scene(p, LOCAL, "\n".join(out), extra)


def quarters():
    """The Captain's Quarters: the window and the chair, cropped from the Quarters board's own art."""
    svg = (ASSETS / "quarters.svg").read_text()
    svg = svg.replace('id="q-', 'id="qs-').replace("url(#q-", "url(#qs-")
    svg = svg.replace('class="q-hl"', 'class="sa-hide"').replace('class="q-tw"', 'class="sa-tw"')
    svg = svg.replace('class="q-streaks"', 'class="sa-streaks"').replace('class="q-streak"', 'class="sa-streak"')
    svg = svg.replace('class="q-armlight"', 'class="sa-key"').replace("var(--q-burn,1)", "var(--sa-burn,0)")
    svg = re.sub(r'class="q-[a-z0-9-]+"', '', svg)
    svg = svg.replace('class="quarters-art"', 'class="station-art"').replace('viewBox="0 0 1600 740"', 'viewBox="96 150 640 542" preserveAspectRatio="xMidYMid slice"')
    return svg


# ---------- Deck 3 ----------

def computer():
    """The Ship's Computer core: a tall column of light with rings, and the record banks."""
    p, out = "cp-", []
    for x in (40, 380):
        out.append(f'<rect x="{x}" y="40" width="100" height="220" rx="10" fill="#0b1220" stroke="{LINE}" stroke-width="1.4"/>')
        for r in range(9):
            out.append(lights(x + 12, 56 + r * 22, 4, 21, [LOCAL, LOCAL, MIXED], w=14, h=5, cls="sa-key" if r % 3 == 0 else ""))
    out.append(f'<rect x="222" y="20" width="76" height="300" rx="20" fill="url(#{p}core)" style="{GLOW}"/>')
    out.append(f'<rect x="222" y="20" width="76" height="300" rx="20" fill="none" stroke="{LOCAL}" stroke-opacity=".6" stroke-width="1.5"/>')
    for i in range(7):
        y = 50 + i * 40
        out.append(f'<ellipse cx="260" cy="{y}" rx="54" ry="10" fill="none" stroke="{LOCAL}" stroke-width="2" opacity=".7" '
                   f'class="sa-ping-soft" style="animation-delay:-{f(i * .5)}s;{GLOW}"/>')
    out.append(f'<ellipse cx="260" cy="330" rx="110" ry="22" fill="#0e1729" stroke="{LINE}" stroke-width="2"/>')
    out.append(f'<ellipse cx="260" cy="326" rx="60" ry="10" fill="{LOCAL}" opacity=".35" style="{GLOW}"/>')
    out.append(glow_floor(p, 400, 220))
    extra = (f'<linearGradient id="{p}core" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{LOCAL}" stop-opacity=".08"/>'
             f'<stop offset=".5" stop-color="{LOCAL}" stop-opacity=".55"/><stop offset="1" stop-color="{LOCAL}" stop-opacity=".08"/></linearGradient>')
    return scene(p, LOCAL, "\n".join(out), extra, floor_y=300)


def archives():
    """The Archives: tall shelves of books, a reading console with the year's goal."""
    p, out = "ar-", []
    rnd = random.Random(3003)
    for x0, x1 in ((40, 230), (290, 480)):
        out.append(f'<rect x="{x0}" y="26" width="{x1 - x0}" height="250" rx="6" fill="#120f16" stroke="{LINE}" stroke-width="1.4"/>')
        for base in (84, 136, 188, 240):
            out.append(f'<rect x="{x0}" y="{base}" width="{x1 - x0}" height="5" fill="#2a2230"/>')
            x = x0 + 6
            while x < x1 - 12:
                w = rnd.uniform(6, 13)
                h = rnd.uniform(30, 46)
                c = rnd.choice(q.SPINES)
                out.append(f'<rect x="{f(x)}" y="{f(base - h)}" width="{f(w)}" height="{f(h)}" rx="1.5" fill="{c}" opacity=".9"/>')
                x += w + rnd.uniform(.6, 2)
        out.append(f'<rect x="{x0}" y="26" width="{x1 - x0}" height="250" rx="6" fill="url(#{p}shelflight)"/>')
    # the reading console between the shelves: the year's reading goal as a ring
    out.append(f'<rect x="238" y="70" width="44" height="200" rx="8" fill="#0b1220" stroke="{LINE}"/>')
    out.append(f'<circle cx="260" cy="120" r="16" fill="none" stroke="{LINE}" stroke-width="4"/>')
    out.append(f'<path d="M260 104 A16 16 0 1 1 245 126" fill="none" stroke="{LOCAL}" stroke-width="4" stroke-linecap="round" style="{GLOW}"/>')
    out.append(lights(246, 160, 1, 0, [LOCAL], w=28, h=5) + lights(246, 176, 1, 0, [MIXED], w=20, h=5))
    out.append(desk(p, 90, 430, 292, 50, LOCAL))
    out.append(f'<path d="M210 300 l100 0 l8 22 l-116 0 Z" fill="#2b1f24" stroke="#5a4048"/>')
    out.append(f'<path d="M260 300 l0 22" stroke="#5a4048"/>')
    out.append(seat(p, 260, 560, .46, trim=LOCAL))
    extra = '<linearGradient id="ar-shelflight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf8a" stop-opacity=".16"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></linearGradient>'
    return scene(p, LOCAL, "\n".join(out), extra, floor_y=280)


def science():
    """The Science lab: an eval chart on the wall, a GPU rack, a bench."""
    p, out = "sc-", []
    out.append(panel(50, 36, 290, 190, 12))
    out.append(cap(62, 30, 50, LOCAL) + cap(270, 30, 50, CODEX))
    for k in range(4):
        out.append(f'<line x1="70" y1="{70 + k * 40}" x2="326" y2="{70 + k * 40}" stroke="{LINE}" stroke-width=".8"/>')
    for colour, pts in [(LOCAL, [(70, 200), (120, 170), (170, 150), (220, 120), (270, 108), (320, 96)]),
                        (CODEX, [(70, 196), (120, 186), (170, 160), (220, 150), (270, 132), (320, 126)])]:
        d = "M" + " L".join(f"{x} {y}" for x, y in pts)
        out.append(f'<path d="{d}" fill="none" stroke="{colour}" stroke-width="2" stroke-linejoin="round" style="{GLOW}"/>')
        out += [f'<circle cx="{x}" cy="{y}" r="3" fill="{colour}" style="{GLOW}"/>' for x, y in pts]
    # the GPU rack, its fans and lights
    out.append(f'<rect x="368" y="30" width="104" height="250" rx="8" fill="#0b1220" stroke="{LINE}" stroke-width="1.4"/>')
    for i in range(5):
        y = 44 + i * 46
        out.append(f'<rect x="378" y="{y}" width="84" height="38" rx="5" fill="#101a2e" stroke="{LINE}"/>')
        out.append(f'<circle cx="398" cy="{y + 19}" r="12" fill="none" stroke="#8aa0c4" stroke-opacity=".4" stroke-dasharray="4 3" class="sa-spin" style="transform-origin:398px {y + 19}px;animation-duration:{3 + i}s"/>')
        out.append(lights(420, y + 10, 3, 12, [LOCAL, CODEX, LOCAL], w=8, h=4, cls="sa-key"))
        out.append(f'<rect x="420" y="{y + 24}" width="32" height="4" rx="2" fill="#8aa0c4" opacity=".3"/>')
    out.append(desk(p, 40, 360, 290, 52, MIXED))
    for x, h in ((120, 26), (150, 34), (180, 20)):
        out.append(f'<rect x="{x}" y="{296 - h}" width="16" height="{h}" rx="4" fill="#1a2742" stroke="{LINE}"/>')
        out.append(f'<rect x="{x + 3}" y="{296 - h * .55}" width="10" height="{f(h * .5)}" rx="2" fill="{LOCAL}" opacity=".55" style="{GLOW}"/>')
    out.append(seat(p, 230, 560, .48, trim=MIXED))
    return scene(p, MIXED, "\n".join(out))


def sensors():
    """The Sensor array: a round scope with a sweep and the contacts it found."""
    p, out = "sn-", []
    cx, cy, r = 260, 150, 120
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{r + 14}" fill="#0b1220" stroke="{LINE}" stroke-width="2"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#{p}scope)"/>')
    for k in (1, 2, 3):
        out.append(f'<circle cx="{cx}" cy="{cy}" r="{r * k / 3}" fill="none" stroke="{CLAUDE}" stroke-opacity=".25"/>')
    out.append(f'<line x1="{cx - r}" y1="{cy}" x2="{cx + r}" y2="{cy}" stroke="{CLAUDE}" stroke-opacity=".18"/>')
    out.append(f'<line x1="{cx}" y1="{cy - r}" x2="{cx}" y2="{cy + r}" stroke="{CLAUDE}" stroke-opacity=".18"/>')
    out.append(f'<g class="sa-spin" style="transform-origin:{cx}px {cy}px;animation-duration:6s;{GLOW}">'
               f'<path d="M{cx} {cy} L{cx + r} {cy} A{r} {r} 0 0 0 {f(cx + r * math.cos(math.radians(-40)))} {f(cy + r * math.sin(math.radians(-40)))} Z" fill="url(#{p}sweep)"/>'
               f'<line x1="{cx}" y1="{cy}" x2="{cx + r}" y2="{cy}" stroke="{CLAUDE}" stroke-width="1.6"/></g>')
    for i, (dx, dy) in enumerate([(-60, -40), (48, -70), (70, 30), (-30, 66), (-88, 20)]):
        out.append(f'<circle cx="{cx + dx}" cy="{cy + dy}" r="3.5" fill="{CLAUDE if i else GOLD}" class="sa-blink" style="animation-delay:-{f(i * .6)}s;{GLOW}"/>')
    for x in (60, 420):
        out.append(panel(x, 60, 40, 150, 8))
        out.append(lights(x + 8, 74, 1, 0, [CLAUDE], w=24, h=5) + "".join(
            f'<rect x="{x + 8}" y="{92 + k * 18}" width="{f(24 - (k * 7) % 14)}" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>' for k in range(6)))
    out.append(desk(p, 50, 470, 300, 50, CLAUDE))
    out.append(lights(100, 314, 12, 28, [CLAUDE, MIXED, CLAUDE], w=16, h=5))
    out.append(seat(p, 260, 566, .46, trim=CLAUDE))
    extra = (f'<radialGradient id="{p}scope"><stop offset="0" stop-color="#1a1030"/><stop offset="1" stop-color="#07060f"/></radialGradient>'
             f'<linearGradient id="{p}sweep" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="{CLAUDE}" stop-opacity=".45"/><stop offset="1" stop-color="{CLAUDE}" stop-opacity="0"/></linearGradient>')
    return scene(p, CLAUDE, "\n".join(out), extra, floor_y=290)


def doctor():
    """Sickbay: the biobed with its vitals display above it."""
    p, out = "md-", []
    out.append(panel(130, 36, 260, 120, 12))
    out.append(cap(142, 30, 50, "#5aa4ec"))
    trace, x = "M146 100", 146
    for k in range(6):
        trace += f" L{x + 14} 100 L{x + 19} 74 L{x + 25} 120 L{x + 30} 100 L{x + 40} 100"
        x += 40
    out.append(f'<path d="{trace}" pathLength="100" fill="none" stroke="{LOCAL}" stroke-width="1.8" class="sa-trace" style="{GLOW}"/>')
    for i, w in enumerate((70, 50, 90)):
        out.append(f'<rect x="146" y="{128 + i * 0}" width="{w}" height="4" rx="2" fill="#8aa0c4" opacity=".35" transform="translate({i * 90} 0)"/>')
    # the biobed, seen from its foot
    out.append(f'<path d="M150 300 L190 214 L330 214 L370 300 Z" fill="url(#{p}bed)" stroke="{LINE}" stroke-width="1.5"/>')
    out.append(f'<path d="M190 214 L330 214" stroke="{LOCAL}" stroke-opacity=".6" stroke-width="2" style="{GLOW}"/>')
    out.append(f'<rect x="150" y="300" width="220" height="40" rx="6" fill="#0e1729" stroke="{LINE}"/>')
    out.append(lights(170, 316, 6, 32, [LOCAL, "#5aa4ec"], w=18, h=5))
    out.append(f'<path d="M226 222 C226 210 294 210 294 222 L300 246 C280 252 240 252 220 246 Z" fill="#1d2b44"/>')
    for x in (60, 400):
        out.append(f'<rect x="{x}" y="120" width="60" height="150" rx="8" fill="#0b1220" stroke="{LINE}"/>')
        out.append(lights(x + 10, 136, 3, 15, ["#5aa4ec", LOCAL], w=10, h=4))
    out.append(glow_floor(p, 400, 180))
    extra = '<linearGradient id="md-bed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22324e"/><stop offset="1" stop-color="#121c30"/></linearGradient>'
    return scene(p, LOCAL, "\n".join(out), extra, floor_y=270)


# ---------- Deck 4 ----------

def holo():
    """The Holodeck, running: the gold grid lit, a warm glow from the arch, the cube shining.

    Drawn in two layers. The dark room underneath (the faint grid, the arch frame) never dims.
    Everything that makes it look switched on sits in groups with the GLOW style, so when the
    station is off duty the page lowers --sa-glow and the room falls back to nearly black.
    """
    p, out = "hd-", []
    out.append(f'<rect width="{W}" height="{H}" fill="#050608"/>')
    vx, vy = 260, 170                         # the vanishing point

    def grid(o_floor, o_across, o_wall, width):
        """The holodeck grid at the given strengths: floor rays, cross lines, wall and ceiling rays."""
        g = []
        for k in range(-8, 9):                # floor lines running away
            g.append(f'<line x1="{vx}" y1="{vy}" x2="{vx + k * 80}" y2="{H}" stroke-opacity="{o_floor}"/>')
        for j in range(1, 9):                 # floor lines across, closer together near the back
            y = vy + (H - vy) * (j / 8) ** 1.8
            g.append(f'<line x1="0" y1="{f(y)}" x2="{W}" y2="{f(y)}" stroke-opacity="{o_across}"/>')
        for k in range(-8, 9):                # back wall and ceiling lines
            g.append(f'<line x1="{vx}" y1="{vy}" x2="{vx + k * 80}" y2="0" stroke-opacity="{o_wall}"/>')
        return f'<g stroke="{GOLD}" stroke-width="{width}">{"".join(g)}</g>'

    # the dark room: the faint grid that is always there, even with the program off
    out.append(grid(".35", ".3", ".18", 1))
    # the running program: a warm light spilling out of the arch over the floor (dims off duty)
    out.append(f'<g style="{GLOW}">'
               f'<rect width="{W}" height="{H}" fill="url(#{p}warm)"/>'
               f'<ellipse cx="260" cy="330" rx="230" ry="90" fill="url(#{p}floorlight)"/>'
               f'</g>')
    # ...and the grid lit up bright gold on top of it (dims off duty)
    out.append(f'<g style="{GLOW}">{grid(".75", ".65", ".4", 1.2)}</g>')
    # the far wall, an opening into the program
    out.append(f'<rect x="200" y="122" width="120" height="96" fill="#0a0906" stroke="{GOLD}" stroke-opacity=".5"/>')
    out.append(f'<rect x="200" y="122" width="120" height="96" fill="url(#{p}doorway)" stroke="{GOLD}" stroke-opacity=".9" style="{GLOW}"/>')
    # the arch with its panel: a dark frame, then a wide soft halo and a bright gold edge (both dim)
    arch = "M150 440 L150 150 Q150 96 210 96 L310 96 Q370 96 370 150 L370 440"
    out.append(f'<path d="{arch}" fill="none" stroke="#3a3220" stroke-width="22"/>')
    out.append(f'<g fill="none" style="{GLOW}">'
               f'<path d="{arch}" stroke="#ffd27a" stroke-width="30" stroke-opacity=".12"/>'
               f'<path d="{arch}" stroke="#ffd27a" stroke-width="12" stroke-opacity=".22"/>'
               f'<path d="{arch}" stroke="{GOLD}" stroke-width="2.4"/>'
               f'</g>')
    out.append(f'<rect x="384" y="210" width="44" height="80" rx="6" fill="#141820" stroke="{GOLD}" stroke-opacity=".7"/>')
    out.append(lights(392, 222, 2, 16, [GOLD, CLAUDE], w=12, h=5) + lights(392, 236, 2, 16, [CLAUDE, GOLD], w=12, h=5))
    # the big key blinks (sa-key animates opacity, which beats an inline style), so the GLOW dimming
    # goes on a group round it instead
    out.append(f'<g style="{GLOW}"><rect x="392" y="254" width="28" height="26" rx="4" fill="{CLAUDE}" opacity=".55" class="sa-key"/></g>')
    # a pool of light on the floor under the program (dims off duty)
    out.append(f'<ellipse cx="262" cy="340" rx="80" ry="16" fill="url(#{p}trim-glow)" style="{GLOW}"/>')
    # a half-built program: a wireframe cube turning in the middle, lit from inside
    cube = []
    for (x1, y1, x2, y2) in [(-30, -30, 30, -30), (30, -30, 30, 30), (30, 30, -30, 30), (-30, 30, -30, -30),
                             (-14, -44, 46, -44), (46, -44, 46, 16), (-30, -30, -14, -44), (30, -30, 46, -44), (30, 30, 46, 16)]:
        cube.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"/>')
    edges = "".join(cube)
    faces = (f'<path d="M-30 -30 L30 -30 L30 30 L-30 30 Z" fill="{CLAUDE}" fill-opacity=".16"/>'     # front face
             f'<path d="M-30 -30 L-14 -44 L46 -44 L30 -30 Z" fill="{CLAUDE}" fill-opacity=".1"/>'    # top
             f'<path d="M30 -30 L46 -44 L46 16 L30 30 Z" fill="{CLAUDE}" fill-opacity=".07"/>')      # side
    out.append(f'<g transform="translate(256 300)" class="sa-holo" style="{GLOW}">'
               f'<circle cx="8" cy="-8" r="64" fill="url(#{p}cubeglow)"/>'                          # light round it
               f'{faces}'
               f'<g stroke="{CLAUDE}" fill="none" stroke-linecap="round">'
               f'<g stroke-width="7" stroke-opacity=".18">{edges}</g>'                             # soft halo on the edges
               f'<g stroke-width="2">{edges}</g>'                                                   # the edges themselves
               f'</g></g>')
    extra = (f'<radialGradient id="{p}warm" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".22"/>'
             f'<stop offset=".55" stop-color="#d89a3a" stop-opacity=".08"/><stop offset="1" stop-color="#d89a3a" stop-opacity="0"/></radialGradient>'
             f'<radialGradient id="{p}floorlight"><stop offset="0" stop-color="#ffd890" stop-opacity=".2"/>'
             f'<stop offset="1" stop-color="#ffd890" stop-opacity="0"/></radialGradient>'
             f'<linearGradient id="{p}doorway" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe2a8" stop-opacity=".1"/>'
             f'<stop offset="1" stop-color="#ffcf7a" stop-opacity=".32"/></linearGradient>'
             f'<radialGradient id="{p}cubeglow"><stop offset="0" stop-color="{CLAUDE}" stop-opacity=".35"/>'
             f'<stop offset="1" stop-color="{CLAUDE}" stop-opacity="0"/></radialGradient>')
    return finish(p, defs(p, trim_defs(p, CLAUDE) + extra) + "\n" + "\n".join(out))


def carto():
    """Stellar Cartography: the big star chart wall with a designed page laid over it."""
    p, out = "ct-", []
    out.append(f'<path d="M30 40 Q260 0 490 40 L490 250 Q260 214 30 250 Z" fill="url(#{p}space)" stroke="{LINE}" stroke-width="2"/>')
    out.append(stars(p, (40, 34, 440, 200), 120, 4402, bright=[(110, 80, 6), (400, 70, 5)]))
    pts = [(80, 120), (130, 90), (190, 130), (240, 96)]
    out.append('<path d="M' + " L".join(f"{x} {y}" for x, y in pts) + f'" fill="none" stroke="{CLAUDE}" stroke-width="1.2" opacity=".6"/>')
    out += [f'<circle cx="{x}" cy="{y}" r="2.6" fill="{CLAUDE}"/>' for x, y in pts]
    # the page being designed: a chart card and a pie
    out.append(f'<rect x="290" y="80" width="150" height="120" rx="10" fill="#101a2e" stroke="{CLAUDE}" stroke-width="1.4" opacity=".95" class="sa-holo" style="{GLOW}"/>')
    out.append(cap(302, 92, 40, GOLD))
    for i, h in enumerate((30, 50, 38, 64, 46)):
        out.append(f'<rect x="{304 + i * 16}" y="{186 - h}" width="10" height="{h}" rx="2" fill="{CLAUDE if i == 3 else MIXED}" opacity=".8"/>')
    out.append(f'<circle cx="412" cy="150" r="18" fill="{MIXED}" opacity=".4"/>')
    out.append(f'<path d="M412 150 L412 132 A18 18 0 0 1 429 156 Z" fill="{CLAUDE}" opacity=".85"/>')
    out.append(f'<ellipse cx="260" cy="320" rx="150" ry="34" fill="#0e1729" stroke="{LINE}" stroke-width="2"/>')
    out.append(f'<ellipse cx="260" cy="316" rx="120" ry="24" fill="none" stroke="{CLAUDE}" stroke-opacity=".35"/>')
    out.append(f'<path d="M150 318 L120 440 L400 440 L370 318" fill="#0c1322"/>')
    out.append(lights(196, 330, 6, 22, [CLAUDE, MIXED], w=12, h=4))
    out.append(seat(p, 260, 590, .5, trim=CLAUDE))
    return scene(p, CLAUDE, "\n".join(out), floor_y=268)


# ---------- Deck 5 ----------

def crewq():
    """Crew Quarters: a curved corridor of cabin doors, one light each; three kept spare."""
    p, out = "cq-", []
    out.append(f'<path d="M0 60 Q260 30 520 60 L520 300 Q260 330 0 300 Z" fill="#0d1526"/>')
    doors = [(20, 64, 52), (92, 54, 62), (172, 48, 70), (260, 46, 76), (350, 48, 70), (432, 54, 62)]
    colours = [LOCAL, CODEX, None, CLAUDE, None, MIXED]
    for (x, w, h_off), c in zip(doors, colours):
        top, bottom = 80 - h_off * .2, 292 + h_off * .15
        out.append(f'<rect x="{x}" y="{f(top)}" width="{w}" height="{f(bottom - top)}" rx="8" fill="#141f34" stroke="{LINE}" stroke-width="1.4"/>')
        out.append(f'<line x1="{x + w / 2}" y1="{f(top + 6)}" x2="{x + w / 2}" y2="{f(bottom - 6)}" stroke="{LINE}"/>')
        out.append(f'<rect x="{f(x + w / 2 - 12)}" y="{f(top - 16)}" width="24" height="7" rx="3.5" fill="{c or "#2a3550"}" opacity="{.8 if c else .5}" style="{GLOW if c else ""}"/>')
    out.append(f'<path d="M0 300 Q260 330 520 300 L520 440 L0 440 Z" fill="url(#{p}floor)"/>')
    out.append(f'<path d="M0 330 Q260 362 520 330" fill="none" stroke="{MIXED}" stroke-opacity=".35" stroke-width="2" style="{GLOW}"/>')
    out.append(f'<path d="M0 44 Q260 16 520 44" fill="none" stroke="{MIXED}" stroke-opacity=".3" stroke-width="3"/>')
    return finish(p, defs(p, trim_defs(p, MIXED)) + "\n" + f'<rect width="{W}" height="{H}" fill="url(#{p}wall)"/>' + "\n".join(out))


# ---------- Deck 6 ----------

def life():
    """Life Support: the home's lights as a colour wheel, the air and heat dials."""
    p, out = "ls-", []
    cx, cy = 190, 140
    for k in range(12):
        a0, a1 = math.radians(k * 30), math.radians(k * 30 + 26)
        colour = f"hsl({k * 30 + 10} 45% 60%)"
        out.append(f'<path d="M{f(cx + 90 * math.cos(a0))} {f(cy + 90 * math.sin(a0))} A90 90 0 0 1 {f(cx + 90 * math.cos(a1))} {f(cy + 90 * math.sin(a1))}" '
                   f'fill="none" stroke="{colour}" stroke-width="16" opacity=".6" style="{GLOW}"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="62" fill="#0b1220" stroke="{LINE}"/>')
    for i, (dx, dy) in enumerate([(-24, -14), (0, -24), (24, -14), (-14, 14), (14, 14)]):
        out.append(f'<circle cx="{cx + dx}" cy="{cy + dy}" r="7" fill="#ffd89a" opacity="{.35 + (i % 3) * .2}" style="{GLOW}"/>')
    for i, (label_y, lvl) in enumerate([(64, .55), (150, .35)]):
        x, y = 380, label_y + 40
        out.append(f'<circle cx="{x}" cy="{y}" r="36" fill="#0b1220" stroke="{LINE}" stroke-width="2"/>')
        out.append(f'<path d="M{x - 30} {y + 14} A32 32 0 1 1 {x + 30} {y + 14}" fill="none" stroke="{LINE}" stroke-width="5"/>')
        end = math.radians(160 + 220 * lvl)
        out.append(f'<path d="M{x - 30} {y + 14} A32 32 0 {1 if 220 * lvl > 180 else 0} 1 {f(x + 32 * math.cos(end))} {f(y + 32 * math.sin(end))}" fill="none" stroke="{LOCAL if i == 0 else "#5aa4ec"}" stroke-width="5" stroke-linecap="round" style="{GLOW}"/>')
    for i in range(5):
        out.append(f'<rect x="60" y="{260 + i * 9}" width="400" height="4" rx="2" fill="#1a2742"/>')
    out.append(desk(p, 50, 470, 304, 50, LOCAL))
    out.append(lights(100, 318, 12, 28, [LOCAL], w=16, h=5))
    return scene(p, LOCAL, "\n".join(out), floor_y=290)


def security():
    """Security: the pre-send scan arch, a payload going through, the checks beside it."""
    p, out = "sy-", []
    out.append(f'<path d="M150 330 L150 120 Q150 70 200 70 L320 70 Q370 70 370 120 L370 330" fill="none" stroke="#1c2840" stroke-width="26"/>')
    out.append(f'<path d="M150 330 L150 120 Q150 70 200 70 L320 70 Q370 70 370 120 L370 330" fill="none" stroke="{LINE}" stroke-width="2"/>')
    out.append(f'<rect x="166" y="96" width="188" height="6" rx="3" fill="{GOLD}" opacity=".7" class="sa-scan" style="{GLOW}"/>')
    out.append(f'<rect x="166" y="90" width="188" height="220" fill="url(#{p}beam)" style="{GLOW}"/>')
    # the payload on its belt
    out.append(f'<path d="M60 340 L460 340 L480 370 L40 370 Z" fill="#141f34" stroke="{LINE}"/>')
    for x in range(56, 470, 26):
        out.append(f'<line x1="{x}" y1="344" x2="{x - 4}" y2="366" stroke="{LINE}"/>')
    out.append(f'<rect x="222" y="270" width="76" height="70" rx="8" fill="#1a2742" stroke="{MIXED}" stroke-width="1.5"/>')
    out.append(lights(234, 284, 3, 18, [LOCAL, CODEX, CLAUDE], w=12, h=4))
    out.append(f'<rect x="234" y="300" width="52" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>')
    # the checks: four passed
    for i in range(4):
        y = 110 + i * 34
        out.append(f'<circle cx="430" cy="{y}" r="11" fill="none" stroke="{LOCAL}" stroke-width="1.6" style="{GLOW}"/>')
        out.append(f'<path d="M425 {y} l4 4 l7 -8" fill="none" stroke="{LOCAL}" stroke-width="2" style="{GLOW}"/>')
    for i in range(4):
        out.append(f'<rect x="60" y="{104 + i * 34}" width="{60 - (i % 2) * 18}" height="6" rx="3" fill="#8aa0c4" opacity=".4"/>')
    extra = f'<linearGradient id="{p}beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{GOLD}" stop-opacity=".12"/><stop offset="1" stop-color="{GOLD}" stop-opacity="0"/></linearGradient>'
    return scene(p, MIXED, "\n".join(out), extra, floor_y=300)


def qm():
    """The Quartermaster's store: crates, the ledger screen, the scale."""
    p, out = "qm-", []
    out.append(panel(60, 36, 220, 170, 12))
    out.append(cap(72, 30, 50, LOCAL))
    for r in range(7):
        y = 58 + r * 20
        out.append(f'<rect x="76" y="{y}" width="90" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>')
        out.append(f'<rect x="{220 - (r * 13) % 30}" y="{y}" width="{f(40 + (r * 13) % 30)}" height="4" rx="2" fill="{LOCAL if r != 4 else CODEX}" opacity=".7" style="{GLOW}"/>')
    out.append(f'<line x1="76" y1="200" x2="266" y2="200" stroke="{LINE}"/>')
    # crates stacked on the right
    for x, y, w, h in [(320, 196, 80, 70), (402, 196, 80, 70), (352, 124, 90, 70), (330, 268, 150, 0)]:
        if h:
            out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="5" fill="url(#{p}crate)" stroke="#3a4a68"/>')
            out.append(f'<rect x="{x + 10}" y="{y + 10}" width="{w * .45}" height="8" rx="2" fill="{CODEX if x == 352 else LOCAL}" opacity=".6"/>')
            out.append(f'<path d="M{x} {y + h / 2} L{x + w} {y + h / 2}" stroke="#3a4a68"/>')
    # the scale on the counter, its reading lit
    out.append(desk(p, 40, 480, 290, 50, LOCAL))
    out.append(f'<rect x="120" y="282" width="110" height="14" rx="5" fill="#1d2b44" stroke="{LINE}"/>')
    out.append(f'<rect x="150" y="300" width="50" height="14" rx="3" fill="#081620"/>')
    out.append(lights(156, 305, 4, 10, [LOCAL], w=6, h=4))
    out.append(f'<path d="M270 302 l60 0 l0 18 l-60 0 Z" fill="#e8e0d0" opacity=".8"/>')
    out.append("".join(f'<rect x="276" y="{306 + k * 4}" width="{36 - k * 6}" height="1.6" fill="#6a6a6a"/>' for k in range(3)))
    out.append(seat(p, 260, 590, .46, trim=LOCAL))
    extra = '<linearGradient id="qm-crate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26344e"/><stop offset="1" stop-color="#162034"/></linearGradient>'
    return scene(p, LOCAL, "\n".join(out), extra, floor_y=270)


def comms():
    """Comms: the message list, drafts ready, and the antenna's signal rings."""
    p, out = "cm-", []
    out.append(panel(60, 40, 250, 196, 12))
    out.append(cap(72, 34, 50, GOLD))
    for i in range(5):
        y = 62 + i * 34
        out.append(f'<rect x="78" y="{y}" width="214" height="26" rx="6" fill="#101a2e" stroke="{LINE}"/>')
        out.append(f'<path d="M88 {y + 7} h18 v12 h-18 z M88 {y + 7} l9 7 l9 -7" fill="none" stroke="{LOCAL if i < 2 else "#8aa0c4"}" stroke-width="1.3" style="{GLOW}"/>')
        out.append(f'<rect x="116" y="{y + 9}" width="{120 - (i % 3) * 24}" height="4" rx="2" fill="#8aa0c4" opacity=".5"/>')
        out.append(f'<rect x="116" y="{y + 16}" width="{80 - (i % 2) * 20}" height="3" rx="1.5" fill="#8aa0c4" opacity=".3"/>')
        if i < 2:
            out.append(f'<rect x="254" y="{y + 9}" width="28" height="8" rx="4" fill="none" stroke="{GOLD}" stroke-width="1.2"/>')
    cx, cy = 400, 130
    out.append(f'<line x1="{cx}" y1="{cy}" x2="{cx}" y2="250" stroke="#8aa0c4" stroke-width="3"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="6" fill="{LOCAL}" style="{GLOW}"/>')
    for k in range(3):
        out.append(f'<circle cx="{cx}" cy="{cy}" r="14" fill="none" stroke="{LOCAL}" stroke-width="1.5" class="sa-ping" style="transform-origin:{cx}px {cy}px;animation-delay:-{f(k * .85)}s;{GLOW}"/>')
    out.append(desk(p, 50, 470, 296, 52, LOCAL))
    out.append(lights(100, 310, 12, 28, [LOCAL, GOLD, LOCAL], w=16, h=5))
    out.append(seat(p, 260, 572, .46, trim=LOCAL))
    return scene(p, LOCAL, "\n".join(out), floor_y=280)


# ---------- Deck 7 ----------

def away():
    """The transporter room: the pad, the beams rising, the console in front."""
    p, out = "aw-", []
    out.append(f'<path d="M80 60 Q260 20 440 60 L440 90 Q260 52 80 90 Z" fill="#141f34" stroke="{LINE}"/>')
    pads = [(170, 210), (260, 206), (350, 210), (210, 246), (310, 246)]
    for x, y in pads:
        out.append(f'<ellipse cx="{x}" cy="{y + 4}" rx="34" ry="11" fill="#0b1220" stroke="{LINE}" stroke-width="1.5"/>')
        out.append(f'<ellipse cx="{x}" cy="{y + 2}" rx="24" ry="7" fill="{MIXED}" opacity=".35" style="{GLOW}"/>')
        out.append(f'<rect x="{x - 22}" y="{y - 150}" width="44" height="152" fill="url(#{p}beam)" class="sa-beam" style="animation-delay:-{f((x + y) % 7 * .4)}s;{GLOW}"/>')
    rnd = random.Random(7007)
    for _ in range(40):
        x, y = rnd.choice(pads)
        out.append(f'<circle cx="{f(x + rnd.uniform(-18, 18))}" cy="{f(y - rnd.uniform(10, 140))}" r="{f(rnd.uniform(.6, 1.4))}" fill="#e6efff" class="sa-tw" style="animation-delay:-{f(rnd.uniform(0, 5))}s"/>')
    out.append(f'<path d="M90 236 Q260 190 430 236 L450 290 Q260 250 70 290 Z" fill="none" stroke="{LINE}" stroke-width="2"/>')
    out.append(desk(p, 120, 400, 330, 50, MIXED))
    out.append(lights(170, 344, 8, 24, [MIXED, LOCAL, CODEX, CLAUDE], w=14, h=5))
    for i in range(3):
        out.append(f'<rect x="{196 + i * 46}" y="358" width="30" height="8" rx="3" fill="{MIXED}" opacity=".5" class="sa-key" style="animation-delay:-{i * .5}s"/>')
    extra = f'<linearGradient id="{p}beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="{MIXED}" stop-opacity=".35"/><stop offset="1" stop-color="{MIXED}" stop-opacity="0"/></linearGradient>'
    return scene(p, MIXED, "\n".join(out), extra, floor_y=240)


def eng():
    """Main Engineering: the master systems table with the ship on it, the warp core behind."""
    p, out = "en-", []
    # the warp core at the back: local (teal), the ship's own power
    out.append(f'<rect x="226" y="0" width="68" height="250" rx="14" fill="url(#{p}core)" style="{GLOW}"/>')
    for i in range(6):
        out.append(f'<rect x="220" y="{20 + i * 38}" width="80" height="10" rx="5" fill="{LOCAL}" opacity=".55" class="sa-key" style="animation-delay:-{f(i * .3)}s;{GLOW}"/>')
    for x in (40, 360):
        out.append(f'<rect x="{x}" y="40" width="120" height="170" rx="10" fill="#0b1220" stroke="{LINE}" stroke-width="1.4"/>')
        out.append(cap(x + 10, 50, 40, CODEX))
        for r in range(6):
            out.append(f'<rect x="{x + 12}" y="{70 + r * 22}" width="{f(96 - (r * 17) % 40)}" height="6" rx="3" fill="{CODEX if r % 3 else MIXED}" opacity=".6" style="{GLOW}"/>')
    # the master systems display: the table with the ship's outline
    out.append(f'<path d="M40 380 L100 290 L420 290 L480 380 Z" fill="#101826" stroke="{LINE}" stroke-width="2"/>')
    out.append(f'<path d="M60 372 L112 298 L408 298 L460 372 Z" fill="url(#{p}msd)"/>')
    out.append(f'<g style="{GLOW}" stroke="{CODEX}" stroke-width="1.5" fill="none" opacity=".85">'
               '<ellipse cx="210" cy="326" rx="78" ry="16"/><path d="M286 330 L360 334 L372 346 L300 348 Z"/>'
               '<path d="M300 340 L300 362 M340 336 L344 362"/><path d="M290 360 L400 360"/></g>')
    out.append(lights(150, 352, 8, 16, [CODEX, LOCAL], w=8, h=4, cls="sa-key"))
    out.append(f'<rect x="40" y="380" width="440" height="14" rx="4" fill="#0b1220"/>')
    extra = (f'<linearGradient id="{p}core" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{LOCAL}" stop-opacity=".1"/>'
             f'<stop offset=".5" stop-color="{LOCAL}" stop-opacity=".6"/><stop offset="1" stop-color="{LOCAL}" stop-opacity=".1"/></linearGradient>'
             f'<linearGradient id="{p}msd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1408"/><stop offset="1" stop-color="#0c0a06"/></linearGradient>')
    return scene(p, CODEX, "\n".join(out), extra, floor_y=250)


# ---------- Deck 8 ----------

def design():
    """The Design Engineer's drafting table: a board laid out from the design system's swatches."""
    p, out = "de-", []
    out.append(panel(60, 36, 400, 150, 12))
    for i, c in enumerate([LOCAL, CODEX, CLAUDE, MIXED, GOLD, RED, "#5aa4ec"]):
        out.append(f'<rect x="{80 + i * 52}" y="56" width="40" height="40" rx="8" fill="{c}" opacity=".75" style="{GLOW}"/>')
        out.append(f'<rect x="{80 + i * 52}" y="104" width="34" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>')
    for i in range(3):
        out.append(f'<rect x="{80 + i * 120}" y="126" width="108" height="44" rx="8" fill="none" stroke="{CLAUDE}" stroke-dasharray="4 4" opacity=".6"/>')
    out.append(f'<path d="M80 360 L130 230 L390 230 L440 360 Z" fill="url(#{p}board)" stroke="{LINE}" stroke-width="1.6"/>')
    for (x0, y0, x1, y1) in [(146, 244, 250, 290), (262, 244, 374, 270), (262, 278, 374, 320), (132, 300, 250, 346)]:
        out.append(f'<path d="M{x0} {y0} L{x1} {y0} L{x1 + (y1 - y0) * .2} {y1} L{x0 - (y1 - y0) * .3} {y1} Z" fill="#101a2e" stroke="{CLAUDE}" stroke-opacity=".6"/>')
    out.append(f'<rect x="146" y="252" width="40" height="5" rx="2.5" fill="{GOLD}" opacity=".7"/>')
    out.append(f'<path d="M330 286 l40 -60" stroke="#c9b3e8" stroke-width="3" stroke-linecap="round"/>')
    return scene(p, CLAUDE, "\n".join(out), floor_y=250)


def calib():
    """Calibration: a test pattern on the screen and a gauge reading true."""
    p, out = "cb-", []
    out.append(panel(60, 36, 260, 180, 12))
    bars = [LOCAL, CODEX, CLAUDE, MIXED, GOLD, RED, "#e6efff"]
    for i, c in enumerate(bars):
        out.append(f'<rect x="{60 + i * 37}" y="36" width="37" height="120" fill="{c}" opacity=".7" style="{GLOW}"/>')
    for i in range(10):
        out.append(f'<rect x="{60 + i * 26}" y="156" width="26" height="60" fill="#{"%02x" % (20 + i * 22) * 3}" opacity=".9"/>')
    cx, cy = 400, 140
    out.append(f'<circle cx="{cx}" cy="{cy}" r="60" fill="#0b1220" stroke="{LINE}" stroke-width="2"/>')
    for k in range(11):
        a = math.radians(200 + k * 14)
        out.append(f'<line x1="{f(cx + 46 * math.cos(a))}" y1="{f(cy + 46 * math.sin(a))}" x2="{f(cx + 54 * math.cos(a))}" y2="{f(cy + 54 * math.sin(a))}" stroke="#8aa0c4" stroke-width="1.4" opacity=".6"/>')
    out.append(f'<path d="M{f(cx + 50 * math.cos(math.radians(256)))} {f(cy + 50 * math.sin(math.radians(256)))} A50 50 0 0 1 {f(cx + 50 * math.cos(math.radians(284)))} {f(cy + 50 * math.sin(math.radians(284)))}" fill="none" stroke="{LOCAL}" stroke-width="5" style="{GLOW}"/>')
    out.append(f'<line x1="{cx}" y1="{cy}" x2="{cx}" y2="{cy - 44}" stroke="{GOLD}" stroke-width="2.4" stroke-linecap="round" class="sa-needle" style="transform-origin:{cx}px {cy}px"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="4" fill="#0b1220" stroke="#8aa0c4"/>')
    out.append(desk(p, 50, 470, 292, 52, CLAUDE))
    out.append(lights(100, 306, 12, 28, [CLAUDE, LOCAL], w=16, h=5))
    out.append(seat(p, 260, 568, .46, trim=CLAUDE))
    return scene(p, CLAUDE, "\n".join(out), floor_y=276)


def sys():
    """A Jefferies tube: the Systems Engineer's open panel of isolinear chips."""
    p, out = "sy8-", []
    out.append(f'<rect width="{W}" height="{H}" fill="#0a0f1a"/>')
    for k in range(6):            # the tube's ribs, shrinking towards the far end
        s = 1 - k * .14
        w, h = 460 * s, 400 * s
        out.append(f'<rect x="{f(260 - w / 2)}" y="{f(220 - h / 2)}" width="{f(w)}" height="{f(h)}" rx="{f(60 * s)}" fill="none" stroke="#24324c" stroke-width="{f(10 * s)}"/>')
    out.append(f'<rect x="200" y="160" width="120" height="120" rx="20" fill="#05070c"/>')
    out.append(f'<rect x="210" y="170" width="100" height="100" rx="14" fill="{CODEX}" opacity=".08" style="{GLOW}"/>')
    # the open panel on the left wall, chips in rows, one pulled half out
    out.append(f'<path d="M60 110 L170 140 L170 320 L60 350 Z" fill="#101826" stroke="{LINE}" stroke-width="1.5"/>')
    for r in range(6):
        for c in range(3):
            x, y = 76 + c * 30, 140 + r * 32 + c * 2
            pulled = (r, c) == (2, 1)
            out.append(f'<path d="M{x - (10 if pulled else 0)} {y} l22 3 l0 16 l-22 -3 Z" fill="{CODEX if (r + c) % 3 else MIXED}" opacity="{.85 if pulled else .55}" style="{GLOW}"/>')
    out.append(f'<path d="M350 140 L460 110 L460 350 L350 320 Z" fill="#101826" stroke="{LINE}" stroke-width="1.5"/>')
    out.append(lights(370, 160, 3, 26, [CODEX, LOCAL, CODEX], w=14, h=5, cls="sa-key"))
    out.append(lights(370, 200, 3, 26, [CODEX], w=14, h=5))
    out.append(f'<path d="M300 440 C320 380 380 360 400 300" fill="none" stroke="#3a4a68" stroke-width="6"/>')
    out.append(f'<path d="M280 440 C300 370 350 350 380 300" fill="none" stroke="{CODEX}" stroke-opacity=".4" stroke-width="3" style="{GLOW}"/>')
    return finish(p, defs(p, trim_defs(p, CODEX)) + "\n" + "\n".join(out))


def diag():
    """Diagnostics: a scan running down a list, and the report it writes."""
    p, out = "dg-", []
    out.append(panel(60, 36, 260, 200, 12))
    out.append(cap(72, 30, 50, CODEX))
    for i in range(7):
        y = 58 + i * 24
        ok = i < 4
        out.append(f'<rect x="80" y="{y}" width="{150 - (i % 3) * 26}" height="5" rx="2.5" fill="#8aa0c4" opacity=".45"/>')
        out.append(f'<circle cx="290" cy="{y + 2}" r="5" fill="{LOCAL if ok else "none"}" stroke="{LOCAL if ok else "#8aa0c4"}" stroke-opacity="{1 if ok else .4}" style="{GLOW}"/>')
    out.append(f'<rect x="66" y="150" width="248" height="16" rx="4" fill="{CODEX}" opacity=".14" class="sa-scan2" style="{GLOW}"/>')
    # the report coming out of the printer slot
    out.append(f'<rect x="350" y="70" width="120" height="16" rx="6" fill="#1a2742" stroke="{LINE}"/>')
    out.append(f'<path d="M362 84 L458 84 L458 210 L362 214 Z" fill="#e8e0d0" opacity=".85"/>')
    for k in range(8):
        out.append(f'<rect x="372" y="{96 + k * 13}" width="{70 - (k % 3) * 16}" height="3" rx="1.5" fill="#5a5a66"/>')
    out.append(desk(p, 50, 470, 292, 52, CODEX))
    out.append(lights(100, 306, 12, 28, [CODEX, LOCAL], w=16, h=5))
    out.append(seat(p, 260, 568, .46, trim=CODEX))
    return scene(p, CODEX, "\n".join(out), floor_y=276)


SCENES = {"lounge": lounge, "strategist": strategist, "yeoman": yeoman, "quarters": quarters,
          "computer": computer, "archives": archives, "science": science, "sensors": sensors, "doctor": doctor,
          "holo": holo, "carto": carto, "crewq": crewq, "life": life, "security": security, "qm": qm, "comms": comms,
          "away": away, "eng": eng, "design": design, "calib": calib, "sys": sys, "diag": diag}

if __name__ == "__main__":
    for station, draw in SCENES.items():
        out = ASSETS / f"station-{station}.svg"
        svg = draw()
        out.write_text(svg)
        print(out.name, len(svg), "bytes")
