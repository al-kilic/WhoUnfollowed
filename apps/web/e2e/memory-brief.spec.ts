import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { expect, test } from '@playwright/test';
import { FIXTURES } from './global-setup';
import { createUser, onboard, signIn, sql } from './helpers/db';

// A small full export: posts with captions (one mentions a handle, which must
// never be sent) plus the follower lists.
type Zip = { file(name: string, data: string): void; generateAsync(o: { type: 'nodebuffer' }): Promise<Buffer> };
// jszip ships with the parser package (packages/core), not with the web app.
const JSZip = createRequire(path.join(process.cwd(), '..', '..', 'packages', 'core', 'package.json'))('jszip') as new () => Zip;

async function fullExport(): Promise<string> {
  const file = path.join(FIXTURES, 'full-with-posts.zip');
  if (fs.existsSync(file)) return file;
  const z = new JSZip();
  const posts = Array.from({ length: 8 }, (_, i) => ({ title: i === 0 ? 'Night walk with @secret.friend in the rain' : `Caption number ${i}: the city at 2am, quiet streets and wet lights.`, creation_timestamp: 1_760_000_000 + i * 86_400, media: [{ uri: `media/posts/2026${i}/p${i}.jpg` }] }));
  z.file('your_instagram_activity/media/posts_1.json', JSON.stringify(posts));
  const entry = (u: string) => ({ string_list_data: [{ href: `https://www.instagram.com/${u}`, value: u, timestamp: 1_760_000_000 }] });
  z.file('connections/followers_and_following/followers_1.json', JSON.stringify([entry('a1'), entry('b2')]));
  z.file('connections/followers_and_following/following.json', JSON.stringify({ relationships_following: [entry('a1'), entry('c3')] }));
  fs.mkdirSync(FIXTURES, { recursive: true });
  fs.writeFileSync(file, await z.generateAsync({ type: 'nodebuffer' }));
  return file;
}

test('memory: learn my voice from the full export, without handles', async ({ page, context }) => {
  const user = await createUser('monthly');
  await onboard(user.id);
  await signIn(context, user);
  await page.goto('/app/you/memory');
  await expect(page.getByRole('heading', { name: 'Teach your coach' })).toBeVisible();
  await page.locator('.s-teach-drop input[type=file]').setInputFiles(await fullExport());
  await expect(page.getByText(/Using full-with-posts\.zip/)).toBeVisible();

  const sent: string[] = [];
  page.on('request', (r) => { if (r.url().includes('/api/ai/voice') && r.method() === 'POST') sent.push(r.postData() ?? ''); });
  const voice = page.locator('article', { has: page.getByText('Your voice', { exact: true }) });
  await voice.getByRole('button', { name: 'Learn from my export' }).click();
  await voice.getByRole('button', { name: /^Send \d+/ }).click();
  await expect(voice.getByRole('status')).toBeVisible();
  expect(sent).toHaveLength(1);
  expect(sent[0]).not.toContain('secret.friend');
  const rows = await sql`select count(*)::int as n from ai_voice where user_id = ${user.id}`;
  expect(rows[0]!.n).toBeGreaterThan(0);
});

test('weekly brief renders as cards', async ({ page, context }) => {
  const user = await createUser('monthly');
  await onboard(user.id);
  await signIn(context, user);
  await page.goto('/app/plan/brief');
  await expect(page.locator('.s-bhero h2')).toBeVisible();
  expect(await page.locator('.s-bnc').count()).toBeGreaterThanOrEqual(3);
  expect(await page.locator('.s-bidea').count()).toBe(5);
  await expect(page.locator('.s-btry')).toBeVisible();
  await expect(page.locator('.s-bnc').first().getByText('Why it matters')).toBeVisible();
});

test('monthly use shows what the month went to, without money', async ({ page, context }) => {
  const user = await createUser('monthly');
  await onboard(user.id);
  await sql`insert into ai_usage_log (user_id, action, model, cost_usd) values (${user.id}, 'chat', 'm', 0.2), (${user.id}, 'check', 'm', 0.1)`;
  await signIn(context, user);
  await page.goto('/app/you/credits');
  await expect(page.getByRole('heading', { name: 'What your month went to' })).toBeVisible();
  await expect(page.locator('.s-ufeat')).toHaveCount(2);
  await expect(page.getByText('Most used')).toBeVisible();
  // Use is described in words; the only price allowed is the refill offer
  // (a purchase, .s-pack), so it is left out of the check.
  const text = await page.locator('main').evaluate((el) => {
    const copy = el.cloneNode(true) as HTMLElement;
    copy.querySelectorAll('.s-pack').forEach((n) => n.remove());
    return copy.textContent ?? '';
  });
  expect(text).toContain('Plenty left');
  expect(text).not.toMatch(/\$\s?\d|credits? left/i);
});
