'use client';

import { useEffect, useState } from 'react';
import { Gift, Sparkles, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/components/AuthProvider';
import { TOPUP_PRICE_USD } from '@/lib/pricing';
import { useStudio } from '../StudioContext';
import { getStudioCoachContent } from './studioCoach.content';

// Monthly coach use, the only place it shows: nothing in normal use, a soft
// note near the end of the month (once per month), a clear line when it is
// used up (with a refill offer only when one can be bought), a one-time
// thank-you line for a gift, and the Insider offer for early Lifetime members
// whose gift is used up. Never numbers or amounts.

const seenKey = (what: string, id: string) => `wu-usage-${what}-${id}`;
function wasSeen(key: string): boolean {
  try { return localStorage.getItem(key) === '1'; } catch { return false; }
}
function markSeen(key: string) {
  try { localStorage.setItem(key, '1'); } catch { /* private mode: shows again next visit */ }
}

export function UsageNote({ compact = false }: { compact?: boolean }) {
  const { locale, coach, hasProAi, memberProAi } = useStudio();
  const auth = useAuth();
  const u = getStudioCoachContent(locale).usage;
  const a = coach.state?.allowance;
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);

  // Early Lifetime with the gift used up: no coach access, so no state either.
  if (!hasProAi && auth.isInsider && !auth.hasProAi) {
    return (
      <div className="s-nextci" role="note">
        <Sparkles size={16} />
        <span style={{ flex: '1 1 220px' }}><b>{u.insiderTitle}.</b> {u.insiderBody}</span>
        <Link href="/pricing" className="s-btn xs acc">{u.insiderCta}</Link>
      </div>
    );
  }
  if (!a || !memberProAi || !ready) return null;

  const date = a.resetsAt ? new Date(a.resetsAt).toLocaleDateString(locale, { day: 'numeric', month: 'short' }) : null;
  const period = a.resetsAt ?? 'none';
  const dismiss = (key: string) => { markSeen(key); setHidden((h) => new Set(h).add(key)); };
  const close = (key: string) => <button type="button" className="s-ib" aria-label={u.dismiss} onClick={() => dismiss(key)}><X size={13} /></button>;

  if (a.empty) {
    return (
      <div className="s-lockbar" role="status">
        <Sparkles size={16} />
        <span style={{ flex: '1 1 220px' }}>
          {u.empty(date)}{a.refills.canBuy && <> <Link href="/app/you" style={{ color: 'inherit', fontWeight: 600 }}>{u.refill(`$${TOPUP_PRICE_USD}`)}</Link></>}
        </span>
      </div>
    );
  }
  const nearKey = seenKey('near', period);
  if (a.nearLimit && !hidden.has(nearKey) && !wasSeen(nearKey)) {
    return <div className="s-nextci" role="status"><Sparkles size={16} /><span style={{ flex: '1 1 220px' }}>{u.near(date)}</span>{close(nearKey)}</div>;
  }
  const giftKey = seenKey('gift', auth.userId ?? 'me');
  if (!compact && a.gift.left && !hidden.has(giftKey) && !wasSeen(giftKey)) {
    return <div className="s-nextci" role="status"><Gift size={16} /><span style={{ flex: '1 1 220px' }}>{u.gift}</span>{close(giftKey)}</div>;
  }
  return null;
}
