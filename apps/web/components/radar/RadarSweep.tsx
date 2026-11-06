'use client';

import { useMemo, useState } from 'react';
import { runHealthChecks, type HealthFinding, type ParsedSnapshot } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';
import { lockedContentStyle } from '@/components/ProLockOverlay';
import type { AppLocale } from '@/i18n/routing';
import { PLATFORM_NAME, snapshotPlatform } from '@/lib/platform';
import { FindingRow } from '@/components/tools/HealthCheckCard';
import { getHealthCheckContent } from '@/components/tools/healthCheck.content';
import { fill } from '@/components/tools/ToolCard';
import type { RadarPageContent } from './radar.content';

const S = 340;
const C = S / 2;
const R = 150;
const GOLDEN = 137.5;

const tone = (impact: number) => (impact >= 60 ? 'var(--t-terra)' : impact >= 35 ? 'var(--t-tealMid)' : 'var(--t-inkMute)');

// Higher impact sits closer to the center; findings fan out by the golden angle.
function blipPos(f: HealthFinding, i: number) {
  const r = 22 + (1 - Math.min(100, Math.max(0, f.impact)) / 100) * (R - 34);
  const a = ((-90 + i * GOLDEN) * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
}

function Scope({ findings, active, setActive, aria }: { findings: HealthFinding[]; active: number | null; setActive: (i: number | null) => void; aria: string }) {
  const wedge = `M${C},${C} L${C},${C - R} A${R},${R} 0 0,1 ${C + R * Math.sin(Math.PI / 4)},${C - R * Math.cos(Math.PI / 4)} Z`;
  return (
    <svg viewBox={`0 0 ${S} ${S}`} role="img" aria-label={aria} style={{ width: '100%', maxWidth: 380, height: 'auto', display: 'block', margin: '0 auto' }}>
      <defs>
        <radialGradient id="wu-scope-bg"><stop offset="0%" stopColor="rgba(1,105,111,0.18)" /><stop offset="100%" stopColor="rgba(1,105,111,0.02)" /></radialGradient>
        <linearGradient id="wu-sweep" x1="0" y1="0" x2="1" y2="0.4"><stop offset="0%" stopColor="rgba(2,136,143,0)" /><stop offset="100%" stopColor="rgba(2,136,143,0.4)" /></linearGradient>
      </defs>
      <circle cx={C} cy={C} r={R} fill="url(#wu-scope-bg)" stroke="var(--t-border3)" />
      {[0.25, 0.5, 0.75].map(k => <circle key={k} cx={C} cy={C} r={R * k} fill="none" stroke="var(--t-border2)" strokeDasharray="2 5" />)}
      <line x1={C - R} y1={C} x2={C + R} y2={C} stroke="var(--t-border2)" />
      <line x1={C} y1={C - R} x2={C} y2={C + R} stroke="var(--t-border2)" />
      <g className="wu-sweep" style={{ transformOrigin: `${C}px ${C}px`, animation: 'wu-sweep 5s linear infinite' }}>
        <path d={wedge} fill="url(#wu-sweep)" />
      </g>
      <circle cx={C} cy={C} r={3} fill="var(--t-tealMid)" />
      {findings.map((f, i) => {
        const { x, y } = blipPos(f, i);
        const on = active === i;
        return (
          <g key={f.id} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} style={{ cursor: 'default' }}>
            <circle cx={x} cy={y} r={on ? 20 : 15} fill={tone(f.impact)} opacity={0.18} className={i === 0 ? 'wu-ping' : undefined} style={{ transformOrigin: `${x}px ${y}px` }} />
            <circle cx={x} cy={y} r={on ? 13 : 11} fill={tone(f.impact)} stroke="var(--t-bg)" strokeWidth={2} style={{ transition: 'r 0.2s' }} />
            <text x={x} y={y + 3.8} textAnchor="middle" fontSize={11} fontFamily="'DM Mono', monospace" fontWeight={600} fill="#F4F0E8">{i + 1}</text>
          </g>
        );
      })}
      <style>{`
        @keyframes wu-sweep { to { transform: rotate(360deg) } }
        @keyframes wu-ping { 0% { transform: scale(0.8); opacity: .35 } 100% { transform: scale(1.8); opacity: 0 } }
        .wu-ping { animation: wu-ping 2s ease-out infinite }
        @media (prefers-reduced-motion: reduce) { .wu-sweep, .wu-ping { animation: none !important } }
      `}</style>
    </svg>
  );
}

// The redesigned health check: a radar scope with numbered blips (closer to
// the center = bigger impact) beside the ranked list. Locked: the scope and the
// count show, the sentences stay blurred and no usernames render.
export function RadarSweep({ current, previous, locale, c, locked }: {
  current: ParsedSnapshot; previous?: ParsedSnapshot | undefined; locale: AppLocale; c: RadarPageContent; locked: boolean;
}) {
  const hc = getHealthCheckContent(locale);
  const all = useMemo(() => runHealthChecks({ current, previous }), [current, previous]);
  const findings = all.filter(f => f.id !== 'second_export');
  const nudge = all.find(f => f.id === 'second_export');
  const app = PLATFORM_NAME[snapshotPlatform(current)];
  const [active, setActive] = useState<number | null>(null);

  return (
    <div id="tutorial-health" className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" style={{
      gap: 'clamp(20px, 4vw, 48px)', alignItems: 'start', padding: 'clamp(20px, 3vw, 32px)', borderRadius: 24,
      background: 'var(--t-surface1)', border: '1px solid var(--t-border1)',
    }}>
      <div style={{ position: 'relative' }}>
        <Scope findings={findings} active={active} setActive={setActive} aria={c.sweep.aria(findings.length)} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12, fontSize: 11, fontFamily: T.mono, color: T.inkMute }}>
          <span>{c.sweep.impact}:</span>
          {[['var(--t-terra)', c.sweep.legendHigh], ['var(--t-tealMid)', c.sweep.legendMid], ['var(--t-inkMute)', c.sweep.legendLow]].map(([col, label]) => (
            <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: col }} />{label}
            </span>
          ))}
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
          <span style={{ fontFamily: T.serif, fontSize: 'clamp(40px, 5vw, 56px)', lineHeight: 1, letterSpacing: '-0.03em', color: findings.length ? T.terraText : T.tealLight }}>{findings.length}</span>
          <span style={{ fontSize: 15, color: T.inkDim }}>{findings.length > 0 ? hc.summary(findings.length) : hc.allClear}</span>
        </div>
        {findings.length > 0 && (
          <ol style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', ...(locked ? lockedContentStyle : {}) }}>
            {findings.map((f, i) => (
              <FindingRow key={f.id} f={f} c={hc} locale={locale} app={app} locked={locked} index={i + 1} active={active === i} onHover={on => setActive(on ? i : null)} badge={i === 0 ? c.sweep.top : undefined} />
            ))}
          </ol>
        )}
        {nudge && (
          <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.55, margin: '16px 0 0', padding: '12px 14px', borderRadius: 12, border: '1px dashed var(--t-border3)' }}>
            <strong style={{ color: T.ink }}>{fill(hc.checks.second_export.title, { app })}</strong> {fill(hc.checks.second_export.action, { app })}
          </p>
        )}
      </div>
    </div>
  );
}
