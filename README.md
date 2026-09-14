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
index.html · teorie.html · individual.html · echipa.html
assets/
  css/tokens.css   → design tokens (culoare, spațiere, tipografie, dark mode)
  css/app.css      → componente (nav, hartă, carduri, stepper, tabele, modal, footer)
  css/pages.css    → pagini de conținut (cuprins, matrice, timeline, planuri, print)
  js/data.js       → toate datele, bilingv RO/EN (organisme, pathuri, credențiale, școli)
  js/app.js        → logica aplicației
  js/site.js       → temă, limbă, nav, scroll-spy, animații la scroll
  js/map.js        → harta interactivă
  img/             → favicon, copertă socială, ilustrații
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

## Deploy pe Render (site static, fără build)

Proiectul e 100% static: HTML, CSS și JS, fără npm, fără build. Pe Render se publică direct.

**Varianta 1 — Blueprint (din `render.yaml`, setările vin gata făcute)**
1. Render → **New → Blueprint**
2. Conectezi repo-ul `ionutbaban7-bit/coaching-path`
3. Render citește `render.yaml` și creează serviciul automat

**Varianta 2 — manual**
| Câmp | Valoare |
|------|---------|
| Type | **Static Site** |
| Repository | `ionutbaban7-bit/coaching-path` |
| Branch | `arena/01a09f1d-coaching-path` (după merge la PR #1 → `main`) |
| Build Command | *lasă gol* |
| Publish Directory | `.` (rădăcina) |
| Auto-Deploy | **Yes** |

Pagina de eroare personalizată (`404.html`) se servește automat pe rutele inexistente.

> Notă: workflow-ul pentru **GitHub Pages** (`.github/workflows/pages.yml`) rămâne configurat
> și nu interferează cu Render — poți folosi oricare dintre ele, sau ambele.

## Note

> Instrument educativ independent, neafiliat ICF / EMCC / ANC sau vreunei școli de coaching.
> Datele sunt actualizate la 14 septembrie 2026 și au caracter orientativ: orele, taxele, examenele și
> perioadele de revizuire se modifică (vezi schimbările anunțate pentru noiembrie 2026 și ianuarie–aprilie
> 2027). Înainte de orice înscriere, verifică pe sursele oficiale listate în aplicație.

Planul complet de refacere a interfeței, în 7 pași, cu problemele găsite și soluțiile aplicate:
[`IMBUNATATIRI_7_PASI.md`](IMBUNATATIRI_7_PASI.md).
