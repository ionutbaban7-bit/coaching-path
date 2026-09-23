// Behavioural regression checks for direct lessons, models and opt-in media.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import jsdom from 'jsdom';
const {JSDOM,requestInterceptor,VirtualConsole}=jsdom;
import {lessons,sources} from '../tools/learning-content.mjs';

let count=0;
const check=(condition,message)=>{assert.ok(condition,message);count++;};
async function load(file,hash=''){
 const resources={external:[]},errors=[],console=new VirtualConsole();
 const network={interceptors:[requestInterceptor(request=>{
  const u=new URL(request.url);
  if(u.origin!=='https://local.test'){resources.external.push(request.url);return new Response('<!doctype html><title>External media test fixture</title>',{headers:{'content-type':'text/html'}});}
  const f=u.pathname.slice(1);
  return new Response(fs.readFileSync(f),{headers:{'content-type':f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':'text/html'}});
 })]};
 console.on('jsdomError',e=>{if(e.type!=='not-implemented')errors.push(e.message);});
 const dom=new JSDOM(fs.readFileSync(file,'utf8'),{url:'https://local.test/'+file+hash,runScripts:'dangerously',resources:network,pretendToBeVisual:true,virtualConsole:console,beforeParse(w){w.matchMedia=()=>({matches:false,addEventListener(){}});w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.IntersectionObserver=class{observe(){}disconnect(){}};}});
 await new Promise(r=>dom.window.addEventListener('load',r));
 return {w:dom.window,d:dom.window.document,resources,errors};
}
for(const lesson of lessons){
 const {w,d,resources,errors}=await load(lesson.slug);
 try{
  check(d.querySelector('h1').textContent===lesson.title.ro,lesson.id+': direct route contains the right lesson');
  check(d.querySelector('a[aria-current="page"]').getAttribute('href')===lesson.slug,lesson.id+': current lesson is identified');
  check(d.querySelector('#standard blockquote').textContent.includes(w.ACADEMY.competencies.find(c=>c.id===lesson.id).official),lesson.id+': official name is quoted');
  check(resources.external.length===0&&!d.querySelector('iframe'),lesson.id+': no external media before interaction');
  check(d.querySelector('a[href="invata.html#'+lesson.id+'"]'),lesson.id+': practice keeps competency selection');
  check(d.querySelector('a[href="'+sources.pdf+'#page='+lesson.page+'"]'),lesson.id+': exact official document page');
  d.querySelector('[data-load-video]').click();
  const player=d.querySelector('.learn-video iframe');
  check(player?.src==='https://www.youtube-nocookie.com/embed/'+lesson.video+'?rel=0',lesson.id+': loads the matching official video on request');
  check(player.title&&player.allowFullscreen&&player.referrerPolicy==='strict-origin-when-cross-origin',lesson.id+': accessible, fullscreen, referrer-compatible player');
  check(d.querySelector('a[href="https://www.youtube.com/watch?v='+lesson.video+'"]'),lesson.id+': direct playback fallback remains');
  d.querySelector('[data-load-document]').click();
  check(d.querySelector('.learn-document iframe')?.src===sources.pdf+'#page='+lesson.page,lesson.id+': original document opens at correct page');
  d.querySelector('#langBtn').click();
  check(d.querySelector('h1').textContent===lesson.title.en,lesson.id+': lesson translates after media interaction');
  check(errors.length===0,lesson.id+': no runtime errors: '+errors.join('; '));
 }finally{w.close();}
}
for(const file of ['descopera.html','modele.html']){
 const {w,d,resources,errors}=await load(file,'#grow-r');
 try{
  check(d.querySelectorAll('[data-grow-panel]:not([hidden])').length===1,file+': one active GROW panel');
  check(!d.querySelector('#grow-r').hidden,file+': deep-link restores the requested stage');
  const options=d.querySelector('[data-grow-step="2"]');options.click();
  check(!d.querySelector('#grow-o').hidden&&w.location.hash==='#grow-o',file+': mouse changes stage and address');
  options.dispatchEvent(new w.KeyboardEvent('keydown',{key:'End',bubbles:true}));
  check(d.activeElement.id==='grow-step-3'&&!d.querySelector('#grow-w').hidden,file+': keyboard End changes selection and focus');
  d.querySelector('#langBtn').click();
  check(d.querySelector('#grow-w h4').textContent==='Choose a step',file+': selection survives translation');
  w.location.hash='#grow-g';await new Promise(r=>w.setTimeout(r,0));
  check(!d.querySelector('#grow-g').hidden,file+': hash navigation restores panel');
  check(resources.external.length===0,file+': diagrams need no external dependencies');
  check(errors.length===0,file+': no runtime errors');
  const plain=new JSDOM(fs.readFileSync(file,'utf8'));
  check(plain.window.document.querySelectorAll('[data-grow-panel]:not([hidden])').length===4,file+': all stages readable without JavaScript');plain.window.close();
 }finally{w.close();}
}
const evidence=new JSDOM(fs.readFileSync('dovezi.html','utf8'));
check(evidence.window.document.querySelectorAll('.learn-evidence-limit').length===3,'every company case states its evidence limitations');
check(evidence.window.document.querySelector('#cercetare').textContent.includes('nu înseamnă o îmbunătățire de 59%'),'standardised effect is not presented as a percentage');
evidence.window.close();
console.log('Learning QA: '+count+' assertions passed. Dedicated routes, keyboard interaction, language, no-JS reading and opt-in external media.');
