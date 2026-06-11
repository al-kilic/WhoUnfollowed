import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { profiles, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const GRACE_PERIOD_DAYS = 14;

// Stripe sends webhook events here. We verify the signature and handle
// subscription lifecycle events to keep profiles in sync.
export async function POST(request: NextRequest) {
  const stripeSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // When payments are disabled, webhook is a no-op
  if (!stripeSecret || process.env.NEXT_PUBLIC_PAYMENTS_ENABLED !== 'true') {
    return NextResponse.json({ received: true });
  }

  // Lazy-import Stripe only when payments are enabled to avoid bundle bloat
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-05-27.dahlia',
  });

  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: ReturnType<typeof stripe.webhooks.constructEvent>;
  try {
    event = stripe.webhooks.constructEvent(body, sig, stripeSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as { customer: string; id: string; status: string };
      if (sub.status === 'active') {
        await db
          .update(profiles)
          .set({
            subscriptionStatus: 'active',
            stripeSubscriptionId: sub.id,
            gracePeriodEndsAt: null,
          })
          .where(eq(profiles.stripeCustomerId, sub.customer as string));
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as { customer: string };
      const gracePeriodEndsAt = new Date();
      gracePeriodEndsAt.setDate(gracePeriodEndsAt.getDate() + GRACE_PERIOD_DAYS);

      await db
        .update(profiles)
        .set({
          subscriptionStatus: 'grace',
          gracePeriodEndsAt,
        })
        .where(eq(profiles.stripeCustomerId, sub.customer as string));
      break;
    }

    case 'checkout.session.completed': {
      // New subscriber — create account if not exists
      const session = event.data.object as {
        customer: string;
        customer_email: string | null;
        subscription: string;
        metadata?: { userId?: string };
      };

      if (session.metadata?.userId) {
        // Existing user upgrading
        await db
          .update(profiles)
          .set({
            subscriptionStatus: 'active',
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            gracePeriodEndsAt: null,
          })
          .where(eq(profiles.userId, session.metadata.userId));
      }
      break;
    }

    default:
      // Ignore unhandled events
      break;
  }

  return NextResponse.json({ received: true });
}
