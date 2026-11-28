import { describe, expect, it } from 'vitest';
import { nextPlanDay, planStart, weekdayIndex } from './planDays';

describe('weekdayIndex', () => {
  it('reads codes and day names in English, Spanish and Portuguese', () => {
    expect(weekdayIndex('Mon')).toBe(0);
    expect(weekdayIndex('tue')).toBe(1);
    expect(weekdayIndex('Miércoles')).toBe(2);
    expect(weekdayIndex('quinta-feira')).toBe(3);
    expect(weekdayIndex('Sáb.')).toBe(5);
    expect(weekdayIndex('Domingo')).toBe(6);
  });
  it('returns null for anything else', () => {
    expect(weekdayIndex('Day 3')).toBeNull();
  });
});

describe('planStart', () => {
  it('starts on the same day when it is a Monday, otherwise the next Monday', () => {
    expect(planStart(new Date('2026-11-16T15:00:00Z')).toISOString().slice(0, 10)).toBe('2026-11-16');
    expect(planStart(new Date('2026-11-18T09:00:00Z')).toISOString().slice(0, 10)).toBe('2026-11-23');
    expect(planStart(new Date('2026-11-22T09:00:00Z')).toISOString().slice(0, 10)).toBe('2026-11-23');
  });
});

describe('nextPlanDay', () => {
  const start = new Date('2026-11-23T00:00:00Z'); // a Monday
  it('picks the next free posting day from today on', () => {
    // Wed Nov 25; posting days Tue, Thu, Sat -> Thu = day 3.
    expect(nextPlanDay(start, [], [1, 3, 5], new Date('2026-11-25T09:00:00Z'))).toBe(3);
    expect(nextPlanDay(start, [3], [1, 3, 5], new Date('2026-11-25T09:00:00Z'))).toBe(5);
  });
  it('falls back to the next free day without posting days, and null when full', () => {
    expect(nextPlanDay(start, [0, 1], [], new Date('2026-11-23T09:00:00Z'))).toBe(2);
    expect(nextPlanDay(start, Array.from({ length: 35 }, (_, i) => i), [], new Date('2026-11-23T09:00:00Z'))).toBeNull();
  });
  it('prefers a free day this week over a posting day weeks away', () => {
    // Tue/Thu/Sat taken for four weeks; Wed Nov 25 -> Wed itself (day 2).
    const taken = [0, 1, 2, 3, 4].flatMap((w) => [1, 3, 5].map((d) => w * 7 + d));
    expect(nextPlanDay(start, taken, [1, 3, 5], new Date('2026-11-25T09:00:00Z'))).toBe(2);
  });
  it('never places before the plan starts', () => {
    expect(nextPlanDay(start, [], [], new Date('2026-11-20T09:00:00Z'))).toBe(0);
  });
});
