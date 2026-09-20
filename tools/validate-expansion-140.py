"""Audit the 20 new datasets against reference CSVs and independent divisor pairs."""
import csv, json, math, random, hashlib, subprocess
from pathlib import Path
root=Path(__file__).resolve().parent.parent
registry=json.loads((root/'tools/sequences.json').read_text())
old=json.loads(subprocess.check_output(['git','show','e012efb26998fe4f50f60ad0ac298d52688f04cf:tools/sequences.json'],cwd=root))
new=[s for s in registry if s['id'] not in {s['id'] for s in old}]
assert len(registry)==140 and len(new)==20
report={'sequences':[], 'originalDatasetsUnchanged':True}
assert registry[:120]==old
assert not subprocess.check_output(['git','diff','--name-only','e012efb26998fe4f50f60ad0ac298d52688f04cf','--','dist/js','dist/css'],cwd=root)

for s in old:
 changed=subprocess.check_output(['git','diff','--name-only','e012efb26998fe4f50f60ad0ac298d52688f04cf','--','dist/data/'+s['id'],'dist/assets/previews/'+s['id']+'.png'],cwd=root)
 assert not changed,(s['id'],changed)
for s in new:
 rows=[tuple(map(int,r)) for r in list(csv.reader((root/'raw'/ (s['id']+'.csv')).open()))[1:]]
 assert sum(r[2]>0 for r in rows)==200000
 sampled=rows[:32]+random.Random(s['id']).sample(rows,40)
 for n,a,k,L,d in sampled:
  if a<=2*d:assert k==L==0;continue
  ell=a-d;expected=ell
  for t in range(1,math.isqrt(ell)+1):
   if ell%t==0:
    for candidate in (t,ell//t):
     if candidate>d:expected=min(expected,candidate)
  assert k==expected and k*L+d==a,(s['id'],n)
 refs=root/'tools/fixtures/expansion-140'/(s['id']+'.csv');matched=0
 assert refs.exists()
 reference=[tuple(map(int,r)) for r in list(csv.reader(refs.open(),delimiter=';'))[1:] if len(r)==5]
 assert len(reference)>9000
 assert rows[:len(reference)]==reference,s['id']
 matched=len(reference)
 m=json.loads((root/'dist/data'/s['id']/'manifest.json').read_text())
 assert m['points']==200000 and len(m['chunks'])==8
 report['sequences'].append({'id':s['id'],'points':m['points'],'referenceRowsMatched':matched,'independentMinimalityChecks':len(sampled),'classification':m['classification']})
 print(s['id'], 'PASS',matched,'reference rows;',m['classification'],flush=True)
report['totalPoints']=28000000
report['newPoints']=4000000
(root/'EXPANSION-140-VALIDATION.json').write_text(json.dumps(report,indent=2)+'\n')

import re
page=(root/'dist/index.html').read_text()
oldpage=subprocess.check_output(['git','show','e012efb26998fe4f50f60ad0ac298d52688f04cf:dist/index.html'],cwd=root,text=True)
cards=lambda s:{re.search(r'href="explore.html#([^"]+)"',c)[1]:c for c in re.findall(r'<a class="graph-card".*?</a>',s,re.S)}
current=cards(page);original=cards(oldpage)
assert len(current)==140 and all(current[id]==card for id,card in original.items())
assert set(current)=={s['id'] for s in registry}
cat=root/'dist/data/catalog'
index=json.loads((cat/'index.json').read_text());search=json.loads((cat/'search.json').read_text())
assert index['total']==140 and len(search)==140 and len(list(cat.glob('page-*.json')))==7
catalog=[]
for i in range(7):
 entries=json.loads((cat/f'page-{i}.json').read_text());assert len(entries)==20
 catalog.extend(entries)
 for e in entries:assert next(r for r in search if r[0]==e['id'])[3]==i
assert [int(s['oeis'][1:]) for s in catalog]==sorted(int(s['oeis'][1:]) for s in registry)
# Only the gallery contents and sequence/point counts may change in authored HTML.
def normalize(s):
 s=re.sub(r'<div id="graph-gallery" class="graph-gallery">.*?(?=<div id="gallery-empty")','GALLERY',s,flags=re.S)
 return s.replace('140 integer sequences','120 integer sequences').replace('140 sequences','120 sequences').replace('140 sequence previews','120 sequence previews').replace('"numberOfItems": 140','"numberOfItems": 120').replace('28,000,000 computed points','24,000,000 computed points')
assert normalize(page)==normalize(oldpage)
oldexplore=subprocess.check_output(['git','show','e012efb26998fe4f50f60ad0ac298d52688f04cf:dist/explore.html'],cwd=root,text=True)
assert normalize((root/'dist/explore.html').read_text())==normalize(oldexplore)
print('PASS: 120 original datasets/previews/cards preserved; 140 gallery entries; 7 catalogue pages; unchanged design and controls.')
