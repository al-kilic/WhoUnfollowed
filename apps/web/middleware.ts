import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lucia v3's default session cookie name. We hardcode it here on purpose:
// importing `@/lib/auth/lucia` would pull the Drizzle/postgres adapter into the
// Edge runtime bundle, and the Edge runtime cannot open a DB (TCP) connection.
// (Keep in sync with lib/auth/lucia.ts if a custom `sessionCookie.name` is set.)
const SESSION_COOKIE = 'auth_session';

// Routes that require a valid session (any subscription status)
const AUTH_REQUIRED = ['/settings'];

// Routes that require an account (subscription status checked server-side)
const ACTIVE_SUB_REQUIRED = ['/dashboard', '/history'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const needsGate =
    AUTH_REQUIRED.some((p) => path.startsWith(p)) ||
    ACTIVE_SUB_REQUIRED.some((p) => path.startsWith(p));

  if (!needsGate) return NextResponse.next();

  // Edge-safe gate: only check that a session cookie is present. Full session
  // validation (and subscription status) runs server-side in the page/route,
  // which executes on the Node runtime and can reach the database. Protected
  // server data (e.g. /api/sync) independently calls validateRequest().
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/history/:path*', '/settings/:path*'],
};
