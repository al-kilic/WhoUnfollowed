'use client';

import { useState } from 'react';
import { Check, ListPlus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useStudio } from '../StudioContext';
import { getInsightsV2 } from './insightsV2.content';
import type { InsightsShown } from './useInsightsRun';

const title = (caption: string | undefined, date: string | null | undefined, locale: string) => {
  const c = (caption ?? '').replace(/\s+/g, ' ').trim();
  if (c.length >= 2) return c.length > 80 ? `${c.slice(0, c.lastIndexOf(' ', 80) > 20 ? c.lastIndexOf(' ', 80) : 80)}…` : c;
  return date ? new Date(`${date}T12:00:00Z`).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Post';
};

// Brings the posts of a run from the export into Posted, with Instagram's own
// numbers, so goals and patterns use them. Each post goes in once (keyed by
// its export timestamp), so pressing it twice adds nothing.
export function InsightsToPosted({ shown }: { shown: InsightsShown }) {
  const { locale } = useStudio();
  const v = getInsightsV2(locale);
  const [done, setDone] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const items = (shown.keys ?? []).map((key, i) => ({ key, i })).filter((x): x is { key: string; i: number } => !!x.key);
  if (!items.length) return null;
  async function add() {
    setBusy(true);
    const body = items.map(({ key, i }) => {
      const n = shown.nums?.[i];
      return {
        key, format: shown.formats?.[i] ?? 'photo', title: title(shown.captions?.[i], shown.dates?.[i], locale), platform: 'instagram', date: shown.dates?.[i] ?? undefined,
        results: n ? Object.fromEntries(Object.entries({ likes: n.likes, comments: n.comments, saves: n.saves, shares: n.shares, reach: n.reach }).filter(([, x]) => typeof x === 'number')) : undefined,
      };
    });
    const r = await fetch('/api/ai/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ import: body }) }).catch(() => null);
    const j = r?.ok ? ((await r.json()) as { ids?: string[] }) : null;
    setBusy(false);
    if (j?.ids) setDone(j.ids.length);
  }
  return done !== null ? (
    <span className="s-row" style={{ gap: 8, fontSize: 13.5 }}><Check size={15} style={{ color: 'var(--good)' }} />{v.toPostedDone(done)} <Link href="/app/plan/posted" className="s-lnk">→</Link></span>
  ) : (
    <span className="s-row" style={{ gap: 10, flexWrap: 'wrap' }}>
      <button type="button" className="s-btn sec" disabled={busy} onClick={() => void add()}><ListPlus size={15} />{v.toPosted}</button>
      <span className="s-sub-t" style={{ fontSize: 12.5 }}>{v.toPostedNote}</span>
    </span>
  );
}
