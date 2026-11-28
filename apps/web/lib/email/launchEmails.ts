import type { AppLocale } from '@/i18n/routing';
import { localizedPathname } from '@/i18n/localizedPathname';
import { C, emailLayout, type EmailResult } from './templates';
import { getEarlyLifetimeEmailContent, getLegacyProEmailContent } from './launchContent';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://whounfollowed.co';

export type LaunchEmailKind = 'early_lifetime' | 'legacy_pro';

export function launchLinks(locale: AppLocale) {
  return {
    ask: `${APP_URL}${localizedPathname('/app/ask', locale)}`,
    pricing: `${APP_URL}${localizedPathname('/pricing', locale)}`,
  };
}

export function formatLaunchDate(d: Date, locale: AppLocale): string {
  return d.toLocaleDateString(locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

const p = (s: string) => `<p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:${C.dim};">${s}</p>`;

function render(opts: { locale: AppLocale; subject: string; preview: string; title: string; lines: string[]; button: string; pricingLink: string; footer: string }): EmailResult {
  const links = launchLinks(opts.locale);
  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:30px 30px 0;">
        <h1 style="margin:0 0 10px;font-size:21px;font-weight:600;color:${C.ink};">${opts.title}</h1>
        ${opts.lines.map(p).join('')}
      </td></tr>
      <tr><td style="padding:8px 30px 0;">
        <a href="${links.ask}" style="display:inline-block;background:${C.teal};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:10px;">${opts.button}</a>
        <a href="${links.pricing}" style="display:inline-block;margin-left:14px;font-size:14px;color:${C.teal};">${opts.pricingLink}</a>
      </td></tr>
      <tr><td style="padding:20px 30px 30px;">
        <p style="margin:0;font-size:12px;line-height:1.6;color:${C.mute};">${opts.footer}</p>
      </td></tr>
    </table>`;
  const text = `${opts.title}\n\n${opts.lines.join('\n\n')}\n\n${opts.button}: ${links.ask}\n${opts.pricingLink}: ${links.pricing}\n\n${opts.footer}`;
  return { subject: opts.subject, html: emailLayout({ locale: opts.locale, preview: opts.preview, contentHtml: content }), text };
}

// Lifetime bought before Pro AI existed: thanks, the gift, 60% off monthly for life.
export function earlyLifetimeEmail(opts: { locale: AppLocale }): EmailResult {
  const c = getEarlyLifetimeEmailContent(opts.locale);
  return render({ locale: opts.locale, subject: c.subject, preview: c.preview, title: c.title, lines: [c.thanks, c.keeps, c.gift, c.discount], button: c.askButton, pricingLink: c.pricingLink, footer: c.footer });
}

// The old one-time Pro: thanks, keeps Pro until it ends, a small trial; the
// yearly-unlock buyers also get the $9.99-off-yearly line while it is open.
export function legacyProEmail(opts: { locale: AppLocale; proUntil: Date | null; yearlyOfferEndsAt: Date | null; now?: Date }): EmailResult {
  const c = getLegacyProEmailContent(opts.locale);
  const now = opts.now ?? new Date();
  const until = opts.proUntil && opts.proUntil.getTime() > now.getTime() ? formatLaunchDate(opts.proUntil, opts.locale) : null;
  // Pro that already ended: no "stays as it is" line, just the thanks and the gift.
  const lines = until ? [c.thanks, c.keeps(until), c.gift] : [c.thanks, c.gift];
  if (opts.yearlyOfferEndsAt && opts.yearlyOfferEndsAt.getTime() > now.getTime()) {
    // The offer ends at midnight UTC on the end day (exclusive), so the last day to subscribe is the day before.
    lines.push(c.yearly(formatLaunchDate(new Date(opts.yearlyOfferEndsAt.getTime() - 86_400_000), opts.locale)));
  }
  return render({ locale: opts.locale, subject: c.subject, preview: c.preview, title: c.title, lines, button: c.askButton, pricingLink: c.pricingLink, footer: c.footer });
}

// Who gets which email. Pure, so it is tested without a database.
export interface LaunchCandidate {
  userId: string;
  email: string | null;
  lifetimePurchasedAt: Date | null;
  subscriptionExpiresAt: Date | null;
  marketingOptOutAt: Date | null;
}

export function launchEmailKind(c: LaunchCandidate, earlyLifetimeBefore: Date): LaunchEmailKind | null {
  if (!c.email || c.marketingOptOutAt) return null;
  if (c.lifetimePurchasedAt) return c.lifetimePurchasedAt < earlyLifetimeBefore ? 'early_lifetime' : null;
  return c.subscriptionExpiresAt ? 'legacy_pro' : null;
}
