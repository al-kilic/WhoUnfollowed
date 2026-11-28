import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, clientIpFromXff } from '@/lib/auth/rate-limit';
import { BETA_COOKIE, BETA_MAX_AGE, betaCode, betaToken, codeMatches } from '@/lib/betaGate';

// Staging only: checks the beta access code and sets the gate cookie. With no
// STAGING_ACCESS_CODE (production) it doesn't exist. The code is never logged.
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const code = betaCode();
  if (!code) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  const ip = clientIpFromXff(request.headers.get('x-forwarded-for'));
  if (!checkRateLimit(`beta-access:${ip}`).allowed) {
    return NextResponse.json({ error: 'too_many' }, { status: 429 });
  }
  const body = (await request.json().catch(() => ({}))) as { code?: unknown };
  const submitted = typeof body.code === 'string' ? body.code.slice(0, 200) : '';
  if (!submitted || !(await codeMatches(submitted, code))) {
    return NextResponse.json({ error: 'wrong_code' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(BETA_COOKIE, await betaToken(code), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: BETA_MAX_AGE,
  });
  return res;
}
