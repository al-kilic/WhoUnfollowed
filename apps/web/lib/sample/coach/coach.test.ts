import { describe, expect, it } from 'vitest';
import { aiChatSchema, aiCheckSchema, aiDraftSchema, aiIdeasSchema, aiInsightsSchema, aiPlanSchema, aiReadSchema, compareSnapshots, growthTimeline } from '@ig-tracker/core';
import { getSampleSnapshots, SAMPLE_FLOW, SAMPLE_POSTS } from '../sampleSnapshot';
import { getSampleCoach, sampleResponses } from '.';

const LOCALES = ['en', 'es', 'pt'] as const;

describe('sample coach content', () => {
  for (const l of LOCALES) {
    const c = getSampleCoach(l);
    it(`${l}: passes the same schemas as real model answers`, () => {
      expect(aiReadSchema.safeParse(c.read).success).toBe(true);
      expect(aiCheckSchema.safeParse(c.check.result).success).toBe(true);
      expect(aiDraftSchema.safeParse({ options: c.draft.options }).success).toBe(true);
      expect(aiIdeasSchema.safeParse({ ideas: c.ideas.ideas }).success).toBe(true);
      expect(aiPlanSchema.safeParse(c.plan).success).toBe(true);
      expect(aiInsightsSchema.safeParse(c.insights).success).toBe(true);
      expect(aiChatSchema.safeParse(c.sampleReply).success).toBe(true);
      for (const ch of c.chats) for (const t of ch.turns) expect(aiChatSchema.safeParse(t.a).success).toBe(true);
    });
    it(`${l}: has no em dashes`, () => {
      expect(JSON.stringify(c)).not.toContain('—');
    });
    it(`${l}: places every planned post on the calendar`, () => {
      const r = sampleResponses(l, new Date('2026-11-23T12:00:00Z'));
      expect(r.plan.plan.calendar.length).toBe(c.plan.weeks.reduce((n, w) => n + w.posts.length, 0));
    });
  }

  it('says the same thing in every language (same numbers, same shape)', () => {
    const digits = (s: unknown) => (JSON.stringify(s).match(/\d+/g) ?? []).sort().join(',');
    const [en, es, pt] = LOCALES.map(getSampleCoach);
    for (const other of [es, pt]) {
      expect(other!.chats.length).toBe(en!.chats.length);
      expect(other!.posted.map((p) => p.results)).toEqual(en!.posted.map((p) => p.results));
      expect(digits(other!.read)).toBe(digits(en!.read));
      expect(digits(other!.check.result.scores.map((x) => x.score))).toBe(digits(en!.check.result.scores.map((x) => x.score)));
    }
  });

  it('quotes numbers that match the sample exports', () => {
    const [, b, c] = getSampleSnapshots();
    const bc = compareSnapshots(b!, c!);
    const read = getSampleCoach('en').read.happening.join(' ');
    expect(read).toContain(`${bc.newFollowers.length} people followed you and ${bc.lostFollowers.length} left`);
    expect(read).toContain(`up ${SAMPLE_FLOW.followers[2] - SAMPLE_FLOW.followers[1]}`);
    // The posts she logged match the follower bursts in the export.
    const posted = getSampleCoach('en').posted;
    for (const p of SAMPLE_POSTS) {
      const day = new Date(p.at * 1000).toISOString().slice(0, 10);
      expect(posted.find((x) => x.postedAt.startsWith(day))?.results.newFollowers).toBe(p.followers);
    }
    // "July and August brought fewer than ten".
    const months = growthTimeline(c!).months;
    const summer = months.filter((m) => m.month === '2026-07' || m.month === '2026-08').reduce((n, m) => n + m.followers, 0);
    expect(summer).toBeLessThan(10);
  });

  it('answers goal maths the way the chat explains it', () => {
    const g = sampleResponses('en', new Date('2026-11-20T12:00:00Z')).goal;
    expect(g.current).toBe(1240);
    expect(g.progress?.left).toBe(760);
    expect(g.progress?.status).toBe('behind');
  });
});
