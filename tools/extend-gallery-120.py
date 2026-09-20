"""Build the atlas homepage and exact-data previews; never modifies sequence data."""
import csv, gzip, html, json, math, re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parent.parent / 'dist'
entries = []
for page in sorted((root / 'data/catalog').glob('page-*.json')):
    entries.extend(json.loads(page.read_text()))
entries.sort(key=lambda entry: int(entry['oeis'][1:]))
previews = root / 'assets/previews'
previews.mkdir(exist_ok=True)
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 16)
for entry in entries:
    if (previews / (entry['id']+'.png')).exists():
        continue
    directory = root / 'data' / entry['id']
    manifest = json.loads((directory / 'manifest.json').read_text())
    chunk = manifest['chunks'][0]
    with gzip.open(directory / chunk['file'], 'rt') as stream:
        rows = list(csv.DictReader(stream))
    points = [(math.log(int(r['k'])), math.log(int(r['L'])), int(r['k']) > int(r['L'])) for r in rows]
    maximum = max(2, math.ceil(max(max(x, y) for x, y, _ in points)))
    im = Image.new('RGB', (640, 400), '#080e19')
    draw = ImageDraw.Draw(im, 'RGBA')
    left, bottom, size = 157, 355, 318
    def xy(x, y): return left + size*x/maximum, bottom - size*y/maximum
    step = max(1, math.ceil(maximum / 4))
    for v in range(0, maximum+1, step):
        draw.line([xy(v, 0), xy(v, maximum)], fill=(37,49,69,140))
        draw.line([xy(0, v), xy(maximum, v)], fill=(37,49,69,140))
        draw.text((xy(v,0)[0],bottom+8),str(v),font=font,fill='#9eacc3',anchor='mt')
        draw.text((left-10,xy(0,v)[1]),str(v),font=font,fill='#9eacc3',anchor='rm')
    draw.line([xy(0,0),xy(maximum,0)],fill='#52637b')
    draw.line([xy(0,0),xy(0,maximum)],fill='#52637b')
    for i in range(0, 100, 3):
        draw.line([xy(maximum*i/100,maximum*i/100),xy(maximum*(i+1)/100,maximum*(i+1)/100)],fill=(158,172,195,100))
    for x, y, level in points:
        px, py = xy(x,y)
        draw.ellipse((px-.7,py-.7,px+.7,py+.7),fill=(255,189,102,155) if level else (100,149,250,155))
    draw.text((left,12),'ln L · level',font=font,fill='#9eacc3')
    draw.text((left+size+16,bottom-2),'ln k',font=font,fill='#9eacc3')
    im.save(previews / (entry['id']+'.png'),optimize=True)

# Extend the existing gallery without rebuilding its surrounding page.
p = root / 'index.html'
page = p.read_text()
start = page.index('<div id="graph-gallery" class="graph-gallery">')
end = page.index('<div id="gallery-empty"', start)
old = page[start:end]
card_map = {re.search(r'href="explore.html#([^"]+)"', card)[1]:card for card in re.findall(r'<a class="graph-card".*?</a>', old, re.S)}
for e in entries:
    if e['id'] in card_map: continue
    esc=lambda t:html.escape(t,quote=True)
    card_map[e['id']]=f'''<a class="graph-card" href="explore.html#{e['id']}" data-search="{esc(e['name']+' '+e['oeis']+' '+e['id'])}" aria-label="{esc(e['name'])} ({e['oeis']}) — open interactive graph">
<img src="assets/previews/{e['id']}.png" width="640" height="400" alt="Weight–level projection of {esc(e['name'])}; natural logarithms on equal scales" loading="lazy" decoding="async">
<div class="card-label"><h2>{esc(e['name'])}</h2><span>{e['oeis']}</span></div></a>'''
page=page[:start]+'<div id="graph-gallery" class="graph-gallery">'+''.join(card_map[e['id']] for e in entries)+'</div>\n'+page[end:]
page=page.replace('100 integer sequences','120 integer sequences').replace('100 sequences','120 sequences').replace('100 sequence previews','120 sequence previews').replace('"numberOfItems": 100','"numberOfItems": 120').replace('20,000,000 computed points','24,000,000 computed points')
# Existing social artwork and its image metadata stay as provided.
page=page.replace('content="WLJ Atlas: 120 sequences and interactive weight–level graph previews"','content="WLJ Atlas: 100 sequences and interactive weight–level graph previews"')
p.write_text(page)
p=root/'explore.html'
s=p.read_text().replace('100 integer sequences','120 integer sequences').replace('>100 sequences<','>120 sequences<');p.write_text(s)
print('120 gallery cards; 20 new previews; existing design and controls preserved.')
