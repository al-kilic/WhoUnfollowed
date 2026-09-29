'use client';

import { useState, useEffect } from 'react';
import { T } from '@/components/landing/tokens';
import { track, Events } from '@/lib/analytics';

const EMAIL_KEY = 'ig-tracker:captured-email';

export function getSavedEmail(): string {
  try { return localStorage.getItem(EMAIL_KEY) ?? ''; } catch { return ''; }
}

function saveEmail(email: string) {
  try { localStorage.setItem(EMAIL_KEY, email); } catch {}
}

interface Props {
  csvFilename: string;
  onClose: () => void;
  onDownload: () => void;
}

// Shown to logged-out users on their first CSV export. The CSV is generated and
// downloaded entirely in the browser — we never receive or email the file. The
// optional email is only for the product-update list.
export function EmailCaptureModal({ csvFilename, onClose, onDownload }: Props) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const saved = getSavedEmail();
    if (saved) setEmail(saved);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const validEmail = email.trim().includes('@');
  const canDownload = !consent || validEmail;

  async function handleDownload() {
    setBusy(true);
    track(Events.csvExport, { mode: 'capture' });
    // Only a ticked checkbox counts as consent. Without it the CSV still
    // downloads and nothing is sent or stored.
    if (validEmail && consent) {
      track(Events.emailCaptured, { context: 'csv' });
      saveEmail(email.trim());
      // Only the email + filename are sent (for product updates). The CSV stays
      // in the browser — it is not uploaded or emailed.
      try {
        await fetch('/api/capture-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), csvFilename, source: 'csv', consent: true }),
        });
      } catch {
        // non-blocking — the download still happens
      }
    }
    onDownload();
    onClose();
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(8,12,12,0.8)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', background: 'rgba(14,18,18,0.98)',
          border: '1px solid rgba(244,240,232,0.1)', borderRadius: 20,
          padding: '32px 36px', maxWidth: 440, width: '100%',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ position: 'absolute', top: 14, right: 14, width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(244,240,232,0.12)', background: 'transparent', color: T.inkMute, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>

        {/* Header */}
        <div style={{ marginBottom: 20, paddingRight: 24 }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.12em', marginBottom: 8 }}>EXPORT CSV</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 24, fontWeight: 400, letterSpacing: '-0.02em', color: T.ink, marginBottom: 6 }}>
            Your CSV is ready.
          </h2>
          <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>
            The file is built in your browser. We never upload or email it. If you want occasional product updates, tick the box and add your email.
          </p>
        </div>

        {/* Optional email */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 10, boxSizing: 'border-box',
              border: '1px solid rgba(244,240,232,0.15)',
              background: 'rgba(244,240,232,0.03)', color: T.ink,
              fontSize: 14, fontFamily: T.sans, outline: 'none',
            }}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: T.inkDim, lineHeight: 1.5, marginBottom: 16, cursor: 'pointer' }}>
          <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: 2 }} />
          Send me occasional product updates. Unsubscribe any time.
        </label>

        <button
          onClick={handleDownload}
          disabled={busy || !canDownload}
          style={{
            width: '100%', padding: '12px 0', borderRadius: 10,
            cursor: busy || !canDownload ? 'not-allowed' : 'pointer',
            background: canDownload ? T.teal : 'rgba(2,136,143,0.15)',
            border: 'none', color: canDownload ? T.cream : T.inkMute,
            fontSize: 13, fontWeight: 600, fontFamily: T.sans, transition: 'all 0.15s',
          }}
        >
          {busy ? 'Preparing…' : 'Download CSV'}
        </button>
      </div>
    </div>
  );
}
