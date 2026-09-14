# Changelog

Toate modificările notabile ale proiectului sunt documentate aici.
Format bazat pe [Keep a Changelog](https://keepachangelog.com/) · versiuni [SemVer](https://semver.org/).

Data de verificare a conținutului: **14 septembrie 2026**.
Pentru a raporta o informație greșită: butonul „Raportează o greșeală” de pe orice secțiune
sau [direct pe GitHub](https://github.com/ionutbaban7-bit/coaching-path/issues/new?labels=corectie).

---

## [1.3.0] — 2026-09-14

### Reparat — deploy
- **Render nu putea publica nimic**: `render.yaml`, `package.json` și `server.js` existau doar în
  branch-ul de lucru, nu în branch-ul implicit (`main`) din care Render citește Blueprint-ul.
  Acum `render.yaml` e un Blueprint complet funcțional după merge, cu varianta statică implicită,
  rute scurte (`/teorie`, `/individual`, `/echipa`, `/legal`) și antete de cache.
- `server.js` rescris: **compresie gzip/brotli** (pagina principală: ~27 KB → ~7 KB), rute cu slash
  final (`/teorie/`), 301 pentru `/index.html`, 405 pentru metode non-GET, **antete de securitate**
  (CSP, `frame-ancestors`, `X-Frame-Options`, `Permissions-Policy`, COOP) și cache corect
  (active versionate = imutabile, HTML mereu revalidat).
- Workflow-ul de GitHub Pages rulează acum `npm run check` **înainte** de publicare.

### Reparat — fonturi
- **Fontul nu se încărca deloc**: token-urile cereau „Inter”, dar niciun fișier nu era livrat, deci
  browserul cădea pe fontul de sistem (arăta diferit pe fiecare dispozitiv).
- Inter Variable **găzduit local** (`assets/fonts/`, 2 subseturi WOFF2 + licență OFL), cu
  `unicode-range` corect pentru diacriticele românești (ă â î ș ț sunt în subsetul latin-ext),
  `font-display:swap`, preload în toate paginile. Zero cereri către Google Fonts, merge offline.
- Eticheta din logo mărită de la 9,5 px la 10,5 px (era greu lizibilă).

### Reparat — fluiditate
- Eliminat `transition:all` (15 locuri) — se tranziționau și proprietăți de layout, cu repictări
  inutile la fiecare hover; acum tranzițiile sunt pe liste explicite (`--t-ui`, `--t-ui-slow`).
- **Navigarea nu mai smucește pagina**: linkul activ din bara de sus se derula cu `scrollIntoView()`,
  care pe mobil trăgea toată pagina după el. Acum se derulează doar bara, pe orizontală.
- **Saltul dublu din „De unde pornești?”** (hash + `scrollIntoView`) a devenit un singur salt lin.
- Ilustrațiile de pagină trecute din PNG în **WebP** (174/203/133 KB → 36/20/18 KB), cu `width`/`height`
  explicite, `decoding="async"` și `fetchpriority="high"` — fără sărituri de layout.
- Header-ul lipicios renunță la `backdrop-filter` pe ecrane mici (repictare scumpă la derulare);
  respectă și `prefers-reduced-transparency`.

### Reparat — funcționalități neterminate
- **Cuprinsul paginilor de conținut nu arăta niciodată unde ești** (`.toc a.active` exista în CSS,
  dar nimic nu adăuga clasa). Acum e urmărit cu IntersectionObserver.
- **Conectorii hărții** erau desenați după o ordine fixă, valabilă doar pe desktop: pe tabletă și
  telefon liniile se încrucișau peste carduri. Acum ordinea se calculează din pozițiile reale.
- **Panoul hărții rămânea în limba veche** după schimbarea limbii; la fel, pașii deschiși din
  learning pathuri se închideau la orice re-randare. Ambele stări se păstrează acum.
- **Fereastra modală** avea `aria-hidden="true"` permanent, focusul rămânea în pagină și Tab-ul
  ieșea din dialog. Acum: `aria-hidden` comutat, focus mutat pe butonul de închidere, capcană de
  Tab, focus restituit la închidere, compensare pentru bara de derulare.
- Accesibilitate la tastatură: pașii din pathuri se deschid cu Enter/Spațiu (`role="button"`,
  `aria-expanded`), cardurile de credențiale se deschid cu tastatura, chipurile de filtrare au
  `aria-pressed`, acordeonul FAQ are `aria-expanded`, taburile au `role="tab"` și navigare cu
  săgeți, linkul activ din meniu are `aria-current`, butoanele din header au etichete bilingve.
- Căutarea din credențiale nu mai pierde focusul și poziția cursorului când schimbi filtrul;
  lista goală afișează acum un mesaj clar în loc de spațiu gol.
- Eliminate 13 atribute HTML rupte (ghilimele drepte neescapate în textele englezești, care
  stricau markup-ul) în `individual.html`, `echipa.html`, `teorie.html`.
- Corectat linkul extern către directorul ICF care era fără `rel="noopener"` și cheia de traducere
  lipsă a titlului „De unde pornești?” (rămânea în română pe engleză).

### Adăugat
- **Service worker** (`sw.js`): offline după prima vizită, încărcare instant la revizitare,
  versiune de cache clară.
- **SEO/partajare**: `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, `rel="canonical"`,
  `og:url`, `og:image` absolut cu dimensiuni, `og:site_name`, `og:locale`, `twitter:card`,
  `theme-color` pentru light/dark.
- **`tools/check-site.mjs`** (`npm run check`): sintaxă JS, JSON valid, referințe locale existente,
  paritate RO/EN, acolade CSS echilibrate, versiune consecventă, zero cereri externe.
- **Conținut nou în planul 1:1** (bilingv): fișa de intake (8 întrebări) + filtru de orientare,
  checklist de contract în 9 puncte, grilă de măsurare a progresului, bilanțul de final, planul de
  practică pe cele 8 competențe (exercițiu, semn de progres, dovadă) și tabelul de administrare a
  instrumentelor (când, cât durează, cum se citește, semnale de interpretare greșită).
  Statusurile din tabelul „Ce rămâne de populat” au fost actualizate.

### Note
- Versiunea activelor din pagini (`?v=1.3.0`) se schimbă odată cu `package.json`, ca browserele să
  nu țină CSS/JS vechi după deploy.

## [1.2.0] — 2026-09-14

### Adăugat — pachet de credibilitate
- **Bandă de verificare pe fiecare secțiune**: afișează data verificării, sursele oficiale cu link
  direct și un buton de raportare a erorilor (`assets/js/credibility.js`).
- **Verificare per școală**: dată de verificare, semnal „declarație proprie” pentru programele
  neverificate oficial și linkuri către directorul ICF Education Search.
- **Pagină legală** (`legal.html`): termeni de utilizare, politică de confidențialitate,
  ce se salvează local (`cp_lang`, `cp_theme`, `cp_progress`, `cp_map_done`), disclaimer,
  procedura de corecții, surse și licență.
- **Raportare erori pre-completată**: butonul construiește un issue GitHub cu pagina, secțiunea,
  limba și versiunea informației deja completate.
- Legături către Legal și Changelog în footer-ul tuturor paginilor.

## [1.1.0] — 2026-09-14

### Adăugat — popularea planurilor
- **Bancă de întrebări**: 64 de întrebări în 8 categorii, cu varianta „de evitat” pentru fiecare,
  căutare bilingvă și filtre pe categorii (`assets/js/plan.js`).
- **Diagnostic de echipă**: grilă de interviu 1:1 (8 întrebări), chestionar 12 itemi × 4 dimensiuni
  (scară 1–5), grilă de observație în ședințe (6 dimensiuni).
- **4 ateliere** cu design complet: obiectiv, durată, 20 de pași, materiale.
- Suport pentru placeholder bilingv (`data-i18n-ph-ro/en`).

### Modificat
- Tabelele de stare marchează elementele completate.
- Textele care anunțau structura „goală” au fost actualizate.

### Reparat
- Tag `</section>` duplicat în `echipa.html`.

## [1.0.0] — 2026-09-14

Rebranding **Coaching Path → Coaching Learning Path** și refacere completă de UI/UX.

### Adăugat
- **Sistem de design** (`assets/css/tokens.css`): 95 de tokenuri, mod întunecat complet cu
  contrast AAA, detecția preferinței de sistem, anti-flash la încărcare.
- **Hartă interactivă**: 8 opriri pentru cine pornește de la zero, noduri așezate șerpuitor cu
  conectori SVG calculați la runtime, panou de detalii, progres bifabil salvat local.
- **Trei pagini noi**: `teorie.html` (10 secțiuni), `individual.html` (10 secțiuni),
  `echipa.html` (10 secțiuni) — 834 de texte bilingve RO/EN.
- Identitate vizuală: logo, favicon SVG/PNG, copertă OG 1200×630, ilustrații per pagină.
- Configurare deploy: `render.yaml` (Render) și `.github/workflows/pages.yml` (GitHub Pages).
- Pagină de eroare 404 personalizată.

### Modificat
- **Arhitectură modulară**: dintr-un singur `index.html` de 172 KB → 4 pagini + 3 CSS + 4 JS.
  Datele au fost extrase mecanic, fără pierderi.
- Accesibilitate: contrast WCAG AA/AAA, focus vizibil, skip-link, ARIA,
  `prefers-reduced-motion`, stiluri de print.
- Imagini comprimate: 4,7 MB → 0,8 MB (−83%).

### Reparat
- **Bug major**: aplicația crășa complet dacă `localStorage` era blocat (deschidere din `file://`
  sau mod privat). Toate accesările trec acum prin wrapperul `LS.get/set/json`.
- `concurency` → `concurrency` în workflow-ul Pages.
- Variabila CSS `--oc` pentru accentul cardurilor de organism.

## [0.1.0] — 2026-09-14

Versiunea inițială „Coaching Path”: un singur fișier `index.html` cu datele despre
certificările ICF, EMCC și ANC România, plus arhiva duplicat `coaching-path (1).zip`.

---

## Schimbări anunțate care ne privesc

Evenimente deja reflectate în conținut, dar care trebuie **reverificate la datele lor**:

| Data | Schimbare | Unde |
|------|-----------|------|
| **10 noiembrie 2026** | Noul examen ICF PCC/MCC: 80 de itemi / 150 de minute, pe competențele și codul etic 2025. Varianta veche (78 scenarii / 180 min) rămâne disponibilă până la 31 martie 2027. | `index.html` → Noutăți · Traseul ICF · Certificări |
| **1 ianuarie 2027** | Orele noi de mentor coaching trebuie livrate de un coach cu MCS. | `index.html` → Noutăți · Traseul ICF |
| **2024–2034** | Standardul ocupațional pentru COR 242412 (coach). | `index.html` → Traseul ANC |
| **permanent** | Lista furnizorilor autorizați ANC (autorizație valabilă 4 ani, per furnizor). | `index.html` → Școli |

## Convenții

- **Adăugat** — funcționalități noi
- **Modificat** — schimbări în funcționalități existente
- **Reparat** — corecții de bug-uri
- **Scos** — funcționalități eliminate
