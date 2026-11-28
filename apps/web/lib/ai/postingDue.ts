import type { AiPlanCalendarItem } from '@ig-tracker/core';
import { planStart } from './planDays';

// Is today a posting day, and which planned post is it for? Pure, so the
// reminder email's rules are tested without a database.
//
// A day counts when the newest plan has a post on it that isn't marked as
// posted yet, or, without one, when it's one of the member's posting days
// from You > Settings (0 = Monday). Dates are UTC, like the plan calendar.

const DAY_MS = 86_400_000;

export interface PostingDue { post: Pick<AiPlanCalendarItem, 'format' | 'idea'> | null }

export function utcDay(now: Date): string {
  return now.toISOString().slice(0, 10);
}

// `ahead` = 1 looks at tomorrow (the "day before" reminder), 0 at today.
export function postingDue(opts: {
  now: Date;
  days: number[];
  plan?: { createdAt: Date; calendar: AiPlanCalendarItem[] } | null;
  ahead?: 0 | 1;
}): PostingDue | null {
  const today = Date.UTC(opts.now.getUTCFullYear(), opts.now.getUTCMonth(), opts.now.getUTCDate()) + (opts.ahead ?? 0) * DAY_MS;
  if (opts.plan) {
    const idx = Math.round((today - planStart(opts.plan.createdAt).getTime()) / DAY_MS);
    const item = opts.plan.calendar.find((i) => i.day === idx);
    if (item) return item.posted ? null : { post: { format: item.format, idea: item.idea } };
  }
  const weekday = (new Date(today).getUTCDay() + 6) % 7;
  return opts.days.includes(weekday) ? { post: null } : null;
}
