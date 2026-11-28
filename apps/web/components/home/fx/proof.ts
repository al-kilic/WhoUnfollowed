import type { FxCtx } from './ctx';

// The live counters under the upload box: small rolling digits, staggered.
// The numbers are real (lib/stats); nothing is added on the client.
function odometer(x: FxCtx, el: HTMLElement) {
  const n = Number(el.dataset.n ?? 0);
  const build = (v: number) => {
    el.textContent = '';
    let k = 0;
    x.fmt(v).split('').forEach((ch) => {
      if (!/\d/.test(ch)) { const sp = document.createElement('span'); sp.className = 'sep'; sp.textContent = ch; el.appendChild(sp); return; }
      const dg = document.createElement('span'); dg.className = 'dg'; dg.style.setProperty('--k', String(k++));
      const col = document.createElement('span'); col.innerHTML = '0<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9';
      dg.appendChild(col); el.appendChild(dg);
    });
  };
  const set = (v: number) => {
    const cols = x.$$('.dg > span', el), raw = x.fmt(v).replace(/\D/g, '');
    raw.split('').forEach((ch, i) => {
      const col = cols[i]; if (!col) return;
      const dg = col.parentElement!; dg.classList.add('roll'); x.timeout(() => dg.classList.remove('roll'), 900 + i * 55);
      col.style.transform = `translateY(${-1.15 * Number(ch)}em)`;
    });
  };
  el.setAttribute('aria-hidden', 'true');
  build(n);
  x.$$('.dg > span', el).forEach((c) => { c.style.transform = 'translateY(0)'; });
  return () => set(n);
}

export function initProof(x: FxCtx) {
  const box = x.$('.proof');
  const els = x.$$('.proof .odo');
  if (!box || !els.length) return;
  const go = els.map((el) => odometer(x, el));
  let started = false;
  x.watch(box, (e) => {
    if (!e.isIntersecting || started) return;
    started = true;
    go.forEach((g, i) => x.later(g, 250 + i * 200));
  }, { threshold: 0.4 });
}

// Sections fade up as they come into view.
export function initReveals(x: FxCtx) {
  x.$$('.rv, #hiw, .final, #privacy .sec-head').forEach((el) => {
    const o = x.watch(el, (e) => { if (e.isIntersecting) { e.target.classList.add('in'); o?.unobserve(e.target); } }, { threshold: 0.18 });
  });
}
