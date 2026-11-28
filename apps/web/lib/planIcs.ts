// Studio > Plan > Add to calendar: the plan's posts as calendar events, built
// in the browser (a .ics file or a Google Calendar link). Nothing is sent to
// our server. Pure, so the file format is unit tested.

export interface CalEvent {
  uid: string;
  title: string;
  description: string;
  url: string;
  // Timed events start at `start` (an instant) and last `minutes`; all-day
  // events use the local calendar date of `start`.
  start: Date;
  minutes?: number;
  allDay?: boolean;
  // Floating time (RFC 5545 form 1): no time zone, so the calendar shows it
  // at the same wall-clock time wherever the member is. `start`'s UTC fields
  // are read as that wall-clock time. Used by the server feed, which does
  // not know the member's time zone.
  floating?: boolean;
}

export interface IcsOptions {
  // X-WR-CALNAME, the name calendar apps show for a subscribed feed.
  name?: string;
  // How often subscribed calendars should refetch (ISO 8601 duration, e.g. PT6H).
  refresh?: string;
}

const DAY_MS = 86_400_000;
const pad = (n: number) => String(n).padStart(2, '0');

// 20261126T170000Z
export function utcStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

// 20261126T180000, a floating time from the date's UTC fields.
export function floatingStamp(d: Date): string {
  return utcStamp(d).replace(/Z$/, '');
}

// 20261126, from the local date.
export function localDate(d: Date): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

// RFC 5545 text escaping: backslash, semicolon, comma, newline.
export function escapeText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

// Lines longer than 75 octets are folded: CRLF plus one space. Never splits a
// UTF-8 character.
export function foldLine(line: string): string {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = '';
  let bytes = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // continuation lines start with a space
    if (bytes + n > limit) { out.push(cur); cur = ''; bytes = 0; }
    cur += ch;
    bytes += n;
  }
  out.push(cur);
  return out.join('\r\n ');
}

// The local start time of a plan day: plan days are UTC calendar dates; the
// post goes out at `time` ("HH:MM", default 18:00) on that date, local time.
export function planDayAt(start: Date, day: number, time: string | null): Date {
  const d = new Date(start.getTime() + day * DAY_MS);
  const [h, m] = (time ?? '18:00').split(':').map(Number);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), h ?? 18, m ?? 0);
}

export function buildIcs(events: CalEvent[], now: Date = new Date(), opts: IcsOptions = {}): string {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//WhoUnfollowed//Posting plan//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  if (opts.name) lines.push(`X-WR-CALNAME:${escapeText(opts.name)}`);
  if (opts.refresh) lines.push(`REFRESH-INTERVAL;VALUE=DURATION:${opts.refresh}`, `X-PUBLISHED-TTL:${opts.refresh}`);
  for (const e of events) {
    lines.push('BEGIN:VEVENT', `UID:${e.uid}`, `DTSTAMP:${utcStamp(now)}`);
    if (e.allDay) {
      const next = new Date(e.start.getFullYear(), e.start.getMonth(), e.start.getDate() + 1);
      lines.push(`DTSTART;VALUE=DATE:${localDate(e.start)}`, `DTEND;VALUE=DATE:${localDate(next)}`);
    } else {
      const stamp = e.floating ? floatingStamp : utcStamp;
      lines.push(`DTSTART:${stamp(e.start)}`, `DTEND:${stamp(new Date(e.start.getTime() + (e.minutes ?? 30) * 60_000))}`);
    }
    lines.push(`SUMMARY:${escapeText(e.title)}`, `DESCRIPTION:${escapeText(`${e.description}\n${e.url}`)}`, `URL:${e.url}`);
    if (!e.allDay) lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${escapeText(e.title)}`, 'TRIGGER:-PT15M', 'END:VALARM');
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return `${lines.map(foldLine).join('\r\n')}\r\n`;
}

export function googleCalendarLink(e: CalEvent): string {
  const dates = e.allDay
    ? `${localDate(e.start)}/${localDate(new Date(e.start.getFullYear(), e.start.getMonth(), e.start.getDate() + 1))}`
    : `${utcStamp(e.start)}/${utcStamp(new Date(e.start.getTime() + (e.minutes ?? 30) * 60_000))}`;
  const q = new URLSearchParams({ action: 'TEMPLATE', text: e.title, dates, details: `${e.description}\n${e.url}` });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}
