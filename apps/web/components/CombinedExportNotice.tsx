'use client';

import { T } from '@/components/landing/tokens';

interface Props {
  content: { title: string; body: string; continueCta: string };
  onContinue: () => void;
}

// Shown when one ZIP holds both Instagram and Threads data. We analyze the
// Instagram part and ask the user to export Threads on its own.
export function CombinedExportNotice({ content, onContinue }: Props) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="combined-export-title"
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        backdropFilter: 'blur(20px) saturate(0.7)',
        WebkitBackdropFilter: 'blur(20px) saturate(0.7)',
        background: 'rgba(8,10,10,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div style={{
        maxWidth: 480, width: '100%',
        background: T.bgCard,
        border: '1px solid var(--t-border2)',
        borderRadius: 24,
        boxShadow: '0 40px 120px rgba(0,0,0,0.7)',
        padding: '28px 28px 24px',
      }}>
        <h2 id="combined-export-title" style={{ fontFamily: T.serif, fontSize: 26, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.15, color: T.ink, marginBottom: 12 }}>
          {content.title}
        </h2>
        <p style={{ fontSize: 14.5, color: T.inkDim, lineHeight: 1.6, marginBottom: 24 }}>
          {content.body}
        </p>
        <button
          autoFocus
          onClick={onContinue}
          style={{
            width: '100%', padding: '12px 20px', borderRadius: 12, cursor: 'pointer',
            fontSize: 14, fontWeight: 600, fontFamily: T.sans,
            color: T.cream, background: T.teal, border: '1px solid rgba(2,136,143,0.5)',
          }}
        >
          {content.continueCta}
        </button>
      </div>
    </div>
  );
}
