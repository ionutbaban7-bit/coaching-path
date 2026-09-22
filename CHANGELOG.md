# Changelog

Toate modificările notabile ale proiectului sunt documentate aici.
Format bazat pe [Keep a Changelog](https://keepachangelog.com/) · versiuni [SemVer](https://semver.org/).

Data de verificare a conținutului public: **22 septembrie 2026**.
Pentru corecții editoriale, consultă secțiunea „Corecții” din pagina Legal.

## [4.1.0] — 2026-09-22

### Modificat — coachinghub.ro, ediția editorială premium

- Antet refăcut cu siglă CH în stil sigiliu, tipografie serif și paletă ivory / forest / brass.
- Cardurile și componentele forumului, Paths și paginilor legacy trec la suprafețe calde, margini fine și ritm editorial.
- Site-ul rămâne site normal în browser: manifestul folosește `browser`, iar bara de instalare PWA a fost eliminată.

### Scos

- Linkurile publice către GitHub și raportarea directă în repository.
- Butoanele „Printează / PDF” și textele asociate.

---

## [4.0.0] — 2026-09-22

### Adăugat — coachinghub.ro ca hub de învățare și practică

- Rebranding complet din Coaching Learning Path în `coachinghub.ro`, cu navigare principală redusă la cinci intenții: explorează, paths, practică, forum și bibliotecă.
- Hub central cu trei trasee — Learning path, Practical path și Professional path — plus „Biblia începătorului”, roadmap de orientare ANC → ACC → PCC → MCC și checklist practic salvat local.
- Forum RO/EN pentru subiecte și articole, categorii, căutare, răspunsuri și seed topics. Pe static hosting există fallback local; serverul Node expune API file-backed pentru MVP.
- Server Render schimbat la Web Service Node pentru rutele `/api/forum`; rutele HTML vechi și redirectul `/costuri.html` sunt păstrate.
- Service worker, manifest, sitemap, canonical URLs, meta-uri iOS, theme-color light/dark și date structurate schema.org actualizate la v4.
- Feedback local „A fost util?”, print/PDF pentru paginile editoriale, căutare cu rezultat anunțat accesibil și îmbunătățiri pentru ecrane mici.

### Limite cunoscute

- Forumul nu are încă autentificare, moderare sau stocare persistentă externă. `data/forum.json` este potrivit pentru MVP/demo; următorul increment trebuie să folosească o bază de date și politici de moderare.
- `coachinghub.ro` trebuie mapat separat ca domeniu custom în Render și DNS; repo-ul pregătește canonical URLs și blueprint-ul de deploy, dar nu poate modifica DNS-ul.

### Verificat

- `npm run check`, `npm run qa`, `npm run qa:server`, `npm run qa:polish`, `npm run qa:mobile`, `npm run qa:css`.
- QA: 723 assertions academice, 84 assertions server, 36 polish și 54 mobile.

---

## [3.0.0] — 2026-09-16

- Refacere vizuală: identitate editorială crem/verde, două imagini originale, cinci destinații principale și interfețe adaptate ecranelor mici.
- Pagini de descoperire, cele opt competențe ICF explicate, patru povești interactive, 24 de întrebări și 12 situații despre greșeli și limite.
- Atelier pe competențe cu jurnal local, salvare explicită, progres, export și ștergere; favorite pentru întrebări și resurse.
- Bibliotecă de 14 resurse, inclusiv șase cărți, plus articole originale despre teorie, practică individuală și echipe.
- Rescrierea traseului în zece pași și a orientării profesionale; eliminarea costurilor și a promisiunilor de buget sau durată până la certificare.
- Surse oficiale ICF/EMCC/ANC, delimitarea formării de credențiale și etichetarea exemplelor fictive. Directorul de școli rămâne orientativ.
- Redirecționarea adreselor de costuri, cache v3, sitemap actualizat și reguli defensive pentru stocarea locală.
- Noi verificări QA pentru pagini, interacțiuni, migrarea progresului, stocare indisponibilă, rute, cache și export. Detalii și limite în `REVIEW_CONTENT_V3.md`.

## [1.7.0] — 2026-09-14

### Schimbat — text puțin, formulări clare (runda 5)
- Rescrise scurt: titlul de pe prima pagină, subtitlurile tuturor secțiunilor, introducerile
  paginilor și notele lungi. Aceeași informație, propoziții scurte, fără umplutură.
  Bugetele sunt verificate automat: lead ≤ 240 de caractere, subtitlu de secțiune ≤ 180.
- Textul din pagină (varianta care se vede fără JavaScript) era **diferit** de dicționarul RO
  pe 10 locuri, inclusiv la introducerea principală — sincronizat; testul nou îl blochează
  pe viitor, deci comutarea limbii nu mai poate schimba conținutul.

### Adăugat
- **Date structurate schema.org** (lipseau complet): `WebSite` + `EducationalOrganization` pe
  prima pagină, `LearningResource` pe traseul începătorului, `Article` pe teorie.
- **Insigna de progres în antet** — „🎯 4/10 Traseu” sau „🎯 3/8 Hartă”, în ambele limbi,
  actualizată imediat ce bifezi un pas sau o oprire; pe ecrane mici rămâne doar cifra.
- **„A fost util?” la finalul fiecărei secțiuni de conținut** — un semnal local, fără trackere
  și fără server, salvat în browser.
- **Buton „🖨️ Printează / PDF”** pe paginile de conținut; la tipărire dispar butonul, casetele
  de feedback și insigna de progres.

### UX și accesibilitate (verificate în QA)
- **Căutările au nume accesibil** (director de școli, glosar, certificări, banca de întrebări) și
  anunță câte rezultate au rămas: „7 rezultate” / „Niciun rezultat”, într-o zonă citită de
  cititoarele de ecran.
- **Tabelele** (18) au nume accesibil, iar cele 81 de celule de titlu au `scope` (coloană/rând).
- **Insigna de progres** are țintă de atingere de 44px pe touch și duce exact la pasul următor
  (`incepe.html#startSteps`), nu doar la pagina de start.
- **Tipărirea** nu mai rupe titlurile, rândurile de tabel sau cardurile la mijloc.

### Verificat
- Poartă nouă `npm run qa:polish` (36 de verificări): bugete de text, JSON-LD valid, insigna de
  progres în ambele limbi, feedback accesibil, declanșarea tipăririi, zero erori de script.
- Toate porțile rămân verzi: `check`, `qa`, `qa:start` 48/48, `qa:css`, `qa:contrast`,
  `qa:mobile` 54/54 și `qa:itil` cu verdict de producție.

## [1.6.0] — 2026-09-14

### Adăugat — harta e acum un drum cu bicicleta 🚲
- Titlul secțiunii de pe prima pagină devine **„Ești nou în coaching?”** (în engleză „New to
  coaching?”), iar subtitlul explică mecanismul: dai click pe o oprire, citești ce și cum, închizi
  fereastra și pedalezi mai departe. Aceeași voce și în introducerea teoriei.
- **Opt opriri pe un drum desenat** (șosea cu linie întreruptă de mijloc, care se animă când
  bicicleta pleacă), cu marcajul „Ești aici” pe oprirea curentă și bifă verde pe cele parcurse.
- **Popup pe fiecare oprire**, ca dialog accesibil (`role="dialog"`, `aria-modal`, titlu legat prin
  `aria-labelledby`): ce este, de ce contează, repere concrete, ce să reții, legături mai departe.
  Se închide cu ✕, cu butonul „Închide”, cu Escape sau cu click pe fundal; pagina nu se mai derulează
  sub el, iar focusul se întoarce exact pe cardul opririi.
- **Bara drumului**: „Oprirea X din 8”, punctele tuturor opririlor (bifate / curente), butoanele
  „← Înapoi” și „Pedalează mai departe →”. Butonul principal din popup („🚲 Am înțeles — pedalează
  mai departe”) bifează oprirea, închide fereastra și mută bicicleta la următoarea oprire nebifată,
  cu un mesaj care spune unde ai ajuns. Poziția bicicletei se salvează local (`cp_map_bike`), deci
  drumul se reia de unde ai rămas.
- Pe telefon popup-ul se deschide ca **bottom sheet** (80% din înălțime, colțuri rotunjite sus, spațiu
  pentru bara gestuală, derulare cu inerție în interior), iar punctele drumului au 44px la atingere.

### Adăugat — QA de producție în stil ITIL
- `npm run qa:itil` — verificare de punere în producție pe cele patru dimensiuni ITIL 4 (organizație
  și oameni, informație și tehnologie, parteneri și furnizori, fluxuri de valoare și procese),
  plus tranziția serviciului: gestiunea schimbării, release, capacitate, disponibilitate,
  continuitate, securitate, măsurare și îmbunătățire continuă. Verdict automat **GO / NO-GO**.
- `RAPORT-PRODUCTIE.md` — raportul de punere în producție: schimbarea (RFC), impact, dovada
  testelor, plan de implementare, plan de revenire (rollback), hiper-îngrijire 24–72 h, riscuri
  cunoscute și criterii de acceptare.

### Modificat
- Versiunea activelor urcă la `?v=1.6.0` (toate paginile + `package.json` + cache-ul service worker
  `clp-v1.6.0`).
- Auditul de mobil crește la **54 de verificări** (popup, bottom sheet, zone sigure, punctele
  drumului, blocarea derulării, mișcare redusă), iar `npm run qa` acoperă acum și drumul cu
  bicicleta: deschidere, focus, închidere, salvare, avans automat, butonul din bara drumului.

---

## [1.5.0] — 2026-09-14

### Adăugat — versiunea de telefon (Android + iOS)
- **Bara „Continuă de unde ai rămas”.** Sub antet apare o bară discretă care citește progresul salvat
  local și propune pasul următor concret: traseul „Începe aici” („ai ajuns la pasul 3 din 10”),
  harta („3 noduri parcurse”) sau planul („5 pași bifați”). Se închide cu un tap, își ține minte
  alegerea (`cp_resume_hidden`) și nu reapare pentru același pas. Ancorele țin cont de ea
  (`--scroll-offset`), deci titlurile nu mai ajung sub bară.
- **Instalare ca aplicație (PWA).** Pe Android/Chrome, `beforeinstallprompt` devine un buton
  „Instalează”; pe iPhone (unde Apple nu permite prompt programatic) bara arată instrucțiunea
  „Partajează → Adaugă la ecranul principal”. Iconița de ecran principal (`apple-touch-icon`) există
  acum pe toate paginile.
- **Link direct către orice pas.** Pasul deschis se scrie în adresă (`incepe.html#s7`), deci linkul poate
  fi trimis mai departe, iar butoanele Back/Forward ale browserului merg natural. Fiecare pas are un
  buton „🔗 Link către pas” care copiază adresa exactă.
- **Bară fixă de progres pe telefon.** Când calibrarea e făcută și mai sunt pași de parcurs, în josul
  ecranului apare „Pasul X din 10” cu bara de progres și butonul către pasul următor (dispare pe
  desktop, nu blochează butonul „sus” și nu acoperă finalul paginii).
- **Tabele late, citibile pe telefon.** Tabelele cu multe coloane derulează lateral cu inerție, au o
  umbră pe muchia din dreapta când mai e conținut, un indiciu „↔ glisează pentru restul coloanelor”
  și prima coloană lipită (numele școlii rămâne vizibil cât derulezi).
- **Anunțuri de aplicație.** „Ești offline — paginile deja vizitate merg din cache”, „Ai revenit
  online” și, când service worker-ul aduce o versiune nouă, „versiune nouă — Reîncarcă”.
- **Audit automat de mobil**: `npm run qa:mobile` (28 de verificări statice: viewport, meta-uri iOS,
  zone sigure, `dvh`, câmpuri de 16px, ținte de atingere, hover pe touch, meniu, bară, manifest,
  versiunea cache-ului). `qa.mjs` are în plus o secțiune **MOBIL** care testează meniul și bara
  „Continuă” în jsdom, cu progres injectat în `localStorage`.

### Reparat — ce se strica pe telefon
- **Zoom involuntar pe iPhone.** Câmpurile de căutare aveau ~14px; sub 16px iOS mărește pagina
  automat la focus și layoutul „sare”. Acum toate câmpurile au 16px pe ecrane mici, iar căutările au
  `type="search"` + `enterkeyhint="search"` (tastatură corectă și buton de „caută”).
- **Ținte de atingere prea mici.** Butoanele de iconiță (36px), închiderea modalului (32px), punctele
  de pas (30px) și bifa de pas (19px) erau sub pragul de 44px recomandat de Apple/Google. Toate au
  acum minim 44px (bifa are zonă de atingere extinsă prin padding), inclusiv linkurile mici din
  tabele și pastilele de filtru.
- **Meniu mobil incomplet.** Bloca derularea doar vizual: pagina de dedesubt se derula, iar meniul nu
  se închidea cu Escape sau la atingere în afară. Acum `html.nav-open` oprește derularea, Escape
  închide și readuce focusul pe buton, atingerea în afară închide, rotirea telefonului închide, iar
  butonul are `aria-controls`/`aria-haspopup`.
- **Hover „lipicios” pe touch.** Efectele de ridicare la hover (butoane, carduri, noduri de hartă)
  rămâneau active după tap. Sunt neutralizate în `@media (hover:none)`, iar în locul lor apare
  feedback la apăsare (`:active`) pe toate componentele atinse des.
- **`100vh` și zonele sigure.** Panoul de meniu și cuprinsul foloseau `100vh`, care pe telefon
  include bara browserului — conținutul putea ieși din ecran; acum au și variantă `100dvh`. Antetul
  respectă notch-ul, toastul și butonul „sus” stau deasupra barei de jos, modalul e încadrat în
  zonele sigure (`env(safe-area-inset-*)`), iar `.wrap` nu mai intră sub decupaj în landscape.
  Toate paginile au `viewport-fit=cover`.
- **Derulare „elastică” nedorită.** Panourile interioare (tabele, cuprins, meniu, modal) folosesc
  `overscroll-behavior: contain`, iar pe touch dispare întârzierea de 300 ms dublu-tap
  (`touch-action: manipulation`), fără să se blocheze zoom-ul cu două degete.
- **Antetul nu mai iese din ecran** pe telefoanele înguste: subtitlul logo-ului dispare sub 560px,
  butonul de limbă devine doar steag sub 420px, iar iconițele rămân de 44px.
- `overflow-x: clip` (unde e suportat) în loc de `hidden`, ca `position: sticky` să funcționeze corect.
- **Copierea planului merge acum și pe iPhone / din fișier local.** Butonul „Copiază planul” folosea
  doar Clipboard API (indisponibil pe `file://` sau pe origini nesigure); acum are fallback pe
  `execCommand`, iar dacă nici acesta nu e permis selectează automat textul planului, ca un tap lung
  să fie de ajuns.
- **Căutarea în glosar nu mai rămâne mută:** dacă nu există niciun termen potrivit, apare un mesaj
  clar („Niciun termen pentru căutarea ta. Încearcă alt cuvânt.”) în loc de o listă goală.

### Modificat
- Versiunea activelor urcă la `?v=1.5.0` (toate paginile + `package.json` + cache-ul service worker
  `clp-v1.5.0`), plus meta-uri pentru aplicație: `format-detection`,
  `apple-mobile-web-app-capable`, `apple-mobile-web-app-title`, `mobile-web-app-capable`,
  `theme-color` pentru temă luminoasă și întunecată pe fiecare pagină.

---

## [1.4.0] — 2026-09-14

### Adăugat — pagina „Începe aici” (`incepe.html`)
- **Traseu ghidat, gamificat, pentru cine nu a auzit niciodată de coaching.** Nu e un articol, e un
  drum: calibrare în 3 întrebări (cine ești, cât timp ai, ce buget) → **10 pași** în ordinea firească
  → plan personal pe 12 luni.
- Cei 10 pași acoperă exact ce se cere ca să înțelegi meseria: ce este coachingul și ce nu este,
  unde se aplică și cât de mare e piața, cum arată concret o sesiune (fazele + GROW), competențele
  și etica, cele trei sisteme (ICF / EMCC / ANC), procesul ICF de certificare pas cu pas cu
  cerințele ACC/PCC/MCC și calendarul 2026–2027, mentor coaching vs supervizare „by the book”,
  cum alegi școala în 30 de minute, cele trei trasee profesionale (mentor coach / supervizor /
  trainer) și o bibliotecă de 12 cărți, 6 studii, 14 coachi de renume și 4 comunități.
- **Mecanica de joc, fără trucuri ieftine**: 10 XP per pas + 5 XP pentru răspuns corect, 6 insigne,
  6 niveluri (de la „Curios la început” la „Coach informat”), bară de progres cu `role="progressbar"`,
  puncte de navigare directă între pași, timp estimat pe pas. Fără streak-uri, fără timere, fără
  presiune — progresul e doar al tău, salvat local (`cp_start_v2`), șterge-l oricând cu un buton.
- **Verificare în loc de încredere**: fiecare pas are un quiz cu 3 variante și explicația
  răspunsului (inclusiv de ce varianta greșită e greșită); conținutul trimite la sursele oficiale.
- **Plan final personalizat** (12 luni, buget, școală, mentor coaching, primii clienți) cu butoane de
  copiere și tipărire; la print se tipărește doar planul, curat.
- Pagina e bilingvă RO/EN, complet offline, fără cont; e legată în navigația tuturor paginilor,
  în hero-ul de pe `index.html` și în footer.

### Reparat — accesibilitate și finisaje (audit de design)
- **Contrast AA pe tot site-ul**: textul mic de pe fundaluri pastelate (etichete ICF/EMCC/ANC,
  insigne, pastile de pas, linkuri de raportare) folosește acum variante de culoare închise
  (`--amber-ink`, `--teal-ink`, `--ok-ink`, `--icf-ink`, `--emcc-ink`, `--anc-ink`, `--warn-ink`,
  `--violet-ink`), toate peste 4.5:1 — în ambele teme. Verificat cu `qa-tools/contrast.mjs`.
- **Mișcare redusă respectată peste tot**: derularea lină la schimbarea pasului/quizului
  (`start.js`) și la navigarea din hartă (`app.js`) devine instantanee când utilizatorul are
  `prefers-reduced-motion: reduce`.
- **Fără JavaScript conținutul nu mai dispare**: blocurile `.reveal` sunt ascunse doar dacă JS-ul
  chiar rulează (clasa `js` se pune în `<head>`, înainte de primul paint) — fără JS textul rămâne
  vizibil. `incepe.html` are în plus un `<noscript>` care explică ce se pierde și oferă linkuri
  directe către teorie și hartă.
- **XP imposibil de „dezlipit”**: punctele sunt calculate din progresul real (pași bifați + quizuri
  corecte), nu dintr-un contor care putea rămâne în urmă; bonusul se anunță doar când se acordă.
- **Quizul spune ce s-a întâmplat, și pentru cititorul de ecran**: variantele au `aria-pressed`,
  explicația răspunsului e legată prin `aria-describedby`, iar schimbarea pasului e anunțată
  în regiunea `aria-live`.

### Modificat
- Versiunea activelor urcă la `?v=1.4.0` (toate paginile + `package.json` + cache-ul service worker).
- Meta sociale complete pe toate paginile (`og:type`, `og:url`, `og:site_name`, `og:locale`),
  `canonical` și pe `legal.html`; `404.html` rămâne `noindex`.
- `sitemap.xml` are acum 6 URL-uri (prioritate 1.0 pentru „Începe aici”).
- `render.yaml` și `server.js` adaugă ruta scurtă `/incepe`.
- **Uneltele de QA sunt acum în repo** (`qa-tools/`): `npm run qa` (toate paginile în jsdom),
  `npm run qa:start` (41 de verificări pe traseul ghidat), `npm run qa:css` (clase/variabile CSS și
  id-uri), `npm run qa:contrast` (prag AA pe perechile text/fundal). Necesită `npm install` (jsdom),
  nu afectează site-ul publicat — `npm run check` rămâne fără nicio dependență.

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
# 2.0.0 — Atlas

- New editorial visual system and focused, intent-based homepage.
- Separate destinations, five-link navigation and legacy anchor compatibility.
- Guided journey map, chapter reading, inline credential details and pathway advisor.
- School filtering, pagination and three-school comparison.
- Preserved local progress, deferred installation prompt, versioned offline precache.
- GitHub feedback draft and v2 DOM integration suite. See ATLAS_V2.md.
