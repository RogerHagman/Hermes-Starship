import math
from shapes import parse, inside, dist
HULL = "M150 696 L1190 696 C1290 696 1352 758 1358 832 C1362 914 1300 1030 1176 1034 L250 1034 C140 1034 70 992 62 924 L56 786 C54 731 90 696 150 696 Z"
HP = parse(HULL)

def epoly(cx, cy, rx, ry, n=120):
    return [(cx + rx * math.cos(2 * math.pi * k / n), cy + ry * math.sin(2 * math.pi * k / n)) for k in range(n)]

def arc(cx, cy, rx, ry, a0, a1):
    p0 = (cx + rx * math.cos(math.radians(a0)), cy + ry * math.sin(math.radians(a0)))
    p1 = (cx + rx * math.cos(math.radians(a1)), cy + ry * math.sin(math.radians(a1)))
    large = 1 if (a1 - a0) % 360 > 180 else 0
    return f'M{p0[0]:.1f} {p0[1]:.1f} A{rx} {ry} 0 {large} 1 {p1[0]:.1f} {p1[1]:.1f}'

COWL = (1318, 848, 46, 120)
REC = (1316, 848, 31, 90)
DISH = (1305, 848, 28, 81)
COWL_POLY = epoly(*COWL)
REC_POLY = epoly(*REC)
DISH_POLY = epoly(*DISH)

def E(e, extra=''):
    return f'<ellipse cx="{e[0]}" cy="{e[1]}" rx="{e[2]}" ry="{e[3]}"{extra}></ellipse>'

defs = f'''<defs>
<clipPath id="g7hullclip"><path d="{HULL}"></path></clipPath>
<clipPath id="g7cowlclip">{E(COWL)}</clipPath>
<clipPath id="g7dishclip">{E(DISH)}</clipPath>
<clipPath id="g7recclip">{E(REC)}</clipPath>
<linearGradient id="g7cowl" gradientUnits="userSpaceOnUse" x1="0" y1="728" x2="0" y2="968"><stop offset="0" stop-color="#c4cede"></stop><stop offset="0.22" stop-color="#909db4"></stop><stop offset="0.55" stop-color="#58647b"></stop><stop offset="0.85" stop-color="#2d3648"></stop><stop offset="1" stop-color="#1a2131"></stop></linearGradient>
<linearGradient id="g7seamhi" gradientUnits="userSpaceOnUse" x1="0" y1="728" x2="0" y2="968"><stop offset="0" stop-color="#f4f8ff" stop-opacity="0.7"></stop><stop offset="0.5" stop-color="#f4f8ff" stop-opacity="0.15"></stop><stop offset="1" stop-color="#f4f8ff" stop-opacity="0"></stop></linearGradient>
<radialGradient id="g7spill" gradientUnits="userSpaceOnUse" cx="1326" cy="848" r="190" gradientTransform="translate(1326 848) scale(0.8 1.1) translate(-1326 -848)"><stop offset="0" stop-color="#7fd0ff" stop-opacity="0.4"></stop><stop offset="0.3" stop-color="#4fa3ff" stop-opacity="0.15"></stop><stop offset="1" stop-color="#4fa3ff" stop-opacity="0"></stop></radialGradient>
<linearGradient id="g7cavity" gradientUnits="userSpaceOnUse" x1="1290" y1="762" x2="1340" y2="934"><stop offset="0" stop-color="#02050b"></stop><stop offset="0.5" stop-color="#0a1426"></stop><stop offset="1" stop-color="#26395c"></stop></linearGradient>
<radialGradient id="g7dish" cx="0.6" cy="0.5" r="0.6" fx="0.66" fy="0.47"><stop offset="0" stop-color="#9fdcff"></stop><stop offset="0.3" stop-color="#3f8fe8"></stop><stop offset="0.72" stop-color="#173f86"></stop><stop offset="1" stop-color="#0a1c3e"></stop></radialGradient>
<radialGradient id="g7core" cx="0.55" cy="0.5" r="0.5" fx="0.6" fy="0.46"><stop offset="0" stop-color="#ffffff"></stop><stop offset="0.25" stop-color="#e2f6ff" stop-opacity="0.95"></stop><stop offset="0.6" stop-color="#6cc6ff" stop-opacity="0.45"></stop><stop offset="1" stop-color="#2f7fe0" stop-opacity="0"></stop></radialGradient>
<linearGradient id="g7ishadow" gradientUnits="userSpaceOnUse" x1="1290" y1="767" x2="1338" y2="931"><stop offset="0" stop-color="#000000" stop-opacity="0.75"></stop><stop offset="0.45" stop-color="#000000" stop-opacity="0.28"></stop><stop offset="0.75" stop-color="#000000" stop-opacity="0"></stop></linearGradient>
<linearGradient id="g7lip" gradientUnits="userSpaceOnUse" x1="1284" y1="760" x2="1344" y2="936"><stop offset="0" stop-color="#f2f6ff" stop-opacity="0.9"></stop><stop offset="0.4" stop-color="#aab7cd" stop-opacity="0.5"></stop><stop offset="0.7" stop-color="#1a2232" stop-opacity="0.9"></stop><stop offset="1" stop-color="#0b111c"></stop></linearGradient>
<linearGradient id="g7wall" gradientUnits="userSpaceOnUse" x1="1326" y1="0" x2="1347" y2="0"><stop offset="0" stop-color="#5a9ee0"></stop><stop offset="0.45" stop-color="#2f5d96"></stop><stop offset="1" stop-color="#162640"></stop></linearGradient>
<linearGradient id="g7walltop" gradientUnits="userSpaceOnUse" x1="0" y1="758" x2="0" y2="938"><stop offset="0" stop-color="#000000" stop-opacity="0.85"></stop><stop offset="0.35" stop-color="#000000" stop-opacity="0.35"></stop><stop offset="0.6" stop-color="#000000" stop-opacity="0"></stop><stop offset="1" stop-color="#000000" stop-opacity="0.25"></stop></linearGradient>
</defs>'''

def rib(t):
    cx = REC[0] + (DISH[0] - REC[0]) * t; rx = REC[2] + (DISH[2] - REC[2]) * t; ry = REC[3] + (DISH[3] - REC[3]) * t
    return arc(round(cx, 1), REC[1], round(rx, 1), round(ry, 1), -90, 90)
ribs = ' '.join(rib(t) for t in (0.2, 0.4, 0.6, 0.8))
grille = ' '.join(f'M1270 {y}H1334' for y in range(772, 930, 8))
rings = ''.join(E(e, f' fill="none" stroke="#bfe6ff" stroke-opacity="{o}" stroke-width="1"') for e, o in [((1303, 848, 23, 66), 0.3), ((1301.5, 848, 18, 51), 0.36), ((1300, 848, 12.5, 35), 0.45), ((1299, 848, 7, 19), 0.55)])

parts = [
    '<g class="deflector">', defs,
    E((1326, 848, 36, 100), ' class="thrust" fill="#5ab8ff" fill-opacity="0.5" filter="url(#g5blur)"'),
    f'<g clip-path="url(#g7hullclip)">' + E((COWL[0] - 5, COWL[1] + 7, COWL[2], COWL[3]), ' fill="#000000" fill-opacity="0.55" filter="url(#g5soft)"') + '</g>',
    E(COWL, ' fill="url(#g7cowl)" clip-path="url(#g7hullclip)"'),
    E(COWL, ' fill="url(#g5az)" opacity="0.7" clip-path="url(#g7hullclip)"'),
    f'<path d="{HULL}" fill="none" stroke="#0b111c" stroke-width="2" clip-path="url(#g7cowlclip)"></path>',
    f'<path d="{HULL}" fill="none" stroke="url(#g5rim)" stroke-width="3" clip-path="url(#g7cowlclip)"></path>',
    E(COWL, ' fill="none" stroke="#0a0f18" stroke-opacity="0.8" stroke-width="1.6" clip-path="url(#g7hullclip)"'),
    E(COWL, ' fill="none" stroke="url(#g7seamhi)" stroke-width="1.2" transform="translate(1.6 0)" clip-path="url(#g7hullclip)"'),
    '<ellipse cx="1326" cy="848" rx="200" ry="230" fill="url(#g7spill)" style="mix-blend-mode: screen" clip-path="url(#g7hullclip)"></ellipse>',
    E(REC, ' fill="url(#g7wall)"'),
    f'<g clip-path="url(#g7recclip)">',
    f'<path d="{ribs}" fill="none" stroke="#0a1222" stroke-opacity="0.55" stroke-width="1.2"></path>',
    f'<path d="{ribs}" fill="none" stroke="#9fd0ff" stroke-opacity="0.18" stroke-width="0.8" transform="translate(1.2 0)"></path>',
    E(DISH, ' fill="url(#g7dish)"'),
    f'<g clip-path="url(#g7dishclip)"><path d="{grille}" stroke="#cfeeff" stroke-opacity="0.1" stroke-width="0.8"></path>{rings}</g>',
    E((1301, 848, 18, 58), ' class="thrust" fill="url(#g7core)" style="mix-blend-mode: screen"'),
    E(DISH, ' fill="none" stroke="url(#g7ishadow)" stroke-width="10" clip-path="url(#g7dishclip)"'),
    E(DISH, ' fill="none" stroke="#04080f" stroke-opacity="0.7" stroke-width="1.4"'),
    E(REC, ' fill="url(#g7walltop)"'),
    '</g>',
    E(REC, ' fill="none" stroke="url(#g7lip)" stroke-width="2.4"'),
    f'<path d="{arc(*REC, 150, 262)}" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1" stroke-linecap="round"></path>',
    '</g>',
]
SVG = '\n'.join(parts)

if __name__ == '__main__':
    print('recess inside hull:', all(inside(HP, x, y) for x, y in REC_POLY), 'min gap', round(min(dist(HP, x, y) for x, y in REC_POLY), 1))
    print('dish right edge', DISH[0] + DISH[2], 'opening right edge', REC[0] + REC[2])
    print('bytes', len(SVG))
