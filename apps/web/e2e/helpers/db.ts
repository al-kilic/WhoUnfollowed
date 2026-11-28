import { randomBytes, randomUUID } from 'node:crypto';
import postgres from 'postgres';
import type { BrowserContext } from '@playwright/test';
import { E2E_DATABASE_URL, E2E_URL } from '../env';

// Direct access to the e2e database (igtracker_e2e only), for seeding users in
// a given plan state and checking what the app stored.
export const sql = postgres(E2E_DATABASE_URL, { max: 4, onnotice: () => {} });

export type Plan = 'none' | 'monthly' | 'yearly' | 'lifetime' | 'earlyLifetime' | 'legacy' | 'lifetimeBeforeLaunch' | 'lifetimeAi';

export interface TestUser { id: string; email: string; sessionId: string; customerId: string; subscriptionId: string }

const DAY = 86_400_000;

export async function createUser(plan: Plan = 'none', opts: { locale?: string } = {}): Promise<TestUser> {
  const id = randomUUID();
  const tag = id.slice(0, 8);
  const email = `e2e-${tag}@example.test`;
  const sessionId = randomBytes(20).toString('hex');
  const customerId = `cus_e2e_${tag}`;
  const subscriptionId = `sub_e2e_${tag}`;
  // Not a usable password: tests sign in with a session row instead.
  await sql`insert into users (id, email, password_hash, email_verified_at) values (${id}, ${email}, ${'e2e-no-login'}, now())`;
  await sql`insert into sessions (id, user_id, expires_at) values (${sessionId}, ${id}, ${new Date(Date.now() + 30 * DAY)})`;
  const now = Date.now();
  const base = { user_id: id, locale: opts.locale ?? 'en' } as Record<string, unknown>;
  const fields: Record<Plan, Record<string, unknown>> = {
    none: { subscription_status: 'none' },
    monthly: { subscription_status: 'active', stripe_customer_id: customerId, stripe_subscription_id: subscriptionId, subscription_interval: 'month', current_period_end: new Date(now + 30 * DAY) },
    yearly: { subscription_status: 'active', stripe_customer_id: customerId, stripe_subscription_id: subscriptionId, subscription_interval: 'year', current_period_end: new Date(now + 365 * DAY) },
    lifetime: { subscription_status: 'none', lifetime_purchased_at: new Date('2026-11-20T10:00:00Z') },
    earlyLifetime: { subscription_status: 'none', lifetime_purchased_at: new Date('2026-10-01T10:00:00Z') },
    legacy: { subscription_status: 'active', subscription_expires_at: new Date(now + 120 * DAY) },
    // As the Lifetime webhook writes it: active, no expiry. Before launch day no
    // AI; from launch day (LIFETIME_AI_FROM, 2026-11-28) the same $2.50 a month.
    lifetimeBeforeLaunch: { subscription_status: 'active', lifetime_purchased_at: new Date('2026-11-27T10:00:00Z') },
    lifetimeAi: { subscription_status: 'active', lifetime_purchased_at: new Date(now - 60_000) },
  };
  const row = { ...base, ...fields[plan] };
  await sql`insert into profiles ${sql(row)}`;
  return { id, email, sessionId, customerId, subscriptionId };
}

// Signs the browser context in as the user (Lucia's session cookie).
export async function signIn(context: BrowserContext, user: TestUser): Promise<void> {
  await context.addCookies([{ name: 'auth_session', value: user.sessionId, url: E2E_URL, httpOnly: true, sameSite: 'Lax' }]);
}

export async function profileOf(userId: string): Promise<Record<string, unknown>> {
  const [row] = await sql`select * from profiles where user_id = ${userId}`;
  return row ?? {};
}

export async function allowanceRows(userId: string): Promise<Record<string, unknown>[]> {
  return sql`select kind, usd, used_usd, source, expires_at from ai_allowance where user_id = ${userId} order by created_at`;
}

// Marks this month's allowance as fully used (the month grant is created on
// the first Pro AI request, so call this after the page has loaded once).
export async function useUpMonth(userId: string): Promise<number> {
  const rows = await sql`update ai_allowance set used_usd = usd where user_id = ${userId} and kind = 'month' returning id`;
  return rows.length;
}

// Skips the coach's first-run questions (Studio onboarding).
export async function onboard(userId: string): Promise<void> {
  await sql`insert into ai_profiles (user_id, onboarded_at, account_type, niche, goal) values (${userId}, now(), 'creator', 'photography', 'grow')
    on conflict (user_id) do update set onboarded_at = now()`;
}
