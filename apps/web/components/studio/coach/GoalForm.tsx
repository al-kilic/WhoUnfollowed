'use client';

import { useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import type { GoalView } from '@/lib/ai/goals';
import type { GoalType } from '@/lib/ai/goalMath';
import { useStudio } from '../StudioContext';
import { Seg } from './formats';
import { getGoalsContent } from './goals.content';

const TYPES: GoalType[] = ['followers', 'posts_week', 'per_post'];
const iso = (d: Date) => d.toISOString().slice(0, 10);
const plusMonths = (n: number) => { const d = new Date(); d.setUTCMonth(d.getUTCMonth() + n); return iso(d); };
const endOfMonth = () => { const d = new Date(); return iso(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0))); };

// Everything the goal and its check-ins are made of. Check-in options are kept.
export function goalPayload(view: GoalView, patch: Partial<{ type: GoalType; target: number; by: string | null; note: string; cadence: GoalView['cadence']; weekday: number | null; deadlineReminder: boolean }>) {
  const g = view.goal;
  return { platform: view.platform, type: g?.type ?? 'followers', target: g?.target ?? 1, by: g?.by ?? null, note: g?.note ?? '', cadence: view.cadence, weekday: view.weekday, deadlineReminder: view.deadlineReminder, ...patch };
}

export function GoalForm({ view, onSaved }: { view: GoalView; onSaved: (v: GoalView) => void }) {
  const { locale } = useStudio();
  const G = getGoalsContent(locale);
  const o = G.o;
  const [type, setType] = useState<GoalType>(view.goal?.type ?? 'followers');
  const [target, setTarget] = useState(String(view.goal?.target ?? ''));
  const [by, setBy] = useState(view.goal?.by ?? '');
  const [note, setNote] = useState(view.goal?.note ?? '');
  const [busy, setBusy] = useState(false);
  const cur = view.current;
  const quick = type === 'followers' ? (cur !== null ? [100, 250, 500].map((x) => cur + x) : [500, 1000, 2500]) : type === 'posts_week' ? [2, 3, 5, 7] : [10, 25, 50];
  const n = (x: number) => x.toLocaleString(locale);

  // Live check for follower goals: what a week needs to look like.
  const t = Number(target), weeks = by ? (new Date(`${by}T00:00:00Z`).getTime() - Date.now()) / (7 * 86_400_000) : null;
  const need = type === 'followers' && cur !== null && t > 0 && weeks && weeks > 0 ? Math.ceil(Math.max(0, t - cur) / weeks) : null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const body = goalPayload(view, { type, target: Number(target), by: type === 'followers' ? by || null : by || null, note: note.trim() });
    const r = await fetch('/api/ai/goal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => null);
    setBusy(false);
    if (r?.ok) onSaved((await r.json()) as GoalView);
  }
  return (
    <form onSubmit={submit} className="s-col" style={{ gap: 16 }}>
      <div className="s-field">
        <span className="s-lab">{o.goalType}</span>
        <Seg value={type} onChange={(v) => { setType(v); setTarget(''); }} label={o.goalType} options={TYPES.map((v) => ({ value: v, label: o.types[v] }))} />
        <span className="s-sub-t" style={{ fontSize: 12.5 }}>{o.typeHelp[type]}</span>
      </div>
      {type === 'followers' && cur === null && <p className="s-sub-t" style={{ margin: 0 }}>{G.noExport}</p>}
      <div className="s-field">
        <label className="s-lab" htmlFor="goal-target">{o.targetL[type]}</label>
        <div className="s-row" style={{ gap: 6, flexWrap: 'wrap' }}>
          <input id="goal-target" className="s-input" style={{ maxWidth: 150 }} required inputMode="numeric" value={target} onChange={(e) => setTarget(e.target.value.replace(/\D/g, ''))} />
          {quick.map((q) => <button key={q} type="button" className={`s-chip2${Number(target) === q ? ' on' : ''}`} onClick={() => setTarget(String(q))}>{n(q)}</button>)}
        </div>
      </div>
      <div className="s-field">
        <span className="s-lab">{G.by}</span>
        <div className="s-row" style={{ gap: 6, flexWrap: 'wrap' }}>
          {([[endOfMonth(), o.byQuick.endMonth], [plusMonths(3), o.byQuick.m3], [plusMonths(6), o.byQuick.m6], ['', o.byQuick.none]] as const).map(([v, l]) => (
            <button key={l} type="button" className={`s-chip2${by === v ? ' on' : ''}`} onClick={() => setBy(v)}>{l}</button>
          ))}
          <input id="goal-by" className="s-input" style={{ maxWidth: 170 }} type="date" aria-label={G.by} value={by} onChange={(e) => setBy(e.target.value)} />
        </div>
      </div>
      {need !== null && <div className="s-nextci"><Check size={16} /><span>{t <= (cur ?? 0) ? o.reachIt : o.neededWeek(n(need))}</span></div>}
      <div className="s-field">
        <label className="s-lab" htmlFor="goal-note">{o.note}</label>
        <input id="goal-note" className="s-input" maxLength={200} placeholder={o.notePh} value={note} onChange={(e) => setNote(e.target.value)} />
        <span className="s-sub-t" style={{ fontSize: 12.5 }}>{o.noteHelp}</span>
      </div>
      <button type="submit" className="s-btn lg" disabled={busy || !target}>{G.save}</button>
    </form>
  );
}
