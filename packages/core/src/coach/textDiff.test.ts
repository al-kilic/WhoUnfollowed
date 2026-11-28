import { describe, expect, it } from 'vitest';
import { textDiff } from './textDiff.js';

describe('textDiff', () => {
  it('finds removed and added word runs in order', () => {
    const d = textDiff('Three photos I almost deleted today. Swipe slowly.', 'Three photos I almost kept. Which one?');
    expect(d.removed).toEqual(['deleted today. Swipe slowly.']);
    expect(d.added).toEqual(['kept. Which one?']);
    expect(d.wordsBefore).toBe(8);
    expect(d.wordsAfter).toBe(7);
  });

  it('counts hashtags, emoji and line breaks that changed', () => {
    const d = textDiff('Lisbon light ✨ #film #analog #portra', 'Lisbon light\nOn film.');
    expect(d.hashtagDelta).toBe(-3);
    expect(d.emojiDelta).toBe(-1);
    expect(d.lineBreakDelta).toBe(1);
    expect(d.lengthDelta).toBeLessThan(0);
  });

  it('notices a switch to all lowercase', () => {
    expect(textDiff('Golden Hour In Alfama', 'golden hour in alfama').caseChange).toBe('lower');
    expect(textDiff('same text', 'same text').caseChange).toBe('none');
  });

  it('keeps at most 3 short phrases each way', () => {
    const d = textDiff('a b c d e f g h i j', 'a X c Y e Z g W i V');
    expect(d.removed.length).toBeLessThanOrEqual(3);
    expect(d.added.length).toBeLessThanOrEqual(3);
    const long = textDiff('keep', `keep ${'word '.repeat(40)}`);
    expect(long.added[0]!.length).toBeLessThanOrEqual(60);
  });

  it('handles empty text and stays bounded on long input', () => {
    expect(textDiff('', '').removed).toEqual([]);
    const big = 'w '.repeat(2000);
    expect(textDiff(big, big + 'x').wordsAfter).toBe(400);
  });
});
