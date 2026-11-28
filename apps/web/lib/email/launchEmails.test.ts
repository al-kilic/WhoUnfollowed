import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { earlyLifetimeEmail, legacyProEmail, launchEmailKind, type LaunchCandidate } from './launchEmails';
import type { AppLocale } from '@/i18n/routing';

const LOCALES: AppLocale[] = ['en', 'es', 'pt'];
const NOW = new Date('2026-12-02T12:00:00Z');
const ENDS = new Date('2027-03-01T00:00:00Z');
const EARLY_BEFORE = new Date('2026-11-11T00:00:00Z');

// Never the size of the gift, never costs, never models, no em dashes.
function clean(s: string) {
  expect(s).not.toContain('—');
  expect(s).not.toMatch(/\$\s?(7\.5|7\.50|1\.00|2\.5)\b|\b3 (months|meses)\b|credit|crédit|token|haiku|sonnet|claude|anthropic/i);
}

describe('launch email templates', () => {
  for (const locale of LOCALES) {
    it(`early Lifetime (${locale}): gift, 60% monthly, localized links`, () => {
      const m = earlyLifetimeEmail({ locale });
      clean(m.subject); clean(m.html); clean(m.text ?? '');
      expect(m.text).toContain('60%');
      const prefix = locale === 'en' ? '' : `/${locale}`;
      expect(m.text).toContain(`${prefix}/app/ask`);
      expect(m.text).toContain(`${prefix}/pricing`);
    });

    it(`old Pro (${locale}): yearly offer only when given, with the last day`, () => {
      const plain = legacyProEmail({ locale, proUntil: new Date('2027-05-01T00:00:00Z'), yearlyOfferEndsAt: null, now: NOW });
      const yearly = legacyProEmail({ locale, proUntil: null, yearlyOfferEndsAt: ENDS, now: NOW });
      for (const m of [plain, yearly]) { clean(m.subject); clean(m.html); clean(m.text ?? ''); }
      expect(plain.text).not.toContain('9.99');
      expect(plain.text).toMatch(/2027/);
      expect(yearly.text).toContain('$9.99');
      // Offer ends 2027-03-01 exclusive, so the last day shown is Feb 28.
      expect(yearly.text).toMatch(/28/);
    });
  }

  it('drops the yearly line once the offer has ended', () => {
    const m = legacyProEmail({ locale: 'en', proUntil: null, yearlyOfferEndsAt: ENDS, now: new Date('2027-03-02T00:00:00Z') });
    expect(m.text).not.toContain('9.99');
  });
});

describe('launchEmailKind', () => {
  const base: LaunchCandidate = { userId: 'u', email: 'a@b.co', lifetimePurchasedAt: null, subscriptionExpiresAt: null, marketingOptOutAt: null };
  it('early Lifetime only before Nov 11', () => {
    expect(launchEmailKind({ ...base, lifetimePurchasedAt: new Date('2026-10-01T00:00:00Z') }, EARLY_BEFORE)).toBe('early_lifetime');
    expect(launchEmailKind({ ...base, lifetimePurchasedAt: new Date('2026-11-11T00:00:00Z') }, EARLY_BEFORE)).toBeNull();
  });
  it('old Pro with an unlock date, active or ended', () => {
    expect(launchEmailKind({ ...base, subscriptionExpiresAt: new Date('2026-01-01T00:00:00Z') }, EARLY_BEFORE)).toBe('legacy_pro');
    expect(launchEmailKind({ ...base, subscriptionExpiresAt: new Date('2027-01-01T00:00:00Z') }, EARLY_BEFORE)).toBe('legacy_pro');
  });
  it('Lifetime wins over an old unlock; no email, opt-out or nothing paid means no email', () => {
    expect(launchEmailKind({ ...base, lifetimePurchasedAt: new Date('2026-10-01T00:00:00Z'), subscriptionExpiresAt: new Date('2026-01-01T00:00:00Z') }, EARLY_BEFORE)).toBe('early_lifetime');
    expect(launchEmailKind({ ...base, email: null, subscriptionExpiresAt: new Date('2026-01-01T00:00:00Z') }, EARLY_BEFORE)).toBeNull();
    expect(launchEmailKind({ ...base, marketingOptOutAt: new Date(), subscriptionExpiresAt: new Date('2026-01-01T00:00:00Z') }, EARLY_BEFORE)).toBeNull();
    expect(launchEmailKind(base, EARLY_BEFORE)).toBeNull();
  });
});
