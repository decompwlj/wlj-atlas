// Optional pre-deployment step: make social metadata absolute for the chosen URL.
import fs from 'node:fs/promises';
import path from 'node:path';
const input=process.argv[2];if(!input)throw Error('Usage: node tools/configure.mjs https://your-domain.example/atlas/');
const url=new URL(input);if(!['http:','https:'].includes(url.protocol)||url.search||url.hash)throw Error('Supply an HTTP(S) folder URL without a query or hash');
if(!url.pathname.endsWith('/'))url.pathname+='/';
const safe=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const file=path.resolve(import.meta.dirname,'../dist/index.html');let html=await fs.readFile(file,'utf8');const img=safe(new URL('assets/social-card.png',url).href);
html=html.replace(/(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*(">)/g,`$1${img}$2`);
html=html.replace(/\n?<!-- deployment metadata -->[\s\S]*?<!-- end deployment metadata -->/,'');
html=html.replace('</head>',`<!-- deployment metadata -->\n<link rel="canonical" href="${safe(url.href)}">\n<meta property="og:url" content="${safe(url.href)}">\n<!-- end deployment metadata -->\n</head>`);
await fs.writeFile(file,html);console.log('Social metadata configured for',url.href);
