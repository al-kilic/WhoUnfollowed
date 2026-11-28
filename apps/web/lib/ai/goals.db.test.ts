import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { sql } from 'drizzle-orm';

// Goals per platform against a real Postgres (local dev database, migration
// 0025 applied). Off by default:
//   RUN_DB_TESTS=1 node_modules/.bin/vitest run lib/ai/goals.db.test.ts
// with DATABASE_URL set. Creates one throwaway user and deletes it after.
const run = process.env.RUN_DB_TESTS === '1';
vi.mock('server-only', () => ({}));

describe.skipIf(!run)('goals per platform on Postgres', () => {
  let userId = '';
  let mod: typeof import('./goals');
  let dbmod: typeof import('@/lib/db/index');
  const base = { type: 'followers' as const, by: null, note: '', cadence: 'off' as const, weekday: null, deadlineReminder: false };

  beforeAll(async () => {
    dbmod = await import('@/lib/db/index');
    const { users, aiStatsLedger } = await import('@/lib/db/schema');
    mod = await import('./goals');
    const [u] = await dbmod.db.insert(users).values({ email: `goals-test-${Date.now()}@example.test`, passwordHash: 'x' }).returning({ id: users.id });
    userId = u!.id;
    const stat = (platform: string, followers: number, day: string) => ({ userId, platform, exportedAt: new Date(`${day}T12:00:00Z`), stats: JSON.stringify({ platform, followers }) });
    await dbmod.db.insert(aiStatsLedger).values([stat('instagram', 1200, '2026-11-01'), stat('threads', 300, '2026-11-10')]);
  });

  afterAll(async () => {
    if (userId) await dbmod.db.execute(sql`delete from users where id = ${userId}`);
  });

  it('defaults to the platform of the latest export, with no goal yet', async () => {
    const v = await mod.getGoalView(userId);
    expect(v.platform).toBe('threads');
    expect(v.goal).toBeNull();
    expect(v.current).toBe(300);
    expect(v.platforms.map((p) => p.platform)).toEqual(['instagram', 'threads']);
  });

  it('keeps one goal per platform, each measured on its own exports', async () => {
    expect(await mod.saveGoal(userId, { ...base, platform: 'instagram', target: 2000 })).toBe('instagram');
    expect(await mod.saveGoal(userId, { ...base, platform: 'threads', target: 500 })).toBe('threads');
    const ig = await mod.getGoalView(userId, 'instagram');
    const th = await mod.getGoalView(userId, 'threads');
    expect(ig.goal).toMatchObject({ target: 2000, startFollowers: 1200 });
    expect(th.goal).toMatchObject({ target: 500, startFollowers: 300 });
    expect(ig.platforms.filter((p) => p.goal).length).toBe(2);
  });

  it('changing check-in options keeps the goal start', async () => {
    await mod.saveGoal(userId, { ...base, platform: 'instagram', target: 2000, cadence: 'weekly' });
    const v = await mod.getGoalView(userId, 'instagram');
    expect(v.cadence).toBe('weekly');
    expect(v.goal?.startFollowers).toBe(1200);
  });

  it('removes one platform goal and leaves the other', async () => {
    await mod.deleteGoal(userId, 'threads');
    expect((await mod.getGoalView(userId, 'threads')).goal).toBeNull();
    expect((await mod.getGoalView(userId, 'instagram')).goal?.target).toBe(2000);
  });
});
