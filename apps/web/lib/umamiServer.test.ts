import { describe, expect, it } from 'vitest';
import { isProductionSite } from './umamiServer';

describe('isProductionSite', () => {
  it('counts only the live site', () => {
    expect(isProductionSite({ NODE_ENV: 'production' })).toBe(true);
    expect(isProductionSite({ NODE_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'https://whounfollowed.co' })).toBe(true);
    expect(isProductionSite({ NODE_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'https://staging.whounfollowed.co' })).toBe(false);
    expect(isProductionSite({ NODE_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'http://localhost:3030' })).toBe(false);
    expect(isProductionSite({ NODE_ENV: 'development' })).toBe(false);
  });
});
