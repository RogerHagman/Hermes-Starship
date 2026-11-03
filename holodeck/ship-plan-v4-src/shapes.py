import re, math
def parse(d):
    toks=re.findall(r'[MLCQZ]|-?\d+\.?\d*',d)
    i=0;cur=None;cmd=None;segs=[];start=None
    while i<len(toks):
        t=toks[i]
        if t in 'MLCQZ': cmd=t;i+=1
        if cmd=='M': cur=(float(toks[i]),float(toks[i+1]));start=cur;i+=2;cmd='L'
        elif cmd=='L': p=(float(toks[i]),float(toks[i+1]));segs.append(('L',cur,p));cur=p;i+=2
        elif cmd=='Q':
            c=(float(toks[i]),float(toks[i+1]));p=(float(toks[i+2]),float(toks[i+3]));segs.append(('Q',cur,c,p));cur=p;i+=4
        elif cmd=='C':
            c1=(float(toks[i]),float(toks[i+1]));c2=(float(toks[i+2]),float(toks[i+3]));p=(float(toks[i+4]),float(toks[i+5]))
            segs.append(('C',cur,c1,c2,p));cur=p;i+=6
        elif cmd=='Z': segs.append(('L',cur,start));cur=start;cmd=None
    poly=[]
    for s in segs:
        N=200
        for k in range(N):
            t=k/N;u=1-t
            if s[0]=='L': a,b=s[1],s[2];poly.append((a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t))
            elif s[0]=='Q': a,c,b=s[1],s[2],s[3];poly.append((u*u*a[0]+2*u*t*c[0]+t*t*b[0],u*u*a[1]+2*u*t*c[1]+t*t*b[1]))
            else:
                a,b,c,dd=s[1],s[2],s[3],s[4]
                poly.append((u**3*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t**3*dd[0],u**3*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t**3*dd[1]))
    return poly
def inside(poly,x,y):
    c=False;n=len(poly)
    for k in range(n):
        (x1,y1),(x2,y2)=poly[k],poly[(k+1)%n]
        if (y1>y)!=(y2>y) and x < x1+(y-y1)*(x2-x1)/(y2-y1): c=not c
    return c
def dist(poly,x,y):
    return min(math.hypot(px-x,py-y) for px,py in poly)
def check(name,d,pts,margin=6):
    p=parse(d);bad=[]
    for (x,y) in pts:
        if not inside(p,x,y) or dist(p,x,y)<margin: bad.append((x,y,inside(p,x,y),round(dist(p,x,y),1)))
    print(name,'OK' if not bad else bad)
def corners(x,y,w,h): return [(x,y),(x+w,y),(x,y+h),(x+w,y+h)]
