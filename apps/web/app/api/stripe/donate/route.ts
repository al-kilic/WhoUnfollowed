import { NextRequest, NextResponse } from 'next/server';
import { getStripe, isStripeConfigured } from '@/lib/stripe';

const MIN_USD = 1;
const MAX_USD = 500;

// Fully anonymous one-off payment. No account, no profile row, no webhook
// side effect beyond Stripe's own record — see the 'donation' branch in
// app/api/webhooks/stripe/route.ts, which deliberately no-ops on it.
export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Payments not enabled' }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const amount = Number(body.amount);
  const returnPath: string = typeof body.returnPath === 'string' && body.returnPath.startsWith('/') ? body.returnPath : '/';

  if (!Number.isFinite(amount) || amount < MIN_USD || amount > MAX_USD) {
    return NextResponse.json({ error: `Enter an amount between $${MIN_USD} and $${MAX_USD}.` }, { status: 400 });
  }

  const stripe = getStripe();
  const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? '';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: 'Donation to WhoUnfollowed' },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}${returnPath}${returnPath.includes('?') ? '&' : '?'}donated=1`,
    cancel_url: `${origin}${returnPath}`,
    metadata: { type: 'donation' },
  });

  return NextResponse.json({ url: session.url });
}
