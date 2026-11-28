import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { OG_LOCALE, ogAlternateLocales } from '@/i18n/ogLocale';
import { getPathname } from '@/i18n/navigation';
import { getGuidesSectionContent } from '@/components/landing/guidesSection.content';
import { InstagramContent } from './InstagramContent';
import { getInstagramPageContent } from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const { meta } = getInstagramPageContent(locale);
  const canonical = getPathname({ href: '/instagram', locale });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, getPathname({ href: '/instagram', locale: l })]));
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages: { ...languages, 'x-default': languages.en } },
    openGraph: { title: meta.title, description: meta.description, url: `${SITE_URL}${canonical}`, locale: OG_LOCALE[locale], alternateLocale: ogAlternateLocales(locale) },
    twitter: { title: meta.title, description: meta.description },
  };
}

// The Instagram pillar: the full guide around the tool (export, lists,
// limits). The homepage stays the tool itself.
export default async function InstagramPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const c = getInstagramPageContent(locale as AppLocale);
  const canonical = `${SITE_URL}${getPathname({ href: '/instagram', locale })}`;

  // Built from the content the page renders, so they can't drift.
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: c.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    {
      '@context': 'https://schema.org', '@type': 'HowTo', name: c.stepsH, description: c.intro, totalTime: 'PT5M',
      tool: [{ '@type': 'HowToTool', name: 'Meta Accounts Center' }],
      step: c.steps.map((s, i) => ({ '@type': 'HowToStep', name: s.t, text: s.b, url: `${canonical}#step${i + 1}` })),
    },
    {
      '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'WhoUnfollowed', url: canonical,
      applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web', description: c.meta.description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <InstagramContent c={c} guideTitles={getGuidesSectionContent(locale as AppLocale).titles} />
    </>
  );
}
