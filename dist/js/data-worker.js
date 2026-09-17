import {parseChunk} from './csv.js';
let next;
self.onmessage=async ({data})=>{
 if(data.type==='next'){next?.();next=null;return;}
 if(data.type!=='start')return;
 try{
  const {manifest,url,limit}=data;let loaded=0,lastN=0,lastA=0;
  for(let i=0;i<manifest.chunks.length&&loaded<limit;i++){
   const chunk=manifest.chunks[i];
   if(!/^chunk-\d+-[a-f0-9]{12}\.csv(?:\.gz)?$/.test(chunk.file))throw Error('Invalid chunk path');
   if(chunk.file.endsWith('.gz')!==(chunk.encoding==='gzip'))throw Error('Invalid chunk encoding');
   const response=await fetch(new URL(chunk.file,url));
   if(!response.ok)throw Error(`Chunk ${i+1}: HTTP ${response.status}`);
   let bytes=await response.arrayBuffer();
   if(chunk.encoding==='gzip'){
    const signature=new Uint8Array(bytes,0,Math.min(bytes.byteLength,2));
    // Some hosts apply Content-Encoding themselves; already-decoded CSV is
    // still checked against its original size and checksum below.
    if(signature[0]===31&&signature[1]===139){
     if(bytes.byteLength!==chunk.compressedBytes)throw Error(`Chunk ${i+1}: incomplete download`);
     if(typeof DecompressionStream!=='function')throw Error('Please update your browser to load compressed sequence data');
     bytes=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
    }
   }
   if(bytes.byteLength!==chunk.bytes)throw Error(`Chunk ${i+1}: incomplete download`);
   if(self.crypto?.subtle){
    const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');
    if(hash!==chunk.sha256)throw Error(`Chunk ${i+1}: checksum mismatch`);
   }
   const parsed=parseChunk(new TextDecoder().decode(bytes),chunk.points);
   if(parsed.raw[0]<=lastN||parsed.raw[1]<=lastA)throw Error('Chunks overlap or are out of order');
   const take=Math.min(parsed.count,limit-loaded);
   lastN=parsed.raw[(take-1)*5];lastA=parsed.raw[(take-1)*5+1];
   if(take!==parsed.count){parsed.positions=parsed.positions.slice(0,take*3);parsed.classes=parsed.classes.slice(0,take);parsed.raw=parsed.raw.slice(0,take*5);parsed.count=take;}
   loaded+=take;
   // Backpressure: no next fetch until the main thread has accepted this chunk.
   const accepted=new Promise(resolve=>{next=resolve;});
   self.postMessage({type:'chunk',...parsed,loaded,chunk:i+1},[parsed.positions.buffer,parsed.classes.buffer,parsed.raw.buffer]);
   await accepted;
  }
  if(loaded<limit)throw Error('Manifest does not contain enough points');
  self.postMessage({type:'complete',loaded});
 }catch(error){self.postMessage({type:'error',message:error.message});}
};
