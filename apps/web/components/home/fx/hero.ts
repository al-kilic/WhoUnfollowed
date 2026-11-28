import { icSvg } from '../icons';
import { SETS, monthYear, shortDay } from './data';
import { tween, type FxCtx } from './ctx';

export interface People { photos: string[]; handles: string[] }

// Hero deck: one sample account at a time; the count on top drops as cards
// fly off, then the next sample account rolls in.
export function initDeck(x: FxCtx, ppl: People) {
  const deck = x.$('#deck'), bigN = x.$('#bigN'), bigM = x.$('#bigM');
  if (!deck || !bigN || !bigM) return;
  const people = ppl.handles.slice(0, ppl.photos.length).map((h, i) => [h, monthYear(x.locale, `${2020 + (i * 5) % 6}-${String(((i * 7) % 12) + 1).padStart(2, '0')}-15`), ppl.photos[i % ppl.photos.length]!] as const);
  let si = 0, curN = 0, curM = 0, pi = 0;
  const head = (n: number, m: number, ms: number) => {
    bigN.classList.remove('tick'); void bigN.offsetWidth; bigN.classList.add('tick');
    tween(x, curN, n, ms, (v) => { bigN.textContent = x.fmt(v); });
    tween(x, curM, m, ms, (v) => { bigM.textContent = x.fmt(v); });
    curN = n; curM = m;
    const pb = Math.max(4, (n / m) * 100);
    x.$('#splA')!.style.width = `${100 - pb}%`; x.$('#splB')!.style.width = `${pb}%`;
  };
  const showSet = (k: number) => {
    const S = SETS[k]!;
    x.$('#dlt')!.textContent = `+${S[2]}`; x.$('#dld')!.textContent = shortDay(x.locale, S[3]);
    head(S[0], S[1], 1100);
  };
  const esc = (s: string) => s.replace(/[&<>"]/g, (ch) => `&#${ch.charCodeAt(0)};`);
  const card = (p: readonly [string, string, string]) => {
    const c = document.createElement('div'); c.className = 'dcard';
    c.innerHTML = `<div class="dc-h"><span class="av ring ph"><img src="${p[2]}" alt="" width="50" height="50" decoding="async"></span><span><b>@${esc(p[0])}</b><small>${esc(x.t.platform)}</small></span></div>`
      + `<div class="dc-f"><div><span>${esc(x.t.follow)}</span><b>${esc(x.t.since.replace('{d}', p[1]))}</b></div><div><span>${esc(x.t.follows)}</span><b class="no">${esc(x.t.no)}</b></div></div>`
      + `<button class="ufb" type="button">${icSvg('minus', 13)}${esc(x.t.unfollow)}</button>`;
    x.on(c.querySelector('button'), 'click', () => peel());
    return c;
  };
  const layout = () => {
    const cs = x.$$('.dcard:not(.out)', deck);
    cs.forEach((c, i) => {
      const k = cs.length - 1 - i;
      c.style.zIndex = String(10 - k); c.style.transform = `translateY(${k * 11}px) scale(${1 - k * 0.045})`;
      c.style.opacity = String(k > 2 ? 0 : 1 - k * 0.2); c.inert = k > 0;
    });
  };
  const fill = () => { deck.textContent = ''; for (let i = 4; i >= 0; i--) deck.appendChild(card(people[(pi + i) % people.length]!)); pi += 5; layout(); };
  const peel = () => {
    const cs = x.$$('.dcard:not(.out)', deck), top = cs[cs.length - 1];
    if (!top) return;
    top.classList.add('out'); head(curN - 1, curM - 1, 450); layout();
    x.timeout(() => { top.remove(); if (!x.$('.dcard', deck)) { si = (si + 1) % SETS.length; showSet(si); fill(); } }, 650);
  };
  fill();
  curN = 0; curM = 0;
  x.later(() => showSet(0), 600);
  let vis = true;
  x.watch(deck, (e) => { vis = e.isIntersecting; }, { threshold: 0.3 });
  if (!x.reduce) x.every(() => { if (vis && !document.hidden && !deck.matches(':hover')) peel(); }, 2800);
}

// A soft light follows the cursor in the hero; the deck tilts a little.
export function initHeroPointer(x: FxCtx) {
  if (!x.fine || x.reduce) return;
  const hero = x.$('.hero'), machine = x.$('#machine'), win = x.$('#win');
  if (!hero) return;
  let raf = 0, ev: PointerEvent | null = null;
  x.on(hero, 'pointermove', (e) => {
    ev = e as PointerEvent; if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0; if (!ev) return;
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--cx', `${ev.clientX - r.left}px`); hero.style.setProperty('--cy', `${ev.clientY - r.top}px`);
      hero.style.setProperty('--hx', ((ev.clientX - r.left) / r.width - 0.5).toFixed(3)); hero.style.setProperty('--hy', ((ev.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
  });
  x.on(hero, 'pointerleave', () => { hero.style.setProperty('--hx', '0'); hero.style.setProperty('--hy', '0'); });
  if (!machine || !win) return;
  x.on(machine, 'pointermove', (e) => {
    const p = e as PointerEvent, r = machine.getBoundingClientRect(), dx = (p.clientX - r.left) / r.width - 0.5, dy = (p.clientY - r.top) / r.height - 0.5;
    win.style.setProperty('--ry', `${(dx * 5).toFixed(2)}deg`); win.style.setProperty('--rx', `${(-dy * 4).toFixed(2)}deg`);
  });
  x.on(machine, 'pointerleave', () => { win.style.setProperty('--ry', '0deg'); win.style.setProperty('--rx', '0deg'); });
}

