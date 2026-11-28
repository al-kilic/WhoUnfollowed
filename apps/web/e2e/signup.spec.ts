import { expect, test } from '@playwright/test';
import { sql } from './helpers/db';

// A new visitor creates an account and lands in Studio. Email isn't
// configured on the e2e server, so the address counts as verified straight
// away (the same as any install without an email provider).
test('sign up lands in Studio', async ({ page }) => {
  const email = `e2e-signup-${Date.now()}@example.test`;
  await page.goto('/signup');
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill('e2e-password-123');
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.waitForURL(/\/app(\/|$|\?)/);
  const [row] = await sql`select email_verified_at from users where email = ${email}`;
  expect(row?.email_verified_at).toBeTruthy();
});
