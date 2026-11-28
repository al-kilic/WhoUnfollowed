import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedBySecretHeader } from '@/lib/auth/secretHeader';
import { runLaunchEmails, launchEmailsReady } from '@/lib/email/launchSend';

// One-time launch emails (lib/email/launchSend.ts). Run by the founder on
// launch day, never by a cron:
//   dry run: curl -X POST -H "x-cron-secret: $CRON_SECRET" https://whounfollowed.co/api/internal/launch-emails
//   send:    curl -X POST -H "x-cron-secret: $CRON_SECRET" "https://whounfollowed.co/api/internal/launch-emails?send=1"
// A send run handles at most `limit` people (default 80); run it again until
// leftForNextRun is 0. Safe to repeat: nobody gets the gift or the email twice.
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  if (!isAuthorizedBySecretHeader(request, 'x-cron-secret', process.env.CRON_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const url = new URL(request.url);
  const send = url.searchParams.get('send') === '1';
  if (send && !launchEmailsReady()) return NextResponse.json({ error: 'Email is not configured' }, { status: 503 });
  // HELD (founder, 2026-11-27): these emails grant and announce the Lifetime
  // gift and old-Pro trial, which are announced later. Gifts don't unlock the
  // coach anyway (lib/ai/access.ts: subscribers only). Sending stays off until
  // LAUNCH_GIFTS_ENABLED=1 is set on purpose, after access.ts honours gifts again.
  if (send && process.env.LAUNCH_GIFTS_ENABLED !== '1') return NextResponse.json({ error: 'held: gifts are not announced yet' }, { status: 409 });
  const limit = Number(url.searchParams.get('limit'));
  const report = await runLaunchEmails({ send, ...(limit > 0 ? { limit } : {}) });
  return NextResponse.json(report);
}
