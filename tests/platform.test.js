import {test} from 'node:test';
import assert from 'node:assert/strict';
import seed from '../public/integration/seed.v1.json' with {type:'json'};
import {assets,initialAlarms,createWork,acknowledge} from '../src/data.js';
import {createBundle,validateBundle,readContext,writeContext,moduleLink,modules} from '../shared/platform.js';

test('each equipment export contains only resolvable asset, document and alarm references',()=>{
  for(const a of assets){
    let state=createWork({work:[],acknowledged:[]},a.id,'Inspect equipment condition','Normal');
    const alarm=initialAlarms.find(r=>r.assetId===a.id);
    if(alarm)state=acknowledge(state,alarm.id);
    const b=createBundle(seed,state,a.id);
    assert.equal(validateBundle(b),true);
    assert.equal(b.assets.length,1);
    assert.equal(b.workRequests[0].assetId,a.id);
    assert.equal(b.acknowledgedAlarmIds.length,alarm?1:0);
  }
});
test('reject incompatible versions, duplicate identity and dangling relationships',()=>{
  const base=()=>createBundle(seed,{work:[],acknowledged:[]},assets[0].id);
  const version=base();version.schemaVersion='2.0.0';assert.throws(()=>validateBundle(version));
  const duplicate=base();duplicate.assets.push(duplicate.assets[0]);assert.throws(()=>validateBundle(duplicate));
  const drawing=base();drawing.drawings[0].assetIds=['EQ-XX-99999'];assert.throws(()=>validateBundle(drawing));
  const delivery=base();delivery.deliveries[0].documentIds=['DOC-MISSING'];assert.throws(()=>validateBundle(delivery));
  const alarm=base();alarm.acknowledgedAlarmIds=['AL-MISSING'];assert.throws(()=>validateBundle(alarm));
});
test('deep links preserve deployment subpaths, unrelated parameters and selected tab',()=>{
  const href=writeContext('https://example.test/digital_twin/?lang=en',{assetId:assets[0].id,tab:'Platform'});
  assert.deepEqual(readContext(href,assets),{assetId:assets[0].id,tab:'Platform'});
  assert.equal(new URL(href).pathname,'/digital_twin/');
  assert.equal(new URL(href).searchParams.get('lang'),'en');
  assert.equal(readContext('https://example.test/?assetId=unknown&tab=invalid',assets).assetId,null);
  assert.equal(new URL(writeContext(href,{assetId:null})).searchParams.has('assetId'),false);
});
test('unimplemented apps have no fabricated live URL; configured apps carry return context',()=>{
  for(const m of modules.filter(m=>!m.baseUrl))assert.equal(moduleLink(m,assets[0].id),null);
  assert.equal(new URL(moduleLink(modules[0],assets[0].id)).searchParams.get('assetId'),assets[0].id);
  const link=moduleLink({...modules[0],baseUrl:'https://example.test/master_data/'},assets[0].id,'https://example.test/digital_twin/');
  const url=new URL(link);assert.equal(url.searchParams.get('assetId'),assets[0].id);
  assert.equal(new URL(url.searchParams.get('returnTo')).searchParams.get('tab'),'Platform');
  assert.throws(()=>moduleLink({baseUrl:'javascript:alert(1)'},assets[0].id));
});
