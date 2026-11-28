import { describe, expect, it } from 'vitest';
import { aiBlindspotStateSchema, aiContentUploadSchema, aiDigestSchema, aiLearnedSeenSchema, aiNoteOpSchema, aiVoiceUploadSchema } from './memorySchemas.js';

const ID = '5a3e1e00-0000-4000-8000-000000000001';
const voiceStats = { captions: 12, medianChars: 90, medianWords: 16, shortShare: 0.4, longShare: 0, emojiPerCaption: 0.2, emojiShare: 0.1, hashtagMedian: 8, hashtagShare: 1, questionShare: 0.1, ctaShare: 0, lineBreakShare: 0, firstPersonShare: 0.6, lowercaseStartShare: 0 };
const content = {
  total: 10, first: '2025-01-01', last: '2026-11-01', byMonth: [{ month: '2026-11', photo: 1, carousel: 0, reel: 0, video: 0 }], weekday: [0, 1, 0, 1, 0, 1, 0], hour: Array(24).fill(0),
  posts30: 1, posts90: 4, posts365: 10, medianGapDays: 7, currentGapDays: 3, longestGapDays: 40, longestGapFrom: '2026-07-01', mix90: { photo: 1, carousel: 0, reel: 0, video: 0 }, mix365: { photo: 1, carousel: 0, reel: 0, video: 0 },
  avgSlides: null, medianCaptionChars: 80, medianHashtags: 6, ctaShare: 0, questionShare: 0.1,
};

describe('note ops', () => {
  it('accepts each op and refuses the rest', () => {
    for (const op of [{ op: 'pin', id: ID }, { op: 'unpin', id: ID }, { op: 'edit', id: ID, body: 'Short captions' }, { op: 'forget', id: ID }, { op: 'keep', id: ID }, { op: 'add', body: 'I shoot film' }, { op: 'resolve', id: ID, keepId: ID }]) {
      expect(aiNoteOpSchema.safeParse(op).success).toBe(true);
    }
    expect(aiNoteOpSchema.parse({ op: 'add', body: 'x' })).toEqual({ op: 'add', body: 'x', type: 'fact' });
    expect(aiNoteOpSchema.safeParse({ op: 'pin', id: 'nope' }).success).toBe(false);
    expect(aiNoteOpSchema.safeParse({ op: 'delete', id: ID }).success).toBe(false);
    expect(aiNoteOpSchema.safeParse({ op: 'edit', id: ID, body: 'x'.repeat(241) }).success).toBe(false);
  });
  it('week keys', () => {
    expect(aiLearnedSeenSchema.safeParse({ weekKey: '2026-W48' }).success).toBe(true);
    expect(aiLearnedSeenSchema.safeParse({ weekKey: '2026-48' }).success).toBe(false);
  });
});

describe('voice upload', () => {
  it('needs consent and refuses handles and links in the examples', () => {
    expect(aiVoiceUploadSchema.safeParse({ consent: true, stats: voiceStats, exemplars: ['Tram 28 at blue hour.'] }).success).toBe(true);
    expect(aiVoiceUploadSchema.safeParse({ consent: false, stats: voiceStats, exemplars: [] }).success).toBe(false);
    expect(aiVoiceUploadSchema.safeParse({ consent: true, stats: voiceStats, exemplars: ['Shot with @lena.frames'] }).success).toBe(false);
    expect(aiVoiceUploadSchema.safeParse({ consent: true, stats: voiceStats, exemplars: ['see https://x.co'] }).success).toBe(false);
    expect(aiVoiceUploadSchema.safeParse({ consent: true, stats: voiceStats, exemplars: Array(13).fill('a') }).success).toBe(false);
    expect(aiVoiceUploadSchema.safeParse({ consent: true, stats: { ...voiceStats, shortShare: 2 }, exemplars: [] }).success).toBe(false);
  });
});

describe('content upload', () => {
  it('numbers and dates only, moments included', () => {
    expect(aiContentUploadSchema.safeParse({ platform: 'instagram', stats: content, moments: [{ kind: 'best_month', at: '2026-10', params: { count: 72 } }] }).success).toBe(true);
    expect(aiContentUploadSchema.safeParse({ platform: 'instagram', stats: content, moments: [{ kind: 'best_month', at: '2026-10', params: { who: 'lena' } }] }).success).toBe(false);
    expect(aiContentUploadSchema.safeParse({ platform: 'instagram', stats: { ...content, weekday: [1, 2] } }).success).toBe(false);
    expect(aiContentUploadSchema.safeParse({ platform: 'myspace', stats: content }).success).toBe(false);
  });
});

describe('blind-spot state and digest', () => {
  it('state keys are detector names, perhaps with a short suffix', () => {
    expect(aiBlindspotStateSchema.safeParse({ history: { 'quiet_season:8': { shown: 1 } }, current: null, newAt: [1], perData: { '1795': 1 } }).success).toBe(true);
    expect(aiBlindspotStateSchema.safeParse({ history: { '<script>': { shown: 1 } }, current: null, newAt: [], perData: {} }).success).toBe(false);
  });
  it('digest lists default to empty and use short note ids', () => {
    expect(aiDigestSchema.parse({})).toEqual({ merge: [], archive: [], importance: [], add: [], rollup: [] });
    expect(aiDigestSchema.safeParse({ importance: [{ id: 'a1b2c3', importance: 6 }] }).success).toBe(false);
  });
});
