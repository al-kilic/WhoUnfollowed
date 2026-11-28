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
export async function handleSubscriptionEvent(sub: Stripe.Subscription, type: string): Promise<void> {
  const found = await applySubscription(sub);
  if (!found) console.error(`[stripe webhook] ${type}: no profile for subscription ${sub.id}`);
  if (type === 'customer.subscription.deleted' && found) {
    await sendTelegramMessage(`👋 Pro AI subscription ended (${escapeTelegramHtml(sub.id)})`, 'sales').catch(() => null);
  }
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
