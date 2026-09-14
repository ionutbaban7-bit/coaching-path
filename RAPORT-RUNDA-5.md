# Runda 5 — audit „la sânge”, finisaj de produs, QA de experiență

**Versiune livrată:** v1.7.0 · **Commit:** `a7e3324` · **PR:** #2 (open, mergeable)
**Data:** 14 septembrie 2026 · **Verdict de producție:** 🟢 GO (ITIL 50/50, 0 blocante, 0 condiții)

---

## 1. Cum a fost testat (echipa de 100 de coachi MCC)

Fiecare funcționalitate a fost exercitată, nu doar citită:

| Zonă testată | Cum | Rezultat |
|---|---|---|
| Toate cele 7 pagini | încărcate în jsdom: erori de script, randare, paritate RO/EN | 0 erori |
| Harta-drum (8 opriri) | click pe oprire, popup, închidere, „pedalează mai departe”, reluare după refresh | funcțional |
| Traseul „Începe aici” | calibrare, 10 pași, quiz, XP, insigne, plan, persistență, EN | 48/48 |
| Credențiale, școli, costuri, FAQ, glosar | filtre, căutări, modale, linkuri externe | funcțional |
| Planuri 1:1 și de echipă | tabele late pe telefon, indiciu de derulare, tipărire | funcțional |
| Mobil (Android + iOS) | viewport, zone sigure, ținte de atingere, meniu, popup ca bottom sheet | 54/54 |
| Accesibilitate | nume accesibile, `scope` în tabele, titluri, contrast AA | reparat unde lipsea |
| Producție (ITIL 4) | 50 de criterii: schimbare, disponibilitate, securitate, riscuri, KPI | 🟢 GO |

---

## 2. Lista „la sânge” — ce era în neregulă

1. **Cel mai grav:** textul din pagină (varianta care se vede fără JavaScript) **diferea de dicționarul RO pe 10 locuri**, inclusiv introducerea principală — la comutarea limbii conținutul se schimba.
2. Copy prea lung: paragrafe de 240–311 caractere, subtitluri de 199–205 caractere, lead-uri de 345.
3. **Zero date structurate** pe tot siteul — invizibil pentru motoare de căutare și asistenți.
4. Progresul salvat era vizibil doar în pagina traseului și în hartă; în rest, utilizatorul care revenea nu vedea unde a rămas.
5. **Niciun canal de feedback** pe secțiuni — nu se putea afla ce nu e clar.
6. **18 tabele fără nume accesibil** și **81 de celule de titlu fără `scope`** — cititoarele de ecran nu anunțau despre ce e tabelul.
7. Căutările (școli, glosar, certificări, banca de întrebări) nu aveau nume accesibil și nu spuneau câte rezultate au.
8. Lipsea un buton de printare, deși paginile de conținut se citesc pe hârtie (coachi care dau materiale clienților).
9. Tipărirea rupea titluri, rânduri de tabel și carduri la mijloc de pagină.
10. Nu exista nicio poartă automată pentru text și date structurate — regresia era inevitabilă.
11. Versiunea activelor trebuia urcată consecvent (93 de referințe + cache-ul service worker).
12. Conținutul marcat „✍️ De populat” din planuri rămâne cel mai mare gol de conținut.

---

## 3. Top 15 update-uri

### Livrate în v1.7.0

| # | Update | Stare |
|---|---|---|
| 1 | Text rescris scurt pe tot siteul (lead-uri, subtitluri, note) cu bugete verificate automat (lead ≤ 240, subtitlu ≤ 180) | ✅ |
| 2 | Sincronizarea text-pagină ↔ dicționar bilingv: 10 divergențe reparate, test care blochează regresia | ✅ |
| 3 | Date structurate schema.org: `WebSite` + `EducationalOrganization`, `LearningResource`, `Article` | ✅ |
| 4 | Insigna de progres în antet („🎯 4/10 Traseu”, „3/8 Hartă”), bilingvă, cu legătură directă la pasul următor | ✅ |
| 5 | „A fost util?” la finalul fiecărei secțiuni — local, fără trackere, cu stare salvată | ✅ |
| 6 | Buton „🖨️ Printează / PDF” + tipărire fără ruperi la titluri, tabele, carduri | ✅ |
| 7 | Căutări cu nume accesibil și anunț de rezultate („7 rezultate” / „Niciun rezultat”) | ✅ |
| 8 | Tabele accesibile: nume pentru toate cele 18, `scope` pe cele 81 de celule de titlu | ✅ |
| 9 | Insigna are țintă de atingere de 44px pe touch și etichetă completă pentru cititoarele de ecran | ✅ |
| 10 | Poartă nouă `npm run qa:polish` (36 de verificări de finisaj), integrată în verdictul de producție | ✅ |
| 11 | Versiune unificată v1.7.0: 93 de referințe de active, `sw.js`, `package.json`, banner server | ✅ |
| 12 | Documentație la zi: `CHANGELOG`, `README`, `qa-tools/README`, raport ITIL regenerat | ✅ |

### Propuse pentru runda următoare (spuse cinstit, nu sunt făcute)

| # | Update | De ce |
|---|---|---|
| 13 | Popularea conținutului marcat „✍️ De populat” din `individual.html` și `echipa.html` | Cel mai mare gol rămas: structura e gata, conținutul detaliat lipsește |
| 14 | `FAQPage` + `HowTo` structurate și imagini sociale (OG) per pagină | Crește vizibilitatea în rezultatele îmbogățite |
| 15 | Testare în browsere reale (Playwright) și monitorizarea KPI după lansare | Acum testarea e în jsdom; browserul real prinde altceva |

---

## 4. QA de experiență — 5 îmbunătățiri de top (livrate)

1. **Progresul e mereu la vedere și acționabil** — insigna din antet arată „4/10 Traseu” sau „3/8 Hartă”, se actualizează instant la fiecare bifă, e tradusă și duce exact la pasul următor. Pe touch are 44px.
2. **Căutările răspund imediat** — „7 rezultate” / „Niciun rezultat”, anunțat și pentru cititoarele de ecran, cu nume accesibil pe fiecare câmp.
3. **Tabelele se pot citi cu vocea** — nume pentru fiecare tabel și `scope` pe celulele de titlu: cititorul de ecran spune „coloana Cerințe, rândul PCC”.
4. **Materialele se tipăresc curat** — buton dedicat pe paginile de conținut, fără ruperi la mijloc de tabel sau card; util pentru coachi care predau materiale.
5. **Feedback discret, fără trackere** — „A fost util?” la finalul fiecărei secțiuni; alegerea se salvează local, iar butoanele au stare și etichetă corectă.

---

## 5. Verificări finale

```
npm run check      ✓  totul în regulă (referințe, paritate RO/EN, versiuni)
npm run qa         ✓  0 probleme (toate paginile, hartă, mobil, offline)
npm run qa:start   ✓  48/48 (traseul „Începe aici”)
npm run qa:css     ✓  (zgomot cunoscut: id-uri create din JS)
npm run qa:contrast ✓  AA în ambele teme
npm run qa:mobile  ✓  54/54
npm run qa:polish  ✓  36/36  ← poartă nouă
npm run qa:itil    ✓  50/50 · blocante 0 · condiții 0 · 🟢 GO
```

Bugete: pagina 72 KB · CSS 104 KB · JS 346 KB · 214 KB comprimat (sub pragul de 250 KB).

---

## 6. GitHub

- Branch: `arena/01a0a041-coaching-path` → commit **`a7e3324`** (pushed, `b04d5b4..a7e3324`).
- PR **#2**: OPEN · MERGEABLE · titlu și descriere actualizate cu runda 5.
- `origin/main` rămâne `5cb5a03`; publicarea pe Render se face după merge.
