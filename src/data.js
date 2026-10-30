export const assets = [
 {id:'EQ-UT-00142',name:'Chilled water pump A',type:'Centrifugal pump',area:'Pump hall',pos:[-7,0,4],kind:'pump',warning:true,metric:'Vibration',unit:'mm/s',value:4.8,limit:4.5,model:'CWP-200',flow:'120 m³/h',power:'22 kW'},
 {id:'EQ-UT-00143',name:'Chilled water pump B',type:'Centrifugal pump',area:'Pump hall',pos:[-2,0,4],kind:'pump',warning:false,metric:'Vibration',unit:'mm/s',value:2.1,limit:4.5,model:'CWP-200',flow:'120 m³/h',power:'22 kW'},
 {id:'EQ-UT-00144',name:'Chilled water pump C',type:'Centrifugal pump',area:'Pump hall',pos:[3,0,4],kind:'pump',warning:false,metric:'Vibration',unit:'mm/s',value:1.8,limit:4.5,model:'CWP-160',flow:'100 m³/h',power:'18 kW'},
 {id:'EQ-CH-00201',name:'Chiller unit A',type:'Water-cooled chiller',area:'Chiller bay',pos:[-6,0,-5],kind:'chiller',warning:false,metric:'Outlet temperature',unit:'°C',value:7.2,limit:10,model:'CH-450',flow:'450 kW cooling',power:'95 kW'},
 {id:'EQ-CH-00202',name:'Chiller unit B',type:'Water-cooled chiller',area:'Chiller bay',pos:[3,0,-5],kind:'chiller',warning:false,metric:'Outlet temperature',unit:'°C',value:7.5,limit:10,model:'CH-450',flow:'450 kW cooling',power:'95 kW'},
 {id:'EQ-AH-00301',name:'Air handling unit A',type:'Air handling unit',area:'Service deck',pos:[-6,6,-5],kind:'ahu',warning:true,metric:'Filter pressure',unit:'Pa',value:310,limit:280,model:'AHU-80',flow:'8,000 m³/h',power:'11 kW'},
 {id:'EQ-AH-00302',name:'Air handling unit B',type:'Air handling unit',area:'Service deck',pos:[3,6,-5],kind:'ahu',warning:false,metric:'Filter pressure',unit:'Pa',value:185,limit:280,model:'AHU-80',flow:'8,000 m³/h',power:'11 kW'},
 {id:'EQ-TK-00401',name:'Buffer tank',type:'Water buffer tank',area:'Chiller bay',pos:[10,0,-5],kind:'tank',warning:false,metric:'Level',unit:'%',value:68,limit:90,model:'BT-5000',flow:'5,000 L capacity',power:'Passive'}
];
export const initialAlarms=assets.filter(a=>a.warning).map((a,i)=>({id:`AL-004${18+i}`,assetId:a.id,title:a.metric+' above warning threshold',acknowledged:false,raised:'09:14',severity:'Warning'}));
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
