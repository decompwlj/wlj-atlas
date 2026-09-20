"""Audit the 20 new datasets against reference CSVs and independent divisor pairs."""
import csv, json, math, random, hashlib, subprocess
from pathlib import Path
root=Path(__file__).resolve().parent.parent
registry=json.loads((root/'tools/sequences.json').read_text())
old=json.loads(subprocess.check_output(['git','show','a3347a1f0c2d29b25efffb90b6d53ab24184395a:tools/sequences.json'],cwd=root))
new=[s for s in registry if s['id'] not in {s['id'] for s in old}]
assert len(registry)==120 and len(new)==20
report={'sequences':[], 'originalDatasetsUnchanged':True}
for s in old:
 changed=subprocess.check_output(['git','diff','--name-only','a3347a1f0c2d29b25efffb90b6d53ab24184395a','--','dist/data/'+s['id'],'dist/assets/previews/'+s['id']+'.png'],cwd=root)
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
 refs=root/'tools/fixtures/expansion-120'/(s['id']+'.csv');matched=0
 if refs.exists():
  actual={r[1]:r[2:] for r in rows}
  for r in list(csv.reader(refs.open(),delimiter=';'))[1:]:
   if len(r)!=5:continue
   n,a,k,L,d=map(int,r)
   if a in actual:assert actual[a]==(k,L,d);matched+=1
 # The three polynomial additions without site CSVs use these verified OEIS formulas.
 formula={'a000384':lambda n:n*(2*n-1),'a001844':lambda n:2*n*(n+1)+1,'a002522':lambda n:n*n+1}.get(s['id'])
 if formula:
  for n,a,k,L,d in rows:assert a==formula(n) and d==formula(n+1)-a
 m=json.loads((root/'dist/data'/s['id']/'manifest.json').read_text())
 assert m['points']==200000 and len(m['chunks'])==8
 report['sequences'].append({'id':s['id'],'points':m['points'],'referenceRowsMatched':matched,'independentMinimalityChecks':len(sampled),'classification':m['classification']})
 print(s['id'], 'PASS',matched,'reference rows;',m['classification'],flush=True)
report['totalPoints']=24000000
report['newPoints']=4000000
(root/'EXPANSION-120-VALIDATION.json').write_text(json.dumps(report,indent=2)+'\n')
