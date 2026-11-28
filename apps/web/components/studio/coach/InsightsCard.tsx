'use client';

import { Lightbulb } from 'lucide-react';
import type { PostNums, Ranked } from '@/lib/insightsPick';
import { useStudio } from '../StudioContext';
import { getInsightsContent } from './insights.content';
import { getInsightsV2 } from './insightsV2.content';

export interface CardData {
  post: string; thumb?: string | undefined; nums?: PostNums | undefined; rank?: Ranked | undefined;
  verdict: 'win' | 'lose' | null; why?: string | undefined; tip?: string | undefined; date?: string | null | undefined;
  // Width of the score bar, 0..1 against the best post in the set.
  share?: number;
}

// One analysed post: its photo, rank and "x your usual", Instagram's numbers,
// what the coach saw and one thing to try.
export function InsightsCard({ d, i }: { d: CardData; i: number }) {
  const { locale } = useStudio();
  const t = getInsightsContent(locale);
  const v = getInsightsV2(locale);
  const n = (x: number | null | undefined) => (typeof x === 'number' ? x.toLocaleString(locale) : null);
  const nums = d.nums ? ([['reach', d.nums.reach], ['likes', d.nums.likes], ['saves', d.nums.saves], ['shares', d.nums.shares]] as const).filter(([, x]) => x !== null) : [];
  const times = d.rank?.times;
  const label = times !== null && times !== undefined ? v.times(times.toLocaleString(locale, { maximumFractionDigits: 1 })) : null;
  return (
    <article className={`s-inscard${d.verdict ? ` ${d.verdict}` : ''}`} style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
      <div className="ph">
        {/* eslint-disable-next-line @next/next/no-img-element -- local thumbnail from this browser */}
        {d.thumb ? <img src={d.thumb} alt="" /> : <span className="ph0" aria-hidden="true">{d.post}</span>}
        <span className="rk">{d.rank?.rank ? `#${d.rank.rank}` : d.post}</span>
        {label && <span className={`x ${times! >= 1 ? 'up' : 'down'}`}>{label}</span>}
      </div>
      <div className="bd">
        {d.verdict && <span className={`vd ${d.verdict}`}>{d.verdict === 'win' ? v.worked : v.flat}</span>}
        {nums.length > 0 && <span className="nums">{nums.map(([k, x]) => <span key={k}><b>{n(x)}</b> {t[k].toLowerCase()}</span>)}</span>}
        {typeof d.share === 'number' && <span className="bar" aria-hidden="true"><i style={{ width: `${Math.max(4, Math.round(d.share * 100))}%` }} /></span>}
        {d.why && <p className="why">{d.why}</p>}
        {d.tip && <p className="tip"><Lightbulb size={14} aria-hidden="true" /><span><b style={{ fontWeight: 600 }}>{v.tryTip}:</b> {d.tip}</span></p>}
      </div>
    </article>
  );
}
