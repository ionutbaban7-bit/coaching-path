#!/usr/bin/env node
/* ============================================================
   Coaching Learning Path — JOBUL „ACTUALIZARE INFORMAȚII”
   ------------------------------------------------------------
   Un singur job, rulat manual din GitHub (sau lunar, automat),
   care spune exact ce date există, ce a expirat și ce trebuie
   reverificat. Nu modifică nimic de unul singur.

   Cum se rulează local:
     node tools/update-info.mjs
     node tools/update-info.mjs --links          # verifică și linkurile
     node tools/update-info.mjs --days=30        # prag de expirare
     node tools/update-info.mjs --strict         # eșuează dacă există avertismente

   În GitHub: Actions → „Actualizare informații · Update Info” → Run workflow.
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => {
  const hit = args.find((a) => a.startsWith(f + '='));
  return hit ? hit.slice(f.length + 1) : d;
};

const MODE = val('--mode', 'report');        // report | full
const DAYS = Number(val('--days', 60));      // pragul de „expirat”
const DO_LINKS = has('--links') || MODE === 'full';
const STRICT = has('--strict');
const TODAY = new Date();

const MONTHS = { ian:0, feb:1, mar:2, apr:3, mai:4, iun:5, iul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };

/* ---------- utilitare ---------- */
const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const roDate = (d) => `${d.getDate()} ${Object.keys(MONTHS)[d.getMonth()]} ${d.getFullYear()}`;
const daysBetween = (a, b) => Math.round((b - a) / 86400000);
const out = [];
const log = (s = '') => { out.push(s); console.log(s); };

function parseRoDate(str) {
  if (!str) return null;
  const m = String(str).toLowerCase().match(/(\d{1,2})\s*([a-zăî]+)\s*(\d{4})/);
  if (!m) return null;
  const mon = MONTHS[m[2].slice(0, 3)];
  if (mon === undefined) return null;
  return new Date(Number(m[3]), mon, Number(m[1]));
}

/* ---------- 1. încarcă datele aplicației ---------- */
function loadData() {
  const code = fs.readFileSync(path.join(ROOT, 'assets/js/data.js'), 'utf8');
  const ctx = { console };
  vm.createContext(ctx);
  vm.runInContext(
    code + '\n;globalThis.__D = {UI,ORGS,NEWS,PATHS,TRANS,CREDS,SCHOOLS,JOURNEY,COSTS,GLOSS,FAQ,SOURCES};',
    ctx
  );
  return ctx.__D;
}

function loadSources() {
  const p = path.join(ROOT, 'data/sources.json');
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : { verified_on: null, sources: [] };
}

/* ---------- 2. validări ---------- */
const errors = [];
const warnings = [];

function checkParity(node, trail, stats) {
  if (Array.isArray(node)) { node.forEach((v, i) => checkParity(v, `${trail}[${i}]`, stats)); return; }
  if (node && typeof node === 'object') {
    // Perechea bilingvă e un obiect care are AMBELE chei, ro și en.
    // (Un obiect care are doar „ro” nu e pereche: de exemplu SCHOOLS[].ro
    //  e boolean pentru „livrat în română”, iar PATHS.ro e traseul României.)
    if ('ro' in node && 'en' in node) {
      stats.total++;
      const ro = node.ro, en = node.en;
      const emptyRo = ro === undefined || ro === null || ro === '' || (typeof ro === 'object' && !Object.keys(ro).length);
      const emptyEn = en === undefined || en === null || en === '' || (typeof en === 'object' && !Object.keys(en).length);
      if (emptyRo || emptyEn) {
        stats.bad++;
        if (stats.bad <= 12) errors.push(`Traducere lipsă în ${trail} (ro: ${emptyRo ? 'lipsă' : 'ok'}, en: ${emptyEn ? 'lipsă' : 'ok'})`);
      }
    }
    for (const k of Object.keys(node)) checkParity(node[k], `${trail}.${k}`, stats);
  }
}

function validate(D) {
  const checks = [];
  const add = (ok, label, detail) => { checks.push({ ok, label, detail }); if (!ok) errors.push(`${label}: ${detail}`); };

  add(D.ORGS.length === 3, 'ORGS', `3 organisme așteptate, găsite ${D.ORGS.length}`);
  add(Object.keys(D.PATHS).length === 3, 'PATHS', `3 trasee așteptate, găsite ${Object.keys(D.PATHS).length}`);
  add(D.CREDS.length > 0, 'CREDS', `${D.CREDS.length} credențiale`);
  add(D.SCHOOLS.length > 0, 'SCHOOLS', `${D.SCHOOLS.length} școli`);

  // id-uri unice
  const credIds = D.CREDS.map((c) => c.id);
  add(new Set(credIds).size === credIds.length, 'CREDS.id unic', `${credIds.length - new Set(credIds).size} duplicate`);
  const transIds = D.TRANS.map((t) => t.id);
  add(new Set(transIds).size === transIds.length, 'TRANS.id unic', `${transIds.length - new Set(transIds).size} duplicate`);

  // câmpuri obligatorii per școală
  const badSchools = D.SCHOOLS.filter((s) => !s.n || !s.url).map((s) => s.n || '(fără nume)');
  add(badSchools.length === 0, 'SCHOOLS au nume + url', badSchools.join(', ') || 'ok');

  // fiecare credentială are surse
  const noSrc = D.CREDS.filter((c) => !c.src || !c.src.length).map((c) => c.id);
  add(noSrc.length === 0, 'CREDS au surse', noSrc.join(', ') || 'ok');

  // pașii din trasee au traduceri
  for (const [k, p] of Object.entries(D.PATHS)) {
    const noT = p.steps.filter((s) => !s.t || !s.t.ro || !s.t.en).length;
    add(noT === 0, `PATHS.${k} pași traduși`, `${noT} pași netraduși`);
  }

  const stats = { total: 0, bad: 0 };
  checkParity(D, 'data.js', stats);
  add(stats.bad === 0, 'Paritate RO/EN', `${stats.total - stats.bad}/${stats.total} texte bilingve complete`);

  return { checks, bilingual: stats };
}

/* ---------- 3. conținutul generat (plan.js, map.js) ---------- */
function scanContent() {
  const res = {};
  const plan = fs.readFileSync(path.join(ROOT, 'assets/js/plan.js'), 'utf8');
  const map = fs.readFileSync(path.join(ROOT, 'assets/js/map.js'), 'utf8');
  const cred = fs.readFileSync(path.join(ROOT, 'assets/js/credibility.js'), 'utf8');

  res.qbCategories = (plan.match(/\n      id:'/g) || []).length;
  res.qbQuestions = (plan.match(/\n        \['/g) || []).length + (plan.match(/\n      \['/g) || []).length;
  res.interview = (plan.match(/\n    \['/g) || []).length;
  res.surveyItems = (plan.match(/\n        \['/g) || []).length; // re-evaluat mai jos
  res.workshops = (plan.match(/\n      n:\d+,/g) || []).length;
  res.mapStops = (map.match(/\n      id:'m\d+'/g) || []).length;
  res.topics = (cred.match(/\n    [a-z]+: \{/g) || []).length;
  const v = cred.match(/var VERIFIED = '([^']+)'/);
  res.appVerified = v ? v[1] : null;
  return res;
}

/* ---------- 4. linkuri (opțional) ---------- */
async function checkLinks(sources) {
  const rows = [];
  for (const s of sources) {
    let status = '—', note = '';
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 12000);
      let r = await fetch(s.url, { method: 'GET', redirect: 'follow', signal: ctrl.signal,
        headers: { 'user-agent': 'CoachingLearningPath-UpdateInfo/1.0 (+link check)' } });
      clearTimeout(t);
      if (r.status === 403 || r.status === 405) { // unele site-uri blochează boții la GET
        r = await fetch(s.url, { method: 'HEAD', redirect: 'follow', signal: ctrl.signal });
      }
      status = String(r.status);
      note = r.ok ? 'ok' : 'de verificat manual';
      if (!r.ok) warnings.push(`Link ${status} — ${s.id}`);
    } catch (e) {
      status = 'ERR';
      note = e.name === 'AbortError' ? 'timeout' : e.message;
      warnings.push(`Link inaccesibil — ${s.id} (${note})`);
    }
    rows.push({ id: s.id, url: s.url, status, note });
  }
  return rows;
}

/* ---------- 5. raportul ---------- */
async function main() {
  const D = loadData();
  const SRC = loadSources();
  const content = scanContent();

  const verified = SRC.verified_on || content.appVerified;
  const verifiedDate = verified ? new Date(verified + 'T00:00:00') : null;
  const age = verifiedDate ? daysBetween(verifiedDate, TODAY) : null;

  log('# Raport — Actualizare informații (Update Info)');
  log();
  log(`**Rulat:** ${iso(TODAY)} · **mod:** ${MODE} · **prag expirare:** ${DAYS} zile`);
  log(`**Ultima verificare a conținutului:** ${verified || 'necunoscută'}${age !== null ? ` (acum ${age} zile)` : ''}`);
  log();

  /* --- inventar --- */
  log('## 1. Inventarul datelor');
  log();
  log('| Set de date | Înregistrări | Unde |');
  log('|---|---:|---|');
  log(`| Organisme (ICF · EMCC · ANC) | ${D.ORGS.length} | assets/js/data.js → ORGS |`);
  log(`| Noutăți / schimbări | ${D.NEWS.length} | assets/js/data.js → NEWS |`);
  log(`| Learning paths | ${Object.keys(D.PATHS).length} (${Object.entries(D.PATHS).map(([k, p]) => k + ':' + p.steps.length).join(', ')}) | assets/js/data.js → PATHS |`);
  log(`| Treceri între certificări | ${D.TRANS.length} | assets/js/data.js → TRANS |`);
  log(`| Credențiale | ${D.CREDS.length} | assets/js/data.js → CREDS |`);
  log(`| Școli din România | ${D.SCHOOLS.length} | assets/js/data.js → SCHOOLS |`);
  log(`| Exemplu de parcurs | ${D.JOURNEY.length} | assets/js/data.js → JOURNEY |`);
  log(`| Costuri | ${D.COSTS.length} | assets/js/data.js → COSTS |`);
  log(`| Glosar | ${D.GLOSS.length} | assets/js/data.js → GLOSS |`);
  log(`| Întrebări frecvente | ${D.FAQ.length} | assets/js/data.js → FAQ |`);
  log(`| Surse oficiale | ${D.SOURCES.length} | assets/js/data.js → SOURCES |`);
  log(`| Opriri pe hartă | ${content.mapStops} | assets/js/map.js |`);
  log(`| Întrebări în bancă (1:1) | ${content.qbQuestions} în ${content.qbCategories} categorii | assets/js/plan.js |`);
  log(`| Ateliere de echipă | ${content.workshops} | assets/js/plan.js |`);
  log();

  /* --- evenimente cu dată --- */
  log('## 2. Evenimente cu dată (din NEWS)');
  log();
  log('| Eveniment | Data | Stare |');
  log('|---|---|---|');
  let upcoming = 0, overdue = 0;
  for (const n of D.NEWS) {
    const label = (n.t && (n.t.ro || n.t)) || '—';
    const raw = (n.date && (n.date.ro || n.date)) || '';
    const d = parseRoDate(raw);
    let stare = 'fără dată (de verificat manual)';
    if (d) {
      const left = daysBetween(TODAY, d);
      if (left < 0) { stare = `⚠️ **depășit de ${Math.abs(left)} zile** — actualizează`; overdue++; }
      else if (left <= 60) { stare = `⏳ în ${left} zile — pregătește actualizarea`; upcoming++; }
      else stare = `peste ${left} zile`;
    }
    log(`| ${String(label).slice(0, 62)} | ${raw} | ${stare} |`);
  }
  log();

  /* --- surse --- */
  log('## 3. Surse de verificat');
  log();
  log('| Sursă | Cadență | Ultima verificare | Vechime | Stare |');
  log('|---|---|---:|---:|---|');
  const stale = [];
  for (const s of SRC.sources) {
    const vd = new Date((s.verified_on || SRC.verified_on) + 'T00:00:00');
    const zile = daysBetween(vd, TODAY);
    const limit = s.cadence_days || DAYS;
    const bad = zile > limit;
    if (bad) stale.push(s);
    log(`| [${s.name}](${s.url}) | ${limit} zile | ${s.verified_on || SRC.verified_on} | ${zile} | ${bad ? '🔴 **de reverificat**' : '🟢 ok'} |`);
  }
  log();

  /* --- școli neverificate --- */
  const claims = D.SCHOOLS.filter((s) => s.claim);
  log('## 4. Școli cu acreditare „conform site-ului propriu”');
  log();
  if (!claims.length) log('_Niciuna — toate programele sunt confirmate în directoarele oficiale._');
  else {
    log(`${claims.length} din ${D.SCHOOLS.length} intrări se bazează pe declarația furnizorului:`);
    log();
    for (const s of claims) log(`- **${s.n}** — ${s.city || '—'} · [site](${s.url}) · de confirmat în [directorul ICF](https://apps.coachingfederation.org/eweb/DynamicPage.aspx?webcode=ESS)`);
  }
  log();

  /* --- validări --- */
  const { checks, bilingual } = validate(D);
  log('## 5. Validări');
  log();
  for (const c of checks) log(`- ${c.ok ? '✅' : '❌'} **${c.label}** — ${c.detail}`);
  log();
  log(`Total texte bilingve: **${bilingual.total}**, dintre care incomplete: **${bilingual.bad}**.`);
  log();

  /* --- linkuri --- */
  let linkRows = [];
  if (DO_LINKS) {
    log('## 6. Verificarea linkurilor');
    log();
    linkRows = await checkLinks(SRC.sources);
    log('| Sursă | Status | Notă |');
    log('|---|---|---|');
    for (const r of linkRows) log(`| ${r.id} | ${r.status} | ${r.note} |`);
    log();
  }

  /* --- pașii de actualizare --- */
  log('## ' + (DO_LINKS ? '7' : '6') + '. Cum actualizezi');
  log();
  log('1. Deschizi sursa marcată 🔴 mai sus și verifici informația în aplicație.');
  log('2. Corectezi datele în `assets/js/data.js` (sau fișierul indicat în coloana „Unde”).');
  log('3. Pui data de azi în `data/sources.json` → `verified_on` și, opțional, pe sursa respectivă.');
  log('4. Adaugi o linie în `CHANGELOG.md`.');
  log('5. Rulezi din nou jobul: Actions → „Actualizare informații · Update Info” → Run workflow.');
  log();

  /* --- verdict --- */
  const verdict = [];
  if (age !== null && age > DAYS) verdict.push(`conținutul are ${age} zile (prag ${DAYS})`);
  if (overdue) verdict.push(`${overdue} eveniment(e) depășite`);
  if (stale.length) verdict.push(`${stale.length} sursă(i) expirată(e)`);
  if (errors.length) verdict.push(`${errors.length} eroare(i) de validare`);

  log('## Verdict');
  log();
  if (!verdict.length) log('🟢 **Totul e în termen.** Nicio acțiune necesară acum.');
  else log('🟠 **De actualizat:** ' + verdict.join(' · ') + '.');
  log();

  /* --- scrie fișierele --- */
  const dir = path.join(ROOT, 'reports');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'update-info-report.md'), out.join('\n'));
  fs.writeFileSync(path.join(dir, 'summary.json'), JSON.stringify({
    run_at: new Date().toISOString(),
    mode: MODE,
    verified_on: verified,
    age_days: age,
    threshold_days: DAYS,
    counts: {
      orgs: D.ORGS.length, news: D.NEWS.length,
      paths: Object.keys(D.PATHS).length,
      steps: Object.values(D.PATHS).reduce((a, p) => a + p.steps.length, 0),
      transitions: D.TRANS.length, credentials: D.CREDS.length,
      schools: D.SCHOOLS.length, journey: D.JOURNEY.length,
      costs: D.COSTS.length, glossary: D.GLOSS.length, faq: D.FAQ.length,
      sources: D.SOURCES.length, map_stops: content.mapStops,
      questions: content.qbQuestions, workshops: content.workshops,
      bilingual: bilingual.total, bilingual_incomplete: bilingual.bad
    },
    upcoming, overdue,
    stale_sources: stale.map((s) => s.id),
    claims: claims.map((s) => s.n),
    errors, warnings,
    links: linkRows,
    needs_update: verdict.length > 0
  }, null, 2));

  if (errors.length) {
    console.error('\n❌ Erori de validare:\n' + errors.map((e) => '  - ' + e).join('\n'));
    process.exit(1);
  }
  if (STRICT && warnings.length) {
    console.error('\n⚠️  Avertismente (mod strict):\n' + warnings.map((w) => '  - ' + w).join('\n'));
    process.exit(1);
  }
  process.exit(0);
}

main().catch((e) => { console.error('Eroare la rularea jobului:', e); process.exit(1); });
