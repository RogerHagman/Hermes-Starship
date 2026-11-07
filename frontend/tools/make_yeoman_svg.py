"""Build frontend/src/assets/yeoman.svg: the Yeoman's post (Deck 2), by the Captain's door.

    python3 frontend/tools/make_yeoman_svg.py

Left to right: the turbolift door, the wall clock (the next 48 hours) over the wall calendar (the
recurring dates), the pigeonholes (what the Captain is waiting for), the Yeoman's wall screen, the
reminder chime over the filing cabinet (the done log), and the Captain's door. In front, the
Yeoman's desk: the in-tray with its PADDs (how to say it), the matrix laid on the desk top, and the
Yeoman's own console.

The page lays the matrix (a count per box) and the wall screen over this picture by position, so
if you move something here, move it in lib/yeoman.ts too (TABLE, SCREEN, SPOTS).
Everything is drawn in a 1600 x 740 box. The small lights come from a fixed seed.
"""
import math
import random
from pathlib import Path

W, H = 1600, 740
OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "yeoman.svg"
rnd = random.Random(1701)

YEO, GOLD, LOCAL, PAPER = "#7fd8c0", "#e8c37a", "#3fc1a5", "#e9e1cf"
BOXES = ("#8fd14f", "#5aa7f0", "#f5a83a", "#f0605a")   # do first, schedule, delegate, don't do
TABLE = (392, 600, 640, 100)    # the matrix on the desk top (lib/yeoman.ts)
SCREEN = (536, 40, 716, 456)    # the wall screen (lib/yeoman.ts)


def f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


def label(x, y, text, size=10, op=1, fill=YEO):
    return (f'<text x="{f(x)}" y="{f(y)}" text-anchor="middle" font-family="monospace" font-size="{size}" '
            f'letter-spacing="2" fill="{fill}" opacity="{op}">{text}</text>')


# ---------- the room ----------
def room():
    out = [
        f'<rect width="{W}" height="{H}" fill="url(#y-wall)"/>',
        '<rect width="1600" height="30" fill="#07090d"/>',
        '<rect x="150" y="26" width="1300" height="4" rx="2" fill="#fff2d8" opacity=".14"/>',
        '<rect x="150" y="30" width="1300" height="70" fill="url(#y-downlight)"/>',
        "".join(f'<line x1="{x}" y1="30" x2="{x}" y2="560" stroke="#141a22" stroke-width="2"/>' for x in range(150, 1600, 140)),
        # a wainscot rail, warmer than the decks below
        '<rect x="0" y="500" width="1600" height="60" fill="#0b0f15"/>',
        f'<rect x="0" y="498" width="1600" height="3" fill="{GOLD}" opacity=".18"/>',
        '<polygon points="0,560 1600,560 1600,740 0,740" fill="url(#y-floor)"/>',
        '<line x1="0" y1="560" x2="1600" y2="560" stroke="#2a3340" stroke-width="2"/>',
        "".join(f'<line x1="{800 + (x - 800) * 0.55}" y1="560" x2="{x}" y2="740" stroke="#10151c" stroke-width="1.5"/>' for x in range(-400, 2001, 200)),
        # a runner from the Captain's door to the desk
        '<polygon points="1380,560 1590,560 1600,740 1180,740" fill="#141019" opacity=".9"/>',
        f'<polygon points="1392,566 1578,566 1584,734 1206,734" fill="none" stroke="{GOLD}" stroke-opacity=".22"/>',
    ]
    return "\n".join(out)


# ---------- the turbolift door ----------
def door():
    x0, x1, top = 22, 132, 150
    mid = (x0 + x1) / 2
    return "\n".join([
        f'<rect x="{x0 - 8}" y="{top - 10}" width="{x1 - x0 + 16}" height="{560 - top + 10}" rx="8" fill="#0f141b" stroke="#2a3340" stroke-width="2"/>',
        f'<rect x="{x0}" y="{top}" width="{x1 - x0}" height="{560 - top}" rx="4" fill="url(#y-door)"/>',
        f'<line x1="{mid}" y1="{top}" x2="{mid}" y2="560" stroke="#07090d" stroke-width="3"/>',
        f'<rect x="{x0 + 10}" y="{top + 16}" width="{x1 - x0 - 20}" height="6" rx="3" fill="{YEO}" opacity=".6"/>',
        label(mid, top - 18, "TURBOLIFT"),
        f'<rect class="y-lamp" x="{x1 + 2}" y="330" width="6" height="30" rx="3" fill="{LOCAL}"/>',
    ])


# ---------- the wall clock: a 48-hour dial ----------
def clock():
    cx, cy, r = 232, 122, 62
    out = [
        f'<circle cx="{cx}" cy="{cy}" r="{r + 8}" fill="#10161e" stroke="#2a3340" stroke-width="2"/>',
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#06090d" stroke="{YEO}" stroke-opacity=".4"/>',
        f'<circle cx="{cx}" cy="{cy}" r="{r - 16}" fill="none" stroke="{YEO}" stroke-opacity=".18" stroke-dasharray="2 4"/>',
    ]
    for i in range(48):
        a = i / 48 * 2 * math.pi - math.pi / 2
        long = i % 6 == 0
        r0 = r - (10 if long else 5)
        out.append(f'<line x1="{f(cx + r0 * math.cos(a))}" y1="{f(cy + r0 * math.sin(a))}" x2="{f(cx + (r - 2) * math.cos(a))}" '
                   f'y2="{f(cy + (r - 2) * math.sin(a))}" stroke="{YEO}" stroke-opacity="{.8 if long else .35}" stroke-width="{2 if long else 1}"/>')
    # the urgent window: the first half of the dial is the next 24 hours, the whole dial 48
    out.append(f'<path d="M{cx} {cy - r + 18} A{r - 18} {r - 18} 0 1 1 {f(cx - .1)} {cy - r + 18}" fill="none" stroke="{GOLD}" stroke-opacity=".28" stroke-width="5"/>')
    out.append(f'<g class="y-hand" style="transform-origin:{cx}px {cy}px">'
               f'<line x1="{cx}" y1="{cy}" x2="{cx}" y2="{cy - r + 12}" stroke="{PAPER}" stroke-width="3" stroke-linecap="round"/></g>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="5" fill="{GOLD}"/>')
    out.append(label(cx, cy + 26, "48 H", 9, .8))
    return "\n".join(out)


# ---------- the wall calendar: the recurring dates ----------
def calendar():
    x, y, w, h = 176, 228, 136, 176
    out = [
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{PAPER}" opacity=".9"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="26" rx="6" fill="#b44a3c"/>',
        f'<rect x="{x}" y="{y + 18}" width="{w}" height="8" fill="#b44a3c"/>',
        f'<circle cx="{x + 30}" cy="{y}" r="4" fill="#2a3340"/><circle cx="{x + w - 30}" cy="{y}" r="4" fill="#2a3340"/>',
    ]
    marks = {3: GOLD, 9: LOCAL, 16: LOCAL, 24: "#5aa7f0", 23: LOCAL}
    for i in range(35):
        cxx = x + 12 + (i % 7) * 17.5
        cyy = y + 40 + (i // 7) * 26
        out.append(f'<rect x="{f(cxx)}" y="{f(cyy)}" width="13" height="18" rx="2" fill="#cfc6b2"/>')
        if i in marks:
            out.append(f'<circle cx="{f(cxx + 6.5)}" cy="{f(cyy + 9)}" r="7" fill="none" stroke="{marks[i]}" stroke-width="2.5"/>')
    out.append(label(x + w / 2, y + h + 20, "CALENDAR"))
    return "\n".join(out)


# ---------- the pigeonholes: what the Captain is waiting for ----------
def pigeonholes():
    x, y, w, h = 338, 140, 172, 280
    cols, rows = 3, 5
    cw, ch = (w - 16) / cols, (h - 16) / rows
    out = [
        f'<ellipse cx="{x + w / 2}" cy="{y + h + 8}" rx="{w / 2 + 10}" ry="8" fill="url(#y-shadow)"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="url(#y-wood)" stroke="#3a2c20" stroke-width="2"/>',
    ]
    for r_ in range(rows):
        for c in range(cols):
            cx0 = x + 8 + c * cw
            cy0 = y + 8 + r_ * ch
            out.append(f'<rect x="{f(cx0 + 2)}" y="{f(cy0 + 2)}" width="{f(cw - 4)}" height="{f(ch - 4)}" rx="2" fill="#120d09"/>')
            if rnd.random() < .45:
                tilt = rnd.uniform(-6, 6)
                ew = cw - 14
                out.append(f'<g transform="rotate({f(tilt)} {f(cx0 + cw / 2)} {f(cy0 + ch / 2)})">'
                           f'<rect x="{f(cx0 + 7)}" y="{f(cy0 + 12)}" width="{f(ew)}" height="{f(ch - 22)}" rx="1.5" fill="{PAPER}" opacity=".85"/>'
                           f'<path d="M{f(cx0 + 7)} {f(cy0 + 12)} L{f(cx0 + 7 + ew / 2)} {f(cy0 + ch / 2)} L{f(cx0 + 7 + ew)} {f(cy0 + 12)}" fill="none" stroke="#9c927e"/></g>')
                if rnd.random() < .35:
                    out.append(f'<circle class="y-late" cx="{f(cx0 + cw - 10)}" cy="{f(cy0 + 10)}" r="3.5" fill="{BOXES[2]}"/>')
    out.append(label(x + w / 2, y - 12, "WAITING FOR"))
    return "\n".join(out)


# ---------- the wall screen ----------
def screen():
    x, y, w, h = SCREEN
    return "\n".join([
        f'<rect x="{x - 14}" y="{y - 12}" width="{w + 28}" height="{h + 26}" rx="16" fill="#10161e" stroke="#2a3340" stroke-width="2"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#04070b"/>',
        f'<rect x="{x - 14}" y="{y + h + 14}" width="{w + 28}" height="5" rx="2.5" fill="{YEO}" opacity=".28"/>',
    ])


# ---------- the reminder chime: rings when code fires a reminder ----------
def chime():
    cx, top = 1330, 84
    out = [
        f'<rect x="{cx - 50}" y="{top}" width="100" height="168" rx="10" fill="#10161e" stroke="#2a3340" stroke-width="2"/>',
        f'<path d="M{cx - 26} {top + 92} Q{cx - 26} {top + 40} {cx} {top + 36} Q{cx + 26} {top + 40} {cx + 26} {top + 92} L{cx + 32} {top + 100} H{cx - 32} Z" '
        f'fill="url(#y-brass)" stroke="#6b5326" stroke-width="1.5"/>',
        f'<circle cx="{cx}" cy="{top + 106}" r="6" fill="url(#y-brass)"/>',
        f'<circle cx="{cx}" cy="{top + 30}" r="5" fill="#6b5326"/>',
        f'<path class="y-ring" d="M{cx - 40} {top + 52} q-8 18 0 36 M{cx + 40} {top + 52} q8 18 0 36" fill="none" stroke="{GOLD}" stroke-width="2.5" stroke-linecap="round"/>',
    ]
    for i in range(6):
        out.append(f'<rect class="y-fired" x="{cx - 38 + i * 13}" y="{top + 132}" width="9" height="16" rx="2" fill="{LOCAL}" opacity="{f(rnd.uniform(.35, .9))}"/>')
    out.append(label(cx, top - 12, "REMINDERS"))
    return "\n".join(out)


# ---------- the filing cabinet: the done log ----------
def cabinet():
    x, y, w, h = 1278, 318, 104, 240
    out = [
        f'<ellipse cx="{x + w / 2}" cy="{y + h + 4}" rx="{w / 2 + 14}" ry="8" fill="url(#y-shadow)"/>',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="url(#y-metal)" stroke="#36414f" stroke-width="2"/>',
    ]
    for i in range(4):
        dy = y + 10 + i * 57
        out.append(f'<rect x="{x + 8}" y="{dy}" width="{w - 16}" height="49" rx="4" fill="#141b24" stroke="#2a3340"/>')
        out.append(f'<rect x="{x + w / 2 - 16}" y="{dy + 20}" width="32" height="7" rx="3.5" fill="#3a4757"/>')
        out.append(f'<rect x="{x + w / 2 - 12}" y="{dy + 8}" width="24" height="8" rx="1" fill="{PAPER}" opacity=".6"/>')
    # a drawer stands open: the newest closed items
    out.append(f'<rect x="{x - 6}" y="{y + 10}" width="{w + 12}" height="14" rx="3" fill="#1a222d" stroke="#36414f"/>')
    for i in range(7):
        out.append(f'<rect x="{x + 4 + i * 13}" y="{y + 1 + rnd.choice([0, 2, 4])}" width="10" height="14" rx="1" fill="{PAPER}" opacity="{f(rnd.uniform(.55, .9))}"/>')
    out.append(label(x + w / 2, y - 14, "DONE LOG"))
    return "\n".join(out)


# ---------- the Captain's door ----------
def captains_door():
    x0, x1, top = 1418, 1570, 124
    mid = (x0 + x1) / 2
    return "\n".join([
        f'<rect x="{x0 - 12}" y="{top - 14}" width="{x1 - x0 + 24}" height="{560 - top + 14}" rx="10" fill="#141019" stroke="{GOLD}" stroke-opacity=".45" stroke-width="2"/>',
        f'<rect x="{x0}" y="{top}" width="{x1 - x0}" height="{560 - top}" rx="5" fill="url(#y-cdoor)"/>',
        f'<line x1="{mid}" y1="{top}" x2="{mid}" y2="560" stroke="#07090d" stroke-width="3"/>',
        f'<rect x="{x0 + 14}" y="{top + 20}" width="{x1 - x0 - 28}" height="4" rx="2" fill="{GOLD}" opacity=".7"/>',
        f'<rect x="{mid - 34}" y="{top + 196}" width="68" height="40" rx="6" fill="#0c0a10" stroke="{GOLD}" stroke-opacity=".6"/>',
        f'<text x="{mid}" y="{top + 213}" text-anchor="middle" font-family="monospace" font-size="9" letter-spacing="1.5" fill="{GOLD}">CAPTAIN</text>',
        f'<text x="{mid}" y="{top + 228}" text-anchor="middle" font-family="monospace" font-size="8" letter-spacing="1.5" fill="{GOLD}" opacity=".7">QUARTERS</text>',
        f'<rect class="y-lamp" x="{x0 - 22}" y="300" width="6" height="30" rx="3" fill="{GOLD}"/>',
        label(mid, top - 24, "CAPTAIN'S DOOR", 10, 1, GOLD),
    ])


# ---------- the desk: in-tray, matrix top and the Yeoman's console ----------
def desk():
    x, y, w, h = TABLE
    dx0, dx1 = 180, 1260
    out = [
        f'<ellipse cx="{(dx0 + dx1) / 2}" cy="730" rx="{(dx1 - dx0) / 2 + 30}" ry="12" fill="url(#y-shadow)"/>',
        f'<path d="M{dx0 - 10} {y - 18} H{dx1 + 10} L{dx1 - 8} 726 H{dx0 + 8} Z" fill="url(#y-wood)" stroke="#3a2c20" stroke-width="2"/>',
        f'<rect x="{dx0 - 10}" y="{y - 22}" width="{dx1 - dx0 + 20}" height="6" rx="3" fill="{GOLD}" opacity=".3"/>',
        # the matrix top
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="#06090d" stroke="{YEO}" stroke-opacity=".4"/>',
        label(x + w / 2, y + h + 20, "THE MATRIX · URGENT AND IMPORTANT", 10, .85),
    ]
    # the in-tray with its PADDs
    tx, ty = 206, 604
    out.append(f'<path d="M{tx} {ty + 14} H{tx + 130} L{tx + 122} {ty + 62} H{tx + 8} Z" fill="#1a1712" stroke="#4a3b28" stroke-width="2"/>')
    for i in range(4):
        out.append(f'<rect x="{tx + 14 + i * 4}" y="{ty + 2 - i * 6}" width="96" height="26" rx="4" fill="#0f141b" stroke="#2a3340" '
                   f'transform="rotate({f(rnd.uniform(-4, 4))} {tx + 62} {ty + 14})"/>')
    out.append(f'<rect x="{tx + 26}" y="{ty - 12}" width="64" height="12" rx="2" fill="{YEO}" opacity=".5"/>')
    out.append(label(tx + 66, ty + 86, "IN-TRAY"))
    # the Yeoman's console
    cx0 = 1068
    out.append(f'<path d="M{cx0} {y + 6} L{cx0 + 170} {y - 6} L{cx0 + 162} {y + 66} L{cx0 + 8} {y + 74} Z" fill="#06090d" stroke="{YEO}" stroke-opacity=".5"/>')
    for i in range(5):
        out.append(f'<rect x="{cx0 + 18}" y="{f(y + 10 + i * 11 - i * .8)}" width="{rnd.randint(60, 128)}" height="4" rx="2" fill="{YEO}" opacity=".55"/>')
    out.append(f'<rect class="y-lamp" x="{cx0 + 130}" y="{y + 52}" width="20" height="4" rx="2" fill="{LOCAL}"/>')
    out.append(label(cx0 + 86, y + 100, "YEOMAN"))
    return "\n".join(out)


# ---------- highlights for the things you can pick (lib/yeoman.ts SPOTS) ----------
def highlights():
    glow = 'fill="none" stroke="#fff2d8" stroke-width="3" filter="url(#y-blur)"'
    return "\n".join([
        f'<rect id="y-hl-bridge" class="y-hl" x="14" y="140" width="126" height="424" rx="10" {glow}/>',
        f'<circle id="y-hl-clock" class="y-hl" cx="232" cy="122" r="76" {glow}/>',
        f'<rect id="y-hl-calendar" class="y-hl" x="166" y="218" width="156" height="200" rx="10" {glow}/>',
        f'<rect id="y-hl-waiting" class="y-hl" x="328" y="118" width="192" height="316" rx="10" {glow}/>',
        f'<rect id="y-hl-chime" class="y-hl" x="1272" y="64" width="116" height="198" rx="12" {glow}/>',
        f'<rect id="y-hl-done" class="y-hl" x="1266" y="294" width="128" height="272" rx="10" {glow}/>',
        f'<rect id="y-hl-door" class="y-hl" x="1400" y="96" width="188" height="468" rx="12" {glow}/>',
        f'<rect id="y-hl-intray" class="y-hl" x="194" y="580" width="166" height="130" rx="12" {glow}/>',
        f'<rect id="y-hl-desk" class="y-hl" x="1056" y="580" width="196" height="140" rx="12" {glow}/>',
    ])


DEFS = f"""<defs>
<filter id="y-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
<linearGradient id="y-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f131a"/><stop offset=".7" stop-color="#0b0e14"/><stop offset="1" stop-color="#07090d"/></linearGradient>
<linearGradient id="y-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10141b"/><stop offset="1" stop-color="#05070a"/></linearGradient>
<linearGradient id="y-downlight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2d8" stop-opacity=".07"/><stop offset="1" stop-color="#fff2d8" stop-opacity="0"/></linearGradient>
<linearGradient id="y-door" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#131922"/><stop offset=".5" stop-color="#1f2833"/><stop offset="1" stop-color="#131922"/></linearGradient>
<linearGradient id="y-cdoor" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a1420"/><stop offset=".5" stop-color="#2a2132"/><stop offset="1" stop-color="#1a1420"/></linearGradient>
<linearGradient id="y-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#121821"/><stop offset=".5" stop-color="#1e2733"/><stop offset="1" stop-color="#0f141b"/></linearGradient>
<linearGradient id="y-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2018"/><stop offset="1" stop-color="#17110c"/></linearGradient>
<linearGradient id="y-brass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a5e2c"/><stop offset=".45" stop-color="#e8c37a"/><stop offset="1" stop-color="#6b5326"/></linearGradient>
<radialGradient id="y-shadow"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="y-vignette" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
</defs>"""


def build():
    body = "\n".join([
        DEFS,
        "<!-- the room -->", room(),
        "<!-- the turbolift door -->", door(),
        "<!-- the wall clock -->", clock(),
        "<!-- the calendar -->", calendar(),
        "<!-- the pigeonholes -->", pigeonholes(),
        "<!-- the wall screen -->", screen(),
        "<!-- the reminder chime -->", chime(),
        "<!-- the filing cabinet -->", cabinet(),
        "<!-- the Captain's door -->", captains_door(),
        "<!-- the desk -->", desk(),
        "<!-- highlights -->", highlights(),
        f'<rect width="{W}" height="{H}" fill="url(#y-vignette)" pointer-events="none"/>',
    ])
    return (f'<svg class="yeoman-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" aria-hidden="true">\n'
            f"{body}\n</svg>\n")


if __name__ == "__main__":
    svg = build()
    OUT.write_text(svg)
    print(OUT, len(svg), "bytes")
