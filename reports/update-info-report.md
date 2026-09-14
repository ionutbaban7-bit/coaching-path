# Raport — Actualizare informații (Update Info)

**Rulat:** 2026-09-14 · **mod:** report · **prag expirare:** 60 zile
**Ultima verificare a conținutului:** 2026-09-14 (acum 0 zile)

## 1. Inventarul datelor

| Set de date | Înregistrări | Unde |
|---|---:|---|
| Organisme (ICF · EMCC · ANC) | 3 | assets/js/data.js → ORGS |
| Noutăți / schimbări | 6 | assets/js/data.js → NEWS |
| Learning paths | 3 (icf:7, emcc:6, ro:6) | assets/js/data.js → PATHS |
| Treceri între certificări | 8 | assets/js/data.js → TRANS |
| Credențiale | 14 | assets/js/data.js → CREDS |
| Școli din România | 31 | assets/js/data.js → SCHOOLS |
| Exemplu de parcurs | 8 | assets/js/data.js → JOURNEY |
| Costuri | 10 | assets/js/data.js → COSTS |
| Glosar | 20 | assets/js/data.js → GLOSS |
| Întrebări frecvente | 12 | assets/js/data.js → FAQ |
| Surse oficiale | 12 | assets/js/data.js → SOURCES |
| Opriri pe hartă | 8 | assets/js/map.js |
| Întrebări în bancă (1:1) | 96 în 8 categorii | assets/js/plan.js |
| Ateliere de echipă | 4 | assets/js/plan.js |

## 2. Evenimente cu dată (din NEWS)

| Eveniment | Data | Stare |
|---|---|---|
| Noul examen ICF PCC/MCC | 10 nov 2026 | ⏳ în 57 zile — pregătește actualizarea |
| MCS devine obligatorie pentru mentor coaching | 1 ian 2027 | peste 109 zile |
| Standarde noi de competențe și etică ICF | 2025 → 2027 | fără dată (de verificat manual) |
| România: autorizarea mutată la MMSS | În vigoare | fără dată (de verificat manual) |
| EIA EMCC: 5 ani, supervizare obligatorie | Permanent | fără dată (de verificat manual) |
| Școlile „cu ICF/EMCC” se verifică, nu se iau pe încredere | Verifică în director | fără dată (de verificat manual) |

## 3. Surse de verificat

| Sursă | Cadență | Ultima verificare | Vechime | Stare |
|---|---|---:|---:|---|
| [ICF — Credentialing (cerințe, taxe, examen)](https://coachingfederation.org/credentialing-landing) | 60 zile | 2026-09-14 | 0 | 🟢 ok |
| [ICF Education Search — directorul global de programe](https://apps.coachingfederation.org/eweb/DynamicPage.aspx?webcode=ESS) | 90 zile | 2026-09-14 | 0 | 🟢 ok |
| [ICF — competențe și cod etic (modelul 2025)](https://coachingfederation.org/credentials-and-standards) | 180 zile | 2026-09-14 | 0 | 🟢 ok |
| [ICF — credentiale de team coaching (ACTC)](https://coachingfederation.org/credentials-and-standards/team-coaching-credentials) | 180 zile | 2026-09-14 | 0 | 🟢 ok |
| [EMCC — acreditare individuală (EIA)](https://www.emccglobal.org/accreditation/eia/) | 90 zile | 2026-09-14 | 0 | 🟢 ok |
| [EMCC — acreditare team coaching (ITCA)](https://www.emccglobal.org/accreditation/itca/) | 180 zile | 2026-09-14 | 0 | 🟢 ok |
| [EMCC — codul etic](https://www.emccglobal.org/ethics/) | 365 zile | 2026-09-14 | 0 | 🟢 ok |
| [ANC — autorizarea furnizorilor de formare](https://www.anc.edu.ro/) | 90 zile | 2026-09-14 | 0 | 🟢 ok |
| [MMSS — autorizarea ocupațiilor (România)](https://www.mmuncii.ro/) | 180 zile | 2026-09-14 | 0 | 🟢 ok |
| [Clasificarea Ocupațiilor — COR 242412](https://www.rubinian.com/cor/242412-specialist-activitatea-de-coaching) | 365 zile | 2026-09-14 | 0 | 🟢 ok |
| [ICF România — programe locale](https://www.coachingfederation.ro/) | 90 zile | 2026-09-14 | 0 | 🟢 ok |

## 4. Școli cu acreditare „conform site-ului propriu”

2 din 31 intrări se bazează pe declarația furnizorului:

- **Bright Goals (Anca Al Kebsi)** — România / online · [site](https://brightgoals.ro/curs-coaching/) · de confirmat în [directorul ICF](https://apps.coachingfederation.org/eweb/DynamicPage.aspx?webcode=ESS)
- **EXEC-EDU — divizia Coaching** — București / online · [site](https://exec-edu.ro/) · de confirmat în [directorul ICF](https://apps.coachingfederation.org/eweb/DynamicPage.aspx?webcode=ESS)

## 5. Validări

- ✅ **ORGS** — 3 organisme așteptate, găsite 3
- ✅ **PATHS** — 3 trasee așteptate, găsite 3
- ✅ **CREDS** — 14 credențiale
- ✅ **SCHOOLS** — 31 școli
- ✅ **CREDS.id unic** — 0 duplicate
- ✅ **TRANS.id unic** — 0 duplicate
- ✅ **SCHOOLS au nume + url** — ok
- ✅ **CREDS au surse** — ok
- ✅ **PATHS.icf pași traduși** — 0 pași netraduși
- ✅ **PATHS.emcc pași traduși** — 0 pași netraduși
- ✅ **PATHS.ro pași traduși** — 0 pași netraduși
- ✅ **Paritate RO/EN** — 443/443 texte bilingve complete

Total texte bilingve: **443**, dintre care incomplete: **0**.

## 6. Cum actualizezi

1. Deschizi sursa marcată 🔴 mai sus și verifici informația în aplicație.
2. Corectezi datele în `assets/js/data.js` (sau fișierul indicat în coloana „Unde”).
3. Pui data de azi în `data/sources.json` → `verified_on` și, opțional, pe sursa respectivă.
4. Adaugi o linie în `CHANGELOG.md`.
5. Rulezi din nou jobul: Actions → „Actualizare informații · Update Info” → Run workflow.

## Verdict

🟢 **Totul e în termen.** Nicio acțiune necesară acum.
