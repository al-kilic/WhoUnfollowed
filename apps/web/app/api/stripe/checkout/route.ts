import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth/session';
import { isPaidFeaturesEnabled } from '@/lib/flags';

export async function POST(request: NextRequest) {
  if (!isPaidFeaturesEnabled()) {
    return NextResponse.json({ error: 'Payments not enabled' }, { status: 404 });
  }

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-05-27.dahlia',
  });

  const { user } = await validateRequest();
  const body = await request.json().catch(() => ({}));
  const email: string | undefined = body.email;

  const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? '';

  const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
    mode: 'subscription',
    line_items: [
      {
        price: process.env.STRIPE_PRICE_MONTHLY!,
        quantity: 1,
      },
    ],
    success_url: `${origin}/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing`,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
  };

  if (user) {
    // Existing user upgrading (shouldn't normally happen in subscribe-only model, but just in case)
    sessionParams.customer_email = user.email;
    sessionParams.metadata = { userId: user.id };
  } else if (email) {
    sessionParams.customer_email = email;
  }
  // Otherwise Stripe collects email on the checkout page

  const session = await stripe.checkout.sessions.create(sessionParams);

  return NextResponse.json({ url: session.url });
}
