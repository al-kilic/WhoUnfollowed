'use client';

import { useEffect, useState } from 'react';
import { Camera, CalendarDays, Lightbulb, MessageCircle, PenLine, ScanLine } from 'lucide-react';
import type { UsageBreakdown, UsageFeature } from '@/lib/ai/usageBreakdown';
import type { AllowanceView } from '@/lib/ai/allowanceMath';
import { useSampleOn } from '@/lib/sample/sampleMode';
import { useStudio } from '../StudioContext';
import { getMonthlyUseContent } from './monthlyUse.content';

const ICON: Record<UsageFeature, typeof MessageCircle> = { ask: MessageCircle, create: PenLine, plan: CalendarDays, photos: Camera, reads: ScanLine };
const SAMPLE: UsageBreakdown = {
  byFeature: [{ feature: 'ask', share: 0.46 }, { feature: 'create', share: 0.28 }, { feature: 'plan', share: 0.16 }, { feature: 'reads', share: 0.1 }],
  months: [{ month: '2026-06', fill: 0.3 }, { month: '2026-07', fill: 0.42 }, { month: '2026-08', fill: 0.55 }, { month: '2026-09', fill: 0.38 }, { month: '2026-10', fill: 0.71 }, { month: '2026-11', fill: 0.35 }],
};

export function useBreakdown(): UsageBreakdown | null {
  const sample = useSampleOn();
  const [b, setB] = useState<UsageBreakdown | null>(sample ? SAMPLE : null);
  useEffect(() => {
    if (sample) return;
    let alive = true;
    void fetch('/api/ai/credits', { cache: 'no-store' }).then(async (r) => {
      if (r.ok && alive) setB(((await r.json()) as { breakdown?: UsageBreakdown }).breakdown ?? null);
    }).catch(() => undefined);
    return () => { alive = false; };
  }, [sample]);
  return b;
}

// The month as a ring with words, never a number.
export function UseRing({ v, words }: { v: AllowanceView; words: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const used = Math.min(1, Math.max(0, v.usedShare));
  const tone = v.empty ? 'var(--bad)' : v.nearLimit ? 'var(--zap)' : 'var(--accent)';
  return (
    <div className="s-uring" role="img" aria-label={words}>
      <svg viewBox="0 0 80 80" width="88" height="88" aria-hidden="true">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--sunk)" strokeWidth="8" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={tone} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${c * used} ${c}`} transform="rotate(-90 40 40)" className="s-uring-arc" />
      </svg>
      <b>{words}</b>
    </div>
  );
}

// What this month went to, and the past months as small bars.
export function MonthlyUseDetails({ b }: { b: UsageBreakdown | null }) {
  const { locale } = useStudio();
  const t = getMonthlyUseContent(locale);
  if (!b) return <section className="s-card s-pad"><span className="s-shim" style={{ width: '50%' }} /></section>;
  const max = Math.max(...b.byFeature.map((x) => x.share), 0.01);
  const label = (m: string) => new Date(`${m}-01T12:00:00Z`).toLocaleDateString(locale, { month: 'short', timeZone: 'UTC' });
  return (
    <>
      <section className="s-card">
        <div className="s-hd"><h3 className="s-h3">{t.wentTo}</h3></div>
        <div className="s-pad s-col" style={{ gap: 12 }}>
          {!b.byFeature.length && <p className="s-sub-t" style={{ margin: 0 }}>{t.wentToEmpty}</p>}
          {b.byFeature.map((x, i) => {
            const Ic = ICON[x.feature];
            return (
              <div key={x.feature} className="s-ufeat">
                <span className="s-row" style={{ gap: 8, fontSize: 13.5 }}><Ic size={14} />{t.features[x.feature]}{i === 0 && <span className="s-badge">{t.most}</span>}</span>
                <span className="s-ufeat-bar" aria-hidden="true"><i style={{ width: `${Math.max(4, (x.share / max) * 100)}%` }} /></span>
              </div>
            );
          })}
        </div>
      </section>
      <section className="s-card">
        <div className="s-hd"><h3 className="s-h3">{t.pastTitle}</h3><span className="s-sub-t" style={{ fontSize: 12.5 }}>{t.pastSub}</span></div>
        <div className="s-pad s-umonths" role="list">
          {b.months.map((m) => (
            <span key={m.month} role="listitem" className="s-umonth" aria-label={`${label(m.month)}: ${t.ringLeft[m.fill >= 1 ? 'full' : m.fill >= 0.75 ? 'high' : m.fill >= 0.4 ? 'mid' : 'low']}`}>
              <span className="s-umonth-col" aria-hidden="true"><i style={{ height: `${Math.max(4, m.fill * 100)}%` }} /></span>
              <small>{label(m.month)}</small>
            </span>
          ))}
        </div>
      </section>
      <section className="s-card">
        <div className="s-hd"><h3 className="s-h3"><Lightbulb size={15} style={{ verticalAlign: '-2px', marginRight: 6 }} />{t.tipsTitle}</h3></div>
        <ul className="s-pad s-utips">{t.tips.map((x) => <li key={x}>{x}</li>)}</ul>
      </section>
    </>
  );
}
