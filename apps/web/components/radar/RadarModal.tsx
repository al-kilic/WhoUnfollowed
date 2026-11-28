'use client';

import { useEffect } from 'react';
import type { AppLocale } from '@/i18n/routing';
import { es, pt } from 'date-fns/locale';
import type { Locale as DateFnsLocale } from 'date-fns';
import { T } from '@/components/landing/tokens';
import type { DashboardContent } from '@/app/[locale]/dashboard/content';

// The Radar "what is this" modal and the date-fns locales, apart from
// RadarDataCards so Studio's Radar pages don't pull in Recharts for them.
export const DATE_FNS_LOCALES: Partial<Record<AppLocale, DateFnsLocale>> = { es, pt };

// ─── Page ──────────────────────────────────────────────────────────────────────

export function RadarModal({ c, onClose }: { c: DashboardContent; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(8,12,12,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: T.bgCard, border: '1px solid var(--t-border2)',
          borderRadius: 24, padding: '40px 44px', maxWidth: 680, width: '100%',
          maxHeight: '85vh', overflowY: 'auto',
          boxShadow: '0 40px 120px rgba(0,0,0,0.7)',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 20, right: 20, width: 32, height: 32,
            borderRadius: '50%', border: '1px solid var(--t-border3)',
            background: 'transparent', color: T.inkMute, cursor: 'pointer',
            fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >×</button>

        <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 10 }}>{c.radarModal.eyebrow}</div>
        <h2 style={{ fontFamily: T.serif, fontSize: 36, fontWeight: 400, letterSpacing: '-0.03em', color: T.ink, marginBottom: 8 }}>
          {c.radarModal.title}
        </h2>
        <p style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.6, marginBottom: 32 }}>
          {c.radarModal.intro}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {c.radarModal.sections.map(s => (
            <div key={s.title} style={{
              display: 'flex', gap: 16,
              padding: '16px 18px', borderRadius: 14,
              background: 'var(--t-surface1)', border: '1px solid var(--t-border1)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'rgba(2,136,143,0.1)', border: '1px solid rgba(2,136,143,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color: T.tealLight,
              }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 5 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, padding: '14px 18px', borderRadius: 12, background: 'rgba(2,136,143,0.06)', border: '1px solid rgba(2,136,143,0.15)', fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>
          <strong style={{ color: T.tealLight }}>{c.radarModal.tipLabel}</strong> {c.radarModal.tip}
        </div>
      </div>
    </div>
  );
}
