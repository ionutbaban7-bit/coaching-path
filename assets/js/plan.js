/* ============================================================
   Coaching Learning Path — CONȚINUTUL PLANURILOR
   Bancă de întrebări (1:1) · grile de diagnostic (echipă) ·
   chestionar echipă · ateliere. Bilingv RO/EN, randat dinamic.
   Format pereche: [română, engleză]
   ============================================================ */
(function(){
  "use strict";

  var $  = function(s,r){ return (r||document).querySelector(s); };
  var $$ = function(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };
  function L(p){ var l = (window.CLP && window.CLP.lang) ? window.CLP.lang() : 'ro'; return p[(l === 'en') ? 1 : 0]; }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }

  /* ============================================================
     1. BANCA DE ÎNTREBĂRI — 8 categorii × 8 întrebări
     ============================================================ */
  var QB = [
    {
      id:'open', icon:'🌤️',
      t:['Deschidere','Opening'],
      d:['Primești omul, nu agenda. Întrebări neutre, care nu induc direcția.','You receive the person, not the agenda. Neutral questions that don’t steer direction.'],
      q:[
        ['Cu ce vii azi?','What are you bringing today?'],
        ['Ce s-a întâmplat de când n-am vorbit?','What has happened since we last spoke?'],
        ['Unde ești acum, într-un cuvânt?','Where are you right now, in one word?'],
        ['Ce ai vrea să se întâmple în următoarea oră?','What would you like to happen in the next hour?'],
        ['Ce nu ai apucat să spui data trecută?','What didn’t you get to say last time?'],
        ['Cum te simți când te gândești la asta?','How do you feel when you think about it?'],
        ['Ce e cel mai viu pentru tine acum?','What feels most alive for you right now?'],
        ['De unde vrei să începem?','Where would you like to start?']
      ],
      avoid:['Nu ești supărat că…?','Don’t you think you should…?']
    },
    {
      id:'clarify', icon:'🎯',
      t:['Clarificare & contractare','Clarifying & contracting'],
      d:['Transformi o plângere într-un obiectiv măsurabil.','Turn a complaint into a measurable objective.'],
      q:[
        ['Ce ar însemna, concret, că a mers?','What would "it worked" look like, concretely?'],
        ['După ce vei ști că am terminat de lucrat pe tema asta?','How will you know we’re done with this topic?'],
        ['Ce anume din situația asta depinde de tine?','What part of this situation depends on you?'],
        ['Care e miza reală aici, pentru tine?','What’s the real stake here, for you?'],
        ['Ce vrei să obții, nu să eviți?','What do you want to gain, not avoid?'],
        ['Dacă am rezolva doar 20% din asta, care ar fi acei 20%?','If we solved only 20% of this, which 20% would it be?'],
        ['Ce nu este negotiabil pentru tine aici?','What is non-negotiable for you here?'],
        ['Cât timp avem voie să petrecem pe subiectul ăsta?','How much time are we allowed to spend on this?']
      ],
      avoid:['Deci problema ta e clară: …','So your problem is clearly…']
    },
    {
      id:'deepen', icon:'🔍',
      t:['Aprofundare','Deepening'],
      d:['Întrebări scurte care coboară sub primul răspuns.','Short questions that go beneath the first answer.'],
      q:[
        ['Și ce altceva?','And what else?'],
        ['Ce se află sub asta?','What sits underneath that?'],
        ['Când ai simțit asta prima dată?','When did you first feel this?'],
        ['Ce nu spui despre asta?','What aren’t you saying about it?'],
        ['Dacă ai fi complet sincer, ce ai adăuga?','If you were completely honest, what would you add?'],
        ['Ce observi că simți acum, spunând asta?','What do you notice you feel, saying that?'],
        ['Unde anume în corp simți asta?','Where in your body do you feel it?'],
        ['Ce parte din tine se opune?','Which part of you objects?']
      ],
      avoid:['De ce?', 'Why?']  // sună a acuzare; se folosește „ce anume”
    },
    {
      id:'perspective', icon:'🔭',
      t:['Perspectivă','Perspective'],
      d:['Schimbări de poziție: viitorul tău, un coleg, persoana afectată.','Position shifts: your future self, a colleague, the person affected.'],
      q:[
        ['Ce ți-ar spune tu cel din urmă 5 ani?','What would the you of five years from now tell you?'],
        ['Dacă te-ai uita din exterior, ce ai vedea?','If you looked from the outside, what would you see?'],
        ['Ce ar spune cel mai bun prieten al tău că faci aici?','What would your best friend say you’re doing here?'],
        ['Ce ar spune persoana despre care vorbim?','What would the person we’re talking about say?'],
        ['Cum ar arăta situația dacă ai fi de partea cealaltă?','How would it look if you were on the other side?'],
        ['Ce ar face cineva pe care îl admiri?','What would someone you admire do?'],
        ['Dacă asta nu ar mai fi o problemă peste un an, ce s-a schimbat?','If this weren’t a problem a year from now, what changed?'],
        ['Ce variantă a poveștii nu ai luat în calcul?','Which version of the story haven’t you considered?']
      ],
      avoid:['Ai încercat să…?','Have you tried to…?']
    },
    {
      id:'values', icon:'🧭',
      t:['Valori și criterii','Values & criteria'],
      d:['Scot la suprafață criteriul interior al deciziei.','Surface the inner criterion behind the decision.'],
      q:[
        ['La ce nu ești dispus să renunți?','What won’t you give up?'],
        ['Ce contează cel mai mult pentru tine aici?','What matters most to you here?'],
        ['Dacă ai alege doar după tine, ce ai alege?','If you chose only for yourself, what would you choose?'],
        ['Ce preț ești dispus să plătești?','What price are you willing to pay?'],
        ['Care e criteriul după care vei decide?','What’s the criterion you’ll decide by?'],
        ['Ce ai regreta că n-ai făcut?','What would you regret not doing?'],
        ['Ce fel de persoană vrei să fii în situația asta?','What kind of person do you want to be in this situation?'],
        ['Când ai fost cel mai mândru de tine?','When were you proudest of yourself?']
      ],
      avoid:['Nu ar trebui să…?','Shouldn’t you…?']
    },
    {
      id:'obstacles', icon:'🧱',
      t:['Obstacole și resurse','Obstacles & resources'],
      d:['Anticipează blocajele și găsește primul micro-pas.','Anticipate blockers and find the first micro-step.'],
      q:[
        ['Ce te-ar putea opri?','What could stop you?'],
        ['Ce te-a oprit până acum?','What has stopped you so far?'],
        ['De ce resurse ai nevoie?','What resources do you need?'],
        ['Cine te poate ajuta cu asta?','Who could help you with this?'],
        ['Ce e deja în favoarea ta?','What is already in your favour?'],
        ['Care e cel mai mic pas posibil?','What is the smallest possible step?'],
        ['Ce ai făcut deja și a funcționat?','What have you already done that worked?'],
        ['Dacă obstacolul ăsta ar dispărea mâine, ce ai face?','If this obstacle vanished tomorrow, what would you do?']
      ],
      avoid:['Ai putea să…? (sfat deghizat)','You could always… (advice in disguise)']
    },
    {
      id:'action', icon:'✅',
      t:['Responsabilitate','Accountability'],
      d:['Din insight în acțiune: dată, dovadă, martor.','From insight to action: date, evidence, witness.'],
      q:[
        ['Ce vei face concret?','What exactly will you do?'],
        ['Când, în calendar?','When, in the calendar?'],
        ['Cum vei ști că ai făcut-o?','How will you know you’ve done it?'],
        ['Pe o scală 1–10, cât de probabil e să o faci?','On a scale of 1–10, how likely are you to do it?'],
        ['Ce te-ar urca cu un punct?','What would move you up one point?'],
        ['Cine află despre angajamentul ăsta?','Who will know about this commitment?'],
        ['Ce faci dacă apare ceva neprevăzut?','What will you do if something unexpected comes up?'],
        ['Cu ce te angajezi, nu ce intenționezi?','What do you commit to, not intend to do?']
      ],
      avoid:['Promiți că încerci?','Do you promise you’ll try?']
    },
    {
      id:'close', icon:'🌅',
      t:['Închidere & integrare','Closing & integration'],
      d:['Bilanțul de sesiune: ce duce clientul mai departe.','The session review: what the client carries forward.'],
      q:[
        ['Cu ce rămâi din sesiunea asta?','What are you leaving with from this session?'],
        ['Ce vezi acum și nu vedeai la început?','What do you see now that you didn’t at the start?'],
        ['Ce a fost cel mai util pentru tine azi?','What was most useful for you today?'],
        ['Ce nu a funcționat pentru tine?','What didn’t work for you?'],
        ['Ce ai vrea să explorăm data viitoare?','What would you like to explore next time?'],
        ['Ce vei face diferit începând de mâine?','What will you do differently starting tomorrow?'],
        ['Cum vrei să-ți amintești discuția asta?','How do you want to remember this conversation?'],
        ['Mai e ceva nespus?','Is there anything left unsaid?']
      ],
      avoid:['Deci am stabilit că… (în loc să rezume clientul)','So we agreed that… (instead of the client summarising)']
    }
  ];

  /* ============================================================
     2. DIAGNOSTIC ECHIPĂ — grilă de interviu 1:1
     ============================================================ */
  var TEAM_INTERVIEW = [
    ['Care e, pentru tine, scopul echipei în 6 luni?','For you, what is the team’s purpose six months from now?'],
    ['Ce funcționează cel mai bine aici?','What works best here?'],
    ['Ce vă încetinește cel mai mult?','What slows you down the most?'],
    ['Unde se blochează deciziile?','Where do decisions get stuck?'],
    ['Ce discuții se poartă pe hol, nu în sală?','Which conversations happen in the corridor, not in the room?'],
    ['Dacă ai putea schimba un singur lucru, care ar fi?','If you could change one thing, what would it be?'],
    ['Cum știți că ați avut succes împreună?','How do you know you’ve succeeded together?'],
    ['Ce ți-e teamă să spui și nu spui?','What are you afraid to say and don’t say?']
  ];

  /* ============================================================
     3. CHESTIONAR ECHIPĂ — 12 itemi, 4 dimensiuni, scară 1–5
     ============================================================ */
  var TEAM_SURVEY = [
    { dim:['Siguranță psihologică','Psychological safety'], items:[
      ['Pot să spun ce gândesc fără teama de consecințe.','I can say what I think without fear of consequences.'],
      ['Greșelile sunt discutate deschis, nu ascunse.','Mistakes are discussed openly, not hidden.'],
      ['Pot să pun întrebări „prostești” aici.','I can ask "silly" questions here.']
    ]},
    { dim:['Încredere','Trust'], items:[
      ['Colegii își respectă angajamentele.','Colleagues keep their commitments.'],
      ['Am încredere că ceilalți vor binele echipei.','I trust that others want the team’s good.'],
      ['Pot să cer ajutor fără să par slab.','I can ask for help without looking weak.']
    ]},
    { dim:['Claritate','Clarity'], items:[
      ['Știu exact ce se așteaptă de la mine.','I know exactly what is expected of me.'],
      ['Rolurile și responsabilitățile sunt clare.','Roles and responsibilities are clear.'],
      ['Obiectivele echipei sunt măsurabile.','The team’s objectives are measurable.']
    ]},
    { dim:['Conflict & decizii','Conflict & decisions'], items:[
      ['Dezacordurile sunt discutate, nu evitate.','Disagreements are discussed, not avoided.'],
      ['Deciziile se iau la cel mai potrivit nivel.','Decisions are made at the right level.'],
      ['Odată decis, toți susțin decizia.','Once decided, everyone backs the decision.']
    ]}
  ];

  /* ============================================================
     4. GRILĂ DE OBSERVAȚIE ÎN ȘEDINȚE
     ============================================================ */
  var OBS_GRID = [
    ['Participare','Participation', 'Cine vorbește cel mai mult? Cine tace tot timpul? Cine întrerupe?'],
    ['Calitatea ascultării','Quality of listening', 'Se răspunde la ce s-a spus sau se trece la următorul punct?'],
    ['Modul de decizie','Decision mode', 'Cine decide? Se decide explicit sau prin tăcere?'],
    ['Gestionarea dezacordului','Handling disagreement', 'Conflictul apare în sală sau după? Cum se încheie?'],
    ['Energia','Energy', 'Unde crește și unde cade energia în ședință? Cine o ridică?'],
    ['Urmărirea','Follow-through', 'Cine notează deciziile? Cine verifică ce s-a făcut?']
  ];

  /* ============================================================
     5. ATELIERE — design de intervenție
     ============================================================ */
  var WORKSHOPS = [
    {
      n:1,
      t:['Kick-off & contract de echipă','Kick-off & team contract'],
      w:['Săptămâna 6','Week 6'],
      dur:['3 ore','3 hours'],
      o:['Echipa își asumă temele de lucru și regulile de colaborare.','The team owns its working themes and collaboration rules.'],
      steps:[
        ['Restituirea diagnosticului (date agregate, fără surse)','Feedback of the diagnosis (aggregated data, no attribution)'],
        ['Reacții: ce recunosc, ce îi surprinde','Reactions: what they recognise, what surprises them'],
        ['Alegerea a 2–3 teme prioritare','Choosing 2–3 priority themes'],
        ['Definirea regulilor de lucru proprii','Defining their own working rules'],
        ['Stabilirea ritmului și a responsabililor','Setting the rhythm and the owners']
      ],
      m:['Raport de diagnostic (printat), post-it-uri, tablă','Diagnostic report (printed), sticky notes, whiteboard']
    },
    {
      n:2,
      t:['Claritate și roluri','Clarity & roles'],
      w:['Luna 3','Month 3'],
      dur:['3,5 ore','3.5 hours'],
      o:['Scop comun, responsabilități și criterii de decizie explicite.','Shared purpose, explicit responsibilities and decision criteria.'],
      steps:[
        ['Scopul echipei într-o singură frază','The team’s purpose in one sentence'],
        ['Harta responsabilităților (cine decide, cine execută, cine consultă)','Responsibility map (who decides, who executes, who is consulted)'],
        ['Cele 3 decizii blocate și deblocarea lor','The 3 stuck decisions and how to unblock them'],
        ['Reguli de escaladare','Escalation rules'],
        ['Angajamente pentru următoarele 30 de zile','Commitments for the next 30 days']
      ],
      m:['Matrice RACI printată, cronometru','Printed RACI matrix, timer']
    },
    {
      n:3,
      t:['Conflict și încredere','Conflict & trust'],
      w:['Luna 4','Month 4'],
      dur:['4 ore','4 hours'],
      o:['Tensiunile reale intră în sală, cu reguli clare.','Real tensions enter the room, with clear rules.'],
      steps:[
        ['Reguli de siguranță pentru discuție','Safety rules for the conversation'],
        ['Fiecare spune ce îl încurcă, fără „tu”','Each person names what gets in the way, without "you"'],
        ['Tema comună de sub conflicte','The shared theme beneath the conflicts'],
        ['Ce schimbă fiecare, nu ce schimbă ceilalți','What each will change, not what others should change'],
        ['Ritual de verificare la 30 de zile','A 30-day check ritual']
      ],
      m:['Sala fără întreruperi, acord de confidențialitate','Uninterrupted room, confidentiality agreement']
    },
    {
      n:4,
      t:['Bilanț și viitor','Review & future'],
      w:['Luna 6','Month 6'],
      dur:['3 ore','3 hours'],
      o:['Ce păstrează echipa după plecarea coach-ului.','What the team keeps after the coach leaves.'],
      steps:[
        ['Re-diagnostic: aceiași indicatori, aceleași întrebări','Re-diagnosis: same indicators, same questions'],
        ['Ce s-a schimbat cu adevărat (dovezi, nu impresii)','What has actually changed (evidence, not impressions)'],
        ['Ce nu s-a schimbat și de ce','What hasn’t changed and why'],
        ['Cine ține procesul mai departe','Who holds the process from here'],
        ['Încheierea formală a contractului','Formal closure of the contract']
      ],
      m:['Raport comparativ baseline vs. acum','Baseline vs. now comparison report']
    }
  ];

  /* ============================================================
     RANDARE
     ============================================================ */
  function renderQB(){
    var host = $('#qbGrid');
    if(!host) return;
    var q = ($('#qbSearch') && $('#qbSearch').value || '').trim().toLowerCase();
    var cat = $('#qbCats') ? ($('#qbCats').dataset.cat || 'all') : 'all';

    host.innerHTML = QB.filter(function(c){
      return (cat === 'all' || c.id === cat);
    }).map(function(c){
      var items = c.q.filter(function(p){
        return !q || p[0].toLowerCase().indexOf(q) > -1 || p[1].toLowerCase().indexOf(q) > -1;
      });
      if(q && !items.length) return '';
      return '<div class="qb-cat reveal in">' +
        '<div class="qb-head">' +
          '<span class="rm-ic" style="background:var(--brand-soft)">' + c.icon + '</span>' +
          '<div><h4>' + L(c.t) + '</h4><p>' + L(c.d) + '</p></div>' +
          '<span class="tag tag-gray">' + items.length + '</span>' +
        '</div>' +
        '<ol class="qb-list">' + items.map(function(p){
          return '<li>' + esc(L(p)) + '</li>';
        }).join('') + '</ol>' +
        '<div class="qb-avoid"><b>⚠ ' + L(['De evitat','Avoid']) + ':</b> ' + esc(L(c.avoid)) + '</div>' +
      '</div>';
    }).join('') || '<p class="text-muted">' + L(['Niciun rezultat.','No results.']) + '</p>';
  }

  function renderQbCats(){
    var host = $('#qbCats');
    if(!host) return;
    var cat = host.dataset.cat || 'all';
    host.innerHTML =
      '<button class="fchip' + (cat === 'all' ? ' active' : '') + '" data-qc="all">' + L(['Toate','All']) + '</button>' +
      QB.map(function(c){
        return '<button class="fchip' + (cat === c.id ? ' active' : '') + '" data-qc="' + c.id + '">' + c.icon + ' ' + L(c.t) + '</button>';
      }).join('');
    $$('#qbCats [data-qc]').forEach(function(b){
      b.addEventListener('click', function(){
        host.dataset.cat = b.dataset.qc;
        renderQbCats(); renderQB();
      });
    });
  }

  function renderInterview(){
    var host = $('#diagInterview');
    if(!host) return;
    host.innerHTML = '<ol class="qb-list plan-list">' + TEAM_INTERVIEW.map(function(p){
      return '<li>' + esc(L(p)) + '</li>';
    }).join('') + '</ol>' +
    '<div class="qb-avoid"><b>💡 ' + L(['Regulă','Rule']) + ':</b> ' +
      L(['aceleași 8 întrebări pentru toți, în aceeași ordine, cu garanția confidențialității; temele se agregă, nu se atribuie.',
         'the same 8 questions for everyone, in the same order, with guaranteed confidentiality; themes are aggregated, never attributed.']) +
    '</div>';
  }

  function renderSurvey(){
    var host = $('#diagSurvey');
    if(!host) return;
    host.innerHTML = TEAM_SURVEY.map(function(g, gi){
      return '<div class="qb-cat reveal in">' +
        '<div class="qb-head"><span class="rm-ic" style="background:var(--teal-soft)">' + (gi + 1) + '</span>' +
          '<div><h4>' + L(g.dim) + '</h4></div>' +
          '<span class="tag tag-gray">' + g.items.length + '</span>' +
        '</div>' +
        '<div class="scale-head"><span>1 — ' + L(['deloc de acord','strongly disagree']) + '</span><span>5 — ' + L(['total de acord','strongly agree']) + '</span></div>' +
        '<ul class="survey-items">' + g.items.map(function(p){
          return '<li><span>' + esc(L(p)) + '</span><span class="scale">1 2 3 4 5</span></li>';
        }).join('') + '</ul>' +
      '</div>';
    }).join('');
  }

  function renderObs(){
    var host = $('#diagObserve');
    if(!host) return;
    host.innerHTML = '<table class="plan-table"><thead><tr><th>' + L(['Dimensiune','Dimension']) + '</th><th>' +
      L(['Ce urmărești concret','What you actually look for']) + '</th><th style="width:110px">' + L(['Notițe','Notes']) + '</th></tr></thead><tbody>' +
      OBS_GRID.map(function(r){
        return '<tr><td><b>' + L([r[0], r[1]]) + '</b></td><td>' + esc(r[2]) + '</td><td class="empty">—</td></tr>';
      }).join('') + '</tbody></table>' +
      '<div class="qb-avoid"><b>💡 ' + L(['Regulă','Rule']) + ':</b> ' +
        L(['observi minim două ședințe reale înainte de orice concluzie; notezi fapte, nu interpretări.',
           'observe at least two real meetings before any conclusion; note facts, not interpretations.']) +
      '</div>';
  }

  function renderWorkshops(){
    var host = $('#workshopList');
    if(!host) return;
    host.innerHTML = WORKSHOPS.map(function(w){
      return '<div class="plan-block reveal in">' +
        '<div class="ws-head">' +
          '<span class="ws-num">' + w.n + '</span>' +
          '<div style="flex:1"><h3 style="font-size:17px">' + L(w.t) + '</h3>' +
            '<div class="ws-meta">' +
              '<span class="tag tag-gray">' + L(w.w) + '</span>' +
              '<span class="tag tag-brandish">' + L(w.dur) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<p class="intro" style="margin:14px 0 16px">' + L(w.o) + '</p>' +
        '<ol class="model-list">' + w.steps.map(function(s){ return '<li>' + esc(L(s)) + '</li>'; }).join('') + '</ol>' +
        '<div class="qb-avoid" style="margin-top:14px"><b>🧰 ' + L(['Materiale','Materials']) + ':</b> ' + esc(L(w.m)) + '</div>' +
      '</div>';
    }).join('');
  }

  function boot(){
    renderQbCats(); renderQB();
    renderInterview(); renderSurvey(); renderObs(); renderWorkshops();

    var s = $('#qbSearch');
    if(s) s.addEventListener('input', renderQB);

    document.addEventListener('clp:lang', function(){
      renderQbCats(); renderQB();
      renderInterview(); renderSurvey(); renderObs(); renderWorkshops();
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.PLAN = { QB:QB, TEAM_INTERVIEW:TEAM_INTERVIEW, TEAM_SURVEY:TEAM_SURVEY, WORKSHOPS:WORKSHOPS, render:boot };
})();
