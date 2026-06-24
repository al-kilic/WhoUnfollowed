'use server';

import { verify } from '@node-rs/argon2';
import { db } from '@/lib/db/index';
import { users } from '@/lib/db/schema';
import { createSession } from '@/lib/auth/session';
import { ensureSyncSalt } from '@/lib/sync/salt';
import { checkRateLimit, clientIpFromXff } from '@/lib/auth/rate-limit';
import { headers } from 'next/headers';

const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export async function loginAction(formData: FormData) {
  const email = (formData.get('email') as string)?.toLowerCase().trim();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const headersList = await headers();
  const ip = clientIpFromXff(headersList.get('x-forwarded-for'));
  const { allowed } = checkRateLimit(`login:${ip}`);
  if (!allowed) {
    return { error: 'Too many attempts. Try again in 15 minutes.' };
  }

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  // Constant-time response — don't reveal if email exists
  if (!user) {
    return { error: 'Invalid email or password.' };
  }

  const valid = await verify(user.passwordHash, password, ARGON2_OPTIONS);
  if (!valid) {
    return { error: 'Invalid email or password.' };
  }

  await createSession(user.id);

  // Return the sync salt so the client can derive the cloud-sync encryption key
  // from the password (the password never leaves as a key). Client navigates.
  const saltB64 = await ensureSyncSalt(user.id);
  return { ok: true as const, saltB64 };
}
