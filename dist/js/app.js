import {Experience} from './experience.js';
const $=id=>document.getElementById(id), fmt=n=>n.toLocaleString('en-US');
let viewer,experience,catalogWorker,dataWorker,controller,currentId,currentManifest,manifestURL,operation=0,request=0,page=0,pageCount=0,loaded=0;
const selectedRows=new Map();
function message(text,overlay=false){$('status').textContent=text;$('graph-message').textContent=text;$('graph-message').hidden=!overlay;}
function fail(error){if(error.name==='AbortError')return;message(error.message||String(error),!loaded);$('retry').hidden=false;}
function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
function inspect(row,error){const box=$('point-detail');box.replaceChildren();if(error){message(error,true);return;}if(!row){box.textContent='No point selected. Click a visible point to inspect its exact decomposition.';return;}const [n,a,k,L,d]=row;const title=document.createElement('strong');title.textContent=`n = ${fmt(n)} · a = ${fmt(a)}`;const equation=document.createElement('div');equation.className='equation';equation.textContent=`${a} = ${k} × ${L} + ${d}`;const kind=document.createElement('div');kind.textContent=k>L?'Level-classified':k===L?'Weight-classified · tie':'Weight-classified';box.append(title,equation,kind);}
function queryCatalog(focus){catalogWorker.postMessage({request:++request,query:$('search').value,page,focus});}
function highlight(){document.querySelectorAll('.sequence-item').forEach(el=>{const active=el.dataset.id===currentId;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});}
function resolveId(id){if(!/^[a-z0-9-]+$/.test(id)){fail(Error('Invalid sequence identifier'));return;}catalogWorker.postMessage({resolve:id});}
function renderCatalog(data){if(data.request!==request)return;if(data.error){fail(Error(data.error));return;}page=data.page;pageCount=data.pages;if(data.resetQuery)$('search').value='';$('catalog-count').textContent=`${fmt(data.catalogTotal)} sequences`;$('sequence-list').replaceChildren();selectedRows.clear();
 for(const [id,name,oeis,catalogPage] of data.rows){selectedRows.set(id,[id,name,oeis,catalogPage]);const button=document.createElement('button');button.className='sequence-item';button.dataset.id=id;const num=document.createElement('span');num.className='index';num.textContent=String(page*20+1+data.rows.findIndex(r=>r[0]===id)).padStart(2,'0');const label=document.createElement('span'),b=document.createElement('b'),small=document.createElement('small');b.textContent=name;small.textContent=oeis;label.append(b,small);button.append(num,label);button.addEventListener('click',()=>{if(location.hash.slice(1)!==id)location.hash=id;else activate(selectedRows.get(id));});$('sequence-list').append(button);}
 if(!data.rows.length){const p=document.createElement('p');p.textContent='No matching sequences.';$('sequence-list').append(p);}
 $('page-info').textContent=data.total?`${fmt(data.total)} results · ${page+1}/${pageCount}`:'0 results';$('previous').disabled=page<=0;$('next').disabled=page+1>=pageCount;highlight();if(data.focus)document.querySelector('.sequence-item.active')?.scrollIntoView({block:'nearest'});
}
function stopLoad(){operation++;controller?.abort();dataWorker?.terminate();dataWorker=null;controller=new AbortController();$('retry').hidden=true;return operation;}
async function getJSON(url,signal){const r=await fetch(url,{signal});if(!r.ok)throw Error(`Unable to load data: HTTP ${r.status}`);return r.json();}
async function activate(row){if(!row){fail(Error('Sequence not found in catalogue'));return;}const op=stopLoad();currentId=row[0];currentManifest=null;loaded=0;$('loaded').textContent='0';$('progress').value=0;$('download').disabled=true;highlight();message('Loading sequence…',true);
 try{const pageURL=new URL(`../data/catalog/page-${row[3]}.json`,import.meta.url);const entries=await getJSON(pageURL,controller.signal);if(op!==operation)return;const meta=entries.find(r=>r.id===currentId);if(!meta)throw Error('Sequence missing from catalogue page');manifestURL=new URL(meta.manifest,pageURL);const m=await getJSON(manifestURL,controller.signal);if(op!==operation)return;
 if(m.schema!==1||m.id!==currentId||!Number.isSafeInteger(m.points)||m.points<1||!Array.isArray(m.chunks)||m.chunks.length>10000||!Array.isArray(m.maxima)||m.maxima.length!==3||m.maxima.some(v=>!Number.isSafeInteger(v)||v<1)||m.chunks.some(c=>!Number.isInteger(c.points)||c.points<1||c.points>25000)||m.chunks.reduce((s,c)=>s+c.points,0)!==m.points)throw Error('Unsupported or invalid manifest');
 currentManifest=m;document.title=`${m.name} — WLJ Atlas`;$('sequence-title').textContent=m.name;$('family').textContent=m.family;$('sequence-description').textContent=m.description;$('oeis').textContent=m.oeis+' ↗';$('oeis').href='https://oeis.org/'+m.oeis;$('total').textContent=fmt(m.points);$('excluded').textContent=fmt(m.excluded.length);$('excluded').title=m.excluded.map(row=>`n=${row[0]}: a=${row[1]}, d=${row[4]}`).join('\n');$('level-share').textContent=(100*m.classification.level/m.points).toFixed(2)+'%';inspect(null);startChunks(op);
 }catch(error){if(op===operation)fail(error);}
}
function startChunks(op){const m=currentManifest;loaded=0;viewer.clear(m.maxima);experience?.primaryChanged(m);viewer.setGuide($('diagonal').checked);const limit=Math.min(Number($('budget').value),m.points);$('progress').max=limit;$('progress').value=0;message('Loading first 25,000 points…',true);
 dataWorker=new Worker(new URL('./data-worker.js',import.meta.url),{type:'module'});const worker=dataWorker;
 worker.onmessage=({data})=>{if(op!==operation)return;
  if(data.type==='chunk'){viewer.add(data);loaded=data.loaded;$('loaded').textContent=fmt(loaded);$('progress').value=loaded;$('download').disabled=false;message(`${fmt(loaded)} / ${fmt(limit)} points · chunk ${data.chunk}`);worker.postMessage({type:'next'});}
  else if(data.type==='complete'){message(`${fmt(loaded)} points ready · ${m.excluded.length} unclassified terms omitted`);worker.terminate();if(dataWorker===worker)dataWorker=null;}
  else if(data.type==='error'){worker.terminate();if(dataWorker===worker)dataWorker=null;fail(Error(`${data.message}. ${fmt(loaded)} points loaded; dataset incomplete.`));}
 };
 worker.onerror=e=>{if(op===operation){worker.terminate();fail(Error(e.message||'Data worker failed'));}};
 worker.postMessage({type:'start',manifest:m,url:manifestURL.href,limit});
}
async function boot(){
 if(location.protocol==='file:')throw Error('Serve this folder over HTTP or HTTPS. See README.md for the one-command local preview.');
 const {Viewer}=await import('./viewer.js');viewer=new Viewer($('viewport'),inspect);
 catalogWorker=new Worker(new URL('./catalog-worker.js',import.meta.url),{type:'module'});
 catalogWorker.onmessage=({data})=>{if(data.type==='resolve'){if(data.id===(location.hash.slice(1)||'primes')){queryCatalog(data.row?.[0]);activate(data.row);}}else renderCatalog(data);};catalogWorker.onerror=()=>fail(Error('Catalogue worker failed. Check server paths and JavaScript MIME types.'));
 resolveId(location.hash.slice(1)||'primes');
 let debounce;$('search').addEventListener('input',()=>{clearTimeout(debounce);debounce=setTimeout(()=>{page=0;queryCatalog();},120);});$('previous').onclick=()=>{page--;queryCatalog();};$('next').onclick=()=>{page++;queryCatalog();};
 window.addEventListener('hashchange',()=>resolveId(location.hash.slice(1)||'primes'));
 $('budget').onchange=()=>{if(!currentManifest)return;const op=stopLoad();loaded=0;$('loaded').textContent='0';$('download').disabled=true;inspect(null);startChunks(op);if(experience?.other)experience.loadComparison();};
 for(const id of ['weight','level'])$(id).onchange=()=>{viewer.setVisibility($('weight').checked,$('level').checked);experience.displayChanged();inspect(null);};
 $('size').oninput=()=>{$('size-value').textContent=Number($('size').value).toFixed(2);viewer.setSize(Number($('size').value));experience.displayChanged();};$('diagonal').onchange=()=>{viewer.setGuide($('diagonal').checked);experience.displayChanged();};
 const mode=m=>{viewer.setMode(m);experience?.modeChanged(m);$('view-3d').setAttribute('aria-pressed',String(m==='3d'));$('view-2d').setAttribute('aria-pressed',String(m==='2d'));$('rotate').setAttribute('aria-pressed','false');viewer.setRotate(false);$('rotate').disabled=m==='2d';$('axis-caption').textContent=m==='3d'?'x: ln k · y: ln L · z: ln d':'x: ln k · y: ln L';$('gestures').textContent=m==='3d'?'Drag to orbit · scroll to zoom · right-drag to pan':'Right-drag to pan · scroll to zoom';$('viewport').setAttribute('aria-label',`${m==='3d'?'Three-dimensional':'Equal-scale weight–level'} scatter plot. Arrow keys move the camera, plus and minus zoom, R resets.`);};
 experience=new Experience(viewer,{mode});
 $('view-3d').onclick=()=>mode('3d');$('view-2d').onclick=()=>mode('2d');$('reset').onclick=()=>viewer.fit();$('rotate').onclick=()=>{const enabled=$('rotate').getAttribute('aria-pressed')!=='true';$('rotate').setAttribute('aria-pressed',String(enabled));viewer.setRotate(enabled);};
 document.addEventListener('visibilitychange',()=>{if(!experience.cinema)viewer.setRotate(!document.hidden&&$('rotate').getAttribute('aria-pressed')==='true');});
 $('retry').onclick=()=>resolveId(currentId||location.hash.slice(1)||'primes');
 $('snapshot').onclick=()=>{const a=document.createElement('a');a.href=viewer.png();a.download=`wlj-${currentId||'graph'}-${viewer.mode}.png`;a.click();};
 $('download').onclick=async()=>{const chunks=viewer.chunks.slice(),name=currentId;const parts=['n,a,k,L,d\n'];for(const c of chunks){let s='';for(let i=0;i<c.count;i++)s+=Array.from(c.raw.subarray(i*5,i*5+5)).join(',')+'\n';parts.push(s);await new Promise(r=>setTimeout(r,0));}downloadBlob(new Blob(parts,{type:'text/csv;charset=utf-8'}),`${name}-loaded.csv`);};
}
boot().catch(error=>{message(error.message,true);$('retry').hidden=true;});
