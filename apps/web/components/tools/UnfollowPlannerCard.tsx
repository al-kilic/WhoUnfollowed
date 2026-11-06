'use client';

import { useMemo, useState } from 'react';
import { PACE_PER_DAY, SUB_BATCH, buildPlan, daysAtEachPace, planProgress, type Account, type Pace } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';
import type { AppLocale } from '@/i18n/routing';
import { usePlan } from '@/hooks/usePlan';
import { PLATFORM_NAME, profileHref, type Platform } from '@/lib/platform';
import { getPlannerContent } from './planner.content';
import { ToolCard, ToolLabel, ToolSub, ToolTitle, fill, fmt, toolButton, toolButtonPrimary } from './ToolCard';

const PACES: Pace[] = ['gentle', 'steady', 'quick'];

export function UnfollowPlannerCard({ owner, platform, oneWay, starred, locale, pro }: {
  owner: string | null; platform: Platform; oneWay: Account[]; starred: ReadonlySet<string>; locale: AppLocale; pro?: string | undefined;
}) {
  const c = getPlannerContent(locale);
  const app = PLATFORM_NAME[platform];
  const { plan, savePlan, toggleDone, markBatchDone, deletePlan } = usePlan(owner, platform);
  const [pace, setPace] = useState<Pace>('gentle');
  const candidates = useMemo(() => oneWay.filter(a => !starred.has(a.username)), [oneWay, starred]);
  const days = daysAtEachPace(candidates.length);
  const hrefOf = useMemo(() => new Map(oneWay.map(a => [a.username, a.href])), [oneWay]);

  if (plan === undefined) return null; // still reading IndexedDB

  const header = (
    <>
      <ToolLabel pro={pro}>{c.label}</ToolLabel>
      <ToolTitle>{c.title}</ToolTitle>
    </>
  );

  if (!plan) {
    if (candidates.length === 0) return <ToolCard>{header}<ToolSub>{c.nothing}</ToolSub></ToolCard>;
    return (
      <ToolCard>
        {header}
        <ToolSub>{fill(c.sub, { count: fmt(candidates.length, locale), app })}</ToolSub>
        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend style={{ fontSize: 12, color: T.inkMute, marginBottom: 8 }}>{c.paceLabel}</legend>
          <div style={{ display: 'grid', gap: 8 }}>
            {PACES.map(p => (
              <label key={p} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 10, cursor: 'pointer', border: `1px solid ${pace === p ? 'var(--t-tealMid)' : 'var(--t-border2)'}` }}>
                <input type="radio" name="pace" value={p} checked={pace === p} onChange={() => setPace(p)} style={{ marginTop: 3 }} />
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 13.5, fontWeight: 600, color: T.ink }}>
                    {c.paces[p].name}<span style={{ fontWeight: 400, color: T.inkDim }}>{fill(c.days, { days: fmt(days[p], locale) })}</span>
                  </span>
                  <span style={{ fontSize: 12.5, color: T.inkDim }}>{fill(c.paces[p].hint, { app })}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        {oneWay.length > candidates.length && <p style={{ fontSize: 12.5, color: T.inkMute, marginTop: 10 }}>{fill(c.starredSkipped, { count: oneWay.length - candidates.length })}</p>}
        <p style={{ fontSize: 12.5, color: T.inkDim, lineHeight: 1.55, margin: '12px 0 14px' }}>{fill(c.safety, { app, sub: SUB_BATCH })}</p>
        <button type="button" style={toolButtonPrimary} onClick={() => savePlan(buildPlan({ accounts: candidates, pace, starred }))}>{c.start}</button>
      </ToolCard>
    );
  }

  const done = new Set(plan.done);
  const total = plan.batches.reduce((n, b) => n + b.length, 0);
  const prog = planProgress({ batches: plan.batches, perDay: PACE_PER_DAY[plan.pace], total }, done);
  const batch = prog.currentBatch >= 0 ? plan.batches[prog.currentBatch]! : [];

  return (
    <ToolCard>
      {header}
      <div role="progressbar" aria-valuenow={prog.pct} aria-valuemin={0} aria-valuemax={100} style={{ height: 6, borderRadius: 3, background: 'var(--t-surface2)', margin: '10px 0 8px', overflow: 'hidden' }}>
        <div style={{ width: `${prog.pct}%`, height: '100%', background: 'var(--t-tealMid)' }} />
      </div>
      <p style={{ fontSize: 13, color: T.inkDim, marginBottom: 14 }}>{fill(c.progress, { done: fmt(prog.done, locale), total: fmt(total, locale), days: fmt(prog.daysLeft, locale) })}</p>
      {prog.currentBatch < 0 ? (
        <ToolSub>{c.finished}</ToolSub>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <strong style={{ fontSize: 14.5, color: T.ink }}>{fill(c.today, { day: prog.currentBatch + 1, total: plan.batches.length })}</strong>
            <span style={{ fontSize: 12.5, color: T.inkMute }}>{fill(c.leftToday, { count: prog.currentBatchLeft })} · {fill(c.pause, { sub: SUB_BATCH })}</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: 320, overflowY: 'auto' }}>
            {batch.map((u, i) => (
              <li key={u} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: i > 0 && i % SUB_BATCH === 0 ? '1px dashed var(--t-border3)' : '1px solid var(--t-border1)' }}>
                <input type="checkbox" checked={done.has(u)} onChange={() => toggleDone(u)} aria-label={`@${u}`} />
                <span style={{ flex: 1, fontFamily: T.mono, fontSize: 13, color: done.has(u) ? T.inkMute : T.ink, textDecoration: done.has(u) ? 'line-through' : 'none' }}>@{u}</span>
                <a href={hrefOf.get(u) ?? profileHref(platform, u)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: T.tealLight }}>{c.open}</a>
              </li>
            ))}
          </ul>
          <button type="button" style={{ ...toolButton, marginTop: 12 }} onClick={() => markBatchDone(batch)}>{c.markAll}</button>
        </>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: T.inkMute }}>{c.privacy}</span>
        <button type="button" style={{ ...toolButton, padding: '5px 11px', fontSize: 12 }} onClick={deletePlan}>{c.reset}</button>
      </div>
    </ToolCard>
  );
}
