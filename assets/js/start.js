/* ============================================================
   Coaching Learning Path — „ÎNCEPE AICI”
   Traseu ghidat, în 10 pași, pentru cineva care nu știe nimic
   despre coaching. Gamificat discret: XP, nivel, insigne, quiz
   cu feedback, plan personalizat la final — totul salvat local.

   Filozofia de design:
     • un singur drum clar (nu 12 meniuri) — „pasul următor” mereu vizibil
     • fiecare pas = promisiune + conținut scurt + acțiune + verificare
     • jucătorul nu e pedepsit: poate sări, reveni, reseta; nimic nu se
       blochează artificial și nimic nu se trimite nicăieri (fără cont)
     • fără dark patterns: fără streak-uri care fac presiune, fără timere
       false, fără notificări
   ============================================================ */
(function(){
  "use strict";

  var $  = function(s,r){ return (r||document).querySelector(s); };
  var $$ = function(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };
  function lang(){ return (window.CLP && window.CLP.lang) ? window.CLP.lang() : 'ro'; }
  function L(p){ if(p == null) return ''; if(typeof p === 'string') return p; return p[(lang() === 'en') ? 'en' : 'ro']; }
  /* Derulare lină doar dacă utilizatorul nu a cerut „mai puțină mișcare”. */
  function smooth(){
    return (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ? 'auto' : 'smooth';
  }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  /* Copiere fiabilă: Clipboard API → execCommand (iOS, file://, origini nesigure). */
  function legacyCopy(txt){
    try{
      var ta = document.createElement('textarea');
      ta.value = txt;
      ta.setAttribute('readonly','');
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      if(ta.setSelectionRange) ta.setSelectionRange(0, ta.value.length);
      var ok = !!(document.execCommand && document.execCommand('copy'));
      document.body.removeChild(ta);
      return ok;
    }catch(e){ return false; }
  }
  function copyText(txt){
    return new Promise(function(resolve, reject){
      var fallback = function(){ legacyCopy(txt) ? resolve() : reject(new Error('copy-failed')); };
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(txt).then(resolve, fallback);
      }else{
        fallback();
      }
    });
  }

  var LS_KEY = 'cp_start_v2';
  var STEP_XP = 10, QUIZ_XP = 5;

  /* ============================================================
     1. CALIBRARE — trei întrebări, la intrare
     ============================================================ */
  var SETUP = [
    { id:'who',
      t:{ro:'Cine ești acum?', en:'Who are you now?'},
      help:{ro:'Ca să-ți dau exemplele și traseul potrivite.', en:'So I can tailor examples and the route.'},
      opts:[
        { v:'student', t:{ro:'Elev / student — explorez', en:'Student — exploring'} },
        { v:'employee', t:{ro:'Angajat — vreau o a doua carieră', en:'Employee — building a second career'} },
        { v:'leader', t:{ro:'Manager / antreprenor', en:'Manager / entrepreneur'} },
        { v:'pro', t:{ro:'Profesie de ajutorare (HR, psiholog, medic, profesor)', en:'Helping profession (HR, psychologist, doctor, teacher)'} }
      ] },
    { id:'time',
      t:{ro:'Ce ritm de învățare preferi?', en:'What learning pace do you prefer?'},
      help:{ro:'Poți ajusta ritmul pe parcurs.', en:'You can adjust your pace along the way.'},
      opts:[
        { v:'fast', t:{ro:'Un interval concentrat', en:'A focused interval'} },
        { v:'normal', t:{ro:'Două sesiuni scurte pe săptămână', en:'Two short sessions per week'} },
        { v:'slow', t:{ro:'Un pas pe săptămână', en:'One step per week'} }
      ] },
    { id:'focus',
      t:{ro:'Ce vrei să explorezi mai întâi?', en:'What would you like to explore first?'},
      help:{ro:'Interesul tău alege punctul de pornire.', en:'Your interest determines the starting point.'},
      opts:[
        { v:'discover', t:{ro:'Vreau să înțeleg coachingul', en:'I want to understand coaching'} },
        { v:'practice', t:{ro:'Vreau să exersez conversații', en:'I want to practise conversations'} },
        { v:'credentials', t:{ro:'Vreau să înțeleg certificarea', en:'I want to understand credentialing'} }
      ] }
  ];

  /* ============================================================
     2. CEI 10 PAȘI
     ============================================================ */
  var STEPS = window.START_ACADEMY_STEPS || [];

  /* ---------- Insigne ---------- */
  var BADGES = [
    { id:'b1', ic:'🌱', t:{ro:'Nu mai ești la zero', en:'No longer at zero'}, d:{ro:'Ai trecut de primul pas', en:'You cleared the first step'}, need:['s1'] },
    { id:'b2', ic:'🧭', t:{ro:'Știi unde se aplică', en:'You know the contexts'}, d:{ro:'Ești sigur pe primele două opriri', en:'Solid on the first two stops'}, need:['s1','s2'] },
    { id:'b3', ic:'⚖️', t:{ro:'Competențe și etică', en:'Competencies and ethics'}, d:{ro:'Știi ce te obligă codul', en:'You know what the code requires'}, need:['s4'] },
    { id:'b4', ic:'🎓', t:{ro:'Procesul ICF la degetul mic', en:'ICF process at your fingertips'}, d:{ro:'Poți explica credențializarea altcuiva', en:'You could explain credentialing to someone else'}, need:['s6'] },
    { id:'b5', ic:'🧑‍🏫', t:{ro:'Mentor vs supervizor', en:'Mentor vs supervisor'}, d:{ro:'Faci diferența, cu reguli cu tot', en:'You can tell them apart, rules included'}, need:['s7'] },
    { id:'b6', ic:'🗺️', t:{ro:'Plan de învățare', en:'Learning plan'}, d:{ro:'Ai terminat traseul și ți-ai scris planul', en:'You finished the journey and wrote your plan'}, need:['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10'] }
  ];

  var LEVELS = [
    { min:0,   t:{ro:'Curios', en:'Curious'} },
    { min:20,  t:{ro:'Explorator', en:'Explorer'} },
    { min:45,  t:{ro:'Ucenic', en:'Apprentice'} },
    { min:70,  t:{ro:'În formare', en:'In training'} },
    { min:100, t:{ro:'Explorare avansată', en:'Advanced exploration'} },
    { min:130, t:{ro:'Plan clar', en:'Clear plan'} }
  ];

  /* ============================================================
     3. STARE
     ============================================================ */
  var state = { a:{}, done:{}, quiz:{}, xp:0, open:'s1', setup:false };

  function load(){
    try{
      var raw = localStorage.getItem(LS_KEY);
      if(raw){
        var o = JSON.parse(raw);
        if(o && typeof o === 'object'){
          state.a = o.a && typeof o.a === 'object' ? o.a : {}; state.done = o.done && typeof o.done === 'object' ? o.done : {}; state.quiz = o.contentVersion === 3 && o.quiz && typeof o.quiz === 'object' ? o.quiz : {};
          state.xp = o.xp || 0; state.open = o.open || 's1';
        }
      }
    }catch(e){}
    state.setup = SETUP.every(function(q){ return !!state.a[q.id]; });
    state.xp = xp();   /* recalculat din progres, nu din ce a rămas în localStorage */
  }
  function save(){
    state.contentVersion = 3;
    state.xp = xp();
    try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch(e){}
    /* antetul își actualizează insigna de progres imediat */
    try{ document.dispatchEvent(new CustomEvent('clp:progress')); }catch(e){}
  }
  function reset(){
    state = { a:{}, done:{}, quiz:{}, xp:0, open:'s1', setup:false };
    try{ localStorage.removeItem(LS_KEY); }catch(e){}
    renderAll();
    toast(lang() === 'ro' ? 'Progres resetat. Poți lua traseul de la capăt.' : 'Progress reset. You can start the journey again.');
  }
  function toast(msg){
    var t = $('#toast');
    if(!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function(){ t.classList.remove('show'); }, 2400);
  }
  /* XP-ul e derivat din progres, nu ținut într-un contor separat:
     așa nu se poate „dezlipi” (bonus de quiz luat după marcare, pas anulat etc.). */
  function xp(){
    var n = doneCount() * STEP_XP;
    STEPS.forEach(function(s){
      var q = state.quiz[s.id];
      if(s.quiz && q != null && s.quiz.opts[q] && s.quiz.opts[q].ok) n += QUIZ_XP;
    });
    return n;
  }
  function level(){
    var l = LEVELS[0];
    for(var i=0;i<LEVELS.length;i++){ if(state.xp >= LEVELS[i].min) l = LEVELS[i]; }
    return l;
  }
  function doneCount(){ return STEPS.filter(function(s){ return state.done[s.id]; }).length; }
  function badges(){ return BADGES.filter(function(b){ return b.need.every(function(id){ return state.done[id]; }); }); }
  function minutesLeft(){
    return STEPS.filter(function(s){ return !state.done[s.id]; }).reduce(function(n,s){ return n + s.min; }, 0);
  }
  function progressPct(){ return Math.round(doneCount() / STEPS.length * 100); }

  /* ============================================================
     4. RANDARE
     ============================================================ */
  function hudHTML(){
    var lv = level(), done = doneCount(), left = minutesLeft();
    var hours = left >= 60 ? (left/60).toFixed(1) + (lang()==='ro' ? ' h' : ' h') : left + ' min';
    var html = '';
    html += '<div class="start-hud-top">';
    html +=   '<div class="sh-left"><span class="sh-level">' + esc(L(lv.t)) + '</span>';
    html +=     '<span class="sh-xp"><b>' + xp() + '</b> XP</span>';
    html +=     '<span class="sh-time">' + (left ? '⏱ ' + (lang()==='ro' ? 'îți rămân ~' : 'about ') + esc(hours) + (lang()==='ro' ? '' : ' left')
                                                   : (lang()==='ro' ? '✅ traseu parcurs' : '✅ journey complete')) + '</span></div>';
    html +=   '<div class="sh-right"><span class="sh-count">' + done + ' / ' + STEPS.length + '</span>';
    html +=     '<button type="button" class="sh-reset" id="startReset">' + (lang()==='ro' ? 'Resetează' : 'Reset') + '</button></div>';
    html += '</div>';
    html += '<div class="start-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + progressPct() + '"' +
            ' aria-label="' + esc(lang()==='ro' ? 'Progres în traseu' : 'Journey progress') + '">' +
            '<div class="start-bar-in" style="width:' + progressPct() + '%"></div></div>';
    html += '<ol class="start-dots" role="list">';
    STEPS.forEach(function(s,i){
      var isDone = !!state.done[s.id], isOpen = state.open === s.id;
      var cls = 'start-dot' + (isDone ? ' done' : '') + (isOpen ? ' current' : '');
      html += '<li><button type="button" class="' + cls + '" data-goto="' + s.id + '" ' +
              'aria-label="' + esc((lang()==='ro' ? 'Pasul ' : 'Step ') + (i+1) + ': ' + L(s.t)) + '"' +
              (isDone ? ' data-done="1"' : '') + '>' + (isDone ? '✓' : (i+1)) + '</button></li>';
    });
    html += '</ol>';
    var bs = badges();
    if(bs.length){
      html += '<div class="start-badges" aria-label="' + (lang()==='ro' ? 'Insigne obținute' : 'Badges earned') + '">';
      bs.forEach(function(b){ html += '<span class="start-badge" title="' + esc(L(b.d)) + '"><i aria-hidden="true">' + b.ic + '</i>' + esc(L(b.t)) + '</span>'; });
      html += '</div>';
    }
    return html;
  }

  function setupHTML(){
    var h = '<h2 class="start-h2">' + (lang()==='ro' ? 'Înainte să începem: 3 întrebări' : 'Before we start: 3 questions') + '</h2>';
    h += '<p class="start-lead">' + (lang()==='ro'
      ? 'Nu se trimit nicăieri (sunt salvate doar în browserul tău) și îmi permit să-ți personalizez planul de la final.'
      : 'They go nowhere (saved only in your browser) and let me personalise the plan at the end.') + '</p>';
    h += '<div class="start-setup">';
    SETUP.forEach(function(q){
      h += '<fieldset class="start-q" data-q="' + q.id + '"><legend>' + esc(L(q.t)) + '</legend>';
      h += '<p class="start-q-help">' + esc(L(q.help)) + '</p>';
      q.opts.forEach(function(o){
        var on = state.a[q.id] === o.v;
        h += '<label class="start-opt' + (on ? ' on' : '') + '"><input type="radio" name="q_' + q.id + '" value="' + o.v + '"' + (on ? ' checked' : '') + '>' +
             '<span>' + esc(L(o.t)) + '</span></label>';
      });
      h += '</fieldset>';
    });
    h += '</div>';
    h += '<div class="start-setup-actions"><button type="button" class="btn btn-primary" id="startSetupGo"' +
         (state.setup ? '' : ' disabled') + '>' + (lang()==='ro' ? 'Începe traseul →' : 'Start the journey →') + '</button>';
    h += '<span class="start-hint">' + (state.setup
      ? (lang()==='ro' ? 'Gata — dă drumul la pasul 1.' : 'Ready — off we go, step 1.')
      : (lang()==='ro' ? 'Răspunde la toate trei ca să continui.' : 'Answer all three to continue.')) + '</span></div>';
    return h;
  }

  function quizHTML(s){
    var q = s.quiz, chose = state.quiz[s.id];
    var h = '<div class="start-quiz"><h4>' + (lang()==='ro' ? '✅ Verifică-te (10 secunde)' : '✅ Quick check (10 seconds)') + '</h4>';
    h += '<p class="start-quiz-q">' + esc(L(q.q)) + '</p>';
    h += '<div class="start-quiz-opts">';
    q.opts.forEach(function(o,i){
      var isChosen = chose === i, cls = 'start-quiz-opt' + (isChosen ? (o.ok ? ' ok' : ' bad') : '');
      var optId = 'q-' + s.id + '-' + i, whyId = 'why-' + s.id + '-' + i;
      h += '<button type="button" class="' + cls + '" data-quiz="' + s.id + '" data-i="' + i + '"' +
           ' id="' + optId + '" aria-pressed="' + (isChosen ? 'true' : 'false') + '"' +
           (isChosen ? ' aria-describedby="' + whyId + '"' : '') + '>' + esc(L(o.t)) + '</button>';
      if(isChosen) h += '<p class="start-quiz-why" id="' + whyId + '">' + (o.ok ? '✔ ' : '✖ ') + esc(L(o.why)) + '</p>';
    });
    h += '</div></div>';
    return h;
  }

  function tableHTML(b){
    var h = '<div class="start-table-wrap"><table class="start-table"><thead><tr>';
    if(b.head){ b.head[lang()==='en' ? 'en' : 'ro'].forEach(function(c){ h += '<th>' + esc(c) + '</th>'; }); }
    h += '</tr></thead><tbody>';
    b.d[lang()==='en' ? 'en' : 'ro'].forEach(function(row){
      h += '<tr>';
      row.forEach(function(c,i){ h += (i === 0 ? '<th scope="row">' + esc(c) + '</th>' : '<td>' + esc(c) + '</td>'); });
      h += '</tr>';
    });
    h += '</tbody></table></div>';
    return h;
  }
  function mapTableHTML(b){
    var h = '<div class="start-table-wrap"><table class="start-table"><tbody>';
    b.d[lang()==='en' ? 'en' : 'ro'].forEach(function(row){
      h += '<tr><th scope="row">' + esc(row[0]) + '</th><td>' + esc(row[1]) + '</td></tr>';
    });
    h += '</tbody></table></div>';
    return h;
  }

  function stepHTML(s, i){
    var isOpen = state.open === s.id, isDone = !!state.done[s.id];
    var h = '<article class="start-step' + (isOpen ? ' open' : '') + (isDone ? ' done' : '') + '" id="step-' + s.id + '">';
    h += '<button type="button" class="start-step-head" data-toggle="' + s.id + '" aria-expanded="' + (isOpen ? 'true' : 'false') + '" aria-controls="body-' + s.id + '">';
    h +=   '<span class="ssn" aria-hidden="true">' + (isDone ? '✓' : (i+1)) + '</span>';
    h +=   '<span class="ssi" aria-hidden="true">' + s.icon + '</span>';
    h +=   '<span class="sst"><b>' + esc(L(s.t)) + '</b><i>' + esc(L(s.sub)) + '</i></span>';
    h +=   '<span class="ssm">' + s.min + ' min</span>';
    h += '</button>';
    h += '<div class="start-step-body" id="body-' + s.id + '">';
    if(isOpen){
      h += '<div class="start-learn"><h4>' + (lang()==='ro' ? 'La finalul acestui pas' : 'By the end of this step') + '</h4><ul>';
      L(s.learn).forEach(function(x){ h += '<li>' + esc(x) + '</li>'; });
      h += '</ul></div>';
      (s.blocks || []).forEach(function(b){
        h += '<div class="start-block"><h3>' + esc(L(b.t)) + '</h3>';
        if(b.list){
          h += '<ul class="' + (b.kind === 'numbered' ? 'start-num' : 'start-list') + '">';
          L(b.d).forEach(function(x){ h += '<li>' + esc(x) + '</li>'; });
          h += '</ul>';
        }else if(b.table){ h += tableHTML(b); }
        else if(Array.isArray(b.d) && Array.isArray(b.d.ro)){ h += mapTableHTML(b); }
        else { h += '<p>' + esc(L(b.d)) + '</p>'; }
        h += '</div>';
      });

      if(s.action){
        h += '<div class="start-action"><b>' + (lang()==='ro' ? 'Fă acum' : 'Do this now') + '</b><p>' + esc(L(s.action)) + '</p></div>';
      }
      if(s.quiz){ h += quizHTML(s); }
      h += '<div class="start-step-foot">';
      h += '<button type="button" class="btn ' + (isDone ? 'btn-ghost' : 'btn-primary') + '" data-mark="' + s.id + '">' +
           (isDone ? (lang()==='ro' ? '✓ Făcut — anulează' : '✓ Done — undo') : (lang()==='ro' ? 'Am terminat pasul (+' + STEP_XP + ' XP)' : 'Step finished (+' + STEP_XP + ' XP)')) + '</button>';
      if(!isDone && state.quiz[s.id] == null){
        h += '<span class="start-hint">' + (lang()==='ro' ? 'Răspunde la verificare ca să primești XP-ul întreg.' : 'Answer the check question to earn the full XP.') + '</span>';
      }
      h += '<button type="button" class="start-share" data-share="' + s.id + '" title="' + (lang()==='ro' ? 'Copiază un link direct către acest pas' : 'Copy a direct link to this step') + '">🔗 ' + (lang()==='ro' ? 'Link către pas' : 'Link to step') + '</button>';
      if(s.links && s.links.length){
        h += '<span class="start-links">' + (lang()==='ro' ? 'Mai departe: ' : 'Go deeper: ');
        s.links.forEach(function(l,i2){ h += (i2 ? ' · ' : '') + '<a href="' + l.h + '">' + esc(L(l.l)) + '</a>'; });
        h += '</span>';
      }
      h += '</div>';
    }
    h += '</div></article>';
    return h;
  }

  /* ---------- LINK DIRECT CĂTRE UN PAS (incepe.html#s4) ----------
     Pasul deschis se scrie în adresă, deci linkul poate fi trimis mai departe,
     iar butonul Back/Foreword al browserului funcționează. */
  function stepIds(){ return STEPS.map(function(x){ return x.id; }); }
  function setHash(id){
    if(('#' + id) === location.hash) return;
    try{ history.pushState(null, '', '#' + id); }
    catch(e){ location.hash = id; }
  }
  function applyHash(scroll){
    var h = (location.hash || '').replace(/^#/, '');
    if(!h || stepIds().indexOf(h) === -1) return false;
    if(state.open !== h){ state.open = h; save(); renderSteps(); refreshHints(); }
    var el = document.getElementById('step-' + h);
    if(scroll && el && el.scrollIntoView) el.scrollIntoView({ behavior:smooth(), block:'start' });
    return true;
  }
  function pageURL(id){
    return location.href.split('#')[0] + '#' + id;
  }

  /* ---------- BARĂ FIXĂ PE TELEFON: progres + pasul următor ---------- */
  function barDoneNext(){
    var first = null;
    STEPS.forEach(function(x){ if(!first && !state.done[x.id]) first = x; });
    if(state.open){
      var cur = null;
      STEPS.forEach(function(x){ if(x.id === state.open) cur = x; });
      if(cur && !state.done[cur.id]) return cur;
    }
    return first;
  }
  function barHTML(){
    if(!state.setup) return '';
    var total = STEPS.length, done = doneCount();
    if(done >= total) return '';
    var next = barDoneNext();
    if(!next) return '';
    var idx = stepIds().indexOf(next.id);
    var pct = Math.round(done / total * 100);
    var ro = (lang() === 'ro');
    var h = '<div class="sb-in wrap">';
    h += '<span class="sb-txt"><b>' + (ro ? 'Pasul ' + (idx + 1) + ' din ' + total : 'Step ' + (idx + 1) + ' of ' + total) + '</b>';
    h += '<span class="sb-bar" aria-hidden="true"><i style="width:' + pct + '%"></i></span></span>';
    h += '<button type="button" class="sb-go" data-goto="' + next.id + '">' + esc(L(next.t)) + ' →</button>';
    h += '</div>';
    return h;
  }
  function renderBar(){
    var el = $('#startBar');
    if(!el) return;
    var h = barHTML();
    if(el.innerHTML !== h) el.innerHTML = h;
    el.hidden = !h;
    el.setAttribute('aria-label', lang()==='ro' ? 'Progres și pasul următor' : 'Progress and next step');
    document.documentElement.classList.toggle('has-stepbar', !!h);
  }

  function routeText(){
    var f=state.a.focus, ro=lang()!=='en';
    var route=f==='practice' ? (ro?'Începe cu atelierul și o competență ICF. Alege apoi o conversație fictivă.':'Start with the studio and one ICF competency. Then choose a fictional conversation.') : f==='credentials' ? (ro?'Clarifică diferența dintre certificat de program și credențială, apoi verifică sursele oficiale.':'Clarify the difference between a programme certificate and a credential, then check official sources.') : (ro?'Începe cu definiția, contextele și limitele coachingului.':'Start with the definition, contexts and boundaries of coaching.');
    var pace=state.a.time==='fast' ? (ro?'Rezervă un interval concentrat, apoi lasă timp pentru reflecție.':'Reserve a focused interval, then leave time for reflection.') : state.a.time==='slow' ? (ro?'Alege un singur pas pe săptămână și revino când îți este util.':'Choose one step per week and return when it is useful.') : (ro?'Încearcă două sesiuni scurte de învățare pe săptămână.':'Try two short learning sessions each week.');
    var extra=state.a.who==='leader' ? (ro?'Explorează povestea de echipă și observă rolurile din organizație.':'Explore the team story and notice organisational roles.') : state.a.who==='pro' ? (ro?'Reflectează la limitele dintre coaching și profesia ta actuală.':'Reflect on the boundaries between coaching and your current profession.') : state.a.who==='employee' ? (ro?'Explorează povestea Anei despre o alegere de carieră.':'Explore Ana’s story about a career choice.') : (ro?'Compară coachingul cu mentoratul și consultanța.':'Compare coaching with mentoring and consulting.');
    return {route:route,pace:pace,extra:extra};
  }
  function planText(){
    var r=routeText(),ro=lang()!=='en';
    return [(ro?'PLANUL MEU DE EXPLORARE':'MY PLAN FOR EXPLORATION'),'',r.route,r.pace,r.extra,'',
      ro?'1. Citesc o explicație și notez ce nu îmi este clar.':'1. Read one explanation and note what is unclear.',
      ro?'2. Încerc un exercițiu cu acordul unui partener și cer feedback.':'2. Try an exercise with a consenting partner and ask for feedback.',
      ro?'3. Păstrez o observație în jurnal și aleg următorul pas.':'3. Keep an observation in the journal and choose the next step.',
      ro?'Acesta este un plan de învățare, nu o promisiune de certificare într-un anumit termen.':'This is a learning plan, not a promise of credentialing within a specific timeframe.'
    ].join('\n');
  }

  function planHTML(){
    if(!state.setup) return '';
    var r = routeText(), ro = lang() !== 'en';
    var h = '<h2>🗺️ ' + (ro ? 'Planul tău, personalizat' : 'Your personalised plan') + '</h2>';
    h += '<p class="start-lead">' + (ro
      ? 'Construit din cele 3 răspunsuri de la început. Îl poți copia și păstra aproape.'
      : 'Built from your three initial answers. You can copy it and keep it close.') + '</p>';
    h += '<div class="plan-grid">';
    h += '<div class="plan-card"><h4>' + (ro ? 'Ruta recomandată' : 'Recommended route') + '</h4><p>' + esc(r.route) + '</p></div>';
    h += '<div class="plan-card"><h4>' + (ro ? 'Ritm' : 'Pace') + '</h4><p>' + esc(r.pace) + '</p></div>';
    h += '<div class="plan-card"><h4>' + (ro ? 'Context de explorat' : 'Context to explore') + '</h4><p>' + esc(r.extra) + '</p></div>';
    h += '</div>';
    h += '<pre class="start-plan-text" id="startPlanText">' + esc(planText()) + '</pre>';
    h += '<div class="start-plan-actions">';
    h += '<button type="button" class="btn btn-primary" id="startCopy">📋 ' + (ro ? 'Copiază planul' : 'Copy the plan') + '</button>';
    h += '</div>';
    return h;
  }

  function renderHud(){ var el = $('#startHud'); if(el) el.innerHTML = hudHTML(); }
  function renderSetup(){ var el = $('#startSetup'); if(el) el.innerHTML = setupHTML(); }
  function renderSteps(){
    var box = $('#startSteps');
    if(!box) return;
    box.innerHTML = STEPS.map(function(s,i){ return stepHTML(s,i); }).join('');
  }
  function renderPlan(){ var el = $('#startPlan'); if(el) el.innerHTML = planHTML(); }

  function refreshHints(){
    if(window.CLP && window.CLP.refreshTableHints) window.CLP.refreshTableHints();
  }

  function renderAll(){
    renderHud(); renderSetup(); renderSteps(); renderPlan(); renderBar();
    refreshHints();
    var live = $('#startLive');
    if(live) live.textContent = (lang()==='ro' ? 'Progres: ' : 'Progress: ') + doneCount() + '/' + STEPS.length + ', ' + xp() + ' XP';
  }

  function announce(msg){
    var live = $('#startLive');
    if(live) live.textContent = msg;
  }

  /* ============================================================
     5. EVENIMENTE
     ============================================================ */
  function setAnswer(qid, val){
    state.a[qid] = val;
    state.setup = SETUP.every(function(q){ return !!state.a[q.id]; });
    save();
    var box = $('#startSetup');
    if(box){
      $$('.start-opt', box).forEach(function(l){
        var inp = l.querySelector('input');
        if(inp) l.classList.toggle('on', inp.checked);
      });
      var hint = $('.start-hint', box);
      if(hint) hint.textContent = state.setup
        ? (lang()==='ro' ? 'Gata — dă drumul la pasul 1.' : 'Ready — off we go, step 1.')
        : (lang()==='ro' ? 'Răspunde la toate trei ca să continui.' : 'Answer all three to continue.');
    }
    var btn = $('#startSetupGo');
    if(btn) btn.disabled = !state.setup;
    if(state.setup) renderPlan();
  }

  function markStep(id){
    var s = null;
    STEPS.forEach(function(x){ if(x.id === id) s = x; });
    if(!s) return;
    var before = xp();
    if(state.done[id]){
      state.done[id] = false;
      announce(lang()==='ro' ? 'Pas anulat.' : 'Step undone.');
    }else{
      state.done[id] = true;
      var gain = xp() - before;
      var nb = BADGES.filter(function(b){ return b.need.every(function(x){ return state.done[x]; }); });
      var idx = STEPS.map(function(x){ return x.id; }).indexOf(id);
      var next = STEPS[idx + 1];
      state.open = next ? next.id : id;
      announce((lang()==='ro' ? 'Pasul e gata. +' : 'Step done. +') + gain + ' XP. ' +
               (nb.length ? (lang()==='ro' ? 'Ai ' + nb.length + ' insigne.' : 'You have ' + nb.length + ' badges.') : ''));
      if(next){
        save(); renderAll(); setHash(next.id);
        var el = document.getElementById('step-' + next.id);
        if(el && el.scrollIntoView) el.scrollIntoView({ behavior:smooth(), block:'start' });
        return;
      }
    }
    save(); renderAll();
  }

  function answerQuiz(id, i){
    var before = xp();
    state.quiz[id] = i;
    var gain = xp() - before;
    save(); renderSteps(); renderHud();
    var ok = false;
    STEPS.forEach(function(s){ if(s.id === id) ok = !!s.quiz.opts[i].ok; });
    if(ok && gain > 0){
      announce((lang()==='ro' ? 'Corect. +' : 'Correct. +') + gain + ' XP');
    }else if(ok){
      announce(lang()==='ro' ? 'Corect.' : 'Correct.');
    }else{
      announce(lang()==='ro' ? 'Vezi explicația — apoi mergi mai departe.' : 'Read the explanation — then move on.');
    }
    if(state.done[id]) renderSteps();
    refreshHints();
  }

  function bind(){
    document.addEventListener('click', function(e){
      var t = e.target.closest ? e.target.closest('[data-toggle],[data-mark],[data-quiz],[data-goto],[data-setup]') : null;
      if(!t) return;

      if(t.hasAttribute('data-toggle')){
        var id = t.getAttribute('data-toggle');
        state.open = (state.open === id) ? null : id;
        save(); renderSteps();
        if(state.open) setHash(state.open);
        return;
      }
      if(t.hasAttribute('data-goto')){
        state.open = t.getAttribute('data-goto');
        save(); renderSteps(); setHash(state.open);
        var el = document.getElementById('step-' + state.open);
        if(el && el.scrollIntoView) el.scrollIntoView({ behavior:smooth(), block:'start' });
        var head = el && el.querySelector('.start-step-head');
        if(head) head.focus();
        return;
      }
      if(t.hasAttribute('data-mark')){ markStep(t.getAttribute('data-mark')); return; }
      if(t.hasAttribute('data-share')){
        copyText(pageURL(t.getAttribute('data-share'))).then(function(){
          toast(lang()==='ro' ? 'Link copiat. Îl poți trimite oricui.' : 'Link copied. Send it to anyone.');
        }, function(){
          toast(lang()==='ro' ? 'Nu am putut copia linkul automat.' : 'Could not copy the link automatically.');
        });
        return;
      }
      if(t.hasAttribute('data-quiz')){ answerQuiz(t.getAttribute('data-quiz'), parseInt(t.getAttribute('data-i'), 10)); return; }
      if(t.hasAttribute('data-setup')){
        setAnswer(t.getAttribute('data-setup'), t.getAttribute('data-v'));
        return;
      }
    });

    document.addEventListener('change', function(e){
      var inp = e.target;
      if(inp && inp.type === 'radio' && inp.name && inp.name.indexOf('q_') === 0){
        setAnswer(inp.name.slice(2), inp.value);
      }
    });

    document.addEventListener('click', function(e){
      if(e.target && e.target.id === 'startReset') reset();
      if(e.target && e.target.id === 'startSetupGo'){
        var el = document.getElementById('step-s1');
        if(el && el.scrollIntoView) el.scrollIntoView({ behavior:smooth(), block:'start' });
        toast(lang()==='ro' ? 'Hai să începem cu pasul 1.' : 'Let’s start with step 1.');
      }
      if(e.target && e.target.id === 'startCopy'){
        copyText(planText()).then(function(){
          toast(lang()==='ro' ? 'Plan copiat. Lipește-l unde lucrezi.' : 'Plan copied. Paste it wherever you work.');
        }, function(){
          /* ultima soluție: selectăm textul planului, ca un tap lung să fie de ajuns */
          var pre = $('#startPlanText');
          if(pre && window.getSelection && document.createRange){
            var r = document.createRange();
            r.selectNodeContents(pre);
            var sel = window.getSelection();
            sel.removeAllRanges(); sel.addRange(r);
          }
          toast(lang()==='ro' ? 'Textul planului e selectat — apasă lung și copiază.' : 'The plan text is selected — long press and copy.');
        });
      }
    });

    document.addEventListener('clp:lang', function(){
      renderAll();
      var lv = level();
      void lv;
    });
  }

  function boot(){
    if(!document.getElementById('startSteps')) return;
    load(); bind(); renderAll();
    /* dacă cineva deschide un link direct (incepe.html#s7), mergem la acel pas */
    if(applyHash(true)) toast(lang()==='ro' ? 'Te-am dus la pasul din link.' : 'Jumped to the step from your link.');
    window.addEventListener('hashchange', function(){ applyHash(true); });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
