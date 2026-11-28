import 'server-only';
import { and, desc, eq, inArray, isNotNull } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { aiContentLog, aiGoals, aiProfiles, aiStatsLedger } from '@/lib/db/schema';
import type { ExportStats, Platform } from '@ig-tracker/core';
import { goalProgress, habitProgress, nextCheckinAt, type Cadence, type FollowerPoint, type Goal, type GoalProgress, type GoalType, type PostPoint } from './goalMath';

// Goals are per platform (one per member and platform, table ai_goals). A
// follower goal is measured against that platform's exports only. Habit goals
// (posts a week, new followers per post) read the Posted log, which has no
// platform, so they count every post. Check-in options are per member.

const PLATFORMS: readonly Platform[] = ['instagram', 'threads', 'tiktok'];
export const platformOf = (v: string | null | undefined): Platform | null => (PLATFORMS.includes(v as Platform) ? (v as Platform) : null);

// Follower counts per export for one platform, newest first.
export async function followerPoints(userId: string, platform: Platform): Promise<FollowerPoint[]> {
  const rows = await db.select({ exportedAt: aiStatsLedger.exportedAt, stats: aiStatsLedger.stats })
    .from(aiStatsLedger).where(and(eq(aiStatsLedger.userId, userId), eq(aiStatsLedger.platform, platform)))
    .orderBy(desc(aiStatsLedger.exportedAt)).limit(60);
  return rows.map((r) => ({ at: r.exportedAt, followers: (JSON.parse(r.stats) as ExportStats).followers }));
}

// The platforms this member has uploaded, most recent export first.
export async function exportPlatforms(userId: string): Promise<Platform[]> {
  const rows = await db.select({ platform: aiStatsLedger.platform, exportedAt: aiStatsLedger.exportedAt })
    .from(aiStatsLedger).where(eq(aiStatsLedger.userId, userId)).orderBy(desc(aiStatsLedger.exportedAt)).limit(60);
  const out: Platform[] = [];
  for (const r of rows) { const p = platformOf(r.platform); if (p && !out.includes(p)) out.push(p); }
  return out;
}

// Posts the user marked as posted (Plan > Posted), with new followers when added.
// With a platform, only that platform's posts (rows from before the platform
// tag count as Instagram).
export type PlatformPostPoint = PostPoint & { platform: Platform };
export async function postPoints(userId: string, platform?: Platform): Promise<PlatformPostPoint[]> {
  const rows = await db.select({ at: aiContentLog.postedAt, results: aiContentLog.results, platform: aiContentLog.platform }).from(aiContentLog)
    .where(and(eq(aiContentLog.userId, userId), inArray(aiContentLog.kind, ['check', 'post']), isNotNull(aiContentLog.postedAt)))
    .orderBy(desc(aiContentLog.postedAt)).limit(180);
  return rows.filter((r) => !platform || (platformOf(r.platform) ?? 'instagram') === platform).slice(0, 60).map((r) => {
    let g: number | null = null;
    try { const v = (JSON.parse(r.results ?? '{}') as { newFollowers?: unknown }).newFollowers; if (typeof v === 'number') g = v; } catch { /* no results */ }
    return { at: r.at!, newFollowers: g, platform: platformOf(r.platform) ?? 'instagram' };
  });
}

// Posts of one platform, from a list of every platform's posts.
export const postsOn = (posts: readonly PlatformPostPoint[], p: Platform): PostPoint[] => posts.filter((x) => x.platform === p);

export interface GoalSummary { platform: Platform; type: GoalType; target: number; pct: number }

export interface GoalView {
  // The platform this view is for, and every platform with data or a goal.
  platform: Platform;
  platforms: { platform: Platform; hasData: boolean; goal: GoalSummary | null }[];
  goal: { type: GoalType; target: number; by: string | null; setAt: string; startFollowers: number; note: string } | null;
  cadence: Cadence;
  weekday: number | null;
  deadlineReminder: boolean;
  // Follower goals.
  progress: GoalProgress | null;
  // Posts-a-week and per-post goals.
  habit: { current: number; pct: number; status: GoalProgress['status'] } | null;
  // Latest follower count on this platform, to prefill a new goal.
  current: number | null;
  // Follower count per export since the goal was set (oldest first), for the pace chart.
  points: { at: string; followers: number }[];
  // When the next check-in email goes out, if check-ins are on.
  nextCheckin: string | null;
}

export const cadenceOf = (v: string | null | undefined): Cadence => (v === 'weekly' || v === 'biweekly' || v === 'monthly' ? v : 'off');
export const goalTypeOf = (v: string | null | undefined): GoalType => (v === 'posts_week' || v === 'per_post' ? v : 'followers');

type GoalRow = typeof aiGoals.$inferSelect;
export function goalFromRow(r: GoalRow | undefined): Goal | null {
  if (!r) return null;
  return { target: r.target, by: r.by, startFollowers: r.startFollowers, setAt: r.setAt };
}

export async function listGoals(userId: string): Promise<GoalRow[]> {
  return db.select().from(aiGoals).where(eq(aiGoals.userId, userId));
}

// Progress of one goal, from its platform's exports or the Posted log.
export function progressOf(row: GoalRow, points: FollowerPoint[], posts: PostPoint[], now: Date): { progress: GoalProgress | null; habit: GoalView['habit'] } {
  const type = goalTypeOf(row.type);
  const goal = goalFromRow(row)!;
  return type === 'followers'
    ? { progress: goalProgress(goal, points, now), habit: null }
    : { progress: null, habit: habitProgress(type, goal.target, posts, now) };
}

// The platform to show when none is asked for: the latest export's, then one
// with a goal, then Instagram.
// Instagram first (we are an Instagram-first app): Instagram whenever it has
// an export or a goal, otherwise the newest platform with data.
export function defaultPlatform(exported: Platform[], goals: GoalRow[]): Platform {
  if (exported.includes('instagram') || goals.some((g) => g.platform === 'instagram')) return 'instagram';
  return exported[0] ?? platformOf(goals[0]?.platform) ?? 'instagram';
}

export async function getGoalView(userId: string, platform?: Platform | null, now: Date = new Date()): Promise<GoalView> {
  const [profile, goals, exported, posts] = await Promise.all([
    db.query.aiProfiles.findFirst({ where: eq(aiProfiles.userId, userId) }),
    listGoals(userId),
    exportPlatforms(userId),
    postPoints(userId),
  ]);
  const pf = platform ?? defaultPlatform(exported, goals);
  const pointsBy = new Map<Platform, FollowerPoint[]>(await Promise.all(
    [...new Set<Platform>([pf, ...goals.map((g) => platformOf(g.platform)).filter((p): p is Platform => !!p)])]
      .map(async (p) => [p, await followerPoints(userId, p)] as const),
  ));
  const points = pointsBy.get(pf) ?? [];
  const row = goals.find((g) => g.platform === pf);
  const goal = goalFromRow(row);
  const type = goalTypeOf(row?.type);
  const weekday = profile?.checkinWeekday ?? null;
  const { progress, habit } = row ? progressOf(row, points, postsOn(posts, pf), now) : { progress: null, habit: null };
  const summary = (p: Platform): GoalSummary | null => {
    const g = goals.find((x) => x.platform === p);
    if (!g) return null;
    const r = progressOf(g, pointsBy.get(p) ?? [], postsOn(posts, p), now);
    return { platform: p, type: goalTypeOf(g.type), target: g.target, pct: r.progress?.pct ?? r.habit?.pct ?? 0 };
  };
  const shown = PLATFORMS.filter((p) => exported.includes(p) || goals.some((g) => g.platform === p) || p === pf);
  return {
    platform: pf,
    platforms: shown.map((p) => ({ platform: p, hasData: exported.includes(p), goal: summary(p) })),
    goal: goal && row ? { type, target: goal.target, by: goal.by?.toISOString().slice(0, 10) ?? null, setAt: goal.setAt.toISOString(), startFollowers: goal.startFollowers, note: row.note ?? '' } : null,
    cadence: cadenceOf(profile?.checkinCadence),
    weekday,
    deadlineReminder: profile?.checkinDeadlineReminder ?? false,
    progress,
    habit,
    current: points[0]?.followers ?? null,
    nextCheckin: goals.length ? (nextCheckinAt(cadenceOf(profile?.checkinCadence), profile?.checkinLastSentAt ?? null, earliestSetAt(goals), weekday)?.toISOString() ?? null) : null,
    points: goal ? points.filter((p) => p.at.getTime() >= goal.setAt.getTime() - 86_400_000).reverse().map((p) => ({ at: p.at.toISOString(), followers: p.followers })) : [],
  };
}

export const earliestSetAt = (goals: GoalRow[]): Date => new Date(Math.min(...goals.map((g) => g.setAt.getTime())));

// Sets (or replaces) the goal for one platform. Follower progress is measured
// from that platform's latest export at this moment. Changing only the
// check-in options (per member) keeps the goal as it is.
export interface GoalInput { platform?: Platform | undefined; type: GoalType; target: number; by: string | null; note: string; cadence: Cadence; weekday: number | null; deadlineReminder: boolean }
export async function saveGoal(userId: string, input: GoalInput, now: Date = new Date()): Promise<Platform> {
  const [goals, exported] = await Promise.all([listGoals(userId), exportPlatforms(userId)]);
  const platform = input.platform ?? defaultPlatform(exported, goals);
  const existing = goals.find((g) => g.platform === platform);
  const by = input.by ? new Date(`${input.by}T00:00:00Z`) : null;
  const sameGoal = !!existing && existing.target === input.target && goalTypeOf(existing.type) === input.type && (existing.by?.getTime() ?? null) === (by?.getTime() ?? null);
  const note = input.note || null;
  if (sameGoal) {
    await db.update(aiGoals).set({ note, updatedAt: now }).where(eq(aiGoals.id, existing.id));
  } else {
    const points = await followerPoints(userId, platform);
    const fields = { type: input.type, target: input.target, by, setAt: now, startFollowers: points[0]?.followers ?? 0, note, deadlineRemindedAt: null, updatedAt: now };
    await db.insert(aiGoals).values({ userId, platform, ...fields })
      .onConflictDoUpdate({ target: [aiGoals.userId, aiGoals.platform], set: fields });
  }
  const options = { checkinCadence: input.cadence, checkinWeekday: input.weekday, checkinDeadlineReminder: input.deadlineReminder, updatedAt: now };
  await db.insert(aiProfiles).values({ userId, ...options })
    .onConflictDoUpdate({ target: aiProfiles.userId, set: options });
  return platform;
}

export async function deleteGoal(userId: string, platform: Platform): Promise<void> {
  await db.delete(aiGoals).where(and(eq(aiGoals.userId, userId), eq(aiGoals.platform, platform)));
}
