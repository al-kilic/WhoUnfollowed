// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
vi.mock('server-only', () => ({}));
import { subscriptionConfirmationEmail, refillReceiptEmail, renewalReminderEmail, formatMoney } from './billingTemplates';
import { routing } from '@/i18n/routing';

const all = (r: { subject: string; html: string; text: string }) => `${r.subject} ${r.html} ${r.text}`;

describe('billing emails', () => {
  for (const locale of routing.locales) {
    it(`subscription confirmation has the legal content (${locale})`, () => {
      const r = subscriptionConfirmationEmail({ locale, interval: 'month', paidCents: 399, renewCents: 399, currency: 'usd', renewsOn: new Date('2026-12-24T00:00:00Z') });
      expect(r.text).toContain(formatMoney(399, 'usd', locale));
      expect(r.text).toContain('Pro AI');
      expect(r.text).toContain('hello@whounfollowed.co');
      expect(r.text).toContain(`/${locale === 'en' ? '' : `${locale}/`}terms`.replace('//', '/'));
      expect(r.text).toContain('refund');
      expect(r.text).toMatch(/14/);
      expect(r.text).toMatch(/7/);
      expect(all(r)).not.toContain('—');
    });
    it(`refill receipt says one-time, validity and links (${locale})`, () => {
      const r = refillReceiptEmail({ locale, paidCents: 499, currency: 'usd', validUntil: new Date('2027-11-24T00:00:00Z') });
      expect(r.text).toContain(formatMoney(499, 'usd', locale));
      expect(r.text).toContain('2027');
      expect(r.text).toContain('refund');
      expect(all(r)).not.toContain('—');
    });
    it(`renewal reminder names price, date and how to cancel (${locale})`, () => {
      const r = renewalReminderEmail({ locale, kind: 'year', interval: 'year', priceCents: 6900, currency: 'usd', renewsOn: new Date('2027-12-01T00:00:00Z') });
      expect(r.text).toContain(formatMoney(6900, 'usd', locale));
      expect(r.subject).toMatch(/2027|dic|dez|Dec|1/);
      expect(r.text).toContain('/app/you');
      expect(all(r)).not.toContain('—');
    });
  }
  it('the English confirmation says it renews until cancelled and that it started right away', () => {
    const r = subscriptionConfirmationEmail({ locale: 'en', interval: 'year', paidCents: 5901, renewCents: 6900, currency: 'usd', renewsOn: new Date('2027-12-01T00:00:00Z') });
    expect(r.text).toContain('Paid today: $59.01');
    expect(r.text).toContain('renews automatically at $69.00 a year until you cancel');
    expect(r.text).toContain('start right away');
    expect(r.text).toContain('Cancel any time');
  });
});
