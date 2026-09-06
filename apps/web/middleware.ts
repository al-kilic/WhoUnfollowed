import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Lucia v3's default session cookie name. We hardcode it here on purpose:
// importing `@/lib/auth/lucia` would pull the Drizzle/postgres adapter into the
// Edge runtime bundle, and the Edge runtime cannot open a DB (TCP) connection.
// (Keep in sync with lib/auth/lucia.ts if a custom `sessionCookie.name` is set.)
const SESSION_COOKIE = 'auth_session';

// Routes that require a valid session (any subscription status)
const AUTH_REQUIRED = ['/account', '/settings'];

// Routes that require an account (subscription status checked server-side).
// /dashboard is deliberately not here: it's the free/no-account entry point
// too, showing a blurred, locked preview for anyone without Pro (including
// logged-out visitors with a local snapshot). Its own page code already
// handles user === null and defaults isPro to false.
const ACTIVE_SUB_REQUIRED = ['/history'];

const intlMiddleware = createIntlMiddleware(routing);

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const needsGate =
    AUTH_REQUIRED.some((p) => path.startsWith(p)) ||
    ACTIVE_SUB_REQUIRED.some((p) => path.startsWith(p));

  if (needsGate) {
    // Edge-safe gate: only check that a session cookie is present. Full
    // session validation (and subscription status) runs server-side in the
    // page/route, which executes on the Node runtime and can reach the
    // database. Protected server data (e.g. /api/sync) independently calls
    // validateRequest().
    const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
    if (!sessionId) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Only routes actually migrated under app/[locale] need locale negotiation
  // (currently just /pricing); everything else falls through untouched.
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Auth-gated routes.
    '/history/:path*',
    '/account/:path*',
    '/settings/:path*',
    // Routes migrated under app/[locale] that need locale negotiation. Next.js
    // requires this array to be literal (no .map() from a shared list), so
    // this must be kept in sync by hand with i18n/localizedPaths.ts — every
    // entry there needs a matching one here, or its unprefixed English URL
    // 404s (the intl rewrite never runs, so the page under app/[locale]
    // never resolves).
    // /dashboard is deliberately excluded: it's public (see
    // ACTIVE_SUB_REQUIRED comment above) and not under [locale], so it must
    // never reach intlMiddleware — that would 404 it.
    '/',
    '/pricing/:path*',
    '/about/:path*',
    '/contact/:path*',
    '/what-is-whounfollowed/:path*',
    '/how-to-export/:path*',
    '/(es|pt)/:path*',
  ],
};
