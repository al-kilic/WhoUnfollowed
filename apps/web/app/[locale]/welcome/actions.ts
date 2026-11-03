'use server';

import { hash } from '@node-rs/argon2';
import { headers } from 'next/headers';
import { db } from '@/lib/db/index';
import { profiles, users } from '@/lib/db/schema';
import { createSession, validateRequest } from '@/lib/auth/session';
import { checkRateLimit, clientIpFromXff } from '@/lib/auth/rate-limit';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { and, eq } from 'drizzle-orm';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { redirect } from '@/i18n/navigation';

const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

// A checkout link is only good for claiming a new account for a week.
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
// The account must have been created by this checkout's webhook, i.e. after
// the checkout session was opened (small allowance for clock skew).
const CREATION_SKEW_MS = 60 * 1000;

// Post-purchase "set your password" step. The Stripe checkout session id in
// the link is NOT a login token: anyone can open a checkout for any email
// (/api/stripe/checkout is unauthenticated), so this action only ever sets
// the first password on the passwordless account that a completed, paid
// checkout created. It never logs anyone into an account that already has
// a password.
export async function setPasswordAction(formData: FormData) {
  const sessionId = formData.get('sessionId');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  // Hidden form field (see WelcomeContent), so a successful setup redirects
  // to the visitor's own locale's /history page.
  const localeField = formData.get('locale');
  const locale = hasLocale(routing.locales, localeField) ? localeField : routing.defaultLocale;

  if (typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) return { error: 'invalid_link' as const };
  if (typeof password !== 'string' || password.length < 8) return { error: 'weak_password' as const };
  if (password !== confirmPassword) return { error: 'password_mismatch' as const };

  const ip = clientIpFromXff((await headers()).get('x-forwarded-for'));
  if (!checkRateLimit(`welcome:${ip}`).allowed) return { error: 'too_many_attempts' as const };

  if (!isStripeConfigured()) return { error: 'payments_not_configured' as const };
  const stripe = getStripe();

  let session: Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>>;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return { error: 'invalid_or_expired_session' as const };
  }

  // Only a finished, paid checkout (or one fully covered by a promo code).
  const paid =
    session.status === 'complete' &&
    (session.payment_status === 'paid' || session.payment_status === 'no_payment_required');
  if (!paid) return { error: 'payment_not_complete' as const };

  const type = session.metadata?.type;
  if (type !== 'unlock' && type !== 'lifetime') return { error: 'invalid_link' as const };

  if (Date.now() / 1000 - session.created > SESSION_MAX_AGE_SECONDS) {
    return { error: 'invalid_or_expired_session' as const };
  }

  const resolvedEmail = session.customer_email ?? session.customer_details?.email;
  if (!resolvedEmail) return { error: 'account_not_found_stripe' as const };
  const email = resolvedEmail.toLowerCase();

  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!user) return { error: 'account_not_found_webhook_pending' as const };

  if (user.passwordHash && user.passwordHash !== '') {
    // A buyer who was already signed in (logged-in upgrade) carries on;
    // everyone else logs in normally. Never create a session from the link.
    const { user: current } = await validateRequest();
    if (current?.id === user.id) {
      redirect({ href: '/history', locale });
      return;
    }
    return { error: 'already_has_password' as const };
  }

  // Bind the claim to this checkout: the account must belong to this
  // checkout's Stripe customer and must have been created by it. Stops
  // someone who pays with another person's email from claiming an older,
  // passwordless account that person created with an earlier purchase.
  const sessionCustomer =
    typeof session.customer === 'string' ? session.customer : (session.customer?.id ?? null);
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
    columns: { stripeCustomerId: true },
  });
  const createdByThisCheckout = user.createdAt.getTime() >= session.created * 1000 - CREATION_SKEW_MS;
  if (!sessionCustomer || profile?.stripeCustomerId !== sessionCustomer || !createdByThisCheckout) {
    return { error: 'claim_not_allowed' as const };
  }

  const passwordHash = await hash(password, ARGON2_OPTIONS);
  // Single use: only succeeds while the password is still empty, so a second
  // submit (or a race) can't overwrite a password someone just set.
  const updated = await db
    .update(users)
    .set({ passwordHash, emailVerifiedAt: user.emailVerifiedAt ?? new Date() })
    .where(and(eq(users.id, user.id), eq(users.passwordHash, '')))
    .returning({ id: users.id });
  if (updated.length === 0) return { error: 'already_has_password' as const };

  await createSession(user.id);
  redirect({ href: '/history', locale });
  return;
}
