import { expect, test } from '@playwright/test';
import { COMBINED_ZIP } from './global-setup';
import { createUser, onboard, signIn, sql } from './helpers/db';
import { seedExportStats } from './helpers/upload';

// One goal per platform: set Instagram and Threads, switch, remove one.
test('goals per platform', async ({ page, context, request }) => {
  const user = await createUser('monthly');
  await onboard(user.id);
  await signIn(context, user);
  expect(await seedExportStats(request, user, COMBINED_ZIP)).toEqual(['instagram', 'threads']);

  const switcher = page.getByRole('group', { name: 'Platform' });
  const setGoal = async (target: string) => {
    await page.getByRole('dialog').getByRole('textbox').or(page.locator('#goal-target')).first().fill(target);
    await page.getByRole('button', { name: 'Save goal' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
  };

  await page.goto('/app/plan/goals');
  // Instagram first.
  await expect(switcher.getByRole('button', { name: 'Instagram' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: /Set (a|an|your) (Instagram )?goal/i }).first().click();
  await setGoal('2000');

  await switcher.getByRole('button', { name: 'Threads' }).click();
  await expect(page.getByText('No Threads goal yet')).toBeVisible();
  await page.getByRole('button', { name: 'Set a Threads goal' }).click();
  await setGoal('500');

  let rows = await sql`select platform, target from ai_goals where user_id = ${user.id} order by platform`;
  expect(rows.map((r) => `${r.platform}:${r.target}`)).toEqual(['instagram:2000', 'threads:500']);

  // Remove the Instagram goal; Threads stays.
  await switcher.getByRole('button', { name: 'Instagram' }).click();
  await page.getByRole('button', { name: 'Remove goal' }).first().click();
  await page.getByRole('dialog').getByRole('button', { name: 'Remove goal' }).click();
  await expect(page.getByText('No Instagram goal yet')).toBeVisible();
  rows = await sql`select platform from ai_goals where user_id = ${user.id}`;
  expect(rows.map((r) => r.platform)).toEqual(['threads']);
});
