import { NextResponse } from 'next/server';
import { contactMessageSchema } from '@ig-tracker/core';
import { db } from '@/lib/db/index';
import { contactMessages } from '@/lib/db/schema';
import { sendTelegramMessage, escapeTelegramHtml } from '@/lib/telegram';
import { sendEmail } from '@/lib/email/send';
import { contactNotificationEmail } from '@/lib/email/templates';

// Same address shown as the public contact email on /contact (ContactContent.tsx).
const NOTIFY_EMAIL = 'hello@whounfollowed.co';

// Simple in-memory rate limit: max 5 requests per IP per 10 minutes. Tighter
// than /api/feedback's 10/10min since this reaches a human inbox, not just
// an analytics row.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = contactMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { name, email, message, topic, source, page } = parsed.data;

  await db.insert(contactMessages).values({
    name: name || null,
    email: email || null,
    message,
    topic: topic || null,
    source,
    page: page || null,
  });

  const { subject, html, text } = contactNotificationEmail({ name, email, message, topic, source, page });
  const emailResult = await sendEmail({
    to: NOTIFY_EMAIL,
    subject,
    html,
    text,
    ...(email ? { replyTo: email } : {}),
  });
  if (!emailResult.ok) {
    // Non-fatal: the message is already saved; just log.
    console.error('[contact] email notify failed:', emailResult.error);
  }

  const from = name ? `${name}${email ? ` <${email}>` : ''}` : (email ?? '(no email given)');
  const lines = [
    `✉️ <b>New contact message</b> (${escapeTelegramHtml(source)})`,
    `From: ${escapeTelegramHtml(from)}`,
  ];
  if (topic) lines.push(`Topic: ${escapeTelegramHtml(topic)}`);
  if (page) lines.push(`Page: ${escapeTelegramHtml(page)}`);
  lines.push(`Message: ${escapeTelegramHtml(message)}`);

  const telegramResult = await sendTelegramMessage(lines.join('\n'));
  if (!telegramResult.ok) {
    // Non-fatal: the message is already saved; just log.
    console.error('[contact] telegram notify failed:', telegramResult.error);
  }

  return NextResponse.json({ ok: true });
}
