import { describe, expect, it } from 'vitest';
import { addMonths, nextWrapAfterSend, nextWrapAt, reminderAfterWrap } from './schedule';

const d = (s: string) => new Date(`${s}T09:00:00Z`);

describe('wrap schedule', () => {
  it('counts quarters from the opt-in date, not the calendar', () => {
    expect(nextWrapAt(d('2026-08-10'), d('2026-08-11'))).toEqual(d('2026-11-10'));
    expect(nextWrapAt(d('2026-08-10'), d('2026-11-10'))).toEqual(d('2027-02-10'));
    expect(nextWrapAt(d('2025-01-20'), d('2026-11-06'))).toEqual(d('2027-01-20'));
  });

  it('clamps to the end of short months', () => {
    expect(addMonths(d('2026-11-30'), 3)).toEqual(d('2027-02-28'));
  });

  it('keeps going while people click, stops after two ignored wraps', () => {
    const base = { anchor: d('2026-01-05'), now: d('2026-07-05') };
    expect(nextWrapAfterSend({ ...base, sentCount: 1, engagedAt: null, previousSentAt: null })).toEqual(d('2026-10-05'));
    expect(nextWrapAfterSend({ ...base, sentCount: 2, engagedAt: null, previousSentAt: d('2026-04-05') })).toBeNull();
    expect(nextWrapAfterSend({ ...base, sentCount: 2, engagedAt: d('2026-04-07'), previousSentAt: d('2026-04-05') })).toEqual(d('2026-10-05'));
    expect(nextWrapAfterSend({ ...base, sentCount: 3, engagedAt: d('2026-03-01'), previousSentAt: d('2026-04-05') })).toBeNull();
  });

  it('pushes a reminder that would land within two weeks of a wrap', () => {
    const now = d('2026-11-10');
    expect(reminderAfterWrap(d('2026-11-12'), now)).toEqual(d('2026-11-24'));
    expect(reminderAfterWrap(d('2026-12-20'), now)).toEqual(d('2026-12-20'));
    expect(reminderAfterWrap(null, now)).toBeNull();
  });
});
