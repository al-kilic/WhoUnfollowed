import 'server-only';
import type { AppLocale } from '@/i18n/routing';
import { localizedPathname } from '@/i18n/localizedPathname';
import { C, emailLayout, type EmailResult } from './templates';
import { getPlannerEmailContent } from './plannerContent';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://whounfollowed.co';

export function plannerLinks(token: string, locale: AppLocale) {
  const t = encodeURIComponent(token);
  return {
    open: `${APP_URL}${localizedPathname('/dashboard', locale)}`,
    unsubscribePage: `${APP_URL}${localizedPathname('/unsubscribe', locale)}?t=${t}&k=planner`,
    // Same one-click endpoint as reminders: it recognises both kinds of token.
    oneClick: `${APP_URL}/api/reminders/unsubscribe?t=${t}`,
  };
}

export function plannerHeaders(token: string, locale: AppLocale): Record<string, string> {
  return {
    'List-Unsubscribe': `<${plannerLinks(token, locale).oneClick}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}

export function plannerEmail(opts: {
  app: string; total: number; done: number; perDay: number; cadence: 'weekly' | 'daily'; token: string; locale: AppLocale;
}): EmailResult {
  const c = getPlannerEmailContent(opts.locale);
  const n = (x: number) => new Intl.NumberFormat(opts.locale).format(x);
  const links = plannerLinks(opts.token, opts.locale);
  const left = Math.max(0, opts.total - opts.done);
  const today = Math.min(left, opts.perDay);
  const pct = opts.total === 0 ? 100 : Math.round((opts.done / opts.total) * 100);
  const lines = [c.progress(n(opts.done), n(opts.total), pct), c.today(n(today)), c.daysLeft(n(Math.ceil(left / Math.max(1, opts.perDay))))];
  const text = `${c.title(opts.app)}\n\n${lines.join('\n')}\n\n${c.tip}\n\n${c.button}: ${links.open}\n\n${c.privacyNote}\n\n${c.unsubscribe}: ${links.unsubscribePage}`;

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:30px 30px 0;">
        <h1 style="margin:0 0 10px;font-size:21px;font-weight:600;color:${C.ink};">${c.title(opts.app)}</h1>
        <div style="height:6px;border-radius:3px;background:${C.border};margin:0 0 14px;"><div style="height:6px;border-radius:3px;background:${C.teal};width:${pct}%;"></div></div>
        ${lines.map(l => `<p style="margin:0 0 6px;font-size:14px;line-height:1.6;color:${C.dim};">${l}</p>`).join('')}
        <p style="margin:12px 0 0;font-size:13px;line-height:1.6;color:${C.dim};background:${C.bg};border:1px solid ${C.border};border-radius:10px;padding:12px 14px;">${c.tip}</p>
      </td></tr>
      <tr><td style="padding:18px 30px 0;">
        <a href="${links.open}" style="display:inline-block;background:${C.teal};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:10px;">${c.button}</a>
      </td></tr>
      <tr><td style="padding:20px 30px 14px;">
        <p style="margin:0;font-size:12px;line-height:1.6;color:${C.mute};">${c.privacyNote}</p>
      </td></tr>
      <tr><td style="padding:0 30px 26px;">
        <p style="margin:0;font-size:11.5px;line-height:1.6;color:${C.mute};">${c.footer(opts.cadence)} <a href="${links.unsubscribePage}" style="color:${C.mute};text-decoration:underline;">${c.unsubscribe}</a></p>
      </td></tr>
    </table>`;

  return {
    subject: c.subject(n(left), opts.app),
    html: emailLayout({ locale: opts.locale, preview: c.preview(n(today)), contentHtml: content }),
    text,
  };
}
