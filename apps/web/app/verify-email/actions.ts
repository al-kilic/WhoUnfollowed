'use server';

import { headers } from 'next/headers';
import { validateRequest } from '@/lib/auth/session';
import { checkRateLimit, clientIpFromXff } from '@/lib/auth/rate-limit';
import { verifyEmailCode, generateAndSendVerification } from '@/lib/auth/verification';

export async function verifyEmailAction(formData: FormData) {
  const { user } = await validateRequest();
  if (!user) return { error: 'Your session expired. Please log in again.' };

  const code = (formData.get('code') as string)?.replace(/\D/g, '').trim();
  if (!code || code.length !== 6) {
    return { error: 'Enter the 6-digit code from your email.' };
  }

  const ip = clientIpFromXff((await headers()).get('x-forwarded-for'));
  const { allowed } = checkRateLimit(`verify:${ip}`);
  if (!allowed) {
    return { error: 'Too many attempts. Try again in 15 minutes.' };
  }

  const res = await verifyEmailCode(user.id, code);
  if (!res.ok) return { error: res.error ?? 'That code is invalid or has expired.' };
  return { ok: true as const };
}

export async function resendVerificationAction() {
  const { user } = await validateRequest();
  if (!user) return { error: 'Your session expired. Please log in again.' };

  const ip = clientIpFromXff((await headers()).get('x-forwarded-for'));
  const { allowed } = checkRateLimit(`resend:${ip}`);
  if (!allowed) {
    return { error: 'Too many requests. Try again in 15 minutes.' };
  }

  const res = await generateAndSendVerification(user.id, user.email);
  if (!res.ok) return { error: res.error ?? 'Could not send the email. Try again shortly.' };
  return { ok: true as const };
}
