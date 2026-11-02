/* editorial-beads.js — fios de miçanga em SVG (macarrão de miçanga)
   Beads.strand(svg, { d, n, r, seed, text, thread, threadW, pal }) -> controller
   controller: { g, len, n, setP(p), at(p) -> {x,y,a}, p } */
(function () {
  var NS = 'http://www.w3.org/2000/svg', uid = 0;
  var PAL = ['#FF5BC0', '#14B1FF', '#3DE877', '#FFCB1F', '#8C52FF', '#FF7A3D', '#F4FF7A', '#FFFFFF', '#FF4D6D', '#2FD0B5', '#FFB3DA', '#B6A4FF'];
  var LET = 'NEBULOSA';

  function rng(seed) { var s = (seed || 7) >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function ease(t) { return t * t * (3 - 2 * t); }
  function defs(svg) {
    if (svg.__bd) return svg.__bd;
    var id = 'bd' + (++uid), d = svg.querySelector('defs') || el('defs', {}, svg);
    var rg = el('radialGradient', { id: id + 'p', cx: '35%', cy: '30%', r: '75%' }, d);
    el('stop', { offset: '0', 'stop-color': '#FFFFFF' }, rg); el('stop', { offset: '.65', 'stop-color': '#F3EAF0' }, rg); el('stop', { offset: '1', 'stop-color': '#CDBFCB' }, rg);
    return (svg.__bd = id);
  }

  function bead(kind, c, rr, ink, letter, id) {
    var g = el('g', {});
    if (kind === 'pearl') {
      el('circle', { r: rr, fill: 'url(#' + id + 'p)', stroke: 'rgba(60,30,50,.25)', 'stroke-width': .8 }, g);
      el('circle', { cx: -rr * .32, cy: -rr * .36, r: rr * .24, fill: '#fff', opacity: .9 }, g);
    } else if (kind === 'disc') {
      el('ellipse', { rx: rr * .5, ry: rr * 1.08, fill: c, stroke: 'rgba(40,10,40,.28)', 'stroke-width': .9 }, g);
      el('ellipse', { cx: -rr * .1, cy: -rr * .4, rx: rr * .14, ry: rr * .34, fill: '#fff', opacity: .55 }, g);
    } else if (kind === 'cube') {
      el('rect', { x: -rr * .95, y: -rr * .95, width: rr * 1.9, height: rr * 1.9, rx: rr * .3, fill: c, stroke: 'rgba(40,10,40,.3)', 'stroke-width': .9 }, g);
      var t = el('text', { x: 0, y: rr * .42, 'text-anchor': 'middle', 'font-family': 'Bricolage Grotesque,sans-serif', 'font-weight': 800, 'font-size': rr * 1.25, fill: ink }, g);
      t.textContent = letter;
    } else if (kind === 'flower') {
      for (var i = 0; i < 5; i++) { var a = i / 5 * Math.PI * 2; el('circle', { cx: Math.cos(a) * rr * .62, cy: Math.sin(a) * rr * .62, r: rr * .45, fill: c, stroke: 'rgba(40,10,40,.25)', 'stroke-width': .7 }, g); }
      el('circle', { r: rr * .38, fill: '#FFCB1F', stroke: 'rgba(40,10,40,.25)', 'stroke-width': .7 }, g);
    } else {
      el('circle', { r: rr, fill: c, stroke: 'rgba(40,10,40,.26)', 'stroke-width': .9 }, g);
      el('circle', { cx: -rr * .3, cy: -rr * .34, r: rr * .28, fill: '#fff', opacity: .6 }, g);
      el('circle', { cx: rr * .22, cy: rr * .3, r: rr * .5, fill: 'rgba(0,0,0,.08)' }, g);
    }
    return g;
  }

  function strand(svg, o) {
    var id = defs(svg), R = rng(o.seed), pal = o.pal || PAL;
    var g = el('g', { 'class': 'bd-strand' }, svg);
    var path = el('path', { d: o.d, fill: 'none', stroke: o.thread || 'rgba(23,20,26,.55)', 'stroke-width': o.threadW || 1.6, 'stroke-linecap': 'round' }, g);
    var len = path.getTotalLength(), n = o.n || Math.round(len / (o.r * 1.9)), beads = [], r = o.r || 8;
    var text = o.text ? o.text.toUpperCase().replace(/\s+/g, '  ') : null;
    var ti = 0, pos = 0;
    for (var i = 0; i < n; i++) {
      var t = (i + .5) / n * len, p0 = path.getPointAtLength(t), p1 = path.getPointAtLength(Math.min(len, t + 1.5)), p2 = path.getPointAtLength(Math.max(0, t - 1.5));
      var ang = Math.atan2(p1.y - p2.y, p1.x - p2.x) * 180 / Math.PI, kind, c, rr = r * (.8 + R() * .5), letter = '', ink = '#17141A';
      if (text) {
        if (i % 2 === 0) { var ch = text[ti % text.length]; ti++; if (ch === ' ') { kind = 'round'; c = pal[(R() * pal.length) | 0]; rr = r * .7; } else { kind = 'cube'; letter = ch; c = pal[(i * 3 + ti) % pal.length]; rr = r * 1.15; ink = (c === '#8C52FF' || c === '#FF4D6D' || c === '#14B1FF') ? '#fff' : '#17141A'; } }
        else { kind = R() < .35 ? 'pearl' : 'round'; c = pal[(R() * pal.length) | 0]; rr = r * .72; }
      } else {
        var k = R(); c = pal[(R() * pal.length) | 0];
        kind = k < .56 ? 'round' : k < .70 ? 'disc' : k < .82 ? 'pearl' : k < .88 ? 'flower' : k < .94 ? 'cube' : 'round';
        if (kind === 'cube') { letter = LET[(R() * LET.length) | 0]; ink = (c === '#8C52FF' || c === '#FF4D6D' || c === '#14B1FF') ? '#fff' : '#17141A'; }
      }
      var bg = bead(kind, c, rr, ink, letter, id);
      g.appendChild(bg);
      beads.push({ g: bg, x: p0.x, y: p0.y, a: ang, s: -1 });
    }
    var C = { g: g, path: path, len: len, n: n, beads: beads, p: -1 };
    function put(b, s) {
      if (b.s === s) return; b.s = s;
      if (s <= 0) { b.g.setAttribute('transform', 'translate(' + b.x.toFixed(1) + ' ' + b.y.toFixed(1) + ') scale(0)'); b.g.style.visibility = 'hidden'; }
      else { b.g.style.visibility = 'visible'; b.g.setAttribute('transform', 'translate(' + b.x.toFixed(1) + ' ' + b.y.toFixed(1) + ') rotate(' + b.a.toFixed(0) + ') scale(' + s.toFixed(3) + ')'); }
    }
    C.setP = function (p) {
      p = Math.max(0, Math.min(1, p));
      var f = p * (n + 4), lo = Math.max(0, Math.floor(f - 8)), hi = Math.min(n - 1, Math.ceil(f + 1));
      var from = C.p < 0 ? 0 : Math.max(0, Math.floor(Math.min(C.p, p) * (n + 4) - 9)), to = C.p < 0 ? n - 1 : Math.min(n - 1, Math.ceil(Math.max(C.p, p) * (n + 4) + 1));
      for (var i = from; i <= to; i++) {
        var q = f - i - 0; // beads pop in one after another
        var s = q <= 0 ? 0 : q >= 3 ? 1 : (function (t) { var e = ease(t); return e + Math.sin(t * Math.PI) * .18; })(q / 3);
        put(beads[i], s);
      }
      C.p = p;
      var th = Math.min(1, p * 1.0); path.style.strokeDasharray = len; path.style.strokeDashoffset = len * (1 - Math.min(1, p * (n + 4) / n * 1.0 + .0));
    };
    C.at = function (p) { var t = Math.max(0, Math.min(1, p)) * len, a = path.getPointAtLength(t), b = path.getPointAtLength(Math.min(len, t + 2)); return { x: a.x, y: a.y, a: Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI }; };
    C.setP(0);
    return C;
  }

  /* sorteia um fio solto (sem animação) — usado em decorações estáticas */
  function still(svg, o) { var c = strand(svg, o); c.setP(1); return c; }

  window.Beads = { strand: strand, still: still, PAL: PAL };
})();
