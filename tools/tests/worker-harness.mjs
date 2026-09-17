// Test adapter for the browser Web Worker API; no browser/WebGL emulation.
import {parentPort,workerData} from 'node:worker_threads';
import fs from 'node:fs/promises';
import path from 'node:path';
import {webcrypto} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
globalThis.self=globalThis;
if(!globalThis.crypto)globalThis.crypto=webcrypto;
self.postMessage=(data,transfer)=>parentPort.postMessage(data,transfer);
const root=path.resolve(import.meta.dirname,'../../dist');
let fetches=0;
globalThis.fetch=async input=>{
 const url=new URL(input);fetches++;parentPort.postMessage({type:'fetch',url:url.href,fetches});
 if(workerData.synthetic && url.pathname.endsWith('search.json'))return new Response(JSON.stringify(Array.from({length:20000},(_,i)=>['seq-'+i,'Sequence '+i,'A'+String(i).padStart(6,'0'),Math.floor(i/128)])));
 if(workerData.failure && url.pathname.includes('chunk-0001'))return new Response('Missing',{status:404});
 let filename=url.protocol==='file:'?url.pathname:path.join(root,url.pathname.replace(/^\/prefix\/atlas\//,''));
 try{let bytes=await fs.readFile(filename);if(workerData.decoded&&filename.endsWith('.gz'))bytes=gunzipSync(bytes);return new Response(bytes);}catch{return new Response('Missing',{status:404});}
};
await import(new URL('../../dist/js/'+workerData.module,import.meta.url));
parentPort.on('message',data=>self.onmessage({data}));
parentPort.postMessage({type:'ready'});
