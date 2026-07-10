'use client';

import { useEffect, useState } from 'react';
import { T } from '@/components/landing/tokens';
import { deleteAccountAction } from './actions';

function DeleteAccountDialog({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !loading) onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose, loading]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      await deleteAccountAction();
      // deleteAccountAction redirects on success; if we get here without a
      // redirect, Next.js treated it as a normal return, so nothing more to do.
    } catch {
      // A Next.js redirect() throws internally too, but that special error is
      // handled by the framework and never reaches this catch, so any error
      // caught here is a real failure (e.g. Stripe cancellation problem).
      setLoading(false);
      setError('Something went wrong and your account was not deleted. If you have an active subscription, this can happen if Stripe could not be reached — please try again, or contact support before retrying.');
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div
        onClick={() => !loading && onClose()}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      />

      <div style={{
        position: 'relative', width: '100%', maxWidth: 420,
        borderRadius: 20, overflow: 'hidden',
        background: T.bgCard,
        border: '1px solid var(--t-border2)',
        boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px var(--t-surface2)`,
        animation: 'ig-scale-in 0.25s cubic-bezier(0.16,1,0.3,1) both',
      }}>
        {/* Header bar */}
        <div style={{ background: `linear-gradient(135deg, ${T.terra}, #8a3d26)`, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4M12 17h.01M4.5 19h15a1 1 0 0 0 .87-1.5l-7.5-13a1 1 0 0 0-1.74 0l-7.5 13A1 1 0 0 0 4.5 19Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.9)', fontFamily: T.mono, textTransform: 'uppercase' }}>
              Delete account
            </span>
          </div>
          <button
            onClick={() => !loading && onClose()}
            aria-label="Close"
            disabled={loading}
            style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', cursor: loading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 24px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <h2 id="delete-account-title" style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 400, color: T.ink, letterSpacing: '-0.01em', marginBottom: 8 }}>
              Are you sure?
            </h2>
            <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>
              This permanently deletes your account and all data, including cloud snapshots. This cannot be undone.
            </p>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(168,75,47,0.08)', border: '1px solid rgba(168,75,47,0.25)' }}>
            <p style={{ fontSize: 13, color: T.ink, lineHeight: 1.55, margin: 0 }}>
              If you have an active Pro subscription, it will be <strong>cancelled immediately</strong> as part of this — you will not be charged again.
            </p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(168,75,47,0.1)', border: '1px solid rgba(168,75,47,0.3)' }}>
              <p style={{ fontSize: 13, color: T.terra, lineHeight: 1.55, margin: 0 }}>{error}</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={handleDelete}
              disabled={loading}
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: 'none', background: T.terra, color: T.cream, fontSize: 13, fontWeight: 700, cursor: loading ? 'default' : 'pointer', fontFamily: T.sans, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Deleting…' : 'Yes, delete everything'}
            </button>
            <button
              onClick={() => !loading && onClose()}
              disabled={loading}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--t-border2)', background: 'transparent', color: T.inkDim, fontSize: 13, fontWeight: 500, cursor: loading ? 'default' : 'pointer', fontFamily: T.sans }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DeleteAccountButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-destructive hover:text-destructive/80 font-medium w-fit"
      >
        Delete account and all data
      </button>
      {open && <DeleteAccountDialog onClose={() => setOpen(false)} />}
    </>
  );
}
