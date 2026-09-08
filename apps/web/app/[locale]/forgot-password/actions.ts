'use server';

import { headers } from 'next/headers';
import { checkRateLimit, clientIpFromXff } from '@/lib/auth/rate-limit';
import { requestPasswordReset } from '@/lib/auth/password-reset';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

export async function forgotPasswordAction(formData: FormData) {
  const email = (formData.get('email') as string)?.toLowerCase().trim();
  if (!email) return { error: 'missing_email' as const };

  const ip = clientIpFromXff((await headers()).get('x-forwarded-for'));
  const { allowed } = checkRateLimit(`forgot:${ip}`);
  if (!allowed) {
    return { error: 'rate_limited' as const };
  }

  // Hidden form field (see ForgotPasswordForm), so the reset-link email points
  // at the visitor's own locale's /reset-password page.
  const localeField = formData.get('locale');
  const locale = hasLocale(routing.locales, localeField) ? localeField : routing.defaultLocale;

  // Always succeeds from the caller's view so we never reveal which emails exist.
  await requestPasswordReset(email, locale);
  return { ok: true as const };
}
