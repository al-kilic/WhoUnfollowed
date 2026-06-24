import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { profiles, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getStripe, isStripeConfigured } from '@/lib/stripe';

const GRACE_PERIOD_DAYS = 14;

export async function POST(request: NextRequest) {
  const stripeSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecret || !isStripeConfigured() || process.env.NEXT_PUBLIC_PAYMENTS_ENABLED !== 'true') {
    return NextResponse.json({ received: true });
  }

  const stripe = getStripe();

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
          .where(eq(profiles.stripeCustomerId, sub.customer));
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as { customer: string };
      const gracePeriodEndsAt = new Date();
      gracePeriodEndsAt.setDate(gracePeriodEndsAt.getDate() + GRACE_PERIOD_DAYS);

      await db
        .update(profiles)
        .set({ subscriptionStatus: 'grace', gracePeriodEndsAt })
        .where(eq(profiles.stripeCustomerId, sub.customer));
      break;
    }

    case 'checkout.session.completed': {
      const session = event.data.object as {
        customer: string;
        customer_email: string | null;
        customer_details?: { email?: string | null };
        subscription: string;
        metadata?: { userId?: string };
      };

      const email =
        session.customer_email ?? session.customer_details?.email ?? null;

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
      } else if (email) {
        // New subscriber — create account without password (set on /welcome page)
        const existing = await db.query.users.findFirst({
          where: eq(users.email, email.toLowerCase()),
        });

        if (!existing) {
          const result = await db
            .insert(users)
            // Paying via Stripe with a confirmed email counts as verified, so the
            // user is not bounced to /verify-email after setting their password.
            .values({ email: email.toLowerCase(), passwordHash: '', emailVerifiedAt: new Date() })
            .returning({ id: users.id });

          const newUser = result[0];
          if (newUser) {
            await db.insert(profiles).values({
              userId: newUser.id,
              subscriptionStatus: 'active',
              stripeCustomerId: session.customer,
              stripeSubscriptionId: session.subscription,
            });
          }
        } else {
          // Re-subscribing after grace period
          await db
            .update(profiles)
            .set({
              subscriptionStatus: 'active',
              stripeCustomerId: session.customer,
              stripeSubscriptionId: session.subscription,
              gracePeriodEndsAt: null,
            })
            .where(eq(profiles.userId, existing.id));
        }
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
