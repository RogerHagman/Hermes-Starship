"""Build frontend/src/assets/quarters.svg: the Captain's Quarters, seen from the door.

    python3 frontend/tools/make_quarters_svg.py

Left to right: the bookshelf, the big viewport with the Captain's chair in front of it,
the standing-orders plaque, and the wall screen over the desk (log terminal, the Yeoman's
PADD, a cup, the ship model, the lamp). The page lays its buttons and the wall screen over
this picture by position, so if you move something here, move it in lib/quarters.ts too.

The stars and the books come from a fixed seed, so the picture is the same on every run.
Colours are the warm Quarters palette; rail lights use the design-system rail colours.
Everything is drawn in a 1600 x 740 box.
"""
import random
from pathlib import Path

W, H = 1600, 740
OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "quarters.svg"
rnd = random.Random(1701)

LOCAL, CODEX, CLAUDE, MIXED, GOLD = "#3fc1a5", "#f0a948", "#e889b6", "#8fa8e0", "#e8c37a"


def f(v):
    """Short numbers keep the file small."""
    return f"{v:.1f}".rstrip("0").rstrip(".")


# ---------- the window: a trapezoid, a bit wider at the sill ----------
WIN_OUT = [(166, 86), (634, 86), (656, 566), (144, 566)]      # frame, outside edge
WIN_IN = [(180, 100), (620, 100), (640, 548), (160, 548)]     # glass
MULLIONS = [((327, 100), (321, 548)), ((473, 100), (479, 548))]


def poly(points):
    return " ".join(f"{f(x)},{f(y)}" for x, y in points)


# ---------- stars ----------
def stars():
    out = []
    for i in range(170):
        x, y = rnd.uniform(160, 640), rnd.uniform(100, 548)
        r = rnd.choice([0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.3, 1.6])
        o = rnd.uniform(0.35, 0.95)
        tint = rnd.choice(["#ffffff", "#ffffff", "#dfe8ff", "#fff1d6", "#ffe0f0"])
        cls = ' class="q-tw"' if i % 9 == 0 else ""
        delay = f' style="animation-delay:-{f(rnd.uniform(0, 6))}s"' if cls else ""
        out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{tint}" opacity="{f(o)}"{cls}{delay}/>')
    # a few bright ones with a soft halo
    for x, y, r in [(236, 150, 9), (548, 212, 7), (420, 128, 6), (590, 420, 8), (300, 300, 5)]:
        out.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="url(#q-starglow)"/>'
                   f'<circle cx="{x}" cy="{y}" r="1.4" fill="#fff"/>')
    return "\n".join(out)


def band_stars():
    """Dense, faint stars along the galaxy band."""
    import math
    out, a = [], math.radians(-24)
    for _ in range(140):
        u, v = rnd.uniform(-320, 320), rnd.gauss(0, 16)
        x, y = 400 + u * math.cos(a) - v * math.sin(a), 300 + u * math.sin(a) + v * math.cos(a)
        out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(0.35, 0.75))}" fill="#e8e4ff" opacity="{f(rnd.uniform(0.25, 0.6))}"/>')
    return "\n".join(out)


def streaks():
    """Warp streaks for the burn window: short lines that slide past the glass."""
    out = []
    for i in range(14):
        y = rnd.uniform(118, 530)
        length = rnd.uniform(40, 120)
        dur = rnd.uniform(5.5, 10)
        delay = rnd.uniform(0, 10)
        o = rnd.uniform(0.25, 0.6)
        out.append(
            f'<line class="q-streak" x1="0" y1="{f(y)}" x2="{f(length)}" y2="{f(y)}" stroke="url(#q-streak)" '
            f'stroke-width="{f(rnd.uniform(0.8, 1.6))}" opacity="{f(o)}" '
            f'style="animation-duration:{f(dur)}s;animation-delay:-{f(delay)}s"/>')
    return "\n".join(out)


# ---------- books ----------
SPINES = ["#7a3b3b", "#3b5a7a", "#8a6a3a", "#4a6a5a", "#6a4a7a", "#a08050", "#5a3a4a", "#2f4f6a", "#8a4a3a", "#556b4a"]


def shelf_books(x0, x1, base):
    out, x = [], x0
    while x < x1 - 6:
        if rnd.random() < 0.12 and x < x1 - 30:          # a short stack lying flat
            for k in range(rnd.randint(2, 3)):
                w = rnd.uniform(22, 28)
                out.append(f'<rect x="{f(x)}" y="{f(base - 7 * (k + 1))}" width="{f(w)}" height="6.4" rx="1" fill="{rnd.choice(SPINES)}"/>')
            x += 30
            continue
        w, h = rnd.uniform(7, 12), rnd.uniform(50, 72)
        if x + w > x1:
            break
        c = rnd.choice(SPINES)
        out.append(f'<rect x="{f(x)}" y="{f(base - h)}" width="{f(w)}" height="{f(h)}" rx="1.2" fill="{c}"/>')
        out.append(f'<rect x="{f(x + 1.5)}" y="{f(base - h + 8)}" width="{f(w - 3)}" height="1.6" fill="{GOLD}" opacity=".45"/>')
        x += w + rnd.uniform(0.6, 1.6)
    return "\n".join(out)


SHELVES = [182, 272, 362, 452, 542]


def bookshelf():
    parts = [
        # alcove
        '<rect x="22" y="78" width="114" height="522" rx="16" fill="#0f0c13" stroke="#3a2f3e" stroke-width="2"/>',
        '<rect x="30" y="86" width="98" height="508" rx="11" fill="url(#q-alcove)"/>',
        # a globe on the top shelf
        '<ellipse cx="79" cy="180" rx="18" ry="3" fill="#000" opacity=".4"/>',
        '<path d="M79 178 L79 170" stroke="#8a7350" stroke-width="2"/>',
        '<circle cx="79" cy="146" r="21" fill="url(#q-globe)"/>',
        '<path d="M64 140 q8 -8 16 -2 q6 4 12 -3 M66 154 q10 4 18 -2" stroke="#7fbf9a" stroke-width="2.4" fill="none" opacity=".55" stroke-linecap="round"/>',
        '<path d="M56 146 a23 23 0 0 1 46 0" stroke="#b8914a" stroke-width="2" fill="none"/>',
    ]
    for i, y in enumerate(SHELVES):
        if i > 0:
            parts.append(shelf_books(36, 122, y))
        parts.append(f'<rect x="30" y="{y}" width="98" height="6" fill="#3d2e33"/>')
        parts.append(f'<rect x="30" y="{y + 6}" width="98" height="14" fill="url(#q-shelflight)" opacity=".7"/>')
    return "\n".join(parts)


# ---------- the chair, from behind, facing the window ----------
# The back is a sculpted shell: wide at the shoulders, a smooth crown, tapering to the seat.
CHAIR_BACK = "M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z"
CHAIR_TRIM = "M340 628 C328 556 312 470 315 402 C318 340 356 304 400 302 C444 304 482 340 485 402 C488 470 472 556 460 628"
CHAIR_RIM = "M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430"


def chair():
    return "\n".join([
        # floor shadow, base and pedestal
        '<ellipse cx="400" cy="714" rx="170" ry="20" fill="url(#q-shadow)"/>',
        '<ellipse cx="400" cy="708" rx="84" ry="12" fill="#231c21" stroke="#c9a560" stroke-opacity=".45" stroke-width="1.5"/>',
        '<path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#q-metal)"/>',
        # seat cushion, wider than the back
        '<rect x="304" y="612" width="192" height="42" rx="18" fill="#1d1216"/>',
        '<path d="M310 618 Q400 606 490 618" fill="none" stroke="#5a3a40" stroke-width="2" opacity=".6"/>',
        # armrests reaching forward on both sides, consoles on top
        '<path d="M322 590 L276 586 Q256 586 256 600 Q256 614 276 614 L326 618 Z" fill="url(#q-arm)"/>',
        '<path d="M478 590 L524 586 Q544 586 544 600 Q544 614 524 614 L474 618 Z" fill="url(#q-arm)"/>',
        '<path d="M262 592 L318 594" stroke="#c9a560" stroke-opacity=".55" stroke-width="1.2"/>',
        '<path d="M538 592 L482 594" stroke="#c9a560" stroke-opacity=".55" stroke-width="1.2"/>',
        # one light per rail on the left console, dimmed by the page when a rail is out
        f'<rect x="268" y="598" width="11" height="4" rx="2" fill="{LOCAL}" style="opacity:var(--q-local,1)"/>',
        f'<rect x="283" y="598" width="11" height="4" rx="2" fill="{CODEX}" style="opacity:var(--q-codex,1)"/>',
        f'<rect x="298" y="598" width="11" height="4" rx="2" fill="{CLAUDE}" style="opacity:var(--q-claude,1)"/>',
        f'<rect class="q-armlight" x="492" y="598" width="40" height="4" rx="2" fill="{GOLD}"/>',
        # the shell
        f'<path d="{CHAIR_BACK}" fill="url(#q-shell)"/>',
        f'<path d="{CHAIR_BACK}" fill="url(#q-shell-top)"/>',
        f'<path d="{CHAIR_TRIM}" fill="none" stroke="#c9a560" stroke-width="1.8" stroke-opacity=".7"/>',
        # centre spine and the Captain's delta
        '<rect x="397.5" y="350" width="5" height="250" rx="2.5" fill="#c9a560" opacity=".22"/>',
        f'<path d="M400 318 L413 346 L400 339 L387 346 Z" fill="{GOLD}"/>',
        '<path d="M400 318 L413 346 L400 339 Z" fill="#8a6a32" opacity=".5"/>',
        # rim light where the window light wraps round the crown, and a sheen on the shell
        f'<path d="{CHAIR_RIM}" fill="none" stroke="url(#q-rim)" stroke-width="2.6"/>',
        '<path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="10" stroke-linecap="round"/>',
    ])


# ---------- the plaque between the window and the wall screen ----------
def plaque():
    lines = []
    y = 210
    for i in range(14):
        w = rnd.uniform(26, 40) if i % 4 != 3 else rnd.uniform(14, 24)
        lines.append(f'<rect x="{f(696 - w / 2)}" y="{f(y)}" width="{f(w)}" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>')
        y += 15 if i % 4 != 3 else 22
    return "\n".join([
        '<rect x="656" y="40" width="80" height="560" fill="url(#q-pillar)"/>',
        '<ellipse cx="696" cy="122" rx="44" ry="10" fill="#ffd89a" opacity=".12"/>',
        '<rect x="684" y="112" width="24" height="5" rx="2.5" fill="#6b5a40"/>',
        '<path d="M672 126 L720 126 L720 452 Q720 464 708 464 L684 464 Q672 464 672 452 Z" fill="url(#q-brass)" stroke="#f3d898" stroke-width="1.2" stroke-opacity=".6"/>',
        '<path d="M696 146 L709 174 L696 167 L683 174 Z" fill="#5a4520" opacity=".85"/>',
        '<rect x="680" y="186" width="32" height="3" rx="1.5" fill="#5a4520" opacity=".9"/>',
        "\n".join(lines),
    ])


# ---------- the wall screen (the page puts its console exactly over the glass) ----------
def wall_screen():
    return "\n".join([
        '<rect x="742" y="46" width="840" height="456" rx="20" fill="url(#q-screenglow)" opacity=".9"/>',
        '<rect x="744" y="48" width="836" height="452" rx="18" fill="#0b0a10" stroke="#3d3242" stroke-width="2"/>',
        '<rect x="752" y="56" width="820" height="436" rx="12" fill="#080a12"/>',
        '<rect x="752" y="56" width="820" height="436" rx="12" fill="none" stroke="#e8c37a" stroke-opacity=".25" stroke-width="1"/>',
        # idle: what the screen shows when the console sits below the picture (small windows)
        '<g opacity=".5">',
        f'<path d="M1162 232 L1184 282 L1162 270 L1140 282 Z" fill="none" stroke="{GOLD}" stroke-width="2.4" stroke-linejoin="round"/>',
        f'<text x="1162" y="314" text-anchor="middle" fill="{GOLD}" font-family="JetBrains Mono, monospace" font-size="13" letter-spacing="4">HERMES · HX-01</text>',
        '<rect x="1102" y="328" width="120" height="2" rx="1" fill="#e8c37a" opacity=".5"/>',
        '</g>',
    ])


# ---------- the desk and what is on it ----------
def desk():
    return "\n".join([
        '<ellipse cx="1166" cy="694" rx="420" ry="14" fill="url(#q-shadow)"/>',
        # top surface, gold edge, front
        '<path d="M790 586 L1542 586 L1558 604 L774 604 Z" fill="url(#q-desktop)"/>',
        '<path d="M774 604 L1558 604" stroke="#c9a560" stroke-width="2.2" stroke-opacity=".8"/>',
        '<path d="M776 606 L1556 606 L1546 690 L786 690 Z" fill="url(#q-deskfront)"/>',
        '<path d="M800 652 L1532 652" stroke="#e8c37a" stroke-opacity=".12" stroke-width="1"/>',
        # log terminal
        '<rect x="874" y="574" width="16" height="14" fill="#3a3036"/>',
        '<ellipse cx="882" cy="588" rx="30" ry="4" fill="#3a3036"/>',
        '<rect x="808" y="506" width="148" height="72" rx="7" fill="#100d14" stroke="#4a3d4c" stroke-width="1.5"/>',
        '<rect x="814" y="512" width="136" height="60" rx="4" fill="url(#q-termglass)"/>',
        '<rect x="822" y="519" width="44" height="4" rx="2" fill="#e8c37a" opacity=".85"/>',
        '<rect x="822" y="529" width="112" height="2.4" rx="1.2" fill="#e8c37a" opacity=".45"/>',
        '<rect x="822" y="536" width="98" height="2.4" rx="1.2" fill="#e8c37a" opacity=".45"/>',
        '<rect x="822" y="543" width="106" height="2.4" rx="1.2" fill="#e8c37a" opacity=".45"/>',
        '<rect x="822" y="553" width="76" height="2.4" rx="1.2" fill="#e8c37a" opacity=".3"/>',
        '<rect class="q-cursor" x="901" y="551" width="5" height="6" fill="#e8c37a"/>',
        # the Yeoman's PADDs, lying on the desk
        '<path d="M992 596 L1060 584 L1078 592 L1010 604 Z" fill="#1a161d" stroke="#5a4a50" stroke-width="1"/>',
        '<path d="M1000 588 L1068 576 L1086 584 L1018 596 Z" fill="#221c25" stroke="#7a6a5a" stroke-width="1.2"/>',
        '<path d="M1010 587 L1064 578 L1076 584 L1022 593 Z" fill="url(#q-paddglass)"/>',
        '<path d="M1022 585 L1050 580 M1025 588 L1058 582.5 M1028 590.5 L1046 587.5" stroke="#06120f" stroke-width="1.1" opacity=".6"/>',
        '<path d="M1090 596 L1124 590" stroke="#c9a560" stroke-width="2" stroke-linecap="round"/>',
        # a cup of tea, still warm
        '<ellipse cx="1150" cy="590" rx="22" ry="4" fill="#3a3036"/>',
        '<path d="M1136 562 L1164 562 L1160 588 Q1150 592 1140 588 Z" fill="#e9e2d6"/>',
        '<path d="M1164 568 q10 1 9 9 q-1 7 -11 6" fill="none" stroke="#e9e2d6" stroke-width="3"/>',
        '<ellipse cx="1150" cy="562" rx="14" ry="3" fill="#7a4a2a"/>',
        '<path class="q-steam" d="M1144 554 q-6 -10 0 -18 q6 -8 0 -18" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="2" stroke-linecap="round"/>',
        '<path class="q-steam q-steam2" d="M1155 556 q-6 -10 0 -18 q6 -8 0 -18" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="2" stroke-linecap="round"/>',
        # the ship model on its stand
        '<ellipse cx="1342" cy="592" rx="42" ry="6" fill="#2d252b" stroke="#6b5a40" stroke-width="1.2"/>',
        '<rect x="1340" y="556" width="5" height="36" fill="url(#q-metal)"/>',
        ship_model(),
        # the lamp
        '<ellipse cx="1470" cy="592" rx="70" ry="10" fill="#ffd08a" opacity=".16"/>',
        '<path d="M1462 532 L1420 590 L1520 590 Z" fill="url(#q-lampcone)"/>',
        '<ellipse cx="1514" cy="590" rx="18" ry="4" fill="#3a3036"/>',
        '<path d="M1514 588 Q1512 534 1480 520" fill="none" stroke="#8a7350" stroke-width="3" stroke-linecap="round"/>',
        '<path d="M1454 524 L1488 508 L1496 520 L1468 538 Z" fill="#5a4a3a" stroke="#c9a560" stroke-width="1"/>',
        '<ellipse cx="1462" cy="532" rx="9" ry="3.4" fill="#ffe2a8" transform="rotate(-28 1462 532)"/>',
    ])


def ship_model():
    """A small starship on a stand: saucer, neck, hull and two nacelles. Generic, not the Bridge art."""
    return "\n".join([
        '<g id="q-model">',
        # far nacelle and its pylon (Claude, starboard), then the near one (Codex, port)
        '<path d="M1356 546 L1372 522 L1378 522 L1366 548 Z" fill="#3a4458"/>',
        '<rect x="1334" y="511" width="92" height="7" rx="3.5" fill="#5d6a80"/>',
        f'<rect x="1350" y="512.5" width="66" height="2.6" rx="1.3" fill="{CLAUDE}" opacity=".9"/>',
        '<circle cx="1337" cy="514.5" r="3.2" fill="#ff6a50" opacity=".85"/>',
        '<path d="M1346 550 L1364 528 L1372 528 L1358 552 Z" fill="#4a556b"/>',
        # neck and engineering hull, deflector glowing on the local rail
        '<path d="M1270 534 L1300 534 L1330 550 L1316 556 Z" fill="#56627a"/>',
        '<path d="M1312 546 Q1312 540 1322 540 L1396 542 Q1408 546 1396 554 L1322 558 Q1312 556 1312 552 Z" fill="url(#q-hull)"/>',
        f'<circle cx="1316" cy="549" r="4.2" fill="{LOCAL}" opacity=".9"/>',
        '<rect x="1340" y="519" width="94" height="8" rx="4" fill="#6f7b92"/>',
        f'<rect x="1356" y="520.6" width="70" height="3" rx="1.5" fill="{CODEX}" opacity=".95"/>',
        '<circle cx="1343" cy="523" r="3.6" fill="#ff6a50"/>',
        # the saucer, with the bridge on top (it glows when you point at the model)
        '<ellipse cx="1262" cy="530" rx="66" ry="9.5" fill="url(#q-hull)"/>',
        '<ellipse cx="1262" cy="525" rx="24" ry="4.5" fill="#a9b5ca"/>',
        f'<ellipse class="q-modelbridge" cx="1262" cy="520.5" rx="7" ry="2.6" fill="{GOLD}"/>',
        '<path d="M1198 531 L1326 531" stroke="#1d2433" stroke-width="1"/>',
        '<circle cx="1214" cy="529.5" r=".9" fill="#ffe7b0"/><circle cx="1230" cy="530" r=".9" fill="#ffe7b0"/>'
        '<circle cx="1294" cy="530" r=".9" fill="#ffe7b0"/><circle cx="1310" cy="529.5" r=".9" fill="#ffe7b0"/>',
        '</g>',
    ])


# ---------- room shell ----------
def room():
    downlights = []
    for x in (80, 400, 696, 980, 1260, 1520):
        downlights.append(f'<ellipse cx="{x}" cy="40" rx="120" ry="200" fill="url(#q-downcone)" opacity=".9"/>')
        downlights.append(f'<rect x="{x - 12}" y="30" width="24" height="5" rx="2.5" fill="#ffe2a8"/>')
    panels = []
    for x in range(140, 1600, 112):
        panels.append(f'<path d="M{x} 40 L{x} 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>')
        panels.append(f'<path d="M{x + 2} 40 L{x + 2} 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>')
    return "\n".join([
        f'<rect width="{W}" height="{H}" fill="#120e16"/>',
        '<rect y="38" width="1600" height="562" fill="url(#q-wall)"/>',
        "\n".join(panels),
        '<rect y="508" width="1600" height="3" fill="#e8c37a" opacity=".1"/>',
        '<rect width="1600" height="38" fill="url(#q-ceiling)"/>',
        '<rect y="34" width="1600" height="4" fill="#2a2230"/>',
        '<rect y="37" width="1600" height="1" fill="#e8c37a" opacity=".35"/>',
        "\n".join(downlights),
        # floor, rug and the warm strip along the base of the wall
        '<rect y="598" width="1600" height="142" fill="url(#q-floor)"/>',
        '<rect y="596" width="1600" height="4" fill="#2a2028"/>',
        '<rect y="599" width="1600" height="2" fill="#ffcf8a" opacity=".45"/>',
        '<rect y="601" width="1600" height="26" fill="url(#q-baseglow)"/>',
        '<ellipse cx="400" cy="694" rx="300" ry="38" fill="#2a1722" stroke="#c9a560" stroke-opacity=".28" stroke-width="2"/>',
        '<ellipse cx="400" cy="694" rx="270" ry="30" fill="none" stroke="#c9a560" stroke-opacity=".14" stroke-width="1"/>',
        # window light spilling on to the floor
        '<path d="M160 600 L640 600 L760 740 L40 740 Z" fill="url(#q-spill)"/>',
    ])


def window():
    glass = poly(WIN_IN)
    return "\n".join([
        f'<polygon points="{poly(WIN_OUT)}" fill="#2a2230" stroke="#4d4052" stroke-width="2"/>',
        f'<polygon points="{glass}" fill="#04060d"/>',
        '<g clip-path="url(#q-glass)">',
        f'<rect x="150" y="90" width="500" height="470" fill="url(#q-space)"/>',
        '<ellipse cx="300" cy="210" rx="250" ry="130" fill="url(#q-neb-plum)"/>',
        '<ellipse cx="540" cy="330" rx="210" ry="130" fill="url(#q-neb-teal)"/>',
        '<ellipse cx="250" cy="400" rx="170" ry="90" fill="url(#q-neb-rose)"/>',
        '<ellipse cx="400" cy="300" rx="330" ry="46" fill="url(#q-band)" transform="rotate(-24 400 300)"/>',
        '<g class="q-drift">',
        band_stars(),
        stars(),
        '</g>',
        '<g class="q-streaks" style="opacity:var(--q-burn,1)">',
        streaks(),
        '</g>',
        # a moon, and a planet rising over the sill
        '<circle cx="566" cy="168" r="13" fill="#9aa3b5"/>',
        '<circle cx="561" cy="165" r="13" fill="#04060d" opacity=".55"/>',
        '<circle cx="190" cy="690" r="250" fill="none" stroke="#7fd8e8" stroke-opacity=".10" stroke-width="22" filter="url(#q-blur)"/>',
        '<circle cx="190" cy="690" r="250" fill="url(#q-planet)"/>',
        '<path d="M-20 520 Q160 452 400 520 M0 556 Q180 494 420 560" stroke="#cfe8ff" stroke-opacity=".05" stroke-width="12" fill="none"/>',
        '<circle cx="190" cy="690" r="250" fill="none" stroke="url(#q-atmo)" stroke-width="3"/>',
        # glass reflections
        '<path d="M190 100 L260 100 L200 548 L160 548 Z" fill="#fff" opacity=".025"/>',
        '<path d="M500 100 L540 100 L500 548 L480 548 Z" fill="#fff" opacity=".02"/>',
        '</g>',
        "\n".join(f'<path d="M{f(a[0])} {f(a[1])} L{f(b[0])} {f(b[1])}" stroke="#2a2230" stroke-width="9"/>'
                  f'<path d="M{f(a[0] - 3)} {f(a[1])} L{f(b[0] - 3)} {f(b[1])}" stroke="#5a4a5e" stroke-width="1.2"/>'
                  for a, b in MULLIONS),
        f'<polygon points="{glass}" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="3"/>',
        # the sill
        '<path d="M136 560 L664 560 L672 576 L128 576 Z" fill="#3a2f3e"/>',
        '<path d="M128 576 L672 576" stroke="#c9a560" stroke-opacity=".5" stroke-width="1.5"/>',
    ])


# ---------- highlights the page switches on for the object under the pointer ----------
def highlights():
    glow = 'fill="none" stroke="#ffd98a" stroke-width="3" filter="url(#q-blur)"'
    line = 'fill="none" stroke="#ffe2a8" stroke-width="1.5"'
    shapes = {
        "viewport": f'<polygon points="{poly(WIN_OUT)}" {{s}}/>',
        "chair": f'<path d="{CHAIR_BACK}" {{s}}/>',
        "reading": '<rect x="22" y="78" width="114" height="522" rx="16" {s}/>',
        "orders": '<path d="M672 126 L720 126 L720 452 Q720 464 708 464 L684 464 Q672 464 672 452 Z" {s}/>',
        "log": '<rect x="808" y="506" width="148" height="72" rx="7" {s}/>',
        "yeoman": '<path d="M1000 588 L1068 576 L1086 584 L1018 596 Z" {s}/>',
        "bridge": '<ellipse cx="1312" cy="534" rx="128" ry="34" {s}/>',
    }
    return "\n".join(
        f'<g id="q-hl-{k}" class="q-hl">{v.format(s=glow)}{v.format(s=line)}</g>' for k, v in shapes.items())


DEFS = f"""<defs>
<clipPath id="q-glass"><polygon points="{poly(WIN_IN)}"/></clipPath>
<filter id="q-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
<linearGradient id="q-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2130"/><stop offset=".55" stop-color="#211a27"/><stop offset="1" stop-color="#17121c"/></linearGradient>
<linearGradient id="q-ceiling" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c0a10"/><stop offset="1" stop-color="#1a1520"/></linearGradient>
<linearGradient id="q-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#21171f"/><stop offset="1" stop-color="#0d0a10"/></linearGradient>
<linearGradient id="q-baseglow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf8a" stop-opacity=".16"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></linearGradient>
<linearGradient id="q-spill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".07"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></linearGradient>
<radialGradient id="q-downcone" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#ffd89a" stop-opacity=".22"/><stop offset=".6" stop-color="#ffd89a" stop-opacity=".04"/><stop offset="1" stop-color="#ffd89a" stop-opacity="0"/></radialGradient>
<linearGradient id="q-pillar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a1520"/><stop offset=".5" stop-color="#2c2333"/><stop offset="1" stop-color="#1a1520"/></linearGradient>
<linearGradient id="q-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#070a18"/><stop offset=".6" stop-color="#0b0f22"/><stop offset="1" stop-color="#120b1c"/></linearGradient>
<radialGradient id="q-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="q-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="q-neb-rose"><stop offset="0" stop-color="#c0587a" stop-opacity=".26"/><stop offset="1" stop-color="#5a2038" stop-opacity="0"/></radialGradient>
<radialGradient id="q-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="q-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="q-planet" cx=".78" cy=".08" r="1.05"><stop offset="0" stop-color="#6fb2c4"/><stop offset=".14" stop-color="#245c74"/><stop offset=".38" stop-color="#0f2a42"/><stop offset=".75" stop-color="#081626"/><stop offset="1" stop-color="#050b14"/></radialGradient>
<radialGradient id="q-atmo" cx=".8" cy=".05" r=".9"><stop offset="0" stop-color="#d8f6ff" stop-opacity="1"/><stop offset=".4" stop-color="#7fd8e8" stop-opacity=".45"/><stop offset=".8" stop-color="#3f7f9a" stop-opacity=".08"/><stop offset="1" stop-color="#3f7f9a" stop-opacity="0"/></radialGradient>
<radialGradient id="q-band"><stop offset="0" stop-color="#e8e0ff" stop-opacity=".09"/><stop offset=".5" stop-color="#b8a8e0" stop-opacity=".04"/><stop offset="1" stop-color="#b8a8e0" stop-opacity="0"/></radialGradient>
<linearGradient id="q-shell" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#140e12"/><stop offset=".3" stop-color="#3a2b33"/><stop offset=".55" stop-color="#2a1f26"/><stop offset="1" stop-color="#0f0a0d"/></linearGradient>
<linearGradient id="q-shell-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd89a" stop-opacity=".12"/><stop offset=".35" stop-color="#ffd89a" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
<linearGradient id="q-arm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2b33"/><stop offset="1" stop-color="#120c10"/></linearGradient>
<linearGradient id="q-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="q-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="q-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="q-alcove" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a26"/><stop offset=".35" stop-color="#1e1619"/><stop offset="1" stop-color="#120d12"/></linearGradient>
<linearGradient id="q-shelflight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf8a" stop-opacity=".35"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></linearGradient>
<radialGradient id="q-globe" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#4f8fb0"/><stop offset=".7" stop-color="#1f4a66"/><stop offset="1" stop-color="#0f2233"/></radialGradient>
<linearGradient id="q-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3d898"/><stop offset=".45" stop-color="#c9a560"/><stop offset="1" stop-color="#8a6a32"/></linearGradient>
<radialGradient id="q-screenglow" cx=".5" cy=".5" r=".6"><stop offset=".7" stop-color="#e8c37a" stop-opacity=".1"/><stop offset="1" stop-color="#e8c37a" stop-opacity="0"/></radialGradient>
<linearGradient id="q-desktop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2c33"/><stop offset="1" stop-color="#2a1f26"/></linearGradient>
<linearGradient id="q-deskfront" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22181f"/><stop offset="1" stop-color="#140e13"/></linearGradient>
<linearGradient id="q-termglass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1410"/><stop offset="1" stop-color="#0c0a0a"/></linearGradient>
<linearGradient id="q-paddglass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7fd8c4" stop-opacity=".85"/><stop offset="1" stop-color="#3fa58f" stop-opacity=".7"/></linearGradient>
<linearGradient id="q-hull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3cddd"/><stop offset=".5" stop-color="#7d8aa3"/><stop offset="1" stop-color="#3a4458"/></linearGradient>
<linearGradient id="q-lampcone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe2a8" stop-opacity=".28"/><stop offset="1" stop-color="#ffe2a8" stop-opacity="0"/></linearGradient>
</defs>"""


def build():
    body = "\n".join([
        DEFS,
        "<!-- the room -->", room(),
        "<!-- the bookshelf -->", bookshelf(),
        "<!-- the viewport -->", window(),
        "<!-- the plaque -->", plaque(),
        "<!-- the wall screen -->", wall_screen(),
        "<!-- the desk -->", desk(),
        "<!-- the chair, in front of the window -->", chair(),
        "<!-- highlights -->", highlights(),
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
