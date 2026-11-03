import random, re
random.seed(74656)
RAILC = dict(captain='#e8c37a', local='#3fc1a5', codex='#f0a948', claude='#e889b6', mixed='#8fa8e0')
ST = """xo,1,1228,58,166,local,live,
captain,1,1407,58,166,captain,live,
screen,1,1586,58,166,local,live,space
nav,1,1176,130,200,local,live,
helm,1,1390,130,200,local,live,
ops,1,1604,130,200,local,live,
lounge,2,934,242,530,mixed,live,space
strategist,2,1476,242,170,claude,approved,
yeoman,2,1658,242,170,local,approved,
quarters,2,1840,242,180,captain,live,space
computer,3,840,338,240,local,live,
archives,3,1094,338,240,local,live,
science,3,1348,338,240,mixed,live,
sensors,3,1602,338,240,claude,live,
doctor,3,1856,338,240,local,reserved,
holo,4,830,434,240,claude,approved,
carto,4,1084,434,240,claude,live,
crewq,5,950,530,1072,mixed,live,space
life,6,110,732,200,local,reserved,
security,6,322,732,200,mixed,live,
qm,6,600,732,200,local,live,
comms,6,812,732,200,local,reserved,
away,7,110,828,200,mixed,live,
eng,7,600,828,200,codex,live,
design,8,170,924,180,claude,proposed,
calib,8,360,924,180,claude,proposed,
sys,8,600,924,190,codex,live,
diag,8,800,924,190,codex,live,"""
S = []
for line in ST.split('\n'):
    i, d, x, y, w, r, st, sp = line.split(',')
    S.append(dict(id=i, deck=int(d), x=int(x), y=int(y), w=int(w), rail=r, status=st, space=sp == 'space'))

FILL = '#1b2840'; EDGE = '#3d5580'; HI = '#56709c'
out = []
def a(s): out.append(s)

def screen(x, y, w, h, C, inner=''):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="#070d18" stroke="{EDGE}" stroke-width="1.2"></rect>'
            f'<rect x="{x+2}" y="{y+2}" width="{w-4}" height="{h-4}" rx="2" fill="{C}" fill-opacity="0.14"></rect>' + inner)

def desk(x0, x1, F, C, h=18):
    return (f'<path d="M{x0} {F} L{x0} {F-h+6} L{x0+8} {F-h} L{x1} {F-h} L{x1} {F} Z" fill="{FILL}" stroke="{EDGE}" stroke-width="1.2"></path>'
            f'<rect x="{x0+9}" y="{F-h+1}" width="{x1-x0-12}" height="2.5" rx="1" fill="{C}" opacity="0.85"></rect>'
            + ''.join(f'<rect x="{x0+10+k*9}" y="{F-h+7}" width="6" height="2.5" rx="1" fill="{random.choice(["#8fa8e0","#e8c37a","#3fc1a5","#e889b6","#f0a948"])}" opacity="0.7"></rect>' for k in range(max(1, (x1-x0-16)//9))))

def chair(cx, F, C):
    return (f'<rect x="{cx-9}" y="{F-20}" width="6" height="14" rx="2" fill="#2a3a56"></rect>'
            f'<rect x="{cx-10}" y="{F-9}" width="18" height="4" rx="2" fill="#2a3a56"></rect><rect x="{cx-1}" y="{F-5}" width="3" height="5" fill="#1d2534"></rect>')

def furn(kind, s, C):
    x, y, w = s['x'], s['y'], s['w']
    R = x + w - 8; F = y + 60
    g = []
    if kind == 'console':
        g.append(screen(R-58, F-50, 50, 22, C, f'<polyline points="{R-54},{F-34} {R-46},{F-40} {R-38},{F-36} {R-28},{F-44} {R-16},{F-38}" fill="none" stroke="{C}" stroke-width="1.4"></polyline>'))
        g.append(desk(R-66, R-4, F, C))
    elif kind == 'lab':
        g.append(screen(R-50, F-54, 42, 22, C, f'<path d="M{R-46} {F-43} q5 -9 10 0 t10 0 t10 0" fill="none" stroke="{C}" stroke-width="1.4"></path>'))
        g.append(f'<rect x="{R-74}" y="{F-17}" width="70" height="4" rx="1" fill="{HI}"></rect><rect x="{R-70}" y="{F-13}" width="3" height="13" fill="{FILL}"></rect><rect x="{R-12}" y="{F-13}" width="3" height="13" fill="{FILL}"></rect>')
        for k, (bx, bh) in enumerate([(R-66, 12), (R-56, 9), (R-46, 14), (R-34, 8)]):
            g.append(f'<rect x="{bx}" y="{F-17-bh}" width="7" height="{bh}" rx="2" fill="none" stroke="#9fb3d1" stroke-width="1" opacity="0.8"></rect><rect x="{bx+1}" y="{F-17-bh//2}" width="5" height="{bh//2}" fill="{random.choice([C,"#3fc1a5","#e889b6"])}" opacity="0.75"></rect>')
    elif kind == 'shelves':
        g.append(f'<rect x="{R-74}" y="{F-48}" width="70" height="48" fill="{FILL}" stroke="{EDGE}" stroke-width="1.2"></rect>')
        for sy in (F-47, F-31, F-15):
            bx = R-72
            while bx < R-8:
                bw = random.choice([3, 4, 4, 5]); bh = random.choice([10, 11, 12, 13])
                g.append(f'<rect x="{bx}" y="{sy+14-bh}" width="{bw}" height="{bh}" fill="{random.choice(["#8fa8e0","#e8c37a","#3fc1a5","#e889b6","#c4cfe2","#f0a948","#7d5a3a"])}" opacity="0.72"></rect>')
                bx += bw + 1
            g.append(f'<rect x="{R-74}" y="{sy+14}" width="70" height="2" fill="{HI}"></rect>')
    elif kind == 'core':
        for k in range(3):
            rx0 = R-70 + k*23
            g.append(f'<rect x="{rx0}" y="{F-50}" width="19" height="50" rx="3" fill="#16223a" stroke="{EDGE}" stroke-width="1.2"></rect>')
            for j in range(7):
                op = random.choice([0.9, 0.6, 0.35, 0.2])
                cls = ' class="pulse"' if random.random() < 0.12 else ''
                g.append(f'<rect{cls} x="{rx0+4}" y="{F-45+j*6}" width="{random.choice([4,7,11])}" height="2" fill="{C}" opacity="{op}"></rect>')
    elif kind == 'biobed':
        g.append(screen(R-64, F-54, 50, 20, C, f'<polyline points="{R-60},{F-44} {R-50},{F-44} {R-47},{F-50} {R-43},{F-38} {R-40},{F-44} {R-20},{F-44}" fill="none" stroke="{C}" stroke-width="1.4"></polyline>'))
        g.append(f'<rect x="{R-74}" y="{F-18}" width="64" height="7" rx="3" fill="#3a4c6e" stroke="{HI}" stroke-width="1"></rect><rect x="{R-72}" y="{F-21}" width="12" height="4" rx="2" fill="#c4cfe2" opacity="0.7"></rect><rect x="{R-48}" y="{F-11}" width="16" height="11" fill="{FILL}"></rect>')
    elif kind == 'sensors':
        cx, cy = R-30, F-34
        g.append(f'<circle cx="{cx}" cy="{cy}" r="17" fill="#070d18" stroke="{EDGE}" stroke-width="1.2"></circle><circle cx="{cx}" cy="{cy}" r="11" fill="none" stroke="{C}" stroke-width="1" opacity="0.5"></circle><circle cx="{cx}" cy="{cy}" r="5" fill="none" stroke="{C}" stroke-width="1" opacity="0.5"></circle>'
                 f'<path d="M{cx} {cy} L{cx+12} {cy-12}" stroke="{C}" stroke-width="1.6" opacity="0.9"></path><circle class="pulse" cx="{cx-7}" cy="{cy+5}" r="2" fill="{C}"></circle>')
        g.append(desk(R-78, R-48, F, C, 14))
    elif kind == 'starmap':
        inner = ''.join(f'<circle cx="{R-80+random.randint(4,70)}" cy="{F-56+random.randint(4,34)}" r="{random.choice([0.8,1,1.3])}" fill="#ffffff" opacity="0.8"></circle>' for _ in range(16))
        inner += f'<ellipse cx="{R-44}" cy="{F-38}" rx="22" ry="9" fill="none" stroke="{C}" stroke-width="1" opacity="0.7"></ellipse><circle cx="{R-44}" cy="{F-38}" r="3.5" fill="#e8c37a"></circle><circle cx="{R-24}" cy="{F-35}" r="2" fill="{C}"></circle>'
        g.append(screen(R-82, F-58, 78, 40, C, inner))
        g.append(desk(R-70, R-14, F, C, 12))
    elif kind == 'holo':
        g.append(f'<rect x="{R-82}" y="{F-56}" width="78" height="54" fill="url(#g5holo)" opacity="0.75" stroke="#f0c048" stroke-opacity="0.5"></rect><rect x="{R-50}" y="{F-4}" width="14" height="4" fill="#f0c048" opacity="0.8"></rect>')
    elif kind == 'crates':
        for (bx, by, bw, bh) in [(R-70, F-20, 22, 20), (R-46, F-20, 22, 20), (R-58, F-38, 22, 18), (R-22, F-14, 16, 14)]:
            g.append(f'<rect x="{bx}" y="{by}" width="{bw}" height="{bh}" fill="#2a3a56" stroke="{HI}" stroke-width="1"></rect><path d="M{bx} {by} L{bx+bw} {by+bh} M{bx+bw} {by} L{bx} {by+bh}" stroke="#16223a" stroke-width="1"></path><rect x="{bx+2}" y="{by+2}" width="{bw//2}" height="2" fill="{C}" opacity="0.8"></rect>')
    elif kind in ('lockers', 'security'):
        n = 2 if kind == 'security' else 3
        for k in range(n):
            lx = R-20 - k*20
            g.append(f'<rect x="{lx}" y="{F-48}" width="18" height="48" rx="1" fill="{FILL}" stroke="{EDGE}" stroke-width="1.2"></rect><rect x="{lx+13}" y="{F-26}" width="2" height="7" fill="{C}" opacity="0.8"></rect><path d="M{lx+4} {F-44}h10 M{lx+4} {F-41}h10 M{lx+4} {F-38}h10" stroke="#0a1222" stroke-width="1"></path>')
        if kind == 'security':
            ax = R-84
            g.append(f'<path d="M{ax-12} {F} L{ax-12} {F-36} Q{ax} {F-50} {ax+12} {F-36} L{ax+12} {F}" fill="none" stroke="{HI}" stroke-width="4"></path><path d="M{ax-12} {F-36} Q{ax} {F-50} {ax+12} {F-36}" fill="none" stroke="{C}" stroke-width="1.5" opacity="0.9"></path><rect x="{ax-9}" y="{F-34}" width="18" height="34" fill="{C}" opacity="0.08"></rect>')
    elif kind == 'lifesupport':
        g.append(f'<path d="M{x+60} {F-52}H{R} M{x+60} {F-46}H{R}" stroke="{HI}" stroke-width="3"></path>')
        cx, cy = R-26, F-24
        g.append(f'<circle cx="{cx}" cy="{cy}" r="16" fill="#0b1322" stroke="{EDGE}" stroke-width="1.5"></circle>' + ''.join(f'<path d="M{cx} {cy} L{cx+14} {cy-3}" stroke="{C}" stroke-width="3" opacity="0.6" transform="rotate({k*90} {cx} {cy})"></path>' for k in range(4)))
        g.append(f'<rect x="{R-70}" y="{F-36}" width="20" height="36" rx="8" fill="#2a3a56" stroke="{HI}" stroke-width="1"></rect>')
    elif kind == 'comms':
        g.append(screen(R-60, F-52, 54, 22, C, f'<polyline points="' + ' '.join(f'{R-56+k*4},{F-41+random.choice([-7,-4,-1,2,5,7])}' for k in range(12)) + f'" fill="none" stroke="{C}" stroke-width="1.3"></polyline>'))
        g.append(desk(R-64, R-4, F, C, 16))
    elif kind == 'eng':
        g.append(screen(R-88, F-58, 82, 22, C, f'<path d="M{R-80} {F-47} L{R-60} {F-47} L{R-52} {F-43} L{R-28} {F-43} M{R-46} {F-52} C{R-36} {F-56} {R-20} {F-54} {R-14} {F-48} L{R-36} {F-46}" fill="none" stroke="{C}" stroke-width="1.3"></path>'))
        g.append(f'<path d="M{R-90} {F-20} L{R-4} {F-24} L{R-4} {F-18} L{R-90} {F-14} Z" fill="#2a3a56" stroke="{HI}" stroke-width="1"></path><path d="M{R-84} {F-17} L{R-10} {F-21}" stroke="{C}" stroke-width="2" opacity="0.8"></path><rect x="{R-82}" y="{F-14}" width="4" height="14" fill="{FILL}"></rect><rect x="{R-14}" y="{F-18}" width="4" height="18" fill="{FILL}"></rect>')
    elif kind == 'sys':
        g.append(f'<circle cx="{R-14}" cy="{F-14}" r="11" fill="#0b1322" stroke="{HI}" stroke-width="2"></circle><path d="M{R-21} {F-14}h14 M{R-14} {F-21}v14" stroke="{EDGE}" stroke-width="1.5"></path>')
        g.append(screen(R-66, F-50, 40, 20, C, f'<path d="M{R-62} {F-40}h10 v-5 h8 v8 h10" fill="none" stroke="{C}" stroke-width="1.3"></path>'))
        g.append(desk(R-70, R-30, F, C, 16))
    elif kind == 'diag':
        bars = ''.join(f'<rect x="{R-56+k*9}" y="{F-26-h}" width="6" height="{h}" fill="{C}" opacity="0.75"></rect>' for k, h in enumerate([10, 16, 7, 20, 13]))
        g.append(screen(R-60, F-52, 52, 30, C, bars))
        g.append(desk(R-60, R-8, F, C, 12))
    elif kind == 'design':
        g.append(f'<path d="M{R-66} {F-24} L{R-22} {F-44} L{R-16} {F-32} L{R-60} {F-14} Z" fill="#2a3a56" stroke="{HI}" stroke-width="1"></path><path d="M{R-56} {F-22} L{R-28} {F-35} M{R-50} {F-18} L{R-34} {F-26}" stroke="{C}" stroke-width="1.2" opacity="0.85"></path><path d="M{R-40} {F-20} L{R-40} {F} M{R-50} {F} H{R-30}" stroke="{FILL}" stroke-width="3"></path>')
    elif kind == 'calib':
        g.append(f'<rect x="{R-56}" y="{F-36}" width="44" height="22" rx="3" fill="#2a3a56" stroke="{HI}" stroke-width="1"></rect><rect x="{R-53}" y="{F-33}" width="28" height="16" fill="#070d18"></rect><path d="M{R-52} {F-25} q3.5 -6 7 0 t7 0 t7 0 t6 0" fill="none" stroke="{C}" stroke-width="1.2"></path><circle cx="{R-18}" cy="{F-29}" r="2.5" fill="{HI}"></circle><circle cx="{R-18}" cy="{F-21}" r="2.5" fill="{HI}"></circle>')
        g.append(f'<rect x="{R-68}" y="{F-14}" width="64" height="4" fill="{HI}"></rect><rect x="{R-64}" y="{F-10}" width="3" height="10" fill="{FILL}"></rect><rect x="{R-12}" y="{F-10}" width="3" height="10" fill="{FILL}"></rect>')
    elif kind == 'strategist':
        g.append(f'<path d="M{R-60} {F-16} L{R-34} {F-46} L{R-8} {F-16} Z" fill="{C}" opacity="0.1"></path><polyline points="{R-52},{F-30} {R-44},{F-38} {R-36},{F-33} {R-26},{F-46} {R-16},{F-40}" fill="none" stroke="{C}" stroke-width="1.5" opacity="0.9"></polyline><circle cx="{R-26}" cy="{F-46}" r="2.5" fill="#e8c37a"></circle>')
        g.append(f'<rect x="{R-66}" y="{F-16}" width="62" height="5" rx="2" fill="{HI}"></rect><rect x="{R-40}" y="{F-11}" width="10" height="11" fill="{FILL}"></rect>')
    elif kind == 'yeoman':
        cells = ''.join(f'<rect x="{R-56+c*10}" y="{F-52+r*8}" width="8" height="6" fill="{"#e8c37a" if (r, c) == (1, 3) else C}" opacity="{0.9 if (r, c) == (1, 3) else 0.3}"></rect>' for r in range(3) for c in range(5))
        g.append(f'<rect x="{R-60}" y="{F-56}" width="54" height="30" rx="2" fill="#070d18" stroke="{EDGE}" stroke-width="1.2"></rect>' + cells)
        g.append(f'<rect x="{R-66}" y="{F-16}" width="60" height="4" fill="{HI}"></rect><rect x="{R-62}" y="{F-12}" width="3" height="12" fill="{FILL}"></rect><rect x="{R-12}" y="{F-12}" width="3" height="12" fill="{FILL}"></rect><rect x="{R-50}" y="{F-20}" width="10" height="4" rx="1" fill="#c4cfe2" opacity="0.6"></rect><rect x="{R-48}" y="{F-23}" width="10" height="3" rx="1" fill="#8fa8e0" opacity="0.6"></rect>')
    elif kind == 'captquarters':
        stars = ''.join(f'<circle cx="{R-98+random.randint(3,52)}" cy="{F-56+random.randint(3,24)}" r="{random.choice([0.7,1,1.2])}" fill="#ffffff" opacity="0.85"></circle>' for _ in range(10))
        g.append(f'<rect x="{R-100}" y="{F-58}" width="58" height="30" rx="4" fill="#040810" stroke="{HI}" stroke-width="1.5"></rect>' + stars)
        g.append(f'<rect x="{R-34}" y="{F-46}" width="30" height="24" rx="2" fill="#0d3550" fill-opacity="0.85" stroke="#6fc0ff" stroke-opacity="0.6"></rect><path d="M{R-26} {F-35} q5 -5 10 0 q-5 5 -10 0 Z M{R-16} {F-35} l4 -3 v6 Z" fill="#ff7a45"></path><circle cx="{R-10}" cy="{F-41}" r="1.2" fill="#bfe6ff" opacity="0.8"></circle><circle cx="{R-12}" cy="{F-37}" r="0.9" fill="#bfe6ff" opacity="0.8"></circle><rect x="{R-32}" y="{F-22}" width="26" height="22" fill="{FILL}" stroke="{EDGE}" stroke-width="1"></rect>')
        g.append(f'<rect x="{R-98}" y="{F-14}" width="52" height="10" rx="4" fill="#4a3558"></rect><rect x="{R-98}" y="{F-20}" width="10" height="16" rx="3" fill="#4a3558"></rect><rect x="{R-94}" y="{F-4}" width="3" height="4" fill="{FILL}"></rect><rect x="{R-52}" y="{F-4}" width="3" height="4" fill="{FILL}"></rect>')
    return ''.join(g)

KIND = dict(computer='core', archives='shelves', science='lab', sensors='sensors', doctor='biobed', holo='holo', carto='starmap',
            life='lifesupport', security='security', qm='crates', comms='comms', away='lockers', eng='eng', design='design',
            calib='calib', sys='sys', diag='diag', strategist='strategist', yeoman='yeoman', quarters='captquarters')

def room(s, lit=True):
    x, y, w = s['x'], s['y'], s['w']
    wall = 'url(#g6wall)' if lit else 'url(#g6walloff)'
    r = [f'<rect x="{x-3}" y="{y-4}" width="{w+6}" height="4" fill="#2a3446"></rect>',
         f'<rect x="{x}" y="{y}" width="{w}" height="64" fill="{wall}"></rect>']
    r += [f'<path d="' + ' '.join(f'M{sx} {y+4}V{y+60}' for sx in range(x+36, x+w-4, 36)) + '" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path>']
    if lit:
        r.append(f'<rect x="{x}" y="{y}" width="{w}" height="34" fill="url(#g6light)"></rect><rect x="{x+10}" y="{y+1}" width="{w-20}" height="2" rx="1" fill="#e6f1ff" opacity="0.55"></rect>')
    r.append(f'<rect x="{x}" y="{y+60}" width="{w}" height="4" fill="#4a5874"></rect><path d="M{x} {y+60.5}H{x+w}" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="{x-3}" y="{y+64}" width="{w+6}" height="4" fill="#1d2534"></rect>')
    return ''.join(r)

rooms = []
for s in S:
    if s['deck'] == 1 or s['id'] in ('crewq',):
        continue
    lit = s['status'] == 'live'
    C = RAILC[s['rail']]
    out.clear()
    rooms.append(room(s, lit))
    if s['id'] == 'lounge':
        x, y = s['x'], s['y']
        panes = []
        for k in range(5):
            px = 1170 + k*58
            stars = ''.join(f'<circle cx="{px+random.randint(4,48)}" cy="{y+5+random.randint(2,18)}" r="{random.choice([0.7,1,1.3])}" fill="#ffffff" opacity="0.85"></circle>' for _ in range(5))
            panes.append(f'<path d="M{px+6} {y+4} L{px+54} {y+4} L{px+50} {y+26} L{px+2} {y+26} Z" fill="#03060d" stroke="#56709c" stroke-width="1.5"></path>' + stars)
        rooms.append('<g>' + ''.join(panes) + '</g>')
        continue
    k = KIND.get(s['id'])
    if k:
        rooms.append(f'<g opacity="{1 if lit else 0.42}">' + furn(k, s, C) + '</g>')

# transporter room (no tile) and the warp core shaft
tr = dict(x=322, y=828, w=200)
rooms.append(room(tr, True))
rooms.append(''.join(f'<rect x="{px-13}" y="{832}" width="26" height="40" fill="url(#g6beam)" class="core"></rect>' for px in (362, 402, 442, 482)))
rooms.append('<rect x="530" y="708" width="62" height="288" fill="#070d18" stroke="#3d5580" stroke-width="1.5"></rect>'
             '<path d="M530 804H592 M530 900H592" stroke="#4a5874" stroke-width="4"></path>')
open('rooms.svg', 'w').write('\n'.join(rooms))

# bridge
B = []
B.append('<ellipse cx="1490" cy="58" rx="300" ry="40" fill="url(#g6skyglow)"></ellipse>')
B.append('<ellipse cx="1490" cy="40" rx="170" ry="3.5" fill="#e6f2ff" opacity="0.55"></ellipse>')
for (x0, x1, c) in [(1226, 1296, '#8fa8e0'), (1300, 1336, '#e8c37a'), (1340, 1436, '#e889b6'), (1544, 1586, '#3fc1a5'), (1590, 1680, '#8fa8e0'), (1684, 1760, '#f0a948')]:
    B.append(f'<rect x="{x0}" y="{37 if x0 > 1300 and x0 < 1700 else 38}" width="{x1-x0}" height="6" rx="3" fill="{c}" opacity="0.6"></rect>')
# turbolift
B.append('<rect x="1197" y="64" width="26" height="58" rx="2" fill="#2a3a56" stroke="#56709c" stroke-width="1.2"></rect><path d="M1210 66V122" stroke="#0a1222" stroke-width="1.5"></path><rect x="1199" y="60" width="22" height="2.5" rx="1" fill="#e8c37a" opacity="0.8"></rect>')
# viewscreen
stars = ''.join(f'<circle cx="{random.randint(1606,1772)}" cy="{random.randint(55,112)}" r="{random.choice([0.7,0.9,1.2,1.5])}" fill="#ffffff" opacity="{random.choice([0.5,0.7,0.9])}"></circle>' for _ in range(34))
B.append('<rect x="1596" y="46" width="186" height="76" rx="7" fill="#0b1322" stroke="#56709c" stroke-width="2"></rect>'
         '<rect x="1602" y="52" width="174" height="64" rx="4" fill="url(#g6space)"></rect>'
         f'<g clip-path="url(#g6scr)">{stars}<circle cx="1756" cy="170" r="76" fill="url(#g6planet)"></circle><circle cx="1756" cy="170" r="79" fill="none" stroke="#9fe0ff" stroke-width="2" opacity="0.5"></circle></g>'
         '<rect x="1602" y="52" width="174" height="64" rx="4" fill="none" stroke="#6cc6ff" stroke-opacity="0.35" stroke-width="1.5"></rect>')
# upper platform and front floor
B.append('<rect x="1194" y="122" width="404" height="5" fill="#4a5874"></rect><path d="M1194 122.5H1598" stroke="#a3b2cc" stroke-opacity="0.55"></path><rect x="1194" y="127" width="404" height="3" fill="#1d2534"></rect>')
B.append('<path d="M1598 122 L1640 128" stroke="#4a5874" stroke-width="4"></path>')
B.append('<rect x="1158" y="194" width="670" height="6" fill="#4a5874"></rect><path d="M1158 194.5H1828" stroke="#a3b2cc" stroke-opacity="0.55"></path>')
B.append('<rect x="1600" y="176" width="226" height="18" fill="url(#g6screenwash)"></rect>')
# tactical rail (wood)
B.append('<path d="M1240 110 Q1410 100 1584 110" fill="none" stroke="url(#g6wood)" stroke-width="5" stroke-linecap="round"></path>'
         + ''.join(f'<path d="M{px} {108 - (0 if px in (1250,1574) else 3)}V122" stroke="#5e3f22" stroke-width="3"></path>' for px in (1250, 1330, 1490, 1574)))
# command chairs (Number One, Captain)
for cx, gold in ((1256, False), (1435, True)):
    edge = '#e8c37a' if gold else '#56709c'
    B.append(f'<rect x="{cx-19}" y="{63}" width="38" height="34" rx="9" fill="#2a3550" stroke="{edge}" stroke-width="1.5"></rect>'
             f'<rect x="{cx-29}" y="98" width="58" height="7" rx="3" fill="#3a4c6e" stroke="{edge}" stroke-opacity="0.7"></rect>'
             f'<rect x="{cx-27}" y="99.5" width="9" height="2.5" rx="1" fill="{"#e8c37a" if gold else "#3fc1a5"}"></rect><rect x="{cx+18}" y="99.5" width="9" height="2.5" rx="1" fill="{"#e8c37a" if gold else "#3fc1a5"}"></rect>'
             f'<rect x="{cx-6}" y="105" width="12" height="17" fill="#1d2534"></rect>')
# helm and ops: low chairs + consoles facing the screen
for tx in (1390, 1604):
    cx = tx + 28
    B.append(f'<rect x="{cx-17}" y="{168}" width="8" height="16" rx="3" fill="#2a3a56"></rect><rect x="{cx-18}" y="183" width="36" height="5" rx="2" fill="#2a3a56"></rect><rect x="{cx-3}" y="188" width="6" height="6" fill="#1d2534"></rect>')
    x0, x1 = tx + 136, tx + 194
    B.append(f'<path d="M{x0} 194 L{x0+4} 176 L{x1-2} 168 L{x1+2} 194 Z" fill="{FILL}" stroke="#56709c" stroke-width="1.2"></path>'
             f'<path d="M{x0+5} 175 L{x1-3} 167.5 L{x1-2} 171 L{x0+6} 178.5 Z" fill="#3fc1a5" opacity="0.85"></path>'
             + ''.join(f'<rect x="{x0+8+k*10}" y="{183}" width="7" height="2.5" rx="1" fill="{c}" opacity="0.75"></rect>' for k, c in enumerate(['#8fa8e0', '#e8c37a', '#e889b6', '#f0a948', '#3fc1a5'])))
# navigation aft station: wall console
B.append('<rect x="1316" y="138" width="54" height="40" rx="3" fill="#070d18" stroke="#56709c" stroke-width="1.2"></rect>'
         + ''.join(f'<rect x="1320" y="{142+k*7}" width="{random.choice([18,26,32,40])}" height="4" rx="2" fill="{c}" opacity="0.7"></rect>' for k, c in enumerate(['#8fa8e0', '#e8c37a', '#3fc1a5', '#e889b6', '#8fa8e0']))
         + '<path d="M1316 194 L1320 180 L1368 180 L1370 194 Z" fill="#1b2840" stroke="#56709c" stroke-width="1.2"></path>')
open('bridge.svg', 'w').write('\n'.join(B))

# cabins with bunks and lights
cab = open('cabins.svg').read()
def addbunk(m):
    x = int(m.group(1))
    return (m.group(0).replace('fill="#0a1424"', 'fill="url(#g6wall)"') +
            f'<rect x="{x+8}" y="537.5" width="28" height="1.5" rx="0.75" fill="#e6f1ff" opacity="0.45"></rect>'
            f'<rect x="{x+3}" y="578" width="38" height="6" rx="2" fill="#3a4c6e"></rect><rect x="{x+4}" y="575" width="9" height="4" rx="1.5" fill="#8fa8e0" opacity="0.8"></rect>')
cab2 = re.sub(r'<rect x="(\d+)" y="536" width="44" height="52" rx="7" fill="#0a1424"[^>]*></rect>', addbunk, cab)
open('cabins2.svg', 'w').write(cab2)
print(len(open('rooms.svg').read()), len(open('bridge.svg').read()), cab2.count('url(#g6wall)'))
