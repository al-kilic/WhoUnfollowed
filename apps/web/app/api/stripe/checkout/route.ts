import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { validateRequest } from '@/lib/auth/session';
import { isPaidFeaturesEnabled } from '@/lib/flags';
import { getStripe, isStripeConfigured, priceIdForUnlock, type UnlockDuration } from '@/lib/stripe';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';

// Every purchase here is a one-time unlock (30 or 365 days), never a
// recurring subscription.
export async function POST(request: NextRequest) {
  if (!isPaidFeaturesEnabled() || !isStripeConfigured()) {
    return NextResponse.json({ error: 'Payments not enabled' }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const unlockDuration: UnlockDuration = body.billing === 'yearly' ? 'yearly' : 'monthly';
  const email: string | undefined = typeof body.email === 'string' ? body.email : undefined;
  // Where the visitor first came from this tab session (utm_source, referring
  // domain, or "direct"), captured client-side in layout.tsx. Purely for the
  // Telegram purchase alert / analytics reporting, never used for access
  // control, so a missing or tampered value is harmless.
  const acquisitionSource: string | undefined =
    typeof body.acquisitionSource === 'string' ? body.acquisitionSource.slice(0, 100) : undefined;

  const price = priceIdForUnlock(unlockDuration);
  if (!price) {
    return NextResponse.json({ error: 'Plan is not configured' }, { status: 500 });
  }

  const stripe = getStripe();
  const { user } = await validateRequest();
  const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? '';

  const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
    mode: 'payment',
    line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/welcome?session_id={CHECKOUT_SESSION_ID}&plan=unlock`,
    cancel_url: `${origin}/pricing`,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
  };

  const metadata: Record<string, string> = { type: 'unlock', unlockDuration };
  if (acquisitionSource) metadata.acquisitionSource = acquisitionSource;

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
  sessionParams.metadata = metadata;

  const session = await stripe.checkout.sessions.create(sessionParams);
  return NextResponse.json({ url: session.url });
}
