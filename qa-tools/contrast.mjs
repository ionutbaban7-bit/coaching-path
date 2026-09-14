#!/usr/bin/env node
/* Contrast audit (modul luminos): raportează regulile în care culoarea textului
   are < 4.5:1 față de fundalul pastel declarat în ACEEAȘI regulă.
   Parser simplu pe blocuri `{...}` (fără at-rules imbricate). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const LIGHT = {
  brand: '#4b57d4', ink: '#0b1220', 'ink-2': '#26324a', muted: '#5a6b86',
  surface: '#ffffff', 'surface-2': '#f6f8fc', 'surface-3': '#eef2f8',
  'brand-soft': '#eceffd', teal: '#0e9384', 'teal-soft': '#e2f5f2',
  amber: '#c2760c', 'amber-soft': '#fdf3e0', violet: '#7c4ddb', 'violet-soft': '#f3edfe',
  icf: '#e0457b', 'icf-soft': '#fce8ef', emcc: '#0e9384', 'emcc-soft': '#e2f5f2',
  anc: '#2f5bd0', 'anc-soft': '#e8eefc', 'anc-amber': '#c2760c',
  ok: '#12855c', 'ok-soft': '#e3f6ee', warn: '#b4690e', 'warn-soft': '#fdf3e0',
  danger: '#c62a3f', 'danger-soft': '#fceaed',
  'amber-ink': '#8a5207', 'teal-ink': '#0b6f65', 'ok-ink': '#0d6b4a',
  'icf-ink': '#b02a5b', 'emcc-ink': '#0b6f65', 'anc-ink': '#2847a8',
  'warn-ink': '#8a5207', 'violet-ink': '#6a3fc0'
};

function blocks(src) {
  const out = [];
  let depth = 0, start = 0, head = '';
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') {
      if (depth === 0) { head = src.slice(start, i).trim(); start = i + 1; }
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) out.push([head, src.slice(start, i)]);
      else if (depth < 0) depth = 0;
    }
  }
  return out;
}

function lum(c) {
  const v = [0, 2, 4].map((i) => parseInt(c.substr(i + 1, 2), 16) / 255)
    .map((x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}
const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };

const files = process.argv.slice(2);
if (!files.length) files.push(path.join(ROOT, 'assets/css/app.css'), path.join(ROOT, 'assets/css/pages.css'));

let found = 0;
for (const f of files) {
  for (const [sel, body] of blocks(fs.readFileSync(f, 'utf8'))) {
    const bg = body.match(/background(?:-color)?:\s*var\(--([a-z0-9-]+)\)/);
    if (!bg || !LIGHT[bg[1]]) continue;
    const cols = body.match(/(^|[;{\s])color:\s*var\(--([a-z0-9-]+)\)/g) || [];
    for (const c of cols) {
      const name = c.match(/var\(--([a-z0-9-]+)\)/)[1];
      if (!LIGHT[name]) continue;
      const r = ratio(LIGHT[name], LIGHT[bg[1]]);
      if (r < 4.5) { found++; console.log(`⚠ ${f} — ${sel.slice(0, 60)} → ${name} pe ${bg[1]} = ${r.toFixed(2)}:1`); }
    }
  }
}
console.log(found ? `\n${found} combinații sub pragul AA (4.5:1).` : '✅ Toate perechile text/fundal din aceeași regulă trec pragul AA (4.5:1).');
