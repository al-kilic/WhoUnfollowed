import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { aiProfiles, profiles, syncSettings } from '@/lib/db/schema';
import { isProUser } from '@/lib/flags';
import { isDevProPreview, devPreviewProfile } from '@/lib/auth/devProPreview';
import { getReminderStateForUser } from '@/lib/reminders/store';
import { getProAiAccess } from '@/lib/ai/access';
import type { AiPlan } from '@/lib/ai/config';

// What You > Settings shows about the signed-in account: plan, billing,
// sync, reminders and the coach profile. Dates are ISO strings so the result
// can go straight to client components.
export interface AccountSummary {
  email: string;
  displayName: string | null;
  memberSince: string | null;
  isPro: boolean;
  isInsider: boolean;
  hasProAi: boolean;
  plan: AiPlan | null;
  isSubscriber: boolean;
  periodEnd: string | null;
  // Set when the subscription was cancelled and stops on this date.
  cancelAt: string | null;
  proUntil: string | null;
  status: string;
  graceEndsAt: string | null;
  sync: { on: boolean; since: string | null };
  reminderNextAt: string | null;
  marketingOptIn: boolean;
  coach: { accountType: string | null; niche: string | null; goal: string | null } | null;
}

const iso = (d: Date | null | undefined) => (d ? new Date(d).toISOString() : null);

export async function getAccountSummary(user: { id: string; email: string }): Promise<AccountSummary> {
  const preview = isDevProPreview();
  const [profile, syncRow, isPro, ai] = await Promise.all([
    preview ? Promise.resolve(devPreviewProfile()) : db.query.profiles.findFirst({ where: eq(profiles.userId, user.id) }),
    preview ? Promise.resolve(undefined) : db.query.syncSettings.findFirst({ where: eq(syncSettings.userId, user.id) }),
    isProUser(),
    db.query.aiProfiles.findFirst({ where: eq(aiProfiles.userId, user.id) }).catch(() => undefined),
  ]);
  const reminder = preview ? undefined : await getReminderStateForUser(user.id, user.email).catch(() => undefined);
  // Same access the coach uses, so a lapsed old-Pro member with trial left, or
  // an early Lifetime member with gift left, sees the same plan here.
  const proAi = preview ? { plan: 'yearly' as const, periodEnd: null } : await getProAiAccess(user.id).catch(() => null);
  const isSubscriber = !!profile?.stripeSubscriptionId && (proAi?.plan === 'monthly' || proAi?.plan === 'yearly');
  return {
    email: user.email,
    displayName: profile && 'displayName' in profile ? profile.displayName ?? null : null,
    memberSince: iso(profile?.createdAt),
    isPro,
    // Lifetime purchase is the only Insider signal.
    isInsider: profile?.subscriptionStatus === 'active' && !!profile.lifetimePurchasedAt,
    hasProAi: !!proAi,
    plan: proAi?.plan ?? null,
    isSubscriber,
    periodEnd: isSubscriber ? iso(profile?.currentPeriodEnd) : null,
    cancelAt: isSubscriber ? iso(profile?.cancelAt) : null,
    proUntil: iso(profile?.subscriptionExpiresAt),
    status: profile?.subscriptionStatus ?? 'none',
    graceEndsAt: iso(profile?.gracePeriodEndsAt),
    sync: { on: !!syncRow, since: iso(syncRow?.passphraseSetAt) },
    reminderNextAt: reminder?.reminderNextAt && !reminder.reminderOptedOutAt ? reminder.reminderNextAt.toISOString() : null,
    marketingOptIn: profile?.marketingOptIn ?? false,
    coach: ai ? { accountType: ai.accountType, niche: ai.niche, goal: ai.goal } : null,
  };
}
