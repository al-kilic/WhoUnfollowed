import { NextResponse } from 'next/server';
import { guardProAi, readJson } from '@/lib/ai/guard';
import { feedLabels, feedUrl, getCalendarToken, revokeCalendarToken, setCalendarToken } from '@/lib/ai/calendarFeed';
import { subscribeLinks } from '@/lib/ai/calendarFeedMath';
import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl';

// Studio > Plan and You > Settings: the member's private calendar feed link.
// GET: the links (or null). POST { action: 'create' | 'rotate' | 'revoke' }.
// No model call, no allowance use.
export const dynamic = 'force-dynamic';

function view(token: string | null, locale: string) {
  if (!token) return { feed: null };
  const url = feedUrl(token);
  const name = feedLabels(hasLocale(routing.locales, locale) ? locale : routing.defaultLocale).name;
  return { feed: { url, ...subscribeLinks(url, name) } };
}

export async function GET(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  const locale = new URL(req.url).searchParams.get('locale') ?? 'en';
  return NextResponse.json(view(await getCalendarToken(g.userId), locale));
}

const ACTIONS = ['create', 'rotate', 'revoke'] as const;
type Action = (typeof ACTIONS)[number];
function parseBody(v: unknown): { action: Action; locale: string } | null {
  if (!v || typeof v !== 'object') return null;
  const { action, locale } = v as { action?: unknown; locale?: unknown };
  if (typeof action !== 'string' || !(ACTIONS as readonly string[]).includes(action)) return null;
  return { action: action as Action, locale: typeof locale === 'string' && locale.length <= 5 ? locale : 'en' };
}

export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  const parsed = parseBody(await readJson(req));
  if (!parsed) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const { action, locale } = parsed;
  if (action === 'revoke') { await revokeCalendarToken(g.userId); return NextResponse.json(view(null, locale)); }
  // create keeps an existing link; rotate always replaces it.
  const existing = action === 'create' ? await getCalendarToken(g.userId) : null;
  return NextResponse.json(view(existing ?? (await setCalendarToken(g.userId)), locale));
}
