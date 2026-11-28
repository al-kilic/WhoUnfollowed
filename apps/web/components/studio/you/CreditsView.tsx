'use client';

import { useEffect, useState } from 'react';
import { Eye, Gift, Package, RefreshCw, Undo2 } from 'lucide-react';
import type { AllowanceView } from '@/lib/ai/allowanceMath';
import { useStudio } from '../StudioContext';
import { RefillOffer } from '../coach/TopUp';
import { getYouContent } from './you.content';
import { MonthlyUseDetails, UseRing, useBreakdown } from './MonthlyUseDetails';
import { getMonthlyUseContent } from './monthlyUse.content';

// Studio > You > coach use. A plain bar of how much of this month is used,
// never numbers: no credits, no percent, no dollar amounts (founder,
// 2026-11-24). Refills held and the thank-you gift are listed under it.
const RULE_ICONS = [RefreshCw, Package, Undo2, Eye];

export function useAllowance(): AllowanceView | null {
  const { coach } = useStudio();
  const [data, setData] = useState<AllowanceView | null>(null);
  const fromState = coach.state?.allowance;
  useEffect(() => {
    if (fromState) { setData(fromState); return; }
    let alive = true;
    void fetch('/api/ai/credits', { cache: 'no-store' }).then(async (r) => {
      if (r.ok && alive) setData(((await r.json()) as { usage?: AllowanceView }).usage ?? null);
    }).catch(() => undefined);
    return () => { alive = false; };
  }, [fromState]);
  return data;
}

export function levelOf(v: AllowanceView): 'low' | 'mid' | 'high' | 'full' {
  if (v.empty || v.usedShare >= 1) return 'full';
  if (v.nearLimit || v.usedShare >= 0.75) return 'high';
  return v.usedShare >= 0.4 ? 'mid' : 'low';
}

export function UsageBar({ v }: { v: AllowanceView }) {
  const { locale } = useStudio();
  const t = getYouContent(locale).use;
  const label = t.level[levelOf(v)];
  const tone = v.empty ? 'var(--bad)' : v.nearLimit ? 'var(--zap)' : 'var(--accent)';
  return (
    <div className="s-col" style={{ gap: 6 }}>
      <div role="img" aria-label={label} style={{ height: 10, borderRadius: 999, background: 'var(--sunk)', boxShadow: 'inset 0 0 0 1px var(--line)', overflow: 'hidden' }}>
        <i style={{ display: 'block', height: '100%', width: `${Math.min(1, Math.max(0.02, v.usedShare)) * 100}%`, background: tone, borderRadius: 999, transition: 'width .6s ease' }} />
      </div>
      <span className="s-sub-t" style={{ fontSize: 12.5 }}>{label}</span>
    </div>
  );
}

export function CreditsView() {
  const { locale } = useStudio();
  const t = getYouContent(locale).use;
  const v = useAllowance();
  const b = useBreakdown();
  const mu = getMonthlyUseContent(locale);
  if (!v) return <section className="s-card s-pad"><span className="s-shim" style={{ width: '40%' }} /></section>;
  const fmt = (iso: string) => new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="s-grid s-crg">
      <section className="s-card s-pad s-col" style={{ gap: 14, minWidth: 0 }}>
        <div className="s-row" style={{ justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
          <div className="s-col" style={{ gap: 2 }}><h3 className="s-h3" style={{ margin: 0 }}>{t.title}</h3><span className="s-sub-t" style={{ fontSize: 12.5 }}>{t.sub}</span></div>
          <b style={{ fontWeight: 600 }}>{v.resetsAt ? t.resets(fmt(v.resetsAt)) : ''}</b>
        </div>
        <div className="s-row" style={{ gap: 16, flexWrap: 'wrap' }}>
          <UseRing v={v} words={mu.ringLeft[levelOf(v)]} />
          <div className="s-grow" style={{ minWidth: 180 }}><UsageBar v={v} /></div>
        </div>
        {(v.refills.expiresAt.length > 0 || v.gift.left) && (
          <div className="s-col" style={{ gap: 6 }}>
            {v.refills.expiresAt.map((d, i) => <span key={`${d}-${i}`} className="s-row" style={{ gap: 8, fontSize: 13 }}><Package size={14} />{t.refillReady(fmt(d))}</span>)}
            {v.gift.left && <span className="s-row" style={{ gap: 8, fontSize: 13 }}><Gift size={14} />{t.giftLeft}</span>}
          </div>
        )}
        <RefillOffer v={v} />
      </section>
      <MonthlyUseDetails b={b} />
      <section className="s-card">
        <div className="s-hd"><h3 className="s-h3">{t.rulesTitle}</h3></div>
        <div className="s-pad s-col" style={{ gap: 12 }}>
          {t.rules.map((r, i) => { const Ic = RULE_ICONS[i] ?? Eye; return <div key={r} className="s-row" style={{ gap: 10, alignItems: 'flex-start', fontSize: 13 }}><span className="s-rulei"><Ic size={14} /></span><span>{r}</span></div>; })}
        </div>
      </section>
    </div>
  );
}
