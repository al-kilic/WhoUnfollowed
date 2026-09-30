import type React from 'react';
import Link from 'next/link';
import { T } from '@/components/landing/tokens';
import type { HowToExportContent as HowToExportContentData } from './content';

// Shared building blocks for the export guide (device steps, Drive steps, shell).

export function ZipCTA({ content }: { content: HowToExportContentData }) {
  return (
    <div style={{ marginTop: 56, padding: '32px 36px', borderRadius: 20, border: `1px solid rgba(2,136,143,0.3)`, background: 'rgba(2,136,143,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontFamily: T.serif, fontSize: 24, color: T.ink, letterSpacing: '-0.01em', marginBottom: 6 }}>{content.zipCtaTitle}</div>
        <div style={{ fontSize: 14, color: T.inkDim }}>{content.zipCtaBody}</div>
      </div>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', borderRadius: 12, background: T.teal, color: T.cream, fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans, whiteSpace: 'nowrap' }}>
        {content.zipCtaButton}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 H11 M11 7 L8 4 M11 7 L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </Link>
    </div>
  );
}

export function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 400, background: active ? T.teal : 'transparent', color: active ? T.cream : T.inkDim, transition: 'all 0.15s ease', fontFamily: 'inherit' }}>
      {children}
    </button>
  );
}

// A numbered step. With `onWatch` it is tied to the video guide: the badge and
// the "watch" button seek the video to this step, and `active` marks the step
// the video is currently showing.
interface StepProps {
  n: number;
  title: string;
  children: React.ReactNode;
  anchor?: string;
  active?: boolean;
  onWatch?: () => void;
  watchLabel?: string;
  activeLabel?: string;
}

export function Step({ n, title, children, anchor, active = false, onWatch, watchLabel, activeLabel }: StepProps) {
  const synced = onWatch !== undefined;
  const lit = !synced || active;
  const badgeStyle: React.CSSProperties = {
    width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: T.mono, fontSize: 13, fontWeight: 700, padding: 0,
    background: lit ? T.teal : 'var(--t-surface2)', color: lit ? T.cream : T.inkDim,
    border: lit ? '1px solid transparent' : '1px solid var(--t-border2)',
    boxShadow: synced && active ? '0 0 0 4px rgba(2,136,143,0.22)' : 'none',
    transition: 'background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease',
  };
  return (
    <div id={anchor} data-step={synced ? n - 1 : undefined} style={{ display: 'flex', gap: 20, scrollMarginTop: 96 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        {synced
          ? <button type="button" onClick={onWatch} aria-label={`${watchLabel}: ${title}`} style={{ ...badgeStyle, cursor: 'pointer' }}>{n}</button>
          : <div style={badgeStyle}>{n}</div>}
        <div style={{ flex: 1, width: 1, background: 'var(--t-border1)', minHeight: 24, marginTop: 8 }} />
      </div>
      <div style={{ flex: 1, paddingBottom: 8, minWidth: 0 }}>
        <h2 style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: '-0.01em', marginBottom: synced ? 6 : 14, lineHeight: 1.2 }}>{title}</h2>
        {synced && (
          <button type="button" onClick={onWatch} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: T.mono, fontSize: 11, letterSpacing: '0.06em', color: active ? T.tealLight : T.inkMute, transition: 'color 0.25s ease' }}>
            <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><path d="M2 1 L9 5 L2 9 Z" /></svg>
            {active ? activeLabel : watchLabel}
          </button>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
      </div>
    </div>
  );
}

export function NavPath({ steps }: { steps: string[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      {steps.map((step, i) => (
        <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ padding: '4px 10px', borderRadius: 6, background: 'var(--t-surface2)', border: '1px solid var(--t-border2)', fontSize: 12, color: T.inkDim, fontFamily: T.mono }}>{step}</span>
          {i < steps.length - 1 && <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7 H11 M11 7 L8 4 M11 7 L8 10" stroke={T.inkMute} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </span>
      ))}
    </div>
  );
}

// Small, muted secondary text: the "why" or edge case, subordinate to the
// primary tap sequence (NavPath) or visual mock above it in a Step.
export function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 12.5, color: T.inkMute, lineHeight: 1.6, margin: 0 }}>
      {children}
    </p>
  );
}

export function Callout({ variant, children }: { variant: 'warning' | 'tip'; children: React.ReactNode }) {
  const isTip = variant === 'tip';
  return (
    <div style={{ padding: '14px 18px', borderRadius: 12, border: `1px solid ${isTip ? 'rgba(2,136,143,0.3)' : 'rgba(168,75,47,0.3)'}`, background: isTip ? 'rgba(2,136,143,0.06)' : 'rgba(168,75,47,0.06)', display: 'flex', gap: 12, fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
        {isTip ? <><circle cx="12" cy="12" r="9" stroke={T.tealMid} strokeWidth="1.5"/><path d="M12 8 V12 M12 15.5 V16" stroke={T.tealMid} strokeWidth="1.8" strokeLinecap="round"/></> : <><path d="M12 4 L21 20 H3 Z" stroke={T.terra} strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 10 V14 M12 17 V17.5" stroke={T.terra} strokeWidth="1.8" strokeLinecap="round"/></>}
      </svg>
      <p style={{ margin: 0 }}>{children}</p>
    </div>
  );
}
