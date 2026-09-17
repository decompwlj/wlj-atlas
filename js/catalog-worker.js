let rows;
const indexURL=new URL('../data/catalog/search.json',import.meta.url);
const ready=fetch(indexURL).then(r=>{if(!r.ok)throw Error('Catalogue unavailable');return r.json();}).then(data=>{rows=data;});
self.onmessage=async({data})=>{
 try{
  await ready;
  if(data.resolve){self.postMessage({type:"resolve",id:data.resolve,row:rows.find(r=>r[0]===data.resolve)});return;}
  const query=data.query.trim().toLowerCase();
  let resetQuery=false;
  let found=query?rows.filter(row=>`${row[0]} ${row[1]} ${row[2]}`.toLowerCase().includes(query)):rows;
  // Locate the selected sequence within the current results; clear a filter
  // only when it would hide a sequence opened through a link or history.
  if(data.focus&&!found.some(row=>row[0]===data.focus)&&rows.some(row=>row[0]===data.focus)){found=rows;resetQuery=true;}
  const size=20,position=data.focus?found.findIndex(row=>row[0]===data.focus):-1;
  const requestedPage=position>=0?Math.floor(position/size):data.page;
  const page=Math.max(0,Math.min(requestedPage,Math.ceil(found.length/size)-1));
  self.postMessage({request:data.request,focus:data.focus,resetQuery,rows:found.slice(page*size,(page+1)*size),total:found.length,catalogTotal:rows.length,page,pages:Math.ceil(found.length/size)});
 }catch(error){self.postMessage({request:data.request,error:error.message});}
};
