'use client';

import { useEffect, useMemo, useState } from 'react';
import { pickVerdict, verdictStats, type ParsedSnapshot } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';
import type { AppLocale } from '@/i18n/routing';
import { getVerdictContent } from './verdict.content';
import { drawVerdictImage } from './verdictImage';
import { Events, track } from '@/lib/analytics';
import { ToolCard, ToolLabel, ToolSub, ToolTitle, fill, fmt, toolButton, toolButtonPrimary } from './ToolCard';

// Free and shareable. Only aggregate numbers go on the card, never usernames.
export function VerdictCard({ current, previous, locale, placement = 'results' }: {
  current: ParsedSnapshot;
  previous?: ParsedSnapshot | undefined;
  locale: AppLocale;
  placement?: 'results' | 'radar';
}) {
  const c = getVerdictContent(locale);
  const statLabels = c.stats;
  const [spin, setSpin] = useState(0);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  // Read after mount so server and first client render match.
  const [canShare, setCanShare] = useState(false);
  useEffect(() => { setCanShare(typeof navigator.share === 'function'); }, []);
  const stats = useMemo(() => verdictStats(current, previous), [current, previous]);
  const verdict = useMemo(() => pickVerdict(stats, current.exportedAt, spin), [stats, current.exportedAt, spin]);
  const a = c.archetypes[verdict.archetype];
  const line = fill(a.lines[verdict.lineSeed % a.lines.length]!, {
    followBackPct: stats.followBackPct,
    oneWay: fmt(stats.oneWay, locale),
    fans: fmt(stats.fans, locale),
    followers: fmt(stats.followers, locale),
    following: fmt(stats.following, locale),
    lost: fmt(stats.lost ?? 0, locale),
    gained: fmt(stats.gained ?? 0, locale),
  });
  const statRow = [
    { label: statLabels.followers, value: fmt(stats.followers, locale) },
    { label: statLabels.following, value: fmt(stats.following, locale) },
    { label: statLabels.followBack, value: `${stats.followBackPct}%` },
  ];

  const render = () => drawVerdictImage({ typeLabel: c.typeLabel, name: a.name, line, stats: statRow, footer: c.footer });

  const log = (action: 'share' | 'save' | 'another') => track(Events.verdictShare, { action, archetype: verdict.archetype, placement });

  const save = async (fromShare = false) => {
    if (!fromShare) log('save');
    setBusy(true);
    try {
      const blob = await render();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'my-account-verdict.png';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setSaved(true);
    } finally { setBusy(false); }
  };

  const share = async () => {
    log('share');
    setBusy(true);
    try {
      const file = new File([await render()], 'my-account-verdict.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file] });
      else await save(true);
    } catch { /* user cancelled the share sheet */ } finally { setBusy(false); }
  };


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
        <div style={{ fontFamily: T.serif, fontSize: 34, lineHeight: 1.05, margin: '8px 0 10px' }}>{a.name}</div>
        <div style={{ fontSize: 15, lineHeight: 1.5, color: 'rgba(244,240,232,0.85)' }}>{line}</div>
        <div style={{ display: 'flex', gap: 22, marginTop: 20 }}>
          {statRow.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: T.serif, fontSize: 24 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(244,240,232,0.6)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        {canShare && <button type="button" style={toolButtonPrimary} disabled={busy} onClick={share}>{c.share}</button>}
        <button type="button" style={canShare ? toolButton : toolButtonPrimary} disabled={busy} onClick={() => save()}>{saved ? c.saved : c.save}</button>
        <button type="button" style={toolButton} onClick={() => { log('another'); setSpin(s => s + 1); setSaved(false); }}>{c.another}</button>
      </div>
    </ToolCard>
  );
}
