'use client';

import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { CircleCheck, Clock, Flag, Gauge, Target } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Platform } from '@ig-tracker/core';
import type { GoalView } from '@/lib/ai/goals';
import { PLATFORM_NAME } from '@/lib/platform';
import { useStudio } from '../StudioContext';
import { StudioDialog } from '../StudioDialog';
import { Ring } from '../Ring';
import { CoachGate } from './CoachGate';
import { Blur, ProPreview, RollingNumber, RollingRing } from './ProPreview';
import { getGoalsContent } from './goals.content';

import { pace, PaceChart } from './GoalChart';
import { GoalForm } from './GoalForm';
import { GoalCheckins } from './GoalCheckins';
import { GoalsPlatformBar } from './GoalsPlatformBar';
import { GoalRemove } from './GoalRemove';

function Goals() {
  const { locale } = useStudio();
  const G = getGoalsContent(locale);
  const g = G.g, o = G.o;
  const [view, setView] = useState<GoalView | null>(null);
  const [editing, setEditing] = useState(false);
  // Goals are per platform; without a pick, the server shows the latest export's.
  const load = useCallback(async (platform?: Platform) => {
    const r = await fetch(`/api/ai/goal${platform ? `?platform=${platform}` : ''}`, { cache: 'no-store' }).catch(() => null);
    if (r?.ok) setView((await r.json()) as GoalView);
  }, []);
  useEffect(() => { void load(); }, [load]);
  if (!view) return null;
  const app = PLATFORM_NAME[view.platform];
  const bar = <GoalsPlatformBar view={view} onPick={(p) => void load(p)} />;
  const multi = view.platforms.length > 1;
  const n = (v: number) => Math.round(v).toLocaleString(locale);
  const fmt = (t: number | string) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(t));
  const dialog = (
    <StudioDialog open={editing} onClose={() => setEditing(false)} title={view.goal ? g.changeGoal : multi ? G.p.setFor(app) : g.setGoal}>
      <GoalForm view={view} onSaved={(v) => { setView(v); setEditing(false); }} />
    </StudioDialog>
  );

  const goal = view.goal;
  if (!goal) {
    return (
      <>
        {bar}
        <section className="s-card s-col" style={{ alignItems: 'center', textAlign: 'center', gap: 12, padding: 32 }}>
          <Ring pct={0} size={112} stroke={10}><Target size={24} /></Ring>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{multi ? G.p.noGoalFor(app) : g.noGoalTitle}</h2>
          <p className="s-sub-t" style={{ margin: 0, maxWidth: 440 }}>{multi ? G.p.noGoalForBody(app) : g.noGoalBody}</p>
          <button type="button" className="s-btn" onClick={() => setEditing(true)}><Target size={15} />{multi ? G.p.setFor(app) : g.setGoal}</button>
        </section>
        {dialog}
      </>
    );
  }

  const followers = goal.type === 'followers';
  const p = followers ? pace(view) : null;
  const status = view.progress?.status ?? view.habit?.status ?? 'no_data';
  const pct = view.progress?.pct ?? view.habit?.pct ?? 0;
  const current = view.progress?.current ?? view.habit?.current ?? 0;
  const tone = status === 'behind' ? 'bad' : status === 'no_data' || status === 'no_deadline' ? 'warn' : 'good';
  const rows = p ? p.pts.map((x, i) => ({ t: x.t, v: x.v, d: i ? x.v - p.pts[i - 1]!.v : null })) : [];
  const thirds = [1, 2, 3].map((k) => Math.round(goal.startFollowers + ((goal.target - goal.startFollowers) * k) / 3));
  const title = followers ? (goal.by ? g.byDate(n(goal.target), fmt(goal.by)) : g.noDate(n(goal.target))) : `${o.targetL[goal.type]}: ${n(goal.target)}`;
  const sub = goal.type === 'followers' ? (view.progress ? g.toGo(n(view.progress.left), p?.daysLeft ?? null) : '') : o.habitNow[goal.type](n(current), n(goal.target));

  return (
    <>
      {bar}
      <div className="s-gmain-top">
        {followers && p ? (
          <section className="s-card">
            <div className="s-hd" style={{ flexWrap: 'wrap' }}>
              <h3 className="s-h3">{g.pace}</h3>
              <span className="s-row s-sub-t" style={{ gap: 14, flexWrap: 'wrap', fontSize: 12.5 }}>
                <span className="s-row"><i className="s-sw" style={{ background: 'var(--accent)' }} />{g.you}</span>
                <span className="s-row"><i className="s-sw" style={{ background: 'var(--faint)' }} />{g.atPace}</span>
                {goal.by && <span className="s-row"><i className="s-sw" style={{ background: 'var(--warn)' }} />{g.neededL}</span>}
              </span>
            </div>
            {p.pts.length < 2
              ? <div className="s-pad s-goal-empty"><Clock size={18} /><span>{g.noData}</span></div>
              : <div className="s-pad s-chartw s-goal-chart"><PaceChart view={view} p={p} label={G.progress} /></div>}
            <div className="s-kpis" style={{ '--kc': 3, borderTop: '1px solid var(--line)' } as CSSProperties}>
              <div className="s-kpi"><span className="s-kl"><Gauge size={13} />{g.nowL}</span><span className="s-kv"><b>{p.perDay === null ? '–' : p.perDay.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</b><span className="s-sub-t">{g.aDay}</span></span></div>
              <div className="s-kpi"><span className="s-kl"><Target size={13} />{g.neededK}</span><span className="s-kv"><b>{p.neededPerDay === null ? '–' : p.neededPerDay.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</b><span className="s-sub-t">{g.aDay}</span></span></div>
              <div className="s-kpi"><span className="s-kl"><Flag size={13} />{g.etaK}</span><span className="s-kv"><b style={{ fontSize: 18 }}>{p.eta ? fmt(p.eta) : p.perDay === null ? '–' : g.never}</b></span></div>
            </div>
          </section>
        ) : (
          <section className="s-card">
            <div className="s-hd"><h3 className="s-h3">{goal.type === 'posts_week' ? o.thisWeek : o.recent}</h3><Link href="/app/plan/posted" className="s-lnk" style={{ fontSize: 13 }}>{o.openPosted}</Link></div>
            <div className="s-pad s-col" style={{ gap: 12 }}>
              <span className="s-row" style={{ alignItems: 'baseline', gap: 8 }}><b style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-.03em', lineHeight: 1 }}>{n(current)}</b><span className="s-sub-t">/ {n(goal.target)}</span></span>
              <div className="s-meter" style={{ height: 8 }}><i style={{ width: `${pct}%` }} /></div>
              <span className="s-sub-t" style={{ fontSize: 13 }}>{o.habitHelp}</span>
            </div>
          </section>
        )}
        <section className="s-card">
          <div className="s-hd"><h3 className="s-h3">{g.yourGoal}</h3><span className={`s-pace ${tone}`}>{tone === 'good' ? <CircleCheck size={13} /> : <Clock size={13} />}{o.statusShort[status]}</span></div>
          <div className="s-pad s-col" style={{ alignItems: 'center', textAlign: 'center', gap: 14 }}>
            <Ring pct={pct} size={128} stroke={11} label={`${pct}%`}><b style={{ fontSize: 24, letterSpacing: '-.03em' }}>{pct}%</b></Ring>
            <div className="s-col" style={{ gap: 4 }}>
              <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0, textWrap: 'balance' }}>{title}</h2>
              {sub && <span className="s-sub-t" style={{ fontSize: 13 }}>{sub}</span>}
              {status === 'no_data' && <span className="s-sub-t" style={{ fontSize: 12.5 }}>{G.status.no_data}</span>}
            </div>
            {goal.note && <p className="s-goal-note">&ldquo;{goal.note}&rdquo;</p>}
            {followers && (
              <div className="s-miles">
                {thirds.map((v, i) => { const lo = i ? thirds[i - 1]! : goal.startFollowers; const w = Math.max(0, Math.min(100, ((current - lo) / Math.max(1, v - lo)) * 100)); return <div key={v} className="s-mile"><i><b style={{ width: `${w}%` }} /></i>{n(v)}</div>; })}
              </div>
            )}
            <button type="button" className="s-btn sec" style={{ width: '100%' }} onClick={() => setEditing(true)}><Target size={15} />{g.changeGoal}</button>
            <GoalRemove view={view} onRemoved={setView} />
          </div>
        </section>
      </div>
      <GoalCheckins view={view} rows={rows} onSaved={setView} />
      {dialog}
    </>
  );
}

// Studio > Plan > Goal.
export function GoalsPage() {
  const { c, locale } = useStudio();
  const G = getGoalsContent(locale);
  return (
    <CoachGate title={c.nav.goals} sub={G.sub} feature="goals">
      {(state) => state ? <Goals /> : (
        <ProPreview feature="goals" kind="goal" wide visual={<RollingRing lo={8} hi={96} size={112} suffix="%" />}>
          <svg viewBox="0 0 600 120" aria-hidden="true" style={{ width: '100%', height: 120, display: 'block' }}>
            <path d="M0 100 C80 96 120 80 200 74 S320 60 380 44" fill="none" style={{ stroke: 'var(--accent)' }} strokeWidth={2.5} className="s-draw" pathLength={1} />
            <path d="M380 44 L600 14" fill="none" style={{ stroke: 'var(--warn)' }} strokeWidth={1.6} strokeDasharray="6 5" />
            <path d="M380 44 L600 30" fill="none" style={{ stroke: 'var(--faint)' }} strokeWidth={1.6} strokeDasharray="2 4" />
          </svg>
          <div className="s-kpis" style={{ '--kc': 3, borderTop: '1px solid var(--line)', marginTop: 8 } as CSSProperties}>
            {[G.g.nowL, G.g.neededK, G.g.etaK].map((l, i) => <div key={l} className="s-kpi" style={{ paddingInline: 0 }}><span className="s-kl">{l}</span><span className="s-kv"><b>{i === 2 ? <Blur>Mar 14</Blur> : <RollingNumber lo={1} hi={40} />}</b></span></div>)}
          </div>
        </ProPreview>
      )}
    </CoachGate>
  );
}
