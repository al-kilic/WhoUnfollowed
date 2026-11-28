'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AiPlan } from '@ig-tracker/core';
import { CalendarCheck, CalendarPlus, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { planStart } from '@/lib/ai/planDays';
import { usePlanCovers } from '@/hooks/usePostPhotos';
import { useStudio } from '../StudioContext';
import { StudioDialog } from '../StudioDialog';
import { CoachGate } from './CoachGate';
import { FormatBadge, FormatLegend, Seg, type Format } from './formats';
import { getPlanContent } from './plan.content';
import { ProPreview } from './ProPreview';
import { Calendar, DAY_MS, DAYS, writeHref, type Item } from './PlanCalendar';
import { DayPanel } from './PlanDay';
import { PlanRevise } from './PlanRevise';
import { PlanMoveBanner, PlanMoveToast, usePlanMove } from './PlanMove';
import { PlanReminders } from './PlanReminders';
import { getPlanRemindersContent } from './planReminders.content';
import { PlanSetup, type PlanSetupInfo } from './PlanSetup';
import { CoachSeen, type Seen } from './CoachSeen';
import { isSampleOn } from '@/lib/sample/sampleMode';
import { getSampleSeen } from '@/lib/sample/coach/seen';


interface Saved { id: string; createdAt: string; data: AiPlan; calendar: Item[] }

function ListView({ start, items }: { start: Date; items: Item[] }) {
  const { locale } = useStudio();
  const p = getPlanContent(locale);
  return (
    <section className="s-card s-tw">
      <table>
        <thead><tr><th>{p.thPost}</th><th>{p.thFormat}</th><th>{p.thDay}</th><th /></tr></thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.day}>
              <td><b style={{ fontWeight: 500 }}>{it.idea}</b></td>
              <td><FormatBadge format={it.format} /></td>
              <td className="s-sub-t" style={{ whiteSpace: 'nowrap' }}>{new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(start.getTime() + it.day * DAY_MS))}</td>
              <td className="s-num">{it.posted ? <span className="s-pace good">{p.posted}</span> : <Link href={writeHref(it)} className="s-btn sec xs">{p.writeIt}</Link>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function Board({ plan, onChange }: { plan: Saved; onChange: (items: Item[]) => void }) {
  const { locale } = useStudio();
  const p = getPlanContent(locale);
  const start = useMemo(() => planStart(new Date(plan.createdAt)), [plan.createdAt]);
  const todayIdx = Math.floor((Date.now() - start.getTime()) / DAY_MS);
  const [sel, setSel] = useState(() => Math.min(DAYS - 1, Math.max(0, todayIdx)));
  const [view, setView] = useState<'month' | 'list'>('month');
  const { userId } = useStudio();
  const [photoVersion, setPhotoVersion] = useState(0);
  const covers = usePlanCovers(`${userId ?? 'me'}:${plan.id}:`, photoVersion);
  const items = plan.calendar;
  const done = items.filter((i) => i.posted).length;
  const fmt = (d: Date) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(d);
  const dayLabel = (d: number) => new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(start.getTime() + d * DAY_MS));
  const mv = usePlanMove({ items, onChange, onMoved: setSel, dayLabel, p });
  return (
    <>
      <div className="s-row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div className="s-row" style={{ flexWrap: 'wrap', gap: 12 }}>
          <b style={{ fontWeight: 600 }}>{p.range(fmt(start), fmt(new Date(start.getTime() + (DAYS - 1) * DAY_MS)))}</b>
          <span className="s-sub-t">{p.done(done, items.length)}</span>
          <span className="s-meter" style={{ width: 120 }}><i style={{ width: `${items.length ? (done / items.length) * 100 : 0}%` }} /></span>
        </div>
        <div className="s-row" style={{ flexWrap: 'wrap', gap: 14 }}>
          <FormatLegend />
          <Seg value={view} onChange={setView} label={p.view} options={[{ value: 'month', label: p.month }, { value: 'list', label: p.list }]} />
        </div>
      </div>
      {view === 'list' ? <ListView start={start} items={items} /> : (
        <div className="s-gmain-top">
          <div className="s-col" style={{ gap: 10, minWidth: 0 }}>
            {mv.picking && <PlanMoveBanner p={p} onCancel={mv.cancel} />}
            <Calendar start={start} items={items} sel={sel} onSel={setSel} todayIdx={todayIdx} covers={covers} move={{ onDrop: mv.drop, whatAt: mv.whatAt, picking: mv.picking, aim: mv.aim, cancel: mv.cancel }} />
          </div>
          <DayPanel start={start} items={items} day={sel} todayIdx={todayIdx} onChange={onChange} planId={plan.id} onPhotos={() => setPhotoVersion((v) => v + 1)} onPickMove={mv.start} />
        </div>
      )}
      {mv.toast && <PlanMoveToast text={mv.toast.text} p={p} onUndo={mv.undo} onClose={mv.closeToast} />}
      <p className="s-sr" aria-live="polite">{mv.live}</p>
    </>
  );
}

function Plans({ making, setMaking }: { making: boolean; setMaking: (v: boolean) => void }) {
  const { locale, c: sc } = useStudio();
  const p = getPlanContent(locale);
  const [plan, setPlan] = useState<Saved | null | undefined>(undefined);
  const [setup, setSetup] = useState<PlanSetupInfo | null>(null);
  const [err, setErr] = useState(false);
  const [seen, setSeen] = useState<Seen | null>(() => (isSampleOn() ? getSampleSeen() : null));
  const load = useCallback(async () => {
    const r = await fetch('/api/ai/content?kind=plan', { cache: 'no-store' }).catch(() => null);
    const j = r?.ok ? ((await r.json()) as { plan: Saved | null; setup?: PlanSetupInfo }) : null;
    setPlan(j?.plan ?? null);
    setSetup(j?.setup ?? null);
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function change(items: Item[]) {
    if (!plan) return;
    const before = plan;
    setPlan({ ...plan, calendar: items });
    setErr(false);
    const r = await fetch('/api/ai/plan/calendar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: plan.id, items }) }).catch(() => null);
    if (!r?.ok) { setPlan(before); setErr(true); }
  }

  if (plan === undefined) return <p className="s-sub-t">{sc.loading}</p>;
  return (
    <>
      {plan ? <>{err && <p role="alert" style={{ color: 'var(--bad)', margin: 0 }}>{p.saveError}</p>}<Board plan={plan} onChange={(i) => void change(i)} /><PlanRevise id={plan.id} onDone={(s) => { setSeen(s); void load(); }} /><CoachSeen seen={seen} /></> : (
        <section className="s-card s-col" style={{ alignItems: 'center', textAlign: 'center', gap: 10, padding: 32 }}>
          <span className="s-edi"><CalendarPlus size={20} /></span>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{p.noPlanTitle}</h2>
          <p className="s-sub-t" style={{ margin: 0, maxWidth: 440 }}>{p.noPlanBody}</p>
          <button type="button" className="s-btn" onClick={() => setMaking(true)}><Sparkles size={14} />{p.firstPlan}</button>
        </section>
      )}
      <StudioDialog open={making} onClose={() => setMaking(false)} title={p.newPlanTitle} wide>
        <PlanSetup info={setup} onDone={(_, s) => { setSeen(s); setMaking(false); void load(); }} />
      </StudioDialog>
    </>
  );
}

// For visitors without Pro AI: the calendar's shape, with the post ideas blurred.
function ExampleBoard() {
  const { locale, openUpgrade } = useStudio();
  const p = getPlanContent(locale);
  const fmts: Format[] = ['reel', 'carousel', 'photo', 'reel', 'carousel', 'story'];
  const items: Item[] = [1, 3, 6, 8, 10, 13].map((day, i) => ({ day, format: fmts[i]!, idea: p.exampleIdeas[i]!, hook: '', posted: i < 2 }));
  const start = planStart(new Date());
  return (
    <>
      <div className="s-gmain-top">
        <Calendar start={start} items={items} sel={-1} onSel={() => openUpgrade('plan')} todayIdx={-1} blur />
        <ProPreview feature="plan" kind="plan">
          <div className="s-col" style={{ gap: 10, paddingTop: 4 }}><FormatLegend /></div>
        </ProPreview>
      </div>
    </>
  );
}

// Studio > Plan > 30-day plan.
export function PlanPage() {
  const { c: sc, locale } = useStudio();
  const p = getPlanContent(locale);
  const k = getPlanRemindersContent(locale);
  const [making, setMaking] = useState(false);
  const [cal, setCal] = useState(false);
  // The main action sits next to the title (primary), with the calendar beside it.
  const actions = (
    <div className="s-row" style={{ gap: 8, flexWrap: 'wrap' }}>
      <button type="button" className="s-btn sec" onClick={() => setCal(true)}><CalendarCheck size={14} />{k.addCal}</button>
      <button type="button" className="s-btn" onClick={() => setMaking(true)}><Sparkles size={14} />{p.newPlan}</button>
    </div>
  );
  return (
    <CoachGate title={sc.nav.plan} sub={p.sub} feature="plan" actions={actions}>
      {(state) => (state ? <>
        <Plans making={making} setMaking={setMaking} />
        <StudioDialog open={cal} onClose={() => setCal(false)} title={k.title}><PlanReminders /></StudioDialog>
      </> : <ExampleBoard />)}
    </CoachGate>
  );
}
