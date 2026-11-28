import { expect, test } from '@playwright/test';
import { IG_ZIP } from './global-setup';
import { createUser, onboard, signIn } from './helpers/db';
import { seedExportStats } from './helpers/upload';

// Plan > Add to my calendar: the member gets a private feed link once, the
// feed returns the plan's posts as calendar events, and turning the link off
// (or making a new one) stops the old URL at once.
test('plan calendar feed: subscribe, events, rotate and revoke', async ({ page, context, request }) => {
  const user = await createUser('monthly');
  const cookie = `auth_session=${user.sessionId}`;
  await onboard(user.id);
  await signIn(context, user);
  await seedExportStats(request, user, IG_ZIP);
  expect((await request.post('/api/ai/plan', { data: { postsPerWeek: 3, platform: 'instagram', locale: 'en' }, headers: { cookie } })).status()).toBe(200);

  // The header has New plan as the primary action and Add to my calendar beside it.
  await page.goto('/app/plan');
  await expect(page.getByRole('button', { name: /new plan/i })).toBeVisible();
  await page.getByRole('button', { name: /add to my calendar/i }).click();
  await page.getByRole('button', { name: /get my calendar link/i }).click();
  const subscribe = page.getByTestId('calendar-subscribe');
  await expect(subscribe).toBeVisible();
  await expect(subscribe.getByRole('link', { name: /google calendar/i })).toHaveAttribute('href', /calendar\.google\.com\/calendar\/r\?cid=webcal/);

  // The feed is a calendar with the plan's posts, readable without a session.
  const { feed } = (await (await request.get('/api/ai/calendar', { headers: { cookie } })).json()) as { feed: { url: string } };
  const path = new URL(feed.url).pathname;
  const ics = await (await request.get(path, { headers: { cookie: '' } })).text();
  expect(ics).toContain('BEGIN:VCALENDAR');
  expect(ics).toContain('BEGIN:VEVENT');
  expect(ics).toMatch(/DTSTART:\d{8}T\d{6}\r\n/);

  // Rotate: the old link is dead, the new one works.
  const rotated = (await (await request.post('/api/ai/calendar', { data: { action: 'rotate' }, headers: { cookie } })).json()) as { feed: { url: string } };
  expect((await request.get(path)).status()).toBe(404);
  const newPath = new URL(rotated.feed.url).pathname;
  expect((await request.get(newPath)).status()).toBe(200);

  // Revoke: no link at all.
  await request.post('/api/ai/calendar', { data: { action: 'revoke' }, headers: { cookie } });
  expect((await request.get(newPath)).status()).toBe(404);
});
