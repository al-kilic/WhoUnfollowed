import { expect, test, type Page } from '@playwright/test';
import { IG_ZIP } from './global-setup';
import { createUser, onboard, signIn } from './helpers/db';
import { seedExportStats } from './helpers/upload';

// A tiny valid PNG; the page resizes it in the browser before sending.
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
const photos = (tag: string) => [1, 2, 3].map((n) => ({ name: `${tag}-${n}.png`, mimeType: 'image/png', buffer: PNG }));

async function analyzeByHand(page: Page, tag: string): Promise<void> {
  await page.getByRole('button', { name: 'Add photos by hand instead' }).click();
  await page.locator('input[type="file"][accept="image/*"]').first().setInputFiles(photos(tag));
  // Different numbers per run: the server refuses an identical request twice
  // within a few minutes (uploadGuard), and the test photos are identical.
  await page.getByRole('textbox', { name: 'Likes' }).first().fill(String(tag.length * 10));
  await page.getByRole('button', { name: 'Analyze my posts' }).click();
  await expect(page.getByRole('heading', { name: 'Your posts, ranked' })).toBeVisible();
}

// First visit: the promise, one obvious action and a labelled example.
// After a run: ranked image cards, a New analysis button, and earlier runs one
// tap away, also after leaving the page.
test('Photo insights: first run, history and the way back', async ({ page, context, request }) => {
  const user = await createUser('monthly');
  await onboard(user.id);
  await signIn(context, user);
  await seedExportStats(request, user, IG_ZIP);

  await page.goto('/app/plan/insights');
  await expect(page.getByRole('heading', { name: /Find out which of your photos grow your account/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Analyze my posts' })).toBeVisible();
  await expect(page.getByText('Example', { exact: true }).first()).toBeVisible();

  await analyzeByHand(page, 'first');
  await expect(page.getByText('Worked', { exact: true }).first()).toBeVisible();

  await page.goto('/app/today');
  await page.goto('/app/plan/insights');
  await expect(page.getByRole('heading', { name: 'Your posts, ranked' })).toBeVisible();
  await expect(page.getByRole('group', { name: 'Your analyses' })).toBeVisible();

  await page.getByRole('button', { name: 'New analysis' }).click();
  await expect(page.getByRole('button', { name: 'Back to your analyses' })).toBeVisible();
  await analyzeByHand(page, 'second');
  await expect(page.getByRole('group', { name: 'Your analyses' }).getByRole('button')).toHaveCount(2);
});
