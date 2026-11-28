'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, GripVertical, Move, Plus, X } from 'lucide-react';
import { useStudio } from '../StudioContext';
import { getTodayContent } from './today.content';
import { addWidget, ALL_WIDGETS, DEFAULT_LAYOUT, dropWidget, LAYOUT_KEY, moveWidget, parseLayout, removeWidget, resize, type Layout, type Size, type WidgetId } from './todayLayout';

// The arrangeable lower part of Today. In edit mode each widget gets a small
// toolbar (drag, size, move, remove); hidden widgets can be added back.

export function useTodayLayout() {
  const [layout, setLayout] = useState<Layout>(DEFAULT_LAYOUT);
  useEffect(() => { try { setLayout(parseLayout(localStorage.getItem(LAYOUT_KEY))); } catch { /* storage blocked */ } }, []);
  const save = (l: Layout) => {
    setLayout(l);
    try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(l)); } catch { /* storage blocked */ }
  };
  return { layout, save, reset: () => save(DEFAULT_LAYOUT) };
}

// The weekly brief is tall, so at one column wide it spans two rows.
const TALL: WidgetId[] = ['brief'];

export function TodayBoard({ edit, layout, save, render }: {
  edit: boolean; layout: Layout; save: (l: Layout) => void; render: Record<WidgetId, ReactNode>;
}) {
  const { locale } = useStudio();
  const t = getTodayContent(locale);
  const c = t.custom;
  const [drag, setDrag] = useState<WidgetId | null>(null);
  const [adding, setAdding] = useState(false);
  const title: Record<WidgetId, string> = { create: t.create, week: t.week, goal: t.goal, ask: t.ask, since: t.since, brief: t.brief };
  const hidden = ALL_WIDGETS.filter((w) => !layout.some(([x]) => x === w));

  return (
    <>
      {edit && <div className="s-editbar"><Move size={15} /><span>{c.hint}</span></div>}
      <div className={`s-dash s-board${edit ? ' editing' : ''}`}>
        {layout.map(([id, size], i) => (
          <div key={id} className={`s-cell${drag === id ? ' dragging' : ''}`}
            style={{ gridColumn: `span ${size}`, gridRow: size === 1 && TALL.includes(id) ? 'span 2' : undefined }}
            draggable={edit} onDragStart={() => setDrag(id)} onDragEnd={() => setDrag(null)}
            onDragOver={(e) => { if (edit && drag) e.preventDefault(); }}
            onDrop={(e) => { e.preventDefault(); if (drag) save(dropWidget(layout, drag, id)); setDrag(null); }}>
            {edit && (
              <div className="s-wtool">
                <GripVertical size={15} className="grip" aria-hidden="true" />
                <b>{title[id]}</b>
                <span className="s-row" style={{ gap: 3, marginLeft: 'auto' }}>
                  {([1, 2, 3] as Size[]).map((n) => <button key={n} type="button" className={`s-wsz${n === size ? ' on' : ''}`} aria-label={`${title[id]}: ${c.sizes[n - 1]}`} aria-pressed={n === size} onClick={() => save(resize(layout, id, n))}>{c.sizes[n - 1]![0]}</button>)}
                  <button type="button" className="s-ib" aria-label={`${title[id]}: ${c.earlier}`} disabled={i === 0} onClick={() => save(moveWidget(layout, id, -1))}><ChevronLeft size={14} /></button>
                  <button type="button" className="s-ib" aria-label={`${title[id]}: ${c.later}`} disabled={i === layout.length - 1} onClick={() => save(moveWidget(layout, id, 1))}><ChevronRight size={14} /></button>
                  <button type="button" className="s-ib" aria-label={`${title[id]}: ${c.remove}`} onClick={() => save(removeWidget(layout, id))}><X size={14} /></button>
                </span>
              </div>
            )}
            <div className="s-cellb" inert={edit || undefined}>{render[id]}</div>
          </div>
        ))}
        {edit && (
          <div className="s-addw">
            <button type="button" className="s-btn sec" aria-expanded={adding} onClick={() => setAdding((a) => !a)}><Plus size={15} />{c.add}</button>
            {adding && (hidden.length
              ? <div className="s-row" style={{ gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>{hidden.map((w) => <button key={w} type="button" className="s-chip2" onClick={() => { save(addWidget(layout, w)); setAdding(false); }}>{title[w]}</button>)}</div>
              : <span className="s-sub-t" style={{ fontSize: 13 }}>{c.nothingHidden}</span>)}
          </div>
        )}
      </div>
    </>
  );
}
