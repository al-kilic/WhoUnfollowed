import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { validateRequest } from '@/lib/auth/session';
import { isPaidFeaturesEnabled } from '@/lib/flags';
import {
  getStripe,
  isStripeConfigured,
  priceIdForBilling,
  priceIdForUnlock,
  type Billing,
  type UnlockDuration,
} from '@/lib/stripe';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  if (!isPaidFeaturesEnabled() || !isStripeConfigured()) {
    return NextResponse.json({ error: 'Payments not enabled' }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const isUnlock = body.mode === 'unlock';
  const billing: Billing = body.billing === 'yearly' ? 'yearly' : 'monthly';
  const unlockDuration: UnlockDuration = billing;
  const email: string | undefined = typeof body.email === 'string' ? body.email : undefined;

  const price = isUnlock ? priceIdForUnlock(unlockDuration) : priceIdForBilling(billing);
  if (!price) {
    return NextResponse.json({ error: 'Plan is not configured' }, { status: 500 });
  }

  const stripe = getStripe();
  const { user } = await validateRequest();
  const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? '';

  const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
    mode: isUnlock ? 'payment' : 'subscription',
    line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/welcome?session_id={CHECKOUT_SESSION_ID}${isUnlock ? '&plan=unlock' : ''}`,
    cancel_url: `${origin}/pricing`,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
  };

  const metadata: Record<string, string> = {};
  if (isUnlock) metadata.type = 'unlock';
  if (isUnlock) metadata.unlockDuration = unlockDuration;

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
  // Otherwise Stripe collects the email on the checkout page (subscribe-first).
  sessionParams.metadata = metadata;

  const session = await stripe.checkout.sessions.create(sessionParams);
  return NextResponse.json({ url: session.url });
}
