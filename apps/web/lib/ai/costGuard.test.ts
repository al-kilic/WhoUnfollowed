import { describe, expect, it } from 'vitest';
import { worstCaseUsd, IMAGE_TOKENS, SAFETY } from './costGuard';
import { holdParts, releaseParts, checkAllowance, PACE_USD, type Grant } from './allowanceMath';

const sonnet = { in: 2, out: 10, cacheRead: 0.1, cacheWrite: 2.5 };
const haiku = { in: 0.1, out: 0.5, cacheRead: 0.01, cacheWrite: 0.125 };

describe('worstCaseUsd', () => {
  it('refuses a model with no known price', () => {
    expect(worstCaseUsd(undefined, { texts: ['x'], images: 0, maxTokens: 10 })).toBeNull();
  });
  it('prices every byte as an input token at the dearest input rate, plus all of max_tokens', () => {
    const w = worstCaseUsd(sonnet, { texts: ['a'.repeat(1000)], images: 1, maxTokens: 16000 })!;
    expect(w).toBeCloseTo((((1000 + IMAGE_TOKENS + 200) * 2.5 + 16000 * 10) / 1e6) * SAFETY, 10);
  });
  it('counts multi-byte text by bytes, never by characters', () => {
    const ascii = worstCaseUsd(haiku, { texts: ['aaaa'], images: 0, maxTokens: 0 })!;
    const emoji = worstCaseUsd(haiku, { texts: ['😀😀😀😀'], images: 0, maxTokens: 0 })!;
    expect(emoji).toBeGreaterThan(ascii);
  });
  it('keeps the dearest action (a Sonnet plan with a big context) well under one allowance', () => {
    const w = worstCaseUsd(sonnet, { texts: ['x'.repeat(60_000)], images: 0, maxTokens: 16000 })!;
    expect(w).toBeLessThan(0.5);
  });
});

const month = (used: number): Grant => ({ id: 'm', kind: 'month', usd: 2.5, usedUsd: used, expiresAt: new Date('2027-01-01T00:00:00Z'), createdAt: new Date('2026-12-01T00:00:00Z') });
const now = new Date('2026-12-10T00:00:00Z');
const opts = { refillsUsable: true };

describe('holds: a member can never pass the allowance', () => {
  it('refuses a call whose worst case does not fit in what is left', () => {
    expect(holdParts([month(2.4)], 0.2, now, opts)).toBeNull();
    expect(holdParts([month(2.3)], 0.2, now, opts)).toEqual([{ id: 'm', add: expect.closeTo(0.2, 10) }]);
  });
  it('checks the worst case against both the allowance and the day pace', () => {
    expect(checkAllowance(0.1, 0, 0.2)).toBe('empty');
    expect(checkAllowance(2.5, PACE_USD - 0.05, 0.1)).toBe('pace');
    expect(checkAllowance(2.5, 0, 0.1)).toBe('ok');
  });
  it('gives back only what was held, last grant first', () => {
    expect(releaseParts([{ id: 'a', add: 0.1 }, { id: 'b', add: 0.05 }], 0.12)).toEqual([{ id: 'b', sub: 0.05 }, { id: 'a', sub: expect.closeTo(0.07, 10) }]);
    expect(releaseParts([{ id: 'a', add: 0.1 }], 5)).toEqual([{ id: 'a', sub: 0.1 }]);
  });
});
