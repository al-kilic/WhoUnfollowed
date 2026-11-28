import { expect, test } from '@playwright/test';
import { createUser, onboard, signIn, useUpMonth } from './helpers/db';

// Visiting a Portuguese page and then the English site leaves the app in
// English (the language cookie follows the last prefixed visit).
test('language returns to English after visiting /en', async ({ page, context }) => {
  const localeCookie = async () => (await context.cookies()).find((c) => c.name === 'NEXT_LOCALE')?.value;
  // Signed out first: a signed-in member is moved to the language saved on
  // their profile, which is a different (intended) behaviour.
  await page.goto('/pt');
  await expect.poll(localeCookie).toBe('pt');
  await page.goto('/en');
  await expect.poll(localeCookie).toBe('en');
  const user = await createUser('monthly');
  await signIn(context, user);
  await page.goto('/app/today');
  await expect(page.getByRole('link', { name: 'Ask coach' }).first()).toBeAttached();
  expect(page.url()).not.toMatch(/\/pt\//);
});

// A used-up month: Ask coach says so and offers a refill; nothing is charged.
test('used-up month shows the message and the refill offer', async ({ page, context, request }) => {
  const user = await createUser('monthly');
  await onboard(user.id);
  await signIn(context, user);
  // The month grant is created on the first Pro AI request.
  expect((await request.get('/api/ai/state', { headers: { cookie: `auth_session=${user.sessionId}` } })).status()).toBe(200);
  expect(await useUpMonth(user.id)).toBe(1);
  await page.goto('/app/ask');
  await expect(page.getByText(/You.ve used this month.s coach\./).first()).toBeVisible();
  await expect(page.getByText(/refill a full month for half price/i).first()).toBeVisible();
  const res = await request.post('/api/ai/chat', { data: { messages: [{ role: 'user', text: 'Hi' }], deep: false, locale: 'en', platform: 'instagram' }, headers: { cookie: `auth_session=${user.sessionId}` } });
  expect(res.status()).toBe(402);
});
