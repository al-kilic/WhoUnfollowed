import { NextResponse } from 'next/server';
import { disableRemindersByToken } from '@/lib/reminders/store';

// Stops reminder emails. Two callers:
//  - the /unsubscribe page's button, which POSTs { token } as JSON
//  - mail apps' own "Unsubscribe" button (RFC 8058 one-click), which POSTs
//    "List-Unsubscribe=One-Click" to the URL in the List-Unsubscribe header,
//    with the token in the query string.
// POST only: link scanners that prefetch GET links can't unsubscribe anyone.
export async function POST(req: Request) {
  const url = new URL(req.url);
  let token = url.searchParams.get('t') ?? '';
  if (!token && req.headers.get('content-type')?.includes('application/json')) {
    const body = (await req.json().catch(() => null)) as { token?: unknown } | null;
    token = typeof body?.token === 'string' ? body.token : '';
  }
  const ok = token ? await disableRemindersByToken(token) : false;
  return NextResponse.json(ok ? { ok: true } : { error: 'not_found' }, { status: ok ? 200 : 404 });
}
