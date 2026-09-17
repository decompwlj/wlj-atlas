"""Compare all source rows; independently check sampled minimal weights by divisor pairs."""
import csv, hashlib, json, math, sys
from pathlib import Path
root=Path(__file__).resolve().parent.parent
references=Path(sys.argv[1]); report=[]
fixture=root/'tools/fixtures/expansion-100';fixture.mkdir(exist_ok=True)
for seq in json.loads((root/'tools/expansion-100.json').read_text()):
    sid=seq['id']; source=references/(sid+'.csv'); raw=root/'raw'/(sid+'.csv')
    ref=list(csv.reader(source.read_text().splitlines(),delimiter=';'))
    original=[list(map(int,r)) for r in ref[1:] if r and r[0].isdigit()]
    with raw.open() as f: rows=[list(map(int,r)) for r in list(csv.reader(f))[1:]]
    for i,expected in enumerate(original):
        assert rows[i]==expected,(sid,i+1,rows[i],expected)
    assert sum(r[2]>0 for r in rows)==200000
    checks=[]
    for i in sorted(set([0,len(rows)-1]+[j*(len(rows)-1)//100 for j in range(101)])):
        n,a,k,L,d=rows[i]
        if a<=2*d: assert k==L==0; continue
        v=a-d; best=v
        for f in range(1,math.isqrt(v)+1):
            if v%f==0:
                if f>d:best=min(best,f)
                if v//f>d:best=min(best,v//f)
        assert k==best and L==v//best,(sid,n,'minimal weight')
        checks.append(n)
    with (fixture/(sid+'.csv')).open('w') as f:
        f.write('n,a,k,L,d\n');f.writelines(','.join(map(str,r))+'\n' for r in original[:1000])
    report.append(dict(id=sid,source=seq['sourceCSV'],sourceSHA256=hashlib.sha256(source.read_bytes()).hexdigest(),referenceRowsCompared=len(original),points=200000,independentMinimalWeightChecks=len(checks)))
    print(sid,len(original),'reference rows matched;',len(checks),'independent divisor checks',flush=True)
(root/'EXPANSION-100-VALIDATION.json').write_text(json.dumps(dict(sequences=report,totalNewPoints=6000000,finalSequenceCount=100),indent=2)+'\n')
