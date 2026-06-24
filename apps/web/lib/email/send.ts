import 'server-only';
import { Resend } from 'resend';

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
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!resend) {
    // Not configured: log so dev can see what would have been sent, don't throw.
    console.warn(`[email] skipped (no RESEND_API_KEY): "${opts.subject}" -> ${opts.to}`);
    return { ok: false, error: 'Email is not configured.' };
  }
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      ...(opts.text ? { text: opts.text } : {}),
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to send email.' };
  }
}
