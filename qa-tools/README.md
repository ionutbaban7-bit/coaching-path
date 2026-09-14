# qa-tools — verificări de calitate

Unelte de test pentru site, rulate local (nu fac parte din site-ul publicat).
Au nevoie de `jsdom` (devDependency) și, pentru primele două, de serverul local pornit.

```bash
npm install          # o singură dată: instalează jsdom
npm start            # serverul pe http://localhost:3000 (în alt terminal)

npm run qa           # toate paginile în jsdom: erori JS, randare, interacțiuni, paritate RO/EN
npm run qa:start     # traseul „Începe aici”: calibrare, quiz, XP, insigne, plan, linkuri directe, bară mobilă, EN
npm run qa:css       # clase/variabile CSS folosite dar nedefinite + id-uri cerute de JS
npm run qa:mobile    # 43 de verificări statice de mobil (fără server): viewport, zone sigure, ținte, PWA
npm run qa:contrast  # contrast text/fundal (prag AA 4.5:1) în modul luminos
npm run qa:mobile    # audit mobil static (nu are nevoie de server): viewport, zone sigure, ținte, PWA
```

`qa.mjs` include și o secțiune **MOBIL** (13 verificări: meniul, bara „Continuă”, notificarea de offline) (meniul: Escape / atingere în afară / derulare blocată și
bara „Continuă de unde ai rămas", cu progres injectat în `localStorage`).

| Fișier | Ce verifică |
|--------|-------------|
| `qa.mjs` | Încarcă fiecare pagină în jsdom (cu serverul pornit), colectează erorile de consolă, verifică containerii randate, atributele bilingve, `alt`-urile, linkurile externe, apoi simulează clicuri: comutare limbă/temă, taburi, filtre, căutări, modal, acordeon, quiz. |
| `qa-start.mjs` | 48 de verificări dedicate traseului ghidat: HUD, cei 10 pași, calibrare, plan personalizat, quiz cu explicație, XP, insigne, bară de progres, navigare între pași, link direct către un pas (`#s3`), butonul „Link către pas”, bara fixă de pe telefon, comutare RO→EN fără pierderea progresului, resetare. |
| `crosscheck.mjs` | Clasele folosite în HTML/JS există în CSS? Variabilele CSS folosite sunt declarate? Id-urile cerute de JS există în pagini? |
| `contrast.mjs` | Pentru fiecare regulă CSS cu fundal pastel și text colorat, calculează raportul de contrast și semnalează tot ce e sub 4.5:1 (AA). |
| `mobile.mjs` | Audit mobil pe fișierele sursă (fără browser): `viewport-fit=cover` și meta-uri iOS, `env(safe-area-inset-*)`, `100vh` cu pereche `100dvh`, câmpuri de 16px, ținte de atingere de minim 44px, `@media (hover:none)`, meniul cu scroll blocat, bara „Continuă", instalarea PWA, manifestul și versiunea cache-ului. |

`BASE=http://alt-host:port` schimbă adresa serverului testat.
