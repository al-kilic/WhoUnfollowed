'use client';

import type { VerdictStats } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';
import type { AppLocale } from '@/i18n/routing';
import { fmt } from '@/components/tools/ToolCard';
import type { RadarPageContent } from './radar.content';
import { jumpToSection } from './RadarSection';

const SAND = '#a0956b';

function Chip({ href, kicker, value, tone }: { href: string; kicker: string; value: string; tone: string }) {
  return (
    <a href={href} onClick={e => jumpToSection(e, href.slice(1))} style={{
      display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, textDecoration: 'none', padding: '14px 16px', borderRadius: 14,
      background: 'var(--t-surface1)', border: '1px solid var(--t-border1)', borderTop: `2px solid ${tone}`, transition: 'transform 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
    >
      <span style={{ fontSize: 10, fontFamily: T.mono, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.inkMute }}>{kicker}</span>
      <span style={{ fontFamily: T.serif, fontSize: 21, lineHeight: 1.1, letterSpacing: '-0.01em', color: T.ink }}>{value}</span>
    </a>
  );
}

// First thing on the Radar: one sentence, one ribbon, three chips. Free view:
// counts only, nothing that names an account.
export function OverviewCover({ stats, c, locale, eyebrow, archetype, fixCount, onAbout, aboutLabel, wrapLabel, onWrap }: {
  stats: VerdictStats; c: RadarPageContent; locale: AppLocale; eyebrow: string;
  archetype: string; fixCount: number; onAbout: () => void; aboutLabel: string;
  wrapLabel?: string | undefined; onWrap?: (() => void) | undefined;
}) {
  const n = (x: number) => fmt(x, locale);
  const segments = [
    { key: 'm', label: c.cover.mutuals, value: stats.mutuals, color: 'var(--t-tealMid)' },
    { key: 'o', label: c.cover.oneWay, value: stats.oneWay, color: 'var(--t-terra)' },
    { key: 'f', label: c.cover.fans, value: stats.fans, color: SAND },
  ];
  const total = Math.max(1, segments.reduce((s, x) => s + x.value, 0));
  const net = stats.gained !== undefined && stats.lost !== undefined ? stats.gained - stats.lost : null;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
        <span style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{eyebrow}</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {wrapLabel && onWrap && (
          <button type="button" onClick={onWrap} style={{
            fontSize: 12, fontFamily: T.mono, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
            background: 'var(--t-terra)', border: '1px solid var(--t-terra)', color: '#F4F0E8',
          }}>▶ {wrapLabel}</button>
        )}
        <button type="button" onClick={onAbout} style={{
          fontSize: 12, fontFamily: T.mono, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
          background: 'transparent', border: '1px solid rgba(2,136,143,0.3)', color: T.tealLight,
        }}>{aboutLabel}</button>
        </div>
      </div>

      <h1 style={{ fontFamily: T.serif, fontWeight: 400, fontSize: 'clamp(40px, 7vw, 84px)', lineHeight: 0.95, letterSpacing: '-0.04em', color: T.ink, margin: 0, maxWidth: 900 }}>
        {c.cover.headline(n(stats.followers))}
      </h1>
      <p style={{ fontSize: 'clamp(15px, 1.6vw, 18px)', color: T.inkDim, lineHeight: 1.5, margin: '14px 0 0', maxWidth: 640 }}>
        {c.cover.sub(stats.followBackPct, n(stats.oneWay))}
      </p>

      {/* Ribbon: every account in the export, split three ways. */}
      <div style={{ marginTop: 32 }}>
        <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>{c.cover.ribbonLabel}</div>
        <div role="img" aria-label={c.cover.ribbonAria(n(stats.mutuals), n(stats.oneWay), n(stats.fans))} style={{ display: 'flex', gap: 2, height: 14 }}>
          {segments.filter(s => s.value > 0).map((s, i, arr) => (
            <div key={s.key} title={`${s.label}: ${n(s.value)}`} style={{
              flex: `${s.value / total} 1 0`, minWidth: 6, background: s.color,
              borderRadius: `${i === 0 ? 7 : 2}px ${i === arr.length - 1 ? 7 : 2}px ${i === arr.length - 1 ? 7 : 2}px ${i === 0 ? 7 : 2}px`,
              transformOrigin: 'left', animation: `wu-grow 0.8s ${0.1 * i}s cubic-bezier(.2,.7,.2,1) both`,
            }} />
          ))}
        </div>
        <style>{'@keyframes wu-grow { from { transform: scaleX(0) } to { transform: scaleX(1) } } @media (prefers-reduced-motion: reduce) { [style*="wu-grow"] { animation: none !important } }'}</style>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px', marginTop: 12 }}>
          {segments.map(s => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 2, background: s.color, alignSelf: 'center' }} />
              <span style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, letterSpacing: '-0.01em' }}>{n(s.value)}</span>
              <span style={{ fontSize: 12.5, color: T.inkDim }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 10, marginTop: 28 }}>
        <Chip href="#verdict" kicker={c.cover.youAre} value={archetype} tone="var(--t-tealMid)" />
        <Chip href="#radar" kicker={c.nav.radar} value={fixCount > 0 ? c.cover.toFix(fixCount) : c.cover.allClear} tone={fixCount > 0 ? 'var(--t-terra)' : 'var(--t-tealMid)'} />
        <Chip
          href="#data"
          kicker={net === null ? c.cover.firstExport : c.cover.sinceLast}
          value={net === null ? c.cover.followingCount(n(stats.following)) : `${net > 0 ? '+' : net < 0 ? '−' : ''}${n(Math.abs(net))}`}
          tone={net !== null && net < 0 ? 'var(--t-terra)' : SAND}
        />
      </div>
    </div>
  );
}
