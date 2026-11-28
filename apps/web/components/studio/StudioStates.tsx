'use client';

import { FileArchive, Hourglass } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useStudio } from './StudioContext';
import { SampleTryButton } from './sample/SampleTryButton';
import { getSampleContent } from './sample/sample.content';

// A skeleton of a Studio page, shown the moment a link is clicked.
export function StudioLoading() {
  const { c } = useStudio();
  return (
    <div role="status" aria-label={c.loading} className="s-skel">
      <span className="s-shim" style={{ width: 220, height: 26 }} />
      <span className="s-shim" style={{ width: 360, height: 34, borderRadius: 10 }} />
      <div className="s-skel-g"><span className="s-shim" /><span className="s-shim" /></div>
      <div className="s-skel-g three"><span className="s-shim" /><span className="s-shim" /><span className="s-shim" /></div>
    </div>
  );
}

// No export in this browser yet.
export function StudioEmpty() {
  const { c, locale } = useStudio();
  return (
    <section className="s-card s-pad" style={{ maxWidth: 520, margin: '40px auto', textAlign: 'center', padding: 32 }}>
      <span className="s-bic big tone-acc" style={{ margin: '0 auto 14px' }}><FileArchive size={20} /></span>
      <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-.02em', margin: '0 0 6px' }}>{c.empty.title}</h1>
      <p className="s-sub-t" style={{ margin: '0 0 20px', fontSize: 14 }}>{c.empty.body}</p>
      <div className="s-row" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/" className="s-btn">{c.empty.upload}</Link>
        <Link href="/how-to-export" className="s-btn sec">{c.empty.howTo}</Link>
      </div>
      <div className="s-sample-try">
        <span className="s-sub-t" style={{ fontSize: 13 }}>{getSampleContent(locale).tryHint}</span>
        <SampleTryButton entry="empty" primary />
      </div>
    </section>
  );
}

// A page that is planned but not built. Says so plainly; nothing behind it.
export function ComingLater({ title, body, points }: { title: string; body: string; points: string[] }) {
  const { c } = useStudio();
  return (
    <section className="s-later-card s-col" style={{ gap: 12 }}>
      <span className="s-badge dashed" style={{ alignSelf: 'flex-start' }}><Hourglass size={12} />{c.comingLater}</span>
      <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-.02em', margin: 0 }}>{title}</h2>
      <p className="s-sub-t" style={{ margin: 0, fontSize: 14, maxWidth: '62ch' }}>{body}</p>
      <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6, fontSize: 13.5, color: 'var(--mute)' }}>
        {points.map((p) => <li key={p}>{p}</li>)}
      </ul>
    </section>
  );
}
