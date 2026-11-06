"""Build frontend/src/assets/ops.svg: Ops (Deck 1), the operations room behind the Bridge, seen from the door.

    python3 frontend/tools/make_ops_svg.py

Left to right: the turbolift door (back to the Bridge), the network panel (cabled to the NAS) over the Ops officer's
console, the NAS rack
(its container modules and drive bays), the chronometer over the storage bank (the schedule),
the backup vault, the Ops wall screen over the usage desk, and the GPU tower (its fans glow with
the local rail, like Engineering's warp core). In front, the status board table.

The page lays the status board (one chip per check), the live rail gauges on the usage desk and
the work screen over this picture by position, so if you move something here, move it in
lib/ops.ts too (TABLE, DESK, SCREEN, SPOTS). Everything is drawn in a 1600 x 740 box. The panel
lights come from a fixed seed.
"""
import math
import random
from pathlib import Path

W, H = 1600, 740
OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "ops.svg"
rnd = random.Random(1864)

OPS, GOLD, GOOD, BAD, BLUE = "#b8a2f5", "#e8c37a", "#7fd8a8", "#f08a7a", "#7fb8f0"
LOCAL, CODEX, CLAUDE = "#3fc1a5", "#f0a948", "#e889b6"
FAN = "#3fc1a5"                # the GPU fans' glow; the page dims it from the local rail
TABLE = (170, 596, 660, 96)    # the status board's top (lib/ops.ts)
DESK = (968, 600, 396, 84)     # the usage desk's top, where the page lays the rail gauges
SCREEN = (880, 46, 560, 458)   # lib/ops.ts
CLOCK = (591, 190, 88)         # the chronometer: centre and radius


def f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


# ---------- the room ----------
def room():
    out = [
        f'<rect width="{W}" height="{H}" fill="url(#o-wall)"/>',
        '<rect width="1600" height="34" fill="#08070d"/>',
        '<rect x="160" y="30" width="1280" height="4" rx="2" fill="#e6dcff" opacity=".18"/>',
        '<rect x="160" y="34" width="1280" height="60" fill="url(#o-downlight)"/>',
        "".join(f'<line x1="{x}" y1="34" x2="{x}" y2="560" stroke="#1b1926" stroke-width="2"/>' for x in range(140, 1600, 132)),
        '<rect x="0" y="236" width="1600" height="3" fill="#221f31"/>',
        # data trunking along the ceiling, from the racks to the screen
        '<rect x="324" y="58" width="556" height="10" rx="5" fill="#15131e" stroke="#2e2a40"/>',
        f'<rect class="o-flow" x="328" y="61" width="548" height="4" rx="2" fill="{OPS}" opacity=".45"/>',
        # floor
        '<polygon points="0,560 1600,560 1600,740 0,740" fill="url(#o-floor)"/>',
        '<line x1="0" y1="560" x2="1600" y2="560" stroke="#2e2a40" stroke-width="2"/>',
        "".join(f'<line x1="{800 + (x - 800) * 0.55}" y1="560" x2="{x}" y2="740" stroke="#16141f" stroke-width="1.5"/>' for x in range(-400, 2001, 200)),
        # the GPU's glow on the floor
        f'<ellipse class="o-glow" cx="1524" cy="728" rx="120" ry="14" fill="{FAN}" opacity=".14"/>',
    ]
    # a strip of lights along the skirting
    for i in range(46):
        x = 150 + i * 28
        if 320 < x < 860 or x > 1440:
            continue
        c = rnd.choice([OPS, OPS, GOLD, BLUE, LOCAL])
        out.append(f'<rect x="{x}" y="{f(546 + rnd.choice([0, 0, 1]))}" width="{f(rnd.uniform(8, 18))}" height="3" rx="1.5" fill="{c}" opacity="{f(rnd.uniform(.3, .75))}"/>')
    return "\n".join(out)


# ---------- the turbolift door ----------
def door():
    x0, x1, top = 22, 132, 150
    mid = (x0 + x1) / 2
    return "\n".join([
        f'<rect x="{x0 - 8}" y="{top - 10}" width="{x1 - x0 + 16}" height="{560 - top + 10}" rx="8" fill="#13111b" stroke="#2e2a40" stroke-width="2"/>',
        f'<rect x="{x0}" y="{top}" width="{x1 - x0}" height="{560 - top}" rx="4" fill="url(#o-door)"/>',
        f'<line x1="{mid}" y1="{top}" x2="{mid}" y2="560" stroke="#08070d" stroke-width="3"/>',
        f'<rect x="{x0 + 10}" y="{top + 16}" width="{x1 - x0 - 20}" height="6" rx="3" fill="{OPS}" opacity=".7"/>',
        f'<text x="{mid}" y="{top - 18}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{OPS}">TURBOLIFT</text>',
        f'<rect class="o-lamp" x="{x1 + 2}" y="330" width="6" height="30" rx="3" fill="{LOCAL}"/>',
    ])


# ---------- the Ops officer's console ----------
def console():
    x0, x1, top = 166, 302, 262
    mid = (x0 + x1) / 2
    out = [
        f'<ellipse cx="{mid}" cy="566" rx="{(x1 - x0) / 2 + 14}" ry="9" fill="url(#o-shadow)"/>',
        f'<path d="M{mid - 22} {top + 80} H{mid + 22} L{mid + 30} 560 H{mid - 30} Z" fill="url(#o-metal)" stroke="#2e2a40" stroke-width="2"/>',
        f'<path d="M{x0} {top + 14} L{x1} {top} L{x1 - 6} {top + 86} L{x0 + 6} {top + 96} Z" fill="url(#o-metal)" stroke="#3d3856" stroke-width="2"/>',
        f'<path d="M{x0 + 12} {top + 22} L{x1 - 12} {top + 10} L{x1 - 16} {top + 76} L{x0 + 16} {top + 84} Z" fill="#0a0910" stroke="{OPS}" stroke-opacity=".55"/>',
    ]
    # a heartbeat line across its display
    pts = []
    for i in range(23):
        x = x0 + 22 + i * 4.4
        y = top + 54 - (x - x0) * 0.09
        if i in (8, 9, 10):
            y += (-18, 14, -6)[i - 8]
        pts.append(f"{f(x)},{f(y)}")
    out.append(f'<polyline points="{" ".join(pts)}" fill="none" stroke="{GOOD}" stroke-width="2" opacity=".85"/>')
    for i in range(3):
        out.append(f'<rect x="{x0 + 24 + i * 30}" y="{top + 66 - i * 3}" width="22" height="5" rx="2" fill="{(GOOD, GOLD, OPS)[i]}" opacity=".7"/>')
    out.append(f'<rect class="o-lamp" x="{mid - 14}" y="{top + 120}" width="28" height="5" rx="2.5" fill="{OPS}"/>')
    out.append(f'<text x="{mid}" y="{top - 14}" text-anchor="middle" font-family="monospace" font-size="9.5" letter-spacing="1.8" fill="{OPS}">OPS</text>')
    return "\n".join(out)


# ---------- the network panel: the switch, a port per device, cables up into the trunking ----------
def network():
    x, y, w, h = 164, 78, 140, 136
    out = [
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="url(#o-metal)" stroke="#3d3856" stroke-width="2"/>',
        f'<text x="{x + w / 2}" y="{y - 12}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{OPS}">NETWORK</text>',
        f'<rect x="{x + 10}" y="{y + 12}" width="{w - 20}" height="70" rx="6" fill="#0a0910" stroke="{OPS}" stroke-opacity=".45"/>',
    ]
    # two rows of ports, each with its link light
    for row in range(2):
        for i in range(6):
            px, py = x + 18 + i * 19, y + 22 + row * 30
            lit = rnd.random() > .3
            out.append(f'<rect x="{px}" y="{py}" width="14" height="12" rx="2" fill="#15131e" stroke="#3d3856"/>')
            if lit:
                out.append(f'<rect class="o-blink" x="{px + 2}" y="{py + 15}" width="10" height="3" rx="1.5" fill="{rnd.choice([GOOD, GOOD, GOLD])}" style="animation-delay:{f(rnd.uniform(0, 2))}s"/>')
    # the uplink, and cables rising to the ceiling trunking
    out.append(f'<rect x="{x + 10}" y="{y + 92}" width="{w - 20}" height="30" rx="6" fill="#13111b" stroke="#2e2a40"/>')
    out.append(f'<circle class="o-lamp" cx="{x + 26}" cy="{y + 107}" r="5" fill="{GOOD}"/>')
    out.append(f'<rect x="{x + 40}" y="{y + 104}" width="70" height="6" rx="3" fill="{OPS}" opacity=".5"/>')
    # patch cables across to the NAS rack
    for i, c in enumerate((OPS, BLUE, GOOD)):
        cy = y + 34 + i * 18
        out.append(f'<path d="M{x + w} {cy} C{x + w + 14} {cy} {x + w + 12} {cy + 30} 334 {cy + 30}" fill="none" stroke="{c}" stroke-width="2" opacity=".45"/>')
    return "\n".join(out)


# ---------- the NAS rack: container modules on top, drive bays below ----------
def nas():
    x, y, w, h = 334, 112, 136, 448
    out = [
        f'<ellipse cx="{x + w / 2}" cy="566" rx="90" ry="10" fill="url(#o-shadow)"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="url(#o-metal)" stroke="#3d3856" stroke-width="2"/>',
        f'<text x="{x + w / 2}" y="{y - 12}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{OPS}">NAS</text>',
        f'<rect x="{x + 12}" y="{y + 14}" width="{w - 24}" height="40" rx="5" fill="#0a0910" stroke="{OPS}" stroke-opacity=".45"/>',
    ]
    # the CPU / memory readout
    for i in range(10):
        v = rnd.uniform(.25, .9)
        out.append(f'<rect x="{x + 20 + i * 10}" y="{f(y + 48 - 28 * v)}" width="6" height="{f(28 * v)}" rx="1.5" fill="{OPS}" opacity=".7"/>')
    # four container modules, each with its lamp
    for i in range(4):
        my = y + 68 + i * 40
        out.append(f'<rect x="{x + 12}" y="{my}" width="{w - 24}" height="32" rx="5" fill="#15131e" stroke="#2e2a40"/>')
        out.append(f'<circle class="o-lamp" cx="{x + 28}" cy="{my + 16}" r="5" fill="{GOOD}" style="animation-delay:{f(i * .6)}s"/>')
        out.append(f'<rect x="{x + 42}" y="{my + 10}" width="{rnd.randint(40, 70)}" height="5" rx="2.5" fill="{OPS}" opacity=".5"/>')
        out.append(f'<rect x="{x + 42}" y="{my + 19}" width="{rnd.randint(24, 50)}" height="4" rx="2" fill="#3d3856"/>')
    # drive bays
    for j in range(4):
        dy = y + 240 + j * 48
        for i in range(2):
            dx = x + 14 + i * 56
            out.append(f'<rect x="{dx}" y="{dy}" width="52" height="40" rx="4" fill="#100e17" stroke="#2e2a40"/>')
            out.append(f'<rect x="{dx + 6}" y="{dy + 30}" width="20" height="4" rx="2" fill="{rnd.choice([GOOD, GOOD, OPS])}" opacity=".75"/>')
            out.append(f'<circle class="o-blink" cx="{dx + 42}" cy="{dy + 32}" r="2.5" fill="{GOLD}" style="animation-delay:{f(rnd.uniform(0, 2))}s"/>')
    return "\n".join(out)


# ---------- the chronometer (the schedule) over the storage bank ----------
def chronometer():
    cx, cy, r = CLOCK
    out = [
        f'<circle cx="{cx}" cy="{cy}" r="{r + 10}" fill="#13111b" stroke="#2e2a40" stroke-width="2"/>',
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#0a0910" stroke="{OPS}" stroke-opacity=".5" stroke-width="2"/>',
        f'<text x="{cx}" y="{cy - r - 18}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{OPS}">CHRONOMETER</text>',
    ]
    # 24 hour ticks, with the long ones every six hours
    for hr in range(24):
        a = math.radians(hr * 15 - 90)
        r0 = r - (14 if hr % 6 == 0 else 7)
        out.append(f'<line x1="{f(cx + r0 * math.cos(a))}" y1="{f(cy + r0 * math.sin(a))}" x2="{f(cx + (r - 2) * math.cos(a))}" y2="{f(cy + (r - 2) * math.sin(a))}" stroke="{OPS}" stroke-width="{2 if hr % 6 == 0 else 1}" opacity=".7"/>')
    for hr, label in ((0, "00"), (6, "06"), (12, "12"), (18, "18")):
        a = math.radians(hr * 15 - 90)
        out.append(f'<text x="{f(cx + (r - 26) * math.cos(a))}" y="{f(cy + (r - 26) * math.sin(a) + 3.5)}" text-anchor="middle" font-family="monospace" font-size="9" fill="{OPS}" opacity=".75">{label}</text>')
    # the night's jobs as arcs on the inner ring
    for start, length, c in ((3.5, 1.2, GOOD), (4, .6, GOLD), (10, 24, OPS), (22.5, 1.5, BLUE)):
        a0, a1 = math.radians(start * 15 - 90), math.radians(min(start + length, start + 23.9) * 15 - 90)
        rr = r - 40
        large = 1 if length > 12 else 0
        if length >= 24:
            out.append(f'<circle cx="{cx}" cy="{cy}" r="{rr}" fill="none" stroke="{c}" stroke-width="3" opacity=".25"/>')
            continue
        out.append(f'<path d="M{f(cx + rr * math.cos(a0))} {f(cy + rr * math.sin(a0))} A{rr} {rr} 0 {large} 1 {f(cx + rr * math.cos(a1))} {f(cy + rr * math.sin(a1))}" fill="none" stroke="{c}" stroke-width="5" stroke-linecap="round" opacity=".8"/>')
    # the hand
    out += [
        f'<g class="o-hand" style="transform-origin:{cx}px {cy}px"><line x1="{cx}" y1="{cy}" x2="{cx}" y2="{cy - r + 18}" stroke="{GOLD}" stroke-width="3" stroke-linecap="round"/></g>',
        f'<circle cx="{cx}" cy="{cy}" r="6" fill="{GOLD}"/>',
    ]
    return "\n".join(out)


# ---------- the storage bank ----------
def storage():
    x, y, w, h = 500, 384, 182, 176
    out = [
        f'<ellipse cx="{x + w / 2}" cy="566" rx="110" ry="10" fill="url(#o-shadow)"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="url(#o-metal)" stroke="#3d3856" stroke-width="2"/>',
        f'<text x="{x + w / 2}" y="{y - 12}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{OPS}">STORAGE</text>',
    ]
    # three volumes, each a fill gauge
    for i, fill in enumerate((.61, .86, .34)):
        gy = y + 18 + i * 50
        c = GOLD if fill > .8 else GOOD
        out.append(f'<rect x="{x + 14}" y="{gy}" width="{w - 28}" height="38" rx="6" fill="#0a0910" stroke="#2e2a40"/>')
        out.append(f'<rect x="{x + 22}" y="{gy + 22}" width="{w - 44}" height="8" rx="4" fill="#1f1c2c"/>')
        out.append(f'<rect x="{x + 22}" y="{gy + 22}" width="{f((w - 44) * fill)}" height="8" rx="4" fill="{c}" opacity=".8"/>')
        for k in range(5):
            out.append(f'<rect x="{x + 22 + k * 14}" y="{gy + 8}" width="10" height="6" rx="1.5" fill="{OPS}" opacity="{f(rnd.uniform(.3, .7))}"/>')
    return "\n".join(out)


# ---------- the backup vault ----------
def vault():
    x, y, w, h = 712, 300, 132, 260
    cx, cy = x + w / 2, y + 120
    out = [
        f'<ellipse cx="{cx}" cy="566" rx="86" ry="10" fill="url(#o-shadow)"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="url(#o-metal)" stroke="#3d3856" stroke-width="2"/>',
        f'<rect x="{x + 10}" y="{y + 10}" width="{w - 20}" height="{h - 20}" rx="8" fill="#13111b" stroke="#2e2a40"/>',
        f'<text x="{cx}" y="{y - 12}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{OPS}">BACKUP VAULT</text>',
        f'<circle cx="{cx}" cy="{cy}" r="40" fill="#0a0910" stroke="{OPS}" stroke-opacity=".55" stroke-width="3"/>',
        f'<circle cx="{cx}" cy="{cy}" r="10" fill="#2e2a40" stroke="{OPS}" stroke-opacity=".7"/>',
    ]
    for k in range(6):
        a = math.radians(k * 60)
        out.append(f'<line x1="{f(cx + 12 * math.cos(a))}" y1="{f(cy + 12 * math.sin(a))}" x2="{f(cx + 34 * math.cos(a))}" y2="{f(cy + 34 * math.sin(a))}" stroke="{OPS}" stroke-width="4" stroke-linecap="round" opacity=".65"/>')
    # a slot of tape cartridges under the wheel
    for i in range(5):
        c = rnd.choice([GOOD, GOOD, GOLD, OPS])
        out.append(f'<rect x="{x + 22 + i * 18}" y="{y + 186}" width="14" height="36" rx="3" fill="#100e17" stroke="{c}" stroke-opacity=".7"/>')
        out.append(f'<rect x="{x + 25 + i * 18}" y="{y + 190}" width="8" height="4" rx="1" fill="{c}" opacity=".8"/>')
    out.append(f'<circle class="o-lamp" cx="{x + w - 22}" cy="{y + 28}" r="5" fill="{GOOD}"/>')
    return "\n".join(out)


# ---------- the Ops wall screen ----------
def work_screen():
    x, y, w, h = SCREEN
    return "\n".join([
        f'<rect x="{x - 14}" y="{y - 14}" width="{w + 28}" height="{h + 28}" rx="16" fill="#13111b" stroke="#2e2a40" stroke-width="2"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#08070d"/>',
        f'<rect x="{x - 14}" y="{y + h + 14}" width="{w + 28}" height="5" rx="2.5" fill="{OPS}" opacity=".35"/>',
    ])


# ---------- the usage desk (the page lays the live rail gauges on its top) ----------
def desk():
    x, y, w, h = DESK
    out = [
        f'<ellipse cx="{x + w / 2}" cy="728" rx="{w / 2 + 20}" ry="12" fill="url(#o-shadow)"/>',
        f'<path d="M{x - 8} {y - 10} H{x + w + 8} L{x + w - 10} 722 H{x + 10} Z" fill="url(#o-metal)" stroke="#3d3856" stroke-width="2"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="#0a0910" stroke="{OPS}" stroke-opacity=".45"/>',
        f'<rect x="{x - 8}" y="{y - 14}" width="{w + 16}" height="6" rx="3" fill="{OPS}" opacity=".4"/>',
        f'<text x="{x + w / 2}" y="{y + h + 22}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{OPS}" opacity=".85">USAGE DESK · THE RAILS</text>',
    ]
    return "\n".join(out)


# ---------- the status board table (the page lays a chip per check on it) ----------
def table():
    x, y, w, h = TABLE
    return "\n".join([
        f'<ellipse cx="{x + w / 2}" cy="730" rx="{w / 2 + 30}" ry="12" fill="url(#o-shadow)"/>',
        f'<path d="M{x - 20} {y - 12} H{x + w + 20} L{x + w + 6} 724 H{x - 6} Z" fill="url(#o-metal)" stroke="#3d3856" stroke-width="2"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="#0a0910" stroke="{OPS}" stroke-opacity=".45"/>',
        f'<rect x="{x - 20}" y="{y - 16}" width="{w + 40}" height="6" rx="3" fill="{OPS}" opacity=".45"/>',
        f'<text x="{x + w / 2}" y="{y + h + 22}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{OPS}" opacity=".85">STATUS BOARD · EVERY CHECK</text>',
    ])


# ---------- the GPU tower: Ollama's box, its fans glow with the local rail ----------
def gpu():
    x, y, w, h = 1462, 150, 124, 570
    cx = x + w / 2
    out = [
        f'<ellipse cx="{cx}" cy="{y + h + 4}" rx="90" ry="12" fill="url(#o-shadow)"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="url(#o-metal)" stroke="#3d3856" stroke-width="2"/>',
        f'<text x="{cx}" y="{y + 36}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="{OPS}">GPU</text>',
        f'<rect x="{x + 14}" y="{y + 50}" width="{w - 28}" height="370" rx="8" fill="#0a0910" stroke="{OPS}" stroke-opacity=".4"/>',
    ]
    # three fans
    for k in range(3):
        fy = y + 112 + k * 116
        out.append(f'<circle class="o-glow" cx="{cx}" cy="{fy}" r="46" fill="{FAN}" opacity=".12"/>')
        out.append(f'<circle cx="{cx}" cy="{fy}" r="42" fill="none" stroke="#3d3856" stroke-width="3"/>')
        out.append(f'<g class="o-fan" style="transform-origin:{f(cx)}px {fy}px;animation-delay:{f(k * .3)}s">')
        for b in range(7):
            a = math.radians(b * 360 / 7)
            a2 = a + math.radians(28)
            out.append(f'<path class="o-glow" d="M{cx} {fy} L{f(cx + 36 * math.cos(a))} {f(fy + 36 * math.sin(a))} A36 36 0 0 1 {f(cx + 36 * math.cos(a2))} {f(fy + 36 * math.sin(a2))} Z" fill="{FAN}" opacity=".55"/>')
        out.append("</g>")
        out.append(f'<circle cx="{cx}" cy="{fy}" r="9" fill="#2e2a40"/>')
    out += [
        f'<rect x="{x + 20}" y="{y + 440}" width="{w - 40}" height="10" rx="5" fill="#1f1c2c"/>',
        f'<rect class="o-glow" x="{x + 20}" y="{y + 440}" width="{f((w - 40) * .62)}" height="10" rx="5" fill="{FAN}" opacity=".75"/>',
        f'<text x="{cx}" y="{y + 474}" text-anchor="middle" font-family="monospace" font-size="9" letter-spacing="1.6" fill="{OPS}" opacity=".85">VRAM</text>',
        f'<rect x="{x + 20}" y="{y + 490}" width="{w - 40}" height="60" rx="6" fill="#13111b" stroke="#2e2a40"/>',
        f'<circle class="o-lamp" cx="{cx}" cy="{y + 520}" r="6" fill="{LOCAL}"/>',
    ]
    return "\n".join(out)


# ---------- highlights for the things you can pick (lib/ops.ts SPOTS) ----------
def highlights():
    glow = 'fill="none" stroke="#e6dcff" stroke-width="3" filter="url(#o-blur)"'
    cx, cy, r = CLOCK
    return "\n".join([
        f'<rect id="o-hl-bridge" class="o-hl" x="14" y="140" width="126" height="424" rx="10" {glow}/>',
        f'<rect id="o-hl-ops" class="o-hl" x="160" y="250" width="148" height="316" rx="12" {glow}/>',
        f'<rect id="o-hl-net" class="o-hl" x="156" y="70" width="156" height="152" rx="12" {glow}/>',
        f'<rect id="o-hl-nas" class="o-hl" x="326" y="104" width="152" height="462" rx="12" {glow}/>',
        f'<circle id="o-hl-clock" class="o-hl" cx="{cx}" cy="{cy}" r="{r + 14}" {glow}/>',
        f'<rect id="o-hl-storage" class="o-hl" x="492" y="376" width="198" height="190" rx="12" {glow}/>',
        f'<rect id="o-hl-vault" class="o-hl" x="704" y="292" width="148" height="274" rx="14" {glow}/>',
        f'<path id="o-hl-desk" class="o-hl" d="M952 584 H1380 L1362 726 H970 Z" {glow}/>',
        f'<rect id="o-hl-gpu" class="o-hl" x="1458" y="146" width="132" height="578" rx="14" {glow}/>',
    ])


DEFS = """<defs>
<filter id="o-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
<linearGradient id="o-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#12111b"/><stop offset=".7" stop-color="#0e0d16"/><stop offset="1" stop-color="#09080e"/></linearGradient>
<linearGradient id="o-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14121c"/><stop offset="1" stop-color="#07060b"/></linearGradient>
<linearGradient id="o-downlight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6dcff" stop-opacity=".07"/><stop offset="1" stop-color="#e6dcff" stop-opacity="0"/></linearGradient>
<linearGradient id="o-door" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a1825"/><stop offset=".5" stop-color="#282438"/><stop offset="1" stop-color="#1a1825"/></linearGradient>
<linearGradient id="o-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#16141f"/><stop offset=".5" stop-color="#24212f"/><stop offset="1" stop-color="#13111b"/></linearGradient>
<radialGradient id="o-shadow"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="o-vignette" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
</defs>"""


def build():
    body = "\n".join([
        DEFS,
        "<!-- the room -->", room(),
        "<!-- the turbolift door -->", door(),
        "<!-- the network panel -->", network(),
        "<!-- the Ops console -->", console(),
        "<!-- the NAS rack -->", nas(),
        "<!-- the chronometer -->", chronometer(),
        "<!-- the storage bank -->", storage(),
        "<!-- the backup vault -->", vault(),
        "<!-- the work screen -->", work_screen(),
        "<!-- the usage desk -->", desk(),
        "<!-- the status board -->", table(),
        "<!-- the GPU tower -->", gpu(),
        "<!-- highlights -->", highlights(),
        f'<rect width="{W}" height="{H}" fill="url(#o-vignette)" pointer-events="none"/>',
    ])
    return (f'<svg class="ops-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" aria-hidden="true">\n'
            f"{body}\n</svg>\n")


if __name__ == "__main__":
    svg = build()
    OUT.write_text(svg)
    print(OUT, len(svg), "bytes")
