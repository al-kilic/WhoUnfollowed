'use server';

import { hash } from '@node-rs/argon2';
import { db } from '@/lib/db/index';
import { users, profiles } from '@/lib/db/schema';
import { createSession } from '@/lib/auth/session';
import { ensureSyncSalt } from '@/lib/sync/salt';
import { checkRateLimit, clientIpFromXff } from '@/lib/auth/rate-limit';
import { isEmailConfigured } from '@/lib/email/send';
import { generateAndSendVerification } from '@/lib/auth/verification';
import { headers } from 'next/headers';

const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export async function signupAction(formData: FormData) {
  const email = (formData.get('email') as string)?.toLowerCase().trim();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }

  const headersList = await headers();
  const ip = clientIpFromXff(headersList.get('x-forwarded-for'));
  const { allowed } = checkRateLimit(`signup:${ip}`);
  if (!allowed) {
    return { error: 'Too many attempts. Try again in 15 minutes.' };
  }

  const existing = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  if (existing) {
    return { error: 'An account with this email already exists.' };
  }

  const passwordHash = await hash(password, ARGON2_OPTIONS);

  // When email is configured, the account starts unverified and must confirm a
  // code. When it isn't (local dev / pre-Resend), mark verified immediately so
  // the account is usable and won't be retroactively gated once email is enabled.
  const emailConfigured = isEmailConfigured();

  const result = await db
    .insert(users)
    .values({ email, passwordHash, emailVerifiedAt: emailConfigured ? null : new Date() })
    .returning({ id: users.id });

  const user = result[0];
  if (!user) return { error: 'Failed to create account. Please try again.' };

  // New accounts start on Free. Pro is granted only by a real Stripe
  // subscription (via the webhook) or an explicit grandfather/comp update.
  await db.insert(profiles).values({ userId: user.id, subscriptionStatus: 'none' });

  await createSession(user.id);

  // Create the sync salt now and return it so the client can derive the
  // cloud-sync encryption key from the password before navigating.
  const saltB64 = await ensureSyncSalt(user.id);

  if (emailConfigured) {
    // Best-effort send; the verify page also offers a resend if it didn't arrive.
    await generateAndSendVerification(user.id, email);
    return { ok: true as const, saltB64, needsVerification: true as const };
  }

  return { ok: true as const, saltB64, needsVerification: false as const };
}
