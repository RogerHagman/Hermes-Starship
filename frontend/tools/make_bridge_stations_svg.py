"""Build the Bridge station pictures: frontend/src/assets/station-<id>.svg.

    python3 frontend/tools/make_bridge_stations_svg.py

One small scene per Bridge station, shown beside its card in the console under the saucer,
the way the Captain's chair has its own picture:

- xo      Number One's seat beside the Captain, the routing display on its armrest
- helm    behind the helm seat: the course plotted to a far star on the viewscreen
- nav     the astrogation table: a star chart hologram, the week round the rim
- ops     the ops wall: system health meters, a heartbeat trace, a grid of status lights
- screen  the main viewscreen from the back of the Bridge, showing the Captain's desktop

All of them are the same room as the Captain's chair picture (make_bridge_chair_svg.py):
the same wall, floor, stars and seats, so they read as one Bridge. Ids start with a short
prefix per scene (xo-, hm-, nv-, op-, vs-) so no two pictures clash. Shared classes start
with "sa-" and are animated in styles/landing.css. The page sets two CSS variables:
--sa-glow (the station's lights: dim when it is off duty or its rail is out) and --sa-burn
(warp streaks on the viewscreen while the burn is on).

Fixed seeds, so every run writes the same files. Each is drawn in a 520 x 440 box and
cropped to fit, so the important part stays between x 50 and 470.
"""
import math
import random
from pathlib import Path

import make_quarters_svg as q

W, H = 520, 440
ASSETS = Path(__file__).resolve().parent.parent / "src" / "assets"
f = q.f
LOCAL, CODEX, CLAUDE, MIXED, GOLD = q.LOCAL, q.CODEX, q.CLAUDE, q.MIXED, q.GOLD
LINE = "#2e4569"          # frame and edge lines, as in the Captain's chair picture
GLOW = "opacity:var(--sa-glow,1)"


# ---------- shared pieces ----------

def defs(p, extra=""):
    """The gradients every scene uses, with the scene's id prefix."""
    return f"""<defs>
<linearGradient id="{p}wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="{p}floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="{p}space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="{p}neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="{p}neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="{p}starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="{p}streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="{p}screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="{p}console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="{p}seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="{p}rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="{p}metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="{p}shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="{p}teal-glow"><stop offset="0" stop-color="{LOCAL}" stop-opacity=".35"/><stop offset="1" stop-color="{LOCAL}" stop-opacity="0"/></radialGradient>
<radialGradient id="{p}vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
{extra}
</defs>"""


def stars(p, rect, count, seed, bright=()):
    """Stars inside rect (x, y, w, h). Every eighth one twinkles."""
    rnd = random.Random(seed)
    x0, y0, w, h = rect
    out = []
    for i in range(count):
        x, y = rnd.uniform(x0, x0 + w), rnd.uniform(y0, y0 + h)
        r = rnd.choice([0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2, 1.4])
        tint = rnd.choice(["#ffffff", "#ffffff", "#dfe8ff", "#fff1d6"])
        cls = ' class="sa-tw"' if i % 8 == 0 else ""
        delay = f' style="animation-delay:-{f(rnd.uniform(0, 6))}s"' if cls else ""
        out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{tint}" opacity="{f(rnd.uniform(.35, .95))}"{cls}{delay}/>')
    for x, y, r in bright:
        out.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="url(#{p}starglow)"/><circle cx="{x}" cy="{y}" r="1.3" fill="#fff"/>')
    return "\n".join(out)


def streaks(p, y0, y1, seed):
    """Warp streaks, shown only while the burn is on (the page sets --sa-burn)."""
    rnd = random.Random(seed)
    out = []
    for _ in range(16):
        y, length = rnd.uniform(y0, y1), rnd.uniform(30, 90)
        dur, delay = rnd.uniform(4, 8), rnd.uniform(0, 8)
        out.append(
            f'<line class="sa-streak" x1="0" y1="{f(y)}" x2="{f(length)}" y2="{f(y)}" stroke="url(#{p}streak)" '
            f'stroke-width="{f(rnd.uniform(.8, 1.5))}" opacity="{f(rnd.uniform(.25, .6))}" '
            f'style="animation-duration:{f(dur)}s;animation-delay:-{f(delay)}s"/>')
    return f'<g class="sa-streaks" style="opacity:var(--sa-burn,0)">{"".join(out)}</g>'


def viewscreen(p, rect, seed, inside=""):
    """The main viewscreen: frame, glass, nebulae and stars, then whatever is on it."""
    x, y, w, h = rect
    return "\n".join([
        f'<rect x="{x - 12}" y="{y - 12}" width="{w + 24}" height="{h + 24}" rx="22" fill="#0b1220" stroke="{LINE}" stroke-width="2"/>',
        f'<rect x="{x - 4}" y="{y - 4}" width="{w + 8}" height="{h + 8}" rx="16" fill="none" stroke="{GOLD}" stroke-opacity=".35" stroke-width="1.2"/>',
        f'<clipPath id="{p}glass"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12"/></clipPath>',
        f'<g clip-path="url(#{p}glass)">',
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="url(#{p}space)"/>',
        f'<ellipse cx="{x + w * .25}" cy="{y + h * .35}" rx="{w * .33}" ry="{h * .32}" fill="url(#{p}neb-plum)"/>',
        f'<ellipse cx="{x + w * .76}" cy="{y + h * .7}" rx="{w * .3}" ry="{h * .3}" fill="url(#{p}neb-teal)"/>',
        stars(p, rect, 110, seed),
        streaks(p, y + 10, y + h - 10, seed + 1),
        inside,
        f'<path d="M{x} {y + 20} L{x + 120} {y} L{x + 170} {y} L{x} {y + 60} Z" fill="#fff" opacity=".035"/>',
        '</g>',
        f'<rect x="{x + 18}" y="{y - 10}" width="54" height="5" rx="2.5" fill="{GOLD}" opacity=".75"/>',
        f'<rect x="{x + w - 72}" y="{y - 10}" width="54" height="5" rx="2.5" fill="{MIXED}" opacity=".75"/>',
    ])


def room(p, floor_y=268):
    """Wall, floor and the light the screen throws on the floor."""
    return "\n".join([
        f'<rect width="{W}" height="{H}" fill="url(#{p}wall)"/>',
        f'<path d="M0 {floor_y} L{W} {floor_y} L{W} {H} L0 {H} Z" fill="url(#{p}floor)"/>',
        f'<ellipse cx="260" cy="{floor_y + 8}" rx="250" ry="26" fill="url(#{p}screenlight)"/>',
    ])


def seat(p, cx, base, s, trim=LOCAL, light=True):
    """A Bridge seat from behind: the Captain's chair shell without the delta. The trim light
    on the shoulders takes the station's colour and dims with --sa-glow."""
    trim_line = (f'<path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="{trim}" stroke-width="3" '
                 f'stroke-linecap="round" style="{GLOW}" opacity=".8"/>'
                 f'<path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="{trim}" stroke-width="3" '
                 f'stroke-linecap="round" style="{GLOW}" opacity=".8"/>') if light else ""
    return (f'<g transform="translate({cx} {base}) scale({s}) translate(-400 -714)">'
            f'<ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#{p}shadow)"/>'
            f'<path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#{p}metal)"/>'
            '<rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/>'
            f'<path d="{q.CHAIR_BACK}" fill="url(#{p}seat)"/>'
            f'{trim_line}'
            f'<path d="{q.CHAIR_RIM}" fill="none" stroke="url(#{p}rim)" stroke-width="3"/>'
            '<path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/>'
            '</g>')


def lights(x, y, n, step, colours, w=9, h=4, cls=""):
    """A row of small console lights."""
    out = []
    for i in range(n):
        c = colours[i % len(colours)]
        k = f' class="{cls}" style="animation-delay:-{f(i * .37)}s"' if cls else ""
        out.append(f'<rect x="{f(x + i * step)}" y="{f(y)}" width="{w}" height="{h}" rx="{f(h / 2)}" fill="{c}" '
                   f'opacity="{f(.45 + (i % 3) * .2)}"{k}/>')
    return f'<g style="{GLOW}">{"".join(out)}</g>'


def finish(p, body):
    return (f'<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
            f'preserveAspectRatio="xMidYMid slice" aria-hidden="true">\n{body}\n'
            f'<rect width="{W}" height="{H}" fill="url(#{p}vignette)" pointer-events="none"/>\n</svg>\n')


# ---------- Helm: behind the helm seat, the course on the screen ----------

def helm():
    p = "hm-"
    sx, sy, sw, sh = 40, 26, 440, 214
    tx, ty = 352, 102                      # the far star the course runs to
    course = f"M96 232 C150 200 210 186 262 160 S{tx - 30} {ty + 22} {tx} {ty}"
    marks = [(150, 204), (214, 182), (270, 156), (318, 122)]
    reticle = [f'<circle cx="{tx}" cy="{ty}" r="20" fill="none" stroke="{GOLD}" stroke-width="1.4" opacity=".85"/>',
               f'<circle cx="{tx}" cy="{ty}" r="30" fill="none" stroke="{GOLD}" stroke-width="1" stroke-dasharray="3 5" opacity=".5" class="sa-spin" style="transform-origin:{tx}px {ty}px"/>']
    for a in range(0, 360, 90):
        ca, sa = math.cos(math.radians(a)), math.sin(math.radians(a))
        reticle.append(f'<line x1="{f(tx + ca * 24)}" y1="{f(ty + sa * 24)}" x2="{f(tx + ca * 36)}" y2="{f(ty + sa * 36)}" '
                       f'stroke="{GOLD}" stroke-width="1.4" opacity=".85"/>')
    on_screen = "\n".join([
        f'<circle cx="{tx}" cy="{ty}" r="16" fill="url(#{p}starglow)"/><circle cx="{tx}" cy="{ty}" r="2.4" fill="#fff8e6"/>',
        f'<path d="{course}" fill="none" stroke="{LOCAL}" stroke-width="1.6" stroke-dasharray="6 6" class="sa-flow" style="{GLOW}"/>',
        *[f'<circle cx="{x}" cy="{y}" r="3" fill="#0b1220" stroke="{LOCAL}" stroke-width="1.4" style="{GLOW}"/>' for x, y in marks],
        *reticle,
    ])
    console = "\n".join([
        # the helm desk, wide and sloped, just under the screen
        f'<path d="M58 352 L96 286 L424 286 L462 352 Z" fill="url(#{p}console)" stroke="{LINE}" stroke-width="1.4"/>',
        f'<path d="M96 286 L424 286" stroke="{LOCAL}" stroke-opacity=".5" stroke-width="1.5" style="{GLOW}"/>',
        f'<rect x="58" y="352" width="404" height="14" rx="4" fill="#0b1220"/>',
        # two touch panels, one either side of the seat
        f'<path d="M110 340 L126 296 L206 296 L198 340 Z" fill="#0a1a22" stroke="{LINE}"/>',
        f'<path d="M410 340 L394 296 L314 296 L322 340 Z" fill="#0a1a22" stroke="{LINE}"/>',
        lights(134, 304, 4, 16, [LOCAL]), lights(134, 316, 4, 16, [LOCAL, MIXED]), lights(132, 328, 4, 16, [LOCAL]),
        lights(324, 304, 4, 16, [LOCAL]), lights(326, 316, 4, 16, [MIXED, LOCAL]), lights(328, 328, 4, 16, [LOCAL]),
    ])
    body = "\n".join([
        defs(p), room(p, 262),
        viewscreen(p, (sx, sy, sw, sh), 2201, on_screen),
        console,
        f'<ellipse cx="260" cy="420" rx="200" ry="30" fill="url(#{p}teal-glow)" style="{GLOW}" opacity=".5"/>',
        seat(p, 260, 520, .56),
    ])
    return finish(p, body)


# ---------- Navigation: the astrogation table ----------

def nav():
    p = "nv-"
    cx, cy = 260, 336                       # the table top's centre
    hx, hy = 260, 186                       # the hologram's centre
    holo = [
        # the chart: three rings round a star, tilted like the table
        *[f'<ellipse cx="{hx}" cy="{hy}" rx="{r}" ry="{f(r * .34)}" fill="none" stroke="{LOCAL}" stroke-width="1" opacity="{o}"/>'
          for r, o in [(58, .55), (104, .42), (150, .3)]],
        f'<ellipse cx="{hx}" cy="{hy}" rx="186" ry="64" fill="none" stroke="{LOCAL}" stroke-width=".8" stroke-dasharray="2 6" opacity=".3"/>',
        f'<circle cx="{hx}" cy="{hy}" r="18" fill="url(#{p}sun)"/><circle cx="{hx}" cy="{hy}" r="4" fill="#fff4d6"/>',
        # planets on the rings
        f'<circle cx="{hx + 50}" cy="{hy - 10}" r="4" fill="#9fe0ee"/>',
        f'<circle cx="{hx - 96}" cy="{hy + 14}" r="5.5" fill="#7fb8d8"/>',
        f'<circle cx="{hx + 128}" cy="{hy + 26}" r="6.5" fill="#c9b3e8"/>',
        # the plotted trip: an arc from one planet to another, with stops
        f'<path d="M{hx - 96} {hy + 14} C{hx - 60} {hy - 70} {hx + 90} {hy - 64} {hx + 128} {hy + 26}" fill="none" stroke="{GOLD}" '
        f'stroke-width="1.6" stroke-dasharray="5 5" class="sa-flow"/>',
        *[f'<circle cx="{x}" cy="{y}" r="2.6" fill="{GOLD}"/>' for x, y in [(hx - 52, hy - 30), (hx + 16, hy - 46), (hx + 84, hy - 26)]],
        f'<circle cx="{hx + 128}" cy="{hy + 26}" r="12" fill="none" stroke="{GOLD}" stroke-width="1.2" class="sa-ping" style="transform-origin:{hx + 128}px {hy + 26}px"/>',
    ]
    # the week round the table rim: seven segments, today lit gold
    week = []
    for i in range(7):
        a0, a1 = math.radians(200 + i * 20.6), math.radians(200 + i * 20.6 + 17)
        x0, y0 = cx + 214 * math.cos(a0), cy + 64 * math.sin(a0)
        x1, y1 = cx + 214 * math.cos(a1), cy + 64 * math.sin(a1)
        colour, o = (GOLD, 1) if i == 3 else (LOCAL, .55)
        week.append(f'<path d="M{f(x0)} {f(y0)} A214 64 0 0 1 {f(x1)} {f(y1)}" fill="none" stroke="{colour}" stroke-width="4" '
                    f'stroke-linecap="round" opacity="{o}" style="{GLOW}"/>')
    table = [
        f'<ellipse cx="{cx}" cy="{cy + 44}" rx="200" ry="34" fill="url(#{p}shadow)"/>',
        f'<path d="M{cx - 120} {cy + 20} L{cx - 90} {cy + 92} L{cx + 90} {cy + 92} L{cx + 120} {cy + 20} Z" fill="url(#{p}console)" stroke="{LINE}"/>',
        f'<ellipse cx="{cx}" cy="{cy}" rx="226" ry="70" fill="#0e1729" stroke="{LINE}" stroke-width="2"/>',
        f'<ellipse cx="{cx}" cy="{cy}" rx="196" ry="56" fill="url(#{p}tabletop)"/>',
        f'<ellipse cx="{cx}" cy="{cy}" rx="120" ry="34" fill="none" stroke="{LOCAL}" stroke-opacity=".25"/>',
        *week,
        # the beam that throws the chart up
        f'<path d="M{cx - 40} {cy - 4} L{hx - 190} {hy + 10} L{hx + 190} {hy + 10} L{cx + 40} {cy - 4} Z" fill="url(#{p}beam)" style="{GLOW}"/>',
        f'<ellipse cx="{cx}" cy="{cy - 2}" rx="40" ry="10" fill="{LOCAL}" opacity=".35" style="{GLOW}"/>',
    ]
    extra = f"""<radialGradient id="{p}sun"><stop offset="0" stop-color="#ffe7b0" stop-opacity=".9"/><stop offset="1" stop-color="#ffb84a" stop-opacity="0"/></radialGradient>
<radialGradient id="{p}tabletop"><stop offset="0" stop-color="#16324a"/><stop offset="1" stop-color="#0b1424"/></radialGradient>
<linearGradient id="{p}beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="{LOCAL}" stop-opacity=".22"/><stop offset="1" stop-color="{LOCAL}" stop-opacity="0"/></linearGradient>"""
    # chart panels on the far wall, dim, with a few stars between them
    wall = [stars(p, (40, 20, 440, 120), 46, 3301),
            *[f'<rect x="{x}" y="34" width="120" height="78" rx="10" fill="#0b1220" stroke="{LINE}" stroke-width="1.4"/>' for x in (54, 200, 346)],
            *[f'<path d="M{x + 10} {94 - (i % 3) * 8} ' + " ".join(f"L{x + 10 + k * 20} {f(94 - ((k * 7 + i) % 5) * 9)}" for k in range(1, 6))
              + f'" fill="none" stroke="{MIXED}" stroke-width="1.2" opacity=".45"/>' for i, x in enumerate((54, 200, 346))],
            *[f'<rect x="{x + 10}" y="44" width="40" height="5" rx="2.5" fill="{c}" opacity=".6"/>' for x, c in ((54, GOLD), (200, LOCAL), (346, MIXED))]]
    body = "\n".join([
        defs(p, extra), room(p, 236), *wall, *table,
        f'<g class="sa-holo" style="{GLOW}">{"".join(holo)}</g>',
    ])
    return finish(p, body)


# ---------- Ops: the system health wall ----------

def ops():
    p = "op-"
    x0, y0, w, h = 44, 30, 432, 208        # the wall display
    meters = []
    # six health meters: NAS, Ollama, Docker, disk, GPU, cron. Disk runs warm.
    for i, (lvl, colour) in enumerate([(.62, LOCAL), (.48, LOCAL), (.7, LOCAL), (.86, CODEX), (.4, LOCAL), (.55, LOCAL)]):
        bx = x0 + 22 + i * 26
        meters += [f'<rect x="{bx}" y="{y0 + 40}" width="14" height="136" rx="4" fill="#0a1424" stroke="{LINE}"/>',
                   f'<rect class="sa-bar" x="{bx + 3}" y="{f(y0 + 173 - 130 * lvl)}" width="8" height="{f(130 * lvl)}" rx="2" fill="{colour}" '
                   f'opacity=".85" style="animation-delay:-{f(i * .8)}s;transform-origin:{bx + 7}px {y0 + 173}px"/>']
    # the heartbeat trace across the middle panel
    tx0, ty = x0 + 186, y0 + 100
    pts, x = [], tx0
    for k in range(9):
        pts += [f"L{f(x + 8)} {ty}", f"L{f(x + 12)} {ty - (26 if k % 3 == 0 else 10)}", f"L{f(x + 16)} {ty + (14 if k % 3 == 0 else 6)}", f"L{f(x + 20)} {ty}"]
        x += 14
    trace = f'M{tx0} {ty} ' + " ".join(pts)
    grid = []
    for r in range(5):
        for c in range(4):
            warm = (r, c) == (1, 2)
            grid.append(f'<rect x="{x0 + 352 + c * 17}" y="{y0 + 44 + r * 26}" width="11" height="11" rx="2.5" '
                        f'fill="{CODEX if warm else LOCAL}" opacity="{f(.4 + ((r * 3 + c) % 4) * .15)}"'
                        f'{" class=" + chr(34) + "sa-blink" + chr(34) if warm else ""}/>')
    display = "\n".join([
        f'<rect x="{x0 - 10}" y="{y0 - 10}" width="{w + 20}" height="{h + 20}" rx="20" fill="#0b1220" stroke="{LINE}" stroke-width="2"/>',
        f'<rect x="{x0}" y="{y0}" width="{w}" height="{h}" rx="12" fill="url(#{p}glass)"/>',
        f'<rect x="{x0 + 14}" y="{y0 - 6}" width="54" height="5" rx="2.5" fill="{GOLD}" opacity=".75"/>',
        f'<rect x="{x0 + w - 68}" y="{y0 - 6}" width="54" height="5" rx="2.5" fill="{LOCAL}" opacity=".75"/>',
        # three panels: meters, the trace, the status grid
        f'<rect x="{x0 + 12}" y="{y0 + 16}" width="166" height="176" rx="8" fill="none" stroke="{LINE}"/>',
        f'<rect x="{x0 + 186}" y="{y0 + 16}" width="152" height="176" rx="8" fill="none" stroke="{LINE}"/>',
        f'<rect x="{x0 + 344}" y="{y0 + 16}" width="76" height="176" rx="8" fill="none" stroke="{LINE}"/>',
        *[f'<rect x="{x0 + 22 + i * 26}" y="{y0 + 24}" width="14" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>' for i in range(6)],
        f'<g style="{GLOW}">{"".join(meters)}</g>',
        *[f'<line x1="{x0 + 192}" y1="{ty + d}" x2="{x0 + 332}" y2="{ty + d}" stroke="{LINE}" stroke-width=".8"/>' for d in (-40, 0, 40)],
        f'<path d="{trace}" pathLength="100" fill="none" stroke="{LOCAL}" stroke-width="1.8" stroke-linejoin="round" class="sa-trace" style="{GLOW}"/>',
        f'<rect x="{x0 + 196}" y="{y0 + 160}" width="60" height="5" rx="2.5" fill="{LOCAL}" opacity=".5" style="{GLOW}"/>',
        f'<rect x="{x0 + 262}" y="{y0 + 160}" width="36" height="5" rx="2.5" fill="{MIXED}" opacity=".5"/>',
        f'<g style="{GLOW}">{"".join(grid)}</g>',
    ])
    console = "\n".join([
        f'<path d="M30 356 L70 284 L450 284 L490 356 Z" fill="url(#{p}console)" stroke="{LINE}" stroke-width="1.4"/>',
        f'<rect x="30" y="356" width="460" height="14" rx="4" fill="#0b1220"/>',
        f'<path d="M70 284 L450 284" stroke="{LOCAL}" stroke-opacity=".5" stroke-width="1.5" style="{GLOW}"/>',
        lights(90, 300, 14, 24, [LOCAL, LOCAL, MIXED], w=14, h=5),
        lights(80, 318, 15, 24, [LOCAL, MIXED, LOCAL], w=14, h=5, cls="sa-key"),
        lights(70, 336, 16, 24, [LOCAL], w=14, h=5),
    ])
    extra = f'<linearGradient id="{p}glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1626"/><stop offset="1" stop-color="#060c18"/></linearGradient>'
    body = "\n".join([
        defs(p, extra), room(p, 262), display, console,
        f'<ellipse cx="260" cy="420" rx="200" ry="30" fill="url(#{p}teal-glow)" style="{GLOW}" opacity=".5"/>',
        seat(p, 260, 524, .54),
    ])
    return finish(p, body)


# ---------- Number One: the seat beside the Captain, routing on the armrest ----------

def xo():
    p = "xo-"
    # the routing display: Number One at the hub, a line out to each station on the arc
    px, py, pw, ph = 164, 222, 196, 112     # the armrest display
    hub = (px + pw / 2, py + ph - 26)
    ends = []
    for i in range(9):
        a = math.radians(200 + i * 17.5)
        ends.append((hub[0] + 88 * math.cos(a), hub[1] + 70 * math.sin(a)))
    colours = [LOCAL, LOCAL, CODEX, LOCAL, CLAUDE, LOCAL, CODEX, LOCAL, LOCAL]
    routes = []
    for i, ((x, y), c) in enumerate(zip(ends, colours)):
        routes.append(f'<path d="M{f(hub[0])} {f(hub[1])} L{f(x)} {f(y)}" stroke="{c}" stroke-width="1.3" opacity=".5"/>')
        routes.append(f'<path d="M{f(hub[0])} {f(hub[1])} L{f(x)} {f(y)}" stroke="{c}" stroke-width="2.4" stroke-linecap="round" '
                      f'stroke-dasharray="4 120" class="sa-route" style="animation-delay:-{f(i * .43)}s"/>')
        routes.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="4.5" fill="#0b1220" stroke="{c}" stroke-width="1.5"/>')
    display = "\n".join([
        # the arm that holds it, reaching over from the seat
        f'<path d="M{px + pw / 2 - 10} {py + ph} L{px + pw / 2 + 10} {py + ph} L{px + pw / 2 + 84} {H} L{px + pw / 2 + 58} {H} Z" fill="url(#{p}console)" stroke="{LINE}"/>',
        f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="12" fill="#081220" stroke="{LINE}" stroke-width="1.6"/>',
        f'<rect x="{px + 4}" y="{py + 4}" width="{pw - 8}" height="{ph - 8}" rx="9" fill="url(#{p}panel)"/>',
        f'<rect x="{px + 12}" y="{py + 10}" width="44" height="4" rx="2" fill="{GOLD}" opacity=".7"/>',
        f'<g style="{GLOW}">{"".join(routes)}</g>',
        f'<circle cx="{f(hub[0])}" cy="{f(hub[1])}" r="11" fill="url(#{p}teal-glow)" style="{GLOW}"/>',
        f'<circle cx="{f(hub[0])}" cy="{f(hub[1])}" r="6" fill="{LOCAL}" style="{GLOW}"/>',
        f'<circle cx="{f(hub[0])}" cy="{f(hub[1])}" r="6" fill="none" stroke="{LOCAL}" class="sa-ping" style="transform-origin:{f(hub[0])}px {f(hub[1])}px"/>',
    ])
    # the Captain's chair at the left edge, out of focus and turned away
    captain = (f'<g transform="translate(88 470) scale(.5) translate(-400 -716)" opacity=".7">'
               f'<path d="{q.CHAIR_BACK}" fill="url(#{p}capshell)"/>'
               f'<path d="{q.CHAIR_TRIM}" fill="none" stroke="#c9a560" stroke-width="2" stroke-opacity=".55"/>'
               f'<path d="M400 318 L413 346 L400 339 L387 346 Z" fill="{GOLD}" opacity=".8"/>'
               f'<path d="{q.CHAIR_RIM}" fill="none" stroke="url(#{p}rim)" stroke-width="3"/></g>')
    extra = f"""<linearGradient id="{p}panel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d2030"/><stop offset="1" stop-color="#07101c"/></linearGradient>
<linearGradient id="{p}capshell" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#140e12"/><stop offset=".3" stop-color="#3a2b33"/><stop offset=".55" stop-color="#2a1f26"/><stop offset="1" stop-color="#0f0a0d"/></linearGradient>"""
    platform = [f'<path d="M-20 440 C10 360 150 322 300 322 C420 322 520 352 540 400" fill="none" stroke="{LINE}" stroke-width="2"/>',
                f'<path d="M-8 440 C24 370 156 334 300 334 C414 334 512 362 532 410" fill="none" stroke="{GOLD}" stroke-opacity=".22" stroke-width="1.2"/>']
    body = "\n".join([
        defs(p, extra), room(p, 250),
        viewscreen(p, (34, 22, 452, 190), 4401),
        # the conn and ops consoles ahead, low and dark
        f'<path d="M70 280 L84 258 L200 258 L214 280 Z" fill="url(#{p}console)" stroke="{LINE}"/>',
        lights(96, 264, 6, 16, [LOCAL]),
        *platform,
        captain,
        seat(p, 410, 512, .52),
        display,
    ])
    return finish(p, body)


# ---------- the Main Viewscreen: the Captain's desktop, on screen ----------

def screen():
    p = "vs-"
    sx, sy, sw, sh = 36, 28, 448, 252
    windows = []
    for (x, y, w, h, accent) in [(70, 62, 210, 132, LOCAL), (232, 104, 214, 140, MIXED)]:
        windows += [
            f'<rect x="{x + 4}" y="{y + 6}" width="{w}" height="{h}" rx="8" fill="#000" opacity=".35"/>',
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="#101a2e" stroke="#33496e"/>',
            f'<path d="M{x} {y + 8} Q{x} {y} {x + 8} {y} L{x + w - 8} {y} Q{x + w} {y} {x + w} {y + 8} L{x + w} {y + 18} L{x} {y + 18} Z" fill="#1a2742"/>',
            *[f'<circle cx="{x + 12 + k * 10}" cy="{y + 9}" r="2.6" fill="{c}" opacity=".8"/>' for k, c in enumerate([CLAUDE, CODEX, LOCAL])],
            f'<rect x="{x + 12}" y="{y + 30}" width="{w * .45}" height="6" rx="3" fill="{accent}" opacity=".7"/>',
            *[f'<rect x="{x + 12}" y="{y + 46 + k * 14}" width="{f(w * (.82 - (k % 3) * .17))}" height="4" rx="2" fill="#8aa0c4" opacity=".35"/>'
              for k in range(int((h - 56) / 14))],
        ]
    desktop = "\n".join([
        f'<rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" fill="url(#{p}wallpaper)"/>',
        f'<circle cx="{sx + sw * .78}" cy="{sy + sh * .26}" r="70" fill="url(#{p}neb-teal)"/>',
        *windows,
        # the cursor, blinking at the end of a line
        '<rect x="300" y="186" width="2" height="10" fill="#dfe8ff" class="sa-blink"/>',
        # the dock along the bottom
        f'<rect x="{sx + sw / 2 - 96}" y="{sy + sh - 30}" width="192" height="22" rx="11" fill="#0a1222" stroke="#33496e" opacity=".95"/>',
        *[f'<rect x="{sx + sw / 2 - 84 + k * 28}" y="{sy + sh - 25}" width="12" height="12" rx="3.5" fill="{c}" opacity=".75"/>'
          for k, c in enumerate([LOCAL, MIXED, GOLD, CODEX, CLAUDE, "#8aa0c4", LOCAL])],
        # faint scanlines: it is a picture of a picture
        f'<rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" fill="url(#{p}scan)" opacity=".5"/>',
    ])
    frame = "\n".join([
        f'<rect x="{sx - 12}" y="{sy - 12}" width="{sw + 24}" height="{sh + 24}" rx="22" fill="#0b1220" stroke="{LINE}" stroke-width="2"/>',
        f'<rect x="{sx - 4}" y="{sy - 4}" width="{sw + 8}" height="{sh + 8}" rx="16" fill="none" stroke="{GOLD}" stroke-opacity=".35" stroke-width="1.2"/>',
        f'<clipPath id="{p}glass"><rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" rx="12"/></clipPath>',
        f'<g clip-path="url(#{p}glass)" style="{GLOW}">{desktop}</g>',
        # "on screen": a small gold lamp on the frame, lit while the capture runs
        f'<rect x="{sx + 18}" y="{sy - 10}" width="54" height="5" rx="2.5" fill="{GOLD}" opacity=".75"/>',
        f'<circle cx="{sx + sw - 22}" cy="{sy - 8}" r="3.5" fill="{GOLD}" class="sa-onair"/>',
        f'<rect x="{sx + sw - 82}" y="{sy - 10}" width="48" height="5" rx="2.5" fill="{MIXED}" opacity=".75"/>',
    ])
    # the Bridge in front of the screen, from the back: helm and ops, the Captain's chair
    bridge = "\n".join([
        f'<ellipse cx="260" cy="318" rx="250" ry="24" fill="url(#{p}screenlight)"/>',
        *[f'<path d="M{cx - 60} 352 L{cx - 48} 328 L{cx + 48} 328 L{cx + 60} 352 Z" fill="url(#{p}console)" stroke="{LINE}"/>'
          f'<rect x="{cx - 60}" y="352" width="120" height="9" rx="3" fill="#0b1220"/>' for cx in (140, 380)],
        lights(102, 334, 6, 14, [LOCAL]), lights(342, 334, 6, 14, [LOCAL]),
        f'<g transform="translate(260 474) scale(.42) translate(-400 -716)">'
        f'<path d="{q.CHAIR_BACK}" fill="url(#{p}capshell)"/>'
        f'<path d="{q.CHAIR_TRIM}" fill="none" stroke="#c9a560" stroke-width="2" stroke-opacity=".6"/>'
        f'<path d="M400 318 L413 346 L400 339 L387 346 Z" fill="{GOLD}"/>'
        f'<path d="{q.CHAIR_RIM}" fill="none" stroke="url(#{p}rim)" stroke-width="3"/></g>',
        seat(p, 150, 470, .3, light=False), seat(p, 370, 470, .3, light=False),
    ])
    extra = f"""<linearGradient id="{p}wallpaper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1430"/><stop offset=".55" stop-color="#121a3a"/><stop offset="1" stop-color="#1c1236"/></linearGradient>
<pattern id="{p}scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#000" opacity=".35"/></pattern>
<linearGradient id="{p}capshell" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#140e12"/><stop offset=".3" stop-color="#3a2b33"/><stop offset=".55" stop-color="#2a1f26"/><stop offset="1" stop-color="#0f0a0d"/></linearGradient>"""
    body = "\n".join([defs(p, extra), room(p, 300), frame, bridge])
    return finish(p, body)


SCENES = {"xo": xo, "helm": helm, "nav": nav, "ops": ops, "screen": screen}

if __name__ == "__main__":
    for station, draw in SCENES.items():
        out = ASSETS / f"station-{station}.svg"
        svg = draw()
        out.write_text(svg)
        print(out, len(svg), "bytes")
