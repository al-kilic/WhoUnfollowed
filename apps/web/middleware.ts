import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { lucia } from '@/lib/auth/lucia';

// Routes that require a valid session (any subscription status)
const AUTH_REQUIRED = ['/settings'];

// Routes that require active subscription (not grace/cancelled)
const ACTIVE_SUB_REQUIRED = ['/dashboard', '/history'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const needsAuth = AUTH_REQUIRED.some((p) => path.startsWith(p));
  const needsActive = ACTIVE_SUB_REQUIRED.some((p) => path.startsWith(p));

  if (!needsAuth && !needsActive) return NextResponse.next();

  const sessionId = request.cookies.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const { session } = await lucia.validateSession(sessionId);
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // /history is accessible during grace period — the client shows a banner
  // Only hard-block if cancelled entirely (account should be deleted by cron anyway)
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/history/:path*', '/settings/:path*'],
};
