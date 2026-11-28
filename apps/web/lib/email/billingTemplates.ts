import type { AppLocale } from '@/i18n/routing';
import { localizedPathname } from '@/i18n/localizedPathname';
import { C, emailLayout, formatDate, type EmailResult } from './templates';
import { getBillingEmailContent, type BillingEmailContent } from './billingContent';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://whounfollowed.co';

// Amounts always come from Stripe (cents + currency), never hard-coded.
export function formatMoney(cents: number, currency: string, locale: AppLocale): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100);
}

const p = (t: string) => `<p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:${C.dim};">${t}</p>`;
const small = (t: string) => `<p style="margin:0 0 8px;font-size:12px;line-height:1.6;color:${C.mute};">${t}</p>`;

// The lines every purchase email carries: start-now confirmation, how to
// cancel (subscriptions only), the short legal cancel note, Terms and Refund links.
export function legalBlock(c: BillingEmailContent, locale: AppLocale, opts: { cancel: boolean }): { html: string; text: string } {
  const terms = `${APP_URL}${localizedPathname('/terms', locale)}`;
  const refund = `${APP_URL}${localizedPathname('/refund', locale)}`;
  const lines = [c.startNow, ...(opts.cancel ? [c.cancel] : []), c.legal];
  const links = `<a href="${terms}" style="color:${C.teal};">${c.links.terms}</a> · <a href="${refund}" style="color:${C.teal};">${c.links.refund}</a>`;
  return {
    html: lines.map(small).join('') + small(links),
    text: `${lines.join(' ')} ${c.links.terms}: ${terms} ${c.links.refund}: ${refund}`,
  };
}

function frame(opts: { locale: AppLocale; preview: string; title: string; body: string[]; button: string; url: string; legal: { html: string; text: string }; footer: string; subject: string }): EmailResult {
  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:30px 30px 0;">
        <h1 style="margin:0 0 8px;font-size:21px;font-weight:600;color:${C.ink};">${opts.title}</h1>
        ${opts.body.map(p).join('')}
      </td></tr>
      <tr><td style="padding:12px 30px 0;">
        <a href="${opts.url}" style="display:inline-block;background:${C.teal};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:10px;">${opts.button}</a>
      </td></tr>
      <tr><td style="padding:20px 30px 0;">${opts.legal.html}</td></tr>
      <tr><td style="padding:8px 30px 30px;">${small(opts.footer)}</td></tr>
    </table>`;
  return {
    subject: opts.subject,
    html: emailLayout({ locale: opts.locale, preview: opts.preview, contentHtml: content }),
    text: [opts.title, ...opts.body, opts.url, opts.legal.text, opts.footer].join(' '),
  };
}

export interface SubscriptionConfirmation {
  locale: AppLocale;
  interval: 'month' | 'year';
  // What Stripe charged today (after any discount), and what each renewal costs.
  paidCents: number;
  renewCents: number;
  currency: string;
  renewsOn: Date | null;
}

export function subscriptionConfirmationEmail(o: SubscriptionConfirmation): EmailResult {
  const c = getBillingEmailContent(o.locale);
  const renew = c.every(formatMoney(o.renewCents, o.currency, o.locale), o.interval);
  const body = [
    `${c.sub.plan(c.interval[o.interval])} ${c.sub.paid(formatMoney(o.paidCents, o.currency, o.locale))}`,
    c.sub.renews(renew, o.renewsOn ? formatDate(o.renewsOn, o.locale) : null),
    c.sub.ready,
    c.sub.beta,
  ];
  return frame({ locale: o.locale, subject: c.sub.subject, preview: c.sub.preview, title: c.sub.title, body, button: c.sub.button,
    url: `${APP_URL}${localizedPathname('/app/today', o.locale)}`, legal: legalBlock(c, o.locale, { cancel: true }), footer: c.footer });
}

export function refillReceiptEmail(o: { locale: AppLocale; paidCents: number; currency: string; validUntil: Date }): EmailResult {
  const c = getBillingEmailContent(o.locale);
  const body = [c.refill.paid(formatMoney(o.paidCents, o.currency, o.locale)), c.refill.body(formatDate(o.validUntil, o.locale)), c.refill.final];
  return frame({ locale: o.locale, subject: c.refill.subject, preview: c.refill.preview, title: c.refill.title, body, button: c.refill.button,
    url: `${APP_URL}${localizedPathname('/app/ask', o.locale)}`, legal: legalBlock(c, o.locale, { cancel: false }), footer: c.footer });
}

export function renewalReminderEmail(o: { locale: AppLocale; kind: 'year' | 'annual'; interval: 'month' | 'year'; priceCents: number; currency: string; renewsOn: Date }): EmailResult {
  const c = getBillingEmailContent(o.locale);
  const price = c.every(formatMoney(o.priceCents, o.currency, o.locale), o.interval);
  const date = formatDate(o.renewsOn, o.locale);
  const body = [o.kind === 'year' ? c.remind.year(price, date) : c.remind.annual(price, date), c.cancel, c.remind.keep];
  const terms = `${APP_URL}${localizedPathname('/terms', o.locale)}`;
  const legal = { html: small(`<a href="${terms}" style="color:${C.teal};">${c.links.terms}</a>`), text: `${c.links.terms}: ${terms}` };
  return frame({ locale: o.locale, subject: o.kind === 'year' ? c.remind.yearSubject(date) : c.remind.annualSubject, preview: c.remind.preview, title: c.remind.title,
    body, button: c.remind.button, url: `${APP_URL}${localizedPathname('/app/you', o.locale)}`, legal, footer: c.footer });
}
