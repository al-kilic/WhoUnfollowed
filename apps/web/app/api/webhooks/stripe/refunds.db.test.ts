import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type Stripe from 'stripe';
import { sql } from 'drizzle-orm';

// Runs against a real Postgres, like lib/ai/allowance.db.test.ts:
//   RUN_DB_TESTS=1 node_modules/.bin/vitest run app/api/webhooks/stripe/refunds.db.test.ts
const run = process.env.RUN_DB_TESTS === '1';
vi.mock('server-only', () => ({}));
vi.mock('@/lib/telegram', async (orig) => ({ ...(await orig<typeof import('@/lib/telegram')>()), sendTelegramMessage: vi.fn().mockResolvedValue({ ok: true }) }));

const fakeStripe = (session: Partial<Stripe.Checkout.Session> | null, cancel = vi.fn().mockResolvedValue({})) => ({
  checkout: { sessions: { list: vi.fn().mockResolvedValue({ data: session ? [session] : [] }) } },
  subscriptions: { cancel },
  charges: { retrieve: vi.fn().mockResolvedValue({ id: 'ch_x', payment_intent: 'pi_x', customer: 'cus_none' }) },
}) as unknown as Stripe;

describe.skipIf(!run)('refunds and disputes take AI back', () => {
  const ids: string[] = [];
  let mod: typeof import('./refunds');
  let access: typeof import('@/lib/ai/access');
  let allowance: typeof import('@/lib/ai/allowance');
  let dbmod: typeof import('@/lib/db/index');
  let schema: typeof import('@/lib/db/schema');

  async function user(profile: Record<string, unknown>): Promise<string> {
    const [u] = await dbmod.db.insert(schema.users).values({ email: `refund-test-${Date.now()}-${ids.length}@example.test`, passwordHash: 'x' }).returning({ id: schema.users.id });
    await dbmod.db.insert(schema.profiles).values({ userId: u!.id, ...profile });
    ids.push(u!.id);
    return u!.id;
  }
  const row = async (userId: string) => (await dbmod.db.query.profiles.findFirst({ where: (p, { eq }) => eq(p.userId, userId) }))!;

  beforeAll(async () => {
    dbmod = await import('@/lib/db/index');
    schema = await import('@/lib/db/schema');
    mod = await import('./refunds');
    access = await import('@/lib/ai/access');
    allowance = await import('@/lib/ai/allowance');
  });
  afterAll(async () => {
    for (const id of ids) await dbmod.db.execute(sql`delete from users where id = ${id}`);
  });

  it('a full Lifetime refund removes Lifetime and its AI', async () => {
    const userId = await user({ subscriptionStatus: 'active', lifetimePurchasedAt: new Date(), stripeCustomerId: `cus_lt_${Date.now()}` });
    expect(access.planFor(await row(userId))?.plan).toBe('lifetime');
    const stripe = fakeStripe({ id: 'cs_lt', metadata: { type: 'lifetime', userId }, customer: null });
    const charge = { id: 'ch_1', refunded: true, payment_intent: 'pi_1', customer: null } as unknown as Stripe.Charge;
    expect(await mod.revokeForPayment({ kind: 'refund', paymentIntent: 'pi_1', customer: null, ref: charge.id }, stripe)).toBe('lifetime revoked');
    const after = await row(userId);
    expect(after.lifetimePurchasedAt).toBeNull();
    expect(after.subscriptionStatus).toBe('cancelled');
    expect(access.planFor(after)).toBeNull();
  });

  it('a Lifetime dispute keeps a separate Pro AI subscription status as it was', async () => {
    const userId = await user({ subscriptionStatus: 'active', lifetimePurchasedAt: new Date(), stripeSubscriptionId: 'sub_keep', subscriptionInterval: 'month', currentPeriodEnd: new Date(Date.now() + 86_400_000) });
    await mod.revokeForPayment({ kind: 'dispute', paymentIntent: 'pi_2', customer: null, ref: 'dp_1' }, fakeStripe({ id: 'cs_lt2', metadata: { type: 'lifetime', userId } }));
    const after = await row(userId);
    expect(after.lifetimePurchasedAt).toBeNull();
    expect(after.subscriptionStatus).toBe('active');
  });

  it('a refunded refill can no longer be spent', async () => {
    const userId = await user({ subscriptionStatus: 'active', stripeSubscriptionId: 'sub_r', subscriptionInterval: 'month', currentPeriodEnd: new Date(Date.now() + 20 * 86_400_000) });
    const plan = access.planFor(await row(userId))!;
    await allowance.ensureGrants(userId, plan);
    await allowance.grantRefill(userId, `refill:cs_refill_${userId}`);
    expect(await allowance.available(userId, plan)).toBeCloseTo(5);
    expect(await mod.revokeForPayment({ kind: 'refund', paymentIntent: 'pi_3', customer: null, ref: 'ch_3' }, fakeStripe({ id: `cs_refill_${userId}`, metadata: { type: 'topup' } }))).toBe('refill closed');
    expect(await allowance.available(userId, plan)).toBeCloseTo(2.5);
  });

  it('a refunded subscription charge cancels the subscription', async () => {
    const customer = `cus_sub_${Date.now()}`;
    const userId = await user({ subscriptionStatus: 'active', stripeCustomerId: customer, stripeSubscriptionId: 'sub_cancel', subscriptionInterval: 'month', currentPeriodEnd: new Date(Date.now() + 86_400_000) });
    const cancel = vi.fn().mockResolvedValue({});
    expect(await mod.revokeForPayment({ kind: 'refund', paymentIntent: 'pi_4', customer, ref: 'ch_4' }, fakeStripe(null, cancel))).toBe('subscription cancelled');
    expect(cancel).toHaveBeenCalledWith('sub_cancel');
    expect(access.planFor(await row(userId))).toBeNull();
  });

  it('ignores customers that are not ours and old one-time unlocks', async () => {
    expect(await mod.revokeForPayment({ kind: 'refund', paymentIntent: 'pi_5', customer: 'cus_other_site', ref: 'ch_5' }, fakeStripe(null))).toBe('ignored: not ours');
    expect(await mod.revokeForPayment({ kind: 'refund', paymentIntent: 'pi_6', customer: null, ref: 'ch_6' }, fakeStripe({ id: 'cs_u', metadata: { type: 'unlock' } }))).toBe('ignored: unlock');
  });

  it('a partial refund only alerts, and only for our own customers', async () => {
    const customer = `cus_partial_${Date.now()}`;
    await user({ subscriptionStatus: 'none', stripeCustomerId: customer });
    expect(await mod.handleChargeRefunded({ id: 'ch_7', refunded: false, customer } as unknown as Stripe.Charge)).toBe('partial: alert only');
    expect(await mod.handleChargeRefunded({ id: 'ch_8', refunded: false, customer: 'cus_other_site' } as unknown as Stripe.Charge)).toBe('partial: not ours');
  });
});
