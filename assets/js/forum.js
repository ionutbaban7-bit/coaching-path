/* coachinghub.ro — forum MVP: shared API when available, local-first fallback */
(function () {
  'use strict';

  var KEY = 'coachinghub_forum_v1';
  var API = '/api/forum';
  var $ = function (selector, root) { return (root || document).querySelector(selector); };
  var categories = {
    beginners: { ro: 'Începători', en: 'Beginners' },
    practice: { ro: 'Practică', en: 'Practice' },
    credentials: { ro: 'Certificare', en: 'Credentials' },
    niche: { ro: 'Nișă și business', en: 'Niche and business' },
    ethics: { ro: 'Etică și limite', en: 'Ethics and boundaries' },
    resources: { ro: 'Resurse', en: 'Resources' }
  };
  var seed = [
    { id: 'seed-1', kind: 'discussion', category: 'beginners', author: 'Mara', role: 'coach în formare', createdAt: '2026-09-20T09:00:00.000Z', title: { ro: 'Cum aleg prima formare fără să cumpăr promisiuni?', en: 'How do I choose first training without buying promises?' }, body: { ro: 'Ce întrebări v-au ajutat să diferențiați o programă serioasă de marketing? Mă interesează practica observată și feedbackul real.', en: 'Which questions helped you distinguish serious training from marketing? I care about observed practice and real feedback.' }, replies: [{ id: 'seed-1-r1', author: 'Andrei', role: 'PCC', createdAt: '2026-09-21T11:00:00.000Z', body: { ro: 'Aș începe cu: câte sesiuni observate, cum arată evaluarea și ce se întâmplă dacă nu treci prima dată.', en: 'I would start with: how many observed sessions, what assessment looks like and what happens if you do not pass first time.' } }] },
    { id: 'seed-2', kind: 'discussion', category: 'practice', author: 'Radu', role: 'coach', createdAt: '2026-09-18T15:30:00.000Z', title: { ro: 'Cum păstrez primele ore de coaching într-un log util?', en: 'How do I keep my first coaching hours in a useful log?' }, body: { ro: 'Vreau să separ clar învățarea, practica și coachingul cu clienți. Ce câmpuri vi se par indispensabile?', en: 'I want to separate learning, practice and client coaching clearly. Which fields do you find essential?' }, replies: [] },
    { id: 'seed-3', kind: 'article', category: 'niche', author: 'Ioana', role: 'coach', createdAt: '2026-09-16T08:20:00.000Z', title: { ro: 'Nișa nu este un slogan: ce am învățat din 10 conversații', en: 'A niche is not a slogan: what I learned from 10 conversations' }, body: { ro: 'O notiță despre diferența dintre „vreau să lucrez cu lideri” și o problemă concretă pe care oamenii chiar vor să o exploreze.', en: 'A note about the difference between “I want to work with leaders” and a concrete problem people actually want to explore.' }, replies: [{ id: 'seed-3-r1', author: 'Dana', role: 'coach', createdAt: '2026-09-17T10:00:00.000Z', body: { ro: 'Mi-a plăcut separarea dintre public, problemă și context. A făcut oferta mult mai puțin abstractă.', en: 'I liked separating audience, problem and context. It made the offer much less abstract.' } }, { id: 'seed-3-r2', author: 'Mara', role: 'coach în formare', createdAt: '2026-09-18T10:00:00.000Z', body: { ro: 'Și eu încerc să nu aleg nișa doar după ce sună bine în profil.', en: 'I am also trying not to choose a niche only because it sounds good in a profile.' } }] },
    { id: 'seed-4', kind: 'discussion', category: 'ethics', author: 'Sorin', role: 'curios', createdAt: '2026-09-14T12:10:00.000Z', title: { ro: 'Unde se termină coachingul și începe trimiterea mai departe?', en: 'Where does coaching end and referral begin?' }, body: { ro: 'Cum recunoașteți o situație în care clientul are nevoie de alt tip de sprijin și cum formulați asta fără să-l rușinați?', en: 'How do you recognise when a client needs another kind of support and say it without shaming them?' }, replies: [] }
  ];
  var topics = [];
  var remote = false;
  var selected = null;

  function isRo() { return !document.documentElement.lang || document.documentElement.lang !== 'en'; }
  function T(ro, en) { return isRo() ? ro : en; }
  function value(value) {
    if (value && typeof value === 'object') return value[isRo() ? 'ro' : 'en'] || value.ro || value.en || '';
    return String(value || '');
  }
  function copy(value) { return { ro: value.ro || value.en || '', en: value.en || value.ro || '' }; }
  function cloneSeed() { return seed.map(function (topic) { return Object.assign({}, topic, { title: copy(topic.title), body: copy(topic.body), replies: (topic.replies || []).map(function (reply) { return Object.assign({}, reply, { body: copy(reply.body) }); }) }); }); }
  function readLocal() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY) || 'null');
      return Array.isArray(data) && data.length ? data : cloneSeed();
    } catch (e) { return cloneSeed(); }
  }
  function saveLocal() { try { localStorage.setItem(KEY, JSON.stringify(topics)); } catch (e) {} }
  function canRemote() { return typeof window.fetch === 'function' && location.protocol !== 'file:'; }
  function request(url, options) {
    if (!canRemote()) return Promise.reject(new Error('local'));
    return window.fetch(url, Object.assign({ headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }, options || {})).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (body) {
        if (!response.ok) throw new Error(body.error || 'Request failed');
        return body;
      });
    });
  }
  function formatDate(iso) {
    var date = new Date(iso);
    if (isNaN(date.getTime())) return '';
    try { return new Intl.DateTimeFormat(isRo() ? 'ro-RO' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date); } catch (e) { return date.toISOString().slice(0, 10); }
  }
  function categoryLabel(id) { return categories[id] ? value(categories[id]) : id; }
  function setStatus(message) { var node = $('#forumStatus'); if (node) node.textContent = message || ''; }
  function topicMatches(topic) {
    var needle = ($('#forumSearch') && $('#forumSearch').value || '').trim().toLocaleLowerCase();
    var category = ($('#forumCategory') && $('#forumCategory').value) || 'all';
    var haystack = [value(topic.title), value(topic.body), topic.author, topic.role, categoryLabel(topic.category)].join(' ').toLocaleLowerCase();
    return (category === 'all' || topic.category === category) && (!needle || haystack.indexOf(needle) >= 0);
  }
  function el(name, className, content) {
    var node = document.createElement(name);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }
  function render() {
    var box = $('#forumTopics');
    if (!box) return;
    box.replaceChildren();
    var visible = topics.filter(topicMatches).sort(function (a, b) { return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt); });
    setStatus(visible.length + ' ' + T(visible.length === 1 ? 'subiect' : 'subiecte', visible.length === 1 ? 'topic' : 'topics') + (remote ? ' · ' + T('sincronizat', 'synced') : ' · ' + T('salvat în acest browser', 'saved in this browser')));
    if (!visible.length) { box.append(el('p', 'forum-empty', T('Nu există încă subiecte pentru filtrul ales. Fii primul care deschide conversația.', 'There are no topics for this filter yet. Start the conversation.'))); return; }
    visible.forEach(function (topic) {
      var article = el('article', 'forum-topic');
      article.setAttribute('tabindex', '0'); article.setAttribute('role', 'button'); article.setAttribute('aria-label', value(topic.title)); article.dataset.topicId = topic.id;
      var main = el('div');
      var meta = el('div', 'forum-topic-meta');
      var tag = el('span', 'forum-tag' + (topic.kind === 'article' ? ' article' : ''), topic.kind === 'article' ? T('Articol', 'Article') : categoryLabel(topic.category));
      meta.append(tag, el('span', '', topic.author + (topic.role ? ' · ' + topic.role : '')), el('time', '', formatDate(topic.createdAt)));
      main.append(meta, el('h3', '', value(topic.title)), el('p', 'forum-topic-excerpt', value(topic.body).slice(0, 190) + (value(topic.body).length > 190 ? '…' : '')));
      var stats = el('div', 'forum-topic-stats'); stats.append(el('strong', '', String((topic.replies || []).length)), el('span', '', T('răspunsuri', 'replies')));
      article.append(main, stats); box.append(article);
    });
  }
  function openDialog(node) { if (node) node.hidden = false; document.documentElement.classList.add('forum-open'); }
  function closeDialog(node) { if (node) node.hidden = true; if (!$('#topicDialog:not([hidden])') && !$('#threadDialog:not([hidden])')) document.documentElement.classList.remove('forum-open'); }
  function findTopic(id) { return topics.find(function (topic) { return topic.id === id; }); }
  function renderThread(topic) {
    var title = $('#threadTitle'), content = $('#threadContent');
    if (!title || !content || !topic) return;
    selected = topic.id; title.textContent = value(topic.title); content.replaceChildren();
    var meta = el('p', 'forum-thread-meta', (topic.kind === 'article' ? T('Articol', 'Article') : categoryLabel(topic.category)) + ' · ' + topic.author + (topic.role ? ' · ' + topic.role : '') + ' · ' + formatDate(topic.createdAt));
    content.append(meta, el('div', 'forum-thread-body', value(topic.body)));
    var replies = el('div', 'forum-replies'); replies.append(el('h3', '', T('Răspunsuri', 'Replies') + ' (' + (topic.replies || []).length + ')'));
    (topic.replies || []).forEach(function (reply) { var item = el('article', 'forum-reply'); item.append(el('div', 'forum-reply-meta', reply.author + (reply.role ? ' · ' + reply.role : '') + ' · ' + formatDate(reply.createdAt)), el('div', 'forum-reply-body', value(reply.body))); replies.append(item); });
    var form = document.createElement('form'); form.className = 'forum-reply-form'; form.innerHTML = '<label><span>' + T('Numele afișat', 'Display name') + '</span><input name="author" maxlength="60" required placeholder="' + T('Ex.: Ana', 'E.g. Ana') + '"></label><label><span>' + T('Răspunsul tău', 'Your reply') + '</span><textarea name="body" rows="4" maxlength="2400" required placeholder="' + T('Adaugă context sau o perspectivă…', 'Add context or a perspective…') + '"></textarea></label><div class="forum-reply-form-actions"><button class="ac-btn ac-btn-primary" type="submit">' + T('Trimite răspunsul', 'Send reply') + ' ↗</button></div>';
    form.addEventListener('submit', function (event) { event.preventDefault(); submitReply(topic.id, { author: form.elements.author.value.trim(), body: form.elements.body.value.trim() }, form); });
    replies.append(form); content.append(replies);
    openDialog($('#threadDialog'));
  }
  function openThread(id) { var topic = findTopic(id); if (topic) renderThread(topic); }
  function payloadFromForm(form) { return { author: form.elements.author.value.trim(), kind: form.elements.kind.value, category: form.elements.category.value, title: form.elements.title.value.trim(), body: form.elements.body.value.trim() }; }
  function localTopic(payload) { return { id: 'local-' + Date.now() + '-' + Math.random().toString(16).slice(2), kind: payload.kind, category: payload.category, author: payload.author, role: T('participant', 'participant'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), title: { ro: payload.title, en: payload.title }, body: { ro: payload.body, en: payload.body }, replies: [] }; }
  function submitTopic(payload, form) {
    if (!payload.author || !payload.title || !payload.body) return;
    var button = form.querySelector('button[type=submit]'); if (button) button.disabled = true;
    var done = function (topic, synced) { topics.unshift(topic); remote = synced; saveLocal(); form.reset(); closeDialog($('#topicDialog')); render(); openThread(topic.id); };
    if (canRemote()) request(API, { method: 'POST', body: JSON.stringify(payload) }).then(function (data) { done(data.topic, true); }).catch(function () { done(localTopic(payload), false); }).finally(function () { if (button) button.disabled = false; });
    else { done(localTopic(payload), false); if (button) button.disabled = false; }
  }
  function submitReply(topicId, payload, form) {
    if (!payload.author || !payload.body) return;
    var topic = findTopic(topicId); if (!topic) return;
    var done = function (reply, synced) { topic.replies = topic.replies || []; topic.replies.push(reply); topic.updatedAt = reply.createdAt; remote = synced; saveLocal(); renderThread(topic); render(); };
    if (canRemote()) request(API + '/' + encodeURIComponent(topicId) + '/replies', { method: 'POST', body: JSON.stringify(payload) }).then(function (data) { done(data.reply, true); }).catch(function () { done({ id: 'local-reply-' + Date.now(), author: payload.author, role: T('participant', 'participant'), createdAt: new Date().toISOString(), body: { ro: payload.body, en: payload.body } }, false); });
    else done({ id: 'local-reply-' + Date.now(), author: payload.author, role: T('participant', 'participant'), createdAt: new Date().toISOString(), body: { ro: payload.body, en: payload.body } }, false);
  }
  function init() {
    topics = readLocal(); render();
    if (canRemote()) request(API).then(function (data) { if (Array.isArray(data.topics)) { topics = data.topics; remote = true; saveLocal(); render(); } }).catch(function () {});
    $('#forumSearch').addEventListener('input', render); $('#forumCategory').addEventListener('change', render);
    $('#forumNewTopic').addEventListener('click', function () { openDialog($('#topicDialog')); var first = $('#topicForm input[name=author]'); if (first) first.focus(); });
    $('#topicForm').addEventListener('submit', function (event) { event.preventDefault(); submitTopic(payloadFromForm(event.currentTarget), event.currentTarget); });
    $('#forumTopics').addEventListener('click', function (event) { var item = event.target.closest('.forum-topic'); if (item) openThread(item.dataset.topicId); });
    $('#forumTopics').addEventListener('keydown', function (event) { if (event.key === 'Enter' || event.key === ' ') { var item = event.target.closest('.forum-topic'); if (item) { event.preventDefault(); openThread(item.dataset.topicId); } } });
    document.addEventListener('click', function (event) { var close = event.target.closest('[data-close-dialog]'); if (close) closeDialog($('#topicDialog')); var threadClose = event.target.closest('[data-close-thread]'); if (threadClose) closeDialog($('#threadDialog')); if (event.target.classList.contains('forum-dialog')) closeDialog(event.target); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') { closeDialog($('#topicDialog')); closeDialog($('#threadDialog')); } });
    document.addEventListener('clp:lang', function () { render(); if (selected) renderThread(findTopic(selected)); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
}());
