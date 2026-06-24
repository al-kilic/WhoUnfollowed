'use server';

import { headers } from 'next/headers';
import { checkRateLimit, clientIpFromXff } from '@/lib/auth/rate-limit';
import { requestPasswordReset } from '@/lib/auth/password-reset';

export async function forgotPasswordAction(formData: FormData) {
  const email = (formData.get('email') as string)?.toLowerCase().trim();
  if (!email) return { error: 'Enter your email address.' };

  const ip = clientIpFromXff((await headers()).get('x-forwarded-for'));
  const { allowed } = checkRateLimit(`forgot:${ip}`);
  if (!allowed) {
    return { error: 'Too many requests. Try again in 15 minutes.' };
  }

  // Always succeeds from the caller's view so we never reveal which emails exist.
  await requestPasswordReset(email);
  return { ok: true as const };
}
