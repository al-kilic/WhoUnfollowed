import { z } from 'zod';
import { platformSchema } from './schemas.js';
import { aiNoteTypes } from './aiSchemas.js';
import { RADAR_FACT_VALUE } from './tools/radarFacts.js';

// Memory v2 (phase 2E): what the browser may send about the member's notes,
// voice, content history and blind-spot answers, and what the coach's tidy-up
// pass may return. Numbers and dates only, except note text the member typed
// and voice examples they chose to share (short and scrubbed).

const text = (max: number) => z.string().trim().min(1).max(max);
const uuid = z.string().uuid();
const noteId = z.string().trim().regex(/^[a-f0-9]{6}$/);
const share = z.number().min(0).max(1);
const count = z.number().int().min(0).max(1_000_000);
const smallNum = z.number().min(0).max(100_000);
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
// No handles or links in anything the member shares as a voice example.
const exemplar = z.string().trim().min(1).max(400).refine((s) => !/(^|[^\w.])@[A-Za-z0-9._]{2,30}/.test(s) && !/https?:\/\//i.test(s), 'scrub first');

// ── Notes viewer ────────────────────────────────────────────────────────────

export const aiNoteOpSchema = z.discriminatedUnion('op', [
  z.object({ op: z.literal('pin'), id: uuid }),
  z.object({ op: z.literal('unpin'), id: uuid }),
  z.object({ op: z.literal('edit'), id: uuid, body: text(240) }),
  z.object({ op: z.literal('forget'), id: uuid }),
  z.object({ op: z.literal('keep'), id: uuid }),
  z.object({ op: z.literal('add'), body: text(240), type: z.enum(aiNoteTypes).default('fact') }),
  // Two notes disagree: keep `keepId`, archive the other one (`id`).
  z.object({ op: z.literal('resolve'), id: uuid, keepId: uuid }),
]);
export type AiNoteOp = z.infer<typeof aiNoteOpSchema>;

export const aiLearnedSeenSchema = z.object({ weekKey: z.string().regex(/^\d{4}-W\d{2}$/) });

// ── Voice and content history (computed in the browser) ────────────────────

export const aiVoiceStatsSchema = z.object({
  captions: count,
  medianChars: smallNum.nullable(),
  medianWords: smallNum.nullable(),
  shortShare: share,
  longShare: share,
  emojiPerCaption: smallNum,
  emojiShare: share,
  hashtagMedian: smallNum.nullable(),
  hashtagShare: share,
  questionShare: share,
  ctaShare: share,
  lineBreakShare: share,
  firstPersonShare: share,
  lowercaseStartShare: share,
});

export const aiVoiceUploadSchema = z.object({
  // The member said yes to sharing these examples with their coach.
  consent: z.literal(true),
  stats: aiVoiceStatsSchema,
  exemplars: z.array(exemplar).max(12),
});
export type AiVoiceUpload = z.infer<typeof aiVoiceUploadSchema>;

const mixSchema = z.object({ photo: share, carousel: share, reel: share, video: share });
export const aiContentStatsSchema = z.object({
  total: count,
  first: day.nullable(),
  last: day.nullable(),
  byMonth: z.array(z.object({ month: z.string().regex(/^\d{4}-\d{2}$/), photo: count, carousel: count, reel: count, video: count })).max(36),
  weekday: z.array(count).length(7),
  hour: z.array(count).length(24),
  posts30: count,
  posts90: count,
  posts365: count,
  medianGapDays: smallNum.nullable(),
  currentGapDays: smallNum.nullable(),
  longestGapDays: smallNum.nullable(),
  longestGapFrom: day.nullable(),
  mix90: mixSchema,
  mix365: mixSchema,
  avgSlides: smallNum.nullable(),
  medianCaptionChars: smallNum.nullable(),
  medianHashtags: smallNum.nullable(),
  ctaShare: share,
  questionShare: share,
});

const momentValue = z.union([z.number().finite(), z.string().regex(RADAR_FACT_VALUE)]);
export const aiMomentSchema = z.object({
  kind: z.enum(['spike', 'drop', 'follow_spree', 'quiet_month', 'best_month', 'best_post', 'story_best_month', 'busiest_month', 'long_break']),
  at: z.string().regex(RADAR_FACT_VALUE),
  params: z.record(z.string().regex(/^[a-zA-Z]{1,30}$/), momentValue),
});

// Instagram's own numbers from the export (coach/insightsStats.ts). Numbers,
// days, and the audience's top countries and cities (letters only).
const big = z.number().min(0).max(1_000_000_000);
const opt = big.nullable();
const pct = z.number().min(-100_000).max(100_000).nullable();
const formatEnum = z.enum(['photo', 'carousel', 'reel', 'video']);
const place = z.object({ name: z.string().regex(/^[\p{L}][\p{L}\p{M} .'-]{0,39}$/u), pct: z.number().min(0).max(100) });
export const aiInsightsStatsSchema = z.object({
  posts: z.array(z.object({ date: day, format: formatEnum, reach: opt, plays: opt, likes: opt, comments: opt, saves: opt, shares: opt, follows: opt })).max(30),
  captionDrift: z.object({ winners: count, winnerChars: count, winnerTags: count, recentChars: count, recentTags: count }).nullable().default(null),
  formats: z.array(z.object({ format: formatEnum, posts: count, medianReach: opt, medianLikes: opt, medianSaves: opt, medianShares: opt, medianFollows: opt })).max(4),
  stories: z.object({
    total: count, last90: count, last365: count,
    medianReach90: opt, medianReachBefore: opt, exitPct90: z.number().min(0).max(100).nullable(),
    repliesPer100: opt, visitsPer100: opt,
    weekdayReach: z.array(opt).length(7),
    byMonth: z.array(z.object({ month: z.string().regex(/^\d{4}-\d{2}$/), stories: count, medianReach: opt })).max(24),
  }).nullable(),
  account: z.object({
    range: z.string().regex(/^[\p{L}\d ,.-]{3,40}$/u).nullable(),
    followers: opt, followersDeltaPct: pct, follows: opt, unfollows: opt,
    reached: opt, reachedDeltaPct: pct, nonFollowerReachPct: z.number().min(0).max(100).nullable(),
    profileVisits: opt, linkTaps: opt, interactionsDeltaPct: pct,
    storyInteractions: opt, postInteractions: opt, reelsInteractions: opt,
    engagedNonFollowerPct: z.number().min(0).max(100).nullable(),
    activityPeak: z.number().int().min(0).max(6).nullable(), activityLiftPct: pct,
    topAge: z.string().regex(/^\d{2}(-\d{2}|\+)$/).nullable(), topAgePct: z.number().min(0).max(100).nullable(),
    womenPct: z.number().min(0).max(100).nullable(), menPct: z.number().min(0).max(100).nullable(),
    countries: z.array(place).max(3), cities: z.array(place).max(3),
  }).nullable(),
  lives: count,
});
export type AiInsightsStats = z.infer<typeof aiInsightsStatsSchema>;

export const aiContentUploadSchema = z.object({
  platform: platformSchema,
  stats: aiContentStatsSchema,
  moments: z.array(aiMomentSchema).max(24).default([]),
  insights: aiInsightsStatsSchema.nullable().default(null),
});
export type AiContentUpload = z.infer<typeof aiContentUploadSchema>;

// ── Blind-spot answers (moved from the browser to the database) ────────────

const spotKey = z.string().regex(/^[a-z_]{3,40}(:[0-9A-Za-z-]{1,20})?$/);
export const aiBlindspotStateSchema = z.object({
  history: z.record(spotKey, z.object({ shown: z.number().int().min(0).max(1000), known: z.boolean().optional(), snoozeUntil: z.number().int().positive().optional() })),
  current: spotKey.nullable(),
  newAt: z.array(z.number().int().positive()).max(50),
  perData: z.record(z.string().regex(/^\d{1,12}$/), z.number().int().min(0).max(100)),
});
export type AiBlindspotState = z.infer<typeof aiBlindspotStateSchema>;

// ── The coach's tidy-up pass, at most once per new export ───────────────────

export const aiDigestSchema = z.object({
  // Notes that say the same thing, merged into one line.
  merge: z.array(z.object({ ids: z.array(noteId).min(2).max(5), text: text(240) })).max(5).default([]),
  // Notes no longer true or useful.
  archive: z.array(noteId).max(10).default([]),
  importance: z.array(z.object({ id: noteId, importance: z.number().int().min(1).max(5) })).max(10).default([]),
  add: z.array(z.object({ type: z.enum(aiNoteTypes), text: text(240), tags: z.array(z.string().trim().toLowerCase().regex(/^[a-z0-9_:-]{2,40}$/)).max(6).default([]) })).max(3).default([]),
  // Phase 3C: 3 or more older (faded or archived) notes on the same thing, kept as one line.
  rollup: z.array(z.object({ ids: z.array(noteId).min(3).max(12), text: text(240) })).max(3).default([]),
});
export type AiDigest = z.infer<typeof aiDigestSchema>;
