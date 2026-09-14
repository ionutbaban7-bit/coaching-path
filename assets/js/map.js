/* ============================================================
   Coaching Learning Path — HARTA INTERACTIVĂ
   Traseu ghidat pentru cine pornește de la zero.
   ============================================================ */
(function(){
  "use strict";

  var ROADMAP = [
    {
      id:'m1', lane:'learn', icon:'💡',
      tag:{ro:'Pasul 1 · Fundament', en:'Step 1 · Foundation'},
      t:{ro:'Ce este, de fapt, coachingul', en:'What coaching actually is'},
      d:{ro:'Un parteneriat în care un profesionist te ajută să gândești clar, nu îți dă soluții.',
         en:'A partnership in which a professional helps you think clearly — not someone handing you answers.'},
      why:{ro:'Dacă nu înțelegi mecanismul, cumperi „sfaturi” la preț de coaching. Coachingul pleacă de la ideea că tu ești expertul pe viața și munca ta; coach-ul este expertul pe proces.',
           en:'If you don\'t get the mechanism, you buy advice at coaching prices. Coaching assumes YOU are the expert on your life and work; the coach is the expert on process.'},
      facts:{ro:['Definiția ICF: parteneriat care „provocă gândirea și creativitatea pentru a inspira maximizarea potențialului personal și profesional”.','Clientul stabilește agenda; coach-ul conduce procesul, nu conținutul.','Rezultatul nu este un sfat, ci o decizie asumată + un plan de acțiune.'],
             en:['ICF definition: a partnership that "provokes thought and creativity to inspire maximisation of personal and professional potential".','The client sets the agenda; the coach runs the process, not the content.','The output is not advice but an owned decision plus an action plan.']},
      tip:{ro:'Testul rapid: dacă la finalul ședinței ai „sfaturi” foarte bune, dar nu ai claritate despre ce vei face luni dimineață, nu a fost coaching.',
           en:'Quick test: if you leave with great advice but no clarity on what you\'ll do Monday morning, it wasn\'t coaching.'},
      links:[{ro:'Toată teoria, pe larg', en:'Full theory', href:'teorie.html'}]
    },
    {
      id:'m2', lane:'learn', icon:'🧭',
      tag:{ro:'Pasul 2 · Clarificare', en:'Step 2 · Clarify'},
      t:{ro:'Ce NU este coachingul', en:'What coaching is NOT'},
      d:{ro:'Nu e terapie, nu e consultanță, nu e mentoring, nu e training. Se suprapun, dar nu se înlocuiesc.',
         en:'Not therapy, not consulting, not mentoring, not training. They overlap, but don\'t replace each other.'},
      why:{ro:'Alegerea greșită costă luni și bani: o problemă de sănătate mentală nu se rezolvă prin coaching, iar un deficit de competențe nu se rezolvă prin conversație.',
           en:'Choosing wrong costs months and money: a mental-health issue isn\'t solved by coaching, and a skills gap isn\'t solved by conversation.'},
      facts:{ro:['Terapia privește în trecut și tratează suferința/clinicul.','Consultanța îți dă expertiza și soluția.','Mentoringul transferă experiența cuiva care a trecut pe acolo.','Trainingul predă o competență standardizată.','Coachingul lucrează pe prezent → viitor, pe agenda ta.'],
             en:['Therapy looks back and treats clinical suffering.','Consulting hands over expertise and the answer.','Mentoring transfers experience from someone who walked the path.','Training teaches a standardised skill.','Coaching works present → future, on your agenda.']},
      tip:{ro:'Întrebarea care decide: „Am nevoie să fiu învățat, să fiu sfătuit, să fiu vindecat sau să fiu ascultat ca să găsesc singur răspunsul?”',
           en:'The deciding question: "Do I need to be taught, advised, healed — or heard, so I can find the answer myself?"'},
      links:[{ro:'Matricea completă de comparație', en:'Full comparison matrix', href:'teorie.html#comparatie'}]
    },
    {
      id:'m3', lane:'learn', icon:'🌍',
      tag:{ro:'Pasul 3 · Contexte', en:'Step 3 · Contexts'},
      t:{ro:'Unde se folosește coachingul', en:'Where coaching is used'},
      d:{ro:'Executive, carieră, echipă, viață personală, sănătate, educație, sport, antreprenoriat.',
         en:'Executive, career, team, life, health, education, sport, entrepreneurship.'},
      why:{ro:'Nu cauți „un coach”, cauți un coach pentru contextul tău. Specializarea contează mai mult decât diploma.',
           en:'You don\'t look for "a coach", you look for a coach for your context. Specialisation matters more than the certificate.'},
      facts:{ro:['Executive & leadership: tranziții de rol, decizii dificile, prezență executivă.','Career: reconversie, negociere, claritate profesională.','Team: aliniere, conflict, performanță colectivă.','Life: relații, energie, priorități, identitate.','Health & wellbeing: schimbare de stil de viață, burnout.'],
             en:['Executive & leadership: role transitions, hard decisions, executive presence.','Career: retraining, negotiation, professional clarity.','Team: alignment, conflict, collective performance.','Life: relationships, energy, priorities, identity.','Health & wellbeing: lifestyle change, burnout.']},
      tip:{ro:'Coachingul de echipă este o disciplină separată, cu propriile competențe (ICF ACTC / EMCC ITCA) — nu e „coaching 1:1 ținut în sală”.',
           en:'Team coaching is a separate discipline with its own competencies (ICF ACTC / EMCC ITCA) — not 1:1 coaching done in a meeting room.'},
      links:[
        {ro:'Unde se folosește — detaliat', en:'Where it\'s used — in depth', href:'teorie.html#unde'},
        {ro:'Coaching de echipă', en:'Team coaching', href:'echipa.html'}
      ]
    },
    {
      id:'m4', lane:'practice', icon:'🪑',
      tag:{ro:'Pasul 4 · Mecanică', en:'Step 4 · Mechanics'},
      t:{ro:'Cum arată o sesiune, concret', en:'What a session actually looks like'},
      d:{ro:'45–60 de minute, o agendă clară, întrebări, un angajament de acțiune și follow-up.',
         en:'45–60 minutes, a clear agenda, questions, a commitment to act and follow-up.'},
      why:{ro:'Fără structură, o conversație plăcută rămâne o conversație plăcută. Structura este diferența dintre „ne-am înțeles bine” și „am schimbat ceva”.',
           en:'Without structure, a nice conversation stays a nice conversation. Structure is the difference between "we got along" and "something changed".'},
      facts:{ro:['Contract: despre ce lucrăm și cum măsurăm că a mers.','Explorare: realitatea, opțiunile, blocajele, valorile.','Insight: ce vezi acum și nu vedeai înainte.','Angajament: acțiuni datate + primul pas.','Follow-up: ce s-a întâmplat, ce ajustăm.'],
             en:['Contract: what we work on and how we\'ll know it worked.','Explore: reality, options, blockers, values.','Insight: what you now see that you didn\'t before.','Commitment: dated actions plus the first step.','Follow-up: what happened, what we adjust.']},
      tip:{ro:'Modelele (GROW, OSCAR, CLEAR) sunt doar schele. Semnul unui coach bun nu e modelul, ci calitatea întrebărilor și a ascultării.',
           en:'Models (GROW, OSCAR, CLEAR) are just scaffolding. A good coach is defined by the quality of questions and listening, not by the model.'},
      links:[{ro:'Anatomia sesiunii + modele', en:'Session anatomy & models', href:'teorie.html#sesiune'}]
    },
    {
      id:'m5', lane:'practice', icon:'🔎',
      tag:{ro:'Pasul 5 · Selecție', en:'Step 5 · Selection'},
      t:{ro:'Cum alegi un coach (sau o școală)', en:'How to choose a coach (or a school)'},
      d:{ro:'Credențiale verificabile, potrivire reală, contract clar, supervizare la activ.',
         en:'Verifiable credentials, genuine fit, a clear contract, active supervision.'},
      why:{ro:'Piața e nereglementată: oricine își poate spune „coach”. Verificarea durează 10 minute și te ferește de ani pierduți.',
           en:'The market is unregulated: anyone can call themselves a coach. Verification takes 10 minutes and saves years.'},
      facts:{ro:['Cere numele exact al credențialei (ex. ICF PCC) și verifică-l în directorul oficial.','Întreabă de supervizare: un coach serios își supervizează practica.','Fă o sesiune de chimie (chemistry session) înainte să semnezi un pachet.','Contract scris: frecvență, durată, confidențialitate, cost, criterii de oprire.'],
             en:['Ask for the exact credential name (e.g. ICF PCC) and verify it in the official directory.','Ask about supervision: serious coaches have their practice supervised.','Do a chemistry session before signing a package.','Written contract: frequency, duration, confidentiality, cost, exit criteria.']},
      tip:{ro:'Semnal de alarmă: promisiuni de rezultat, pachete uriașe plătite în avans, „metodă secretă” sau lipsa unei politici de confidențialitate.',
           en:'Red flags: outcome guarantees, huge prepaid packages, a "secret method", or no confidentiality policy.'},
      links:[
        {ro:'Verifică școlile din România', en:'Check Romanian schools', href:'#schools'},
        {ro:'Ce certificări există', en:'Which credentials exist', href:'#credentials'}
      ]
    },
    {
      id:'m6', lane:'credential', icon:'🎓',
      tag:{ro:'Pasul 6 · Educație', en:'Step 6 · Education'},
      t:{ro:'Vrei să devii coach: formarea', en:'You want to BECOME a coach: training'},
      d:{ro:'Program acreditat (ICF Level 1/2, EMCC) sau calificare națională (ANC). Ore, practică, evaluare.',
         en:'An accredited programme (ICF Level 1/2, EMCC) or the national qualification (ANC). Hours, practice, assessment.'},
      why:{ro:'Formarea este partea care costă cel mai mult și durează cel mai mult. Aici se fac greșelile scumpe: programe fără acreditare reală sau fără practică supervizată.',
           en:'Training is the most expensive and longest part. Expensive mistakes happen here: programmes without real accreditation or without supervised practice.'},
      facts:{ro:['ICF Level 1: minim 60 ore educație + practică + mentor coaching + examen.','ICF Level 2: minim 125 ore, pregătește pentru PCC.','EMCC: EIA Foundation → Practitioner → Senior Practitioner → Master.','ANC (RO): program autorizat ~180–360 ore, examen în fața comisiei, COR 242412.'],
             en:['ICF Level 1: at least 60 education hours + practice + mentor coaching + exam.','ICF Level 2: at least 125 hours, prepares you for PCC.','EMCC: EIA Foundation → Practitioner → Senior Practitioner → Master.','ANC (RO): authorised programme ~180–360 hrs, exam before a commission, COR 242412.']},
      tip:{ro:'Dacă vrei recunoaștere internațională, alege din start un program care este simultan ICF Level și autorizat ANC — același efort, două acte.',
           en:'If you want international recognition, choose from the start a programme that is both an ICF Level and ANC-authorised — same effort, two certificates.'},
      links:[
        {ro:'Deschide learning path-ul', en:'Open the learning path', href:'#paths'},
        {ro:'Traseu 1:1 (de populat)', en:'1:1 track (to populate)', href:'individual.html'}
      ]
    },
    {
      id:'m7', lane:'credential', icon:'🏅',
      tag:{ro:'Pasul 7 · Certificare', en:'Step 7 · Credential'},
      t:{ro:'Certificarea: ACC, PCC, MCC, EIA, ANC', en:'The credential: ACC, PCC, MCC, EIA, ANC'},
      d:{ro:'Dovada publică a standardului: ore de practică, mentor coaching, examen, evaluare de performanță.',
         en:'Public proof of the standard: practice hours, mentor coaching, exam, performance evaluation.'},
      why:{ro:'Certificarea nu te face coach bun; formarea + practica + supervizarea o fac. Dar certificarea este semnalul pe care îl pot verifica clienții și angajatorii.',
           en:'The credential doesn\'t make you a good coach; training + practice + supervision do. But the credential is the signal clients and employers can verify.'},
      facts:{ro:['ACC: 100+ ore clienți, 60+ ore educație, examen, 10 ore mentor coaching.','PCC: 500+ ore clienți, 125+ ore educație, evaluare de performanță (înregistrare).','MCC: 2.500+ ore clienți, evaluare la nivel de maestru.','EIA (EMCC): pe niveluri, cu portofoliu și reflexivitate.','ANC: valabil nelimitat, dar recunoaștere națională, nu internațională.'],
             en:['ACC: 100+ client hours, 60+ education hours, exam, 10 mentor coaching hours.','PCC: 500+ client hours, 125+ education hours, performance evaluation (recording).','MCC: 2,500+ client hours, master-level evaluation.','EIA (EMCC): levelled, portfolio and reflective based.','ANC: valid indefinitely, but national — not international — recognition.']},
      tip:{ro:'Din 1 ianuarie 2027, orele noi de mentor coaching trebuie livrate de un coach cu MCS. Din 10 noiembrie 2026, examenul ICF PCC/MCC se schimbă la 80 de itemi / 150 minute.',
           en:'From 1 January 2027 new mentor coaching hours must come from an MCS coach. From 10 November 2026 the ICF PCC/MCC exam changes to 80 items / 150 minutes.'},
      links:[
        {ro:'Toate certificările', en:'All credentials', href:'#credentials'},
        {ro:'Treceri între sisteme', en:'Bridges between systems', href:'#transitions'}
      ]
    },
    {
      id:'m8', lane:'career', icon:'🚀',
      tag:{ro:'Pasul 8 · Carieră', en:'Step 8 · Career'},
      t:{ro:'Practica, supervizarea și cariera', en:'Practice, supervision and career'},
      d:{ro:'Logarea orelor, supervizare, nișă, portofoliu intern sau independent, reînnoire la 3 ani.',
         en:'Logging hours, supervision, niche, internal or independent portfolio, renewal every 3 years.'},
      why:{ro:'Certificarea este începutul, nu finalul. Fără practică logată și supervizare continuă, credenciala expiră și competența stagnează.',
           en:'The credential is the beginning, not the end. Without logged practice and ongoing supervision, the credential expires and competence stagnates.'},
      facts:{ro:['ICF: reînnoire la 3 ani (40 CCE, din care 10 în etică/competențe).','EMCC: reînnoire la 5 ani cu CPD + supervizare.','Supervizarea: spațiul în care îți examinezi practica, nu clientul.','Nișa: crește tariful și scade costul de marketing.'],
             en:['ICF: renewal every 3 years (40 CCE, 10 of them in ethics/competencies).','EMCC: renewal every 5 years with CPD + supervision.','Supervision: where you examine your practice, not your client.','A niche raises your rate and lowers your marketing cost.']},
      tip:{ro:'Majoritatea coachilor nu trăiesc din coaching în primele 18–24 de luni. Începe în paralel și validează piața înainte de a face saltul.',
           en:'Most coaches don\'t earn a living from coaching in the first 18–24 months. Start alongside your job and validate the market before you leap.'},
      links:[
        {ro:'Exemplu de parcurs 0 → PCC', en:'Example route 0 → PCC', href:'#journey'},
        {ro:'Costuri și timp', en:'Costs & time', href:'#costs'}
      ]
    }
  ];

  var LANE_LABEL = {
    learn:      { ro:'Înțelege',  en:'Understand' },
    practice:   { ro:'Aplică',    en:'Apply' },
    credential: { ro:'Certifică', en:'Certify' },
    career:     { ro:'Profesează',en:'Practise' }
  };

  /* ---------- ce ținem minte pe dispozitiv ---------- */
  var LS_KEY  = 'cp_map_done';   /* opririle parcurse */
  var LS_BIKE = 'cp_map_bike';   /* unde e bicicleta pe drum */
  var TOTAL   = ROADMAP.length;

  function loadDone(){
    try{ var v = JSON.parse(localStorage.getItem(LS_KEY) || '[]'); return Array.isArray(v) ? v : []; }
    catch(e){ return []; }
  }
  function saveDone(arr){ try{ localStorage.setItem(LS_KEY, JSON.stringify(arr)); }catch(e){} }
  function indexOfId(id){
    for(var i = 0; i < TOTAL; i++){ if(ROADMAP[i].id === id) return i; }
    return -1;
  }
  function loadBike(){
    try{
      var v = localStorage.getItem(LS_BIKE);
      return (v && indexOfId(v) > -1) ? v : null;
    }catch(e){ return null; }
  }
  function saveBike(id){ try{ localStorage.setItem(LS_BIKE, id); }catch(e){} }
  /* prima oprire nebifată pornind din poziția dată (o ia de la capăt dacă e nevoie) */
  function firstUnfinished(start){
    var d = loadDone(), i;
    for(i = start; i < TOTAL; i++){ if(d.indexOf(ROADMAP[i].id) === -1) return ROADMAP[i].id; }
    for(i = 0; i < start; i++){ if(d.indexOf(ROADMAP[i].id) === -1) return ROADMAP[i].id; }
    return null;
  }
  function currentBike(){ return loadBike() || firstUnfinished(0) || ROADMAP[0].id; }
  function routeFinished(){ return loadDone().length >= TOTAL; }
  function stopTitle(id){
    var n = ROADMAP.filter(function(x){ return x.id === id; })[0];
    return n ? L(n.t) : '';
  }
  function T(ro, en){ return L({ ro:ro, en:en }); }

  function L(v){
    if(v == null) return '';
    if(typeof v === 'string') return v;
    var l = (window.CLP && window.CLP.lang) ? window.CLP.lang() : 'ro';
    return v[l] || v.ro || '';
  }

  var current = null;      /* oprirea deschisă în popup */
  var lastFocus = null;    /* unde dăm focusul înapoi când închidem */

  /* ============================================================
     RANDARE: drumul, opririle, bicicleta
     ============================================================ */
  function render(){
    var host = document.getElementById('roadmap');
    if(!host) return;
    var done = loadDone();
    var bike = currentBike();

    host.innerHTML = ROADMAP.map(function(n, i){
      var row = Math.floor(i / 4) + 1;
      var col = (row === 1) ? (i + 1) : (8 - i);       /* șerpuitor: rândul 2 merge dreapta→stânga */
      var isDone = done.indexOf(n.id) > -1;
      var isHere = (bike === n.id);
      return '<button class="rm-node' + (isDone ? ' is-done' : '') + (isHere ? ' is-now' : '') + '"' +
             ' type="button" data-id="' + n.id + '" data-lane="' + n.lane + '"' +
             ' style="grid-row:' + row + ';grid-column:' + col + '"' +
             ' aria-controls="rmPanel" aria-expanded="' + (current === n.id ? 'true' : 'false') + '"' +
             (isHere ? ' aria-current="true"' : '') + '>' +
               '<span class="rm-step" aria-hidden="true">' + (isDone ? '✓' : (i + 1)) + '</span>' +
               (isHere ? '<span class="rm-here" aria-hidden="true"><span class="rm-bike">🚲</span>' + T('Ești aici', 'You are here') + '</span>' : '') +
               '<span class="rm-tag">' + L(n.tag) + '</span>' +
               '<span class="rm-ic" aria-hidden="true">' + n.icon + '</span>' +
               '<h4>' + L(n.t) + '</h4>' +
               '<p>' + L(n.d) + '</p>' +
             '</button>';
    }).join('');

    drawRoads();

    host.querySelectorAll('.rm-node').forEach(function(btn){
      btn.addEventListener('click', function(){ open(btn.dataset.id); });
    });

    /* după o re-randare (ex. schimbarea limbii) redeschidem oprirea selectată */
    if(current) open(current);

    renderJourney(bike);

    var meter = document.getElementById('rmMeter');
    if(meter) meter.textContent = done.length + '/' + TOTAL;

    var legend = document.getElementById('mapLegend');
    if(legend){
      var lanes = ['learn','practice','credential','career'];
      legend.innerHTML = lanes.map(function(k){
        return '<span><i style="background:var(--' + (k === 'learn' ? 'brand' : k === 'practice' ? 'teal' : k === 'credential' ? 'icf' : 'violet') + ')"></i>' + L(LANE_LABEL[k]) + '</span>';
      }).join('') + '<span style="margin-left:auto" class="text-muted">' +
        T('Dai click pe o oprire, apoi închizi fereastra și pedalezi mai departe 🚲', 'Click a stop, close the window and pedal on 🚲') + '</span>';
    }
  }

  /* bara drumului: unde ești, câte opriri sunt, înainte / înapoi */
  function renderJourney(bike){
    var host = document.getElementById('rmJourney');
    if(!host) return;
    var done = loadDone();
    var here = indexOfId(bike);
    var finished = routeFinished();
    host.innerHTML =
      '<div class="rj-left">' +
        '<span class="rj-bike" aria-hidden="true">🚲</span>' +
        '<span class="rj-txt">' + (finished
          ? T('Ai parcurs tot drumul. Bravo!', 'You completed the whole road. Well done!')
          : T('Oprirea', 'Stop') + ' <b>' + (here + 1) + '</b> ' + T('din', 'of') + ' ' + TOTAL) + '</span>' +
      '</div>' +
      '<div class="rj-dots" role="group" aria-label="' + T('Opririle drumului', 'Stops on the road') + '">' +
        ROADMAP.map(function(n, k){
          return '<button type="button" class="rj-dot' + (done.indexOf(n.id) > -1 ? ' done' : '') + (k === here ? ' now' : '') + '"' +
                 ' data-bike="' + n.id + '" aria-label="' + T('Oprirea ', 'Stop ') + (k + 1) + ': ' + L(n.t) + '"' +
                 (k === here ? ' aria-current="true"' : '') + '>' + (k + 1) + '</button>';
        }).join('') +
      '</div>' +
      '<div class="rj-actions">' +
        '<button type="button" class="btn btn-ghost btn-sm" data-move="prev"' + (here === 0 ? ' disabled' : '') + '>← ' + T('Înapoi', 'Back') + '</button>' +
        '<button type="button" class="btn btn-primary btn-sm" data-move="next"' + (here >= TOTAL - 1 ? ' disabled' : '') + '>' +
          T('Pedalează mai departe', 'Pedal on') + ' →</button>' +
      '</div>';

    host.querySelectorAll('[data-bike]').forEach(function(b){
      b.addEventListener('click', function(){ goTo(b.getAttribute('data-bike'), true); });
    });
    host.querySelectorAll('[data-move]').forEach(function(b){
      b.addEventListener('click', function(){
        var step = b.getAttribute('data-move') === 'next' ? 1 : -1;
        var k = indexOfId(currentBike()) + step;
        if(k < 0 || k > TOTAL - 1) return;
        goTo(ROADMAP[k].id, true);
      });
    });
  }

  /* mută bicicleta la o oprire (și, opțional, deschide imediat fereastra) */
  function goTo(id, openIt){
    if(indexOfId(id) < 0) return;
    saveBike(id);
    rideFx();
    render();
    if(openIt){
      setTimeout(function(){
        if(current) return;          /* dacă între timp a deschis altcineva ceva, nu-l deranjăm */
        open(id);
      }, 320);
    }
  }

  function rideFx(){
    var host = document.getElementById('roadmap');
    if(!host) return;
    host.classList.add('is-riding');
    setTimeout(function(){ host.classList.remove('is-riding'); }, 950);
  }

  /* ============================================================
     DRUMUL DESENAT (SVG) — trece prin fiecare oprire
     ============================================================ */
  function drawRoads(){
    var host = document.getElementById('roadmap');
    var svg = document.getElementById('rmRoads');
    if(!host || !svg) return;
    /* pe ecrane mici grila are o coloană, iar liniile deveneau zigzag peste carduri */
    if(svg.offsetParent === null || getComputedStyle(svg).display === 'none'){ svg.innerHTML = ''; return; }
    var nodes = Array.prototype.slice.call(host.querySelectorAll('.rm-node'));
    if(nodes.length < 2) return;
    var box = host.getBoundingClientRect();
    if(box.width < 2) return;

    var pts = nodes.map(function(n){
      var r = n.getBoundingClientRect();
      return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2, cy: r.top - box.top, node: n };
    });
    /* Ordinea vizuală se calculează din pozițiile reale, nu presupunând
       „8 noduri în 2 rânduri de 4”: pe tabletă grila are 2 coloane, iar
       vechea listă fixă desena linii care se încrucișau peste carduri. */
    var rows = [];
    pts.forEach(function(p){
      var row = rows.filter(function(r){ return Math.abs(r.y - p.cy) < 24; })[0];
      if(row) row.items.push(p);
      else rows.push({ y:p.cy, items:[p] });
    });
    rows.sort(function(a,b){ return a.y - b.y; });
    var order = [];
    rows.forEach(function(r, i){
      r.items.sort(function(a,b){ return a.x - b.x; });
      if(i % 2 === 1) r.items.reverse();      /* șerpuitor: rândurile pare merg invers */
      order = order.concat(r.items);
    });
    if(order.length < 2) return;

    var d = 'M' + order[0].x + ' ' + order[0].y;
    for(var i = 1; i < order.length; i++){
      var a = order[i - 1], b = order[i];
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      if(Math.abs(a.y - b.y) > Math.abs(a.x - b.x)){
        d += ' C' + a.x + ' ' + my + ',' + b.x + ' ' + my + ',' + b.x + ' ' + b.y;
      }else{
        d += ' C' + mx + ' ' + a.y + ',' + mx + ' ' + b.y + ',' + b.x + ' ' + b.y;
      }
    }
    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
    svg.innerHTML = '<path class="rm-road-line" d="' + d + '"/><path class="rm-road-dash" d="' + d + '"/>';
  }

  /* ============================================================
     POPUP-UL OPRIRII — se deschide la click, se închide și pleci mai departe
     ============================================================ */
  function open(id){
    var n = ROADMAP.filter(function(x){ return x.id === id; })[0];
    var panel = document.getElementById('rmPanel');
    if(!n || !panel) return;

    var host = document.getElementById('roadmap');
    /* focusul se întoarce pe cardul opririi, nu pe un element care dispare */
    var trigger = host ? host.querySelector('.rm-node[data-id="' + id + '"]') : null;
    lastFocus = (document.activeElement && document.activeElement.classList &&
                 document.activeElement.classList.contains('rm-node'))
      ? document.activeElement : trigger;
    current = id;

    if(host){
      host.querySelectorAll('.rm-node').forEach(function(x){
        x.classList.toggle('active', x.dataset.id === id);
        x.setAttribute('aria-expanded', x.dataset.id === id ? 'true' : 'false');
      });
    }

    var isDone = loadDone().indexOf(id) > -1;
    var isLast = indexOfId(id) === TOTAL - 1;

    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-modal','true');
    panel.setAttribute('aria-labelledby','rmTitle');
    panel.innerHTML =
      '<div class="rm-head">' +
        '<div class="rm-head-txt">' +
          '<span class="rm-tag" style="background:var(--surface-3);color:var(--muted)">' + L(n.tag) + '</span>' +
          '<h3 id="rmTitle">' + n.icon + ' ' + L(n.t) + '</h3>' +
          '<p class="text-muted">' + L(n.d) + '</p>' +
        '</div>' +
        '<button class="rm-close" id="rmClose" type="button" aria-label="' + T('Închide fereastra', 'Close the window') + '">✕</button>' +
      '</div>' +
      '<div class="rm-grid">' +
        '<div class="rm-box"><h5>' + T('De ce contează', 'Why it matters') + '</h5><p style="font-size:13px;color:var(--ink-2)">' + L(n.why) + '</p></div>' +
        '<div class="rm-box"><h5>' + T('Repere concrete', 'Concrete markers') + '</h5><ul>' +
          L(n.facts).map(function(f){ return '<li>' + f + '</li>'; }).join('') +
        '</ul></div>' +
      '</div>' +
      '<div class="rec" style="margin-top:16px"><b>💡 ' + T('De reținut', 'Remember') + ':</b> ' + L(n.tip) + '</div>' +
      '<div class="rm-foot">' +
        '<div class="rm-links">' +
          n.links.map(function(l){
            return '<a class="btn-mini" href="' + l.href + '">' + L({ ro:l.ro, en:l.en }) + ' →</a>';
          }).join('') +
        '</div>' +
        '<div class="rm-foot-btns">' +
          '<button type="button" class="btn btn-ghost btn-sm" id="rmCloseFoot">' + T('Închide', 'Close') + '</button>' +
          '<button type="button" class="btn btn-primary btn-sm" id="rmPedal">' +
            (isLast ? T('🎉 Încheie drumul', '🎉 Finish the road') : T('🚲 Am înțeles — pedalează mai departe', '🚲 Got it — pedal on')) +
          '</button>' +
        '</div>' +
      '</div>';

    panel.classList.add('open');
    var back = document.getElementById('rmBack');
    if(back) back.hidden = false;
    document.documentElement.classList.add('rm-open');

    var c1 = document.getElementById('rmClose');
    var c2 = document.getElementById('rmCloseFoot');
    var pedal = document.getElementById('rmPedal');
    if(c1) c1.addEventListener('click', function(){ closePopup(false); });
    if(c2) c2.addEventListener('click', function(){ closePopup(false); });
    if(pedal) pedal.addEventListener('click', function(){ markDone(id, true); });
    if(c1 && c1.focus){ try{ c1.focus({ preventScroll:true }); }catch(e){ c1.focus(); } }
  }

  function closePopup(advance){
    var panel = document.getElementById('rmPanel');
    if(!panel || !panel.classList.contains('open')) return;
    var from = current;
    panel.classList.remove('open');
    panel.removeAttribute('aria-modal');
    panel.innerHTML = '';
    var back = document.getElementById('rmBack');
    if(back) back.hidden = true;
    document.documentElement.classList.remove('rm-open');
    var host = document.getElementById('roadmap');
    if(host){
      host.querySelectorAll('.rm-node').forEach(function(x){
        x.classList.remove('active');
        x.setAttribute('aria-expanded','false');
      });
    }
    current = null;
    if(lastFocus && lastFocus.focus){ try{ lastFocus.focus({ preventScroll:true }); }catch(e){ lastFocus.focus(); } }
    lastFocus = null;
    if(advance && from) pedalOn(from);
  }

  /* după ce închizi fereastra, bicicleta pleacă la următoarea oprire nebifată */
  function pedalOn(fromId){
    var target = firstUnfinished(indexOfId(fromId) + 1);
    if(!target || target === fromId) return;
    saveBike(target);
    rideFx();
    render();
    if(window.CLP && window.CLP.toast){
      window.CLP.toast('🚲 ' + T('Următoarea oprire', 'Next stop') + ': ' + stopTitle(target));
    }
  }

  function markDone(id, thenAdvance){
    var done = loadDone();
    var i = done.indexOf(id);
    if(i > -1) done.splice(i, 1); else done.push(id);
    saveDone(done);
    if(window.CLP && window.CLP.toast){
      window.CLP.toast(i > -1
        ? T('Scos de pe drum', 'Removed from the road')
        : (routeFinished() ? T('🎉 Ai parcurs toate cele 8 opriri!', '🎉 You completed all 8 stops!')
                           : T('Bravo! Drumul continuă.', 'Nice! The road goes on.')));
    }
    if(thenAdvance){ closePopup(true); return; }
    render();
    open(id);
  }

  /* ============================================================
     PORNIRE
     ============================================================ */
  function initPopup(){
    var back = document.getElementById('rmBack');
    if(back) back.addEventListener('click', function(){ closePopup(false); });
    document.addEventListener('keydown', function(e){
      var panel = document.getElementById('rmPanel');
      if(!panel || !panel.classList.contains('open')) return;
      if(e.key === 'Escape' || e.key === 'Esc'){
        e.stopPropagation();
        closePopup(false);
        return;
      }
      if(e.key !== 'Tab') return;
      var f = panel.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
      if(!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    });
  }

  function boot(){
    initPopup();
    render();
    var t;
    window.addEventListener('resize', function(){
      clearTimeout(t);
      t = setTimeout(drawRoads, 120);
    });
    document.addEventListener('clp:lang', render);
    window.addEventListener('load', drawRoads);
    setTimeout(drawRoads, 400);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.Roadmap = { render: render, open: open, close: closePopup, data: ROADMAP, bike: currentBike };
})();
