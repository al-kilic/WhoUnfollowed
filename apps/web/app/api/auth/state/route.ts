import { NextResponse } from 'next/server';
import { getAuthState } from '@/lib/auth/getAuthState';

// Login state for the client-side AuthProvider. Keeping the session cookie out
// of the root layout is what lets marketing and blog pages be served static.
export const dynamic = 'force-dynamic';

export async function GET() {
  const state = await getAuthState();
  return NextResponse.json(state, { headers: { 'Cache-Control': 'private, no-store' } });
}
