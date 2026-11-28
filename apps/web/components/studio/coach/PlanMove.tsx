'use client';

import { useEffect, useState } from 'react';
import { Move, Undo2, X } from 'lucide-react';
import { dropPost } from '@/lib/ai/planCalendar';
import { DAYS, type Item } from './PlanCalendar';
import type { PlanContent } from './plan.content';

// Moving posts on the plan calendar: by drag and drop (useCalendarDrag) or by
// keyboard ("Pick a new day", then arrows and Enter). Every move goes through
// dropPost (move to a free day, swap with a post not yet posted) and offers an
// Undo for a few seconds. Moves save through the normal calendar save.
export interface Picking { from: number; target: number }

export function usePlanMove({ items, onChange, onMoved, dayLabel, p }: {
  items: Item[]; onChange: (items: Item[]) => void; onMoved: (day: number) => void; dayLabel: (d: number) => string; p: PlanContent;
}) {
  const [picking, setPicking] = useState<Picking | null>(null);
  const [toast, setToast] = useState<{ text: string; before: Item[] } | null>(null);
  const [live, setLive] = useState('');
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 7000);
    return () => clearTimeout(t);
  }, [toast]);

  const drop = (from: number, to: number) => {
    const r = dropPost(items, from, to, DAYS - 1);
    setPicking(null);
    if (!r) { setLive(p.postedLocked); return; }
    const text = r.kind === 'moved' ? p.moved(dayLabel(to)) : p.swapped(dayLabel(to));
    setToast({ text, before: items });
    setLive(text);
    onChange(r.items);
    onMoved(to);
  };
  const undo = () => {
    if (!toast) return;
    onChange(toast.before);
    setToast(null);
    setLive(p.undo);
  };
  // What landing on `d` would do, for the drop indicator and the announcement.
  const whatAt = (from: number, d: number): 'empty' | 'swap' | 'locked' => {
    const there = items.find((i) => i.day === d);
    return !there ? 'empty' : there.posted || d === from ? 'locked' : 'swap';
  };
  const aim = (target: number) => {
    if (!picking) return;
    const t = Math.min(DAYS - 1, Math.max(0, target));
    setPicking({ ...picking, target: t });
    const there = items.find((i) => i.day === t);
    setLive(p.target(dayLabel(t), whatAt(picking.from, t), there?.idea ?? ''));
  };
  const start = (from: number) => { setPicking({ from, target: from }); setLive(p.moveBanner); };
  return { picking, start, cancel: () => { setPicking(null); setLive(p.cancel); }, aim, drop, toast, undo, closeToast: () => setToast(null), live, whatAt };
}

export function PlanMoveBanner({ p, onCancel }: { p: PlanContent; onCancel: () => void }) {
  return (
    <div className="s-mvbar" role="status">
      <Move size={15} aria-hidden="true" /><span>{p.moveBanner}</span>
      <button type="button" className="s-btn sec xs" onClick={onCancel}><X size={13} />{p.cancel}</button>
    </div>
  );
}

export function PlanMoveToast({ text, p, onUndo, onClose }: { text: string; p: PlanContent; onUndo: () => void; onClose: () => void }) {
  return (
    <div className="s-mvtoast">
      <span>{text}</span>
      <button type="button" className="s-btn sec xs" onClick={onUndo}><Undo2 size={13} />{p.undo}</button>
      <button type="button" className="s-btn sec xs" aria-label={p.cancel} onClick={onClose}><X size={13} /></button>
    </div>
  );
}
