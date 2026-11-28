import { expect, test, type APIRequestContext } from '@playwright/test';
import { IG_ZIP } from './global-setup';
import { createUser, onboard, signIn } from './helpers/db';
import { seedExportStats } from './helpers/upload';

type Item = { day: number; idea: string; posted: boolean };
const calendar = async (request: APIRequestContext, cookie: string): Promise<Item[]> =>
  ((await (await request.get('/api/ai/content?kind=plan', { headers: { cookie } })).json()) as { plan: { calendar: Item[] } | null }).plan?.calendar ?? [];

// Drag a post to an empty day; the move is saved and survives a reload; Undo
// puts it back.
test('drag and drop on the 30-day calendar', async ({ page, context, request }) => {
  const user = await createUser('monthly');
  const cookie = `auth_session=${user.sessionId}`;
  await onboard(user.id);
  await signIn(context, user);
  await seedExportStats(request, user, IG_ZIP);
  const made = await request.post('/api/ai/plan', { data: { postsPerWeek: 3, platform: 'instagram', locale: 'en' }, headers: { cookie } });
  expect(made.status()).toBe(200);

  const before = await calendar(request, cookie);
  const mover = before.find((i) => !i.posted)!;
  const taken = new Set(before.map((i) => i.day));
  await page.goto('/app/plan');
  const source = page.locator(`[data-day="${mover.day}"]`).first();
  await expect(source).toBeVisible();
  // An empty day that is on screen.
  const emptyDays = await page.locator('[data-day].emp').evaluateAll((els) => els.map((e) => Number(e.getAttribute('data-day'))));
  const target = emptyDays.find((d) => !taken.has(d) && d !== mover.day)!;
  const dest = page.locator(`[data-day="${target}"]`).first();

  const a = (await source.boundingBox())!;
  const b = (await dest.boundingBox())!;
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + a.width / 2 + 10, a.y + a.height / 2 + 10, { steps: 3 });
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 12 });
  await page.mouse.up();
  await expect(page.getByText(/^Moved to /).first()).toBeVisible();

  await expect.poll(async () => (await calendar(request, cookie)).find((i) => i.idea === mover.idea)?.day).toBe(target);
  await page.reload();
  await expect(page.locator(`[data-day="${target}"]`).first()).not.toHaveClass(/\bemp\b/);

  // Undo after a fresh move.
  const again = page.locator(`[data-day="${target}"]`).first();
  const c = (await again.boundingBox())!;
  const back = (await page.locator(`[data-day="${mover.day}"]`).first().boundingBox())!;
  await page.mouse.move(c.x + c.width / 2, c.y + c.height / 2);
  await page.mouse.down();
  await page.mouse.move(c.x + c.width / 2 + 10, c.y + c.height / 2 + 10, { steps: 3 });
  await page.mouse.move(back.x + back.width / 2, back.y + back.height / 2, { steps: 12 });
  await page.mouse.up();
  await expect(page.getByText(/^Moved to /).first()).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect.poll(async () => (await calendar(request, cookie)).find((i) => i.idea === mover.idea)?.day).toBe(target);
});
