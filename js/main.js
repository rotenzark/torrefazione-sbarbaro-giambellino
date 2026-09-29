/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'torrefazione-sbarbaro-giambellino',
    /* niente WhatsApp finché non confermano: il cellulare della scheda (chiamata) */
    whatsapp: {
      number: '',
      message: '',
      ids: [],
    },
    /* Google (29/9/2026): lunedì–venerdì 6:30–19, sabato 7–13 e 15:15–19, domenica chiuso */
    hours: {
      0: [],
      1: [['06:30', '19:00']],
      2: [['06:30', '19:00']],
      3: [['06:30', '19:00']],
      4: [['06:30', '19:00']],
      5: [['06:30', '19:00']],
      6: [['07:00', '13:00'], ['15:15', '19:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1040,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Sbarbaro e Visigalli, coffee roaster, bar and sweets: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.miscele": "The blends",
      "n.caramelle": "The sweets",
      "n.bar": "The bar",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "n.domande": "Questions",
      "t.chiama": "Call",
      "t.arrivare": "How to get there",
      "t.indicazioni": "Directions",
      "h.sopra": "Coffee roaster · bar · sweets · Via Giambellino 5, Milan",
      "h.t1": "The best blends",
      "h.t2": "of coffee",
      "h.testo": "At the start of Via Giambellino, a few steps from Piazza Napoli and the number 14 tram: coffee in glass bins, as beans or ground for the moka pot, loose sweets in jars, breakfast at the counter from half past six.",
      "h.chi": "Giulia Ubaldi, on Scatti di Gusto (2017)",
      "h.google": "on Google, 32 reviews",
      "p.titolo": "Custom packs",
      "p.desc": "On the granite counter, a cellophane bag: the sweets fall in one by one, the neck is gathered and the golden ribbon is tied and curled. Lollipops, sweets or chocolates, like the packs they make in the shop.",
      "p.d0": "Lollipop, jellies and marshmallows, with the golden ribbon: like theirs.",
      "p.d1": "The loose sweets from the jars, wrapped.",
      "p.d2": "Chocolates in coloured foil.",
      "p.modi": "Which pack to make",
      "p.b0": "Lollipops",
      "p.b1": "Sweets",
      "p.b2": "Chocolates",
      "s.etichetta": "The blends",
      "s.titolo": "Eight bins, eight blends",
      "s.loro": "«We carefully select the best beans and roast them by hand to bring out every aroma, every note, every nuance.»",
      "s.chi": "from their Instagram (translated from Italian)",
      "s.testo": "Behind the counter, a wall of glass bins in wooden frames, with steel dispensers and a tag hanging from a little chain: coffee is sold as beans or ground for the moka pot. The price per kilo is on the tag, in the shop.",
      "s.lista": "The blends on the tags of the bins",
      "s.miscela": "Coffee blend",
      "s.deca": "Decaf",
      "a.silos": "The pale blue sign «Le migliori miscele di caffè» in burgundy script, with coffee beans in place of the o’s, above the wall of eight glass bins full of beans, with tags and steel dispensers.",
      "c.silos": "The sign and the bins, behind the counter.",
      "c2.etichetta": "The sweets",
      "c2.titolo": "Loose in jars, or with a golden ribbon",
      "c2.sotto": "Loose sweets in glass jars, jellies, lollipops, chocolates; at Easter, wrapped eggs in the window. And their custom packs: the cellophane bag with a lollipop, jellies and marshmallows, tied with a curled golden ribbon.",
      "a.sacchetti": "A row of cellophane bags on the granite counter, each with a disc lollipop, jellies and a curled golden ribbon.",
      "c.sacchetti": "The custom packs, on the counter.",
      "a.lecca": "A bag with an orange lollipop, sugared jellies and marshmallows, on the granite.",
      "c.lecca": "Orange.",
      "a.ananas": "A bag with a pineapple-pattern lollipop and the golden ribbon.",
      "c.ananas": "Pineapple.",
      "a.uova": "Easter eggs wrapped in wavy purple and orange paper, in the window.",
      "c.uova": "At Easter, the eggs in the window.",
      "b.etichetta": "The bar",
      "b.titolo": "From half past six, at the counter or at a table",
      "b.sotto": "Breakfast, coffee at the counter, hot chocolate; tables inside, under the wall of sweets, and outside on the pavement. Outside there is also their little car: «Stiamo consegnando dolcezze per voi» (we’re delivering sweetness to you).",
      "a.sala": "The room: the wooden wall with sweets in glass jars and Easter eggs on top, the tables with golden tablecloths and aluminium chairs.",
      "c.sala": "The room, under the wall of sweets.",
      "a.fuori": "The shop from outside: the two signs «Torrefazione Caffè & Caramelle», the striped awnings, the windows and the tables on the pavement.",
      "c.fuori": "From outside: «Torrefazione Caffè &amp; Caramelle».",
      "a.frolle": "Shortcrust tarts with jam in paper cups.",
      "c.frolle": "The shortcrust tarts with jam.",
      "a.ami": "A small grey car with «Torrefazione Sbarbaro · Stiamo consegnando dolcezze per voi» written on the rear window.",
      "c.ami": "Their «caffè mobile».",
      "d.etichetta": "Reviews",
      "d.titolo": "An old-style bar",
      "d.google": "on Google, 32 reviews",
      "d.g3a": "Google, 3 years ago",
      "d.g1a": "Google, a year ago",
      "d.g11m": "Google, 11 months ago",
      "d.g3s": "Google, 3 weeks ago",
      "d.nota": "From the reviews on Google, as they were written (in Italian). The line at the top comes from Scatti di Gusto, «Guide to 11 must-visit addresses in the Giambellino» (2017).",
      "d.tutte": "All the reviews on Google",
      "o.etichetta": "Hours and where",
      "o.titolo": "From half past six, Monday to Saturday",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "o.chiuso": "closed",
      "o.mappa": "Map: Torrefazione Sbarbaro e Visigalli, Via Giambellino 5, Milan",
      "o.dove": "Where",
      "o.dovev": "Via Giambellino 5, 20146 Milan, a few steps from Piazza Napoli",
      "o.tram": "By tram",
      "o.tramv": "The 14 in Piazza Napoli, about 100 metres away",
      "o.bus": "By trolleybus",
      "o.busv": "The 90 and 91 in Piazza Napoli, about 150 metres away",
      "o.metro": "By metro",
      "o.metrov": "M4 Bolivar or Tolstoj, about 400 metres away",
      "o.tel": "Phone",
      "q.etichetta": "Questions",
      "q.titolo": "Before you drop by",
      "q.1": "Do you sell coffee to take home?",
      "q.1r": "Yes: the blends from the bins, as beans or ground for the moka pot.",
      "q.2": "Do you make packs of sweets?",
      "q.2r": "Yes: their custom packs, bags of sweets and lollipops tied with the golden ribbon. To ask, call +39 329 565 9174.",
      "q.3": "Are you open on Saturdays?",
      "q.3r": "Yes: from 7 am to 1 pm and from 3:15 to 7 pm. Closed on Sundays.",
      "q.4": "Can I have breakfast?",
      "q.4r": "Yes, from 6:30 am Monday to Friday: at the counter or at a table.",
      "q.5": "How do I get there?",
      "q.5r": "Via Giambellino 5, a few steps from Piazza Napoli: the 14 tram stops about 100 metres away, trolleybuses 90 and 91 about 150; M4 Bolivar and Tolstoj are about 400 metres away.",
      "f2.sotto": "Coffee roaster · bar · sweets",
      "f2.orario": "Monday to Friday 6:30 am–7 pm · Saturday 7 am–1 pm and 3:15–7 pm · closed on Sundays",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photos are of the shop, from their Google listing and their Instagram (one by a customer); hours and reviews from Google (September 2026). We drew the bag and the sweets ourselves.",
      "f2.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ SBARBARO E VISIGALLI — «Le migliori miscele di caffè» ══════════
     La pagina è la loro bottega: il legno d'acero, l'insegna azzurro ghiaccio col corsivo bordeaux, i cartellini kraft, il granito.
     la FIRMA — «confezioni personalizzate»: sul banco di granito un sacchetto di cellophane aperto; le caramelle cadono dentro una alla
     volta (e rimbalzano un poco), il collo si stringe a ventaglio, il nastro dorato si annoda e i riccioli si srotolano. Tre confezioni:
     Lecca-lecca, Caramelle, Cioccolatini. Lo stato è M (la confezione), F (il riempimento 0…1), G (il collo 0…1), N (il nastro 0…1) e
     V (il sacchetto: 0 al suo posto, fino a 1 consegnato — scivola via a destra —, da −1 a 0 ne scende uno nuovo). Senza JS e alla fine:
     Lecca-lecca, F = G = N = 1, V = 0 (l'HTML). L'attesa (classe nell'head): il sacchetto aperto e vuoto nello stesso posto. Scegliere
     una confezione: il sacchetto pronto si consegna e ne scende uno vuoto (se è ancora vuoto, niente da consegnare). Reduced-motion:
     tutto subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[480,540],"aperto":[150,452,150,300,150,230,150,150,150,72,190,72,240,72,290,72,330,72,330,150,330,230,330,300,330,452],"chiuso":[150,452,150,300,150,262,224,234,228,196,176,104,240,122,304,104,252,196,256,234,330,262,330,300,330,452],"tempi":{"inizio":300,"riempi":1700,"pausa":120,"chiudi":520,"nastro":1100,"consegna":420,"arriva":360,"riempiV":1250,"chiudiV":420,"nastroV":850,"caduta":-90,"rimbalzo":0.06,"nodo":0.12,"ricciDa":0.14,"ricciPasso":0.07,"ricciDura":0.5,"via":250,"su":40},"ricci":6,"confezioni":[{"nome":"Lecca-lecca","pezzi":[{"x":240,"y":256,"r":-3,"r0":-63,"t":0,"d":0.24},{"x":173,"y":422.6,"r":-4,"r0":56,"t":0.1,"d":0.2},{"x":219.1,"y":423,"r":-16,"r0":-76,"t":0.188,"d":0.2},{"x":263.5,"y":422.3,"r":-16,"r0":44,"t":0.275,"d":0.2},{"x":304.3,"y":424.6,"r":20,"r0":-40,"t":0.362,"d":0.2},{"x":187.4,"y":404.2,"r":-1,"r0":59,"t":0.45,"d":0.2},{"x":239.9,"y":401.9,"r":22,"r0":-38,"t":0.538,"d":0.2},{"x":292.7,"y":404.7,"r":-15,"r0":45,"t":0.625,"d":0.2},{"x":205.4,"y":382.4,"r":-2,"r0":-62,"t":0.712,"d":0.2},{"x":270.4,"y":383.9,"r":-16,"r0":44,"t":0.8,"d":0.2}]},{"nome":"Caramelle","pezzi":[{"x":187.7,"y":425.3,"r":10,"r0":-50,"t":0,"d":0.2},{"x":212.4,"y":422.3,"r":-18,"r0":42,"t":0.1,"d":0.2},{"x":242.8,"y":424,"r":11,"r0":-49,"t":0.154,"d":0.2},{"x":266.5,"y":424.5,"r":12,"r0":72,"t":0.208,"d":0.2},{"x":291.4,"y":423,"r":5,"r0":-55,"t":0.262,"d":0.2},{"x":191.7,"y":404.7,"r":-16,"r0":44,"t":0.315,"d":0.2},{"x":223.6,"y":402,"r":22,"r0":-38,"t":0.369,"d":0.2},{"x":256.7,"y":405.3,"r":-17,"r0":43,"t":0.423,"d":0.2},{"x":285.3,"y":405,"r":-11,"r0":-71,"t":0.477,"d":0.2},{"x":204.2,"y":384.6,"r":5,"r0":65,"t":0.531,"d":0.2},{"x":238.3,"y":381.2,"r":-12,"r0":-72,"t":0.585,"d":0.2},{"x":278.8,"y":381.3,"r":-20,"r0":40,"t":0.638,"d":0.2},{"x":215.4,"y":362.6,"r":-1,"r0":-61,"t":0.692,"d":0.2},{"x":261.4,"y":363.5,"r":17,"r0":77,"t":0.746,"d":0.2},{"x":240.5,"y":340.2,"r":15,"r0":-45,"t":0.8,"d":0.2}]},{"nome":"Cioccolatini","pezzi":[{"x":177.9,"y":420.1,"r":0,"r0":-60,"t":0,"d":0.2},{"x":205.2,"y":419.5,"r":6,"r0":66,"t":0.1,"d":0.2},{"x":242.4,"y":419.4,"r":5,"r0":-55,"t":0.17,"d":0.2},{"x":272.6,"y":423,"r":0,"r0":60,"t":0.24,"d":0.2},{"x":305.8,"y":421.6,"r":1,"r0":-59,"t":0.31,"d":0.2},{"x":191.8,"y":396.7,"r":21,"r0":81,"t":0.38,"d":0.2},{"x":224.9,"y":394,"r":-2,"r0":-62,"t":0.45,"d":0.2},{"x":255.7,"y":397,"r":-16,"r0":44,"t":0.52,"d":0.2},{"x":292.1,"y":393.4,"r":18,"r0":-42,"t":0.59,"d":0.2},{"x":213.1,"y":369,"r":21,"r0":81,"t":0.66,"d":0.2},{"x":267.3,"y":371.2,"r":12,"r0":-48,"t":0.73,"d":0.2},{"x":237.3,"y":342.4,"r":-9,"r0":51,"t":0.8,"d":0.2}]}]};
  var prendi = function (id) { return document.getElementById(id); };
  var figuraS = prendi('sacchetto'), svgS = prendi('sacchettoSvg'), tuttoS = prendi('sacchettoTutto'), filmS = prendi('sacchettoFilm'), nodoS = prendi('sacchettoNodo'), leggiS = prendi('sacchettoLeggi');
  var BOTTONI = [].slice.call(document.querySelectorAll('.tavolo__modi button[data-modo]'));
  var TS = DATI.tempi, CONF = DATI.confezioni;
  var perIndice = function (a, b) { return +a.getAttribute('data-i') - +b.getAttribute('data-i'); };
  var perK = function (a, b) { return +a.getAttribute('data-k') - +b.getAttribute('data-k'); };
  var RICCI = svgS ? [].slice.call(svgS.querySelectorAll('.nastro__riccio')).sort(perK) : [];
  var LUCI = svgS ? [].slice.call(svgS.querySelectorAll('.nastro__luce')).sort(perK) : [];
  var PEZZI = CONF.map(function (C, k) {
    var g = prendi('sacchettoPezzi' + k);
    return g ? [].slice.call(g.querySelectorAll('.pezzo')).sort(perIndice) : null;
  });
  var faseS = 'fatta', modoS = '', rafS = 0, guardiaS = 0, larghezzaAvvioS = 0, corseS = 0, pianoS = null;
  var MS = 0, FS = 1, GS = 1, NS = 1, VS = 0;
  var destinazioneS = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  /* il profilo del sacchetto: gli stessi comandi dell'HTML, i numeri fra aperto e chiuso */
  function pelle(n) {
    return 'M' + n[0] + ' ' + n[1] + ' L' + n[2] + ' ' + n[3] + ' C' + n[4] + ' ' + n[5] + ', ' + n[6] + ' ' + n[7] + ', ' + n[8] + ' ' + n[9] +
      ' L' + n[10] + ' ' + n[11] + ' L' + n[12] + ' ' + n[13] + ' L' + n[14] + ' ' + n[15] + ' L' + n[16] + ' ' + n[17] +
      ' C' + n[18] + ' ' + n[19] + ', ' + n[20] + ' ' + n[21] + ', ' + n[22] + ' ' + n[23] + ' L' + n[24] + ' ' + n[25] + ' Z';
  }
  function profilo(g) {
    if (g >= 1) return pelle(DATI.chiuso);
    if (g <= 0) return pelle(DATI.aperto);
    return pelle(DATI.aperto.map(function (a, i) { return r3(a + (DATI.chiuso[i] - a) * g); }));
  }
  /* la caduta di un pezzo: accelera fino al mucchio, poi un piccolo rimbalzo */
  function caduta(p) { return p < 0.7 ? (p / 0.7) * (p / 0.7) : 1 - TS.rimbalzo * Math.sin(Math.PI * (p - 0.7) / 0.3); }
  function pezzoS(el, q, p) {
    if (p >= 1) { el.removeAttribute('opacity'); el.setAttribute('transform', 'translate(' + q.x + ' ' + q.y + ') rotate(' + q.r + ')'); return; }
    if (p <= 0) { el.setAttribute('opacity', '0'); el.setAttribute('transform', 'translate(' + q.x + ' ' + TS.caduta + ') rotate(' + q.r0 + ')'); return; }
    el.removeAttribute('opacity');
    var y = TS.caduta + (q.y - TS.caduta) * caduta(p), r = q.r0 + (q.r - q.r0) * Math.min(1, p / 0.7);
    el.setAttribute('transform', 'translate(' + q.x + ' ' + r3(y) + ') rotate(' + r3(r) + ')');
  }
  function annunciaS(m) {
    var el = document.querySelector('.tavolo__d[data-m="' + m + '"]');
    if (leggiS) leggiS.textContent = el ? el.textContent : '';
  }
  /* il disegno dello stato: allo stato finale nessun attributo in più di quelli dell'HTML */
  function disegnaS(m, f, g, n, v) {
    if (m !== MS || figuraS.getAttribute('data-modo') !== String(m)) {
      MS = m;
      figuraS.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    FS = f; GS = g; NS = n; VS = v;
    PEZZI.forEach(function (P, k) {
      var Q = CONF[k].pezzi;
      P.forEach(function (el, i) { pezzoS(el, Q[i], k === m ? c01((f - Q[i].t) / Q[i].d) : 1); });
    });
    if (v === 0) { tuttoS.removeAttribute('transform'); tuttoS.removeAttribute('opacity'); }
    else if (v > 0) { tuttoS.setAttribute('transform', 'translate(' + r3(TS.via * v) + ' 0)'); tuttoS.setAttribute('opacity', String(r3(1 - v))); }
    else { tuttoS.setAttribute('transform', 'translate(0 ' + r3(TS.su * v) + ')'); tuttoS.setAttribute('opacity', String(r3(1 + v))); }
    filmS.setAttribute('d', profilo(g));
    var o = c01(n / TS.nodo);
    if (o >= 1) nodoS.removeAttribute('opacity'); else nodoS.setAttribute('opacity', o <= 0 ? '0' : String(r3(o)));
    RICCI.forEach(function (el, k) {
      var c = c01((n - TS.ricciDa - k * TS.ricciPasso) / TS.ricciDura), off = c >= 1 ? '0' : String(r3(1 - c));
      el.setAttribute('stroke-dashoffset', off);
      if (LUCI[k]) LUCI[k].setAttribute('stroke-dashoffset', off);
    });
  }
  /* un piano: tratti { da, a, m, x0: {f, g, n, v}, x1: {…}, curva } */
  function fotogrammaS(t) {
    var P = pianoS.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaS(cur.m, A.f + (B.f - A.f) * e, A.g + (B.g - A.g) * e, A.n + (B.n - A.n) * e, A.v + (B.v - A.v) * e);
  }
  var st4 = function (f, g, n, v) { return { f: f, g: g, n: n, v: v }; };
  /* riempire, chiudere e annodare la confezione m, dal sacchetto vuoto */
  function pianoConfeziona(t, m, veloce) {
    var P = [], riempi = veloce ? TS.riempiV : TS.riempi, chiudi = veloce ? TS.chiudiV : TS.chiudi, nastro = veloce ? TS.nastroV : TS.nastro;
    P.push({ da: t, a: t + riempi, m: m, x0: st4(0, 0, 0, 0), x1: st4(1, 0, 0, 0), curva: 'lineare' }); t += riempi;
    P.push({ da: t, a: t + TS.pausa, m: m, x0: st4(1, 0, 0, 0), x1: st4(1, 0, 0, 0), curva: 'lineare' }); t += TS.pausa;
    P.push({ da: t, a: t + chiudi, m: m, x0: st4(1, 0, 0, 0), x1: st4(1, 1, 0, 0), curva: 'dolce' }); t += chiudi;
    P.push({ da: t, a: t + nastro, m: m, x0: st4(1, 1, 0, 0), x1: st4(1, 1, 1, 0), curva: 'lineare' }); t += nastro;
    return { piano: P, fine: t };
  }
  function sorvegliaS() { clearTimeout(guardiaS); guardiaS = setTimeout(chiudiS, 1500); }
  function chiudiS() {
    cancelAnimationFrame(rafS); rafS = 0;
    clearTimeout(guardiaS);
    disegnaS(destinazioneS.m, 1, 1, 1, 0);
    if (figuraS) figuraS.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseS = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): il sacchetto si ferma dov'è (#244); dall'attesa lo stato è il sacchetto vuoto */
  function fermaS() {
    cancelAnimationFrame(rafS); rafS = 0;
    clearTimeout(guardiaS);
    if (root.classList.contains('firma-attesa')) { disegnaS(MS, 0, 0, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaS(MS, FS, GS, NS, VS);
    if (figuraS) figuraS.setAttribute('data-firma', 'fatta');
    faseS = 'fatta';
  }
  function avviaS(modo, piano) {
    cancelAnimationFrame(rafS); rafS = 0;
    modoS = modo; pianoS = piano;
    root.classList.remove('firma-attesa');
    faseS = 'corre'; if (figuraS) figuraS.setAttribute('data-firma', 'corre');
    larghezzaAvvioS = window.innerWidth;
    var t0 = null, corsa = ++corseS;
    function fotogramma(ts) {
      rafS = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseS !== 'corre' || corsa !== corseS) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaS(t);
      if (t >= pianoS.fine) { chiudiS(); return; }
      sorvegliaS();
      rafS = requestAnimationFrame(fotogramma);
    }
    sorvegliaS();
    rafS = requestAnimationFrame(fotogramma);
  }
  function avviaIntroS() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: il sacchetto aperto e vuoto, senza nastro */
    disegnaS(0, 0, 0, 0, 0);
    destinazioneS = { m: 0 };
    var resto = pianoConfeziona(TS.inizio, 0, false);
    avviaS('intro', { piano: [{ da: 0, a: TS.inizio, m: 0, x0: st4(0, 0, 0, 0), x1: st4(0, 0, 0, 0), curva: 'lineare' }].concat(resto.piano), fine: resto.fine });
  }
  /* il gesto: scegliere una confezione. Se è quella che si sta già preparando, niente; altrimenti il sacchetto si ferma dov'è, se c'è
     dentro qualcosa si consegna (scivola via) e ne scende uno vuoto; poi si riempie, si chiude e si annoda. */
  function sceltaS(m) {
    if (faseS === 'corre' && destinazioneS.m === m) return;
    if (faseS === 'corre' || root.classList.contains('firma-attesa')) fermaS();
    destinazioneS = { m: m };
    annunciaS(m);
    if (reducedMotion) { chiudiS(); return; }
    var P = [], t = 0, mm = MS, a = st4(FS, GS, NS, VS);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v > 0 || (a.v === 0 && (a.f > 0 || a.g > 0 || a.n > 0))) {
      passo(TS.consegna, mm, st4(a.f, a.g, a.n, 1), 'dolce');
      a = st4(0, 0, 0, -1);
    }
    if (a.v < 0) passo(TS.arriva, m, st4(0, 0, 0, 0), 'dolce');
    var resto = pianoConfeziona(t, m, true);
    avviaS('confeziona', { piano: P.concat(resto.piano), fine: resto.fine });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra i cartellini dei giorni */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* il sacchetto è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alto della finestra); l'altezza è
     quella del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaS() { var r = svgS.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraS && svgS && tuttoS && filmS && nodoS && RICCI.length === DATI.ricci && BOTTONI.length === CONF.length && PEZZI.every(Boolean)) {
    try { clearTimeout(window.__attesaSacchetto); } catch (e) {}
    window.__sacchetto = {
      stato: function () {
        return { fase: faseS, modo: modoS, corse: corseS, m: MS, f: FS, g: GS, n: NS, v: VS, meta: destinazioneS.m };
      },
      tempi: TS,
    };
    var daFareS = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraS = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaS();
    /* perché la firma è partita o no (lo legge il check) */
    window.__sacchetto.avvio = { daFare: daFareS, ancora: !!ancoraS, inVista: inVista, top: svgS.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareS || ancoraS) chiudiS();
    else if (inVista) avviaIntroS();
    else if ('IntersectionObserver' in window) {
      /* il sacchetto sotto la piega (telefoni): parte quando se ne vede abbastanza; fino ad allora resta aperto e vuoto */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioS = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioS.disconnect();
        if (faseS === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroS();
      }, { threshold: soglie });
      ioS.observe(svgS);
      window.__sacchetto.avvio.aspetta = true;
    } else chiudiS();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseS !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioS) <= 1) return;
      chiudiS();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaS(+b.getAttribute('data-modo')); }); });
  }
})();
