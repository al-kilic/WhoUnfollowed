import { describe, expect, it } from 'vitest';
import type { ParsedSnapshot } from '@ig-tracker/core';
import { isSameExport } from './sameExport';

const acc = (username: string) => ({ username, href: '', followedAt: null });
const snap = (over: Partial<ParsedSnapshot> = {}): ParsedSnapshot => ({
  exportedAt: 1_700_000_000,
  followers: [acc('a'), acc('b')],
  following: [acc('a')],
  ...over,
} as ParsedSnapshot);

describe('isSameExport', () => {
  it('matches the same export uploaded twice', () => {
    expect(isSameExport(snap(), snap())).toBe(true);
  });
  it('matches a renamed file uploaded again (no date in the name, so a new "now")', () => {
    expect(isSameExport(snap(), snap({ exportedAt: 1_700_000_600 }))).toBe(true);
  });
  it('treats different lists at a nearby time as a new export', () => {
    expect(isSameExport(snap(), snap({ exportedAt: 1_700_000_600, following: [acc('z')] }))).toBe(false);
  });
  it('treats an export a day or more later as a new export, even with the same lists', () => {
    expect(isSameExport(snap(), snap({ exportedAt: 1_700_000_000 + 86_400 }))).toBe(false);
  });
  it('treats different list sizes as a new export', () => {
    expect(isSameExport(snap(), snap({ followers: [acc('a')] }))).toBe(false);
    expect(isSameExport(snap(), snap({ following: [] }))).toBe(false);
  });
});
