import { hasLocale } from 'next-intl';
import { routing, type AppLocale } from '@/i18n/routing';
import { PRO_AI_PRICE_USD } from '@/lib/pricing';
import { ogCard } from '@/lib/og/ogCard';
import { getCoachPageContent } from '@/app/[locale]/instagram-coach/content';
import { getUpdatesPageContent } from '@/app/[locale]/instagram-updates/content';

// Share images for pages under app/[locale]. Served here, outside the locale
// routing, so the English URL has no /en prefix to redirect (an
// opengraph-image file inside [locale] gets one). /og/<page>/<lang>.
const CARDS: Record<string, (l: AppLocale) => { kicker: string; title: string; sub: string }> = {
  coach: (l) => {
    const c = getCoachPageContent(l, { monthly: `$${PRO_AI_PRICE_USD.monthly}`, yearly: `$${PRO_AI_PRICE_USD.yearly}` });
    return { kicker: c.eyebrow, title: c.h1, sub: c.h1Sub };
  },
  study: () => ({ kicker: 'Research · November 2026', title: 'Do Instagram unfollower apps need your login?', sub: 'We checked the 30 most-rated ones on the App Store. None reads your official export.' }),
  updates: (l) => {
    const c = getUpdatesPageContent(l);
    return { kicker: c.eyebrow, title: c.h1, sub: c.intro };
  },
};

export async function GET(_req: Request, { params }: { params: Promise<{ page: string; lang: string }> }): Promise<Response> {
  const { page, lang } = await params;
  const card = CARDS[page];
  if (!card || !hasLocale(routing.locales, lang)) return new Response('Not found', { status: 404 });
  return ogCard(card(lang));
}
