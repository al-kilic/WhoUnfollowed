import type { AiPlanCalendarItem } from '@ig-tracker/core';
import { buildIcs, type CalEvent } from '@/lib/planIcs';
import { planStart } from './planDays';

// The plan calendar feed (Studio > Plan > Add to my calendar), pure so the
// calendar file is unit tested. Events use floating time: the member's usual
// posting time (You > Settings) shows at that wall-clock time in whatever
// time zone their calendar is in. The server never needs their time zone.

const DAY_MS = 86_400_000;
// Posts from the last week stay visible; older days and posted posts drop off.
const KEEP_PAST_DAYS = 7;

export interface FeedLabels {
  name: string;
  formats: Record<string, string>;
  postA: (format: string) => string;
  open: string;
}

export function feedEvents(opts: {
  planId: string; createdAt: Date; calendar: AiPlanCalendarItem[]; bestTime: string | null; url: string; labels: FeedLabels; now: Date;
}): CalEvent[] {
  const start = planStart(opts.createdAt);
  const [h, m] = (opts.bestTime ?? '18:00').split(':').map(Number);
  const today = Math.floor((Date.UTC(opts.now.getUTCFullYear(), opts.now.getUTCMonth(), opts.now.getUTCDate()) - start.getTime()) / DAY_MS);
  return opts.calendar
    .filter((it) => !it.posted && it.day >= today - KEEP_PAST_DAYS)
    .map((it) => {
      const d = new Date(start.getTime() + it.day * DAY_MS);
      const format = opts.labels.formats[it.format] ?? it.format;
      const idea = it.idea.length > 60 ? `${it.idea.slice(0, 59).trimEnd()}…` : it.idea;
      return {
        uid: `${opts.planId}-${it.day}@whounfollowed.co`,
        title: `${opts.labels.postA(format)} · ${idea}`,
        description: [it.idea, it.hook && `"${it.hook}"`, opts.labels.open].filter(Boolean).join('\n'),
        url: opts.url,
        start: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), h ?? 18, m ?? 0)),
        floating: true,
      };
    });
}

export function feedIcs(events: CalEvent[], labels: FeedLabels, now: Date): string {
  return buildIcs(events, now, { name: labels.name, refresh: 'PT6H' });
}

// Subscribe links for the common calendar apps. `https` is the feed URL.
export function subscribeLinks(https: string, name: string) {
  const webcal = https.replace(/^https?:/, 'webcal:');
  return {
    webcal,
    google: `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal)}`,
    outlook: `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(https)}&name=${encodeURIComponent(name)}`,
    apple: webcal,
  };
}

// 32 bytes of randomness, URL-safe: the token is the only secret in the feed URL.
export function newCalendarToken(): string {
  const b = new Uint8Array(32);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
}

export const CALENDAR_TOKEN_RE = /^[0-9a-f]{64}$/;
