'use client';

import { ImagePlus, Sparkles } from 'lucide-react';
import { getSampleCoach } from '@/lib/sample/coach';
import { NO_NUMS, type PostNums } from '@/lib/insightsPick';
import { useStudio } from '../StudioContext';
import { getInsightsV2 } from './insightsV2.content';
import { InsightsResult } from './InsightsResult';
import '@/styles/insights.css';

// The example: the sample account's own analysis with bundled photos, so a
// first-time visitor sees exactly what they get. Labelled "Example".
const EX_THUMBS = ['/home/post/ph03.jpg', '/home/post/ph07.jpg', '/home/post/ph05.jpg'];
const EX_NUMS: PostNums[] = [
  { ...NO_NUMS, reach: 2410, likes: 312, saves: 41, shares: 18 },
  { ...NO_NUMS, reach: 1630, likes: 201, saves: 52, shares: 9 },
  { ...NO_NUMS, reach: 540, likes: 88, saves: 3, shares: 1 },
];

export function InsightsExample() {
  const { locale } = useStudio();
  const v = getInsightsV2(locale);
  return (
    <section className="s-col" style={{ gap: 12 }} aria-label={v.example}>
      <span className="s-insex"><span className="s-badge">{v.example}</span>{v.exampleNote}</span>
      <InsightsResult data={getSampleCoach(locale).insights} thumbs={EX_THUMBS} nums={EX_NUMS} />
    </section>
  );
}

// The promise, one obvious action, three steps, and a fan of photos.
export function InsightsHero({ onStart, onHand, locked }: { onStart: () => void; onHand: () => void; locked?: boolean }) {
  const { locale } = useStudio();
  const v = getInsightsV2(locale);
  return (
    <section className="s-insh">
      <div style={{ position: 'relative', zIndex: 1 }}>
        <span className="k">{v.kicker}</span>
        <h2>{v.title}</h2>
        <p>{v.body}</p>
        {!locked && (
          <div className="acts">
            <button type="button" className="s-btn lg" onClick={onStart}><Sparkles size={15} />{v.start}</button>
            <button type="button" className="s-lnk" style={{ background: 'none', border: 0, cursor: 'pointer', font: 'inherit', fontSize: 13.5 }} onClick={onHand}><ImagePlus size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} />{v.byHand}</button>
          </div>
        )}
        <ol className="steps">{v.steps.map((s) => <li key={s}>{s}</li>)}</ol>
      </div>
      <div className="fan" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- bundled example photos */}
        {EX_THUMBS.map((src) => <img key={src} src={src} alt="" />)}
        <span className="tag">{v.times('2.4')}</span>
      </div>
    </section>
  );
}
