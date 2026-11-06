import 'server-only';
import type { AppLocale } from '@/i18n/routing';
import { localizedPathname } from '@/i18n/localizedPathname';
import { C, emailLayout, type EmailResult } from './templates';
import { reminderLinks } from './reminderTemplates';
import { getWrapEmailContent } from './wrapContent';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://whounfollowed.co';

export function wrapLinks(token: string, locale: AppLocale) {
  const base = reminderLinks(token, locale);
  return {
    ...base,
    // Same open endpoint as reminders (counts as engagement), tagged as a wrap.
    open: `${base.open}&k=wrap`,
    lastExport: `${APP_URL}${localizedPathname('/dashboard', locale)}?wrap=1&utm_source=wrap&utm_medium=email`,
  };
}

export function wrapEmail(opts: { token: string; locale: AppLocale }): EmailResult {
  const c = getWrapEmailContent(opts.locale);
  const links = wrapLinks(opts.token, opts.locale);
  const text = `${c.title}\n\n${c.body}\n\n${c.bullets.map(b => `- ${b}`).join('\n')}\n\n${c.button}: ${links.open}\n${c.lastExport}: ${links.lastExport}\n\n${c.privacyNote}\n\n${c.footer}\n${c.unsubscribe}: ${links.unsubscribePage}`;

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:0;background:#0B2426;border-radius:14px 14px 0 0;">
        <div style="padding:30px 30px 26px;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#7fc4c7;">3-month wrap</p>
          <h1 style="margin:0;font-size:24px;line-height:1.25;font-weight:600;color:#F4F0E8;">${c.title}</h1>
        </div>
      </td></tr>
      <tr><td style="padding:24px 30px 0;">
        <p style="margin:0 0 12px;font-size:14.5px;line-height:1.6;color:${C.dim};">${c.body}</p>
        ${c.bullets.map(b => `<p style="margin:0 0 6px;font-size:14px;line-height:1.55;color:${C.ink};">&#9679;&nbsp; ${b}</p>`).join('')}
      </td></tr>
      <tr><td style="padding:20px 30px 0;">
        <a href="${links.open}" style="display:inline-block;background:${C.teal};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:10px;">${c.button}</a>
        <p style="margin:12px 0 0;font-size:13px;"><a href="${links.lastExport}" style="color:${C.teal};">${c.lastExport}</a></p>
      </td></tr>
      <tr><td style="padding:20px 30px 14px;">
        <p style="margin:0;font-size:12px;line-height:1.6;color:${C.mute};">${c.privacyNote}</p>
      </td></tr>
      <tr><td style="padding:0 30px 26px;">
        <p style="margin:0;font-size:11.5px;line-height:1.6;color:${C.mute};">${c.footer} <a href="${links.unsubscribePage}" style="color:${C.mute};text-decoration:underline;">${c.unsubscribe}</a></p>
      </td></tr>
    </table>`;

  return { subject: c.subject, html: emailLayout({ locale: opts.locale, preview: c.preview, contentHtml: content }), text };
}
