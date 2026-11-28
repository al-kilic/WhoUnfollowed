import { describe, expect, it } from 'vitest';
import { planPhotoId, postPhotoKey } from './usePostPhotos';

describe('postPhotoKey', () => {
  it('ties photos to the post, not the day, so they follow a moved post', () => {
    expect(postPhotoKey('u1', 'plan1', 'Five frames')).toBe('u1:plan1:Five frames');
  });
  it('keeps keys short for long ideas', () => {
    expect(planPhotoId([], { day: 0, idea: 'x'.repeat(500) }).length).toBe(120);
  });
  it('gives each repeat of the same idea its own photos', () => {
    const items = [{ day: 1, idea: 'A' }, { day: 3, idea: 'B' }, { day: 8, idea: 'A' }, { day: 15, idea: 'A' }];
    expect(items.map((it) => planPhotoId(items, it))).toEqual(['A', 'B', 'A#1', 'A#2']);
  });
});
