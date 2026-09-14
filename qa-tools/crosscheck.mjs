/* Cross-check: clasele folosite în HTML/JS există în CSS? variabilele CSS definite? */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).map(f => fs.readFileSync(path.join(ROOT, f), 'utf8'));
const js = fs.readdirSync(path.join(ROOT, 'assets/js')).map(f => fs.readFileSync(path.join(ROOT, 'assets/js', f), 'utf8'));
const css = fs.readdirSync(path.join(ROOT, 'assets/css')).map(f => fs.readFileSync(path.join(ROOT, 'assets/css', f), 'utf8'));
// includem și blocurile <style> din HTML (ex. 404.html își are stilurile inline)
const inlineCss = html.flatMap((h) => [...h.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]));
const cssAll = [...css, ...inlineCss].join('\n');
const srcAll = [...html, ...js].join('\n');

/* --- clase --- */
const used = new Map();
const addClass = (c, where) => {
  for (const name of c.split(/\s+/)) {
    if (!name || name.includes('$') || name.includes('{') || name.includes('+')) continue;
    if (!used.has(name)) used.set(name, where);
  }
};
for (const [i, f] of html.entries()) {
  for (const m of f.matchAll(/class="([^"]*)"/g)) addClass(m[1], 'html' + i);
}
// clase din șabloanele JS
for (const f of js) {
  for (const m of f.matchAll(/class=\\?["'`]([^"'`]*)["'`]/g)) addClass(m[1].replace(/\\/g, ''), 'js');
  for (const m of f.matchAll(/classList\.(?:add|toggle|remove)\(([^)]*)\)/g)) {
    for (const s of m[1].matchAll(/['"]([a-z0-9-]+)['"]/g)) addClass(s[1], 'js');
  }
}
const defined = new Set();
for (const m of cssAll.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) defined.add(m[1]);
const missing = [...used.keys()].filter(c => !defined.has(c)).sort();
console.log('CLASE folosite dar NEDEFINITE în CSS (' + missing.length + '):');
console.log(missing.join('  '));

/* --- variabile CSS --- */
const declared = new Set();
for (const m of cssAll.matchAll(/(--[a-z0-9-]+)\s*:/g)) declared.add(m[1]);
const usedVars = new Map();
for (const m of cssAll.matchAll(/var\((--[a-z0-9-]+)/g)) usedVars.set(m[1], 'css');
for (const f of [...html, ...js]) for (const m of f.matchAll(/var\((--[a-z0-9-]+)/g)) usedVars.set(m[1], 'html/js');
// variabile setate inline în JS
for (const f of js) for (const m of f.matchAll(/(--[a-z0-9-]+)\s*:/g)) declared.add(m[1]);
const undefVars = [...usedVars.keys()].filter(v => !declared.has(v)).sort();
console.log('\nVARIABILE CSS folosite dar NEDECLARATE (' + undefVars.length + '): ' + undefVars.join('  '));

const unusedVars = [...declared].filter(v => !usedVars.has(v) && !/^--(oc)$/.test(v)).sort();
console.log('\nVARIABILE declarate dar nefolosite (' + unusedVars.length + '): ' + unusedVars.join('  '));

/* --- id-uri/ancore folosite în JS dar inexistente în orice HTML --- */
const allHtml = html.join('\n');
const ids = new Set([...allHtml.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
const jsIds = new Set([...js.join('\n').matchAll(/(?:getElementById|\$)\('#?([A-Za-z0-9_-]+)'\)/g)].map(m => m[1]));
const missingIds = [...jsIds].filter(i => !ids.has(i));
console.log('\nID-uri cerute de JS dar inexistente în HTML: ' + missingIds.join('  '));

/* --- data-* attributes referenced in JS but never present in HTML --- */
const dataAttrs = [...js.join('\n').matchAll(/dataset\.([A-Za-z]+)/g)].map(m => m[1]);
console.log('\ndataset folosite în JS: ' + [...new Set(dataAttrs)].join('  '));
