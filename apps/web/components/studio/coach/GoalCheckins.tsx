'use client';

import { BellOff, BellRing } from 'lucide-react';
import type { GoalView } from '@/lib/ai/goals';
import type { Cadence } from '@/lib/ai/goalMath';
import { useStudio } from '../StudioContext';
import { Seg } from './formats';
import { getGoalsContent } from './goals.content';
import { goalPayload } from './GoalForm';

const CADENCES: Cadence[] = ['weekly', 'biweekly', 'monthly', 'off'];

// Check-in emails: how often, on which day, and a reminder before the deadline.
export function GoalCheckins({ view, rows, onSaved }: { view: GoalView; rows: { t: number; v: number; d: number | null }[]; onSaved: (v: GoalView) => void }) {
  const { locale } = useStudio();
  const G = getGoalsContent(locale);
  const g = G.g, o = G.o;
  const n = (v: number) => Math.round(v).toLocaleString(locale);
  const fmt = (t: number | string) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(t));
  const short = (t: number | string) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(t));
  async function save(patch: Parameters<typeof goalPayload>[1]) {
    onSaved({ ...view, ...('cadence' in patch ? { cadence: patch.cadence! } : {}), ...('weekday' in patch ? { weekday: patch.weekday ?? null } : {}), ...('deadlineReminder' in patch ? { deadlineReminder: !!patch.deadlineReminder } : {}) });
    const r = await fetch('/api/ai/goal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(goalPayload(view, patch)) }).catch(() => null);
    if (r?.ok) onSaved((await r.json()) as GoalView);
  }
  const on = view.cadence !== 'off';
  return (
    <section className="s-card">
      <div className="s-hd" style={{ alignItems: 'flex-start', paddingBlock: 14, flexWrap: 'wrap' }}>
        <div style={{ maxWidth: '52ch' }}><h3 className="s-h3">{g.checkins}</h3><span className="s-sub-t">{g.checkinsBody}{view.platforms.filter((x) => x.goal).length > 1 ? ` ${G.p.checkinsAll}` : ''}</span></div>
        <Seg value={view.cadence} onChange={(v) => void save({ cadence: v })} label={G.cadence} options={CADENCES.map((v) => ({ value: v, label: G.cadences[v] }))} />
      </div>
      <div className="s-pad s-col" style={{ gap: 14 }}>
        {on && (
          <div className="s-row" style={{ gap: 10, flexWrap: 'wrap' }}>
            <span className="s-lab">{o.on}</span>
            <div className="s-daysel" role="group" aria-label={o.on}>
              {o.weekdays.map((d, i) => <button key={d} type="button" className={view.weekday === i ? 'on' : ''} aria-pressed={view.weekday === i} onClick={() => void save({ weekday: i })}>{d.slice(0, 2)}</button>)}
              <button type="button" className={`wide${view.weekday === null ? ' on' : ''}`} aria-pressed={view.weekday === null} onClick={() => void save({ weekday: null })}>{o.anyDay}</button>
            </div>
          </div>
        )}
        {view.goal?.by && (
          <button type="button" className="s-row" style={{ gap: 10, textAlign: 'left' }} aria-pressed={view.deadlineReminder} onClick={() => void save({ deadlineReminder: !view.deadlineReminder })}>
            <span className={`s-tg${view.deadlineReminder ? ' on' : ''}`} aria-hidden="true" />
            <span><b style={{ fontWeight: 500 }}>{o.deadlineReminder}</b><span className="s-sub-t" style={{ display: 'block', fontSize: 12.5 }}>{o.deadlineHelp}</span></span>
          </button>
        )}
        {rows.length > 0 && (
          <div className="s-tl">
            {rows.map((r) => <div key={r.t} className="s-pt2"><i /><b>{short(r.t)}</b>{r.d === null ? <span>{g.start}</span> : <em>{r.d >= 0 ? '+' : ''}{n(r.d)}</em>}</div>)}
            {view.nextCheckin && <div className="s-pt2 next"><i /><b>{short(view.nextCheckin)}</b><span>{g.next}</span></div>}
          </div>
        )}
        <div className="s-nextci">{view.nextCheckin ? <BellRing size={16} /> : <BellOff size={16} />}<span>{view.nextCheckin ? g.nextOn(fmt(view.nextCheckin)) : g.noReminders}</span></div>
      </div>
      {rows.length > 1 && (
        <div className="s-tw" style={{ borderTop: '1px solid var(--line)' }}>
          <table>
            <thead><tr><th>{g.thExport}</th><th className="s-num">{g.thFollowers}</th><th className="s-num">{g.thChange}</th></tr></thead>
            <tbody>{[...rows].reverse().map((r) => <tr key={r.t}><td>{fmt(r.t)}</td><td className="s-num">{n(r.v)}</td><td className="s-num" style={{ color: r.d && r.d > 0 ? 'var(--good)' : 'var(--mute)' }}>{r.d === null ? '·' : `${r.d >= 0 ? '+' : ''}${n(r.d)}`}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}
