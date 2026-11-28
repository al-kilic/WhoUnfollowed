'use client';

import type { AiInsights } from '@ig-tracker/core';
import { Check, Crop } from 'lucide-react';
import { rankPosts, scoreOf, type PostNums } from '@/lib/insightsPick';
import { useStudio } from '../StudioContext';
import { getInsightsContent } from './insights.content';
import { getInsightsV2 } from './insightsV2.content';
import { InsightsCard, type CardData } from './InsightsCard';
import '@/styles/insights.css';

const idx = (p: string) => Number(p.replace(/\D/g, '')) - 1;

// Every analysed post as a card, ranked by the member's own numbers when the
// run has them (best first), else winners first and the weakest last.
export function insightsCards(data: AiInsights, thumbs: string[], nums?: PostNums[] | undefined, dates?: (string | null)[] | undefined): CardData[] {
  const mentioned = [...data.winners, ...data.losers, ...(data.tips ?? [])].map((x) => idx(x.post)).filter((i) => i >= 0);
  const count = Math.max(thumbs.length, nums?.length ?? 0, ...mentioned.map((i) => i + 1), 0);
  const ranks = nums?.length ? rankPosts(nums) : [];
  const scores = (nums ?? []).map(scoreOf);
  const best = Math.max(0, ...scores.filter((s): s is number => s !== null));
  const cards: CardData[] = Array.from({ length: count }, (_, i) => {
    const post = `P${i + 1}`;
    const win = data.winners.find((w) => w.post === post);
    const lose = data.losers.find((w) => w.post === post);
    const s = scores[i];
    return {
      post, thumb: thumbs[i], nums: nums?.[i], rank: ranks[i], date: dates?.[i] ?? null,
      verdict: win ? 'win' : lose ? 'lose' : null, why: (win ?? lose)?.why, tip: data.tips?.find((x) => x.post === post)?.tip,
      ...(typeof s === 'number' && best > 0 ? { share: s / best } : {}),
    };
  });
  const order = (c: CardData) => (c.rank?.rank ?? (c.verdict === 'win' ? 0 : c.verdict === 'lose' ? 900 : 500) + idx(c.post));
  return cards.sort((a, b) => order(a) - order(b));
}

export function InsightsResult({ data, thumbs, nums, dates }: { data: AiInsights; thumbs: string[]; nums?: PostNums[] | undefined; dates?: (string | null)[] | undefined }) {
  const { locale } = useStudio();
  const t = getInsightsContent(locale);
  const v = getInsightsV2(locale);
  const cards = insightsCards(data, thumbs, nums, dates);
  return (
    <div className="s-col" style={{ gap: 22 }}>
      <section className="s-col" style={{ gap: 12 }} aria-label={v.ranked}>
        <h3 className="s-h3" style={{ margin: 0 }}>{v.ranked}</h3>
        <div className="s-inscards">{cards.map((c, i) => <InsightsCard key={c.post} d={c} i={i} />)}</div>
      </section>
      <section className="s-col" style={{ gap: 10 }}>
        <div><h3 className="s-h3" style={{ margin: 0 }}>{t.shootNext}</h3><span className="s-sub-t" style={{ fontSize: 13 }}>{v.shootNextSub}</span></div>
        <div className="s-insnext">{data.shootNext.map((s, i) => <div key={s.what} data-n={i + 1}><b>{s.what}</b><span>{s.why}</span></div>)}</div>
      </section>
      <div className="s-grid s-g2" style={{ gap: 14, alignItems: 'start' }}>
        <section className="s-card s-pad s-col" style={{ gap: 10 }}>
          <div><span className="s-lab">{t.patterns}</span><div className="s-sub-t" style={{ fontSize: 12.5 }}>{v.patternsSub}</div></div>
          <ul className="s-inspat">{data.patterns.map((p) => <li key={p}><Check size={15} aria-hidden="true" />{p}</li>)}</ul>
        </section>
        {data.cropAndCarousel.length > 0 && (
          <section className="s-card s-pad s-col" style={{ gap: 10 }}>
            <span className="s-lab">{t.crop}</span>
            <ul className="s-inspat">{data.cropAndCarousel.map((p) => <li key={p}><Crop size={15} aria-hidden="true" />{p}</li>)}</ul>
          </section>
        )}
      </div>
    </div>
  );
}
