import {spawn,execFile} from 'node:child_process';
import {once} from 'node:events';
import {promisify} from 'node:util';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const port=32183,base='http://127.0.0.1:'+port;
const child=spawn(process.execPath,['server.js'],{env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
let count=0;const check=(v,s)=>{assert.ok(v,s);count++;};
try{
  await Promise.race([once(child.stdout,'data'),once(child,'exit').then(()=>{throw Error('Server exited before listening');})]);
  for(const name of ['descopera','competente','povesti','intrebari','greseli','invata','resurse','certificari']){
    const r=await fetch(base+'/'+name+'/');check(r.status===200,name+': clean route');check((await r.text()).includes('academy.css?v=3.0.0'),name+': current assets');check(r.headers.get('content-security-policy').includes("default-src 'self'"),'CSP preserved');
  }
  for(const name of ['/costuri','/costuri/','/costuri.html']){const r=await fetch(base+name,{redirect:'manual'});check(r.status===301&&r.headers.get('location')==='/certificari.html','legacy costs redirect '+name);}
  let r=await fetch(base+'/this-page-does-not-exist');check(r.status===404,'missing route returns 404');check(r.headers.get('x-robots-tag')==='noindex','404 not indexed');
  r=await fetch(base+'/invata.html',{method:'POST'});check(r.status===405,'unexpected method rejected');
  r=await fetch(base+'/assets/js/academy.js?v=3.0.0',{method:'HEAD'});check(r.status===200&&r.headers.get('cache-control').includes('immutable'),'versioned script caching');
  r=await fetch(base+'/sw.js');check(r.headers.get('cache-control')==='no-cache','service worker revalidated');
  const worker={self:{addEventListener(){}},URL};vm.runInNewContext(fs.readFileSync('sw.js','utf8'),worker);
  for(const resource of worker.CORE){const url=resource==='./'?'/':'/'+resource;const res=await fetch(base+url);check(res.status===200,'precache resource '+resource);}
  const {stdout}=await promisify(execFile)(process.execPath,['qa-tools/qa-start.mjs'],{env:{...process.env,BASE:base},timeout:20000});console.log(stdout);
  console.log(`Server QA: ${count} route, header and offline-resource assertions passed.`);
}finally{child.kill('SIGTERM');}
