import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/send';
import { exportConfirmationEmail } from '@/lib/email/templates';
import { db } from '@/lib/db/index';
import { emailSubscribers } from '@/lib/db/schema';
import { SUBSCRIBER_CONSENT_VERSION } from '@/lib/marketingConsent';
import { isDisposableEmail } from '@/lib/disposableEmail';

const SOURCES = ['mobile-waitlist', 'csv'] as const;

// Simple in-memory rate limit: max 5 requests per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS  = 10 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now   = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// The filename ends up in an email subject and body sent from our domain, so
// only a short, plain filename is accepted. Anything else falls back to a
// fixed name rather than echoing visitor input into the email.
function safeCsvFilename(value: unknown): string {
  if (typeof value !== 'string') return 'export.csv';
  const name = value.trim();
  return /^[A-Za-z0-9._ -]{1,80}\.csv$/.test(name) ? name : 'export.csv';
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: { email?: unknown; csvFilename?: unknown; source?: unknown; consent?: unknown };
  try { body = await req.json() as typeof body; } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email       = typeof body.email       === 'string' ? body.email.trim().toLowerCase() : null;
  const csvFilename = safeCsvFilename(body.csvFilename);
  const source = SOURCES.find((s) => s === body.source);

  // csvContent is intentionally NOT accepted, follower data must never reach the server.
  // Consent must be an explicit boolean true from the client, never inferred.
  if (!email || !email.includes('@') || !source || body.consent !== true) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (isDisposableEmail(email)) {
    return NextResponse.json({ error: 'disposable' }, { status: 400 });
  }

  try {
    await db
      .insert(emailSubscribers)
      .values({ email, source, consentVersion: SUBSCRIBER_CONSENT_VERSION })
      .onConflictDoUpdate({
        target: emailSubscribers.email,
        // Re-consenting after an opt-out clears it and refreshes the record.
        set: { source, consentedAt: new Date(), consentVersion: SUBSCRIBER_CONSENT_VERSION, optedOutAt: null },
      });
  } catch (err) {
    console.error('[capture-email] save failed:', err);
    return NextResponse.json({ error: 'Could not save' }, { status: 500 });
  }

  // Only the CSV prompt promises an export confirmation. The waitlist just
  // shows "you're on the list" in the UI, so it must not receive an export email.
  if (source === 'csv') {
    const { subject, html, text } = exportConfirmationEmail(csvFilename);
    const res = await sendEmail({ to: email, subject, html, text, from: 'WhoUnfollowed <hello@whounfollowed.co>' });
    if (!res.ok) {
      // Non-fatal: the export already happened client-side; just log.
      console.error('[capture-email] send failed:', res.error);
    }
  }

  return NextResponse.json({ ok: true });
}
