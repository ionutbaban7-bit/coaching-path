/* ============================================================
   Coaching Learning Path — server static minimal, ZERO dependențe
   ------------------------------------------------------------
   Existența lui înseamnă că site-ul se poate publica oriunde:
     • Render → Web Service   : Build `npm install`, Start `node server.js`
     • Render → Static Site   : Build gol, Publish `.`  (serverul e ignorat)
     • local                  : `node server.js` → http://localhost:3000
   Node >= 18. Nu folosește nimic din npm: n-are ce să se strice.
   ============================================================ */
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');

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

const CLEAN = { '/teorie': 'teorie.html', '/individual': 'individual.html',
                '/echipa': 'echipa.html', '/legal': 'legal.html' };

function send(res, code, body, type, extra) {
  res.writeHead(code, Object.assign({
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(body),
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }, extra || {}));
  res.end(body);
}

function serveFile(res, rel, cache) {
  const abs = path.join(ROOT, rel);
  // protecție împotriva „../” — nimic nu iese din rădăcina proiectului
  if (!abs.startsWith(ROOT + path.sep) && abs !== ROOT) return send(res, 403, '403', MIME['.txt']);

  fs.stat(abs, (err, st) => {
    if (err || !st.isFile()) return notFound(res);
    const ext = path.extname(abs).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    const head = { 'Last-Modified': st.mtime.toUTCString() };
    if (cache) head['Cache-Control'] = 'public, max-age=604800';
    else head['Cache-Control'] = 'public, max-age=0, must-revalidate';

    // etag simplu + 304 pentru reîncărcări rapide
    const etag = 'W/"' + st.size + '-' + Number(st.mtimeMs).toString(36) + '"';
    head.ETag = etag;
    if (res.req && res.req.headers['if-none-match'] === etag) {
      res.writeHead(304, head); return res.end();
    }

    fs.readFile(abs, (e, buf) => {
      if (e) return notFound(res);
      res.writeHead(200, Object.assign({ 'Content-Type': type, 'Content-Length': buf.length }, head));
      res.end(res.req && res.req.method === 'HEAD' ? undefined : buf);
    });
  });
}

function notFound(res) {
  const p = path.join(ROOT, '404.html');
  fs.readFile(p, (e, buf) => {
    if (e) return send(res, 404, '404 — pagina nu există', MIME['.txt']);
    send(res, 404, buf, MIME['.html'], { 'Content-Type': MIME['.html'] });
  });
}

const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(url.parse(req.url).pathname || '/'); }
  catch (e) { return send(res, 400, '400', MIME['.txt']); }

  if (pathname.endsWith('/')) pathname += 'index.html';
  if (CLEAN[pathname]) pathname = '/' + CLEAN[pathname];

  const rel = pathname.replace(/^\/+/, '') || 'index.html';
  const isAsset = /^assets\//.test(rel);
  return serveFile(res, rel, isAsset);
});

server.listen(PORT, HOST, () => {
  console.log(`Coaching Learning Path → http://${HOST}:${PORT}`);
});

// oprire grațioasă (Render trimite SIGTERM la redeploy)
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => { server.close(() => process.exit(0)); });
}
