import { MONTHLY_ALLOWANCE_USD } from './allowanceMath';

// Monthly use, explained without money: what this month went to (each
// feature's share of this month's use) and how full each past month got
// (share of a month's allowance, capped at 1). Never returns dollar amounts.

export type UsageFeature = 'ask' | 'create' | 'plan' | 'photos' | 'reads';
export const USAGE_FEATURES: readonly UsageFeature[] = ['ask', 'create', 'plan', 'photos', 'reads'];

const FEATURE_OF: Record<string, UsageFeature> = {
  chat: 'ask', chatDeep: 'ask',
  draft: 'create', ideas: 'create', check: 'create',
  plan: 'plan', planRevise: 'plan',
  insights: 'photos', photoStyle: 'photos',
  read: 'reads', memory: 'reads', digest: 'reads',
};

export interface UsageRow { action: string; costUsd: number; at: Date }
export interface UsageBreakdown {
  // This period, by feature: shares that add up to 1 (empty when nothing used).
  byFeature: { feature: UsageFeature; share: number }[];
  // The last months, oldest first: how full each one got (0 to 1).
  months: { month: string; fill: number }[];
}

const monthKey = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
const round = (n: number) => Math.round(n * 100) / 100;

export function usageBreakdown(rows: readonly UsageRow[], periodStart: Date, now: Date, monthsBack = 6): UsageBreakdown {
  const totals = new Map<UsageFeature, number>();
  let sum = 0;
  for (const r of rows) {
    if (!(r.costUsd > 0) || r.at < periodStart || r.at > now) continue;
    const f = FEATURE_OF[r.action] ?? 'reads';
    totals.set(f, (totals.get(f) ?? 0) + r.costUsd);
    sum += r.costUsd;
  }
  const byFeature = sum > 0
    ? USAGE_FEATURES.map((feature) => ({ feature, share: round((totals.get(feature) ?? 0) / sum) })).filter((x) => x.share > 0).sort((a, b) => b.share - a.share)
    : [];

  const perMonth = new Map<string, number>();
  for (const r of rows) if (r.costUsd > 0) perMonth.set(monthKey(r.at), (perMonth.get(monthKey(r.at)) ?? 0) + r.costUsd);
  const months: { month: string; fill: number }[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const key = monthKey(d);
    months.push({ month: key, fill: round(Math.min(1, (perMonth.get(key) ?? 0) / MONTHLY_ALLOWANCE_USD)) });
  }
  return { byFeature, months };
}
