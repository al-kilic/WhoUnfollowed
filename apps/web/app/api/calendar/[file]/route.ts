import { NextResponse } from 'next/server';
import { calendarFeed } from '@/lib/ai/calendarFeed';
import { checkRateLimit, clientIpFromXff } from '@/lib/auth/rate-limit';

// The private plan calendar feed: GET /api/calendar/<token>.ics. Calendar
// apps (Google, Apple, Outlook) subscribe once and refetch it, so moves,
// edits and new plans show up on their own. The token is the only secret;
// unknown tokens get a plain 404, and both the token and the caller's IP are
// rate-limited so tokens can't be guessed.
export const dynamic = 'force-dynamic';

export async function GET(req: Request, ctx: { params: Promise<{ file: string }> }) {
  const { file } = await ctx.params;
  const token = file.replace(/\.ics$/i, '');
  const ip = clientIpFromXff(req.headers.get('x-forwarded-for'));
  if (!checkRateLimit(`cal-ip:${ip}`).allowed || !checkRateLimit(`cal:${token}`).allowed) {
    return new NextResponse('Too many requests', { status: 429, headers: { 'Retry-After': '900' } });
  }
  const ics = await calendarFeed(token).catch(() => null);
  if (ics === null) return new NextResponse('Not found', { status: 404 });
  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="posting-plan.ics"',
      'Cache-Control': 'private, max-age=1800',
      'X-Robots-Tag': 'noindex',
    },
  });
}
