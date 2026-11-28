import { expect, test, type Browser, type BrowserContext } from '@playwright/test';
import { COMBINED_ZIP } from './global-setup';
import { createUser, onboard, type TestUser } from './helpers/db';
import { seedExportStats } from './helpers/upload';
import { E2E_URL } from './env';

// Every page, in every language: no console errors, no sideways scroll on a
// phone, no em dashes, no leftover "credits" wording and no English UI left
// on Spanish or Portuguese pages. One test per page and variant, so a run
// points at exactly what broke.

const PUBLIC = [
  '/', '/pricing', '/about', '/contact', '/what-is-whounfollowed', '/how-to-export', '/instagram', '/threads', '/tiktok',
  '/instagram-coach', '/instagram-updates', '/instagram-updates/2026-11-23',
  '/compare/whounfollowed-vs-reports-plus', '/compare/whounfollowed-vs-fans',
  '/accessibility', '/compare', '/compare/whounfollowed-vs-followmeter', '/privacy', '/terms', '/cookies', '/refund', '/changelog',
  '/login', '/signup', '/forgot-password', '/results',
];
// Not localized (English only).
const ENGLISH_ONLY = ['/blog', '/blog/why-did-i-lose-followers-overnight-on-instagram', '/author/alan-kilic', '/research/instagram-unfollower-apps'];
const STUDIO = [
  '/app/today', '/app/ask', '/app/create', '/app/create/check', '/app/create/ideas', '/app/plan', '/app/plan/posted',
  '/app/plan/goals', '/app/plan/insights', '/app/plan/brief', '/app/radar', '/app/radar/growth', '/app/radar/people',
  '/app/radar/why', '/app/radar/fixes', '/app/radar/benchmarks', '/app/results', '/app/history', '/app/you',
  '/app/you/credits', '/app/you/memory', '/app/you/kit', '/app/you/guides',
];

type Variant = { name: string; locale: 'en' | 'es' | 'pt'; width: number; dark: boolean };
const VARIANTS: Variant[] = [
  { name: 'en desktop light', locale: 'en', width: 1280, dark: false },
  { name: 'en phone dark', locale: 'en', width: 390, dark: true },
  { name: 'es desktop', locale: 'es', width: 1280, dark: false },
  { name: 'pt desktop', locale: 'pt', width: 1280, dark: false },
];

// UI words that must be translated on es/pt pages (header and Studio nav).
const MUST_TRANSLATE: Record<'public' | 'studio', string[]> = {
  public: ['How It Works', 'Sign in', 'Open Studio'],
  studio: ['Ask coach', 'Monthly use', 'Weekly brief'],
};
// Legal pages and the blog may say "credit card"; plural "credits" is the old
// AI-credit wording and should be gone everywhere else.
const CREDITS = /\bcredits\b|\bcréditos\b/i;
const CREDITS_ALLOWED = ['/privacy', '/terms', '/refund', '/cookies', '/blog', '/author', '/compare'];

const localized = (path: string, locale: string) => (locale === 'en' ? path : `/${locale}${path === '/' ? '' : path}`);

async function checkPage(browser: Browser, path: string, v: Variant, user: TestUser | null, area: 'public' | 'studio'): Promise<void> {
  const context: BrowserContext = await browser.newContext({ viewport: { width: v.width, height: 900 }, colorScheme: v.dark ? 'dark' : 'light', locale: v.locale });
  if (user) await context.addCookies([{ name: 'auth_session', value: user.sessionId, url: E2E_URL }]);
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  try {
    const res = await page.goto(localized(path, v.locale), { waitUntil: 'load' });
    expect(res?.status(), `${path} status`).toBeLessThan(400);
    // Let client code run so late console errors are caught; Studio keeps
    // polling, so 'networkidle' may never come: cap the wait.
    await page.waitForLoadState('networkidle', { timeout: 2_500 }).catch(() => {});
    const { text, overflow, width } = await page.evaluate(() => ({
      text: document.body.innerText,
      overflow: document.documentElement.scrollWidth,
      width: window.innerWidth,
    }));
    expect.soft(errors, 'console errors').toEqual([]);
    if (v.width < 500) expect.soft(overflow, 'sideways scroll at phone width').toBeLessThanOrEqual(width + 1);
    expect.soft(text.includes('—') ? text.slice(Math.max(0, text.indexOf('—') - 60), text.indexOf('—') + 20) : '', 'em dash').toBe('');
    if (!CREDITS_ALLOWED.some((p) => path.startsWith(p))) {
      const m = text.match(CREDITS);
      expect.soft(m ? text.slice(Math.max(0, (m.index ?? 0) - 60), (m.index ?? 0) + 30) : '', 'credits wording').toBe('');
    }
    // The changelog's entries are English release notes on every language.
    if (v.locale !== 'en' && path !== '/changelog') {
      const left = MUST_TRANSLATE[area].filter((s) => text.includes(s));
      expect.soft(left, 'English left on a translated page').toEqual([]);
    }
  } finally {
    await context.close();
  }
}

test.describe('site check: public pages', () => {
  for (const path of PUBLIC) for (const v of VARIANTS) {
    test(`${path} · ${v.name}`, async ({ browser }) => { await checkPage(browser, path, v, null, 'public'); });
  }
  for (const path of ENGLISH_ONLY) for (const v of VARIANTS.filter((x) => x.locale === 'en')) {
    test(`${path} · ${v.name}`, async ({ browser }) => { await checkPage(browser, path, v, null, 'public'); });
  }
});

test.describe('site check: Studio (signed in, Pro AI, Instagram + Threads)', () => {
  let user: TestUser;
  test.beforeAll(async ({ request }) => {
    user = await createUser('monthly');
    await onboard(user.id);
    await seedExportStats(request, user, COMBINED_ZIP);
  });
  for (const path of STUDIO) for (const v of VARIANTS) {
    test(`${path} · ${v.name}`, async ({ browser }) => { await checkPage(browser, path, v, user, 'studio'); });
  }
});
