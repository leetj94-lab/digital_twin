import * as THREE from 'three';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {writeFile} from 'node:fs/promises';
import {buildUtilityScene} from '../src/scene.js';
// Three.js exporter uses the browser FileReader abstraction for binary buffers.
globalThis.FileReader=class {readAsArrayBuffer(blob){blob.arrayBuffer().then(buffer=>{this.result=buffer;this.onloadend?.();});}readAsDataURL(blob){blob.arrayBuffer().then(buffer=>{this.result=`data:${blob.type};base64,${Buffer.from(buffer).toString('base64')}`;this.onloadend?.();});}};
const scene=new THREE.Scene();const {world}=buildUtilityScene(scene,false);world.name='Synthetic utility facility';world.updateMatrixWorld(true);
const out=await new GLTFExporter().parseAsync(world,{binary:true,onlyVisible:true});
await writeFile(new URL('../public/models/utility-hall.glb',import.meta.url),Buffer.from(out));
console.log('Exported original utility hall to public/models/utility-hall.glb');
