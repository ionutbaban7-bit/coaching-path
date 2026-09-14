# Coaching Learning Path

Aplicație web gratuită, complet autonomă (fără internet, fără cont, fără tracking), care explică
coachingul de la zero și hărțuiește certificările relevante în România:

- **ICF** — ACC, PCC, MCC, ACTC, MCS (Mentor Coach Specialization), Level 1/2/3, CCE
- **EMCC** — EIA (Foundation, Practitioner, Senior Practitioner, Master Practitioner), ITCA, ESIA, EQA
- **România / ANC** — Specialist în activitatea de coaching (COR 242412), Formator (COR 242401), Mentor (COR 235902)

## Ce conține

| Pagina | Ce găsești |
|--------|------------|
| `incepe.html` | **Traseu ghidat, gamificat** pentru cine nu a auzit niciodată de coaching: calibrare în 3 întrebări → 10 pași cu verificare la fiecare (ce este coachingul, unde se aplică, cum arată o sesiune, competențe și etică, ICF/EMCC/ANC, procesul ICF pas cu pas, mentor coaching și supervizare, cum alegi școala, cum devii trainer/mentor/supervizor, bibliotecă de cărți + studii + coachi de renume) → XP, insigne, plan personal pe 12 luni, salvat local |
| `index.html` | **Harta interactivă** în 8 opriri pentru cine pornește de la zero, cele 3 sisteme, learning pathuri cu progres salvat, treceri între certificări, bibliotecă de credențiale, director de școli (31 de intrări), exemplu de parcurs, costuri, FAQ + glosar, surse oficiale |
| `teorie.html` | Ce este coachingul, ce NU este (matrice de comparație), istoric pe timeline, unde se folosește, anatomia unei sesiuni, 6 modele de lucru, cele 8 competențe ICF, etică și limite, mituri, ce spune cercetarea |
| `individual.html` | Plan complex de coaching 1:1 — arhitectura programului, etape, structura ședinței, bancă de întrebări, plan pe competențe, instrumente, jurnal de ore, rubrică de autoevaluare |
| `echipa.html` | Plan complex de coaching de echipă — definiții, diferențe față de facilitare/training/team building, 6 modele, arhitectură pe 6 luni, diagnostic, metrici, capcane |

Planurile de pe `individual.html` și `echipa.html` au **structura completă**, cu sloturi marcate
`✍️ De populat` și câte un tabel de stare la final — conținutul detaliat se adaugă progresiv.

## Cum deschizi

**Simplu:** dublu-click pe `index.html`. Merge offline, în orice browser modern.

**Sau cu un server local (recomandat: compresie + rute scurte):**
```bash
npm start                     # → http://localhost:3000  (Node >= 18, zero dependențe)
# echivalent, fără Node:
python3 -m http.server 8000   # → http://localhost:8000
```

**Verificare înainte de publicare:**
```bash
npm run check                 # sintaxă JS, referințe locale, paritate RO/EN, versiuni
```

**Verificări de calitate (QA, opționale — au nevoie de `npm install` și de serverul pornit):**
```bash
npm start                     # pornește serverul pe http://localhost:3000
npm run qa                    # încarcă toate paginile în jsdom: erori, randare, interacțiuni
npm run qa:start              # 41 de verificări pentru traseul „Începe aici” (quiz, XP, plan)
npm run qa:css                # clase/variabile CSS folosite dar nedefinite, id-uri lipsă
npm run qa:contrast           # contrast text/fundal în ambele teme (prag AA 4.5:1)
```

## Structura proiectului

```
index.html · incepe.html · teorie.html · individual.html · echipa.html · legal.html
assets/
  css/fonts.css    → @font-face pentru Inter Variable, găzduit local (fără Google Fonts)
  css/tokens.css   → design tokens (culoare, spațiere, tipografie, dark mode)
  css/app.css      → componente (nav, hartă, carduri, stepper, tabele, bandă de verificare, footer)
  css/pages.css    → pagini de conținut (cuprins, matrice, timeline, planuri, print)
  js/data.js       → toate datele, bilingv RO/EN (organisme, pathuri, credențiale, școli)
  js/app.js        → logica aplicației
  js/site.js       → temă, limbă, nav, scroll-spy, animații la scroll
  js/map.js        → harta interactivă
  js/start.js      → traseul ghidat „Începe aici” (pași, quiz, XP, insigne, plan pe 12 luni)
  js/plan.js       → banca de întrebări, instrumente de echipă, ateliere
  js/credibility.js→ banda „verificat la / surse / raportează o greșeală”
  fonts/           → Inter Variable (2 subseturi WOFF2 + licența OFL)
  img/             → favicon, copertă socială, ilustrații WebP
data/sources.json  → registrul surselor oficiale (ce se verifică, la ce interval)
manifest.webmanifest · robots.txt · sitemap.xml  → instalare, indexare, SEO
sw.js              → service worker: site-ul merge și offline, a doua vizită e instant
tools/update-info.mjs  → jobul de verificare a datelor (rulează manual sau lunar)
tools/check-site.mjs   → verificare înainte de publicare (npm run check)
qa-tools/              → verificări de calitate (npm run qa / qa:start / qa:css / qa:contrast)
server.js          → server static, zero dependențe (pentru Render Web Service)
package.json       → npm start / npm run update-info
render.yaml        → Blueprint Render (Static Site implicit + Web Service Node comentat)
404.html           → pagină de eroare personalizată
CHANGELOG.md       → istoricul modificărilor
```

## Funcționalități

- **Bilingv RO/EN** — 834 de texte traduse, comutare instantanee, limba se memorează.
- **Mod întunecat** — detectează preferința sistemului, se poate comuta manual, se memorează.
- **Progres salvat local** — pașii bifați din learning pathuri și opririle parcurse de pe hartă rămân la reîncărcare (fără cont, fără server).
- **Căutare și filtre** — pe școli (nume, descriere, oraș), pe credențiale (organism, tip, text liber) și în glosar.
- **Font propriu, fără internet** — Inter Variable, găzduit în `assets/fonts/`: același text pe orice dispozitiv, fără cereri către Google Fonts.
- **Offline după prima vizită** — un service worker (`sw.js`) păstrează paginile și activele în cache: a doua vizită se încarcă instant, iar fără rețea site-ul se deschide în continuare.
- **Cuprins care te urmărește** — pagina de conținut marchează secțiunea în care ești, iar navigarea nu mai sare la derulare.
- **Accesibil** — contrast WCAG AA/AAA, navigare cu tastatura, focus vizibil, `prefers-reduced-motion`, stiluri de print.

## Publicare pe GitHub Pages

`.github/workflows/pages.yml` publică tot conținutul la fiecare push pe `main`.
Prima dată trebuie activat manual, din interfața GitHub:

**Settings → Pages → Source → „GitHub Actions"**

După activare, site-ul apare la `https://ionutbaban7-bit.github.io/coaching-path/`.

## Deploy pe Render

**De ce nu mergea înainte:** Render citește `render.yaml` din **branch-ul implicit** al repo-ului,
adică din `main`. Pe `main` existau doar fișierul vechi `index.html` și un zip — `package.json`,
`server.js` și `render.yaml` trăiau doar în branch-ul de lucru. Așa că orice încercare de deploy
(Blueprint sau Web Service) se oprea imediat. Rezolvarea are două părți:

1. **Publică modificările în `main`** (merge PR-ul din branch-ul de lucru). Din acel moment
   `render.yaml` există pe branch-ul implicit și Blueprint-ul funcționează.
2. **Sau publică acum, fără merge**, direct din dashboard, alegând branch-ul la pasul „Branch”.

### Varianta A — Static Site (recomandat, fără spin-down, fără build)

| Câmp | Valoare |
|------|---------|
| Type | **Static Site** |
| Branch | `main` (sau branch-ul tău de lucru) |
| Build Command | *lasă gol* |
| Publish Directory | `.` (rădăcina repo-ului) |

`render.yaml` conține deja rutele scurte (`/teorie`, `/individual`, `/echipa`, `/legal`) și
antetele de cache pentru varianta statică, deci nu trebuie configurat nimic manual.

### Varianta B — Web Service (Node, dacă vrei serverul propriu)

| Câmp | Valoare |
|------|---------|
| Type | **Web Service** |
| Runtime | **Node** |
| Branch | `main` |
| Region | Frankfurt (cel mai aproape de România) |
| Build Command | `npm install --omit=dev` |
| Start Command | `node server.js` |
| Health Check Path | `/` |

`server.js` (zero dependențe) adaugă compresie gzip/brotli, rute scurte, cache corect și antete
de securitate (CSP, `frame-ancestors`, `Permissions-Policy`). Blocul e pregătit, comentat, în `render.yaml`.

### Rute disponibile (cu server.js sau cu rewrite-urile din render.yaml)

`/` · `/incepe` · `/teorie` · `/individual` · `/echipa` · `/legal`
plus variantele clasice: `/incepe.html`, `/teorie.html`, `/individual.html`, `/echipa.html`, `/legal.html`.
`404.html` se servește automat pe rutele inexistente.

> Workflow-ul pentru **GitHub Pages** (`.github/workflows/pages.yml`) rulează verificarea
> `npm run check` înainte de publicare — dacă site-ul e rupt, deploy-ul se oprește, nu publică.

### Dacă schimbi domeniul

Canonical, `og:url`, `og:image` și `sitemap.xml` folosesc adresa
`https://ionutbaban7-bit.github.io/coaching-path/`. Dacă muți site-ul pe un domeniu propriu,
înlocuiește adresa în cele 6 pagini HTML și în `sitemap.xml` (o singură căutare-înlocuire).

## Jobul „Actualizare informații · Update Info”

Când vrei să verifici dacă datele mai sunt de actualitate, rulezi jobul din GitHub:

**Actions → „Actualizare informații · Update Info” → Run workflow**

| Opțiune | Ce face |
|---------|---------|
| `mode = report` | inventar + validări + expirări (fără apeluri pe net) |
| `mode = full` | ca mai sus, plus verificarea linkurilor |
| `check_links` | bifezi dacă vrei neapărat testul de linkuri |
| `days` | pragul de expirare, în zile (implicit 60) |

Jobul nu modifică nimic de unul singur. Produce:

- un **sumar direct în pagina rulării** (îl vezi imediat);
- un artefact `update-info-report` cu `update-info-report.md` și `summary.json`;
- (la rularea automată lunară) un **issue** etichetat `actualizare-informatii`, dacă a expirat ceva.

Îl poți rula și local: `node tools/update-info.mjs --links`.

### Cum actualizezi informațiile, pas cu pas

1. Vezi în raport ce e marcat 🔴 (sursă expirată) sau ⚠️ (eveniment depășit).
2. Deschizi sursa oficială din `data/sources.json` și verifici informația.
3. Corectezi datele în fișierul indicat în coloana „Unde” (de regulă `assets/js/data.js`).
4. Pui data de azi în `data/sources.json` → `verified_on` și în `assets/js/credibility.js` → `VERIFIED`.
5. Adaugi o linie în [`CHANGELOG.md`](CHANGELOG.md).
6. Rulezi din nou jobul: trebuie să iasă 🟢.

Registrul complet al surselor, cu ce se verifică în fiecare și la ce interval:
[`data/sources.json`](data/sources.json).

## Note

> Instrument educativ independent, neafiliat ICF / EMCC / ANC sau vreunei școli de coaching.
> Datele sunt actualizate la 14 septembrie 2026 și au caracter orientativ: orele, taxele, examenele și
> perioadele de revizuire se modifică (vezi schimbările anunțate pentru noiembrie 2026 și ianuarie–aprilie
> 2027). Înainte de orice înscriere, verifică pe sursele oficiale listate în aplicație.

Planul complet de refacere a interfeței, în 7 pași, cu problemele găsite și soluțiile aplicate:
[`IMBUNATATIRI_7_PASI.md`](IMBUNATATIRI_7_PASI.md).
