import Link from 'next/link';
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { T } from '@/components/landing/tokens';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { routing, type AppLocale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { getAccessibilityContent } from './content';

const SEO_META: Record<AppLocale, { title: string; description: string }> = {
  en: {
    title: 'Accessibility',
    description: 'Our commitment to making WhoUnfollowed usable for everyone, including people using screen readers, keyboards, or other assistive technology.',
  },
  es: {
    title: 'Accesibilidad',
    description: 'Nuestro compromiso de hacer WhoUnfollowed usable para todos, incluyendo personas que usan lectores de pantalla, teclado u otra tecnología de asistencia.',
  },
  pt: {
    title: 'Acessibilidade',
    description: 'Nosso compromisso de tornar o WhoUnfollowed utilizável para todos, incluindo pessoas que usam leitores de tela, teclado ou outra tecnologia assistiva.',
  },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const meta = SEO_META[locale];
  const canonical = getPathname({ href: '/accessibility', locale });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href: '/accessibility', locale: l })]),
  );

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages: { ...languages, 'x-default': languages.en } },
  };
}

export default async function AccessibilityPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const content = getAccessibilityContent(locale);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '56px 32px 80px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 14 }}>{content.eyebrow}</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 12 }}>
            {content.headline}
          </h1>
          <p style={{ fontSize: 13, color: T.inkMute, fontFamily: T.mono }}>{content.lastUpdated}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <Section title={content.sections[0]!.title}>{content.sections[0]!.body}</Section>
          <Section title={content.sections[1]!.title}>{content.sections[1]!.body}</Section>

          <Section title={content.catchingUpTitle}>
            <strong style={{ color: T.ink }}>{content.catchingUpBold}</strong>
            <br /><br />
            {content.catchingUpBody}
          </Section>

          <Section title={content.sections[2]!.title}>{content.sections[2]!.body}</Section>

          <Section title={content.tellUsTitle}>
            {content.tellUsPrefix} <a href="mailto:hello@whounfollowed.co" style={{ color: T.teal }}>hello@whounfollowed.co</a> {content.tellUsSuffix}
          </Section>
        </div>

        <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--t-border1)' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {content.backToHome}
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
