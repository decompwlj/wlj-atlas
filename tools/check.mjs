import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {Worker} from 'node:worker_threads';
import {parseChunk} from '../dist/js/csv.js';
const root=path.resolve(import.meta.dirname,'..'),dist=path.join(root,'dist');
const registry=JSON.parse(await fs.readFile(path.join(root,'tools/sequences.json'),'utf8'));
const html=await fs.readFile(path.join(dist,'explore.html'),'utf8');
for(const name of await fs.readdir(path.join(dist,'js'))){if(!name.endsWith('.js'))continue;const file=path.join(dist,'js',name);const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);}
const app=await fs.readFile(path.join(dist,'js/app.js'),'utf8');for(const match of app.matchAll(/\$\('([^']+)'\)/g))assert(html.includes(`id="${match[1]}"`),`Missing DOM id ${match[1]}`);
for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){if(/^(https?:|\.\/$)/.test(match[1]))continue;await fs.access(path.join(dist,match[1]));}
const report={date:new Date().toISOString(),sequences:[],workerTests:[]};
let total=0;
for(const seq of registry){
 const directory=path.join(dist,'data',seq.id),m=JSON.parse(await fs.readFile(path.join(directory,'manifest.json'),'utf8'));let count=0,weight=0,level=0;
 let lastN=0,lastA=0;
 for(const chunk of m.chunks){let bytes=await fs.readFile(path.join(directory,chunk.file));if(chunk.encoding==='gzip'){assert.equal(bytes.length,chunk.compressedBytes);bytes=gunzipSync(bytes);}assert.equal(bytes.length,chunk.bytes);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),chunk.sha256);const parsed=parseChunk(bytes.toString(),chunk.points);assert(parsed.raw[0]>lastN&&parsed.raw[1]>lastA);lastN=parsed.raw[(parsed.count-1)*5];lastA=parsed.raw[(parsed.count-1)*5+1];count+=parsed.count;weight+=parsed.weight;level+=parsed.level;assert(parsed.positions.every(Number.isFinite));}
 assert.equal(count,m.points);assert.equal(weight,m.classification.weight);assert.equal(level,m.classification.level);total+=count;report.sequences.push({id:seq.id,points:count,chunks:m.chunks.length,excluded:m.excluded.length});
 console.log('PASS',seq.id,count,'points; identity, ordering, classes, finite logs, bytes and SHA-256');
}
assert.throws(()=>parseChunk('n,a,k,L,d\n1,11,3,2,2\n',1),/identity/);
assert.throws(()=>parseChunk('n,a,k,L,d\n1,9007199254740993,3,3,2\n',1),/safe integers/);
assert.throws(()=>parseChunk('n,a,k,L,d\n1,11,3,3,2\n',2),/count/);
const manifest=JSON.parse(await fs.readFile(path.join(dist,'data/primes/manifest.json'),'utf8'));
async function runWorkerTest(label,options,handle,start){
 return new Promise((resolve,reject)=>{const worker=new Worker(new URL('./tests/worker-harness.mjs',import.meta.url),{workerData:options});const timer=setTimeout(()=>finish(Error('Worker timed out')),20000);let finished=false;
 function finish(error){if(finished)return;finished=true;clearTimeout(timer);worker.terminate();if(error)reject(error);else{report.workerTests.push(label);console.log('PASS',label);resolve();}}
 worker.on('error',finish);worker.on('message',data=>{try{if(data.type==='ready')worker.postMessage(start);else handle(data,worker,finish);}catch(error){finish(error);}});
 });
}
const start={type:'start',manifest,url:'https://example.test/prefix/atlas/data/primes/manifest.json',limit:200000};
let chunks=0,fetches=0;
await runWorkerTest('worker: all 200k points, transfer buffers, subdirectory paths and backpressure',{module:'data-worker.js'},(data,w,done)=>{if(data.type==='fetch')fetches++;if(data.type==='error')throw Error(data.message);if(data.type==='chunk'){chunks++;assert.equal(data.raw.length,125000);assert.equal(data.loaded,chunks*25000);if(chunks===1)setTimeout(()=>{try{assert.equal(fetches,1);w.postMessage({type:'next'});}catch(e){done(e);}},30);else w.postMessage({type:'next'});}if(data.type==='complete'){assert.equal(data.loaded,200000);assert.equal(chunks,8);done();}},start);
let failedChunks=0;
await runWorkerTest('worker: compressed manifest accepts CSV already decoded by HTTP',{module:'data-worker.js',decoded:true},(data,w,done)=>{if(data.type==='error')throw Error(data.message);if(data.type==='chunk'){assert.equal(data.count,25000);w.postMessage({type:'next'});}if(data.type==='complete'){assert.equal(data.loaded,25000);done();}},{...start,limit:25000});
await runWorkerTest('worker: missing chunk produces an explicit partial-load error',{module:'data-worker.js',failure:true},(data,w,done)=>{if(data.type==='chunk'){failedChunks++;w.postMessage({type:'next'});}if(data.type==='error'){assert.equal(failedChunks,1);assert.match(data.message,/404/);done();}},start);
let limitedFetch=0;
await runWorkerTest('worker: 25k budget fetches only one chunk',{module:'data-worker.js'},(data,w,done)=>{if(data.type==='fetch')limitedFetch++;if(data.type==='error')throw Error(data.message);if(data.type==='chunk')w.postMessage({type:'next'});if(data.type==='complete'){assert.equal(limitedFetch,1);assert.equal(data.loaded,25000);done();}},{...start,limit:25000});
await runWorkerTest('worker: active load can be terminated after its first chunk',{module:'data-worker.js'},(data,w,done)=>{if(data.type==='error')throw Error(data.message);if(data.type==='chunk'){assert.equal(data.loaded,25000);done();}},start);
await runWorkerTest('catalogue: 20,000 synthetic entries return only 20 visible results',{module:'catalog-worker.js',synthetic:true},(data,w,done)=>{if(data.request===1){assert.equal(data.total,20000);assert.equal(data.rows.length,20);w.postMessage({request:2,query:'A019999',page:0});}if(data.request===2){assert.equal(data.total,1);assert.equal(data.rows[0][0],'seq-19999');done();}},{request:1,query:'',page:0});
report.totalPoints=total;report.browserTested=false;report.notes='Node checks exercise real CSV parser and worker modules. WebGL rendering and browser interactions have not been tested in a browser.';
await fs.writeFile(path.join(root,'VALIDATION.json'),JSON.stringify(report,null,2));console.log('PASS',total,'points total');
