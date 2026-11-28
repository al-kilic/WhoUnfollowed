'use client';

import { useEffect, useMemo, useState } from 'react';
import { aiReadSchema, exportStats, type AiRead, type ParsedSnapshot } from '@ig-tracker/core';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { T } from '@/components/landing/tokens';
import { UpgradeLink } from '@/app/account/UpgradeLink';
import { trackLockedView, track } from '@/lib/analytics';
import { ReadCard } from '../coach/ReadCard';
import { getCoachContent } from '../coach/content';
import { getCoachCardContent } from './coachCard.content';
import type { Seen } from '@/components/studio/coach/CoachSeen';

// Pro AI on the results page.
// - Pro AI: send this export's numbers (no usernames) once, show the free read.
// - Everyone else: their real numbers, computed here, with the AI part blurred.
//   No model call happens for them.
// In Studio (`studio` set): no top margin, no link out to the coach, and the
// upgrade button opens Studio's sheet instead of the pricing page.
export interface StudioMode { onUpgrade: () => void }

export function CoachCard({ snapshot, hasProAi, locale, studio }: { snapshot: ParsedSnapshot; hasProAi: boolean; locale: AppLocale; studio?: StudioMode | undefined }) {
  const stats = useMemo(() => exportStats(snapshot), [snapshot]);
  return hasProAi ? <ProAiRead stats={stats} locale={locale} studio={studio} /> : <BlurredRead stats={stats} locale={locale} studio={studio} />;
}

export type Stats = ReturnType<typeof exportStats>;
const pct = (x: number) => `${Math.round(x * 100)}%`;
const cta = { alignSelf: 'flex-start' as const, padding: '11px 20px', borderRadius: 10, background: T.teal, color: T.onTeal, textDecoration: 'none', fontSize: 14, fontWeight: 600 };
const box = { marginTop: 32, borderRadius: 18, border: `1px solid ${T.tealMid}`, background: T.surface1, padding: '22px 24px', display: 'flex', flexDirection: 'column' as const, gap: 12 };

export function realLines(stats: Stats, c: ReturnType<typeof getCoachCardContent>): string[] {
  const lines: string[] = [];
  const best = Object.entries(stats.newFollowersByMonth).sort((a, b) => b[1] - a[1]).slice(0, 2).filter(([, n]) => n > 0);
  if (best.length) lines.push(c.bestMonths(best.map(([m, n]) => `${m} (+${n})`).join(', ')));
  if (stats.followBackRate12m !== null && stats.followBackRatePrev12m !== null) lines.push(c.followBack(pct(stats.followBackRate12m), pct(stats.followBackRatePrev12m)));
  else if (stats.followBackRate12m !== null) lines.push(c.followBackOne(pct(stats.followBackRate12m)));
  return lines;
}

function BlurredRead({ stats, locale, studio }: { stats: Stats; locale: AppLocale; studio?: StudioMode | undefined }) {
  const c = getCoachCardContent(locale);
  const lines = realLines(stats, c);
  useEffect(() => { trackLockedView('results-ai-read'); }, []);
  return (
    <section style={studio ? { ...box, marginTop: 0 } : box}>
      <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '0.12em', color: T.tealMid }}>{c.eyebrow}</div>
      <h2 style={{ fontFamily: T.sans, fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', margin: 0, color: T.ink }}>{c.blurTitle}</h2>
      {lines.map((l) => <p key={l} style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: T.ink }}>{l}</p>)}
      <div aria-hidden="true" style={{ filter: 'blur(5px)', userSelect: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {c.sample.map((s) => <p key={s} style={{ margin: 0, fontSize: 14, color: T.inkDim }}>{s}</p>)}
      </div>
      {studio ? (
        <button type="button" onClick={studio.onUpgrade} style={{ ...cta, border: 0, cursor: 'pointer', fontFamily: T.sans }}>{c.cta}</button>
      ) : (
        <UpgradeLink source="results-ai-read" style={cta}>{c.cta}</UpgradeLink>
      )}
      <p style={{ margin: 0, fontSize: 12.5, color: T.inkMute }}>{c.ctaNote}</p>
    </section>
  );
}

export type ReadState =
  | { kind: 'loading' } | { kind: 'setup' } | { kind: 'read'; read: AiRead; seen?: Seen | undefined } | { kind: 'none' }
  // A new export the same day as the last read: the next read is tomorrow; `old` is the latest earlier read.
  | { kind: 'tomorrow'; old: AiRead | null };

// Pro AI only: sends this export's numbers (no usernames) once and returns the
// coach's read, or the latest earlier read if this export was already read.
export function useAiRead(stats: Stats | null, locale: AppLocale): ReadState {
  const [state, setState] = useState<ReadState>({ kind: 'loading' });
  useEffect(() => {
    if (!stats) return;
    let alive = true;
    (async () => {
      const res = await fetch('/api/ai/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stats, locale }) }).catch(() => null);
      const json = res ? ((await res.json().catch(() => ({}))) as { ok?: boolean; data?: unknown; error?: string; read?: { kind?: string }; seen?: Seen }) : {};
      if (!alive) return;
      if (json.error === 'needs_onboarding') { setState({ kind: 'setup' }); return; }
      const fresh = aiReadSchema.safeParse(json.data);
      if (fresh.success) { track('ai-read-shown', { fresh: true }); setState({ kind: 'read', read: fresh.data, ...(json.seen ? { seen: json.seen } : {}) }); return; }
      const st = await fetch('/api/ai/state', { cache: 'no-store' }).then((r) => r.json()).catch(() => null) as { latestRead?: { data?: unknown } } | null;
      const prev = aiReadSchema.safeParse(st?.latestRead?.data);
      const old = prev.success ? prev.data : null;
      if (!alive) return;
      if (json.read?.kind === 'tomorrow') { setState({ kind: 'tomorrow', old }); return; }
      setState(old ? { kind: 'read', read: old } : { kind: 'none' });
    })();
    return () => { alive = false; };
  }, [stats, locale]);
  return state;
}

function ProAiRead({ stats, locale, studio }: { stats: Stats; locale: AppLocale; studio?: StudioMode | undefined }) {
  const c = getCoachCardContent(locale);
  const coach = getCoachContent(locale);
  const state = useAiRead(stats, locale);

  if (state.kind === 'none') return null;
  if (state.kind === 'loading') return <section style={studio ? { ...box, marginTop: 0 } : box}><p style={{ margin: 0, fontSize: 14, color: T.inkDim }}>{c.reading}</p></section>;
  if (state.kind === 'setup') {
    return (
      <section style={studio ? { ...box, marginTop: 0 } : box}>
        <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '0.12em', color: T.tealMid }}>{c.eyebrow}</div>
        <h2 style={{ fontFamily: T.sans, fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', margin: 0, color: T.ink }}>{c.setupTitle}</h2>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: T.inkDim }}>{c.setupBody}</p>
        <Link href="/app/today" style={cta}>{c.setupCta}</Link>
      </section>
    );
  }
  // A paid or next-day read is offered on Today; here we show the latest one.
  const read = state.kind === 'read' ? state.read : state.old;
  if (!read) return null;
  return (
    <div style={{ marginTop: studio ? 0 : 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <ReadCard read={read} c={coach} />
      {!studio && <Link href="/app/today" style={{ alignSelf: 'flex-start', fontSize: 14, fontWeight: 600, color: T.tealLight, textDecoration: 'none' }}>{c.open} →</Link>}
    </div>
  );
}
