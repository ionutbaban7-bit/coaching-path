#!/usr/bin/env node
/* Audit „super mobile friendly” (Android + iOS) — verificări statice pe HTML, CSS, JS
   și manifest. Nu are nevoie de browser: citește fișierele sursă și caută exact
   lucrurile care se strică pe telefon (zoom la focus, ținte prea mici, notch,
   100vh, meniu care lasă pagina să se deruleze, lipsa instalării ca aplicație).

   Rulează: npm run qa:mobile   (sau node qa-tools/mobile.mjs)                */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RM = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

const PAGES = ['index.html', 'incepe.html', 'teorie.html', 'individual.html', 'echipa.html', 'legal.html', '404.html'];
const CSS_FILES = ['assets/css/tokens.css', 'assets/css/app.css', 'assets/css/pages.css'];

const checks = [];
const ok = (name, cond, detail) => checks.push({ name, ok: !!cond, detail: detail || '' });

/* ---------- parser CSS minimal: reguli cu declarații + contextul de @media ----------
   Ignoră comentariile (inclusiv cele care conțin acolade) și păstrează pentru
   verificările textuale o versiune „curată" a CSS-ului.                        */
function parseCss(src) {
  const rules = [];
  const stack = [];
  let buf = '';
  let clean = '';
  let inComment = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    const next = src[i + 1];
    if (inComment) {
      if (ch === '*' && next === '/') { inComment = false; i++; clean += ' '; }
      continue;
    }
    if (ch === '/' && next === '*') { inComment = true; i++; continue; }
    clean += ch;
    if (ch === '{') {
      const head = buf.trim();
      buf = '';
      stack.push({ head, decls: '', isRule: !head.startsWith('@') });
      continue;
    }
    if (ch === '}') {
      const ctx = stack.pop();
      if (ctx && ctx.isRule) {
        const media = stack.map(c => c.head).join(' && ');
        rules.push({ sel: ctx.head, decls: ctx.decls, media });
      }
      buf = '';
      continue;
    }
    if (stack.length) {
      /* în interiorul unui @media, textul dintre reguli e selectorul regulii următoare */
      const top = stack[stack.length - 1];
      if (top.isRule) top.decls += ch;
      else buf += ch;
    } else {
      buf += ch;
    }
  }
  return { rules, clean };
}

function decls(text) {
  const map = {};
  for (const part of text.split(';')) {
    const i = part.indexOf(':');
    if (i < 0) continue;
    map[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return map;
}

/* rezolvă și tokenul de țintă minimă (--tap = 44px), nu doar valorile numerice */
const px = v => {
  if (!v) return NaN;
  const str = String(v);
  if (/var\(--tap\)/.test(str)) return 44;
  return parseFloat(str.replace(/[^\d.]/g, ''));
};
const hasSel = (rules, needle) => rules.filter(r => r.sel.split(',').some(s => s.trim() === needle));
const valueFor = (rules, sel, prop) => {
  for (const r of rules) {
    for (const s of r.sel.split(',')) {
      if (s.trim() === sel) {
        const d = decls(r.decls);
        if (d[prop] !== undefined) return { v: d[prop], media: r.media };
      }
    }
  }
  return null;
};
const maxFor = (rules, sel, prop) => {
  const vals = [];
  for (const r of rules) {
    for (const s of r.sel.split(',')) {
      if (s.trim() === sel) {
        const d = decls(r.decls);
        if (d[prop] !== undefined) vals.push(px(d[prop]));
      }
    }
  }
  return vals.length ? Math.max(...vals) : NaN;
};

const parsed = parseCss(CSS_FILES.map(RM).join('\n'));
const allCss = parsed.clean;
const rules = parsed.rules;

/* ============================================================
   1. HTML — viewport, meta-uri iOS/Android, câmpuri de căutare
   ============================================================ */
const badViewport = PAGES.filter(f => !/name="viewport"[^>]*viewport-fit=cover/.test(RM(f)));
ok('viewport cu viewport-fit=cover pe toate paginile', badViewport.length === 0, badViewport.join(', '));

const missingApple = PAGES.filter(f => {
  const s = RM(f);
  return !(/apple-mobile-web-app-capable/.test(s) && /apple-touch-icon/.test(s) && /format-detection/.test(s));
});
ok('meta-uri iOS (apple-mobile-web-app-capable, apple-touch-icon, format-detection)', missingApple.length === 0, missingApple.join(', '));

const badTheme = PAGES.filter(f => {
  const s = RM(f).split('</head>')[0];
  return !(/<meta name="theme-color"[^>]*media="\(prefers-color-scheme: light\)"/.test(s) &&
           /<meta name="theme-color"[^>]*media="\(prefers-color-scheme: dark\)"/.test(s));
});
ok('theme-color pentru ambele teme', badTheme.length === 0, badTheme.join(', '));

const searchInputs = [];
for (const f of PAGES) {
  const s = RM(f);
  for (const m of s.matchAll(/<input[^>]*class="search"[^>]*>/g)) searchInputs.push({ f, tag: m[0] });
}
const badSearch = searchInputs.filter(x => !(/type="search"/.test(x.tag) && /enterkeyhint/.test(x.tag)));
ok('câmpuri de căutare mobile (type=search + enterkeyhint)', searchInputs.length >= 3 && badSearch.length === 0,
  `${searchInputs.length} câmpuri, probleme: ${badSearch.map(x => x.f).join(', ')}`);

/* ============================================================
   2. Zone sigure (notch / Dynamic Island / bara de jos)
   ============================================================ */
for (const inset of ['top', 'right', 'bottom', 'left']) {
  ok(`env(safe-area-inset-${inset}) folosit`, allCss.includes(`safe-area-inset-${inset}`));
}
ok('bara „Continuă” respectă zona de jos', /resume-in\{[^}]*padding|resume-bar\{[^}]*top:var\(--nav-h\)/.test(allCss));
ok('antetul lipicios are padding pentru zona de sus', !!valueFor(rules, '.site-header', 'padding-top'));

/* ============================================================
   3. Înălțimi: fiecare 100vh are echivalent 100dvh
   ============================================================ */
const vhRules = rules.filter(r => /100vh/.test(r.decls));
const vhNoDvh = vhRules.filter(r => !/100dvh/.test(r.decls));
ok('fiecare 100vh are pereche 100dvh', vhNoDvh.length === 0, vhNoDvh.map(r => r.sel).join(', '));

/* ============================================================
   4. Fără zoom automat pe iOS (inputuri de 16px) + igienă tactilă
   ============================================================ */
const zoomFix = rules.some(r => /max-width:\s*640px/.test(r.media) && /\binput\b/.test(r.sel) && /font-size:\s*16px/.test(r.decls));
ok('inputuri de 16px pe telefon (fără zoom la focus)', zoomFix);

ok('-webkit-tap-highlight-color setat', /-webkit-tap-highlight-color:transparent/.test(allCss));
ok('touch-action:manipulation pe elementele interactive',
  rules.some(r => /touch-action:\s*manipulation/.test(r.decls) && /\ba\b/.test(r.sel) && /\bbutton\b/.test(r.sel)));
ok('overscroll-behavior pe zonele derulante', (allCss.match(/overscroll-behavior/g) || []).length >= 3);
ok('@media (hover:none) — fără hover lipicios pe touch', /@media\s*\(hover:none\)/.test(allCss));
ok('feedback la apăsare (:active) pe componentele principale',
  (allCss.match(/:active/g) || []).length >= 8, (allCss.match(/:active/g) || []).length + ' reguli :active');

/* ============================================================
   5. Ținte de atingere (minim ~44px)
   ============================================================ */
const targets = [
  ['.icon-btn', 'width', 44], ['.icon-btn', 'height', 44],
  ['.modal-close', 'width', 44], ['.lang-btn', 'min-height', 44],
  ['.to-top', 'width', 44], ['.start-dot', 'width', 44],
  ['.start-dot', 'height', 44], ['.resume-go', 'min-height', 44],
  ['.resume-x', 'width', 44], ['.navlinks a', 'min-height', 44],
  ['.start-step-head', 'min-height', 44], ['.vlink', 'min-height', 44],
  ['.start-opt', 'min-height', 44], ['.step-check', 'padding', 10]
];
const small = targets.filter(([sel, prop, min]) => !(maxFor(rules, sel, prop) >= min));
ok('ținte de atingere de minim 44px', small.length === 0, small.map(([s, p]) => `${s}{${p}}`).join(', '));

/* ============================================================
   6. Meniu mobil + bara „Continuă” + instalare
   ============================================================ */
ok('meniul mobil blochează derularea paginii', /html\.nav-open[^{]*\{[^}]*overflow:hidden/.test(allCss));
const siteJs = RM('assets/js/site.js');
ok('site.js: Escape închide meniul', /'Escape'/.test(siteJs));
ok('site.js: meniul se închide la atingere în afară', /nav\.contains\(e\.target\)/.test(siteJs));
ok('site.js: meniul se închide la rotire / ecran lat', /orientationchange/.test(siteJs) && /closeIfWide/.test(siteJs));
ok('site.js: bară „Continuă de unde ai rămas"', /cp_start_v2/.test(siteJs) && /cp_map_done/.test(siteJs) && /cp_progress/.test(siteJs));
ok('site.js: instalare ca aplicație (PWA)', /beforeinstallprompt/.test(siteJs) && /display-mode: standalone/.test(siteJs));
ok('bara „Continuă” e lipită sub antet', !!valueFor(rules, '.resume-bar', 'position') && /var\(--nav-h\)/.test((valueFor(rules, '.resume-bar', 'top') || {}).v || ''));
ok('ancorele țin cont de bara „Continuă”', /--scroll-offset/.test(allCss) && (allCss.match(/var\(--scroll-offset\)/g) || []).length >= 3);

/* ============================================================
   7. Manifest + cache offline la aceeași versiune
   ============================================================ */
let manifest = null;
try { manifest = JSON.parse(RM('manifest.webmanifest')); } catch (e) { manifest = null; }
ok('manifest: standalone + iconițe + culori',
  !!manifest && manifest.display === 'standalone' && Array.isArray(manifest.icons) && manifest.icons.length > 0 &&
  !!manifest.theme_color && !!manifest.start_url);

const pkgVersion = JSON.parse(RM('package.json')).version;
ok('sw.js: CACHE_VERSION = versiunea din package.json', RM('sw.js').includes(`clp-v${pkgVersion}`), 'clp-v' + pkgVersion);

/* ============================================================
   8. Interacțiune pe telefon: linkuri directe, bară de progres,
      indicii de derulare, notificări offline / versiune nouă
   ============================================================ */
const startJs = RM('assets/js/start.js');
ok('start.js: pasul deschis se scrie în adresă (#s4)', /history\.replaceState/.test(startJs) && /function setHash/.test(startJs));
ok('start.js: linkul direct deschide pasul cerut', /function applyHash/.test(startJs) && /hashchange/.test(startJs));
ok('start.js: buton „Link către pas”', /data-share/.test(startJs) && /start-share/.test(allCss));
ok('start.js: copiere cu fallback (iOS / file://)', /execCommand/.test(startJs) && /navigator\.clipboard/.test(startJs));
ok('bară fixă de progres pe telefon', /\.start-dock\{/.test(allCss) && (valueFor(rules, '.start-dock', 'position') || {}).v === 'fixed');
ok('bara de progres stă deasupra barei gestuale', /has-stepbar .to-top\{bottom:calc\(86px \+ var\(--safe-b\)\)/.test(allCss.replace(/\s+/g, ' ')) || /\.start-dock\{[^}]*padding-bottom:var\(--safe-b\)/.test(allCss));
ok('bara dispare pe desktop', /@media \(min-width:1041px\)\{\.start-dock\{display:none\}\}/.test(allCss));
ok('bara nu acoperă finalul paginii', /html\.has-stepbar body\{padding-bottom/.test(allCss));
ok('indicii pentru tabelele derulante lateral', /is-scrollable/.test(allCss) && /\.scroll-hint\{/.test(allCss) && /scroll-hint/.test(siteJs));
ok('prima coloană rămâne vizibilă la derulare laterală', /position:sticky;left:0/.test(allCss.replace(/\s+/g, '')) || /position:sticky/.test(allCss) && /school-table td:first-child/.test(allCss));
ok('site.js: notificare offline / revenire online', /addEventListener\('offline'/.test(siteJs) && /addEventListener\('online'/.test(siteJs));
ok('site.js: anunță versiunea nouă și oferă reîncărcare', /updatefound/.test(siteJs) && /app-note/.test(allCss));
ok('nu blocăm zoom-ul cu touch-action:none', !/touch-action:\s*none/.test(allCss));
ok('variabila --tap (ținta minimă) e folosită', /var\(--tap\)/.test(allCss));
ok('mesaj clar când căutarea nu găsește nimic (glosar)', /empty-state/.test(RM('assets/js/app.js')));

/* ---------- 8. popup-ul opririi (drumul cu bicicleta) ---------- */
const mapJs = RM('assets/js/map.js');
const sheet = valueFor(rules, '.rm-panel', 'position');
const sheetMedia = rules.filter(r => r.sel.trim() === '.rm-panel' && /max-width:760px/.test(r.media));
ok('popup-ul opririi e dialog modal', /aria-modal/.test(mapJs) && /role="dialog"|setAttribute\('role','dialog'\)/.test(mapJs) && /rm-open/.test(allCss));
ok('pe telefon popup-ul e „bottom sheet”', sheetMedia.some(r => /bottom:0/.test(r.decls) && /max-height:88dvh/.test(r.decls)));
ok('popup-ul respectă bara gestuală', sheetMedia.some(r => /var\(--safe-b\)/.test(r.decls)));
ok('popup-ul nu depășește ecranul', (sheet ? String(sheet.v) : '') !== '' && /dvh/.test(allCss) && /max-height:min\(84dvh/.test(allCss));
ok('butonul de închidere are țintă de 44px', /var\(--tap\)/.test((valueFor(rules, '.rm-close', 'width') || {}).v || ''));
ok('fundalul popup-ului acoperă ecranul', (valueFor(rules, '.rm-back', 'position') || {}).v === 'fixed' && /\.rm-back\{[^}]*inset:0/.test(allCss));
ok('derularea paginii se blochează cât e popup-ul deschis', /html\.rm-open/.test(allCss));
ok('punctele drumului au 44px pe touch', /@media \(pointer:coarse\)\{\.rj-dot\{width:var\(--tap\)/.test(allCss.replace(/\s+/g, ' ')) || /@media \(pointer:coarse\)\{\s*\.rj-dot\{width:var\(--tap\);height:var\(--tap\)\}/.test(allCss));
ok('bicicleta respectă „mișcare redusă”', /prefers-reduced-motion:reduce[\s\S]{0,120}\.rj-bike/.test(allCss));
ok('bara drumului nu se rupe pe telefon', /@media \(max-width:760px\)[\s\S]{0,400}\.rj-dots\{order:3/.test(allCss));
ok('titlul secțiunii a fost rescris', /Ești nou în coaching\?/.test(RM('index.html')));

/* ============================================================
   RAPORT
   ============================================================ */
let fails = 0;
for (const c of checks) {
  if (c.ok) console.log('  ✅ ' + c.name);
  else { fails++; console.log('  ❌ ' + c.name + (c.detail ? ' :: ' + c.detail : '')); }
}
console.log(`\nqa:mobile — ${checks.length - fails}/${checks.length} verificări trecute` + (fails ? ` (${fails} probleme)` : ''));
process.exit(fails ? 1 : 0);
