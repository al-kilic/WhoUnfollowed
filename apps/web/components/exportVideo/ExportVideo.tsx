import { useState } from 'react';
import type React from 'react';
import { T } from '@/components/landing/tokens';
import type { VideoStepSync } from './useVideoStepSync';
import { CHAPTER_STARTS, EXPORT_VIDEO, chapterRange } from './videoChapters';

// The video has its own dark teal background, so the player is a dark panel in
// both themes and uses fixed colors instead of the theme tokens.
const PANEL = '#0c2525';
const CREAM = 'rgba(244,240,232,0.9)';
const MINT = '#8fdcd0';
const TRACK = 'rgba(244,240,232,0.16)';

const iconButton: React.CSSProperties = {
  width: 32, height: 32, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  border: 'none', borderRadius: 8, background: 'rgba(244,240,232,0.08)', color: CREAM, cursor: 'pointer', padding: 0,
};

type FullscreenVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

export interface ExportVideoLabels {
  ariaLabel: string;
  play: string;
  pause: string;
  fullscreen: string;
  hide: string;
  show: string;
  // Template with {n}, e.g. "Jump to step {n}".
  jumpToStep: string;
}

interface Props {
  sync: VideoStepSync;
  labels: ExportVideoLabels;
  // One title per chapter, used for the chapter-bar tooltips.
  chapterTitles: string[];
  caption?: string;
  // Phones only: show the toggle that folds the video down to its controls.
  collapsible?: boolean;
  // 'none' for click-to-play: the file is not requested until play.
  preload?: 'none' | 'metadata';
  poster?: string;
  onPlay?: () => void;
}

export function ExportVideo({ sync, labels: v, chapterTitles, caption, collapsible = false, preload = 'metadata', poster = EXPORT_VIDEO.poster, onPlay }: Props) {
  const { videoRef, barRef, activeStep, playing, setPlaying, syncTime, seekToStep, togglePlay } = sync;
  // Phones only (the toggle is hidden on desktop): fold the video away and
  // keep just the control strip pinned, so the steps get the screen back.
  const [collapsed, setCollapsed] = useState(false);

  function enterFullscreen() {
    const video: FullscreenVideo | null = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) void video.requestFullscreen();
    else video.webkitEnterFullscreen?.();
  }

  function expandAndPlay() {
    setCollapsed(false);
    if (!playing) togglePlay();
  }

  function toggleCollapsed() {
    if (!collapsed && playing) togglePlay();
    setCollapsed(!collapsed);
  }

  return (
    <>
    <div className="export-player" style={{ background: PANEL, border: '1px solid rgba(143,220,208,0.18)', overflow: 'hidden' }}>
      <div style={{ position: 'relative', display: collapsed ? 'none' : 'block', aspectRatio: '16 / 9' }}>
        <video
          ref={videoRef}
          src={EXPORT_VIDEO.src}
          poster={poster}
          muted
          loop
          playsInline
          preload={preload}
          aria-label={v.ariaLabel}
          onClick={togglePlay}
          onPlay={() => { setPlaying(true); onPlay?.(); }}
          onPause={() => setPlaying(false)}
          onTimeUpdate={syncTime}
          onSeeked={syncTime}
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain', background: PANEL, cursor: 'pointer' }}
        />
        {!playing && <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(12,37,37,0.4)', pointerEvents: 'none' }} />}
        {!playing && (
          <button type="button" onClick={togglePlay} aria-label={v.play} style={{ position: 'absolute', inset: 0, margin: 'auto', width: 64, height: 64, borderRadius: '50%', border: 'none', background: 'rgba(12,37,37,0.78)', color: CREAM, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 1px rgba(143,220,208,0.35)' }}>
            <svg width="22" height="22" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><path d="M2.5 1 L9 5 L2.5 9 Z" /></svg>
          </button>
        )}
      </div>

      {/* Controls: play/pause, one segment per step, fullscreen */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px' }}>
        <button type="button" onClick={collapsed ? expandAndPlay : togglePlay} aria-label={playing ? v.pause : v.play} style={iconButton}>
          {playing
            ? <svg width="12" height="12" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><rect x="1.5" y="1" width="2.5" height="8" rx="0.6" /><rect x="6" y="1" width="2.5" height="8" rx="0.6" /></svg>
            : <svg width="12" height="12" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><path d="M2.5 1 L9 5 L2.5 9 Z" /></svg>}
        </button>

        <div ref={barRef} style={{ flex: 1, display: 'flex', gap: 5 }}>
          {CHAPTER_STARTS.map((_, i) => {
            const [start, end] = chapterRange(i);
            const label = `${v.jumpToStep.replace('{n}', String(i + 1))}: ${chapterTitles[i] ?? ''}`;
            return (
              <button key={start} type="button" onClick={() => { if (collapsed) setCollapsed(false); seekToStep(i); }} aria-label={label} title={label} aria-current={activeStep === i ? 'step' : undefined} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, padding: '6px 0', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <span style={{ display: 'block', height: 3, borderRadius: 2, background: TRACK, overflow: 'hidden' }}>
                  <span style={{ display: 'block', height: '100%', background: MINT, width: `clamp(0%, calc((var(--t, 0) - ${start}) / ${end - start} * 100%), 100%)` }} />
                </span>
                <span style={{ fontFamily: T.mono, fontSize: 10, lineHeight: 1, color: activeStep === i ? MINT : 'rgba(244,240,232,0.45)', transition: 'color 0.2s ease' }}>{i + 1}</span>
              </button>
            );
          })}
        </div>

        {collapsible && (
        <button type="button" onClick={toggleCollapsed} aria-label={collapsed ? v.show : v.hide} aria-expanded={!collapsed} className="export-collapse" style={iconButton}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }}><path d="M2.5 7.5 L6 4 L9.5 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        )}
        {!collapsed && (
          <button type="button" onClick={enterFullscreen} aria-label={v.fullscreen} style={iconButton}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M1.5 4.5 V1.5 H4.5 M7.5 1.5 H10.5 V4.5 M10.5 7.5 V10.5 H7.5 M4.5 10.5 H1.5 V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
      </div>
    </div>
    {caption && <p className="export-caption" style={{ margin: '12px 2px 0', fontSize: 12.5, lineHeight: 1.6, color: T.inkMute }}>{caption}</p>}
    </>
  );
}
