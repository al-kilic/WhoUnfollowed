// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { ContentFormat } from '../contentFormats.js';
import type { ExportContentItem } from '../exportContent.js';
import { CONTENT_FORMATS } from '../contentFormats.js';
import { countHashtags, captionBody, hasCta, isQuestion, median, share } from './captionSignals.js';

// What the member actually posts and when, from the posts and Reels in a full
// export. Numbers and dates only: nothing here can name a person. Worked out
// in the browser; the coach gets this summary, never the captions.

export type FormatMix = Record<ContentFormat, number>; // shares, 0-1

export interface ContentMonth { month: string; photo: number; carousel: number; reel: number; video: number }

export interface ContentStats {
  total: number;
  first: string | null; // YYYY-MM-DD of the oldest item
  last: string | null; // newest
  byMonth: ContentMonth[]; // the last 24 months up to now, oldest first, no gaps
  weekday: number[]; // last 365 days, Monday first
  hour: number[]; // last 365 days, 0-23, in the member's time zone
  posts30: number;
  posts90: number;
  posts365: number;
  medianGapDays: number | null; // between consecutive items in the last 365 days
  currentGapDays: number | null; // since the newest item
  longestGapDays: number | null; // in the last 365 days
  longestGapFrom: string | null; // the day that gap started
  mix90: FormatMix;
  mix365: FormatMix;
  avgSlides: number | null; // carousels in the last 365 days, one decimal
  medianCaptionChars: number | null; // last 365 days, or everything when that is empty
  medianHashtags: number | null;
  ctaShare: number;
  questionShare: number;
}

const DAY = 86_400;
const day = (ts: number) => new Date(ts * 1000).toISOString().slice(0, 10);
const monthOf = (ts: number) => new Date(ts * 1000).toISOString().slice(0, 7);

function monthsBack(now: number, n: number): string[] {
  const d = new Date(now * 1000);
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const m = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i, 1));
    out.push(m.toISOString().slice(0, 7));
  }
  return out;
}

function mix(items: readonly ExportContentItem[]): FormatMix {
  const out = { photo: 0, carousel: 0, reel: 0, video: 0 } as FormatMix;
  for (const f of CONTENT_FORMATS) out[f] = share(items.filter((i) => i.format === f).length, items.length);
  return out;
}

export function contentStats(items: readonly ExportContentItem[], opts: { now: number; utcOffsetMinutes?: number }): ContentStats {
  const { now } = opts;
  const offset = (opts.utcOffsetMinutes ?? 0) * 60;
  const all = items.filter((i) => i.date > 0 && i.date <= now).sort((a, b) => a.date - b.date);
  const within = (days: number) => all.filter((i) => i.date > now - days * DAY);
  const y = within(365);

  const months = monthsBack(now, 24);
  const byMonth = new Map(months.map((m) => [m, { month: m, photo: 0, carousel: 0, reel: 0, video: 0 } as ContentMonth]));
  for (const i of all) { const row = byMonth.get(monthOf(i.date + offset)); if (row) row[i.format]++; }

  const weekday = Array<number>(7).fill(0);
  const hour = Array<number>(24).fill(0);
  for (const i of y) {
    const local = new Date((i.date + offset) * 1000);
    weekday[(local.getUTCDay() + 6) % 7]!++;
    hour[local.getUTCHours()]!++;
  }

  const gaps: { days: number; from: number }[] = [];
  for (let k = 1; k < y.length; k++) gaps.push({ days: (y[k]!.date - y[k - 1]!.date) / DAY, from: y[k - 1]!.date });
  const longest = gaps.reduce<{ days: number; from: number } | null>((m, g) => (!m || g.days > m.days ? g : m), null);
  const newest = all[all.length - 1];
  const textBase = y.length ? y : all;
  const captions = textBase.map((i) => i.caption).filter(Boolean);
  const carousels = y.filter((i) => i.format === 'carousel');
  const medGap = median(gaps.map((g) => g.days));

  return {
    total: all.length,
    first: all[0] ? day(all[0].date) : null,
    last: newest ? day(newest.date) : null,
    byMonth: months.map((m) => byMonth.get(m)!),
    weekday,
    hour,
    posts30: within(30).length,
    posts90: within(90).length,
    posts365: y.length,
    medianGapDays: medGap === null ? null : Math.round(medGap * 10) / 10,
    currentGapDays: newest ? Math.floor((now - newest.date) / DAY) : null,
    longestGapDays: longest ? Math.round(longest.days) : null,
    longestGapFrom: longest ? day(longest.from) : null,
    mix90: mix(within(90)),
    mix365: mix(y),
    avgSlides: carousels.length ? Math.round((carousels.reduce((s, c) => s + c.slides, 0) / carousels.length) * 10) / 10 : null,
    medianCaptionChars: median(captions.map((c) => captionBody(c).length)),
    medianHashtags: median(captions.map(countHashtags)),
    ctaShare: share(captions.filter(hasCta).length, captions.length),
    questionShare: share(captions.filter(isQuestion).length, captions.length),
  };
}
