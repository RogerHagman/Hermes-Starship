"""Build frontend/src/assets/quarters-wide.svg: the Captain's Quarters as a panorama (2400 x 740)
for the 5120 x 1440 board.

    python3 frontend/tools/make_quarters_wide_svg.py

The first 1600 units are the room from make_quarters_svg.py, untouched, so every box in
lib/quarters.ts still fits: the bookshelf, the viewport and the chair, the plaque, the wall
screen over the desk. The room then carries on to the right with the lounge: a long window
with a sofa under it, the low table with the three-level chess set, the fish tank in the wall
and a plant by the door. The lounge is to look at; nothing in it is a button.
"""
import random
from pathlib import Path

import make_quarters_svg as q

W, H = 2400, 740
OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "quarters-wide.svg"
rnd = random.Random(2401)
f = q.f

# The lounge window: a long pane, a bit wider at the sill like the big viewport.
LWIN_OUT = [(1716, 104), (2204, 104), (2222, 404), (1698, 404)]
LWIN_IN = [(1730, 118), (2190, 118), (2206, 390), (1714, 390)]


def room_more():
    """The wall, ceiling and floor from 1600 to 2400, matching room() in make_quarters_svg.py."""
    out = []
    for x in range(1596, W, 112):
        out.append(f'<path d="M{x} 40 L{x} 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>')
        out.append(f'<path d="M{x + 2} 40 L{x + 2} 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>')
    for x in (1800, 2090, 2330):
        out.append(f'<ellipse cx="{x}" cy="40" rx="120" ry="200" fill="url(#q-downcone)" opacity=".9"/>')
        out.append(f'<rect x="{x - 12}" y="30" width="24" height="5" rx="2.5" fill="#ffe2a8"/>')
    # the rug under the low table, and the window's light on the floor
    out.append('<ellipse cx="1960" cy="690" rx="330" ry="40" fill="#2a1722" stroke="#c9a560" stroke-opacity=".28" stroke-width="2"/>')
    out.append('<ellipse cx="1960" cy="690" rx="298" ry="32" fill="none" stroke="#c9a560" stroke-opacity=".14" stroke-width="1"/>')
    out.append('<path d="M1714 600 L2206 600 L2330 740 L1590 740 Z" fill="url(#q-spill)"/>')
    return "\n".join(out)


def lounge_window():
    glass = q.poly(LWIN_IN)
    stars = []
    for i in range(150):
        x, y = rnd.uniform(1714, 2206), rnd.uniform(118, 390)
        r = rnd.choice([0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.3, 1.6])
        cls = ' class="q-tw"' if i % 9 == 0 else ""
        delay = f' style="animation-delay:-{f(rnd.uniform(0, 6))}s"' if cls else ""
        tint = rnd.choice(["#ffffff", "#ffffff", "#dfe8ff", "#fff1d6", "#ffe0f0"])
        stars.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{tint}" opacity="{f(rnd.uniform(0.35, 0.95))}"{cls}{delay}/>')
    for x, y, r in [(1790, 170, 8), (2130, 330, 7), (1900, 320, 5)]:
        stars.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="url(#q-starglow)"/><circle cx="{x}" cy="{y}" r="1.4" fill="#fff"/>')
    return "\n".join([
        f'<polygon points="{q.poly(LWIN_OUT)}" fill="#0e0b12" stroke="#3d2e33" stroke-width="3"/>',
        '<g clip-path="url(#qw-glass)">',
        '<rect x="1690" y="100" width="540" height="310" fill="url(#q-space)"/>',
        '<ellipse cx="1840" cy="330" rx="260" ry="130" fill="url(#q-neb-teal)"/>',
        '<ellipse cx="2110" cy="170" rx="240" ry="120" fill="url(#q-neb-plum)"/>',
        '<ellipse cx="1960" cy="250" rx="320" ry="60" fill="url(#q-band)" transform="rotate(-14 1960 250)"/>',
        "\n".join(stars),
        # a ringed gas giant, low in the right of the pane
        '<ellipse cx="2096" cy="262" rx="104" ry="22" fill="none" stroke="#e8c9a0" stroke-opacity=".5" stroke-width="7" transform="rotate(-16 2096 262)"/>',
        '<circle cx="2096" cy="262" r="56" fill="url(#qw-giant)"/>',
        '<path d="M2042 250 Q2096 270 2150 244 M2044 272 Q2098 292 2150 266" fill="none" stroke="#5a3a2a" stroke-opacity=".35" stroke-width="5"/>',
        '<path d="M1996 291 A104 22 -16 0 0 2196 233" fill="none" stroke="#f3dcb8" stroke-opacity=".8" stroke-width="7"/>',
        '<circle cx="1850" cy="196" r="9" fill="#cfd6e6"/><circle cx="1853" cy="194" r="9" fill="#0b0f22" opacity=".55"/>',
        f'<g style="opacity: var(--q-burn, 0)">{lounge_streaks()}</g>',
        '</g>',
        f'<polygon points="{glass}" fill="none" stroke="url(#q-rim)" stroke-width="2"/>',
        # two mullions and the sill
        '<path d="M1884 118 L1880 390 M2036 118 L2040 390" stroke="#1a141c" stroke-width="7"/>',
        '<path d="M1884 118 L1880 390 M2036 118 L2040 390" stroke="#4a3a44" stroke-width="1.5"/>',
        '<rect x="1690" y="402" width="540" height="12" rx="3" fill="#2c2333" stroke="#c9a560" stroke-opacity=".3"/>',
    ])


def lounge_streaks():
    out = []
    for i in range(14):
        x, y, n = rnd.uniform(1714, 2150), rnd.uniform(126, 384), rnd.uniform(40, 120)
        out.append(f'<rect class="q-streak" x="{f(x)}" y="{f(y)}" width="{f(n)}" height="1.4" rx=".7" fill="url(#q-streak)" '
                   f'style="animation-delay:-{f(rnd.uniform(0, 3))}s"/>')
    return "\n".join(out)


def sofa():
    """A long plum sofa under the lounge window, with gold piping and two loose cushions."""
    return "\n".join([
        '<ellipse cx="1960" cy="606" rx="300" ry="14" fill="url(#q-shadow)"/>',
        # back, arms, seat
        '<path d="M1716 520 Q1716 448 1760 446 L2160 446 Q2204 448 2204 520 L2204 560 L1716 560 Z" fill="url(#qw-sofa)" stroke="#120c14" stroke-width="2"/>',
        '<path d="M1730 520 Q1732 462 1764 460 L2156 460 Q2188 462 2190 520" fill="none" stroke="#c9a560" stroke-opacity=".45" stroke-width="1.5"/>',
        '<path d="M1880 462 L1878 548 M2040 462 L2042 548" stroke="#000" stroke-opacity=".3" stroke-width="2"/>',
        '<path d="M1692 592 L1692 510 Q1692 486 1716 486 Q1740 486 1740 510 L1740 592 Z" fill="url(#qw-sofa)" stroke="#120c14" stroke-width="2"/>',
        '<path d="M2180 592 L2180 510 Q2180 486 2204 486 Q2228 486 2228 510 L2228 592 Z" fill="url(#qw-sofa)" stroke="#120c14" stroke-width="2"/>',
        '<rect x="1736" y="540" width="448" height="42" rx="12" fill="#4a3558" stroke="#120c14" stroke-width="2"/>',
        '<rect x="1736" y="540" width="448" height="10" rx="5" fill="#fff" opacity=".06"/>',
        '<path d="M1886 542 L1886 580 M2034 542 L2034 580" stroke="#000" stroke-opacity=".3" stroke-width="2"/>',
        '<rect x="1700" y="580" width="520" height="14" rx="4" fill="#1a1218"/>',
        '<rect x="1716" y="592" width="14" height="8" fill="#c9a560" opacity=".7"/><rect x="2190" y="592" width="14" height="8" fill="#c9a560" opacity=".7"/>',
        # cushions and a folded blanket
        '<rect x="1752" y="478" width="70" height="62" rx="12" fill="#8a5a6e" stroke="#120c14" stroke-width="1.5" transform="rotate(-8 1787 509)"/>',
        '<rect x="2096" y="480" width="66" height="60" rx="12" fill="#c9a560" opacity=".85" stroke="#120c14" stroke-width="1.5" transform="rotate(7 2129 510)"/>',
        '<path d="M2108 494 L2150 526 M2150 494 L2108 526" stroke="#8a6a32" stroke-width="1.5" opacity=".6" transform="rotate(7 2129 510)"/>',
    ])


def chess_table():
    """The low table, with a three-level chess set, a teapot and a book left open."""
    pieces = []
    for (x, y, c) in [(1934, 566, "#f3d898"), (1950, 566, "#f3d898"), (1972, 566, "#2a2028"), (1946, 536, "#2a2028"), (1966, 536, "#f3d898"), (1982, 508, "#2a2028"), (1996, 508, "#f3d898")]:
        pieces.append(f'<path d="M{x - 3} {y} L{x - 2} {y - 7} A3 3 0 1 1 {x + 2} {y - 7} L{x + 3} {y} Z" fill="{c}" stroke="#120c14" stroke-width=".8"/>')
    return "\n".join([
        '<ellipse cx="1960" cy="668" rx="150" ry="12" fill="url(#q-shadow)"/>',
        '<path d="M1836 622 L2084 622 L2104 644 L1816 644 Z" fill="url(#q-desktop)" stroke="#120c14" stroke-width="2"/>',
        '<rect x="1816" y="644" width="288" height="8" rx="2" fill="#1a1218"/>',
        '<path d="M1836 623 L2084 623" stroke="#ffcf8a" stroke-opacity=".35" stroke-width="1.5"/>',
        '<rect x="1840" y="652" width="10" height="20" fill="#1a1218"/><rect x="2070" y="652" width="10" height="20" fill="#1a1218"/>',
        # the chess set: a brass stem and three glass boards, stepping up to the right
        '<path d="M1960 624 L1960 500 Q1960 492 1968 492 L1990 492" fill="none" stroke="url(#q-brass)" stroke-width="3.5"/>',
        '<ellipse cx="1960" cy="626" rx="24" ry="5" fill="url(#q-brass)"/>',
        '<path d="M1918 566 L1986 566 L1996 574 L1908 574 Z" fill="#7fd8c4" fill-opacity=".18" stroke="#c9a560" stroke-width="1.2"/>',
        '<path d="M1932 536 L1994 536 L2002 543 L1924 543 Z" fill="#7fd8c4" fill-opacity=".18" stroke="#c9a560" stroke-width="1.2"/>',
        '<path d="M1968 508 L2012 508 L2018 514 L1962 514 Z" fill="#7fd8c4" fill-opacity=".18" stroke="#c9a560" stroke-width="1.2"/>',
        "\n".join(pieces),
        # teapot with a wisp of steam, and an open book
        '<path d="M1862 622 Q1852 600 1876 598 Q1900 600 1890 622 Z" fill="#e6dccf" stroke="#120c14" stroke-width="1.2"/>',
        '<path d="M1890 606 Q1904 604 1902 614" fill="none" stroke="#e6dccf" stroke-width="3"/><path d="M1860 608 Q1848 606 1850 616" fill="none" stroke="#e6dccf" stroke-width="2.5"/>',
        '<path class="q-steam" d="M1876 592 q-5 -9 0 -16 q5 -8 0 -16" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2" stroke-linecap="round"/>',
        '<path d="M2030 620 L2052 614 L2074 620 L2052 624 Z" fill="#efe6d4" stroke="#120c14" stroke-width="1"/><path d="M2052 614 L2052 624" stroke="#8a6a32" stroke-width="1"/>',
    ])


def fish_tank():
    """The fish tank set into the wall, lit from above, with one lionfish."""
    weeds = "".join(f'<path d="M{x} 332 q{d} -22 0 -44 q{-d} -18 0 -{h}" fill="none" stroke="#3fa58f" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>'
                    for x, d, h in ((2296, 6, 20), (2312, -5, 34), (2358, 5, 26)))
    bubbles = "".join(f'<circle class="q-tw" cx="{x}" cy="{y}" r="{r}" fill="none" stroke="#d8f6ff" stroke-opacity=".7" style="animation-delay:-{d}s"/>'
                      for x, y, r, d in ((2350, 250, 2.5, 1), (2346, 222, 2, 3), (2353, 196, 1.6, 5)))
    return "\n".join([
        '<rect x="2268" y="150" width="116" height="200" rx="14" fill="#0e0b12" stroke="#c9a560" stroke-opacity=".5" stroke-width="2"/>',
        '<rect x="2276" y="158" width="100" height="184" rx="9" fill="url(#qw-tank)"/>',
        '<rect x="2276" y="158" width="100" height="26" rx="9" fill="#d8f6ff" opacity=".16"/>',
        '<path d="M2276 332 q24 -10 50 0 t50 0 L2376 342 L2276 342 Z" fill="#c9b08a" opacity=".55"/>',
        weeds, bubbles,
        # the lionfish: a striped body, fan fins and a bright eye
        '<g transform="translate(2318 252)">'
        '<path d="M-22 0 Q-6 -16 16 -4 L30 -14 L27 0 L30 14 L16 4 Q-6 16 -22 0 Z" fill="#ff7a45" stroke="#7a2a10" stroke-width="1"/>'
        '<path d="M-10 -9 L-8 9 M0 -10 L2 10 M10 -6 L11 6" stroke="#fff1d6" stroke-width="2.2" opacity=".85"/>'
        '<path d="M-8 -9 L-14 -24 M-2 -10 L-4 -27 M5 -9 L8 -24 M-6 9 L-12 22 M3 9 L4 23" stroke="#ff9a6a" stroke-width="1.6" stroke-linecap="round"/>'
        '<circle cx="-15" cy="-2" r="2.2" fill="#fff"/><circle cx="-15.5" cy="-2" r="1" fill="#120c14"/></g>',
        '<rect x="2276" y="158" width="100" height="184" rx="9" fill="none" stroke="#7fd8e8" stroke-opacity=".35" stroke-width="1.5"/>',
        '<path d="M2284 166 L2284 330" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>',
        '<ellipse cx="2326" cy="372" rx="90" ry="26" fill="#3fa58f" opacity=".06"/>',
    ])


def plant_and_art():
    """A tall plant in a brass pot by the far wall, and a small framed sketch of the ship beside the wall screen."""
    leaves = "".join(f'<path d="M2336 512 Q{2336 + dx} {512 - h * 0.6} {2336 + dx * 1.7} {512 - h}" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round"/>'
                     for dx, h, c, w in ((-34, 120, "#3f7a5a", 7), (-14, 168, "#4f9a6e", 7), (10, 186, "#3f7a5a", 7), (30, 150, "#4f9a6e", 7), (46, 96, "#3f7a5a", 6), (-46, 70, "#4f9a6e", 6)))
    return "\n".join([
        '<ellipse cx="2336" cy="602" rx="58" ry="10" fill="url(#q-shadow)"/>',
        leaves,
        '<path d="M2302 512 L2370 512 L2360 598 L2312 598 Z" fill="url(#q-brass)" stroke="#120c14" stroke-width="1.5"/>',
        '<rect x="2298" y="506" width="76" height="10" rx="4" fill="#c9a560" stroke="#120c14" stroke-width="1.2"/>',
        # the framed sketch: the ship in a few gold lines
        '<rect x="1604" y="150" width="76" height="104" rx="4" fill="#17121c" stroke="url(#q-brass)" stroke-width="3"/>',
        '<rect x="1612" y="158" width="60" height="88" fill="#221a26"/>',
        '<path d="M1620 196 Q1642 186 1664 196 Q1642 204 1620 196 Z M1640 202 L1634 218 M1624 222 L1650 222 Q1656 226 1650 230 L1626 230 Z M1630 222 L1622 208 L1616 208 M1616 205 L1636 205" fill="none" stroke="#e8c37a" stroke-width="1.3" stroke-linejoin="round"/>',
        '<path d="M1620 238 H1662" stroke="#e8c37a" stroke-opacity=".5" stroke-width="1"/>',
    ])


EXTRA_DEFS = (
    f'<clipPath id="qw-glass"><polygon points="{q.poly(LWIN_IN)}"/></clipPath>'
    '<radialGradient id="qw-giant" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#f6d9a8"/><stop offset=".45" stop-color="#c98f5a"/><stop offset="1" stop-color="#3a2218"/></radialGradient>'
    '<linearGradient id="qw-sofa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4268"/><stop offset=".5" stop-color="#3f2e4c"/><stop offset="1" stop-color="#241a2c"/></linearGradient>'
    '<linearGradient id="qw-tank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f8a96"/><stop offset=".5" stop-color="#17505e"/><stop offset="1" stop-color="#0c2a36"/></linearGradient>'
)


def build():
    q.W = W          # room() and the vignette read the width when they are called
    base = q.room().replace('width="1600"', f'width="{W}"')
    body = "\n".join([
        q.DEFS.replace("</defs>", EXTRA_DEFS + "</defs>", 1),
        "<!-- the room -->", base, room_more(),
        "<!-- the bookshelf -->", q.bookshelf(),
        "<!-- the viewport -->", q.window(),
        "<!-- the plaque -->", q.plaque(),
        "<!-- the wall screen -->", q.wall_screen(),
        "<!-- the desk -->", q.desk(),
        "<!-- the lounge: window, fish tank, plant, sofa, low table -->",
        lounge_window(), fish_tank(), plant_and_art(), sofa(), chess_table(),
        "<!-- the chair, in front of the window -->", q.chair(),
        "<!-- highlights -->", q.highlights(),
        f'<rect width="{W}" height="{H}" fill="url(#q-vignette)" pointer-events="none"/>',
    ])
    vignette = ('<radialGradient id="q-vignette" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/>'
                '<stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>')
    body = body.replace("</defs>", vignette + "</defs>", 1)
    return (f'<svg class="quarters-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" aria-hidden="true">\n'
            f"{body}\n</svg>\n")


if __name__ == "__main__":
    svg = build()
    OUT.write_text(svg)
    print(OUT, len(svg), "bytes")
