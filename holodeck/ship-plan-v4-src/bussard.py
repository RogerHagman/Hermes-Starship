import math
K = 0.29

def f(v):
    return f'{v:.1f}'

def dome_d(B, cy, R, L):
    k = K * R
    return (f'M{B} {f(cy - R)} A{L} {R} 0 0 1 {B + L} {f(cy)} A{L} {R} 0 0 1 {B} {f(cy + R)} '
            f'A{f(k)} {R} 0 0 0 {B} {f(cy - R)} Z')

def meridian(B, cy, R, L, th, s0=0.0, s1=1.0, n=24):
    pts = []
    for i in range(n + 1):
        s = s0 + (s1 - s0) * i / n
        rho = R * math.sqrt(max(1 - s * s, 0))
        pts.append((B + L * s + K * rho * math.sin(th), cy - rho * math.cos(th)))
    return 'M' + ' L'.join(f'{f(x)} {f(y)}' for x, y in pts)

def latitude(B, cy, R, L, s):
    rho = R * math.sqrt(1 - s * s)
    x = B + L * s
    return f'M{f(x)} {f(cy - rho)} A{f(K * rho)} {f(rho)} 0 0 1 {f(x)} {f(cy + rho)}'

def collar(B, cy, R, w, gid):
    k = K * R
    d = (f'M{B - w} {f(cy - R)} A{f(k)} {R} 0 0 1 {B - w} {f(cy + R)} L{B} {f(cy + R)} '
         f'A{f(k)} {R} 0 0 0 {B} {f(cy - R)} Z')
    return '\n'.join([
        f'<path d="{d}" fill="url(#{gid})"></path>',
        f'<path d="M{B - w} {f(cy - R)} A{f(k)} {R} 0 0 1 {B - w} {f(cy + R)}" fill="none" stroke="#0b111c" stroke-opacity="0.7" stroke-width="1.4"></path>',
        f'<path d="M{B - w + 1.5} {f(cy - R + 2)} A{f(k)} {R - 2} 0 0 1 {B - w + 1.5} {f(cy + R - 2)}" fill="none" stroke="#f4f8ff" stroke-opacity="0.35" stroke-width="1"></path>',
    ])

def dome(B, cy, R, L, tag):
    d = dome_d(B, cy, R, L)
    clip = f'g7bclip{tag}'
    mer = ' '.join(meridian(B, cy, R, L, math.radians(a)) for a in (30, 60, 90, 120, 150))
    lat = ' '.join(latitude(B, cy, R, L, s) for s in (0.42, 0.78))
    spec = meridian(B, cy, R, L, math.radians(38), 0.12, 0.62)
    return '\n'.join([
        f'<defs><clipPath id="{clip}"><path d="{d}"></path></clipPath></defs>',
        f'<path class="core" d="{d}" fill="url(#g7buss)"></path>',
        f'<g clip-path="url(#{clip})">',
        f'<path d="{d}" fill="url(#g7bussshade)"></path>',
        f'<path d="{mer} {lat}" fill="none" stroke="#5c0719" stroke-opacity="0.32" stroke-width="1"></path>',
        f'<path d="{mer}" fill="none" stroke="#ffd6e0" stroke-opacity="0.22" stroke-width="0.8" transform="translate(0.9 -0.6)"></path>',
        f'<path d="{d}" fill="none" stroke="#3a0010" stroke-opacity="0.55" stroke-width="{f(R * 0.22)}"></path>',
        '</g>',
        f'<path d="{d}" fill="none" stroke="#ff8aa4" stroke-opacity="0.45" stroke-width="1.2"></path>',
        f'<path d="{spec}" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="{f(R * 0.09)}" stroke-linecap="round"></path>',
        f'<circle cx="{f(B + L * 0.3 + K * R * 0.6)}" cy="{f(cy - R * 0.62)}" r="{f(R * 0.06)}" fill="#ffffff" opacity="0.85"></circle>',
    ])

DEFS = '''<defs>
<radialGradient id="g7buss" cx="0.58" cy="0.4" r="0.62" fx="0.62" fy="0.36"><stop offset="0" stop-color="#fff2f5"></stop><stop offset="0.2" stop-color="#ffa0b8"></stop><stop offset="0.5" stop-color="#ff2b58"></stop><stop offset="0.82" stop-color="#a50f30"></stop><stop offset="1" stop-color="#4a0514"></stop></radialGradient>
<linearGradient id="g7bussshade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a0010" stop-opacity="0"></stop><stop offset="0.55" stop-color="#3a0010" stop-opacity="0.05"></stop><stop offset="1" stop-color="#2a000b" stop-opacity="0.6"></stop></linearGradient>
<linearGradient id="g7collar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef3fa"></stop><stop offset="0.3" stop-color="#9aa6bb"></stop><stop offset="0.7" stop-color="#4a566d"></stop><stop offset="1" stop-color="#1f2736"></stop></linearGradient>
<linearGradient id="g7collarfar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b7c1d1"></stop><stop offset="0.4" stop-color="#6b788f"></stop><stop offset="1" stop-color="#1c2331"></stop></linearGradient>
</defs>'''

NEAR = dict(B=690, cy=129, R=31, L=72)
FAR = dict(B=590, cy=376, R=24, L=62)
COLLAR_NEAR = DEFS + '\n' + collar(NEAR['B'], NEAR['cy'], NEAR['R'], 8, 'g7collar')
COLLAR_FAR = collar(FAR['B'], FAR['cy'], FAR['R'], 7, 'g7collarfar')
DOME_NEAR = dome(tag='n', **NEAR)
DOME_FAR = dome(tag='f', **FAR)
