import { describe, expect, it } from 'vitest';
import { buildCoachContext } from './coachContext';
import { aiInsightsStatsSchema } from '@ig-tracker/core';
import { historyLines, insightsLines, voiceCard } from './memoryLines';
import { getSampleContentStats, getSampleInsights, getSampleVoice } from '@/lib/sample/learned';

describe('voice card and history in the coach context', () => {
  const v = getSampleVoice();
  const card = voiceCard(v, ['Tram 28 at blue hour. I waited three trams for this one.', 'One frame from Alfama.']);

  it('the voice card is numbers plus the member\'s own lines, no dates', () => {
    expect(card[0]).toMatch(/^From \d+ of their captions: /);
    expect(card.slice(1)).toEqual(['> Tram 28 at blue hour. I waited three trams for this one.', '> One frame from Alfama.']);
    expect(card.join('\n')).not.toMatch(/\d{4}-\d{2}-\d{2}/);
    expect(voiceCard(null, [])).toEqual([]);
  });

  it('goes in the cached core; history and the ledger go in the uncached part', () => {
    const ctx = buildCoachContext({ accountLine: 'Type: creator.', extraLines: [], goal: false, memory: '', stats: [], results: [], brief: null, voice: card, history: historyLines(getSampleContentStats()), ledger: ['Average: 19 new followers per post over 6 posts.'] });
    expect(ctx.core).toContain('# How they write');
    expect(ctx.volatile).toContain('# Posting history (from the export)');
    expect(ctx.volatile).toContain('# What brought followers');
    expect(ctx.core).not.toContain('Posting history');
  });

  it('the core stays byte-identical when the export, history and ledger change', () => {
    const one = buildCoachContext({ accountLine: 'a', extraLines: [], goal: false, memory: 'm', stats: [], results: [], brief: null, voice: card, history: ['x'], ledger: ['y'] });
    const two = buildCoachContext({ accountLine: 'a', extraLines: [], goal: false, memory: 'm', stats: [], results: [], brief: null, voice: card, history: ['z'], ledger: [] });
    expect(one.core).toBe(two.core);
  });

  it('history reads in plain counts', () => {
    const h = historyLines(getSampleContentStats());
    expect(h[0]).toMatch(/^\d+ posts in the last 30 days/);
    expect(h.join(' ')).not.toContain('—');
    expect(historyLines(null)).toEqual([]);
  });
});

describe('Instagram\'s numbers in the coach context', () => {
  const ins = getSampleInsights();
  const lines = insightsLines(ins);

  it('the sample insights pass the upload schema', () => {
    expect(aiInsightsStatsSchema.safeParse(ins).success).toBe(true);
  });

  it('reads as a few short lines: account, audience, stories, posts, best post', () => {
    expect(lines).toHaveLength(5);
    expect(lines[0]).toMatch(/^Instagram's numbers for Aug 25 - Nov 22: 1,240 followers \(\+3\.1% vs the period before\), 214 follows and 121 unfollows, reached 9,800 accounts \(-6\.4%\), 12% not following/);
    expect(lines[1]).toContain('mostly 25-34 (47%)');
    expect(lines[1]).toContain('top countries Portugal 41%, Brazil 15%, Spain 7%');
    expect(lines[1]).toContain('most active on Thursday');
    expect(lines[2]).toMatch(/^Stories: \d+ in the last 90 days, \d+ in a year; median reach \d+ \(\d+ earlier in the year\)/);
    expect(lines[3]).toMatch(/^Per-post numbers Instagram kept \(10 posts\): /);
    expect(lines[4]).toMatch(/^Best of those: a carousel on \d{4}-\d{2}-\d{2} reached/);
    expect(lines.join(' ').length).toBeLessThan(1100);
    expect(lines.join(' ')).not.toMatch(/(^|[^\w.])@[A-Za-z0-9._]{2,30}/);
  });

  it('says nothing without insights, and skips empty parts', () => {
    expect(insightsLines(null)).toEqual([]);
    expect(insightsLines({ posts: [], captionDrift: null, formats: [], stories: null, account: null, lives: 0 })).toEqual([]);
  });
});
