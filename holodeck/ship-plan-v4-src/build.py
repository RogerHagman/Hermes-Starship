t=open('template.html').read()
a=t.index('<svg class="hull"'); b=t.index('</svg>',a)+len('</svg>')
t=t[:a]+open('hull.svg').read()+t[b:]
t=t.replace('<title>Hermes ship plan v3</title>','<title>Hermes ship plan v4</title>')
t=t.replace('HERMES · MASTER SYSTEMS DISPLAY · SIDE ELEVATION','HERMES · MASTER SYSTEMS DISPLAY · V4 · HULL AND CUTAWAY')
t=t.replace('HX-01 · MSD 01','HX-01 · MSD 02')
t=t.replace('%%MESSCSS%%',open('messhall.css').read())
t=t.replace('%%SEATS%%',open('seats.svg').read().strip()).replace('%%CABINS%%',open('cabins2.svg').read().strip())
s=open('script.js').read()
old="{ label: 'Clean original', href: 'Main.dc.html' },"
assert old in s
s=s.replace(old,"{ label: 'Ship plan v3', href: 'DeckPlanV3.dc.html' },\n        "+old)
open('script.v5.js','w').write(s)
t=t.replace('%%SCRIPT%%',s)
assert '%%' not in t
open('DeckPlanV4.dc.html','w').write(t)
print(len(t))
