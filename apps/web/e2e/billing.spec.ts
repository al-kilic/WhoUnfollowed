import { expect, test } from '@playwright/test';
import { allowanceRows, createUser, profileOf, signIn } from './helpers/db';
import { sendEvent, subscription, topupSession } from './helpers/stripe';

const auth = (sessionId: string) => ({ cookie: `auth_session=${sessionId}` });

test('subscribe, cancel at period end, then the plan ends', async ({ page, context, request }) => {
  const user = await createUser('none');
  await signIn(context, user);
  // Free: the coach API is locked.
  expect((await request.get('/api/ai/state', { headers: auth(user.sessionId) })).status()).not.toBe(200);

  // Stripe: subscription created.
  expect(await sendEvent(request, 'customer.subscription.created', subscription(user))).toBe(200);
  expect((await profileOf(user.id)).subscription_status).toBe('active');
  expect((await request.get('/api/ai/state', { headers: auth(user.sessionId) })).status()).toBe(200);

  // Cancelled in the billing portal: active until the period end.
  expect(await sendEvent(request, 'customer.subscription.updated', subscription(user, { cancelAtPeriodEnd: true }))).toBe(200);
  expect((await profileOf(user.id)).cancel_at).toBeTruthy();
  await page.goto('/app/you#billing');
  await expect(page.getByText(/It won.t renew\./).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Keep my plan' }).first()).toBeVisible();

  // The period ends.
  expect(await sendEvent(request, 'customer.subscription.deleted', subscription(user, { status: 'canceled' }))).toBe(200);
  expect((await profileOf(user.id)).subscription_status).toBe('cancelled');
  expect((await request.get('/api/ai/state', { headers: auth(user.sessionId) })).status()).not.toBe(200);
});

test('a subscriber cannot start a second subscription', async ({ request }) => {
  const user = await createUser('monthly');
  const res = await request.post('/api/stripe/checkout', { data: { plan: 'pro_ai', billing: 'monthly', locale: 'en' }, headers: auth(user.sessionId) });
  expect(res.status()).toBe(409);
  expect((await res.json()).error).toBe('already_subscribed');
});

test('a paid refill shows in Monthly use, and the return page does not loop', async ({ page, context, request }) => {
  const user = await createUser('monthly');
  await signIn(context, user);
  expect(await sendEvent(request, 'checkout.session.completed', topupSession(user))).toBe(200);
  expect((await allowanceRows(user.id)).filter((r) => r.kind === 'refill')).toHaveLength(1);

  // Coming back from Stripe: one refresh, never a loop.
  let stateCalls = 0;
  page.on('request', (r) => { if (r.url().includes('/api/ai/state')) stateCalls++; });
  await page.goto('/app/you/credits?topup=1');
  await expect(page.getByText(/Refill ready, valid until/)).toBeVisible();
  await expect(page).not.toHaveURL(/topup=1/);
  const after = stateCalls;
  await page.waitForTimeout(8_000); // the old bug refreshed every 3 seconds
  expect(stateCalls - after).toBeLessThanOrEqual(2);
});
