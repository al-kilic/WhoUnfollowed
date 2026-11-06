'use client';

import type { ParsedSnapshot } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';
import type { AppLocale } from '@/i18n/routing';
import { useVerdict } from '@/hooks/useVerdict';
import { ToolCard, ToolLabel, ToolSub, ToolTitle, toolButton, toolButtonPrimary } from './ToolCard';

// Free and shareable. Only aggregate numbers go on the card, never usernames.
// The Radar uses <VerdictPoster> instead; this compact card is for /results.
export function VerdictCard({ current, previous, locale }: {
  current: ParsedSnapshot;
  previous?: ParsedSnapshot | undefined;
  locale: AppLocale;
}) {
  const v = useVerdict(current, previous, locale, 'results');
  const { c } = v;

  return (
    <ToolCard>
      <ToolLabel>{c.label}</ToolLabel>
      <ToolTitle>{c.title}</ToolTitle>
      <ToolSub>{c.sub}</ToolSub>
      <div style={{ background: '#0B2426', color: '#F4F0E8', borderRadius: 14, padding: '26px 24px', position: 'relative', overflow: 'hidden', maxWidth: 420 }}>
        <svg aria-hidden="true" width="160" height="160" viewBox="0 0 160 160" style={{ position: 'absolute', right: -30, top: -30 }}>
          <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(2,136,143,0.55)" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="45" fill="none" stroke="rgba(168,75,47,0.7)" strokeWidth="1.5" />
        </svg>
        <div style={{ fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7fc4c7', fontFamily: T.mono }}>{c.typeLabel}</div>
        <div style={{ fontFamily: T.serif, fontSize: 34, lineHeight: 1.05, margin: '8px 0 10px' }}>{v.name}</div>
        <div style={{ fontSize: 15, lineHeight: 1.5, color: 'rgba(244,240,232,0.85)' }}>{v.line}</div>
        <div style={{ display: 'flex', gap: 22, marginTop: 20 }}>
          {v.statRow.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: T.serif, fontSize: 24 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(244,240,232,0.6)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        {v.canShare && <button type="button" style={toolButtonPrimary} disabled={v.busy} onClick={v.share}>{c.share}</button>}
        <button type="button" style={v.canShare ? toolButton : toolButtonPrimary} disabled={v.busy} onClick={() => v.save()}>{v.saved ? c.saved : c.save}</button>
        <button type="button" style={toolButton} onClick={v.another}>{c.another}</button>
      </div>
    </ToolCard>
  );
}
