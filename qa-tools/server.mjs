import {spawn,execFile} from 'node:child_process';
import {once} from 'node:events';
import {promisify} from 'node:util';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
const port=32183,base='http://127.0.0.1:'+port;
const pkgVersion=JSON.parse(fs.readFileSync('package.json','utf8')).version;
const forumQaFile=path.join(os.tmpdir(),'coachinghub-forum-qa-'+process.pid+'.json');
try{fs.rmSync(forumQaFile,{force:true});}catch{}
const child=spawn(process.execPath,['server.js'],{env:{...process.env,PORT:String(port),FORUM_DATA_FILE:forumQaFile},stdio:['ignore','pipe','pipe']});
let count=0;const check=(v,s)=>{assert.ok(v,s);count++;};
try{
  await Promise.race([once(child.stdout,'data'),once(child,'exit').then(()=>{throw Error('Server exited before listening');})]);
  for(const name of ['descopera','competente','povesti','intrebari','greseli','invata','resurse','certificari','hub','forum']){
    const r=await fetch(base+'/'+name+'/');check(r.status===200,name+': clean route');check((await r.text()).includes('academy.css?v='+pkgVersion),name+': current assets');check(r.headers.get('content-security-policy').includes("default-src 'self'"),'CSP preserved');
  }
  for(const name of ['/costuri','/costuri/','/costuri.html']){const r=await fetch(base+name,{redirect:'manual'});check(r.status===301&&r.headers.get('location')==='/certificari.html','legacy costs redirect '+name);}
  let r=await fetch(base+'/this-page-does-not-exist');check(r.status===404,'missing route returns 404');check(r.headers.get('x-robots-tag')==='noindex','404 not indexed');
  r=await fetch(base+'/invata.html',{method:'POST'});check(r.status===405,'unexpected method rejected');
  r=await fetch(base+'/assets/js/academy.js?v='+pkgVersion,{method:'HEAD'});check(r.status===200&&r.headers.get('cache-control').includes('immutable'),'versioned script caching');
  r=await fetch(base+'/sw.js');check(r.headers.get('cache-control')==='no-cache','service worker revalidated');
  const worker={self:{addEventListener(){}},URL};vm.runInNewContext(fs.readFileSync('sw.js','utf8'),worker);
  for(const resource of worker.CORE){const url=resource==='./'?'/':'/'+resource;const res=await fetch(base+url);check(res.status===200,'precache resource '+resource);}
  r=await fetch(base+'/api/forum');const forum=await r.json();check(r.status===200&&Array.isArray(forum.topics),'forum GET returns topics');
  r=await fetch(base+'/api/forum',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({author:'QA',kind:'discussion',category:'practice',title:'QA topic',body:'A topic created by the server test.'})});const created=await r.json();check(r.status===201&&created.topic?.id,'forum POST creates a topic');
  r=await fetch(base+'/api/forum/'+encodeURIComponent(created.topic.id)+'/replies',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({author:'QA reply',body:'A reply created by the server test.'})});const reply=await r.json();check(r.status===201&&reply.reply?.id,'forum POST creates a reply');
  const {stdout}=await promisify(execFile)(process.execPath,['qa-tools/qa-start.mjs'],{env:{...process.env,BASE:base},timeout:20000});console.log(stdout);
  console.log(`Server QA: ${count} route, header and offline-resource assertions passed.`);
}finally{child.kill('SIGTERM');try{fs.rmSync(forumQaFile,{force:true});}catch{}}
