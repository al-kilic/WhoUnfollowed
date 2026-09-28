'use client';

import { useState, useRef } from 'react';
import type { DeltaReason } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';
import type { DeltaWarningContent } from './deltaWarning.content';

const INSTAGRAM_EXPORT_URL = 'https://accountscenter.instagram.com/info_and_permissions/dyi/';

interface Props {
  reasons: DeltaReason[];
  followerCount: number;
  followingCount: number;
  onReExport: () => void;
  onNewAccount: () => void;
  onProceedAnyway: () => void;
  content: DeltaWarningContent;
}

function reasonText(reason: DeltaReason, followerCount: number, followingCount: number, c: DeltaWarningContent): string {
  switch (reason) {
    case 'small_counts':
      return (followerCount === 1 ? c.reasons.smallCountsOne : c.reasons.smallCounts)
        .replace('{followers}', String(followerCount))
        .replace('{following}', String(followingCount));
    case 'all_recent_timestamps':
      return c.reasons.allRecent;
    case 'massive_count_drop':
      return c.reasons.massiveDrop;
  }
}

// Renders an alternating [plain, bold, plain, bold, ...] copy array.
function Rich({ parts, strongColor = T.ink }: { parts: string[]; strongColor?: string }) {
  return <>{parts.map((part, i) => (i % 2 === 1 ? <strong key={i} style={{ color: strongColor }}>{part}</strong> : <span key={i}>{part}</span>))}</>;
}

export function DeltaWarning({ reasons, followerCount, followingCount, onReExport, onNewAccount, onProceedAnyway, content: c }: Props) {
  const [showDismissOptions, setShowDismissOptions] = useState(false);
  const [showIncrementalTip, setShowIncrementalTip] = useState(false);
  const tipRef = useRef<HTMLSpanElement>(null);

  return (
    /* Backdrop */
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      backdropFilter: 'blur(20px) saturate(0.7)',
      WebkitBackdropFilter: 'blur(20px) saturate(0.7)',
      background: 'rgba(8,10,10,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      {/* Modal card */}
      <div style={{
        maxWidth: 520, width: '100%',
        background: T.bgCard,
        border: '1px solid var(--t-border2)',
        borderRadius: 24,
        boxShadow: '0 40px 120px rgba(0,0,0,0.7)',
        overflow: 'hidden',
      }}>
        {/* Top bar */}
        <div style={{
          padding: '14px 24px',
          borderBottom: '1px solid rgba(168,75,47,0.2)',
          background: 'rgba(168,75,47,0.06)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v5M12 17.5v.5" stroke={T.terra} strokeWidth="2" strokeLinecap="round"/>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={T.terra} strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 10, color: T.terra, fontFamily: T.mono, letterSpacing: '0.14em' }}>{c.topLabel}</span>
        </div>

        <div style={{ padding: '28px 28px 24px' }}>
          {/* Heading */}
          <h2 style={{ fontFamily: T.serif, fontSize: 30, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, color: T.ink, marginBottom: 12 }}>
            {c.headingPrefix}{' '}
            <span style={{ color: 'rgba(192,130,80,0.9)' }}>{c.headingHighlight}</span>
            <span
              ref={tipRef}
              onMouseEnter={e => {
                setShowIncrementalTip(true);
                const r = e.currentTarget.getBoundingClientRect();
                tipRef.current?.setAttribute('data-x', String(r.left + r.width / 2));
                tipRef.current?.setAttribute('data-y', String(r.top));
              }}
              onMouseLeave={() => setShowIncrementalTip(false)}
              style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', marginLeft: 6, cursor: 'help' }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.45 }}>
                <circle cx="8" cy="8" r="7" stroke="rgba(192,130,80,0.9)" strokeWidth="1.3"/>
                <path d="M8 7.5V11" stroke="rgba(192,130,80,0.9)" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="8" cy="5.5" r="0.8" fill="rgba(192,130,80,0.9)"/>
              </svg>
            </span>
          </h2>
          {showIncrementalTip && (() => {
            const el = tipRef.current;
            const x = el ? parseFloat(el.getAttribute('data-x') ?? '0') : 0;
            const y = el ? parseFloat(el.getAttribute('data-y') ?? '0') : 0;
            const TIP_W = 280;
            const left = typeof window !== 'undefined'
              ? Math.max(12, Math.min(x - TIP_W / 2, window.innerWidth - TIP_W - 12))
              : x - TIP_W / 2;
            return (
              <div style={{
                position: 'fixed', left, top: y + 22,
                width: TIP_W, padding: '12px 16px', borderRadius: 12, zIndex: 700,
                background: 'rgba(14,20,20,0.99)', border: '1px solid var(--t-border3)',
                fontSize: 13, fontFamily: T.sans, fontWeight: 400, lineHeight: 1.65,
                color: 'rgba(244,240,232,0.75)', pointerEvents: 'none',
                boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
              }}>
                <Rich parts={c.tip} /><strong style={{ color: T.tealLight }}>{c.allTime}</strong>{c.tipAfter}
              </div>
            );
          })()}
          <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65, marginBottom: 20 }}>
            <Rich parts={c.body} />
          </p>

          {/* Signals */}
          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(168,75,47,0.06)', border: '1px solid rgba(168,75,47,0.15)', marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: 'rgba(168,75,47,0.7)', fontFamily: T.mono, letterSpacing: '0.1em', marginBottom: 8 }}>{c.whyLabel}</div>
            {reasons.map(r => (
              <div key={r} style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.55 }}>
                {reasonText(r, followerCount, followingCount, c)}
              </div>
            ))}
          </div>

          {/* What to do */}
          <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(2,136,143,0.05)', border: '1px solid rgba(2,136,143,0.18)', marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.1em', marginBottom: 10 }}>{c.whatLabel}</div>
            <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>
              <li>
                <Rich parts={c.step1} />
              </li>
              <li>
                {c.step2}{' '}
                <span style={{
                  display: 'inline-block', fontWeight: 700, fontSize: 13,
                  color: '#0f0f0f', background: T.tealLight,
                  padding: '1px 8px', borderRadius: 6, letterSpacing: '0.02em',
                }}>
                  {c.allTime}
                </span>
              </li>
              <li>{c.step3}</li>
            </ol>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => {
              window.open(INSTAGRAM_EXPORT_URL, '_blank', 'noopener,noreferrer');
              onReExport();
            }}
            style={{
              width: '100%', padding: '13px', borderRadius: 12, cursor: 'pointer',
              background: T.teal, border: 'none', color: T.cream,
              fontSize: 14, fontWeight: 600, fontFamily: T.sans,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginBottom: 12,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7H11M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {c.cta}{' '}
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 7px', borderRadius: 5, fontWeight: 700 }}>{c.allTime}</span>
          </button>

          {/* Dismiss row */}
          {!showDismissOptions ? (
            <button
              onClick={() => setShowDismissOptions(true)}
              style={{
                width: '100%', padding: '11px 16px', borderRadius: 12, cursor: 'pointer',
                background: 'transparent',
                border: '1px solid var(--t-border3)',
                color: T.inkDim, fontSize: 13, fontFamily: T.sans,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(244,240,232,0.22)'; e.currentTarget.style.color = T.ink; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--t-border3)'; e.currentTarget.style.color = T.inkDim; }}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M11 7H3M6 4l-3 3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {c.notIncremental}
            </button>
          ) : (
            <div style={{
              padding: '14px 16px', borderRadius: 12,
              background: 'var(--t-surface1)', border: '1px solid var(--t-border2)',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <p style={{ fontSize: 12, color: T.inkMute, marginBottom: 4, lineHeight: 1.5 }}>
                {c.chooseWhy}
              </p>
              <button
                onClick={onNewAccount}
                style={{
                  padding: '10px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                  background: 'var(--t-surface2)', border: '1px solid var(--t-border2)',
                  color: T.inkDim, fontSize: 13, fontFamily: T.sans,
                }}
              >
                {c.newAccount}
              </button>
              <button
                onClick={onProceedAnyway}
                style={{
                  padding: '10px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                  background: 'var(--t-surface2)', border: '1px solid var(--t-border2)',
                  color: T.inkDim, fontSize: 13, fontFamily: T.sans,
                }}
              >
                {c.proceedAnyway}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
