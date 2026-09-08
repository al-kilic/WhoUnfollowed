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

// /account, /settings, and /history are migrated under app/[locale], so a
// gated request can arrive locale-prefixed (e.g. /es/account) — strip that
// prefix before matching against the lists above, or non-English visitors
// would skip the gate entirely.
const NON_DEFAULT_LOCALES = routing.locales.filter((l) => l !== routing.defaultLocale);
const LOCALE_PREFIX_RE = new RegExp(`^/(${NON_DEFAULT_LOCALES.join('|')})(?=/|$)`);

function withoutLocalePrefix(path: string): string {
  return path.replace(LOCALE_PREFIX_RE, '') || '/';
}

const intlMiddleware = createIntlMiddleware(routing);

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const unprefixedPath = withoutLocalePrefix(path);

  const needsGate =
    AUTH_REQUIRED.some((p) => unprefixedPath.startsWith(p)) ||
    ACTIVE_SUB_REQUIRED.some((p) => unprefixedPath.startsWith(p));

  if (needsGate) {
    // Edge-safe gate: only check that a session cookie is present. Full
    // session validation (and subscription status) runs server-side in the
    // page/route, which executes on the Node runtime and can reach the
    // database. Protected server data (e.g. /api/sync) independently calls
    // validateRequest().
    const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
    if (!sessionId) {
      const localeMatch = path.match(LOCALE_PREFIX_RE);
      const loginPath = localeMatch ? `/${localeMatch[1]}/login` : '/login';
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
    // Falls through to intlMiddleware below: these routes are migrated under
    // app/[locale], so the request still needs locale negotiation/rewriting.
  }

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
    '/',
    '/dashboard/:path*',
    '/pricing/:path*',
    '/about/:path*',
    '/contact/:path*',
    '/what-is-whounfollowed/:path*',
    '/how-to-export/:path*',
    '/accessibility/:path*',
    '/compare/:path*',
    '/privacy/:path*',
    '/terms/:path*',
    '/cookies/:path*',
    '/refund/:path*',
    '/changelog/:path*',
    '/login/:path*',
    '/signup/:path*',
    '/results/:path*',
    '/forgot-password/:path*',
    '/reset-password/:path*',
    '/verify-email/:path*',
    '/welcome/:path*',
    '/diff/:path*',
    '/(es|pt)/:path*',
  ],
};
