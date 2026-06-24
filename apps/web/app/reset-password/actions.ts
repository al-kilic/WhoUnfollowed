'use server';

import { headers } from 'next/headers';
import { checkRateLimit, clientIpFromXff } from '@/lib/auth/rate-limit';
import { resetPassword } from '@/lib/auth/password-reset';

export async function resetPasswordAction(formData: FormData) {
  const token = (formData.get('token') as string)?.trim();
  const password = formData.get('password') as string;
  const confirm = formData.get('confirm') as string;

  if (!password || password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }
  if (password !== confirm) {
    return { error: 'Passwords do not match.' };
  }

  const ip = clientIpFromXff((await headers()).get('x-forwarded-for'));
  const { allowed } = checkRateLimit(`reset:${ip}`);
  if (!allowed) {
    return { error: 'Too many attempts. Try again in 15 minutes.' };
  }

  const res = await resetPassword(token, password);
  if (!res.ok) return { error: res.error ?? 'Could not reset your password.' };
  return { ok: true as const };
}
