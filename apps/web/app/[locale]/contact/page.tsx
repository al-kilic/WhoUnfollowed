import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { ContactContent } from './ContactContent';
import { getContactContent } from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const SEO_META: Record<AppLocale, { title: string; description: string; ogDescription: string; twitterDescription: string }> = {
  en: {
    title: 'Contact WhoUnfollowed',
    description: 'Bug reports, feature requests, privacy questions, or press. One person reads every email and usually replies within 24 hours.',
    ogDescription: 'One person reads every email and usually replies within 24 hours.',
    twitterDescription: 'One person reads every email. Usually a reply within 24 hours.',
  },
  es: {
    title: 'Contacta con WhoUnfollowed',
    description: 'Reportes de errores, solicitudes de funciones, preguntas de privacidad o prensa. Una sola persona lee cada correo y suele responder en menos de 24 horas.',
    ogDescription: 'Una sola persona lee cada correo y suele responder en menos de 24 horas.',
    twitterDescription: 'Una sola persona lee cada correo. Respuesta habitual en menos de 24 horas.',
  },
  pt: {
    title: 'Contate o WhoUnfollowed',
    description: 'Relatos de bugs, sugestões de funcionalidades, perguntas de privacidade ou imprensa. Uma só pessoa lê cada email e costuma responder em até 24 horas.',
    ogDescription: 'Uma só pessoa lê cada email e costuma responder em até 24 horas.',
    twitterDescription: 'Uma só pessoa lê cada email. Resposta geralmente em até 24 horas.',
  },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const meta = SEO_META[locale];
  const canonical = getPathname({ href: '/contact', locale });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href: '/contact', locale: l })]),
  );

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages: { ...languages, 'x-default': languages.en } },
    openGraph: {
      type: 'website',
      title: meta.title,
      description: meta.ogDescription,
      url: `${SITE_URL}${canonical}`,
      siteName: 'WhoUnfollowed',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.twitterDescription,
    },
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <ContactContent content={getContactContent(locale)} />;
}
