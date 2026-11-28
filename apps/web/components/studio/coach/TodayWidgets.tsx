'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AiPlanCalendarItem } from '@ig-tracker/core';
import { ArrowRight, ArrowUp, Check, Gauge, Lightbulb, Lock, MessageCircle, PenLine } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { planStart } from '@/lib/ai/planDays';
import { useStudio } from '../StudioContext';
import { FORMAT_ICON } from './formats';
import { getTodayContent } from './today.content';
import { GoalCard } from './TodayGoal';

type Item = AiPlanCalendarItem;
interface Plan { id: string; createdAt: string; calendar: Item[] }
const DAY_MS = 86_400_000;

// The newest plan (Pro AI only), and which plan day today is.
export function useTodayPlan(enabled: boolean) {
  const [plan, setPlan] = useState<Plan | null | undefined>(undefined);
  useEffect(() => {
    if (!enabled) return;
    void fetch('/api/ai/content?kind=plan', { cache: 'no-store' }).catch(() => null)
      .then(async (r) => setPlan(r?.ok ? ((await r.json()) as { plan: Plan | null }).plan : null));
  }, [enabled]);
  const save = useCallback(async (items: Item[]) => {
    if (!plan) return;
    setPlan({ ...plan, calendar: items });
    await fetch('/api/ai/plan/calendar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: plan.id, items }) }).catch(() => null);
  }, [plan]);
  const day = plan ? Math.floor((Date.now() - planStart(new Date(plan.createdAt)).getTime()) / DAY_MS) : -1;
  return { plan, day, save };
}

export function Lockchip() {
  const { c, openUpgrade } = useStudio();
  return <button type="button" className="s-badge acc" onClick={() => openUpgrade('plan')}><Lock size={11} />{c.lock.proAi}</button>;
}

export function CreateWidget() {
  const { locale, hasProAi } = useStudio();
  const t = getTodayContent(locale);
  const acts: [string, typeof PenLine, string][] = [
    ['/app/create', PenLine, t.actWrite],
    ['/app/create/check', Gauge, t.actCheck],
    ['/app/create/ideas', Lightbulb, t.actIdeas],
  ];
  return (
    <section className="s-card s-wg">
      <div className="s-hd"><h3 className="s-h3">{t.create}</h3>{!hasProAi && <Lockchip />}</div>
      {acts.map(([href, Ic, label]) => <Link key={href} href={href} className="s-act s-act-l"><Ic size={16} /><span>{label}</span><ArrowRight size={14} className="go" aria-hidden="true" /></Link>)}
    </section>
  );
}

export function WeekWidget({ tp }: { tp: ReturnType<typeof useTodayPlan> }) {
  const { locale, hasProAi, openUpgrade } = useStudio();
  const t = getTodayContent(locale);
  const wd = (i: number) => new Intl.DateTimeFormat(locale, { weekday: 'narrow', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 1 + i)));
  // The plan week that holds today (plan days start on a Monday).
  const first = tp.day >= 0 ? tp.day - (tp.day % 7) : 0;
  const week = Array.from({ length: 7 }, (_, i) => (hasProAi ? tp.plan?.calendar.find((x) => x.day === first + i) : ([0, 2, 4, 6].includes(i) ? { format: (['reel', 'carousel', 'photo', 'story'] as const)[i / 2]!, posted: i < 3 } : undefined)));
  const planned = week.filter(Boolean).length, done = week.filter((x) => x?.posted).length;
  const cells = (
    <div className="s-wk">
      {week.map((x, i) => {
        const Ic = x ? FORMAT_ICON[x.format] : null;
        return <div key={i}>{wd(i)}<i className={`${hasProAi && first + i === tp.day ? 't' : ''}${x ? ` np f-${x.format}` : ''}`}>{Ic && <Ic size={13} />}{x?.posted && <span className="tick"><Check size={9} strokeWidth={3.5} /></span>}</i></div>;
      })}
    </div>
  );
  return (
    <section className="s-card s-wg">
      <div className="s-hd"><h3 className="s-h3">{t.week}</h3>{hasProAi ? (tp.plan ? <span className="s-sub-t">{t.weekOf(done, planned)}</span> : null) : <Lockchip />}</div>
      {hasProAi
        ? <Link href="/app/plan" className="s-pad" style={{ display: 'block' }}>{cells}</Link>
        : <button type="button" className="s-pad s-col" style={{ gap: 8, width: '100%', textAlign: 'left' }} onClick={() => openUpgrade('plan')}><div style={{ filter: 'saturate(.6)', opacity: .8 }}>{cells}</div><span className="s-sub-t" style={{ fontSize: 12.5 }}>{t.weekLocked}</span></button>}
    </section>
  );
}

// The goal card lives in TodayGoal.tsx; the lock chip stays here.
export function GoalWidget({ platform }: { platform?: string }) {
  const { hasProAi } = useStudio();
  return <GoalCard platform={platform} lock={hasProAi ? null : <Lockchip />} />;
}

export function AskWidget() {
  const { locale, hasProAi } = useStudio();
  const t = getTodayContent(locale);
  return (
    <section className="s-card s-wg">
      <div className="s-hd"><h3 className="s-h3 s-row" style={{ gap: 6 }}><MessageCircle size={15} />{t.ask}</h3>{hasProAi ? <span className="s-sub-t">{t.askSub}</span> : <Lockchip />}</div>
      <div className="s-pad s-col s-fill" style={{ gap: 12 }}>
        <Link href="/app/ask" className="s-cbox s-grow" style={{ color: 'var(--faint)' }}><span style={{ flex: 1, padding: '6px 4px', alignSelf: 'flex-start' }}>{t.askPh}</span><span className="s-btn send" aria-hidden="true"><ArrowUp size={16} /></span></Link>
        <div className="s-row" style={{ flexWrap: 'wrap', gap: 6 }}>{t.askChips.map((q) => <Link key={q} href={`/app/ask?q=${encodeURIComponent(q)}`} className="s-chip2">{q}</Link>)}</div>
      </div>
    </section>
  );
}
