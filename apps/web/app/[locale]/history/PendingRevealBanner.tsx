'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { T } from '@/components/landing/tokens';
import { readPendingReveal, clearPendingReveal, type PendingReveal } from '@/lib/pendingReveal';
import type { AppLocale } from '@/i18n/routing';

const COPY: Record<AppLocale, { title: string; cta: string }> = {
  en: { title: 'Your unfollower report is ready.', cta: 'See who unfollowed you' },
  es: { title: 'Tu informe de quién te dejó de seguir está listo.', cta: 'Ver quién te dejó de seguir' },
  pt: { title: 'Seu relatório de quem deixou de te seguir está pronto.', cta: 'Ver quem deixou de te seguir' },
};

// After buying from the unfollower reveal, the buyer lands here (via the
// welcome flow). Points them straight at the comparison they paid to see.
export function PendingRevealBanner({ locale, isPro, snapshotIds }: { locale: AppLocale; isPro: boolean; snapshotIds: number[] }) {
  const [pending, setPending] = useState<PendingReveal | null>(null);
  useEffect(() => { setPending(readPendingReveal()); }, []);

  if (!isPro || !pending) return null;
  if (!snapshotIds.includes(pending.oldId) || !snapshotIds.includes(pending.newId)) return null;
  const t = COPY[locale];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap',
      padding: '16px 18px', borderRadius: 14, marginBottom: 24,
      background: 'rgba(var(--t-accent-rgb),0.08)', border: `1px solid ${T.tealMid}`,
    }}>
      <span style={{ fontFamily: T.serif, fontSize: 20, color: T.ink }}>{t.title}</span>
      <Link
        href={`/diff?old=${pending.oldId}&current=${pending.newId}`}
        onClick={() => clearPendingReveal()}
        style={{ padding: '10px 16px', borderRadius: 10, background: T.teal, color: T.cream, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}
      >
        {t.cta}
      </Link>
    </div>
  );
}
