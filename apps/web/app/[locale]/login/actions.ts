'use server';

import { verify } from '@node-rs/argon2';
import { db } from '@/lib/db/index';
import { createSession } from '@/lib/auth/session';
import { ensureSyncSalt } from '@/lib/sync/salt';
import { checkRateLimit, clientIpFromXff } from '@/lib/auth/rate-limit';
import { isEmailConfigured } from '@/lib/email/send';
import { generateAndSendVerification } from '@/lib/auth/verification';
import { headers } from 'next/headers';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export async function loginAction(formData: FormData) {
  const email = (formData.get('email') as string)?.toLowerCase().trim();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'missing_fields' as const };
  }

  // Hidden form field (see LoginForm), used only if this login needs to
  // re-send a verification code.
  const localeField = formData.get('locale');
  const locale = hasLocale(routing.locales, localeField) ? localeField : routing.defaultLocale;

  const headersList = await headers();
  const ip = clientIpFromXff(headersList.get('x-forwarded-for'));
  const { allowed } = checkRateLimit(`login:${ip}`);
  if (!allowed) {
    return { error: 'rate_limited' as const };
  }

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  // Constant-time response — don't reveal if email exists
  if (!user) {
    return { error: 'invalid_credentials' as const };
  }

  const valid = await verify(user.passwordHash, password, ARGON2_OPTIONS);
  if (!valid) {
    return { error: 'invalid_credentials' as const };
  }

  await createSession(user.id);

  // Return the sync salt so the client can derive the cloud-sync encryption key
  // from the password (the password never leaves as a key). Client navigates.
  const saltB64 = await ensureSyncSalt(user.id);

  // Unverified account (signed up while email was on, never confirmed): send a
  // fresh code and route to verification instead of the app.
  if (isEmailConfigured() && !user.emailVerifiedAt) {
    await generateAndSendVerification(user.id, user.email, locale);
    return { ok: true as const, saltB64, needsVerification: true as const };
  }

  return { ok: true as const, saltB64, needsVerification: false as const };
}
