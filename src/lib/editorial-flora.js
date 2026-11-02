/* editorial-flora.js
 * Flores em SVG, estilo gouache chapado (formas gordas, cores lisas, hastes grossas),
 * que crescem guiadas por um valor de progresso (0..1). Sem dependências.
 *
 *   const plants = Flora.mount(hostEl, specs, { ink:false });
 *   plants.forEach(p => p.grow(progress));   // progress global; usa p.start / p.dur
 *   plants.forEach(p => p.sway(timeSec));    // vento
 *
 * spec: { type, x(%), y(u), h(u), col, start, dur, flip, bend, center, sway }
 * Tipos: tulip, daisy, bell, poppy, peony, foliage
 * `u` = var(--u) definido no palco (ex.: min(1vh, 1.9vw)).
 */
(function () {
  'use strict';
  var clamp = function (v, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a === undefined ? 0 : a, v)); };
  var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
  var back = function (t) { var c1 = 1.35, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  var r2 = function (n) { return Math.round(n * 100) / 100; };
  var uid = 0;

  /* [principal, sombra, luz] */
  var COL = {
    pink:   ['#FF6FA8', '#D92B78', '#FFB6D0'], hot:  ['#FF2D6F', '#B8135A', '#FF7AA3'], red:    ['#F2141F', '#A80C18', '#FF5A4D'],
    tang:   ['#FF6A2B', '#CF4510', '#FF9A5E'], sun:  ['#FFC21A', '#EE8E00', '#FFE066'], lemon:  ['#F4E04A', '#D2B300', '#FFF38F'],
    violet: ['#8C52FF', '#5A2BC8', '#BA94FF'], blue: ['#5B8DEF', '#3359C7', '#A2C0FF'], teal:   ['#4FB3B8', '#2A8890', '#93D8D8'],
    cream:  ['#F7E3C4', '#E5BE86', '#FFF5E4'], lilac: ['#C9A8F5', '#9468D8', '#E8D8FF']
  };
  var GREEN = { stem: '#157F4A', stemInk: '#0E5C38', leaf: ['#2E9E53', '#0F6B3F', '#A3C94B'] };

  function shape(o, d, fill, extra) {
    extra = extra || '';
    if (!o.ink) return '<path d="' + d + '" fill="' + fill + '" ' + extra + '/>';
    return '<path d="' + d + '" fill="' + fill + '" transform="translate(' + o.off[0] + ' ' + o.off[1] + ')" ' + extra + '/>' +
      '<path d="' + d + '" fill="none" stroke="' + o.inkc + '" stroke-width="2.2" stroke-linejoin="round"/>';
  }
  function pet(o, d, fill, a, s, extra) {
    s = s || 1;
    return '<g data-a="' + a + '" data-s="' + s + '" transform="rotate(' + a + ') scale(' + s + ')">' + shape(o, d, fill, extra) + '</g>';
  }
  function bloom(x, y, at, dur, inner) {
    return '<g class="bl" data-tip="1" data-x="' + r2(x) + '" data-y="' + r2(y) + '" data-at="' + at + '" data-dur="' + dur + '" transform="scale(0.0001)">' + inner + '</g>';
  }

  /* ---- geometria (apontam para -y, base na origem) ---- */
  var D = {
    daisy:  'M0,0 C-17,-8 -23,-34 -15,-48 C-9,-58 9,-58 15,-48 C23,-34 17,-8 0,0Z',
    tulipF: 'M0,0 C-30,-4 -38,-46 -22,-80 C-14,-94 -3,-82 0,-72 C3,-82 14,-94 22,-80 C38,-46 30,-4 0,0Z',
    tulipL: 'M2,0 C-34,0 -46,-40 -36,-74 C-30,-90 -14,-84 -8,-68 C-2,-50 4,-24 2,0Z',
    tulipR: 'M-2,0 C34,0 46,-40 36,-74 C30,-90 14,-84 8,-68 C2,-50 -4,-24 -2,0Z',
    bell:   'M-10,0 C-34,-6 -46,-34 -44,-64 C-44,-76 -34,-82 -24,-76 C-14,-70 -8,-80 0,-80 C8,-80 14,-70 24,-76 C34,-82 44,-76 44,-64 C46,-34 34,-6 10,0Z',
    poppy:  'M0,0 C-36,0 -48,-30 -40,-56 C-33,-76 -15,-62 -6,-72 C0,-78 7,-74 13,-70 C24,-64 42,-72 43,-50 C47,-28 34,0 0,0Z',
    poppyI: 'M0,-6 C-22,-6 -28,-26 -22,-42 C-14,-52 -2,-44 0,-52 C4,-46 16,-52 22,-40 C28,-24 20,-6 0,-6Z',
    peony:  'M0,0 C-28,-6 -46,-32 -34,-58 C-24,-78 24,-78 34,-58 C46,-32 28,-6 0,0Z'
  };
  function leafD(L, W) {
    return 'M0,0 C' + W + ',' + (-L * .22) + ' ' + (W * 1.05) + ',' + (-L * .72) + ' 0,' + (-L) + ' C' + (-W * 1.05) + ',' + (-L * .72) + ' ' + (-W) + ',' + (-L * .22) + ' 0,0Z';
  }
  function leafHalf(L, W) {
    return 'M0,0 C' + W + ',' + (-L * .22) + ' ' + (W * 1.05) + ',' + (-L * .72) + ' 0,' + (-L) + ' C' + (W * .3) + ',' + (-L * .65) + ' ' + (W * .3) + ',' + (-L * .25) + ' 0,0Z';
  }
  function leafSVG(o, L, W, ci) {
    var c = o.leafCols || GREEN.leaf;
    return shape(o, leafD(L, W), c[ci || 0]) + (o.ink ? '' : '<path d="' + leafHalf(L, W) + '" fill="' + c[2] + '" fill-opacity=".55"/>');
  }
  function bez(p0, p1, p2, p3, t) {
    var u = 1 - t;
    return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
            u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
  }
  function stemPts(o) {
    var b = o.bend;
    return [[100, 400], [100 - b * .9, 320], [100 + b * 1.3, 205], [100 + b, o.tipY]];
  }
  function stemEl(o, P) {
    var d = 'M' + P[0] + ' C' + P[1] + ' ' + P[2] + ' ' + P[3];
    var base = ' fill="none" stroke-linecap="round" pathLength="1" class="st" stroke-dasharray="1 1" stroke-dashoffset="1"';
    return (o.ink ? '<path d="' + d + '" stroke="' + o.inkc + '" stroke-width="' + (o.sw + 3) + '"' + base + '/>' : '') +
      '<path d="' + d + '" stroke="' + (o.ink ? GREEN.stem : GREEN.stem) + '" stroke-width="' + o.sw + '"' + base + (o.ink ? ' transform="translate(' + (o.off[0] * .6) + ' ' + (o.off[1] * .6) + ')"' : '') + '/>';
  }
  function leaves(o, P, list) {
    var s = '';
    list.forEach(function (l, i) {
      var q = bez(P[0], P[1], P[2], P[3], l.f), dir = l.side * (o.flip ? -1 : 1);
      s += '<g transform="translate(' + r2(q[0]) + ' ' + r2(q[1]) + ') rotate(' + (dir * l.a) + ')"><g class="lf" data-f="' + l.f + '" transform="scale(0.0001)">' + leafSVG(o, l.L, l.W, i % 2) + '</g></g>';
    });
    return s;
  }
  function defs() { return ''; }
  function plant(o, d) {
    o.tipY = d.tipY === undefined ? o.tipY : d.tipY;
    var P = stemPts(o);
    return { vb: [200, 400], body: stemEl(o, P) + leaves(o, P, d.leaves) + d.bloom, tip: P[3] };
  }

  /* ---- construtores ---- */
  var BUILD = {
    tulip: function (o) {
      var c = o.col, s = '';
      o.tipY = 150;
      s += pet(o, D.tulipL, c[1], -8) + pet(o, D.tulipR, c[2], 8) + pet(o, D.tulipF, c[0], 0);
      return plant(o, { tipY: 150, bloom: bloom(0, 4, .55, .45, s), leaves: [{ f: .08, side: -1, a: 20, L: 170, W: 30 }, { f: .14, side: 1, a: 18, L: 150, W: 28 }, { f: .3, side: -1, a: 40, L: 100, W: 24 }] });
    },
    daisy: function (o) {
      var c = o.col, n = o.n || 8, s = '', i;
      for (i = 0; i < n; i++) s += pet(o, D.daisy, i % 2 ? c[0] : c[0], i * 360 / n, 1);
      s += '<circle r="15" fill="' + (o.center || '#1F3BD1') + '"/>' + (o.dot ? '<circle r="6" fill="' + o.dot + '"/>' : '');
      return plant(o, { tipY: 130, bloom: bloom(0, 0, .55, .45, s), leaves: [{ f: .22, side: -1, a: 55, L: 100, W: 26 }, { f: .42, side: 1, a: 50, L: 90, W: 24 }] });
    },
    bell: function (o) {
      var c = o.col, s = '', i;
      var st = [[-20, 22], [0, 32], [20, 22]];
      for (i = 0; i < 3; i++) s += '<g data-a="' + (i - 1) * 14 + '" data-s="1" transform="rotate(' + (i - 1) * 14 + ')"><path d="M0,-70 L0,-' + (st[i][1] + 70) + '" stroke="' + GREEN.stem + '" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="-' + (st[i][1] + 76) + '" r="7" fill="' + (o.dot || '#F2641F') + '"/></g>';
      s += pet(o, D.bell, c[0], 0) + '<path d="M-30,-60 C-30,-36 -20,-14 0,-8 C-22,-18 -34,-40 -30,-60Z" fill="' + c[1] + '" fill-opacity=".55"/>';
      return plant(o, { tipY: 150, bloom: bloom(0, 4, .55, .45, s), leaves: [{ f: .1, side: -1, a: 30, L: 130, W: 26 }, { f: .26, side: 1, a: 42, L: 100, W: 24 }] });
    },
    poppy: function (o) {
      var c = o.col, s = pet(o, D.poppy, c[0], 0) + '<path d="' + D.poppyI + '" fill="' + c[1] + '" fill-opacity=".5"/>';
      return plant(o, { tipY: 140, bloom: bloom(0, 4, .55, .45, s), leaves: [{ f: .12, side: -1, a: 36, L: 120, W: 26 }, { f: .24, side: 1, a: 44, L: 100, W: 24 }] });
    },
    peony: function (o) {
      var c = o.col, s = '', i;
      for (i = 0; i < 6; i++) s += pet(o, D.peony, c[2], i * 60, 1);
      for (i = 0; i < 5; i++) s += pet(o, D.peony, c[0], i * 72 + 20, .74);
      for (i = 0; i < 4; i++) s += pet(o, D.peony, c[1], i * 90 + 45, .46);
      s += '<circle r="11" fill="#FFC21A"/>';
      for (i = 0; i < 6; i++) s += '<circle cx="' + r2(Math.cos(i * 1.05) * 6.5) + '" cy="' + r2(Math.sin(i * 1.05) * 6.5) + '" r="2.4" fill="#E0301E"/>';
      return plant(o, { tipY: 130, bloom: bloom(0, 0, .55, .45, s), leaves: [{ f: .2, side: -1, a: 52, L: 120, W: 32 }, { f: .38, side: 1, a: 48, L: 105, W: 30 }] });
    },
    foliage: function (o) {
      var s = '', n = o.n || 7, i, c = o.leafCols || GREEN.leaf;
      for (i = 0; i < n; i++) {
        var t = i / (n - 1) - .5, a = t * 124 + ((i * 29) % 7 - 3), L = 120 + ((i * 47) % 6) * 14 + (1 - Math.abs(t) * 1.4) * 40, W = 34 + ((i * 31) % 5) * 4, x = 100 + t * 36;
        var lf = shape(o, leafD(L, W), c[i % 2 ? 1 : 0]) + (o.ink ? '' : '<path d="' + leafHalf(L, W) + '" fill="' + c[2] + '" fill-opacity=".5"/>');
        s += '<g class="lf" data-f="' + r2(i / n * .6) + '" data-x="' + r2(x) + '" data-y="200" data-a="' + r2(a) + '" transform="translate(' + r2(x) + ' 200) rotate(' + r2(a) + ') scale(0.0001)">' + lf + '</g>';
      }
      return { vb: [200, 200], body: s, grassOnly: true };
    }
  };
  BUILD.cosmos = BUILD.daisy;

  /* ---- montagem ---- */
  function mount(host, specs, opt) {
    opt = opt || {};
    var out = [];
    specs.forEach(function (sp) {
      var o = {};
      for (var k in sp) o[k] = sp[k];
      o.uid = ++uid; o.ink = opt.ink || false; o.inkc = opt.inkColor || '#17141A'; o.off = opt.off || [3.5, 3];
      o.bend = (sp.bend === undefined ? ((uid * 17) % 56) - 28 : sp.bend);
      o.sw = sp.sw || 11;
      if (typeof sp.col === 'string') o.col = COL[sp.col];
      o.col = o.col || COL.pink;
      var built = BUILD[sp.type](o);
      var wrap = document.createElement('div');
      wrap.className = 'fl';
      var u = 'var(--u,1vh)';
      wrap.style.cssText = 'position:absolute;left:' + sp.x + '%;bottom:calc(' + (sp.y || 0) + ' * ' + u + ');height:calc(' + sp.h + ' * ' + u + ');aspect-ratio:' + built.vb[0] + '/' + built.vb[1] +
        ';transform-origin:50% 100%;margin-left:calc(' + (-sp.h * built.vb[0] / built.vb[1] / 2) + ' * ' + u + ');pointer-events:none;will-change:transform;' + (sp.z ? 'z-index:' + sp.z + ';' : '');
      wrap.innerHTML = '<svg viewBox="0 0 ' + built.vb[0] + ' ' + built.vb[1] + '" width="100%" height="100%" style="overflow:visible;display:block;' + (sp.flip ? 'transform:scaleX(-1);' : '') + '">' + built.body + '</svg>';
      host.appendChild(wrap);
      out.push(controller(wrap, sp, built));
    });
    return out;
  }

  function controller(el, sp, built) {
    var stems = [].slice.call(el.querySelectorAll('.st'));
    var lvs = [].slice.call(el.querySelectorAll('.lf')).map(function (n) {
      return { el: n, f: +n.getAttribute('data-f'), grass: !!built.grassOnly, x: +(n.getAttribute('data-x') || 0), y: +(n.getAttribute('data-y') || 200), a: +(n.getAttribute('data-a') || 0) };
    });
    var bls = [].slice.call(el.querySelectorAll('.bl')).map(function (n) {
      var tip = n.getAttribute('data-tip') && built.tip ? built.tip : [0, 0];
      return { el: n, x: tip[0] + +n.getAttribute('data-x'), y: tip[1] + +n.getAttribute('data-y'), at: +n.getAttribute('data-at'), dur: +n.getAttribute('data-dur'),
        pts: [].slice.call(n.querySelectorAll('[data-a]')).map(function (p) { return { el: p, a: +p.getAttribute('data-a'), s: +p.getAttribute('data-s') }; }) };
    });
    var last = -1, phase = Math.random() * 6.28, spd = .5 + Math.random() * .5, amp = sp.sway === undefined ? 1.6 : sp.sway;
    var api = {
      el: el, spec: sp, start: sp.start || 0, dur: sp.dur || .3, g: 0,
      setG: function (g) {
        g = clamp(g);
        if (Math.abs(g - last) < .0005 && !(g === 1 && last !== 1)) return;
        last = g; api.g = g;
        var e1 = built.grassOnly ? ease(g) : ease(clamp(g / .6));
        el.style.visibility = g <= 0 ? 'hidden' : 'visible';
        var i;
        for (i = 0; i < stems.length; i++) stems[i].setAttribute('stroke-dashoffset', r2(1 - e1));
        for (i = 0; i < lvs.length; i++) {
          var L = lvs[i], t = built.grassOnly ? clamp((g - L.f * .6) / .45) : clamp((e1 - L.f) / .25), s = t <= 0 ? .0001 : r2(back(t));
          if (L.grass) L.el.setAttribute('transform', 'translate(' + L.x + ' ' + L.y + ') rotate(' + L.a + ') scale(' + r2(.7 + .3 * Math.min(1, s)) + ',' + s + ')');
          else L.el.setAttribute('transform', 'scale(' + s + ')');
        }
        for (i = 0; i < bls.length; i++) {
          var b = bls[i], tb = clamp((g - b.at) / b.dur), eb = tb <= 0 ? .0001 : Math.max(.0001, back(tb));
          b.el.setAttribute('transform', 'translate(' + b.x + ' ' + b.y + ') scale(' + r2(eb) + ')');
          var open = .3 + .7 * ease(tb);
          for (var j = 0; j < b.pts.length; j++) { var p = b.pts[j]; p.el.setAttribute('transform', 'rotate(' + r2(p.a * open) + ') scale(' + r2(p.s * (.6 + .4 * open)) + ')'); }
        }
      },
      grow: function (p) { api.setG((p - api.start) / api.dur); },
      sway: function (t) {
        if (api.g < .05) return;
        el.style.transform = 'rotate(' + r2(Math.sin(t * spd + phase) * amp * (.4 + .6 * api.g)) + 'deg)';
      }
    };
    api.setG(0);
    return api;
  }

  window.Flora = { mount: mount, COL: COL, clamp: clamp, ease: ease, back: back };
})();
