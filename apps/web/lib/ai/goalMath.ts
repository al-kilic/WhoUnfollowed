// Goal progress from follower counts, kept apart from the database so it can
// be tested without one. Counts come from the stats ledger (one row per
// uploaded export); nothing here sees a username.

export interface Goal {
  target: number;          // followers to reach
  by: Date | null;         // optional deadline
  startFollowers: number;  // followers when the goal was set
  setAt: Date;
}

export interface FollowerPoint { at: Date; followers: number }

export type GoalStatus = 'done' | 'ahead' | 'on_track' | 'behind' | 'no_deadline' | 'no_data';

export interface GoalProgress {
  current: number;
  gained: number;          // since the goal was set
  left: number;            // still to go (0 when reached)
  pct: number;             // 0..100, share of the distance covered
  perWeekNeeded: number | null;  // to hit the deadline from here
  perWeekSoFar: number | null;   // average since the goal was set
  status: GoalStatus;
}

const WEEK = 7 * 86_400_000;

export function goalProgress(goal: Goal, points: readonly FollowerPoint[], now: Date = new Date()): GoalProgress {
  const latest = [...points].sort((a, b) => b.at.getTime() - a.at.getTime())[0];
  const current = latest?.followers ?? goal.startFollowers;
  const distance = Math.max(1, goal.target - goal.startFollowers);
  const gained = current - goal.startFollowers;
  const left = Math.max(0, goal.target - current);
  const pct = Math.max(0, Math.min(100, Math.round((gained / distance) * 100)));

  const since = latest ? (latest.at.getTime() - goal.setAt.getTime()) / WEEK : 0;
  const perWeekSoFar = latest && since >= 1 ? Math.round((gained / since) * 10) / 10 : null;
  const weeksLeft = goal.by ? (goal.by.getTime() - now.getTime()) / WEEK : null;
  const perWeekNeeded = left > 0 && weeksLeft !== null ? (weeksLeft > 0 ? Math.ceil(left / weeksLeft) : left) : null;

  let status: GoalStatus;
  if (left === 0) status = 'done';
  else if (!latest || latest.at.getTime() <= goal.setAt.getTime()) status = 'no_data';
  else if (perWeekNeeded === null) status = 'no_deadline';
  else if (perWeekSoFar === null) status = 'no_data';
  else if (perWeekSoFar >= perWeekNeeded * 1.15) status = 'ahead';
  else if (perWeekSoFar >= perWeekNeeded * 0.9) status = 'on_track';
  else status = 'behind';

  return { current, gained, left, pct, perWeekNeeded, perWeekSoFar, status };
}

// When the next check-in email is due, or null when check-ins are off. With a
// weekday (0 = Sunday), the date moves forward to that day.
export type Cadence = 'weekly' | 'biweekly' | 'monthly' | 'off';
export function nextCheckinAt(cadence: Cadence, lastSentAt: Date | null, setAt: Date, weekday: number | null = null): Date | null {
  if (cadence === 'off') return null;
  const from = lastSentAt ?? setAt;
  const next = new Date(from);
  if (cadence === 'monthly') next.setUTCMonth(next.getUTCMonth() + 1);
  else next.setUTCDate(next.getUTCDate() + (cadence === 'weekly' ? 7 : 14));
  if (weekday !== null && weekday >= 0 && weekday <= 6) next.setUTCDate(next.getUTCDate() + ((weekday - next.getUTCDay() + 7) % 7));
  return next;
}

// Goals that are not a follower count are measured from the Posted page:
// posts a week (a habit) or average new followers per post.
export type GoalType = 'followers' | 'posts_week' | 'per_post';
export interface PostPoint { at: Date; newFollowers: number | null }

export function habitProgress(type: Exclude<GoalType, 'followers'>, target: number, posts: readonly PostPoint[], now: Date = new Date()): { current: number; pct: number; status: GoalStatus } {
  let current: number;
  if (type === 'posts_week') {
    current = posts.filter((p) => now.getTime() - p.at.getTime() < WEEK).length;
  } else {
    const res = [...posts].filter((p) => p.newFollowers !== null).sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, 5);
    if (!res.length) return { current: 0, pct: 0, status: 'no_data' };
    current = Math.round((res.reduce((s, p) => s + p.newFollowers!, 0) / res.length) * 10) / 10;
  }
  const pct = Math.max(0, Math.min(100, Math.round((current / Math.max(1, target)) * 100)));
  return { current, pct, status: current >= target ? 'done' : pct >= 75 ? 'on_track' : 'behind' };
}
