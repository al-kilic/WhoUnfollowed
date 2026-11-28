import 'server-only';
import type Stripe from 'stripe';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { aiAllowance, profiles } from '@/lib/db/schema';
import { getStripe } from '@/lib/stripe';
import { sendTelegramMessage, escapeTelegramHtml } from '@/lib/telegram';

// Founder rule (2026-11-27): no AI spend for anyone who has not paid. A full
// refund or any dispute takes back what that payment bought:
//   - $499 Lifetime: lifetimePurchasedAt is cleared, so planFor gives no AI.
//   - Refill: the refill grant is closed (usd set to what was already used).
//   - Pro AI subscription charge: the subscription is cancelled now, and the
//     customer.subscription.deleted event then removes access.
// A partial refund changes nothing by itself; it sends an alert to decide by hand.
// The account is shared with another site, so a charge whose customer has no
// profile here is ignored.

type Kind = 'refund' | 'dispute';

const id = (v: string | { id: string } | null | undefined): string | null => (typeof v === 'string' ? v : v?.id ?? null);

async function alert(text: string): Promise<void> {
  await sendTelegramMessage(text, 'alerts').catch(() => null);
}

async function sessionFor(stripe: Stripe, paymentIntent: string | null): Promise<Stripe.Checkout.Session | null> {
  if (!paymentIntent) return null;
  const list = await stripe.checkout.sessions.list({ payment_intent: paymentIntent, limit: 1 });
  return list.data[0] ?? null;
}

export async function revokeForPayment(input: { kind: Kind; paymentIntent: string | null; customer: string | null; ref: string }, stripe: Stripe = getStripe()): Promise<string> {
  const session = await sessionFor(stripe, input.paymentIntent);
  const type = session?.metadata?.type;
  const label = `${input.kind} ${escapeTelegramHtml(input.ref)}`;

  if (session && type === 'lifetime') {
    const userId = session.metadata?.userId ?? null;
    const customer = id(session.customer) ?? input.customer;
    const where = userId ? eq(profiles.userId, userId) : customer ? eq(profiles.stripeCustomerId, customer) : null;
    if (!where) return 'lifetime: no account';
    const rows = await db.update(profiles).set({
      lifetimePurchasedAt: null,
      // Without a Pro AI subscription, an 'active' row with no expiry would read
      // as a never-ending old unlock, so it is closed too.
      subscriptionStatus: sql`case when ${profiles.stripeSubscriptionId} is null then 'cancelled'::subscription_status else ${profiles.subscriptionStatus} end`,
    }).where(where).returning({ userId: profiles.userId });
    await alert(`🚫 Lifetime ${label}: Lifetime and its AI access removed (${rows.length} account).`);
    return 'lifetime revoked';
  }

  if (session && type === 'topup') {
    const rows = await db.update(aiAllowance).set({ usd: sql`${aiAllowance.usedUsd}` })
      .where(and(eq(aiAllowance.kind, 'refill'), eq(aiAllowance.source, `refill:${session.id}`)))
      .returning({ id: aiAllowance.id });
    await alert(`🚫 Refill ${label}: refill closed (${rows.length} grant).`);
    return 'refill closed';
  }

  if (session) return `ignored: ${type ?? 'no type'}`;

  // No one-time checkout behind it: a subscription charge, if this customer
  // has a Pro AI subscription here.
  if (!input.customer) return 'ignored: no customer';
  const profile = await db.query.profiles.findFirst({ where: eq(profiles.stripeCustomerId, input.customer), columns: { userId: true, stripeSubscriptionId: true } });
  if (!profile?.stripeSubscriptionId) return 'ignored: not ours';
  try {
    await stripe.subscriptions.cancel(profile.stripeSubscriptionId);
  } catch (err) {
    await alert(`⚠️ Pro AI ${label}: could not cancel ${escapeTelegramHtml(profile.stripeSubscriptionId)}. Cancel it by hand.`);
    throw err;
  }
  await db.update(profiles).set({ subscriptionStatus: 'cancelled' }).where(eq(profiles.userId, profile.userId));
  await alert(`🚫 Pro AI ${label}: subscription cancelled, AI access removed.`);
  return 'subscription cancelled';
}

export async function handleChargeRefunded(charge: Stripe.Charge): Promise<string> {
  if (!charge.refunded) {
    const customer = id(charge.customer);
    const ours = customer ? await db.query.profiles.findFirst({ where: eq(profiles.stripeCustomerId, customer), columns: { userId: true } }) : null;
    if (!ours) return 'partial: not ours';
    await alert(`ℹ️ Partial refund on ${escapeTelegramHtml(charge.id)}: access unchanged. Check it by hand.`);
    return 'partial: alert only';
  }
  return revokeForPayment({ kind: 'refund', paymentIntent: id(charge.payment_intent), customer: id(charge.customer), ref: charge.id });
}

export async function handleDisputeCreated(dispute: Stripe.Dispute, stripe: Stripe = getStripe()): Promise<string> {
  const chargeId = id(dispute.charge);
  const charge = chargeId ? await stripe.charges.retrieve(chargeId) : null;
  return revokeForPayment({ kind: 'dispute', paymentIntent: id(dispute.payment_intent) ?? id(charge?.payment_intent), customer: id(charge?.customer), ref: dispute.id }, stripe);
}
