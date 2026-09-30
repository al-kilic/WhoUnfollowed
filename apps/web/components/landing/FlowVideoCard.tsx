'use client';

import { useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { track } from '@/lib/analytics';
import { ExportVideo, type ExportVideoLabels } from '@/components/exportVideo/ExportVideo';
import { useVideoStepSync } from '@/components/exportVideo/useVideoStepSync';
import { EXPORT_VIDEO } from '@/components/exportVideo/videoChapters';
import { T } from './tokens';
import type { FlowContent } from './FlowSection';

export interface FlowVideoProps {
  labels: ExportVideoLabels;
  chapterTitles: string[];
}

// Homepage walkthrough: the same export video as /how-to-export, but
// click-to-play. With preload="none" the 3 MB file is only requested once the
// visitor presses play, so it costs the homepage nothing but the poster.
export function FlowVideoCard({ content, video }: { content: FlowContent; video: FlowVideoProps }) {
  const sync = useVideoStepSync(true, { autoplay: false });
  const tracked = useRef(false);

  function handlePlay() {
    if (tracked.current) return;
    tracked.current = true;
    track('export-video-play', { placement: 'homepage' });
  }

  return (
    <div className="flow-video" style={{ background: 'var(--t-surface1)', border: '1px solid var(--t-border1)', borderRadius: 18 }}>
      <div className="flow-video-text">
        <p style={{ fontSize: 12, color: T.terra, margin: '0 0 12px', fontFamily: T.mono, letterSpacing: '0.04em' }}>{content.notSure}</p>
        <h3 style={{ fontFamily: T.serif, fontSize: 'clamp(26px, 3vw, 34px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, margin: '0 0 12px' }}>{content.videoTitle}</h3>
        <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.7, margin: '0 0 16px' }}>{content.videoBody}</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {content.videoMeta.map((item) => (
            <li key={item} style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, padding: '3px 9px', border: '1px solid var(--t-border2)', borderRadius: 20 }}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="flow-video-player">
        <ExportVideo sync={sync} labels={video.labels} chapterTitles={video.chapterTitles} preload="none" poster={EXPORT_VIDEO.posterStep1} onPlay={handlePlay} />
      </div>

      <div className="flow-video-cta">
        <Link
          href="/how-to-export"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: T.cream, textDecoration: 'none', padding: '13px 24px', borderRadius: 12, background: T.teal, boxShadow: `0 4px 20px ${T.tealGlow}` }}
        >
          {content.guideCta}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 H11 M11 7 L8 4 M11 7 L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </div>
    </div>
  );
}
