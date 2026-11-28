import { expect, test } from '@playwright/test';
import { createUser, onboard, signIn, sql } from './helpers/db';

// Posted: log a post in two taps, see where entries came from (a plan day),
// and get asked for the results of a post from a few days ago.
test('Posted: two-tap log, plan source and the results nudge', async ({ page, context }) => {
  const user = await createUser('monthly');
  await onboard(user.id);
  await signIn(context, user);
  // A plan post marked as posted on day 12, three days ago, without results.
  await sql`insert into ai_content_log (user_id, kind, format, topic, platform, posted_at, output)
    values (${user.id}, 'post', 'reel', 'Night tram in the rain', 'instagram', now() - interval '3 days', ${JSON.stringify({ planId: 'p-e2e', day: 12 })})`;

  await page.goto('/app/plan/posted');
  await expect(page.getByText('Plan, day 12')).toBeVisible();

  // The nudge asks about the reel and takes the numbers right there.
  await expect(page.getByText(/How did your reel from 3 days ago do\?/)).toBeVisible();
  await page.getByLabel('New followers').first().fill('14');
  await page.getByRole('button', { name: 'Save' }).first().click();
  await expect(page.getByText('+14 followers')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your rhythm' })).toBeVisible();

  // Two taps: open the form, pick Reel, Log it (title is optional).
  await page.getByRole('button', { name: 'Add post' }).click();
  await page.getByRole('radio', { name: /Reel/ }).click();
  await page.getByRole('button', { name: 'Log it' }).click();
  await expect(page.getByText('Added by you')).toBeVisible();
});
