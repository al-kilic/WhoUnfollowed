import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { StudioFrame } from '@/components/studio/StudioFrame';
import { betaCode, safeNext } from '@/lib/betaGate';
import { BETA_COPY, betaLocale } from './beta.content';
import { BetaForm } from './BetaForm';
import '@/styles/auth.css';

// Staging gate: one access code for beta testers, then they sign up with
// their own accounts. Exists only when STAGING_ACCESS_CODE is set.
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'WhoUnfollowed Beta', robots: { index: false, follow: false } };

export default async function BetaAccessPage({ searchParams }: { searchParams: Promise<{ next?: string; lang?: string }> }) {
  if (!betaCode()) notFound();
  const sp = await searchParams;
  const locale = betaLocale(sp.lang, (await headers()).get('accept-language'));
  const c = BETA_COPY[locale];
  return (
    <StudioFrame>
      <main className="a-wrap" style={{ minHeight: '100vh', alignContent: 'center' }} lang={locale}>
        <div className="a-col" style={{ paddingTop: 48 }}>
          <section className="s-card a-card" aria-labelledby="beta-title">
            <h1 id="beta-title" className="a-title">{c.title}</h1>
            <p className="a-sub">{c.sub}</p>
            <BetaForm c={c} next={safeNext(sp.next)} />
          </section>
          <p className="a-privacy"><ShieldCheck size={14} aria-hidden />{c.note}</p>
        </div>
      </main>
    </StudioFrame>
  );
}
