import type { FxCtx } from './ctx';

// The Pro AI card's reel (ProReel.tsx). The active progress bar's CSS fill
// is the clock: when it ends, the next scene starts, so hovering (which
// pauses the fill) pauses the reel too. It only plays while on screen. The
// bars jump to a scene. Reduced motion: no autoplay, bars still switch.
export function initProReel(x: FxCtx) {
  const box = x.$('#preel');
  if (!box) return;
  const segs = x.$$<HTMLButtonElement>('.pr-seg button', box);
  const scenes = x.$$('.pr-sc', box);
  const num = x.$('.pr-n', box), type = x.$('.pr-type', box);
  const full = type?.dataset.text ?? '';
  let cur = 0, run = 0;

  const play = (k: number) => {
    run++;
    const id = run;
    if (k === 1 && num) {
      if (x.reduce) { num.textContent = '87'; return; }
      const t0 = performance.now();
      const tick = (t: number) => {
        if (id !== run) return;
        const p = Math.min(1, (t - t0 - 250) / 1100);
        num.textContent = String(Math.round(87 * (1 - (1 - Math.max(0, p)) ** 3)));
        if (p < 1) x.raf(tick);
      };
      num.textContent = '0';
      x.raf(tick);
    }
    if (k === 2 && type) {
      if (x.reduce) { type.textContent = full; return; }
      let i = 0;
      type.textContent = '';
      const step = () => {
        if (id !== run) return;
        i += 1 + Math.round(Math.random());
        type.textContent = full.slice(0, i);
        if (i < full.length) x.timeout(step, 28 + Math.random() * 40);
      };
      x.timeout(step, 1000);
    }
  };

  const show = (k: number) => {
    cur = (k + scenes.length) % scenes.length;
    segs.forEach((b, i) => {
      b.classList.toggle('on', i === cur);
      b.classList.toggle('done', i < cur);
      b.setAttribute('aria-pressed', String(i === cur));
    });
    scenes.forEach((s, i) => s.classList.toggle('on', i === cur));
    play(cur);
  };

  segs.forEach((b, i) => {
    x.on(b, 'click', () => show(i));
    x.on(b.firstElementChild, 'animationend', () => { if (i === cur) show(cur + 1); });
  });
  box.classList.add('pr-js');
  x.watch(box, (e) => box.classList.toggle('run', e.isIntersecting && !x.reduce), { threshold: 0.4 });
  show(0);

  // A soft light follows the pointer, like the Free card's sample.
  if (x.fine && !x.reduce) x.on(box, 'pointermove', (e) => {
    const p = e as PointerEvent, r = box.getBoundingClientRect();
    box.style.setProperty('--fx', `${p.clientX - r.left}px`); box.style.setProperty('--fy', `${p.clientY - r.top}px`);
  });
}
