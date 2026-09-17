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

escape=html.escape
cards=[]
for i,e in enumerate(entries):
    cards.append(f'''<a class="graph-card" href="explore.html#{e['id']}" data-search="{escape(e['name']+' '+e['oeis']+' '+e['id'],quote=True)}" aria-label="{escape(e['name'],quote=True)} ({e['oeis']}) — open interactive graph">
<img src="assets/previews/{e['id']}.png" width="640" height="400" alt="Weight–level projection of {escape(e['name'],quote=True)}; natural logarithms on equal scales" loading="{'eager' if i<4 else 'lazy'}" decoding="async">
<div class="card-label"><h2>{escape(e['name'])}</h2><span>{e['oeis']}</span></div></a>''')
count=len(entries)
points=sum(e['points'] for e in entries)
old=(root/'explore.html').read_text()
head=old.split('<body>')[0].replace('<title>Interactive graphs — WLJ Atlas</title>','<title>WLJ Atlas — explore integer sequences</title>')
head=head.replace('WLJ Atlas — sequences in three dimensions','WLJ Atlas — explore integer sequences')
head=re.sub(r'(<meta name="description" content=")[^"]*',lambda m:m[1]+f'Explore {count} integer sequences through weight × level + jump. Search by sequence name or OEIS ID, compare graph previews and open interactive 2D and 3D graphs.',head)
head=re.sub(r'(<meta (?:property="og:description"|name="twitter:description") content=")[^"]*',lambda m:m[1]+f'{count} integer sequences, distinct arithmetic patterns. Explore the searchable gallery and interactive weight × level + jump graphs.',head)
head=head.replace('</head>','<link rel="stylesheet" href="assets/home.css">\n<script src="js/home-route.js"></script>\n</head>')
header=old.split('<body>')[1].split('<main')[0]
page=head+'<body class="atlas-home">'+header+f'''
<main class="atlas-main">
<section class="atlas-intro" aria-labelledby="atlas-title">
<div class="eyebrow">THE WEIGHT × LEVEL + JUMP ATLAS</div>
<h1 id="atlas-title">Integer sequences, seen through a shared lens.</h1>
<p>Explore how arithmetic structure takes shape across {count} integer sequences: natural numbers, primes, figurate numbers, digit patterns and more. The decomposition <span class="formula">a(n) = k(n)L(n) + d(n)</span> connects each term’s next gap, or jump, with its weight and level.</p>
<div class="atlas-summary"><span>{count} sequences</span><span>{points:,} computed points</span><span>Interactive 2D &amp; 3D graphs</span></div>
</section>
<section class="atlas-gallery" aria-label="Sequence graph gallery">
<div class="gallery-tools"><label class="gallery-search" for="gallery-search"><span>Find a sequence</span><input id="gallery-search" type="search" placeholder="Sequence name or OEIS ID…" autocomplete="off" aria-controls="graph-gallery"></label><p id="gallery-count" role="status" aria-live="polite">{count} sequences</p></div>
<div class="gallery-caption"><span>Weight–level previews · first 25,000 plotted terms · equal log scales</span><span class="gallery-legend"><span><i class="swatch weight"></i>Weight (k ≤ L)</span><span><i class="swatch level"></i>Level (k &gt; L)</span></span></div>
<div id="graph-gallery" class="graph-gallery">{''.join(cards)}</div>
<div id="gallery-empty" class="gallery-empty" hidden><p>No matching sequences. Try another name or OEIS ID.</p><button id="clear-search" type="button">Clear search</button></div>
</section>
<footer class="atlas-footer"><p>Open any preview to explore its full dataset, switch between 2D and 3D, inspect a decomposition or download the loaded CSV.</p><a href="https://decompwlj.com/" target="_blank" rel="noopener">About the decomposition ↗</a></footer>
</main>
<noscript>All 100 sequence previews are shown. Enable JavaScript to search the atlas. Interactive graphs require JavaScript and WebGL2.</noscript>
<script type="module" src="js/home.js"></script>
</body></html>'''
(root/'index.html').write_text(page)
print(f'Built homepage and {count} previews from original CSV chunks; {points:,} full-dataset points retained.')
