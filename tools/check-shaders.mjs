// Actual GLSL compilation regression. Requires glslangValidator on PATH, or its
// absolute path as the first argument. Does not require a browser or a GPU.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {ShaderChunk} from '../dist/vendor/three.module.min.js';
const compiler=process.argv[2]||'glslangValidator';
const source=await fs.readFile(new URL('../dist/js/viewer.js',import.meta.url),'utf8');
const vertex=source.match(/vertexShader:`([^`]+)`/)[1];
const fragment=source.match(/fragmentShader:`([^`]+)`/)[1].replaceAll('\\n','\n').replace(' #include','\n#include');
const expand=s=>s.replace(/#include <([^>]+)>/g,(_,name)=>expand(ShaderChunk[name]));
const vertexPrefix='#version 300 es\nprecision highp float;\n#define attribute in\n#define varying out\nuniform mat4 projectionMatrix,modelViewMatrix;\nin vec3 position;\n';
const fragmentPrefix='#version 300 es\nprecision highp float;\n#define varying in\nout vec4 pc_fragColor;\n#define gl_FragColor pc_fragColor\n'+ShaderChunk.colorspace_pars_fragment+'\nvec4 linearToOutputTexel(vec4 value){return sRGBTransferOETF(value);}\n';
const dir=await fs.mkdtemp(path.join(os.tmpdir(),'wlj-shaders-'));
try{
 const v=path.join(dir,'points.vert'),f=path.join(dir,'points.frag'),broken=path.join(dir,'reserved-keyword.vert');
 await fs.writeFile(v,vertexPrefix+vertex);await fs.writeFile(f,fragmentPrefix+expand(fragment));
 const linked=spawnSync(compiler,['-l',v,f],{encoding:'utf8'});if(linked.error)throw linked.error;
 assert.equal(linked.status,0,linked.stdout+linked.stderr);
 console.log('PASS: corrected point vertex and fragment shaders compile and link as GLSL ES 3.00.');
 await fs.writeFile(broken,vertexPrefix+vertex.replaceAll('flattenZ','flat'));
 const failed=spawnSync(compiler,['-S','vert',broken],{encoding:'utf8'});
 assert.notEqual(failed.status,0);assert.match(failed.stdout+failed.stderr,/flat/i);
 console.log('PASS: original reserved-keyword defect is reproduced and rejected by the compiler.');
 console.log((failed.stdout+failed.stderr).trim());
}finally{await fs.rm(dir,{recursive:true,force:true});}
