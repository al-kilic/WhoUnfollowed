import type Stripe from 'stripe';
import type { ProAiInterval } from '@/lib/pricing';

// Launch offers for people who paid before Pro AI existed (founder, 2026-11-24;
// .claude/reference/usage-allowance-spec.md):
//   - Early Lifetime (bought before EARLY_LIFETIME_BEFORE, the $19.99-$99 ladder):
//     60% off Pro AI MONTHLY, forever, whatever the monthly price is. Never yearly.
//   - Old yearly Pro (the one-time 365-day unlock): $9.99 off a Pro AI YEARLY
//     plan bought within LAUNCH_OFFER_DAYS of the launch date.
// Both are Stripe coupons the founder creates in the dashboard; their ids come
// from env. A missing coupon never blocks checkout: the buyer pays full price.

export const EARLY_LIFETIME_BEFORE = new Date('2026-11-11T00:00:00Z');
export const LAUNCH_OFFER_DAYS = 90;
// Used only when PRO_AI_LAUNCH_DATE is unset or unreadable.
export const DEFAULT_LAUNCH_DATE = '2026-12-01';

export function launchDate(env: NodeJS.ProcessEnv = process.env): Date {
  const raw = env.PRO_AI_LAUNCH_DATE?.trim();
  const d = raw ? new Date(/^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T00:00:00Z` : raw) : null;
  return d && !Number.isNaN(d.getTime()) ? d : new Date(`${DEFAULT_LAUNCH_DATE}T00:00:00Z`);
}

export function launchOfferEndsAt(env: NodeJS.ProcessEnv = process.env): Date {
  return new Date(launchDate(env).getTime() + LAUNCH_OFFER_DAYS * 86_400_000);
}

// Open from the launch day until LAUNCH_OFFER_DAYS later (end exclusive).
export function launchOfferOpen(now: Date = new Date(), env: NodeJS.ProcessEnv = process.env): boolean {
  return now >= launchDate(env) && now < launchOfferEndsAt(env);
}

export function isEarlyLifetime(p: { lifetimePurchasedAt: Date | null } | null | undefined): boolean {
  return !!p?.lifetimePurchasedAt && p.lifetimePurchasedAt < EARLY_LIFETIME_BEFORE;
}

// The old one-time unlock is not stored with its length on the profile (only
// the expiry date, which stacked purchases extend), so the reliable signal is
// the buyer's own paid Stripe Checkout Sessions: metadata.type 'unlock' with
// unlockDuration 'yearly' (set by the checkout route since the unlock existed),
// or a line item on the yearly unlock price. Looked up by Stripe customer and
// by email, because early unlocks were bought before customers were always
// created. Any Stripe error counts as "not eligible", never as a failure.
type SessionLister = Pick<Stripe, 'checkout'>;

export async function boughtYearlyUnlock(stripe: SessionLister, who: { customerId: string | null; email: string | null }, env: NodeJS.ProcessEnv = process.env): Promise<boolean> {
  const yearlyPrice = env.STRIPE_PRICE_UNLOCK_YEARLY;
  const isYearly = (s: Stripe.Checkout.Session) =>
    s.payment_status === 'paid' && (
      (s.metadata?.type === 'unlock' && s.metadata?.unlockDuration === 'yearly') ||
      (!!yearlyPrice && (s.line_items?.data ?? []).some((li) => li.price?.id === yearlyPrice)));
  const queries: Stripe.Checkout.SessionListParams[] = [];
  if (who.customerId) queries.push({ customer: who.customerId });
  if (who.email) queries.push({ customer_details: { email: who.email } });
  for (const q of queries) {
    try {
      const list = await stripe.checkout.sessions.list({ ...q, status: 'complete', limit: 100, expand: ['data.line_items'] });
      if (list.data.some(isYearly)) return true;
    } catch (err) {
      console.warn('[launchOffers] could not read past checkouts', err instanceof Error ? err.message : err);
    }
  }
  return false;
}

export type LaunchOffer = 'insider60' | 'yearly_loyalty';

export interface OfferProfile {
  lifetimePurchasedAt: Date | null;
  subscriptionExpiresAt: Date | null;
  stripeCustomerId: string | null;
}

// The coupon to apply to this Pro AI checkout, or null. Signed-in buyers only
// (the caller passes their profile and email).
export async function checkoutDiscount(
  stripe: SessionLister,
  profile: OfferProfile | null | undefined,
  email: string | null,
  interval: ProAiInterval,
  now: Date = new Date(),
  env: NodeJS.ProcessEnv = process.env,
): Promise<{ coupon: string; offer: LaunchOffer } | null> {
  if (!profile) return null;
  if (interval === 'monthly') {
    if (!isEarlyLifetime(profile)) return null;
    return couponFrom(env.STRIPE_COUPON_INSIDER_MONTHLY, 'insider60');
  }
  // Yearly: only for old one-time Pro buyers, only inside the launch window.
  // An old unlock always left an expiry date on the profile, so skip the Stripe
  // lookup for everyone else.
  if (!launchOfferOpen(now, env) || !profile.subscriptionExpiresAt) return null;
  if (!(await boughtYearlyUnlock(stripe, { customerId: profile.stripeCustomerId, email }, env))) return null;
  return couponFrom(env.STRIPE_COUPON_YEARLY_LOYALTY, 'yearly_loyalty');
}

function couponFrom(id: string | undefined, offer: LaunchOffer): { coupon: string; offer: LaunchOffer } | null {
  const coupon = id?.trim();
  if (!coupon) {
    console.warn(`[launchOffers] ${offer} applies but its coupon env var is not set; charging full price`);
    return null;
  }
  return { coupon, offer };
}
