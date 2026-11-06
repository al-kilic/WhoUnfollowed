import 'server-only';
import { randomBytes } from 'crypto';
import { and, asc, eq, isNotNull, lte } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { unfollowPlans, users } from '@/lib/db/schema';
import type { Platform } from '@ig-tracker/core';
import type { AppLocale } from '@/i18n/routing';
import { plannerNextAt, type PlannerCadence } from './schedule';

// Server side of the unfollow planner: counts only. The usernames stay in the
// browser; this exists so the weekly or daily nudge email knows how many are
// left.

export interface PlanSync {
  userId: string;
  platform: Platform;
  total: number;
  done: number;
  perDay: number;
  cadence: PlannerCadence;
  locale: AppLocale;
}

export async function upsertPlan(p: PlanSync, now: Date = new Date()): Promise<void> {
  const existing = await db.query.unfollowPlans.findFirst({
    where: and(eq(unfollowPlans.userId, p.userId), eq(unfollowPlans.platform, p.platform)),
  });
  // A new plan or a cadence change restarts the clock; progress updates keep it.
  const keepClock = existing && existing.cadence === p.cadence && existing.nextAt && p.done < p.total;
  const nextAt = keepClock ? existing.nextAt : plannerNextAt({ cadence: p.cadence, total: p.total, done: p.done, from: now });
  const values = {
    total: p.total,
    done: p.done,
    perDay: p.perDay,
    cadence: p.cadence,
    locale: p.locale,
    nextAt: p.done >= p.total ? null : nextAt,
    updatedAt: now,
  };
  if (existing) {
    await db.update(unfollowPlans).set(values)
      .where(and(eq(unfollowPlans.userId, p.userId), eq(unfollowPlans.platform, p.platform)));
  } else {
    await db.insert(unfollowPlans).values({ userId: p.userId, platform: p.platform, token: randomBytes(24).toString('base64url'), ...values });
  }
}

export async function deletePlan(userId: string, platform: Platform): Promise<void> {
  await db.delete(unfollowPlans).where(and(eq(unfollowPlans.userId, userId), eq(unfollowPlans.platform, platform)));
}

// Turns emails off for the plan behind a token. Idempotent.
export async function disablePlannerByToken(token: string): Promise<boolean> {
  if (!token || token.length > 64) return false;
  const row = await db.query.unfollowPlans.findFirst({ where: eq(unfollowPlans.token, token) });
  if (!row) return false;
  await db.update(unfollowPlans).set({ cadence: 'off', nextAt: null }).where(eq(unfollowPlans.token, token));
  return true;
}

export async function duePlans(now: Date, limit: number) {
  return db
    .select({ plan: unfollowPlans, email: users.email })
    .from(unfollowPlans)
    .innerJoin(users, eq(users.id, unfollowPlans.userId))
    .where(and(isNotNull(unfollowPlans.nextAt), lte(unfollowPlans.nextAt, now)))
    .orderBy(asc(unfollowPlans.nextAt))
    .limit(limit);
}

export type DuePlan = Awaited<ReturnType<typeof duePlans>>[number];
