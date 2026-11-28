import { describe, expect, it } from 'vitest';
import { buildIcs, escapeText, foldLine, googleCalendarLink, planDayAt, utcStamp, type CalEvent } from './planIcs';

const ev = (o: Partial<CalEvent> = {}): CalEvent => ({
  uid: 'plan-1-3@whounfollowed.co', title: 'Post: carousel', description: 'Blue hour', url: 'https://whounfollowed.co/app/plan',
  start: new Date('2026-11-26T17:00:00Z'), ...o,
});

describe('planIcs', () => {
  it('escapes text per RFC 5545', () => {
    expect(escapeText('a,b;c\\d\ne')).toBe('a\\,b\\;c\\\\d\\ne');
  });

  it('folds long lines at 75 octets without splitting characters', () => {
    const long = `SUMMARY:${'é'.repeat(60)}`; // 2 bytes each
    const folded = foldLine(long).split('\r\n');
    expect(folded.length).toBeGreaterThan(1);
    for (const l of folded) expect(new TextEncoder().encode(l).length).toBeLessThanOrEqual(75);
    expect(folded.slice(1).every((l) => l.startsWith(' '))).toBe(true);
    expect(folded.map((l, i) => (i ? l.slice(1) : l)).join('')).toBe(long);
    expect(foldLine('SHORT')).toBe('SHORT');
  });

  it('builds a CRLF calendar with UID, DTSTAMP and timed events', () => {
    const ics = buildIcs([ev()], new Date('2026-11-22T10:00:00Z'));
    expect(ics.endsWith('\r\n')).toBe(true);
    expect(ics.split('\r\n').filter((l) => l && !l.startsWith(' ')).every((l) => /^[A-Z-]+[:;]/.test(l))).toBe(true);
    expect(ics).toContain('UID:plan-1-3@whounfollowed.co');
    expect(ics).toContain('DTSTAMP:20261122T100000Z');
    expect(ics).toContain('DTSTART:20261126T170000Z');
    expect(ics).toContain('DTEND:20261126T173000Z');
    expect(ics).toContain('TRIGGER:-PT15M');
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(1);
  });

  it('writes all-day events as dates with no alarm', () => {
    const ics = buildIcs([ev({ allDay: true, start: new Date(2026, 10, 26, 12) })]);
    expect(ics).toContain('DTSTART;VALUE=DATE:20261126');
    expect(ics).toContain('DTEND;VALUE=DATE:20261127');
    expect(ics).not.toContain('VALARM');
  });

  it('puts each plan day at the chosen local time', () => {
    const start = new Date('2026-11-23T00:00:00Z');
    const at = planDayAt(start, 3, '09:30');
    expect([at.getFullYear(), at.getMonth(), at.getDate(), at.getHours(), at.getMinutes()]).toEqual([2026, 10, 26, 9, 30]);
    expect(planDayAt(start, 0, null).getHours()).toBe(18);
  });

  it('makes a Google Calendar link with the right fields', () => {
    const u = new URL(googleCalendarLink(ev()));
    expect(u.hostname).toBe('calendar.google.com');
    expect(u.searchParams.get('text')).toBe('Post: carousel');
    expect(u.searchParams.get('dates')).toBe(`${utcStamp(new Date('2026-11-26T17:00:00Z'))}/20261126T173000Z`);
    expect(u.searchParams.get('details')).toContain('/app/plan');
  });
});
