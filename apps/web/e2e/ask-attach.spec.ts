import { expect, test } from '@playwright/test';
import { IG_ZIP } from './global-setup';
import { createUser, onboard, signIn } from './helpers/db';
import { uploadFromHome } from './helpers/upload';

// A small real PNG (8x8, teal), so the browser can resize it like a photo.
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAEUlEQVR4nGNgzMzHihiGlgQAF4M2QamPgGoAAAAASUVORK5CYII=', 'base64');

// Ask coach: attach an export report (numbers only) and a photo, then ask.
test('Ask coach sends an attached report and photo, never usernames', async ({ page, context }) => {
  const user = await createUser('monthly');
  await onboard(user.id);
  await signIn(context, user);
  await uploadFromHome(page, IG_ZIP);
  await page.goto('/app/ask');

  const add = page.getByRole('button', { name: 'Add to your question' });
  await add.click();
  await page.getByRole('menuitem', { name: /An export report/ }).click();
  await page.getByRole('menuitem', { name: /Instagram ·/ }).first().click();
  await expect(page.getByText(/Instagram export,/)).toBeVisible();

  await page.locator('.s-att input[type="file"]').setInputFiles({ name: 'photo.png', mimeType: 'image/png', buffer: PNG });
  await expect(page.getByRole('img', { name: 'Photo 1' })).toBeVisible();

  const sent = page.waitForRequest((r) => r.url().endsWith('/api/ai/chat') && r.method() === 'POST');
  await page.getByRole('textbox').fill('What should I change?');
  await page.keyboard.press('Enter');
  const body = (await sent).postDataJSON() as { attachments?: { images: string[]; context: { kind: string; text: string }[] } };
  expect(body.attachments?.images).toHaveLength(1);
  expect(body.attachments?.images[0]).toMatch(/^data:image\/jpeg;base64,/);
  const report = body.attachments?.context.find((c) => c.kind === 'report');
  expect(report?.text).toContain('Followers:');
  // The fixture's accounts must never reach the coach.
  expect(report?.text).not.toMatch(/@|alice|bob|charlie|dave/i);
  // The mock coach answers, and the attachments are cleared for the next question.
  await expect(page.locator('.s-m.c .s-bub').last()).not.toBeEmpty({ timeout: 30_000 });
  await expect(page.getByRole('img', { name: 'Photo 1' })).toHaveCount(0);
});

// The server refuses a photo whose bytes are not the image type it claims.
test('chat refuses a fake image', async ({ request, context }) => {
  const user = await createUser('monthly');
  await onboard(user.id);
  await signIn(context, user);
  const res = await request.post('/api/ai/chat', {
    headers: { cookie: `auth_session=${user.sessionId}` },
    data: { messages: [{ role: 'user', text: 'Look at this' }], deep: false, locale: 'en', platform: 'instagram', attachments: { images: [`data:image/jpeg;base64,${PNG.toString('base64')}`], context: [] } },
  });
  expect(res.status()).toBe(400);
  expect((await res.json()).error).toBe('invalid_image');
});
