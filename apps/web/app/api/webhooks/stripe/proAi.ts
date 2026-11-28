import 'server-only';
import type Stripe from 'stripe';
import { eq } from 'drizzle-orm';
import { hasLocale } from 'next-intl';
import { db } from '@/lib/db/index';
import { profiles, users } from '@/lib/db/schema';
import { getStripe } from '@/lib/stripe';
import { applySubscription, subscriptionFields } from '@/lib/proAiBilling';
import { sendTelegramMessage, escapeTelegramHtml } from '@/lib/telegram';
import { trackServerEvent } from '@/lib/umamiServer';
import { Events } from '@/lib/analytics';
import { routing, type AppLocale } from '@/i18n/routing';
import { sendEmail } from '@/lib/email/send';
import { proAiConfirmationEmail } from '@/lib/email/proAiTemplates';

// A completed Pro AI checkout: tie the subscription to an account (the
// logged-in buyer, an existing account with that email, or a new account
// claimed on /welcome), then copy the subscription's state onto the profile.
export async function handleProAiCheckout(session: Stripe.Checkout.Session): Promise<void> {
  const email = (session.customer_email ?? session.customer_details?.email ?? null)?.toLowerCase() ?? null;
  const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null;
  const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id ?? null;
  if (!subscriptionId) {
    console.error('[stripe webhook] pro_ai checkout without a subscription id');
    return;
  }
  const locale: AppLocale = hasLocale(routing.locales, session.metadata?.locale) ? session.metadata.locale : routing.defaultLocale;

  let userId = session.metadata?.userId ?? null;
  let isNewAccount = false;
  if (!userId && email) {
    const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (existing) {
      userId = existing.id;
    } else {
      // Buy-first: create the account; the password is set on /welcome.
      const [created] = await db.insert(users).values({ email, passwordHash: '', emailVerifiedAt: new Date() }).returning({ id: users.id });
      userId = created?.id ?? null;
      isNewAccount = true;
    }
  }
  if (!userId) {
    console.error('[stripe webhook] pro_ai checkout with no user and no email');
    return;
  }

  await db.insert(profiles)
    .values({ userId, subscriptionStatus: 'active', stripeCustomerId: customerId, stripeSubscriptionId: subscriptionId, locale })
    .onConflictDoUpdate({ target: profiles.userId, set: { subscriptionStatus: 'active', stripeCustomerId: customerId, stripeSubscriptionId: subscriptionId, locale } });

  const sub = await getStripe().subscriptions.retrieve(subscriptionId);
  await applySubscription(sub);

  const interval = session.metadata?.interval === 'yearly' ? 'Yearly' : 'Monthly';
  const amount = typeof session.amount_total === 'number'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: (session.currency ?? 'usd').toUpperCase() }).format(session.amount_total / 100)
    : null;
  const lines = [isNewAccount ? '🤖 New Pro AI subscriber (new account)!' : '🤖 New Pro AI subscriber!'];
  if (email) lines.push(`Email: ${escapeTelegramHtml(email)}`);
  if (amount) lines.push(`Amount: ${escapeTelegramHtml(amount)}`);
  lines.push(`Plan: Pro AI ${interval}`);
  // Stripe keeps the checkbox answer on the session (dispute evidence).
  lines.push(`Terms + immediate start: ${session.consent?.terms_of_service === 'accepted' ? 'accepted' : 'not recorded'}`);
  if (session.metadata?.acquisitionSource) lines.push(`Source: ${escapeTelegramHtml(session.metadata.acquisitionSource)}`);
  const notify = await sendTelegramMessage(lines.join('\n'), 'sales');
  if (!notify.ok) console.error('[stripe webhook] telegram notify failed:', notify.error);

  await trackServerEvent(Events.subscribeComplete, '/welcome', { plan: `pro_ai_${interval.toLowerCase()}`, ...(session.metadata?.acquisitionSource ? { source: session.metadata.acquisitionSource } : {}) });

  if (email) {
    const { subject, html, text } = proAiConfirmationEmail({ locale, ...confirmationAmounts(session, sub) });
    const sent = await sendEmail({ to: email, subject, html, text });
    // Non-fatal: the subscription is already active; just log.
    if (!sent.ok) console.error('[stripe webhook] pro_ai confirmation email failed:', sent.error);
  }
}

// Renewals, plan changes, failed payments and cancellations all arrive as
// subscription events; each one just re-copies the current state.
export async function handleSubscriptionEvent(sub: Stripe.Subscription, type: string, previous?: Partial<Stripe.Subscription> | null): Promise<void> {
  const found = await applySubscription(sub);
  if (!found) console.error(`[stripe webhook] ${type}: no profile for subscription ${sub.id}`);
  if (!found) return;
  const change = type === 'customer.subscription.deleted' ? 'ended' : type === 'customer.subscription.updated' ? subscriptionChange(sub, previous ?? null) : null;
  if (!change) return;
  const email = await memberEmail(sub).catch(() => null);
  const who = email ? ` ${escapeTelegramHtml(email)}` : '';
  const end = sub.cancel_at ?? sub.items?.data?.[0]?.current_period_end ?? null;
  const day = end ? new Date(end * 1000).toISOString().slice(0, 10) : '?';
  const text = {
    ended: `👋 Pro AI ended:${who} (${escapeTelegramHtml(sub.id)})`,
    cancel_scheduled: `🔕 Pro AI cancel scheduled:${who}. Keeps access until ${day}.`,
    cancel_undone: `↩️ Pro AI cancel undone:${who}. Renews again.`,
    payment_failed: `💳 Pro AI renewal payment failed:${who}. Stripe retries; AI access pauses until it is paid.`,
    payment_recovered: `✅ Pro AI payment recovered:${who}.`,
  }[change];
  await sendTelegramMessage(text, 'sales').catch(() => null);
  void trackServerEvent('pro-ai-change', '/app/you', { change });
}

export type SubscriptionChange = 'cancel_scheduled' | 'cancel_undone' | 'payment_failed' | 'payment_recovered';

// What a customer.subscription.updated event changed that the founder should
// hear about. previous_attributes holds only the fields that changed.
export function subscriptionChange(sub: Pick<Stripe.Subscription, 'status' | 'cancel_at_period_end' | 'cancel_at'>, previous: Partial<Pick<Stripe.Subscription, 'status' | 'cancel_at_period_end' | 'cancel_at'>> | null): SubscriptionChange | null {
  if (!previous) return null;
  const bad = (s: string | undefined) => s === 'past_due' || s === 'unpaid' || s === 'incomplete';
  if ('status' in previous && previous.status !== sub.status) {
    if (bad(sub.status) && !bad(previous.status)) return 'payment_failed';
    if (sub.status === 'active' && bad(previous.status)) return 'payment_recovered';
  }
  const wasCancelling = !!previous.cancel_at_period_end || !!previous.cancel_at;
  const isCancelling = !!sub.cancel_at_period_end || !!sub.cancel_at;
  if (('cancel_at_period_end' in previous || 'cancel_at' in previous) && wasCancelling !== isCancelling) return isCancelling ? 'cancel_scheduled' : 'cancel_undone';
  return null;
}

async function memberEmail(sub: Stripe.Subscription): Promise<string | null> {
  const row = await db.query.profiles.findFirst({ where: eq(profiles.stripeSubscriptionId, sub.id), columns: { userId: true } });
  if (!row) return null;
  const user = await db.query.users.findFirst({ where: eq(users.id, row.userId), columns: { email: true } });
  return user?.email ?? null;
}

// What the confirmation email states: what Stripe charged today, what each
// renewal will cost (the Insider 60% coupon lasts forever, the yearly
// thank-you coupon only once), how often, and the next renewal date.
export function confirmationAmounts(session: Pick<Stripe.Checkout.Session, 'amount_total' | 'currency' | 'metadata'>, sub: Stripe.Subscription) {
  const item = sub.items.data[0];
  const unit = item?.price.unit_amount ?? session.amount_total ?? 0;
  const renewCents = session.metadata?.offer === 'insider60' ? Math.round(unit * 0.4) : unit;
  const fields = subscriptionFields(sub);
  return {
    interval: fields.subscriptionInterval,
    paidCents: session.amount_total ?? unit,
    renewCents,
    currency: session.currency ?? item?.price.currency ?? 'usd',
    renewsOn: fields.currentPeriodEnd,
  };
}
