import { describe, expect, it } from 'vitest';
import { studioTier } from './tier';

const base = { userId: null, isPro: false, hasProAi: false, isLegacyPro: false };

describe('studioTier', () => {
  it('separates visitors without an account from free accounts', () => {
    expect(studioTier(base, false)).toEqual({ tier: 'anon', hasProAi: false });
    expect(studioTier({ ...base, userId: 'u' }, false)).toEqual({ tier: 'free', hasProAi: false });
  });
  it('treats an active subscription as Pro AI', () => {
    expect(studioTier({ ...base, userId: 'u', isPro: true, hasProAi: true }, false)).toEqual({ tier: 'proAi', hasProAi: true });
  });
  it('keeps old Pro buyers on the coach but labels them Pro, so they get the upgrade offer', () => {
    expect(studioTier({ ...base, userId: 'u', isPro: true, hasProAi: true, isLegacyPro: true }, true)).toEqual({ tier: 'pro', hasProAi: true });
    // Lapsed old Pro with the coach trial left: coach on, Pro features locked.
    expect(studioTier({ ...base, userId: 'u', isPro: false, hasProAi: true, isLegacyPro: true }, true)).toEqual({ tier: 'free', hasProAi: true });
  });
  it('trusts a loaded coach state right after checkout, before the auth state catches up', () => {
    expect(studioTier({ ...base, userId: 'u' }, true)).toEqual({ tier: 'proAi', hasProAi: true });
  });
});
