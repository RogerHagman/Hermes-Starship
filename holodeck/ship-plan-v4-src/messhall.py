import random
random.seed(1010)
X0, W, Y = 1672, 478, 434
F = Y + 60
SKIN = ['#f1c9a5', '#d9a37a', '#a8714a', '#7a4b2e', '#e8b896']
HAIR = ['#2a1d14', '#4a3020', '#1a1410', '#8a6a3a', '#c9c2b8']
T = 300.0          # one loop of mess hall life, in seconds
SPEED = 26.0       # walking speed, svg units per second
STEP = 0.36        # seconds per step
ANG = 16           # leg swing, degrees
o = []
a = o.append
css = []

# ---------- keyframe helpers ----------
def kf(name, prop, pts, fmt, base=False):
    pts = sorted(pts, key=lambda p: p[0])
    if pts[0][0] > 0: pts.insert(0, (0, pts[0][1]))
    assert abs(pts[-1][1] - pts[0][1]) < 1e-6, (name, pts[0], pts[-1])
    if pts[-1][0] < T: pts.append((T, pts[0][1]))
    steps = []
    last = None
    for t, v in pts:
        pc = round(t / T * 100, 3)
        if last is not None and pc <= last: pc = round(last + 0.001, 3)
        steps.append(f'{pc}%{{{prop}:{fmt(v)}}}')
        last = pc
    css.append(f'@keyframes {name}{{' + ''.join(steps) + '}')
    rule = f'.{name}{{animation:{name} {int(T)}s linear infinite'
    if base: rule += f';{prop}:{fmt(pts[0][1])}'
    css.append(rule + '}')

tx = lambda v: f'translateX({v:.1f}px)'
ty = lambda v: f'translateY({v:.1f}px)'
rot = lambda v: f'rotate({v:.0f}deg)'
op = lambda v: f'{v:.2f}'

class Actor:
    def __init__(self, p, home, start):
        self.p = p; self.home = home; self.pos = 0.0
        self.x = [(0, 0.0)]; self.legs = [(0, 0.0)]; self.bob = [(0, 0.0)]
        self.so = [(0, 1.0 if start == 'stand' else 0.0)]
        self.se = [(0, 1.0 if start == 'seat' else 0.0)]
        self.cup = [(0, 0.0)]
    def walk(self, t0, to):
        d = abs(to - self.pos) / SPEED
        self.x += [(t0, self.pos), (t0 + d, to)]
        n = max(2, round(d / STEP))
        self.legs.append((t0, 0.0)); self.bob.append((t0, 0.0))
        for k in range(1, n):
            self.legs.append((t0 + k * d / n, ANG if k % 2 else -ANG))
        for k in range(1, n + 1):
            self.bob.append((t0 + (k - 0.5) * d / n, -1.3)); self.bob.append((t0 + k * d / n, 0.0))
        self.legs.append((t0 + d, 0.0))
        self.pos = to
        return t0 + d
    def _sw(self, track, t, v, dur):
        cur = track[-1][1]
        track += [(t, cur), (t + dur, v)]
    def fade(self, t, on): self._sw(self.so, t, 1.0 if on else 0.0, 0.6)
    def sit(self, t): self._sw(self.so, t, 0.0, 0.3); self._sw(self.se, t, 1.0, 0.3)
    def stand(self, t): self._sw(self.se, t, 0.0, 0.3); self._sw(self.so, t, 1.0, 0.3)
    def cupon(self, t, on): self._sw(self.cup, t, 1.0 if on else 0.0, 0.25)
    def emit(self):
        p = self.p
        kf(p + 'x', 'transform', self.x, tx)
        kf(p + 'b', 'transform', self.bob, ty)
        kf(p + 'l1', 'transform', self.legs, rot)
        kf(p + 'l2', 'transform', [(t, -v) for t, v in self.legs], rot)
        kf(p + 'o', 'opacity', self.so, op, base=True)
        kf(p + 's', 'opacity', self.se, op, base=True)
        kf(p + 'c', 'opacity', self.cup, op, base=True)
        css.append(f'.{p}l1,.{p}l2{{transform-box:fill-box;transform-origin:50% 0}}')

def figure(x, top, color, skin, hair):
    return [f'<circle cx="{x}" cy="{top+4.5}" r="4.2" fill="{skin}"></circle>',
            f'<path d="M{x-4.3} {top+4} a4.3 4.3 0 0 1 8.6 0 Z" fill="{hair}"></path>',
            f'<rect x="{x-6}" y="{top+9.5}" width="12" height="13" rx="4" fill="{color}"></rect>']

def seated_svg(x, top, color, skin, hair, side):
    d = 1 if side == 'right' else -1
    g = figure(x, top, color, skin, hair)
    g.append(f'<rect x="{min(x, x+d*11)}" y="{top+20}" width="11" height="4" rx="2" fill="#1a1f2b"></rect>')
    g.append(f'<rect x="{x+d*10-2}" y="{top+22}" width="4" height="{F-top-22}" fill="#1a1f2b"></rect>')
    return ''.join(g)

def standing_svg(p, x, top, color, skin, hair, cupc):
    g = figure(x, top, color, skin, hair)
    g.append(f'<rect class="mh {p}l1" x="{x-5}" y="{top+22}" width="4" height="{F-top-22}" fill="#1a1f2b"></rect>')
    g.append(f'<rect class="mh {p}l2" x="{x+1}" y="{top+22}" width="4" height="{F-top-22}" fill="#1a1f2b"></rect>')
    g.append(f'<rect class="mh {p}c" x="{x+6}" y="{top+10}" width="3.5" height="5" rx="1" fill="{cupc}"></rect>')
    return f'<g class="mh {p}x"><g class="mh {p}o"><g class="mh {p}b">' + ''.join(g) + '</g></g></g>'

def look():
    return random.choice(SKIN), random.choice(HAIR)

def static_person(x, top, color, seated=None):
    skin, hair = look()
    if seated: return seated_svg(x, top, color, skin, hair, seated)
    return ''.join(figure(x, top, color, skin, hair)) + f'<rect x="{x-5}" y="{top+22}" width="4" height="{F-top-22}" fill="#1a1f2b"></rect><rect x="{x+1}" y="{top+22}" width="4" height="{F-top-22}" fill="#1a1f2b"></rect>'

def sw(track, t, v, dur=0.6):
    track += [(t, track[-1][1]), (t + dur, v)]

# ---------- choreography: one loop, mostly quiet ----------
REP = 1860; LIFT = 1690
bt = Actor('mbt', 1772, 'stand')          # bartender
A = Actor('mga', 2128, 'stand')           # guest at the window
V1 = Actor('mv1', LIFT, 'away')           # officer who comes in by lift, sits, leaves
V2 = Actor('mv2', 1903, 'seat')           # civilian who leaves by lift and comes back later
CV = Actor('mcv', 2091, 'seat')           # seated guest who fetches a drink
door = [(0, 1.0)]; glow = [(0, 0.0)]; drink1 = [(0, 0.0)]; drink2 = [(0, 0.0)]; glass3 = [(0, 0.0)]
def dooropen(t): door.extend([(t, 1.0), (t + 0.8, 0.12), (t + 2.9, 0.12), (t + 3.7, 1.0)])
def replicate(t): glow.extend([(t, 0.0), (t + 0.4, 0.9), (t + 2.2, 0.6), (t + 2.6, 0.0)])

# bartender serves the blue patron
t = bt.walk(14, 40); sw(drink1, t + 0.8, 1.0); bt.walk(t + 3.2, 0)
sw(drink1, 128, 0.0)
# guest at the window gets a drink
t = A.walk(40, REP - 2128); replicate(t); A.cupon(t + 2.4, True); A.walk(t + 2.8, 0); A.cupon(140, False)
# an officer arrives by lift and takes the empty seat at the middle table
dooropen(84); V1.fade(84.7, True); t = V1.walk(85.6, 1998 - LIFT); V1.sit(t + 0.2)
# the civilian at the first table heads out
V2.stand(128); t = V2.walk(128.6, LIFT - 1903); dooropen(t - 0.2); V2.fade(t + 0.5, False)
# the guest at the far table fetches a drink and sits back down
CV.stand(165); t = CV.walk(165.6, REP - 2091); replicate(t); CV.cupon(t + 2.4, True); t = CV.walk(t + 2.8, 0)
CV.sit(t + 0.2); CV.cupon(t + 0.2, False); sw(glass3, t + 0.4, 1.0); sw(glass3, 280, 0.0)
# the officer finishes and leaves
V1.stand(205); t = V1.walk(205.6, 0); dooropen(t - 0.2); V1.fade(t + 0.5, False)
# bartender serves the gold patron
t = bt.walk(236, 24); sw(drink2, t + 0.8, 1.0); bt.walk(t + 3.0, 0); sw(drink2, 292, 0.0)
# the civilian comes back and sits down again
dooropen(262); V2.fade(262.7, True); t = V2.walk(263.6, 0); V2.sit(t + 0.2)

for act in (bt, A, V1, V2, CV): act.emit()
kf('mdoor', 'transform', door, lambda v: f'scaleX({v:.2f})')
css.append('.mdl,.mdr{transform-box:fill-box}.mdl{transform-origin:left center}.mdr{transform-origin:right center}')
css[-2] = css[-2].replace('.mdoor{', '.mdl,.mdr{')
kf('mglow', 'opacity', glow, op, base=True)
kf('mdr1', 'opacity', drink1, op, base=True)
kf('mdr2', 'opacity', drink2, op, base=True)
kf('mgl3', 'opacity', glass3, op, base=True)

# ---------- scene ----------
a(f'<rect x="{X0-3}" y="{Y-4}" width="{W+6}" height="4" fill="#2a3446"></rect>')
a(f'<rect x="{X0}" y="{Y}" width="{W}" height="64" fill="url(#g6wall)"></rect>')
a(f'<rect x="{X0}" y="{Y}" width="{W}" height="64" fill="#ffb066" opacity="0.05"></rect>')
a(f'<rect x="{X0}" y="{Y}" width="{W}" height="34" fill="url(#g6light)"></rect><rect x="{X0+10}" y="{Y+1}" width="{W-20}" height="2" rx="1" fill="#ffe7c4" opacity="0.5"></rect>')
for k in range(5):
    px = 1882 + k * 49
    a(f'<path d="M{px+6} {Y+4} L{px+46} {Y+4} L{px+42} {Y+38} L{px+2} {Y+38} Z" fill="#03060d" stroke="#56709c" stroke-width="1.5"></path>')
    for _ in range(5):
        sy = Y + 8 + random.randint(0, 26); sx = px + 8 + random.randint(0, 22); ln = random.choice([6, 9, 12])
        a(f'<path d="M{sx} {sy}h{ln}" stroke="{random.choice(["#ffffff", "#cfe3ff", "#9fd0ff"])}" stroke-width="1" stroke-linecap="round" opacity="{random.choice([0.5, 0.7, 0.9])}"></path>')
# turbolift
a(f'<rect x="1676" y="{Y+6}" width="28" height="54" rx="2" fill="#070d18" stroke="#56709c" stroke-width="1.5"></rect>')
a(f'<rect x="1679" y="{Y+9}" width="22" height="51" fill="#ffe7c4" opacity="0.35"></rect>')
a(f'<rect class="mh mdl" x="1679" y="{Y+9}" width="11" height="51" fill="#2a3a56" stroke="#56709c" stroke-width="0.8"></rect>')
a(f'<rect class="mh mdr" x="1690" y="{Y+9}" width="11" height="51" fill="#2a3a56" stroke="#56709c" stroke-width="0.8"></rect>')
a(f'<rect x="1680" y="{Y+2}" width="20" height="2.5" rx="1" fill="#e8c37a" opacity="0.85"></rect>')
# bar shelves
a(f'<rect x="1728" y="{Y+16}" width="100" height="22" fill="#ffcc88" opacity="0.07"></rect>')
for sy in (Y + 16, Y + 28):
    bx = 1730
    while bx < 1824:
        bh = random.choice([6, 7, 8, 9]); bw = random.choice([3, 3, 4])
        a(f'<rect x="{bx}" y="{sy-bh}" width="{bw}" height="{bh}" rx="1" fill="{random.choice(["#3fc1a5", "#e8c37a", "#e889b6", "#8fa8e0", "#f0a948", "#c4cfe2"])}" opacity="0.75"></rect>')
        bx += bw + random.choice([2, 3, 4])
    a(f'<rect x="1728" y="{sy}" width="100" height="2.5" fill="#56709c"></rect>')
# bartender (behind the counter)
s, h = look()
a(standing_svg('mbt', 1772, Y + 18, '#7a5a9a', s, h, '#f0a948'))
a(f'<path d="M1734 {F} L1734 {Y+42} Q1736 {Y+38} 1742 {Y+38} L1830 {Y+38} Q1836 {Y+38} 1838 {Y+42} L1838 {F} Z" fill="#22304a" stroke="#56709c" stroke-width="1.2"></path>')
a(f'<path d="M1740 {Y+39} H1832" stroke="#e8c37a" stroke-width="2" opacity="0.8"></path>')
a(f'<rect x="1776" y="{Y+33}" width="3" height="5" fill="#f0a948" opacity="0.85"></rect>')
a(f'<rect class="mh mdr1" x="1815" y="{Y+33}" width="3.5" height="5" rx="1" fill="#3fc1a5"></rect>')
a(f'<rect class="mh mdr2" x="1790" y="{Y+33}" width="3.5" height="5" rx="1" fill="#e889b6"></rect>')
for sx, col in ((1800, '#d4a23c'), (1826, '#4a8fd6')):
    a(f'<path d="M{sx-4} {F} V{F-12} M{sx-9} {F-12} H{sx+1}" stroke="#56709c" stroke-width="2"></path>')
    a(static_person(sx, Y + 26, col, seated='left'))
# tables
def table(cx):
    a(f'<rect x="{cx-16}" y="{F-16}" width="32" height="3" rx="1.5" fill="#8d9bb5"></rect><rect x="{cx-2}" y="{F-13}" width="4" height="11" fill="#56709c"></rect><rect x="{cx-7}" y="{F-2}" width="14" height="2" fill="#56709c"></rect>')
def chair(x, d):
    a(f'<rect x="{x-d*8-1.5}" y="{F-26}" width="3" height="22" fill="#33496e"></rect><rect x="{min(x-d*8, x+d*4)}" y="{F-8}" width="12" height="3" fill="#33496e"></rect>')
LOOKS = {}
for p_, col in (('mv1', '#c8524a'), ('mv2', '#7a5a9a'), ('mcv', '#4f8a6a'), ('mga', '#4a8fd6')):
    LOOKS[p_] = (col,) + look()
SEATS = {(1880, 'l'): '#c8524a', (1880, 'r'): 'mv2', (1975, 'l'): '#d4a23c', (1975, 'r'): 'mv1', (2068, 'l'): '#4a8fd6', (2068, 'r'): 'mcv'}
for cx in (1880, 1975, 2068):
    for side in ('l', 'r'):
        who = SEATS[(cx, side)]
        x = cx - 23 if side == 'l' else cx + 23
        d = 1 if side == 'l' else -1
        chair(x, d)
        facing = 'right' if side == 'l' else 'left'
        if who.startswith('m'):
            col, s, h = LOOKS[who]
            a(f'<g class="mh {who}s">' + seated_svg(x, F - 32, col, s, h, facing) + '</g>')
        else:
            a(static_person(x, F - 32, who, seated=facing))
    table(cx)
    a(f'<rect x="{cx-7}" y="{F-21}" width="3" height="5" fill="{random.choice(["#3fc1a5", "#e889b6", "#f0a948"])}" opacity="0.85"></rect>')
a(f'<rect class="mh mgl3" x="2076" y="{F-20}" width="3" height="4" fill="#e889b6"></rect>')
# replicator alcove
a(f'<rect x="1846" y="{Y+12}" width="28" height="30" rx="3" fill="#070d18" stroke="#56709c" stroke-width="1.5"></rect>')
a(f'<rect class="mh mglow" x="1849" y="{Y+15}" width="22" height="24" rx="2" fill="#bfe6ff"></rect>')
a(f'<rect x="1849" y="{Y+36}" width="22" height="3" fill="#56709c"></rect><rect x="1876" y="{Y+16}" width="4" height="12" rx="2" fill="#e8c37a" opacity="0.8"></rect><rect x="1876" y="{Y+30}" width="4" height="6" rx="2" fill="#3fc1a5" opacity="0.8"></rect>')
# floor, then everyone on their feet
a(f'<rect x="{X0}" y="{F}" width="{W}" height="4" fill="#4a5874"></rect><path d="M{X0} {F+0.5}H{X0+W}" stroke="#a3b2cc" stroke-opacity="0.5"></path><rect x="{X0-3}" y="{F+4}" width="{W+6}" height="4" fill="#1d2534"></rect>')
for p_, home in (('mga', 2128), ('mv1', LIFT), ('mv2', 1903), ('mcv', 2091)):
    col, s, h = LOOKS[p_]
    a(standing_svg(p_, home, Y + 16, col, s, h, random.choice(['#3fc1a5', '#e889b6', '#f0a948'])))
a(f'<text x="1676" y="429" font-size="11" letter-spacing="1.8" fill="#e8c37a">MESS HALL · TEN FORWARD</text>')
open('messhall.svg', 'w').write('\n'.join(o))
open('messhall.css', 'w').write('\n'.join(css))
print(len(o), 'elements,', sum(len(c) for c in css), 'bytes of css')
