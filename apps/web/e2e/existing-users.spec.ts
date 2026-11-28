import { expect, test } from '@playwright/test';
import { allowanceRows, createUser, profileOf, signIn, type Plan } from './helpers/db';
import { sendEvent, subscription } from './helpers/stripe';

// Accounts that existed before launch (2026-11-28): what each one sees and can
// do. Old Pro, comped and early Lifetime keep what they paid for, get no AI,
// and always have a way to Pro AI. Free stays Free.
const SHOTS = process.env.E2E_SHOTS_DIR;
const auth = (sessionId: string) => ({ cookie: `auth_session=${sessionId}` });

const cases: { plan: Plan; badge: RegExp; line: RegExp; card: RegExp }[] = [
  { plan: 'none', badge: /^FREE$/, line: /free plan/i, card: /\$\d+(\.\d+)? a month or/ },
  { plan: 'legacy', badge: /^PRO$/, line: /^Pro until /, card: /Your Pro features stay until/ },
  { plan: 'comped', badge: /^PRO$/, line: /./, card: /Pro AI adds the coach with generous monthly use/ },
  { plan: 'earlyLifetime', badge: /^INSIDER$/, line: /./, card: /What you keep, for life/ },
];

for (const c of cases) {
  test(`existing ${c.plan} account: right plan, no AI, a way to Pro AI`, async ({ page, context, request }) => {
    const user = await createUser(c.plan);
    await signIn(context, user);
    expect((await request.get('/api/ai/state', { headers: auth(user.sessionId) })).status()).toBe(403);

    // The old account page now sends everyone to Studio > You, plan section.
    await page.goto('/account');
    await expect(page).toHaveURL(/\/app\/you#billing$/);
    await expect(page.getByText(c.card).first()).toBeVisible();
    if (SHOTS) await page.locator('.s-bill').first().screenshot({ path: `${SHOTS}/${c.plan}-studio-billing.png` });

    expect(await allowanceRows(user.id)).toHaveLength(0);
  });
}

test('an old Pro member who upgrades gets Pro AI and keeps the old end date', async ({ page, context, request }) => {
  const user = await createUser('legacy');
  const before = (await profileOf(user.id)).subscription_expires_at;
  await signIn(context, user);
  expect(await sendEvent(request, 'customer.subscription.created', subscription(user))).toBe(200);
  expect((await request.get('/api/ai/state', { headers: auth(user.sessionId) })).status()).toBe(200);
  expect(String((await profileOf(user.id)).subscription_expires_at)).toBe(String(before));
  await page.goto('/app/you#billing');
  await expect(page.getByRole('button', { name: 'Manage billing' })).toBeVisible();
  await expect(page.locator('.s-bill').getByRole('link', { name: 'Get Pro AI' })).toHaveCount(0);
  if (SHOTS) await page.locator('.s-bill').first().screenshot({ path: `${SHOTS}/legacy-after-upgrade-billing.png` });
});

test('pricing tells an old Pro member what changes when they upgrade', async ({ page, context }) => {
  const user = await createUser('legacy');
  await signIn(context, user);
  await page.goto('/pricing');
  await expect(page.getByText(/You keep your Pro features until your end date/)).toBeVisible();
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/legacy-pricing.png` });
});
