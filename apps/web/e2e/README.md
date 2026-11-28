# End-to-end tests (Playwright)

Real browser, real app, real database, nothing shared with development.

- **Server:** a production build in `.next-e2e/` on port 3030 (never the dev server on 3010).
- **Database:** `igtracker_e2e`, dropped, recreated and migrated on every local run (CI uses a Postgres service).
- **AI:** mocked (`AI_PROVIDER=mock` + `E2E_ALLOW_MOCK_AI=1`, a flag only this server sets).
- **Stripe:** events are signed with the e2e webhook secret and posted to the app's own webhook. Tests never call Stripe.
- **Email:** not configured, so nothing is sent; signup verifies straight away.

## Run

```
pnpm e2e                                   # build + all tests (~2.5 min locally)
E2E_SKIP_BUILD=1 pnpm e2e                  # reuse the last build (~1 min)
E2E_SKIP_BUILD=1 pnpm e2e billing          # one file
pnpm --filter @ig-tracker/web e2e:ui       # Playwright's UI to watch and debug
```

Locally the database is recreated as your OS Postgres user (Homebrew superuser); override with `E2E_ADMIN_DATABASE_URL`.

## Add a journey

1. A new `e2e/<area>.spec.ts`: seed with `helpers/db.ts` (`createUser(plan)`, `signIn`, `onboard`), `helpers/upload.ts` (upload a ZIP from the home page, or post export stats), `helpers/stripe.ts` (`sendEvent` with `subscription()` / `topupSession()`).
2. Select by role and visible text (`getByRole`, `getByText`), never CSS classes; wait for states with `expect(...)`, not timers.
3. Check what was stored when it matters (`sql` from `helpers/db.ts`), not just the screen.

**Rule: every fix or feature ships with a journey that fails before and passes after.**

`site-check.spec.ts` visits every page in en/es/pt (light, dark, phone) and fails on console errors, sideways scroll on phones, em dashes, leftover "credits" wording and English UI left on es/pt pages. Add new routes to its lists.
