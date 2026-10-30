import * as THREE from 'three';
import {assets} from './data.js';
export function buildUtilityScene(scene,software=false){
 const world=new THREE.Group();scene.add(world);const shell=new THREE.Group();shell.name="Building shell";world.add(shell);const upper=new THREE.Group();upper.name="Service deck";world.add(upper);const equipment=new Map();const pickables=[];
 const mat=(c)=>software?new THREE.MeshBasicMaterial({color:c}):new THREE.MeshStandardMaterial({color:c,roughness:.78,metalness:.13});const mats={floor:mat(0xd2dbe1),steel:mat(0x9caebc),pipe:mat(0x2586ba),teal:mat(0x3c9992),blue:mat(0x2863a0),dark:mat(0x354f63),yellow:mat(0xe8bb37),light:mat(0xe4ebef)};
 function box(w,h,d,x,y,z,m,parent=world){const materials=software?Array.from({length:6},(_,i)=>new THREE.MeshBasicMaterial({color:m.color.clone().multiplyScalar([.83,.91,1,.72,.93,.8][i]),transparent:m.transparent,opacity:m.opacity})):m;const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),materials);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function cyl(r,h,x,y,z,m,parent=world,rot=0){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,software?8:20),m);o.position.set(x,y,z);o.rotation.z=rot;o.castShadow=true;parent.add(o);return o;}
 function pipe(points,r=.14,m=mats.pipe,parent=world){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'catmullrom',.1);const o=new THREE.Mesh(new THREE.TubeGeometry(curve,software?8:48,r,software?5:8,false),m);o.castShadow=true;parent.add(o);return o;}
 function rail(x1,z1,x2,z2,y,parent=world){const len=Math.hypot(x2-x1,z2-z1);for(let i=0;i<=Math.ceil(len/2);i++){const t=i/Math.ceil(len/2);cyl(.035,1,x1+(x2-x1)*t,y+.5,z1+(z2-z1)*t,mats.yellow,parent);}pipe([[x1,y+1,z1],[x2,y+1,z2]],.045,mats.yellow,parent);pipe([[x1,y+.5,z1],[x2,y+.5,z2]],.025,mats.yellow,parent);}
 box(33,.6,24,0,-.4,0,mats.floor);box(180,.1,180,0,-.78,0,mat(0xd8e3e9));const grid=new THREE.GridHelper(120,60,0xc1d1de,0xd2dfe8);grid.position.y=-.7;scene.add(grid);
 // The utility hall is a fictional application-owned scene, not an employer model.
 for(const x of [-15,-5,5,15])for(const z of [-10,10]){box(.32,12,.35,x,5.8,z,mats.steel);box(.7,.15,.75,x,.08,z,mats.dark);}
 for(const y of [5.8,11.7]){box(30,.3,.22,0,y,-10,mats.steel);box(30,.3,.22,0,y,10,mats.steel);for(const x of [-15,-5,5,15])box(.22,.3,20,x,y,0,mats.steel);}
 box(30,.25,8,0,5.8,-6,mats.floor,upper);rail(-15,-2,15,-2,6,upper);rail(-15,-10,-15,-2,6,upper);rail(15,-10,15,-2,6,upper);
 box(30,.2,20,0,12,0,mats.light,shell);for(const z of [-10.1,10.1])box(30,3,.15,0,9.9,z,mats.light,shell);
 for(let i=0;i<18;i++)box(1.8,.2,.38,13, .2+i*.32,8-i*.52,mats.steel);rail(12,8,12,-1.1,.4);
 for(const z of [1,-1])pipe([[-14,3,z],[14,3,z]],.23,z===1?mats.pipe:mats.teal);
 for(const x of [-7,-2,3]){pipe([[x,1.5,4],[x,1.5,1],[x,3,1]],.14);pipe([[x-1.1,1,4],[x-1.8,1,4],[x-1.8,3,-1]],.12,mats.teal);}
 for(const x of [-11,-8,-5,-2,1,4,7,10,13]){box(1.4,.012,.065,x,.012,7,mats.yellow);}
 for(const a of assets){const g=new THREE.Group();g.position.set(...a.pos);g.name=a.id;g.userData.assetId=a.id;(a.pos[1]>0?upper:world).add(g);box(3,.18,2.5,0,.1,0,mats.steel,g);
 if(a.kind==='pump'){cyl(.56,1.5,.6,.85,0,mats.blue,g,Math.PI/2);cyl(.65,.45,-.5,.85,0,mats.blue,g,Math.PI/2);cyl(.24,.5,-.5,1.5,0,mats.pipe,g);box(.3,.3,.9,-.1,.75,0,mats.yellow,g);for(const z of [-.44,.44])box(1.3,.25,.16,.6,.35,z,mats.dark,g);for(let i=0;i<(software?4:9);i++){const x=.1+i*.14;cyl(.58,.025,x,.85,0,mats.dark,g,Math.PI/2);}cyl(.29,.15,-.85,.85,0,mats.steel,g,Math.PI/2);}
 else if(a.kind==='chiller'){box(5,2.1,2.8,0,1.2,0,mats.teal,g);for(const x of [-1.6,1.6]){cyl(.65,2.9,x,1.2,0,mats.teal,g,Math.PI/2);box(.65,.6,.8,x,2.6,0,mats.dark,g);}box(1.1,.8,.15,1.5,1.9,1.48,mats.light,g);}
 else if(a.kind==='ahu'){box(5,2.1,2.7,0,1.2,0,mats.light,g);for(let i=0;i<12;i++)box(1.2,.045,.05,-1.3,.5+i*.12,1.38,mats.dark,g);for(const x of [-.5,1.1])box(.035,2,.035,x,1.2,1.38,mats.steel,g);box(.3,.4,.08,1.4,1.3,1.4,mats.dark,g);}
 else{cyl(1.15,3.5,0,1.9,0,mats.light,g);cyl(1.2,.12,0,.2,0,mats.steel,g);cyl(1.2,.12,0,3.6,0,mats.steel,g);}
 g.traverse(o=>{if(o.isMesh){o.userData.assetId=a.id;pickables.push(o);}});equipment.set(a.id,g);
 }
 // Ceiling utility runs and structural detail remain visible in the interior preset.
 for(const z of [-7,-4,0,5])pipe([[-14,10.6,z],[14,10.6,z]],.16,z<0?mats.teal:mats.pipe);
 const proposed=box(3,.05,2.5,8,.04,4,new THREE.MeshBasicMaterial({color:0x59bafa,transparent:true,opacity:.18}));const proposedEdges=new THREE.BoxHelper(proposed,0x51a9dd);world.add(proposedEdges);proposed.visible=false;proposedEdges.visible=false;

return {world,shell,upper,equipment,pickables,proposed,proposedEdges};
}
