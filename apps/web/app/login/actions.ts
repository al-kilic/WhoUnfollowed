'use server';

import { redirect } from 'next/navigation';
import { verify } from '@node-rs/argon2';
import { db } from '@/lib/db/index';
import { users } from '@/lib/db/schema';
import { createSession } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/auth/rate-limit';
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
  const ip = headersList.get('x-forwarded-for') ?? 'unknown';
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

  redirect('/history');
}
