import { exportStats } from '@ig-tracker/core';
import { buildCoachContext, type CoachContext } from '@/lib/ai/coachContext';
import { getSampleSnapshots } from '../sampleSnapshot';
import { en } from './en';

// "What the coach saw" for the sample account: the same builder the server
// uses, fed with Inês's three exports and what a member like her would have
// on file. Built in the browser; nothing is sent anywhere.

let cached: CoachContext | null = null;

export function getSampleSeen(): CoachContext {
  if (cached) return cached;
  const s = getSampleSnapshots();
  const stats = [exportStats(s[2]!, s[1]!), exportStats(s[1]!, s[0]!), exportStats(s[0]!)];
  const results = en.posted
    .filter((p) => p.results)
    .map((p) => `- ${p.format} about "${p.title}" (posted ${p.postedAt.slice(0, 10)}); results: ${p.results.likes} likes, ${p.results.saves} saves, ${p.results.newFollowers >= 0 ? '+' : ''}${p.results.newFollowers} followers`);
  cached = buildCoachContext({
    accountLine: 'Type: creator. Niche: film photography. Goal: grow an audience that books portrait sessions.',
    extraLines: [
      'Posts on Tuesday, Thursday, Saturday; plans should put posts on these days; usual posting time 18:30.',
      'Measurable goal set in Studio: 2000 followers by 2027-03-31.',
    ],
    goal: true,
    memory: en.memory,
    stats,
    results,
    brief: {
      date: '2026-11-23',
      lines: [
        'Weekly brief of 2026-11-23 (photo-video): Better edits, protected videos, and your look as a Stories effect',
        '- You can now edit a Story after posting it.',
        '- Meta now flags reposts of your videos on Instagram.',
        '- Threads search got real filters.',
      ],
    },
  });
  return cached;
}
