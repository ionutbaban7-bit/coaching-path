/* Progressive enhancement. Content remains readable without JavaScript. */
(function () {
  'use strict';
  const A = window.ACADEMY;
  if (!A) return;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const lang = () => document.documentElement.lang === 'en' ? 'en' : 'ro';
  const L = p => p[lang()];
  const T = (ro,en) => lang()==='ro'?ro:en;
  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const KEY = 'cp_academy_v3';
  const ids = A.competencies.map(c=>c.id);
  const known = (v, all) => Array.isArray(v) ? [...new Set(v.filter(x=>typeof x==='string'&&all.includes(x)))] : [];
  function readState() {
    let v; try {v=JSON.parse(localStorage.getItem(KEY)||'{}');} catch (_) {v={};}
    if(!v||typeof v!=='object'||Array.isArray(v)) v={};
    const notes={};
    for(const id of ids) if(v.notes&&typeof v.notes[id]==='string') notes[id]=v.notes[id].slice(0,4000);
    return {version:3,notes,done:known(v.done,ids),questions:known(v.questions,A.questions.map(q=>q.id)),resources:known(v.resources,A.resources.map(r=>r.id)),last:ids.includes(v.last)?v.last:'c1'};
  }
  let state=readState();
  let durable=true;
  const drafts={};
  function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));durable=true;return true;}catch(_){durable=false;return false;}}
  function announce(message){const n=$('#toast');if(n){n.textContent=message;n.classList.add('show');setTimeout(()=>n.classList.remove('show'),4000);}}
  function savedMessage(){return durable?T('Salvat pe acest dispozitiv.','Saved on this device.'):T('Browserul nu permite salvarea. Modificările rămân doar în această vizită; poți descărca jurnalul.','Your browser is blocking storage. Changes last only for this visit; you can download the journal.');}
  function toggleSaved(kind,id){const list=state[kind];state[kind]=list.includes(id)?list.filter(x=>x!==id):list.concat(id);persist();if(!durable)announce(savedMessage());}
  function syncSaves(kind,attribute){
    $$('['+attribute+']').forEach(b=>{const saved=state[kind].includes(b.getAttribute(attribute));b.setAttribute('aria-pressed',String(saved));b.textContent=saved?T('Salvată · elimină','Saved · remove'):(kind==='questions'?T('Salvează întrebarea','Save question'):T('Salvează','Save'));});
  }
  function home(){
    const daily=$('#acDailyQuestion');
    if(daily){const i=Math.floor(Date.now()/86400000)%A.questions.length;daily.textContent=L(A.questions[i].text);}
    const box=$('#acHomeProgress');if(!box)return;
    const n=state.done.length;
    let old=0;try{const s=JSON.parse(localStorage.getItem('cp_start_v2')||'{}');if(s&&s.done&&typeof s.done==='object')old=Object.values(s.done).filter(x=>x===true).length;}catch(_){}
    const notes=Object.values(state.notes).some(v=>v.trim());
    box.hidden=!n&&!notes&&!old;
    if(!box.hidden)box.innerHTML='<div><strong>'+T('Bine ai revenit în explorare.','Welcome back to your exploration.')+'</strong><p>'+esc(n+' / 8 '+T('competențe exersate','competencies practised'))+'</p></div><a class="ac-btn" href="'+(n||notes?'invata.html#'+state.last:'incepe.html')+'">'+T('Continuă de unde ai rămas','Continue where you left off')+' ↗</a>';
  }
  function homeSearch(){
    const input=$('#acHomeSearch');if(!input)return()=>{};
    const entries=[
      {title:{ro:'Ce este coachingul și unde se aplică',en:'What coaching is and where it applies'},url:'descopera.html'},
      {title:{ro:'Certificare: ICF, EMCC, ACC, PCC, MCC',en:'Credentials: ICF, EMCC, ACC, PCC, MCC'},url:'certificari.html'},
      {title:{ro:'Școli și programe de formare',en:'Schools and training programmes'},url:'scoli.html'},
      {title:{ro:'Greșeli de început și semnale de alarmă',en:'Beginner mistakes and warning signs'},url:'greseli.html'},
      {title:{ro:'GROW: modelul unei conversații',en:'GROW: a conversation model'},url:'teorie.html#grow'},
      {title:{ro:'Mentor coaching și supervizare',en:'Mentor coaching and supervision'},url:'incepe.html#s7'},
      ...A.competencies.map(c=>({title:c.name,url:'competente.html#'+c.id})),
      ...A.resources.map(r=>({title:{ro:r.title+' · '+r.description.ro,en:r.title+' · '+r.description.en},url:r.url}))
    ];
    function filter(){const needle=normalize(input.value.trim());const box=$('#acHomeResults'),status=$('#acHomeSearchStatus');box.replaceChildren();box.hidden=needle.length<2;if(box.hidden){status.textContent='';return;}const hits=entries.filter(e=>normalize(e.title.ro+' '+e.title.en).includes(needle));status.textContent=hits.length?T(hits.length+' rezultate · afișăm primele '+Math.min(6,hits.length),hits.length+' results · showing '+Math.min(6,hits.length)):T('Niciun rezultat. Încearcă „etică”, „ICF” sau „ascultă”.','No results. Try “ethics”, “ICF” or “listen”.');for(const item of hits.slice(0,6)){const li=document.createElement('li'),a=document.createElement('a');a.href=item.url;a.textContent=L(item.title)+' ↗';li.append(a);box.append(li);}}
    input.addEventListener('input',filter);return filter;
  }
  function competencies(){
    const panels=$$('[data-comp-panel]');if(!panels.length)return;
    const show=(id,focus=false)=>{if(!ids.includes(id))id='c1';panels.forEach(p=>p.hidden=p.id!==id);$$('[data-comp-link]').forEach(a=>{if(a.dataset.compLink===id)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});if(focus){const panel=document.getElementById(id);panel.focus({preventScroll:true});panel.scrollIntoView({block:'start',behavior:'auto'});}};
    show(location.hash.slice(1));
    document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#c"]');if(!a||!ids.includes(a.hash.slice(1)))return;e.preventDefault();if(location.hash!==a.hash)history.pushState(null,'',a.hash);show(a.hash.slice(1),true);});
    window.addEventListener('hashchange',()=>show(location.hash.slice(1)));
    window.addEventListener('popstate',()=>show(location.hash.slice(1)));
  }
  function libraryOrQuestions(prefix,items,selector,kind,attribute){
    const input=$('#'+prefix+'Search');if(!input)return()=>{};
    const type=$('#'+prefix+'Type'), saved=$('#'+prefix+'Saved'), count=$('#'+prefix+'Count');
    const cards=$$(selector);
    function filter(){
      const needle=normalize(input.value.trim());let total=0;
      cards.forEach(card=>{const id=card.getAttribute(kind==='questions'?'data-question':'data-resource');const item=items.find(i=>i.id===id);const searchable=normalize(kind==='questions'?[item.text.ro,item.text.en,item.purpose.ro,item.purpose.en].join(' '):[item.title,item.description.ro,item.description.en].join(' '));const yes=(!needle||searchable.includes(needle))&&(type.value==='all'||item.type===type.value)&&(!saved.checked||state[kind].includes(id));card.hidden=!yes;if(yes)total++;});
      count.textContent=T(total+' din '+items.length+' rezultate',total+' of '+items.length+' results');
      $('#'+prefix+'Empty').hidden=total>0;
      syncSaves(kind,attribute);
    }
    input.addEventListener('input',filter);type.addEventListener('change',filter);saved.addEventListener('change',filter);
    $('#'+prefix+'Reset').addEventListener('click',()=>{input.value='';type.value='all';saved.checked=false;filter();input.focus();});
    document.addEventListener('click',e=>{const b=e.target.closest('['+attribute+']');if(!b)return;toggleSaved(kind,b.getAttribute(attribute));filter();if(saved.checked&&b.closest(selector)?.hidden)saved.focus();});
    filter();return filter;
  }
  function practice(){
    const select=$('#acPracticeSelect');if(!select)return()=>{};
    let current=ids.includes(location.hash.slice(1))?location.hash.slice(1):state.last;
    const note=$('#acReflection'), status=$('#acSaveStatus'), done=$('#acMarkDone');
    function rememberDraft(){drafts[current]=note.value;}
    function journal(){
      const entries=A.competencies.filter(c=>state.done.includes(c.id)||(state.notes[c.id]||'').trim());
      const box=$('#acJournal');box.replaceChildren();
      if(!entries.length){const p=document.createElement('p');p.className='ac-note';p.textContent=T('Încă nu ai însemnări. Începe cu o singură observație.','No entries yet. Start with one observation.');box.append(p);return;}
      for(const c of entries){const article=document.createElement('article');article.className='ac-journal-entry';const h=document.createElement('h3');h.textContent=L(c.name);article.append(h);const meta=document.createElement('span');meta.className='ac-journal-meta';meta.textContent=state.done.includes(c.id)?T('Exercițiu încercat','Exercise tried'):T('Reflecție salvată','Reflection saved');article.append(meta);if(state.notes[c.id]){const p=document.createElement('p');p.textContent=state.notes[c.id];article.append(p);}const a=document.createElement('a');a.className='ac-link';a.href='#'+c.id;a.dataset.journalLink=c.id;a.textContent=T('Revino la exercițiu','Return to exercise');article.append(a);box.append(article);}
    }
    function progress(){const n=state.done.length;$('#acPracticeProgress').textContent=T(n+' din 8 exerciții încercate',n+' of 8 exercises tried');$('#acProgress').value=n;$('#acProgress').setAttribute('aria-label',T('Competențe exersate','Competencies practised'));done.setAttribute('aria-pressed',String(state.done.includes(current)));done.textContent=state.done.includes(current)?T('Exersat ✓ · anulează marcajul','Practised ✓ · undo'):T('Am încercat exercițiul','I tried the exercise');}
    function show(id=current){
      current=ids.includes(id)?id:'c1';select.value=current;const c=A.competencies.find(c=>c.id===current);
      $('#acPracticeContent').innerHTML='<p class="ac-eyebrow">'+T('EXPERIMENTUL TĂU','YOUR EXPERIMENT')+'</p><h2>'+esc(L(c.name))+'</h2><div class="ac-example"><p>'+esc(L(c.practice))+'</p></div><p>'+esc(L(c.reflection))+'</p>';
      note.value=Object.hasOwn(drafts,current)?drafts[current]:state.notes[current]||'';status.textContent=note.value!==(state.notes[current]||'')?T('Modificări nesalvate.','Unsaved changes.'):'';
      progress();journal();
    }
    function navigate(id){rememberDraft();if(!ids.includes(id))return;state.last=id;persist();if(location.hash!=='#'+id)history.pushState(null,'','#'+id);show(id);if(!durable)status.textContent=savedMessage();}
    select.addEventListener('change',()=>navigate(select.value));
    $('#acJournal').addEventListener('click',e=>{const a=e.target.closest('[data-journal-link]');if(!a)return;e.preventDefault();navigate(a.dataset.journalLink);select.focus();select.scrollIntoView({block:'center',behavior:'auto'});});
    window.addEventListener('hashchange',()=>{rememberDraft();show(location.hash.slice(1));});
    window.addEventListener('popstate',()=>{rememberDraft();show(location.hash.slice(1));});
    note.addEventListener('input',()=>{drafts[current]=note.value;status.textContent=T('Modificări nesalvate.','Unsaved changes.');});
    $('#acSaveNote').addEventListener('click',()=>{state.notes[current]=note.value.slice(0,4000);drafts[current]=note.value;state.last=current;persist();status.textContent=savedMessage();journal();});
    done.addEventListener('click',()=>{state.done=state.done.includes(current)?state.done.filter(x=>x!==current):state.done.concat(current);state.last=current;persist();progress();journal();status.textContent=savedMessage()+(note.value!==(state.notes[current]||'')?' '+T('Reflecția are încă modificări nesalvate.','The reflection still has unsaved changes.'):'');});
    $('#acExport').addEventListener('click',()=>{
      const lines=[T('Jurnal de învățare — Coaching Path','Learning journal — Coaching Path'),new Date().toISOString().slice(0,10),''];
      for(const c of A.competencies){const value=Object.hasOwn(drafts,c.id)?drafts[c.id]:state.notes[c.id]||'';if(value.trim()||state.done.includes(c.id))lines.push(L(c.name),state.done.includes(c.id)?T('Exercițiu încercat','Exercise tried'):T('Reflecție','Reflection'),value,'');}
      if(lines.length===3){status.textContent=T('Jurnalul este gol. Scrie o reflecție sau marchează un exercițiu.','The journal is empty. Write a reflection or mark an exercise.');return;}
      const blob=new Blob(['\ufeff'+lines.join('\n')],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='coaching-path-jurnal.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent=T('Descărcarea jurnalului a fost inițiată, inclusiv reflecțiile nesalvate din această vizită.','Journal download started, including unsaved reflections from this visit.');
    });
    $('#acReset').addEventListener('click',()=>{if(!window.confirm(T('Ștergi jurnalul și progresul atelierului de pe acest dispozitiv? Favoritele și traseul ghidat rămân.','Delete the studio journal and progress on this device? Favourites and the guided journey remain.')))return;state.notes={};state.done=[];state.last='c1';Object.keys(drafts).forEach(k=>delete drafts[k]);persist();show(current);status.textContent=durable?T('Jurnalul și progresul atelierului au fost șterse.','Studio journal and progress deleted.'):savedMessage();});
    show();return()=>{rememberDraft();show();};
  }
  function mistakes(){const select=$('#acMistakeType');if(!select)return()=>{};function filter(){let n=0;$$('[data-severity]').forEach(c=>{c.hidden=select.value!=='all'&&select.value!==c.dataset.severity;if(!c.hidden)n++;});$('#acMistakeCount').textContent=T(n+' situații',n+' situations');}select.addEventListener('change',filter);filter();return filter;}
  function boot(){
    home();competencies();const redraw=[homeSearch(),practice(),libraryOrQuestions('acQ',A.questions,'.ac-question','questions','data-save-question'),libraryOrQuestions('acR',A.resources,'.ac-resource','resources','data-save-resource'),mistakes()];
    const rewrite=$('#acShowRewrite');if(rewrite)rewrite.addEventListener('click',()=>{const expanded=rewrite.getAttribute('aria-expanded')==='true';rewrite.setAttribute('aria-expanded',String(!expanded));$('#acRewriteGuide').hidden=expanded;});
    document.addEventListener('clp:lang',()=>{home();redraw.forEach(f=>f());});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
