import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { hasLocale } from 'next-intl';
import { validateRequest } from '@/lib/auth/session';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { routing } from '@/i18n/routing';
import { localizedPathname } from '@/i18n/localizedPathname';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://whounfollowed.co';

// Stripe's own billing page for a Pro AI subscriber: cancel, change card,
// switch monthly/yearly, download invoices. Turn the portal on (and allow
// cancellation) in the Stripe dashboard before launch.
export async function POST(req: Request) {
  if (!isStripeConfigured()) return NextResponse.json({ error: 'Payments not enabled' }, { status: 404 });
  const { user } = await validateRequest();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const profile = await db.query.profiles.findFirst({ where: eq(profiles.userId, user.id), columns: { stripeCustomerId: true } });
  if (!profile?.stripeCustomerId) return NextResponse.json({ error: 'no_customer' }, { status: 404 });
  const body = (await req.json().catch(() => ({}))) as { locale?: unknown };
  const locale = hasLocale(routing.locales, body.locale) ? body.locale : routing.defaultLocale;
  // Live uses its own portal configuration (cancel at period end, card and
  // invoices, NO plan switching: a switch would start a new billing month and
  // with it a fresh coach allowance). Unset: the account's default config.
  const configuration = process.env.STRIPE_PORTAL_CONFIGURATION?.trim();
  const session = await getStripe().billingPortal.sessions.create({
    customer: profile.stripeCustomerId,
    ...(configuration ? { configuration } : {}),
    // Back where the member came from, flagged so the page re-reads the
    // subscription at once (see /api/stripe/sync).
    return_url: `${APP_URL}${localizedPathname('/app/you', locale)}?billing=returned#billing`,
  });
  return NextResponse.json({ url: session.url });
}
