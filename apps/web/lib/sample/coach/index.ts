import type { AppLocale } from '@/i18n/routing';
import { goalProgress, nextCheckinAt } from '@/lib/ai/goalMath';
import { calendarFromPlan } from '@/lib/ai/planCalendar';
import { getSampleSnapshots, SAMPLE_EXPORTS } from '../sampleSnapshot';
import { en } from './en';
import { es } from './es';
import { pt } from './pt';
import type { SampleCoach } from './types';

export type { SampleCoach };

const BY: Record<AppLocale, SampleCoach> = { en, es, pt };
export function getSampleCoach(locale: string): SampleCoach {
  return BY[locale as AppLocale] ?? en;
}

const iso = (s: number) => new Date(s * 1000).toISOString();
const DAY = 86_400_000;

// The sample member's settings and plan (Pro AI yearly, onboarded).
export const SAMPLE_PREFS = { tone: 'voice', length: 'medium', days: [1, 3, 5], bestTime: '18:30', briefEmail: true, postingReminder: true } as const;
export const SAMPLE_BALANCE = 186;

// What each coach API route answers in sample mode. Built per request so
// dates (the plan, the next check-in) follow the visitor's clock.
export function sampleResponses(locale: string, now: Date = new Date()) {
  const c = getSampleCoach(locale);
  const snaps = getSampleSnapshots();
  const goalSetAt = new Date(SAMPLE_EXPORTS[1] * 1000);
  const goal = { target: 2000, by: new Date('2027-03-31T12:00:00Z'), startFollowers: snaps[1]!.followers.length, setAt: goalSetAt };
  const points = snaps.slice(1).map((s) => ({ at: new Date(s.exportedAt * 1000), followers: s.followers.length }));
  const planCreated = new Date(now.getTime() - DAY);
  const credits = { balance: SAMPLE_BALANCE, resetsAt: new Date(now.getTime() + 12 * DAY).toISOString() };
  return {
    state: {
      plan: 'yearly', onboarded: true,
      allowance: { usedShare: 0.35, nearLimit: false, empty: false, resetsAt: credits.resetsAt, refills: { held: 0, canBuy: true, expiresAt: [] }, gift: { left: false } },
      prefs: SAMPLE_PREFS,
      latestRead: { id: 'sample-read', platform: 'instagram', createdAt: iso(SAMPLE_EXPORTS[2]), data: c.read },
    },
    plan: {
      setup: { prefs: { postsPerWeek: 3, formats: ['carousel', 'reel', 'photo'], photos: 'weekly' }, followers: snaps[2]!.followers.length, exportedAt: iso(SAMPLE_EXPORTS[2]), postsWithResults: c.posted.length, niche: 'film photography' },
      plan: { id: '00000000-0000-4000-8000-000000000001', createdAt: planCreated.toISOString(), data: c.plan, calendar: calendarFromPlan(c.plan), revisions: 0 },
    },
    drafts: { items: [{ id: 'sample-draft', topic: c.draft.topic, format: 'carousel', createdAt: new Date(now.getTime() - 2 * DAY).toISOString(), text: c.draft.options[0]!.text }] },
    ideas: { items: [{ id: 'sample-ideas', theme: c.ideas.theme, createdAt: new Date(now.getTime() - 3 * DAY).toISOString(), ideas: c.ideas.ideas }] },
    posted: {
      items: c.posted.map((p, i) => ({ id: `sample-post-${i}`, format: p.format, hook: p.title, score: p.score, createdAt: p.postedAt, postedAt: p.postedAt, source: p.score === null ? 'plan' : 'check', results: p.results })),
    },
    goal: {
      // Goals are per platform: the sample member has an Instagram goal and a
      // posts-a-week habit goal on Threads (the summary row shows both).
      platform: 'instagram',
      platforms: [
        { platform: 'instagram', hasData: true, goal: { platform: 'instagram', type: 'followers', target: goal.target, pct: goalProgress(goal, points, now).pct } },
        { platform: 'threads', hasData: false, goal: { platform: 'threads', type: 'posts_week', target: 3, pct: 67 } },
      ],
      goal: { type: 'followers', target: goal.target, by: '2027-03-31', setAt: goalSetAt.toISOString(), startFollowers: goal.startFollowers, note: c.goalNote },
      cadence: 'weekly', weekday: 3, deadlineReminder: true,
      progress: goalProgress(goal, points, now),
      habit: null,
      current: snaps[2]!.followers.length,
      points: points.map((p) => ({ at: p.at.toISOString(), followers: p.followers })),
      nextCheckin: nextCheckinAt('weekly', new Date(now.getTime() - 3 * DAY), goalSetAt, 3)?.toISOString() ?? null,
    },
    // Threads: a habit goal (3 posts a week), 2 posted in the last 7 days.
    goalThreads: {
      platform: 'threads',
      platforms: [
        { platform: 'instagram', hasData: true, goal: { platform: 'instagram', type: 'followers', target: goal.target, pct: goalProgress(goal, points, now).pct } },
        { platform: 'threads', hasData: false, goal: { platform: 'threads', type: 'posts_week', target: 3, pct: 67 } },
      ],
      goal: { type: 'posts_week', target: 3, by: null, setAt: goalSetAt.toISOString(), startFollowers: 0, note: '' },
      cadence: 'weekly', weekday: 3, deadlineReminder: true,
      progress: null,
      habit: { current: 2, pct: 67, status: 'on_track' },
      current: null,
      points: [],
      nextCheckin: nextCheckinAt('weekly', new Date(now.getTime() - 3 * DAY), goalSetAt, 3)?.toISOString() ?? null,
    },
    memory: { memory: { content: c.memory, version: 1 } },
    credits: { ...credits, allowance: 100, history: [] },
    prefs: SAMPLE_PREFS,
    // Answers to the actions, if the visitor presses the button.
    actions: { read: c.read, draft: { options: c.draft.options, memoryNotes: [] }, check: c.check.result, ideas: { ideas: c.ideas.ideas, memoryNotes: [] }, plan: c.plan, chat: c.sampleReply, insights: c.insights },
  };
}
