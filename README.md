# coachinghub.ro — Hub de coaching v4

**Din pasiune pentru profesionalism. Pentru profesioniștii în coaching.**

Un hub educațional independent, în română și engleză, pentru cei care descoperă coachingul, practicieni și oameni care vor să lucreze mai atent cu conversațiile lor. Site-ul este pregătit pentru [coachinghub.ro](https://coachinghub.ro/); repo-ul rămâne [coaching-path](https://github.com/ionutbaban7-bit/coaching-path).

## Experiența de învățare

| Zonă | Conținut și interacțiuni |
| --- | --- |
| Hub / Paths | Learning path, practical path, professional path, Biblia începătorului și roadmap ANC → ACC → PCC → MCC |
| Prima pagină | Intrări după intenție, căutare pe teme, reluarea progresului și întrebare de practică |
| Descoperă | Definiție, istoric, aplicații, diferențe față de alte profesii și anatomia unei sesiuni |
| Competențe | Cele 8 competențe ICF: explicație, exemplu, capcană, exercițiu și reflecție |
| Practică | Atelier pe competențe, jurnal salvat local, progres și export text |
| Povești | 4 situații fictive, cu 3 variante de răspuns și feedback contextual fiecare |
| Întrebări | 24 de întrebări originale, căutare, filtre, favorite și exercițiu de reformulare |
| Greșeli | 8 greșeli reparabile și 4 semnale serioase de alarmă, cu explicații și alternative |
| Certificare | Repere ICF/EMCC/ANC, distincția program–certificat–credențială și surse oficiale |
| Bibliotecă | 14 resurse selectate, inclusiv 6 cărți, documentație, cercetare și bloguri |
| Începe aici | 10 pași cu verificarea înțelegerii și un plan de învățare adaptat interesului |
| Școli | Director orientativ cu 31 de intrări, căutare, filtre, paginare și comparație |
| Forum | Subiecte și articole bilingve, categorii, căutare, răspunsuri și fallback local fără cont |

Articolele de teorie, coaching individual și coaching de echipă sunt accesibile separat. Secțiunea de costuri a fost eliminată; adresele vechi redirecționează către certificare.

## Pornire și verificare

Node.js 18+ pentru server; pentru instalarea instrumentelor QA folosește o versiune acceptată de jsdom 30 (de exemplu Node.js 24).

```bash
npm ci
npm run build        # regenerează paginile statice din sursele editoriale
npm start            # http://localhost:3000
```

Verificările curente pentru v4:

```bash
npm run check        # sintaxă, fișiere locale, traduceri, versiuni
npm run qa           # pagini, interacțiuni, persistență și cazuri de eroare
npm run qa:server    # server, rute, cache, redirecționări și traseul ghidat
npm run qa:polish    # feedback, print/PDF, SEO și accesibilitate de bază
npm run qa:mobile    # verificări statice pentru Android/iOS
npm run qa:css       # clase și variabile CSS folosite
```

`qa:polish` are nevoie de serverul local pornit (`npm start`) într-un terminal separat. Testele DOM și verificările regulilor CSS nu înlocuiesc testarea vizuală pe dispozitive sau un audit complet de accesibilitate.

## Unde se editează

- `tools/build-academy.mjs`: structura și articolele paginilor, antetul și subsolul comun. Rulează build după modificare și publică și HTML-ul generat.
- `assets/js/academy-data.js`: competențe, povești, întrebări, greșeli și resurse, în RO/EN.
- `assets/js/academy.js`: căutare, filtre, favorite, atelier și jurnal.
- `assets/js/start-content.js` și `assets/js/start.js`: conținutul și comportamentul celor 10 pași.
- `assets/js/school-data.js` și `assets/js/atlas.js`: directorul de școli și comparația.
- `assets/js/site.js`: limbă, temă, navigare și comportamente comune.
- `assets/css/academy.css`: noua identitate vizuală și adaptarea la ecrane mici, peste stilurile comune existente.
- `hub.html`, `assets/js/hub.js`, `assets/css/hub.css`: paths, Biblia începătorului, roadmap și checklist-ul practic salvat local.
- `forum.html`, `assets/js/forum.js`, `data/forum.json`: forumul bilingv, fallback local și subiectele de pornire.
- `server.js`, `render.yaml`, `sw.js`: găzduire Node, API forum, rute și cache offline.

Fișierele istorice `data.js`, `app.js`, `map.js` și `plan.js` sunt păstrate în repository, dar nu mai sunt încărcate de paginile publice v4. Conținutul lor nu este o sursă editorială curentă.

## Date locale și limite

Nu există cont, autentificare sau tracking. Preferințele, favoritele, progresul și reflecțiile sunt păstrate în browser. Jurnalul se salvează la cerere, se exportă ca text și poate fi șters separat de favorite. Dacă stocarea nu este disponibilă, interfața explică situația. Nu introduce date personale despre clienți.

Forumul funcționează local fără cont pe hosting static. Când este servit de `server.js`, subiectele și răspunsurile sunt trimise la API și scrise în `data/forum.json`; implementarea nu are încă autentificare, moderare sau bază de date persistentă.

Progresul traseului v2 se păstrează; răspunsurile la vechile quizuri se resetează deoarece întrebările s-au schimbat. Fonturile și imaginile sunt locale. Cache-ul offline devine disponibil după o vizită online reușită; linkurile externe necesită internet.

Exemplele și exercițiile sunt originale și independente de organismele profesionale. Nu acordă o certificare. Directorul de școli este orientativ: verifică statutul programului în registrul oficial înainte de înscriere. Cerințele profesionale se confirmă întotdeauna la sursa oficială.

Sursele și informațiile volatile sunt revizuite trimestrial și după schimbări oficiale anunțate de organismele relevante; data verificării este afișată în aplicație.

## Publicare

Render urmărește `main` printr-un Web Service Node și rulează `node server.js`; un commit pe `main` declanșează publicarea dacă Auto Deploy este activ. `GET /api/forum`, `POST /api/forum` și `POST /api/forum/:id/replies` folosesc momentan `data/forum.json` (sau calea din `FORUM_DATA_FILE`). Pe hosting static forumul rămâne funcțional local, în browser.

Pentru un forum public de producție, următorul increment este autentificare, moderare și stocare persistentă externă; filesystem-ul unui serviciu gratuit nu trebuie tratat ca bază de date durabilă. Domeniul `coachinghub.ro` trebuie mapat separat în Render și în DNS.

Vezi [analiza v4](REVIEW_COACHINGHUB_V4.md), [planul v3](PLAN_ACADEMY_V3.md), [raportul editorial și QA](REVIEW_CONTENT_V3.md) și [istoricul](CHANGELOG.md).
