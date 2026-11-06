'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Account } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';
import { track, Events } from '@/lib/analytics';
import { startCheckout, type CheckoutPlacement } from '@/lib/checkoutClient';
import { unlockPricesAt, isLaunchPricing, STANDARD_UNLOCK_PRICE_USD } from '@/lib/pricing';
import type { AppLocale } from '@/i18n/routing';
import { getUnfollowerRevealContent } from './unfollowerReveal.content';

function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, v), template);
}

// How many real names a free user sees. Enough to prove the list is real,
// never enough to make paying pointless.
export function visibleNameCount(lost: number): number {
  if (lost >= 4) return 2;
  if (lost >= 2) return 1;
  return 0;
}

// Placeholder rows for the hidden names. Random letters with random lengths,
// never derived from the real usernames, so the blur hides nothing that could
// be read back out of the page.
function placeholderHandles(count: number): string[] {
  const letters = 'abcdefghijklmnopqrstuvwxyz._';
  return Array.from({ length: count }, () => {
    const len = 7 + Math.floor(Math.random() * 9);
    return Array.from({ length: len }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  });
}

function countBucket(n: number): string {
  if (n === 0) return '0';
  if (n <= 5) return '1-5';
  if (n <= 20) return '6-20';
  return '21+';
}

// The paid moment: real count of who left since the last export, a couple of
// real names, the rest blurred placeholders. Only the visible names ever
// reach the DOM.
export function UnfollowerReveal({ lostFollowers, newFollowersCount, sinceLabel, locale, placement, onCheckoutStart, children }: {
  lostFollowers: Account[];
  newFollowersCount: number;
  sinceLabel: string;
  locale: AppLocale;
  placement: CheckoutPlacement;
  // Runs right before the redirect to Stripe (e.g. to remember which
  // comparison to open after paying).
  onCheckoutStart?: () => void;
  // Extra actions under the offer (e.g. "Continue free").
  children?: React.ReactNode;
}) {
  const c = getUnfollowerRevealContent(locale);
  const [loading, setLoading] = useState<'yearly' | 'monthly' | null>(null);
  const [error, setError] = useState(false);
  const n = lostFollowers.length;

  const visible = useMemo(() => {
    const k = visibleNameCount(n);
    // Most recently gained followers first: the ones people least expect to lose.
    return [...lostFollowers].sort((a, b) => (b.followedAt ?? 0) - (a.followedAt ?? 0)).slice(0, k);
  }, [lostFollowers, n]);
  const hiddenCount = n - visible.length;
  const [placeholders] = useState(() => placeholderHandles(Math.min(4, hiddenCount)));
  const prices = unlockPricesAt();

  useEffect(() => { track(Events.revealView, { count_bucket: countBucket(n), placement }); }, [n, placement]);

  async function buy(plan: 'yearly' | 'monthly') {
    setLoading(plan);
    setError(false);
    onCheckoutStart?.();
    const ok = await startCheckout({ plan, placement, locale });
    if (!ok) { setError(true); setLoading(null); }
  }

  const title = n === 0
    ? fill(c.titleNone, { date: sinceLabel })
    : n === 1
      ? fill(c.titleOne, { date: sinceLabel })
      : fill(c.titleMany, { n: n.toLocaleString(locale), date: sinceLabel });

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gap: 6 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.terraText, fontFamily: T.mono }}>{c.eyebrow}</span>
        <h2 id="unfollower-reveal-title" style={{ fontFamily: T.serif, fontWeight: 400, fontSize: 'clamp(24px, 4vw, 30px)', lineHeight: 1.12, letterSpacing: '-0.02em', color: T.ink, margin: 0 }}>
          {title}
        </h2>
        {newFollowersCount > 0 && (
          <span style={{ fontSize: 13, color: T.tealMid, fontWeight: 600 }}>{fill(c.newFollowers, { n: newFollowersCount.toLocaleString(locale) })}</span>
        )}
      </div>

      {n > 0 && (
        <ul style={{ listStyle: 'none', margin: 0, padding: '6px 0', borderRadius: 14, background: T.surface1, border: `1px solid ${T.border1}` }}>
          {visible.map((a) => (
            <li key={a.username} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', fontFamily: T.mono, fontSize: 13.5, color: T.ink }}>
              <span aria-hidden style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(168,75,47,0.18)', flexShrink: 0 }} />
              @{a.username}
            </li>
          ))}
          {placeholders.map((p, i) => (
            <li key={i} aria-hidden style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', fontFamily: T.mono, fontSize: 13.5, color: T.ink, filter: 'blur(5px)', userSelect: 'none' }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: T.border2, flexShrink: 0 }} />
              @{p}
            </li>
          ))}
          {hiddenCount > placeholders.length && (
            <li style={{ padding: '6px 14px 4px', fontSize: 12.5, color: T.inkMute, fontFamily: T.mono }}>
              {fill(c.moreHidden, { n: (hiddenCount - placeholders.length).toLocaleString(locale) })}
            </li>
          )}
        </ul>
      )}

      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: T.inkDim }}>{n === 0 ? c.noneBody : c.body}</p>

      {n > 0 && (
        <div style={{ display: 'grid', gap: 8 }}>
          <button
            onClick={() => void buy('yearly')}
            disabled={loading !== null}
            style={{
              width: '100%', padding: '13px 18px', borderRadius: 12, border: 'none', background: T.teal, color: T.cream,
              fontSize: 15, fontWeight: 600, fontFamily: T.sans, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, boxShadow: '0 8px 24px rgba(var(--t-accent-rgb),0.3)',
            }}
          >
            {loading === 'yearly' ? c.redirecting : fill(c.cta, { price: `$${prices.yearly}` })}
          </button>
          <button
            onClick={() => void buy('monthly')}
            disabled={loading !== null}
            style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, color: T.inkDim, fontFamily: T.sans, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer', justifySelf: 'center' }}
          >
            {loading === 'monthly' ? c.redirecting : fill(c.monthly, { price: `$${prices.monthly}` })}
          </button>
          {isLaunchPricing() && (
            <span style={{ fontSize: 12, fontWeight: 600, color: T.terraText, textAlign: 'center' }}>
              {fill(c.launch, { std: `$${STANDARD_UNLOCK_PRICE_USD.yearly}` })}
            </span>
          )}
          {error && <p role="alert" style={{ margin: 0, fontSize: 12.5, color: T.terraText, textAlign: 'center' }}>{c.error}</p>}
        </div>
      )}

      {children}
    </div>
  );
}
