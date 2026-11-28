import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { sql } from 'drizzle-orm';

// Runs against a real Postgres (local dev database). Off by default:
//   RUN_DB_TESTS=1 node_modules/.bin/vitest run lib/ai/credits.db.test.ts
// with DATABASE_URL set. Creates one throwaway user and deletes it after.
const run = process.env.RUN_DB_TESTS === '1';

describe.skipIf(!run)('credit ledger on Postgres', () => {
  let userId = '';
  let mod: typeof import('./credits');
  let dbmod: typeof import('@/lib/db/index');

  beforeAll(async () => {
    dbmod = await import('@/lib/db/index');
    const { users } = await import('@/lib/db/schema');
    mod = await import('./credits');
    const [u] = await dbmod.db.insert(users).values({ email: `credits-test-${Date.now()}@example.test`, passwordHash: 'x' }).returning({ id: users.id });
    userId = u!.id;
  });

  afterAll(async () => {
    if (userId) await dbmod.db.execute(sql`delete from users where id = ${userId}`);
  });

  it('grants once per period key', async () => {
    const expiresAt = new Date(Date.now() + 86_400_000);
    expect(await mod.grantCredits({ userId, amount: 10, reason: 'grant', periodKey: 'test:1', expiresAt })).toBe(true);
    expect(await mod.grantCredits({ userId, amount: 10, reason: 'grant', periodKey: 'test:1', expiresAt })).toBe(false);
    expect((await mod.getCredits(userId)).balance).toBe(10);
  });

  it('never overspends when requests arrive at the same time', async () => {
    const results = await Promise.all([1, 2, 3, 4].map(() => mod.spendCredits(userId, 'check', 3)));
    expect(results.filter((r) => r.ok)).toHaveLength(3);
    expect((await mod.getCredits(userId)).balance).toBe(1);
  });

  it('refunds a failed call only once', async () => {
    const spend = await mod.spendCredits(userId, 'draft', 1);
    expect(spend.ok).toBe(true);
    if (!spend.ok) return;
    await mod.refundCredits(userId, spend.spendId);
    await mod.refundCredits(userId, spend.spendId);
    expect((await mod.getCredits(userId)).balance).toBe(1);
  });
});
