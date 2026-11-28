'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { GoalView } from '@/lib/ai/goals';
import { PLATFORM_NAME, type Platform } from '@/lib/platform';
import { useStudio } from '../StudioContext';
import { Blur, RollingRing } from './ProPreview';
import { getTodayContent } from './today.content';
import { getTodayCardsContent } from './todayCards.content';
import { GoalArc, GoalTrend } from './TodayGoalArt';

// Today > Goal for the platform on screen. Small shows the ring and the
// headline; medium adds pace, needed pace and the projected date; large adds
// the follower trend since the goal was set (CSS container queries).
export function GoalCard({ platform, lock }: { platform?: string | undefined; lock?: ReactNode }) {
  const { locale, hasProAi, openUpgrade } = useStudio();
  const t = getTodayContent(locale);
  const k = getTodayCardsContent(locale).goal;
  const [view, setView] = useState<GoalView | null>(null);
  useEffect(() => {
    if (!hasProAi) return;
    void fetch(`/api/ai/goal${platform ? `?platform=${platform}` : ''}`, { cache: 'no-store' }).catch(() => null).then(async (r) => { if (r?.ok) setView((await r.json()) as GoalView); });
  }, [hasProAi, platform]);
  const n = (x: number) => Math.round(x).toLocaleString(locale);
  const day = (iso: string) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
  const g = view?.goal;
  const prog = view?.progress ?? null;
  const p = prog ?? (view?.habit && g ? { pct: view.habit.pct, current: view.habit.current, left: Math.max(0, g.target - view.habit.current), status: view.habit.status, perWeekNeeded: null, perWeekSoFar: null } : null);
  const status = p ? (p.pct >= 100 ? 'done' : p.status) : null;
  // Projected date from the pace so far (follower goals only).
  const projected = prog && prog.left > 0 && prog.perWeekSoFar && prog.perWeekSoFar > 0
    ? new Date(Date.now() + (prog.left / prog.perWeekSoFar) * 7 * 86_400_000).toISOString() : null;

  return (
    <section className="s-card s-wg s-goalw">
      <div className="s-hd">
        <h3 className="s-h3">{t.goal}</h3>
        {view?.platform && hasProAi ? <span className="s-g-chip">{PLATFORM_NAME[view.platform as Platform]}</span> : lock}
      </div>
      {!hasProAi ? (
        <button type="button" className="s-pad s-row" style={{ gap: 14, width: '100%', textAlign: 'left' }} onClick={() => openUpgrade('plan')}>
          <RollingRing lo={8} hi={96} size={64} suffix="%" />
          <span className="s-col" style={{ gap: 4 }}><b style={{ fontWeight: 600 }}>{t.goalLocked}</b><span className="s-sub-t" style={{ fontSize: 13 }}><Blur>2,196 of 3,000 by Mar 1</Blur></span></span>
        </button>
      ) : g && p ? (
        <div className="s-pad s-g-body">
          <div className="s-g-main">
            <GoalArc pct={p.pct} label={`${Math.round(p.pct)}%`} />
            <div className="s-col" style={{ gap: 4, minWidth: 0 }}>
              <b className="s-g-head">{t.goalOf(n(p.current), n(g.target))}</b>
              <span className="s-sub-t" style={{ fontSize: 13 }}>{g.by ? `${t.byDate(day(`${g.by}T00:00:00`))} · ` : ''}{p.left > 0 ? t.toGo(n(p.left)) : k.done}</span>
              {status && <span className={`s-g-status ${status}`}>{k.status[status]}</span>}
            </div>
          </div>
          <dl className="s-g-m">
            {prog && <div><dt>{k.pace}</dt><dd>{prog.perWeekSoFar !== null ? k.perWeek(n(prog.perWeekSoFar)) : k.notYet}</dd></div>}
            {prog && prog.perWeekNeeded !== null && <div><dt>{k.needed}</dt><dd>{k.perWeek(n(prog.perWeekNeeded))}</dd></div>}
            {prog && <div><dt>{k.projected}</dt><dd>{projected ? k.projectedAt(day(projected)) : k.notYet}</dd></div>}
            {view.nextCheckin && <div><dt>{k.nextCheckin}</dt><dd>{day(view.nextCheckin)}</dd></div>}
          </dl>
          {view.points.length > 1 && <GoalTrend points={view.points} target={g.target} label={k.trend} />}
          <Link href="/app/plan/goals" className="s-lnk" style={{ fontSize: 13 }}>{t.changeGoal}<ArrowRight size={13} /></Link>
        </div>
      ) : (
        <div className="s-pad s-col" style={{ gap: 8 }}><span className="s-sub-t">{t.noGoal}</span><Link href="/app/plan/goals" className="s-lnk">{t.setGoal}<ArrowRight size={13} /></Link></div>
      )}
    </section>
  );
}
