import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { profiles, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { hasLocale } from 'next-intl';
import { getStripe, isStripeConfigured, extendUnlockExpiry, type UnlockDuration } from '@/lib/stripe';
import { sendTelegramMessage, escapeTelegramHtml } from '@/lib/telegram';
import { trackServerEvent } from '@/lib/umamiServer';
import { Events } from '@/lib/analytics';
import { sendEmail } from '@/lib/email/send';
import { purchaseConfirmationEmail } from '@/lib/email/templates';
import { routing, type AppLocale } from '@/i18n/routing';

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
      metadata?: {
        userId?: string;
        type?: string;
        unlockDuration?: UnlockDuration;
        acquisitionSource?: string;
        locale?: string;
      };
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
    // Captured client-side from the buyer's own UI locale (see the checkout
    // route), so the purchase-confirmation email below matches it. Also
    // persisted onto the profile so it's still available later, when the
    // unlock-expiry cron sends a reminder with no request context to read it from.
    const locale: AppLocale = hasLocale(routing.locales, session.metadata?.locale)
      ? session.metadata.locale
      : routing.defaultLocale;
    // Telegram heading: whether this created a brand-new *account*.
    let kind: 'new_customer' | 'renewal' = 'renewal';
    // Purchase-email variant: whether this is the first unlock this account
    // has ever bought. These two diverge for a signed-up free user buying
    // their first unlock — new email copy ("Welcome to Pro"), but not a new
    // account for Telegram's purposes.
    let hadPriorUnlock = false;
    let newExpiresAt: Date | null = null;

    if (session.metadata?.userId) {
      // Existing user buying/renewing an unlock
      const existingProfile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, session.metadata.userId),
        columns: { subscriptionExpiresAt: true },
      });
      hadPriorUnlock = !!existingProfile?.subscriptionExpiresAt;
      newExpiresAt = extendUnlockExpiry(existingProfile?.subscriptionExpiresAt ?? null, unlockDuration);
      await db
        .update(profiles)
        .set({
          subscriptionStatus: 'active',
          stripeCustomerId: session.customer,
          subscriptionExpiresAt: newExpiresAt,
          locale,
          // A fresh purchase means any prior expiry-email cycle no longer
          // applies to the new expiry date.
          expiryReminderSentAt: null,
          expiredEmailSentAt: null,
        })
        .where(eq(profiles.userId, session.metadata.userId));
    } else if (email) {
      // New customer — create account without password (set on /welcome page)
      const existing = await db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
      });

      if (!existing) {
        kind = 'new_customer';
        newExpiresAt = extendUnlockExpiry(null, unlockDuration);
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
            subscriptionExpiresAt: newExpiresAt,
            locale,
          });
        }
      } else {
        // Existing (logged-out) email buying/renewing an unlock
        const existingProfile = await db.query.profiles.findFirst({
          where: eq(profiles.userId, existing.id),
          columns: { subscriptionExpiresAt: true },
        });
        hadPriorUnlock = !!existingProfile?.subscriptionExpiresAt;
        newExpiresAt = extendUnlockExpiry(existingProfile?.subscriptionExpiresAt ?? null, unlockDuration);
        await db
          .update(profiles)
          .set({
            subscriptionStatus: 'active',
            stripeCustomerId: session.customer,
            subscriptionExpiresAt: newExpiresAt,
            locale,
            expiryReminderSentAt: null,
            expiredEmailSentAt: null,
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

    if (email && newExpiresAt) {
      const emailKind = hadPriorUnlock ? 'renewal' : 'new_customer';
      const { subject, html, text } = purchaseConfirmationEmail({ kind: emailKind, unlockDuration, expiresAt: newExpiresAt, locale });
      const sent = await sendEmail({ to: email, subject, html, text });
      if (!sent.ok) {
        // Non-fatal: the purchase already went through; just log.
        console.error('[stripe webhook] purchase confirmation email failed:', sent.error);
      }
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
