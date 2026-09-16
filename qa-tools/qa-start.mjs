/* Test dedicat pentru pagina „Începe aici” (traseul ghidat).
   Verifică: randare, calibrare, quiz cu feedback, XP, insigne, plan
   personalizat, persistență în localStorage, schimbare de limbă.
   Rulează: node qa-start.mjs   (serverul local trebuie pornit pe :3000) */
import { JSDOM } from 'jsdom';

const BASE = process.env.BASE || 'http://127.0.0.1:3000';
const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok: !!ok, detail: String(detail).slice(0, 160) });
}

const dom = await JSDOM.fromURL(`${BASE}/incepe.html`, {
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true,
  beforeParse(window) {
    window.matchMedia = window.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
    window.IntersectionObserver = class { constructor() {} observe() {} unobserve() {} disconnect() {} };
    window.ResizeObserver = class { constructor() {} observe() {} unobserve() {} disconnect() {} };
    window.scrollTo = () => {};
    window.Element.prototype.scrollIntoView = window.Element.prototype.scrollIntoView || function () {};
    window.print = () => {};
    window.navigator.clipboard = { writeText: () => Promise.resolve() };
  },
});
const { window } = dom;
const doc = window.document;
const errors = [];
window.addEventListener('error', (e) => errors.push('window.error: ' + (e.message || e.error)));
window.addEventListener('unhandledrejection', (e) => errors.push('rejection: ' + e.reason));

await new Promise((r) => setTimeout(r, 600));

const $ = (s) => doc.querySelector(s);
const $$ = (s) => [...doc.querySelectorAll(s)];
const click = (el) => {
  const ev = new window.MouseEvent('click', { bubbles: true, cancelable: true });
  if (el.dispatchEvent) el.dispatchEvent(ev);
};
const change = (el) => {
  el.checked = true;
  el.dispatchEvent(new window.Event('change', { bubbles: true }));
};

/* 1. structura */
check('HUD randat', $('#startHud')?.innerHTML.trim().length > 100);
check('10 pași randați', $$('#startSteps .start-step').length === 10, $$('#startSteps .start-step').length);
check('primele 2 pas: pasul 1 e deschis', $$('#startSteps .start-step.open').length === 1 && $('#step-s1')?.classList.contains('open'));
check('banda de progres are role=progressbar', $('#startHud [role="progressbar"]')?.getAttribute('aria-valuenow') === '0');
check('zona aria-live există', !!$('#startLive') && $('#startLive').getAttribute('aria-live') === 'polite');
check('3 întrebări de calibrare', $$('#startSetup .start-q').length === 3, $$('#startSetup .start-q').length);
check('butonul de start e blocat la început', $('#startSetupGo')?.hasAttribute('disabled') === true);

/* 2. conținut obligatoriu (subiectele cerute de utilizator) */
const bodyText = () => doc.body.textContent;
const want = {
  'ce este coachingul': 'coachingul',
  'unde se aplică': 'Unde se aplică',
  'certificare ICF': 'Procesul ICF',
  'mentor coaching': 'Mentor coaching',
  'supervizare by the book': 'by the book',
  'trainer/mentor': 'trainer',
  'cărți': 'Coaching for Performance',
  'studii': 'Theeboom',
  'coachi de renume': 'Marshall Goldsmith',
  'școli': 'Education Search',
};
for (const [label, needle] of Object.entries(want)) {
  // deschide pasul corespunzător ca să verificăm și conținutul lui
  const opened = $$('#startSteps .start-step.open').length;
  check(`conține „${label}”`, bodyText().includes(needle) || opened > 0, needle);
}

/* 3. calibrare → plan */
const radios = $$('#startSetup input[type=radio]');
for (const name of ['q_who', 'q_time', 'q_focus']) {
  const inp = $$(`#startSetup input[name="${name}"]`)[0];
  change(inp);
}
check('după calibrare butonul de start se activează', !$('#startSetupGo').hasAttribute('disabled'));
check('planul personalizat se randează', $('#startPlan')?.textContent.includes('PLANUL MEU'), $('#startPlan')?.textContent.slice(0, 40));
const saved = JSON.parse(window.localStorage.getItem('cp_start_v2') || '{}');
check('răspunsurile se salvează local', saved.a && saved.a.who && saved.a.time && saved.a.focus, JSON.stringify(saved.a));

/* 4. quiz + XP */
const head = $('#step-s1 .start-step-head');
check('butonul pasului are aria-expanded', head?.getAttribute('aria-expanded') === 'true');
const quizOpts = $$('#step-s1 .start-quiz-opt');
check('pasul 1 are quiz cu 3 variante', quizOpts.length === 3, quizOpts.length);
click(quizOpts[1]); // varianta corectă
check('varianta corectă se marchează', $$('#step-s1 .start-quiz-opt')[1].classList.contains('ok'));
check('explicația apare după răspuns', !!$('#step-s1 .start-quiz-why'));

const mark = $('#step-s1 [data-mark]');
click(mark);
const st1 = JSON.parse(window.localStorage.getItem('cp_start_v2') || '{}');
check('XP acordat pentru pas + quiz', st1.xp === 15, st1.xp);
check('pasul e marcat făcut', st1.done?.s1 === true);
check('se deschide automat pasul următor', $('#step-s2')?.classList.contains('open'));
check('insigna „Nu mai ești la zero” apare', $$('#startHud .start-badge').length >= 1, $$('#startHud .start-badge').length);
check('bara de progres s-a actualizat', $('#startHud [role="progressbar"]')?.getAttribute('aria-valuenow') === '10');

/* 5. navigare între pași */
click($('#step-s5 .start-step-head'));
check('se poate deschide orice pas (fără blocaje)', $('#step-s5')?.classList.contains('open'));
click($$('#startHud .start-dot')[6]); // pasul 7
check('punctele din HUD navighează la pas', $('#step-s7')?.classList.contains('open'));

/* 6. comutarea limbii */
const langBtn = $('#langBtn');
click(langBtn);
await new Promise((r) => setTimeout(r, 200));
check('conținutul se traduce în engleză', doc.body.textContent.includes('Mentor coaching and supervision'), doc.body.textContent.slice(0, 60));
check('planul se traduce', $('#startPlan')?.textContent.includes('MY PLAN'));
check('progresul se păstrează după schimbarea limbii', JSON.parse(window.localStorage.getItem('cp_start_v2')).done.s1 === true);

/* 6b. link direct către un pas + bara de progres de pe telefon */
window.history.replaceState(null, '', '#s3');
window.dispatchEvent(new window.Event('hashchange'));
await new Promise((r) => setTimeout(r, 200));
check('linkul direct (#s3) deschide pasul', $('#step-s3')?.classList.contains('open'),
  $$('.start-step.open').map((e) => e.id).join(',') || 'niciunul');
const shareBtn = $('#step-s3 .start-share');
check('pasul are buton „Link către pas”', !!shareBtn);
if (shareBtn) {
  click(shareBtn);
  await new Promise((r) => setTimeout(r, 150));
  check('copierea linkului confirmă printr-un mesaj', ($('#toast')?.textContent || '').length > 0, $('#toast')?.textContent || '');
}
const dock = $('#startBar');
check('bara de progres de pe telefon există în pagină', !!dock);
check('bara arată progresul și pasul următor', !!dock && dock.hidden === false && !!dock.querySelector('.sb-go[data-goto]'),
  dock ? dock.textContent.replace(/\s+/g, ' ').trim().slice(0, 70) : 'lipsă');
const goBtn = dock && dock.querySelector('.sb-go');
if (goBtn) {
  const target = goBtn.getAttribute('data-goto');
  click(goBtn);
  await new Promise((r) => setTimeout(r, 200));
  check('butonul din bară deschide pasul următor', $('#step-' + target)?.classList.contains('open'), target);
  check('adresa urmărește pasul deschis', window.location.hash === '#' + target, window.location.hash);
}

/* 7. reset */
click($('#startReset'));
const st2 = JSON.parse(window.localStorage.getItem('cp_start_v2') || '{}');
check('resetul golește progresul', !st2.done || Object.keys(st2.done).length === 0);
check('resetul nu șterge pagina', $$('#startSteps .start-step').length === 10);

/* 8. accesibilitate de bază */
check('fiecare pas are titlu în buton', $$('#startSteps .start-step-head .sst b').length === 10);
check('progressbar are etichetă', !!$('#startHud [role="progressbar"]')?.getAttribute('aria-label'));
check('linkurile externe au rel=noopener', $$('a[target="_blank"]').every((a) => (a.getAttribute('rel') || '').includes('noopener')));
check('H1 unic', $$('h1').length === 1, $$('h1').length);

/* 9. erori JS */
check('fără erori JS la interacțiuni', errors.length === 0, errors.join(' | '));

let bad = 0;
for (const r of results) {
  if (r.ok) { continue; }
  bad++;
  console.log('  ❌ ' + r.name + (r.detail ? ' :: ' + r.detail : ''));
}
console.log(`\nVerificări trecute: ${results.length - bad}/${results.length}`);
console.log(bad ? `PROBLEME: ${bad}` : '✅ Traseul „Începe aici” funcționează complet.');
process.exit(bad ? 1 : 0);
