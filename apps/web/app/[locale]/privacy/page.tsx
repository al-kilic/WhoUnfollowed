import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import type React from 'react';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { T } from '@/components/landing/tokens';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { routing, type AppLocale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { OG_LOCALE, ogAlternateLocales } from '@/i18n/ogLocale';
import { getPrivacyContent } from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const SEO_META: Record<AppLocale, { title: string; description: string }> = {
  en: { title: 'Privacy Policy', description: 'Privacy Policy for WhoUnfollowed. How we handle your data and our relationship with Instagram and Meta.' },
  es: { title: 'Política de Privacidad', description: 'Política de Privacidad de WhoUnfollowed. Cómo manejamos tus datos y nuestra relación con Instagram y Meta.' },
  pt: { title: 'Política de Privacidade', description: 'Política de Privacidade do WhoUnfollowed. Como tratamos seus dados e nossa relação com o Instagram e a Meta.' },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const meta = SEO_META[locale];
  const canonical = getPathname({ href: '/privacy', locale });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href: '/privacy', locale: l })]),
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

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const c = getPrivacyContent(locale);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '56px 24px 80px' }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 14 }}>{c.eyebrow}</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 12 }}>
            {c.headline}
          </h1>
          <p style={{ fontSize: 13, color: T.inkMute, fontFamily: T.mono }}>{c.dates}</p>
        </div>

        <div style={{ padding: '16px 20px', borderRadius: 12, border: `1px solid ${T.border2}`, background: T.surface1, marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: T.inkMute, lineHeight: 1.65, margin: 0 }}>
            <strong style={{ color: T.ink }}>{c.disclaimerBold}</strong> {c.disclaimerRest}
          </p>
        </div>

        <div style={{ padding: '20px 24px', borderRadius: 16, border: '1px solid rgba(2,136,143,0.3)', background: 'rgba(2,136,143,0.06)', marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: T.tealLight, fontFamily: T.mono, letterSpacing: '0.1em', marginBottom: 8 }}>{c.tldrLabel}</div>
          <p style={{ fontSize: 15, color: T.ink, lineHeight: 1.6, margin: 0 }}>{c.tldrBody}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

          <Section title={c.s1Title}>{c.s1Body}</Section>

          <Section title={c.s2Title}>
            {c.s2Intro}
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {c.legalBases.map(item => (
                <li key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: T.inkDim }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.tealMid, flexShrink: 0, marginTop: 7 }} />
                  <span><strong style={{ color: T.ink }}>{item.label}:</strong> {item.text}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title={c.s3Title}>
            {c.s3Body1}
            <br /><br />
            {c.s3Body2}
          </Section>

          <Section title={c.s4Title}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {c.neverCollect.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderRadius: 10, background: 'rgba(168,75,47,0.04)', border: '1px solid rgba(168,75,47,0.12)' }}>
                  <span style={{ fontSize: 13, fontFamily: T.mono, fontWeight: 800, color: T.terra, flexShrink: 0, letterSpacing: '0.06em' }}>{locale === 'en' ? 'NEVER' : locale === 'es' ? 'NUNCA' : 'NUNCA'}</span>
                  <span style={{ fontSize: 14, color: T.ink }}>{item}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={c.s5Title}>
            {c.s5Body1}
            <br /><br />
            {c.s5Body2}
            <br /><br />
            {c.s5Body3}
          </Section>

          <Section title={c.s6Title}>
            {c.s6Body1}
            <br /><br />
            {c.s6Body2}
          </Section>

          <Section title={c.s7Title}>
            {c.s7Body1}
            <br /><br />
            {c.s7Body2}
          </Section>

          <Section title={c.s8Title}>
            <strong style={{ color: T.ink }}>{c.s8FreeLabel}</strong> {c.s8FreeBody}
            <br /><br />
            <strong style={{ color: T.ink }}>{c.s8ProLabel}</strong> {c.s8ProBody}
          </Section>

          <Section title={c.s9Title}>
            {c.s9Intro}
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
              {c.gdprRights.map(r => (
                <li key={r} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: T.inkDim }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.tealMid, flexShrink: 0, marginTop: 7 }} />
                  {r}
                </li>
              ))}
            </ul>
            <br />
            {c.s9Outro}
          </Section>

          <Section title={c.s10Title}>{c.s10Body}</Section>

          <Section title={c.s11Title}>{c.s11Body}</Section>

          <Section title={c.s12Title}>
            {c.s12Intro}<br />
            <a href="mailto:hello@whounfollowed.co" style={{ color: T.tealLight, textDecoration: 'none' }}>hello@whounfollowed.co</a>
            <br /><br />
            <span style={{ fontSize: 13, color: T.inkMute }}>{c.s12Footer}</span>
          </Section>

        </div>

        <div style={{ marginTop: 56, paddingTop: 32, borderTop: `1px solid ${T.border1}` }}>
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
      <h2 style={{ fontFamily: T.serif, fontSize: 19, fontWeight: 400, color: T.ink, letterSpacing: '-0.01em', marginBottom: 12 }}>{title}</h2>
      <div style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}
