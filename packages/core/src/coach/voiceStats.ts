// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { captionBody, countEmoji, countHashtags, hasCta, isFirstPerson, isQuestion, median, share, wordCount } from './captionSignals.js';

// How the member writes, from their own past captions, worked out in the
// browser. voiceStats is numbers only. pickVoiceExemplars chooses a few
// captions to show the coach as examples of their voice; they are scrubbed of
// handles, links, emails and phone numbers first, and only leave the device
// when the member chooses to share them.

export interface VoiceStats {
  captions: number; // captions with text, counted
  medianChars: number | null;
  medianWords: number | null;
  shortShare: number; // 80 characters or fewer, 0-1
  longShare: number; // 300 characters or more
  emojiPerCaption: number; // mean, one decimal
  emojiShare: number; // captions with at least one emoji
  hashtagMedian: number | null;
  hashtagShare: number; // captions with at least one hashtag
  questionShare: number;
  ctaShare: number;
  lineBreakShare: number;
  firstPersonShare: number;
  lowercaseStartShare: number;
}

export function voiceStats(captions: readonly string[]): VoiceStats {
  const list = captions.map((c) => c.trim()).filter(Boolean);
  const n = list.length;
  const bodies = list.map(captionBody);
  const chars = bodies.map((b) => b.length);
  const emoji = list.map(countEmoji);
  const tags = list.map(countHashtags);
  const count = (f: (s: string, i: number) => boolean) => list.filter(f).length;
  return {
    captions: n,
    medianChars: median(chars),
    medianWords: median(list.map(wordCount)),
    shortShare: share(chars.filter((c) => c <= 80).length, n),
    longShare: share(chars.filter((c) => c >= 300).length, n),
    emojiPerCaption: n ? Math.round((emoji.reduce((a, b) => a + b, 0) / n) * 10) / 10 : 0,
    emojiShare: share(emoji.filter((e) => e > 0).length, n),
    hashtagMedian: median(tags),
    hashtagShare: share(tags.filter((t) => t > 0).length, n),
    questionShare: share(count(isQuestion), n),
    ctaShare: share(count(hasCta), n),
    lineBreakShare: share(count((_, i) => bodies[i]!.includes('\n')), n),
    firstPersonShare: share(count(isFirstPerson), n),
    lowercaseStartShare: share(count((_, i) => /^\p{Ll}/u.test(bodies[i]!)), n),
  };
}

// Handles, links, emails and phone numbers out. Personal names can't be told
// apart from places or words reliably, so the member sees and can edit every
// exemplar before it is shared.
export function scrubCaption(text: string): string {
  return text
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[email]')
    .replace(/(?<![\w.])@[A-Za-z0-9._]{2,30}/g, '@[account]')
    .replace(/https?:\/\/\S+|www\.\S+/gi, '[link]')
    // Nine digits or more, so dates and film speeds ("2026-11-20", "Portra 400") stay.
    .replace(/\+?\d[\d\s().-]{7,}\d/g, (m) => ((m.match(/\d/g) ?? []).length >= 9 ? '[phone]' : m));
}

export interface VoiceSource { caption: string; date: number }

const bucket = (len: number) => (len < 80 ? 0 : len < 200 ? 1 : 2);

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

// Up to `max` captions that show the voice: the newest first, spread across
// short, medium and long ones, near-duplicates and empty-after-scrub dropped.
export function pickVoiceExemplars(items: readonly VoiceSource[], opts: { max?: number; maxChars?: number } = {}): string[] {
  const max = opts.max ?? 12;
  const maxChars = opts.maxChars ?? 400;
  const seen = new Set<string>();
  const buckets: { text: string; date: number }[][] = [[], [], []];
  for (const it of [...items].sort((a, b) => b.date - a.date)) {
    const text = captionBody(scrubCaption(it.caption));
    const letters = text.replace(/\[(account|link|email|phone)\]/g, '').replace(/[^\p{L}]/gu, '');
    if (letters.length < 15) continue;
    const key = text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '').slice(0, 40);
    if (seen.has(key)) continue;
    seen.add(key);
    buckets[bucket(text.length)]!.push({ text: clip(text, maxChars), date: it.date });
  }
  const picked: { text: string; date: number }[] = [];
  for (let i = 0; picked.length < max && buckets.some((b) => b.length > i); i++) {
    for (const b of buckets) if (b[i] && picked.length < max) picked.push(b[i]!);
  }
  return picked.sort((a, b) => b.date - a.date).map((p) => p.text);
}
