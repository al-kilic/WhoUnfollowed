import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { sql } from 'drizzle-orm';

// Runs against a real Postgres (local dev database, migration 0023 applied).
// Off by default:
//   RUN_DB_TESTS=1 node_modules/.bin/vitest run lib/ai/allowance.db.test.ts
// with DATABASE_URL set. Creates one throwaway user and deletes it after.
const run = process.env.RUN_DB_TESTS === '1';
vi.mock('server-only', () => ({}));
vi.mock('@/lib/telegram', () => ({ sendTelegramMessage: vi.fn().mockResolvedValue({ ok: true }) }));

describe.skipIf(!run)('usage allowance on Postgres', () => {
  let userId = '';
  let mod: typeof import('./allowance');
  let dbmod: typeof import('@/lib/db/index');
  const monthly = { plan: 'monthly' as const, periodEnd: new Date(Date.now() + 20 * 86_400_000) };

  beforeAll(async () => {
    dbmod = await import('@/lib/db/index');
    const { users } = await import('@/lib/db/schema');
    mod = await import('./allowance');
    const [u] = await dbmod.db.insert(users).values({ email: `allowance-test-${Date.now()}@example.test`, passwordHash: 'x' }).returning({ id: users.id });
    userId = u!.id;
  });

  afterAll(async () => {
    if (userId) await dbmod.db.execute(sql`delete from users where id = ${userId}`);
  });

  it('grants the month once per period', async () => {
    await mod.ensureGrants(userId, monthly);
    await mod.ensureGrants(userId, monthly);
    expect(await mod.available(userId, monthly)).toBeCloseTo(2.5);
  });

  it('grants a refill once per Stripe session and caps holding at 2', async () => {
    expect(await mod.grantRefill(userId, `refill:test-a-${userId}`)).toBe(true);
    expect(await mod.grantRefill(userId, `refill:test-a-${userId}`)).toBe(false);
    expect(await mod.canBuyRefill(userId, monthly)).toBe(true);
    await mod.grantRefill(userId, `refill:test-b-${userId}`);
    expect(await mod.canBuyRefill(userId, monthly)).toBe(false);
    expect(await mod.available(userId, monthly)).toBeCloseTo(7.5);
  });

  it('charges the month first and never goes below zero', async () => {
    await mod.charge(userId, monthly, 3);
    expect(await mod.available(userId, monthly)).toBeCloseTo(4.5);
    const view = await mod.allowanceFor(userId, monthly);
    expect(view.refills.held).toBe(2);
    await mod.charge(userId, monthly, 100);
    expect(await mod.available(userId, monthly)).toBe(0);
    expect(await mod.checkUse(userId, monthly)).toBe('empty');
  });

  it('never stacks a second month grant while one is live (plan change)', async () => {
    await mod.ensureGrants(userId, { plan: 'yearly', periodEnd: null });
    const rows = await dbmod.db.execute(sql`select count(*)::int as n from ai_allowance where user_id = ${userId} and kind = 'month'`);
    expect((rows as unknown as { rows?: { n: number }[] }).rows?.[0]?.n ?? (rows as unknown as { n: number }[])[0]?.n).toBe(1);
  });

  it('reserve refuses a worst case bigger than what is left, and settle gives back the difference', async () => {
    const other = await dbmod.db.execute(sql`insert into users (email, password_hash) values (${`hold-test-${Date.now()}@example.test`}, 'x') returning id`);
    const id = ((other as unknown as { rows?: { id: string }[] }).rows?.[0]?.id ?? (other as unknown as { id: string }[])[0]?.id)!;
    try {
      await mod.ensureGrants(id, monthly);
      expect(await mod.reserve(id, monthly, 3)).toBe('empty');
      expect(await mod.reserve(id, { plan: 'legacy', periodEnd: null }, 0.1)).toBe('empty');
      expect(await mod.reserve(id, { plan: 'earlyLifetime', periodEnd: null }, 0.1)).toBe('empty');
      const hold = await mod.reserve(id, monthly, 0.5);
      expect(typeof hold).toBe('object');
      expect(await mod.available(id, monthly)).toBeCloseTo(2.0);
      await mod.settle(hold as Exclude<typeof hold, string>, 0.1);
      expect(await mod.available(id, monthly)).toBeCloseTo(2.4);
      // Unknown cost keeps the whole hold.
      const h2 = await mod.reserve(id, monthly, 0.4);
      await mod.settle(h2 as Exclude<typeof h2, string>, null);
      expect(await mod.available(id, monthly)).toBeCloseTo(2.0);
      // Ten calls at once can never take more than is there.
      const many = await Promise.all(Array.from({ length: 10 }, () => mod.reserve(id, monthly, 0.3)));
      expect(many.filter((h) => typeof h === 'object').length).toBe(6);
      expect(await mod.available(id, monthly)).toBeCloseTo(0.2);
    } finally {
      await dbmod.db.execute(sql`delete from users where id = ${id}`);
    }
  });
});

