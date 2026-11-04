// M&E Consulting — small, dependency-free interactions.
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Mobile menu
  var toggle = $('.menu-toggle'), nav = $('#site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Hero slideshow (manual arrows)
  var stage = $('[data-hero]');
  if (stage) {
    var imgs = $$('img', stage), caps = $$('[data-hero-captions] > div'), counter = $('[data-hero-counter]'), i = 0;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var show = function (n) {
      i = (n + imgs.length) % imgs.length;
      imgs.forEach(function (im, k) { im.classList.toggle('active', k === i); });
      caps.forEach(function (c, k) { c.hidden = k !== i; });
      if (counter) counter.textContent = pad(i + 1) + ' / ' + pad(imgs.length);
    };
    var prev = $('[data-hero-prev]'), next = $('[data-hero-next]');
    if (prev) prev.addEventListener('click', function () { show(i - 1); });
    if (next) next.addEventListener('click', function () { show(i + 1); });
  }

  // Market tabs (Projects page) — arrow keys move between tabs, URL hash selects one
  $$('[data-tabs]').forEach(function (root) {
    var tabs = $$('[role="tab"]', root);
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
      if (history.replaceState) history.replaceState(null, '', '#' + tab.getAttribute('aria-controls'));
    };
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          select(tabs[(k + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
        }
      });
    });
    var fromHash = location.hash && tabs.filter(function (t) { return '#' + t.getAttribute('aria-controls') === location.hash; })[0];
    if (fromHash) select(fromHash);
  });

  // Filter buttons (Team departments, Careers offices)
  $$('[data-filter]').forEach(function (root) {
    var btns = $$('[data-filter-value]', root), items = $$('[data-dept]', root);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-filter-value');
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        items.forEach(function (it) { it.hidden = !(v === 'All' || it.getAttribute('data-dept').split('|').indexOf(v) !== -1); });
      });
    });
  });

  // Job listings expand / collapse
  $$('.job-head').forEach(function (h) {
    h.addEventListener('click', function () {
      var open = h.getAttribute('aria-expanded') !== 'true';
      h.setAttribute('aria-expanded', open ? 'true' : 'false');
      var body = document.getElementById(h.getAttribute('aria-controls'));
      if (body) body.hidden = !open;
      var t = $('.toggle', h); if (t) t.textContent = open ? 'HIDE DETAILS −' : 'VIEW DETAILS +';
    });
  });

  // Full-screen photo viewer
  var viewer = $('#viewer');
  var vImg = $('#viewer-img'), vTitle = $('#viewer-title'), vCount = $('#viewer-count'), vThumbs = $('#viewer-thumbs');
  var photos = [], idx = 0, title = '', opener = null;
  var render = function () {
    vImg.src = photos[idx];
    vImg.alt = title + ', photo ' + (idx + 1) + ' of ' + photos.length;
    vCount.textContent = photos.length > 1 ? 'PHOTO ' + (idx + 1) + ' OF ' + photos.length : '';
    $$('button', vThumbs).forEach(function (b, k) { b.setAttribute('aria-pressed', k === idx ? 'true' : 'false'); });
  };
  var openViewer = function (list, start, name, from) {
    photos = list; idx = start || 0; title = name || ''; opener = from || null;
    vTitle.textContent = title;
    viewer.classList.toggle('single', photos.length < 2);
    vThumbs.innerHTML = '';
    photos.forEach(function (src, k) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('aria-label', 'Show photo ' + (k + 1));
      var im = document.createElement('img'); im.src = src; im.alt = ''; b.appendChild(im);
      b.addEventListener('click', function () { idx = k; render(); });
      vThumbs.appendChild(b);
    });
    render();
    viewer.hidden = false;
    document.body.style.overflow = 'hidden';
    $('[data-viewer-close]', viewer).focus();
  };
  var closeViewer = function () {
    viewer.hidden = true;
    document.body.style.overflow = '';
    if (opener) opener.focus();
  };
  if (viewer) {
    $('[data-viewer-close]', viewer).addEventListener('click', closeViewer);
    $('[data-viewer-prev]', viewer).addEventListener('click', function () { idx = (idx - 1 + photos.length) % photos.length; render(); });
    $('[data-viewer-next]', viewer).addEventListener('click', function () { idx = (idx + 1) % photos.length; render(); });
    viewer.addEventListener('click', function (e) { if (e.target === viewer || e.target.classList.contains('viewer-stage')) closeViewer(); });
    viewer.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeViewer();
      else if (e.key === 'ArrowLeft' && photos.length > 1) { idx = (idx - 1 + photos.length) % photos.length; render(); }
      else if (e.key === 'ArrowRight' && photos.length > 1) { idx = (idx + 1) % photos.length; render(); }
      else if (e.key === 'Tab') { // keep focus inside the viewer
        var f = $$('button', viewer).filter(function (b) { return b.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }
  $$('[data-gallery].card-photo').forEach(function (b) {
    b.addEventListener('click', function () {
      try { openViewer(JSON.parse(b.getAttribute('data-gallery')), 0, b.getAttribute('data-title'), b); } catch (e) {}
    });
  });

  // Featured project gallery on the homepage
  var feat = $('[data-feature]');
  if (feat) {
    var list = []; try { list = JSON.parse(feat.getAttribute('data-gallery')); } catch (e) {}
    var fImg = $('[data-feature-img]', feat), cur = 0;
    $$('[data-feature-thumb]', feat).forEach(function (t) {
      t.addEventListener('click', function () {
        cur = +t.getAttribute('data-feature-thumb');
        fImg.src = list[cur];
        $$('[data-feature-thumb]', feat).forEach(function (x) { x.setAttribute('aria-pressed', x === t ? 'true' : 'false'); });
      });
    });
    $('[data-feature-open]', feat).addEventListener('click', function (e) { openViewer(list, cur, feat.getAttribute('data-title'), e.currentTarget); });
  }
})();
