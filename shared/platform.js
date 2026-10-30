/** Portable v1 integration adapter. No dependency on Three.js or a DOM. */
export const SCHEMA_VERSION = '1.0.0';
export const modules = [
  {id:'master_data',name:'Master data',repository:'https://github.com/leetj94-lab/master_data',baseUrl:null,description:'Owns equipment identity, specifications and lifecycle.'},
  {id:'engineering_drawing',name:'Engineering drawings',repository:'https://github.com/leetj94-lab/engineering_drawing',baseUrl:null,description:'Owns drawing revisions and equipment-to-drawing relationships.'},
  {id:'document_delivery',name:'Document delivery',repository:'https://github.com/leetj94-lab/document_delivery',baseUrl:null,description:'Owns submissions, validation and approved document releases.'},
  {id:'etl_monitoring',name:'ETL monitoring',repository:'https://github.com/leetj94-lab/etl_monitoring',baseUrl:null,description:'Owns ingestion runs, lineage, failures and retry history.'},
];
const tabs = ['Overview','Quality','Alarms','Work','Documents','Platform'];
export function readContext(href, assets) {
  const params = new URL(href).searchParams;
  const id = params.get('assetId');
  return {assetId:assets.some(a=>a.id===id)?id:null,tab:tabs.includes(params.get('tab'))?params.get('tab'):'Overview'};
}
export function writeContext(href, {assetId,tab='Overview'}) {
  const url = new URL(href);
  url.searchParams.delete('assetId'); url.searchParams.delete('tab');
  if(assetId){url.searchParams.set('assetId',assetId);url.searchParams.set('tab',tabs.includes(tab)?tab:'Overview');}
  return url.href;
}
/** Returns null until the owner explicitly configures a deployed application URL. */
export function moduleLink(module, assetId, returnTo) {
  if(!module.baseUrl) return null;
  const url = new URL(module.baseUrl);
  if(!['http:','https:'].includes(url.protocol)) throw Error('Unsupported application URL');
  url.searchParams.set('assetId',assetId);
  url.searchParams.set('siteId','DEMO-PLANT-01');
  if(returnTo)url.searchParams.set('returnTo',writeContext(returnTo,{assetId,tab:'Platform'}));
  return url.href;
}
export function createBundle(seed, state, assetId, now = new Date()) {
  if(!seed.assets.some(a=>a.id===assetId))throw Error('Unknown asset');
  const linked = key => seed[key].filter(r=>r.assetIds.includes(assetId));
  const bundle = {
    schemaVersion:SCHEMA_VERSION,siteId:seed.siteId,synthetic:true,
    source:'digital_twin',exportedAt:now.toISOString(),context:{assetId},
    assets:seed.assets.filter(a=>a.id===assetId),drawings:linked('drawings'),
    documents:linked('documents'),deliveries:linked('deliveries'),
    // Scope many-to-many references to this portable bundle's asset set.
    pipelines:linked('pipelines').map(p=>({...p,assetIds:[assetId]})),
    alarms:seed.alarms.filter(a=>a.assetId===assetId),
    workRequests:state.work.filter(w=>w.assetId===assetId),
    acknowledgedAlarmIds:state.acknowledged.filter(id=>seed.alarms.some(a=>a.id===id&&a.assetId===assetId)),
  };
  validateBundle(bundle);
  return structuredClone(bundle);
}
/** Runtime semantic validation complements the published JSON Schema. */
export function validateBundle(bundle) {
  if(!bundle || bundle.schemaVersion!==SCHEMA_VERSION || bundle.synthetic!==true || bundle.siteId!=='DEMO-PLANT-01')throw Error('Unsupported platform contract');
  const keys=['assets','drawings','documents','deliveries','pipelines','alarms','workRequests','acknowledgedAlarmIds'];
  if(keys.some(k=>!Array.isArray(bundle[k])))throw Error('Missing record collection');
  const ids = new Set();
  for(const a of bundle.assets){if(!a || !/^EQ-[A-Z]{2}-\d{5}$/.test(a.id) || ids.has(a.id))throw Error('Invalid or duplicate asset ID');ids.add(a.id);}
  if(!ids.has(bundle.context?.assetId))throw Error('Unknown context asset');
  for(const key of ['drawings','documents','deliveries','pipelines']) {
    const seen = new Set();
    for(const r of bundle[key]) {
      if(!r || typeof r.id!=='string' || !r.id || seen.has(r.id))throw Error('Invalid or duplicate record ID');seen.add(r.id);
      if(!Array.isArray(r.assetIds)||!r.assetIds.length||r.assetIds.some(id=>!ids.has(id)))throw Error('Dangling asset reference');
    }
  }
  const docs = new Set(bundle.documents.map(d=>d.id));
  for(const d of bundle.deliveries)if(!Array.isArray(d.documentIds)||d.documentIds.some(id=>!docs.has(id)))throw Error('Dangling document reference');
  const alarms = new Set(bundle.alarms.map(a=>a.id));
  if(bundle.alarms.some(a=>!ids.has(a.assetId))||bundle.acknowledgedAlarmIds.some(id=>!alarms.has(id)))throw Error('Dangling alarm reference');
  for(const w of bundle.workRequests)if(!w||!ids.has(w.assetId)||typeof w.id!=='string'||typeof w.summary!=='string'||(w.sourceAlarm&&!alarms.has(w.sourceAlarm)))throw Error('Invalid work reference');
  return true;
}
