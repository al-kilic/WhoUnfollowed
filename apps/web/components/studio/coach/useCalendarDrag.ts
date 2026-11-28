'use client';

import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';

// Drag a calendar post to another day with pointer events, so mouse, pen and
// touch all work without a library. Mouse and pen start after a 5px move; touch
// starts after a long press (so a normal swipe still scrolls the page). Escape
// or a cancelled pointer drops nothing. The page scrolls when the pointer nears
// the top or bottom edge.
export interface DragState { from: number; over: number | null; x: number; y: number; dx: number; dy: number; w: number; h: number }

const MOVE_PX = 5;
const TOUCH_SLOP = 8;
const HOLD_MS = 350;
const EDGE = 72;

const dayAt = (x: number, y: number): number | null => {
  const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-day]');
  return el ? Number(el.dataset.day) : null;
};

export function useCalendarDrag({ canDrag, onDrop }: { canDrag: (day: number) => boolean; onDrop: (from: number, to: number) => void }) {
  const [drag, setDrag] = useState<DragState | null>(null);
  const pend = useRef<{ day: number; x: number; y: number; touch: boolean; rect: DOMRect; timer: number | null; started: boolean } | null>(null);
  const cur = useRef<DragState | null>(null);
  const suppress = useRef(false);
  const raf = useRef<number | null>(null);
  const drop = useRef(onDrop);
  drop.current = onDrop;

  const end = useCallback((commit: boolean) => {
    const p = pend.current;
    if (p?.timer) clearTimeout(p.timer);
    const d = cur.current;
    if (commit && d && d.over !== null && d.over !== d.from) drop.current(d.from, d.over);
    if (p?.started) suppress.current = true;
    pend.current = null;
    cur.current = null;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    document.body.classList.remove('s-dragging');
    setDrag(null);
  }, []);

  const update = useCallback((x: number, y: number) => {
    const d = cur.current;
    if (!d) return;
    cur.current = { ...d, x, y, over: dayAt(x, y) };
    setDrag(cur.current);
  }, []);

  const begin = useCallback(() => {
    const p = pend.current;
    if (!p || p.started) return;
    p.started = true;
    if (p.touch) navigator.vibrate?.(8);
    document.body.classList.add('s-dragging');
    cur.current = { from: p.day, over: p.day, x: p.x, y: p.y, dx: p.x - p.rect.left, dy: p.y - p.rect.top, w: p.rect.width, h: p.rect.height };
    setDrag(cur.current);
    // Auto-scroll near the window edges while dragging.
    const tick = () => {
      const d = cur.current;
      if (!d) return;
      const v = d.y < EDGE ? -Math.ceil((EDGE - d.y) / 6) : d.y > innerHeight - EDGE ? Math.ceil((d.y - innerHeight + EDGE) / 6) : 0;
      if (v) { scrollBy(0, v); update(d.x, d.y); }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [update]);

  useEffect(() => {
    const move = (e: globalThis.PointerEvent) => {
      const p = pend.current;
      if (!p) return;
      const dist = Math.hypot(e.clientX - p.x, e.clientY - p.y);
      if (!p.started) {
        if (p.touch) { if (dist > TOUCH_SLOP) end(false); return; } // a swipe: let the page scroll
        if (dist < MOVE_PX) return;
        begin();
      }
      update(e.clientX, e.clientY);
    };
    const up = () => { if (pend.current) end(true); };
    const cancel = () => { if (pend.current) end(false); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape' && pend.current?.started) { e.preventDefault(); end(false); } };
    // Once a touch drag has started, stop the page from scrolling under the finger.
    const touch = (e: TouchEvent) => { if (pend.current?.started) e.preventDefault(); };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
    addEventListener('pointercancel', cancel);
    addEventListener('keydown', key);
    addEventListener('touchmove', touch, { passive: false });
    return () => {
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      removeEventListener('pointercancel', cancel);
      removeEventListener('keydown', key);
      removeEventListener('touchmove', touch);
    };
  }, [begin, end, update]);

  const bind = (day: number) => ({
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      if (e.button !== 0 || !canDrag(day)) return;
      const touch = e.pointerType === 'touch';
      const rect = e.currentTarget.getBoundingClientRect();
      pend.current = { day, x: e.clientX, y: e.clientY, touch, rect, timer: null, started: false };
      if (touch) pend.current.timer = window.setTimeout(begin, HOLD_MS);
    },
    // The click that ends a drag must not also select the day.
    onClickCapture: (e: MouseEvent<HTMLElement>) => { if (suppress.current) { suppress.current = false; e.preventDefault(); e.stopPropagation(); } },
    // Long-press on touch opens no context menu.
    onContextMenu: (e: MouseEvent<HTMLElement>) => { if (pend.current?.touch) e.preventDefault(); },
  });

  return { drag, bind };
}
