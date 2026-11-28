import { expect, test } from '@playwright/test';

// The homepage's coach phone after coming back from Studio. Studio's CSS
// stays in the page after a client-side navigation, and its phone preview
// rules (.ig-img at 390px, .ig-dots absolute) used to be global: the post
// photo ran past the phone frame and the dots and counter disappeared.
test('homepage phone keeps its photo inside the frame after visiting Studio', async ({ page }) => {
  await page.setViewportSize({ width: 1470, height: 842 });
  await page.goto('/app');
  await page.locator('a[href="/"]:visible').first().click();
  await page.waitForURL((u) => u.pathname === '/');
  const phone = page.locator('#phone');
  await phone.scrollIntoViewIfNeeded();
  const box = await phone.evaluate((el) => {
    const p = el.getBoundingClientRect();
    const img = el.querySelector('.ig-img')!.getBoundingClientRect();
    const pad = parseFloat(getComputedStyle(el).paddingRight);
    return { overflow: img.right - (p.right - pad), dots: getComputedStyle(el.querySelector('#igd')!).position };
  });
  expect(box.overflow).toBeLessThanOrEqual(1);
  expect(box.dots).toBe('static');
});
