import {existsSync,renameSync,cpSync,rmSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const dist=path.join(root,'dist');
if(existsSync(path.join(dist,'index.source.html')))renameSync(path.join(dist,'index.source.html'),path.join(dist,'index.html'));
// These directories are owned exclusively by this publication step.
for(const name of ['assets','models','licenses','integration']){
 rmSync(path.join(root,name),{recursive:true,force:true});
 if(existsSync(path.join(dist,name)))cpSync(path.join(dist,name),path.join(root,name),{recursive:true});
}
cpSync(path.join(dist,'index.html'),path.join(root,'index.html'));
writeFileSync(path.join(root,'.nojekyll'),'');
console.log('Built site published to repository root; source HTML is index.source.html.');
