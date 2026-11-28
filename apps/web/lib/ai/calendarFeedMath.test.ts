import { describe, expect, it } from 'vitest';
import { CALENDAR_TOKEN_RE, feedEvents, feedIcs, newCalendarToken, subscribeLinks, type FeedLabels } from './calendarFeedMath';

const labels: FeedLabels = { name: 'Plan, test', formats: { reel: 'reel', carousel: 'carousel' }, postA: (f) => `Post a ${f}`, open: 'Open:' };
// A plan made on Wed 2026-11-18 starts on Mon 2026-11-23 (planStart).
const base = { planId: 'p1', createdAt: new Date('2026-11-18T10:00:00Z'), bestTime: '09:30', url: 'https://whounfollowed.co/app/plan', labels };

describe('feedEvents', () => {
  const calendar = [
    { day: 0, format: 'reel' as const, idea: 'Old one', hook: '', posted: false },
    { day: 10, format: 'carousel' as const, idea: 'Posted already', hook: '', posted: true },
    { day: 12, format: 'carousel' as const, idea: 'Night walk, part two; with commas', hook: 'Look up', posted: false },
  ];

  it('keeps upcoming unposted posts and the last week, drops posted ones', () => {
    const ev = feedEvents({ ...base, calendar, now: new Date('2026-12-03T12:00:00Z') });
    expect(ev.map((e) => e.uid)).toEqual(['p1-12@whounfollowed.co']);
    const early = feedEvents({ ...base, calendar, now: new Date('2026-11-25T12:00:00Z') });
    expect(early.map((e) => e.uid)).toEqual(['p1-0@whounfollowed.co', 'p1-12@whounfollowed.co']);
  });

  it('uses floating time at the member posting time on the plan day', () => {
    const [e] = feedEvents({ ...base, calendar: [calendar[2]!], now: new Date('2026-11-25T12:00:00Z') });
    expect(e!.floating).toBe(true);
    expect(e!.start.toISOString()).toBe('2026-12-05T09:30:00.000Z');
    expect(e!.title).toBe('Post a carousel · Night walk, part two; with commas');
  });

  it('defaults to 18:00 when no posting time is set', () => {
    const [e] = feedEvents({ ...base, bestTime: null, calendar: [calendar[2]!], now: new Date('2026-11-25T12:00:00Z') });
    expect(e!.start.toISOString().slice(11, 16)).toBe('18:00');
  });
});

describe('feedIcs', () => {
  it('writes a subscribable calendar with floating, escaped events', () => {
    const now = new Date('2026-11-25T12:00:00Z');
    const raw = feedIcs(feedEvents({ ...base, calendar: [{ day: 12, format: 'carousel', idea: 'A, b; c', hook: '', posted: false }], now }), labels, now);
    // Long lines are folded (CRLF + space) per RFC 5545; unfold to read them.
    const ics = raw.replace(/\r\n /g, '');
    expect(raw.split('\r\n').every((l) => new TextEncoder().encode(l).length <= 75)).toBe(true);
    expect(ics).toContain('X-WR-CALNAME:Plan\\, test');
    expect(ics).toContain('REFRESH-INTERVAL;VALUE=DURATION:PT6H');
    expect(ics).toContain('DTSTART:20261205T093000\r\n');
    expect(ics).not.toMatch(/DTSTART:\d{8}T\d{6}Z/);
    expect(ics).toContain('SUMMARY:Post a carousel · A\\, b\\; c');
    expect(raw.endsWith('END:VCALENDAR\r\n')).toBe(true);
  });

  it('is a valid empty calendar when there is no plan', () => {
    const ics = feedIcs([], labels, new Date());
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).not.toContain('BEGIN:VEVENT');
  });
});

describe('tokens and links', () => {
  it('makes 64-hex tokens that differ each time', () => {
    const a = newCalendarToken(); const b = newCalendarToken();
    expect(a).toMatch(CALENDAR_TOKEN_RE);
    expect(a).not.toBe(b);
    expect(CALENDAR_TOKEN_RE.test('../etc')).toBe(false);
  });

  it('builds subscribe links for the common apps', () => {
    const l = subscribeLinks('https://whounfollowed.co/api/calendar/abc.ics', 'My plan');
    expect(l.webcal).toBe('webcal://whounfollowed.co/api/calendar/abc.ics');
    expect(l.google).toBe(`https://calendar.google.com/calendar/r?cid=${encodeURIComponent('webcal://whounfollowed.co/api/calendar/abc.ics')}`);
    expect(l.outlook).toContain('addfromweb?url=https%3A%2F%2Fwhounfollowed.co');
    expect(l.outlook).toContain('name=My%20plan');
  });
});
