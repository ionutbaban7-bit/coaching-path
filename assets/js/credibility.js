/* ============================================================
   Coaching Learning Path — CREDIBILITATE
   Fiecare secțiune își arată sursele, data verificării și oferă
   o cale directă de raportare a unei greșeli. Bilingv RO/EN.
   ============================================================ */
(function(){
  "use strict";

  var $  = function(s,r){ return (r||document).querySelector(s); };
  var $$ = function(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };
  function L(p){ var l = (window.CLP && window.CLP.lang) ? window.CLP.lang() : 'ro'; return p[(l === 'en') ? 1 : 0]; }

  var VERIFIED = '2026-09-22';
  var VERIFIED_RO = '22 septembrie 2026';

  /* ---------- Surse pe teme ---------- */
  var TOPICS = {
    systems: {
      src:[
        ['ICF', 'https://coachingfederation.org/'],
        ['EMCC Global', 'https://www.emccglobal.org/'],
        ['ANC / MMSS', 'https://www.mmuncii.ro/']
      ]
    },
    paths: {
      src:[
        ['ICF — credencializare', 'https://coachingfederation.org/credentialing-landing'],
        ['EMCC — EIA', 'https://www.emccglobal.org/accreditation/eia/'],
        ['ANC — standard ocupațional', 'https://www.anc.edu.ro/']
      ]
    },
    transitions: {
      src:[
        ['ICF — rute de aplicare', 'https://coachingfederation.org/credentialing-landing'],
        ['ICF Education Search', 'https://apps.coachingfederation.org/eweb/DynamicPage.aspx?webcode=ESS']
      ]
    },
    credentials: {
      src:[
        ['ICF — tipuri de credențiale', 'https://coachingfederation.org/credentials-and-standards'],
        ['EMCC — acreditări', 'https://www.emccglobal.org/accreditation/'],
        ['COR 242412', 'https://www.rubinian.com/cor/242412-specialist-activitatea-de-coaching']
      ]
    },
    schools: {
      src:[
        ['ICF Education Search (director global)', 'https://apps.coachingfederation.org/eweb/DynamicPage.aspx?webcode=ESS'],
        ['ICF România', 'https://www.coachingfederation.ro/'],
        ['Registrul furnizorilor ANC', 'https://www.anc.edu.ro/']
      ]
    },
    costs: {
      src:[
        ['ICF — taxe de aplicare', 'https://coachingfederation.org/credentialing-landing'],
        ['EMCC — taxe', 'https://www.emccglobal.org/accreditation/']
      ],
      note:['Taxele afișate sunt orientative, nu o ofertă. Cere mereu ofertă scrisă de la furnizor.',
            'The fees shown are indicative, not an offer. Always request a written quote from the provider.']
    },
    journey: {
      src:[['ICF — cerințe ACC/PCC/MCC', 'https://coachingfederation.org/credentials-and-standards']]
    },
    faq: {
      src:[['ICF — întrebări frecvente', 'https://coachingfederation.org/']]
    },
    start: {
      src:[
        ['ICF — credențializare', 'https://coachingfederation.org/credentialing/'],
        ['ICF — mentor coaching', 'https://coachingfederation.org/education-professional-development/find-professional-development/mentor-coaching/'],
        ['ICF — specializări (MCS, CSS)', 'https://coachingfederation.org/blog/introducing-the-mentor-coach-specialization/'],
        ['EMCC — ghid de supervizare', 'https://www.emccglobal.org/leadership-development/supervision/guidelines/'],
        ['ICF — standarde de acreditare a școlilor', 'https://coachingfederation.org/for-coach-educators/icf-accreditation/accreditation-standards/']
      ]
    },
    theory: {
      src:[
        ['ICF — definiția coachingului', 'https://coachingfederation.org/about-icf'],
        ['ICF — competențe și cod etic', 'https://coachingfederation.org/credentials-and-standards'],
        ['EMCC — cod etic', 'https://www.emccglobal.org/ethics/']
      ]
    },
    individual: {
      src:[
        ['ICF — competențe de bază', 'https://coachingfederation.org/credentials-and-standards'],
        ['ICF — jurnalul de ore', 'https://coachingfederation.org/credentialing-landing']
      ]
    },
    team: {
      src:[
        ['ICF — ACTC', 'https://coachingfederation.org/credentials-and-standards/team-coaching-credentials'],
        ['EMCC — ITCA', 'https://www.emccglobal.org/accreditation/itca/']
      ]
    }
  };

  /* ---------- Randare ---------- */
  function render(){
    $$('[data-verify]').forEach(function(el){
      var key = el.getAttribute('data-verify');
      var t = TOPICS[key];
      if(!t) return;
      if(el.dataset.vdone === '1') return;
      el.dataset.vdone = '1';

      el.classList.add('verify-strip');
      el.innerHTML =
        '<span class="vs-ic" aria-hidden="true">🛡️</span>' +
        '<div class="vs-body">' +
          '<div class="vs-line">' +
            '<b>' + L(['Verificat la ', 'Verified on ']) + VERIFIED_RO + '</b>' +
            '<span class="vs-sep">·</span>' +
            '<span>' + L(['surse oficiale:', 'official sources:']) + '</span>' +
            (t.src || []).map(function(s){
              return '<a href="' + s[1] + '" target="_blank" rel="noopener">' + s[0] + ' ↗</a>';
            }).join('') +
          '</div>' +
          (t.note ? '<div class="vs-note">' + L(t.note) + '</div>' : '') +
        '</div>' +
        '<span class="verify-note">' + L(['Canalul public de corecții este în pregătire.','The public corrections channel is being prepared.']) + '</span>';
    });
  }

  /* ---------- Școală: link de verificare ---------- */
  function verificationLinks(s){
    var q = encodeURIComponent(s.n);
    return '' +
      '<a class="vlink" href="https://apps.coachingfederation.org/eweb/DynamicPage.aspx?webcode=ESS" target="_blank" rel="noopener" ' +
        'title="' + L(['Caută programul în directorul oficial ICF','Search the programme in the official ICF directory']) + '">ICF ↗</a>' +
      '<a class="vlink" href="https://www.google.com/search?q=' + q + '" target="_blank" rel="noopener" ' +
        'title="' + L(['Caută școala pe web','Search the school on the web']) + '">web ↗</a>';
  }

  function boot(){
    render();
    document.addEventListener('clp:lang', render);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.CRED = {
    render: render,
    verified: VERIFIED,
    verifiedRo: VERIFIED_RO,
    verificationLinks: verificationLinks,
    topics: TOPICS
  };
})();
