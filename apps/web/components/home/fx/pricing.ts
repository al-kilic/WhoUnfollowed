import type { FxCtx } from './ctx';
import type { People } from './hero';

// Monthly / Yearly: both texts are in the page; this picks one.
export function initPricing(x: FxCtx, ppl: People) {
  const plans = x.$('.plans'), btns = x.$$('.bill button');
  btns.forEach((b) => x.on(b, 'click', () => {
    btns.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
    plans?.classList.toggle('yearly', b.dataset.b === 'y');
  }));
  // The Free card's small sample list sorts itself, with a cursor light.
  const box = x.$('#fprev'), list = x.$('#fpL'), nEl = x.$('#fpN');
  if (!box || !list || !nEl) return;
  let n = 84, k = 30;
  const row = () => {
    const h = ppl.handles[k % ppl.handles.length]!, p = ppl.photos[k % ppl.photos.length]!; k++;
    const r = document.createElement('div'); r.className = 'fp-r';
    const av = document.createElement('span'); av.className = 'av ph';
    const im = document.createElement('img'); im.src = p; im.alt = ''; av.appendChild(im);
    const u = document.createElement('span'); u.className = 'fp-u'; u.textContent = `@${h}`;
    const b = document.createElement('span'); b.className = 'fp-b'; b.textContent = x.t.unfollow;
    r.append(av, u, b);
    return r;
  };
  list.textContent = '';
  for (let i = 0; i < 3; i++) list.appendChild(row());
  const step = () => {
    const first = list.firstElementChild; if (!first) return;
    first.classList.add('done');
    x.timeout(() => { first.remove(); list.appendChild(row()); n = n > 40 ? n - 1 : 84; nEl.textContent = String(n); }, 520);
  };
  let vis = false;
  x.watch(box, (e) => { vis = e.isIntersecting; }, { threshold: 0.3 });
  if (!x.reduce) x.every(() => { if (vis && !document.hidden) step(); }, 2200);
  const plan = box.closest('.plan');
  if (x.fine && !x.reduce && plan) x.on(plan, 'pointermove', (e) => {
    const p = e as PointerEvent, r = box.getBoundingClientRect();
    box.style.setProperty('--fx', `${p.clientX - r.left}px`); box.style.setProperty('--fy', `${p.clientY - r.top}px`);
    box.style.translate = `${(((p.clientX - r.left) / r.width - 0.5) * 4).toFixed(1)}px ${(((p.clientY - r.top) / r.height - 0.5) * 4).toFixed(1)}px`;
  });
}

// FAQ: every answer is in the page; this switches the category and the
// "Show all" toggle. The first question of a category opens.
export function initFaq(x: FxCtx) {
  const more = x.$<HTMLButtonElement>('#qmore'), cats = x.$$('#qcat button');
  if (!more) return;
  const show = Number(more.dataset.show ?? 3);
  let cat = 'privacy', all = false;
  const paint = () => {
    const items = x.$$<HTMLDetailsElement>('#qlist details');
    const mine = items.filter((d) => d.dataset.cat === cat);
    items.forEach((d) => { d.hidden = d.dataset.cat !== cat || (!all && Number(d.dataset.k) >= show); });
    more.hidden = mine.length <= show;
    more.textContent = all ? (more.dataset.few ?? '') : (more.dataset.all ?? '').replace('{n}', String(mine.length));
    cats.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.q === cat)));
  };
  cats.forEach((b) => x.on(b, 'click', () => {
    cat = b.dataset.q ?? 'privacy'; all = false;
    x.$$<HTMLDetailsElement>('#qlist details').forEach((d) => { d.open = d.dataset.cat === cat && d.dataset.k === '0'; });
    paint();
  }));
  x.on(more, 'click', () => { all = !all; paint(); });
}
