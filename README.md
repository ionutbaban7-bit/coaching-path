# Coaching Path — Learning & Certification Paths (RO/EN)

Aplicație web, complet autonomă (un singur fișier: `index.html`, fără internet, fără cont),
care hărțuiește clar certificările de coaching relevante în România:

- **ICF** — ACC, PCC, MCC, ACTC, MCS (Mentor Coach Specialization), Level 1/2/3, CCE
- **EMCC** — EIA (Foundation, Practitioner, Senior Practitioner, Master Practitioner), ITCA, ESIA, EQA
- **România / ANC** — Specialist în activitatea de coaching (COR 242412), Formator (COR 242401), Mentor (COR 235902)

### Ce conține
1. **Learning paths** interactive, cu pași care se bifează (progres salvat local): traseul ICF, EMCC și ANC.
2. **Treceri între sisteme** (bridge paths): ANC → ICF ACC, ACC → PCC, PCC → MCC, ICF ↔ EMCC,
   devenirea ca mentor coach (MCS), supervizor (ESIA), team coach (ACTC/ITCA), formator (242401).
3. **Bibliotecă de certificări** cu cerințe, tipul evaluării, documente, taxe, durată, reînnoire.
4. **Director de școli din România** (31 de intrări) cu badge-uri de acreditare ICF/EMCC/ANC,
   limbă de livrare și buton de verificare live a recenziilor Google.
5. **Exemplu concret de parcurs** (0 → PCC/MCC), **costuri orientative**, **FAQ + glosar**, **surse oficiale**.
6. Comutator **RO / EN** (tot conținutul e tradus).

### Actualizări critice incluse (stare la 14 septembrie 2026)
- 10 nov 2026: noul examen ICF PCC/MCC — 80 itemi / 150 min, bazat pe competențele și codul etic 2025;
  examenul actual (78 scenarii / 180 min) rămâne disponibil până la 31 mar 2027.
- 1 ian 2027: orele noi de mentor coaching trebuie livrate de un coach cu MCS.
- În România: Ord. 2228/3025/2023 (autorizare coordonată de MMSS / comisii județene, valabilitate 4 ani);
  standard ocupațional coach 2024–2034, COR 242412.

### Deschidere
Dublu-click pe `index.html` (merge și offline) sau servește directorul cu orice server static:

```bash
python3 -m http.server 8000   # apoi deschide http://localhost:8000
```

### Publicare pe GitHub Pages
Workflow-ul `.github/workflows/pages.yml` publică automat tot conținutul la fiecare push pe `main`.
Prima dată trebuie activat manual, din interfața GitHub:

**Settings → Pages → Source → „GitHub Actions"**

După activare, orice push pe `main` rulează workflow-ul și site-ul apare la
`https://ionutbaban7-bit.github.io/coaching-path/`.

> Instrument educativ independent, neafiliat ICF/EMCC/ANC. Verifică mereu datele pe sursele oficiale
> listate în aplicație (ICF Education Search, EMCC directory, portalul ANC/MMSS).
