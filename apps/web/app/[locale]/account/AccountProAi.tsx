'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { T } from '@/components/landing/tokens';
import { openBillingPortal, syncAfterPortal } from '@/lib/billingPortalClient';
import { useRouter } from 'next/navigation';
import type { AllowanceView } from '@/lib/ai/allowanceMath';
import { levelOf } from '@/components/studio/you/CreditsView';

interface Copy {
  title: string; level: { low: string; mid: string; high: string; full: string }; refills: (d: string) => string; renews: (d: string) => string; ends: (d: string) => string; keep: string;
  coach: string; memory: string; manage: string; opening: string; error: string;
}

const COPY: Record<AppLocale, Copy> = {
  en: { title: 'Pro AI', level: { low: 'Plenty of coach use left this month', mid: 'About half of this month used', high: 'Most of this month used', full: "This month's coach use is used up" }, refills: (d) => `resets ${d}`, renews: (d) => `Renews on ${d}. Cancel any time.`, ends: (d) => `Ends on ${d}. It won't renew.`, keep: 'Keep my plan', coach: 'Open your coach', memory: 'Memory', manage: 'Manage billing', opening: 'Opening...', error: 'Could not open billing. Try again.' },
  es: { title: 'Pro AI', level: { low: 'Te queda mucho uso del coach este mes', mid: 'Llevas cerca de la mitad del mes', high: 'Llevas usada la mayor parte del mes', full: 'Ya usaste el coach de este mes' }, refills: (d) => `se renueva el ${d}`, renews: (d) => `Se renueva el ${d}. Cancela cuando quieras.`, ends: (d) => `Termina el ${d}. No se renovará.`, keep: 'Mantener mi plan', coach: 'Abrir tu coach', memory: 'Memoria', manage: 'Gestionar pagos', opening: 'Abriendo...', error: 'No se pudo abrir la facturación. Inténtalo de nuevo.' },
  pt: { title: 'Pro AI', level: { low: 'Ainda sobra bastante uso do coach neste mês', mid: 'Cerca de metade do mês usada', high: 'A maior parte do mês usada', full: 'O uso do coach deste mês acabou' }, refills: (d) => `renova em ${d}`, renews: (d) => `Renova em ${d}. Cancele quando quiser.`, ends: (d) => `Termina em ${d}. Não vai renovar.`, keep: 'Manter meu plano', coach: 'Abrir seu coach', memory: 'Memória', manage: 'Gerenciar pagamento', opening: 'Abrindo...', error: 'Não foi possível abrir o pagamento. Tente de novo.' },
};

// Account page panel for anyone with Pro AI: how much coach use is left (in
// words, never numbers), links to the coach, and
// (for subscribers) Stripe's billing portal to cancel or change the card.
// inStudio: shown on Studio > You, which already has the coach and memory, so
// those two links are left out.
export function AccountProAi({ locale, isSubscriber, periodEnd, cancelAt = null, inStudio = false }: { locale: AppLocale; isSubscriber: boolean; periodEnd: string | null; cancelAt?: string | null; inStudio?: boolean }) {
  const c = COPY[locale];
  const [usage, setUsage] = useState<AllowanceView | null>(null);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState(false);
  const fmt = (iso: string) => new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });

  const router = useRouter();
  // Back from Stripe's billing portal: show a cancel or resume straight away.
  useEffect(() => { if (!inStudio) void syncAfterPortal(() => router.refresh()); }, [inStudio, router]);

  useEffect(() => {
    void fetch('/api/ai/state', { cache: 'no-store' }).then(async (r) => {
      if (r.ok) setUsage(((await r.json()) as { allowance?: AllowanceView }).allowance ?? null);
    });
  }, []);

  async function manage() {
    setOpening(true); setError(false);
    if (await openBillingPortal(locale, inStudio ? 'you' : 'account')) return;
    setOpening(false); setError(true);
  }

  const link = { fontSize: 13, fontWeight: 600, color: T.tealLight, textDecoration: 'none' } as const;
  return (
    <section style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.inkMute, fontFamily: T.mono, marginBottom: 10 }}>{c.title}</div>
      <div style={{ background: T.surface1, border: `1px solid ${T.border2}`, borderRadius: 16, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {usage && (
          <div style={{ fontSize: 14, color: T.inkDim }}>
            <strong style={{ color: T.ink }}>{c.level[levelOf(usage)]}</strong>
            {usage.resetsAt ? ` · ${c.refills(fmt(usage.resetsAt))}` : ''}
          </div>
        )}
        {isSubscriber && (cancelAt || periodEnd) && <div style={{ fontSize: 13, color: T.inkDim }}>{cancelAt ? c.ends(fmt(cancelAt)) : c.renews(fmt(periodEnd!))}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          {!inStudio && <Link href="/app/today" style={link}>{c.coach} →</Link>}
          {!inStudio && <Link href="/app/you" style={link}>{c.memory}</Link>}
          {isSubscriber && (
            <button type="button" onClick={() => void manage()} disabled={opening}
              style={{ font: 'inherit', fontSize: 13, fontWeight: 600, padding: '8px 14px', borderRadius: 10, border: `1px solid ${T.border3}`, background: 'transparent', color: T.ink, cursor: 'pointer' }}>
              {opening ? c.opening : cancelAt ? c.keep : c.manage}
            </button>
          )}
        </div>
        {error && <p role="alert" style={{ margin: 0, fontSize: 13, color: T.terraText }}>{c.error}</p>}
      </div>
    </section>
  );
}
