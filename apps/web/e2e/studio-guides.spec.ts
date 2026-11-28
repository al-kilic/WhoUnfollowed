import { expect, test } from '@playwright/test';
import { createUser, onboard, signIn } from './helpers/db';

// Studio headers: an info button next to every title opens the page guide on
// hover, keyboard and tap; tabs explain themselves; Instagram-only sections
// show a badge instead of the old line under the title.
test.describe('Studio page guides', () => {
  test.beforeEach(async ({ context }) => {
    const user = await createUser('monthly');
    await onboard(user.id);
    await signIn(context, user);
  });

  test('info button opens and closes with hover, keyboard and click', async ({ page }) => {
    // Sample data: without an export Today and Radar show the empty state.
    for (const route of ['/app/today', '/app/radar/people', '/app/plan/goals']) {
      await page.goto(`${route}?sample=1`);
      const info = page.getByTestId('page-info');
      await expect(info).toBeVisible();
      // Hover.
      await info.hover();
      await expect(page.getByTestId('page-guide')).toBeVisible();
      await page.mouse.move(0, 0);
      await expect(page.getByTestId('page-guide')).toBeHidden();
      // Keyboard: focus opens, Escape closes.
      await info.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByTestId('page-guide')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByTestId('page-guide')).toBeHidden();
      // Click toggles (tap on touch).
      await info.click();
      await expect(page.getByTestId('page-guide')).toBeVisible();
      await page.locator('h1').first().click();
      await expect(page.getByTestId('page-guide')).toBeHidden();
    }
  });

  test('no page shows the old description line under the title', async ({ page }) => {
    for (const route of ['/app/today', '/app/results', '/app/history', '/app/ask', '/app/create', '/app/you']) {
      await page.goto(route);
      await expect(page.locator('header.s-top p')).toHaveCount(0);
    }
  });

  test('section tabs explain themselves and Instagram-only sections show the badge', async ({ page }) => {
    await page.goto('/app/create');
    await expect(page.getByTestId('ig-only')).toBeVisible();
    await expect(page.locator('.s-scope')).toHaveCount(0);
    const tab = page.getByRole('navigation', { name: 'Create' }).getByRole('link', { name: 'Ideas' });
    await tab.hover();
    await expect(page.getByTestId('hint')).toBeVisible({ timeout: 3000 });

    await page.goto('/app/plan/goals');
    await expect(page.getByTestId('ig-only')).toHaveCount(0);
  });
});
