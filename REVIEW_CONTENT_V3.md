# Review editorial și implementare v3 — 16 septembrie 2026

## Ce s-a schimbat și de ce

V2 a separat paginile, dar încă organiza experiența în jurul certificărilor și al unor blocuri lungi de informații. V3 începe cu întrebările unui vizitator: ce este coachingul, unde ajută, cum arată o conversație și ce poate exersa. Cele cinci destinații comune sunt Descoperă, Competențe, Practică, Certificare și Bibliotecă.

Au fost rescrise paginile publice de descoperire, teorie, practică individuală/de echipă, certificare, orientare și resurse. Schelele editoriale au fost înlocuite cu articole scurte și exemple. Costurile și presupunerile despre timpul necesar pentru certificare au fost eliminate. Directorul de școli nu mai afișează vechile descrieri promoționale și afirmații despre evaluări sociale.

## Corecții editoriale

- Coachingul, mentoratul, consultanța și psihoterapia sunt explicate ca practici cu scopuri și responsabilități diferite. Nu promitem rezultate și nu prezentăm coachingul ca intervenție clinică.
- Un certificat de absolvire, acreditarea unui program și o credențială individuală nu sunt echivalente. Reperele de educație/experiență ACC, PCC și MCC sunt însoțite de trimiteri la toate cerințele oficiale; nu reprezintă o listă completă de eligibilitate.
- Modelul ICF 2025 și Codul de etică intrat în vigoare la 1 aprilie 2025 sunt sursele curente. Denumirile engleze identifică competențele oficiale; explicațiile românești, exemplele și exercițiile sunt materiale editoriale independente.
- Nu există o echivalare automată ICF–EMCC–ANC. Înregistrarea unei ocupații sau absolvirea unui program național nu este prezentată ca o credențială ICF.
- Istoricul distinge apariția unei cărți influente de fondarea ICF. Nu atribuim întregul coaching unui singur autor.
- Cele patru povești sunt fictive. Variantele de răspuns explică intenția și limitele intervenției, fără a simula evaluarea oficială a unui coach.
- Cele 24 de întrebări sunt originale. Exercițiul de reformulare este ghidat manual; nu pretinde analiză automată sau evaluare prin AI.
- Greșelile reparabile sunt distincte de presiune, încălcări ale confidențialității și alte semnale serioase de alarmă.
- Cele șase cărți trimit către autori sau edituri. Nu reproducem capitole și nu distribuim copii ale cărților.
- Cele 31 de școli provin din directorul anterior. Nu am reverificat individual acreditarea fiecărei intrări; interfața cere verificarea programului exact în registrul oficial.

## Surse principale consultate

- [ICF Core Competencies](https://coachingfederation.org/credentialing/coaching-competencies/icf-core-competencies/)
- [ICF Code of Ethics](https://coachingfederation.org/credentialing/coaching-ethics/icf-code-of-ethics/)
- [ICF Credentials Overview](https://coachingfederation.org/credentialing/icf-credentials-overview/)
- [MCC](https://coachingfederation.org/credentialing/icf-credentials-overview/mcc/)
- [What is coaching?](https://coachingfederation.org/get-coaching/coaching-for-me/what-is-coaching/)
- [ICF History](https://coachingfederation.org/about/history/)
- [ACTC](https://coachingfederation.org/credentialing/icf-specializations-overview/actc/)
- [ICF Research](https://coachingfederation.org/resources/research/) și [ICF Blog](https://coachingfederation.org/resources/blog/)
- [EMCC Global](https://emccglobal.org/), [Global Code of Ethics](https://globalcodeofethics.org/) și [ANC](https://www.anc.edu.ro/)

Linkurile și recomandările bibliografice sunt în `assets/js/academy-data.js`. Paginile oficiale rămân autoritatea pentru cerințele care se pot schimba.

## Funcționalități și date

Atelierul permite selectarea oricărei competențe, păstrează temporar ciornele la schimbarea selecției/limbii și salvează reflecțiile numai la cererea utilizatorului. Favoritele și progresul se păstrează local. Exportul include reflecțiile curente. Ștergerea jurnalului cere confirmare și păstrează favoritele și traseul ghidat. Sunt tratate datele locale corupte și stocarea indisponibilă.

Progresul traseului v2 este păstrat, iar răspunsurile vechilor quizuri sunt resetate la migrarea conținutului. Datele din jurnal nu sunt trimise către un serviciu. Pagina legală explică stocarea și ștergerea. Sursele istorice `data.js`, `app.js`, `map.js` și `plan.js` nu mai sunt încărcate sau precache-uite de v3.

## QA înainte de publicare

- `npm run check`: 27 de fișiere JS, 4 JSON, referințe locale, perechi de traduceri, versiuni și structură CSS — trecut.
- `npm run qa`: 631 de aserțiuni pentru 18 pagini, integritatea imaginilor, legături și ancore, RO/EN, competențe, căutare, filtre, favorite, scenarii, jurnal, export, resetare, migrare și tratarea erorilor de stocare — trecute.
- `npm run qa:server`: 70 de verificări pentru rute, redirecționări, antete și fișiere offline, plus 48 de verificări ale traseului ghidat — trecute.
- Verificări statice pentru contrastul a șapte perechi de culori, praguri responsive, ținte tactile, focus și mișcare redusă.

Acestea sunt verificări automate DOM, server și CSS. Nu constituie certificare WCAG, evaluare pedagogică externă sau testare pe telefoane fizice. Verificarea vizuală a versiunii publicate se face separat după actualizarea Render.

## Imagini originale

Imaginile sunt generate pentru acest proiect, fără persoane reale sau coperte de cărți identificabile. Originalele au 1536 × 1024 px; copiile web au 1152 × 768 px și sunt comprimate WebP.

### Conversația — ilustrație editorială

- Fișier public: `assets/img/academy-conversation.webp` (97.602 bytes).
- Original: `/workspace/scratch/97972dbfed9b/generated_images/exec-618cb50a-5238-4cea-9c45-254b1f928a10.png`.
- Prompt: “Use case: illustration-story. Asset type: hero artwork for a premium Romanian coaching education website. Create an original sophisticated editorial paper-cut and subtle risograph illustration: two adult people sitting opposite one another in comfortable sculptural chairs, in a calm conversation, an open notebook between them, a winding path from their conversation leading through abstract archways toward a small warm sunrise. They are equals, one listening thoughtfully while the other speaks. Landscape 3:2 composition, clear expressive silhouettes, tactile cream paper texture, deep forest green, sage, terracotta and small chartreuse accents. Warm, intelligent, human and refined magazine illustration, generous breathing room. No lettering, no numbers, no logos, no watermark. It must feel like the start of an exploratory learning journey, not therapy advertising or a corporate clipart scene.”

### Biblioteca — fotografie ilustrativă

- Fișier public: `assets/img/academy-library.webp` (82.436 bytes).
- Original: `/workspace/scratch/97972dbfed9b/generated_images/exec-863e76a7-9e84-4cf9-ad30-246c6646c552.png`.
- Prompt: “Use case: photorealistic-natural. Asset type: wide editorial banner for a refined coaching learning library, visually complementary to a cream, forest green and terracotta education website. Primary request: an authentic, quiet learning desk in warm natural window light, a small stack of unbranded linen-bound books in muted sage and cream, an open notebook with blank unmarked pages, a dark green ceramic coffee cup, pencil and a subtle plant shadow. No person. Tactile real materials, light oak table, honest beautiful documentary still life rather than glossy advertisement. Landscape 3:2 framing with books and notebook in the left two thirds and gentle open space to the right, no text anywhere, no logos, no readable covers, no watermark. Sophisticated warm magazine photography.”
