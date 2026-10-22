'use client';

import { useCallback, useEffect } from 'react';
import { ArrowUpRight, Ban, Info, PowerOff, ShieldCheck, Trash2, UserX, X } from 'lucide-react';
import { T } from '@/components/landing/tokens';
import { withApp, type Platform } from '@/lib/platform';
import type { TriageListContent } from './triageList.content';

// Set when the user taps the main button. Closing with X, Escape or the
// backdrop only hides it for now, so it shows again on the next profile open.
const ACK_KEY = 'wu_unavailable_profiles_ack';

export function hasAckedUnavailableNotice(): boolean {
  try { return localStorage.getItem(ACK_KEY) === '1'; } catch { return false; }
}
function markAcked() {
  try { localStorage.setItem(ACK_KEY, '1'); } catch {}
}

const REASON_ICONS = [PowerOff, Trash2, Ban];
// The blog is English-only for now, so every locale links the same article.
const LEARN_MORE_HREF = '/blog/accounts-in-instagram-export-you-cant-find';
const MUTED_CHIP = { color: '#9ca3af', bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.3)' };

interface Props {
  platform: Platform;
  c: TriageListContent['unavailable'];
  deactivatedLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Non-followers can include accounts whose profile no longer opens
// (deactivated, deleted, suspended). Meta keeps them in the export, which
// reads like a parser bug. The list opens this when a profile link is
// clicked; the inline link reopens it any time.
export function UnavailableProfilesNotice({ platform, c, deactivatedLabel, open, onOpenChange }: Props) {
  const dismiss = useCallback(() => onOpenChange(false), [onOpenChange]);
  const ack = useCallback(() => { markAcked(); onOpenChange(false); }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, dismiss]);

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          fontSize: 12, color: T.terraText, fontFamily: T.sans, fontWeight: 500,
          textDecoration: 'underline', textDecorationColor: 'color-mix(in srgb, var(--t-terraText) 40%, transparent)', textUnderlineOffset: 3,
        }}
      >
        <Info size={12} />
        {withApp(c.hint, platform)}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="unavailable-profiles-title"
          style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        >
          <div onClick={dismiss} aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }} />

          <div style={{
            position: 'relative', width: '100%', maxWidth: 420,
            borderRadius: 20, padding: 20, overflow: 'hidden',
            background: T.bgCard, border: '1px solid var(--t-border2)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
            animation: 'ig-scale-in 0.22s cubic-bezier(0.16,1,0.3,1) both',
          }}>
            {/* Soft accent glow behind the header */}
            <div aria-hidden="true" style={{
              position: 'absolute', top: -80, left: -40, width: 260, height: 180, pointerEvents: 'none',
              background: 'radial-gradient(closest-side, rgba(var(--t-accent-rgb),0.18), transparent)',
            }} />

            <button onClick={dismiss} aria-label={c.close} style={{
              position: 'absolute', top: 14, right: 14, zIndex: 2, width: 32, height: 32, borderRadius: 9,
              border: 'none', background: 'var(--t-surface2)', color: T.inkMute, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <X size={14} />
            </button>

            {/* Header */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingRight: 32 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `linear-gradient(135deg, ${T.teal}, ${T.tealMid})`, color: T.cream,
                boxShadow: '0 6px 18px rgba(var(--t-accent-rgb),0.3)',
              }}>
                <UserX size={20} />
              </div>
              <div>
                <h2 id="unavailable-profiles-title" style={{ fontSize: 17, fontWeight: 650, color: T.ink, margin: 0, fontFamily: T.sans, lineHeight: 1.25 }}>
                  {withApp(c.title, platform)}
                </h2>
                <p style={{ fontSize: 12.5, color: T.inkDim, margin: '3px 0 0', fontFamily: T.sans, lineHeight: 1.4 }}>
                  {withApp(c.lead, platform)}
                </p>
              </div>
            </div>

            {/* Reasons */}
            <div style={{ position: 'relative', borderRadius: 14, border: '1px solid var(--t-border1)', background: 'var(--t-surface1)', overflow: 'hidden' }}>
              {c.reasons.map((r, i) => {
                const Icon = REASON_ICONS[i] ?? Ban;
                return (
                  <div key={r.label} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                    borderTop: i === 0 ? 'none' : '1px solid var(--t-border1)',
                  }}>
                    <Icon size={15} style={{ color: T.inkMute, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.ink, fontFamily: T.sans, minWidth: 88, flexShrink: 0 }}>{r.label}</span>
                    <span style={{ fontSize: 12, color: T.inkMute, fontFamily: T.sans, lineHeight: 1.35 }}>{withApp(r.detail, platform)}</span>
                  </div>
                );
              })}
            </div>

            {/* Reassurance */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '9px 12px', borderRadius: 10,
              background: 'rgba(var(--t-accent-rgb),0.08)', border: '1px solid rgba(var(--t-accent-rgb),0.2)',
            }}>
              <ShieldCheck size={15} style={{ color: T.tealLight, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 12.5, color: T.tealLight, fontFamily: T.sans, fontWeight: 500 }}>{c.allFine}</span>
            </div>

            {/* Tip */}
            <p style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, fontSize: 12.5, color: T.inkDim, margin: '14px 2px 16px', fontFamily: T.sans }}>
              {c.tipBefore}
              <span style={{
                fontSize: 11, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 20,
                color: MUTED_CHIP.color, background: MUTED_CHIP.bg, border: `1px solid ${MUTED_CHIP.border}`,
              }}>
                {deactivatedLabel}
              </span>
              {c.tipAfter}
            </p>

            <button
              onClick={ack}
              autoFocus
              style={{
                width: '100%', padding: '11px 16px', borderRadius: 12,
                border: 'none', background: T.teal, color: T.cream,
                fontSize: 13.5, fontWeight: 600, fontFamily: T.sans, cursor: 'pointer',
              }}
            >
              {c.ack}
            </button>
            <a
              href={LEARN_MORE_HREF}
              target="_blank"
              rel="noopener"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                marginTop: 12, fontSize: 12.5, fontWeight: 500, fontFamily: T.sans,
                color: T.inkDim, textDecoration: 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = T.ink)}
              onMouseLeave={e => (e.currentTarget.style.color = T.inkDim)}
            >
              {c.learnMore}
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
