import { richHtml } from '../rich';
import { countUp, type FxCtx } from './ctx';
import { coachPhotos } from './coachPhotos';

// The coach: Create, then Check, then Plan, on one Instagram post.
// Desktop: the section pins and scrolling moves the steps; each plays once and
// scrolling back up never replays it. Phones and reduced motion: no pin, the
// three play once when seen.
export function initCoach(x: FxCtx, hooks: string[]) {
  const sps = x.$$('#stepper .sp'), panes = x.$$('.cpane'), cap = x.$('#cap'), slides = x.$('#slides');
  const igd = x.$$('#igd i'), igc = x.$('#igc'), coachSec = x.$('#coach'), track = x.$('#ctrack'), cstage = x.$('#cstage');
  if (!cap || !slides || !coachSec || !track || !cstage) return;
  const sticky = x.$('.csticky', track)!;
  const t = x.t, DUR = 6200;
  let maxSeen = -1, complete = false, cTimers: number[] = [];
  const mine = coachPhotos(x);
  const ct = (fn: () => void, ms: number) => { cTimers.push(x.later(fn, ms)); };
  const slideTo = (n: number) => { slides.style.transform = `translateX(${-100 * n}%)`; igd.forEach((d, k) => d.classList.toggle('on', k === n)); if (igc) igc.textContent = `${n + 1}/3`; };
  const u = `<span class="u">${richHtml(t.handle)}</span>`;
  const capHTML = (withFix: boolean, marks: boolean) => `${u}<span class="hl${marks ? ' g' : ''}">${richHtml(hooks[0]!)}</span>${marks ? `<span class="ib g on">${richHtml(t.hookStrong)}</span>` : ''}${richHtml(t.body)}`
    + (withFix ? ` <span class="fixed">${richHtml(t.question)}</span>` : marks ? ` <span class="hl a">&nbsp;</span><span class="ib a on">${richHtml(t.noQuestion)}</span>` : '');
  const typeCap = () => {
    const full = hooks[0]! + t.body;
    if (x.reduce) { cap.innerHTML = capHTML(false, false); return; }
    let i = 0;
    const tick = () => {
      i += 2; cap.innerHTML = `${u}${richHtml(full.slice(0, i))}<span class="caret"></span>`;
      if (i < full.length) cTimers.push(x.timeout(tick, 28)); else cap.innerHTML = capHTML(false, false);
    };
    tick();
  };
  const enter = (m: number) => {
    cTimers.forEach(clearTimeout); cTimers = [];
    if (m > maxSeen) maxSeen = m;
    sps.forEach((s, i) => { s.setAttribute('aria-selected', String(i === m)); s.classList.toggle('seen', i <= maxSeen); });
    panes.forEach((p, i) => p.classList.toggle('on', i === m));
    if (m === 0) {
      slideTo(0); cap.innerHTML = `${u}<span class="caret"></span>`;
      const hs = x.$$('#hooks .hook'); hs.forEach((h) => h.classList.remove('on'));
      [0, 1, 2, 0].forEach((n, j) => ct(() => hs.forEach((h, q) => h.classList.toggle('on', q === n)), 300 + j * 520));
      ct(typeCap, 2400); ct(() => slideTo(1), 4600); ct(() => slideTo(2), 5600); ct(() => slideTo(0), 6600);
    }
    if (m === 1) {
      cap.innerHTML = capHTML(false, false);
      const v = x.$('#ringV'), n = x.$('#ringN'), cm = x.$('#ctaM'), cw = x.$('#ctaW'), fix = x.$('#fix');
      if (!v || !n || !cm || !cw || !fix) return;
      v.style.transition = 'none'; v.setAttribute('stroke-dasharray', '0 264'); v.setAttribute('stroke', 'var(--warn)');
      x.$$('.crit .meter i').forEach((i) => { i.style.width = '0'; }); cm.style.background = 'var(--warn)'; cw.textContent = t.missing; fix.classList.remove('in');
      x.raf(() => {
        v.style.transition = '';
        ct(() => { v.setAttribute('stroke-dasharray', `${264 * 0.64} 264`); countUp(x, n, 64, 1100); x.$$('.crit .meter i').forEach((i, j) => x.timeout(() => { i.style.width = i.dataset.w ?? '0'; }, j * 140)); }, 150);
        ct(() => { cap.innerHTML = capHTML(false, true); }, 900);
        ct(() => fix.classList.add('in'), 1700);
        ct(() => { cap.innerHTML = capHTML(true, false); cw.textContent = t.added; cm.style.width = '84%'; cm.style.background = 'var(--good)'; v.setAttribute('stroke', 'var(--good)'); v.setAttribute('stroke-dasharray', `${264 * 0.86} 264`); countUp(x, n, 86, 900); }, 3900);
      });
    }
    if (m === 2) {
      cap.innerHTML = capHTML(true, false);
      const ps = x.$$('.cal .p:not(.mine)'), note = x.$('#pnote');
      ps.forEach((p) => p.classList.remove('in')); mine?.classList.remove('in'); note?.classList.remove('show');
      const notify = () => ct(() => note?.classList.add('show'), x.reduce ? 0 : 450);
      ps.forEach((p, j) => ct(() => p.classList.add('in'), 250 + j * 160));
      ct(() => {
        const img = x.$('.ig-img'), a = img?.getBoundingClientRect(), b = mine?.getBoundingClientRect();
        if (x.reduce || !img || !mine || !a?.width || !b?.width || !img.animate) { mine?.classList.add('in'); notify(); return; }
        const f = document.createElement('div'); f.className = 'flyer';
        Object.assign(f.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px`, transformOrigin: '0 0' });
        x.root.appendChild(f);
        const anim = f.animate([{ transform: 'none', opacity: 0.95 }, { transform: `translate(${b.left - a.left}px,${b.top - a.top}px) scale(${b.width / a.width},${b.height / a.height})`, opacity: 1 }], { duration: 900, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'forwards' });
        anim.onfinish = () => { mine.classList.add('in'); f.remove(); notify(); };
      }, 1400);
    }
  };
  const bars = (seg: number, within: number) => sps.forEach((s, i) => {
    const v = complete || i < seg ? 1 : i === seg ? within : 0;
    x.$('.bar', s)?.style.setProperty('--p', v.toFixed(3));
  });
  sps.forEach((s, i) => x.on(s, 'click', () => enter(i)));
  const wide = window.matchMedia('(min-width:901px)');
  let pinned = false, started = false;
  // Short screens: scale the pinned stage down so the heading, the phone and
  // the panel all fit between the header and the bottom of the screen.
  const inner = x.$('.csticky > .wrap', track);
  const fit = () => {
    if (!inner) return;
    inner.style.transform = '';
    if (!pinned) return;
    const room = sticky.clientHeight - 24, need = inner.scrollHeight;
    const k = need > room ? Math.max(0.6, room / need) : 1;
    inner.style.transform = k < 1 ? `scale(${k.toFixed(3)})` : '';
  };
  const setPin = () => { pinned = wide.matches && !x.reduce; coachSec.classList.toggle('pin', pinned); fit(); };
  setPin(); x.on(wide, 'change', setPin);
  x.on(window, 'resize', fit);
  const onScroll = () => {
    if (!pinned || complete) return;
    const r = track.getBoundingClientRect(), total = track.offsetHeight - sticky.offsetHeight;
    if (total <= 0) return;
    const top0 = parseFloat(getComputedStyle(sticky).top) || 0;
    const pr = Math.min(1, Math.max(0, (top0 - r.top) / total)), seg = Math.min(2, Math.floor(pr * 3)), within = Math.min(1, pr * 3 - seg);
    if (r.top < window.innerHeight * 0.6 && !started) { started = true; enter(0); }
    if (!started) return;
    if (seg > maxSeen) enter(seg);
    if (seg >= maxSeen) bars(seg, within);
    if (pr >= 0.97 && maxSeen === 2) { complete = true; coachSec.classList.add('complete'); bars(2, 1); }
  };
  x.on(window, 'scroll', onScroll, { passive: true });
  x.watch(cstage, (e) => {
    if (!e.isIntersecting || started || pinned) return;
    started = true; enter(0);
    if (x.reduce) { complete = true; bars(0, 0); return; }
    let k = 0;
    const nx = () => { bars(k, 1); if (k >= 2) { complete = true; bars(2, 1); return; } x.timeout(() => { k++; enter(k); nx(); }, DUR); };
    nx();
  }, { threshold: 0.35 });
  onScroll();
}
