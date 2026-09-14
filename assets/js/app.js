/* ---------- STOCARE SIGURĂ ----------
   Aplicația e gândită să funcționeze și deschisă direct din fișier
   (file://) sau în modul privat, unde localStorage poate fi blocat.
   Toate accesările trec prin wrapperul de mai jos: dacă stocarea nu e
   disponibilă, aplicația funcționează mai departe, fără salvare. */
const LS = {
  get(k, dflt){
    try{ var v = localStorage.getItem(k); return (v === null || v === undefined) ? dflt : v; }
    catch(e){ return dflt; }
  },
  set(k, v){ try{ localStorage.setItem(k, v); return true; }catch(e){ return false; } },
  json(k, dflt){
    try{ var v = localStorage.getItem(k); return v ? JSON.parse(v) : dflt; }
    catch(e){ return dflt; }
  }
};

let lang = LS.get('cp_lang', 'ro');
let currentPath = 'icf';
let credFilter = 'all';
let schoolFilter = 'all';
const progress = LS.json('cp_progress', {});
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const L = v => (v==null?'':(typeof v==='string'?v:(v[lang]||v.ro||'')));
const KV_TR = {
 "60–124 ore":"60–124 hrs","125–175 ore":"125–175 hrs","+75 ore":"+75 hrs",
 "Ore formare":"Training hrs","Practică ghidată":"Guided practice","inclusă":"included",
 "10 h incluse în programele bune":"10 hrs included in good programs","Ore clienți":"Client hours",
 "100 (minim 75 plătite)":"100 (75 paid min.)","Clienți diferiți":"Different clients","minim 8":"min. 8",
 "10 h (≥3 h 1-la-1, grup max. 10)":"10 hrs (≥3 one-to-one, group max. 10)","Recență":"Recency",
 "≥25 ore în ultimele 18 luni":"≥25 hrs in the last 18 months","Examen ACC":"ACC exam",
 "60 întrebări · 90 min · notă de trecere 460/600":"60 questions · 90 min · passing score 460/600","Evaluare":"Assessment",
 "1 sesiune observată (în program) sau 1 înregistrare + transcript (portfolio)":"1 observed session (in-program) or 1 recording + transcript (portfolio)",
 "Taxă":"Fee","$175 membru / $325 nemembru · portfolio $475/$625":"$175 member / $325 non-member · portfolio $475/$625",
 "500 (450 plătite, 25 clienți)":"500 (450 paid, 25 clients)","Formare":"Training",
 "125 h total (program de completare Level 2)":"125 hrs total (Level 2 top-up)","10 h NOI la nivel PCC":"10 NEW hrs at PCC level",
 "2 sesiuni înregistrate + transcrieri":"2 recorded sessions + transcripts","Condiție":"Prerequisite",
 "să deții / să fi deținut PCC":"you hold or have held PCC","2.500 (2.250 plătite, 35 clienți)":"2,500 (2,250 paid, 35 clients)",
 "200 h (Level 3 = +75 h)":"200 hrs (Level 3 = +75 hrs)","Mentor":"Mentor",
 "10 h cu un MCC + 2 înregistrări, examen":"10 hrs with an MCC + 2 recordings, exam","CCE totale":"Total CCE",
 "40 (minim 24 pe competențe, din care 3 de etică)":"40 (min. 24 core, incl. 3 ethics)",
 "+ 10 h mentor coaching la fiecare reînnoire":"+ 10 mentor coaching hrs each renewal",
 "mentoratul e recomandat, nu obligatoriu":"mentoring recommended, not required","Grație":"Grace period",
 "2 luni după expirare":"2 months after expiry","EQA = acreditarea programului":"EQA = program accreditation",
 "nivel Foundation / Practitioner / SP / MP":"Foundation / Practitioner / SP / MP level","Rulare rapidă":"Fast track",
 "aplici EIA prin furnizor":"apply for EIA via the provider","Alternativă":"Alternative",
 "aplicare directă cu portofoliu (RPL)":"direct application with portfolio (RPL)","Clienți":"Clients",
 "16 h/an":"16 hrs/yr","Supervizare":"Supervision","1 h/trimestru (individuală)":"1 hr/quarter (one-to-one)",
 "1 h/trimestru":"1 hr/quarter","32 h/an":"32 hrs/yr","1 h la 35 ore practică (minim trimestrial)":"1 hr per 35 practice hrs (at least quarterly)",
 "48 h/an":"48 hrs/yr","Obligatoriu":"Mandatory","dialog profesional + contribuție la profesie":"professional dialogue + contribution to the profession",
 "EIA SP + program ESQA + 120 h supervizare (10 supervisați)":"EIA SP + ESQA program + 120 supervision hrs (10 supervisees)",
 "programe TCQA; niveluri Foundation→Master":"TCQA programs; Foundation→Master levels","Reînnoire EIA":"EIA renewal",
 "la 5 ani: practică + CPD + supervizare":"every 5 yrs: practice + CPD + supervision","Studii":"Education",
 "superioare cu diplomă de licență":"university degree (bachelor's)","Experiență":"Experience",
 "minim 3 ani muncă/voluntariat (standard)":"min. 3 yrs work/volunteering (standard)","Acte":"Documents",
 "CI, certificat naștere/căsătorie, diplomă":"ID, birth/marriage certificate, diploma","Autorizație":"Authorisation",
 "eliberată de comisia județeană pe 4 ani":"issued by the county commission for 4 years","Verificare":"Verification",
 "cere seria/numărul autorizației și ocupația 242412":"ask for authorisation series/number and occupation 242412",
 "Formă":"Format","fizic sau online (ambele autorizabile)":"in-person or online (both authorisable)",
 "Teorie + practică":"Theory + practice","prezență ridicată (ex. minim 90%)":"high attendance (e.g. min. 90%)","Practică":"Practice",
 "minim 5 sesiuni cu persoane din afara grupului (la majoritatea programelor)":"min. 5 sessions with people outside the group (most programs)",
 "Pregătire pedagogică":"Pedagogical qualification","formatori cu certificat de Formator (242401)":"trainers holding Trainer certificate (242401)",
 "Proba teoretică":"Theory test","test grilă":"multiple-choice test","Proba practică":"Practical test",
 "sesiune demonstrativă / proiect evaluat":"demo session / assessed project","Comisia":"Commission",
 "președinte + specialist independent + secretar furnizor":"chair + independent specialist + provider secretary",
 "Certificat de absolvire + supliment descriptiv (model Europass)":"Completion certificate + descriptive supplement (Europass)",
 "Credite":"Credits","12 ECTS la multe programe":"12 ECTS on many programs","Recunoaștere":"Recognition",
 "națională + UE (apostilă/supliment)":"national + EU (apostille/supplement)","Valabilitate":"Validity",
 "nelimitată, fără reînnoire":"unlimited, no renewal","Rută":"Route",
 "trebuie demonstrate pe competențele ICF/EMCC":"must be demonstrated against ICF/EMCC competencies","Recomandat":"Recommended",
 "program de integrare/RPL la școală acreditată":"RPL integration program at an accredited school"
};
const kvt = s => lang==='en' ? (KV_TR[s]||s) : s;
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const orgMeta = k => ORGS.find(o=>o.k===k);

const I18N = {
 updated:{ro:"Actualizat la 14 septembrie 2026 · surse oficiale verificate",en:"Updated September 14, 2026 · verified official sources"},
 heroTitle:{ro:"Harta ta clară spre certificarea de coaching",en:"Your clear map to coaching certification"},
 heroLead:{ro:"Toate certificările, cerințele și evaluările ICF, EMCC și ANC România într-un singur loc: learning pathuri interactive, treceri între sisteme (ANC → ICF, ACC → PCC, PCC → MCC), școli acreditate și verificator de recenzii.",en:"Every ICF, EMCC and Romanian ANC certification, requirement and assessment in one place: interactive learning paths, bridges between systems (ANC → ICF, ACC → PCC, PCC → MCC), accredited schools and a review checker."},
 ctaPath:{ro:"▶ Începe learning path-ul",en:"▶ Start the learning path"},
 ctaTrans:{ro:"🔀 Am deja o certificare",en:"🔀 I already have a credential"},
 qZero:{ro:"Sunt la început — nu am nicio certificare",en:"I'm starting out — no credential yet"},
 qAnc:{ro:"Am certificare ANC (COR 242412) și vreau ICF/EMCC",en:"I have ANC (COR 242412) and want ICF/EMCC"},
 qAcc:{ro:"Sunt ACC și vreau PCC",en:"I'm ACC and want PCC"},
 qPcc:{ro:"Sunt PCC și vreau MCC / supervizare / mentorat",en:"I'm PCC and want MCC / supervision / mentoring"},
 qSchools:{ro:"Caut o școală bună în România",en:"I'm looking for a good school in Romania"},
 systemsK:{ro:"Cele 3 sisteme",en:"The 3 systems"},
 systemsT:{ro:"Trei „lumi” ale certificării — nu le confunda",en:"Three certification 'worlds' — don't mix them up"},
 systemsS:{ro:"ICF și EMCC sunt organisme profesionale internaționale (certificare voluntară, prestigiu). ANC/MMSS este sistemul național românesc (recunoaștere legală a ocupației). Mulți coachi serioși le combină.",en:"ICF and EMCC are international professional bodies (voluntary, prestige certification). ANC/MLSS is the Romanian national system (legal recognition of the occupation). Many serious coaches combine them."},
 newsK:{ro:"Noutăți critice",en:"Critical updates"},
 newsT:{ro:"Ce s-a schimbat în 2026 și ce se schimbă în 2027",en:"What changed in 2026 and what changes in 2027"},
 pathsT:{ro:"Parcursuri pas cu pas",en:"Step-by-step learning paths"},
 pathsS:{ro:"Click pe orice etapă pentru cerințe, tipul evaluării, costuri și recomandări. Bifează pașii parcurși — progresul se salvează pe acest dispozitiv.",en:"Click any step for requirements, assessment type, costs and recommendations. Tick completed steps — progress is saved on this device."},
 transT:{ro:"Trecerea între certificări — exact ce îți lipsește",en:"Bridges between credentials — exactly what you're missing"},
 transS:{ro:"Ai deja ceva formare? Aici vezi diferența exactă de ore, evaluări și documente între unde ești și unde vrei să ajungi.",en:"Already trained? Here is the exact gap in hours, assessments and documents between where you are and where you're going."},
 credT:{ro:"Toate tipurile de certificări, pe rând",en:"Every certification type, one by one"},
 credS:{ro:"Coach, mentor coach, supervizor, team coach, formator — fiecare cu cerințele, evaluarea și valabilitatea ei. Click pe o carte pentru detalii complete.",en:"Coach, mentor coach, supervisor, team coach, trainer — each with its own requirements, assessment and validity. Click a card for full details."},
 schoolT:{ro:"Școli de coaching din România",en:"Coaching schools in Romania"},
 schoolS:{ro:"Bazat pe lista oficială ICF România (programe prezente și în directorul global ICF Education Search), plus furnizori ANC și școli relevante. Stelele Google se verifică live, pentru fiecare școală în parte.",en:"Based on the official ICF Romania list (programs also present in the global ICF Education Search directory), plus ANC providers and relevant schools. Google stars are checked live, per school."},
 searchSchool:{ro:"🔎 Caută o școală…",en:"🔎 Search a school…"},
 journeyT:{ro:"Cum arată, concret, parcursul unui coach",en:"What a coach's journey actually looks like"},
 journeyS:{ro:"Exemplu realist (persoană cu job full-time, care începe de la zero și țintește PCC). Datele sunt orientative — fiecare ritm e diferit.",en:"Realistic example (full-time job, starting from zero, aiming at PCC). Indicative — everyone's pace differs."},
 costT:{ro:"Cât costă și cât durează, pe șleau",en:"Costs and timelines, plainly"},
 costS:{ro:"Costuri orientative pentru România (septembrie 2026). Taxele oficiale ICF sunt în USD și se plătesc direct federației; restul variază mult în funcție de școală.",en:"Indicative costs for Romania (September 2026). Official ICF fees are in USD paid directly to the federation; everything else varies widely by school."},
 faqT:{ro:"Întrebări frecvente și termeni esențiali",en:"FAQ and essential terminology"},
 searchGloss:{ro:"🔎 Caută un termen…",en:"🔎 Search a term…"},
 srcT:{ro:"Surse și cum verifici tu însuți orice afirmație",en:"Sources and how to verify any claim yourself"},
 srcS:{ro:"Regula de aur: nu te baza pe logo-urile de pe site-uri. Verifică fiecare program în bazele de date oficiale de mai jos.",en:"Golden rule: don't rely on website logos. Verify every program in the official databases below."},
 foot1:{ro:"instrument educațional independent, bilingv RO/EN.",en:"independent bilingual RO/EN educational tool."},
 foot2:{ro:"Asamblat manual pe 14 septembrie 2026 din surse oficiale și publice. Nu este afiliat ICF, EMCC, ANC sau vreunei școli de coaching. Nu înlocuiește consultarea surselor oficiale; regulile se pot schimba oricând.",en:"Hand-assembled on September 14, 2026 from official and public sources. Not affiliated with ICF, EMCC, ANC or any coaching school. It doesn't replace checking official sources; rules may change anytime."}
};

function applyI18n(){
 document.documentElement.lang = lang;
 $('#langLabel').textContent = UI[lang].lang;
 $$('[data-i18n]').forEach(e=>{ const k=e.getAttribute('data-i18n'); if(I18N[k]) e.textContent=L(I18N[k]); });
 $$('[data-i18n-ph]').forEach(e=>{ const k=e.getAttribute('data-i18n-ph'); if(I18N[k]) e.placeholder=L(I18N[k]); });
}

function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2200); }

/* ====================== NAV ====================== */
function renderNav(){
 // nav-ul complet (secțiuni + pagini + scroll-spy) e randat de site.js
 if(window.CLP && typeof window.CLP.renderNav === 'function'){ window.CLP.renderNav(); return; }
 $('#navlinks').innerHTML = UI[lang].nav.map(([id,label])=>`<a href="#${id}">${label}</a>`).join('');
}

/* ====================== ORGS ====================== */
function renderOrgs(){
 $('#orgCards').innerHTML = ORGS.map(o=>`
  <div class="org-card" style="--oc:${o.color}">
    <div style="display:flex;gap:12px;align-items:center">
      <div class="org-ic" style="background:${o.bg};color:${o.color}">${o.abbr}</div>
      <div><h3 style="font-size:15.5px">${L(o.name)}</h3></div>
    </div>
    <p style="font-size:13px;color:var(--muted)">${L(o.desc)}</p>
    <ul>${o.pts[lang].map(p=>`<li><b style="color:var(--ink)">${p[0]}:</b> ${p[1]}</li>`).join('')}</ul>
    <a class="btn-mini" style="margin-top:auto" href="${o.url}" target="_blank" rel="noopener">${o.abbr} official ↗</a>
  </div>`).join('');
}

/* ====================== NEWS ====================== */
function renderNews(){
 $('#newsGrid').innerHTML = NEWS.map(n=>`
  <div class="news-card ${n.cls}">
    <div class="n-date">${L(n.date)}</div>
    <h4>${L(n.t)}</h4><p>${L(n.d)}</p>
  </div>`).join('');
}

/* ====================== PATHS ====================== */
function renderPathTabs(){
 const meta={icf:['ICF','var(--icf)'],emcc:['EMCC','var(--emcc)'],ro:['ANC RO','var(--anc)']};
 $('#pathTabs').innerHTML = Object.keys(PATHS).map(k=>`
  <button class="tab ${k===currentPath?'active':''}" data-tab="${k}">
    <span class="dot-t" style="background:${meta[k][1]}"></span>${meta[k][0]} · ${UI[lang].paths[k]}
  </button>`).join('');
 $$('#pathTabs .tab').forEach(b=>b.onclick=()=>{currentPath=b.dataset.tab;renderPathTabs();renderStepper();});
}
function renderStepper(){
 const p = PATHS[currentPath];
 const key = 'path_'+currentPath;
 const done = progress[key]||[];
 $('#stepper').innerHTML = p.steps.map((s,i)=>`
  <li class="step ${done.includes(s.id)?'done':''}" data-step="${s.id}">
    <div class="step-head">
      <span class="step-num">${done.includes(s.id)?'✓':i+1}</span>
      <span class="step-title"><b>${L(s.t)}</b><span>${L(s.s)}</span></span>
      <label class="step-check" title="${lang==='ro'?'Marchează gata':'Mark done'}"><input type="checkbox" ${done.includes(s.id)?'checked':''}></label>
      <svg class="chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
    </div>
    <div class="step-body">
      <div class="kv">${s.kv.map(([k,v])=>`<div class="kv-item"><div class="k">${kvt(k)}</div><div class="v">${kvt(v)}</div></div>`).join('')}</div>
      <ul>${s.b[lang].map(x=>`<li>${x}</li>`).join('')}</ul>
      ${s.tip?`<div class="rec"><b>💡 ${lang==='ro'?'Recomandare':'Tip'}:</b> ${L(s.tip)}</div>`:''}
      ${s.cred?`<button class="btn-mini" data-cred="${s.cred}">📋 ${UI[lang].learn} →</button>`:''}
    </div>
  </li>`).join('');
 updateBar();
 $$('#stepper .step-head').forEach(h=>{
   h.onclick=(ev)=>{
     if(ev.target.tagName==='INPUT') return;
     h.parentElement.classList.toggle('open');
   };
 });
 $$('#stepper input[type=checkbox]').forEach(c=>c.onchange=ev=>{
   ev.stopPropagation();
   const li=c.closest('.step'), id=li.dataset.step;
   const d=progress[key]||[];
   if(c.checked){ if(!d.includes(id))d.push(id);} else { const i=d.indexOf(id); if(i>-1)d.splice(i,1);}
   progress[key]=d; LS.set('cp_progress',JSON.stringify(progress));
   renderStepper();
 });
 $$('#stepper [data-cred]').forEach(b=>b.onclick=()=>openCred(b.dataset.cred));
}
function updateBar(){
 const p=PATHS[currentPath], d=progress['path_'+currentPath]||[];
 const pct=Math.round(d.length/p.steps.length*100);
 $('#pbarFill').style.width=pct+'%';
 $('#pbarLabel').textContent=`${d.length}/${p.steps.length} ${UI[lang].steps} · ${pct}%`;
}

/* ====================== TRANSITIONS ====================== */
const TRANS_FLOW = {
 't-ancacc':{ro:['ANC 242412','ICF ACC'],en:['ANC 242412','ICF ACC'],c:['var(--anc-soft)|var(--anc)','var(--icf-soft)|var(--icf)']},
 't-accpcc':{ro:['ACC','PCC'],en:['ACC','PCC'],c:['var(--icf-soft)|var(--icf)','var(--icf-soft)|var(--icf)']},
 't-pccmcc':{ro:['PCC','MCC'],en:['PCC','MCC'],c:['var(--icf-soft)|var(--icf)','var(--icf-soft)|var(--icf)']},
 't-icfemcc':{ro:['ICF','EMCC ↔'],en:['ICF','EMCC ↔'],c:['var(--icf-soft)|var(--icf)','var(--emcc-soft)|var(--emcc)']},
 't-mentor':{ro:['Coach certificat','MCS — mentor coach'],en:['Certified coach','MCS — mentor coach'],c:['var(--icf-soft)|var(--icf)','var(--icf-soft)|var(--icf)']},
 't-super':{ro:['EIA Senior Practitioner','ESIA — supervizor'],en:['EIA Senior Practitioner','ESIA — supervisor'],c:['var(--emcc-soft)|var(--emcc)','var(--emcc-soft)|var(--emcc)']},
 't-team':{ro:['Coach individual','ACTC / ITCA'],en:['Individual coach','ACTC / ITCA'],c:['var(--icf-soft)|var(--icf)','var(--emcc-soft)|var(--emcc)']},
 't-trainer':{ro:['Expert în domeniu','Formator 242401'],en:['Domain expert','Trainer 242401'],c:['var(--anc-soft)|var(--anc)','var(--anc-soft)|var(--anc)']}
};
function renderTransitions(){
 $('#transGrid').innerHTML = TRANS.map(tr=>{
   const f=TRANS_FLOW[tr.id];
   const chips=f[lang].map((t,i)=>{const [bg,col]=f.c[i].split('|');return `<span class="chip-node" style="background:${bg};color:${col}">${t}</span>`;}).join('<span class="arrow">→</span>');
   return `<div class="trans-card" data-trans="${tr.id}">
     <div class="trans-flow">${chips}</div>
     <h3>${L(tr.t)}</h3><p>${L(tr.short)}</p>
   </div>`;
 }).join('');
 $$('#transGrid .trans-card').forEach(c=>c.onclick=()=>openTrans(c.dataset.trans));
}
function openTrans(id){
 const tr=TRANS.find(x=>x.id===id), o=orgMeta(tr.org);
 const li=arr=>arr[lang].map(x=>`<li>${x}</li>`).join('');
 modal(`
  <span class="tag tag-${o.k}" style="align-self:center">${o.abbr}</span>
  <div style="flex:1"><h3>${L(tr.t)}</h3><div class="cc-en" style="margin-top:2px">${L(tr.short)}</div></div>`,
  `<h4 class="sblock">✅ ${lang==='ro'?'Ce ai deja':'What you already have'}</h4><ul>${li(tr.have)}</ul>
   <h4 class="sblock">🎯 ${lang==='ro'?'Ce îți lipsește exact':'Exactly what you still need'}</h4><ul>${li(tr.need)}</ul>
   <h4 class="sblock">🛣️ ${lang==='ro'?'Rute posibile':'Possible routes'}</h4><ul>${li(tr.routes)}</ul>
   <div class="rec"><b>💡 ${lang==='ro'?'Recomandare':'Recommendation'}:</b> ${L(tr.tip)}</div>
   <h4 class="sblock">🔗 ${UI[lang].sources}</h4>
   <div class="src-links">${tr.src.map(([l,u])=>`<a href="${u}" target="_blank" rel="noopener">${l} ↗</a>`).join('')}</div>`);
}

/* ====================== CREDENTIALS ====================== */
function renderCredFilters(){
 const f=UI[lang].filters;
 const chips=[['all',f.all],['icf','ICF'],['emcc','EMCC'],['anc','ANC'],['coach',f.coach],['mentor',f.mentor],['team',f.team],['trainer',f.trainer]];
 const prevVal=$('#credSearch')?.value||'';
 $('#credFilters').innerHTML =
  `<input class="search" id="credSearch" placeholder="${lang==='ro'?'🔎 ACC, PCC, EIA, COR…':'🔎 Search ACC, PCC, EIA, COR…'}">`+
  chips.map(([k,v])=>`<button class="fchip ${k===credFilter?'active':''}" data-cf="${k}">${v}</button>`).join('');
 $('#credSearch').value=prevVal;
 $$('#credFilters [data-cf]').forEach(b=>b.onclick=()=>{credFilter=b.dataset.cf;renderCredFilters();renderCreds();});
 $('#credSearch').oninput=renderCreds;
}
function credVisible(c,q){
 if(credFilter==='icf'&&c.org!=='icf')return false;
 if(credFilter==='emcc'&&c.org!=='emcc')return false;
 if(credFilter==='anc'&&c.org!=='anc')return false;
 if(['coach','mentor','team','trainer'].includes(credFilter)&&c.grp!==credFilter)return false;
 if(q && !(L(c.name)+' '+c.badge+' '+L(c.short)).toLowerCase().includes(q.toLowerCase()))return false;
 return true;
}
function renderCreds(){
 const q=$('#credSearch')?.value.trim()||'';
 $('#credGrid').innerHTML = CREDS.filter(c=>credVisible(c,q)).map(c=>{
   const o=orgMeta(c.org);
   return `<div class="cred-card" data-cred="${c.id}">
     <div class="cc-top">
       <div class="cc-ic" style="background:${o.bg};color:${o.color}">${c.badge}</div>
       <div><h3>${L(c.name)}</h3></div>
     </div>
     <p>${L(c.short)}</p>
     <div class="cred-meta">${c.stats.map(s=>`<span class="mini-stat">${s.v} · ${L(s.l)}</span>`).join('')}</div>
   </div>`;
 }).join('');
 $$('#credGrid .cred-card').forEach(c=>c.onclick=()=>openCred(c.dataset.cred));
}
function openCred(id){
 const c=CREDS.find(x=>x.id===id), o=orgMeta(c.org);
 modal(`
  <div class="cc-ic" style="background:${o.bg};color:${o.color};width:44px;height:44px;border-radius:11px;display:grid;place-items:center;font-weight:900;flex:none">${c.badge}</div>
  <div style="flex:1"><h3>${L(c.name)}</h3><div style="margin-top:3px"><span class="tag tag-${o.k}">${o.abbr}</span></div></div>`,
  `<p style="margin-bottom:12px">${L(c.short)}</p>
   <h4 class="sblock">📊 ${UI[lang].reqs}</h4>
   <div class="reqgrid">${c.stats.map(s=>`<div class="reqcell"><div class="big">${s.v}</div><div class="lbl">${L(s.l)}</div></div>`).join('')}</div>
   <h4 class="sblock">🔑 ${UI[lang].prereq}</h4><p>${L(c.prereq)}</p>
   <h4 class="sblock">🧐 ${UI[lang].eval}</h4><ul>${c.eval.map(e=>`<li>${L(e)}</li>`).join('')}</ul>
   <h4 class="sblock">📂 ${UI[lang].docs}</h4><ul>${c.docs.map(e=>`<li>${L(e)}</li>`).join('')}</ul>
   <div class="kv" style="grid-template-columns:1fr">
     <div class="kv-item"><div class="k">💰 ${UI[lang].fees}</div><div class="v" style="font-weight:600;font-size:13px">${L(c.fees)}</div></div>
     <div class="kv-item"><div class="k">⏱️ ${lang==='ro'?'Durată':'Duration'}</div><div class="v" style="font-weight:600;font-size:13px">${L(c.time)}</div></div>
     <div class="kv-item"><div class="k">🔄 ${UI[lang].renew}</div><div class="v" style="font-weight:600;font-size:13px">${L(c.renew)}</div></div>
   </div>
   <div class="rec"><b>💡 ${lang==='ro'?'Recomandare':'Tip'}:</b> ${L(c.tips)}</div>
   <h4 class="sblock">🔗 ${UI[lang].sources}</h4>
   <div class="src-links">${c.src.map(([l,u])=>`<a href="${u}" target="_blank" rel="noopener">${l} ↗</a>`).join('')}</div>`);
}

/* ====================== SCHOOLS ====================== */
function renderSchoolFilters(){
 const sf=UI[lang].sf;
 const chips=[['all',sf.all],['icf',sf.icf],['emcc',sf.emcc],['anc',sf.anc],['ro',sf.ro],['claim',sf.claim]];
 $('#schoolFilters').querySelectorAll('#sfChips').forEach(n=>n.remove());
 const wrap=document.createElement('span');
 wrap.id='sfChips';
 wrap.style.display='contents';
 wrap.innerHTML=chips.map(([k,v])=>`<button class="fchip ${k===schoolFilter?'active':''}" data-sf="${k}" style="white-space:nowrap">${v}</button>`).join('');
 $('#schoolFilters').appendChild(wrap);
 $$('#schoolFilters [data-sf]').forEach(b=>b.onclick=()=>{schoolFilter=b.dataset.sf;renderSchoolFilters();renderSchools();});
 $('#schoolSearch').oninput=renderSchools;
}
function schoolVisible(s,q){
 if(schoolFilter==='icf'&&!s.icf.length)return false;
 if(schoolFilter==='emcc'&&!s.emcc.length)return false;
 if(schoolFilter==='anc'&&!s.anc)return false;
 if(schoolFilter==='ro'&&!s.ro)return false;
 if(schoolFilter==='claim'&&!s.claim)return false;
 if(q && !(s.n+' '+s.sub+' '+s.city).toLowerCase().includes(q.toLowerCase()))return false;
 return true;
}
function renderSchools(){
 const cols=UI[lang].schoolCols;
 $('#schoolHead').innerHTML=`<tr style="box-shadow:none">${cols.map(c=>`<th style="font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);padding:6px 14px">${c}</th>`).join('')}</tr>`;
 const q=$('#schoolSearch').value.trim();
 const rows=SCHOOLS.filter(s=>schoolVisible(s,q));
 $('#schoolRows').innerHTML=rows.map(s=>{
   const icfBadges=s.icf.map(b=>`<span class="badge b-icf">ICF ${b}</span>`).join('');
   const emccBadges=s.emcc.map(b=>`<span class="badge b-emcc">${b}</span>`).join('');
   const ancBadge=s.anc?'<span class="badge b-anc">ANC 242412</span>':'<span class="badge b-non">ANC</span>';
   const claim=s.claim?'<br><span class="tag tag-amber" style="margin-top:5px">⚠ '+(lang==='ro'?'conform site-ului propriu — verifică':'per own site — verify')+'</span>':'';
   const langCell=`<span class="tag ${s.ro?'tag-ok':'tag-gray'}">${s.ro?'🇷🇴 RO':'🌐 EN'}</span><br><span style="font-size:11.5px;color:var(--muted)">${esc(s.city)}</span>`;
   const sig=s.sig?`<div style="font-size:11.3px;color:var(--muted);margin:5px 0">${L(s.sig)}</div>`:'';
   return `<tr class="school-row">
     <td style="min-width:210px"><a href="${s.url}" target="_blank" rel="noopener" style="color:var(--ink)">${esc(s.n)}</a><span class="sub">${esc(s.sub)}</span>${claim}</td>
     <td style="min-width:180px">${icfBadges}${emccBadges}${ancBadge}<div style="margin-top:5px"></div></td>
     <td style="min-width:130px">${langCell}</td>
     <td style="min-width:210px">${sig}
       <div class="school-verified">
         🛡️ ${(lang==='ro'?'Verificat la ':'Verified on ')}${(window.CRED?CRED.verifiedRo:'14 septembrie 2026')}${s.claim?(lang==='ro'?' · ⚠ declarație proprie':' · ⚠ self-declared'):''}
       </div>
       <div style="display:flex;gap:6px;flex-wrap:wrap">
         <a class="star-btn" href="${gmap(s.q)}" target="_blank" rel="noopener">⭐ ${lang_ro()}</a>
         <a class="btn-mini" style="margin-top:0" href="${s.url}" target="_blank" rel="noopener">www ↗</a>
       </div>
       <div style="margin-top:6px">${window.CRED?CRED.verificationLinks(s):''}</div></td>
   </tr>`;
 }).join('') || `<tr><td style="padding:20px;color:var(--muted)">${lang==='ro'?'Niciun rezultat — resetează filtrele.':'No results — reset filters.'}</td></tr>`;
 $('#schoolsNote').innerHTML = (lang==='ro'
  ?'Lista provine din secțiunea oficială „Cum devii coach profesionist” a ICF România (programe cu predare în limba română sau cu prezență locală), completată cu furnizori ANC. <b>Stelele Google se schimbă săptămânal</b> — butonul ⭐ deschide Google Maps cu ratingul și recenziile la zi. Verifică fiecare program ICF în <a href="'+ESS+'" target="_blank">directorul ESS</a>, iar statutul ANC în autorizația furnizorului.'
  :'The list comes from ICF Romania\'s official "How to become a professional coach" section (programs taught in Romanian or with local presence), plus ANC providers. <b>Google stars change weekly</b> — the ⭐ button opens Google Maps with today\'s rating and reviews. Verify each ICF program in the <a href="'+ESS+'" target="_blank">ESS directory</a>, and ANC status in the provider\'s authorisation.');
}
function lang_ro(){ return lang==='ro'?'Google recenzii':'Google reviews'; }

/* ====================== JOURNEY ====================== */
function renderJourney(){
 $('#journeyRows').innerHTML=JOURNEY.map(j=>`
  <div class="jrow"><div class="jwhen">${L(j.w)}</div>
   <div class="jwhat"><h4>${L(j.t)}</h4><p>${L(j.d)}</p></div></div>`).join('');
}

/* ====================== COSTS ====================== */
function renderCosts(){
 $('#costTable').innerHTML=
  `<tr>${UI[lang].tableHead.map(h=>`<th>${h}</th>`).join('')}</tr>`+
  COSTS.map(r=>`<tr><td><b>${L(r.a)}</b></td><td>${r.c}</td><td>${L(r.d)}</td><td style="color:var(--muted)">${L(r.n)}</td></tr>`).join('');
 $('#costNote').innerHTML = lang==='ro'
  ? '<b>Important:</b> prețurile școlilor sunt orientative (septembrie 2026) și se schimbă des; cere mereu oferta scrisă și clarifică dacă taxa include mentor coaching-ul, evaluarea și (unde există) certificatul ANC. Taxele ICF în USD nu includ cotizația de membru; membri ICF plătesc taxe de aplicare mai mici.'
  : '<b>Important:</b> school prices are indicative (September 2026) and change often; always ask for a written quote clarifying whether the fee includes mentor coaching, evaluation and (where applicable) the ANC certificate. USD ICF fees exclude membership dues; ICF members pay lower application fees.';
}

/* ====================== FAQ + GLOSSARY ====================== */
function renderFaq(){
 $('#faqList').innerHTML = FAQ.map((f,i)=>`
  <div class="faq-item">
    <button class="faq-q"><span class="pls">+</span><span>${L(f.q)}</span></button>
    <div class="faq-a">${L(f.a)}</div>
  </div>`).join('');
 $$('#faqList .faq-q').forEach(q=>q.onclick=()=>q.parentElement.classList.toggle('open'));
}
function renderGloss(){
 const q=($('#glossSearch').value||'').toLowerCase();
 $('#glossList').innerHTML = GLOSS.filter(g=>!q||(g.t+(typeof g.d==='string'?g.d:L(g.d))).toLowerCase().includes(q)).map(g=>
  `<div class="gloss-item"><b>${typeof g.t==='string'?g.t:L(g.t)}</b><p>${L(g.d)}</p></div>`).join('');
}

/* ====================== SOURCES ====================== */
function renderSources(){
 $('#srcGrid').innerHTML=SOURCES.map(s=>`
  <div class="src-card">
    <div class="fav" style="background:${s.c}">${s.f}</div>
    <div><a href="${s.u}" target="_blank" rel="noopener">${L(s.n)} ↗</a></div>
  </div>`).join('');
 $('#discText').innerHTML = lang==='ro'
  ? '<b>Disclaimer:</b> aplicația este un instrument de orientare asamblat din informații publice la data de 14 septembrie 2026. Orele, taxele, examenele și perioadele de revizuire se modifică (vezi schimbările anunțate pentru nov 2026 / ian–apr 2027). Înainte de orice înscriere sau aplicare, verifică direct pe coachingfederation.org, emccglobal.org, coachingfederation.ro, emccromania.net și portalul autorităților române.'
  : '<b>Disclaimer:</b> this is an orientation tool assembled from public information as of September 14, 2026. Hours, fees, exams and review times change (see the announced Nov 2026 / Jan–Apr 2027 changes). Before enrolling or applying, verify directly on coachingfederation.org, emccglobal.org, coachingfederation.ro, emccromania.net and the Romanian authorities\' portal.';
}

/* ====================== MODAL ====================== */
function modal(head,body){
 $('#modalBox').innerHTML=`
  <div class="modal-head">${head}<button class="modal-close" id="mClose">✕</button></div>
  <div class="modal-body">${body}</div>`;
 $('#modalBg').classList.add('open');
 $('#mClose').onclick=closeModal;
 document.body.style.overflow='hidden';
}
function closeModal(){$('#modalBg').classList.remove('open');document.body.style.overflow='';}
$('#modalBg').addEventListener('click',e=>{if(e.target.id==='modalBg')closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

/* ====================== QUICK START ====================== */
$$('.qstart-item').forEach(b=>b.onclick=()=>{
 const g=b.dataset.go;
 if(g==='zero'){
   currentPath='icf';renderPathTabs();renderStepper();
   location.hash='#harta';
   setTimeout(()=>{
     const first=document.querySelector('.rm-node');
     if(first){first.click();first.scrollIntoView({behavior:'smooth',block:'center'});}
   },280);
 }
 if(g==='anc'){location.hash='#transitions';setTimeout(()=>openTrans('t-ancacc'),350);}
 if(g==='acc'){location.hash='#transitions';setTimeout(()=>openTrans('t-accpcc'),350);}
 if(g==='pcc'){location.hash='#transitions';setTimeout(()=>openTrans('t-pccmcc'),350);}
 if(g==='schools'){location.hash='#schools';}
});

/* ====================== INIT ====================== */
function renderAll(){
 applyI18n(); renderNav(); renderOrgs(); renderNews();
 renderPathTabs(); renderStepper(); renderTransitions();
 renderCredFilters(); renderCreds(); renderSchoolFilters(); renderSchools();
 renderJourney(); renderCosts(); renderFaq(); renderGloss(); renderSources();
}
$('#langBtn').onclick=()=>{
 lang=(lang==='ro'?'en':'ro');
 LS.set('cp_lang',lang);
 renderAll();
 // anunță site.js / map.js că s-a schimbat limba (nav, hartă, texte statice)
 document.dispatchEvent(new CustomEvent('clp:lang',{detail:{lang:lang}}));
 toast(lang==='ro'?'Română activată':'English on');
};
$('#glossSearch').addEventListener('input',renderGloss);
renderAll();

