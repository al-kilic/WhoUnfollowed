import 'server-only';
import type { AppLocale } from '@/i18n/routing';
import { localizedPathname } from '@/i18n/localizedPathname';
import {
  getVerificationEmailContent,
  getPasswordResetEmailContent,
  getPurchaseEmailContent,
  getExpiringSoonEmailContent,
  getExpiredEmailContent,
} from './content';
import type { UnlockDuration } from '@/lib/stripe';

// Inline-styled, table-based HTML for broad email-client compatibility (no React
// Email dependency). Brand: warm teal (#01696F), cream (#F4F0E8), terra accent
// (#A84B2F). Copy stays on-brand: direct, privacy-forward, no em dashes.

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://whounfollowed.co';

const C = {
  bg: '#f4f0e8',
  card: '#ffffff',
  border: '#e7e0d3',
  teal: '#01696f',
  ink: '#1a1a1a',
  dim: '#555555',
  mute: '#8a8275',
  faint: '#b3aa97',
};

// Hidden preview text shown by inbox clients next to the subject line.
function preheader(text: string): string {
  return `<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${text}</div>`;
}

// Every other template here only interpolates copy this file wrote itself.
// contactNotificationEmail below is the first to embed raw visitor input, so
// it's the first that actually needs this.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Shared branded shell: logo header, content slot, legal footer.
function emailLayout(opts: { locale: AppLocale; preview: string; contentHtml: string }): string {
  return `<!DOCTYPE html>
<html lang="${opts.locale}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light only" />
  </head>
  <body style="margin:0;padding:0;background:${C.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    ${preheader(opts.preview)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;width:100%;">
            <tr>
              <td style="padding:4px 8px 20px;">
                <a href="${APP_URL}" style="text-decoration:none;display:inline-block;">
                  <img src="${APP_URL}/logo.png" width="26" height="26" alt="" style="vertical-align:middle;border-radius:7px;" />
                  <span style="vertical-align:middle;margin-left:9px;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:${C.ink};letter-spacing:-0.01em;">WhoUnfollowed</span>
                </a>
              </td>
            </tr>
            <tr>
              <td style="background:${C.card};border:1px solid ${C.border};border-radius:16px;">
                ${opts.contentHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 8px 0;">
                <p style="margin:0;font-size:11px;line-height:1.6;color:${C.faint};">
                  WhoUnfollowed. Your data stays in your browser. Not affiliated with Instagram or Meta.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// Locale-aware date formatting for the (English-brand, translated-copy) emails.
function formatDate(date: Date, locale: AppLocale): string {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}

interface EmailResult {
  subject: string;
  html: string;
  text: string;
}

export function verificationCodeEmail(code: string, locale: AppLocale = 'en'): EmailResult {
  const c = getVerificationEmailContent(locale);
  const subject = c.subject(code);
  const text = `${c.body} ${code}. ${c.note}`;

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:30px 30px 0;">
        <h1 style="margin:0 0 8px;font-size:21px;font-weight:600;color:${C.ink};">${c.title}</h1>
        <p style="margin:0 0 22px;font-size:14px;line-height:1.6;color:${C.dim};">${c.body}</p>
      </td></tr>
      <tr><td style="padding:0 30px;">
        <div style="background:${C.bg};border:1px solid ${C.border};border-radius:12px;padding:18px;text-align:center;font-size:34px;font-weight:700;letter-spacing:10px;color:${C.teal};font-family:'SF Mono',Menlo,Consolas,monospace;">${code}</div>
      </td></tr>
      <tr><td style="padding:20px 30px 30px;">
        <p style="margin:0;font-size:12px;line-height:1.6;color:${C.mute};">${c.note}</p>
      </td></tr>
    </table>`;

  return { subject, html: emailLayout({ locale, preview: c.preview(code), contentHtml: content }), text };
}

export function passwordResetEmail(resetUrl: string, locale: AppLocale = 'en'): EmailResult {
  const c = getPasswordResetEmailContent(locale);
  const subject = c.subject;
  const text = `${c.body} ${resetUrl} ${c.note1} ${c.note2Strong} ${c.note2Rest}`;

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:30px 30px 0;">
        <h1 style="margin:0 0 8px;font-size:21px;font-weight:600;color:${C.ink};">${c.title}</h1>
        <p style="margin:0 0 22px;font-size:14px;line-height:1.6;color:${C.dim};">${c.body}</p>
      </td></tr>
      <tr><td style="padding:0 30px;">
        <a href="${resetUrl}" style="display:inline-block;background:${C.teal};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:10px;">${c.button}</a>
      </td></tr>
      <tr><td style="padding:22px 30px 30px;">
        <p style="margin:0 0 12px;font-size:12px;line-height:1.6;color:${C.mute};">${c.note1}</p>
        <p style="margin:0;font-size:12px;line-height:1.6;color:${C.mute};"><strong style="color:${C.dim};">${c.note2Strong}</strong> ${c.note2Rest}</p>
      </td></tr>
    </table>`;

  return { subject, html: emailLayout({ locale, preview: c.preview, contentHtml: content }), text };
}

export function exportConfirmationEmail(csvFilename: string): EmailResult {
  const subject = `You exported: ${csvFilename}`;
  const text = `Thanks for using WhoUnfollowed. Your CSV (${csvFilename}) was downloaded directly to your device. We do not store your follower data on our servers.`;

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:30px 30px 0;">
        <h1 style="margin:0 0 8px;font-size:21px;font-weight:600;color:${C.ink};">Thanks for using WhoUnfollowed</h1>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${C.dim};">Your CSV <strong style="color:${C.ink};">${csvFilename}</strong> was downloaded straight to your device. We do not store your follower data on our servers. Nothing left your browser.</p>
      </td></tr>
      <tr><td style="padding:0 30px 30px;">
        <a href="${APP_URL}" style="display:inline-block;background:${C.teal};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 20px;border-radius:10px;">Open WhoUnfollowed</a>
      </td></tr>
    </table>`;

  return { subject, html: emailLayout({ locale: 'en', preview: 'Your export is ready on your device.', contentHtml: content }), text };
}

// Sent from the Stripe webhook after a one-time unlock purchase (30 or 365
// days) completes, whether that's a brand-new customer or an existing one
// stacking more time on an unexpired unlock.
export function purchaseConfirmationEmail(opts: {
  kind: 'new_customer' | 'renewal';
  unlockDuration: UnlockDuration;
  expiresAt: Date;
  locale?: AppLocale;
}): EmailResult {
  const locale = opts.locale ?? 'en';
  const c = getPurchaseEmailContent(locale);
  const planLabel = opts.unlockDuration === 'yearly' ? c.planYearly : c.planMonthly;
  const expiresOn = formatDate(opts.expiresAt, locale);
  const isNew = opts.kind === 'new_customer';

  const subject = isNew ? c.subjectNew : c.subjectRenewal;
  const preview = isNew ? c.previewNew : c.previewRenewal;
  const title = isNew ? c.titleNew : c.titleRenewal;
  const body = isNew ? c.bodyNew(planLabel, expiresOn) : c.bodyRenewal(planLabel, expiresOn);
  const historyUrl = `${APP_URL}${localizedPathname('/history', locale)}`;
  const text = `${body} ${c.footerNote} ${historyUrl}`;

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:30px 30px 0;">
        <h1 style="margin:0 0 8px;font-size:21px;font-weight:600;color:${C.ink};">${title}</h1>
        <p style="margin:0 0 22px;font-size:14px;line-height:1.6;color:${C.dim};">${body}</p>
      </td></tr>
      <tr><td style="padding:0 30px;">
        <a href="${historyUrl}" style="display:inline-block;background:${C.teal};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:10px;">${c.button}</a>
      </td></tr>
      <tr><td style="padding:20px 30px 30px;">
        <p style="margin:0;font-size:12px;line-height:1.6;color:${C.mute};">${c.footerNote}</p>
      </td></tr>
    </table>`;

  return { subject, html: emailLayout({ locale, preview, contentHtml: content }), text };
}

// Reminder cron: sent once (see profiles.expiryReminderSentAt) a few days
// before an unlock's subscriptionExpiresAt.
export function unlockExpiringSoonEmail(opts: { daysLeft: number; expiresAt: Date; locale?: AppLocale }): EmailResult {
  const locale = opts.locale ?? 'en';
  const c = getExpiringSoonEmailContent(locale);
  const expiresOn = formatDate(opts.expiresAt, locale);
  const body = c.body(opts.daysLeft, expiresOn);
  const pricingUrl = `${APP_URL}${localizedPathname('/pricing', locale)}`;
  const text = `${body} ${pricingUrl}`;

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:30px 30px 0;">
        <h1 style="margin:0 0 8px;font-size:21px;font-weight:600;color:${C.ink};">${c.title}</h1>
        <p style="margin:0 0 22px;font-size:14px;line-height:1.6;color:${C.dim};">${body}</p>
      </td></tr>
      <tr><td style="padding:0 30px 30px;">
        <a href="${pricingUrl}" style="display:inline-block;background:${C.teal};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:10px;">${c.button}</a>
      </td></tr>
    </table>`;

  return { subject: c.subject, html: emailLayout({ locale, preview: c.preview(opts.daysLeft), contentHtml: content }), text };
}

// Expiry cron: sent once (see profiles.expiredEmailSentAt) the day an
// unlock's subscriptionExpiresAt passes.
export function unlockExpiredEmail(opts: { locale?: AppLocale } = {}): EmailResult {
  const locale = opts.locale ?? 'en';
  const c = getExpiredEmailContent(locale);
  const pricingUrl = `${APP_URL}${localizedPathname('/pricing', locale)}`;
  const text = `${c.body} ${pricingUrl}`;

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:30px 30px 0;">
        <h1 style="margin:0 0 8px;font-size:21px;font-weight:600;color:${C.ink};">${c.title}</h1>
        <p style="margin:0 0 22px;font-size:14px;line-height:1.6;color:${C.dim};">${c.body}</p>
      </td></tr>
      <tr><td style="padding:0 30px 30px;">
        <a href="${pricingUrl}" style="display:inline-block;background:${C.teal};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:10px;">${c.button}</a>
      </td></tr>
    </table>`;

  return { subject: c.subject, html: emailLayout({ locale, preview: c.preview, contentHtml: content }), text };
}

// Internal notification, sent to the founder's own inbox (not the visitor)
// whenever the /contact form or the homepage quick-feedback widget gets a
// submission. Always English (this is admin-facing, not user-facing site
// copy) and always escapes the visitor-supplied fields, since this is the
// first template in this file to embed raw user input rather than copy this
// file wrote itself.
export function contactNotificationEmail(opts: {
  // `| undefined` (not just `?:`) since the caller passes a Zod-parsed
  // object through directly under exactOptionalPropertyTypes, which keeps
  // the key present with an undefined value rather than omitting it.
  name?: string | undefined;
  email?: string | undefined;
  message: string;
  topic?: string | undefined;
  source: 'contact_page' | 'homepage_widget';
  page?: string | undefined;
}): EmailResult {
  const sourceLabel = opts.source === 'contact_page' ? 'Contact page' : 'Homepage widget';
  const whoLabel = opts.name || opts.email || 'an anonymous visitor';
  const subject = opts.topic ? `[${opts.topic}] New message from ${whoLabel}` : `New message from ${whoLabel}`;

  const fromValue = opts.name
    ? `${opts.name}${opts.email ? ` <${opts.email}>` : ''}`
    : (opts.email ?? '(no email given)');
  const rows: [string, string][] = [
    ['From', fromValue],
    ['Source', sourceLabel],
  ];
  if (opts.topic) rows.push(['Topic', opts.topic]);
  if (opts.page) rows.push(['Page', opts.page]);

  const metaHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:3px 10px 3px 0;font-size:12px;color:${C.mute};white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:3px 0;font-size:12px;color:${C.dim};">${escapeHtml(value)}</td></tr>`,
    )
    .join('');
  const metaText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');

  const messageHtml = escapeHtml(opts.message).replace(/\n/g, '<br />');

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:30px 30px 0;">
        <h1 style="margin:0 0 14px;font-size:21px;font-weight:600;color:${C.ink};">New contact message</h1>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">${metaHtml}</table>
      </td></tr>
      <tr><td style="padding:0 30px 30px;">
        <div style="background:${C.bg};border:1px solid ${C.border};border-radius:12px;padding:16px 18px;font-size:14px;line-height:1.6;color:${C.ink};white-space:pre-wrap;">${messageHtml}</div>
      </td></tr>
    </table>`;

  const text = `New contact message\n\n${metaText}\n\n${opts.message}`;

  return {
    subject,
    html: emailLayout({ locale: 'en', preview: opts.message.slice(0, 120), contentHtml: content }),
    text,
  };
}
