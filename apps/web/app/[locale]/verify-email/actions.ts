'use server';

import { headers } from 'next/headers';
import { validateRequest } from '@/lib/auth/session';
import { checkRateLimit, clientIpFromXff } from '@/lib/auth/rate-limit';
import { verifyEmailCode, generateAndSendVerification } from '@/lib/auth/verification';

export async function verifyEmailAction(formData: FormData) {
  const { user } = await validateRequest();
  if (!user) return { error: 'session_expired' as const };

  const code = (formData.get('code') as string)?.replace(/\D/g, '').trim();
  if (!code || code.length !== 6) {
    return { error: 'invalid_code_format' as const };
  }

  const ip = clientIpFromXff((await headers()).get('x-forwarded-for'));
  const { allowed } = checkRateLimit(`verify:${ip}`);
  if (!allowed) {
    return { error: 'rate_limited' as const };
  }

  const res = await verifyEmailCode(user.id, code);
  if (!res.ok) return { error: 'invalid_or_expired_code' as const };
  return { ok: true as const };
}

export async function resendVerificationAction() {
  const { user } = await validateRequest();
  if (!user) return { error: 'session_expired' as const };

  const ip = clientIpFromXff((await headers()).get('x-forwarded-for'));
  const { allowed } = checkRateLimit(`resend:${ip}`);
  if (!allowed) {
    return { error: 'rate_limited' as const };
  }

  const res = await generateAndSendVerification(user.id, user.email);
  if (!res.ok) return { error: 'send_failed' as const };
  return { ok: true as const };
}
