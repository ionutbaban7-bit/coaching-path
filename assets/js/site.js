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
      return '<a class="is-page' + active + '" href="' + p.href + '">' + p.label[lang] + '</a>';
    }).join('');

    box.innerHTML = html;
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
            // menține linkul activ vizibil în nav-ul cu scroll orizontal
            if(a.scrollIntoView) a.scrollIntoView({ block:'nearest', inline:'nearest' });
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

  /* ---------- MENIU MOBIL ---------- */
  function initMobileNav(){
    var btn = $('.nav-toggle');
    var nav = $('#navlinks');
    if(!btn || !nav) return;
    btn.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function(e){
      if(e.target.tagName === 'A'){
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded','false');
      }
    });
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
    pages: PAGES
  };

  /* ---------- INIT ---------- */
  function boot(){
    initTheme();
    applyI18n();
    renderNav();
    initScrollFx();
    initSpy();
    initReveal();
    initMobileNav();
    initLang();
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
