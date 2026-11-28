import { describe, expect, it } from 'vitest';
import { limitOverall, precheck, precheckLines } from './precheck';

const base = { format: 'carousel', hook: 'Why film looks cold in winter', caption: 'Three fixes I use. Which one would you try?\n#filmphotography #portra400' };
const by = (items: ReturnType<typeof precheck>, id: string) => items.find((x) => x.id === id);

describe('precheck', () => {
  it('passes a clean draft on platform rules', () => {
    const r = precheck(base);
    expect(r.filter((x) => x.source === 'platform').every((x) => x.state === 'pass')).toBe(true);
  });

  it('flags a missing hook, a long hook, too many hashtags and no question', () => {
    expect(by(precheck({ ...base, hook: '' }), 'hook_length')?.state).toBe('fail');
    expect(by(precheck({ ...base, hook: 'x'.repeat(140) }), 'hook_length')?.state).toBe('warn');
    const tags = Array.from({ length: 12 }, (_, i) => `#t${i}`).join(' ');
    expect(by(precheck({ ...base, caption: `Nice. ${tags}` }), 'hashtags')?.state).toBe('warn');
    expect(by(precheck({ ...base, caption: Array.from({ length: 31 }, (_, i) => `#t${i}`).join(' ') }), 'hashtags')?.state).toBe('fail');
    expect(by(precheck({ ...base, hook: 'Film in winter', caption: 'Shot on Portra.' }), 'question_cta')?.state).toBe('warn');
    expect(by(precheck({ ...base, caption: 'x'.repeat(2300) }), 'caption_limit')?.state).toBe('fail');
  });

  it('checks the posting day only when days are set (0 = Monday)', () => {
    expect(by(precheck(base), 'posting_day')).toBeUndefined();
    const tue = new Date('2026-11-24T10:00:00');
    expect(by(precheck({ ...base, postingDays: [1, 3, 5], now: tue }), 'posting_day')?.state).toBe('pass');
    const wed = new Date('2026-11-25T10:00:00');
    expect(by(precheck({ ...base, postingDays: [1, 3, 5], now: wed }), 'posting_day')).toMatchObject({ state: 'warn', params: { next: 3 } });
  });

  it('compares the format with what worked in logged posts', () => {
    const results = [{ format: 'carousel', newFollowers: 34 }, { format: 'reel', newFollowers: 8 }, { format: 'carousel', newFollowers: 20 }];
    expect(by(precheck({ ...base, results }), 'format_results')?.state).toBe('pass');
    expect(by(precheck({ ...base, format: 'reel', results }), 'format_results')).toMatchObject({ state: 'warn', params: { best: 'carousel' } });
    expect(by(precheck({ ...base, results: results.slice(0, 1) }), 'format_results')).toBeUndefined();
  });

  it('caps the model score when a rule failed', () => {
    const fail = precheck({ ...base, hook: '' });
    expect(limitOverall(92, fail)).toBe(69);
    expect(limitOverall(92, precheck(base))).toBe(92);
    expect(precheckLines(fail)).toContain('hook_length: FAIL');
  });
});
