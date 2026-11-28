'use client';

import type { Platform } from '@ig-tracker/core';
import { PlatformSwitcher } from '@/components/PlatformSwitcher';
import { PlatformIcon } from '@/components/PlatformIcon';
import { PLATFORM_NAME } from '@/lib/platform';
import type { GoalView } from '@/lib/ai/goals';
import { useStudio } from '../StudioContext';
import { getGoalsContent } from './goals.content';

// Goals are per platform: the Instagram / Threads / TikTok switch (only when
// more than one platform has data or a goal) and, with two or more goals, a
// row with each goal's progress that also switches.
export function GoalsPlatformBar({ view, onPick }: { view: GoalView; onPick: (p: Platform) => void }) {
  const { locale } = useStudio();
  const P = getGoalsContent(locale).p;
  const n = (x: number) => x.toLocaleString(locale);
  const options = view.platforms.map((x) => x.platform);
  const goals = view.platforms.filter((x) => x.goal);
  if (options.length < 2) return null;
  return (
    <div className="s-col" style={{ gap: 10 }}>
      <PlatformSwitcher options={options} active={view.platform} onChange={onPick} ariaLabel={P.switcher}
        empty={view.platforms.filter((x) => !x.hasData).map((x) => x.platform)} />
      {goals.length > 1 && (
        <div className="s-row" role="list" aria-label={P.yourGoals} style={{ gap: 8, flexWrap: 'wrap' }}>
          {goals.map(({ platform, goal }) => (
            <button key={platform} type="button" role="listitem" className={`s-chip2${platform === view.platform ? ' on' : ''}`} onClick={() => onPick(platform)}
              aria-current={platform === view.platform ? 'true' : undefined}>
              <PlatformIcon platform={platform} size={13} />
              {PLATFORM_NAME[platform]} · {n(goal!.target)} · {goal!.pct}%
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
