'use client';

import { useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { Check, Lock, Sparkles, X } from 'lucide-react';
import { PRO_AI_PRICE_USD, perMonth } from '@/lib/pricing';
import { startCheckout } from '@/lib/checkoutClient';
import { useStudio } from './StudioContext';
import type { SheetFeature } from './studio.content';

type Billing = 'monthly' | 'yearly';

// The one upgrade surface in Studio. Its title matches what was clicked; the
// offer is always Pro AI (the old Pro is no longer sold).
export function UpgradeSheet({ feature, onClose, container }: { feature: SheetFeature | null; onClose: () => void; container: HTMLElement | null }) {
  const { c, locale, tier, coach } = useStudio();
  const s = c.sheet;
  // Early Lifetime members see no Insider price here yet: their thank-you is
  // announced later (founder, 2026-11-29). You > billing explains why.
  const insider = coach.state?.plan === 'earlyLifetime';
  const [billing, setBilling] = useState<Billing>('yearly');
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const go = async () => {
    setBusy(true);
    setFailed(false);
    const ok = await startCheckout({ plan: billing === 'yearly' ? 'pro_ai_yearly' : 'pro_ai_monthly', placement: 'studio', locale });
    if (!ok) { setBusy(false); setFailed(true); }
  };

  return (
    <Dialog.Root open={feature !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal container={container}>
        <Dialog.Backdrop className="s-scrim" />
        <Dialog.Popup className="s-sheet">
          <div className="s-b">
            <div className="s-row" style={{ justifyContent: 'space-between' }}>
              <span className="s-bic tone-acc"><Sparkles size={16} /></span>
              <Dialog.Close aria-label={s.notNow} className="s-btn sec xs"><X size={14} /></Dialog.Close>
            </div>
            <div>
              <div className="s-lab" style={{ marginBottom: 4 }}>{c.plan.proAi}</div>
              <Dialog.Title style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.2, margin: 0 }}>
                {feature ? s.titles[feature] : ''}
              </Dialog.Title>
              {tier === 'pro' && !insider && <p className="s-sub-t" style={{ margin: '6px 0 0' }}>{s.legacyNote}</p>}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 9 }}>
              {s.bullets.map((b) => (
                <li key={b} className="s-row" style={{ alignItems: 'flex-start', fontSize: 13.5 }}>
                  <Check size={16} style={{ color: 'var(--accent)', marginTop: 1 }} />{b}
                </li>
              ))}
            </ul>
            <div role="radiogroup" aria-label={c.plan.proAi} className="s-grid s-g2" style={{ gap: 8 }}>
              {(['yearly', 'monthly'] as const).map((b) => (
                <button key={b} type="button" role="radio" aria-checked={billing === b} onClick={() => setBilling(b)} className={`s-ch${billing === b ? ' on' : ''}`}>
                  <span className="s-lab">{b === 'yearly' ? s.yearly : s.monthly}</span>
                  <b style={{ fontSize: 15 }}>{b === 'yearly' ? s.perYear(`$${PRO_AI_PRICE_USD.yearly}`) : s.perMonth(`$${PRO_AI_PRICE_USD.monthly}`)}</b>
                  {b === 'yearly' && <span className="s-sub-t" style={{ fontSize: 12 }}>{s.yearlyNote(`$${perMonth(PRO_AI_PRICE_USD.yearly)}`)}</span>}
                </button>
              ))}
            </div>
            <div className="s-col" style={{ gap: 8 }}>
              <button type="button" onClick={go} disabled={busy} className="s-btn lg wide">{s.start}</button>
              {failed && <p role="alert" style={{ fontSize: 13, color: 'var(--bad)', margin: 0 }}>{s.error}</p>}
              <button type="button" onClick={onClose} className="s-btn sec lg wide">{s.notNow}</button>
            </div>
            <Dialog.Description className="s-row s-sub-t" style={{ alignItems: 'flex-start', fontSize: 12, margin: 0 }}>
              <Lock size={13} style={{ marginTop: 2 }} />
              <span>{s.cancel} {s.privacy}</span>
            </Dialog.Description>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
