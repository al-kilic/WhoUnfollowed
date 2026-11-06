// When the next unfollow-planner nudge goes out. Pure, so it's easy to test.

export type PlannerCadence = 'weekly' | 'daily' | 'off';
export const PLANNER_CADENCES: PlannerCadence[] = ['weekly', 'daily', 'off'];

const DAY = 86_400_000;

// A plan nobody has touched for this long stops emailing: the person moved
// on, and nudging forever would just be noise.
export const PLANNER_STALE_DAYS = 21;

export function plannerNextAt(opts: { cadence: PlannerCadence; total: number; done: number; from: Date }): Date | null {
  if (opts.cadence === 'off' || opts.done >= opts.total) return null;
  return new Date(opts.from.getTime() + (opts.cadence === 'daily' ? 1 : 7) * DAY);
}

export function isStale(updatedAt: Date, now: Date): boolean {
  return now.getTime() - updatedAt.getTime() > PLANNER_STALE_DAYS * DAY;
}
