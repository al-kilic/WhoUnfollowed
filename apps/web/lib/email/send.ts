import 'server-only';
import { Resend } from 'resend';
import { sendTelegramMessage, escapeTelegramHtml } from '@/lib/telegram';

// Email is sent via Resend. Configuration is optional: when RESEND_API_KEY is
// absent (local dev, or before the domain is verified) email features degrade
// gracefully — callers should check isEmailConfigured() and fall back rather
// than failing the user's action.
const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM ?? 'WhoUnfollowed <noreply@whounfollowed.co>';

const resend = apiKey ? new Resend(apiKey) : null;

export function isEmailConfigured(): boolean {
  return resend !== null;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  // Lets the recipient hit "reply" and land in the sender's own inbox
  // (used for the contact-form/quick-feedback notification, so replying to
  // the founder's copy goes straight back to the visitor who wrote in).
  replyTo?: string;
  // Extra headers, e.g. List-Unsubscribe on reminder emails.
  headers?: Record<string, string>;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!resend) {
    // Not configured: log so dev can see what would have been sent, don't throw.
    console.warn(`[email] skipped (no RESEND_API_KEY): "${opts.subject}" -> ${opts.to}`);
    return { ok: false, error: 'Email is not configured.' };
  }
  try {
    const { error } = await resend.emails.send({
      from: opts.from ?? FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      ...(opts.text ? { text: opts.text } : {}),
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
      ...(opts.headers ? { headers: opts.headers } : {}),
    });
    if (error) {
      noteFailure(error.message, error.name);
      return { ok: false, error: error.message };
    }
    tally().sent++;
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to send email.';
    noteFailure(message);
    return { ok: false, error: message };
  }
}

// Per-process counters for every email sent through here (signup codes,
// receipts, reminders...), read and reset by the daily cron's report. Kept on
// globalThis so every route bundle shares one copy. They reset on a redeploy,
// so the report labels them "since the last report or restart".
interface EmailTally { sent: number; failed: number; limited: number; since: number }
const g = globalThis as typeof globalThis & { __wuEmailTally?: EmailTally; __wuQuotaAlertAt?: number };
function tally(): EmailTally {
  g.__wuEmailTally ??= { sent: 0, failed: 0, limited: 0, since: Date.now() };
  return g.__wuEmailTally;
}

export function takeEmailTally(): EmailTally {
  const t = { ...tally() };
  g.__wuEmailTally = { sent: 0, failed: 0, limited: 0, since: Date.now() };
  return t;
}

// Resend answers 429 with names like daily_quota_exceeded, monthly_quota_exceeded
// or rate_limit_exceeded when the plan's limit is hit.
export function isLimitError(message: string, name?: string): boolean {
  return /quota|rate[_ ]limit|too many requests/i.test(`${name ?? ''} ${message}`);
}

const QUOTA_ALERT_EVERY_MS = 60 * 60 * 1000;

function noteFailure(message: string, name?: string) {
  const t = tally();
  t.failed++;
  if (!isLimitError(message, name)) return;
  t.limited++;
  // Alert right away, at most once an hour, so a day of refusals doesn't spam.
  const now = Date.now();
  if (g.__wuQuotaAlertAt && now - g.__wuQuotaAlertAt < QUOTA_ALERT_EVERY_MS) return;
  g.__wuQuotaAlertAt = now;
  void sendTelegramMessage([
    '🚨 Email limit hit: Resend refused a send',
    `Reason: ${escapeTelegramHtml(`${name ?? 'error'}: ${message}`.slice(0, 200))}`,
    'Emails are not going out until the limit resets. Signup codes and receipts are affected too.',
  ].join('\n')).catch(() => { /* never block a send on the alert */ });
}
