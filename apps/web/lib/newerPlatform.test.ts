import { describe, expect, it } from 'vitest';
import { newerPlatform } from './newerPlatform';

describe('newerPlatform', () => {
  it('finds the newest other platform', () => {
    const m = new Map([['instagram', 100], ['threads', 300], ['tiktok', 200]] as const);
    expect(newerPlatform(m, 'instagram', 100)).toBe('threads');
  });
  it('is null when the one on screen is newest or alone', () => {
    expect(newerPlatform(new Map([['instagram', 500], ['threads', 300]] as const), 'instagram', 500)).toBeNull();
    expect(newerPlatform(new Map([['instagram', 500]] as const), 'instagram', 500)).toBeNull();
  });
});
