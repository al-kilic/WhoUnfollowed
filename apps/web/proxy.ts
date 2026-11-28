import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { BETA_COOKIE, ROBOTS_DISALLOW_ALL, STAGING_MARK_COOKIE, betaCode, isBetaOpenPath, isValidBetaCookie, safeNext } from './lib/betaGate';

// Lucia v3's default session cookie name. We hardcode it here on purpose:
// importing `@/lib/auth/lucia` would pull the Drizzle/postgres adapter into
// the proxy, which runs on every matched request and must stay DB-free.
// (Keep in sync with lib/auth/lucia.ts if a custom `sessionCookie.name` is set.)
const SESSION_COOKIE = 'auth_session';

// Routes that require a valid session (any subscription status)
const AUTH_REQUIRED = ['/account', '/settings', '/coach'];

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

function legacyMiddleware(request: NextRequest) {
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
    // Local-only Pro preview (see lib/auth/devProPreview.ts), inlined to keep
    // the middleware bundle free of server-only imports.
    const devProPreview = process.env.NODE_ENV === 'development' && process.env.DEV_PRO_PREVIEW === '1';
    if (!sessionId && !devProPreview) {
      const localeMatch = path.match(LOCALE_PREFIX_RE);
      const loginPath = localeMatch ? `/${localeMatch[1]}/login` : '/login';
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
    // Falls through to intlMiddleware below: these routes are migrated under
    // app/[locale], so the request still needs locale negotiation/rewriting.
  }

  return intlMiddleware(request);
}

// The routes this middleware handled before the staging gate existed (the
// literal matcher list below, minus the catch-all). With the gate off, any
// other path passes straight through, exactly as when it wasn't matched.
const LEGACY_PREFIXES = [
  '/history', '/account', '/settings', '/coach', '/dashboard', '/app', '/pricing', '/about', '/contact',
  '/what-is-whounfollowed', '/how-to-export', '/instagram', '/instagram-coach', '/instagram-updates', '/threads', '/tiktok', '/accessibility', '/compare',
  '/privacy', '/terms', '/cookies', '/refund', '/changelog', '/login', '/signup', '/results', '/forgot-password',
  '/reset-password', '/verify-email', '/welcome', '/diff', '/unsubscribe', '/en', '/es', '/pt',
];
export function matchesLegacy(path: string): boolean {
  if (path === '/') return true;
  return LEGACY_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

function withStagingHeaders(res: NextResponse): NextResponse {
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  res.cookies.set(STAGING_MARK_COOKIE, '1', { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 });
  return res;
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const code = betaCode();
  // Gate off (production): unchanged behaviour.
  if (!code) return matchesLegacy(path) ? legacyMiddleware(request) : NextResponse.next();

  if (path === '/robots.txt') {
    return withStagingHeaders(new NextResponse(ROBOTS_DISALLOW_ALL, { headers: { 'Content-Type': 'text/plain' } }));
  }
  const open = isBetaOpenPath(path);
  if (!open && !(await isValidBetaCookie(request.cookies.get(BETA_COOKIE)?.value, code))) {
    if (path.startsWith('/api/')) {
      return withStagingHeaders(NextResponse.json({ error: 'beta_access_required' }, { status: 401 }));
    }
    const url = new URL('/beta-access', request.url);
    url.searchParams.set('next', safeNext(path + request.nextUrl.search));
    return withStagingHeaders(NextResponse.redirect(url));
  }
  const res = matchesLegacy(path) ? legacyMiddleware(request) : NextResponse.next();
  return withStagingHeaders(res);
}

export const config = {
  matcher: [
    // Auth-gated routes.
    '/history/:path*',
    '/account/:path*',
    '/settings/:path*',
    '/coach/:path*',
    // Routes migrated under app/[locale] that need locale negotiation. Next.js
    // requires this array to be literal (no .map() from a shared list), so
    // this must be kept in sync by hand with i18n/localizedPaths.ts — every
    // entry there needs a matching one here, or its unprefixed English URL
    // 404s (the intl rewrite never runs, so the page under app/[locale]
    // never resolves).
    '/',
    '/dashboard/:path*',
    '/app/:path*',
    '/pricing/:path*',
    '/about/:path*',
    '/contact/:path*',
    '/what-is-whounfollowed/:path*',
    '/how-to-export/:path*',
    '/instagram/:path*',
    '/instagram-coach/:path*',
    '/instagram-updates/:path*',
    '/threads/:path*',
    '/tiktok/:path*',
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
    '/unsubscribe/:path*',
    // /en too: next-intl redirects /en/... to the unprefixed English URL and
    // sets the language cookie back to English (without it, a visit to /pt
    // kept the app in Portuguese and /en/... served duplicate pages).
    '/(en|es|pt)/:path*',
    // Everything else, for the staging gate (lib/betaGate.ts). With the gate
    // off these pass straight through (see matchesLegacy).
    '/((?!_next/static|_next/image).*)',
  ],
};
