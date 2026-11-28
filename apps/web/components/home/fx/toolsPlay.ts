import { countUp, type FxCtx } from './ctx';
import { filterRows, type SceneEl } from './tools';

const PINS: [number, number][] = [[308, 85], [442, 52]];

// Each scene runs its own timers; a new play (or leaving the scene) cancels
// the old ones through the scene's token.
function play(x: FxCtx, sc: SceneEl, fn: () => void, ms: number) {
  const tok = sc._tok;
  x.later(() => { if (sc._tok === tok && sc.classList.contains('on')) fn(); }, ms);
}

function playResults(x: FxCtx, sc: SceneEl) {
  const sorted = x.$('[data-sorted]', sc), rows = x.$$('.rr2', sc);
  let sn = 0;
  filterRows(x, sc, 'all'); rows.forEach((r) => r.classList.remove('stamped')); if (sorted) sorted.textContent = '0';
  if (x.reduce) { rows.forEach((r) => r.classList.add('stamped')); if (sorted) sorted.textContent = '23'; return; }
  const stampAll = (list: HTMLElement[], t0: number) => list.forEach((r, i) => play(x, sc, () => {
    r.classList.add('stamped'); sn++; if (sorted) sorted.textContent = String(Math.min(23, Math.round((sn * 23) / rows.length)));
  }, t0 + i * 260));
  const ghosts = rows.filter((r) => (r.dataset.t ?? '').includes('ghost')), rest = rows.filter((r) => !(r.dataset.t ?? '').includes('ghost'));
  play(x, sc, () => filterRows(x, sc, 'ghost'), 1300);
  stampAll(ghosts, 1900);
  play(x, sc, () => filterRows(x, sc, 'all'), 1900 + ghosts.length * 260 + 500);
  stampAll(rest, 1900 + ghosts.length * 260 + 900);
}

function playRadar(x: FxCtx, sc: SceneEl) {
  const segs = x.$$('.seg', sc), blips = x.$$('.blip', sc), cards = x.$$('.ic', sc), sweep = x.$('.sweep', sc), pct = x.$('[data-pct]', sc);
  segs.forEach((s) => s.setAttribute('stroke-dasharray', '0 553'));
  blips.forEach((b) => b.classList.remove('on', 'ping'));
  cards.forEach((c) => c.classList.remove('on', 'ping'));
  x.raf(() => x.raf(() => segs.forEach((s) => s.setAttribute('stroke-dasharray', `${s.getAttribute('data-len')} 553`))));
  play(x, sc, () => {
    if (!pct) return;
    const t0 = performance.now();
    const st = (t: number) => { const p = Math.min(1, (t - t0) / 1000); pct.textContent = `${Math.round(80 * (1 - Math.pow(1 - p, 3)))}%`; if (p < 1) x.raf(st); };
    st(t0);
  }, 200);
  if (x.reduce) { blips.forEach((b) => b.classList.add('on')); cards.forEach((c) => c.classList.add('on')); return; }
  if (sweep) { sweep.style.animation = 'none'; void sweep.offsetWidth; sweep.style.animation = ''; }
  // The sweep's bright edge starts at 12 o'clock and turns once every 4s.
  blips.forEach((b) => {
    const bx = parseFloat(b.style.getPropertyValue('--x')) - 50, by = parseFloat(b.style.getPropertyValue('--y')) - 50;
    const ang = ((Math.atan2(bx, -by) * 180) / Math.PI + 360) % 360, at = (ang / 360) * 4000, i = b.dataset.b;
    const hit = (when: number) => play(x, sc, () => {
      b.classList.remove('ping'); void b.offsetWidth; b.classList.add('on', 'ping');
      const c = x.$(`.ic[data-i="${i}"]`, sc);
      if (c) { c.classList.add('on', 'ping'); x.timeout(() => c.classList.remove('ping'), 900); }
      hit(4000);
    }, when);
    hit(at);
  });
}

function playGrowth(x: FxCtx, sc: SceneEl) {
  const path = x.$<SVGPathElement>('.ln', sc), dot = x.$<SVGCircleElement>('circle[r="5"]', sc), tip = x.$('.tip', sc);
  const svg = x.$<SVGSVGElement>('svg.chart', sc), box = x.$('.gchart', sc), pins = x.$$('.gpin', sc);
  if (!path?.getTotalLength || !dot || !tip || !svg || !box) return;
  const L = path.getTotalLength();
  tip.classList.remove('on'); pins.forEach((p) => p.classList.remove('on'));
  const place = (el: HTMLElement, px: number, py: number) => {
    const r = svg.getBoundingClientRect(), bb = box.getBoundingClientRect(), s = Math.min(r.width / 520, r.height / 250);
    const ox = (r.width - 520 * s) / 2, oy = (r.height - 250 * s) / 2;
    el.style.left = `${r.left - bb.left + ox + px * s}px`; el.style.top = `${r.top - bb.top + oy + py * s}px`;
  };
  const placeAll = () => { pins.forEach((p, i) => place(p, PINS[i]![0], PINS[i]![1])); place(tip, 510, 58); };
  placeAll();
  const endTip = () => { tip.textContent = x.t.tip.replace('{n}', x.fmt(1204)); tip.style.transform = 'translate(-100%,60%)'; tip.classList.add('on'); };
  if (x.reduce) {
    const end = path.getPointAtLength(L); dot.setAttribute('cx', String(end.x)); dot.setAttribute('cy', String(end.y));
    pins.forEach((p) => p.classList.add('on'));
    return;
  }
  play(x, sc, () => {
    const t0 = performance.now(), shown = [false, false];
    placeAll();
    const mv = (t: number) => {
      const p = Math.min(1, (t - t0) / 2000), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2, pt = path.getPointAtLength(L * e);
      dot.setAttribute('cx', String(pt.x)); dot.setAttribute('cy', String(pt.y));
      PINS.forEach((pp, i) => { if (!shown[i] && pt.x >= pp[0] - 4) { shown[i] = true; pins[i]?.classList.add('on'); } });
      if (p === 1) endTip();
      if (p < 1 && sc.classList.contains('on')) x.raf(mv);
    };
    mv(t0);
  }, 250);
}

export function playScene(x: FxCtx, sc: SceneEl) {
  const k = Number(sc.dataset.s);
  sc._tok = (sc._tok ?? 0) + 1;
  x.$$('[data-cnt]', sc).forEach((el) => {
    const pre = el.dataset.pre ?? '', to = Number(el.dataset.cnt), suf = el.dataset.suf ?? '';
    el.textContent = `${pre}0${suf}`;
    play(x, sc, () => countUp(x, el, to, 900, suf, pre), 350);
  });
  if (k === 0) playResults(x, sc);
  if (k === 2) playRadar(x, sc);
  if (k === 3) playGrowth(x, sc);
}
