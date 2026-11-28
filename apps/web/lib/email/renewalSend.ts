import 'server-only';
import { and, eq, inArray, isNotNull, isNull } from 'drizzle-orm';
import { hasLocale } from 'next-intl';
import { db } from '@/lib/db/index';
import { profiles, users } from '@/lib/db/schema';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { routing, type AppLocale } from '@/i18n/routing';
import { sendEmail } from './send';
import { renewalReminderEmail } from './billingTemplates';
import { renewalDue } from './renewalReminders';

// Daily pass (rides on /api/cron/unlock-expiry): renewal reminders for Pro AI
// subscribers. Service emails, never marketing. The price comes from Stripe's
// preview of the next invoice (coupons included); a cancelled-at-period-end
// subscription gets no reminder because nothing will renew.

export interface RenewalPassResult { due: number; sent: number; failed: number; skipped: number }

export async function sendDueRenewalReminders(now: Date, budget: number): Promise<RenewalPassResult> {
  const out: RenewalPassResult = { due: 0, sent: 0, failed: 0, skipped: 0 };
  if (budget <= 0 || !isStripeConfigured()) return out;
  const rows = await db.select({
    userId: profiles.userId, email: users.email, locale: profiles.locale,
    subscriptionId: profiles.stripeSubscriptionId, subscriptionStatus: profiles.subscriptionStatus,
    subscriptionInterval: profiles.subscriptionInterval, currentPeriodEnd: profiles.currentPeriodEnd,
    subscriptionStartedAt: profiles.subscriptionStartedAt, renewalReminderKey: profiles.renewalReminderKey,
  }).from(profiles).innerJoin(users, eq(users.id, profiles.userId))
    // Cancelled plans (cancel_at set) never get a renewal reminder; Stripe is
    // still checked below in case a webhook was missed.
    .where(and(eq(profiles.subscriptionStatus, 'active'), isNotNull(profiles.stripeSubscriptionId), isNull(profiles.cancelAt), inArray(profiles.subscriptionInterval, ['month', 'year'])));

  const stripe = getStripe();
  for (const r of rows) {
    const due = renewalDue(r, now);
    if (!due || !r.subscriptionId) continue;
    out.due++;
    if (out.sent + out.failed >= budget) continue;
    const mark = () => db.update(profiles).set({ renewalReminderKey: due.key }).where(eq(profiles.userId, r.userId));
    try {
      const sub = await stripe.subscriptions.retrieve(r.subscriptionId);
      if (sub.cancel_at_period_end || sub.status !== 'active') { await mark(); out.skipped++; continue; }
      const item = sub.items.data[0];
      let cents = item?.price.unit_amount ?? null;
      let currency = item?.price.currency ?? 'usd';
      try {
        const preview = await stripe.invoices.createPreview({ subscription: sub.id });
        cents = preview.amount_due;
        currency = preview.currency;
      } catch { /* fall back to the list price */ }
      if (cents === null) { out.skipped++; continue; }
      const locale: AppLocale = hasLocale(routing.locales, r.locale) ? r.locale : routing.defaultLocale;
      const mail = renewalReminderEmail({ locale, kind: due.kind, interval: due.interval, priceCents: cents, currency, renewsOn: due.renewsOn });
      const sent = await sendEmail({ to: r.email, ...mail });
      if (sent.ok) { await mark(); out.sent++; } else { out.failed++; }
    } catch (e) {
      console.error('[renewal reminders] failed for a subscriber:', e instanceof Error ? e.message : e);
      out.failed++;
    }
  }
  return out;
}
