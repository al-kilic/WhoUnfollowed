import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { profiles, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getStripe, isStripeConfigured, UNLOCK_DURATION_DAYS, type UnlockDuration } from '@/lib/stripe';
import { sendTelegramMessage, escapeTelegramHtml } from '@/lib/telegram';
import { trackServerEvent } from '@/lib/umamiServer';
import { Events } from '@/lib/analytics';

// Extends from the later of "now" and any unexpired unlock already on the
// profile, so buying another unlock before the current one runs out stacks
// instead of resetting the clock.
function extendUnlockExpiry(currentExpiresAt: Date | null, duration: UnlockDuration): Date {
  const days = UNLOCK_DURATION_DAYS[duration];
  const base = currentExpiresAt && currentExpiresAt.getTime() > Date.now() ? currentExpiresAt : new Date();
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

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

  // Every purchase on this site is a one-time payment (unlock or donation),
  // never a recurring subscription, so this is the only event type that
  // matters.
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as {
      customer: string;
      customer_email: string | null;
      customer_details?: { email?: string | null };
      mode: 'payment' | 'subscription' | 'setup';
      metadata?: { userId?: string; type?: string; unlockDuration?: UnlockDuration; acquisitionSource?: string };
      amount_total?: number | null;
      currency?: string | null;
    };

    // Donation checkouts share this webhook but carry no account/profile
    // implications — Stripe's own dashboard is the record of them.
    if (session.metadata?.type !== 'unlock') {
      return NextResponse.json({ received: true });
    }

    const unlockDuration: UnlockDuration = session.metadata?.unlockDuration === 'yearly' ? 'yearly' : 'monthly';
    const email = session.customer_email ?? session.customer_details?.email ?? null;
    let kind: 'new_customer' | 'renewal' = 'renewal';

    if (session.metadata?.userId) {
      // Existing user buying/renewing an unlock
      const existingProfile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, session.metadata.userId),
        columns: { subscriptionExpiresAt: true },
      });
      await db
        .update(profiles)
        .set({
          subscriptionStatus: 'active',
          stripeCustomerId: session.customer,
          subscriptionExpiresAt: extendUnlockExpiry(existingProfile?.subscriptionExpiresAt ?? null, unlockDuration),
        })
        .where(eq(profiles.userId, session.metadata.userId));
    } else if (email) {
      // New customer — create account without password (set on /welcome page)
      const existing = await db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
      });

      if (!existing) {
        kind = 'new_customer';
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
            subscriptionExpiresAt: extendUnlockExpiry(null, unlockDuration),
          });
        }
      } else {
        // Existing (logged-out) email buying/renewing an unlock
        const existingProfile = await db.query.profiles.findFirst({
          where: eq(profiles.userId, existing.id),
          columns: { subscriptionExpiresAt: true },
        });
        await db
          .update(profiles)
          .set({
            subscriptionStatus: 'active',
            stripeCustomerId: session.customer,
            subscriptionExpiresAt: extendUnlockExpiry(existingProfile?.subscriptionExpiresAt ?? null, unlockDuration),
          })
          .where(eq(profiles.userId, existing.id));
      }
    }

    const amount = typeof session.amount_total === 'number'
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: (session.currency ?? 'usd').toUpperCase() }).format(session.amount_total / 100)
      : null;
    const acquisitionSource = session.metadata?.acquisitionSource || null;
    const heading = kind === 'new_customer' ? '🎉 New Pro customer!' : '💳 Pro unlock renewed';
    const lines = [heading];
    if (email) lines.push(`Email: ${escapeTelegramHtml(email)}`);
    if (amount) lines.push(`Amount: ${escapeTelegramHtml(amount)}`);
    lines.push(`Plan: ${unlockDuration === 'yearly' ? 'Yearly' : 'Monthly'}`);
    if (acquisitionSource) lines.push(`Source: ${escapeTelegramHtml(acquisitionSource)}`);

    const notify = await sendTelegramMessage(lines.join('\n'));
    if (!notify.ok) {
      // Non-fatal: the purchase already went through; just log.
      console.error('[stripe webhook] telegram notify failed:', notify.error);
    }

    // Server-side, so it's recorded even if the customer never loads /welcome
    // (ad blocker, closed tab, etc.) — see lib/umamiServer.ts. The source
    // property mirrors upgrade-click's, so the daily report can group
    // completed purchases by acquisition channel the same way it already
    // does for upgrade-click intent.
    await trackServerEvent(
      Events.subscribeComplete,
      '/welcome',
      acquisitionSource ? { source: acquisitionSource } : undefined,
    );
  }

  return NextResponse.json({ received: true });
}
