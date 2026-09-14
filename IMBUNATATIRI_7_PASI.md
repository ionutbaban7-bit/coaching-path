# Coaching Learning Path — îmbunătățiri în 7 pași

Audit de UI/UX, design și arhitectură, apoi implementare completă.
Data: 14 septembrie 2026 · branch: `arena/01a09f1d-coaching-path`

---

## Pasul 1 — Sistem de design (înlocuirea „designului de școală”)

**Problema găsită:** culori amestecate fără ierarhie (17 valori de gri/albastru diferite, aceeași nuanță scrisă în 4 feluri: `#33415c`, `#3a4a63`, `#475569`, `#4b5b75`), umbre incoerente, raze diferite pe elemente similare, niciun token, niciun mod întunecat. Orice modificare însemna să cauți și să înlocuiești manual zeci de valori.

**Ce s-a făcut:**
- `assets/css/tokens.css` — sursă unică de adevăr: 95 de variabile pentru culoare, spațiere (multipli de 4), scară tipografică fluidă (`clamp()`), raze, umbre stratificate, durate și curbe de easing.
- Paletă premium: indigo `#4b57d4` ca brand, teal `#0e9384` pentru „aplică”, crimson ICF `#d81b57`, albastru ANC `#2563eb`, chihlimbar pentru atenționări.
- **Mod întunecat complet** (`[data-theme="dark"]`), cu aceleași tokenuri reacordate pentru contrast: text `#eef2fb` pe `#121826` (14,8:1 — AAA), `muted` `#9fb0cc` (7,1:1 — AAA).
- Detectare automată a preferinței de sistem + buton de comutare + memorare în `localStorage` + script anti-flash înainte de primul paint.

**Rezultat:** schimbarea culorii brand-ului se face dintr-o singură linie; întunecatul nu e un „filtru”, ci o temă proiectată.

---

## Pasul 2 — Arhitectură modulară (era un singur fișier de 172 KB)

**Problema găsită:** totul într-un `index.html` de 1.509 linii — CSS, date, logică și markup înghesuite împreună. Orice editare risca să rupă altceva; nu exista separare între conținut și prezentare.

**Ce s-a făcut:**
```
index.html          → aplicația (hartă, pathuri, credite, școli, costuri, FAQ)
teorie.html         → teoria coachingului (10 secțiuni)
individual.html     → plan de coaching 1:1 (10 secțiuni)
echipa.html         → plan de coaching de echipă (10 secțiuni)
assets/css/tokens.css  → design tokens + reset + tipografie
assets/css/app.css     → componente (butoane, nav, hartă, carduri, tabele, modal)
assets/css/pages.css   → pagini de conținut (cuprins, matrice, timeline, planuri)
assets/js/data.js      → toate datele (RO/EN), 666 de linii, nemodificate
assets/js/app.js       → logica aplicației
assets/js/site.js      → temă, limbă, nav, scroll-spy, reveal, back-to-top
assets/js/map.js       → harta interactivă
assets/img/            → favicon, copertă socială, 3 ilustrații
```
Datele au fost extrase **mecanic**, nu rescrise: conținutul, traducerile și sursele au rămas intacte.

**Rezultat:** fișiere de 10–40 KB în loc de unul de 172 KB; partea de date e separată de partea de logică; putem lucra pe o pagină fără să atingem celelalte.

---

## Pasul 3 — Identitate: „Coaching Path” → „Coaching Learning Path”

**Problema găsită:** numele era generic, titlul meta optimizat pentru un singur public (oameni deja în industrie), nicio identitate vizuală (favicon lipsea, coperta de share lipsea).

**Ce s-a făcut:**
- Rebranding complet: logo cu semn de tip „busolă/țintă”, descriptor „Hartă · Teorie · Certificare”.
- `favicon.svg` + `favicon.png` (256 px), copertă socială `og-cover.png` (1200×630), meta OG + `theme-color` + `color-scheme`.
- Titluri și descrieri rescrise pentru publicul larg („dacă nu ai habar de coaching”), nu doar pentru coachi.
- Ilustrații generate pentru fiecare pagină de conținut, în aceeași paletă.

**Rezultat:** identitate recognoscibilă în browser, pe telefon (apple-touch-icon) și la distribuire pe rețele.

---

## Pasul 4 — Harta interactivă pentru cine pornește de la zero

**Problema găsită:** aplicația începea direct cu „cele 3 sisteme” — adică ICF/EMCC/ANC, un jargon de care un începător nu are nevoie în primele 30 de secunde. Nu exista un punct de intrare pentru omul care pur și simplu nu știe ce este coachingul.

**Ce s-a făcut:** secțiune nouă, imediat după hero — 8 opriri în ordinea firească a înțelegerii:

| # | Oprirea | Întrebarea la care răspunde |
|---|---------|------------------------------|
| 1 | Ce este, de fapt | Ce cumpăr? |
| 2 | Ce NU este | E terapie? Consultanță? |
| 3 | Unde se folosește | Pentru mine are sens? |
| 4 | Cum arată o sesiune | Ce se întâmplă concret? |
| 5 | Cum alegi | Cum nu o dau în bară? |
| 6 | Formarea | Cum devin coach? |
| 7 | Certificarea | Ce diplomă contează? |
| 8 | Practică și carieră | Trăiesc din asta? |

- Noduri așezate **șerpuitor** (4×2) cu conectori SVG calculați la runtime după pozițiile reale (se redesenază la resize).
- Fiecare nod deschide un panou cu „De ce contează”, „Repere concrete”, „De reținut” și legături directe spre secțiunea/pagina potrivită.
- Progres bifabil, salvat local (`0/8`), cu bifă ✓ pe nodurile parcurse.
- Butonul „Sunt la început” din hero duce direct la hartă și deschide prima oprire.

**Rezultat:** un om fără nicio legătură cu domeniul are un traseu clar de la zero la certificare, în 8 pași.

---

## Pasul 5 — Conținut nou: teorie și planuri de practică

**Ce s-a adăugat** (834 de texte bilingve RO/EN, 0 fără traducere):

**`teorie.html`** — 10 secțiuni: definiții (ICF/EMCC/ANC) · matrice de comparație pe 6 dimensiuni (coaching vs. terapie vs. mentoring vs. consultanță vs. training) · istoric pe timeline (1974 Gallwey → 1992 Whitmore/GROW & EMC → 1995 ICF → 2002 EMCC → 2013 COR 242412 → 2025 competențe → 2026/27 schimbări de examen) · 8 contexte de utilizare · anatomia sesiunii pe minute · 6 modele de lucru (GROW, TGROW, OSCAR, CLEAR, FUEL, co-activ) · cele 8 competențe ICF grupate · etică și limite · 6 mituri demontate · ce spune cercetarea (cu tabel de populat).

**`individual.html`** — plan 1:1: arhitectura programului (tabel de parametri) · cele 5 etape · structura unei ședințe minut cu minut · **bancă de întrebări populată: 64 de întrebări în 8 categorii, cu căutare, filtre și varianta „de evitat”** · plan de practică pe cele 8 competențe · instrumente și fișe · jurnal de ore (format care trece un audit) · rubrică de autoevaluare 0–3 · etică și riscuri · listă de stare.

**`echipa.html`** — plan de echipă: definiții și trei niveluri de lucru · diferențe față de facilitare/training/team building · când are sens și când NU (diagnostic diferențial) · 6 modele (Hawkins 5 discipline, Lencioni, Tuckman, GRPI, Hackman, Edmondson) · arhitectură pe 6 luni cu calendar · **4 ateliere cu design complet (obiectiv, durată, pași, materiale)** · **instrumente de diagnostic populate: grilă de interviu 1:1 (8 întrebări), chestionar 12 itemi × 4 dimensiuni, grilă de observație în 6 dimensiuni** · competențe ACTC/ITCA · metrici pe 4 niveluri Kirkpatrick · capcane · listă de stare.

**Rezultat:** cele două planuri nu sunt doar schele — au deja conținutul de bază populat (`assets/js/plan.js`, randat dinamic, bilingv):
64 de întrebări de coaching, 8 întrebări de interviu pentru diagnostic de echipă, chestionar de 12 itemi pe 4 dimensiuni, grilă de observație cu 6 dimensiuni și 4 ateliere complete cu 20 de pași. Rămân sloturile marcate vizual (`✍️ De populat`) pentru fișele printabile și studiile de caz.

---

## Pasul 6 — Accesibilitate, performanță și grafică

**Ce s-a făcut:**
- Contrast verificat: toate combinațiile text/fundal trec **WCAG AA**, majoritatea AAA (`--ink` 15,6:1, `--muted` 5,2:1 pe luminos; 14,8:1 și 7,1:1 pe întunecat).
- Focus vizibil pe orice element interactiv (`outline` 2 px + offset), `skip-link` pentru navigare cu tastatura, `aria-label`, `aria-expanded`, `aria-live`, `role="dialog"`.
- `prefers-reduced-motion`: toate animațiile și tranzițiile sunt dezactivate automat.
- Stiluri de **print** pentru paginile de conținut (fără header/nav, secțiuni care nu se rup între pagini).
- Imagini comprimate: **4,7 MB → 0,8 MB** (−83%) prin redimensionare și paletă de 64 de culori; ilustrațiile rămân „plate” și clare, tocmai stilul potrivit.
- Fără fonturi externe, fără CDN, fără tracking: funcționează **offline**, prin dublu-click.

**Rezultat:** accesibil, rapid, și în continuare complet autonom.

---

## Pasul 7 — Robustențe și calitate verificată

**Bug real găsit și reparat:** aplicația **crășa complet** (ecran parțial gol) dacă `localStorage` era blocat — caz frecvent la deschiderea directă din `file://` sau în modul privat. Toate accesările trec acum printr-un wrapper `LS.get/set/json` cu `try/catch`: fără stocare, aplicația funcționează mai departe, doar nu salvează progresul.

**Alte corecții:**
- `concurency` → `concurrency` în workflow-ul Pages (cheie scrisă greșit).
- Variabilă CSS `--oc` pentru culoarea de accent a cardurilor de organism (folosea doar fallback-ul).
- Eticheta butonului de pe hartă se actualiza doar aparent — acum panoul se re-randează după bifare.

**Verificări rulate (fără browser, prin jsdom):**

| Verificare | Rezultat |
|------------|----------|
| Erori JS la încărcare (4 pagini) | 0 |
| Structură HTML (taguri echilibrate) | 4/4 OK |
| Atribute duplicate | 0 |
| Variabile CSS nedefinite | 0 |
| Balanță acolade CSS (3 fișiere) | OK |
| Randare: 3 sisteme · 7 pași · 14 credite · 31 școli · 12 FAQ · 20 termeni glosar | ✔ |
| Harta: 8 noduri · panou · progres salvat | ✔ |
| Filtre: școli (bucurești 8, online 26) · credite (ICF 5, „PCC” 2) · glosar | ✔ |
| Comutare RO→EN (834 de texte) | ✔ |
| Temă dark/light | ✔ |
| Traduceri lipsă | 0 |

---

## Rămâne de făcut (în ordinea recomandată)

1. **Ce a mai rămas din planuri** — fișele de lucru printabile (PDF), markerii ACTC/ITCA (coloana 3 din tabelul de competențe), exercițiile pe competențe 1:1, studiile de caz și pachetul de metrici cu baseline. Structura și tabelele de stare sunt gata.
2. **Activare GitHub Pages** — Settings → Pages → Source → „GitHub Actions” (nu am putut face asta din linia de comandă: tokenul integrării are permisiuni limitate, `403 Resource not accessible by integration`).
3. **Conținut** — detaliile pe care le veți aduce voi (studii de caz, prețuri actualizate, școli noi).
