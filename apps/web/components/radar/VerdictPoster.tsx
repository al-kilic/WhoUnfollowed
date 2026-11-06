'use client';

import { T } from '@/components/landing/tokens';
import type { VerdictState } from '@/hooks/useVerdict';

const CREAM = '#F4F0E8';
const btn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 16px', borderRadius: 999,
  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: '1px solid rgba(244,240,232,0.25)',
  background: 'transparent', color: CREAM,
};
const btnPrimary: React.CSSProperties = { ...btn, background: CREAM, color: '#0B2426', border: `1px solid ${CREAM}` };

// The Radar's verdict: a wide, poster-style band. Always deep teal (it is the
// same object as the story image), in both themes. Aggregates only.
export function VerdictPoster({ v }: { v: VerdictState }) {
  const { c } = v;
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr]" style={{
      position: 'relative', overflow: 'hidden', borderRadius: 24, background: '#0B2426', color: CREAM,
      boxShadow: '0 30px 80px -30px rgba(1,105,111,0.45)',
    }}>
      <svg aria-hidden="true" viewBox="0 0 600 600" style={{ position: 'absolute', right: '-12%', top: '-40%', width: 620, height: 620, opacity: 0.9, animation: 'wu-orbit 60s linear infinite' }}>
        <circle cx="300" cy="300" r="280" fill="none" stroke="rgba(2,136,143,0.35)" strokeWidth="1.2" />
        <circle cx="300" cy="300" r="200" fill="none" stroke="rgba(2,136,143,0.22)" strokeWidth="1" strokeDasharray="2 8" />
        <circle cx="390" cy="360" r="130" fill="none" stroke="rgba(168,75,47,0.6)" strokeWidth="1.4" />
        <circle cx="470" cy="160" r="6" fill="#A84B2F" />
      </svg>
      <style>{'@keyframes wu-orbit { to { transform: rotate(360deg) } } @media (prefers-reduced-motion: reduce) { svg[style*="wu-orbit"] { animation: none !important } }'}</style>

      <div style={{ position: 'relative', padding: 'clamp(28px, 4vw, 48px)' }}>
        <div style={{ fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7fc4c7', fontFamily: T.mono }}>{c.typeLabel}</div>
        <div key={v.name} style={{
          fontFamily: T.serif, fontSize: 'clamp(40px, 6.5vw, 76px)', lineHeight: 0.95, letterSpacing: '-0.035em', margin: '14px 0 18px',
          animation: 'wu-rise 0.5s cubic-bezier(.2,.7,.2,1)',
        }}>{v.name}</div>
        <style>{'@keyframes wu-rise { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }'}</style>
        <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 'clamp(17px, 2vw, 21px)', lineHeight: 1.4, color: 'rgba(244,240,232,0.88)', maxWidth: 520, margin: 0 }}>
          &ldquo;{v.line}&rdquo;
        </p>
        <div style={{ display: 'flex', gap: 8, marginTop: 28, flexWrap: 'wrap' }}>
          {v.canShare && <button type="button" style={btnPrimary} disabled={v.busy} onClick={v.share}>{c.share}</button>}
          <button type="button" style={v.canShare ? btn : btnPrimary} disabled={v.busy} onClick={() => v.save()}>{v.saved ? c.saved : c.save}</button>
          <button type="button" style={btn} onClick={v.another}>↻ {c.another}</button>
        </div>
      </div>

      <dl className="border-t md:border-t-0 md:border-l border-[rgba(244,240,232,0.1)]" style={{
        position: 'relative', margin: 0, display: 'grid', alignContent: 'center',
        padding: 'clamp(20px, 3vw, 40px)',
        background: 'linear-gradient(180deg, rgba(16,48,50,0.92), rgba(11,36,38,0.88))',
        backdropFilter: 'blur(2px)',
      }}>
        {v.statRow.map((s, i) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, padding: '14px 0', borderTop: i === 0 ? 'none' : '1px solid rgba(244,240,232,0.12)' }}>
            <dt style={{ fontSize: 11, fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(244,240,232,0.55)' }}>{s.label}</dt>
            <dd style={{ margin: 0, fontFamily: T.serif, fontSize: 'clamp(30px, 3.4vw, 42px)', lineHeight: 1, letterSpacing: '-0.02em' }}>{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
