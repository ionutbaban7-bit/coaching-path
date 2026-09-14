# Coaching Learning Path

Aplicație web gratuită, complet autonomă (fără internet, fără cont, fără tracking), care explică
coachingul de la zero și hărțuiește certificările relevante în România:

- **ICF** — ACC, PCC, MCC, ACTC, MCS (Mentor Coach Specialization), Level 1/2/3, CCE
- **EMCC** — EIA (Foundation, Practitioner, Senior Practitioner, Master Practitioner), ITCA, ESIA, EQA
- **România / ANC** — Specialist în activitatea de coaching (COR 242412), Formator (COR 242401), Mentor (COR 235902)

## Ce conține

| Pagina | Ce găsești |
|--------|------------|
| `index.html` | **Harta interactivă** în 8 opriri pentru cine pornește de la zero, cele 3 sisteme, learning pathuri cu progres salvat, treceri între certificări, bibliotecă de credențiale, director de școli (31 de intrări), exemplu de parcurs, costuri, FAQ + glosar, surse oficiale |
| `teorie.html` | Ce este coachingul, ce NU este (matrice de comparație), istoric pe timeline, unde se folosește, anatomia unei sesiuni, 6 modele de lucru, cele 8 competențe ICF, etică și limite, mituri, ce spune cercetarea |
| `individual.html` | Plan complex de coaching 1:1 — arhitectura programului, etape, structura ședinței, bancă de întrebări, plan pe competențe, instrumente, jurnal de ore, rubrică de autoevaluare |
| `echipa.html` | Plan complex de coaching de echipă — definiții, diferențe față de facilitare/training/team building, 6 modele, arhitectură pe 6 luni, diagnostic, metrici, capcane |

Planurile de pe `individual.html` și `echipa.html` au **structura completă**, cu sloturi marcate
`✍️ De populat` și câte un tabel de stare la final — conținutul detaliat se adaugă progresiv.

## Cum deschizi

**Simplu:** dublu-click pe `index.html`. Merge offline, în orice browser modern.

**Sau cu un server local:**
```bash
python3 -m http.server 8000   # apoi deschide http://localhost:8000
```

## Structura proiectului

```
index.html · teorie.html · individual.html · echipa.html · legal.html
assets/
  css/tokens.css   → design tokens (culoare, spațiere, tipografie, dark mode)
  css/app.css      → componente (nav, hartă, carduri, stepper, tabele, bandă de verificare, footer)
  css/pages.css    → pagini de conținut (cuprins, matrice, timeline, planuri, print)
  js/data.js       → toate datele, bilingv RO/EN (organisme, pathuri, credențiale, școli)
  js/app.js        → logica aplicației
  js/site.js       → temă, limbă, nav, scroll-spy, animații la scroll
  js/map.js        → harta interactivă
  js/plan.js       → banca de întrebări, instrumente de echipă, ateliere
  js/credibility.js→ banda „verificat la / surse / raportează o greșeală”
  img/             → favicon, copertă socială, ilustrații
data/sources.json  → registrul surselor oficiale (ce se verifică, la ce interval)
tools/update-info.mjs  → jobul de verificare a datelor (rulează manual sau lunar)
server.js          → server static, zero dependențe (pentru Render Web Service)
package.json       → npm start / npm run update-info
render.yaml        → Blueprint Render (Web Service Node + instrucțiuni Static Site)
404.html           → pagină de eroare personalizată
CHANGELOG.md       → istoricul modificărilor
```

## Funcționalități

- **Bilingv RO/EN** — 834 de texte traduse, comutare instantanee, limba se memorează.
- **Mod întunecat** — detectează preferința sistemului, se poate comuta manual, se memorează.
- **Progres salvat local** — pașii bifați din learning pathuri și opririle parcurse de pe hartă rămân la reîncărcare (fără cont, fără server).
- **Căutare și filtre** — pe școli (nume, descriere, oraș), pe credențiale (organism, tip, text liber) și în glosar.
- **Accesibil** — contrast WCAG AA/AAA, navigare cu tastatura, focus vizibil, `prefers-reduced-motion`, stiluri de print.

## Publicare pe GitHub Pages

`.github/workflows/pages.yml` publică tot conținutul la fiecare push pe `main`.
Prima dată trebuie activat manual, din interfața GitHub:

**Settings → Pages → Source → „GitHub Actions"**

După activare, site-ul apare la `https://ionutbaban7-bit.github.io/coaching-path/`.

## Deploy pe Render

Repo-ul funcționează în **ambele** regimuri Render: Web Service și Static Site.
`server.js` (zero dependențe) + `package.json` fac ca și varianta Web Service să pornească
fără nicio configurare suplimentară.

După merge-ul PR-ului în `main`, schimbă `branch` în `main` în `render.yaml`.

### Varianta A — Web Service (implicit în `render.yaml`)

| Câmp | Valoare |
|------|---------|
| Type | **Web Service** |
| Runtime | **Node** |
| Repository | `ionutbaban7-bit/coaching-path` |
| Branch | `arena/01a09f1d-coaching-path` |
| Region | Frankfurt (cel mai aproape de România) |
| Build Command | `npm install --omit=dev` |
| Start Command | `node server.js` |
| Health Check Path | `/` |
| Auto-Deploy | **Yes** |

Nu trebuie variabile de mediu, nu trebuie bază de date, nu există dependențe npm.

### Varianta B — Static Site (fără server, fără spin-down)

| Câmp | Valoare |
|------|---------|
| Type | **Static Site** |
| Branch | `arena/01a09f1d-coaching-path` |
| Build Command | *lasă gol* |
| Publish Directory | `.` (rădăcina) |
| Auto-Deploy | **Yes** |

În această variantă `server.js` e ignorat — Render servește fișierele direct.

### Rute disponibile

`/` · `/teorie.html` · `/individual.html` · `/echipa.html` · `/legal.html`
Plus variantele scurte: `/teorie` · `/individual` · `/echipa` · `/legal` (când rulezi prin `server.js`).

Paginile personalizate de eroare (`404.html`) se servesc automat pe rutele inexistente.

> Workflow-ul pentru **GitHub Pages** (`.github/workflows/pages.yml`) rămâne configurat
> și nu interferează cu Render — le poți folosi pe oricare, sau pe ambele.

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

### Audit complet (fără npm, fără dependențe)

`python3 tools/audit.py` verifică dintr-o singură mișcare: structura HTML a tuturor paginilor,
legăturile și resursele lipsă, ID-urile duplicate, paritatea traducerilor RO/EN, benziile de
verificare, scripturile incluse, sintaxa JS și fișierele de deploy.

## Note

> Instrument educativ independent, neafiliat ICF / EMCC / ANC sau vreunei școli de coaching.
> Datele sunt actualizate la 14 septembrie 2026 și au caracter orientativ: orele, taxele, examenele și
> perioadele de revizuire se modifică (vezi schimbările anunțate pentru noiembrie 2026 și ianuarie–aprilie
> 2027). Înainte de orice înscriere, verifică pe sursele oficiale listate în aplicație.

Planul complet de refacere a interfeței, în 7 pași, cu problemele găsite și soluțiile aplicate:
[`IMBUNATATIRI_7_PASI.md`](IMBUNATATIRI_7_PASI.md).
