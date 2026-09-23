/* ============================================================
   coachinghub.ro — server static minimal + Forum API
   ------------------------------------------------------------
   Existența lui înseamnă că site-ul se poate publica oriunde:
     • Render → Web Service   : Build `npm install`, Start `node server.js`
     • Render → Static Site   : Build gol, Publish `.`  (serverul e ignorat)
     • local                  : `node server.js` → http://localhost:3000
   Node >= 18. Nu folosește nimic din npm: n-are ce să se strice.

   v4.3.0 — CoachingHub Journal:
     • articole, categorii, timp de citire, citiri și reacții like/dislike
     • API file-backed pentru articole propuse, răspunsuri și semnale editoriale
     • fallback local în Journal pe hosting static
   v1.7.0 — finisaj de produs (runda 5):
     • text scurt și la obiect: lead-uri, subtitluri, note de subsol
     • date structurate schema.org (WebSite, EducationalOrganization, LearningResource, Article)
     • insigna de progres în antet (traseu / hartă) + „A fost util?" pe secțiuni
     • traseu local „Continuă de unde ai rămas" pe paginile de conținut
     • căutările anunță câte rezultate au, tabelele au nume și scope, tipărirea nu rupe blocurile
     • poartă nouă de calitate: npm run qa:polish (text, date, finisaj)
   v1.6.0 — drumul cu bicicleta + QA de producție (ITIL):
     • viewport-fit=cover + zone sigure (notch / bara de jos) în tot layoutul
     • câmpuri de 16px pe telefon (iOS nu mai face zoom la focus)
     • ținte de atingere de minim 44px + feedback la apăsare
     • meniu mobil: blocare scroll, Escape, atingere în afară
     • bară „Continuă de unde ai rămas" + instalare ca aplicație (PWA)
     • harta e un drum cu 8 opriri: popup, închizi și pedalezi mai departe
   v1.5.0 — mobil (Android + iOS):
   v1.4.0 — ce s-a reparat înainte:
     • compresie gzip/brotli (HTML-ul scădea de la ~70 KB la ~15 KB)
     • cache corect: active versionate (?v=) = imutabile, HTML mereu proaspăt
     • rute curate și cu slash final: /teorie/, /index, /legal
     • antete de securitate (CSP, frame-ancestors, Permissions-Policy)
     • 405 pentru metode non-GET, 301 pentru /index.html
   ============================================================ */
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8'
};

/* rute scurte → fișier */
const CLEAN = {
  '/descopera': 'descopera.html',
  '/competente': 'competente.html',
  '/povesti': 'povesti.html',
  '/intrebari': 'intrebari.html',
  '/greseli': 'greseli.html',
  '/certificari': 'certificari.html',
  '/traseul-meu': 'traseul-meu.html',
  '/scoli': 'scoli.html',
  '/costuri': 'costuri.html',
  '/resurse': 'resurse.html',
  '/invata': 'invata.html',
  '/hub': 'hub.html',
  '/forum': 'forum.html',
  '/journal': 'forum.html',
  '/blog': 'forum.html',
  '/teorie': 'teorie.html',
  '/incepe': 'incepe.html',
  '/individual': 'individual.html',
  '/echipa': 'echipa.html',
  '/legal': 'legal.html',
  '/index': 'index.html',
  '/home': 'index.html',
  '/404': '404.html'
};

/* Forum MVP: folosește fișierul local când rulează ca Web Service.
   Pe Static Site, forum.js cade elegant pe localStorage până există un backend. */
const FORUM_FILE = process.env.FORUM_DATA_FILE || path.join(ROOT, 'data', 'forum.json');
const FORUM_CATEGORIES = new Set(['coaching', 'practice', 'credentials', 'career', 'spirituality', 'psychology', 'research', 'stories', 'resources', 'beginners', 'niche', 'ethics']);
const FORUM_KINDS = new Set(['discussion', 'article']);
const forumAttempts = new Map();
let forumCache = null;

function textField(value, max, multiline = false) {
  if (typeof value !== 'string') return '';
  let text = value.replace(/\u0000/g, '').trim();
  if (!multiline) text = text.replace(/[\r\n]+/g, ' ');
  return text.slice(0, max);
}

function bilingual(value) {
  if (value && typeof value === 'object') {
    const ro = textField(value.ro || value.en, 6000, true);
    const en = textField(value.en || value.ro, 6000, true);
    return { ro, en };
  }
  const text = textField(value, 6000, true);
  return { ro: text, en: text };
}

function metric(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.round(number) : 0;
}

function forumCategory(value) {
  if (value === 'beginners') return 'credentials';
  if (value === 'niche') return 'career';
  if (value === 'ethics') return 'coaching';
  return FORUM_CATEGORIES.has(value) ? value : 'coaching';
}

function normaliseForum(value) {
  const topics = Array.isArray(value) ? value : (value && Array.isArray(value.topics) ? value.topics : []);
  return { topics: topics.slice(0, 500).map((topic) => ({
    id: textField(topic.id, 90) || `topic-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    kind: FORUM_KINDS.has(topic.kind) ? topic.kind : 'discussion',
    category: forumCategory(topic.category),
    author: textField(topic.author, 60) || 'Participant',
    role: textField(topic.role, 60),
    createdAt: topic.createdAt || new Date().toISOString(),
    updatedAt: topic.updatedAt || topic.createdAt || new Date().toISOString(),
    readTime: textField(topic.readTime, 20),
    views: metric(topic.views),
    likes: metric(topic.likes),
    dislikes: metric(topic.dislikes),
    featured: topic.featured === true,
    editorPick: topic.editorPick === true,
    title: bilingual(topic.title),
    body: bilingual(topic.body),
    reflection: bilingual(topic.reflection),
    replies: Array.isArray(topic.replies) ? topic.replies.slice(0, 100).map((reply) => ({
      id: textField(reply.id, 90) || `reply-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      author: textField(reply.author, 60) || 'Participant',
      role: textField(reply.role, 60),
      createdAt: reply.createdAt || new Date().toISOString(),
      body: bilingual(reply.body)
    })) : []
  })) };
}

function forumStore() {
  if (forumCache) return forumCache;
  try { forumCache = normaliseForum(JSON.parse(fs.readFileSync(FORUM_FILE, 'utf8'))); }
  catch (e) { forumCache = { topics: [] }; }
  return forumCache;
}

function saveForum() {
  const dir = path.dirname(FORUM_FILE);
  fs.mkdirSync(dir, { recursive: true });
  const temp = `${FORUM_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(forumCache, null, 2) + '\n', 'utf8');
  fs.renameSync(temp, FORUM_FILE);
}

function sendJson(req, res, code, payload, extra = {}) {
  send(req, res, code, JSON.stringify(payload), MIME['.json'], {
    'Cache-Control': 'no-store',
    ...extra
  });
}

function requestBody(req, limit = 9000) {
  return new Promise((resolve, reject) => {
    let raw = '';
    let size = 0;
    let settled = false;
    req.on('data', (chunk) => {
      if (settled) return;
      size += chunk.length;
      if (size > limit) {
        settled = true;
        reject(Object.assign(new Error('Payload too large'), { statusCode: 413 }));
        req.resume();
        return;
      }
      raw += chunk;
    });
    req.on('end', () => {
      if (settled) return;
      settled = true;
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch (e) { reject(Object.assign(new Error('Invalid JSON'), { statusCode: 400 })); }
    });
    req.on('error', (error) => { if (!settled) { settled = true; reject(error); } });
  });
}

function allowForumWrite(req) {
  const now = Date.now();
  const key = req.socket.remoteAddress || 'unknown';
  const previous = forumAttempts.get(key) || { at: now, count: 0 };
  if (now - previous.at > 60_000) { previous.at = now; previous.count = 0; }
  previous.count += 1;
  forumAttempts.set(key, previous);
  return previous.count <= 8;
}

async function forumRoute(req, res, pathname) {
  if (req.method === 'GET') return sendJson(req, res, 200, forumStore());
  if (req.method !== 'POST') return sendJson(req, res, 405, { error: 'Method not allowed' }, { Allow: 'GET, POST' });
  if (!allowForumWrite(req)) return sendJson(req, res, 429, { error: 'Too many requests. Try again later.' });

  let body;
  try { body = await requestBody(req); }
  catch (error) { return sendJson(req, res, error.statusCode || 400, { error: error.message || 'Invalid request' }); }
  const store = forumStore();
  const actionMatch = pathname.match(/^\/api\/forum\/([^/]+)\/(view|react)$/);
  if (actionMatch) {
    const topic = store.topics.find((item) => item.id === decodeURIComponent(actionMatch[1]));
    if (!topic) return sendJson(req, res, 404, { error: 'Topic not found' });
    if (actionMatch[2] === 'view') {
      topic.views = metric(topic.views) + 1;
      saveForum();
      return sendJson(req, res, 200, { topic });
    }
    const reaction = textField(body.value, 10);
    if (reaction !== 'like' && reaction !== 'dislike') return sendJson(req, res, 422, { error: 'Reaction must be like or dislike' });
    if (reaction === 'like') topic.likes = metric(topic.likes) + 1;
    else topic.dislikes = metric(topic.dislikes) + 1;
    saveForum();
    return sendJson(req, res, 200, { topic });
  }
  const replyMatch = pathname.match(/^\/api\/forum\/([^/]+)\/replies$/);
  if (replyMatch) {
    const topic = store.topics.find((item) => item.id === decodeURIComponent(replyMatch[1]));
    const author = textField(body.author, 60);
    const content = textField(body.body, 2400, true);
    if (!topic) return sendJson(req, res, 404, { error: 'Topic not found' });
    if (!author || !content) return sendJson(req, res, 422, { error: 'Author and body are required' });
    const reply = { id: `reply-${Date.now()}-${Math.random().toString(16).slice(2)}`, author, role: 'participant', createdAt: new Date().toISOString(), body: bilingual(content) };
    topic.replies.push(reply); topic.updatedAt = reply.createdAt; saveForum();
    return sendJson(req, res, 201, { reply });
  }
  if (pathname !== '/api/forum') return sendJson(req, res, 404, { error: 'Forum route not found' });
  const author = textField(body.author, 60);
  const title = textField(body.title, 140);
  const content = textField(body.body, 6000, true);
  if (!author || !title || !content) return sendJson(req, res, 422, { error: 'Author, title and body are required' });
  if (!FORUM_CATEGORIES.has(body.category) || !FORUM_KINDS.has(body.kind)) return sendJson(req, res, 422, { error: 'Invalid category or topic type' });
  const now = new Date().toISOString();
  const topic = { id: `topic-${Date.now()}-${Math.random().toString(16).slice(2)}`, kind: body.kind, category: body.category, author, role: 'participant', createdAt: now, updatedAt: now, readTime: '', views: 0, likes: 0, dislikes: 0, featured: false, editorPick: false, title: bilingual(title), body: bilingual(content), reflection: bilingual(''), replies: [] };
  store.topics.unshift(topic); saveForum();
  return sendJson(req, res, 201, { topic });
}

/* tipuri compresibile */
const COMPRESSIBLE = /^(text\/|application\/(json|xml|manifest\+json)|image\/svg)/;

const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "script-src 'self' 'unsafe-inline'",   // singurul script inline e cel care fixează tema înainte de paint
  "style-src 'self' 'unsafe-inline'",    // stiluri inline în markup (culori de accent, layout punctual)
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'none'",
  "object-src 'none'",
  "frame-ancestors 'none'"
].join('; ');

function securityHeaders(extra) {
  return Object.assign({
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'DENY',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Content-Security-Policy': CSP,
    'Cross-Origin-Opener-Policy': 'same-origin'
  }, extra || {});
}

function pickEncoding(req) {
  const accept = req.headers['accept-encoding'] || '';
  if (/\bbr\b/.test(accept)) return 'br';
  if (/\bgzip\b/.test(accept)) return 'gzip';
  return null;
}

function compress(body, encoding) {
  if (encoding === 'br') return zlib.brotliCompressSync(body, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } });
  if (encoding === 'gzip') return zlib.gzipSync(body, { level: 6 });
  return body;
}

function send(req, res, code, body, type, extra) {
  const buf = Buffer.isBuffer(body) ? body : Buffer.from(String(body), 'utf8');
  const head = securityHeaders(extra);
  head['Content-Type'] = type;
  let out = buf;
  if (COMPRESSIBLE.test(type) && buf.length > 1024 && code !== 304) {
    const enc = pickEncoding(req);
    if (enc) { out = compress(buf, enc); head['Content-Encoding'] = enc; head.Vary = 'Accept-Encoding'; }
  }
  head['Content-Length'] = out.length;
  res.writeHead(code, head);
  res.end(req.method === 'HEAD' ? undefined : out);
}

function cacheControlFor(rel, search) {
  const versioned = /[?&]v=/.test(search || '');
  // service worker-ul trebuie revalidat mereu, altfel rămâne o versiune veche în browser
  if (rel === 'sw.js') return 'no-cache';
  if (/^assets\/(css|js|fonts)\//.test(rel)) {
    return versioned ? 'public, max-age=31536000, immutable' : 'public, max-age=3600, must-revalidate';
  }
  if (/^assets\/img\//.test(rel)) return 'public, max-age=604800';
  if (/\.(html|webmanifest|xml|txt)$/.test(rel)) return 'public, max-age=0, must-revalidate';
  return 'public, max-age=600';
}

function notFound(req, res) {
  fs.readFile(path.join(ROOT, '404.html'), (e, buf) => {
    if (e) return send(req, res, 404, '404 — pagina nu există', MIME['.txt'], { 'X-Robots-Tag': 'noindex' });
    send(req, res, 404, buf, MIME['.html'], { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' });
  });
}

function serveFile(req, res, rel, search) {
  const abs = path.join(ROOT, rel);
  // protecție împotriva „../” — nimic nu iese din rădăcina proiectului
  if (!abs.startsWith(ROOT + path.sep) && abs !== ROOT) return send(req, res, 403, '403', MIME['.txt']);

  fs.stat(abs, (err, st) => {
    if (err || !st.isFile()) return notFound(req, res);
    const ext = path.extname(abs).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    const head = securityHeaders({
      'Last-Modified': st.mtime.toUTCString(),
      'Cache-Control': cacheControlFor(rel, search)
    });

    // etag + 304 pentru reîncărcări rapide
    const etag = 'W/"' + st.size + '-' + Number(st.mtimeMs).toString(36) + '"';
    head.ETag = etag;
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, head);
      return res.end();
    }

    fs.readFile(abs, (e, buf) => {
      if (e) return notFound(req, res);
      const out = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
      let body = out;
      const extra = { 'Content-Type': type, ...head };
      if (COMPRESSIBLE.test(type) && out.length > 1024) {
        const enc = pickEncoding(req);
        if (enc) { body = compress(out, enc); extra['Content-Encoding'] = enc; extra.Vary = 'Accept-Encoding'; }
      }
      extra['Content-Length'] = body.length;
      res.writeHead(200, extra);
      res.end(req.method === 'HEAD' ? undefined : body);
    });
  });
}

const server = http.createServer(async (req, res) => {
  let pathname = '/';
  let search = '';
  let parsed;
  try {
    parsed = new URL(req.url, 'http://localhost');
    pathname = decodeURIComponent(parsed.pathname || '/');
    search = parsed.search || '';
  } catch (e) {
    return send(req, res, 400, '400', MIME['.txt']);
  }

  pathname = pathname.replace(/\/{2,}/g, '/');
  if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);   // /teorie/ → /teorie
  if (pathname === '/api/forum' || pathname.startsWith('/api/forum/')) {
    return forumRoute(req, res, pathname);
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(req, res, 405, '405 — doar GET/HEAD', MIME['.txt'], { Allow: 'GET, HEAD' });
  }
  if (pathname === '/index.html' && search === '') {
    return send(req, res, 301, '', MIME['.txt'], { Location: '/' });
  }
  if (pathname === '/costuri' || pathname === '/costuri.html') return send(req, res, 301, '', MIME['.txt'], { Location: '/certificari.html' });
  if (CLEAN[pathname]) pathname = '/' + CLEAN[pathname];

  let rel = pathname.replace(/^\/+/, '') || 'index.html';
  const abs = path.join(ROOT, rel);

  // dacă fișierul nu există și nu are extensie, încercăm varianta .html (rute prietenoase)
  fs.stat(abs, (err, st) => {
    if (!err && st.isFile()) return serveFile(req, res, rel, search);
    if (!path.extname(rel)) {
      const alt = rel + '.html';
      if (fs.existsSync(path.join(ROOT, alt))) return serveFile(req, res, alt, search);
    }
    return notFound(req, res);
  });
});

server.headersTimeout = 20000;
server.requestTimeout = 30000;
server.keepAliveTimeout = 65000;

server.listen(PORT, HOST, () => {
  console.log(`coachinghub.ro → http://${HOST}:${PORT}  (compresie: br/gzip, forum API activ)`);
});

// oprire grațioasă (Render trimite SIGTERM la redeploy)
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => { server.close(() => process.exit(0)); });
}
