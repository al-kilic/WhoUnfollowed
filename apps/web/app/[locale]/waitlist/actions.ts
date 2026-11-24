'use server';

import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { validateRequest } from '@/lib/auth/session';
import { joinCreatorWaitlist } from '@/lib/reminders/store';

// One-click join for someone already signed in. The email comes from the
// session, never from the form, so nobody can add another person's address.
export async function joinWaitlistAction(localeInput: string): Promise<{ ok: true } | { error: 'not_signed_in' | 'failed' }> {
  const { user } = await validateRequest();
  if (!user) return { error: 'not_signed_in' };
  const locale = hasLocale(routing.locales, localeInput) ? localeInput : routing.defaultLocale;
  try {
    await joinCreatorWaitlist({ email: user.email, locale, userId: user.id });
    return { ok: true };
  } catch (err) {
    console.error('[waitlist] join failed:', err);
    return { error: 'failed' };
  }
}
