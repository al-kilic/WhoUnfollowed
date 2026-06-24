'use server';

import { redirect } from 'next/navigation';
import { hash } from '@node-rs/argon2';
import { db } from '@/lib/db/index';
import { users } from '@/lib/db/schema';
import { createSession } from '@/lib/auth/session';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { eq } from 'drizzle-orm';

const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export async function setPasswordAction(formData: FormData) {
  const sessionId = formData.get('sessionId') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!sessionId) return { error: 'Invalid link.' };
  if (!password || password.length < 8) return { error: 'Password must be at least 8 characters.' };
  if (password !== confirmPassword) return { error: 'Passwords do not match.' };

  // Verify the Stripe checkout session and find the user's email
  if (!isStripeConfigured()) return { error: 'Payments not configured.' };

  const stripe = getStripe();

  let email: string;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const resolvedEmail = session.customer_email ?? session.customer_details?.email;
    if (!resolvedEmail) return { error: 'Could not find your account. Please contact support.' };
    email = resolvedEmail.toLowerCase();
  } catch {
    return { error: 'Invalid or expired session. Please contact support.' };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return { error: 'Account not found. The webhook may still be processing — wait a moment and try again.' };
  }

  if (user.passwordHash && user.passwordHash !== '') {
    // Password already set — just log them in
    await createSession(user.id);
    redirect('/history');
  }

  const passwordHash = await hash(password, ARGON2_OPTIONS);
  // Stripe checkout confirmed the email, so mark verified if it isn't already.
  await db
    .update(users)
    .set({ passwordHash, emailVerifiedAt: user.emailVerifiedAt ?? new Date() })
    .where(eq(users.id, user.id));

  await createSession(user.id);
  redirect('/history');
}
