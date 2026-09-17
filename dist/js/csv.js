// Strict, deliberately narrow CSV contract: n,a,k,L,d; decimal safe integers.
// Decomposition generation belongs to PARI/GP. This validates the transferred data.
export function parseChunk(text, expectedPoints) {
 const lines=text.trim().split(/\r?\n/);
 if(lines.shift()!=='n,a,k,L,d') throw Error('CSV header must be n,a,k,L,d');
 if(lines.length!==expectedPoints)throw Error('CSV point count differs from manifest');
 const count=lines.length, positions=new Float32Array(count*3), classes=new Float32Array(count), raw=new Float64Array(count*5);
 let weight=0,level=0;
 for(let i=0;i<count;i++){
  const row=lines[i].split(',');
  if(row.length!==5||row.some(x=>!/^\d+$/.test(x)))throw Error(`Invalid CSV row ${i+2}`);
  const values=row.map(Number);
  if(values.some(x=>!Number.isSafeInteger(x)||x<1))throw Error('CSV values must be positive safe integers');
  const [n,a,k,L,d]=values;
  if(k<=d||BigInt(k)*BigInt(L)+BigInt(d)!==BigInt(a)||BigInt(a)<=2n*BigInt(d))throw Error(`Invalid WLJ identity at n=${n}`);
  if(i && (n<=raw[(i-1)*5]||a<=raw[(i-1)*5+1]))throw Error('CSV terms must increase');
  raw.set(values,i*5);positions.set([Math.log(k),Math.log(L),Math.log(d)],i*3);
  classes[i]=k>L?1:0;if(k>L)level++;else weight++;
 }
 return {count,positions,classes,raw,weight,level};
}
