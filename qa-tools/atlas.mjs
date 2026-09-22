import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {JSDOM,VirtualConsole} from 'jsdom';
import http from 'node:http';
const root=process.cwd();
const server=http.createServer((req,res)=>{const file=path.join(root,new URL(req.url,'http://local').pathname);if(!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port;
process.on('exit',()=>server.close());
let count=0;
const check=(v,msg)=>{assert.ok(v,msg);count++;};
async function load(name,hash='',storage={}){
 const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>{if(e.type!=='not-implemented')errors.push(e.message);});
 const dom=new JSDOM(fs.readFileSync(name,'utf8'),{url:base+'/'+name+hash,runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};w.ResizeObserver=class{observe(){}disconnect(){}};for(const[k,v]of Object.entries(storage))w.localStorage.setItem(k,v);}});
 await new Promise(resolve=>dom.window.addEventListener('load',resolve));await new Promise(r=>setTimeout(r,30));
 return{dom,w:dom.window,d:dom.window.document,errors};
}
for(const name of fs.readdirSync(root).filter(f=>f.endsWith('.html'))){
 const{dom,w,d,errors}=await load(name);
 check(errors.length===0,name+': '+errors.join('\n'));
 check(d.querySelectorAll('h1').length===1,name+': headings');
 if(name!=='404.html'&&name!=='costuri.html')check(d.querySelectorAll('#navlinks a').length===5,name+': five destinations');
 check([...d.querySelectorAll('[id]')].length===new Set([...d.querySelectorAll('[id]')].map(e=>e.id)).size,name+': unique IDs');
 for(const a of d.querySelectorAll('a[href]')){
  const href=a.getAttribute('href');if(!href||/^(https?:|mailto:|tel:|javascript:)/.test(href))continue;
  const [file,hash]=href.split('#');const dest=file?file.split('?')[0]:name;
  if(dest&&dest.endsWith('.html'))check(fs.existsSync(path.join(root,dest)),name+': link '+href);
  if(hash&&(!file||file===name)&&!hash.startsWith('detail-')&&!/^s\d+$/.test(hash))check(!!d.getElementById(hash),name+': anchor '+href);
 }
 if(name==='index.html'){check(d.querySelectorAll('.ac-card.ac-route').length===3,'Three homepage routes');check(!d.querySelector('#schools'),'No school directory on homepage');}
 if(name==='scoli.html'){
  check(d.querySelectorAll('.atlas-school').length===10,'Ten initial schools');d.querySelector('#schoolNext').click();check(d.querySelectorAll('.atlas-school').length===10,'Next schools');
  const inp=d.querySelector('#atlasSchoolSearch');inp.value='NO_MATCH_123';inp.dispatchEvent(new w.Event('input'));check(d.querySelectorAll('.atlas-school').length===0,'Empty search');
  d.querySelector('#resetSchools').click();for(const el of [...d.querySelectorAll('[data-school]')].slice(0,4)){el.checked=true;el.dispatchEvent(new w.Event('change'));}
  check(d.querySelectorAll('[data-school]:checked').length===3,'Compare limit');check(d.querySelectorAll('#atlasSchoolCompare thead th').length===4,'Three comparison columns');
 }
 if(name==='traseul-meu.html'){
  const legacyAdvisor=d.querySelector('#advisorCurrent');
  if(legacyAdvisor){legacyAdvisor.value='anc';legacyAdvisor.dispatchEvent(new w.Event('change'));d.querySelector('#advisorGo').click();check(!d.querySelector('#atlasDetail').hidden,'Inline transition');check(!d.querySelector('#modalBg').classList.contains('open'),'No modal');}
  else {const choices=d.querySelectorAll('.ac-path-choice');check(choices.length===4,'Four orientation paths');choices[0].querySelector('summary').click();check(choices[0].open,'Open orientation path');check(choices[0].querySelector('a[href]'),'Orientation path link');}
 }
 if(name==='certificari.html'){
  const cred=d.querySelector('.cred-card[data-cred]');
  if(cred){cred.click();check(!!d.querySelector('#atlasDetail h3'),'Inline credential');}
  else check(d.querySelectorAll('.ac-credential').length===3,'Editorial credential cards');
 }
 if(['teorie.html','individual.html','echipa.html'].includes(name)){
  const chapters=d.querySelectorAll('.doc-sec');
  if(chapters.length){
   check(d.querySelectorAll('.doc-sec:not([hidden])').length===1,'One chapter');d.querySelector('#atlasNext').click();check(d.querySelector('.doc-sec:not([hidden])')===d.querySelectorAll('.doc-sec')[1],'Next chapter');d.querySelector('#atlasReadAll').click();check(d.querySelectorAll('.doc-sec:not([hidden])').length===10,'Full document');
  }else {
   check(d.querySelectorAll('.ac-section[id]').length>=3,'Editorial sections');
   check([...d.querySelectorAll('.ac-section[id]')].every(section=>section.querySelector('h2')),'Editorial section headings');
  }
 }
 if(d.querySelector('#langBtn')){d.querySelector('#langBtn').click();check(d.documentElement.lang==='en',name+': English');d.querySelector('#langBtn').click();check(d.documentElement.lang==='ro',name+': Romanian');}
 check(errors.length===0,name+' interaction errors: '+errors.join('\n'));
 console.log('PASS '+name);dom.window.close();
}
const deep=await load('teorie.html','#etica');
if(deep.d.querySelector('.doc-sec')) check(deep.d.querySelector('.doc-sec:not([hidden])').id==='etica','Direct chapter link');
else check(deep.d.querySelector('#etica'),'Direct editorial section link');
deep.w.close();
const prog=await load('index.html','',{'cp_start_v2':JSON.stringify({done:{s1:true},open:'s2'}),'cp_map_done':'[1,2]'});check(!prog.d.querySelector('#acHomeProgress').hidden,'Resume preserves progress');check(prog.w.localStorage.getItem('cp_map_done')==='[1,2]','Legacy progress untouched');prog.w.close();
console.log(`Atlas: ${count} assertions passed. DOM tests, not a real-device visual audit.`);
server.close();
