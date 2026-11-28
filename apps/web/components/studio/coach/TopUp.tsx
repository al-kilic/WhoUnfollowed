'use client';

import { useEffect, useRef, useState } from 'react';
import { Package, Plus, Sparkles } from 'lucide-react';
import { TOPUP_PRICE_USD, TOPUP_VALID_MONTHS } from '@/lib/pricing';
import { MAX_REFILLS_HELD, type AllowanceView } from '@/lib/ai/allowanceMath';
import { startCheckout } from '@/lib/checkoutClient';
import { useStudio } from '../StudioContext';
import { getYouContent } from '../you/you.content';

// Refill: one more month of coach use for half the monthly price (the Stripe
// "top-up" price). At most MAX_REFILLS_HELD held at once; members without a
// paid plan (early Lifetime or old Pro on a gift) are offered Pro AI instead.
// After Stripe the page comes back with ?topup=1, syncs the refill from Stripe
// (/api/stripe/sync) and refreshes once.
export function RefillOffer({ v }: { v: AllowanceView | null | undefined }) {
  const { locale, coach, openUpgrade } = useStudio();
  const k = getYouContent(locale).refill;
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [back, setBack] = useState(false);
  const { reload } = coach;

  // Once per return from Stripe: drop ?topup=1 from the address first, so the
  // state refresh can never start this again (it used to loop every 3 seconds).
  const reloadRef = useRef(reload);
  reloadRef.current = reload;
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('topup') !== '1') return;
    url.searchParams.delete('topup');
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    setBack(true);
    // Ask the server to read the paid refill from Stripe right away (in case
    // the webhook is late), then refresh once.
    void fetch('/api/stripe/sync', { method: 'POST' }).catch(() => null).finally(() => void reloadRef.current());
  }, []);

  async function buy() {
    setBusy(true); setFailed(false);
    if (!(await startCheckout({ plan: 'topup', placement: 'studio', locale }))) { setBusy(false); setFailed(true); }
  }

  if (!v) return null;
  const full = !v.refills.canBuy && v.refills.held >= MAX_REFILLS_HELD;
  return (
    <div className="s-col" style={{ gap: 6 }}>
      {v.refills.canBuy ? (
        <div className={v.nearLimit || v.empty ? 's-pack' : 's-pack calm'}>
          <span className="s-row" style={{ gap: 10 }}><span className="s-packic"><Package size={16} /></span><span><b>{k.cta(`$${TOPUP_PRICE_USD}`)}</b><span className="s-sub-t">{k.note(TOPUP_VALID_MONTHS)}</span></span></span>
          <button type="button" className="s-btn" disabled={busy} onClick={() => void buy()}><Plus size={14} />${TOPUP_PRICE_USD}</button>
        </div>
      ) : full ? (
        <span className="s-sub-t" style={{ fontSize: 13 }}>{k.full(v.refills.held)}</span>
      ) : (
        <div className="s-row" style={{ gap: 10, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <span className="s-sub-t" style={{ fontSize: 13, flex: '1 1 220px' }}>{k.noPlan}</span>
          <button type="button" className="s-btn acc xs" onClick={() => openUpgrade('coach')}><Sparkles size={13} />{k.getProAi}</button>
        </div>
      )}
      {back && <span role="status" style={{ fontSize: 13, color: 'var(--good)' }}>{k.done}</span>}
      {failed && <span role="alert" style={{ fontSize: 13, color: 'var(--bad)' }}>{k.error}</span>}
    </div>
  );
}

// Kept for the coach credits card: the same offer from the coach state.
export function TopUp() {
  const { coach } = useStudio();
  return <RefillOffer v={coach.state?.allowance} />;
}
