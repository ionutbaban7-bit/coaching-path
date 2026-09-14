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

  var LS_KEY = 'cp_map_done';
  function loadDone(){
    try{ return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }catch(e){ return []; }
  }
  function saveDone(arr){
    try{ localStorage.setItem(LS_KEY, JSON.stringify(arr)); }catch(e){}
  }

  function L(v){
    if(v == null) return '';
    if(typeof v === 'string') return v;
    var l = (window.CLP && window.CLP.lang) ? window.CLP.lang() : 'ro';
    return v[l] || v.ro || '';
  }

  var current = null;

  function render(){
    var host = document.getElementById('roadmap');
    var panel = document.getElementById('rmPanel');
    var wrap = document.getElementById('mapShell');
    if(!host) return;
    var done = loadDone();

    host.innerHTML = ROADMAP.map(function(n, i){
      var row = Math.floor(i / 4) + 1;
      var col = (row === 1) ? (i + 1) : (8 - i);       // șerpuitor: rândul 2 merge dreapta→stânga
      return '<button class="rm-node" type="button" data-id="' + n.id + '" data-lane="' + n.lane + '"' +
             ' style="grid-row:' + row + ';grid-column:' + col + '"' +
             ' aria-controls="rmPanel" aria-expanded="' + (current === n.id ? 'true' : 'false') + '">' +
               '<span class="rm-step" aria-hidden="true">' + (done.indexOf(n.id) > -1 ? '✓' : (i + 1)) + '</span>' +
               '<span class="rm-tag">' + L(n.tag) + '</span>' +
               '<span class="rm-ic" aria-hidden="true">' + n.icon + '</span>' +
               '<h4>' + L(n.t) + '</h4>' +
               '<p>' + L(n.d) + '</p>' +
             '</button>';
    }).join('');

    // conectori SVG
    drawRoads();

    host.querySelectorAll('.rm-node').forEach(function(btn){
      btn.addEventListener('click', function(){ open(btn.dataset.id); });
    });

    // după o re-randare (ex. schimbarea limbii) redeschidem oprirea selectată,
    // altfel panoul rămânea cu textul în limba veche
    if(current) open(current);

    // contor progres
    var meter = document.getElementById('rmMeter');
    if(meter) meter.textContent = done.length + '/8';

    // legendă
    var legend = document.getElementById('mapLegend');
    if(legend){
      var lanes = ['learn','practice','credential','career'];
      legend.innerHTML = lanes.map(function(k){
        return '<span><i style="background:var(--' + (k === 'learn' ? 'brand' : k === 'practice' ? 'teal' : k === 'credential' ? 'icf' : 'violet') + ')"></i>' + L(LANE_LABEL[k]) + '</span>';
      }).join('') + '<span style="margin-left:auto" class="text-muted">' + L({ro:'Apasă orice oprire pentru detalii', en:'Tap any stop for details'}) + '</span>';
    }
  }

  function drawRoads(){
    var host = document.getElementById('roadmap');
    var svg = document.getElementById('rmRoads');
    if(!host || !svg) return;
    // pe ecrane mici grila are o coloană, iar liniile deveneau zigzag peste carduri
    if(svg.offsetParent === null || getComputedStyle(svg).display === 'none'){ svg.innerHTML = ''; return; }
    var nodes = Array.prototype.slice.call(host.querySelectorAll('.rm-node'));
    if(nodes.length < 2) return;
    var box = host.getBoundingClientRect();
    if(box.width < 2) return;

    var pts = nodes.map(function(n){
      var r = n.getBoundingClientRect();
      return {
        x: r.left - box.left + r.width / 2,
        y: r.top - box.top + r.height / 2,
        cy: r.top - box.top,            // pentru gruparea pe rânduri
        node: n
      };
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
      if(i % 2 === 1) r.items.reverse();      // șerpuitor: rândurile pare merg invers
      order = order.concat(r.items);
    });
    if(order.length < 2) return;

    var d = 'M' + order[0].x + ' ' + order[0].y;
    for(var i = 1; i < order.length; i++){
      var a = order[i - 1], b = order[i];
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      if(Math.abs(a.y - b.y) > Math.abs(a.x - b.x)){
        d += ' C' + a.x + ' ' + my + ',' + b.x + ' ' + my + ',' + b.x + ' ' + b.y;  // coborâre lină
      }else{
        d += ' C' + mx + ' ' + a.y + ',' + mx + ' ' + b.y + ',' + b.x + ' ' + b.y;  // lateral
      }
    }
    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
    svg.innerHTML = '<path d="' + d + '"/>';
  }

  function open(id){
    var n = ROADMAP.filter(function(x){ return x.id === id; })[0];
    var panel = document.getElementById('rmPanel');
    if(!n || !panel) return;
    current = id;
    var host = document.getElementById('roadmap');

    host.querySelectorAll('.rm-node').forEach(function(x){
      x.classList.toggle('active', x.dataset.id === id);
      x.setAttribute('aria-expanded', x.dataset.id === id ? 'true' : 'false');
    });

    panel.setAttribute('aria-label', L({ro:'Detalii oprire', en:'Stop details'}));
    panel.innerHTML =
      '<div class="rm-head">' +
        '<span class="rm-tag" style="background:var(--surface-3);color:var(--muted)">' + L(n.tag) + '</span>' +
        '<h3>' + L(n.t) + '</h3>' +
        '<p class="text-muted" style="margin-top:6px">' + L(n.d) + '</p>' +
      '</div>' +
      '<div class="rm-grid">' +
        '<div class="rm-box"><h5>' + L({ro:'De ce contează', en:'Why it matters'}) + '</h5><p style="font-size:13px;color:var(--ink-2)">' + L(n.why) + '</p></div>' +
        '<div class="rm-box"><h5>' + L({ro:'Repere concrete', en:'Concrete markers'}) + '</h5><ul>' +
          L(n.facts).map(function(f){ return '<li>' + f + '</li>'; }).join('') +
        '</ul></div>' +
      '</div>' +
      '<div class="rec" style="margin-top:16px"><b>💡 ' + L({ro:'De reținut', en:'Remember'}) + ':</b> ' + L(n.tip) + '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px">' +
        n.links.map(function(l){
          return '<a class="btn-mini" href="' + l.href + '">' + L({ ro:l.ro, en:l.en }) + ' →</a>';
        }).join('') +
        '<button class="btn-mini" id="rmDone" style="margin-left:auto">' +
          (loadDone().indexOf(id) > -1
            ? '✓ ' + L({ro:'Parcurs — anulează', en:'Done — undo'})
            : L({ro:'Marchează ca parcurs', en:'Mark as done'})) +
        '</button>' +
      '</div>';
    panel.classList.add('open');

    document.getElementById('rmDone').addEventListener('click', function(){
      var done = loadDone();
      var i = done.indexOf(id);
      if(i > -1) done.splice(i, 1); else done.push(id);
      saveDone(done);
      render();      // re-randează nodurile (apare bifa ✓)
      open(id);      // re-randează panoul (eticheta butonului se actualizează)
      window.CLP && window.CLP.toast && window.CLP.toast(
        i > -1 ? L({ro:'Scos de pe hartă', en:'Removed from map'}) : L({ro:'Bravo! Următorul pas e mai clar.', en:'Nice! The next step is clearer.'})
      );
    });
  }

  function boot(){
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

  window.Roadmap = { render: render, open: open, data: ROADMAP };
})();
