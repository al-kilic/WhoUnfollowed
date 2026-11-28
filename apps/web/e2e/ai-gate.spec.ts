import { expect, test } from '@playwright/test';
import { allowanceRows, createUser, onboard, sql, type Plan } from './helpers/db';

// Founder rule (2026-11-27, Lifetime added 2026-11-28): only a paying Pro AI
// subscriber, or a $499 Lifetime bought from launch day, reaches any AI call.
// Free, old one-time Pro and Lifetime bought before launch get 403 from every
// paid action, nothing is granted to them, and nothing is logged as spend.
const PAID_ACTIONS: { path: string; data: Record<string, unknown> }[] = [
  { path: '/api/ai/chat', data: { messages: [{ role: 'user', text: 'Hi' }], deep: false, locale: 'en', platform: 'instagram' } },
  { path: '/api/ai/draft', data: { locale: 'en', platform: 'instagram', topic: 'x' } },
  { path: '/api/ai/ideas', data: { locale: 'en', platform: 'instagram' } },
  { path: '/api/ai/check', data: { locale: 'en', platform: 'instagram', caption: 'x' } },
  { path: '/api/ai/plan', data: { locale: 'en', platform: 'instagram' } },
  { path: '/api/ai/read', data: { locale: 'en', platform: 'instagram' } },
];

for (const plan of ['none', 'legacy', 'lifetime', 'earlyLifetime', 'lifetimeBeforeLaunch'] satisfies Plan[]) {
  test(`no AI for ${plan}`, async ({ request }) => {
    const user = await createUser(plan);
    await onboard(user.id);
    const headers = { cookie: `auth_session=${user.sessionId}` };
    expect((await request.get('/api/ai/state', { headers })).status()).toBe(403);
    for (const a of PAID_ACTIONS) {
      const res = await request.post(a.path, { data: a.data, headers });
      expect(res.status(), a.path).toBe(403);
    }
    expect(await allowanceRows(user.id)).toHaveLength(0);
    const [spend] = await sql`select count(*)::int as n from ai_usage_log where user_id = ${user.id}`;
    expect(spend?.n).toBe(0);
  });
}

test('a Pro AI subscriber still gets an answer', async ({ request }) => {
  const user = await createUser('monthly');
  await onboard(user.id);
  const headers = { cookie: `auth_session=${user.sessionId}` };
  const res = await request.post('/api/ai/chat', { data: PAID_ACTIONS[0]!.data, headers });
  expect(res.status()).toBe(200);
});

test('a Lifetime bought from launch day gets an answer and one $2.50 month', async ({ request }) => {
  const user = await createUser('lifetimeAi');
  await onboard(user.id);
  const headers = { cookie: `auth_session=${user.sessionId}` };
  const res = await request.post('/api/ai/chat', { data: PAID_ACTIONS[0]!.data, headers });
  expect(res.status()).toBe(200);
  const rows = await allowanceRows(user.id);
  expect(rows).toHaveLength(1);
  expect(Number(rows[0]!.usd)).toBeCloseTo(2.5);
});
