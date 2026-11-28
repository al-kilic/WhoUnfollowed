import { expect, test } from '@playwright/test';
import { createUser, onboard, signIn } from './helpers/db';

// Today: the greeting uses the name from You > profile; Create rows are flush
// left; Since your last export shows both states; the goal card reveals more
// detail as its cell widens (sample mode has two exports and a goal).
test('today greets by name and the redesigned cards render', async ({ page, context }) => {
  const user = await createUser('monthly');
  await onboard(user.id);
  await signIn(context, user);

  // Name: set in You > profile, then Today greets with it.
  await page.goto('/app/you');
  await page.getByLabel('Your name').fill('  Alan ');
  await page.getByRole('button', { name: 'Save' }).first().click();
  await expect(page.getByRole('button', { name: 'Saved' })).toBeVisible();

  // Sample mode: two exports (filled ledger) and an Instagram goal.
  await page.goto('/app/today?sample=1');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/^(Good morning|Good afternoon|Good evening), Alan$/);

  // Create rows: icon and label start at the left edge.
  const offsets = await page.locator('.s-act-l').evaluateAll((els) => els.map((a) => {
    const icon = a.querySelector('svg')!;
    return Math.round(icon.getBoundingClientRect().left - a.getBoundingClientRect().left);
  }));
  expect(offsets.length).toBe(3);
  for (const o of offsets) expect(o).toBeLessThan(24);

  // Since your last export: net change, the bar and both columns.
  const since = page.locator('.s-since');
  await expect(since.locator('.s-sn-net')).toHaveText(/^[+-]?\d/);
  await expect(since.getByRole('img', { name: /joined and .* left/ })).toBeVisible();
  // Each column head reads like "Joined 113" (the count is a <b>).
  await expect(since.getByText(/^Joined\s*\d/)).toBeVisible();
  await expect(since.getByText(/^Left\s*\d/)).toBeVisible();

  // Goal: small hides the details; a wide cell shows pace and projection.
  const goal = page.locator('.s-goalw');
  await expect(goal.locator('.s-g-arc')).toBeVisible();
  await goal.evaluate((g) => { (g.closest('.s-cell') as HTMLElement).style.gridColumn = '1 / -1'; });
  await expect(goal.getByText('Your pace')).toBeVisible();
  await expect(goal.getByText('At this pace')).toBeVisible();
});

test('today greets neutrally without a name', async ({ page, context }) => {
  const user = await createUser('monthly');
  await onboard(user.id);
  await signIn(context, user);
  await page.goto('/app/today?sample=1');
  // The neutral greeting without a name.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/^(Good morning|Good afternoon|Good evening)$/);
});
