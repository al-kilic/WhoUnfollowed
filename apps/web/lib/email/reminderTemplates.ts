import 'server-only';
import type { AppLocale } from '@/i18n/routing';
import { localizedPathname } from '@/i18n/localizedPathname';
import { C, emailLayout, formatDate, type EmailResult } from './templates';
import { getReminderEmailContent } from './reminderContent';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://whounfollowed.co';

// Links carried by every reminder email. The token identifies the row without
// putting the email address in a URL.
export function reminderLinks(token: string, locale: AppLocale) {
  const t = encodeURIComponent(token);
  return {
    open: `${APP_URL}/api/reminders/open?t=${t}&l=${locale}`,
    unsubscribePage: `${APP_URL}${localizedPathname('/unsubscribe', locale)}?t=${t}`,
    // RFC 8058 one-click target for the List-Unsubscribe header (POST only).
    oneClick: `${APP_URL}/api/reminders/unsubscribe?t=${t}`,
  };
}

// Headers that make Gmail and Apple Mail show their own "Unsubscribe" button.
export function reminderHeaders(token: string, locale: AppLocale): Record<string, string> {
  const links = reminderLinks(token, locale);
  return {
    'List-Unsubscribe': `<${links.oneClick}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}

function footerHtml(text: string, unsubscribeLabel: string, unsubscribeUrl: string): string {
  return `<tr><td style="padding:0 30px 26px;">
        <p style="margin:0;font-size:11.5px;line-height:1.6;color:${C.mute};">${text} <a href="${unsubscribeUrl}" style="color:${C.mute};text-decoration:underline;">${unsubscribeLabel}</a></p>
      </td></tr>`;
}

// Sent right after someone asks for reminders, so they know it worked and so
// an address entered by mistake (or by someone else) can stop them at once.
export function reminderConfirmationEmail(opts: { nextAt: Date; token: string; locale: AppLocale }): EmailResult {
  const c = getReminderEmailContent(opts.locale);
  const links = reminderLinks(opts.token, opts.locale);
  const date = formatDate(opts.nextAt, opts.locale);
  const body = c.confirmBody(date);
  const text = `${body}\n\n${c.confirmTip}\n\n${c.privacyNote}\n\n${c.unsubscribe}: ${links.unsubscribePage}`;

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:30px 30px 0;">
        <h1 style="margin:0 0 8px;font-size:21px;font-weight:600;color:${C.ink};">${c.confirmTitle}</h1>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${C.dim};">${body}</p>
        <p style="margin:0 0 16px;font-size:13px;line-height:1.6;color:${C.dim};background:${C.bg};border:1px solid ${C.border};border-radius:10px;padding:12px 14px;">${c.confirmTip}</p>
        <p style="margin:0 0 18px;font-size:12px;line-height:1.6;color:${C.mute};">${c.privacyNote}</p>
      </td></tr>
      ${footerHtml(c.footer, c.unsubscribe, links.unsubscribePage)}
    </table>`;

  return { subject: c.confirmSubject, html: emailLayout({ locale: opts.locale, preview: c.confirmPreview, contentHtml: content }), text };
}

// The reminder itself. sentCount is how many went out before this one:
// 0 = the 2-week one, 1 = the 1-month one, 2+ = monthly.
export function reminderEmail(opts: { sentCount: number; token: string; locale: AppLocale }): EmailResult {
  const c = getReminderEmailContent(opts.locale);
  const links = reminderLinks(opts.token, opts.locale);
  const i = Math.min(opts.sentCount, 2) as 0 | 1 | 2;
  const steps = c.steps
    .map((s, n) => `<tr><td style="padding:0 0 8px;font-size:14px;line-height:1.55;color:${C.dim};"><strong style="color:${C.teal};">${n + 1}.</strong> ${s}</td></tr>`)
    .join('');
  const text = `${c.body}\n\n${c.steps.map((s, n) => `${n + 1}. ${s}`).join('\n')}\n\n${c.button}: ${links.open}\n\n${c.privacyNote}\n\n${c.unsubscribe}: ${links.unsubscribePage}`;

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:30px 30px 0;">
        <h1 style="margin:0 0 8px;font-size:21px;font-weight:600;color:${C.ink};">${c.titles[i]}</h1>
        <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:${C.dim};">${c.body}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps}</table>
      </td></tr>
      <tr><td style="padding:10px 30px 0;">
        <a href="${links.open}" style="display:inline-block;background:${C.teal};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:10px;">${c.button}</a>
      </td></tr>
      <tr><td style="padding:20px 30px 14px;">
        <p style="margin:0;font-size:12px;line-height:1.6;color:${C.mute};">${c.privacyNote}</p>
      </td></tr>
      ${footerHtml(c.footer, c.unsubscribe, links.unsubscribePage)}
    </table>`;

  return { subject: c.subjects[i], html: emailLayout({ locale: opts.locale, preview: c.previews[i], contentHtml: content }), text };
}
