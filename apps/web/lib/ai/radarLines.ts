import type { ExportStats } from '@ig-tracker/core';

// Radar's findings (computed in the browser, numbers and dates only) as plain
// lines for the coach. Unknown ids are skipped, so an old browser bundle or a
// new rule never breaks the context.

type Fact = NonNullable<ExportStats['facts']>[number];
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const n = (v: unknown) => (typeof v === 'number' ? v.toLocaleString('en-US') : String(v ?? '?'));

const LINES: Record<string, (p: Fact['params']) => string> = {
  'fix.stale_pending': (p) => `${n(p.count)} follow requests the user sent are still waiting, the oldest for about ${n(p.months)} months. Advice: cancel the stale ones.`,
  'fix.follow_back_gap_year': (p) => `Of the ${n(p.total)} accounts followed in ${n(p.year)}, ${n(p.count)} (${n(p.pct)}%) never followed back.`,
  'fix.old_one_way': (p) => `${n(p.count)} accounts followed more than a year ago have never followed back.`,
  'fix.sudden_drop': (p) => `${n(p.count)} followers (${n(p.pct)}%) left in the ${n(p.days)} days between the last two exports.`,
  'fix.mutuals_lost': (p) => `${n(p.count)} mutuals stopped following back since the previous export.`,
  'fix.follow_burst': (p) => `On ${n(p.date)} the user followed ${n(p.count)} accounts in one day; ${n(p.followedBack)} followed back.`,
  'fix.fans_unanswered': (p) => `${n(p.count)} recent followers are not followed back by the user.`,
  'fix.ratio_imbalance': (p) => `Following ${n(p.following)} vs ${n(p.followers)} followers; ${n(p.oneWay)} accounts don't follow back.`,
  'fix.following_limit': (p) => `Following ${n(p.following)} of the platform cap of ${n(p.cap)} (${n(p.left)} left).`,
  'fact.best_month': (p) => `Best month for new followers that stayed: ${n(p.month)} (+${n(p.count)}).`,
  'fact.arrival_weekday': (p) => `${n(p.pct)}% of followers arrived on a ${WEEKDAYS[Number(p.weekday)] ?? 'single weekday'}.`,
  'fact.first_follower': (p) => `Oldest follower still following since ${n(p.date)} (${n(p.years)} years).`,
  'fact.longest_wait': (p) => `${n(p.count)} accounts the user follows don't follow back; the longest wait is ${n(p.days)} days.`,
  'fact.recent_share': (p) => `${n(p.pct)}% of current followers (${n(p.count)}) arrived in the last 12 months.`,
  'fact.follow_spree': (p) => `Biggest follow day: ${n(p.date)}, ${n(p.count)} accounts followed.`,
  'fact.fans': (p) => `${n(p.count)} followers (${n(p.pct)}%) are not followed back.`,
};

export function radarLines(facts: ExportStats['facts']): string[] {
  return (facts ?? []).flatMap((f) => { const line = LINES[f.id]; return line ? [`- ${line(f.params)}`] : []; });
}
