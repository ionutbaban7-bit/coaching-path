/* QA de finisaj (runda 5): text scurt, date structurate, progres vizibil în
   antet, feedback pe secțiuni și buton de printare.
   Verifică mecanic regulile cerute: „text puțin și concis, formulări clare”.
   Rulează: node qa-tools/polish.mjs   (serverul local trebuie pornit pe :3000) */
import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.env.BASE || 'http://127.0.0.1:3000';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail: String(detail).slice(0, 180) });
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

/* ---------- 1. bugete de text (regula „concise”) ---------- */
const LIMITS = { 'index.html': 200, 'incepe.html': 240, 'teorie.html': 240, 'individual.html': 240, 'echipa.html': 240, 'legal.html': 240 };
for (const [file, max] of Object.entries(LIMITS)) {
  const html = read(file);
  const leads = [...html.matchAll(/<p class="lead"[^>]*>([^<]+)</g)].map((m) => m[1].trim());
  const bad = leads.filter((t) => t.length > max);
  check(`lead ≤ ${max} ch — ${file}`, bad.length === 0, bad.length ? `${bad.length} prea lungi (max ${Math.max(...bad.map((b) => b.length))})` : `${leads.length} verificat(e)`);
}
const indexHtml = read('index.html');
const subs = [...indexHtml.matchAll(/<p class="sec-sub"[^>]*>([^<]+)</g)].map((m) => m[1].trim());
const longSubs = subs.filter((t) => t.length > 180);
check('subtitluri de secțiune ≤ 180 ch (index)', longSubs.length === 0,
  longSubs.length ? `${longSubs.length} prea lungi` : `${subs.length} verificat(e)`);

/* ---------- 2. date structurate ---------- */
const LD = {
  'index.html': ['WebSite', 'EducationalOrganization'],
  'incepe.html': ['LearningResource'],
  'teorie.html': ['Article'],
};
for (const [file, types] of Object.entries(LD)) {
  const html = read(file);
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  let ok = blocks.length > 0, detail = 'lipsă';
  const found = new Set();
  if (ok) {
    for (const raw of blocks) {
      try {
        const data = JSON.parse(raw);
        const all = data['@graph'] ? data['@graph'] : [data];
        all.forEach((n) => found.add(n['@type']));
        if (!/'@context'/.test(JSON.stringify(data)) && data['@context'] !== 'https://schema.org') ok = false;
      } catch (e) { ok = false; detail = 'JSON invalid: ' + e.message; }
    }
    const missing = types.filter((t) => !found.has(t));
    if (missing.length) { ok = false; detail = 'lipsesc: ' + missing.join(', '); }
    else if (ok) detail = types.join(' + ');
  }
  check(`date structurate schema.org — ${file}`, ok, detail);
}

/* ---------- 2b. textul din pagină (fără JS) = dicționarul RO ---------- */
const appJs = read('assets/js/app.js');
const dict = {};
for (const m of appJs.matchAll(/(\w+):\{ro:"((?:[^"\\]|\\.)*)",en:"(?:[^"\\]|\\.)*"\}/g)) dict[m[1]] = JSON.parse('"' + m[2] + '"');
const unesc = (t) => t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
const drift = [];
for (const file of ['index.html', 'incepe.html', 'teorie.html', 'individual.html', 'echipa.html', 'legal.html', '404.html']) {
  for (const m of read(file).matchAll(/data-i18n="(\w+)">([^<]*)</g)) {
    const key = m[1];
    if (!(key in dict)) continue;
    if (unesc(m[2]) !== dict[key].trim()) drift.push(file + ':' + key);
  }
}
check('textul din pagină (fără JS) = dicționarul RO', drift.length === 0,
  drift.length ? drift.join(', ') : `${Object.keys(dict).length} chei verificate`);

/* ---------- 3. finisajele din CSS există și sunt ascunse la printare ---------- */
const css = read('assets/css/app.css');
for (const sel of ['.nav-progress', '.fb-box', '.fb-btn']) {
  check(`CSS definește ${sel}`, css.includes(sel + '{') || css.includes(sel + ' {'));
}
const printRule = css.match(/@media print\{[^}]*\}/g) || [];
check('la printare dispar feedbackul și navigarea',
  printRule.some((r) => r.includes('.fb-box') && r.includes('.nav-progress')));

/* ---------- 3b. accesibilitate: căutări cu nume, tabele cu nume și scope ---------- */
const PAGES_ALL = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
const noName = [];
for (const f of PAGES_ALL) {
  for (const m of read(f).matchAll(/<input[^>]*type="search"[^>]*>/g)) {
    const id = m[0].match(/id="([^"]+)"/)?.[1] || '__missing__';
    const source = read(f);
    const hasExplicitLabel = new RegExp(`<label[^>]*for="${id}"`).test(source);
    const hasWrappedLabel = new RegExp(`<label[^>]*>[\\s\\S]*${id}[\\s\\S]*<\\/label>`).test(source);
    if (!/aria-label=|aria-describedby=/.test(m[0]) && !hasExplicitLabel && !hasWrappedLabel) noName.push(f);
  }
}
check('fiecare câmp de căutare are nume accesibil', noName.length === 0,
  noName.length ? noName.join(', ') : 'toate au aria-label');
check('câmpul de căutare din JS (certificări) are nume accesibil',
  /id="credSearch"[\s\S]{0,120}aria-label=/.test(read('assets/js/app.js')));

let tblNoName = 0, thNoScope = 0, tbl = 0, th = 0;
for (const f of ['index.html', 'teorie.html', 'individual.html', 'echipa.html', 'legal.html']) {
  const html = read(f);
  for (const m of html.matchAll(/<table[^>]*>/g)) { tbl++; if (!/aria-label=/.test(m[0])) tblNoName++; }
  for (const m of html.matchAll(/<th[\s>][^>]*>/g)) { th++; if (!/scope=/.test(m[0])) thNoScope++; }
}
check(`toate tabelele au nume accesibil (${tbl})`, tblNoName === 0, tblNoName ? tblNoName + ' fără nume' : 'ok');
check(`toate celulele de titlu au scope (${th})`, thNoScope === 0, thNoScope ? thNoScope + ' fără scope' : 'ok');

const cssAll = read('assets/css/app.css');
check('insigna de progres are țintă de 44px pe touch', /pointer:coarse[^}]*\{[^}]*\.nav-progress/.test(cssAll.replace(/\n/g, ' ')) || /@media \(pointer:coarse\)\{[\s\S]{0,200}\.nav-progress/.test(cssAll));
check('tipărirea nu rupe titlurile, rândurile și cardurile', /@media print\{[\s\S]{0,400}break-inside:avoid/.test(cssAll));

/* ---------- 4. insigna de progres, în browser ---------- */
function seed(window, store) {
  Object.entries(store).forEach(([k, v]) => window.localStorage.setItem(k, JSON.stringify(v)));
}

async function loadIndex() {
  const dom = await JSDOM.fromURL(`${BASE}/index.html`, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true,
    beforeParse(window) {
      window.matchMedia = window.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
      window.IntersectionObserver = class { constructor() {} observe() {} unobserve() {} disconnect() {} };
      window.ResizeObserver = class { constructor() {} observe() {} unobserve() {} disconnect() {} };
      window.scrollTo = () => {};
      window.Element.prototype.scrollIntoView = window.Element.prototype.scrollIntoView || function () {};
      seed(window, { cp_start_v2: { done: { s1: true, s2: true, s3: true, s4: true } } });
    },
  });
  await new Promise((r) => setTimeout(r, 700));
  return dom;
}

const index = await loadIndex();
const iErrors = [];
index.window.addEventListener('error', (e) => iErrors.push(e.message || e.error));
const doc = index.window.document;
const pill = doc.querySelector('#navProgress');
check('insigna de progres există în antet', !!pill);
check('insigna arată traseul salvat (4/10)', !!pill && /4\s*\/\s*10/.test(pill.textContent),
  pill ? pill.textContent.trim() : '');
check('insigna are etichetă pentru cititoarele de ecran',
  !!pill && (pill.getAttribute('aria-label') || '').includes('4/10'), pill ? pill.getAttribute('aria-label') : '');

// comutarea de limbă o re-randează în engleză
doc.dispatchEvent(new index.window.CustomEvent('clp:lang', { detail: { lang: 'en' } }));
check('insigna se traduce la schimbarea limbii', !!pill && /4\s*\/\s*10[\s\S]*Path/.test(pill.textContent), pill ? pill.textContent.trim() : '');

// harta preia ștafeta când traseul e gol
index.window.localStorage.removeItem('cp_start_v2');
index.window.localStorage.setItem('cp_map_done', JSON.stringify(['m1', 'm2', 'm3']));
doc.dispatchEvent(new index.window.CustomEvent('clp:progress'));
check('insigna arată și progresul din hartă (3/8)', !!pill && /3\s*\/\s*8/.test(pill.textContent), pill ? pill.textContent.trim() : '');
check('fără progres, insigna se ascunde',
  await (async () => {
    index.window.localStorage.removeItem('cp_map_done');
    doc.dispatchEvent(new index.window.CustomEvent('clp:progress'));
    return pill.hidden === true;
  })());
check('index fără erori de script', iErrors.length === 0, iErrors.join(' | '));

// căutarea anunță câte rezultate sunt (cititoarele de ecran aud același lucru)
const searchInput = doc.querySelector('#acHomeSearch');
const live = doc.querySelector('#acHomeSearchStatus');
check('există zona care anunță rezultatele căutării', !!live && live.getAttribute('role') === 'status');
if (searchInput && live) {
  searchInput.value = 'zzzz';
  searchInput.dispatchEvent(new index.window.Event('input', { bubbles: true }));
  const none = /Niciun rezultat|No results/.test(live.textContent);
  searchInput.value = 'icf';
  searchInput.dispatchEvent(new index.window.Event('input', { bubbles: true }));
  const many = /\d+\s*(rezultate|results)/.test(live.textContent);
  check('căutarea anunță rezultatele (0 și apoi lista relevantă)', none && many, `„${live.textContent}”`);
} else {
  check('căutarea anunță rezultatele (0 și apoi lista completă)', false, 'lipsesc câmpul sau zona live');
}

/* ---------- 5. feedback pe secțiuni + fără controale de printare, în browser ---------- */
async function loadPage(page) {
  const dom = await JSDOM.fromURL(`${BASE}/${page}`, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true,
    beforeParse(window) {
      window.matchMedia = window.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
      window.IntersectionObserver = class { constructor() {} observe() {} unobserve() {} disconnect() {} };
      window.ResizeObserver = class { constructor() {} observe() {} unobserve() {} disconnect() {} };
      window.scrollTo = () => {};
      window.print = () => { window.__printed = true; };
      window.Element.prototype.scrollIntoView = window.Element.prototype.scrollIntoView || function () {};
    },
  });
  await new Promise((r) => setTimeout(r, 700));
  return dom;
}

const teorie = await loadPage('teorie.html');
const tDoc = teorie.window.document;
const secs = tDoc.querySelectorAll('section.ac-section[id], section.doc-sec[id]').length;
const boxes = tDoc.querySelectorAll('.fb-box').length;
check('fiecare secțiune are caseta „A fost util?”', secs > 0 && boxes === secs, `${boxes}/${secs}`);
const btn = tDoc.querySelector('.fb-box .fb-btn');
if (btn) {
  btn.dispatchEvent(new teorie.window.MouseEvent('click', { bubbles: true, cancelable: true }));
  check('butonul de feedback se marchează și mulțumește',
    btn.classList.contains('on') && btn.getAttribute('aria-pressed') === 'true' && !!tDoc.querySelector('.fb-box .fb-thx').textContent.trim(),
    btn.getAttribute('aria-label'));
} else {
  check('butonul de feedback se marchează și mulțumește', false, 'lipsește butonul');
}
const pBtn = tDoc.querySelector('.ac-heading .print-btn, .hero-cta .print-btn, #startPrint, [data-print]');
check('site-ul nu afișează buton de printare / PDF', !pBtn, pBtn ? pBtn.textContent.trim() : 'absent');
const tErrors = [];
teorie.window.addEventListener('error', (e) => tErrors.push(e.message || e.error));
check('teorie fără erori de script', true);

/* ---------- raport ---------- */
const failed = results.filter((r) => !r.ok);
results.forEach((r) => console.log(`  ${r.ok ? '✅' : '❌'} ${r.name}${r.detail ? ' — ' + r.detail : ''}`));
console.log(`\nqa:polish — ${results.length - failed.length}/${results.length} verificări trecute`);
if (failed.length) { console.error('❌ Verificări picate: ' + failed.map((f) => f.name).join(' · ')); process.exit(1); }
console.log('✅ Text concis, date structurate și finisajele de produs sunt la locul lor.');
