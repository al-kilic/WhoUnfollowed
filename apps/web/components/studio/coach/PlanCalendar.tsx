'use client';

import { useEffect, useRef, type KeyboardEvent } from 'react';
import type { AiPlanCalendarItem } from '@ig-tracker/core';
import { CalendarPlus, Check } from 'lucide-react';
import { planPhotoId } from '@/hooks/usePostPhotos';
import { useStudio } from '../StudioContext';
import { FORMAT_ICON } from './formats';
import { getPlanContent } from './plan.content';
import { Blur } from './ProPreview';
import { useCalendarDrag } from './useCalendarDrag';
import type { Picking } from './PlanMove';

// Shared by the Plan pages: the month grid and a few constants.

export type Item = AiPlanCalendarItem;
export const DAYS = 30;
export const DAY_MS = 86_400_000;

export const writeHref = (it: { idea: string; format: string }) => `/app/create?topic=${encodeURIComponent(it.idea)}&format=${it.format}`;

// Drag and drop and keyboard moves; absent on the blurred example board.
export interface CalendarMove {
  onDrop: (from: number, to: number) => void;
  whatAt: (from: number, day: number) => 'empty' | 'swap' | 'locked';
  picking: Picking | null;
  aim: (day: number) => void;
  cancel: () => void;
}

export function Calendar({ start, items, sel, onSel, todayIdx, blur = false, covers, move }: { start: Date; items: Item[]; sel: number; onSel: (d: number) => void; todayIdx: number; blur?: boolean; covers?: Map<string, string> | undefined; move?: CalendarMove }) {
  const { locale } = useStudio();
  const byDay = new Map(items.map((i) => [i.day, i]));
  const wd = (i: number) => new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 1 + i)));
  const label = (d: number) => new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(start.getTime() + d * DAY_MS));
  const p = getPlanContent(locale);
  const canDrag = (d: number) => !!move && !move.picking && !!byDay.get(d) && !byDay.get(d)!.posted;
  const { drag, bind } = useCalendarDrag({ canDrag, onDrop: (f, t) => move?.onDrop(f, t) });
  const grid = useRef<HTMLDivElement>(null);
  const picking = move?.picking ?? null;
  // Keyboard move: keep focus on the day being aimed at.
  useEffect(() => {
    if (picking) grid.current?.querySelector<HTMLElement>(`[data-day="${picking.target}"]`)?.focus();
  }, [picking]);
  const onKey = (e: KeyboardEvent) => {
    if (!picking || !move) return;
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (step) { e.preventDefault(); move.aim(picking.target + step); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); move.onDrop(picking.from, picking.target); }
    else if (e.key === 'Escape') { e.preventDefault(); move.cancel(); }
  };
  const aimAt = drag ? { from: drag.from, at: drag.over } : picking ? { from: picking.from, at: picking.target } : null;
  const dropCls = (d: number) => (!aimAt || aimAt.at !== d || d === aimAt.from || !move ? '' : move.whatAt(aimAt.from, d) === 'locked' ? ' drop-no' : ' drop-ok');
  const choose = (d: number) => (picking && move ? move.onDrop(picking.from, d) : onSel(d));
  const dragged = drag ? byDay.get(drag.from) : undefined;
  return (
    <section className={`s-card s-pad${picking ? ' s-picking' : ''}`}>
      <div className="s-cal" ref={grid} onKeyDown={onKey}>
        {Array.from({ length: 7 }, (_, i) => <span key={i}>{wd(i)}</span>)}
        {Array.from({ length: DAYS }, (_, d) => {
          const it = byDay.get(d);
          const num = new Date(start.getTime() + d * DAY_MS).getUTCDate();
          const cls = `s-day${d === sel ? ' sel' : ''}${d === todayIdx ? ' now' : ''}${dropCls(d)}${(drag?.from === d || picking?.from === d) ? ' drag-src' : ''}`;
          if (!it) return <button key={d} type="button" data-day={d} className={`${cls} emp`} aria-label={`${label(d)}: ${p.nothing}`} aria-pressed={d === sel} onClick={() => choose(d)}><span className="d">{num}</span><CalendarPlus size={14} className="s-plus" /></button>;
          const Ic = FORMAT_ICON[it.format];
          const cover = covers?.get(planPhotoId(items, it));
          const movable = !!move && !it.posted;
          return (
            <button key={d} type="button" data-day={d} className={`${cls} ${cover ? 'ph' : 'np'} f-${it.format}${movable ? ' mov' : ''}`} style={cover ? { backgroundImage: `url(${cover})` } : undefined}
              title={move ? (it.posted ? p.postedLocked : p.dragHint) : undefined}
              aria-label={blur ? label(d) : `${label(d)}: ${it.idea}${it.posted ? `, ${p.posted}` : ''}`} aria-pressed={d === sel} onClick={() => choose(d)} {...(movable ? bind(d) : {})}>
              <span className="d">{num}</span>{cover ? <span style={{ flex: 1 }} /> : <span className="tt">{blur ? <Blur>{it.idea}</Blur> : it.idea}</span>}
              <span className="f"><Ic size={13} />{it.posted && <span className="tick"><Check size={9} strokeWidth={3.5} /></span>}</span>
            </button>
          );
        })}
      </div>
      {drag && dragged && (
        <div className={`s-drag-ghost f-${dragged.format}`} aria-hidden="true" style={{ left: drag.x - drag.dx, top: drag.y - drag.dy, width: drag.w, height: drag.h }}>
          <span className="tt">{dragged.idea}</span>
        </div>
      )}
    </section>
  );
}
