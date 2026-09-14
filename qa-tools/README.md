# qa-tools — verificări de calitate

Unelte de test pentru site, rulate local (nu fac parte din site-ul publicat).
Au nevoie de `jsdom` (devDependency) și, pentru primele două, de serverul local pornit.

```bash
npm install          # o singură dată: instalează jsdom
npm start            # serverul pe http://localhost:3000 (în alt terminal)

npm run qa           # toate paginile în jsdom: erori JS, randare, interacțiuni, paritate RO/EN
npm run qa:start     # traseul „Începe aici”: calibrare, quiz, XP, insigne, plan, persistență, EN
npm run qa:css       # clase/variabile CSS folosite dar nedefinite + id-uri cerute de JS
npm run qa:contrast  # contrast text/fundal (prag AA 4.5:1) în modul luminos
```

| Fișier | Ce verifică |
|--------|-------------|
| `qa.mjs` | Încarcă fiecare pagină în jsdom (cu serverul pornit), colectează erorile de consolă, verifică containerii randate, atributele bilingve, `alt`-urile, linkurile externe, apoi simulează clicuri: comutare limbă/temă, taburi, filtre, căutări, modal, acordeon, quiz. |
| `qa-start.mjs` | 41 de verificări dedicate traseului ghidat: HUD, cei 10 pași, calibrare, plan personalizat, quiz cu explicație, XP, insigne, bară de progres, navigare între pași, comutare RO→EN fără pierderea progresului, resetare. |
| `crosscheck.mjs` | Clasele folosite în HTML/JS există în CSS? Variabilele CSS folosite sunt declarate? Id-urile cerute de JS există în pagini? |
| `contrast.mjs` | Pentru fiecare regulă CSS cu fundal pastel și text colorat, calculează raportul de contrast și semnalează tot ce e sub 4.5:1 (AA). |

`BASE=http://alt-host:port` schimbă adresa serverului testat.
