import type { ExportContentItem } from '@ig-tracker/core';

// Inês's posting history, as a full Instagram export would list it: what she
// posted and when, with captions in her voice. It feeds the content history,
// voice profile and moments in sample mode, and agrees with the sample coach:
// teaching carousels on Thursday, a short Reel on Tuesday, a single frame on
// Saturday, at 18:30; one post in July and August 2026 (the Aug 20 Reel); the
// six logged autumn posts on their exact dates. Captions rarely end on a
// question and carry a block of broad hashtags, which is what Check flags.

const T = (iso: string) => Math.floor(Date.parse(iso) / 1000);
const DAY = 86_400;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

const TAGS = ['#film', '#35mm', '#filmphotography', '#portra400', '#lisbon', '#portugal', '#analog', '#filmisnotdead', '#shootfilm', '#ishootfilm', '#believeinfilm', '#streetphotography', '#travel', '#photography'];
const PLACES = ['Alfama', 'Graça', 'Belém', 'Cais do Sodré', 'Príncipe Real', 'Mouraria', 'Sintra', 'Cascais', 'the river', 'Campo de Ourique'];
const STOCKS = ['Portra 400', 'Gold 200', 'HP5', 'Ektar 100', 'Portra 160'];

const CAROUSEL = [
  (p: string, s: string) => `A roll from ${p}, start to finish. Shot on ${s}. I kept the frames I almost deleted too.`,
  (p: string, s: string) => `What I learned from one roll of ${s} in ${p}. Slide 4 is the mistake, slide 5 is the fix.`,
  (p: string, s: string) => `${p} before anyone wakes up. Ten frames, ${s}, settings on each slide.`,
  (p: string, s: string) => `My light meter and I disagreed all morning in ${p}. Here is who was right. ${s}.`,
];
const REEL = [
  (p: string) => `Twenty seconds in ${p}, one roll, no edits.`,
  () => 'Loading film without losing the first frame. Took me years.',
  (p: string) => `How I meter for shade, in ${p}, in under half a minute.`,
  () => 'Developing at home, the boring parts included.',
];
const PHOTO = [
  (p: string) => `${p}, late light.`,
  (p: string) => `One frame from ${p}. That is all.`,
  (p: string, s: string) => `${p} on ${s}. I waited a while for this one.`,
  (p: string) => `Back in ${p} again. Same corner, different week.`,
];

// The six posts the coach knows, with the captions she wrote.
const LOGGED: ExportContentItem[] = [
  { date: T('2026-11-05T18:30:00Z'), format: 'photo', slides: 1, caption: 'Tram 28 at blue hour. I waited three trams for this one. #film #35mm #lisbon #portra400 #tram28 #analog #filmisnotdead #portugal', uris: [] },
  { date: T('2026-10-22T18:30:00Z'), format: 'carousel', slides: 7, caption: 'Why my film photos looked cold, and the one thing that fixed it. Slide 6 is the before and after. #film #35mm #filmphotography #portra400 #lisbon #analog #shootfilm #filmisnotdead', uris: [] },
  { date: T('2026-10-13T18:30:00Z'), format: 'photo', slides: 1, caption: 'Miradouro at dusk. Gold 200 does something to that pink. #film #lisbon #gold200 #35mm #analog #portugal', uris: [] },
  { date: T('2026-10-01T18:30:00Z'), format: 'reel', slides: 1, caption: 'Loading a Leica M6 in 20 seconds, without losing the first frame. #film #leica #35mm #analog #filmphotography #shootfilm', uris: [] },
  { date: T('2026-09-10T18:30:00Z'), format: 'carousel', slides: 10, caption: 'Alfama at 7 a.m., ten frames on Portra 400. Nobody around but the cats. #film #35mm #alfama #lisbon #portra400 #filmphotography #analog #streetphotography', uris: [] },
  { date: T('2026-08-20T18:30:00Z'), format: 'reel', slides: 1, caption: 'Developing a roll in my kitchen. It is less dramatic than it looks. #film #darkroom #analog #35mm #filmisnotdead', uris: [] },
];

let cached: ExportContentItem[] | null = null;

function build(): ExportContentItem[] {
  const rand = rng(20260918);
  const pick = <V,>(list: readonly V[]) => list[Math.floor(rand() * list.length)]!;
  const tags = () => {
    const n = 6 + Math.floor(rand() * 7); // 6 to 12, broad ones
    return [...TAGS].sort(() => rand() - 0.5).slice(0, n).join(' ');
  };
  const out: ExportContentItem[] = [];
  // Monday 2024-01-01, week by week, until her summer 2026 break.
  for (let week = T('2024-01-01T18:30:00Z'); week < T('2026-06-29T00:00:00Z'); week += 7 * DAY) {
    const busy = week >= T('2026-01-01T00:00:00Z') ? 0.85 : week >= T('2025-01-01T00:00:00Z') ? 0.7 : 0.55;
    for (const [offset, format] of [[1, 'reel'], [3, 'carousel'], [5, 'photo']] as const) {
      if (rand() > busy) continue;
      const p = pick(PLACES), s = pick(STOCKS);
      const body = format === 'carousel' ? pick(CAROUSEL)(p, s) : format === 'reel' ? pick(REEL)(p) : pick(PHOTO)(p, s);
      const ask = rand() < 0.08 ? ' Which one would you keep?' : '';
      const date = week + offset * DAY;
      out.push({ date, format, slides: format === 'carousel' ? 5 + Math.floor(rand() * 6) : 1, caption: `${body}${ask} ${tags()}`, uris: [] });
    }
  }
  // Autumn 2026: the six logged posts, plus a few quieter Saturday frames.
  for (const iso of ['2026-09-19', '2026-10-03', '2026-10-24', '2026-11-14']) {
    const p = pick(PLACES);
    out.push({ date: T(`${iso}T18:30:00Z`), format: 'photo', slides: 1, caption: `${pick(PHOTO)(p, pick(STOCKS))} ${tags()}`, uris: [] });
  }
  out.push(...LOGGED.map((l) => ({ ...l })));
  return out.sort((a, b) => b.date - a.date).map((it) => ({ ...it, uris: [`media/sample/${it.date}.${it.format === 'reel' ? 'mp4' : 'jpg'}`] }));
}

// Newest first, the same shape readExportContent returns.
export function getSampleContent(): ExportContentItem[] {
  cached ??= build();
  return cached;
}
