'use server';

import { headers } from 'next/headers';
import { checkRateLimit, clientIpFromXff } from '@/lib/auth/rate-limit';
import { resetPassword } from '@/lib/auth/password-reset';

export async function resetPasswordAction(formData: FormData) {
  const token = (formData.get('token') as string)?.trim();
  const password = formData.get('password') as string;
  const confirm = formData.get('confirm') as string;

  if (!password || password.length < 8) {
    return { error: 'weak_password' as const };
  }
  if (password !== confirm) {
    return { error: 'password_mismatch' as const };
  }

  const ip = clientIpFromXff((await headers()).get('x-forwarded-for'));
  const { allowed } = checkRateLimit(`reset:${ip}`);
  if (!allowed) {
    return { error: 'rate_limited' as const };
  }

  const res = await resetPassword(token, password);
  if (!res.ok) return { error: res.error ?? 'invalid_or_expired_token' as const };
  return { ok: true as const };
}
