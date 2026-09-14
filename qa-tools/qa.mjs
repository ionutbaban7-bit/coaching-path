/* QA harness: încarcă fiecare pagină în jsdom, prinde erorile și verifică randarea. */
import { JSDOM, VirtualConsole } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.env.BASE || 'http://127.0.0.1:3000';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = ['index.html', 'incepe.html', 'teorie.html', 'individual.html', 'echipa.html', 'legal.html', '404.html'];

const POLYFILL = `
  window.matchMedia = window.matchMedia || function(q){
    return { matches:false, media:q, onchange:null, addListener(){}, removeListener(){},
             addEventListener(){}, removeEventListener(){}, dispatchEvent(){ return false; } };
  };
  window.IntersectionObserver = class {
    constructor(cb){ this.cb = cb; }
    observe(el){ this.cb([{ isIntersecting:true, target:el, intersectionRatio:1 }], this); }
    unobserve(){} disconnect(){} takeRecords(){ return []; }
  };
  window.ResizeObserver = class { observe(){} unobserve(){} disconnect(){} };
  window.scrollTo = window.scrollTo || function(){};
  window.Element.prototype.scrollIntoView = window.Element.prototype.scrollIntoView || function(){};
`;

function collect(dom, vm) {
  vm.on('jsdomError', (e) => {
    if (!/Could not load|Not implemented/.test(e.message)) errors.push('jsdomError: ' + e.message);
  });
  dom.window.addEventListener('error', (e) => {
    if (e.error) errors.push('window.error: ' + (e.error.stack || e.error.message));
    else errors.push('window.error: ' + (e.message || 'unknown') + ' @ ' + (e.filename || '') + ':' + e.lineno);
  });
  const origOnError = dom.window.onerror;
  dom.window.onerror = origOnError;
  dom.window.addEventListener('unhandledrejection', (e) =>
    errors.push('unhandledrejection: ' + e.reason));
}

async function load(page) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => {
    if (/Could not load|Not implemented|css parsing/i.test(e.message) && /Not implemented/.test(e.message)) return;
    errors.push('jsdomError: ' + e.message);
  });
  vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));
  vc.on('warn', (...a) => warnings.push('console.warn: ' + a.join(' ')));
  vc.on('log', () => {});

  const warnings = [];
  const dom = await JSDOM.fromURL(`${BASE}/${page}`, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(window) {
      window.eval(POLYFILL);
      window.addEventListener('error', (e) => {
        errors.push('window.error: ' + (e.error && e.error.stack ? e.error.stack : e.message || 'unknown'));
        e.preventDefault();
      });
      window.addEventListener('unhandledrejection', (e) => errors.push('unhandledrejection: ' + e.reason));
    },
  });
  await new Promise((r) => {
    if (dom.window.document.readyState === 'complete') r();
    else dom.window.addEventListener('load', r);
    setTimeout(r, 4000);
  });
  await new Promise((r) => setTimeout(r, 350));
  return { dom, errors, warnings };
}

const report = {};
for (const page of PAGES) {
  const entry = { errors: [], warnings: [], checks: [] };
  try {
    const { dom, errors, warnings } = await load(page);
    entry.errors = errors;
    entry.warnings = warnings;
    const { document: doc, window: win } = dom.window;

    const check = (name, ok, detail) => entry.checks.push({ name, ok: !!ok, detail: detail || '' });

    // 1. containere care trebuie populate
    const containers = ['orgCards','newsGrid','pathTabs','stepper','transGrid','credFilters','credGrid',
      'schoolFilters','schoolRows','schoolHead','schoolsNote','journeyRows','costTable','costNote',
      'faqList','glossList','srcGrid','discText','navlinks','roadmap','mapLegend','rmPanel','qbCats','qbGrid',
      'diagInterview','diagSurvey','diagObserve','workshopList'];
    for (const id of containers) {
      const el = doc.getElementById(id);
      if (!el) continue;
      if (id === 'rmPanel') continue;   // se umple la click pe o oprire — verificat mai jos
      check(`container #${id} populat`, el.innerHTML.trim().length > 0,
        el.innerHTML.trim() ? `len=${el.innerHTML.length}` : 'GOOOL / nepopulat');
    }

    // 2. paritatea RO/EN pe atributele statice
    const roOnly = [], enOnly = [], emptyAttr = [];
    for (const el of doc.querySelectorAll('*')) {
      const ro = el.getAttribute('data-i18n-ro'), en = el.getAttribute('data-i18n-en');
      const ro2 = el.getAttribute('data-i18n'), ro3 = el.getAttribute('data-i18n-t-ro'), en3 = el.getAttribute('data-i18n-t-en');
      if (ro !== null && en === null) roOnly.push(el.outerHTML.slice(0, 70));
      if (en !== null && ro === null) enOnly.push(el.outerHTML.slice(0, 70));
      if (ro === '') emptyAttr.push('data-i18n-ro=""');
    }
    check('atribute RO fără EN', roOnly.length === 0, roOnly.slice(0, 6).join(' | '));
    check('atribute EN fără RO', enOnly.length === 0, enOnly.slice(0, 6).join(' | '));

    // 2b. data-i18n chei care nu există în I18N (I18N e const global, nu proprietate pe window)
    let ui = {};
    try { ui = win.eval('typeof I18N !== "undefined" ? I18N : {}') || {}; } catch (e) { ui = {}; }
    const missingI18n = [];
    if (Object.keys(ui).length) {
      for (const el of doc.querySelectorAll('[data-i18n]')) {
        const k = el.getAttribute('data-i18n');
        if (!ui[k]) missingI18n.push(k);
      }
    }
    check('chei data-i18n existente', missingI18n.length === 0, [...new Set(missingI18n)].join(', '));

    // 3. imagini încărcate
    const imgs = [...doc.querySelectorAll('img')];
    check('img fără alt', imgs.every(i => i.hasAttribute('alt')), imgs.filter(i => !i.hasAttribute('alt')).map(i => i.src).join(', '));

    // 4. ancore interne către id-uri inexistente
    const badAnchors = [];
    for (const a of doc.querySelectorAll('a[href^="#"]')) {
      const id = a.getAttribute('href').slice(1);
      if (id && !doc.getElementById(id)) badAnchors.push(a.getAttribute('href'));
    }
    check('ancore interne valide', badAnchors.length === 0, [...new Set(badAnchors)].join(', '));

    // 5. linkuri externe fără rel=noopener
    const noRel = [...doc.querySelectorAll('a[target="_blank"]')].filter(a => !/noopener/.test(a.getAttribute('rel') || ''));
    check('target=_blank cu rel=noopener', noRel.length === 0, noRel.slice(0,5).map(a=>a.href).join(', '));

    // 6. interacțiuni
    const clickAndReport = (label, el) => {
      const before = entry.errors.length;
      try { el.dispatchEvent(new win.MouseEvent('click', { bubbles: true, cancelable: true })); }
      catch (err) { entry.errors.push('click ' + label + ': ' + err.message); return; }
      if (entry.errors.length > before) entry.checks.push({ name: `click ${label} fără erori`, ok: false, detail: entry.errors.at(-1) });
    };
    const langBtn = doc.getElementById('langBtn');
    if (langBtn) { clickAndReport('langBtn', langBtn); }
    const themeBtn = doc.getElementById('themeBtn');
    if (themeBtn) { clickAndReport('themeBtn', themeBtn); }
    // taburi
    for (const b of doc.querySelectorAll('#pathTabs .tab')) clickAndReport('path tab ' + b.dataset.tab, b);
    // filtre credențiale
    for (const b of doc.querySelectorAll('#credFilters [data-cf]')) clickAndReport('cred filter ' + b.dataset.cf, b);
    // filtre școli
    for (const b of doc.querySelectorAll('#schoolFilters [data-sf]')) clickAndReport('school filter ' + b.dataset.sf, b);
    // quick start
    for (const b of doc.querySelectorAll('.qstart-item')) clickAndReport('qstart ' + b.dataset.go, b);
    // faq
    for (const q of doc.querySelectorAll('#faqList .faq-q')) clickAndReport('faq', q);
    // carduri credențiale + modal
    for (const c of doc.querySelectorAll('#credGrid .cred-card')) { clickAndReport('cred card', c); }
    for (const c of doc.querySelectorAll('#transGrid .trans-card')) clickAndReport('trans card', c);
    // noduri hartă
    for (const n of doc.querySelectorAll('#roadmap .rm-node')) clickAndReport('rm node ' + n.dataset.id, n);
    // căutări (doar cele care există pe pagina respectivă)
    for (const id of ['credSearch','schoolSearch','glossSearch','qbSearch']) {
      const inp = doc.getElementById(id);
      if (!inp) continue;
      const before = entry.errors.length;
      inp.value = 'coa';
      inp.dispatchEvent(new win.Event('input', { bubbles: true }));
      if (entry.errors.length > before) entry.checks.push({ name: `search #${id} fără erori`, ok: false, detail: entry.errors.at(-1) });
    }

    // 7. după interacțiuni: nav are linkuri, iar pagina nu are HTML injectat greșit
    // modal: rol de dialog respectat (aria-hidden comutat + focus mutat în dialog)
    const modalBg = doc.getElementById('modalBg');
    if (modalBg && modalBg.classList.contains('open')) {
      check('modal: aria-hidden=false când e deschis', modalBg.getAttribute('aria-hidden') === 'false', modalBg.getAttribute('aria-hidden'));
      check('modal: focus mutat în dialog', doc.activeElement && doc.activeElement.id === 'mClose', doc.activeElement ? doc.activeElement.id || doc.activeElement.tagName : 'nimic');
    }
    const mClose = doc.getElementById('mClose');
    if (mClose) { clickAndReport('închide modalul', mClose); check('modal: aria-hidden=true după închidere', modalBg.getAttribute('aria-hidden') === 'true', modalBg.getAttribute('aria-hidden')); }

    // cuprinsul paginilor de conținut marchează secțiunea curentă
    if (doc.querySelector('.toc a')) {
      check('cuprins: link activ marcat', !!doc.querySelector('.toc a.active'), doc.querySelectorAll('.toc a.active').length + ' active');
    }

    // pașii deschiși rezistă la schimbarea limbii
    const stepHead = doc.querySelector('#stepper .step-head');
    if (stepHead && langBtn) {
      clickAndReport('deschide un pas din stepper', stepHead);   // trece prin handlerul real
      clickAndReport('langBtn (a doua oară)', langBtn);
      const stillOpen = doc.querySelector('#stepper .step.open');
      check('stepper: pasul deschis rămâne deschis după re-randare', !!stillOpen, stillOpen ? 'da' : 's-a închis');
    }

    // panoul hărții se umple după ce apeși o oprire
    const rmPanel = doc.getElementById('rmPanel');
    if (rmPanel) check('panoul hărții se deschide la click', rmPanel.innerHTML.trim().length > 0 && rmPanel.classList.contains('open'), rmPanel.innerHTML.slice(0, 60));

    const nav = doc.getElementById('navlinks');
    if (nav) check('nav are linkuri', nav.querySelectorAll('a').length > 0, nav.textContent.slice(0, 80));
    check('fără "undefined" în DOM randat', !/undefined/.test(doc.body.textContent), (doc.body.textContent.match(/.{40}undefined.{40}/) || [''])[0]);
    check('fără "NaN" în DOM', !/\bNaN\b/.test(doc.body.textContent), (doc.body.textContent.match(/.{40}NaN.{40}/) || [''])[0]);
    check('fără template literal rămas', !/\$\{/.test(doc.body.textContent), (doc.body.textContent.match(/.{40}\$\{. {0,3}/) || [''])[0]);

    entry.title = doc.title;
    entry.h1Count = doc.querySelectorAll('h1').length;
    entry.bodyTextLen = doc.body.textContent.replace(/\s+/g, ' ').trim().length;
    dom.window.close();
  } catch (e) {
    entry.errors.push('FATAL: ' + e.stack);
  }
  report[page] = entry;
}

let fails = 0;
for (const [page, e] of Object.entries(report)) {
  console.log('\n========== ' + page + ' ==========');
  console.log(`titlu: ${e.title} | h1: ${e.h1Count} | text: ${e.bodyTextLen} caractere`);
  if (e.errors.length) {
    fails += e.errors.length;
    console.log('  ❌ ERORI:');
    for (const err of [...new Set(e.errors)]) console.log('     - ' + err.split('\n').slice(0, 4).join('\n       '));
  }
  if (e.warnings?.length) {
    console.log('  ⚠️  avertismente:');
    for (const w of [...new Set(e.warnings)].slice(0, 8)) console.log('     - ' + w.slice(0, 160));
  }
  const bad = (e.checks || []).filter(c => !c.ok);
  if (bad.length) {
    fails += bad.length;
    console.log('  ⚠️  verificări picate:');
    for (const c of bad) console.log('     - ' + c.name + (c.detail ? ' :: ' + c.detail.slice(0, 150) : ''));
  } else {
    console.log('  ✅ toate verificările au trecut (' + (e.checks?.length || 0) + ')');
  }
}
console.log('\nTOTAL probleme: ' + fails);
