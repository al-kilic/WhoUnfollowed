import { expect, test } from '@playwright/test';
import { BIG_ZIP } from './global-setup';
import { uploadFromHome } from './helpers/upload';

test('the Results list scrolls and loads more inside its card, not the page', async ({ page }) => {
  await uploadFromHome(page, BIG_ZIP);
  const box = page.locator('.s-rscroll');
  await expect(box).toBeVisible();
  await expect(page.getByText('Showing 30 of 130')).toBeVisible();
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  // Scroll the box itself to its bottom: more rows load inside it.
  await box.evaluate((el) => { el.scrollTop = el.scrollHeight; });
  await expect(page.getByText('Showing 60 of 130')).toBeVisible();
  await expect.poll(() => box.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
  // The page itself didn't grow with the extra rows.
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(pageHeight + 4);
});

test('usernames link to the profile in a new tab, with no separate Profile button', async ({ page }) => {
  await uploadFromHome(page, BIG_ZIP);
  const link = page.locator('.s-rscroll a.s-ulink').first();
  await expect(link).toHaveAttribute('href', /^https:\/\/www\.instagram\.com\/noback_\d{3}$/);
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);
  await expect(page.locator('.s-rscroll .s-prof')).toHaveCount(0);
});

test('Radar People: Requests waiting jumps to the pending requests card', async ({ page }) => {
  await uploadFromHome(page, BIG_ZIP);
  await page.goto('/app/radar/people');
  const tile = page.getByRole('button', { name: /Requests waiting/i });
  await expect(tile).toBeVisible();
  await tile.click();
  const card = page.locator('#pending-requests');
  await expect(card).toBeFocused();
  await expect(card).toBeInViewport();
  await expect(card.getByRole('heading', { name: /sent, not accepted/i })).toBeVisible();
});

test('the export note explains why people can be missing and hides for this export only', async ({ page }) => {
  await uploadFromHome(page, BIG_ZIP);
  const note = page.locator('.s-xnote');
  await expect(note).toBeVisible();
  await expect(note).toContainText("Instagram's own export");
  await note.getByRole('button', { name: 'Why' }).click();
  await expect(note.getByText('Scheduled exports', { exact: true })).toBeVisible();
  await note.getByRole('button', { name: 'Hide for this export' }).click();
  await expect(note).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.s-xnote')).toHaveCount(0);
});

test('Deactivated can be marked from a row and filtered, and the how-to line is gone', async ({ page }) => {
  await uploadFromHome(page, BIG_ZIP);
  await expect(page.getByText(/For each account pick Keep or To unfollow/)).toHaveCount(0);
  const row = page.locator('.s-rr').first();
  await row.getByRole('button', { name: 'Deactivated' }).click();
  await expect(row.getByRole('button', { name: 'Deactivated' })).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.s-chip2', { hasText: 'Deactivated' }).click();
  await expect(page.getByText('Showing 1 of 1')).toBeVisible();
});

test('a triage button explains itself after a short hover', async ({ page }) => {
  await uploadFromHome(page, BIG_ZIP);
  await page.locator('.s-rr').first().getByRole('button', { name: 'Keep' }).hover();
  await expect(page.getByTestId('hint')).toContainText('unfollow queue', { timeout: 3000 });
});
