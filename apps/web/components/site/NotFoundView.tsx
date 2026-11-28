'use client';

import '@/styles/home-base.css';
import NextLink from 'next/link';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

const COPY: Record<AppLocale, { lab: string; h1: string; p: string; home: string; guides: string; studio: string }> = {
  en: { lab: '404', h1: 'This page left without a trace.', p: 'The link may be old or mistyped. Everything else is where you left it.', home: 'Go to the homepage', guides: 'Read the guides', studio: 'Open Studio' },
  es: { lab: '404', h1: 'Esta página se fue sin dejar rastro.', p: 'El enlace puede ser antiguo o tener un error. Todo lo demás sigue donde lo dejaste.', home: 'Ir a la página de inicio', guides: 'Leer las guías', studio: 'Abrir Studio' },
  pt: { lab: '404', h1: 'Esta página saiu sem deixar rastro.', p: 'O link pode ser antigo ou ter um erro. Todo o resto continua onde você deixou.', home: 'Ir para a página inicial', guides: 'Ler os guias', studio: 'Abrir o Studio' },
};

// Shown for any unknown URL, in the site's current look.
export function NotFoundView() {
  const c = COPY[useLocale() as AppLocale] ?? COPY.en;
  return (
    <div className="hm hm-page">
      <SiteHeader />
      <main className="wrap" style={{ minHeight: '62vh', display: 'grid', alignContent: 'center', justifyItems: 'center', textAlign: 'center', gap: 16, paddingBlock: 96 }}>
        <span className="lab">{c.lab}</span>
        <h1 style={{ fontSize: 'clamp(34px,5vw,56px)' }}>{c.h1}</h1>
        <p style={{ color: 'var(--ink2)', maxWidth: 460 }}>{c.p}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          <Link className="btn pri" href="/">{c.home}</Link>
          <NextLink className="btn sec" href="/blog">{c.guides}</NextLink>
          <Link className="btn sec" href="/app">{c.studio}</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
