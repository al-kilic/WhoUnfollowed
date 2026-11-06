'use client';

import { useEffect, useState } from 'react';
import { T } from '@/components/landing/tokens';
import { track, Events } from '@/lib/analytics';
import { EmailOptInForm } from '@/components/EmailOptInForm';
import { startCheckout, type CheckoutPlan } from '@/lib/checkoutClient';
import { unlockPricesAt, isLaunchPricing, STANDARD_UNLOCK_PRICE_USD } from '@/lib/pricing';
import type { AppLocale } from '@/i18n/routing';
import { getNextCheckContent } from './nextCheck.content';

// Remembers in this browser that a reminder is already set, so the box turns
// into a one-line confirmation on later visits. A convenience only.
const REMINDER_SET_KEY = 'wu:reminder-set-until';

function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, v), template);
}

// The bridge from "today's list" to the next visit: a reminder opt-in for
// everyone, and for free users the offer that pays off on that next visit.
export function NextCheckSection({ locale, isPro, userEmail, nonFollowersCount }: {
  locale: AppLocale;
  isPro: boolean;
  userEmail: string | null;
  nonFollowersCount: number;
}) {
  const c = getNextCheckContent(locale);
  const [reminderUntil, setReminderUntil] = useState<string | null>(null);
  const [already, setAlready] = useState(false);
  const [loading, setLoading] = useState<CheckoutPlan | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMINDER_SET_KEY);
      if (saved && new Date(saved).getTime() > Date.now()) setReminderUntil(saved);
    } catch {}
    if (!isPro) track(Events.offerView, { placement: 'results-next-check' });
  }, [isPro]);

  const prices = unlockPricesAt();
  const launch = isLaunchPricing();
  const dateLabel = reminderUntil
    ? new Date(reminderUntil).toLocaleDateString(locale, { day: 'numeric', month: 'long' })
    : '';

  async function buy(plan: 'yearly' | 'monthly') {
    setLoading(plan);
    setError(false);
    const ok = await startCheckout({ plan, placement: 'results', locale });
    if (!ok) { setError(true); setLoading(null); }
  }

  const reminder = (
    <div style={{ display: 'grid', gap: 10, alignContent: 'start', padding: '22px 22px 20px', borderRadius: 18, background: T.surface1, border: `1px solid ${T.border2}` }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.tealLight, fontFamily: T.mono }}>{c.reminderEyebrow}</span>
      <h2 style={{ fontFamily: T.serif, fontWeight: 400, fontSize: 23, lineHeight: 1.2, letterSpacing: '-0.01em', color: T.ink, margin: 0 }}>{c.reminderTitle}</h2>
      {reminderUntil || already ? (
        <p role="status" style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: T.tealMid, fontWeight: 600 }}>
          {already ? c.reminderAlready : fill(c.reminderDone, { date: dateLabel })}
        </p>
      ) : (
        <>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: T.inkDim }}>{c.reminderBody}</p>
          <EmailOptInForm
            id="results-reminder-email"
            source="results"
            locale={locale}
            labels={c}
            defaultEmail={userEmail ?? undefined}
            onDone={({ nextAt, alreadyOn }) => {
              track(Events.reminderOptin, { source: 'results' });
              if (alreadyOn) setAlready(true);
              if (nextAt) {
                setReminderUntil(nextAt);
                try { localStorage.setItem(REMINDER_SET_KEY, nextAt); } catch {}
              }
            }}
          />
          <span style={{ fontSize: 11.5, color: T.inkMute }}>{c.reminderPrivacy}</span>
        </>
      )}
    </div>
  );

  if (isPro) {
    return <section style={{ marginTop: 40 }}>{reminder}</section>;
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2" style={{ marginTop: 40, gap: 14 }}>
      {reminder}
      <div style={{
        display: 'grid', gap: 10, alignContent: 'start', padding: '22px 22px 20px', borderRadius: 18,
        background: 'linear-gradient(180deg, rgba(var(--t-accent-rgb),0.12) 0%, rgba(var(--t-accent-rgb),0.03) 100%)',
        border: `1.5px solid ${T.tealMid}`,
      }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.tealLight, fontFamily: T.mono }}>{c.offerEyebrow}</span>
        <h2 style={{ fontFamily: T.serif, fontWeight: 400, fontSize: 23, lineHeight: 1.2, letterSpacing: '-0.01em', color: T.ink, margin: 0 }}>{c.offerTitle}</h2>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: T.inkDim }}>{c.offerBody}</p>
        {nonFollowersCount >= 300 && (
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: T.ink, background: T.surface1, border: `1px solid ${T.border1}`, borderRadius: 10, padding: '8px 11px' }}>
            {fill(c.bigListHint, { n: nonFollowersCount.toLocaleString(locale) })}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 14px', marginTop: 4 }}>
          <button
            onClick={() => void buy('yearly')}
            disabled={loading !== null}
            style={{
              padding: '11px 18px', borderRadius: 11, border: 'none', background: T.teal, color: T.cream,
              fontSize: 14, fontWeight: 600, fontFamily: T.sans, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, boxShadow: '0 8px 24px rgba(var(--t-accent-rgb),0.3)',
            }}
          >
            {loading === 'yearly' ? c.redirecting : fill(c.offerCta, { price: `$${prices.yearly}` })}
          </button>
          <button
            onClick={() => void buy('monthly')}
            disabled={loading !== null}
            style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, color: T.inkDim, fontFamily: T.sans, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}
          >
            {loading === 'monthly' ? c.redirecting : fill(c.offerMonthly, { price: `$${prices.monthly}` })}
          </button>
        </div>
        {launch && (
          <span style={{ fontSize: 12, fontWeight: 600, color: T.terraText }}>
            {fill(c.offerLaunch, { std: `$${STANDARD_UNLOCK_PRICE_USD.yearly}` })}
          </span>
        )}
        {error && <p role="alert" style={{ margin: 0, fontSize: 12.5, color: T.terraText }}>{c.offerError}</p>}
      </div>
    </section>
  );
}
