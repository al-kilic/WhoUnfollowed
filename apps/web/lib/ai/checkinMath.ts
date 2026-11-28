// Which check-in email a member is due, kept apart from the database so it
// can be tested without one. Goals are per platform; one email covers them all.

import { nextCheckinAt, type Cadence } from './goalMath';

const DAY = 86_400_000;

export interface CheckinGoalRow { id: string; platform: string; by: Date | null; setAt: Date; deadlineRemindedAt: Date | null }
export interface CheckinOptions { cadence: Cadence; weekday: number | null; lastSentAt: Date | null; deadlineReminder: boolean }

// Days until the deadline when the one-time reminder a week before is due.
export function deadlineDays(goal: CheckinGoalRow, deadlineReminder: boolean, now: Date): number | null {
  if (!deadlineReminder || goal.deadlineRemindedAt || !goal.by) return null;
  const days = Math.ceil((goal.by.getTime() - now.getTime()) / DAY);
  return days >= 0 && days <= 7 ? days : null;
}

// The regular check-in is due once per period, counted from the last email
// or, before the first one, from the earliest goal.
export function checkinDue(opts: CheckinOptions, goals: readonly CheckinGoalRow[], now: Date): { send: boolean; periodic: boolean; deadlines: Map<string, number> } {
  const deadlines = new Map<string, number>();
  for (const g of goals) {
    const d = deadlineDays(g, opts.deadlineReminder, now);
    if (d !== null) deadlines.set(g.id, d);
  }
  if (!goals.length) return { send: false, periodic: false, deadlines };
  const from = new Date(Math.min(...goals.map((g) => g.setAt.getTime())));
  const next = nextCheckinAt(opts.cadence, opts.lastSentAt, from, opts.weekday);
  const periodic = next !== null && next.getTime() <= now.getTime();
  return { send: periodic || deadlines.size > 0, periodic, deadlines };
}
