// Bounded camera and integration checks; does not generate or traverse sequence data.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import * as THREE from '../../dist/vendor/three.module.min.js';
import {Viewer} from '../../dist/js/viewer.js';
function cameraFixture(max=12){
 const v=Object.create(Viewer.prototype);Object.assign(v,{max,mode:'3d',host:{clientWidth:600,clientHeight:600},perspective:new THREE.PerspectiveCamera(43,1,.01,2000),orthographic:new THREE.OrthographicCamera(-7,7,7,-7,.01,2000),material:{uniforms:{flattenZ:{value:0}}},zAxis:new THREE.Group(),reducedMotion:{matches:false},invalidate(){},bindControls(){this.controls={target:new THREE.Vector3(),update:()=>{this.camera.lookAt(this.controls.target);this.camera.updateMatrixWorld(true);}};}});v.camera=v.perspective;v.bindControls();v.fit();return v;
}
function projected(v,point){v.camera.updateMatrixWorld(true);return point.clone().project(v.camera);}
const v=cameraFixture(),point=new THREE.Vector3(3,7,2),before=projected(v,point);
v.setMode('2d');const start=v.transition.start;
v.stepTransition(start);assert(projected(v,point).distanceTo(before)<1e-9,'Transition must not jump on its first frame');
v.stepTransition(start+475);assert(Math.abs(v.material.uniforms.flattenZ.value-.5)<1e-9);assert(v.camera.projectionMatrix.elements.every(Number.isFinite));assert(Math.abs(v.camera.projectionMatrix.determinant())>1e-10);
const midway=projected(v,new THREE.Vector3(3,7,1));v.setMode('3d');const reverse=v.transition.start;v.stepTransition(reverse);assert(projected(v,new THREE.Vector3(3,7,1)).distanceTo(midway)<1e-9,'Rapid reversal must preserve the current view');v.stepTransition(reverse+950);assert.equal(v.camera,v.perspective);assert.equal(v.material.uniforms.flattenZ.value,0);assert.equal(v.controls.enabled,undefined);
v.setMode('2d');v.stepTransition(v.transition.start+950);assert.equal(v.camera,v.orthographic);assert.equal(v.material.uniforms.flattenZ.value,1);assert.equal(v.zAxis.visible,false);
const origin=projected(v,new THREE.Vector3(0,0,0)),x=projected(v,new THREE.Vector3(1,0,0)),y=projected(v,new THREE.Vector3(0,1,0));assert(Math.abs(x.distanceTo(origin)-y.distanceTo(origin))<1e-10,'2D weight and level units must have equal scale');
const peer=cameraFixture(24);peer.setMode('2d');peer.stepTransition(peer.transition.start+950);v.camera.zoom=1.5;v.camera.updateProjectionMatrix();peer.copyCamera(v);assert.equal(peer.camera.zoom,1.5);assert(peer.controls.target.distanceTo(v.controls.target.clone().multiplyScalar(2))<1e-10);assert(peer.camera.position.distanceTo(v.camera.position.clone().multiplyScalar(2))<1e-10);
v.reducedMotion.matches=true;v.setMode('3d');v.stepTransition(v.transition.start);assert.equal(v.transition,null,'Reduced motion finishes immediately');
const root=path.resolve(import.meta.dirname,'../..'),html=fs.readFileSync(path.join(root,'dist/explore.html'),'utf8');const ids=Array.from(html.matchAll(/\bid="([^"]+)"/g),m=>m[1]);assert.equal(ids.length,new Set(ids).size,'DOM ids must be unique');
for(const name of fs.readdirSync(path.join(root,'dist/js'))){if(!name.endsWith('.js'))continue;const file=path.join(root,'dist/js',name),result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);if(['app.js','experience.js'].includes(name)){const code=fs.readFileSync(file,'utf8');for(const m of code.matchAll(/\$\('([^']+)'\)/g))assert(ids.includes(m[1]),`Missing control ${m[1]}`);}}
for(const m of html.matchAll(/(?:href|src)="([^"#]+)"/g)){if(/^(https?:|\.\/$)/.test(m[1]))continue;assert(fs.existsSync(path.join(root,'dist',m[1])),`Missing asset ${m[1]}`);}
const catalog=JSON.parse(fs.readFileSync(path.join(root,'dist/data/catalog/search.json')));assert.equal(catalog.length,100);
console.log('PASS: smooth projection endpoints, reversible transition, equal 2D units, normalized linked cameras, reduced motion, 100-entry catalogue, syntax and control wiring.');
