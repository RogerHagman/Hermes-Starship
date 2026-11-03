import random, math
from shapes import parse, inside, dist
import deflector, bussard
random.seed(1701)
SAUCER="M704 412 C710 312 830 204 1040 190 C1240 180 1720 180 1920 190 C2106 204 2198 300 2199 410 C2198 524 2108 620 1930 630 C1720 640 1240 640 1050 630 C846 618 710 512 704 412 Z"
DOME="M1024 218 C1044 104 1150 20 1320 10 L1660 10 C1830 20 1936 104 1956 218 Z"
G01="M1206 36 L1774 36 Q1790 36 1794 50 L1834 192 Q1838 206 1822 206 L1158 206 Q1142 206 1146 192 L1186 50 Q1190 36 1206 36 Z"
HULL="M150 696 L1190 696 C1290 696 1352 758 1358 832 C1362 914 1300 1030 1176 1034 L250 1034 C140 1034 70 992 62 924 L56 786 C54 731 90 696 150 696 Z"
NECK="M1066 614 L1414 614 C1338 642 1268 672 1222 702 L876 702 C954 672 1016 642 1066 614 Z"
NAC_NEAR="M40 130 C40 114 54 102 84 99 L640 92 C700 90 748 104 760 124 C766 140 750 158 704 162 L92 164 C60 163 40 149 40 130 Z"
NAC_FAR="M46 377 C46 365 58 356 82 354 L560 349 C608 348 640 358 648 372 C652 386 638 398 600 401 L88 403 C62 402 46 391 46 377 Z"
PYL_NEAR="M376 156 L452 156 C470 330 506 520 566 700 L446 700 C420 520 392 330 376 156 Z"
PYL_FAR="M214 396 L276 396 C330 500 440 620 556 700 L470 700 C380 620 280 500 214 396 Z"
BANDS=[(922,222,1110,88),(792,318,1370,88),(790,414,1374,88),(944,510,1088,88),(100,712,1150,88),(100,808,1150,88),(160,904,1080,88)]
P={k:parse(v) for k,v in dict(s=SAUCER,d=DOME,h=HULL,n=NECK,g=G01).items()}
def inband(x,y,m=7):
    return any(bx-m<=x<=bx+bw+m and by-m<=y<=by+bh+m for bx,by,bw,bh in BANDS)
def ok(shape,x,y,inset):
    p=P[shape]; return inside(p,x,y) and dist(p,x,y)>=inset
win=[]
def row(shape,y,x0,x1,step=15,inset=9,extra=None):
    x=x0
    while x<=x1:
        if ok(shape,x,y,inset) and not inband(x,y) and (extra is None or extra(x,y)):
            win.append((x,y))
        x+=step
notdome=lambda x,y: not inside(P['d'],x,y+2) and not inside(P['d'],x,y-2)
notg01=lambda x,y: not inside(P['g'],x,y) or dist(P['g'],x,y)<0
# saucer: upper flank rows, lower flank rows, rim strip, lower edge
for y in (204,218): row('s',y,720,2190,15,8,notdome)
for y in (234,252,270,288,306): row('s',y,716,2196,15,9)
for y in (520,538,556,574,592): row('s',y,716,2196,15,9)
for y in (606,620): row('s',y,716,2196,15,7)
for y in (330,350,370,390,430,450,470,490): row('s',y,700,2199,13,10)
# dome flanks outside the deck 01 glass
for y in (60,80,100,120,140,160,180,198): row('d',y,1030,1950,14,9,lambda x,y: not inside(P['g'],x,y) and dist(P['g'],x,y)>8)
# neck
for y in (628,646,664,682): row('n',y,880,1410,14,8)
# hull
row('h',703,150,1200,15,4)
for y in (1004,1020): row('h',y,120,1300,15,8)
for y in (724,744,764,784,824,844,864,884,920,940,960,980): row("h",y,60,1360,14,9,lambda x,y: x<1300 and not (x<84 and 790<y<920) and not inside(deflector.COWL_POLY,x,y) and dist(deflector.COWL_POLY,x,y)>8)
wins=[]
for (x,y) in win:
    warm=random.random()<0.62
    op=random.choice([0.95,0.85,0.7,0.55,0.4])
    if random.random()<0.12: continue
    wins.append(f'<rect x="{x-3}" y="{y-1.5}" width="6" height="3" rx="1" fill="{"#ffe7bd" if warm else "#d9ecff"}" opacity="{op}"></rect>')
stars=[]
for i in range(260):
    x=random.uniform(0,2200);y=random.uniform(0,1060);r=random.choice([0.6,0.8,0.9,1.1,1.3,1.6]);o=round(random.uniform(0.2,0.85),2)
    c=random.choice(['#ffffff','#ffffff','#dfe9ff','#fff1dc','#cfe0ff'])
    stars.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r}" fill="{c}" opacity="{o}"></circle>')
bright=[]
for (x,y) in [(150,560),(880,70),(2080,90),(1980,700),(640,1010),(330,240),(2140,960),(1140,140)]:
    bright.append(f'<g transform="translate({x} {y})"><circle r="9" fill="url(#g5star)"></circle><path d="M-9 0H9 M0 -9V9" stroke="#ffffff" stroke-width="0.8" opacity="0.6"></path><circle r="1.6" fill="#ffffff"></circle></g>')
def grille_lines(x0,x1,y0,y1,step):
    return ' '.join(f'M{x} {y0}V{y1}' for x in range(x0,x1+1,step))
out=open('hull.tpl').read()
rep=dict(SAUCER=SAUCER,DOME=DOME,G01=G01,HULL=HULL,NECK=NECK,NAC_NEAR=NAC_NEAR,NAC_FAR=NAC_FAR,PYL_NEAR=PYL_NEAR,PYL_FAR=PYL_FAR,
 STARS='\n'.join(stars),BRIGHT='\n'.join(bright),WINDOWS='\n'.join(wins),
 GRILLE_NEAR=grille_lines(110,640,114,146,12),ROOMS=open('rooms.svg').read(),MESS=open('messhall.svg').read(),DEFLECTOR=deflector.SVG,DOME_NEAR=bussard.DOME_NEAR,DOME_FAR=bussard.DOME_FAR,COLLAR_NEAR=bussard.COLLAR_NEAR,COLLAR_FAR=bussard.COLLAR_FAR,BRIDGE=open('bridge.svg').read(),GRILLE_FAR=grille_lines(104,550,364,390,11))
for k,v in rep.items(): out=out.replace('@@'+k+'@@',v)
assert '@@' not in out, out[out.index('@@'):out.index('@@')+40]
open('hull.svg','w').write(out)
print(len(wins),'windows',len(out),'bytes')
