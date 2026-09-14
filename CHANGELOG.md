# Changelog

Toate modificările notabile ale proiectului sunt documentate aici.
Format bazat pe [Keep a Changelog](https://keepachangelog.com/) · versiuni [SemVer](https://semver.org/).

Data de verificare a conținutului: **14 septembrie 2026**.
Pentru a raporta o informație greșită: butonul „Raportează o greșeală” de pe orice secțiune
sau [direct pe GitHub](https://github.com/ionutbaban7-bit/coaching-path/issues/new?labels=corectie).

---

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
