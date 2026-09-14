# Raport de punere în producție — Coaching Learning Path

**Versiune:** 1.6.0 · **Data:** 14 septembrie 2026 · **Serviciu:** site public static (HTML/CSS/JS)
**Tip schimbare:** normală (feature + corecții), fără întrerupere de serviciu
**Verdict:** 🟢 **GO** — se publică, cu urmărirea punctelor din §10

---

## 1. Rezumat

Se pun în producție două schimbări consecutive, ambele cerute de beneficiar:

| Versiune | Ce aduce | Stare |
|---|---|---|
| 1.5.0 | Versiunea de telefon (Android + iOS): zoom la focus, ținte de atingere, meniu mobil, zone sigure, `dvh`, igienă tactilă, PWA | 🟢 în producție |
| 1.6.0 | Harta devine un **drum cu 8 opriri** (popup per oprire, bicicleta arată unde ești, închizi și pedalezi mai departe) + QA de producție ITIL | 🟢 în producție |

Nu se schimbă infrastructura, nu se adaugă dependențe, nu se modifică structura de adrese.
Publicarea se face prin push în `main` (Render Blueprint / GitHub Pages), ambele servicii servind
același conținut static.

## 2. Încadrare ITIL 4

| Practică | Cum se aplică aici |
|---|---|
| **Change enablement** | Schimbare normală, documentată în acest raport + `CHANGELOG.md`; impact evaluat în §4 |
| **Service validation & testing** | Poarta de calitate din §5 (6 suite automate + audit de producție `qa:itil`) |
| **Release management** | Versiune unică în tot sistemul (1.6.0) + cache-busting pe fiecare activ |
| **Deployment management** | Static, atomic (artefact imutabil), fără migrare de date |
| **Incident management** | Canal public de raportare („Raportează o greșeală”), plan de revenire în §7 |
| **Continual improvement** | KPI în §9, revizuire de conținut programată (§10) |
| **IT asset & configuration management** | Fără secrete, fără dependențe de runtime, configurația de hosting în `render.yaml` |

Dimensiunile ITIL 4 acoperite: **organizație și oameni** (roluri, documentație, canal de raportare),
**informație și tehnologie** (versiuni, cache, accesibilitate, bugete), **parteneri și furnizori**
(Render/GitHub Pages, zero dependențe), **fluxuri de valoare și procese** (check → merge → deploy).

## 3. Ce intră în producție

**Funcțional (1.6.0)**
- Harta de pe prima pagină devine un drum cu 8 opriri: șosea desenată, marcaj „Ești aici”, bifă pe
  opririle parcurse, bară de călătorie («Oprirea X din 8», puncte de navigare, ← Înapoi /
  Pedalează mai departe →).
- Fiecare oprire se deschide ca **dialog** (⌘ popup): ce este, de ce contează, repere concrete, ce să
  reții, legături mai departe, „🚲 Am înțeles — pedalează mai departe”.
- Poziția bicicletei și opririle parcurse se salvează local (`cp_map_bike`, `cp_map_done`), deci
  drumul se reia de unde ai rămas.
- Titlul secțiunii devine „Ești nou în coaching?” (RO/EN), cu subtitlul care explică mecanismul.

**Funcțional (1.5.0, deja publicat)**
- Traseul ghidat „Începe aici” cu link direct către orice pas, bară fixă de progres pe telefon,
  anunțuri offline / versiune nouă, instalare ca aplicație (PWA).

**Tehnic**
- Versiune unică 1.6.0 în `package.json`, `sw.js` (`clp-v1.6.0`), toate paginile și `render.yaml`.
- Cache-busting complet: 77 de referințe locale de active, toate versionate (`?v=1.6.0`).
- Zero dependențe de runtime (devDependency: `jsdom`, folosit doar de QA).

## 4. Impact și risc

| Aspect | Evaluare | Măsură |
|---|---|---|
| Utilizatori | Mediu — prima pagină se schimbă vizual (drumul) | Testat pe mobil și desktop; interacțiunea veche (card + panou) rămâne familiară ca structură |
| Conținut | Mic — texte noi doar în titlu/subtitlu și în popup | Paritate RO/EN verificată automat (1066 chei) |
| Tehnologie | Mic — CSS/JS locale, fără API-uri | Fără dependențe; `npm run check` garantează referințele |
| Accesibilitate | Mic — dialog cu `role="dialog"`, focus gestionat, Escape, contrast AA | Verificat în `qa` (51 de verificări pe prima pagină) |
| Performanță | Mic — CSS 102 KB, JS 328 KB brute (comprimate ~4×) | Bugete măsurate automat în `qa:itil` |
| Risc rezidual | **Mic** | Revenire în < 5 minute (§7) |

## 5. Dovada testelor (înainte de publicare)

```
npm run check       ✓  sintaxă, 26 referințe, paritate RO/EN, versiuni consecvente
npm run qa          ✓  0 probleme pe 7 pagini (51 de verificări pe index, inclusiv drumul cu bicicleta)
npm run qa:start    ✓  48/48 (traseul ghidat: quiz, XP, linkuri directe, bară mobilă)
npm run qa:css      ✓  0 clase/variabile CSS nedefinite
npm run qa:contrast ✓  toate perechile text/fundal ≥ 4.5:1 (ambele teme)
npm run qa:mobile   ✓  54/54 (viewport, zone sigure, ținte de atingere, meniu, PWA, popup)
npm run qa:itil     ✓  audit de producție pe cele 4 dimensiuni ITIL + verdict GO/NO-GO
```

Testare manuală (checklist de acceptare): interacțiune completă pe drumul cu bicicleta (deschidere
oprire → citire → închidere → pedalare), mesajul de final după a 8-a oprire, reluarea drumului după
reîncărcare, comutarea RO↔EN cu popup-ul deschis, tastatură (Tab/Escape) și modul întunecat.

## 6. Plan de implementare

1. **T-0:** merge PR #2 în `main` (conține tot istoricul: 1.3.0, 1.4.0, 1.5.0, 1.6.0).
2. Render redeployează automat (Blueprint static, `autoDeployTrigger: commit`); GitHub Pages rulează
   `node tools/check-site.mjs` înainte de publicare și nu publică un site rupt.
3. **Verificare după deploy (5 minute):** 200 pe `/`, `/incepe`, `/teorie`, `/individual`, `/echipa`,
   `/legal`; `?v=1.6.0` în HTML; `sw.js` servit cu `no-cache`; drumul cu bicicleta funcțional.
4. Confirmarea se face în PR (comentariu cu rezultatul verificărilor), nu prin modificări directe în producție.

## 7. Plan de revenire (rollback)

| Scenariu | Acțiune | Timp |
|---|---|---|
| Regresie vizuală/funcțională | `git revert <commit>` pe `main` → push → Render/GitHub recitesc | < 5 min |
| Problemă de cache la utilizatori | urcarea versiunii (`?v=` + `CACHE_VERSION`) forțează reîncărcarea activelor | < 5 min |
| Serviciu de hosting indisponibil | site 100% static: se publică identic pe al doilea furnizor (GitHub Pages / orice server de fișiere) | < 15 min |
| Problemă de conținut (informație greșită) | corecție de text + urcare de versiune (fără atingerea structurii) | < 30 min |

Nu există date de utilizator pe server (progresul stă în `localStorage`), deci revenirea nu implică
migrații și nu pierde date.

## 8. Hiper-îngrijire (24–72 h după lansare)

| Interval | Ce verificăm | Cine | Escaladare |
|---|---|---|---|
| 0–2 h | rute 200, consolă fără erori, drumul cu bicicleta pe iOS + Android | echipa de lansare | revenire imediată (§7) |
| 2–24 h | rapoarte de eroare primite, cache-ul service worker-ului la utilizatorii care revin | echipa de lansare | corecție + versiune nouă |
| 24–72 h | comportament pe ecrane mici (<=360 px), texte RO/EN, accesibilitate | echipa de lansare | intrare în lista de îmbunătățiri |

## 9. KPI de măsurare (după lansare)

- **Disponibilitate:** 100 % (hosting static, fără spin-down, fără proces care adoarme).
- **Timp de încărcare:** primul afișaj < 2,5 s pe 4G (buget: HTML < 90 KB, total comprimat < 250 KB).
- **Erori raportate:** 0 erori blocante; orice raportare se rezolvă în ≤ 72 h.
- **Traseul de învățare:** proporția vizitatorilor care deschid cel puțin 3 dintre cele 8 opriri.
- **Conversie spre traseul ghidat:** click-uri pe „Începe aici” din primul ecran.
- **Accesibilitate:** 0 regresii la `qa:contrast` (prag AA) și la auditul de mobil (54 de verificări).

## 10. Riscuri cunoscute și acțiuni de urmărire

1. **Canonical / `og:image` indică domeniul GitHub Pages.** Dacă producția se mută pe Render (sau pe
   domeniu propriu), se actualizează într-un singur loc per pagină (7 fișiere) — schimbare de conținut,
   fără risc tehnic. **Urmărire: la stabilirea domeniului final.**
2. **Fără teste pe browser real în mediu de construcție.** Testarea automată se face în jsdom + audit
   static; testarea vizuală pe iOS/Android rămâne manuală (checklist în §5). **Urmărire: la fiecare lansare.**
3. **Registru de erori închis („Raportează o greșeală”).** Nu există monitorizare automată a erorilor;
   semnalările vin de la utilizatori. **Urmărire: se evaluează un serviciu de monitorizare fără cookies.**
4. **Conținut marcat „de completat”** în pagina de echipă (rânduri marcate amber). Nu blochează
   lansarea; face obiectul unei revizuiri editoriale. **Urmărire: revizuire trimestrială.**

## 11. Criterii de acceptare

- [x] Toate cele 6 porți de calitate trec (check, qa, qa:start, qa:css, qa:contrast, qa:mobile)
- [x] Audit de producție ITIL fără puncte blocante (`npm run qa:itil` → GO)
- [x] Versiune unică 1.6.0 în cod, cache și pagini
- [x] Paritate RO/EN completă, contrast AA, fără resurse externe, fără trackere
- [x] Plan de revenire testat logic (site static, fără date pe server)
- [x] Canal public de raportare a erorilor

**Decizie: GO.** Publicarea se face din branch-ul de lucru (`arena/01a0a041-coaching-path`) prin merge
în `main`; după merge, Render publică automat, iar verificarea de 5 minute din §6 confirmă lansarea.
