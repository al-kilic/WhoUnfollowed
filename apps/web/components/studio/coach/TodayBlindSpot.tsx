'use client';

import { useEffect, useMemo, useState } from 'react';
import { exportStats, type AiInsightsStats, type ContentStats, type ParsedSnapshot, type VoiceStats } from '@ig-tracker/core';
import { ArrowRight, Eye, Lock } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { GoalView } from '@/lib/ai/goals';
import type { LedgerRow } from '@/lib/ai/ledger';
import { FREE_DETECTORS, detectBlindSpots, type BlindSpot, type PostedLite } from '@/lib/ai/blindSpots';
import { answerCard, loadRemoteState, loadState, pickCard, saveRemoteState, saveState, type CardState } from '@/lib/ai/blindSpotState';
import { isSampleOn } from '@/lib/sample/sampleMode';
import { getSampleContentStats, getSampleInsights, getSampleLedger, getSampleVoice } from '@/lib/sample/learned';
import { useStudio } from '../StudioContext';
import { blindSpotFmt, getBlindSpotContent } from './todayBlindSpot.content';

// One thing from the member's own data they haven't asked about, on Today.
// Computed here from numbers (no model call); at most one card, rarely.
// Pro AI members keep the "when was it shown" state in their account; sample
// visitors keep it in this tab. Free accounts get one card from the export
// alone (FREE_DETECTORS), state in this browser, no requests at all, and an
// "ask your coach" that opens the upgrade sheet.
interface Extra { content: ContentStats | null; insights: AiInsightsStats | null; voice: VoiceStats | null; ledger: LedgerRow[] }

const get = <T,>(url: string, fallback: T): Promise<T> =>
  fetch(url, { cache: 'no-store' }).then((r) => (r.ok ? (r.json() as Promise<T>) : fallback)).catch(() => fallback);

function useInputs(enabled: boolean, platform: string) {
  const [posted, setPosted] = useState<PostedLite[] | null>(null);
  const [goal, setGoal] = useState<GoalView | null>(null);
  const [extra, setExtra] = useState<Extra>({ content: null, insights: null, voice: null, ledger: [] });
  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    const sample = isSampleOn();
    void Promise.all([
      get<{ items: PostedLite[] }>('/api/ai/content', { items: [] }),
      get<GoalView | null>(`/api/ai/goal?platform=${platform}`, null),
      sample
        ? Promise.resolve<Extra>({ content: getSampleContentStats(), insights: getSampleInsights(), voice: getSampleVoice(), ledger: getSampleLedger().formats })
        : Promise.all([
          get<{ stats: ContentStats | null; insights?: AiInsightsStats | null; ledger: { formats: LedgerRow[] } }>(`/api/ai/content-stats?platform=${platform}`, { stats: null, insights: null, ledger: { formats: [] } }),
          get<{ voice: { stats: VoiceStats } | null }>('/api/ai/voice', { voice: null }),
        ]).then(([c, v]) => ({ content: c.stats, insights: c.insights ?? null, voice: v.voice?.stats ?? null, ledger: c.ledger?.formats ?? [] })),
    ]).then(([p, g, x]) => { if (alive) { setPosted(p.items ?? []); setGoal(g); setExtra(x); } });
    return () => { alive = false; };
  }, [enabled, platform]);
  return { posted, goal, extra, ready: posted !== null };
}

async function readState(sample: boolean): Promise<CardState> {
  return sample ? loadState(true) : (await loadRemoteState()) ?? loadState(false);
}
function writeState(sample: boolean, s: CardState, dataKey: string) {
  if (sample) saveState(true, s); else void saveRemoteState(s, dataKey);
}

export function TodayBlindSpot({ snapshot, previous, hasPlan }: { snapshot: ParsedSnapshot; previous: ParsedSnapshot | null; hasPlan: boolean }) {
  const { locale, hasProAi, coach, openUpgrade, c: sc } = useStudio();
  const t = getBlindSpotContent(locale);
  const f = useMemo(() => blindSpotFmt(locale), [locale]);
  const platform = exportStats(snapshot).platform ?? 'instagram';
  const { posted, goal, extra, ready } = useInputs(hasProAi, platform);
  const [spot, setSpot] = useState<BlindSpot | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const days = coach.state?.prefs?.days;
  const dataKey = String(snapshot.exportedAt);

  useEffect(() => {
    const stats = [exportStats(snapshot, previous ?? undefined), ...(previous ? [exportStats(previous)] : [])];
    if (!hasProAi) {
      const spots = detectBlindSpots({ stats }).filter((b) => FREE_DETECTORS.has(b.detector));
      const picked = pickCard(spots, loadState(false), dataKey, Date.now());
      saveState(false, picked.state);
      setSpot(picked.spot);
      return;
    }
    if (!ready) return;
    let alive = true;
    const spots = detectBlindSpots({
      stats, hasPlan, posted: posted ?? [], content: extra.content, insights: extra.insights, voice: extra.voice, ledger: extra.ledger,
      ...(days ? { postingDays: days } : {}),
      goal: goal?.goal && goal.goal.type === 'followers' ? { target: goal.goal.target, progress: goal.progress } : null,
    });
    const sample = isSampleOn();
    void readState(sample).then((state) => {
      if (!alive) return;
      const picked = pickCard(spots, state, dataKey, Date.now());
      writeState(sample, picked.state, dataKey);
      setSpot(picked.spot);
    });
    return () => { alive = false; };
  }, [hasProAi, ready, snapshot, previous, hasPlan, posted, goal, days, dataKey, extra]);

  if (done) return <p className="s-sub-t s-bspot-done" role="status">{done}</p>;
  if (!spot) return null;
  const c = t.spots[spot.detector];
  const title = c.title(spot.params, f);
  const answer = (a: 'know' | 'later') => {
    if (!hasProAi) saveState(false, answerCard(loadState(false), spot.key, a, Date.now()));
    else {
      const sample = isSampleOn();
      void readState(sample).then((s) => writeState(sample, answerCard(s, spot.key, a, Date.now()), dataKey));
    }
    setDone(a === 'know' ? t.knowDone : t.laterDone);
    setSpot(null);
  };
  return (
    <section className="s-card s-glow s-bspot" aria-label={t.lab}>
      <div className="s-pad s-col" style={{ gap: 8 }}>
        <span className="s-lab s-row" style={{ gap: 6 }}><Eye size={13} />{t.lab}</span>
        <b className="s-bspot-t">{title.charAt(0).toUpperCase() + title.slice(1)}</b>
        <span className="s-sub-t" style={{ fontSize: 14 }}>{c.why(spot.params, f)}</span>
        <div className="s-row" style={{ gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
          <Link href={spot.href} className="s-btn acc">{c.step}<ArrowRight size={14} /></Link>
          <button type="button" className="s-btn sec" onClick={() => answer('know')}>{t.know}</button>
          <button type="button" className="s-btn ghost" onClick={() => answer('later')}>{t.later}</button>
          {!hasProAi && <button type="button" className="s-btn ghost" onClick={() => openUpgrade('ask')}>{t.ask}<span className="s-badge acc"><Lock size={11} />{sc.lock.proAi}</span></button>}
        </div>
      </div>
    </section>
  );
}
