import { describe, expect, it } from 'vitest';
import { PASTE_MAX, splitPastedCaptions } from './pastedCaptions';
import { imageFileOk, imageSizeOk } from './imageCheck';
import { UPLOAD_LIMITS } from './uploadLimits';

describe('pasted captions', () => {
  it('splits on empty lines, trims, drops duplicates and tiny bits', () => {
    expect(splitPastedCaptions('First one\nstill first\n\n  Second  \n\n\nSecond\n\nok')).toEqual(['First one\nstill first', 'Second']);
  });
  it('caps the count and the pasted length', () => {
    const many = Array.from({ length: 200 }, (_, i) => `Caption number ${i}`).join('\n\n');
    expect(splitPastedCaptions(many)).toHaveLength(PASTE_MAX);
    const huge = `${'a'.repeat(UPLOAD_LIMITS.client.maxPastedChars + 5000)}`;
    expect(splitPastedCaptions(huge)[0]!.length).toBe(UPLOAD_LIMITS.client.maxPastedChars);
  });
});

describe('image checks', () => {
  it('accepts photos within limits only', () => {
    expect(imageFileOk({ type: 'image/jpeg', size: 1000 })).toBe(true);
    expect(imageFileOk({ type: 'image/svg+xml', size: 1000 })).toBe(false);
    expect(imageFileOk({ type: 'application/zip', size: 1000 })).toBe(false);
    expect(imageFileOk({ type: 'image/png', size: UPLOAD_LIMITS.client.maxImageBytes + 1 })).toBe(false);
    expect(imageFileOk({ type: 'image/png', size: 0 })).toBe(false);
  });
  it('refuses decoded sizes that are too big', () => {
    expect(imageSizeOk(4000, 3000)).toBe(true);
    expect(imageSizeOk(20000, 100)).toBe(false);
    expect(imageSizeOk(9000, 9000)).toBe(false);
  });
});
