import { WEEKS, shortDay } from './data';
import type { FxCtx } from './ctx';
import type { People } from './hero';
import { playScene } from './toolsPlay';

// "One ZIP, four answers": builds each scene's generated parts, switches the
// pinned window as the steps scroll by, and plays the scene that's showing.
const AVC = ['#7a3b3b', '#3b5a7a', '#5a7a3b', '#6b4060', '#7a5c3b', '#3b6e6c', '#4b5a7a', '#5a4a7a'];
const GAIN = [52, 41, 58, 86, 44, 51, 44], LOSS = [37, 25, 30, 52, 27, 30, 31], XS = [40, 107, 174, 241, 308, 375, 442, 510];

export type SceneEl = HTMLElement & { _tok?: number };

function buildScene(x: FxCtx, sc: HTMLElement) {
  const k = Number(sc.dataset.s);
  if (k === 1) {
    let n = 0, html = '';
    WEEKS.forEach(([iso, count]) => {
      let dots = '';
      for (let j = 0; j < count; j++) { dots += `<span class="ad" style="background:${AVC[n % AVC.length]};--d:${350 + n * 90}"></span>`; n++; }
      html += `<div class="wk${count >= 5 ? ' hot' : ''}">${dots}<span class="wl">${shortDay(x.locale, iso)}</span></div>`;
    });
    const tl = x.$('[data-tl]', sc); if (tl) tl.innerHTML = html;
  }
  if (k === 2) x.$$('.seg', sc).forEach((s) => { s.setAttribute('stroke-dashoffset', s.getAttribute('data-off') ?? '0'); s.setAttribute('stroke-dasharray', '0 553'); });
  if (k === 3) {
    let g = '';
    for (let i = 0; i < 7; i++) {
      const xx = (XS[i]! + XS[i + 1]!) / 2 - 7, gh = GAIN[i]! * 0.28, lh = LOSS[i]! * 0.28;
      g += `<rect class="gbar up" x="${xx}" y="${212 - gh}" width="14" height="${gh}" rx="3" style="--d:${600 + i * 90}"/>`;
      g += `<rect class="gbar dn" x="${xx}" y="213" width="14" height="${lh}" rx="3" style="--d:${650 + i * 90}"/>`;
    }
    const gb = x.$('[data-gbars]', sc); if (gb) gb.innerHTML = g;
  }
}

export function filterRows(x: FxCtx, sc: HTMLElement, f: string) {
  x.$$('.fchips button', sc).forEach((b) => { const on = b.dataset.f === f; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
  x.$$('.rr2', sc).forEach((r) => {
    const t = (r.dataset.t ?? '').split(' ');
    r.classList.toggle('out', f !== 'all' && !t.includes(f));
    r.classList.toggle('hl', f === 'ghost' && t.includes('ghost'));
  });
}

function wire(x: FxCtx, sc: SceneEl) {
  x.$$('.fchips button', sc).forEach((b) => x.on(b, 'click', () => {
    sc._tok = (sc._tok ?? 0) + 1;
    filterRows(x, sc, b.dataset.f ?? 'all');
    x.$$('.rr2', sc).forEach((r) => r.classList.add('stamped'));
    const s = x.$('[data-sorted]', sc); if (s) s.textContent = '23';
  }));
}

export function initTools(x: FxCtx, ppl: People) {
  const stage = x.$('#stageWin');
  if (!stage) return;
  const scenes = x.$$<SceneEl>('.scene', stage), steps = x.$$('#steps .st'), labs = scenes.map((_, i) => steps[i]?.dataset.lab ?? '');
  scenes.forEach((s) => buildScene(x, s));
  let k = 20;
  x.$$('.rr2 .av, .left-row .av, .ad, .ic .av', stage).forEach((a) => {
    a.textContent = ''; a.classList.add('ph');
    const im = document.createElement('img'); im.src = ppl.photos[k++ % ppl.photos.length]!; im.alt = ''; im.decoding = 'async'; a.appendChild(im);
  });
  const stageBox = x.$('.stage');
  if (x.fine && !x.reduce && stageBox) x.on(stageBox, 'pointermove', (e) => {
    const p = e as PointerEvent, r = stage.getBoundingClientRect();
    stage.style.setProperty('--gx', `${(((p.clientX - r.left) / r.width) * 100).toFixed(1)}%`); stage.style.setProperty('--gy', `${(((p.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  });
  // Phones: each step gets a copy of its scene that plays when scrolled into view.
  steps.forEach((st, i) => {
    const ms = x.$('.mobile-scene', st), c = scenes[i]?.cloneNode(true) as SceneEl | undefined;
    if (!ms || !c) return;
    c.classList.remove('on'); ms.textContent = ''; ms.appendChild(c); wire(x, c);
    x.watch(ms, (e) => {
      if (!e.isIntersecting || getComputedStyle(ms.parentElement!).display === 'none' || getComputedStyle(ms).display === 'none') return;
      if (!c.classList.contains('on')) { c.classList.add('on'); playScene(x, c); }
    }, { threshold: 0.35 });
  });
  scenes.forEach((s) => wire(x, s));
  let cur = -1;
  const show = (i: number) => {
    if (i === cur) return; cur = i;
    steps.forEach((s, j) => s.classList.toggle('on', j === i));
    scenes.forEach((s, j) => { if (j !== i) s._tok = (s._tok ?? 0) + 1; s.classList.toggle('on', j === i); });
    const lab = x.$('#stageLab'); if (lab) lab.textContent = labs[i] ?? '';
    const rail = x.$('#rail'); if (rail) rail.style.width = `${(i + 1) * 25}%`;
    if (window.innerWidth > 900) playScene(x, scenes[i]!);
  };
  steps.forEach((s) => x.watch(s, (e) => { if (e.isIntersecting) show(Number(s.dataset.scene)); }, { rootMargin: '-45% 0px -45% 0px' }));
  x.watch(stage, (e) => { if (e.isIntersecting && cur === 0) { cur = -1; show(0); } }, { threshold: 0.3 });
}
