import { NextResponse } from 'next/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { localizedPathname } from '@/i18n/localizedPathname';
import { markEngaged } from '@/lib/reminders/store';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://whounfollowed.co';

// The button in a reminder email. Notes that the person still uses reminders
// (so the series keeps going, see lib/reminders/schedule.ts), then sends them
// to the export guide. Always redirects, even for an unknown token.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('t') ?? '';
  const l = url.searchParams.get('l');
  const locale = hasLocale(routing.locales, l) ? l : routing.defaultLocale;
  if (token) {
    try { await markEngaged(token); } catch (err) { console.error('[reminders/open] failed:', err); }
  }
  // Wrap emails share this endpoint (k=wrap) so their clicks count as engagement too.
  const source = url.searchParams.get('k') === 'wrap' ? 'wrap' : 'reminder';
  const target = `${APP_URL}${localizedPathname('/how-to-export', locale)}?utm_source=${source}&utm_medium=email`;
  return NextResponse.redirect(target, 302);
}
