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
      t:{ro:'Cât timp poți aloca formării?', en:'How much time can you give to training?'},
      help:{ro:'Ritmul schimbă traseul, nu nivelul final.', en:'Pace changes the route, not the final level.'},
      opts:[
        { v:'fast', t:{ro:'Intensiv — câteva luni', en:'Intensive — a few months'} },
        { v:'normal', t:{ro:'Normal — 6 până la 12 luni', en:'Normal — 6 to 12 months'} },
        { v:'slow', t:{ro:'În ritm propriu — 1–2 ani', en:'Own pace — 1–2 years'} }
      ] },
    { id:'budget',
      t:{ro:'Ce buget ai pentru formare?', en:'What budget do you have for training?'},
      help:{ro:'Bugetul decide ruta, nu valoarea ta ca coach.', en:'Budget decides the route, not your worth as a coach.'},
      opts:[
        { v:'small', t:{ro:'Sub 1.500 € — vreau să încep ieftin', en:'Under €1,500 — start lean'} },
        { v:'mid', t:{ro:'1.500–4.000 € — pot lua un program ICF Level 1', en:'€1,500–4,000 — can take an ICF Level 1 program'} },
        { v:'high', t:{ro:'Peste 4.000 € — investesc serios din start', en:'Over €4,000 — investing seriously from the start'} }
      ] }
  ];

  /* ============================================================
     2. CEI 10 PAȘI
     ============================================================ */
  var STEPS = [
    /* ---------- 1 ---------- */
    {
      id:'s1', icon:'💡', min:4,
      t:{ro:'Ce este, de fapt, coachingul', en:'What coaching actually is'},
      sub:{ro:'Definiția oficială, cei 4 „vecini” cu care se confundă și testul de 10 secunde.',
           en:'The official definition, the 4 neighbours it gets confused with, and the 10-second test.'},
      learn:{ro:['Știi să explici coachingul în două fraze, fără jargon','Recunoști ce NU este coaching','Ai un test rapid: „e coaching sau nu?”'],
             en:['You can explain coaching in two sentences, without jargon','You can spot what is NOT coaching','You have a quick test: “coaching or not?”']},
      blocks:[
        { t:{ro:'Definiția ICF, pe scurt', en:'The ICF definition, short'},
          d:{ro:'„Parteneriat cu clientul, într-un proces care provoacă gândirea și creativitatea, pentru a-l inspira să își maximizeze potențialul personal și profesional.” Traduit: tu ești expertul pe viața și munca ta, coach-ul este expertul pe proces.',
             en:'“Partnering with clients in a thought-provoking and creative process that inspires them to maximise their personal and professional potential.” In plain words: you are the expert on your life and work, the coach is the expert on process.'} },
        { t:{ro:'Mecanismul care schimbă totul', en:'The mechanism that changes everything'},
          d:{ro:'Clientul aduce agenda, coach-ul ține cadrul. Rezultatul nu este un sfat, ci o decizie asumată și un plan cu primul pas stabilit. De aceea coachingul cere întrebări bune, tăcere și ascultare — nu experiență de viață spectaculoasă.',
             en:'The client brings the agenda, the coach holds the frame. The output is not advice, but an owned decision and a plan with a first step. That is why coaching needs good questions, silence and listening — not a spectacular life story.'} },
        { t:{ro:'Cei patru „vecini”', en:'The four neighbours'},
          list:true,
          d:{ro:['Terapia privește în trecut și tratează suferința.','Consultanța îți dă expertiza și soluția.','Mentoringul transferă experiența cuiva care a trecut deja pe acolo.','Trainingul predă o competență standardizată.','Coachingul lucrează pe prezent → viitor, pe agenda ta.'],
             en:['Therapy looks back and treats suffering.','Consulting hands over expertise and the answer.','Mentoring transfers the experience of someone who walked the path.','Training teaches a standardised skill.','Coaching works present → future, on your agenda.']} },
        { t:{ro:'De unde vine', en:'Where it comes from'},
          d:{ro:'Din sport și performanță: Timothy Gallwey a formulat „jocul interior” (1974), iar Sir John Whitmore a transformat ideile în modelul GROW și în cartea care a definit meseria. În anii 1990, coachingul a intrat în companii; ICF s-a înființat în 1995 și a standardizat tot ce urmează în pașii următori.',
             en:'From sport and performance: Timothy Gallwey formulated the “inner game” (1974) and Sir John Whitmore turned those ideas into the GROW model and the book that defined the profession. In the 1990s coaching entered companies; ICF was founded in 1995 and standardised everything you will learn in the next steps.'} }
      ],
      action:{ro:'Scrie, în 3 rânduri, pentru ce ai vrea tu să lucrezi cu un coach (nu cu un consultant). Dacă îți iese o cerere de sfat, reformulează până devine o întrebare despre tine.',
              en:'Write 3 lines about what you would want to work on with a coach (not a consultant). If it comes out as a request for advice, rewrite it until it becomes a question about yourself.'},
      quiz:{
        q:{ro:'Un client vine cu simptome de anxietate clinică și spune că „vrea coaching ca să scape de ele”. Care e răspunsul corect?',
           en:'A client shows up with clinical anxiety symptoms and says they “want coaching to get rid of them”. What is the right response?'},
        opts:[
          { t:{ro:'Continui cu ședințe de coaching — claritatea ajută în orice situație', en:'Go ahead with coaching sessions — clarity always helps'},
            why:{ro:'Nu. Coachingul nu tratează și nu înlocuiește un specialist. Poți agrava situația și ieși din competență.', en:'No. Coaching does not treat and does not replace a specialist. You can make it worse and step outside your competence.'} },
          { t:{ro:'Explici limita, îndrumi către un profesionist în sănătate mentală și, dacă e cazul, reiei coachingul în paralel', en:'Explain the limit, refer to a mental-health professional and, if appropriate, resume coaching alongside'}, ok:true,
            why:{ro:'Corect. Coachingul poate coexista cu terapia, dar nu o înlocuiește — iar decizia se ia cu un specialist.', en:'Correct. Coaching can coexist with therapy but never replaces it — and that call belongs to a specialist.'} },
          { t:{ro:'Îi dai sfaturi din propria experiență, ca să economisești timp', en:'Give advice from your own experience to save time'},
            why:{ro:'Nu. Sfatul te scoate din rolul de coach și te transformă în mentor/consultant fără mandat.', en:'No. Giving advice takes you out of the coaching role and turns you into an unmandated mentor/consultant.'} }
        ]
      },
      links:[{l:{ro:'Teoria completă', en:'Full theory'}, h:'teorie.html#ce-este'}, {l:{ro:'Ce NU este coachingul', en:'What coaching is not'}, h:'teorie.html#nu-este'}]
    },

    /* ---------- 2 ---------- */
    {
      id:'s2', icon:'🧭', min:5,
      t:{ro:'Unde se aplică și cât de mare e piața', en:'Where it is used and how big the market is'},
      sub:{ro:'Opt contexte reale, cifrele industriei și zonele în care coachingul NU intră.',
           en:'Eight real contexts, industry numbers, and the areas where coaching must not go.'},
      learn:{ro:['Numești 8 contexte de aplicare','Știi cifrele pieței mondiale (verificate 2025–2026)','Cunoști limitele: unde coachingul nu are ce căuta'],
             en:['You can name 8 contexts','You know the global market numbers (verified 2025–2026)','You know the limits: where coaching has no business']},
      blocks:[
        { t:{ro:'Cele opt contexte', en:'The eight contexts'},
          list:true,
          d:{ro:['Executive & leadership — tranziții de rol, decizii dificile, prezență executivă.','Career — reconversie, negociere, claritate profesională.','Coaching de echipă — aliniere, conflict, performanță colectivă (disciplină separată, cu certificare proprie).','Life — relații, energie, priorități, identitate.','Sănătate & wellbeing — schimbare de stil de viață, burnout (în zona de sănătate, doar alături de specialiști).','Educație — elevi, profesori, directori de școală.','Sport & performanță — domeniul din care vine meseria.','Antreprenoriat & business — strategie personală, echipă fondatoare, decizii sub presiune.'],
             en:['Executive & leadership — role transitions, hard decisions, executive presence.','Career — retraining, negotiation, professional clarity.','Team coaching — alignment, conflict, collective performance (a separate discipline with its own credential).','Life — relationships, energy, priorities, identity.','Health & wellbeing — lifestyle change, burnout (in health, only alongside specialists).','Education — pupils, teachers, school leaders.','Sport & performance — the field the profession came from.','Entrepreneurship & business — personal strategy, founding team, decisions under pressure.']} },
        { t:{ro:'Cifrele pieței (ICF Global Coaching Study, 2025)', en:'Market numbers (ICF Global Coaching Study, 2025)'},
          d:{ro:'122.974 de practicieni ai coachingului în lume (+13% față de ediția anterioară), venituri anuale de 5,34 miliarde de dolari (+17%), tarif mediu de 234 $ pe sesiune (297 $ în America de Nord). Meseria crește, dar crește și concurența: diferența o face specializarea, nu diploma.',
             en:'122,974 coach practitioners worldwide (+13% vs the previous edition), $5.34 billion in annual revenue (+17%), average fee of $234 per session ($297 in North America). The profession is growing — so is competition: specialisation, not the certificate, makes the difference.'} },
        { t:{ro:'Unde NU intră coachingul', en:'Where coaching must not go'},
          list:true,
          d:{ro:['Tulburări clinice, traume, dependențe — intră specialiștii.','Decizii medicale, legale sau fiscale — nu ești consultant în acele domenii.','Evaluări de performanță și decizii de personal — conflict de rol.','Criză acută (sănătate, siguranță, abuz) — alt tip de ajutor, imediat.'],
             en:['Clinical conditions, trauma, addiction — that is for specialists.','Medical, legal or tax decisions — you are not a consultant in those fields.','Performance appraisals and HR decisions — role conflict.','Acute crisis (health, safety, abuse) — a different kind of help, immediately.']} }
      ],
      action:{ro:'Alege contextul care ți se potrivește cel mai bine (unde ai deja credibilitate) și notează-l. Vei avea nevoie de el la pasul 8, când compari școli.',
              en:'Pick the context that fits you best (where you already have credibility) and write it down. You will need it at step 8, when comparing schools.'},
      quiz:{
        q:{ro:'Un client te roagă: „ajută-mă să iau decizia corectă cu privire la demisie”. Ce faci, ca coach?',
           en:'A client asks: “help me make the right decision about resigning”. What do you do, as a coach?'},
        opts:[
          { t:{ro:'Îi spui ce ai face tu în locul lui — ai experiență, îi economisești luni', en:'Tell them what you would do — you have experience, it saves months'},
            why:{ro:'Nu. Devine consultanță/mentorat: decizia e a clientului, iar „ce ai face tu” nu e criteriul lui de viață.', en:'No. That is consulting/mentoring: the decision is the client’s, and “what you would do” is not their life criterion.'} },
          { t:{ro:'Explorezi criteriile lui, valorile, consecințele scenariilor și ce ar face ca decizia să fie asumată', en:'Explore their criteria, values, scenario consequences and what would make the decision fully owned'}, ok:true,
            why:{ro:'Corect. Coachingul nu dă decizia: lărgește perspectiva, ca decizia să fie informată și asumată.', en:'Correct. Coaching does not hand over the decision: it widens perspective so the decision is informed and owned.'} },
          { t:{ro:'Îi recomanzi să rămână până are o ofertă fermă', en:'Recommend they stay until they have a firm offer'},
            why:{ro:'Nu. E un sfat de carieră deontologic comod, dar îți asumi tu decizia în locul clientului.', en:'No. It is safe career advice, but you take the decision on the client’s behalf.'} }
        ]
      },
      links:[{l:{ro:'Unde se folosește — detaliat', en:'Where it is used — in depth'}, h:'teorie.html#unde'}, {l:{ro:'Coaching de echipă', en:'Team coaching'}, h:'echipa.html'}]
    },

    /* ---------- 3 ---------- */
    {
      id:'s3', icon:'🪑', min:5,
      t:{ro:'Cum arată, concret, o sesiune', en:'What a session actually looks like'},
      sub:{ro:'Structura în 5 faze, GROW în 60 de secunde și felul în care se măsoară rezultatul.',
           en:'The 5-phase structure, GROW in 60 seconds, and how results get measured.'},
      learn:{ro:['Reconstitui o sesiune de 60 de minute','Folosești GROW fără să sune a formulă','Știi cum se dovedește că ședința a avut efect'],
             en:['You can reconstruct a 60-minute session','You can use GROW without it sounding like a formula','You know how to prove a session worked']},
      blocks:[
        { t:{ro:'Cele cinci faze', en:'The five phases'},
          list:true,
          d:{ro:['Contract — despre ce lucrăm azi și cum vom ști că a mers.','Explorare — realitatea de acum: fapte, blocaje, valori, resurse.','Insight — ce vezi acum și nu vedeai la început.','Angajament — acțiuni datate, primul pas cât mai mic.','Follow-up — ce s-a întâmplat, ce ajustăm la următoarea ședință.'],
             en:['Contract — what we work on today and how we will know it worked.','Explore — today’s reality: facts, blockers, values, resources.','Insight — what you now see that you did not before.','Commitment — dated actions, the smallest possible first step.','Follow-up — what happened, what we adjust next session.']} },
        { t:{ro:'GROW, pe scurt', en:'GROW, in short'},
          d:{ro:'Goal (obiectivul sesiunii) → Reality (ce e adevărat acum) → Options (ce ai putea face) → Will (ce faci, concret, până când). Modelul nu e rețetă: sunt patru întrebări care țin conversația orientată spre acțiune. Alte modele folosite frecvent: OSCAR, CLEAR, Co-Active, teoria schimbării intenționate.',
             en:'Goal (the session’s aim) → Reality (what is true now) → Options (what you could do) → Will (what you will do, concretely, by when). It is not a recipe: four questions that keep the conversation action-oriented. Other common models: OSCAR, CLEAR, Co-Active, intentional change theory.'} },
        { t:{ro:'Cum se măsoară', en:'How it gets measured'},
          d:{ro:'Prin obiective observabile, nu prin „m-am simțit bine”: scala 1–10 pentru încredere și progres, obiective comportamentale („ce vei face diferit luni dimineață”), evaluarea atingerii obiectivului și martori din jur (șef, colegi). Cercetarea folosește exact aceiași indicatori — vezi pasul 10.',
             en:'With observable goals, not with “it felt good”: a 1–10 scale for confidence and progress, behavioural goals (“what will you do differently on Monday morning”), goal-attainment scoring, and witnesses around the client (manager, peers). Research uses exactly the same indicators — see step 10.'} }
      ],
      action:{ro:'Ia o decizie reală pe care o amâni și aplică GROW pe ea, în 10 minute, scriind răspunsurile. Observă dacă ultima întrebare („ce faci și până când?”) schimbă ceva.',
              en:'Take one real decision you keep postponing and run GROW on it for 10 minutes, writing the answers. Notice whether the last question (“what will you do and by when?”) changes anything.'},
      quiz:{
        q:{ro:'Client: „nu am energie, nu știu de unde să încep”. Care e prima intervenție corectă?',
           en:'Client: “I have no energy, I don’t know where to start”. What is the right first move?'},
        opts:[
          { t:{ro:'Îi ceri un plan de acțiune detaliat pe două săptămâni', en:'Ask for a detailed two-week action plan'},
            why:{ro:'Prea devreme. Fără obiectiv clar, planul devine încă o povară pe care o abandonează.', en:'Too early. Without a clear goal the plan becomes one more burden to abandon.'} },
          { t:{ro:'Explorezi ce s-a schimbat recent, ce contează pentru el acum și stabilim împreună obiectivul sesiunii', en:'Explore what changed recently, what matters to them now, and agree the session goal together'}, ok:true,
            why:{ro:'Corect: contract înainte de conținut. „Energia” e simptomul, obiectivul e altceva.', en:'Correct: contract before content. “Energy” is the symptom; the goal is something else.'} },
          { t:{ro:'Recomanzi un program de wellness și un somn mai bun', en:'Recommend a wellness programme and better sleep'},
            why:{ro:'Nu. E sfat de specialist, nu coaching — și închide explorarea exact când era nevoie de ea.', en:'No. That is specialist advice, not coaching — and it closes exploration exactly when it was needed.'} }
        ]
      },
      links:[{l:{ro:'Anatomia sesiunii + modele', en:'Session anatomy & models'}, h:'teorie.html#sesiune'}, {l:{ro:'Plan complet 1:1', en:'Full 1:1 plan'}, h:'individual.html'}]
    },

    /* ---------- 4 ---------- */
    {
      id:'s4', icon:'⚖️', min:5,
      t:{ro:'Competențele și etica: ce ești obligat să respecți', en:'Competencies and ethics: what you must respect'},
      sub:{ro:'Cele 8 competențe ICF, ce s-a schimbat în 2025 și codul etic în 30 de secunde.',
           en:'The 8 ICF competencies, what changed in 2025, and the code of ethics in 30 seconds.'},
      learn:{ro:['Numești cele 8 competențe','Știi ce s-a schimbat în 2025 (competențe + cod etic)','Înțelegi de ce etica e materia care se testează la examen'],
             en:['You can name the 8 competencies','You know what changed in 2025 (competencies + code)','You understand why ethics is exam material']},
      blocks:[
        { t:{ro:'Cele 8 competențe ICF', en:'The 8 ICF competencies'},
          list:true,
          d:{ro:['1. Demonstrează practică etică','2. Întruchipează o mentalitate de coaching','3. Stabilește și menține acorduri','4. Cultivă încredere și siguranță','5. Menține prezența','6. Ascultă activ','7. Evocă conștientizarea','8. Facilitează creșterea clientului'],
             en:['1. Demonstrates ethical practice','2. Embodies a coaching mindset','3. Establishes and maintains agreements','4. Cultivates trust and safety','5. Maintains presence','6. Listens actively','7. Evokes awareness','8. Facilitates client growth']} },
        { t:{ro:'Ce s-a schimbat în 2025', en:'What changed in 2025'},
          d:{ro:'Competențele au fost rafinate, nu înlocuite: rămân 8, dar au apărut 5 indicatori noi, 11 au fost revizuiți și s-a adăugat un glosar. Codul etic nou (în vigoare de la 1 aprilie 2025) are 4 valori (profesionalism, colaborare, umanitate, echitate) și 5 secțiuni, cu reguli explicite despre folosirea instrumentelor AI, divulgarea rolurilor și diversitate. Examenele actuale încă testează setul 2019 + Codul 2020; noua formă a examenului PCC–MCC (din 10 noiembrie 2026) e construită pe setul 2025.',
             en:'The competencies were refined, not replaced: still 8, but 5 new indicators appeared, 11 were revised and a glossary was added. The new Code of Ethics (effective 1 April 2025) has 4 values (professionalism, collaboration, humanity, equity) and 5 sections, with explicit rules on AI tools, role disclosure and diversity. Current exams still test the 2019 set + 2020 Code; the new PCC–MCC exam format (from 10 November 2026) is built on the 2025 set.'} },
        { t:{ro:'Etica, pe scurt', en:'Ethics, in short'},
          d:{ro:'Confidențialitate, acord scris, limite clare de competență, gestionarea conflictelor de interese, transfer de responsabilitate către client. La reînnoire ai obligatoriu 3 ore de etică; la examen, etica e cea mai mare secțiune — 30%.',
             en:'Confidentiality, a written agreement, clear competence limits, managing conflicts of interest, responsibility staying with the client. At renewal you owe 3 ethics hours; in the exam ethics is the biggest section — 30%.'} }
      ],
      action:{ro:'Scrie-ți propriul „contract de o pagină”: ce faci, ce nu faci, cum ții confidențialitatea, unde trimiți mai departe. Îl vei folosi la primii clienți.',
              en:'Write your own one-page agreement: what you do, what you do not do, how you keep confidentiality, when you refer out. You will use it with your first clients.'},
      quiz:{
        q:{ro:'Clientul te roagă să scrii tu raportul de evaluare a performanței angajaților lui, în baza ședințelor de coaching.',
           en:'A client asks you to write the performance evaluation of their employees, based on the coaching sessions.'},
        opts:[
          { t:{ro:'Accepți: ești cel care îi cunoaște cel mai bine', en:'Accept: you know those people best'},
            why:{ro:'Nu. Transformi confidențialitatea în raport de evaluare: conflict de rol major și încălcare a codului.', en:'No. You turn confidentiality into a performance report: a major role conflict and a breach of the code.'} },
          { t:{ro:'Refuzi politicos, explici de ce și propui altceva (ex. obiective de coaching agreate cu angajatul)', en:'Decline politely, explain why and propose something else (e.g. coaching goals agreed with the employee)'}, ok:true,
            why:{ro:'Corect. Coachingul nu produce rapoarte de evaluare; angajatorul poate afla doar ce s-a agreat explicit.', en:'Correct. Coaching does not produce appraisal reports; the employer learns only what was explicitly agreed.'} },
          { t:{ro:'Accepți, dar fără să spui clientului de unde ai informațiile', en:'Accept, but without telling the client where the information came from'},
            why:{ro:'Nu. E încălcare directă a confidențialității și a principiului transparenței.', en:'No. That directly breaches confidentiality and transparency.'} }
        ]
      },
      links:[{l:{ro:'Competențele, pe larg', en:'Competencies in depth'}, h:'teorie.html#competente'}, {l:{ro:'Etică și limite', en:'Ethics & limits'}, h:'teorie.html#etica'}]
    },

    /* ---------- 5 ---------- */
    {
      id:'s5', icon:'🏛️', min:6,
      t:{ro:'Cele trei sisteme: ICF, EMCC și ANC', en:'The three systems: ICF, EMCC and ANC'},
      sub:{ro:'Ce e acreditarea, ce e credențiala și care e diferența dintre ele — odată pentru totdeauna.',
           en:'What accreditation is, what a credential is, and the difference between them — once and for all.'},
      learn:{ro:['Distingi acreditarea (școală) de credențială (persoană)','Enumeri nivelurile fiecărui sistem','Știi ce te întreabă angajatorii din România'],
             en:['You tell accreditation (school) apart from a credential (person)','You can list each system’s levels','You know what Romanian employers ask for']},
      blocks:[
        { t:{ro:'Acreditare vs credențială', en:'Accreditation vs credential'},
          d:{ro:'Acreditarea este a ȘCOLII sau a programului: ICF Level 1/2/3, EMCC EQA/ESQA, autorizare ANC. Credențiala este a PERSOANEI: ICF ACC/PCC/MCC (plus ACTC, MCS, CSS), EMCC EIA/ITCA/ESIA, certificatul ANC COR 242412. O școală acreditată nu te certifică; ea îți dă educația cu care te poți certifica.',
             en:'Accreditation belongs to the SCHOOL or programme: ICF Level 1/2/3, EMCC EQA/ESQA, ANC authorisation. A credential belongs to the PERSON: ICF ACC/PCC/MCC (plus ACTC, MCS, CSS), EMCC EIA/ITCA/ESIA, the ANC COR 242412 certificate. An accredited school does not certify you; it gives you the education you use to get certified.'} },
        { t:{ro:'Hartă rapidă', en:'Quick map'},
          table:true,
          d:{ro:[['ICF','ACC (60 h, 100 ore) → PCC (125 h, 500 ore) → MCC (200 h, 2.500 ore) + specializări: ACTC (echipă), MCS (mentor coach), CSS (supervizor)'],
                ['EMCC','EIA: Foundation → Practitioner → Senior Practitioner → Master Practitioner; ESIA (supervizori), ITCA (team coaching); obligă supervizarea pentru practicieni acreditați'],
                ['ANC (România)','COR 242412 Specialist în activitatea de coaching; COR 242401 Formator; COR 235902 Mentor — curriculum autorizat, examen în comisie, certificat cu supliment']],
             en:[['ICF','ACC (60 hrs, 100 hours) → PCC (125 hrs, 500 hours) → MCC (200 hrs, 2,500 hours) + specialties: ACTC (team), MCS (mentor coach), CSS (supervisor)'],
                ['EMCC','EIA: Foundation → Practitioner → Senior Practitioner → Master Practitioner; ESIA (supervisors), ITCA (team coaching); supervision is mandatory for accredited practitioners'],
                ['ANC (Romania)','COR 242412 Coaching specialist; COR 242401 Trainer; COR 235902 Mentor — authorised curriculum, commission exam, certificate with supplement']]} },
        { t:{ro:'Ce se cere, în practică', en:'What is actually asked for'},
          d:{ro:'În companii: furnizorii de coaching sunt întrebați de credențială (PCC este pragul cel mai des cerut) și de asigurare profesională. În școli și ONG-uri: contează și diploma ANC. Dacă vrei să predai în programe autorizate în România, ai nevoie de COR 242401 (formator) pe lângă coaching.',
             en:'In companies: coaching providers are asked for a credential (PCC is the most common threshold) and professional insurance. In schools and NGOs: the ANC diploma counts too. If you want to teach in authorised Romanian programmes you also need COR 242401 (trainer) alongside coaching.'} }
      ],
      action:{ro:'Intră în directorul ICF Education Search și caută două programe care livrează în română. Notează nivelul acreditării (Level 1 sau 2) — vei compara școli la pasul 8.',
              en:'Open the ICF Education Search directory and find two programmes delivered in Romanian. Note their accreditation level (Level 1 or 2) — you will compare schools at step 8.'},
      quiz:{
        q:{ro:'O școală se laudă că este „acreditată ICF”, dar nu apare în directorul oficial ESS. Ce faci?',
           en:'A school claims to be “ICF accredited” but does not appear in the official ESS directory. What do you do?'},
        opts:[
          { t:{ro:'Ai încredere — probabil e o simplă întârziere în actualizarea directorului', en:'Trust them — likely just a directory update delay'},
            why:{ro:'Nu. ESS este sursa oficială; dacă programul nu e acolo, educația nu îți dă dreptul la credențială prin ruta de program.', en:'No. ESS is the official source; if the programme is not there, the education does not qualify you through the programme route.'} },
          { t:{ro:'Ceri nivelul și numărul acreditării, verifici în ESS și, dacă nu apare, cauți alt program', en:'Ask for the accreditation level and reference, check ESS, and if it is not listed, look elsewhere'}, ok:true,
            why:{ro:'Corect. Verificarea durează 10 minute și îți protejează 6–12 luni de muncă.', en:'Correct. The check takes 10 minutes and protects 6–12 months of your work.'} },
          { t:{ro:'Ceri o reducere de preț, ca compensație', en:'Ask for a price discount as compensation'},
            why:{ro:'Nu. Problema nu e prețul, ci faptul că ruta de program nu e valabilă.', en:'No. The issue is not price, it is that the programme route is not valid.'} }
        ]
      },
      links:[{l:{ro:'Toate credențialele, pe rând', en:'All credentials, one by one'}, h:'index.html#credentials'}, {l:{ro:'Școli din România', en:'Schools in Romania'}, h:'index.html#schools'}]
    },

    /* ---------- 6 ---------- */
    {
      id:'s6', icon:'🎓', min:9,
      t:{ro:'Procesul ICF, pas cu pas: cum te certifici', en:'The ICF process, step by step: how you get certified'},
      sub:{ro:'Cei 6 pași ai credențializării, cerințele exacte pentru ACC / PCC / MCC și calendarul schimbărilor din 2026–2027.',
           en:'The 6 credentialing steps, exact requirements for ACC / PCC / MCC, and the 2026–2027 change calendar.'},
      learn:{ro:['Parcurgi tot procesul ICF în minte, în ordine','Știi exact ce ore, ce documente și ce taxe sunt la fiecare nivel','Ai calendarul schimbărilor care te pot prinde nepregătit'],
             en:['You can walk the whole ICF process in order','You know the exact hours, documents and fees per level','You have the calendar of changes that could catch you out']},
      blocks:[
        { t:{ro:'Cei 6 pași', en:'The 6 steps'},
          list:true,
          d:{ro:['1. Educație. Program acreditat ICF (Level 1 = 60–124 h, Level 2 = 125 h+, Level 3 = 75 h+) sau ruta Portfolio, cu educație neacreditată/CCE.','2. Ore cu clienți reali. Se numără din ziua în care începe formarea. Contează orele plătite (sau cu schimb de valoare) și numărul de clienți.','3. Mentor coaching. 10 ore, pe minimum 3 luni, din care minimum 3 ore 1-la-1; restul pot fi în grup (maxim 7 h, grup de maxim 10 persoane).','4. Evaluarea performanței. Prin program (Level 1/2 îl includ) sau, pe ruta Portfolio, înregistrare + transcriere evaluată de ICF.','5. Examenul. ACC: 60 întrebări / 90 min. PCC și MCC: 78 scenarii / 180 min, prag 460 din 600. Se dă la Pearson VUE, în centru sau online supravegheat.','6. Dosarul și taxa. Aplici la ICF Credentials & Standards; review 4 săptămâni pe ruta de program, până la 14–18 săptămâni pe Portfolio.'],
             en:['1. Education. An ICF-accredited programme (Level 1 = 60–124 hrs, Level 2 = 125 hrs+, Level 3 = 75 hrs+) or the Portfolio route with non-accredited/CCE education.','2. Real client hours. Counted from the day your training starts. Paid hours (or exchange of value) and client numbers matter.','3. Mentor coaching. 10 hours over at least 3 months, with at least 3 hours one-to-one; the rest may be group (max 7 hrs, groups of max 10 people).','4. Performance evaluation. Through the programme (Level 1/2 include it) or, on the Portfolio route, a recording plus transcript assessed by ICF.','5. The exam. ACC: 60 questions / 90 min. PCC and MCC: 78 scenarios / 180 min, pass mark 460 out of 600. Taken via Pearson VUE, at a centre or online proctored.','6. File and fee. Apply to ICF Credentials & Standards; review takes ~4 weeks on the programme route, up to 14–18 weeks on Portfolio.']},
          kind:'numbered' },
        { t:{ro:'Cerințele exacte, pe niveluri', en:'Exact requirements, by level'},
          table:true,
          d:{ro:[['Educație','60+ h','125+ h','200+ h'],
                ['Ore de coaching','100+ (75 plătite)','500+ (450 plătite)','2.500+ (2.250 plătite)'],
                ['Clienți','8','25','35'],
                ['Mentor coaching','10 h / 3 luni, min. 3 h 1:1','10 h / 3 luni, min. 3 h 1:1','10 h / 3 luni, cu mentor MCC'],
                ['Evaluare','prin program (Level 1)','2 sesiuni evaluate (PCC Markers)','2 sesiuni evaluate (MCC BARS)'],
                ['Examen','ACC: 60 întrebări / 90 min','78 scenarii / 180 min','78 scenarii / 180 min'],
                ['Taxă aplicare','175 $ membru / 325 $ nemembru','375 $ / 525 $','675 $ / 825 $'],
                ['Reînnoire (3 ani)','40 CCE (24 core, 3 etică) + 10 h mentor coaching','40 CCE','40 CCE']],
             en:[['Education','60+ hrs','125+ hrs','200+ hrs'],
                ['Coaching hours','100+ (75 paid)','500+ (450 paid)','2,500+ (2,250 paid)'],
                ['Clients','8','25','35'],
                ['Mentor coaching','10 hrs / 3 months, min. 3 one-to-one','10 hrs / 3 months, min. 3 one-to-one','10 hrs / 3 months, with an MCC mentor'],
                ['Evaluation','in-programme (Level 1)','two assessed sessions (PCC Markers)','two assessed sessions (MCC BARS)'],
                ['Exam','ACC: 60 items / 90 min','78 scenarios / 180 min','78 scenarios / 180 min'],
                ['Application fee','$175 member / $325 non-member','$375 / $525','$675 / $825'],
                ['Renewal (3 years)','40 CCE (24 core, 3 ethics) + 10 hrs mentor coaching','40 CCE','40 CCE']]},
          head:{ro:['Cerință','ACC','PCC','MCC'], en:['Requirement','ACC','PCC','MCC']} },
        { t:{ro:'Calendarul schimbărilor care te prind', en:'The change calendar that can catch you'},
          list:true,
          d:{ro:['10 noiembrie 2026 — apare noua formă a examenului PCC–MCC: 80 de întrebări (44 scenarii + 36 cunoștințe) în 150 de minute, pe competențele 2025.','31 martie 2027 — ultima zi în care mai poți da examenul vechi (78 scenarii).','1 ianuarie 2027 — orele noi de mentor coaching contează doar dacă mentorul are specializarea MCS, la nivelul potrivit.','1 aprilie 2027 — pe ruta Portfolio la ACC/PCC, validarea făcută de mentorul cu MCS înlocuiește înregistrarea și transcrierea pentru evaluarea performanței.'],
             en:['10 November 2026 — the new PCC–MCC exam format arrives: 80 items (44 scenarios + 36 knowledge) in 150 minutes, built on the 2025 competencies.','31 March 2027 — last day you can sit the old exam (78 scenarios).','1 January 2027 — new mentor coaching hours count only if the mentor holds the MCS at the right level.','1 April 2027 — on the ACC/PCC Portfolio route, validation by an MCS mentor coach replaces the recording and transcript for the performance evaluation.']} }
      ],
      action:{ro:'Calculează-ți propria linie de timp: pune pe o foaie luna în care începi formarea, luna în care termini, luna în care atingi 100 de ore și luna examenului. Dacă aceste date trec de 2027, recitește calendarul de mai sus.',
              en:'Sketch your own timeline: write the month you start training, the month you finish, the month you reach 100 hours and the exam month. If those dates cross 2027, re-read the calendar above.'},
      quiz:{
        q:{ro:'Ai terminat un program de 60 de ore, ai 40 de ore de coaching (toate plătite) și 10 ore de mentor coaching. Poți aplica pentru ACC?',
           en:'You finished a 60-hour programme, have 40 coaching hours (all paid) and 10 mentor coaching hours. Can you apply for ACC?'},
        opts:[
          { t:{ro:'Da, îndeplinești toate cerințele de ore', en:'Yes, you meet all the hour requirements'},
            why:{ro:'Nu. Îți lipsesc 60 de ore de coaching (ai nevoie de 100, din care 75 plătite) și examenul.', en:'No. You are 60 coaching hours short (you need 100, 75 paid) and you still need the exam.'} },
          { t:{ro:'Nu: ai nevoie de 100 de ore de coaching (75 plătite) și de promovarea examenului ACC', en:'No: you need 100 coaching hours (75 paid) and a passed ACC exam'}, ok:true,
            why:{ro:'Corect. Educația și mentoratul sunt gata; orele și examenul rămân.', en:'Correct. Education and mentoring are done; hours and the exam remain.'} },
          { t:{ro:'Da, dacă plătești taxa de nemembru', en:'Yes, if you pay the non-member fee'},
            why:{ro:'Nu. Taxa nu înlocuiește cerințele; ea doar diferențiază membru/nemembru.', en:'No. A fee never replaces requirements; it only differentiates member/non-member.'} }
        ]
      },
      links:[{l:{ro:'Parcursurile pas cu pas', en:'Step-by-step paths'}, h:'index.html#paths'}, {l:{ro:'Costuri și durate', en:'Costs and durations'}, h:'index.html#costs'}, {l:{ro:'Trecerea între certificări', en:'Bridges between credentials'}, h:'index.html#transitions'}]
    },

    /* ---------- 7 ---------- */
    {
      id:'s7', icon:'🧑‍🏫', min:8,
      t:{ro:'Mentor coaching și supervizare, „by the book”', en:'Mentor coaching and supervision, by the book'},
      sub:{ro:'Ce e mentoratul în coaching, ce e supervizarea, cine le poate livra și cum se respectă regulile.',
           en:'What mentoring in coaching is, what supervision is, who may deliver it, and how the rules are met.'},
      learn:{ro:['Explici diferența mentor coaching / supervizare / coaching','Enumeri regulile exacte (10 h, 3 luni, 3 ore 1:1, MCS din 2027)','Știi ce reguli are EMCC pentru supervizare (4 h/an, raport 1:35)','Știi cum să-ți alegi un mentor/supervizor potrivit'],
             en:['You can explain mentor coaching vs supervision vs coaching','You can list the exact rules (10 hrs, 3 months, 3 one-to-one hours, MCS from 2027)','You know EMCC’s supervision rules (4 hrs/year, 1:35 ratio)','You know how to pick a suitable mentor/supervisor']},
      blocks:[
        { t:{ro:'Ce e mentor coachingul (ICF)', en:'What mentor coaching is (ICF)'},
          d:{ro:'Un proces în care un coach cu credențială observă practica ta și îți dă feedback pe cele 8 competențe, cu dovezi. Nu e consiliere, nu e terapie, nu e coaching personal: e dezvoltare de competență profesională. Se cere la toate nivelurile: 10 ore, pe minimum 3 luni (12 săptămâni între prima și ultima ședință), minimum 3 ore 1-la-1, restul pot fi în grup (maxim 7 ore, cu raport de 1 mentor la maxim 10 persoane). Contează doar timpul de dialog interactiv: timpul în care mentorul îți analizează înregistrarea nu se numără. Ședința de început și cea de închidere se numără.',
             en:'A process in which a credentialed coach observes your practice and gives you feedback against the 8 competencies, with evidence. It is not counselling, therapy or personal coaching: it is professional skill development. Required at every level: 10 hours over at least 3 months (12 weeks between first and last session), at least 3 hours one-to-one, the rest may be group (max 7 hours, ratio of 1 mentor to max 10 participants). Only interactive dialogue counts: time the mentor spends reviewing your recording does not. The intake and closing sessions do count.'} },
        { t:{ro:'Ce e supervizarea (by the book)', en:'What supervision is (by the book)'},
          d:{ro:'Un spațiu reflexiv, regulat, pe practica ta: cazuri, dileme etice, tipare personale, impact asupra clientului și asupra ta. Supervizorul nu îți evaluează competența (asta face mentorul), ci te ajută să rămâi sănătos, etic și lucid în meserie. ICF nu o cere pentru credențiale (doar pentru ACTC cere 5 ore), dar recunoaște până la 10 ore de supervizare ca CCE la reînnoire. EMCC o cere explicit: minimum 4 ore individuale pe an, distribuite uniform (sau 8 ore dacă practici și mentoring/team coaching/supervizare), cu raportul 1:35 — o oră de supervizare la fiecare 35 de ore de practică. Association for Coaching recomandă ~1 oră la 15 ore.',
             en:'A regular, reflective space on your practice: cases, ethical dilemmas, personal patterns, impact on the client and on you. The supervisor does not assess your competence (that is the mentor’s job) — they help you stay healthy, ethical and clear-eyed in the profession. ICF does not require it for credentials (only ACTC, 5 hours), but recognises up to 10 supervision hours as CCE at renewal. EMCC requires it explicitly: at least 4 individual hours a year, evenly distributed (or 8 hours if you also practise mentoring/team coaching/supervision), with a 1:35 ratio — one supervision hour per 35 practice hours. The Association for Coaching recommends ~1 hour per 15 hours.'} },
        { t:{ro:'Cine are voie să le livreze', en:'Who is allowed to deliver these'},
          list:true,
          d:{ro:['Mentor coach pentru candidați ACC: credențială PCC sau MCC (sau ACC reînnoită).','Mentor coach pentru candidați PCC: PCC sau MCC activ. Pentru MCC: doar MCC.','Din 1 ianuarie 2027: toate orele noi se fac cu un mentor care are specializarea MCS, la nivelul cerut (MCS-ACC / MCS-PCC / MCS-MCC).','Mentor coach se poate califica pe două rute: Standard (41+ ore de educație de mentor coaching, minimum 50% live, plus trainingul BARS/Markers) sau Recunoașterea învățării anterioare (10 ore de educație + dovezi că 5 clienți mentorizați au obținut credențială în ultimii 3 ani).','Supervizor EMCC: EIA de la Senior Practitioner în sus + un program ESQA + minimum 120 de ore de practică de supervizare.','Supervizor ICF: noua specializare CSS — credențială PCC/MCC + 41+ ore de educație de supervizare (min. 50% live) + înscriere în registru.'],
             en:['Mentor coach for ACC candidates: a PCC or MCC credential (or a renewed ACC).','Mentor coach for PCC candidates: active PCC or MCC. For MCC: MCC only.','From 1 January 2027: all new hours must be with a mentor holding the MCS at the required level (MCS-ACC / MCS-PCC / MCS-MCC).','Two routes to qualify as a mentor coach: Standard (41+ hours of mentor coaching education, at least 50% live, plus BARS/Markers training) or Credit for Prior Learning (10 hours of education + evidence that 5 mentored clients earned a credential in the past 3 years).','EMCC supervisor: EIA at Senior Practitioner or above + an ESQA programme + at least 120 hours of supervision practice.','ICF supervisor: the new CSS specialisation — PCC/MCC credential + 41+ hours of supervision education (min. 50% live) + inclusion in the registry.']} },
        { t:{ro:'Cum îți alegi mentorul sau supervizorul', en:'How to choose your mentor or supervisor'},
          list:true,
          d:{ro:['Cere credențiala exactă și verifică-o (ICF poate fi verificat în director; EMCC prin numărul de acreditare).','Întreabă cum lucrează: observare live? înregistrări? feedback scris cu markere?','Cere să vezi documentele pe care le primești la final (formularul de observație și formularul de competențe).','Verifică potrivirea: vrei pe cineva care a dus candidați până la credențială, nu doar „coach cu experiență”.','Prețuri de referință: 100–200 € pe oră individual; pachete de 10–13 ore de la ~1.000–1.500 €.'],
             en:['Ask for the exact credential and verify it (ICF can be checked in the directory; EMCC by accreditation number).','Ask how they work: live observation? recordings? written feedback against markers?','Ask to see the documents you will receive at the end (session observation form and competency review form).','Check the fit: you want someone who has taken candidates all the way to a credential, not just “an experienced coach”.','Reference prices: €100–200 per individual hour; 10–13 hour packages from about €1,000–1,500.']} }
      ],
      action:{ro:'Întreabă un coach cu credențială pe care îl cunoști cine i-a fost mentor și ce l-a ajutat cel mai mult. Răspunsul îți spune mai mult decât orice broșură.',
              en:'Ask a credentialed coach you know who their mentor was and what helped them most. That answer says more than any brochure.'},
      quiz:{
        q:{ro:'Ai făcut 10 ore de mentor coaching în 3 săptămâni, în grup de 14 persoane, cu un coach care are ACC nerenovat. Ce e adevărat?',
           en:'You did 10 mentor coaching hours in 3 weeks, in a group of 14, with a coach holding an unrenewed ACC. What is true?'},
        opts:[
          { t:{ro:'Contează: sunt 10 ore, exact cât se cere', en:'It counts: 10 hours, exactly what is required'},
            why:{ro:'Nu. Se încalcă trei reguli deodată: durata minimă (3 luni), mărimea grupului (max. 10) și credențiala mentorului.', en:'No. Three rules are broken at once: minimum duration (3 months), group size (max 10) and the mentor’s credential.'} },
          { t:{ro:'Nu contează: trebuie minimum 3 luni, maxim 7 ore în grup (max. 10 persoane) și un mentor cu credențială adecvată', en:'It does not count: you need at least 3 months, max 7 group hours (max 10 people) and a mentor with a suitable credential'}, ok:true,
            why:{ro:'Corect — iar din 2027 se adaugă cerința ca mentorul să aibă MCS.', en:'Correct — and from 2027 the mentor must also hold the MCS.'} },
          { t:{ro:'Contează, dacă plătești și taxele de urgență', en:'It counts if you pay rush fees'},
            why:{ro:'Nu. Nu există „taxă de urgență” care să comprime timpul sau regulile.', en:'No. There is no rush fee that compresses time or the rules.'} }
        ]
      },
      links:[{l:{ro:'Glosar: mentor coaching, supervizare', en:'Glossary: mentor coaching, supervision'}, h:'index.html#faq'}, {l:{ro:'Trecerea spre supervizare', en:'The move into supervision'}, h:'index.html#transitions'}]
    },

    /* ---------- 8 ---------- */
    {
      id:'s8', icon:'🏫', min:7,
      t:{ro:'Școala: cum o alegi în 30 de minute', en:'The school: how to choose it in 30 minutes'},
      sub:{ro:'Verificare în 10 minute, 8 întrebări de pus înainte de contract și capcanele în care cad începătorii.',
           en:'A 10-minute check, 8 questions to ask before signing, and the traps beginners fall into.'},
      learn:{ro:['Verifici o școală în 10 minute, pe surse oficiale','Pui 8 întrebări care despart programele serioase de cele ambalate','Știi ce prețuri sunt normale în România'],
             en:['You can verify a school in 10 minutes on official sources','You ask 8 questions that separate serious programmes from packaging','You know what prices are normal in Romania']},
      blocks:[
        { t:{ro:'Verificarea în 4 pași', en:'The 4-step check'},
          list:true,
          d:{ro:['1. Caută programul în ICF Education Search (sau verifică acreditarea EQA pentru EMCC, respectiv autorizarea ANC în registrul național).','2. Confirmă nivelul: Level 1 (pregătește ACC), Level 2 (PCC). Un „curs de coaching” fără nivel nu îți dă ruta de program.','3. Citește programul de ore pe competențe: câte ore sunt live, câte sunt observate și cu feedback, cine predă și ce credențială are.','4. Cere, pe scris, ce documente primești la final și dacă mentor coaching-ul și evaluarea sunt incluse sau se plătesc separat.'],
             en:['1. Look the programme up in ICF Education Search (or check the EQA accreditation for EMCC, or the ANC authorisation in the national register).','2. Confirm the level: Level 1 (leads to ACC), Level 2 (PCC). A “coaching course” with no level does not give you the programme route.','3. Read the hour breakdown by competency: how many hours are live, how many are observed with feedback, who teaches and what credential they hold.','4. Get it in writing: which documents you receive at the end, and whether mentor coaching and the evaluation are included or billed separately.']} },
        { t:{ro:'Cele 8 întrebări de pus școlii', en:'The 8 questions to ask the school'},
          list:true,
          d:{ro:['Câte ore sunt pe fiecare competență și câte sunt sincrone (live)?','Cine sunt instructorii și ce credențiale au (nume, să le verific)?','Câte sesiuni sunt observate cu feedback scris și cine le observă?','Mentor coaching-ul e inclus? Cine e mentorul și când predă?','Evaluarea finală a performanței e inclusă și cine o face?','Ce se întâmplă dacă ratez module (recuperare, costuri, termene)?','Câți absolvenți au obținut credențială în ultimii 3 ani (cifre, nu povești)?','Ce spune contractul despre rambursare și despre drepturile tale pe materiale?'],
             en:['How many hours per competency, and how many are synchronous (live)?','Who are the instructors and what credentials do they hold (names, so I can verify)?','How many sessions are observed with written feedback, and who observes them?','Is mentor coaching included? Who is the mentor and when do they teach?','Is the final performance evaluation included, and who runs it?','What happens if I miss modules (make-ups, costs, deadlines)?','How many graduates earned a credential in the last 3 years (numbers, not stories)?','What does the contract say about refunds and about rights over the materials?']} },
        { t:{ro:'Capcane și prețuri normale', en:'Traps and normal prices'},
          d:{ro:'Capcane: „certificat ICF” promis de o școală (credențiala o dă ICF, nu școala), cursuri de „life coaching” de 40 de ore vândute ca drum spre credențială, ore de practică „între cursanți” numărate ca ore cu clienți (nu se numără), mentor coaching „de grup” cu 30 de persoane. Prețuri de referință în România: curs ANC-only 750–2.500 RON; program ICF Level 1 ~2.500–3.500 €; Level 2 / top-up ~2.900–5.000 €; mentor coaching separat ~1.000–1.500 €; taxele ICF se plătesc la aplicare.',
             en:'Traps: an “ICF certificate” promised by the school (ICF issues credentials, not schools), 40-hour “life coaching” courses sold as a credential route, practice hours “between students” counted as client hours (they do not count), “group” mentor coaching with 30 people. Reference prices in Romania: ANC-only course 750–2,500 RON; ICF Level 1 programme ~€2,500–3,500; Level 2 / top-up ~€2,900–5,000; stand-alone mentor coaching ~€1,000–1,500; ICF fees are paid at application.'} }
      ],
      action:{ro:'Ia o școală din lista de pe pagina principală și fă verificarea în 4 pași. Dacă nu găsești programul în sursa oficială, taie-o de pe listă — indiferent de recenzii.',
              en:'Take one school from the list on the main page and run the 4-step check. If the programme is not in the official source, cross it off — whatever the reviews say.'},
      quiz:{
        q:{ro:'O școală promite „certificare ICF” în două weekenduri (40 de ore) și spune că e suficient pentru a lucra ca coach acreditat.',
           en:'A school promises “ICF certification” in two weekends (40 hours) and says it is enough to work as an accredited coach.'},
        opts:[
          { t:{ro:'E o afacere bună: ieftin și rapid', en:'Good deal: cheap and fast'},
            why:{ro:'Nu. Credențiala ICF îți cere 60+ ore de educație acreditată, 100 de ore de practică, mentor coaching și examen.', en:'No. An ICF credential requires 60+ hours of accredited education, 100 practice hours, mentor coaching and an exam.'} },
          { t:{ro:'Nu poate: credențiala ICF se obține doar prin cerințele ICF, iar „certificatul școlii” nu e credențială', en:'It cannot: ICF credentials follow ICF requirements, and a “school certificate” is not a credential'}, ok:true,
            why:{ro:'Corect. Verifică în ESS și cere, în scris, ce anume este acreditat.', en:'Correct. Check ESS and ask, in writing, exactly what is accredited.'} },
          { t:{ro:'E ok dacă îți dau și tehnici de coaching în plus', en:'Fine if they throw in extra coaching techniques'},
            why:{ro:'Nu. Tehnicile nu compensează lipsa orelor acreditate și a rutei de program.', en:'No. Techniques do not make up for missing accredited hours and a programme route.'} }
        ]
      },
      links:[{l:{ro:'Școlile din România (31)', en:'Schools in Romania (31)'}, h:'index.html#schools'}, {l:{ro:'Costuri, pe șleau', en:'Costs, plainly'}, h:'index.html#costs'}]
    },

    /* ---------- 9 ---------- */
    {
      id:'s9', icon:'🧭', min:7,
      t:{ro:'Cum devii trainer, mentor sau supervizor în coaching', en:'How to become a trainer, mentor or supervisor in coaching'},
      sub:{ro:'Trei trasee profesionale distincte, ce cer oficial ICF și EMCC și ce înseamnă în realitate.',
           en:'Three distinct career tracks, what ICF and EMCC officially require, and what it means in reality.'},
      learn:{ro:['Deosebești mentor coach, supervizor și trainer/educator','Știi cerințele oficiale pentru fiecare traseu','Înțelegi ce înseamnă din punct de vedere de business'],
             en:['You tell a mentor coach, a supervisor and a trainer/educator apart','You know the official requirements for each track','You understand what it means commercially']},
      blocks:[
        { t:{ro:'A. Mentor coach (pentru candidații la credențiale)', en:'A. Mentor coach (for credential candidates)'},
          d:{ro:'Cerință de bază: credențială PCC sau MCC activă (pentru candidații ACC merge și un ACC reînnoit). Din 1 ianuarie 2027, obligatoriu MCS la nivelul potrivit. Rutele de calificare: Standard — 41+ ore de educație de mentor coaching, minimum 50% live, plus trainingul de evaluare (ACC BARS, PCC Markers sau MCC BARS); Recunoașterea învățării anterioare — 10 ore de educație plus dovezi că 5 clienți mentorizați au obținut credențială în ultimii 3 ani (sau scrisoare de la un furnizor acreditat). Reînnoire: 10 ore de dezvoltare profesională la 3 ani.',
             en:'Base requirement: an active PCC or MCC credential (a renewed ACC also works for ACC candidates). From 1 January 2027, the MCS at the matching level is mandatory. Two qualification routes: Standard — 41+ hours of mentor coaching education, at least 50% live, plus evaluation training (ACC BARS, PCC Markers or MCC BARS); Credit for Prior Learning — 10 hours of education plus evidence that 5 mentored clients earned a credential in the past 3 years (or a letter from an accredited provider). Renewal: 10 hours of professional development every 3 years.'} },
        { t:{ro:'B. Supervizor', en:'B. Supervisor'},
          d:{ro:'EMCC (ESIA): EIA de la Senior Practitioner în sus, un program de supervizare acreditat ESQA sau echivalent, minimum 120 de ore de practică de supervizare, minimum 10 supervizați, supervizarea propriei practici de supervizare, jurnale și dovada dezvoltării continue. ICF (CSS, nou): credențială PCC sau MCC + 41+ ore de educație de supervizare (min. 50% live), apoi înscrierea în registrul ICF de supervizori; reînnoire la 3 ani cu 10 ore de dezvoltare profesională, din care minimum 5 ore de supervizare primită.',
             en:'EMCC (ESIA): EIA at Senior Practitioner or above, an ESQA-accredited supervision programme or equivalent, at least 120 hours of supervision practice, at least 10 supervisees, supervision of your own supervision practice, logs and evidence of continuing development. ICF (CSS, new): a PCC or MCC credential + 41+ hours of supervision education (min. 50% live), then listing in the ICF supervisor registry; renewal every 3 years with 10 hours of professional development, at least 5 of them receiving supervision.'} },
        { t:{ro:'C. Trainer / educator', en:'C. Trainer / educator'},
          d:{ro:'Sunt două situații diferite. (1) Predai într-un program acreditat: instructorii care predau conținut ICF trebuie să aibă credențială — ACC/PCC/MCC la Level 1 și 2, obligatoriu MCC la Level 3; cei care observă sesiuni și dau feedback scris trebuie să aibă credențială; directorul de educație trebuie să aibă PCC sau MCC (MCC la Level 3) și 5 ani de experiență cu clienți. (2) Ai propriul program: îl acreditezi la ICF — Level 1 (60–124 ore, 5 sesiuni observate, 10 ore de mentor coaching, evaluare finală), Level 2 (125+ ore, 6 sesiuni observate), Level 3 (75+ ore); acreditarea ține 3 ani și se bazează pe 7 standarde. În România, ca să predai în programe autorizate ai nevoie și de COR 242401 (formator); ca furnizor ai nevoie de autorizare ANC.',
             en:'Two different situations. (1) Teaching inside an accredited programme: instructors teaching ICF content must hold a credential — ACC/PCC/MCC at Level 1 and 2, MCC mandatory at Level 3; those observing sessions and giving written feedback must hold a credential; the director of education must hold PCC or MCC (MCC at Level 3) and 5 years of client experience. (2) Owning a programme: you accredit it with ICF — Level 1 (60–124 hours, 5 observed sessions, 10 mentor coaching hours, final evaluation), Level 2 (125+ hours, 6 observed sessions), Level 3 (75+ hours); accreditation lasts 3 years and rests on 7 standards. In Romania, teaching in authorised programmes also requires COR 242401 (trainer); being a provider requires ANC authorisation.'} },
        { t:{ro:'Realitatea de business, fără poezie', en:'The business reality, no poetry'},
          d:{ro:'Mentor coachingul și supervizarea se vând ca serviciu recurent (100–200 € pe oră, pachete de 10–13 ore), dar clienții vin din reputație și din rețeaua de absolvenți. Predarea aduce venit stabil doar cu volum sau cu program propriu acreditat — și cere muncă administrativă serioasă (curriculum, evaluări, documentație). Sfatul practic: intră în traseu după ce ai 2–3 ani de practică reală și candidați care ți-au obținut credențiala.',
             en:'Mentor coaching and supervision sell as recurring services (€100–200 per hour, 10–13 hour packages), but clients come from reputation and your alumni network. Teaching only produces stable income with volume or your own accredited programme — and it demands serious admin work (curriculum, assessments, documentation). Practical advice: enter the track after 2–3 years of real practice and candidates who earned their credential with you.'} }
      ],
      action:{ro:'Dacă te interesează unul dintre trasee, notează-l și scrie ce îți lipsește azi (credențială, ore, educație). Va fi ultima rubrică din planul tău.',
              en:'If one of these tracks interests you, note it and write what you are missing today (credential, hours, education). It becomes the last box in your plan.'},
      quiz:{
        q:{ro:'Vrei să fii mentor coach pentru candidați PCC. Care e combinația minimă corectă?',
           en:'You want to mentor PCC candidates. What is the correct minimum combination?'},
        opts:[
          { t:{ro:'Orice coach cu 5 ani de experiență', en:'Any coach with 5 years of experience'},
            why:{ro:'Nu. Fără credențială de nivel potrivit nu poți livra ore care contează.', en:'No. Without the right credential level your hours do not count.'} },
          { t:{ro:'Credențială PCC sau MCC activă + (din 1 ianuarie 2027) specializarea MCS-PCC', en:'An active PCC or MCC credential + (from 1 January 2027) the MCS-PCC specialisation'}, ok:true,
            why:{ro:'Corect. Până la 31 decembrie 2026 e suficientă credențiala; apoi se adaugă MCS.', en:'Correct. Until 31 December 2026 the credential suffices; the MCS is added after that.'} },
          { t:{ro:'Diploma de formator COR 242401', en:'A COR 242401 trainer diploma'},
            why:{ro:'Nu. Formatorul e pentru predare; mentor coachingul are alte cerințe.', en:'No. The trainer diploma is for teaching; mentor coaching has its own requirements.'} }
        ]
      },
      links:[{l:{ro:'Toate credențialele și specializările', en:'All credentials and specialties'}, h:'index.html#credentials'}, {l:{ro:'Trecerea între niveluri', en:'Bridges between levels'}, h:'index.html#transitions'}]
    },

    /* ---------- 10 ---------- */
    {
      id:'s10', icon:'📚', min:10,
      t:{ro:'Bibliotecă: cărți, studii, coachi de renume și comunități', en:'Library: books, studies, renowned coaches and communities'},
      sub:{ro:'Ce să citești, ce cercetare contează și cine sunt oamenii care au construit meseria — cu locurile lor.',
           en:'What to read, which research matters, and who built this profession — with where they are.'},
      learn:{ro:['Ai o listă scurtă de cărți, pe nivel de lectură','Știi care studii susțin afirmațiile despre coaching','Cunoști coachi de referință și unde activează','Ai comunități concrete în care să intri'],
             en:['You have a short book list, by reading level','You know which studies back coaching claims','You know reference coaches and where they work','You have concrete communities to join']},
      library:true,
      action:{ro:'Alege o singură carte din listă și citește primele 40 de pagini azi. Apoi alege un studiu și citește doar rezumatul — vei putea răspunde la întrebarea „chiar funcționează?” cu cifre.',
              en:'Pick one book from the list and read the first 40 pages today. Then pick one study and read only the abstract — you will be able to answer “does it work?” with numbers.'},
      quiz:{
        q:{ro:'Care afirmație este susținută de cercetare (2023–2025)?',
           en:'Which claim is supported by research (2023–2025)?'},
        opts:[
          { t:{ro:'Coachingul are un efect puternic, garantat, pentru oricine', en:'Coaching has a strong, guaranteed effect for everyone'},
            why:{ro:'Nu. Meta-analizele arată efecte moderate, cu variație mare între situații.', en:'No. Meta-analyses show moderate effects with large variation across situations.'} },
          { t:{ro:'Coachingul are un efect moderat, semnificativ statistic (g ≈ 0,5–0,6), mai mare la obiective și la auto-raportare', en:'Coaching has a moderate, statistically significant effect (g ≈ 0.5–0.6), larger for goals and self-reports'}, ok:true,
            why:{ro:'Corect: Theeboom 2014, Jones 2016, De Haan & Nilsson 2023 (37 studii randomizate) ajung la concluzii similare.', en:'Correct: Theeboom 2014, Jones 2016 and De Haan & Nilsson 2023 (37 randomised trials) converge on this.'} },
          { t:{ro:'Efectul nu a fost studiat serios, e doar marketing', en:'The effect has never been studied seriously, it is just marketing'},
            why:{ro:'Nu. Există meta-analize peer-reviewed, inclusiv pe studii randomizate.', en:'No. Peer-reviewed meta-analyses exist, including on randomised trials.'} }
        ]
      },
      links:[{l:{ro:'Ce spune cercetarea', en:'What research says'}, h:'teorie.html#cercetare'}, {l:{ro:'Surse oficiale', en:'Official sources'}, h:'index.html#sources'}]
    }
  ];

  /* ---------- Bibliotecă ---------- */
  var BOOKS = [
    { t:'Coaching for Performance', a:'Sir John Whitmore', y:1992, who:{ro:'Marea Britanie — pionierul care a adus GROW în coaching', en:'UK — the pioneer who brought GROW into coaching'},
      why:{ro:'Cartea care a definit meseria: principii, GROW pas cu pas, exemple. Începe de aici.', en:'The book that defined the profession: principles, GROW step by step, examples. Start here.'} },
    { t:'The Coaching Habit', a:'Michael Bungay Stanier', y:2016, who:{ro:'Toronto, Canada', en:'Toronto, Canada'},
      why:{ro:'7 întrebări care fac orice conversație mai bună. Practică imediată, fără teorie.', en:'7 questions that improve any conversation. Immediate practice, no theory.'} },
    { t:'Coaching Skills', a:'Jenny Rogers', y:2021, who:{ro:'Marea Britanie — format de coach executiv', en:'UK — executive coach trainer'},
      why:{ro:'Manual complet de abilități, cu exemple de transcrieri. Bun pentru prima practică.', en:'A complete skills manual with transcript examples. Good for first practice.'} },
    { t:'What Got You Here Won\'t Get You There', a:'Marshall Goldsmith', y:2007, who:{ro:'Nashville, SUA — coaching executiv', en:'Nashville, USA — executive coaching'},
      why:{ro:'Arată cum se lucrează comportamental la vârf: obiceiuri, feedback, follow-up.', en:'Shows behavioural work at the top: habits, feedback, follow-up.'} },
    { t:'Everyone Needs a Mentor', a:'David Clutterbuck', y:2014, who:{ro:'Marea Britanie — cofondator EMCC', en:'UK — EMCC co-founder'},
      why:{ro:'Diferă clar mentoringul de coaching și arată cum se construiește o relație de dezvoltare.', en:'Clearly separates mentoring from coaching and shows how a developmental relationship is built.'} },
    { t:'Coaching the Team at Work', a:'David Clutterbuck', y:2007, who:{ro:'Marea Britanie', en:'UK'},
      why:{ro:'Textul de referință pentru coaching de echipă, abordare bazată pe dovezi.', en:'The reference text for team coaching, evidence-based.'} },
    { t:'Systemic Coaching', a:'Peter Hawkins', y:2019, who:{ro:'Marea Britanie — Henley Business School', en:'UK — Henley Business School'},
      why:{ro:'Trece dincolo de individ: coaching cu echipa, stakeholderii și sistemul în minte.', en:'Goes beyond the individual: coaching with the team, stakeholders and the system in mind.'} },
    { t:'The Discomfort Zone', a:'Marcia Reynolds', y:2014, who:{ro:'Arizona, SUA — MCC, fost președinte ICF', en:'Arizona, USA — MCC, former ICF chair'},
      why:{ro:'Cum se lucrează cu schimbarea care chiar doare, fără a forța clientul.', en:'How to work with change that truly hurts, without forcing the client.'} },
    { t:'Relational Coaching', a:'Erik de Haan', y:2008, who:{ro:'Olanda / Marea Britanie — Ashridge, Hult', en:'Netherlands / UK — Ashridge, Hult'},
      why:{ro:'Coachingul văzut prin dovezi și prin relație; cine spune ce funcționează, și de ce.', en:'Coaching through evidence and relationship; who claims what works, and why.'} },
    { t:'Immunity to Change', a:'Robert Kegan & Lisa Lahey', y:2009, who:{ro:'Harvard, SUA', en:'Harvard, USA'},
      why:{ro:'De ce nu reușim să schimbăm ce ne propunem, chiar când vrem. Baza multor intervenții.', en:'Why we fail to change even when we want to. The basis of many interventions.'} },
    { t:'Helping People Change', a:'Richard Boyatzis, Melvin Smith & Ellen Van Oosten', y:2019, who:{ro:'Case Western Reserve, SUA', en:'Case Western Reserve, USA'},
      why:{ro:'Coaching centrat pe compasiune și pe viziunea ideală a clientului; are și cercetare serioasă.', en:'Coaching built on compassion and the client’s ideal vision; backed by serious research.'} },
    { t:'An Introduction to Coaching Skills', a:'Christian van Nieuwerburgh', y:2020, who:{ro:'Marea Britanie — University of East London', en:'UK — University of East London'},
      why:{ro:'Manual pedagogic, folosit în formări; foarte bun dacă vrei să predai coaching.', en:'A pedagogical textbook used in training; excellent if you want to teach coaching.'} }
  ];

  var STUDIES = [
    { t:'Theeboom, Beersma & van Vianen (2014)', j:'The Journal of Positive Psychology', d:{ro:'Meta-analiză pe 18 studii în organizații: efecte semnificative pe performanță și competențe (g = 0,60), atingerea obiectivelor (0,74), atitudini de muncă (0,54), wellbeing (0,46), coping (0,43).', en:'Meta-analysis of 18 organisational studies: significant effects on performance and skills (g = 0.60), goal attainment (0.74), work attitudes (0.54), wellbeing (0.46), coping (0.43).'},
      use:{ro:'Folosește-o când cineva spune „coachingul e doar o discuție” — are cifre.', en:'Use it when someone says “coaching is just a chat” — it has numbers.'} },
    { t:'Jones, Woods & Guillaume (2016)', j:'Journal of Occupational and Organizational Psychology', d:{ro:'Meta-analiză pe 17 studii de coaching la locul de muncă: efect global 0,36; afectiv 0,51; competențe 0,28; rezultate la nivel individual 1,24.', en:'Meta-analysis of 17 workplace coaching studies: overall effect 0.36; affective 0.51; skills 0.28; individual-level outcomes 1.24.'},
      use:{ro:'Arată unde impactul e mai mic (competențe) și unde e mai mare (individ).', en:'Shows where impact is smaller (skills) and where it is larger (the individual).'} },
    { t:'Athanasopoulou & Dopson (2018)', j:'The Leadership Quarterly', d:{ro:'Revizuire sistematică a rezultatelor coachingului executiv: efecte pozitive pe performanță, satisfacție și angajament, dar dependente de context (coach, client, organizație).', en:'Systematic review of executive coaching outcomes: positive effects on performance, satisfaction and commitment, but context-dependent (coach, client, organisation).'},
      use:{ro:'Bună pentru a tempera promisiunile: rezultatul depinde și de organizație.', en:'Good for tempering promises: results also depend on the organisation.'} },
    { t:'De Haan & Nilsson (2023)', j:'Academy of Management Learning & Education', d:{ro:'Meta-analiză doar pe studii randomizate: 37 studii, 2.528 participanți, efect moderat g = 0,59; efectele se văd mai ales în auto-raportare, iar autorii semnalează posibilă părtinire de publicare.', en:'Meta-analysis of randomised trials only: 37 studies, 2,528 participants, moderate effect g = 0.59; effects show mostly in self-reports, and the authors flag possible publication bias.'},
      use:{ro:'Cea mai riguroasă dovadă de până acum — și cea mai onestă despre limite.', en:'The most rigorous evidence so far — and the most honest about limits.'} },
    { t:'Grant, Curtayne & Burton (2009)', j:'Social Behavior and Personality', d:{ro:'Studiu randomizat cu control: coachingul executiv a crescut atingerea obiectivelor, reziliența și wellbeing-ul la locul de muncă.', en:'Randomised controlled study: executive coaching improved goal attainment, resilience and workplace wellbeing.'},
      use:{ro:'Exemplu clasic de design experimental, util când îți proiectezi propria evaluare.', en:'A classic experimental design, useful when you design your own evaluation.'} },
    { t:'ICF Global Coaching Study (2025)', j:'International Coaching Federation', d:{ro:'122.974 practicieni (+13%), venituri 5,34 mild. $ (+17%), tarif mediu 234 $ pe sesiune. Cea mai bună sursă pentru argumente de piață.', en:'122,974 practitioners (+13%), $5.34bn revenue (+17%), average fee $234 per session. The best source for market arguments.'},
      use:{ro:'Pune-o în business plan și în discuțiile despre tarif.', en:'Put it in your business plan and in fee conversations.'} }
  ];

  var COACHES = [
    { n:'Sir John Whitmore', c:{ro:'Marea Britanie (1937–2017)', en:'United Kingdom (1937–2017)'}, w:{ro:'GROW, „Coaching for Performance” — baza meseriei', en:'GROW, “Coaching for Performance” — the foundation'} },
    { n:'Timothy Gallwey', c:{ro:'SUA', en:'USA'}, w:{ro:'„The Inner Game” — originea ideii de potențial neexplorat', en:'“The Inner Game” — the origin of the untapped-potential idea'} },
    { n:'Marshall Goldsmith', c:{ro:'Nashville, SUA', en:'Nashville, USA'}, w:{ro:'Coaching executiv la vârf, feedback comportamental', en:'Top-level executive coaching, behavioural feedback'} },
    { n:'Michael Bungay Stanier', c:{ro:'Toronto, Canada', en:'Toronto, Canada'}, w:{ro:'„The Coaching Habit” — cel mai vândut manual de coaching al deceniului', en:'“The Coaching Habit” — the decade’s best-selling coaching manual'} },
    { n:'David Clutterbuck', c:{ro:'Marea Britanie — cofondator EMCC', en:'UK — EMCC co-founder'}, w:{ro:'Mentoring developmental, coaching de echipă, etică', en:'Developmental mentoring, team coaching, ethics'} },
    { n:'Peter Hawkins', c:{ro:'Marea Britanie — Henley Business School', en:'UK — Henley Business School'}, w:{ro:'Coaching sistemic și de echipă, supervizare', en:'Systemic and team coaching, supervision'} },
    { n:'Marcia Reynolds', c:{ro:'Arizona, SUA — MCC, fost președinte ICF', en:'Arizona, USA — MCC, former ICF chair'}, w:{ro:'Coaching transformațional, schimbare inconfortabilă', en:'Transformational coaching, uncomfortable change'} },
    { n:'Erik de Haan', c:{ro:'Olanda / Marea Britanie — Ashridge, Hult', en:'Netherlands / UK — Ashridge, Hult'}, w:{ro:'Cercetare pe dovezi: relația coach–client contează cel mai mult', en:'Evidence-based research: the coach–client relationship matters most'} },
    { n:'Anthony Grant', c:{ro:'Australia — University of Sydney', en:'Australia — University of Sydney'}, w:{ro:'Coaching bazat pe dovezi, psihologie pozitivă, atingerea obiectivelor', en:'Evidence-based coaching, positive psychology, goal attainment'} },
    { n:'Jonathan Passmore', c:{ro:'Marea Britanie — Henley Centre for Coaching', en:'UK — Henley Centre for Coaching'}, w:{ro:'Coaching digital, etică, antrenarea coachilor', en:'Digital coaching, ethics, coaching the coaches'} },
    { n:'Richard Boyatzis', c:{ro:'Case Western Reserve, SUA', en:'Case Western Reserve, USA'}, w:{ro:'Teoria schimbării intenționate, coaching cu compasiune', en:'Intentional change theory, compassionate coaching'} },
    { n:'Christian van Nieuwerburgh', c:{ro:'Marea Britanie — University of East London', en:'UK — University of East London'}, w:{ro:'Coaching în educație, formarea coachilor', en:'Coaching in education, training coaches'} },
    { n:'Robert Kegan & Lisa Lahey', c:{ro:'Harvard, SUA', en:'Harvard, USA'}, w:{ro:'„Immunity to Change” — de ce rezistăm la propria schimbare', en:'“Immunity to Change” — why we resist our own change'} },
    { n:'David Rock', c:{ro:'SUA — NeuroLeadership Institute', en:'USA — NeuroLeadership Institute'}, w:{ro:'Neuroștiință aplicată în coaching și leadership', en:'Neuroscience applied to coaching and leadership'} }
  ];

  var COMMUNITIES = [
    { n:'ICF România', d:{ro:'Capitolul local: evenimente, CCE-uri gratuite sau ieftine, rețea de coachi.', en:'The local chapter: events, cheap or free CCE credits, a coach network.'}, u:'https://www.coachingfederation.ro/' },
    { n:'EMCC România', d:{ro:'Comunitate orientată pe mentoring, supervizare și standarde europene.', en:'A community focused on mentoring, supervision and European standards.'}, u:'https://www.emccromania.net/' },
    { n:'ICF Global', d:{ro:'Resurse oficiale, cod etic, ghiduri de aplicare, examene.', en:'Official resources, code of ethics, application guides, exams.'}, u:'https://coachingfederation.org/' },
    { n:'Institute of Coaching (Harvard/McLean)', d:{ro:'Cercetare, webinarii, bibliotecă de studii pentru practicieni.', en:'Research, webinars, a study library for practitioners.'}, u:'https://instituteofcoaching.org/' }
  ];

  /* ---------- Insigne ---------- */
  var BADGES = [
    { id:'b1', ic:'🌱', t:{ro:'Nu mai ești la zero', en:'No longer at zero'}, d:{ro:'Ai trecut de primul pas', en:'You cleared the first step'}, need:['s1'] },
    { id:'b2', ic:'🧭', t:{ro:'Știi unde se aplică', en:'You know the contexts'}, d:{ro:'Ești sigur pe primele două opriri', en:'Solid on the first two stops'}, need:['s1','s2'] },
    { id:'b3', ic:'⚖️', t:{ro:'Competențe și etică', en:'Competencies and ethics'}, d:{ro:'Știi ce te obligă codul', en:'You know what the code requires'}, need:['s4'] },
    { id:'b4', ic:'🎓', t:{ro:'Procesul ICF la degetul mic', en:'ICF process at your fingertips'}, d:{ro:'Poți explica credențializarea altcuiva', en:'You could explain credentialing to someone else'}, need:['s6'] },
    { id:'b5', ic:'🧑‍🏫', t:{ro:'Mentor vs supervizor', en:'Mentor vs supervisor'}, d:{ro:'Faci diferența, cu reguli cu tot', en:'You can tell them apart, rules included'}, need:['s7'] },
    { id:'b6', ic:'🗺️', t:{ro:'Plan pe 12 luni', en:'12-month plan'}, d:{ro:'Ai terminat traseul și ți-ai scris planul', en:'You finished the journey and wrote your plan'}, need:['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10'] }
  ];

  var LEVELS = [
    { min:0,   t:{ro:'Curios', en:'Curious'} },
    { min:20,  t:{ro:'Explorator', en:'Explorer'} },
    { min:45,  t:{ro:'Ucenic', en:'Apprentice'} },
    { min:70,  t:{ro:'În formare', en:'In training'} },
    { min:100, t:{ro:'Practician', en:'Practitioner'} },
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
          state.a = o.a || {}; state.done = o.done || {}; state.quiz = o.quiz || {};
          state.xp = o.xp || 0; state.open = o.open || 's1';
        }
      }
    }catch(e){}
    state.setup = SETUP.every(function(q){ return !!state.a[q.id]; });
    state.xp = xp();   /* recalculat din progres, nu din ce a rămas în localStorage */
  }
  function save(){
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

  function libraryHTML(){
    var h = '';
    h += '<h3 class="start-lib-h">📕 ' + (lang()==='ro' ? '12 cărți care contează (în ordinea în care le-aș citi)' : '12 books that matter (in the order I would read them)') + '</h3>';
    h += '<div class="lib-grid">';
    BOOKS.forEach(function(b,i){
      h += '<div class="lib-card"><div class="lib-rank">' + (i+1) + '</div>';
      h += '<div class="lib-body"><h4>' + esc(b.t) + ' <span class="lib-year">' + b.y + '</span></h4>';
      h += '<p class="lib-author">' + esc(b.a) + ' · <span class="lib-where">' + esc(L(b.who)) + '</span></p>';
      h += '<p>' + esc(L(b.why)) + '</p></div></div>';
    });
    h += '</div>';

    h += '<h3 class="start-lib-h">📊 ' + (lang()==='ro' ? 'Studiile care susțin afirmațiile despre coaching' : 'The studies that back coaching claims') + '</h3>';
    h += '<div class="lib-grid">';
    STUDIES.forEach(function(s){
      h += '<div class="lib-card study"><div class="lib-body"><h4>' + esc(s.t) + '</h4>';
      h += '<p class="lib-author">' + esc(s.j) + '</p><p>' + esc(L(s.d)) + '</p>';
      h += '<p class="lib-use"><b>' + (lang()==='ro' ? 'La ce folosește: ' : 'What it is for: ') + '</b>' + esc(L(s.use)) + '</p></div></div>';
    });
    h += '</div>';

    h += '<h3 class="start-lib-h">🌍 ' + (lang()==='ro' ? 'Coachi de renume internațional și unde sunt' : 'Internationally renowned coaches and where they are') + '</h3>';
    h += '<div class="lib-grid">';
    COACHES.forEach(function(c){
      h += '<div class="lib-card person"><div class="lib-body"><h4>' + esc(c.n) + '</h4>';
      h += '<p class="lib-where">📍 ' + esc(L(c.c)) + '</p><p>' + esc(L(c.w)) + '</p></div></div>';
    });
    h += '</div>';

    h += '<h3 class="start-lib-h">🤝 ' + (lang()==='ro' ? 'Comunități în care să intri (unele au CCE-uri incluse)' : 'Communities to join (some include CCE credits)') + '</h3>';
    h += '<div class="lib-grid">';
    COMMUNITIES.forEach(function(c){
      h += '<div class="lib-card comm"><div class="lib-body"><h4><a href="' + c.u + '" target="_blank" rel="noopener">' + esc(c.n) + ' ↗</a></h4>';
      h += '<p>' + esc(L(c.d)) + '</p></div></div>';
    });
    h += '</div>';
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
      if(s.library){ h += libraryHTML(); }
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
    try{ history.replaceState(null, '', '#' + id); }
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
    var b = state.a.budget, t = state.a.time, w = state.a.who;
    if(lang() === 'en'){
      var r = b === 'small' ? 'Start with an ANC-authorised course (750–2,500 RON) + a separate mentor coaching package, and use the Portfolio route to ICF later.'
             : b === 'high' ? 'Go straight for an ICF Level 2 programme (PCC track) — you skip the top-up later and the fee difference pays for itself.'
             : 'Take an ICF Level 1 programme (ACC) delivered in Romanian, with mentor coaching and the evaluation included.';
      var p = t === 'fast' ? 'Intensive: ~4 months of training, hours accumulated in parallel, ACC application by month 10–12.'
             : t === 'slow' ? 'Own pace: 2 years to ACC is perfectly fine — hire a mentor early and log every hour from day one.'
             : 'Normal: 6–12 months to ACC, with 2–4 coaching hours per week.';
      var extra = w === 'pro' ? 'Your advantage: you already have a helping profession — say so explicitly in your positioning.'
                : w === 'leader' ? 'Your advantage: you have real organisational context — that is what corporate clients buy.'
                : w === 'employee' ? 'Your advantage: you know what it is like to change career under pressure — that is a real niche.'
                : 'Your advantage: time and curiosity. Use them to test contexts in step 2.';
      return { route:r, pace:p, extra:extra };
    }
    var r2 = b === 'small' ? 'Începe cu un curs autorizat ANC (750–2.500 RON) + un pachet separat de mentor coaching și folosește mai târziu ruta Portfolio spre ICF.'
            : b === 'high' ? 'Mergi direct spre un program ICF Level 2 (traseu PCC) — scutești top-up-ul de mai târziu, iar diferența de taxă se amortizează.'
            : 'Ia un program ICF Level 1 (ACC) livrat în română, cu mentor coaching și evaluarea incluse.';
    var p2 = t === 'fast' ? 'Intensiv: ~4 luni de formare, ore adunate în paralel, dosarul de ACC în luna 10–12.'
           : t === 'slow' ? 'În ritm propriu: 2 ani până la ACC e perfect acceptabil — ia mentorul devreme și notează fiecare oră din prima zi.'
           : 'Normal: 6–12 luni până la ACC, cu 2–4 ore de coaching pe săptămână.';
    var e2 = w === 'pro' ? 'Avantajul tău: ai deja o profesie de ajutorare — spune-o explicit în poziționare.'
           : w === 'leader' ? 'Avantajul tău: ai context organizațional real — exact ce cumpără clienții corporativi.'
           : w === 'employee' ? 'Avantajul tău: știi cum e să schimbi cariera sub presiune — e o nișă reală.'
           : 'Avantajul tău: timp și curiozitate. Folosește-le ca să testezi contextele din pasul 2.';
    return { route:r2, pace:p2, extra:e2 };
  }

  function planText(){
    var r = routeText();
    var ro = lang() !== 'en';
    var lines = [];
    if(ro){
      lines.push('PLANUL MEU — 12 LUNI SPRE O CREDENȚIALĂ');
      lines.push('');
      lines.push('Ruta recomandată: ' + r.route);
      lines.push('Ritm: ' + r.pace);
      lines.push(r.extra);
      lines.push('');
      lines.push('Lunile 0–1: verific 2–3 școli în ICF Education Search; pun cele 8 întrebări; aleg programul și semnez contractul.');
      lines.push('Lunile 1–7: formarea + 10 ore de mentor coaching începute din prima lună, întinse pe minimum 3 luni.');
      lines.push('Lunile 2–10: ore cu clienți reali, jurnal din prima zi (țintă 100 de ore, 75 plătite, 8 clienți).');
      lines.push('Luna 8: programez examenul (ACC: 60 de întrebări / 90 de minute) și fac 2 simulări cronometrate.');
      lines.push('Luna 10–12: depun dosarul la ICF, plătesc taxa (175 $ membru / 325 $ nemembru la ACC) și aștept review-ul (~4 săptămâni).');
      lines.push('După: construiesc practica spre PCC (500 de ore) și țin la zi cele 40 de CCE pentru reînnoirea la 3 ani.');
      lines.push('');
      lines.push('Primii 3 pași concreți chiar săptămâna asta: 1) verific o școală în ESS; 2) scriu 8 întrebări și le trimit; 3) deschid jurnalul de ore.');
      lines.push('Dacă îmi lipsește ceva la final: de citit 1 carte din listă, 1 studiu pe săptămână, 1 comunitate (ICF/EMCC România).');
    }else{
      lines.push('MY PLAN — 12 MONTHS TO A CREDENTIAL');
      lines.push('');
      lines.push('Recommended route: ' + r.route);
      lines.push('Pace: ' + r.pace);
      lines.push(r.extra);
      lines.push('');
      lines.push('Months 0–1: check 2–3 schools in ICF Education Search; ask the 8 questions; choose the programme and sign.');
      lines.push('Months 1–7: training + the 10 mentor coaching hours started in month one, spread over at least 3 months.');
      lines.push('Months 2–10: real client hours, a log from day one (target: 100 hours, 75 paid, 8 clients).');
      lines.push('Month 8: book the exam (ACC: 60 questions / 90 minutes) and sit two timed mock exams.');
      lines.push('Months 10–12: submit the ICF application, pay the fee ($175 member / $325 non-member at ACC) and wait ~4 weeks.');
      lines.push('After: build toward PCC (500 hours) and keep the 40 CCE credits for the 3-year renewal.');
      lines.push('');
      lines.push('Three concrete steps this week: 1) verify one school in ESS; 2) write the 8 questions and send them; 3) open the hour log.');
      lines.push('To fill the gaps: read 1 book from the list, 1 study per week, join 1 community (ICF/EMCC Romania).');
    }
    return lines.join('\n');
  }

  function planHTML(){
    if(!state.setup) return '';
    var r = routeText(), ro = lang() !== 'en';
    var h = '<h2>🗺️ ' + (ro ? 'Planul tău, personalizat' : 'Your personalised plan') + '</h2>';
    h += '<p class="start-lead">' + (ro
      ? 'Construit din cele 3 răspunsuri de la început și din tot ce ai parcurs. Îl poți copia sau printa.'
      : 'Built from your three answers and everything you covered. You can copy or print it.') + '</p>';
    h += '<div class="plan-grid">';
    h += '<div class="plan-card"><h4>' + (ro ? 'Ruta recomandată' : 'Recommended route') + '</h4><p>' + esc(r.route) + '</p></div>';
    h += '<div class="plan-card"><h4>' + (ro ? 'Ritm' : 'Pace') + '</h4><p>' + esc(r.pace) + '</p></div>';
    h += '<div class="plan-card"><h4>' + (ro ? 'Avantajul tău' : 'Your advantage') + '</h4><p>' + esc(r.extra) + '</p></div>';
    h += '</div>';
    h += '<pre class="start-plan-text" id="startPlanText">' + esc(planText()) + '</pre>';
    h += '<div class="start-plan-actions">';
    h += '<button type="button" class="btn btn-primary" id="startCopy">📋 ' + (ro ? 'Copiază planul' : 'Copy the plan') + '</button>';
    h += '<button type="button" class="btn btn-ghost" id="startPrint">🖨️ ' + (ro ? 'Printează' : 'Print') + '</button>';
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
      if(e.target && e.target.id === 'startPrint') window.print();
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
