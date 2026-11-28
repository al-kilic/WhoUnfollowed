import { describe, expect, it } from 'vitest';
import { displayNameSchema } from '@ig-tracker/core';
import { getTodayCardsContent, greetWithName } from './todayCards.content';

describe('greetWithName', () => {
  it('adds the name when set and stays neutral without it', () => {
    expect(greetWithName('Good morning', 'Alan')).toBe('Good morning, Alan');
    expect(greetWithName('Buenas tardes', '  Alan ')).toBe('Buenas tardes, Alan');
    expect(greetWithName('Boa noite', null)).toBe('Boa noite');
    expect(greetWithName('Good evening', '   ')).toBe('Good evening');
  });
});

describe('displayNameSchema', () => {
  it('trims, collapses spaces and allows clearing', () => {
    expect(displayNameSchema.parse({ name: '  Alan   Kilic ' }).name).toBe('Alan Kilic');
    expect(displayNameSchema.parse({ name: '' }).name).toBe('');
  });
  it('rejects names over 40 characters', () => {
    expect(displayNameSchema.safeParse({ name: 'a'.repeat(41) }).success).toBe(false);
    expect(displayNameSchema.safeParse({ name: 'a'.repeat(40) }).success).toBe(true);
  });
});

describe('Today cards copy', () => {
  const locales = ['en', 'es', 'pt'] as const;
  it('has the same keys in every language and no em dashes', () => {
    const shape = (o: object): string => JSON.stringify(Object.keys(o).sort());
    const en = getTodayCardsContent('en');
    for (const l of locales) {
      const c = getTodayCardsContent(l);
      expect(shape(c.since)).toBe(shape(en.since));
      expect(shape(c.goal)).toBe(shape(en.goal));
      expect(shape(c.goal.status)).toBe(shape(en.goal.status));
      const text = JSON.stringify(c) + c.since.more('3') + c.since.barLabel('1', '2') + c.goal.perWeek('4') + c.goal.projectedAt('May 1');
      expect(text).not.toContain('—');
    }
  });
});
