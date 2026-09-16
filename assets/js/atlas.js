/* Atlas v2 — progressive enhancement. All core content remains in HTML. */
(function(){
 'use strict';
 const $=s=>document.querySelector(s);
 const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d;}catch(e){return d;}};
 const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){/* usable without storage */}};
 const en=()=>document.documentElement.lang==='en';
 const t=(ro,eng)=>en()?eng:ro;
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const routeMap={harta:'incepe.html',home:'certificari.html#home',credentials:'certificari.html#credentials',transitions:'traseul-meu.html#transitions',paths:'traseul-meu.html#paths',journey:'traseul-meu.html#journey',schools:'scoli.html#schools',costs:'certificari.html',faq:'resurse.html#faq',sources:'resurse.html#sources',pages:'invata.html'};
 function fixLinks(){document.querySelectorAll('a[href^="index.html#"],a[href^="#"]').forEach(a=>{const h=a.getAttribute('href');const id=h.slice(h.indexOf('#')+1);if(routeMap[id]&&!document.getElementById(id))a.href=routeMap[id];});}
 function resume(){
 const box=$('#atlasResume');if(!box)return;
 const st=read('cp_start_v2',{}),done=Object.values(st.done||{}).filter(Boolean).length;
 const legacy=read('cp_map_done',[]);
 if(!done&&!legacy.length){box.hidden=true;return;}
 box.hidden=false;let id=st.open||'s1';if(!/^s\d+$/.test(id))id='s1';
 box.innerHTML=`<a href="incepe.html#${id}"><strong>${t('Continuă de unde ai rămas','Pick up where you left off')} ↗</strong><span>${done}/10 ${t('pași în traseul ghidat','guided steps')}${legacy.length?' · '+legacy.length+'/8 '+t('opriri din harta anterioară, păstrate','previous map stops, preserved'):''}</span></a>`;
 }
 function reader(){
 const sections=[...document.querySelectorAll('.doc-sec')],toc=$('#toc');if(!sections.length||!toc)return;
 let all=false;const key='cp_read_'+document.body.dataset.page;
 let selected=sections.findIndex(s=>s.id===location.hash.slice(1));
 if(selected<0)selected=Math.max(0,sections.findIndex(s=>s.id===read(key,'')));
 const bar=document.createElement('div');bar.className='atlas-reader-controls';sections[0].before(bar);
 const bottom=document.createElement('div');bottom.className='atlas-reader-controls';sections.at(-1).after(bottom);
 function draw(move){
 sections.forEach((s,i)=>s.hidden=!all&&i!==selected);
 const words=sections[selected].textContent.trim().split(/\s+/).length;
 bar.innerHTML=`<span class="atlas-reader-count">${t('Capitol','Chapter')} ${selected+1}/${sections.length} · ~${Math.max(1,Math.ceil(words/180))} min</span><button type="button" id="atlasReadAll">${all?t('Citește pe capitole','Read by chapter'):t('Vezi tot documentul','View full document')}</button>`;
 bottom.innerHTML=`<button type="button" id="atlasPrev" ${selected===0?'disabled':''}>← ${t('Anterior','Previous')}</button><span class="atlas-reader-count">${selected+1} / ${sections.length}</span><button type="button" id="atlasNext" ${selected===sections.length-1?'disabled':''}>${t('Următorul','Next')} →</button>`;
 $('#atlasReadAll').onclick=()=>{all=!all;draw(false);};$('#atlasPrev').onclick=()=>go(selected-1);$('#atlasNext').onclick=()=>go(selected+1);
 toc.querySelectorAll('a').forEach(a=>{if(a.hash==='#'+sections[selected].id)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});
 if(move){sections[selected].tabIndex=-1;sections[selected].focus({preventScroll:true});sections[selected].scrollIntoView({block:'start',behavior:'auto'});}
 }
 function go(i){if(i<0||i>=sections.length)return;selected=i;save(key,sections[i].id);history.pushState(null,'','#'+sections[i].id);draw(true);}
 document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const i=sections.findIndex(s=>s.id===a.hash.slice(1));if(i>=0){e.preventDefault();go(i);}},true);
 window.addEventListener('popstate',()=>{const i=sections.findIndex(s=>s.id===location.hash.slice(1));if(i>=0){selected=i;draw(true);}});
 window.addEventListener('hashchange',()=>{const i=sections.findIndex(s=>s.id===location.hash.slice(1));if(i>=0){selected=i;draw(true);}});
 document.addEventListener('clp:lang',()=>draw(false));draw(false);
 }
 function schools(){
 const target=$('#schools');if(!target||typeof SCHOOLS==='undefined')return;
 const oldFilters=$('#schoolFilters');oldFilters.hidden=true;target.querySelector('.table-wrap').hidden=true;
 const box=document.createElement('div');box.id='atlasSchoolBrowser';oldFilters.before(box);
 let query='',system='all',city='all',mode='all',page=0;const chosen=new Set();
 const pageSize=10;
 function filtered(){return SCHOOLS.filter(s=>{
 const text=(s.n+' '+s.city).toLocaleLowerCase();
 return text.includes(query.toLocaleLowerCase())&&(system==='all'||system==='icf'&&s.icf.length||system==='emcc'&&s.emcc.length||system==='anc'&&s.anc)&&(city==='all'||s.city===city)&&(mode==='all'||(mode==='online'?/online/i.test(s.city):!/online/i.test(s.city)));
 });}
 const tags=s=>[...s.icf.map(x=>'ICF '+x),...s.emcc,s.anc?'ANC':''].filter(Boolean);
 function results(){
 const list=filtered();page=Math.max(0,Math.min(page,Math.ceil(list.length/pageSize)-1));
 $('#atlasSchoolCount').textContent=list.length+' '+t('rezultate','results');
 $('#atlasSchoolList').innerHTML=list.slice(page*pageSize,(page+1)*pageSize).map(s=>{const id=SCHOOLS.indexOf(s);return `<article class="atlas-school"><div class="atlas-tags">${tags(s).map(x=>`<span>${escape(x)}</span>`).join('')}</div><h3>${escape(s.n)}</h3><p>${escape(s.city)} · ${s.ro?'RO':'EN'}</p>${s.claim?'<p>'+t('Declarație a furnizorului — verifică acreditarea.','Provider claim — verify accreditation.')+'</p>':''}<a href="${escape(s.url)}" target="_blank" rel="noopener">${t('Vezi programul','View programme')} ↗</a><label><input type="checkbox" data-school="${id}" ${chosen.has(id)?'checked':''}>${t('Compară','Compare')}</label></article>`;}).join('')||`<p>${t('Niciun rezultat. Încearcă alt termen sau resetează filtrele.','No results. Try another term or reset the filters.')}</p>`;
 $('#atlasSchoolPager').innerHTML=`<button type="button" id="schoolPrev" ${page===0?'disabled':''}>← ${t('Anterior','Previous')}</button><span>${page+1} / ${Math.max(1,Math.ceil(list.length/pageSize))}</span><button type="button" id="schoolNext" ${(page+1)*pageSize>=list.length?'disabled':''}>${t('Următorul','Next')} →</button>`;
 $('#schoolPrev').onclick=()=>{page--;results();$('#atlasSchoolCount').scrollIntoView({block:'center'});};$('#schoolNext').onclick=()=>{page++;results();$('#atlasSchoolCount').scrollIntoView({block:'center'});};
 box.querySelectorAll('[data-school]').forEach(input=>input.onchange=()=>{const id=Number(input.dataset.school);if(input.checked&&chosen.size>=3){input.checked=false;$('#atlasSchoolCount').textContent=t('Poți compara maximum 3 școli.','Compare up to 3 schools.');return;}input.checked?chosen.add(id):chosen.delete(id);compare();});compare();
 }
 function compare(){
 const area=$('#atlasSchoolCompare');area.hidden=chosen.size===0;if(!chosen.size)return;
 const rows=[...chosen].map(i=>SCHOOLS[i]);area.innerHTML=`<h3>${t('Comparația ta','Your comparison')}</h3><p>${t('Date orientative. Confirmă acreditarea și disponibilitatea direct cu furnizorul.','Indicative information. Confirm accreditation and availability with the provider.')}</p><table><caption>${t('Maximum trei școli selectate','Up to three selected schools')}</caption><thead><tr><th scope="col">${t('Criteriu','Criterion')}</th>${rows.map(s=>`<th scope="col">${escape(s.n)}</th>`).join('')}</tr></thead><tbody>${[[t('Acreditări declarate','Listed accreditations'),s=>tags(s).join(', ')||'—'],[t('Locație / format declarat','Listed location / format'),s=>s.city],[t('Predare în română','Romanian instruction'),s=>s.ro?t('Da','Yes'):t('Nu este indicată','Not indicated')]].map(([label,fn])=>`<tr><th scope="row">${label}</th>${rows.map(s=>`<td>${escape(fn(s))}</td>`).join('')}</tr>`).join('')}</tbody></table><button type="button" id="clearCompare">${t('Golește selecția','Clear selection')}</button>`;
 $('#clearCompare').onclick=()=>{chosen.clear();results();};
 }
 function draw(){
 const cities=[...new Set(SCHOOLS.map(s=>s.city))].sort();
 box.innerHTML=`<div class="atlas-filter"><label for="atlasSchoolSearch">${t('Caută o școală','Search schools')}</label><input type="search" id="atlasSchoolSearch" value="${escape(query)}" placeholder="${t('Nume, oraș sau program…','Name, city or programme…')}"><label for="atlasSystem">${t('Sistem de certificare','Credential system')}</label><select id="atlasSystem"><option value="all">${t('Toate sistemele','All systems')}</option><option value="icf">ICF</option><option value="emcc">EMCC</option><option value="anc">ANC</option></select><label for="atlasCity">${t('Locație / format declarat','Listed location / format')}</label><select id="atlasCity"><option value="all">${t('Toate locațiile','All locations')}</option>${cities.map(c=>`<option value="${escape(c)}">${escape(c)}</option>`).join('')}</select><label for="atlasMode">${t('Disponibilitate online','Online availability')}</label><select id="atlasMode"><option value="all">${t('Orice format','Any format')}</option><option value="online">${t('Online menționat','Online listed')}</option><option value="other">${t('Online nemenționat','Online not listed')}</option></select><p>${t('Filtrele reflectă informațiile publicate, nu confirmă programul curent.','Filters reflect listed information, not current programme confirmation.')}</p><button type="button" id="resetSchools">${t('Resetează filtrele','Reset filters')}</button></div><p id="atlasSchoolCount" class="atlas-status" role="status" aria-live="polite"></p><div id="atlasSchoolCompare" class="atlas-compare" hidden></div><div id="atlasSchoolList" class="atlas-school-list"></div><div id="atlasSchoolPager" class="atlas-pager atlas-tool"></div>`;
 $('#atlasSystem').value=system;$('#atlasCity').value=city;$('#atlasMode').value=mode;
 $('#atlasSchoolSearch').oninput=e=>{query=e.target.value;page=0;results();};$('#atlasSystem').onchange=e=>{system=e.target.value;page=0;results();};$('#atlasCity').onchange=e=>{city=e.target.value;page=0;results();};$('#atlasMode').onchange=e=>{mode=e.target.value;page=0;results();};$('#resetSchools').onclick=()=>{query='';system=city=mode='all';page=0;draw();};results();
 }
 document.addEventListener('clp:lang',draw);draw();
 }
 function advisor(){
 if(document.body.dataset.page!=='traseul-meu')return;
 const box=document.createElement('section');box.className='wrap';$('.atlas-heading').after(box);
 let current='zero',goal='icf';
 function draw(){
 box.innerHTML=`<div class="atlas-tool"><h2>${t('Construiește-ți direcția','Build your direction')}</h2><label for="advisorCurrent">${t('De unde pornești?','Where are you starting?')}</label><select id="advisorCurrent"><option value="zero">${t('Fără certificare','No credential')}</option><option value="anc">ANC</option><option value="acc">ICF ACC</option><option value="pcc">ICF PCC</option></select><label for="advisorGoal">${t('Ce vrei să explorezi?','What would you like to explore?')}</label><select id="advisorGoal"><option value="icf">ICF</option><option value="emcc">EMCC</option><option value="ro">ANC / România</option></select><p id="advisorResult" role="status"></p><a class="atlas-primary" id="advisorGo" href="#paths"></a></div>`;
 $('#advisorCurrent').value=current;$('#advisorGoal').value=goal;$('#advisorCurrent').onchange=e=>{current=e.target.value;recommend();};$('#advisorGoal').onchange=e=>{goal=e.target.value;recommend();};recommend();
 }
 function recommend(){
 const id=goal==='icf'?{anc:'t-ancacc',acc:'t-accpcc',pcc:'t-pccmcc'}[current]:null;
 const result=id?{anc:t('Explorează tranziția ANC → ACC. Diploma ANC nu echivalează automat cu o acreditare ICF.','Explore ANC → ACC. An ANC qualification does not automatically equal an ICF credential.'),acc:t('Explorează trecerea ACC → PCC, cu cerințele suplimentare de formare și practică.','Explore ACC → PCC and its additional training and practice requirements.'),pcc:t('Explorează trecerea PCC → MCC și verifică cerințele actuale.','Explore PCC → MCC and verify current requirements.')}[current]:t('Consultă pașii sistemului ales. Aceasta este o orientare, nu o confirmare a eligibilității sau a echivalării.','Review your selected system. This is orientation, not confirmation of eligibility or equivalence.');
 $('#advisorResult').textContent=result;$('#advisorGo').textContent=t('Vezi pașii relevanți','View relevant steps')+' ↗';$('#advisorGo').href=id?'#detail-'+id:'#paths';
 $('#advisorGo').onclick=e=>{e.preventDefault();if(id){openTrans(id);}else{currentPath=goal;renderPathTabs();renderStepper();$('#paths').scrollIntoView({block:'start'});} }; 
 }
 document.addEventListener('clp:lang',draw);draw();
 }
 function details(){
 function open(){const id=location.hash.replace('#detail-','');if(!location.hash.startsWith('#detail-')){if($('#atlasDetail'))$('#atlasDetail').hidden=true;return;}
 if(typeof TRANS!=='undefined'&&TRANS.some(x=>x.id===id))openTrans(id);
 else if(typeof CREDS!=='undefined'&&CREDS.some(x=>x.id===id))openCred(id);
 }
 window.addEventListener('hashchange',open);window.addEventListener('popstate',open);document.addEventListener('clp:lang',open);open();
 }
 function feedback(){
 const a=document.createElement('a');a.className='atlas-feedback';a.target='_blank';a.rel='noopener';document.querySelector('main')?.after(a);
 function draw(){a.textContent=t('Ce putem face mai clar? Trimite feedback ↗','What could be clearer? Send feedback ↗');a.href='https://github.com/ionutbaban7-bit/coaching-path/issues/new?title='+encodeURIComponent('Feedback: '+document.title)+'&body='+encodeURIComponent(t('Pagina: ','Page: ')+location.pathname+'\n\n'+t('Ce am încercat să fac:\n\nCe nu a fost clar:\n\nNu include date personale. Revizuiește textul înainte de publicare.','What I was trying to do:\n\nWhat was unclear:\n\nDo not include personal data. Review before posting.'));a.title=t('Deschide o ciornă pe GitHub. Necesită cont. Nimic nu se trimite automat.','Opens a GitHub draft. Account required. Nothing is sent automatically.');}
  draw();document.addEventListener('clp:lang',draw);
 }
 function journey(){
 const steps=$('#startSteps');if(!steps)return;
 const nav=document.createElement('nav');nav.className='atlas-journey';steps.before(nav);
 function draw(){
 nav.setAttribute('aria-label',t('Harta celor 10 pași','Map of the 10 steps'));
 nav.innerHTML=[...steps.querySelectorAll('.start-step')].map((step,i)=>{const title=step.querySelector('.sst b')?.textContent||'';return `<a href="#s${i+1}" ${step.classList.contains('open')?'aria-current="step"':''} class="${step.classList.contains('done')?'done':''}"><span>${step.classList.contains('done')?'✓':String(i+1).padStart(2,'0')}</span><b>${escape(title)}</b></a>`;}).join('');
 }
 new MutationObserver(draw).observe(steps,{childList:true});draw();
 }
 function boot(){
 if(document.body.dataset.page==='index'&&routeMap[location.hash.slice(1)]){location.replace(routeMap[location.hash.slice(1)]);return;}
 resume();reader();schools();advisor();details();feedback();journey();fixLinks();
 document.addEventListener('clp:lang',()=>{resume();fixLinks();});document.addEventListener('clp:progress',resume);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
