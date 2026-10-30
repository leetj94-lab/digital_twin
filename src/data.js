import seed from '../public/integration/seed.v1.json' with {type:'json'};
export const assets = seed.assets;
export const initialAlarms=seed.alarms;
const KEY='factory-twin-state-v1';
export function loadState(storage){try{const s=JSON.parse(storage.getItem(KEY));if(s&&Array.isArray(s.work)&&Array.isArray(s.acknowledged))return {work:s.work.filter(w=>assets.some(a=>a.id===w.assetId)&&typeof w.summary==='string'&&typeof w.id==='string'&&['High','Normal','Low'].includes(w.priority)&&typeof w.created==='string'),acknowledged:s.acknowledged.filter(id=>initialAlarms.some(a=>a.id===id))};}catch{}return {work:[],acknowledged:[]};}
export function saveState(storage,state){try{storage.setItem(KEY,JSON.stringify(state));return true;}catch{return false;}}
export function createWork(state,assetId,summary,priority,now=new Date()){
 if(!assets.some(a=>a.id===assetId))throw new Error('Unknown asset');
 const clean=summary.trim();if(clean.length<10||clean.length>240)throw new Error('Use 10–240 characters for the work summary.');
 if(!['High','Normal','Low'].includes(priority))throw new Error('Invalid priority');
 const work={id:`WR-${now.getTime().toString(36).toUpperCase()}-${state.work.length+1}`,assetId,summary:clean,priority,status:'Requested',created:now.toISOString(),sourceAlarm:initialAlarms.find(a=>a.assetId===assetId)?.id||null};
 return {...state,work:[work,...state.work]};
}
export function acknowledge(state,id){if(!initialAlarms.some(a=>a.id===id))throw new Error('Unknown alarm');return {...state,acknowledged:[...new Set([...state.acknowledged,id])]};}
export function trend(a){return Array.from({length:30},(_,i)=>+(a.warning?a.value*.45+(a.value*.55*i/29)+Math.sin(i*1.7)*a.value*.025:a.value+Math.sin(i*1.7)*a.value*.045).toFixed(2));}
export const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
