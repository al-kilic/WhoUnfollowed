import 'server-only';
import type Stripe from 'stripe';
import { TOPUP_VALID_MONTHS } from '@/lib/pricing';
import { grantRefill, refillsHeld } from '@/lib/ai/allowance';
import { MAX_REFILLS_HELD } from '@/lib/ai/allowanceMath';
import { sendTelegramMessage, escapeTelegramHtml } from '@/lib/telegram';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { sendEmail } from '@/lib/email/send';
import { refillReceiptEmail } from '@/lib/email/billingTemplates';

// Refills (formerly credit top-ups): a one-time Stripe payment that adds one
// month's usage allowance (lib/ai/allowance.ts), valid 12 months. Only paid
// Pro AI members holding fewer than 2 refills can buy one (checked at checkout).

export function priceIdForTopup(): string | null {
  return process.env.STRIPE_PRICE_TOPUP_300 ?? null;
}

export function topupExpiry(paidAt: Date): Date {
  const d = new Date(paidAt);
  d.setUTCMonth(d.getUTCMonth() + TOPUP_VALID_MONTHS);
  return d;
}

// Webhook: checkout.session.completed with metadata.type === 'topup'. Keyed on
// the session id, so a retried webhook grants nothing the second time.
export async function handleTopupCheckout(session: Stripe.Checkout.Session, now: Date = new Date()): Promise<boolean> {
  const userId = session.metadata?.userId;
  if (!userId || session.payment_status !== 'paid') {
    console.error('[stripe webhook] topup without a user or not paid');
    return false;
  }
  const granted = await grantRefill(userId, `refill:${session.id}`, now);
  if (granted) {
    const email = session.customer_details?.email ?? session.customer_email ?? '';
    await sendTelegramMessage(`➕ Refill: one month of coach use${email ? ` (${escapeTelegramHtml(email)})` : ''}`, 'sales').catch(() => null);
    // The cap applies to buying, not to paid refills: grant it anyway, and
    // tell the founder if someone ended up holding more than the cap.
    const held = await refillsHeld(userId, now).catch(() => 0);
    if (held > MAX_REFILLS_HELD) {
      await sendTelegramMessage(`⚠️ A member now holds ${held} refills (cap ${MAX_REFILLS_HELD}). Session ${escapeTelegramHtml(session.id)}.`, 'alerts').catch(() => null);
    }
    // Receipt only on the first grant, so a retried webhook never emails twice.
    if (email) {
      const locale = hasLocale(routing.locales, session.metadata?.locale) ? session.metadata.locale : routing.defaultLocale;
      const mail = refillReceiptEmail({ locale, paidCents: session.amount_total ?? 0, currency: session.currency ?? 'usd', validUntil: topupExpiry(now) });
      const sent = await sendEmail({ to: email, ...mail }).catch((e: unknown) => ({ ok: false as const, error: String(e) }));
      if (!sent.ok) console.error('[stripe webhook] refill receipt email failed:', sent.error);
    }
  }
  return granted;
}

const REFILL_SYNC_DAYS = 30;

// Grants paid refills whose webhook never arrived (e.g. the webhook was down).
// Looks at this member's paid refill checkouts from the last 30 days, by their
// Stripe customer and by the user id checkout stores in the metadata, and runs
// the same grant as the webhook: keyed on the session id, so nothing is ever
// granted or emailed twice. Returns how many were newly granted.
export async function syncRefills(stripe: Stripe, userId: string, customerId: string | null, now: Date = new Date()): Promise<number> {
  const since = Math.floor(now.getTime() / 1000) - REFILL_SYNC_DAYS * 86_400;
  const seen = new Map<string, Stripe.Checkout.Session>();
  const add = (list: Stripe.Checkout.Session[]) => list.forEach((x) => seen.set(x.id, x));
  if (customerId) add(await stripe.checkout.sessions.list({ customer: customerId, created: { gte: since }, limit: 100 }).autoPagingToArray({ limit: 300 }).catch(() => []));
  // Refills bought without a stored customer only carry the user id.
  add(await stripe.checkout.sessions.list({ created: { gte: since }, limit: 100 }).autoPagingToArray({ limit: 500 }).catch(() => []));
  let granted = 0;
  for (const session of seen.values()) {
    if (session.metadata?.type !== 'topup' || session.metadata.userId !== userId || session.payment_status !== 'paid') continue;
    if (await handleTopupCheckout(session, new Date(session.created * 1000))) granted++;
  }
  return granted;
}
