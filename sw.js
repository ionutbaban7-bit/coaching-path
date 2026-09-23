/* ============================================================
   coachinghub.ro — SERVICE WORKER (offline + viteză)
   ------------------------------------------------------------
   Strategie:
     • paginile HTML  → network-first, cu cache ca plasă de siguranță
                        (așa vezi imediat o versiune nouă, dar merge și offline)
     • CSS/JS/fonturi → cache-first, pentru încărcare instantanee la revizitare
     • restul (imagini, 404.html) → stale-while-revalidate

   Versionarea manuală: schimbă CACHE_VERSION când publici modificări mari.
   La activare, toate cache-urile vechi se șterg.
   ============================================================ */
'use strict';

var CACHE_VERSION = 'clp-v4.3.1';
var HTML_CACHE = CACHE_VERSION + '-html';
var ASSET_CACHE = CACHE_VERSION + '-assets';

var CORE = [
  'descopera.html', 'competente.html', 'povesti.html', 'intrebari.html', 'greseli.html',
  'assets/css/academy.css?v=4.3.1', 'assets/css/hub.css?v=4.3.1', 'assets/css/old-money.css?v=4.3.1', 'assets/css/journal.css?v=4.3.1', 'assets/js/academy-data.js?v=4.3.1', 'assets/js/academy.js?v=4.3.1',
  'assets/js/hub.js?v=4.3.1', 'assets/js/forum.js?v=4.3.1', 'assets/js/start-content.js?v=4.3.1',
  'assets/img/academy-conversation.webp?v=4.3.1', 'assets/img/academy-library.webp?v=4.3.1',
  './',
  'certificari.html',
  'traseul-meu.html',
  'scoli.html',
  'resurse.html',
  'invata.html',
  'assets/css/atlas.css?v=4.3.1',
  'assets/js/atlas.js?v=4.3.1',
  'index.html',
  'hub.html',
  'forum.html',
  'incepe.html',
  'teorie.html',
  'individual.html',
  'echipa.html',
  'legal.html',
  '404.html',
  'assets/css/fonts.css',
  'assets/css/tokens.css',
  'assets/css/app.css',
  'assets/css/pages.css',
  'assets/js/school-data.js',
  'assets/js/site.js',
  'assets/js/credibility.js',
  'assets/js/start.js',
  'assets/fonts/inter-latin-wght-normal.woff2',
  'assets/fonts/inter-latin-ext-wght-normal.woff2',
  'assets/img/favicon.svg',
  'assets/img/favicon.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_VERSION).then(function(c){
      // addAll eșuează în bloc dacă un singur fișier lipsește → adăugăm individual
      return Promise.all(CORE.map(function(u){
        return c.add(new Request(/\.(css|js)$/.test(u) ? u + '?v=4.3.1' : u, { cache:'reload' })).catch(function(){});
      }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k !== HTML_CACHE && k !== ASSET_CACHE && k !== CACHE_VERSION) return caches.delete(k);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

function isHtml(req, url){
  return req.mode === 'navigate' ||
         (req.headers.get('accept') || '').indexOf('text/html') > -1 ||
         url.pathname.endsWith('/') || url.pathname.endsWith('.html');
}
function isAsset(url){
  return /\.(css|js|woff2?|ttf|png|jpe?g|svg|webp|ico)$/i.test(url.pathname);
}

self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;
  var url;
  try{ url = new URL(req.url); }catch(err){ return; }
  if(url.origin !== self.location.origin) return;   // nu ne atingem de alte domenii

  if(isHtml(req, url)){
    e.respondWith(
      fetch(req).then(function(res){
        var copy = res.clone();
        caches.open(HTML_CACHE).then(function(c){ c.put(req, copy); });
        return res;
      }).catch(function(){
        return caches.match(req).then(function(hit){
          if(hit) return hit;
          return caches.match('index.html').then(function(home){ return home || caches.match('./'); });
        });
      })
    );
    return;
  }

  if(isAsset(url)){
    e.respondWith(
      caches.match(req).then(function(hit){
        if(hit) return hit;
        return fetch(req).then(function(res){
          if(res && res.status === 200 && res.type === 'basic'){
            var copy = res.clone();
            caches.open(ASSET_CACHE).then(function(c){ c.put(req, copy); });
          }
          return res;
        });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function(hit){
      var net = fetch(req).then(function(res){
        if(res && res.status === 200 && res.type === 'basic'){
          var copy = res.clone();
          caches.open(ASSET_CACHE).then(function(c){ c.put(req, copy); });
        }
        return res;
      }).catch(function(){ return hit; });
      return hit || net;
    })
  );
});
