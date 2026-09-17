// Losslessly convert existing chunks for static hosts with total-size limits.
// Original CSV hashes and byte counts remain the integrity contract.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {gzipSync,gunzipSync} from 'node:zlib';
const root=path.resolve(import.meta.dirname,'..');
const registry=JSON.parse(await fs.readFile(path.join(root,'tools/sequences.json'),'utf8'));
let before=0,after=0,count=0;
for(const seq of registry){
 const dir=path.join(root,'dist/data',seq.id),manifestPath=path.join(dir,'manifest.json');
 const manifest=JSON.parse(await fs.readFile(manifestPath,'utf8'));
 const oldFiles=[];
 for(const chunk of manifest.chunks){
  if(chunk.encoding==='gzip'){before+=chunk.bytes;after+=chunk.compressedBytes;continue;}
  if(!/^chunk-\d+-[a-f0-9]{12}\.csv$/.test(chunk.file))throw Error('Invalid source filename');
  const source=path.join(dir,chunk.file),raw=await fs.readFile(source);
  if(raw.length!==chunk.bytes||crypto.createHash('sha256').update(raw).digest('hex')!==chunk.sha256)throw Error(`Corrupt source: ${source}`);
  const compressed=gzipSync(raw,{level:9});
  if(!gunzipSync(compressed).equals(raw))throw Error('Compression round-trip mismatch');
  chunk.file+='.gz';chunk.encoding='gzip';chunk.compressedBytes=compressed.length;
  const destination=path.join(dir,chunk.file);
  await fs.writeFile(destination+'.tmp',compressed);await fs.rename(destination+'.tmp',destination);
  oldFiles.push(source);before+=raw.length;after+=compressed.length;count++;
 }
 await fs.writeFile(manifestPath+'.tmp',JSON.stringify(manifest));await fs.rename(manifestPath+'.tmp',manifestPath);
 for(const file of oldFiles)await fs.unlink(file);
}
console.log(JSON.stringify({convertedChunks:count,csvBytes:before,compressedBytes:after,savedPercent:Math.round(100*(1-after/before))}));
