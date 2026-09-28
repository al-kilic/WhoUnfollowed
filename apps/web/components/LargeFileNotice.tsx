'use client';

import { T } from '@/components/landing/tokens';

export interface LargeFileNoticeContent {
  title: string;
  // {size} is replaced with the file size, e.g. "2.3 GB".
  body: string;
  smallerCta: string;
  continueCta: string;
  cancelCta: string;
}

interface Props {
  sizeLabel: string;
  content: LargeFileNoticeContent;
  onSmallerExport: () => void;
  onContinue: () => void;
  onCancel: () => void;
}

// Shown before reading a ZIP big enough to crash the tab (a full export with
// photos). The browser reads the whole file into memory, and phones in
// particular kill the tab when that runs out, with no error we can catch.
export function LargeFileNotice({ sizeLabel, content: c, onSmallerExport, onContinue, onCancel }: Props) {
  const secondary: React.CSSProperties = {
    width: '100%', padding: '11px 16px', borderRadius: 12, cursor: 'pointer',
    background: 'transparent', border: '1px solid var(--t-border3)',
    color: T.inkDim, fontSize: 13, fontFamily: T.sans,
  };
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="large-file-title"
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
        <h2 id="large-file-title" style={{ fontFamily: T.serif, fontSize: 26, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.15, color: T.ink, marginBottom: 12 }}>
          {c.title}
        </h2>
        <p style={{ fontSize: 14.5, color: T.inkDim, lineHeight: 1.6, marginBottom: 24 }}>
          {c.body.replace('{size}', sizeLabel)}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            autoFocus
            onClick={onSmallerExport}
            style={{
              width: '100%', padding: '12px 20px', borderRadius: 12, cursor: 'pointer',
              fontSize: 14, fontWeight: 600, fontFamily: T.sans,
              color: T.cream, background: T.teal, border: '1px solid rgba(2,136,143,0.5)',
            }}
          >
            {c.smallerCta}
          </button>
          <button onClick={onContinue} style={secondary}>{c.continueCta}</button>
          <button onClick={onCancel} style={{ ...secondary, border: 'none' }}>{c.cancelCta}</button>
        </div>
      </div>
    </div>
  );
}
