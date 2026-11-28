'use client';

import '@/styles/home-base.css';

// Shown when a page crashes (app/[locale]/error.tsx). Same look as the 404,
// but without the site header and footer: they could be what failed. No
// stack trace or error text is ever shown; the digest is only a support code.
export type ErrorLocale = 'en' | 'es' | 'pt';

export const ERROR_COPY: Record<ErrorLocale, { lab: string; h1: string; p: string; retry: string; home: string; code: string }> = {
  en: { lab: 'Something went wrong', h1: 'This page tripped over itself.', p: 'Nothing you did caused it, and your export stays in this browser. Try again, or head back home.', retry: 'Try again', home: 'Go home', code: 'Error code' },
  es: { lab: 'Algo salió mal', h1: 'Esta página tropezó.', p: 'No fue nada que hicieras, y tu export sigue en este navegador. Inténtalo de nuevo o vuelve al inicio.', retry: 'Intentar de nuevo', home: 'Ir al inicio', code: 'Código de error' },
  pt: { lab: 'Algo deu errado', h1: 'Esta página tropeçou.', p: 'Não foi nada que você fez, e o seu export continua neste navegador. Tente de novo ou volte para o início.', retry: 'Tentar de novo', home: 'Ir para o início', code: 'Código do erro' },
};

export function localeFromPath(path: string | null | undefined): ErrorLocale {
  const first = (path ?? '').split('/')[1];
  return first === 'es' || first === 'pt' ? first : 'en';
}

export function ErrorView({ locale, digest, onRetry }: { locale: ErrorLocale; digest?: string | undefined; onRetry: () => void }) {
  const c = ERROR_COPY[locale];
  const home = locale === 'en' ? '/' : `/${locale}`;
  return (
    <div className="hm hm-page">
      <main className="wrap" style={{ minHeight: '80vh', display: 'grid', alignContent: 'center', justifyItems: 'center', textAlign: 'center', gap: 16, paddingBlock: 96 }}>
        <span className="lab">{c.lab}</span>
        <h1 style={{ fontSize: 'clamp(30px,4.5vw,48px)' }}>{c.h1}</h1>
        <p style={{ color: 'var(--ink2)', maxWidth: 460 }}>{c.p}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          <button type="button" className="btn pri" onClick={onRetry}>{c.retry}</button>
          {/* A plain link (not client navigation): a full reload clears the broken state. */}
          <a className="btn sec" href={home}>{c.home}</a>
        </div>
        {digest && <p style={{ color: 'var(--faint)', fontSize: 12, fontFamily: 'var(--mono)' }}>{c.code}: {digest}</p>}
      </main>
    </div>
  );
}
