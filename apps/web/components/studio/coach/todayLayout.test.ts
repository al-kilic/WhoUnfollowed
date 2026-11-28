import { describe, expect, it } from 'vitest';
import { addWidget, DEFAULT_LAYOUT, dropWidget, moveWidget, parseLayout, removeWidget, resize, type Layout } from './todayLayout';

describe('today layout', () => {
  it('falls back to the default for nothing or junk', () => {
    expect(parseLayout(null)).toBe(DEFAULT_LAYOUT);
    expect(parseLayout('{nope')).toBe(DEFAULT_LAYOUT);
    expect(parseLayout('"x"')).toBe(DEFAULT_LAYOUT);
  });
  it('drops unknown, repeated and badly sized entries', () => {
    expect(parseLayout(JSON.stringify([['goal', 3], ['goal', 1], ['hack', 2], ['ask', 9]]))).toEqual([['goal', 3], ['ask', 1]]);
  });
  it('moves, resizes, removes and adds', () => {
    const l: Layout = [['create', 1], ['week', 1], ['goal', 1]];
    expect(moveWidget(l, 'goal', -1).map(([w]) => w)).toEqual(['create', 'goal', 'week']);
    expect(moveWidget(l, 'create', -1)).toBe(l);
    expect(resize(l, 'week', 3)[1]).toEqual(['week', 3]);
    expect(removeWidget(l, 'week').map(([w]) => w)).toEqual(['create', 'goal']);
    expect(addWidget(l, 'brief').at(-1)).toEqual(['brief', 1]);
    expect(addWidget(l, 'goal')).toBe(l);
  });
  it('drops a dragged widget onto another one', () => {
    const l: Layout = [['create', 1], ['week', 1], ['goal', 1]];
    expect(dropWidget(l, 'goal', 'create').map(([w]) => w)).toEqual(['goal', 'create', 'week']);
    expect(dropWidget(l, 'create', 'goal').map(([w]) => w)).toEqual(['week', 'goal', 'create']);
  });
});
