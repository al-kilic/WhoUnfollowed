import { NextResponse } from 'next/server';
import { siteFeedbackSchema } from '@ig-tracker/core';
import { db } from '@/lib/db/index';
import { contactMessages } from '@/lib/db/schema';
import { checkRateLimit, clientIpFromXff } from '@/lib/auth/rate-limit';
import { sendTelegramMessage, escapeTelegramHtml } from '@/lib/telegram';
import { sendEmail } from '@/lib/email/send';
import { feedbackPlainText, formatFeedback } from '@/lib/feedback/format';
import { toEnglish } from '@/lib/feedback/translate';

// Same inbox as /contact.
const NOTIFY_EMAIL = 'hello@whounfollowed.co';

// The homepage feedback widget. Always reaches the founder in English:
// fixed English labels, and a non-English note translated (original kept below).
export async function POST(req: Request) {
  const ip = clientIpFromXff(req.headers.get('x-forwarded-for'));
  if (!checkRateLimit(`site-feedback:${ip}`).allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const parsed = siteFeedbackSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const f = parsed.data;

  const fb = formatFeedback(f, await toEnglish(f.message, f.locale));
  const text = feedbackPlainText(fb);

  await db.insert(contactMessages).values({
    name: null, email: f.email ?? null, message: text, topic: fb.lines[0]![1], source: 'homepage_widget', page: f.where ?? null,
  });

  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const html = `<p>${fb.lines.map(([k, v]) => `<b>${esc(k)}:</b> ${esc(v)}`).join('<br>')}</p><p style="white-space:pre-wrap">${esc(fb.body)}</p>`;
  const mail = await sendEmail({ to: NOTIFY_EMAIL, subject: fb.subject, html, text, ...(f.email ? { replyTo: f.email } : {}) });
  if (!mail.ok) console.error('[site-feedback] email notify failed');

  const tg = [`💬 <b>${escapeTelegramHtml(fb.subject)}</b>`, ...fb.lines.slice(1).map(([k, v]) => `${k}: ${escapeTelegramHtml(v)}`), '', escapeTelegramHtml(fb.body)];
  const sent = await sendTelegramMessage(tg.join('\n'), 'inbox');
  if (!sent.ok) console.error('[site-feedback] telegram notify failed');

  return NextResponse.json({ ok: true });
}
