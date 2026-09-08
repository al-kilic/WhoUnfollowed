import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { profiles, users } from '@/lib/db/schema';
import { and, eq, isNotNull, isNull, lte } from 'drizzle-orm';
import { hasLocale } from 'next-intl';
import { routing, type AppLocale } from '@/i18n/routing';
import { sendEmail, isEmailConfigured } from '@/lib/email/send';
import { unlockExpiringSoonEmail, unlockExpiredEmail } from '@/lib/email/templates';

// Called daily by a server cron (e.g. `curl -X POST -H "x-cron-secret: $CRON_SECRET"
// https://yourdomain.com/api/cron/unlock-expiry`). POST-only, unlike a plain
// curl's default GET. Two things, in one pass
// over every profile with an active, dated unlock:
//
//   1. 3 days before subscriptionExpiresAt: send a renewal reminder once
//      (expiryReminderSentAt marks it sent).
//   2. The day subscriptionExpiresAt passes: send an "access ended" email once
//      (expiredEmailSentAt marks it sent).
//
// subscriptionStatus itself is never flipped here — getSubscriptionStatus()
// already treats a past subscriptionExpiresAt as expired at read time, and a
// real recurring Stripe subscription (subscriptionExpiresAt null) is entirely
// out of scope for this cron.
const REMINDER_WINDOW_DAYS = 3;

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Without this, a misconfigured/missing RESEND_API_KEY would still mark
  // every due profile as "emailed" below (see the mark-anyway note further
  // down), silently burning the one-shot idempotency markers with nothing
  // actually sent.
  if (!isEmailConfigured()) {
    return NextResponse.json({ expiredSent: 0, reminderSent: 0, skipped: 'email_not_configured' });
  }

  const now = new Date();
  const reminderCutoff = new Date(now.getTime() + REMINDER_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  let expiredSent = 0;
  let reminderSent = 0;

  // Pass 1: unlocks that already ran out and haven't been emailed about it.
  const justExpired = await db.query.profiles.findMany({
    where: and(
      eq(profiles.subscriptionStatus, 'active'),
      isNotNull(profiles.subscriptionExpiresAt),
      lte(profiles.subscriptionExpiresAt, now),
      isNull(profiles.expiredEmailSentAt),
    ),
    columns: { userId: true, locale: true },
  });

  for (const profile of justExpired) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, profile.userId),
      columns: { email: true },
    });
    if (user) {
      const locale: AppLocale = hasLocale(routing.locales, profile.locale) ? profile.locale : routing.defaultLocale;
      const { subject, html, text } = unlockExpiredEmail({ locale });
      const sent = await sendEmail({ to: user.email, subject, html, text });
      if (!sent.ok) console.error('[cron/unlock-expiry] expired email failed:', sent.error);
    }
    // Marked sent even on a failed/missing send: this is a one-shot notice,
    // not a reliable-delivery queue, so a transient Resend error doesn't
    // retry it forever. isEmailConfigured() above rules out the "never even
    // tried" case.
    await db.update(profiles).set({ expiredEmailSentAt: now }).where(eq(profiles.userId, profile.userId));
    expiredSent++;
  }

  // Pass 2: unlocks expiring within the reminder window that haven't been
  // reminded yet (and haven't already expired, handled above).
  const expiringSoon = await db.query.profiles.findMany({
    where: and(
      eq(profiles.subscriptionStatus, 'active'),
      isNotNull(profiles.subscriptionExpiresAt),
      lte(profiles.subscriptionExpiresAt, reminderCutoff),
      isNull(profiles.expiryReminderSentAt),
      isNull(profiles.expiredEmailSentAt),
    ),
    columns: { userId: true, locale: true, subscriptionExpiresAt: true },
  });

  for (const profile of expiringSoon) {
    const expiresAt = profile.subscriptionExpiresAt;
    if (!expiresAt || expiresAt.getTime() <= now.getTime()) continue; // caught by pass 1 instead

    const user = await db.query.users.findFirst({
      where: eq(users.id, profile.userId),
      columns: { email: true },
    });
    if (user) {
      const locale: AppLocale = hasLocale(routing.locales, profile.locale) ? profile.locale : routing.defaultLocale;
      const daysLeft = Math.max(1, Math.ceil((expiresAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
      const { subject, html, text } = unlockExpiringSoonEmail({ daysLeft, expiresAt, locale });
      const sent = await sendEmail({ to: user.email, subject, html, text });
      if (!sent.ok) console.error('[cron/unlock-expiry] reminder email failed:', sent.error);
    }
    await db.update(profiles).set({ expiryReminderSentAt: now }).where(eq(profiles.userId, profile.userId));
    reminderSent++;
  }

  return NextResponse.json({ expiredSent, reminderSent });
}
