#!/usr/bin/env node
/* ============================================================
   Verificare rapidă a site-ului — fără dependențe.
   Rulează local:  npm run check
   Rulează în CI:  .github/workflows/pages.yml (înainte de publicare)

   Ce verifică:
     1. sintaxa fiecărui fișier JS (parse, fără execuție)
     2. JSON-urile sunt valide
     3. fiecare fișier local referit în HTML/CSS există pe disc
     4. atributele bilingve data-i18n-ro / -en sunt în perechi
     5. acoladele din CSS sunt echilibrate
     6. versiunea din package.json = versiunea din ?v= din HTML
     7. nu există cereri externe rămase (fonturi, scripturi)
   ============================================================ */
'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const notes = [];

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const read = (p) => fs.readFileSync(p, 'utf8');

/* 1 + 2 ---------------------------------------------------- */
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const files = walk(ROOT);

const jsFiles = files.filter((f) => f.endsWith('.js') || f.endsWith('.mjs'));
for (const f of jsFiles) {
  try {
    execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' });   // merge și pentru ESM
  } catch (e) {
    const msg = (e.stderr || Buffer.from('')).toString().split('\n').slice(0, 3).join(' ').trim();
    problems.push(`sintaxă JS în ${rel(f)}: ${msg || e.message}`);
  }
}
notes.push(`${jsFiles.length} fișiere JS verificate sintactic`);

const jsonFiles = files.filter((f) => f.endsWith('.json') || f.endsWith('.webmanifest'));
for (const f of jsonFiles) {
  try { JSON.parse(read(f)); } catch (e) { problems.push(`JSON invalid: ${rel(f)} — ${e.message}`); }
}
notes.push(`${jsonFiles.length} fișiere JSON verificate`);

/* 3 --------------------------------------------------------- */
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const localRefs = new Set();
for (const f of htmlFiles) {
  const html = read(f);
  for (const m of html.matchAll(/(?:href|src)="(?!https?:|mailto:|#|\/\/)([^"?#]+)(?:\?[^"]*)?"/g)) {
    localRefs.add(path.normalize(path.join(path.dirname(f), m[1])));
  }
  const htmlTag = html.match(/<html[^>]*>/);
  if (!htmlTag || !/\slang="/.test(htmlTag[0])) problems.push(`${rel(f)}: elementul <html> nu are atributul lang`);
  if (htmlTag && !/data-title-en=/.test(htmlTag[0])) problems.push(`${rel(f)}: lipsește titlul în engleză (data-title-en)`);
}
for (const f of files.filter((x) => x.endsWith('.css'))) {
  const css = read(f);
  for (const m of css.matchAll(/url\(\s*["']?(?!data:|https?:)([^"')]+)["']?\s*\)/g)) {
    localRefs.add(path.normalize(path.join(path.dirname(f), m[1])));
  }
}
const missing = [...localRefs].filter((p) => !fs.existsSync(p));
for (const m of missing) problems.push(`fișier lipsă, dar referit în pagini: ${rel(m)}`);
notes.push(`${localRefs.size} referințe locale verificate (${missing.length} lipsă)`);

/* 4 --------------------------------------------------------- */
for (const f of htmlFiles) {
  const html = read(f);
  let ro = 0, en = 0, broken = 0;
  for (const m of html.matchAll(/data-i18n-(ro|en)=/g)) m[1] === 'ro' ? ro++ : en++;
  for (const line of html.split('\n')) {
    const re = /data-i18n-(?:ro|en|t-ro|t-en|ph-ro|ph-en|aria-ro|aria-en)="/g;
    let m;
    while ((m = re.exec(line))) {
      const s = m.index + m[0].length;
      const e = line.indexOf('"', s);
      if (e < 0) continue;
      const next = line[e + 1] || '';
      if (!/[ >\/\n]/.test(next) && next !== '') broken++;
    }
  }
  if (ro !== en) problems.push(`${rel(f)}: atribute RO (${ro}) ≠ EN (${en}) — traducere incompletă`);
  if (broken) problems.push(`${rel(f)}: ${broken} atribute cu ghilimele neescapate în interior`);
}
notes.push('paritate RO/EN și atribute verificate');

/* 5 --------------------------------------------------------- */
for (const f of files.filter((x) => x.endsWith('.css'))) {
  const css = read(f).replace(/\/\*[\s\S]*?\*\//g, '');
  const open = (css.match(/{/g) || []).length;
  const close = (css.match(/}/g) || []).length;
  if (open !== close) problems.push(`${rel(f)}: acolade dezechilibrate (${open} / ${close})`);
}

/* 6 --------------------------------------------------------- */
const pkg = JSON.parse(read(path.join(ROOT, 'package.json')));
const versions = new Set();
for (const f of htmlFiles) {
  for (const m of read(f).matchAll(/\?v=([\d.]+)/g)) versions.add(m[1]);
}
if (versions.size > 1) problems.push(`versiuni diferite în ?v= : ${[...versions].join(', ')}`);
if (versions.size === 1 && ![...versions][0].startsWith(pkg.version)) {
  problems.push(`?v=${[...versions][0]} nu se potrivește cu package.json (${pkg.version})`);
}

/* 7 --------------------------------------------------------- */
for (const f of htmlFiles) {
  const html = read(f);
  const ext = [...html.matchAll(/(?:href|src)="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
  const cdn = ext.filter((u) => /fonts\.googleapis|fonts\.gstatic|cdn\.|unpkg|jsdelivr/.test(u));
  if (cdn.length) problems.push(`${rel(f)}: cerere către CDN extern (${cdn[0]}) — ar trebui găzduit local`);
}

/* raport ---------------------------------------------------- */
console.log('Verificare site — coachinghub.ro\n');
for (const n of notes) console.log('  · ' + n);
console.log('');
if (problems.length) {
  console.log(`✗ ${problems.length} problemă(e):`);
  for (const p of problems) console.log('   - ' + p);
  process.exit(1);
}
console.log('✓ Totul e în regulă.');
