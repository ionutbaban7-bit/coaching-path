# Analiză de produs — coachinghub.ro v4

## Verdict

Repo-ul avea deja o bază editorială neobișnuit de bună: conținut original, RO/EN, cele opt competențe ICF explicate practic, exemple, întrebări, greșeli și un traseu ghidat. Problema principală nu era lipsa de informație, ci arhitectura de acces: vizitatorul trebuia să deducă singur unde începe, ce urmează și cum leagă practica de dezvoltarea profesională.

v4 tratează produsul ca pe un hub, nu ca pe o colecție de pagini:

1. **Explorează** — înțelegi domeniul și limitele lui.
2. **Paths** — alegi traseul potrivit: learning, practical sau professional.
3. **Practică** — exersezi competențe, reflecție și feedback.
4. **Forum** — întrebi, publici și înveți de la comunitate.
5. **Bibliotecă** — revii la surse, cărți și articole.

## Ce era solid și a fost păstrat

- Conținutul editorial și vocea calmă, fără promisiuni comerciale.
- Distincția dintre formare, certificat de program și credențială individuală.
- Atenția la etică, limite, confidențialitate și diferența dintre coaching și alte profesii.
- Progres local, PWA, bilingvism, accesibilitate de bază și testele deja existente.
- Directorul de școli ca instrument orientativ, cu invitația de a verifica sursa oficială.

## Ce lipsea și a fost schimbat

### 1. Un punct de intrare clar

`hub.html` este acum pagina de orientare. Nu cere utilizatorului să cunoască terminologia: arată trei trasee, apoi Biblia începătorului, roadmap-ul profesional și următorul pas practic.

### 2. Biblia începătorului

Hub-ul reunește șase repere: ce este coachingul, ce nu este, cum arată o conversație, etica și acordurile, practica deliberată și orientarea către formare. Cursul existent de zece pași rămâne traseul ghidat aprofundat; hub-ul este indexul ușor de scanat.

### 3. Roadmap-ul profesional

Roadmap-ul este intenționat orientativ: pornește de la înțelegerea domeniului, trece prin formare și practică, apoi indică ACC, PCC și MCC. ANC, ICF și EMCC sunt prezentate ca sisteme distincte; pagina nu promite conversie automată și trimite utilizatorul la cerințele organismului emitent înainte de aplicare.

### 4. Comunitate

`forum.html` adaugă subiecte, articole, categorii, căutare, răspunsuri și dialoguri accesibile. Browserul poate funcționa fără cont și fără backend; când rulează serverul Node, API-ul scrie MVP-ul în `data/forum.json`. Conținutul utilizatorului este introdus prin `textContent`, nu prin HTML nesanitizat.

### 5. Descoperire și interacțiune

- navigare principală scurtată și grupată după intenție;
- carduri de paths și hartă de conținut;
- progress checklist pentru acțiuni concrete;
- feedback local pe secțiuni și print/PDF;
- date structurate pentru paginile-cheie;
- meta-uri mobile, safe areas, `enterkeyhint` și ținte tactile verificate.

## Decizii tehnice

- Nu s-a făcut o rescriere într-un framework: repo-ul este un site static cu generator editorial, iar reutilizarea păstrează funcțiile existente și costul mic de operare.
- Forumul are două moduri explicite: fallback local pe static hosting și API file-backed pe Node. Această limitare este vizibilă în interfață și în README.
- Render este configurat ca Web Service Node deoarece un Static Site nu poate primi POST-uri pentru forum.
- Domain rebranding-ul este aplicat în UI, manifest, sitemap, canonical, Open Graph, robots și footer; conectarea DNS rămâne o acțiune de infrastructură în Render.

## Ce mai lipsește pentru o versiune publică matură

### P0 — înainte de comunitate deschisă

- autentificare și conturi verificate;
- moderare, raportare, rate limiting distribuit și audit log;
- bază de date persistentă, backup și migrații;
- protecție anti-spam și politici de conținut;
- acord explicit pentru publicarea articolelor și ștergerea datelor.

### P1 — după validarea folosirii

- pagină de profil minimală pentru coach / cursant / cititor;
- tag-uri și pagini de subiect;
- notificări opt-in și newsletter pentru noutăți;
- căutare full-text și sortare după utilitate / recență;
- bibliotecă de exerciții cu nivel, durată și competență asociată.

### P2 — maturizare editorială

- trasee cu milestone-uri și dovezi de practică;
- colecții de studii de caz moderate de coachi MCC;
- comparație mai clară între școli și programe, alimentată din surse oficiale;
- analytics privacy-first pentru a vedea unde se blochează utilizatorii, fără profilare.

## Criterii de succes

- un începător găsește în maximum două clickuri explicația „ce este coachingul” și primul exercițiu;
- un practician găsește în maximum două clickuri o competență și o activitate de practică;
- un candidat la certificare vede diferența dintre traseele ANC, ICF și EMCC înainte să aleagă o școală;
- un vizitator poate citi, căuta și salva local fără cont;
- forumul nu este prezentat ca producție sigură până când nu are identitate, moderare și stocare durabilă.
