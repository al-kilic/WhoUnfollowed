import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

// Everything the e2e server and the tests agree on. The server gets ONLY this
// environment (a production build loads no .env.development.local), so no
// dev database, no real email, no real AI and no Telegram alerts.

export const E2E_PORT = 3030;
export const E2E_URL = `http://localhost:${E2E_PORT}`;
export const E2E_DB_NAME = 'igtracker_e2e';
// Only used locally to drop and recreate the e2e database (the app role can't
// create databases); the local Homebrew superuser is the OS user.
export const E2E_ADMIN_URL = process.env.E2E_ADMIN_DATABASE_URL ?? `postgres://${process.env.USER ?? 'postgres'}@localhost:5432/postgres`;
export const E2E_DATABASE_URL = process.env.E2E_DATABASE_URL ?? `postgres://igtracker:localdev@localhost:5432/${E2E_DB_NAME}`;
export const E2E_WEBHOOK_SECRET = 'whsec_e2e_local_test_secret';
export const E2E_CRON_SECRET = 'e2e-cron-secret';

// Stripe sandbox price ids, read from the local dev env file when present
// (CI uses placeholders).
function devStripeEnv(): Record<string, string> {
  const file = path.join(HERE, '..', '.env.development.local');
  const out: Record<string, string> = {};
  if (!existsSync(file)) return out;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    // Price and coupon ids only: the secret key stays a placeholder, so a
    // test can never reach Stripe's API, even the sandbox.
    const m = line.match(/^(STRIPE_(?:PRICE|COUPON)_[A-Z0-9_]+)=(.*)$/);
    if (m && m[2]) out[m[1]!] = m[2];
  }
  return out;
}

export function e2eEnv(): Record<string, string> {
  return {
    NODE_ENV: 'production',
    NEXT_DIST_DIR: '.next-e2e',
    NEXT_TSCONFIG_PATH: 'tsconfig.e2e.json',
    NEXT_TELEMETRY_DISABLED: '1',
    DATABASE_URL: E2E_DATABASE_URL,
    NEXT_PUBLIC_APP_URL: E2E_URL,
    NEXT_PUBLIC_SITE_URL: E2E_URL,
    NEXT_PUBLIC_PAYMENTS_ENABLED: 'true',
    AI_PROVIDER: 'mock',
    // Production builds refuse mock AI unless this is set (see lib/ai/provider.ts).
    E2E_ALLOW_MOCK_AI: '1',
    STRIPE_SECRET_KEY: 'sk_test_e2e_placeholder',
    STRIPE_PRICE_PRO_AI_MONTHLY: 'price_e2e_monthly',
    STRIPE_PRICE_PRO_AI_YEARLY: 'price_e2e_yearly',
    STRIPE_PRICE_TOPUP_300: 'price_e2e_topup',
    ...devStripeEnv(),
    STRIPE_WEBHOOK_SECRET: E2E_WEBHOOK_SECRET,
    CRON_SECRET: E2E_CRON_SECRET,
    PRO_AI_LAUNCH_DATE: '2026-12-01',
    // No analytics: empty turns off the Umami tracker, the session recorder
    // (no domain filter) and the server-side events (lib/umamiServer.ts),
    // which otherwise sent test purchases into the live stats.
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: '',
    PATH: process.env.PATH ?? '',
    HOME: process.env.HOME ?? '',
  };
}
