import { defineConfig, devices } from '@playwright/test';
import { e2eEnv, E2E_PORT, E2E_URL } from './e2e/env';

// End-to-end tests: a real browser against a production build of the app on
// its own port (3030) and its own database (igtracker_e2e), with AI mocked and
// Stripe events simulated with real signatures. Never the dev server (3010),
// the dev database or anyone's browser profile. See e2e/README.md.
export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/.results',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // One retry everywhere: a test that only passes on retry is reported as flaky.
  retries: 1,
  workers: process.env.CI ? 2 : 4,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: process.env.CI ? [['list'], ['html', { open: 'never', outputFolder: 'e2e/.report' }]] : [['list']],
  use: {
    baseURL: E2E_URL,
    trace: 'retain-on-failure',
    locale: 'en-US',
    // The site check sets its own viewport and colour scheme per page.
    ...devices['Desktop Chrome'],
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    // A production build in its own folder, so the dev server's .next is
    // untouched. E2E_SKIP_BUILD=1 reuses the last build (fast reruns of tests).
    // The build reads a generated, gitignored tsconfig.e2e.json (Next adds its
    // own include lines to it), so the tracked tsconfig.json is never rewritten;
    // next-env.d.ts (which a build points at its own folder) is put back after.
    command: process.env.E2E_SKIP_BUILD === '1'
      ? `pnpm exec next start -p ${E2E_PORT}`
      : `echo '{ "extends": "./tsconfig.json" }' > tsconfig.e2e.json && cp next-env.d.ts next-env.d.ts.e2e-bak && pnpm exec next build; s=$?; mv next-env.d.ts.e2e-bak next-env.d.ts; [ $s -eq 0 ] && pnpm exec next start -p ${E2E_PORT}`,
    // Not /api/health: the database is created in global setup, after the server starts.
    url: `${E2E_URL}/robots.txt`,
    timeout: 600_000,
    reuseExistingServer: !process.env.CI && process.env.E2E_REUSE === '1',
    env: e2eEnv(),
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
