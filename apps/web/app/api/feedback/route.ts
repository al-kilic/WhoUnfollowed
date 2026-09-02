import { NextResponse } from 'next/server';
import { feedbackSchema } from '@ig-tracker/core';
import { db } from '@/lib/db/index';
import { feedback } from '@/lib/db/schema';
import { validateRequest } from '@/lib/auth/session';
import { sendTelegramMessage, escapeTelegramHtml } from '@/lib/telegram';

// Simple in-memory rate limit: max 10 requests per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
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

const SENTIMENT_EMOJI: Record<string, string> = {
  angry: '😠',
  sad: '😞',
  neutral: '😐',
  happy: '🙂',
  delighted: '🤩',
};

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { sentiment, reason, comment, page } = parsed.data;

  const { user } = await validateRequest();

  await db.insert(feedback).values({
    userId: user?.id ?? null,
    sentiment,
    reason: reason || null,
    comment: comment || null,
    page,
  });

  const lines = [
    `${SENTIMENT_EMOJI[sentiment] ?? ''} <b>New feedback</b> (${escapeTelegramHtml(sentiment)})`,
    `Page: ${escapeTelegramHtml(page)}`,
  ];
  if (reason) lines.push(`Reason: ${escapeTelegramHtml(reason)}`);
  if (comment) lines.push(`Comment: ${escapeTelegramHtml(comment)}`);
  if (user?.email) lines.push(`From: ${escapeTelegramHtml(user.email)}`);

  const notify = await sendTelegramMessage(lines.join('\n'));
  if (!notify.ok) {
    // Non-fatal: the feedback is already saved; just log.
    console.error('[feedback] telegram notify failed:', notify.error);
  }

  return NextResponse.json({ ok: true });
}
