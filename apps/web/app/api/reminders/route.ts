import { NextResponse } from 'next/server';
import { emailOptInSchema } from '@ig-tracker/core';
import { routing, type AppLocale } from '@/i18n/routing';
import { validateRequest } from '@/lib/auth/session';
import { checkRateLimit, clientIpFromXff } from '@/lib/auth/rate-limit';
import { isDisposableEmail } from '@/lib/disposableEmail';
import { enableReminders, joinCreatorWaitlist } from '@/lib/reminders/store';
import { reminderConfirmationEmail, reminderHeaders } from '@/lib/email/reminderTemplates';
import { sendEmail } from '@/lib/email/send';

// Opt-in for "time to check again" reminder emails, and for the Creator AI
// waitlist (source 'creator-ai-waitlist'). Only the email address, language
// and dates are stored. Nothing from the export is ever sent here.
export async function POST(req: Request) {
  const ip = clientIpFromXff(req.headers.get('x-forwarded-for'));
  if (!checkRateLimit(`reminders:${ip}`).allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const parsed = emailOptInSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  const { email, source } = parsed.data;
  const locale: AppLocale = parsed.data.locale ?? routing.defaultLocale;

  if (isDisposableEmail(email)) {
    return NextResponse.json({ error: 'disposable' }, { status: 400 });
  }

  // Link the row to the account when the visitor is logged in with this same
  // address, so /account can show and switch off their reminders.
  const { user } = await validateRequest();
  const userId = user && user.email.toLowerCase() === email ? user.id : null;

  try {
    if (source === 'creator-ai-waitlist') {
      await joinCreatorWaitlist({ email, locale, userId });
      return NextResponse.json({ ok: true });
    }

    const { nextAt, token, alreadyOn } = await enableReminders({ email, source, locale, userId });
    if (!alreadyOn) {
      const { subject, html, text } = reminderConfirmationEmail({ nextAt, token, locale });
      const sent = await sendEmail({ to: email, subject, html, text, headers: reminderHeaders(token, locale) });
      if (!sent.ok) console.error('[reminders] confirmation failed:', sent.error);
    }
    return NextResponse.json({ ok: true, nextAt: nextAt.toISOString(), alreadyOn });
  } catch (err) {
    console.error('[reminders] save failed:', err);
    return NextResponse.json({ error: 'save_failed' }, { status: 500 });
  }
}
