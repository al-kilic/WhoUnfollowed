'use server';

import { hash } from '@node-rs/argon2';
import { db } from '@/lib/db/index';
import { users } from '@/lib/db/schema';
import { createSession } from '@/lib/auth/session';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { eq } from 'drizzle-orm';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { redirect } from '@/i18n/navigation';

const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export async function setPasswordAction(formData: FormData) {
  const sessionId = formData.get('sessionId') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Hidden form field (see WelcomeContent), so a successful setup redirects
  // to the visitor's own locale's /history page.
  const localeField = formData.get('locale');
  const locale = hasLocale(routing.locales, localeField) ? localeField : routing.defaultLocale;

  if (!sessionId) return { error: 'invalid_link' as const };
  if (!password || password.length < 8) return { error: 'weak_password' as const };
  if (password !== confirmPassword) return { error: 'password_mismatch' as const };

  // Verify the Stripe checkout session and find the user's email
  if (!isStripeConfigured()) return { error: 'payments_not_configured' as const };

  const stripe = getStripe();

  let email: string;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const resolvedEmail = session.customer_email ?? session.customer_details?.email;
    if (!resolvedEmail) return { error: 'account_not_found_stripe' as const };
    email = resolvedEmail.toLowerCase();
  } catch {
    return { error: 'invalid_or_expired_session' as const };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return { error: 'account_not_found_webhook_pending' as const };
  }

  if (user.passwordHash && user.passwordHash !== '') {
    // Password already set — just log them in
    await createSession(user.id);
    redirect({ href: '/history', locale });
    return;
  }

  const passwordHash = await hash(password, ARGON2_OPTIONS);
  // Stripe checkout confirmed the email, so mark verified if it isn't already.
  await db
    .update(users)
    .set({ passwordHash, emailVerifiedAt: user.emailVerifiedAt ?? new Date() })
    .where(eq(users.id, user.id));

  await createSession(user.id);
  redirect({ href: '/history', locale });
  return;
}
