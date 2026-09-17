import {Viewer} from './viewer.js';
const $=id=>document.getElementById(id),fmt=n=>n.toLocaleString('en-US');
export class Experience{
 constructor(viewer,hooks){
  this.viewer=viewer;this.hooks=hooks;this.operation=0;this.rows=[];this.cinema=false;this.playing=false;
  viewer.onCameraChange=()=>{if(this.other&&$('compare-sync').checked&&!this.cinema)this.other.copyCamera(viewer);};
  $('compare-toggle').onclick=()=>this.toggleCompare();
  $('compare-sequence').onchange=()=>this.loadComparison();
  $('compare-retry').onclick=()=>{if(this.other)this.loadComparison();else{this.closeComparison();this.toggleCompare();}};
  $('compare-sync').onchange=()=>{if($('compare-sync').checked)this.other?.copyCamera(viewer);};
  $('compare-scale').onchange=()=>this.updateScales();
  $('cinema-open').onclick=()=>this.openCinema();$('cinema-exit').onclick=()=>this.closeCinema();
  $('cinema-play').onclick=()=>this.setPlaying(!this.playing);
  $('cinema-dimension').onclick=()=>hooks.mode(viewer.mode==='3d'?'2d':'3d');
  const pane=$('primary-pane');pane.addEventListener('pointermove',()=>this.wake());pane.addEventListener('focusin',()=>this.wake());
  pane.addEventListener('keydown',e=>{if(!this.cinema)return;this.wake();if(e.key==='Escape'){e.preventDefault();this.closeCinema();}if(e.code==='Space'&&e.target===$('viewport')){e.preventDefault();this.setPlaying(!this.playing);}if(e.key==='Tab'){const nodes=Array.from(pane.querySelectorAll('button:not(:disabled),[tabindex="0"]'));const index=nodes.indexOf(document.activeElement);if(e.shiftKey&&index<=0){e.preventDefault();nodes.at(-1).focus();}else if(!e.shiftKey&&index===nodes.length-1){e.preventDefault();nodes[0].focus();}}});
  document.addEventListener('fullscreenchange',()=>{if(this.cinema&&!document.fullscreenElement&&this.nativeFullscreen)this.closeCinema();});
  document.addEventListener('visibilitychange',()=>{if(this.cinema)viewer.setRotate(this.playing&&!document.hidden);});
 }
 primaryChanged(manifest){this.primary=manifest;$('primary-label').textContent=`${manifest.name} · ${manifest.oeis}`;$('cinema-name').textContent=manifest.name;$('cinema-oeis').textContent=manifest.oeis;this.updateScales();}
 displayChanged(){if(!this.other)return;this.other.setVisibility($('weight').checked,$('level').checked);this.other.setGuide($('diagonal').checked);this.other.setSize(Number($('size').value));}
 modeChanged(mode){this.other?.setMode(mode);$('cinema-dimension').textContent=mode==='3d'?'Switch to 2D':'Switch to 3D';$('cinema-play').disabled=mode==='2d';this.setPlaying(false);}
 async toggleCompare(){
  if($('compare-toggle').getAttribute('aria-pressed')==='true'){this.closeComparison();return;}
  $('comparison-pane').hidden=false;$('primary-label').hidden=false;$('graph-layout').classList.add('comparing');$('compare-toggle').setAttribute('aria-pressed','true');
  try{this.other=new Viewer($('compare-viewport'),(row,error)=>{$('compare-detail').textContent=error||(!row?'No point selected.':`n = ${fmt(row[0])} · ${row[1]} = ${row[2]} × ${row[3]} + ${row[4]}`);});this.other.onCameraChange=()=>{if($('compare-sync').checked&&!this.cinema)this.viewer.copyCamera(this.other);};this.other.setMode(this.viewer.mode);this.displayChanged();await this.loadComparison();}
  catch(error){$('compare-status').textContent=error.message;$('compare-retry').hidden=false;}
 }
 closeComparison(){this.operation++;this.abort?.abort();this.worker?.terminate();this.worker=null;this.other?.dispose();this.other=null;this.secondary=null;$('comparison-pane').hidden=true;$('primary-label').hidden=true;$('graph-layout').classList.remove('comparing');$('compare-toggle').setAttribute('aria-pressed','false');this.updateScales();}
 async loadComparison(){
  if(!this.other)return;const op=++this.operation;this.abort?.abort();this.abort=new AbortController();const signal=this.abort.signal;this.worker?.terminate();this.worker=null;this.secondary=null;$('compare-retry').hidden=true;$('compare-status').textContent='Loading sequence…';$('compare-detail').textContent='Click a point to inspect its decomposition.';this.other.clear(this.primary?.maxima||[100,100,10]);
  try{
   const json=async url=>{const r=await fetch(url,{signal});if(!r.ok)throw Error(`Unable to load comparison (HTTP ${r.status})`);return r.json();};
   if(!this.rows.length){this.rows=await json(new URL('../data/catalog/search.json',import.meta.url));if(op!==this.operation)return;const select=$('compare-sequence');select.replaceChildren();for(const row of this.rows){const option=document.createElement('option');option.value=row[0];option.textContent=`${row[2]} · ${row[1]}`;select.append(option);}select.value=this.rows.find(r=>r[0]!==this.primary?.id)?.[0]||this.rows[0][0];}
   const row=this.rows.find(r=>r[0]===$('compare-sequence').value);if(!row)throw Error('Select a sequence to compare');
   const pageURL=new URL(`../data/catalog/page-${row[3]}.json`,import.meta.url),entries=await json(pageURL),meta=entries.find(entry=>entry.id===row[0]);if(!meta)throw Error('Sequence missing from catalogue');
   const url=new URL(meta.manifest,pageURL),m=await json(url);if(op!==this.operation)return;
   if(m.schema!==1||m.id!==row[0]||!Array.isArray(m.maxima)||m.maxima.length!==3||m.maxima.some(n=>!Number.isSafeInteger(n)||n<1)||!Array.isArray(m.chunks)||!Number.isSafeInteger(m.points)||m.points<1)throw Error('Invalid comparison manifest');
   this.secondary=m;this.other.clear(m.maxima);this.displayChanged();this.updateScales();this.other.copyCamera(this.viewer);
   const limit=Math.min(Number($('budget').value),m.points),worker=new Worker(new URL('./data-worker.js',import.meta.url),{type:'module'});this.worker=worker;
   const fail=message=>{worker.terminate();if(this.worker===worker)this.worker=null;$('compare-status').textContent=message+' · incomplete';$('compare-retry').hidden=false;};
   worker.onmessage=({data})=>{if(op!==this.operation)return;if(data.type==='chunk'){this.other.add(data);$('compare-status').textContent=`${m.oeis} · ${fmt(data.loaded)} / ${fmt(limit)} points`;worker.postMessage({type:'next'});}else if(data.type==='complete'){$('compare-status').textContent=`${m.oeis} · ${fmt(data.loaded)} points · ${m.excluded.length} unclassified omitted`;worker.terminate();if(this.worker===worker)this.worker=null;}else if(data.type==='error')fail(data.message);};
   worker.onerror=e=>{if(op===this.operation)fail(e.message||'Comparison could not be loaded');};worker.postMessage({type:'start',manifest:m,url:url.href,limit});
  }catch(error){if(op!==this.operation||error.name==='AbortError')return;$('compare-status').textContent=error.message;$('compare-retry').hidden=false;}
 }
 updateScales(){if(!this.primary)return;const shared=this.other&&this.secondary&&$('compare-scale').checked;const maxima=shared?this.primary.maxima.map((n,i)=>Math.max(n,this.secondary.maxima[i])):this.primary.maxima;this.viewer.setMaxima(maxima);this.viewer.fit();if(this.other&&this.secondary){this.other.setMaxima(shared?maxima:this.secondary.maxima);this.other.fit();if($('compare-sync').checked)this.other.copyCamera(this.viewer);}}
 async openCinema(){
  if(this.cinema)return;this.cinema=true;this.nativeFullscreen=false;this.previousRotation=$('rotate').getAttribute('aria-pressed')==='true';const pane=$('primary-pane');pane.classList.add('cinema');document.body.classList.add('cinema-active');pane.querySelector('.cinema-label').hidden=false;pane.querySelector('.cinema-controls').hidden=false;
  this.inertElements=Array.from(document.querySelectorAll('.topbar,.catalog,.sequence-heading,.toolbar,.inspector,.statusbar,#comparison-pane'));for(const el of this.inertElements)el.inert=true;
  $('viewport').focus();this.viewer.resizeView();this.viewer.fit();this.setPlaying(this.viewer.mode==='3d'&&!matchMedia('(prefers-reduced-motion: reduce)').matches);this.wake();
  if(pane.requestFullscreen){try{await pane.requestFullscreen();if(this.cinema)this.nativeFullscreen=true;else if(document.fullscreenElement===pane)await document.exitFullscreen();}catch{/* The full-window view also works where fullscreen is unavailable. */}}
 }
 closeCinema(){if(!this.cinema)return;this.cinema=false;clearTimeout(this.fadeTimer);const pane=$('primary-pane');pane.classList.remove('cinema','cinema-idle');document.body.classList.remove('cinema-active');pane.querySelector('.cinema-label').hidden=true;pane.querySelector('.cinema-controls').hidden=true;for(const el of this.inertElements||[])el.inert=false;if(document.fullscreenElement===pane)document.exitFullscreen().catch(()=>{});this.setPlaying(false);$('rotate').setAttribute('aria-pressed',String(this.previousRotation&&this.viewer.mode==='3d'));this.viewer.setRotate(this.previousRotation&&!document.hidden);this.viewer.resizeView();this.other?.copyCamera(this.viewer);$('cinema-open').focus();}
 setPlaying(value){this.playing=Boolean(value&&this.cinema&&this.viewer.mode==='3d');$('cinema-play').textContent=this.playing?'Pause rotation':'Play rotation';$('cinema-play').setAttribute('aria-pressed',String(this.playing));if(this.cinema)this.viewer.setRotate(this.playing&&!document.hidden);this.wake();}
 wake(){if(!this.cinema)return;const pane=$('primary-pane');pane.classList.remove('cinema-idle');clearTimeout(this.fadeTimer);if(this.playing)this.fadeTimer=setTimeout(()=>pane.classList.add('cinema-idle'),3000);}
}
