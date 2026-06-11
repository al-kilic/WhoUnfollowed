import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { lucia } from '@/lib/auth/lucia';

const PROTECTED_PATHS = ['/dashboard', '/history', '/settings'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PATHS.some((p) => path.startsWith(p));

  if (!isProtected) {
    return NextResponse.next();
  }

  const sessionId =
    request.cookies.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const { session } = await lucia.validateSession(sessionId);

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/history/:path*', '/settings/:path*'],
};
