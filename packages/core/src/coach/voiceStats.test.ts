import { describe, expect, it } from 'vitest';
import { pickVoiceExemplars, scrubCaption, voiceStats } from './voiceStats.js';
import { countEmoji, countHashtags, hasCta, isQuestion } from './captionSignals.js';

describe('caption signals', () => {
  it('counts hashtags, emoji, questions and calls to action in three languages', () => {
    expect(countHashtags('Lisbon #film #35mm and #portra400')).toBe(3);
    expect(countHashtags('no tags, just a # sign and C#')).toBe(0);
    expect(countEmoji('morning ☕️📸')).toBe(2);
    expect(isQuestion('¿Cuál te quedas')).toBe(true);
    expect(hasCta('Save this for your next roll')).toBe(true);
    expect(hasCta('Comenta tu favorita')).toBe(true);
    expect(hasCta('Link na bio')).toBe(true);
    expect(hasCta('I commented on the light')).toBe(false);
  });
});

describe('voiceStats', () => {
  const caps = [
    'Shot on Portra 400. The light was soft all morning. #film #35mm #lisbon',
    'Alfama at 7 a.m.\nNobody around yet. #film',
    'my favourite frame from the roll ☕️ which one would you keep?',
    '',
    'A very long caption '.repeat(20),
  ];
  const v = voiceStats(caps);

  it('counts only captions with text', () => {
    expect(v.captions).toBe(4);
  });
  it('reads length, hashtags, questions and style as numbers and shares', () => {
    expect(v.hashtagShare).toBe(0.5);
    expect(v.hashtagMedian).toBe(0.5);
    expect(v.questionShare).toBe(0.25);
    expect(v.lineBreakShare).toBe(0.25);
    expect(v.longShare).toBe(0.25);
    expect(v.emojiShare).toBe(0.25);
    expect(v.lowercaseStartShare).toBe(0.25);
    expect(v.firstPersonShare).toBe(0.25);
    expect(typeof v.medianChars).toBe('number');
  });
  it('is all zeros and nulls for no captions', () => {
    const e = voiceStats([]);
    expect(e.captions).toBe(0);
    expect(e.medianChars).toBeNull();
    expect(e.questionShare).toBe(0);
  });
  it('holds numbers only, never caption text', () => {
    for (const val of Object.values(v)) expect(typeof val === 'number' || val === null).toBe(true);
  });
});

describe('scrubCaption', () => {
  it('removes handles, links, emails and phone numbers but keeps dates and film speeds', () => {
    const s = scrubCaption('With @ana.frames and @joao_lx, see https://x.co/a or mail me@site.pt or call +351 912 345 678. Portra 400, 2026-11-20.');
    expect(s).not.toMatch(/ana\.frames|joao_lx|x\.co|me@site|912/);
    expect(s).toContain('@[account]');
    expect(s).toContain('[link]');
    expect(s).toContain('[email]');
    expect(s).toContain('[phone]');
    expect(s).toContain('Portra 400');
    expect(s).toContain('2026-11-20');
  });
});

describe('pickVoiceExemplars', () => {
  const day = 86_400;
  const items = Array.from({ length: 30 }, (_, i) => ({
    caption: i % 3 === 0 ? `Short one number ${i} on the tram #film` : i % 3 === 1 ? `A medium caption about roll ${i}, the light in Alfama and why I waited for it. Shot on Portra.` : `${'A long story about the darkroom and the roll that went wrong. '.repeat(4)}Roll ${i}.`,
    date: 1_700_000_000 + i * day,
  }));

  it('returns at most 12, newest first, mixing lengths, without hashtags', () => {
    const ex = pickVoiceExemplars(items);
    expect(ex).toHaveLength(12);
    expect(ex[0]).toContain('29');
    expect(ex.some((e) => e.length < 80)).toBe(true);
    expect(ex.some((e) => e.length >= 200)).toBe(true);
    expect(ex.join(' ')).not.toContain('#film');
  });
  it('clips long captions to the limit and drops near-duplicates and empty ones', () => {
    const ex = pickVoiceExemplars([
      { caption: 'word '.repeat(200), date: 3 },
      { caption: 'Same caption here, on the tram again.', date: 2 },
      { caption: 'Same caption here, on the tram again!', date: 1 },
      { caption: '@someone 😍', date: 4 },
    ], { maxChars: 100 });
    expect(ex).toHaveLength(2);
    expect(ex[0]!.length).toBeLessThanOrEqual(100);
    expect(ex[0]!.endsWith('…')).toBe(true);
  });
  it('never returns a handle', () => {
    const ex = pickVoiceExemplars([{ caption: 'Morning walk with @lena.frames through Graça, film again.', date: 1 }]);
    expect(ex[0]).toContain('@[account]');
    expect(ex[0]).not.toContain('lena.frames');
  });
});
