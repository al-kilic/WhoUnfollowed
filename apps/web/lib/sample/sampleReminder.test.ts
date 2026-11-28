import { describe, expect, it } from 'vitest';
import { buildIcs, googleCalendarLink } from '@/lib/planIcs';

// The sample ending's "check your email in 24h" reminder uses the plan helpers.
describe('export reminder', () => {
  const now = new Date('2026-11-22T10:00:00Z');
  const e = { uid: 'export-reminder-1@whounfollowed.co', title: 'Check your email for your Instagram export', description: 'Drop the ZIP on WhoUnfollowed.', url: 'https://whounfollowed.co/#upload', start: new Date(now.getTime() + 24 * 3_600_000), minutes: 15 };

  it('is a valid one-event calendar file 24 hours out', () => {
    const ics = buildIcs([e], now);
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(1);
    expect(ics).toContain('DTSTART:20261123T100000Z');
    expect(ics).toContain('DTEND:20261123T101500Z');
    expect(ics).toContain('SUMMARY:Check your email for your Instagram export');
  });

  it('builds a Google Calendar link with the same time', () => {
    const u = new URL(googleCalendarLink(e));
    expect(u.searchParams.get('dates')).toBe('20261123T100000Z/20261123T101500Z');
    expect(u.searchParams.get('text')).toBe(e.title);
  });
});
