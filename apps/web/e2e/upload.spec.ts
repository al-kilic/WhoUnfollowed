import { expect, test } from '@playwright/test';
import { COMBINED_ZIP, IG_ZIP } from './global-setup';
import { uploadFromHome } from './helpers/upload';

const switcher = (page: import('@playwright/test').Page) => page.getByRole('group', { name: /platform/i }).first();

test('an Instagram export opens Results on Instagram', async ({ page }) => {
  await uploadFromHome(page, IG_ZIP);
  await expect(switcher(page).getByRole('button', { name: 'Instagram' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText(/doesn.t follow you back on Instagram|don.t follow you back on Instagram/i)).toBeVisible();
});

test('one ZIP with Instagram and Threads shows both, and survives a reload', async ({ page }) => {
  await uploadFromHome(page, COMBINED_ZIP);
  // Instagram first.
  await expect(switcher(page).getByRole('button', { name: 'Instagram' })).toHaveAttribute('aria-pressed', 'true');
  // Threads from the same ZIP.
  await switcher(page).getByRole('button', { name: 'Threads' }).click();
  await expect(page.getByText('@th_nofollowback')).toBeVisible();
  // Reload: both platforms are still saved in this browser, Instagram first.
  await page.reload();
  await expect(switcher(page).getByRole('button', { name: 'Instagram' })).toHaveAttribute('aria-pressed', 'true');
  await switcher(page).getByRole('button', { name: 'Threads' }).click();
  await expect(page.getByText('@th_nofollowback')).toBeVisible();
});
