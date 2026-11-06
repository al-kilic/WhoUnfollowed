'use client';

import { useEffect, useMemo, useState } from 'react';
import { pickVerdict, verdictStats, type ParsedSnapshot } from '@ig-tracker/core';
import type { AppLocale } from '@/i18n/routing';
import { getVerdictContent } from '@/components/tools/verdict.content';
import { drawVerdictImage } from '@/components/tools/verdictImage';
import { fill, fmt } from '@/components/tools/ToolCard';
import { Events, track } from '@/lib/analytics';

// Verdict state shared by the card on /results and the poster on the Radar
// (where the cover also shows the archetype name, so both read one source).
export function useVerdict(current: ParsedSnapshot, previous: ParsedSnapshot | undefined, locale: AppLocale, placement: 'results' | 'radar') {
  const c = getVerdictContent(locale);
  const [spin, setSpin] = useState(0);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  // Read after mount so server and first client render match.
  const [canShare, setCanShare] = useState(false);
  useEffect(() => { setCanShare(typeof navigator.share === 'function'); }, []);
  const stats = useMemo(() => verdictStats(current, previous), [current, previous]);
  const verdict = useMemo(() => pickVerdict(stats, current.exportedAt, spin), [stats, current.exportedAt, spin]);
  const archetype = c.archetypes[verdict.archetype];
  const line = fill(archetype.lines[verdict.lineSeed % archetype.lines.length]!, {
    followBackPct: stats.followBackPct,
    oneWay: fmt(stats.oneWay, locale),
    fans: fmt(stats.fans, locale),
    followers: fmt(stats.followers, locale),
    following: fmt(stats.following, locale),
    lost: fmt(stats.lost ?? 0, locale),
    gained: fmt(stats.gained ?? 0, locale),
  });
  const statRow = [
    { label: c.stats.followers, value: fmt(stats.followers, locale) },
    { label: c.stats.following, value: fmt(stats.following, locale) },
    { label: c.stats.followBack, value: `${stats.followBackPct}%` },
  ];

  const render = () => drawVerdictImage({ typeLabel: c.typeLabel, name: archetype.name, line, stats: statRow, footer: c.footer });
  const log = (action: 'share' | 'save' | 'another') => track(Events.verdictShare, { action, archetype: verdict.archetype, placement });

  const save = async (fromShare = false) => {
    if (!fromShare) log('save');
    setBusy(true);
    try {
      const url = URL.createObjectURL(await render());
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

  const another = () => { log('another'); setSpin(s => s + 1); setSaved(false); };

  return { c, stats, verdict, name: archetype.name, line, statRow, busy, saved, canShare, save, share, another };
}

export type VerdictState = ReturnType<typeof useVerdict>;
