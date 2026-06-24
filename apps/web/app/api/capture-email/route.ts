import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/send';
import { exportConfirmationEmail } from '@/lib/email/templates';

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

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: { email?: unknown; csvFilename?: unknown };
  try { body = await req.json() as typeof body; } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email       = typeof body.email       === 'string' ? body.email.trim()       : null;
  const csvFilename = typeof body.csvFilename === 'string' ? body.csvFilename.trim() : 'export.csv';

  // csvContent is intentionally NOT accepted — follower data must never reach the server
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { subject, html, text } = exportConfirmationEmail(csvFilename);
  const res = await sendEmail({
    to: email,
    subject,
    html,
    text,
    from: 'WhoUnfollowed <hello@whounfollowed.co>',
  });
  if (!res.ok) {
    // Non-fatal: the export already happened client-side; just log.
    console.error('[capture-email] send failed:', res.error);
  }

  return NextResponse.json({ ok: true });
}
