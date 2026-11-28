import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { hasLocale } from 'next-intl';
import { validateRequest } from '@/lib/auth/session';
import { isPaidFeaturesEnabled } from '@/lib/flags';
import { getStripe, isStripeConfigured, priceIdForUnlock, type UnlockDuration } from '@/lib/stripe';
import { getLifetimeAvailability } from '@/lib/lifetimeSeats';
import { priceIdForProAi } from '@/lib/proAiBilling';
import { priceIdForTopup } from '@/lib/aiTopup';
import { getProAiAccess } from '@/lib/ai/access';
import { canBuyRefill, hasPaidPlan } from '@/lib/ai/allowance';
import type { ProAiInterval } from '@/lib/pricing';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';
import { routing, type AppLocale } from '@/i18n/routing';
import { localizedPathname } from '@/i18n/localizedPathname';
import { checkRateLimit, clientIpFromXff } from '@/lib/auth/rate-limit';
import { checkoutConsent } from '@/lib/checkoutConsent';
import { checkoutDiscount } from '@/lib/launchOffers';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://whounfollowed.co';

// Three kinds of checkout: the Pro AI subscription (`body.plan === 'pro_ai'`,
// see proAiCheckout below), a one-time dated unlock (30 or 365 days,
// `body.billing`), or the never-expiring Lifetime tier (`body.plan === 'lifetime'`).
export async function POST(request: NextRequest) {
  if (!isPaidFeaturesEnabled() || !isStripeConfigured()) {
    return NextResponse.json({ error: 'Payments not enabled' }, { status: 404 });
  }

  const ip = clientIpFromXff(request.headers.get('x-forwarded-for'));
  if (!checkRateLimit(`stripe-checkout:${ip}`).allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  if (body.plan === 'pro_ai') return proAiCheckout(body);
  if (body.plan === 'topup') return topupCheckout(body);
  const isLifetime = body.plan === 'lifetime';
  const unlockDuration: UnlockDuration = body.billing === 'yearly' ? 'yearly' : 'monthly';
  const email: string | undefined = typeof body.email === 'string' ? body.email : undefined;
  // Where the visitor first came from this tab session (utm_source, referring
  // domain, or "direct"), captured client-side in layout.tsx. Purely for the
  // Telegram purchase alert / analytics reporting, never used for access
  // control, so a missing or tampered value is harmless.
  const acquisitionSource: string | undefined =
    typeof body.acquisitionSource === 'string' ? body.acquisitionSource.slice(0, 100) : undefined;
  const locale = hasLocale(routing.locales, body.locale) ? body.locale : routing.defaultLocale;
  // Strict boolean check: an opt-in is never inferred from a truthy-but-wrong
  // value, and it's purely informational, never gates the purchase itself.
  const marketingOptIn = body.marketingOptIn === true;

  // Lifetime sells in a seat ladder, so its price depends on how many seats
  // are already sold at the moment of checkout.
  let price: string | null;
  let lifetimePrice: number | null = null;
  if (isLifetime) {
    const availability = await getLifetimeAvailability();
    if (availability.status === 'sold_out') {
      return NextResponse.json({ error: 'Lifetime is sold out' }, { status: 410 });
    }
    price = availability.status === 'open' ? availability.priceId : null;
    lifetimePrice = availability.status === 'open' ? availability.offer.price : null;
  } else {
    price = priceIdForUnlock(unlockDuration);
  }
  if (!price) {
    return NextResponse.json({ error: 'Plan is not configured' }, { status: 500 });
  }

  const stripe = getStripe();
  const { user } = await validateRequest();
  // Never trust the request's Origin header for a Stripe redirect target: a
  // forged header would send a paying customer's session_id (usable to claim
  // their new account, see welcome/actions.ts) to an attacker-controlled
  // domain after checkout completes.
  const welcomePath = localizedPathname('/welcome', locale);
  const pricingPath = localizedPathname('/pricing', locale);

  const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
    mode: 'payment',
    line_items: [{ price, quantity: 1 }],
    success_url: `${APP_URL}${welcomePath}?session_id={CHECKOUT_SESSION_ID}&plan=${isLifetime ? 'lifetime' : 'unlock'}`,
    cancel_url: `${APP_URL}${pricingPath}`,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    // Lifetime is sold now; the old one-time unlock is not, so it is left as it was.
    ...(isLifetime ? checkoutConsent('lifetime', locale, APP_URL) : {}),
  };

  const metadata: Record<string, string> = isLifetime
    ? { type: 'lifetime', locale, ...(lifetimePrice !== null && { lifetimePrice: String(lifetimePrice) }) }
    : { type: 'unlock', unlockDuration, locale };
  if (acquisitionSource) metadata.acquisitionSource = acquisitionSource;
  if (isLifetime && marketingOptIn) metadata.marketingOptIn = 'true';

  if (user) {
    // Logged-in upgrade: reuse the existing Stripe customer if we have one so we
    // don't create duplicates; otherwise prefill the email.
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, user.id),
      columns: { stripeCustomerId: true },
    });
    if (profile?.stripeCustomerId) {
      sessionParams.customer = profile.stripeCustomerId;
    } else {
      sessionParams.customer_email = user.email;
    }
    metadata.userId = user.id;
  } else if (email) {
    sessionParams.customer_email = email;
  }
  // Otherwise Stripe collects the email on the checkout page (buy-first).
  // Payment-mode checkout only creates a Stripe Customer when asked to. Without
  // one, session.customer is null and nothing gets stored, so a repeat buyer
  // could never be matched to their earlier purchases. Not allowed together
  // with `customer`, so only for first-time buyers.
  if (!sessionParams.customer) sessionParams.customer_creation = 'always';
  sessionParams.metadata = metadata;

  const session = await stripe.checkout.sessions.create(sessionParams);
  return NextResponse.json({ url: session.url });
}

// Refill (the Stripe top-up price): one-time payment, signed-in members on a
// paid plan only, at most 2 held. Returns to Studio > You.
async function topupCheckout(body: Record<string, unknown>): Promise<NextResponse> {
  const price = priceIdForTopup();
  if (!price) return NextResponse.json({ error: 'Plan is not configured' }, { status: 500 });
  const { user } = await validateRequest();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  // Refills need a paid plan (a gift-only account is offered Pro AI instead),
  // and at most MAX_REFILLS_HELD may be held at once (founder, 2026-11-24).
  const access = await getProAiAccess(user.id);
  if (!access || !hasPaidPlan(access)) return NextResponse.json({ error: 'not_pro_ai' }, { status: 403 });
  if (!(await canBuyRefill(user.id, access))) return NextResponse.json({ error: 'refill_limit' }, { status: 409 });
  const locale: AppLocale = hasLocale(routing.locales, body.locale) ? body.locale : routing.defaultLocale;
  const profile = await db.query.profiles.findFirst({ where: eq(profiles.userId, user.id), columns: { stripeCustomerId: true } });
  const youPath = localizedPathname('/app/you', locale);
  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price, quantity: 1 }],
    success_url: `${APP_URL}${youPath}?topup=1`,
    cancel_url: `${APP_URL}${youPath}`,
    ...(profile?.stripeCustomerId ? { customer: profile.stripeCustomerId } : { customer_email: user.email }),
    metadata: { type: 'topup', userId: user.id, locale },
    ...checkoutConsent('topup', locale, APP_URL),
  });
  return NextResponse.json({ url: session.url });
}

// Pro AI: the one recurring subscription. Monthly or yearly, launch prices until
// Jan 1 2027 (see lib/proAiBilling.ts). Works logged in or buy-first: Stripe
// collects the email and the webhook creates or finds the account.
async function proAiCheckout(body: Record<string, unknown>): Promise<NextResponse> {
  const interval: ProAiInterval = body.billing === 'yearly' ? 'yearly' : 'monthly';
  const price = priceIdForProAi(interval);
  if (!price) return NextResponse.json({ error: 'Plan is not configured' }, { status: 500 });
  const locale: AppLocale = hasLocale(routing.locales, body.locale) ? body.locale : routing.defaultLocale;
  const acquisitionSource = typeof body.acquisitionSource === 'string' ? body.acquisitionSource.slice(0, 100) : undefined;

  const stripe = getStripe();
  const { user } = await validateRequest();
  const metadata: Record<string, string> = { type: 'pro_ai', interval, locale };
  if (acquisitionSource) metadata.acquisitionSource = acquisitionSource;

  const params: Parameters<typeof stripe.checkout.sessions.create>[0] = {
    mode: 'subscription',
    line_items: [{ price, quantity: 1 }],
    // Signed-in buyers go straight to their coach; buy-first buyers set a
    // password on /welcome first (overwritten below when signed in).
    success_url: `${APP_URL}${localizedPathname('/welcome', locale)}?session_id={CHECKOUT_SESSION_ID}&plan=pro_ai`,
    cancel_url: `${APP_URL}${localizedPathname('/pricing', locale)}`,
    // No promotion-code box: the Stripe account is shared with another site,
    // and a code made there could make Pro AI (and its AI spend) free. Our own
    // launch offers are applied as fixed discounts below.
    billing_address_collection: 'auto',
    ...checkoutConsent('pro_ai', locale, APP_URL),
  };
  if (user) {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, user.id),
      columns: { stripeCustomerId: true, lifetimePurchasedAt: true, subscriptionExpiresAt: true, stripeSubscriptionId: true, subscriptionStatus: true },
    });
    // Already subscribed: never sell a second subscription; the client sends
    // them to the billing portal to switch or keep their plan.
    if (profile?.stripeSubscriptionId && (profile.subscriptionStatus === 'active' || profile.subscriptionStatus === 'grace')) {
      return NextResponse.json({ error: 'already_subscribed' }, { status: 409 });
    }
    if (profile?.stripeCustomerId) params.customer = profile.stripeCustomerId;
    else params.customer_email = user.email;
    metadata.userId = user.id;
    params.success_url = `${APP_URL}${localizedPathname('/app/today', locale)}?welcome=1`;
    // Launch offers (lib/launchOffers.ts): early Lifetime 60% off monthly,
    // old yearly Pro $9.99 off yearly. Stripe takes either a fixed discount or
    // a promotion-code box, not both, so the box goes when an offer applies.
    const offer = await checkoutDiscount(stripe, profile ? { stripeCustomerId: profile.stripeCustomerId ?? null, lifetimePurchasedAt: profile.lifetimePurchasedAt ?? null, subscriptionExpiresAt: profile.subscriptionExpiresAt ?? null } : null, user.email, interval);
    if (offer) {
      params.discounts = [{ coupon: offer.coupon }];
      metadata.offer = offer.offer;
    }
  } else if (typeof body.email === 'string') {
    // Buy-first with a known email: reuse that Stripe customer, and refuse a
    // second subscription when they already have a live one.
    const existing = await liveCustomerForEmail(stripe, body.email);
    if (existing?.live) return NextResponse.json({ error: 'already_subscribed' }, { status: 409 });
    if (existing) params.customer = existing.id;
    else params.customer_email = body.email;
  }
  params.metadata = metadata;
  params.subscription_data = { metadata };

  const session = await stripe.checkout.sessions.create(params);
  return NextResponse.json({ url: session.url });
}

// The Stripe customer for an email, and whether it already has a live
// subscription (active, trialing or past due). Any lookup error means "none".
async function liveCustomerForEmail(stripe: ReturnType<typeof getStripe>, email: string): Promise<{ id: string; live: boolean } | null> {
  const customers = await Promise.resolve().then(() => stripe.customers.list({ email, limit: 5 })).catch(() => null);
  const first = customers?.data[0];
  if (!first) return null;
  for (const c of customers!.data) {
    const subs = await Promise.resolve().then(() => stripe.subscriptions.list({ customer: c.id, status: 'all', limit: 10 })).catch(() => null);
    if (subs?.data.some((x) => x.status === 'active' || x.status === 'trialing' || x.status === 'past_due')) return { id: c.id, live: true };
  }
  return { id: first.id, live: false };
}
