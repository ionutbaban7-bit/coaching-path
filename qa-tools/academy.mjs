import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {JSDOM,VirtualConsole} from 'jsdom';
const root=process.cwd();
const server=http.createServer((req,res)=>{let name=new URL(req.url,'http://local').pathname;const file=path.join(root,name);if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':file.endsWith('.webp')?'image/webp':'text/html');res.end(fs.readFileSync(file));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port;
let checks=0;
const check=(v,msg)=>{assert.ok(v,msg);checks++;};
const pages=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
const documents=new Map(pages.map(f=>[f,new JSDOM(fs.readFileSync(f,'utf8')).window.document]));
const windows=[];
async function load(file,hash='',storage={},blockStorage=false){
  const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(e.type!=='not-implemented')errors.push(e.message);});
  const dom=new JSDOM(fs.readFileSync(file,'utf8'),{url:base+'/'+file+hash,resources:'usable',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};w.ResizeObserver=class{observe(){}disconnect(){}};w.confirm=()=>true;w.URL.createObjectURL=blob=>{w.qaExport=blob;return 'blob:qa';};w.URL.revokeObjectURL=()=>{};for(const[k,v]of Object.entries(storage))w.localStorage.setItem(k,v);if(blockStorage)w.Storage.prototype.setItem=()=>{throw new Error('Storage denied');};}});
  windows.push(dom.window);await new Promise(r=>dom.window.addEventListener('load',r));return {w:dom.window,d:dom.window.document,errors};
}
const event=(w,el,type)=>el.dispatchEvent(new w.Event(type,{bubbles:true}));
try{
  for(const file of ['academy-conversation.webp','academy-library.webp']){
    const bytes=fs.readFileSync('assets/img/'+file);
    check(bytes.length>1000,file+': non-empty image export');
    check(bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP'&&bytes.readUInt32LE(4)+8===bytes.length,file+': complete WebP container');
  }
  for(const file of pages){
    const {w,d,errors}=await load(file);
    check(errors.length===0,file+': runtime errors '+errors.join(';'));
    check(d.querySelectorAll('h1').length===1,file+': one h1');
    const ids=[...d.querySelectorAll('[id]')].map(n=>n.id);check(ids.length===new Set(ids).size,file+': unique IDs');
    if(!['costuri.html','404.html'].includes(file))check(d.querySelectorAll('#navlinks a').length===5,file+': five clear navigation destinations');
    check(!d.querySelector('a[href*="costuri.html"]'),file+': no cost destination');
    check(!/de populat|gata de populat|what.s left to populate/i.test(d.body.textContent),file+': no unfinished scaffolds');
    for(const a of d.querySelectorAll('a[href]')){
      const url=new URL(a.getAttribute('href'),base+'/'+file);if(url.origin!==base||!url.pathname.endsWith('.html'))continue;
      const dest=url.pathname.slice(1), target=documents.get(dest);check(!!target,file+': local target '+dest);
      if(url.hash&&target&&!/^#s\d+$/.test(url.hash)&&!(dest==='invata.html'&&/^#c[1-8]$/.test(url.hash)))check(!!target.getElementById(decodeURIComponent(url.hash.slice(1))),file+': deep link '+a.getAttribute('href'));
    }
    if(d.querySelector('#langBtn')){d.querySelector('#langBtn').click();check(d.documentElement.lang==='en',file+': English switch');d.querySelector('#langBtn').click();check(d.documentElement.lang==='ro',file+': Romanian switch');}
    check(errors.length===0,file+': interaction errors');
    w.close();console.log('PASS structure, links, language: '+file);
  }
  {
    const {w,d}=await load('competente.html','#c6');
    check(d.querySelectorAll('[data-comp-panel]:not([hidden])').length===1,'one competency at a time');
    check(!d.querySelector('#c6').hidden,'direct competency hash');
    d.querySelector('[data-comp-link="c8"]').click();check(!d.querySelector('#c8').hidden&&w.location.hash==='#c8','competency navigation updates URL');
    check(d.activeElement.id==='c8','competency focus follows navigation');
    d.querySelector('#langBtn').click();check(d.querySelector('#c8 h2').textContent.includes('chosen step'),'competency translates without losing selection');w.close();
  }
  let storage;
  {
    const {w,d}=await load('index.html');const input=d.querySelector('#acHomeSearch');input.value='etica';event(w,input,'input');check(d.querySelectorAll('#acHomeResults a').length>0,'home search finds Romanian topics without diacritics');check([...d.querySelectorAll('#acHomeResults a')].some(a=>a.href.includes('competente.html#c1')),'home search goes straight to relevant competency');input.value='zzunknownzz';event(w,input,'input');check(d.querySelector('#acHomeSearchStatus').textContent.includes('Niciun rezultat'),'home search has no-results guidance');input.value='';event(w,input,'input');check(d.querySelector('#acHomeResults').hidden,'cleared home search returns to intent cards');w.close();
  }
  {
    const {w,d,errors}=await load('invata.html','#c7');const note=d.querySelector('#acReflection');
    check(d.querySelector('#acPracticeSelect').value==='c7','practice deep link');
    note.value='<img src=x onerror=alert(1)> My own reflection';event(w,note,'input');
    check(!w.localStorage.getItem('cp_academy_v3'),'notes not stored before explicit save');
    d.querySelector('#langBtn').click();check(note.value.includes('<img'),'unsaved reflection survives language change');
    d.querySelector('#acPracticeSelect').value='c1';event(w,d.querySelector('#acPracticeSelect'),'change');
    d.querySelector('#acPracticeSelect').value='c7';event(w,d.querySelector('#acPracticeSelect'),'change');check(note.value.includes('<img'),'unsaved draft survives competency changes');
    d.querySelector('#acSaveNote').click();d.querySelector('#acMarkDone').click();
    storage=w.localStorage.getItem('cp_academy_v3');const state=JSON.parse(storage);check(state.done.includes('c7')&&state.notes.c7.includes('<img'),'journal and progress save together');
    check(!d.querySelector('#acJournal img'),'stored text cannot inject HTML');check(d.querySelector('#acProgress').value===1,'visible practice progress');
    note.value='Unsaved export test';event(w,note,'input');d.querySelector('#acExport').click();check(w.qaExport&&w.qaExport.size>0,'journal export creates a nonempty text artifact');
    w.confirm=()=>false;d.querySelector('#acReset').click();check(JSON.parse(w.localStorage.getItem('cp_academy_v3')).done.length===1,'cancel preserves journal');
    w.confirm=()=>true;d.querySelector('#acReset').click();check(JSON.parse(w.localStorage.getItem('cp_academy_v3')).done.length===0&&Object.keys(JSON.parse(w.localStorage.getItem('cp_academy_v3')).notes).length===0,'confirmed reset clears studio data');check(errors.length===0,'practice flow has no runtime errors');w.close();
  }
  {
    const {w,d}=await load('invata.html','',{'cp_academy_v3':storage});check(d.querySelector('#acPracticeSelect').value==='c7','resume last practised competency');check(d.querySelector('#acReflection').value.includes('My own reflection'),'saved note survives reload');check(d.querySelector('#acMarkDone').getAttribute('aria-pressed')==='true','completion survives reload');w.close();
    const home=await load('index.html','',{'cp_academy_v3':storage,'cp_start_v2':'{"done":{"s1":true},"open":"s2"}','cp_map_done':'[1,2]'});check(!home.d.querySelector('#acHomeProgress').hidden,'homepage continues learning');check(home.w.localStorage.getItem('cp_map_done')==='[1,2]','legacy map progress untouched');home.w.close();
  }
  for(const raw of ['null','[]','not-json','{"notes":42,"done":"all","questions":["unknown"],"last":"<script>"}']){
    const {w,d,errors}=await load('invata.html','',{'cp_academy_v3':raw});check(errors.length===0,'malformed state does not break practice: '+raw);check(d.querySelector('#acPracticeSelect').value==='c1','invalid last competency falls back');w.close();
  }
  {
    const {w,d}=await load('invata.html','',{},true);d.querySelector('#acReflection').value='Temporary note';d.querySelector('#acSaveNote').click();check(d.querySelector('#acSaveStatus').textContent.includes('nu permite salvarea'),'storage failure is disclosed');check(d.querySelector('#acJournal').textContent.includes('Temporary note'),'storage blocked: in-memory journal still works');w.close();
  }
  for(const [file,prefix,selector,attr] of [['intrebari.html','acQ','.ac-question','data-save-question'],['resurse.html','acR','.ac-resource','data-save-resource']]){
    const {w,d}=await load(file);const all=d.querySelectorAll(selector).length;
    d.querySelector('['+attr+']').click();check(d.querySelector('['+attr+']').getAttribute('aria-pressed')==='true',file+': favourite selected');
    d.querySelector('#'+prefix+'Saved').checked=true;event(w,d.querySelector('#'+prefix+'Saved'),'change');check(d.querySelectorAll(selector+':not([hidden])').length===1,file+': favourites filter');
    d.querySelector('#langBtn').click();check(d.querySelectorAll(selector+':not([hidden])').length===1,file+': filter survives language switch');
    d.querySelector('#'+prefix+'Search').value='zzzero_results';event(w,d.querySelector('#'+prefix+'Search'),'input');check(!d.querySelector('#'+prefix+'Empty').hidden,file+': helpful no-results state');
    d.querySelector('#'+prefix+'Reset').click();check(d.querySelectorAll(selector+':not([hidden])').length===all,file+': reset restores items');
    if(prefix==='acQ'){d.querySelector('#acQSearch').value='actiune';event(w,d.querySelector('#acQSearch'),'input');check(d.querySelectorAll('.ac-question:not([hidden])').length>0,'search handles Romanian diacritics');d.querySelector('#acShowRewrite').click();check(!d.querySelector('#acRewriteGuide').hidden,'rephrasing guide opens');d.querySelector('#acShowRewrite').click();check(d.querySelector('#acRewriteGuide').hidden,'rephrasing guide closes');}
    else{d.querySelector('#acRType').value='books';event(w,d.querySelector('#acRType'),'change');check(d.querySelectorAll('.ac-resource:not([hidden])').length===6,'books category separates source types');}
    w.close();
  }
  {
    const {w,d}=await load('greseli.html');d.querySelector('#acMistakeType').value='red';event(w,d.querySelector('#acMistakeType'),'change');check(d.querySelectorAll('.ac-mistake:not([hidden])').length===4,'warning signs distinct from beginner mistakes');d.querySelector('.ac-mistake[data-severity=red] summary').click();check(d.querySelector('.ac-mistake[data-severity=red]').open,'warning sign repair expands natively');w.close();
    const story=await load('povesti.html');check(story.d.querySelectorAll('.ac-story').length===4,'four complete stories');for(const el of story.d.querySelectorAll('.ac-choice')){el.querySelector('summary').click();check(el.open&&el.querySelector('.ac-choice-feedback').textContent.length>50,'each choice reveals explanatory feedback');}story.w.close();
  }
  {
    const {w,d,errors}=await load('scoli.html');check(d.querySelectorAll('.atlas-school').length===10,'school directory pagination');d.querySelector('#schoolNext').click();check(d.querySelectorAll('.atlas-school').length===10,'school page 2');const input=d.querySelector('#atlasSchoolSearch');input.value='NO_MATCH_123';event(w,input,'input');check(d.querySelectorAll('.atlas-school').length===0,'school empty search');d.querySelector('#resetSchools').click();for(const c of [...d.querySelectorAll('[data-school]')].slice(0,4)){c.checked=true;event(w,c,'change');}check(d.querySelectorAll('[data-school]:checked').length===3,'school comparison capped at three');check(d.querySelectorAll('#atlasSchoolCompare thead th').length===4,'school comparison table');check(errors.length===0,'school interactions error-free');w.close();
  }
  {
    const {w,d,errors}=await load('incepe.html','',{'cp_start_v2':'{"done":{"s1":true,"s2":true},"quiz":{"s1":2},"a":{"who":"student","time":"fast","budget":"small"}}'});
    check(d.querySelectorAll('.start-step').length===10,'guided journey keeps ten steps');check(d.querySelector('#step-s1').classList.contains('done'),'guided journey keeps old completion');
    for(const name of ['who','time','focus']){const input=d.querySelector('[name=q_'+name+']');input.checked=true;event(w,input,'change');}
    check(!d.querySelector('#startSetupGo').disabled,'new onboarding completes without budget');
    check(d.querySelector('#startPlan').textContent.includes('PLANUL MEU DE EXPLORARE'),'non-financial personalised learning plan');
    check(!/costuri|750|4.000|12 LUNI/.test(d.querySelector('#startPlan').textContent),'no speculative cost or deadline recommendation');
    if(!d.querySelector('#step-s1').classList.contains('open'))d.querySelector('#step-s1 .start-step-head').click();d.querySelectorAll('#step-s1 .start-quiz-opt')[1].click();check(d.querySelectorAll('#step-s1 .start-quiz-opt')[1].classList.contains('ok'),'guided quiz feedback');
    check(JSON.parse(w.localStorage.getItem('cp_start_v2')).done.s2===true,'guided save preserves previously completed steps');check(errors.length===0,'guided journey error-free');w.close();
  }
  // This checks responsive rules and contrast tokens, not physical mobile rendering.
  const css=fs.readFileSync('assets/css/academy.css','utf8');check(css.includes('@media(max-width:600px)')&&css.includes('@media(max-width:360px)'),'small viewport layouts present');check(css.includes('prefers-reduced-motion'),'reduced motion support');check(css.includes('min-height:44px'),'touch control sizing');check(css.includes(':focus-visible'),'visible keyboard focus');
  const luminance=hex=>hex.match(/[\da-f]{2}/gi).map(x=>parseInt(x,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
  for(const [fg,bg] of [['203b32','f7f5ed'],['59665c','f7f5ed'],['f8faec','173f35'],['934b31','f0dfcc'],['f0f4e8','162a22'],['b9c7b7','20382d'],['e9ae91','40372b']]){const vals=[luminance(fg),luminance(bg)].sort((a,b)=>b-a);check((vals[0]+.05)/(vals[1]+.05)>=4.5,'text contrast '+fg+'/'+bg);}
  console.log(`Academy QA: ${checks} assertions passed. DOM, state, security, links, contrast and responsive-source checks; real-browser visual QA is separate.`);
} finally { windows.forEach(w=>w.close());server.close(); }
