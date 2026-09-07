import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { T } from '@/components/landing/tokens';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { routing, type AppLocale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { OG_LOCALE, ogAlternateLocales } from '@/i18n/ogLocale';
import { getTermsContent } from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const SEO_META: Record<AppLocale, { title: string; description: string }> = {
  en: { title: 'Terms of Service', description: 'The terms and conditions for using WhoUnfollowed.' },
  es: { title: 'Términos de Servicio', description: 'Los términos y condiciones para usar WhoUnfollowed.' },
  pt: { title: 'Termos de Serviço', description: 'Os termos e condições para usar o WhoUnfollowed.' },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const meta = SEO_META[locale];
  const canonical = getPathname({ href: '/terms', locale });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href: '/terms', locale: l })]),
  );

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages: { ...languages, 'x-default': languages.en } },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}${canonical}`,
      locale: OG_LOCALE[locale],
      alternateLocale: ogAlternateLocales(locale),
    },
  };
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const c = getTermsContent(locale);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '56px 32px 80px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 14 }}>{c.eyebrow}</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 12 }}>
            {c.headline}
          </h1>
          <p style={{ fontSize: 13, color: T.inkMute, fontFamily: T.mono }}>{c.lastUpdated}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <Section title={c.s1Title}>{c.s1Body}</Section>
          <Section title={c.s2Title}>{c.s2Body}</Section>
          <Section title={c.s3Title}>{c.s3Body}</Section>

          <Section title={c.s4Title}>
            {c.s4Pre} <Link href="/privacy" style={{ color: T.tealLight, textDecoration: 'none' }}>{c.s4LinkLabel}</Link> {c.s4Post}
          </Section>

          <Section title={c.s5Title}>
            {c.s5Pre} <Link href="/refund" style={{ color: T.tealLight, textDecoration: 'none' }}>{c.s5LinkLabel}</Link> {c.s5Post}
          </Section>

          <Section title={c.s6Title}>{c.s6Body}</Section>
          <Section title={c.s7Title}>{c.s7Body}</Section>
          <Section title={c.s8Title}>{c.s8Body}</Section>

          <Section title={c.s9Title}>
            {c.s9Pre} <a href="mailto:hello@whounfollowed.co" style={{ color: T.tealLight, textDecoration: 'none' }}>hello@whounfollowed.co</a>.
          </Section>
        </div>

        <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--t-border1)' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {c.backToHome}
          </Link>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: '-0.01em', marginBottom: 12 }}>{title}</h2>
      <div style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}
