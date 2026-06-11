'use server';

import { redirect } from 'next/navigation';
import { hash } from '@node-rs/argon2';
import { db } from '@/lib/db/index';
import { users, profiles } from '@/lib/db/schema';
import { createSession } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/auth/rate-limit';
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
  const ip = headersList.get('x-forwarded-for') ?? 'unknown';
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

  const result = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning({ id: users.id });

  const user = result[0];
  if (!user) return { error: 'Failed to create account. Please try again.' };

  await db.insert(profiles).values({ userId: user.id, plan: 'free' });

  await createSession(user.id);

  redirect('/history');
}
