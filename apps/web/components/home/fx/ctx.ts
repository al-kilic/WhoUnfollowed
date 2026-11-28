import type { HomeCopy } from '../copy';

// Shared helpers for the homepage animations, ported from the prototype's
// script. Every timer, listener and observer goes through the context, so
// leaving the page stops all of it.
export interface FxCtx {
  root: HTMLElement;
  locale: string;
  t: HomeCopy['fx'];
  reduce: boolean;
  fine: boolean;
  $: <E extends Element = HTMLElement>(s: string, c?: ParentNode) => E | null;
  $$: <E extends Element = HTMLElement>(s: string, c?: ParentNode) => E[];
  fmt: (n: number) => string;
  later: (fn: () => void, ms: number) => number;
  timeout: (fn: () => void, ms: number) => number;
  every: (fn: () => void, ms: number) => void;
  on: <K extends keyof HTMLElementEventMap>(el: EventTarget | null, ev: K | string, fn: (e: HTMLElementEventMap[K]) => void, opts?: AddEventListenerOptions) => void;
  watch: (el: Element | null, fn: (e: IntersectionObserverEntry) => void, opts?: IntersectionObserverInit) => IntersectionObserver | null;
  raf: (fn: FrameRequestCallback) => void;
  dispose: () => void;
}

export function createCtx(root: HTMLElement, locale: string, t: HomeCopy['fx']): FxCtx {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer:fine)').matches;
  const timers = new Set<number>(), intervals: number[] = [], offs: (() => void)[] = [], obs: IntersectionObserver[] = [];
  let alive = true;
  const nf = new Intl.NumberFormat(locale);
  const timeout = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => { timers.delete(id); if (alive) fn(); }, ms);
    timers.add(id);
    return id;
  };
  return {
    root, locale, t, reduce, fine,
    $: (s, c) => (c ?? root).querySelector(s),
    $$: (s, c) => Array.from((c ?? root).querySelectorAll(s)),
    fmt: (n) => nf.format(Math.round(n)),
    later: (fn, ms) => timeout(fn, reduce ? 0 : ms),
    timeout,
    every: (fn, ms) => { intervals.push(window.setInterval(() => { if (alive) fn(); }, ms)); },
    on: (el, ev, fn, opts) => {
      if (!el) return;
      const h = fn as EventListener;
      el.addEventListener(ev, h, opts);
      offs.push(() => el.removeEventListener(ev, h, opts));
    },
    watch: (el, fn, opts) => {
      if (!el) return null;
      const o = new IntersectionObserver((es) => es.forEach((e) => { if (alive) fn(e); }), opts);
      o.observe(el);
      obs.push(o);
      return o;
    },
    raf: (fn) => { requestAnimationFrame((t) => { if (alive) fn(t); }); },
    dispose: () => {
      alive = false;
      timers.forEach((id) => clearTimeout(id));
      intervals.forEach((id) => clearInterval(id));
      offs.forEach((f) => f());
      obs.forEach((o) => o.disconnect());
    },
  };
}

// 0 → to, easing out, as text.
export function countUp(x: FxCtx, el: Element, to: number, ms: number, suf = '', pre = '') {
  if (x.reduce) { el.textContent = pre + x.fmt(to) + suf; return; }
  const t0 = performance.now();
  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 4);
    el.textContent = pre + x.fmt(to * e) + suf;
    if (p < 1) x.raf(step);
  };
  step(t0);
}

export function tween(x: FxCtx, from: number, to: number, ms: number, cb: (v: number) => void) {
  if (x.reduce) { cb(to); return; }
  const t0 = performance.now();
  const st = (t: number) => { const p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 4); cb(from + (to - from) * e); if (p < 1) x.raf(st); };
  st(t0);
}

export function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; }
  return a;
}
