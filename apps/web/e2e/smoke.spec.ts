import { expect, test } from '@playwright/test';
import { createUser, signIn } from './helpers/db';

// The e2e server is up, on its own database, with mocked AI.
test('health and a signed-in Studio page', async ({ page, context, request }) => {
  expect((await request.get('/api/health')).ok()).toBe(true);
  const user = await createUser('monthly');
  await signIn(context, user);
  await page.goto('/app/today');
  await expect(page.getByRole('link', { name: /Today/ }).first()).toBeVisible();
  const state = await request.get('/api/ai/state', { headers: { cookie: `auth_session=${user.sessionId}` } });
  expect(state.status()).toBe(200);
});
