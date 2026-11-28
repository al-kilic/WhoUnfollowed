import 'server-only';
import { eq, isNotNull, or } from 'drizzle-orm';
import { hasLocale } from 'next-intl';
import { db } from '@/lib/db/index';
import { aiAllowance, profiles, users } from '@/lib/db/schema';
import { routing, type AppLocale } from '@/i18n/routing';
import { grantGift } from '@/lib/ai/allowance';
import { EARLY_LIFETIME_GIFT_USD, LEGACY_TRIAL_USD } from '@/lib/ai/allowanceMath';
import { EARLY_LIFETIME_BEFORE, boughtYearlyUnlock, launchOfferEndsAt } from '@/lib/launchOffers';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { sendEmail, isEmailConfigured } from './send';
import { earlyLifetimeEmail, legacyProEmail, launchEmailKind, type LaunchCandidate, type LaunchEmailKind } from './launchEmails';

// The one-time launch emails (see launchEmails.ts). Dry run by default: it
// counts recipients and renders one sample per kind and locale, and changes
// nothing. With send=true it, for each recipient, in order:
//   1. grants the gift (early Lifetime) or trial (old Pro), idempotent on the
//      same source id the allowance engine uses, so nobody gets it twice;
//   2. skips anyone already emailed (a zero, already-expired marker row in
//      ai_allowance with source email:launch:<kind>:<user>, which never counts
//      as allowance), sends, and writes that marker only after a successful send.
// Rate-limited for Resend and capped per run, so a big list goes over several runs.

const SEND_GAP_MS = 600; // Resend allows about 2 requests a second
export const DEFAULT_RUN_LIMIT = 80;

const markerSource = (kind: LaunchEmailKind, userId: string) => `email:launch:${kind}:${userId}`;
const giftSource = (kind: LaunchEmailKind, userId: string) => (kind === 'early_lifetime' ? `gift:early-lifetime:${userId}` : `trial:legacy-pro:${userId}`);

interface Row extends LaunchCandidate { locale: string | null; stripeCustomerId: string | null }

export interface LaunchRunReport {
  mode: 'dry_run' | 'send';
  recipients: { early_lifetime: number; legacy_pro: number; legacy_pro_yearly: number };
  alreadySent: number;
  sent: number;
  failed: { userId: string; error: string }[];
  granted: number;
  leftForNextRun: number;
  samples: { kind: LaunchEmailKind; locale: AppLocale; yearly: boolean; subject: string; text: string }[];
}

const localeOf = (l: string | null): AppLocale => (hasLocale(routing.locales, l) ? l : routing.defaultLocale);
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function runLaunchEmails(opts: { send: boolean; limit?: number; now?: Date }): Promise<LaunchRunReport> {
  const now = opts.now ?? new Date();
  const limit = Math.max(1, Math.min(opts.limit ?? DEFAULT_RUN_LIMIT, 500));
  const offerEnds = launchOfferEndsAt();
  const offerOpenOrAhead = now < offerEnds;

  const rows: Row[] = await db.select({
    userId: users.id, email: users.email, locale: profiles.locale, stripeCustomerId: profiles.stripeCustomerId,
    lifetimePurchasedAt: profiles.lifetimePurchasedAt, subscriptionExpiresAt: profiles.subscriptionExpiresAt, marketingOptOutAt: profiles.marketingOptOutAt,
  }).from(profiles).innerJoin(users, eq(users.id, profiles.userId))
    .where(or(isNotNull(profiles.lifetimePurchasedAt), isNotNull(profiles.subscriptionExpiresAt)));

  const sentMarkers = new Set((await db.select({ source: aiAllowance.source }).from(aiAllowance)).map((r) => r.source).filter((s): s is string => !!s && s.startsWith('email:launch:')));

  const report: LaunchRunReport = { mode: opts.send ? 'send' : 'dry_run', recipients: { early_lifetime: 0, legacy_pro: 0, legacy_pro_yearly: 0 }, alreadySent: 0, sent: 0, failed: [], granted: 0, leftForNextRun: 0, samples: [] };
  const sampled = new Set<string>();
  const stripe = isStripeConfigured() ? getStripe() : null;
  let budget = limit;

  for (const r of rows) {
    const kind = launchEmailKind(r, EARLY_LIFETIME_BEFORE);
    if (!kind) continue;
    report.recipients[kind]++;
    if (sentMarkers.has(markerSource(kind, r.userId))) { report.alreadySent++; continue; }
    if (opts.send && budget <= 0) { report.leftForNextRun++; continue; }

    const locale = localeOf(r.locale);
    const yearly = kind === 'legacy_pro' && offerOpenOrAhead && !!stripe && await boughtYearlyUnlock(stripe, { customerId: r.stripeCustomerId, email: r.email });
    if (yearly) report.recipients.legacy_pro_yearly++;
    const mail = kind === 'early_lifetime'
      ? earlyLifetimeEmail({ locale })
      : legacyProEmail({ locale, proUntil: r.subscriptionExpiresAt, yearlyOfferEndsAt: yearly ? offerEnds : null, now });

    const sampleKey = `${kind}:${locale}:${yearly}`;
    if (!sampled.has(sampleKey)) { sampled.add(sampleKey); report.samples.push({ kind, locale, yearly, subject: mail.subject, text: mail.text ?? '' }); }
    if (!opts.send) continue;

    budget--;
    // The gift comes first, so the email never promises something that is not there.
    if (await grantGift(r.userId, kind === 'early_lifetime' ? 'gift' : 'trial', kind === 'early_lifetime' ? EARLY_LIFETIME_GIFT_USD : LEGACY_TRIAL_USD, giftSource(kind, r.userId))) report.granted++;
    const res = await sendEmail({ to: r.email!, subject: mail.subject, html: mail.html, text: mail.text });
    if (res.ok) {
      report.sent++;
      await db.insert(aiAllowance).values({ userId: r.userId, kind: 'gift', usd: 0, usedUsd: 0, source: markerSource(kind, r.userId), expiresAt: new Date(0) }).onConflictDoNothing();
    } else {
      report.failed.push({ userId: r.userId, error: res.error });
    }
    await wait(SEND_GAP_MS);
  }
  return report;
}

export const launchEmailsReady = () => isEmailConfigured();
