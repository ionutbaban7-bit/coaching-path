/* coachinghub.ro — Journal: conținut editorial + conversații, local-first */
(function () {
  'use strict';

  var KEY = 'coachinghub_journal_v1';
  var API = '/api/forum';
  var $ = function (selector, root) { return (root || document).querySelector(selector); };
  var categories = {
    coaching: { ro: 'Coaching', en: 'Coaching' },
    practice: { ro: 'Practică', en: 'Practice' },
    credentials: { ro: 'Credențiale', en: 'Credentials' },
    career: { ro: 'Carieră', en: 'Career' },
    spirituality: { ro: 'Spiritualitate', en: 'Spirituality' },
    psychology: { ro: 'Psihologie', en: 'Psychology' },
    research: { ro: 'Cercetare', en: 'Research' },
    stories: { ro: 'Povești', en: 'Stories' },
    resources: { ro: 'Resurse', en: 'Resources' }
  };
  var seed = [
    {
      id: 'journal-1', kind: 'article', category: 'coaching', author: 'CoachingHub Editorial', role: 'Editorial',
      createdAt: '2026-09-21T09:00:00.000Z', updatedAt: '2026-09-21T09:00:00.000Z', readTime: '6 min', views: 96, likes: 18, dislikes: 1, featured: true, editorPick: true,
      title: { ro: 'Ce face o conversație de coaching utilă?', en: 'What makes a coaching conversation useful?' },
      body: {
        ro: 'O conversație bună nu este o demonstrație de tehnici. Este un spațiu în care clientul poate vedea mai clar ce contează, ce alege și ce este dispus să încerce. Coachul nu trebuie să umple fiecare secundă cu întrebări; uneori, precizia vine dintr-o tăcere bine ținută.\n\nÎnainte de orice instrument, merită clarificat acordul: pentru ce este conversația aceasta, ce ar face-o folositoare și cum vom ști la final că am lucrat la ce trebuia? Un acord mic, verificabil, protejează ambele părți de conversații vagi și de soluții aduse prea devreme.\n\nDupă sesiune, practica începe cu o reflecție concretă: ce am observat în client, ce am presupus eu, unde am grăbit sensul și ce feedback aș cere? Coachingul se maturizează când curiozitatea coachului rămâne mai mare decât nevoia lui de a avea dreptate.',
        en: 'A good conversation is not a demonstration of techniques. It is a space where the client can see more clearly what matters, what they choose and what they are willing to try. The coach does not need to fill every second with questions; sometimes precision comes from a well-held silence.\n\nBefore any tool, clarify the agreement: what is this conversation for, what would make it useful and how will we know at the end that we worked on the right thing? A small, observable agreement protects both people from vague conversations and solutions brought too early.\n\nAfter the session, practice begins with concrete reflection: what did I notice in the client, what did I assume, where did I rush meaning and what feedback would I ask for? Coaching matures when the coach’s curiosity stays larger than the need to be right.'
      },
      reflection: { ro: 'Ce ai face diferit într-o sesiune dacă nu ar trebui să dovedești că ești un coach bun?', en: 'What would you do differently in a session if you did not need to prove you are a good coach?' },
      replies: [
        { id: 'journal-1-r1', author: 'Andrei', role: 'PCC', createdAt: '2026-09-21T11:00:00.000Z', body: { ro: 'Aș lăsa acordul să fie mai specific și aș verifica mai devreme dacă încă lucrăm la ce contează pentru client.', en: 'I would make the agreement more specific and check earlier whether we are still working on what matters to the client.' } }
      ]
    },
    {
      id: 'journal-2', kind: 'article', category: 'spirituality', author: 'Daria Pop', role: 'coach & facilitator',
      createdAt: '2026-09-20T10:30:00.000Z', updatedAt: '2026-09-20T10:30:00.000Z', readTime: '7 min', views: 74, likes: 15, dislikes: 2,
      title: { ro: 'Spiritualitatea care nu te scoate din realitate', en: 'Spirituality that does not take you out of reality' },
      body: {
        ro: 'Spiritualitatea poate aduce sens, răgaz și o relație mai atentă cu viața. Devine însă riscantă când este folosită ca scurtătură peste durere, responsabilitate sau limite: „totul se întâmplă cu un motiv” poate suna liniștitor și poate închide o conversație prea repede.\n\nÎntr-un spațiu de coaching, este util să separăm trei niveluri. Experiența: ce simte și observă omul. Interpretarea: ce poveste construiește despre acea experiență. Cunoașterea susținută: ce poate fi verificat printr-o sursă sau printr-un proces de evaluare. Niciun nivel nu trebuie ridiculizat, dar nici amestecat cu celelalte.\n\nO întrebare matură nu atacă sensul clientului și nu îi vinde o explicație. Îl ajută să observe ce îi aduce acea explicație, ce cost are și ce alegere concretă rămâne posibilă acum.',
        en: 'Spirituality can bring meaning, spaciousness and a more attentive relationship with life. It becomes risky when used as a shortcut around pain, responsibility or boundaries: “everything happens for a reason” can sound comforting and close a conversation too soon.\n\nIn coaching, it helps to separate three levels. Experience: what the person feels and observes. Interpretation: the story they build about that experience. Supported knowledge: what can be checked through a source or an assessment process. No level needs to be mocked, but they should not be mixed together.\n\nA mature question does not attack the client’s sense of meaning or sell an explanation. It helps them notice what that explanation gives them, what it costs and what concrete choice remains possible now.'
      },
      reflection: { ro: 'Unde ai putea lăsa mai mult loc pentru mister fără să renunți la discernământ?', en: 'Where could you leave more room for mystery without giving up discernment?' },
      replies: []
    },
    {
      id: 'journal-3', kind: 'article', category: 'career', author: 'Ioana Mureșan', role: 'coach',
      createdAt: '2026-09-19T08:20:00.000Z', updatedAt: '2026-09-19T08:20:00.000Z', readTime: '5 min', views: 68, likes: 13, dislikes: 1,
      title: { ro: 'Nișa nu se găsește în bio. Se testează în conversații.', en: 'A niche is not found in a bio. It is tested in conversations.' },
      body: {
        ro: '„Lucrez cu lideri” este o descriere, nu încă o nișă. O nișă începe să capete formă când poți numi un context, o tensiune și o conversație pentru care oamenii caută ajutor: prima promovare, o echipă care evită dezacordul, o carieră care a devenit prea strâmtă.\n\nÎn loc să alegi o etichetă definitivă, poți face zece conversații de explorare. Nu le transforma în vânzări mascate. Întreabă ce încearcă persoana, ce a făcut deja, ce o costă blocajul și ce fel de sprijin ar considera util. Notează cuvintele ei, nu doar ipoteza ta despre ea.\n\nDupă aceea, formulează o propoziție provizorie și testeaz-o din nou. Nișa bună nu te închide; îți face practica mai ușor de recunoscut de către oamenii pentru care este relevantă.',
        en: '“I work with leaders” is a description, not yet a niche. A niche starts taking shape when you can name a context, a tension and a conversation for which people seek help: a first promotion, a team avoiding disagreement, a career that has become too narrow.\n\nInstead of choosing a final label, have ten exploratory conversations. Do not turn them into disguised sales calls. Ask what the person is trying, what they have already done, what the stuckness costs and what kind of support they would find useful. Note their words, not only your hypothesis about them.\n\nThen formulate a provisional sentence and test it again. A good niche does not trap you; it makes your practice easier to recognise for the people it is relevant to.'
      },
      reflection: { ro: 'Ce problemă au numit oamenii cu propriile lor cuvinte în ultimele tale conversații?', en: 'What problem have people named in their own words in your recent conversations?' },
      replies: [
        { id: 'journal-3-r1', author: 'Dana', role: 'coach', createdAt: '2026-09-19T12:00:00.000Z', body: { ro: 'Mi-a plăcut diferența dintre eticheta care sună bine și problema care poate fi recunoscută imediat.', en: 'I liked the difference between a label that sounds good and a problem people can immediately recognise.' } }
      ]
    },
    {
      id: 'journal-4', kind: 'article', category: 'credentials', author: 'CoachingHub Editorial', role: 'Ghid de orientare',
      createdAt: '2026-09-18T07:50:00.000Z', updatedAt: '2026-09-18T07:50:00.000Z', readTime: '8 min', views: 122, likes: 17, dislikes: 1, editorPick: true,
      title: { ro: 'ACC, PCC, MCC: cum citești traseul fără să te pierzi în acronime', en: 'ACC, PCC, MCC: how to read the path without getting lost in acronyms' },
      body: {
        ro: 'Un certificat de absolvire, acreditarea unui program și credențiala individuală nu sunt același lucru. Prima întrebare a traseului este, așadar, „ce confirmă documentul pe care îl primesc?”. A doua este „ce cere organismul profesional pentru nivelul la care vreau să aplic?”.\n\nPentru ruta ICF, ACC, PCC și MCC sunt repere de progres, cu cerințe diferite de educație, experiență, mentor coaching și evaluare. Numerele orientative nu trebuie învățate ca slogan; se verifică în sursa oficială, la data la care aplici. Pentru ANC, EMCC sau alte rute, termenii și condițiile pot fi diferite. Nu presupune conversii automate.\n\nUn roadmap bun nu începe cu acronimul cel mai înalt. Începe cu practica pe care o poți susține etic astăzi: formare potrivită, ore documentate, feedback, reflecție, mentorat și o nișă testată cu răbdare.',
        en: 'A completion certificate, programme accreditation and an individual credential are not the same thing. The first question on the path is therefore “what does the document I receive confirm?” The second is “what does the professional body require for the level I want to apply for?”\n\nOn the ICF route, ACC, PCC and MCC are progress markers with different education, experience, mentor coaching and assessment requirements. Orientation numbers should not be memorised as slogans; check the official source when you apply. ANC, EMCC and other routes may use different terms and conditions. Do not assume automatic conversions.\n\nA good roadmap does not begin with the highest acronym. It begins with the practice you can ethically support today: suitable training, documented hours, feedback, reflection, mentoring and a niche tested patiently.'
      },
      reflection: { ro: 'Ce informație oficială ai verifica astăzi înainte să alegi următorul curs?', en: 'What official information would you check today before choosing your next course?' },
      replies: []
    },
    {
      id: 'journal-5', kind: 'article', category: 'practice', author: 'Radu Enache', role: 'coach',
      createdAt: '2026-09-17T15:30:00.000Z', updatedAt: '2026-09-17T15:30:00.000Z', readTime: '4 min', views: 61, likes: 12, dislikes: 0,
      title: { ro: 'Când clientul nu are nevoie de încă o întrebare', en: 'When the client does not need another question' },
      body: {
        ro: 'Întrebările pot deschide spațiu, dar pot și acoperi prea repede ceea ce se întâmplă. Dacă un client tocmai a spus ceva important, o nouă întrebare poate fi mai puțin utilă decât o confirmare simplă: „Aș vrea să rămânem puțin aici. Ce observi acum?”.\n\nPrezența nu înseamnă pasivitate. Înseamnă să nu confunzi mișcarea conversației cu progresul ei. Poți reflecta un cuvânt, poți verifica acordul sau poți spune că ai observat o schimbare de ritm, lăsând clientului dreptul să corecteze percepția.\n\nÎn practica de început, numără nu doar întrebările bune, ci și momentele în care ai rezistat impulsului de a interveni. Uneori, intervenția cea mai curată este să fii acolo și să nu umpli tăcerea.',
        en: 'Questions can create space, but they can also cover too quickly what is happening. If a client has just said something important, another question may be less useful than a simple acknowledgement: “I would like to stay here for a moment. What do you notice now?”\n\nPresence is not passivity. It means not confusing movement in the conversation with progress. You can reflect a word, check the agreement or say that you noticed a change in pace, while leaving the client the right to correct your perception.\n\nIn early practice, count not only good questions, but also the moments when you resisted the impulse to intervene. Sometimes the cleanest intervention is to stay there and not fill the silence.'
      },
      reflection: { ro: 'Ce semnal îți arată că este momentul să încetinești?', en: 'What signal tells you it is time to slow down?' },
      replies: []
    },
    {
      id: 'journal-6', kind: 'article', category: 'research', author: 'Elena Pavel', role: 'practician reflexiv',
      createdAt: '2026-09-16T13:10:00.000Z', updatedAt: '2026-09-16T13:10:00.000Z', readTime: '6 min', views: 58, likes: 11, dislikes: 1,
      title: { ro: 'Un jurnal de practică îți arată ce faci, nu cine crezi că ești', en: 'A practice journal shows what you do, not who you think you are' },
      body: {
        ro: 'Reflecția profesională devine mai folositoare când pleacă de la o secvență concretă. În loc de „nu am fost suficient de prezent”, notează ce s-a spus, unde ai schimbat direcția și ce ai observat în corpul tău înainte de intervenție.\n\nUn format simplu poate avea cinci câmpuri: acordul sesiunii, momentul de cotitură, ipoteza ta, intervenția și efectul observabil. La final adaugă o întrebare pentru mentor sau pentru următoarea practică. Jurnalul nu este un tribunal și nu este o colecție de impresii; este o metodă de a-ți face munca vizibilă.\n\nCând datele se adună, apar tipare: poate grăbești închiderea, eviți emoția sau explici mai mult decât este util. Asta oferă un punct de lucru mai bun decât o etichetă globală despre tine.',
        en: 'Professional reflection becomes more useful when it starts from a concrete sequence. Instead of “I was not present enough”, note what was said, where you changed direction and what you noticed in your body before intervening.\n\nA simple format can have five fields: the session agreement, the turning point, your hypothesis, the intervention and the observable effect. Add one question for a mentor or the next practice. A journal is not a tribunal or a collection of impressions; it is a way of making your work visible.\n\nWhen the data accumulates, patterns appear: perhaps you rush closure, avoid emotion or explain more than is useful. That gives you a better point of work than a global label about yourself.'
      },
      reflection: { ro: 'Ce ai putea observa în următoarea sesiune fără să încerci încă să repari?', en: 'What could you observe in your next session without trying to fix it yet?' },
      replies: []
    },
    {
      id: 'journal-7', kind: 'article', category: 'psychology', author: 'Mihai Cristea', role: 'coach & researcher',
      createdAt: '2026-09-15T09:40:00.000Z', updatedAt: '2026-09-15T09:40:00.000Z', readTime: '5 min', views: 83, likes: 10, dislikes: 3,
      title: { ro: 'O întrebare bună nu este o tehnică magică', en: 'A good question is not a magic technique' },
      body: {
        ro: 'Aceeași întrebare poate crea claritate într-o conversație și presiune în alta. Efectul ei depinde de acord, relație, moment și de felul în care clientul o poate folosi. De aceea, o listă de întrebări „puternice” nu înlocuiește ascultarea.\n\nÎnainte de a întreba, verifică ce vrei să afli și pentru cine ar fi util răspunsul. Dacă întrebarea te ajută pe tine să te simți eficient, poate nu este încă în serviciul clientului. Poți cere permisiunea, poți spune ce ai observat sau poți formula întrebarea mai puțin spectaculos.\n\nCoachingul responsabil folosește psihologia ca reper, nu ca autoritate decorativă. Când citezi o idee, arată de unde vine și ce limită are. Când pornești de la experiență, spune că este experiență.',
        en: 'The same question can create clarity in one conversation and pressure in another. Its effect depends on agreement, relationship, timing and how the client can use it. A list of “powerful” questions therefore cannot replace listening.\n\nBefore asking, check what you want to learn and for whom the answer would be useful. If the question helps you feel effective, it may not yet be in service of the client. You can ask permission, name what you noticed or phrase the question less theatrically.\n\nResponsible coaching uses psychology as a reference, not as decorative authority. When you cite an idea, show where it comes from and what its limits are. When you start from experience, say that it is experience.'
      },
      reflection: { ro: 'Ce întrebare ai putea înlocui cu o observație și o pauză?', en: 'Which question could you replace with an observation and a pause?' },
      replies: []
    },
    {
      id: 'journal-8', kind: 'article', category: 'stories', author: 'Mara Ionescu', role: 'coach în formare',
      createdAt: '2026-09-14T12:10:00.000Z', updatedAt: '2026-09-14T12:10:00.000Z', readTime: '4 min', views: 49, likes: 14, dislikes: 0,
      title: { ro: 'Povești din practică: tăcerea de după întrebare', en: 'Practice stories: the silence after the question' },
      body: {
        ro: 'La început, tăcerea de după întrebare mi se părea un gol pe care trebuia să îl umplu. Îmi imaginam că clientul așteaptă următoarea intervenție și că eu trebuie să arăt că știu ce fac. Într-o sesiune, am spus întrebarea și am auzit propriul impuls de a o explica.\n\nDe data aceasta am rămas. Clientul a privit în jos, apoi a spus: „Nu m-am întrebat niciodată asta fără să caut imediat un răspuns”. Nu a fost o revelație spectaculoasă. A fost un centimetru de spațiu în care a putut gândi altfel.\n\nAm plecat cu o lecție mică: uneori nu am nevoie de o întrebare mai bună, ci de mai multă încredere în timpul de care are nevoie celălalt. Povestea este anonimă și detaliile sunt schimbate pentru protejarea confidențialității.',
        en: 'At the beginning, the silence after a question felt like a gap I had to fill. I imagined the client was waiting for the next intervention and that I needed to show I knew what I was doing. In one session, I asked the question and heard my own impulse to explain it.\n\nThis time I stayed. The client looked down and then said: “I have never asked myself that without immediately looking for an answer.” It was not a spectacular revelation. It was an inch of space in which they could think differently.\n\nI left with a small lesson: sometimes I do not need a better question, but more trust in the time the other person needs. The story is anonymous and details have been changed to protect confidentiality.'
      },
      reflection: { ro: 'Ce faci ca să nu transformi tăcerea clientului într-o problemă a ta?', en: 'What do you do so that a client’s silence does not become your problem?' },
      replies: []
    },
    {
      id: 'journal-9', kind: 'article', category: 'resources', author: 'CoachingHub Editorial', role: 'Bibliotecă vie',
      createdAt: '2026-09-13T08:00:00.000Z', updatedAt: '2026-09-13T08:00:00.000Z', readTime: '5 min', views: 91, likes: 9, dislikes: 1,
      title: { ro: 'Cum alegi o carte de coaching fără să confunzi povestea cu dovada', en: 'How to choose a coaching book without confusing a story with evidence' },
      body: {
        ro: 'O carte poate fi valoroasă pentru limbaj, curaj sau o perspectivă nouă fără să fie un manual de dovezi. Când alegi o lectură, întreabă-te ce cauți: o poveste care te însoțește, un model de practică, o sinteză de cercetare sau un punct de vedere personal.\n\nCitește autorul în contextul lui. Notează afirmațiile care sună universal și caută sursa lor. Separă recomandările pe care le poți testa în siguranță de promisiunile care cer să crezi înainte să verifici. Un exercițiu bun îți oferă o întrebare de explorat, nu o identitate de cumpărat.\n\nÎn bibliotecă, vom lega pe cât posibil ideile de surse oficiale, lucrări originale și repere profesionale. Iar când un text este eseu sau experiență, îl vom numi așa.',
        en: 'A book can be valuable for language, courage or a new perspective without being an evidence manual. When choosing a read, ask what you are looking for: a story that accompanies you, a practice model, a research synthesis or a personal point of view.\n\nRead the author in context. Note claims that sound universal and look for their source. Separate recommendations you can safely test from promises that ask you to believe before checking. A good exercise gives you a question to explore, not an identity to buy.\n\nIn the library, we will connect ideas where possible to official sources, original work and professional reference points. When a text is an essay or an experience, we will name it as such.'
      },
      reflection: { ro: 'Ce fel de lectură îți este necesară acum: hartă, oglindă sau instrument?', en: 'What kind of reading do you need now: a map, a mirror or a tool?' },
      replies: []
    },
    {
      id: 'journal-10', kind: 'article', category: 'coaching', author: 'CoachingHub Editorial', role: 'Perspective editorială',
      createdAt: '2026-09-23T09:30:00.000Z', updatedAt: '2026-09-23T09:30:00.000Z', readTime: '11 min', views: 0, likes: 0, dislikes: 0, featured: true, editorPick: true,
      title: { ro: 'Top 10 Mituri despre Coaching', en: 'Top 10 Myths About Coaching' },
      body: {
        ro: 'Coachingul are o problemă de identitate: este vândut uneori ca magie, apărat ca știință exactă și practicat ca o conversație în care coachul așteaptă să audă propria idee din gura clientului. Între aceste imagini, omul nu mai știe ce cumpără.\n\n1. MITUL: Un coach bun îți spune ce să faci. Dacă faci asta, poți fi consultant sau mentor. Valoarea coachingului nu este să ascundă răspunsul corect, ci să creeze condițiile în care clientul vede mai limpede ce alege și ce își asumă.\n\n2. MITUL: Întrebările puternice rezolvă conversația. Nu există întrebări magice. O întrebare spectaculoasă, pusă fără acord sau fără ascultare, este doar presiune în haine elegante.\n\n3. MITUL: Clientul trebuie reparat. Uneori problema nu este în interiorul persoanei, ci într-o structură nedreaptă, într-un mediu toxic, într-o boală sau într-o lipsă reală de resurse. A transforma orice suferință într-o problemă de mindset este orbire, nu responsabilizare.\n\n4. MITUL: Pozitivitatea vindecă întotdeauna. „Privește partea bună” poate închide durerea înainte să fie auzită. O sesiune matură ține împreună faptul că ceva este greu și faptul că un pas rămâne posibil.\n\n5. MITUL: Orice problemă este o credință limitativă. Nu orice obstacol este o poveste din capul tău. Unele sunt consecințe reale ale unei decizii, ale unei piețe, ale unei relații sau ale corpului.\n\n6. MITUL: Certificarea te face coach. Hârtia poate deschide ușa. Nu poate purta conversația în locul tău. Competența se construiește prin practică observată, feedback, supervizare, reflecție și limite etice.\n\n7. MITUL: Coachingul funcționează pentru toată lumea. Nu pentru orice problemă, în orice moment și în orice relație. Uneori omul are nevoie de psihoterapie, îngrijire medicală, mediere sau protecție. A face trimiterea corectă este responsabilitate, nu eșec comercial.\n\n8. MITUL: Emoția intensă înseamnă progres. Lacrimile și revelațiile pot conta, dar nu sunt scorul unei sesiuni. Uneori progresul este o observație mică, testată mâine.\n\n9. MITUL: Coachul trebuie să fie complet neutru. Coachul are valori și presupuneri. Maturitatea nu este să pretindă că nu există, ci să le observe, să nu le impună și să poată fi corectat. Neutralitatea mimată este influență fără responsabilitate.\n\n10. MITUL: Un coach bun vede cine poți deveni. Poate vedea o posibilitate, dar poate proiecta și propria poveste. Clientul nu a venit să devină personajul din imaginația coachului, ci să-și examineze viața cu mai multă libertate.\n\nMindfuck-ul coachingului este acesta: nu ești util pentru că știi unde trebuie să ajungă celălalt. Ești util când poți rămâne prezent lângă necunoscut fără să-l umpli imediat cu o explicație. Coachingul nu este arta de a schimba oameni, ci practica unor conversații în care realitatea, opțiunile și responsabilitatea devin mai clare. Uneori omul nu pleacă mai convins că este extraordinar. Pleacă mai puțin dispus să se mintă.',
        en: 'Coaching has an identity problem: it is sometimes sold as magic, defended as exact science and practised as a conversation in which the coach waits to hear their own idea from the client. Between these images, people no longer know what they are buying.\n\n1. MYTH: A good coach tells you what to do. If you do that, you may be a consultant or mentor. Coaching is not hiding the correct answer; it is creating conditions in which the client can see what they choose and what they are willing to own.\n\n2. MYTH: Powerful questions solve the conversation. There are no magical questions. A spectacular question asked without agreement or listening is simply pressure in elegant clothing.\n\n3. MYTH: The client needs fixing. Sometimes the problem is not inside the person, but in an unfair structure, a toxic environment, illness or a real lack of resources. Turning every form of suffering into a mindset problem is blindness, not empowerment.\n\n4. MYTH: Positivity always heals. “Look on the bright side” can close pain before it has been heard. Mature coaching can hold together the fact that something is difficult and the fact that one step remains possible.\n\n5. MYTH: Every problem is a limiting belief. Not every obstacle is a story in your head. Some are real consequences of a decision, a market, a relationship or the body.\n\n6. MYTH: Certification makes you a coach. Paper may open a door. It cannot carry the conversation for you. Competence grows through observed practice, feedback, supervision, reflection and ethical boundaries.\n\n7. MYTH: Coaching works for everyone. Not for every problem, at every moment or in every relationship. Sometimes a person needs psychotherapy, medical care, mediation or protection. A correct referral is responsibility, not commercial failure.\n\n8. MYTH: Intense emotion means progress. Tears and revelations may matter, but they are not the score of a session. Sometimes progress is one small observation tested tomorrow.\n\n9. MYTH: A coach must be completely neutral. A coach has values and assumptions. Maturity means noticing them, not imposing them and being open to correction. Performed neutrality is influence without accountability.\n\n10. MYTH: A good coach sees who you can become. They may see a possibility, but they may also project their own story. The client did not come to become a character in the coach’s imagination, but to examine their life with more freedom.\n\nThe coaching mindfuck is this: you are not useful because you know where the other person should go. You are useful when you can stay present beside the unknown without immediately filling it with an explanation. Coaching is not the art of changing people, but the practice of conversations in which reality, options and responsibility become clearer. Sometimes people do not leave convinced they are extraordinary. They leave less willing to lie to themselves.'
      },
      reflection: { ro: 'Care dintre aceste mituri ți-ar fi cel mai greu să-l lași jos dacă ți-ar susține identitatea profesională?', en: 'Which of these myths would be hardest to release if it supported your professional identity?' },
      replies: []
    }
  ];
  var topics = [];
  var remote = false;
  var selected = null;
  var activeCategory = 'all';

  function isRo() { return !document.documentElement.lang || document.documentElement.lang !== 'en'; }
  function T(ro, en) { return isRo() ? ro : en; }
  function value(input) {
    if (input && typeof input === 'object') return input[isRo() ? 'ro' : 'en'] || input.ro || input.en || '';
    return String(input || '');
  }
  function copy(input) {
    if (input && typeof input === 'object') return { ro: input.ro || input.en || '', en: input.en || input.ro || '' };
    return { ro: String(input || ''), en: String(input || '') };
  }
  function number(input) { var n = Number(input); return Number.isFinite(n) && n >= 0 ? Math.round(n) : 0; }
  function hydrate(topic) {
    topic = topic || {};
    return Object.assign({}, topic, {
      title: copy(topic.title), body: copy(topic.body), reflection: copy(topic.reflection),
      views: number(topic.views), likes: number(topic.likes), dislikes: number(topic.dislikes),
      readTime: String(topic.readTime || ''), featured: topic.featured === true, editorPick: topic.editorPick === true,
      replies: Array.isArray(topic.replies) ? topic.replies.slice(0, 100).map(function (reply) { return Object.assign({}, reply, { body: copy(reply.body) }); }) : []
    });
  }
  function cloneSeed() { return seed.map(hydrate); }
  function readLocal() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!Array.isArray(data) || !data.length) return cloneSeed();
      var existing = data.map(hydrate);
      var known = existing.reduce(function (map, topic) { map[topic.id] = true; return map; }, {});
      return existing.concat(seed.filter(function (topic) { return !known[topic.id]; }).map(hydrate));
    }
    catch (e) { return cloneSeed(); }
  }
  function saveLocal() { try { localStorage.setItem(KEY, JSON.stringify(topics)); } catch (e) {} }
  function canRemote() { return typeof window.fetch === 'function' && location.protocol !== 'file:'; }
  function request(url, options) {
    if (!canRemote()) return Promise.reject(new Error('local'));
    return window.fetch(url, Object.assign({ headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }, options || {})).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (body) { if (!response.ok) throw new Error(body.error || 'Request failed'); return body; });
    });
  }
  function formatDate(iso) {
    var date = new Date(iso);
    if (isNaN(date.getTime())) return '';
    try { return new Intl.DateTimeFormat(isRo() ? 'ro-RO' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date); }
    catch (e) { return date.toISOString().slice(0, 10); }
  }
  function categoryLabel(id) { return categories[id] ? value(categories[id]) : id; }
  function kindLabel(kind) { return kind === 'discussion' ? T('Conversație', 'Conversation') : T('Articol', 'Article'); }
  function roleLabel(role) {
    if (role && typeof role === 'object') return value(role);
    var labels = {
      'Ghid de orientare': { ro: 'Ghid de orientare', en: 'Orientation guide' },
      'practician reflexiv': { ro: 'practician reflexiv', en: 'reflective practitioner' },
      'coach în formare': { ro: 'coach în formare', en: 'coach in training' },
      'Bibliotecă vie': { ro: 'Bibliotecă vie', en: 'Living library' },
      'Perspective editorială': { ro: 'Perspective editorială', en: 'Editorial perspective' },
      'Editorial': { ro: 'Editorial', en: 'Editorial' }
    };
    return labels[role] ? value(labels[role]) : String(role || '');
  }
  function readTime(topic) {
    if (topic.readTime) return topic.readTime;
    var words = value(topic.body).trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.min(12, Math.ceil(words / 180))) + ' min';
  }
  function setStatus(message) { var node = $('#forumStatus'); if (node) node.textContent = message || ''; }
  function searchTerm() { return ($('#forumSearch') && $('#forumSearch').value || '').trim().toLocaleLowerCase(); }
  function topicMatches(topic) {
    var needle = searchTerm();
    var haystack = [value(topic.title), value(topic.body), value(topic.reflection), topic.author, roleLabel(topic.role), categoryLabel(topic.category)].join(' ').toLocaleLowerCase();
    return (activeCategory === 'all' || topic.category === activeCategory) && (!needle || haystack.indexOf(needle) >= 0);
  }
  function compareDate(a, b) { return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt); }
  function appreciation(topic) { return number(topic.likes) - number(topic.dislikes); }
  function sorted(list, mode) {
    return list.slice().sort(function (a, b) {
      if (mode === 'read') return number(b.views) - number(a.views) || compareDate(a, b);
      if (mode === 'liked') return appreciation(b) - appreciation(a) || number(b.likes) - number(a.likes) || compareDate(a, b);
      return compareDate(a, b);
    });
  }
  function el(name, className, content) {
    var node = document.createElement(name);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }
  function reactionButton(topic, reaction, compact) {
    var button = el('button', 'journal-reaction' + (hasReaction(topic.id) === reaction ? ' is-active' : ''), reaction === 'like' ? '↑ ' + topic.likes : '↓ ' + topic.dislikes);
    button.type = 'button'; button.dataset.journalAction = 'react'; button.dataset.reaction = reaction; button.dataset.topicId = topic.id;
    button.setAttribute('aria-label', reaction === 'like' ? T('Apreciază articolul', 'Like article') : T('Nu este pentru mine', 'Dislike article'));
    if (compact) button.title = button.getAttribute('aria-label');
    return button;
  }
  function hasReaction(id) { try { return localStorage.getItem('coachinghub_journal_reaction_' + id) || ''; } catch (e) { return ''; } }
  function footer(topic, featured) {
    var node = el('div', 'journal-card-footer');
    var left = el('div', 'journal-card-footer-left');
    left.append(el('span', 'journal-metric', readTime(topic)), el('span', 'journal-metric', '◌ ' + topic.views));
    var actions = el('div', 'journal-card-actions'); actions.append(reactionButton(topic, 'like', true), reactionButton(topic, 'dislike', true));
    node.append(left, actions); return node;
  }
  function card(topic) {
    var article = el('article', 'journal-card'); article.tabIndex = 0; article.setAttribute('role', 'button'); article.setAttribute('aria-label', value(topic.title)); article.dataset.topicId = topic.id;
    var meta = el('div', 'journal-card-meta'); meta.append(el('span', 'journal-card-tag', categoryLabel(topic.category)), el('span', '', kindLabel(topic.kind)), el('span', '', topic.author + (topic.role ? ' · ' + roleLabel(topic.role) : '')), el('time', '', formatDate(topic.createdAt)));
    article.append(meta, el('h3', 'journal-card-title', value(topic.title)), el('p', 'journal-card-excerpt', excerpt(topic)), footer(topic, false));
    return article;
  }
  function excerpt(topic) {
    var text = value(topic.body).split(/\n\s*\n/)[0].replace(/\s+/g, ' ').trim();
    return text.slice(0, 215) + (text.length > 215 ? '…' : '');
  }
  function featuredCard(topic) {
    if (!topic) return el('p', 'journal-empty', T('Nu există încă un articol pentru selecția aleasă.', 'There is no article for this selection yet.'));
    var article = el('article', 'journal-featured-card'); article.tabIndex = 0; article.setAttribute('role', 'button'); article.setAttribute('aria-label', value(topic.title)); article.dataset.topicId = topic.id;
    var main = el('div', 'journal-card-main'); var meta = el('div', 'journal-card-meta'); meta.append(el('span', 'journal-card-tag', categoryLabel(topic.category)), el('span', '', kindLabel(topic.kind)), el('span', '', topic.author + (topic.role ? ' · ' + roleLabel(topic.role) : '')), el('span', '', formatDate(topic.createdAt)));
    main.append(meta, el('h3', 'journal-card-title', value(topic.title)), el('p', 'journal-card-excerpt', excerpt(topic)));
    var side = el('div', 'journal-card-side'); side.append(el('p', '', value(topic.reflection) || T('O idee pentru practica ta, nu o rețetă pentru toată lumea.', 'An idea for your practice, not a recipe for everyone.')), footer(topic, true));
    article.append(main, side); return article;
  }
  function rankedCard(topic, index) {
    var item = el('div', 'journal-ranked-card'); item.tabIndex = 0; item.setAttribute('role', 'button'); item.setAttribute('aria-label', value(topic.title)); item.dataset.topicId = topic.id;
    var numberLabel = el('span', 'journal-ranked-number', String(index + 1).padStart(2, '0'));
    var copyNode = el('div'); copyNode.append(el('h3', 'journal-ranked-title', value(topic.title)), el('p', 'journal-ranked-meta', categoryLabel(topic.category) + ' · ' + readTime(topic) + ' · ' + topic.views + ' ' + T('citiri', 'reads')));
    item.append(numberLabel, copyNode); return item;
  }
  function renderRanked(selector, list) {
    var box = $(selector); if (!box) return; box.replaceChildren();
    if (!list.length) { box.append(el('p', 'journal-empty', T('Încă nu există suficiente date.', 'There is not enough data yet.'))); return; }
    list.slice(0, 3).forEach(function (topic, index) { box.append(rankedCard(topic, index)); });
  }
  function render() {
    var box = $('#forumTopics'), featuredBox = $('#journalFeatured'); if (!box || !featuredBox) return;
    var visible = topics.filter(topicMatches); var sortMode = ($('#journalSort') && $('#journalSort').value) || 'latest'; var featured = sorted(visible.filter(function (topic) { return topic.featured || topic.editorPick; }), 'latest')[0] || sorted(visible, 'latest')[0];
    featuredBox.replaceChildren(featuredCard(featured)); box.replaceChildren();
    var latest = sorted(visible, sortMode).filter(function (topic) { return !featured || topic.id !== featured.id; });
    if (!latest.length) box.append(el('p', 'journal-empty', visible.length ? T('Selecția este afișată mai sus. Explorează o altă categorie sau sortare.', 'The selection is shown above. Explore another category or sort.') : T('Nu există articole pentru filtrul ales. Încearcă o altă categorie sau caută un termen mai larg.', 'There are no articles for this filter. Try another category or a broader search.')));
    else latest.slice(0, 8).forEach(function (topic) { box.append(card(topic)); });
    renderRanked('#journalMostRead', sorted(visible, 'read'));
    renderRanked('#journalMostLiked', sorted(visible, 'liked'));
    setStatus(visible.length + ' ' + T(visible.length === 1 ? 'articol' : 'articole', visible.length === 1 ? 'article' : 'articles') + (remote ? ' · ' + T('sincronizat', 'synced') : ' · ' + T('salvat în acest browser', 'saved in this browser')));
  }
  function openDialog(node) { if (node) node.hidden = false; document.documentElement.classList.add('forum-open'); }
  function closeDialog(node) { if (node) node.hidden = true; if (!$('#topicDialog:not([hidden])') && !$('#threadDialog:not([hidden])')) document.documentElement.classList.remove('forum-open'); }
  function findTopic(id) { return topics.find(function (topic) { return topic.id === id; }); }
  function replaceTopic(next) { if (!next) return; var fresh = hydrate(next); var index = topics.findIndex(function (topic) { return topic.id === fresh.id; }); if (index >= 0) topics[index] = fresh; else topics.unshift(fresh); saveLocal(); }
  function appendParagraphs(node, text) { value(text).split(/\n\s*\n/).filter(Boolean).forEach(function (paragraph) { node.append(el('p', '', paragraph.trim())); }); }
  function renderThread(topic) {
    var title = $('#threadTitle'), content = $('#threadContent'); if (!title || !content || !topic) return;
    selected = topic.id; title.textContent = value(topic.title); content.replaceChildren();
    var meta = el('p', 'journal-article-meta', categoryLabel(topic.category) + ' · ' + kindLabel(topic.kind) + ' · ' + topic.author + (topic.role ? ' · ' + roleLabel(topic.role) : '') + ' · ' + formatDate(topic.createdAt) + ' · ' + readTime(topic) + ' · ' + topic.views + ' ' + T('citiri', 'reads'));
    var body = el('div', 'journal-article-body'); appendParagraphs(body, topic.body);
    content.append(meta, body);
    if (value(topic.reflection)) { var reflection = el('aside', 'journal-reflection'); reflection.append(el('strong', '', T('Pentru reflecție', 'For reflection')), el('span', '', value(topic.reflection))); content.append(reflection); }
    var actions = el('div', 'journal-article-actions'); actions.append(el('span', 'journal-metric', '◌ ' + topic.views + ' ' + T('citiri', 'reads')), reactionButton(topic, 'like', false), reactionButton(topic, 'dislike', false)); content.append(actions);
    var replies = el('section', 'journal-replies'); replies.append(el('h3', '', T('Conversația continuă', 'The conversation continues') + ' (' + topic.replies.length + ')'));
    topic.replies.forEach(function (reply) { var item = el('article', 'journal-reply'); item.append(el('div', 'journal-reply-meta', reply.author + (reply.role ? ' · ' + roleLabel(reply.role) : '') + ' · ' + formatDate(reply.createdAt)), el('div', 'journal-reply-body', value(reply.body))); replies.append(item); });
    var form = document.createElement('form'); form.className = 'journal-submit';
    var authorLabel = document.createElement('label'); authorLabel.append(el('span', '', T('Numele afișat', 'Display name'))); var author = document.createElement('input'); author.name = 'author'; author.maxLength = 60; author.required = true; author.placeholder = T('Ex.: Ana', 'E.g. Ana'); authorLabel.append(author);
    var bodyLabel = document.createElement('label'); bodyLabel.append(el('span', '', T('Adaugă perspectiva ta', 'Add your perspective'))); var replyBody = document.createElement('textarea'); replyBody.name = 'body'; replyBody.rows = 4; replyBody.maxLength = 2400; replyBody.required = true; replyBody.placeholder = T('Scrie cu context și grijă pentru confidențialitate…', 'Write with context and care for confidentiality…'); bodyLabel.append(replyBody);
    var submitActions = el('div', 'journal-submit-actions'); var submit = el('button', 'ac-btn ac-btn-primary', T('Trimite răspunsul', 'Send reply') + ' ↗'); submit.type = 'submit'; submitActions.append(submit); form.append(authorLabel, bodyLabel, submitActions);
    form.addEventListener('submit', function (event) { event.preventDefault(); submitReply(topic.id, { author: author.value.trim(), body: replyBody.value.trim() }, form); });
    replies.append(form); content.append(replies); openDialog($('#threadDialog'));
  }
  function recordView(topic) {
    var key = 'coachinghub_journal_view_' + topic.id;
    try { if (localStorage.getItem(key)) return; localStorage.setItem(key, '1'); } catch (e) {}
    topic.views = number(topic.views) + 1; saveLocal(); renderThread(topic); render();
    if (canRemote()) request(API + '/' + encodeURIComponent(topic.id) + '/view', { method: 'POST', body: '{}' }).then(function (data) { if (data.topic) replaceTopic(data.topic); var fresh = findTopic(topic.id); if (fresh) renderThread(fresh); render(); }).catch(function () {});
  }
  function react(topicId, reaction) {
    var topic = findTopic(topicId); if (!topic || (reaction !== 'like' && reaction !== 'dislike')) return;
    if (hasReaction(topicId)) { setStatus(T('Ai înregistrat deja o reacție pentru acest articol în acest browser.', 'You have already reacted to this article in this browser.')); return; }
    try { localStorage.setItem('coachinghub_journal_reaction_' + topicId, reaction); } catch (e) {}
    if (reaction === 'like') topic.likes = number(topic.likes) + 1; else topic.dislikes = number(topic.dislikes) + 1;
    saveLocal(); render(); if (selected === topicId) renderThread(topic);
    if (canRemote()) request(API + '/' + encodeURIComponent(topicId) + '/react', { method: 'POST', body: JSON.stringify({ value: reaction }) }).then(function (data) { if (data.topic) replaceTopic(data.topic); var fresh = findTopic(topicId); if (fresh) { render(); if (selected === topicId) renderThread(fresh); } }).catch(function () {});
  }
  function openThread(id) { var topic = findTopic(id); if (!topic) return; renderThread(topic); recordView(topic); }
  function payloadFromForm(form) { return { author: form.elements.author.value.trim(), kind: form.elements.kind.value, category: form.elements.category.value, title: form.elements.title.value.trim(), body: form.elements.body.value.trim() }; }
  function localTopic(payload) { return hydrate({ id: 'local-' + Date.now() + '-' + Math.random().toString(16).slice(2), kind: payload.kind, category: payload.category, author: payload.author, role: T('participant', 'participant'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), readTime: '', views: 0, likes: 0, dislikes: 0, title: { ro: payload.title, en: payload.title }, body: { ro: payload.body, en: payload.body }, reflection: { ro: '', en: '' }, replies: [] }); }
  function submitTopic(payload, form) {
    if (!payload.author || !payload.title || !payload.body) return;
    var button = form.querySelector('button[type=submit]'); if (button) button.disabled = true;
    var done = function (topic, synced) { topics.unshift(hydrate(topic)); remote = synced; saveLocal(); form.reset(); closeDialog($('#topicDialog')); render(); openThread(topic.id); };
    if (canRemote()) request(API, { method: 'POST', body: JSON.stringify(payload) }).then(function (data) { done(data.topic, true); }).catch(function () { done(localTopic(payload), false); }).finally(function () { if (button) button.disabled = false; });
    else { done(localTopic(payload), false); if (button) button.disabled = false; }
  }
  function submitReply(topicId, payload, form) {
    if (!payload.author || !payload.body) return;
    var topic = findTopic(topicId); if (!topic) return;
    var done = function (reply, synced) { topic.replies = topic.replies || []; topic.replies.push(Object.assign({}, reply, { body: copy(reply.body) })); topic.updatedAt = reply.createdAt; remote = synced; saveLocal(); renderThread(topic); render(); };
    if (canRemote()) request(API + '/' + encodeURIComponent(topicId) + '/replies', { method: 'POST', body: JSON.stringify(payload) }).then(function (data) { done(data.reply, true); }).catch(function () { done({ id: 'local-reply-' + Date.now(), author: payload.author, role: T('participant', 'participant'), createdAt: new Date().toISOString(), body: { ro: payload.body, en: payload.body } }, false); });
    else done({ id: 'local-reply-' + Date.now(), author: payload.author, role: T('participant', 'participant'), createdAt: new Date().toISOString(), body: { ro: payload.body, en: payload.body } }, false);
  }
  function init() {
    topics = readLocal(); render();
    if (canRemote()) request(API).then(function (data) { if (Array.isArray(data.topics)) { topics = data.topics.map(hydrate); remote = true; saveLocal(); render(); } }).catch(function () {});
    var search = $('#forumSearch'), sort = $('#journalSort'), newTopic = $('#forumNewTopic'), form = $('#topicForm'), topicBox = $('#forumTopics');
    if (search) search.addEventListener('input', render);
    if (sort) sort.addEventListener('change', render);
    document.querySelectorAll('[data-journal-category]').forEach(function (button) { button.addEventListener('click', function () { activeCategory = button.dataset.journalCategory || 'all'; document.querySelectorAll('[data-journal-category]').forEach(function (item) { item.classList.toggle('is-active', item === button); }); render(); }); });
    var openTopic = function () { openDialog($('#topicDialog')); var first = $('#topicForm input[name=author]'); if (first) first.focus(); };
    if (newTopic) newTopic.addEventListener('click', openTopic);
    document.querySelectorAll('[data-open-topic]').forEach(function (button) { button.addEventListener('click', openTopic); });
    if (form) form.addEventListener('submit', function (event) { event.preventDefault(); submitTopic(payloadFromForm(event.currentTarget), event.currentTarget); });
    function delegateTopic(event) {
      var reactionButtonNode = event.target.closest('[data-journal-action="react"]');
      if (reactionButtonNode) { event.stopPropagation(); react(reactionButtonNode.dataset.topicId, reactionButtonNode.dataset.reaction); return; }
      var item = event.target.closest('[data-topic-id]'); if (item) openThread(item.dataset.topicId);
    }
    if (topicBox) topicBox.addEventListener('click', delegateTopic);
    var featuredBox = $('#journalFeatured'), mostRead = $('#journalMostRead'), mostLiked = $('#journalMostLiked');
    if (featuredBox) featuredBox.addEventListener('click', delegateTopic); if (mostRead) mostRead.addEventListener('click', delegateTopic); if (mostLiked) mostLiked.addEventListener('click', delegateTopic);
    document.addEventListener('keydown', function (event) { if (event.key !== 'Enter' && event.key !== ' ') return; var item = event.target.closest('[data-topic-id]'); if (item) { event.preventDefault(); openThread(item.dataset.topicId); } });
    document.addEventListener('click', function (event) { var close = event.target.closest('[data-close-dialog]'); if (close) closeDialog($('#topicDialog')); var threadClose = event.target.closest('[data-close-thread]'); if (threadClose) closeDialog($('#threadDialog')); if (event.target.classList.contains('journal-dialog')) closeDialog(event.target); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') { closeDialog($('#topicDialog')); closeDialog($('#threadDialog')); } });
    document.addEventListener('clp:lang', function () { render(); if (selected) renderThread(findTopic(selected)); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
}());
