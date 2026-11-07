import test from 'node:test';
import assert from 'node:assert/strict';
import { submitWish } from '../lib/wish-submit.ts';
const id='testwish1234567';
const origin='https://birthday.example';
const make=(payload,headers={})=>new Request(origin+'/api/wishes',{method:'POST',headers:{'content-type':'application/json',origin,...headers},body:typeof payload==='string'?payload:JSON.stringify(payload)});
const valid={text:'  আমার একটা সুন্দর বছর কাটুক।  ',submissionId:id};
test('saves Bengali text only to the configured PocketBase collection and returns confirmation',async()=>{
 let called=0;
 const res=await submitWish(make({...valid,admin:true}),async(url,options)=>{
  called++;assert.equal(url,'https://spb.tmadhu.me/api/collections/wish/records');
  assert.equal(options.method,'POST');assert.equal(options.redirect,'error');
  assert.deepEqual(JSON.parse(options.body),{id,text:valid.text.trim()});
  return Response.json({id,text:valid.text.trim()},{status:200});
 });
 assert.equal(called,1);assert.equal(res.status,201);assert.deepEqual(await res.json(),{success:true,id});
});
test('rejects missing, non-string, whitespace and oversized text before database access',async()=>{
 for(const text of [undefined,{},[],8,' \n ','x'.repeat(2001)]){
  const r=await submitWish(make({text,submissionId:id}),()=>{throw Error('must not call');});assert.equal(r.status,400);
 }
});
test('rejects invalid JSON, non-objects, bad IDs and wrong content type',async()=>{
 for(const payload of ['{',null,[],{text:'hi',submissionId:'bad'}]){
  const r=await submitWish(make(payload),()=>{throw Error('must not call');});assert.equal(r.status,400);
 }
 assert.equal((await submitWish(make(valid,{'content-type':'text/plain'}))).status,415);
});
test('rejects cross-origin submission and excessive request size',async()=>{
 assert.equal((await submitWish(make(valid,{origin:'https://other.example'}))).status,403);
 assert.equal((await submitWish(make({text:'x'.repeat(21000),submissionId:id}))).status,413);
});
test('reports permission failures and rate limiting without claiming success',async()=>{
 for(const [upstream,expected] of [[401,503],[403,503],[429,429],[400,422],[500,502]]){
  const r=await submitWish(make(valid),async()=>Response.json({message:'internal detail'},{status:upstream}));
  assert.equal(r.status,expected);const body=await r.json();assert.ok(body.error);assert.equal(body.success,undefined);assert.ok(!JSON.stringify(body).includes('internal detail'));
 }
});
test('timeout retains uncertainty rather than reporting a false save',async()=>{
 const r=await submitWish(make(valid),async()=>{throw new DOMException('timeout','TimeoutError');});assert.equal(r.status,504);assert.equal((await r.json()).uncertain,true);
});
test('unconfirmed/mismatched successful responses never count as a save',async()=>{
 for(const body of [{},{id,text:'different'}, {id:'other',text:valid.text.trim()}]){
  const r=await submitWish(make(valid),async()=>Response.json(body));assert.equal(r.status,502);assert.equal((await r.json()).success,undefined);
 }
});
test('duplicate IDs are reported as uncertain and do not create another copy',async()=>{
 const r=await submitWish(make(valid),async()=>Response.json({data:{id:{code:'validation_not_unique'}}},{status:400}));
 assert.equal(r.status,409);assert.equal((await r.json()).uncertain,true);
});
