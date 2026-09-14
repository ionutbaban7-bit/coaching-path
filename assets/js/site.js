/* ============================================================
   Coaching Learning Path — SITE.JS
   Comportament partajat de toate paginile:
   temă dark/light, limbă RO/EN, nav, scroll-spy, reveal,
   progres de citire, back-to-top, meniu mobil.
   ============================================================ */
(function(){
  "use strict";

  var $  = function(s,r){ return (r||document).querySelector(s); };
  var $$ = function(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };

  /* ---------- PAGINI (linkuri externe în nav) ---------- */
  var PAGES = [
    { id:'start',   href:'incepe.html',   label:{ ro:'Începe aici', en:'Start here' } },
    { id:'theory', href:'teorie.html',    label:{ ro:'Teorie',            en:'Theory' } },
    { id:'individual', href:'individual.html', label:{ ro:'Coaching 1:1', en:'1:1 Coaching' } },
    { id:'team',    href:'echipa.html',   label:{ ro:'Coaching de echipă', en:'Team Coaching' } }
  ];

  /* ---------- LIMBĂ ---------- */
  function getLang(){ try{ return localStorage.getItem('cp_lang') || 'ro'; }catch(e){ return 'ro'; } }
  function setLang(l){ try{ localStorage.setItem('cp_lang', l); }catch(e){} }
  var lang = getLang();

  /* ---------- TEMĂ ---------- */
  function applyTheme(t){
    document.documentElement.setAttribute('data-theme', t);
    var icon = $('#themeIcon');
    if(icon) icon.innerHTML = (t === 'dark')
      ? '<path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m10 10l1.4 1.4M5.6 18.4L7 17m10-10l1.4-1.4"/><circle cx="12" cy="12" r="4"/>'
      : '<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>';
    var btn = $('#themeBtn');
    if(btn) btn.setAttribute('aria-label', t === 'dark' ? 'Comută pe modul luminos' : 'Comută pe modul întunecat');
  }
  function initTheme(){
    var saved = null;
    try{ saved = localStorage.getItem('cp_theme'); }catch(e){}
    if(!saved){
      saved = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }
    applyTheme(saved);
    var btn = $('#themeBtn');
    if(btn) btn.addEventListener('click', function(){
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try{ localStorage.setItem('cp_theme', next); }catch(e){}
    });
  }

  /* ---------- i18n pentru elemente data-i18n-ro / data-i18n-en ---------- */
  function applyI18n(){
    document.documentElement.lang = lang;
    $$('[data-i18n-ro]').forEach(function(el){
      var v = el.getAttribute('data-i18n-' + lang);
      if(v != null) el.textContent = v;
    });
    $$('[data-i18n-t-ro]').forEach(function(el){
      var v = el.getAttribute('data-i18n-t-' + lang);
      if(v != null) el.setAttribute('title', v);
    });
    $$('[data-i18n-ph-ro]').forEach(function(el){
      var v = el.getAttribute('data-i18n-ph-' + lang);
      if(v != null) el.placeholder = v;
    });
    /* etichete citite de cititoarele de ecran (buton de temă, meniu, hartă) */
    $$('[data-i18n-aria-ro]').forEach(function(el){
      var v = el.getAttribute('data-i18n-aria-' + lang);
      if(v != null) el.setAttribute('aria-label', v);
    });
    /* titlul tab-ului și descrierea paginii urmează limba aleasă */
    var html = document.documentElement;
    var t = html.getAttribute('data-title-' + lang);
    if(t) document.title = t;
    $$('meta[name="description"]').forEach(function(m){
      var d = m.getAttribute('data-desc-' + lang);
      if(d) m.setAttribute('content', d);
    });
    var label = $('#langLabel');
    if(label) label.textContent = (lang === 'ro' ? 'EN' : 'RO');
    var flag = $('#langFlag');
    if(flag) flag.textContent = (lang === 'ro' ? '🇬🇧' : '🇷🇴');
  }

  /* ---------- NAV ---------- */
  function renderNav(){
    var box = $('#navlinks');
    if(!box) return;
    var page = document.body.dataset.page || 'index';
    var html = '';

    // secțiuni (doar pe pagina principală există ca ancore)
    if(typeof UI !== 'undefined' && page === 'index'){
      html += UI[lang].nav.map(function(p){
        return '<a href="#' + p[0] + '" data-spy="' + p[0] + '">' + p[1] + '</a>';
      }).join('');
    }else{
      var secs = (typeof UI !== 'undefined') ? UI[lang].nav : [];
      html += secs.map(function(p){
        return '<a href="index.html#' + p[0] + '">' + p[1] + '</a>';
      }).join('');
    }

    html += '<span class="nav-sep" aria-hidden="true"></span>';
    html += PAGES.map(function(p){
      var active = (page === p.id) ? ' active' : '';
      var current = (page === p.id) ? ' aria-current="page"' : '';
      return '<a class="is-page' + active + '"' + current + ' href="' + p.href + '">' + p.label[lang] + '</a>';
    }).join('');

    box.innerHTML = html;
  }

  /* ---------- PROGRESUL, VIZIBIL ÎN ANTET ---------- */
  /* Un singur loc arată unde ai rămas: „🎯 Traseu 4/10”. Se actualizează
     imediat ce bifezi ceva (evenimentul clp:progress pleacă din start.js / map.js). */
  function readProgress(){
    var steps = 0, map = 0, k;
    try{
      var st = JSON.parse(localStorage.getItem('cp_start_v2') || 'null');
      if(st && st.done){ for(k in st.done){ if(Object.prototype.hasOwnProperty.call(st.done, k) && st.done[k]) steps++; } }
    }catch(e){}
    try{
      var m = JSON.parse(localStorage.getItem('cp_map_done') || '[]');
      if(Array.isArray(m)) map = m.length;
    }catch(e){}
    return { steps: Math.min(steps, 10), map: Math.min(map, 8) };
  }

  function initProgressBadge(){
    var actions = document.querySelector('.nav-actions');
    if(!actions) return;
    var pill = document.createElement('a');
    pill.className = 'nav-progress';
    pill.id = 'navProgress';
    pill.href = 'incepe.html#startSteps';
    pill.setAttribute('aria-label', 'Progresul tău salvat');
    pill.hidden = true;
    actions.insertBefore(pill, actions.firstChild);

    function render(){
      var p = readProgress();
      var ro = (lang === 'ro');
      if(!p.steps && !p.map){ pill.hidden = true; return; }
      var word = p.steps ? (ro ? 'Traseu' : 'Path') : (ro ? 'Hartă' : 'Map');
      var num = p.steps ? p.steps : p.map;
      var of = p.steps ? '/10' : '/8';
      pill.innerHTML = '<span aria-hidden="true">\uD83C\uDFAF</span><b>' + num + of + '</b>' +
                       '<span class="np-w"> ' + word + '</span>';
      pill.setAttribute('aria-label', (ro ? 'Progresul tău salvat: ' : 'Your saved progress: ') + word + ' ' + num + of +
        (p.steps ? (ro ? ' — duce la pasul următor' : ' — goes to the next step') : ''));
      var here = document.body.dataset.page || 'index';
      pill.href = p.steps
        ? (here === 'incepe' ? '#startSteps' : 'incepe.html#startSteps')
        : (here === 'index' ? '#harta' : 'index.html#harta');
      pill.hidden = false;
    }
    render();
    document.addEventListener('clp:lang', render);
    document.addEventListener('clp:progress', render);
    window.addEventListener('storage', render);
  }

  /* ---------- „A FOST UTIL?” PE SECȚIUNI ---------- */
  /* Feedback local, fără trackere și fără server: un semnal pentru revizuire. */
  function initFeedback(){
    var secs = document.querySelectorAll('section.doc-sec[id]');
    if(!secs.length) return;
    var store = {};
    try{ store = JSON.parse(localStorage.getItem('cp_feedback') || '{}') || {}; }catch(e){ store = {}; }

    Array.prototype.forEach.call(secs, function(sec){
      if(sec.querySelector('.fb-box')) return;
      var id = sec.id;
      var box = document.createElement('div');
      box.className = 'fb-box';
      box.innerHTML = '<span class="fb-q"></span>' +
        '<button type="button" class="fb-btn" data-v="up"><span aria-hidden="true">\uD83D\uDC4D</span></button>' +
        '<button type="button" class="fb-btn" data-v="down"><span aria-hidden="true">\uD83D\uDC4E</span></button>' +
        '<span class="fb-thx" role="status" aria-live="polite"></span>';
      sec.appendChild(box);

      var q = box.querySelector('.fb-q');
      var thx = box.querySelector('.fb-thx');
      function paint(){
        var ro = (lang === 'ro');
        var v = store[id] || null;
        q.textContent = ro ? 'A fost util?' : 'Was this useful?';
        thx.textContent = v ? (ro ? 'Mulțumim — am notat.' : 'Thanks — noted.') : '';
        Array.prototype.forEach.call(box.querySelectorAll('.fb-btn'), function(b){
          var on = (v === b.dataset.v);
          b.classList.toggle('on', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
          b.setAttribute('aria-label', (b.dataset.v === 'up' ? (ro ? 'Da, mi-a fost util' : 'Yes, useful')
                                                             : (ro ? 'Nu, încă nu e clar' : 'No, not clear yet'))
                                 + ' — ' + (ro ? 'secțiunea ' : 'section ') + id);
        });
      }
      box.addEventListener('click', function(e){
        var b = e.target.closest ? e.target.closest('.fb-btn') : null;
        if(!b) return;
        store[id] = (store[id] === b.dataset.v) ? null : b.dataset.v;
        try{ localStorage.setItem('cp_feedback', JSON.stringify(store)); }catch(err){}
        paint();
      });
      document.addEventListener('clp:lang', paint);
      paint();
    });
  }

  /* ---------- CÂTE REZULTATE ARE O CĂUTARE (citesc și cititoarele de ecran) ---------- */
  /* Fiecare câmp de căutare are `data-search-out` (lista în care apar rezultatele).
     După fiecare tastă numărăm ce a rămas și anunțăm: „7 rezultate” / „Niciun rezultat”. */
  function initSearchCount(){
    if(!document.querySelector('.search')) return;
    var live = document.getElementById('searchLive');
    if(!live){
      live = document.createElement('p');
      live.id = 'searchLive';
      live.className = 'sr-only';
      live.setAttribute('role', 'status');
      live.setAttribute('aria-live', 'polite');
      document.body.appendChild(live);
    }
    document.addEventListener('input', function(e){
      var el = e.target;
      if(!el || !el.classList || !el.classList.contains('search')) return;
      var sel = el.getAttribute('data-search-out');
      if(!sel) return;
      var out = document.querySelector(sel);
      if(!out) return;
      var n = 0, kids = out.children;
      for(var i=0; i<kids.length; i++){
        var c = kids[i];
        if(!c.classList.contains('empty-state') && !c.classList.contains('js-empty')) n++;
      }
      var ro = (lang === 'ro');
      live.textContent = n
        ? (ro ? (n === 1 ? '1 rezultat' : n + ' rezultate') : (n === 1 ? '1 result' : n + ' results'))
        : (ro ? 'Niciun rezultat' : 'No results');
    }, false);
  }

  /* ---------- PRINTARE / PDF, ACASĂ PE PAGINILE DE CONȚINUT ---------- */
  /* Un buton discret, lângă CTA-urile din hero: pagina de teorie, planurile și
     informațiile legale se citesc bine și pe hârtie. Dispare la printare. */
  function initPrintBtn(){
    var page = document.body.dataset.page || 'index';
    if(page === 'index' || page === '404') return;
    var cta = document.querySelector('.hero-cta');
    if(!cta || cta.querySelector('.print-btn')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn btn-ghost print-btn';
    function label(){ b.textContent = (lang === 'ro') ? '\uD83D\uDDA8\uFE0F Printează / PDF' : '\uD83D\uDDA8\uFE0F Print / PDF'; }
    b.addEventListener('click', function(){ window.print(); });
    document.addEventListener('clp:lang', label);
    label();
    cta.appendChild(b);
  }

  /* ---------- HEADER / SCROLL ---------- */
  function initScrollFx(){
    var header = $('.site-header');
    var toTop  = $('.to-top');
    var bar    = $('.read-progress');
    var ticking = false;

    function onScroll(){
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if(header) header.classList.toggle('scrolled', y > 8);
      if(toTop)  toTop.classList.toggle('show', y > 700);
      if(bar){
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function(){
      if(!ticking){ window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive:true });
    onScroll();

    if(toTop) toTop.addEventListener('click', function(){
      window.scrollTo({ top:0, behavior:'smooth' });
    });
  }

  /* Menține linkul activ vizibil în bara de navigare, FĂRĂ să miște pagina.
     Înainte se folosea scrollIntoView(), care pe mobil (nav lipit sus, fix)
     trăgea toată pagina după el — de aici săltările la derulare. */
  function keepLinkVisible(a){
    var nav = $('#navlinks');
    if(!nav || nav.scrollWidth <= nav.clientWidth + 4) return;   // nimic de derulat
    var target = a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2;
    var max = nav.scrollWidth - nav.clientWidth;
    var next = Math.max(0, Math.min(max, target));
    if(Math.abs(nav.scrollLeft - next) > 2) nav.scrollLeft = next;
  }

  /* ---------- CUPRINS (pagini de conținut) ---------- */
  /* .toc a.active exista în CSS, dar nimic nu adăuga clasa: cuprinsul nu
     arăta niciodată unde ești. Acum îl urmărim cu IntersectionObserver. */
  function initToc(){
    var links = $$('.toc a[href^="#"]');
    if(!links.length) return;
    var map = {};
    links.forEach(function(a){
      var id = a.getAttribute('href').slice(1);
      if(id) map[id] = a;
    });
    var sections = Object.keys(map).map(function(id){ return document.getElementById(id); }).filter(Boolean);
    if(!sections.length) return;

    function mark(id){
      links.forEach(function(a){
        var on = (a === map[id]);
        a.classList.toggle('active', on);
        if(on) a.setAttribute('aria-current','true'); else a.removeAttribute('aria-current');
      });
    }
    if(!('IntersectionObserver' in window)){
      mark(sections[0].id); return;
    }
    var visible = {};
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting) visible[e.target.id] = e.intersectionRatio;
        else delete visible[e.target.id];
      });
      var ids = Object.keys(visible);
      if(ids.length){
        ids.sort(function(a,b){ return visible[b] - visible[a]; });
        mark(ids[0]);
      }
    }, { rootMargin:'-20% 0px -70% 0px', threshold:[0,.25,.5,1] });
    sections.forEach(function(s){ io.observe(s); });
    mark(sections[0].id);
  }

  /* ---------- SCROLL-SPY ---------- */
  function initSpy(){
    var links = $$('#navlinks a[data-spy]');
    if(!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function(a){ map[a.dataset.spy] = a; });
    var sections = Object.keys(map).map(function(id){ return document.getElementById(id); }).filter(Boolean);
    if(!sections.length) return;

    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          links.forEach(function(a){ a.classList.remove('active'); });
          var a = map[e.target.id];
          if(a){
            a.classList.add('active');
            keepLinkVisible(a);
          }
        }
      });
    }, { rootMargin:'-30% 0px -60% 0px', threshold:0 });
    sections.forEach(function(s){ observer.observe(s); });
  }

  /* ---------- REVEAL LA SCROLL ---------- */
  function initReveal(){
    var items = $$('.reveal');
    if(!items.length) return;
    if(!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      items.forEach(function(el){ el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin:'0px 0px -8% 0px', threshold:.08 });
    items.forEach(function(el, i){
      el.style.transitionDelay = Math.min(i % 6, 5) * 45 + 'ms';
      io.observe(el);
    });
  }

  /* ---------- MENIU MOBIL (Android + iOS) ---------- */
  function initMobileNav(){
    var btn = $('.nav-toggle');
    var nav = $('#navlinks');
    if(!btn || !nav) return;
    var root = document.documentElement;
    btn.setAttribute('aria-controls','navlinks');
    btn.setAttribute('aria-haspopup','true');

    function isOpen(){ return nav.classList.contains('open'); }
    /* focus: 'first' = deschis de la tastatură | 'back' = la închidere | null = atingere */
    function setOpen(open, focus){
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      /* fără asta, pe iOS pagina de dedesubt se derulează în timp ce meniul e deschis */
      root.classList.toggle('nav-open', open);
      if(open && focus === 'first'){
        var first = nav.querySelector('a');
        if(first){ try{ first.focus({preventScroll:true}); }catch(e){ first.focus(); } }
      }else if(!open && focus === 'back'){
        try{ btn.focus({preventScroll:true}); }catch(e){ btn.focus(); }
      }
    }
    btn.addEventListener('click', function(e){
      /* e.detail === 0 înseamnă Enter/Spațiu, nu deget */
      setOpen(!isOpen(), e.detail === 0 ? 'first' : null);
    });
    nav.addEventListener('click', function(e){
      if(e.target.tagName === 'A' && isOpen()) setOpen(false);
    });
    /* atingerea în afara meniului îl închide (ca într-o aplicație) */
    document.addEventListener('click', function(e){
      if(!isOpen()) return;
      if(nav.contains(e.target) || btn.contains(e.target)) return;
      setOpen(false);
    });
    document.addEventListener('keydown', function(e){
      if((e.key === 'Escape' || e.key === 'Esc') && isOpen()) setOpen(false, 'back');
    });
    /* rotirea telefonului sau o fereastră mai lată închid meniul */
    function closeIfWide(){ if(window.innerWidth > 1080 && isOpen()) setOpen(false); }
    window.addEventListener('resize', closeIfWide);
    window.addEventListener('orientationchange', closeIfWide);
  }

  var refreshTableHints = function(){};

  /* ---------- TABELE LATE PE TELEFON: indicator de derulare ----------
     Tabelele cu multe coloane (școli, costuri, credențiale) se derulează pe
     orizontală pe telefon, dar fără un semn utilizatorul crede că e tăiat.
     Punem un indiciu discret deasupra și o umbră pe muchia din dreapta. */
  function initTableHints(){
    var SEL = '.table-wrap,.start-table-wrap';
    function label(){
      return (lang === 'ro') ? '↔ glisează pentru restul coloanelor' : '↔ swipe for the other columns';
    }
    function atEnd(box){
      if(!box.classList.contains('is-scrollable')) return;
      box.classList.toggle('at-end', box.scrollLeft + box.clientWidth >= box.scrollWidth - 8);
    }
    function sync(){
      $$(SEL).forEach(function(box){
        var scrollable = (box.scrollWidth - box.clientWidth) > 8;
        box.classList.toggle('is-scrollable', scrollable);
        var prev = box.previousElementSibling;
        var hint = (prev && prev.classList && prev.classList.contains('scroll-hint')) ? prev : null;
        if(scrollable && !hint){
          hint = document.createElement('p');
          hint.className = 'scroll-hint';
          hint.setAttribute('aria-hidden','true');
          hint.textContent = label();
          box.parentNode.insertBefore(hint, box);
        }else if(hint){
          if(hint.textContent !== label()) hint.textContent = label();
          if(!scrollable) hint.remove();
        }
        atEnd(box);
      });
    }
    var t = null;
    function later(){ if(t) clearTimeout(t); t = setTimeout(sync, 120); }
    document.addEventListener('scroll', function(e){
      if(e.target && e.target.classList && e.target.classList.contains('is-scrollable')) atEnd(e.target);
    }, true);
    if(window.MutationObserver) new MutationObserver(later).observe(document.body, { childList:true, subtree:true });
    window.addEventListener('resize', later);
    window.addEventListener('orientationchange', later);
    document.addEventListener('clp:lang', later);
    refreshTableHints = sync;
    sync();
  }

  /* ---------- „CONTINUĂ DE UNDE AI RĂMAS” + INSTALARE (PWA) ---------- */
  function initResume(){
    var deferred = null;                 /* evenimentul de instalare (Chrome/Edge/Android) */
    var bar = null;
    var page = document.body.dataset.page || 'index';

    function T(ro, en){ return (lang === 'ro') ? ro : en; }
    function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
    function lsSet(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
    function lsJson(k, dflt){
      try{
        var v = localStorage.getItem(k);
        if(!v) return dflt;
        var o = JSON.parse(v);
        return (o && typeof o === 'object') ? o : dflt;
      }catch(e){ return dflt; }
    }
    function countDone(o){
      var n = 0, k;
      if(!o || typeof o !== 'object') return 0;
      for(k in o){ if(Object.prototype.hasOwnProperty.call(o,k) && o[k]) n++; }
      return n;
    }
    function isStandalone(){
      try{ if(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true; }catch(e){}
      return window.navigator.standalone === true;
    }
    function isIOS(){
      var ua = navigator.userAgent || '';
      if(/iPhone|iPad|iPod/.test(ua)) return true;
      return (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }
    function installReady(){
      if(lsGet('cp_install_hidden')) return false;
      if(isStandalone()) return false;
      return !!deferred || isIOS();
    }

    /* Următorul pas concret al vizitatorului, din progresul salvat local. */
    function nextStep(){
      var st = lsJson('cp_start_v2', null);
      var done = st ? countDone(st.done) : 0;
      if(page !== 'start' && done > 0 && done < 10){
        return { sig:'start:' + done, ico:'\u25B6',
          title:T('Continuă traseul „Începe aici”','Continue the \u201EStart here\u201D path'),
          sub:T('Ai ajuns la pasul ' + (done + 1) + ' din 10','You reached step ' + (done + 1) + ' of 10'),
          href:'incepe.html', label:T('Continuă','Continue') };
      }
      var map = lsJson('cp_map_done', []);
      var nodes = Array.isArray(map) ? map.length : 0;
      if(page !== 'index' && nodes > 0){
        return { sig:'map:' + nodes, ico:'\uD83D\uDDFA',
          title:T('Continuă harta coachingului','Continue the coaching map'),
          sub:T(nodes + ' noduri parcurse', nodes + ' nodes explored'),
          href:'index.html#harta', label:T('Deschide harta','Open the map') };
      }
      var prog = lsJson('cp_progress', null);
      var steps = 0, k;
      if(prog){
        for(k in prog){ if(Object.prototype.hasOwnProperty.call(prog,k) && Array.isArray(prog[k])) steps += prog[k].length; }
      }
      if(page !== 'index' && steps > 0){
        return { sig:'plan:' + steps, ico:'\u2713',
          title:T('Continuă planul tău','Continue your plan'),
          sub:T(steps + ' pași bifați', steps + ' steps ticked'),
          href:'index.html#paths', label:T('Continuă','Continue') };
      }
      return null;
    }

    function build(){
      bar = document.createElement('div');
      bar.className = 'resume-bar';
      bar.id = 'resumeBar';
      bar.innerHTML =
        '<div class="wrap resume-in">' +
          '<span class="resume-ico" aria-hidden="true"></span>' +
          '<span class="resume-txt"><b></b><span></span></span>' +
          '<button class="resume-go" id="resumeGo" type="button"></button>' +
          '<button class="resume-x" id="resumeX" type="button">\u2715</button>' +
        '</div>';
      bar.hidden = true;
      var header = $('.site-header');
      if(!header || !header.parentNode) return false;
      header.parentNode.insertBefore(bar, header.nextSibling);
      bar.querySelector('#resumeX').addEventListener('click', function(){
        lsSet('cp_resume_hidden', bar.dataset.sig || 'all');
        if(bar.dataset.mode === 'install') lsSet('cp_install_hidden','1');
        hide();
      });
      bar.querySelector('#resumeGo').addEventListener('click', function(){
        if(bar.dataset.mode === 'install'){ doInstall(); return; }
        if(bar.dataset.href) location.href = bar.dataset.href;
      });
      return true;
    }
    function hide(){
      if(bar) bar.hidden = true;
      document.documentElement.classList.remove('has-resume');
    }
    function doInstall(){
      if(!deferred) return;
      deferred.prompt();
      if(deferred.userChoice && deferred.userChoice.then){
        deferred.userChoice.then(function(res){
          deferred = null;
          if(res && res.outcome === 'accepted') toast(T('Aplicația a fost instalată','App installed'));
          else lsSet('cp_install_hidden','1');
          render();
        });
      }else{
        deferred = null; render();
      }
    }
    function render(){
      var p = nextStep();
      var inst = installReady();
      var mode = p ? 'progress' : (inst ? 'install' : null);
      if(!mode){ hide(); return; }
      var sig = p ? p.sig : (deferred ? 'install:prompt' : 'install:ios');
      if(lsGet('cp_resume_hidden') === sig){ hide(); return; }
      /* bara se construiește abia când are ceva de spus — fără noduri inutile în pagină */
      if(!bar && !build()) return;
      bar.dataset.sig = sig;
      bar.dataset.mode = mode;
      var ico = bar.querySelector('.resume-ico');
      var ttl = bar.querySelector('.resume-txt b');
      var sub = bar.querySelector('.resume-txt span');
      var go  = bar.querySelector('#resumeGo');
      if(mode === 'progress'){
        ico.textContent = p.ico;
        ttl.textContent = p.title;
        sub.textContent = inst ? p.sub + ' \u00B7 ' + T('poți instala aplicația','you can install the app') : p.sub;
        go.textContent = p.label;
        go.hidden = false;
        bar.dataset.href = p.href;
      }else{
        ico.textContent = '\u2B07';
        ttl.textContent = T('Instalează Coaching Path','Install Coaching Path');
        sub.textContent = deferred
          ? T('Se deschide ca o aplicație, fără bara browserului.','Opens like an app, without the browser bar.')
          : T('Partajează \u2192 Adaugă la ecranul principal.','Share \u2192 Add to Home Screen.');
        go.textContent = T('Instalează','Install');
        go.hidden = !deferred;          /* pe iOS nu există prompt programatic */
        delete bar.dataset.href;
      }
      bar.querySelector('#resumeX').setAttribute('aria-label', T('Ascunde bara','Hide this bar'));
      bar.hidden = false;
      document.documentElement.classList.add('has-resume');
    }

    window.addEventListener('beforeinstallprompt', function(e){
      e.preventDefault();
      deferred = e;
      render();
    });
    window.addEventListener('appinstalled', function(){
      deferred = null;
      lsSet('cp_install_hidden','1');
      render();
    });
    document.addEventListener('clp:lang', function(e){
      lang = (e.detail && e.detail.lang) ? e.detail.lang : lang;
      render();
    });
    render();
  }

  /* ---------- LIMBĂ: buton (doar paginile fără app.js) ---------- */
  function initLang(){
    var btn = $('#langBtn');
    if(!btn) return;
    // index.html are propriul handler în app.js (resetează toate randările)
    if(document.body.dataset.app === 'full') return;
    btn.addEventListener('click', function(){
      lang = (lang === 'ro' ? 'en' : 'ro');
      setLang(lang);
      applyI18n();
      renderNav();
      document.dispatchEvent(new CustomEvent('clp:lang', { detail:{ lang:lang } }));
      toast(lang === 'ro' ? 'Română activată' : 'English on');
    });
  }

  function toast(msg){
    var t = $('#toast');
    if(!t){ return; }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function(){ t.classList.remove('show'); }, 2200);
  }

  /* ---------- FAȚETĂ PUBLICĂ ---------- */
  window.CLP = {
    getLang: getLang,
    setLang: setLang,
    isRo: function(){ return lang === 'ro'; },
    lang: function(){ return lang; },
    applyI18n: applyI18n,
    renderNav: renderNav,
    toast: toast,
    refreshTableHints: function(){ refreshTableHints(); },
    pages: PAGES
  };

  /* ---------- NOTIFICĂRI DISCRETE (offline / versiune nouă) ----------
     Un singur „pill” în josul ecranului, construit doar când are ceva de spus. */
  function pick(ro, en){ return (lang === 'ro') ? ro : en; }
  var note = (function(){
    var el = null, timer = null, kind = null;
    function ensure(){
      if(el) return el;
      el = document.createElement('div');
      el.className = 'app-note';
      el.setAttribute('role','status');
      el.hidden = true;
      el.innerHTML = '<span class="an-txt"></span>' +
                     '<button class="an-act" type="button" hidden></button>' +
                     '<button class="an-x" type="button" aria-label="' + pick('Închide','Close') + '">\u2715</button>';
      el.querySelector('.an-x').addEventListener('click', hide);
      document.body.appendChild(el);
      return el;
    }
    function hide(){
      if(timer){ clearTimeout(timer); timer = null; }
      if(!el) return;
      el.hidden = true;
      kind = null;
      document.documentElement.classList.remove('has-note');
    }
    function show(k, text, actionLabel, onAction, autoHideMs){
      var node = ensure();
      kind = k;
      node.dataset.kind = k;
      node.querySelector('.an-txt').textContent = text;
      var act = node.querySelector('.an-act');
      if(actionLabel){
        act.hidden = false;
        act.textContent = actionLabel;
        act.onclick = function(){ hide(); if(onAction) onAction(); };
      }else{
        act.hidden = true;
        act.onclick = null;
      }
      node.hidden = false;
      document.documentElement.classList.add('has-note');
      if(timer){ clearTimeout(timer); timer = null; }
      if(autoHideMs) timer = setTimeout(hide, autoHideMs);
    }
    return { show: show, hide: hide, current: function(){ return kind; } };
  })();

  function initNotices(){
    window.addEventListener('offline', function(){
      note.show('offline', pick('Ești offline — paginile deja vizitate merg din cache.',
                                'You are offline — pages you already visited load from cache.'));
    });
    window.addEventListener('online', function(){
      if(note.current() === 'offline'){
        note.show('online', pick('Ai revenit online.', 'Back online.'), null, null, 2600);
      }
    });
    if(navigator.onLine === false){
      note.show('offline', pick('Ești offline — paginile deja vizitate merg din cache.',
                                'You are offline — pages you already visited load from cache.'));
    }
  }

  /* ---------- OFFLINE / VITEZĂ LA REVIZITARE ---------- */
  /* Site-ul se declară „fără internet”; un service worker minimal face
     promisiunea adevărată: la a doua vizită paginile se încarcă din cache,
     iar fără rețea site-ul se deschide în continuare. Se activează doar
     pe http/https (nu pe file://) și doar dacă browserul îl suportă. */
  function initOffline(){
    if(!('serviceWorker' in navigator)) return;
    if(location.protocol !== 'http:' && location.protocol !== 'https:') return;
    window.addEventListener('load', function(){
      function offerUpdate(){
        note.show('update', pick('Există o versiune nouă a platformei.', 'A new version of the platform is ready.'),
                  pick('Reîncarcă', 'Reload'), function(){ location.reload(); });
      }
      navigator.serviceWorker.register('sw.js').then(function(reg){
        if(reg.waiting && navigator.serviceWorker.controller) offerUpdate();
        reg.addEventListener('updatefound', function(){
          var w = reg.installing;
          if(!w) return;
          w.addEventListener('statechange', function(){
            if(w.state === 'installed' && navigator.serviceWorker.controller) offerUpdate();
          });
        });
      }).catch(function(){/* fără offline, site-ul merge la fel */});
    });
  }

  /* ---------- INIT ---------- */
  function boot(){
    initTheme();
    applyI18n();
    renderNav();
    initScrollFx();
    initSpy();
    initToc();
    initReveal();
    initMobileNav();
    initResume();
    initTableHints();
    initLang();
    initNotices();
    initProgressBadge();
    initFeedback();
    initPrintBtn();
    initSearchCount();
    initOffline();
    // sincronizare cu schimbarea de limbă făcută de app.js
    document.addEventListener('clp:lang', function(e){
      lang = e.detail.lang;
      applyI18n();
      renderNav();
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  }else{
    boot();
  }
})();
