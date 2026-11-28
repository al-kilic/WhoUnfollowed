import 'server-only';
import { isDevProPreview } from '@/lib/auth/devProPreview';
import { getProfileRow } from '@/lib/auth/profileRow';
import type { profiles } from '@/lib/db/schema';
import type { AiPlan } from './config';

// Who has Pro AI (founder, 2026-11-27 and 2026-11-28): a paying Pro AI
// subscriber while the paid period runs, and a $499 Lifetime bought on or after
// LIFETIME_AI_FROM (launch day) that was not refunded or disputed (the webhook
// clears lifetimePurchasedAt then). Both get the same $2.50 a month. Nobody else
// reaches the coach or any AI call: not the old one-time Pro, not early Lifetime
// or a Lifetime bought before launch, not gifts or trials. Their gifts are
// announced later; until then they see the same locks as Free.
// Every AI route (guard.ts) and every AI call (run.ts) checks this, and the
// emails and calendar feed for Pro AI members use planFor too.
export const LIFETIME_AI_FROM = new Date('2026-11-28T00:00:00Z');

export interface ProAiAccess { plan: AiPlan; periodEnd: Date | null }

type ProfileRow = Pick<typeof profiles.$inferSelect,
  'subscriptionStatus' | 'stripeSubscriptionId' | 'subscriptionInterval' | 'currentPeriodEnd' | 'subscriptionExpiresAt' | 'lifetimePurchasedAt'>;

export function planFor(p: ProfileRow | undefined, now: Date = new Date()): ProAiAccess | null {
  if (!p) return null;
  if (p.subscriptionStatus === 'active' && p.stripeSubscriptionId && p.currentPeriodEnd && p.currentPeriodEnd.getTime() > now.getTime()) {
    return { plan: p.subscriptionInterval === 'year' ? 'yearly' : 'monthly', periodEnd: p.currentPeriodEnd };
  }
  if (p.subscriptionStatus === 'active' && p.lifetimePurchasedAt && p.lifetimePurchasedAt.getTime() >= LIFETIME_AI_FROM.getTime() && p.lifetimePurchasedAt.getTime() <= now.getTime()) {
    return { plan: 'lifetime', periodEnd: null };
  }
  return null;
}

// The only plans that may spend on AI. run.ts checks this again per call.
export const isSubscriberPlan = (a: ProAiAccess | null): a is ProAiAccess => !!a && (a.plan === 'monthly' || a.plan === 'yearly' || a.plan === 'lifetime');

export async function getProAiAccess(userId: string, now: Date = new Date()): Promise<ProAiAccess | null> {
  if (isDevProPreview()) return { plan: 'yearly', periodEnd: null };
  return planFor(await getProfileRow(userId), now);
}
