import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { sql } from 'drizzle-orm';

// Who gets the posting-day reminder, against a real Postgres. Off by default:
//   RUN_DB_TESTS=1 node_modules/.bin/vitest run lib/ai/postingReminder.db.test.ts
// with DATABASE_URL set. Creates throwaway users and deletes them after.
const run = process.env.RUN_DB_TESTS === '1';

describe.skipIf(!run)('posting-day reminders on Postgres', () => {
  const ids: string[] = [];
  let mod: typeof import('./postingReminder');
  let dbmod: typeof import('@/lib/db/index');
  let schema: typeof import('@/lib/db/schema');
  // A Thursday; posting day 3 = Thursday.
  const now = new Date('2026-11-26T08:00:00Z');

  async function member(opts: { pro: boolean; on: boolean; days: string; sentFor?: string }) {
    const [u] = await dbmod.db.insert(schema.users).values({ email: `posting-test-${Date.now()}-${ids.length}@example.test`, passwordHash: 'x' }).returning({ id: schema.users.id });
    const id = u!.id;
    ids.push(id);
    await dbmod.db.insert(schema.profiles).values({ userId: id, ...(opts.pro ? { lifetimePurchasedAt: new Date('2026-01-01') } : {}) }).onConflictDoNothing();
    await dbmod.db.insert(schema.aiProfiles).values({ userId: id, postingReminder: opts.on, postingDays: opts.days, postingRemindedFor: opts.sentFor ?? null });
    return id;
  }

  beforeAll(async () => {
    dbmod = await import('@/lib/db/index');
    schema = await import('@/lib/db/schema');
    mod = await import('./postingReminder');
  });

  afterAll(async () => {
    for (const id of ids) await dbmod.db.execute(sql`delete from users where id = ${id}`);
  });

  it('picks only Pro AI members who turned it on, on a posting day, not yet sent today', async () => {
    const yes = await member({ pro: true, on: true, days: '3' });
    const off = await member({ pro: true, on: false, days: '3' });
    const free = await member({ pro: false, on: true, days: '3' });
    const otherDay = await member({ pro: true, on: true, days: '0,1' });
    const sentToday = await member({ pro: true, on: true, days: '3', sentFor: '2026-11-26' });
    const sentYesterday = await member({ pro: true, on: true, days: '3', sentFor: '2026-11-25' });
    const due = new Set((await mod.duePostingReminders(now)).rows.map((r) => r.userId));
    expect(due.has(yes)).toBe(true);
    expect(due.has(sentYesterday)).toBe(true);
    for (const id of [off, free, otherDay, sentToday]) expect(due.has(id)).toBe(false);
  });
});
