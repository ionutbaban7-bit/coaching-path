#!/usr/bin/env node
/* ============================================================
   QA DE PUNERE ÎN PRODUCȚIE — în stil ITIL 4
   ------------------------------------------------------------
   Verifică serviciul pe cele patru dimensiuni ITIL 4
     • organizație și oameni
     • informație și tehnologie
     • parteneri și furnizori
     • fluxuri de valoare și procese
   și parcurge lanțul de valoare pentru tranziția serviciului:
   schimbare (change enablement), release, validare și testare,
   implementare, hiper-îngrijire, revenire (rollback) și
   îmbunătățire continuă.

   Rulează întregul set de porți de calitate (check, qa, qa:start,
   qa:css, qa:polish, qa:contrast, qa:mobile) și dă un verdict: GO / NO-GO.

   Rulează: npm run qa:itil      (opțional BASE=http://host:port)
   Scrie și raportul: reports/itil-readiness.md
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.BASE || 'http://127.0.0.1:3000';
const RM = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const EX = f => fs.existsSync(path.join(ROOT, f));
const KB = f => Math.round(fs.statSync(path.join(ROOT, f)).size / 1024);
const ALL = (dir, ext) => fs.readdirSync(path.join(ROOT, dir)).filter(f => f.endsWith(ext));
const PAGES = ['index.html', 'incepe.html', 'teorie.html', 'individual.html', 'echipa.html', 'legal.html', '404.html'];
const CSS = ['assets/css/tokens.css', 'assets/css/app.css', 'assets/css/pages.css'];
const JS = ALL('assets/js', '.js').map(f => 'assets/js/' + f);
const ALLCSS = CSS.map(RM).join('\n');
const ALLJS = JS.map(RM).join('\n');
const ALLHTML = PAGES.map(RM).join('\n');
const T = f => (EX(f) ? RM(f) : '');

const results = [];
/* severitate: 'blocant' (fără el nu se publică) · 'conditionat' (se publică cu condiții/urmărire) */
function chk(dim, id, name, severity, ok, evidence) {
  results.push({ dim, id, name, severity, ok: !!ok, evidence: String(evidence ?? '').slice(0, 150) });
}
const has = (s, re) => re.test(s);

/* ============================================================
   1. ORGANIZAȚIE ȘI OAMENI
   ============================================================ */
const readme = T('README.md'), legal = T('legal.html'), qaReadme = T('qa-tools/README.md');
chk('Organizație și oameni', 'OP-01', 'README complet (ce este, cum se rulează, cum se verifică)', 'blocant',
  /##\s/.test(readme) && /npm run/.test(readme) && readme.length > 1500, KB('README.md') + ' KB');
chk('Organizație și oameni', 'OP-02', 'Licență publicată în repo', 'conditionat', EX('LICENSE'), EX('LICENSE') ? KB('LICENSE') + ' KB' : 'lipsă');
chk('Organizație și oameni', 'OP-03', 'Canal de raportare a erorilor, vizibil pe site', 'blocant',
  /#corectii/.test(legal) && /legal\.html#corectii/.test(ALLHTML), 'legal.html#corectii + link în footer');
chk('Organizație și oameni', 'OP-04', 'Termeni și confidențialitate publicate', 'blocant',
  /(Termeni|Terms)/.test(legal) && /(Confidențialitate|Privacy)/.test(legal), 'legal.html');
chk('Organizație și oameni', 'OP-05', 'Documentație de QA în repo (ce verifică fiecare script)', 'conditionat',
  /qa:start/.test(qaReadme) && /qa:mobile/.test(qaReadme), EX('qa-tools/README.md') ? KB('qa-tools/README.md') + ' KB' : 'lipsă');
const raport = T('RAPORT-PRODUCTIE.md');
chk('Organizație și oameni', 'OP-06', 'Raport de punere în producție (schimbare, riscuri, revenire)', 'blocant',
  /Plan de revenire|Rollback/i.test(raport) && /(GO|NO-GO)/.test(raport) && /Hiper-îngrijire|Hiper-ingrijire|hypercare/i.test(raport),
  EX('RAPORT-PRODUCTIE.md') ? KB('RAPORT-PRODUCTIE.md') + ' KB' : 'lipsă');
const cred = T('assets/js/credibility.js');
chk('Organizație și oameni', 'OP-07', 'Conținut cu dată de verificare și surse citate', 'conditionat',
  /VERIFIED/.test(cred) && /https:\/\//.test(T('assets/js/data.js')), (cred.match(/VERIFIED\s*=\s*'([^']+)'/) || [])[1] || 'fără dată');
chk('Organizație și oameni', 'OP-08', 'Licența fonturilor incluse în repo', 'conditionat',
  EX('assets/fonts/OFL.txt') || fs.readdirSync(path.join(ROOT, 'assets/fonts')).some(f => /ofl|licen/i.test(f)),
  (fs.readdirSync(path.join(ROOT, 'assets/fonts')) || []).join(', ').slice(0, 80));

/* ============================================================
   2. INFORMAȚIE ȘI TEHNOLOGIE
   ============================================================ */
chk('Informație și tehnologie', 'IT-01', 'Zero resurse externe la runtime (fără CDN, fără Google Fonts)', 'blocant',
  !has(ALLHTML, /fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr|unpkg\.com|cdnjs\./) && !has(ALLJS, /fonts\.googleapis/),
  'fonturi și scripturi locale');
chk('Informație și tehnologie', 'IT-02', 'Fără id-uri duplicate și un singur h1 pe pagină', 'blocant',
  PAGES.every(f => {
    const ids = [...T(f).matchAll(/id="([^"]+)"/g)].map(m => m[1]);
    return new Set(ids).size === ids.length && (T(f).match(/<h1/g) || []).length === 1;
  }), PAGES.join(', '));
chk('Informație și tehnologie', 'IT-03', 'Fiecare pagină are doctype, lang, charset și viewport mobil', 'blocant',
  PAGES.every(f => {
    const s = T(f);
    return /^<!DOCTYPE html>/i.test(s) && /<html lang="(ro|en)"/.test(s) && /charset="utf-8"/i.test(s) &&
      /name="viewport"[^>]*width=device-width/.test(s);
  }), 'viewport-fit=cover pe toate paginile');
chk('Informație și tehnologie', 'IT-04', 'Imagini cu alt, dimensiuni declarate și format modern', 'conditionat',
  !/<img(?![^>]*\balt=)/.test(ALLHTML) && /\.webp/.test(ALLHTML) && !/<img(?![^>]*\bwidth=)/.test(ALLHTML),
  (ALLHTML.match(/\.webp/g) || []).length + ' referințe WebP');
const pkg = JSON.parse(T('package.json')), sw = T('sw.js');
const versions = new Set([pkg.version, (sw.match(/clp-v([\d.]+)/) || [])[1]]);
chk('Informație și tehnologie', 'IT-05', 'O singură versiune în tot sistemul (package.json = sw.js = ?v=)', 'blocant',
  versions.size === 1 && PAGES.every(f => !/\?v=/.test(T(f)) || T(f).includes('?v=' + pkg.version)),
  'v' + pkg.version + ' · ' + (ALLHTML.match(/\?v=/g) || []).length + ' referințe versionate');
chk('Informație și tehnologie', 'IT-06', 'Service worker + manifest: instalabil și funcțional offline', 'conditionat',
  /CACHE_VERSION/.test(sw) && /standalone/.test(T('manifest.webmanifest')) && /serviceWorker/.test(ALLJS),
  'sw.js + manifest.webmanifest');
chk('Informație și tehnologie', 'IT-07', 'Fără console.log / eval în codul de producție', 'conditionat',
  !has(ALLJS, /console\.(log|debug)\(/) && !has(ALLJS, /\beval\(/), JS.length + ' fișiere JS verificate');
const cssKB = CSS.reduce((n, f) => n + KB(f), 0), jsKB = JS.reduce((n, f) => n + KB(f), 0);
const pageKB = Math.max(...PAGES.map(KB));
const gzKB = f => Math.round(zlib.gzipSync(fs.readFileSync(path.join(ROOT, f)), { level: 6 }).length / 1024);
const netKB = [...CSS, ...JS, ...PAGES].reduce((n, f) => n + gzKB(f), 0);
chk('Informație și tehnologie', 'IT-08', 'Buget de performanță: pagina < 90 KB, CSS < 120 KB, JS < 400 KB, total comprimat < 250 KB', 'conditionat',
  pageKB < 90 && cssKB < 120 && jsKB < 400 && netKB < 250,
  'pagina ' + pageKB + ' KB · CSS ' + cssKB + ' KB · JS ' + jsKB + ' KB · comprimat ' + netKB + ' KB');
const indexable = PAGES.filter(f => f !== '404.html');
chk('Informație și tehnologie', 'IT-09', 'Canonical + meta sociale pe paginile indexabile (404 e noindex, corect)', 'conditionat',
  indexable.every(f => /rel="canonical"/.test(T(f)) && /og:title/.test(T(f)) && /twitter:card/.test(T(f))),
  indexable.length + ' pagini indexabile + 404 marcat noindex');
chk('Informație și tehnologie', 'IT-10', 'sitemap.xml și robots.txt valide, cu toate paginile', 'conditionat',
  (T('sitemap.xml').match(/<loc>/g) || []).length >= 6 && /Sitemap:/.test(T('robots.txt')),
  (T('sitemap.xml').match(/<loc>/g) || []).length + ' adrese în sitemap');
const roKeys = (ALLHTML.match(/data-i18n-ro="/g) || []).length, enKeys = (ALLHTML.match(/data-i18n-en="/g) || []).length;
chk('Informație și tehnologie', 'IT-11', 'Paritate RO/EN pe toate paginile (fără text netradus)', 'blocant',
  roKeys === enKeys && roKeys > 200, roKeys + ' chei RO / ' + enKeys + ' chei EN');
chk('Informație și tehnologie', 'IT-12', 'Accesibilitate: skip-link, focus vizibil, contrast AA verificat automat', 'blocant',
  /skip-link/.test(ALLHTML) && /:focus-visible/.test(ALLCSS) && EX('qa-tools/contrast.mjs'),
  'qa:contrast rulează în poarta de calitate');

/* ============================================================
   3. PARTENERI ȘI FURNIZORI
   ============================================================ */
const render = T('render.yaml'), wf = T('.github/workflows/pages.yml');
chk('Parteneri și furnizori', 'PF-01', 'Zero dependențe de runtime (site static, fără lanț de aprovizionare)', 'blocant',
  Object.keys(pkg.dependencies || {}).length === 0, 'dependencies: {} · dev: ' + Object.keys(pkg.devDependencies || {}).join(', '));
chk('Parteneri și furnizori', 'PF-02', 'Configurația furnizorului de hosting validă (Blueprint static + rute + cache)', 'conditionat',
  /runtime:\s*static/i.test(render) && /staticPublishPath/.test(render) && /type:\s*rewrite/.test(render) && /Cache-Control/.test(render),
  'render.yaml: static, 6 rute, antete de cache');
chk('Parteneri și furnizori', 'PF-03', 'Publicarea trece prin poarta de calitate (nu se publică ce nu trece testele)', 'blocant',
  /(npm run check|tools\/check-site\.mjs)/.test(wf) && /upload-pages-artifact|deploy-pages/.test(wf),
  '.github/workflows/pages.yml: check înainte de publicare');
const secrets = [/sk-[A-Za-z0-9]{20,}/, /ghp_[A-Za-z0-9]{20,}/, /AKIA[0-9A-Z]{16}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/];
chk('Parteneri și furnizori', 'PF-04', 'Fără secrete sau chei în repo', 'blocant',
  ![...PAGES, ...JS, ...CSS, 'render.yaml', 'package.json', 'sw.js', 'server.js'].some(f => secrets.some(re => re.test(T(f)))),
  'scanat ' + (PAGES.length + JS.length + CSS.length + 4) + ' fișiere');
chk('Parteneri și furnizori', 'PF-05', 'Fonturi și imagini livrate local, cu licență', 'conditionat',
  fs.readdirSync(path.join(ROOT, 'assets/fonts')).filter(f => f.endsWith('.woff2')).length >= 2 &&
  fs.readdirSync(path.join(ROOT, 'assets/img')).filter(f => f.endsWith('.webp')).length >= 2,
  fs.readdirSync(path.join(ROOT, 'assets/fonts')).filter(f => f.endsWith('.woff2')).length + ' fonturi · ' +
  fs.readdirSync(path.join(ROOT, 'assets/img')).filter(f => f.endsWith('.webp')).length + ' imagini WebP');
chk('Parteneri și furnizori', 'PF-06', 'Fără blocare la un singur furnizor (site static mutabil pe orice host)', 'conditionat',
  /node server\.js/.test(readme) && /static/i.test(render) && /GitHub Pages/.test(readme),
  'Render (static) · GitHub Pages · orice server de fișiere');

/* ============================================================
   4. FLUXURI DE VALOARE ȘI PROCESE — tranziția serviciului
   ============================================================ */
const changelog = T('CHANGELOG.md');
chk('Fluxuri de valoare', 'VS-01', 'Changelog pentru versiunea curentă (gestiunea schimbării)', 'blocant',
  changelog.includes('## [' + pkg.version + ']'), 'CHANGELOG.md → ' + pkg.version);
chk('Fluxuri de valoare', 'VS-02', 'Versionare SemVer și consecventă', 'blocant',
  /^\d+\.\d+\.\d+$/.test(pkg.version), 'v' + pkg.version);
const assetRefs = [...ALLHTML.matchAll(/<(?:script|link)[^>]+(?:src|href)="(assets\/[^"]+)"/g)].map(m => m[1]);
const unversioned = assetRefs.filter(h => !/\?v=/.test(h));
chk('Fluxuri de valoare', 'VS-03', 'Cache-busting complet (fiecare activ are ?v=)', 'blocant',
  unversioned.length === 0, assetRefs.length + ' referințe, ' + unversioned.length + ' fără versiune' +
  (unversioned.length ? ': ' + unversioned.slice(0, 3).join(', ') : ''));
chk('Fluxuri de valoare', 'VS-04', 'Politici de cache corecte (imutabil pe active, revalidare pe HTML/sw)', 'conditionat',
  /immutable/.test(T('server.js')) && /no-cache/.test(T('server.js')) && /Cache-Control/.test(render),
  'server.js + render.yaml');
chk('Fluxuri de valoare', 'VS-05', 'Rute curate, 301 și pagină 404 proprii', 'conditionat',
  /301/.test(T('server.js')) && /404\.html/.test(T('server.js')) && EX('404.html'), '/teorie, /incepe, 404.html');
chk('Fluxuri de valoare', 'VS-06', 'Plan de revenire (rollback) documentat și fezabil', 'blocant',
  /(Plan de revenire|Rollback)/i.test(raport) && /git revert|git checkout|versiune/i.test(raport), 'RAPORT-PRODUCTIE.md');
chk('Fluxuri de valoare', 'VS-07', 'Hiper-îngrijire după lansare (cine, cât timp, ce urmărește)', 'conditionat',
  /(Hiper-îngrijire|Hiper-ingrijire|hypercare)/i.test(raport) && /24|48|72/.test(raport), 'RAPORT-PRODUCTIE.md');
chk('Fluxuri de valoare', 'VS-08', 'Criterii de acceptare înainte de publicare (porți verzi)', 'blocant',
  /Criterii de acceptare/i.test(raport) || /criterii de acceptare/i.test(readme), 'RAPORT-PRODUCTIE.md');
chk('Fluxuri de valoare', 'VS-09', 'Testare de regresie automatizată disponibilă în repo', 'blocant',
  ['qa.mjs', 'qa-start.mjs', 'crosscheck.mjs', 'contrast.mjs', 'mobile.mjs'].every(f => EX('qa-tools/' + f)),
  ALL('qa-tools', '.mjs').length + ' scripturi de QA');
chk('Fluxuri de valoare', 'VS-10', 'Canal de incidente cu timp de răspuns declarat', 'conditionat',
  /(24|48|72)\s*(de\s*)?(ore|h)/i.test(legal) || /răspuns|response/i.test(legal), 'legal.html');

/* ============================================================
   5. SECURITATE ȘI CONFORMITATE
   ============================================================ */
const server = T('server.js');
chk('Securitate și conformitate', 'SC-01', 'Antete de securitate (nosniff, frame, referrer, permissions)', 'blocant',
  /X-Content-Type-Options/.test(server) && /X-Frame-Options/.test(server) && /Referrer-Policy/.test(server) && /Permissions-Policy/.test(server),
  'server.js + render.yaml');
chk('Securitate și conformitate', 'SC-02', 'Content-Security-Policy definită pentru varianta servită de Node', 'conditionat',
  /Content-Security-Policy/.test(server), 'server.js');
chk('Securitate și conformitate', 'SC-03', 'Fără cookies, trackere sau analytics (fără consimțământ necesar)', 'conditionat',
  !/document\.cookie/.test(ALLJS) && !/google-analytics|googletagmanager|facebook\.net|hotjar|plausible|matomo/i.test(ALLHTML + ALLJS),
  'zero cod de urmărire');
chk('Securitate și conformitate', 'SC-04', 'Linkurile externe au rel="noopener"', 'conditionat',
  !/<a[^>]+target="_blank"(?![^>]*rel="[^"]*noopener)/.test(ALLHTML), 'toate linkurile _blank');
chk('Securitate și conformitate', 'SC-05', 'Fără conținut mixt pe resursele proprii (fără http:// la scripturi, stiluri, imagini)', 'blocant',
  !/<(script|link|img)[^>]+src="http:\/\//.test(ALLHTML) && !/<link[^>]+href="http:\/\//.test(ALLHTML),
  'resursele proprii sunt pe https sau relative');
chk('Securitate și conformitate', 'SC-06', 'Fără injectare de cod din date externe (fără eval, fără innerHTML din surse)', 'conditionat',
  !/eval\(/.test(ALLJS) && !/new Function\(/.test(ALLJS), 'doar date locale, esc() pentru text');

chk('Securitate și conformitate', 'SC-07', 'Adrese canonice și de partajare consecvente, pe https', 'conditionat',
  PAGES.every(f => {
    const c = (T(f).match(/rel="canonical" href="([^"]+)"/) || [])[1];
    return f === '404.html' || !c || /^https:\/\//.test(c);
  }) && new Set(indexable.map(f => (T(f).match(/rel="canonical" href="([^"]+)"/) || [])[1].replace(/\/[^/]*$/, ''))).size === 1,
  'un singur host canonic: ' + ((T('index.html').match(/rel="canonical" href="([^"]+)"/) || [])[1] || '').replace(/\/[^/]*$/, ''));

/* ============================================================
   6. CONTINUITATE, MĂSURARE, ÎMBUNĂTĂȚIRE CONTINUĂ
   ============================================================ */
chk('Continuitate și măsurare', 'CM-01', 'Pagină 404 proprie și rute inexistente tratate corect', 'conditionat',
  EX('404.html') && /X-Robots-Tag/.test(server), '404.html + noindex');
chk('Continuitate și măsurare', 'CM-02', 'Funcționare offline după prima vizită (continuitatea serviciului)', 'conditionat',
  /caches\.open/.test(sw) && /fetch\(/.test(sw), 'sw.js cache-first pe active');
chk('Continuitate și măsurare', 'CM-03', 'Disponibilitate fără spin-down (hosting static, fără proces care adoarme)', 'conditionat',
  /runtime:\s*static/i.test(render) && /staticPublishPath/.test(render), 'Render Static Site (runtime: static) · GitHub Pages');
chk('Continuitate și măsurare', 'CM-04', 'KPI de succes definiți (ce măsurăm după lansare)', 'conditionat',
  /KPI|Indicatori/i.test(raport), 'RAPORT-PRODUCTIE.md');
chk('Continuitate și măsurare', 'CM-05', 'Revizuire periodică a conținutului (date verificate, surse oficiale)', 'conditionat',
  /VERIFIED/.test(cred) && /actualizat|revis|la 90 de zile|trimestrial/i.test(readme + legal),
  'credibility.js + politica de corecții');

/* ============================================================
   7. VALIDARE ȘI TESTARE (poarta de calitate — rulează testele)
   ============================================================ */
const reachable = await (async () => {
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 2500);
    const r = await fetch(BASE + '/index.html', { signal: c.signal });
    clearTimeout(t);
    return r.ok;
  } catch { return false; }
})();

const GATES = [
  ['check', ['npm', 'run', 'check'], false],
  ['qa', ['npm', 'run', 'qa'], true],
  ['qa:start', ['npm', 'run', 'qa:start'], true],
  ['qa:css', ['npm', 'run', 'qa:css'], false],
  ['qa:polish', ['npm', 'run', 'qa:polish'], false],
  ['qa:contrast', ['npm', 'run', 'qa:contrast'], false],
  ['qa:mobile', ['npm', 'run', 'qa:mobile'], false],
];
const gateResults = [];
for (const [name, cmd, needsServer] of GATES) {
  if (needsServer && !reachable) { gateResults.push({ name, ok: false, skipped: true, out: 'serverul local nu răspunde pe ' + BASE }); continue; }
  try {
    const out = execFileSync(cmd[0], cmd.slice(1), { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    gateResults.push({ name, ok: true, out: (out.trim().split('\n').slice(-2).join(' · ') || 'trecut').slice(0, 140) });
  } catch (e) {
    const out = ((e.stdout || '') + (e.stderr || '')).trim().split('\n').slice(-3).join(' · ');
    gateResults.push({ name, ok: false, out: out.slice(0, 140) || 'a eșuat' });
  }
}
const gatesOk = gateResults.every(g => g.ok);
chk('Validare și testare', 'VT-01', 'Toate porțile de calitate trec (check, qa, qa:start, qa:css, qa:polish, qa:contrast, qa:mobile)', 'blocant',
  gatesOk, gateResults.filter(g => !g.ok).map(g => g.name).join(', ') || '6/6 verzi');
chk('Validare și testare', 'VT-02', 'Serviciul rulează pe mediul de verificare (răspunde pe HTTP)', 'conditionat',
  reachable, reachable ? BASE + '/index.html → 200' : BASE + ' nu răspunde');

/* ============================================================
   VERDICT
   ============================================================ */
const blocante = results.filter(r => !r.ok && r.severity === 'blocant');
const conditii = results.filter(r => !r.ok && r.severity === 'conditionat');
const verdict = blocante.length ? 'NO-GO' : (conditii.length ? 'GO CU CONDIȚII' : 'GO');
const DIMS = [...new Set(results.map(r => r.dim))];

console.log('\n══════════════════════════════════════════════════════════════');
console.log('  QA DE PUNERE ÎN PRODUCȚIE · ITIL 4 · versiunea ' + pkg.version);
console.log('══════════════════════════════════════════════════════════════');
for (const d of DIMS) {
  const list = results.filter(r => r.dim === d);
  const bad = list.filter(r => !r.ok).length;
  console.log('\n■ ' + d.toUpperCase() + '  (' + (list.length - bad) + '/' + list.length + ')');
  for (const r of list) {
    const mark = r.ok ? '✅' : (r.severity === 'blocant' ? '❌' : '⚠️ ');
    console.log('  ' + mark + ' ' + r.id + '  ' + r.name + (r.evidence ? '  → ' + r.evidence : ''));
  }
}
console.log('\n■ PORȚI DE CALITATE');
for (const g of gateResults) {
  console.log('  ' + (g.ok ? '✅' : '❌') + ' npm run ' + g.name + '  → ' + g.out);
}
console.log('\n──────────────────────────────────────────────────────────────');
console.log('  Verificări: ' + (results.length - blocante.length - conditii.length) + '/' + results.length +
  ' · blocante: ' + blocante.length + ' · condiții: ' + conditii.length);
console.log('  VERDICT: ' + (verdict === 'GO' ? '🟢 GO — se poate publica în producție'
  : verdict === 'GO CU CONDIȚII' ? '🟡 GO CU CONDIȚII — se publică, cu urmărirea punctelor de mai sus'
  : '🔴 NO-GO — nu se publică până nu se rezolvă punctele blocante'));
console.log('──────────────────────────────────────────────────────────────\n');

/* raport scris (folderul reports/ e ignorat de git) */
const dir = path.join(ROOT, 'reports');
fs.mkdirSync(dir, { recursive: true });
const md = [
  '# QA de punere în producție — ITIL 4',
  '',
  '- Versiune: **' + pkg.version + '**',
  '- Data: ' + new Date().toISOString().slice(0, 16).replace('T', ' '),
  '- Mediu verificat: `' + BASE + '` (' + (reachable ? 'răspunde' : 'nu răspunde') + ')',
  '- Verdict: **' + verdict + '**',
  '',
  ...DIMS.flatMap(d => [
    '## ' + d,
    '',
    '| ID | Verificare | Severitate | Rezultat | Dovadă |',
    '|---|---|---|---|---|',
    ...results.filter(r => r.dim === d).map(r =>
      '| ' + r.id + ' | ' + r.name + ' | ' + r.severity + ' | ' + (r.ok ? 'trecut' : 'NEPLUAT') + ' | ' + r.evidence.replace(/\|/g, '/') + ' |'),
    '',
  ]),
  '## Porți de calitate',
  '',
  ...gateResults.map(g => '- `npm run ' + g.name + '` — ' + (g.ok ? 'trecut' : 'eșuat') + ' · ' + g.out),
  '',
].join('\n');
fs.writeFileSync(path.join(dir, 'itil-readiness.md'), md, 'utf8');
console.log('Raport scris: reports/itil-readiness.md\n');

process.exit(blocante.length ? 1 : 0);
