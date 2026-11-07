"""Build the room pictures for the four Bridge posts that have their own board:

    python3 frontend/tools/make_bridge_posts_svg.py

    src/assets/xo.svg          Number One's post: the comm channels, the fast-path plaque, the hails,
                               the rail-rules cabinet, the briefing room door, and a wider wall screen
                               for the routing fan.
    src/assets/helm.svg        Helm: the job-ad board, the gates, the follow-up chronometer, the method.
    src/assets/nav.svg         Navigation: the star chart (trips), the week grid, the booking terminal,
                               the slot board for the Yeoman's Schedule box, the door to Helm.
    src/assets/viewscreen.svg  The Main Viewscreen: the on-screen switch, the approve panel, the
                               Telegram relay, the never-yolo plaque, the session log.

Every room shares one layout: the turbolift on the left, a wall screen in the middle (the page lays
its views there), and a desk in front with a top the page lays its tiles on. If you move something,
move it in that board's lib file too (SPOTS, TABLE, SCREEN). Each picture is a 1600 x 740 box; the
small lights come from a fixed seed. Ids carry a prefix per room (x-, h-, n-, v-).
"""
import math
import random
from pathlib import Path

W, H = 1600, 740
ASSETS = Path(__file__).resolve().parent.parent / "src" / "assets"
TABLE = (392, 600, 640, 100)   # the desk top (each board's lib file)
SCREEN = (536, 40, 716, 456)   # the wall screen (each board's lib file)
GOLD, PAPER, LOCAL, CODEX, CLAUDE = "#e8c37a", "#e9e1cf", "#3fc1a5", "#f0a948", "#e889b6"


def f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


class Room:
    def __init__(self, p, accent, seed):
        self.p, self.a, self.rnd = p, accent, random.Random(seed)

    def label(self, x, y, text, size=10, op=1, fill=None):
        return (f'<text x="{f(x)}" y="{f(y)}" text-anchor="middle" font-family="monospace" font-size="{size}" '
                f'letter-spacing="2" fill="{fill or self.a}" opacity="{op}">{text}</text>')

    def defs(self):
        p = self.p
        return f"""<defs>
<filter id="{p}-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
<linearGradient id="{p}-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f131a"/><stop offset=".7" stop-color="#0b0e14"/><stop offset="1" stop-color="#07090d"/></linearGradient>
<linearGradient id="{p}-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10141b"/><stop offset="1" stop-color="#05070a"/></linearGradient>
<linearGradient id="{p}-downlight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2d8" stop-opacity=".07"/><stop offset="1" stop-color="#fff2d8" stop-opacity="0"/></linearGradient>
<linearGradient id="{p}-door" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#131922"/><stop offset=".5" stop-color="#1f2833"/><stop offset="1" stop-color="#131922"/></linearGradient>
<linearGradient id="{p}-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#121821"/><stop offset=".5" stop-color="#1e2733"/><stop offset="1" stop-color="#0f141b"/></linearGradient>
<linearGradient id="{p}-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b222c"/><stop offset="1" stop-color="#0c1016"/></linearGradient>
<linearGradient id="{p}-cork" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2c1e"/><stop offset="1" stop-color="#2a1f15"/></linearGradient>
<linearGradient id="{p}-brass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a5e2c"/><stop offset=".45" stop-color="#e8c37a"/><stop offset="1" stop-color="#6b5326"/></linearGradient>
<linearGradient id="{p}-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d2030"/><stop offset="1" stop-color="#07101c"/></linearGradient>
<radialGradient id="{p}-shadow"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="{p}-space" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#0c1630"/><stop offset="1" stop-color="#03050a"/></radialGradient>
<radialGradient id="{p}-vignette" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
</defs>"""

    # ---------- shared pieces ----------
    def room(self):
        p = self.p
        return "\n".join([
            f'<rect width="{W}" height="{H}" fill="url(#{p}-wall)"/>',
            '<rect width="1600" height="30" fill="#07090d"/>',
            '<rect x="150" y="26" width="1300" height="4" rx="2" fill="#fff2d8" opacity=".14"/>',
            f'<rect x="150" y="30" width="1300" height="70" fill="url(#{p}-downlight)"/>',
            "".join(f'<line x1="{x}" y1="30" x2="{x}" y2="560" stroke="#141a22" stroke-width="2"/>' for x in range(150, 1600, 140)),
            '<rect x="0" y="500" width="1600" height="60" fill="#0b0f15"/>',
            f'<rect x="0" y="498" width="1600" height="3" fill="{self.a}" opacity=".18"/>',
            f'<polygon points="0,560 1600,560 1600,740 0,740" fill="url(#{p}-floor)"/>',
            '<line x1="0" y1="560" x2="1600" y2="560" stroke="#2a3340" stroke-width="2"/>',
            "".join(f'<line x1="{800 + (x - 800) * 0.55}" y1="560" x2="{x}" y2="740" stroke="#10151c" stroke-width="1.5"/>' for x in range(-400, 2001, 200)),
        ])

    def turbolift(self):
        x0, x1, top = 22, 132, 150
        mid = (x0 + x1) / 2
        p = self.p
        return "\n".join([
            f'<rect x="{x0 - 8}" y="{top - 10}" width="{x1 - x0 + 16}" height="{560 - top + 10}" rx="8" fill="#0f141b" stroke="#2a3340" stroke-width="2"/>',
            f'<rect x="{x0}" y="{top}" width="{x1 - x0}" height="{560 - top}" rx="4" fill="url(#{p}-door)"/>',
            f'<line x1="{mid}" y1="{top}" x2="{mid}" y2="560" stroke="#07090d" stroke-width="3"/>',
            f'<rect x="{x0 + 10}" y="{top + 16}" width="{x1 - x0 - 20}" height="6" rx="3" fill="{self.a}" opacity=".6"/>',
            self.label(mid, top - 18, "TURBOLIFT"),
            f'<rect class="{p}-lamp" x="{x1 + 2}" y="330" width="6" height="30" rx="3" fill="{LOCAL}"/>',
        ])

    def screen(self, box=SCREEN):
        x, y, w, h = box
        return "\n".join([
            f'<rect x="{x - 14}" y="{y - 12}" width="{w + 28}" height="{h + 26}" rx="16" fill="#10161e" stroke="#2a3340" stroke-width="2"/>',
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#04070b"/>',
            f'<rect x="{x - 14}" y="{y + h + 14}" width="{w + 28}" height="5" rx="2.5" fill="{self.a}" opacity=".28"/>',
        ])

    def desk(self, top_label):
        x, y, w, h = TABLE
        dx0, dx1 = 180, 1260
        p = self.p
        return "\n".join([
            f'<ellipse cx="{(dx0 + dx1) / 2}" cy="730" rx="{(dx1 - dx0) / 2 + 30}" ry="12" fill="url(#{p}-shadow)"/>',
            f'<path d="M{dx0 - 10} {y - 18} H{dx1 + 10} L{dx1 - 8} 726 H{dx0 + 8} Z" fill="url(#{p}-desk)" stroke="#2a3340" stroke-width="2"/>',
            f'<rect x="{dx0 - 10}" y="{y - 22}" width="{dx1 - dx0 + 20}" height="6" rx="3" fill="{self.a}" opacity=".3"/>',
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="#06090d" stroke="{self.a}" stroke-opacity=".4"/>',
            self.label(x + w / 2, y + h + 20, top_label, 10, .85),
        ])

    def console(self, name, cx0=1068):
        """The station's own console on the right of the desk."""
        y = TABLE[1]
        out = [f'<path d="M{cx0} {y + 6} L{cx0 + 170} {y - 6} L{cx0 + 162} {y + 66} L{cx0 + 8} {y + 74} Z" fill="#06090d" stroke="{self.a}" stroke-opacity=".5"/>']
        for i in range(5):
            out.append(f'<rect x="{cx0 + 18}" y="{f(y + 10 + i * 11 - i * .8)}" width="{self.rnd.randint(60, 128)}" height="4" rx="2" fill="{self.a}" opacity=".55"/>')
        out.append(f'<rect class="{self.p}-lamp" x="{cx0 + 130}" y="{y + 52}" width="20" height="4" rx="2" fill="{LOCAL}"/>')
        out.append(self.label(cx0 + 86, y + 100, name))
        return "\n".join(out)

    def router(self, name, cx0=1068):
        """Number One's console: the routing display from its station art (station-xo.svg). Number One
        sits at the hub, with a line out to each station on the arc; a dot runs out along each line."""
        y = TABLE[1]
        px, py, pw, ph = cx0 + 2, y - 12, 166, 90
        hub = (px + pw / 2, py + ph - 16)
        colours = [LOCAL, LOCAL, CODEX, LOCAL, CLAUDE, LOCAL, CODEX, LOCAL, LOCAL]
        out = [
            # the stand it sits on, down into the desk
            f'<path d="M{f(hub[0] - 14)} {py + ph} L{f(hub[0] + 14)} {py + ph} L{f(hub[0] + 22)} {y + 88} L{f(hub[0] - 22)} {y + 88} Z" fill="#0b1018" stroke="#2a3340"/>',
            f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="11" fill="#081220" stroke="{self.a}" stroke-opacity=".55" stroke-width="1.6"/>',
            f'<rect x="{px + 4}" y="{py + 4}" width="{pw - 8}" height="{ph - 8}" rx="8" fill="url(#{self.p}-glass)"/>',
            f'<rect x="{px + 10}" y="{py + 9}" width="34" height="3.5" rx="1.75" fill="{GOLD}" opacity=".7"/>',
        ]
        for i, c in enumerate(colours):
            a = math.radians(200 + i * 17.5)
            x, yy = hub[0] + 68 * math.cos(a), hub[1] + 56 * math.sin(a)
            line = f'M{f(hub[0])} {f(hub[1])} L{f(x)} {f(yy)}'
            out.append(f'<path d="{line}" stroke="{c}" stroke-width="1.2" opacity=".5"/>')
            out.append(f'<path class="{self.p}-route" d="{line}" stroke="{c}" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="4 120" '
                       f'style="animation-delay:-{f(i * .43)}s"/>')
            out.append(f'<circle cx="{f(x)}" cy="{f(yy)}" r="4" fill="#0b1220" stroke="{c}" stroke-width="1.4"/>')
        out += [
            f'<circle cx="{f(hub[0])}" cy="{f(hub[1])}" r="10" fill="{LOCAL}" opacity=".18"/>',
            f'<circle cx="{f(hub[0])}" cy="{f(hub[1])}" r="5.5" fill="{LOCAL}"/>',
            f'<circle class="{self.p}-ping" cx="{f(hub[0])}" cy="{f(hub[1])}" r="5.5" fill="none" stroke="{LOCAL}" '
            f'style="transform-origin:{f(hub[0])}px {f(hub[1])}px"/>',
            self.label(cx0 + 86, y + 100, name),
        ]
        return "\n".join(out)

    def highlights(self, spots):
        glow = f'fill="none" stroke="#fff2d8" stroke-width="3" filter="url(#{self.p}-blur)"'
        out = []
        for sid, (x, y, w, h) in spots.items():
            out.append(f'<rect id="{self.p}-hl-{sid}" class="{self.p}-hl" x="{x}" y="{y}" width="{w}" height="{h}" rx="10" {glow}/>')
        return "\n".join(out)

    def svg(self, cls, parts, spots):
        body = "\n".join([self.defs(), *parts, self.highlights(spots),
                          f'<rect width="{W}" height="{H}" fill="url(#{self.p}-vignette)" pointer-events="none"/>'])
        return (f'<svg class="{cls}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" aria-hidden="true">\n{body}\n</svg>\n')

    # small helpers
    def panel(self, x, y, w, h, title=None, title_y=None):
        out = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#10161e" stroke="#2a3340" stroke-width="2"/>']
        if title:
            out.append(self.label(x + w / 2, title_y if title_y is not None else y - 12, title))
        return "\n".join(out)

    def shadow(self, x, w, y):
        return f'<ellipse cx="{x + w / 2}" cy="{y}" rx="{w / 2 + 12}" ry="8" fill="url(#{self.p}-shadow)"/>'

    def door(self, x0, x1, top, title, sub, colour):
        mid = (x0 + x1) / 2
        p = self.p
        return "\n".join([
            f'<rect x="{x0 - 12}" y="{top - 14}" width="{x1 - x0 + 24}" height="{560 - top + 14}" rx="10" fill="#10141b" stroke="{colour}" stroke-opacity=".45" stroke-width="2"/>',
            f'<rect x="{x0}" y="{top}" width="{x1 - x0}" height="{560 - top}" rx="5" fill="url(#{p}-door)"/>',
            f'<line x1="{mid}" y1="{top}" x2="{mid}" y2="560" stroke="#07090d" stroke-width="3"/>',
            f'<rect x="{x0 + 14}" y="{top + 20}" width="{x1 - x0 - 28}" height="4" rx="2" fill="{colour}" opacity=".7"/>',
            f'<rect x="{mid - 40}" y="{top + 196}" width="80" height="40" rx="6" fill="#0a0d12" stroke="{colour}" stroke-opacity=".6"/>',
            f'<text x="{mid}" y="{top + 213}" text-anchor="middle" font-family="monospace" font-size="9" letter-spacing="1.5" fill="{colour}">{sub[0]}</text>',
            f'<text x="{mid}" y="{top + 228}" text-anchor="middle" font-family="monospace" font-size="8" letter-spacing="1.5" fill="{colour}" opacity=".7">{sub[1]}</text>',
            f'<rect class="{p}-lamp" x="{x0 - 22}" y="300" width="6" height="30" rx="3" fill="{colour}"/>',
            self.label(mid, top - 24, title, 10, 1, colour),
        ])


# ============ Number One's post ============
# Number One's wall screen is wider than the other posts': it carries the routing fan (the display
# on the First Officer's station art, grown to fill the wall). The comm channels and the fast path
# share the left wall; the hails and the rail rules the right.
XO_SCREEN = (356, 40, 896, 456)   # lib/xo.ts SCREEN
XO_SPOTS = {
    "bridge": (14, 140, 126, 424), "channels": (160, 56, 176, 260), "fastpath": (160, 322, 176, 176),
    "hails": (1272, 64, 116, 198), "rules": (1266, 290, 128, 274),
    "lounge": (1400, 96, 188, 468), "blocked": (194, 580, 166, 130), "desk": (1056, 580, 196, 140),
}


def xo():
    r = Room("x", "#f0a35e", 1702)
    a = r.a
    out = [r.room(), r.turbolift()]
    # the comm channels: one lit slot per surface the Captain writes from
    x, y, w, h = 170, 70, 156, 236
    out.append(r.panel(x, y, w, h))
    for i, (name, col) in enumerate((("TELEGRAM", "#5aa7f0"), ("DESKTOP", a), ("DASHBOARD", "#b9a6f5"))):
        cy = y + 14 + i * 74
        out.append(f'<rect x="{x + 12}" y="{cy}" width="{w - 24}" height="64" rx="7" fill="#06090d" stroke="{col}" stroke-opacity=".5"/>')
        for k in range(2):
            out.append(f'<rect x="{x + 24}" y="{cy + 14 + k * 12}" width="{r.rnd.randint(50, 90)}" height="4" rx="2" fill="{col}" opacity=".5"/>')
        out.append(f'<circle class="x-blink" cx="{x + w - 28}" cy="{cy + 16}" r="5" fill="{col}"/>')
        out.append(f'<text x="{x + w / 2}" y="{cy + 54}" text-anchor="middle" font-family="monospace" font-size="9" letter-spacing="1.5" fill="{col}">{name}</text>')
    # the fast-path plaque: first words that go straight to a station
    x, y, w, h = 170, 336, 156, 150
    out.append(r.panel(x, y, w, h))
    for i in range(4):
        yy = y + 22 + i * 30
        out.append(f'<rect x="{x + 14}" y="{yy}" width="{r.rnd.randint(36, 54)}" height="6" rx="3" fill="{PAPER}" opacity=".55"/>')
        out.append(f'<path d="M{x + 76} {yy + 3} h20 m-6 -4 l6 4 l-6 4" fill="none" stroke="{a}" stroke-opacity=".7" stroke-width="1.5"/>')
        out.append(f'<rect x="{x + 104}" y="{yy}" width="{r.rnd.randint(28, 40)}" height="6" rx="3" fill="{a}" opacity=".6"/>')
    out.append(r.screen(XO_SCREEN))
    # the hails: gold lamps for orders waiting on the Captain
    x, y, w, h = 1280, 84, 100, 168
    out.append(r.panel(x, y, w, h, "HAILS"))
    for i in range(3):
        out.append(f'<circle class="x-hail" cx="{x + w / 2}" cy="{y + 34 + i * 48}" r="14" fill="{GOLD}" opacity=".85"/>')
        out.append(f'<circle cx="{x + w / 2}" cy="{y + 34 + i * 48}" r="20" fill="none" stroke="{GOLD}" stroke-opacity=".3"/>')
    # the rail rules: binders in a cabinet, one per rule, in their rail's colour
    x, y, w, h = 1278, 318, 104, 240
    out.append(r.shadow(x, w, y + h + 4))
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="url(#x-metal)" stroke="#36414f" stroke-width="2"/>')
    rails = (LOCAL, CODEX, CLAUDE, LOCAL, "#7a8696", "#7a8696", LOCAL, "#7a8696", LOCAL, "#7a8696")
    for row in range(2):
        shelf = y + 112 + row * 110
        out.append(f'<rect x="{x + 8}" y="{shelf}" width="{w - 16}" height="5" rx="2" fill="#2a3340"/>')
        for i in range(5):
            col = rails[row * 5 + i]
            hh = r.rnd.randint(70, 92)
            out.append(f'<rect x="{x + 12 + i * 17}" y="{shelf - hh}" width="14" height="{hh}" rx="2" fill="{col}" opacity=".55" stroke="#0a0d12"/>')
            out.append(f'<rect x="{x + 15 + i * 17}" y="{shelf - hh + 8}" width="8" height="3" rx="1.5" fill="#0a0d12" opacity=".6"/>')
    out.append(r.door(1418, 1570, 124, "BRIEFING ROOM", ("BRIEFING", "ROOM"), a))
    out.append(r.desk("WHERE THE ORDERS CAME FROM · LAST 7 DAYS"))
    # the not-done tray: orders no station could take
    tx, ty = 206, 604
    out.append(f'<path d="M{tx} {ty + 14} H{tx + 130} L{tx + 122} {ty + 62} H{tx + 8} Z" fill="#1a1414" stroke="#5a2f2b" stroke-width="2"/>')
    for i in range(3):
        out.append(f'<rect x="{tx + 18 + i * 4}" y="{ty + 4 - i * 6}" width="92" height="24" rx="3" fill="{PAPER}" opacity=".7" '
                   f'transform="rotate({f(r.rnd.uniform(-5, 5))} {tx + 62} {ty + 14})"/>')
    out.append(f'<rect x="{tx + 30}" y="{ty - 10}" width="58" height="10" rx="2" fill="#f08a7a" opacity=".6"/>')
    out.append(r.label(tx + 66, ty + 86, "NOT DONE"))
    out.append(r.router("NUMBER ONE"))
    return r.svg("xo-art", out, XO_SPOTS)


# ============ Helm ============
HELM_SPOTS = {
    "bridge": (14, 140, 126, 424), "ads": (160, 56, 362, 440), "gates": (1272, 64, 116, 198),
    "follow": (1266, 290, 128, 274), "method": (1400, 96, 188, 468), "log": (194, 580, 166, 130), "desk": (1056, 580, 196, 140),
}


def helm():
    r = Room("h", "#ef7a6a", 1703)
    a = r.a
    out = [r.room(), r.turbolift()]
    # the job-ad board: a cork board with pinned ads
    x, y, w, h = 172, 80, 340, 400
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="url(#h-cork)" stroke="#4a3624" stroke-width="3"/>')
    cols = ("#5aa7f0", a, "#8fd14f", "#7a8696", GOLD)
    for i in range(9):
        cx, cy = x + 22 + (i % 3) * 106, y + 22 + (i // 3) * 124
        tilt = r.rnd.uniform(-4, 4)
        out.append(f'<g transform="rotate({f(tilt)} {cx + 44} {cy + 50})"><rect x="{cx}" y="{cy}" width="88" height="104" rx="2" fill="{PAPER}" opacity=".88"/>'
                   + "".join(f'<rect x="{cx + 10}" y="{cy + 26 + k * 12}" width="{r.rnd.randint(40, 68)}" height="3.5" rx="1.5" fill="#8a8170"/>' for k in range(5))
                   + f'<rect x="{cx + 10}" y="{cy + 10}" width="50" height="7" rx="2" fill="#3c3a35"/></g>')
        out.append(f'<circle cx="{cx + 44}" cy="{cy + 4}" r="5" fill="{r.rnd.choice(cols)}"/>')
    out.append(r.label(x + w / 2, y - 12, "JOB ADS"))
    out.append(r.screen())
    # the gates: four lamps, one per step only the Captain decides
    x, y, w, h = 1280, 84, 100, 168
    out.append(r.panel(x, y, w, h, "YOUR GATES"))
    for i in range(4):
        out.append(f'<rect x="{x + 14}" y="{y + 16 + i * 38}" width="{w - 28}" height="28" rx="6" fill="#06090d" stroke="{GOLD}" stroke-opacity=".5"/>')
        out.append(f'<circle class="h-gate" cx="{x + 30}" cy="{y + 30 + i * 38}" r="6" fill="{GOLD}" opacity="{f(r.rnd.uniform(.4, .95))}"/>')
        out.append(f'<rect x="{x + 44}" y="{y + 28 + i * 38}" width="34" height="4" rx="2" fill="{GOLD}" opacity=".5"/>')
    # the follow-up chronometer: +14 days to follow up, +30 days is ghosted
    x, y, w, h = 1278, 318, 104, 240
    out.append(r.shadow(x, w, y + h + 4))
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="url(#h-metal)" stroke="#36414f" stroke-width="2"/>')
    cx, cy, rr = x + w / 2, y + 66, 38
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{rr}" fill="#06090d" stroke="{a}" stroke-opacity=".5"/>')
    for i in range(30):
        ang = i / 30 * 2 * math.pi - math.pi / 2
        long = i in (0, 14)
        out.append(f'<line x1="{f(cx + (rr - (8 if long else 4)) * math.cos(ang))}" y1="{f(cy + (rr - (8 if long else 4)) * math.sin(ang))}" '
                   f'x2="{f(cx + (rr - 1) * math.cos(ang))}" y2="{f(cy + (rr - 1) * math.sin(ang))}" stroke="{GOLD if long else a}" stroke-opacity="{.9 if long else .4}"/>')
    out.append(f'<g class="h-hand" style="transform-origin:{f(cx)}px {f(cy)}px"><line x1="{f(cx)}" y1="{f(cy)}" x2="{f(cx)}" y2="{f(cy - rr + 8)}" stroke="{PAPER}" stroke-width="2.5" stroke-linecap="round"/></g>')
    out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="4" fill="{a}"/>')
    for i in range(3):
        out.append(f'<rect x="{x + 14}" y="{y + 128 + i * 34}" width="{w - 28}" height="24" rx="4" fill="#141b24" stroke="#2a3340"/>')
        out.append(f'<rect x="{x + 22}" y="{y + 138 + i * 34}" width="{r.rnd.randint(30, 56)}" height="4" rx="2" fill="{a}" opacity=".55"/>')
    out.append(r.label(x + w / 2, y - 14, "FOLLOW-UPS"))
    # the method: a tall plaque with the ten steps
    x0, x1, top = 1418, 1570, 124
    out.append(f'<rect x="{x0 - 12}" y="{top - 14}" width="{x1 - x0 + 24}" height="{560 - top + 14}" rx="10" fill="#10141b" stroke="{a}" stroke-opacity=".45" stroke-width="2"/>')
    for i in range(10):
        yy = top + 16 + i * 41
        gate = i in (1, 5, 6, 9)
        out.append(f'<circle cx="{x0 + 18}" cy="{yy + 10}" r="9" fill="#06090d" stroke="{GOLD if gate else a}" stroke-opacity=".8"/>')
        out.append(f'<text x="{x0 + 18}" y="{yy + 13.5}" text-anchor="middle" font-family="monospace" font-size="9" fill="{GOLD if gate else a}">{i + 1}</text>')
        out.append(f'<rect x="{x0 + 36}" y="{yy + 7}" width="{r.rnd.randint(50, 100)}" height="5" rx="2.5" fill="{PAPER}" opacity=".45"/>')
        if i < 9:
            out.append(f'<line x1="{x0 + 18}" y1="{yy + 19}" x2="{x0 + 18}" y2="{yy + 32}" stroke="{a}" stroke-opacity=".35"/>')
    out.append(r.label((x0 + x1) / 2, top - 24, "THE METHOD"))
    out.append(r.desk("THE COURSE · APPLICATIONS BY STAGE"))
    # the events log: a stack of PADDs
    tx, ty = 206, 604
    out.append(f'<path d="M{tx} {ty + 14} H{tx + 130} L{tx + 122} {ty + 62} H{tx + 8} Z" fill="#161a20" stroke="#3a4757" stroke-width="2"/>')
    for i in range(4):
        out.append(f'<rect x="{tx + 14 + i * 4}" y="{ty + 2 - i * 6}" width="96" height="26" rx="4" fill="#0f141b" stroke="#2a3340" '
                   f'transform="rotate({f(r.rnd.uniform(-4, 4))} {tx + 62} {ty + 14})"/>')
    out.append(f'<rect x="{tx + 26}" y="{ty - 12}" width="64" height="12" rx="2" fill="{a}" opacity=".5"/>')
    out.append(r.label(tx + 66, ty + 86, "TIMELINE"))
    out.append(r.console("HELM"))
    return r.svg("helm-art", out, HELM_SPOTS)


# ============ Navigation ============
NAV_SPOTS = {
    "bridge": (14, 140, 126, 424), "chart": (160, 56, 362, 250), "week": (160, 318, 362, 180),
    "bookings": (1272, 64, 116, 198), "slots": (1266, 290, 128, 274), "helm": (1400, 96, 188, 468),
    "orders": (194, 580, 166, 130), "desk": (1056, 580, 196, 140),
}


def nav():
    r = Room("n", "#6fb7f2", 1704)
    a = r.a
    out = [r.room(), r.turbolift()]
    # the star chart: trip plans as courses between stars
    x, y, w, h = 172, 70, 340, 226
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="url(#n-space)" stroke="#2a3340" stroke-width="2"/>')
    for _ in range(70):
        out.append(f'<circle cx="{f(r.rnd.uniform(x + 6, x + w - 6))}" cy="{f(r.rnd.uniform(y + 6, y + h - 6))}" r="{f(r.rnd.uniform(.4, 1.4))}" fill="#dfe8f5" opacity="{f(r.rnd.uniform(.3, .9))}"/>')
    pts = [(x + 40, y + 170), (x + 120, y + 110), (x + 210, y + 140), (x + 300, y + 60)]
    out.append('<path class="n-course" d="M' + " L".join(f"{px} {py}" for px, py in pts) + f'" fill="none" stroke="{a}" stroke-width="2" stroke-dasharray="6 5"/>')
    for px, py in pts:
        out.append(f'<circle cx="{px}" cy="{py}" r="6" fill="#06090d" stroke="{a}" stroke-width="2"/>')
    out.append(f'<circle cx="{pts[-1][0]}" cy="{pts[-1][1]}" r="11" fill="none" stroke="{GOLD}" stroke-opacity=".6"/>')
    out.append(r.label(x + w / 2, y - 12, "STAR CHART · TRIPS"))
    # the week grid
    x, y, w, h = 172, 330, 340, 156
    out.append(r.panel(x, y, w, h))
    days = "MTWTFSS"
    for i in range(7):
        cx = x + 16 + i * 45
        out.append(f'<text x="{cx + 18}" y="{y + 20}" text-anchor="middle" font-family="monospace" font-size="9" fill="{a}" opacity=".8">{days[i]}</text>')
        for k in range(r.rnd.randint(0, 3)):
            yy = y + 30 + r.rnd.randint(0, 5) * 18
            out.append(f'<rect x="{cx + 2}" y="{yy}" width="34" height="14" rx="3" fill="{r.rnd.choice((a, a, GOLD, LOCAL))}" opacity=".55"/>')
    out.append(r.label(x + w / 2, y + h + 18, "THE WEEK"))
    out.append(r.screen())
    # the booking terminal: holds stop before Confirm
    x, y, w, h = 1280, 84, 100, 168
    out.append(r.panel(x, y, w, h, "BOOKINGS"))
    out.append(f'<rect x="{x + 12}" y="{y + 14}" width="{w - 24}" height="70" rx="5" fill="#06090d" stroke="{a}" stroke-opacity=".5"/>')
    for k in range(4):
        out.append(f'<rect x="{x + 20}" y="{y + 24 + k * 13}" width="{r.rnd.randint(30, 60)}" height="4" rx="2" fill="{a}" opacity=".55"/>')
    out.append(f'<rect class="n-hold" x="{x + 12}" y="{y + 96}" width="{w - 24}" height="26" rx="6" fill="{GOLD}" opacity=".85"/>')
    out.append(f'<text x="{x + w / 2}" y="{y + 113}" text-anchor="middle" font-family="monospace" font-size="9" letter-spacing="1" fill="#1a1420">HOLD</text>')
    out.append(f'<rect x="{x + 12}" y="{y + 130}" width="{w - 24}" height="24" rx="6" fill="none" stroke="#7a8696" stroke-dasharray="3 3"/>')
    out.append(f'<text x="{x + w / 2}" y="{y + 146}" text-anchor="middle" font-family="monospace" font-size="8" letter-spacing="1" fill="#7a8696">CONFIRM</text>')
    # the slot board: the Yeoman's Schedule box, waiting for a time
    x, y, w, h = 1278, 318, 104, 240
    out.append(r.shadow(x, w, y + h + 4))
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="url(#n-metal)" stroke="#36414f" stroke-width="2"/>')
    for i in range(6):
        yy = y + 14 + i * 37
        out.append(f'<rect x="{x + 10}" y="{yy}" width="{w - 20}" height="28" rx="4" fill="#141b24" stroke="#2a3340"/>')
        out.append(f'<rect x="{x + 10}" y="{yy}" width="4" height="28" rx="2" fill="#5aa7f0"/>')
        out.append(f'<rect x="{x + 22}" y="{yy + 12}" width="{r.rnd.randint(36, 64)}" height="4" rx="2" fill="{PAPER}" opacity=".45"/>')
    out.append(r.label(x + w / 2, y - 14, "SLOTS WANTED"))
    out.append(r.door(1418, 1570, 124, "TO HELM", ("FLIGHT", "CONTROL"), "#ef7a6a"))
    out.append(r.desk("NAVIGATION · THE NEXT 7 DAYS"))
    # the orders tray
    tx, ty = 206, 604
    out.append(f'<path d="M{tx} {ty + 14} H{tx + 130} L{tx + 122} {ty + 62} H{tx + 8} Z" fill="#161a20" stroke="#3a4757" stroke-width="2"/>')
    for i in range(3):
        out.append(f'<rect x="{tx + 16 + i * 4}" y="{ty + 2 - i * 6}" width="94" height="26" rx="4" fill="#0f141b" stroke="#2a3340" '
                   f'transform="rotate({f(r.rnd.uniform(-4, 4))} {tx + 62} {ty + 14})"/>')
    out.append(f'<rect x="{tx + 26}" y="{ty - 12}" width="64" height="12" rx="2" fill="{a}" opacity=".5"/>')
    out.append(r.label(tx + 66, ty + 86, "ORDERS"))
    out.append(r.console("NAVIGATION"))
    return r.svg("nav-art", out, NAV_SPOTS)


# ============ the Main Viewscreen ============
VS_SPOTS = {
    "bridge": (14, 140, 126, 424), "switch": (160, 56, 176, 250), "rules": (160, 318, 176, 180),
    "relay": (346, 56, 176, 442), "approve": (1272, 64, 116, 198), "log": (1266, 290, 128, 274),
    "captain": (1400, 96, 188, 468), "orders": (194, 580, 166, 130), "desk": (1056, 580, 196, 140),
}


def viewscreen():
    r = Room("v", "#b9a6f5", 1705)
    a = r.a
    out = [r.room(), r.turbolift()]
    # the on-screen switch
    x, y, w, h = 172, 80, 152, 210
    out.append(r.panel(x, y, w, h, "ON SCREEN"))
    out.append(f'<rect x="{x + 46}" y="{y + 26}" width="60" height="120" rx="30" fill="#06090d" stroke="{a}" stroke-opacity=".6" stroke-width="2"/>')
    out.append(f'<circle class="v-knob" cx="{x + 76}" cy="{y + 56}" r="22" fill="{a}" opacity=".85"/>')
    out.append(f'<text x="{x + 76}" y="{y + 172}" text-anchor="middle" font-family="monospace" font-size="9" letter-spacing="1.5" fill="{a}">ON · OFF</text>')
    # the never-yolo plaque
    x, y, w, h = 172, 330, 152, 156
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="url(#v-brass)" opacity=".9"/>')
    out.append(f'<rect x="{x + 6}" y="{y + 6}" width="{w - 12}" height="{h - 12}" rx="5" fill="none" stroke="#4a3a18" stroke-opacity=".7"/>')
    for i, t in enumerate(("EVERY CLICK", "NEEDS YOUR OK", "NEVER YOLO")):
        out.append(f'<text x="{x + w / 2}" y="{y + 52 + i * 26}" text-anchor="middle" font-family="monospace" font-size="11" letter-spacing="1.5" fill="#2a2010">{t}</text>')
    out.append(r.label(x + w / 2, y + h + 18, "STANDING ORDER"))
    # the Telegram relay: captures go to the Captain's phone
    x, y, w, h = 356, 70, 156, 420
    out.append(r.panel(x, y, w, h, "TELEGRAM RELAY"))
    cx = x + w / 2
    out.append(f'<line x1="{cx}" y1="{y + 60}" x2="{cx}" y2="{y + 300}" stroke="#36414f" stroke-width="6"/>')
    out.append(f'<path d="M{cx - 44} {y + 100} Q{cx} {y + 40} {cx + 44} {y + 100}" fill="none" stroke="{a}" stroke-width="3"/>')
    for i in range(3):
        out.append(f'<path class="v-wave" style="animation-delay:{i * .5}s" d="M{cx - 24 - i * 14} {y + 50 - i * 8} Q{cx} {y + 28 - i * 14} {cx + 24 + i * 14} {y + 50 - i * 8}" fill="none" stroke="#5aa7f0" stroke-width="2"/>')
    for i in range(5):
        out.append(f'<rect x="{x + 22}" y="{y + 316 + i * 18}" width="{w - 44}" height="10" rx="3" fill="#06090d" stroke="#2a3340"/>')
        out.append(f'<rect x="{x + 26}" y="{y + 319 + i * 18}" width="{r.rnd.randint(30, w - 56)}" height="4" rx="2" fill="#5aa7f0" opacity=".55"/>')
    # the main viewscreen
    sx, sy, sw, sh = SCREEN
    out.append(f'<rect x="{sx - 22}" y="{sy - 18}" width="{sw + 44}" height="{sh + 36}" rx="20" fill="#10161e" stroke="{a}" stroke-opacity=".35" stroke-width="3"/>')
    out.append(f'<rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" rx="10" fill="#04070b"/>')
    out.append(f'<rect x="{sx - 22}" y="{sy + sh + 20}" width="{sw + 44}" height="5" rx="2.5" fill="{a}" opacity=".35"/>')
    # approve / deny
    x, y, w, h = 1280, 84, 100, 168
    out.append(r.panel(x, y, w, h, "APPROVE"))
    out.append(f'<rect class="v-ask" x="{x + 14}" y="{y + 16}" width="{w - 28}" height="58" rx="10" fill="#7fd8a8" opacity=".75"/>')
    out.append(f'<path d="M{x + 36} {y + 46} l10 10 l20 -22" fill="none" stroke="#0a1410" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>')
    out.append(f'<rect x="{x + 14}" y="{y + 88}" width="{w - 28}" height="58" rx="10" fill="#f08a7a" opacity=".65"/>')
    out.append(f'<path d="M{x + 38} {y + 105} l24 24 m0 -24 l-24 24" stroke="#1a0a08" stroke-width="4" stroke-linecap="round"/>')
    # the session log
    x, y, w, h = 1278, 318, 104, 240
    out.append(r.shadow(x, w, y + h + 4))
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="url(#v-metal)" stroke="#36414f" stroke-width="2"/>')
    for i in range(10):
        yy = y + 14 + i * 22
        col = r.rnd.choice(("#7fd8a8", "#7fd8a8", "#7fd8a8", "#f08a7a", GOLD))
        out.append(f'<circle cx="{x + 16}" cy="{yy + 6}" r="3.5" fill="{col}"/>')
        out.append(f'<rect x="{x + 26}" y="{yy + 4}" width="{r.rnd.randint(30, 64)}" height="4" rx="2" fill="{PAPER}" opacity=".4"/>')
    out.append(r.label(x + w / 2, y - 14, "SESSION LOG"))
    # the Captain's chair, seen from behind
    x0, x1 = 1410, 1578
    mid = (x0 + x1) / 2
    out.append(r.shadow(x0, x1 - x0, 552))
    out.append(f'<path d="M{x0 + 24} 540 L{x0 + 34} 300 Q{mid} 250 {x1 - 34} 300 L{x1 - 24} 540 Z" fill="#1a1420" stroke="{GOLD}" stroke-opacity=".5" stroke-width="2"/>')
    out.append(f'<rect x="{x0}" y="410" width="34" height="100" rx="10" fill="#14101a" stroke="{GOLD}" stroke-opacity=".35"/>')
    out.append(f'<rect x="{x1 - 34}" y="410" width="34" height="100" rx="10" fill="#14101a" stroke="{GOLD}" stroke-opacity=".35"/>')
    out.append(f'<rect class="v-lamp" x="{x1 - 28}" y="420" width="22" height="6" rx="3" fill="{GOLD}"/>')
    out.append(r.label(mid, 240, "THE CAPTAIN'S CHAIR", 10, 1, GOLD))
    out.append(r.desk("THE VIEWSCREEN · THIS WEEK"))
    tx, ty = 206, 604
    out.append(f'<path d="M{tx} {ty + 14} H{tx + 130} L{tx + 122} {ty + 62} H{tx + 8} Z" fill="#161a20" stroke="#3a4757" stroke-width="2"/>')
    for i in range(3):
        out.append(f'<rect x="{tx + 16 + i * 4}" y="{ty + 2 - i * 6}" width="94" height="26" rx="4" fill="#0f141b" stroke="#2a3340" '
                   f'transform="rotate({f(r.rnd.uniform(-4, 4))} {tx + 62} {ty + 14})"/>')
    out.append(f'<rect x="{tx + 26}" y="{ty - 12}" width="64" height="12" rx="2" fill="{a}" opacity=".5"/>')
    out.append(r.label(tx + 66, ty + 86, "ORDERS"))
    out.append(r.console("OPERATOR"))
    return r.svg("viewscreen-art", out, VS_SPOTS)


if __name__ == "__main__":
    for name, build in (("xo", xo), ("helm", helm), ("nav", nav), ("viewscreen", viewscreen)):
        svg = build()
        (ASSETS / f"{name}.svg").write_text(svg)
        print(ASSETS / f"{name}.svg", len(svg), "bytes")
