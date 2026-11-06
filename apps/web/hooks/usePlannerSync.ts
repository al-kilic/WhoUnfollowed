'use client';

import { useEffect, useRef } from 'react';
import { PACE_PER_DAY } from '@ig-tracker/core';
import type { PlanRecord } from '@/lib/db';
import type { AppLocale } from '@/i18n/routing';
import type { Platform } from '@/lib/platform';

// Sends the plan's counts (never usernames) to the server so the nudge email
// knows how many are left. Debounced, so ticking boxes doesn't spam requests.
// When a plan is deleted, the server copy is deleted too.
export function usePlannerSync(plan: PlanRecord | null | undefined, platform: Platform, locale: AppLocale, enabled: boolean) {
  const hadPlan = useRef(false);
  const total = plan ? plan.batches.reduce((n, b) => n + b.length, 0) : 0;
  const done = plan ? plan.done.length : 0;
  const cadence = plan?.cadence ?? 'weekly';
  const pace = plan?.pace;

  useEffect(() => {
    if (!enabled || plan === undefined) return;
    if (plan === null) {
      if (hadPlan.current) {
        hadPlan.current = false;
        void fetch(`/api/planner?platform=${platform}`, { method: 'DELETE' }).catch(() => {});
      }
      return;
    }
    hadPlan.current = true;
    const t = setTimeout(() => {
      void fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, total, done: Math.min(done, total), perDay: PACE_PER_DAY[pace ?? 'gentle'], cadence, locale }),
      }).catch(() => {});
    }, 1500);
    return () => clearTimeout(t);
    // plan identity changes on every tick; the counts below are what matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, plan === null, plan === undefined, platform, total, done, cadence, pace, locale]);
}
