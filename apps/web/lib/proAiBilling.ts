import 'server-only';
import type Stripe from 'stripe';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';
import { sendTelegramMessage, escapeTelegramHtml } from '@/lib/telegram';
import { isLaunchPricing, type ProAiInterval } from './pricing';

// Pro AI is the only recurring subscription on the site. Everything about it
// that touches Stripe objects lives here, so the webhook route stays readable.

// Launch Prices until PRICE_INCREASE_AT, then the *_STANDARD ones. Create both
// in Stripe and set all four env vars, or checkout answers "not configured".
export function priceIdForProAi(interval: ProAiInterval, now: Date = new Date()): string | null {
  const suffix = isLaunchPricing(now) ? '' : '_STANDARD';
  const key = interval === 'yearly' ? `STRIPE_PRICE_PRO_AI_YEARLY${suffix}` : `STRIPE_PRICE_PRO_AI_MONTHLY${suffix}`;
  return process.env[key] ?? null;
}

// Every Pro AI price this deploy sells or has sold (launch and standard).
const PRO_AI_PRICE_KEYS = ['STRIPE_PRICE_PRO_AI_MONTHLY', 'STRIPE_PRICE_PRO_AI_YEARLY', 'STRIPE_PRICE_PRO_AI_MONTHLY_STANDARD', 'STRIPE_PRICE_PRO_AI_YEARLY_STANDARD'] as const;

export function proAiPriceIds(env: NodeJS.ProcessEnv = process.env): Set<string> {
  return new Set(PRO_AI_PRICE_KEYS.map((k) => env[k]?.trim()).filter((v): v is string => !!v));
}

// True only when every item of the subscription is a Pro AI price.
export function isProAiSubscription(sub: Pick<Stripe.Subscription, 'items'>, env: NodeJS.ProcessEnv = process.env): boolean {
  const ids = proAiPriceIds(env);
  const items = sub.items?.data ?? [];
  return items.length > 0 && items.every((i) => ids.has(i.price.id));
}

export interface SubscriptionFields {
  subscriptionStatus: 'active' | 'grace' | 'cancelled';
  subscriptionInterval: 'month' | 'year';
  currentPeriodEnd: Date | null;
  subscriptionStartedAt?: Date;
  // When a cancelled subscription stops; null while it renews.
  cancelAt: Date | null;
}

// Stripe status -> our status. 'grace' keeps a past-due subscriber's account
// recognisable while Stripe retries the card; access needs 'active'.
type SubLike = Pick<Stripe.Subscription, 'status' | 'items'> & { start_date?: number; cancel_at?: number | null; cancel_at_period_end?: boolean };
export function subscriptionFields(sub: SubLike): SubscriptionFields {
  const item = sub.items.data[0];
  const status = sub.status === 'active' || sub.status === 'trialing'
    ? 'active'
    : sub.status === 'past_due' ? 'grace' : 'cancelled';
  const currentPeriodEnd = item?.current_period_end ? new Date(item.current_period_end * 1000) : null;
  // Cancelled in the billing portal: still active until it stops. Resuming
  // clears both fields, so cancelAt goes back to null.
  const cancelAt = status === 'cancelled' ? null
    : sub.cancel_at ? new Date(sub.cancel_at * 1000)
      : sub.cancel_at_period_end ? currentPeriodEnd : null;
  return {
    subscriptionStatus: status,
    subscriptionInterval: item?.price.recurring?.interval === 'year' ? 'year' : 'month',
    currentPeriodEnd,
    cancelAt,
    ...(typeof sub.start_date === 'number' ? { subscriptionStartedAt: new Date(sub.start_date * 1000) } : {}),
  };
}

// A different subscription than the one stored is already live on this
// profile: never let it overwrite (a stale or duplicate subscription could
// cancel a paying member's plan). Keep the newer live one and tell the founder.
type Stored = { stripeSubscriptionId: string | null; subscriptionStatus: string | null; subscriptionStartedAt: Date | null };
export function shouldReplace(stored: Stored, sub: SubLike & { id: string }): boolean {
  if (!stored.stripeSubscriptionId || stored.stripeSubscriptionId === sub.id) return true;
  const storedLive = stored.subscriptionStatus === 'active' || stored.subscriptionStatus === 'grace';
  if (!storedLive) return true;
  const incomingLive = sub.status === 'active' || sub.status === 'trialing' || sub.status === 'past_due';
  if (!incomingLive) return false;
  const storedStart = stored.subscriptionStartedAt?.getTime() ?? 0;
  return (sub.start_date ?? 0) * 1000 >= storedStart;
}

// Writes a subscription's state onto the profile that owns it. Looks it up by
// subscription id first, then by customer (the checkout webhook may not have
// stored the subscription id yet when an update arrives).
export async function applySubscription(sub: Stripe.Subscription): Promise<boolean> {
  // The Stripe account is shared with another site: a subscription that is not
  // on a Pro AI price must never turn on Pro AI (and with it, AI spend).
  if (!isProAiSubscription(sub)) {
    console.warn(`[stripe] ignored subscription ${sub.id}: not a Pro AI price`);
    return false;
  }
  const fields = subscriptionFields(sub);
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
  const bySub = await db.update(profiles)
    .set({ ...fields, stripeCustomerId: customerId })
    .where(eq(profiles.stripeSubscriptionId, sub.id))
    .returning({ userId: profiles.userId });
  if (bySub.length) return true;
  const cols = { userId: true, stripeSubscriptionId: true, subscriptionStatus: true, subscriptionStartedAt: true } as const;
  // By customer, or for a first-time buyer by the user id checkout put on the
  // subscription's metadata (neither id is stored yet).
  const owner = await db.query.profiles.findFirst({ where: eq(profiles.stripeCustomerId, customerId), columns: cols })
    ?? (sub.metadata?.userId ? await db.query.profiles.findFirst({ where: eq(profiles.userId, sub.metadata.userId), columns: cols }) : undefined);
  if (!owner) return false;
  if (!shouldReplace(owner, sub)) {
    if (sub.status === 'active' || sub.status === 'trialing' || sub.status === 'past_due') await alertDuplicate(owner.stripeSubscriptionId, sub.id);
    return true;
  }
  if (owner.stripeSubscriptionId && owner.stripeSubscriptionId !== sub.id && (owner.subscriptionStatus === 'active' || owner.subscriptionStatus === 'grace')) {
    await alertDuplicate(owner.stripeSubscriptionId, sub.id);
  }
  await db.update(profiles)
    .set({ ...fields, stripeCustomerId: customerId, stripeSubscriptionId: sub.id })
    .where(eq(profiles.userId, owner.userId));
  return true;
}

async function alertDuplicate(kept: string | null, other: string): Promise<void> {
  const msg = `⚠️ Two live Pro AI subscriptions for one member (${escapeTelegramHtml(kept ?? '?')} and ${escapeTelegramHtml(other)}). Cancel one in Stripe and refund if needed.`;
  console.error(`[stripe] ${msg}`);
  await sendTelegramMessage(msg, 'alerts').catch(() => null);
}

// Re-reads the member's subscription from Stripe and applies it, for when a
// webhook is late or missing (e.g. right after the billing portal).
export async function syncSubscriptionFromStripe(stripe: Stripe, p: { stripeSubscriptionId: string | null; stripeCustomerId: string | null }): Promise<boolean> {
  let sub: Stripe.Subscription | null = null;
  if (p.stripeSubscriptionId) sub = await stripe.subscriptions.retrieve(p.stripeSubscriptionId).catch(() => null);
  if (!sub && p.stripeCustomerId) {
    const list = await stripe.subscriptions.list({ customer: p.stripeCustomerId, status: 'all', limit: 5 }).catch(() => null);
    sub = list?.data.sort((a, b) => b.created - a.created)[0] ?? null;
  }
  return sub ? applySubscription(sub) : false;
}
