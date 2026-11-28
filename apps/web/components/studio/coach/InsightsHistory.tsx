'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AiInsights } from '@ig-tracker/core';
import { loadInsightsRun } from '@/lib/insightsThumbs';

export interface InsightsRun { id: string; createdAt: string; topic: string | null; data: AiInsights }

// Earlier Photo insights runs, newest first (saved on the server with every run).
export function useInsightsHistory(enabled: boolean) {
  const [items, setItems] = useState<InsightsRun[] | null>(enabled ? null : []);
  const load = useCallback(async () => {
    if (!enabled) return;
    const r = await fetch('/api/ai/content?kind=insights', { cache: 'no-store' }).catch(() => null);
    setItems(r?.ok ? ((await r.json()) as { items: InsightsRun[] }).items : []);
  }, [enabled]);
  useEffect(() => { void load(); }, [load]);
  return { items, reload: load };
}

// Every earlier run as a small stack of its photos and its date; the one on
// screen is marked. Shown above a result, so going back is always one tap.
export function InsightsRuns({ items, activeId, onPick, label, latest, locale }: {
  items: InsightsRun[]; activeId: string | null; onPick: (run: InsightsRun) => void; label: string; latest: string; locale: string;
}) {
  if (!items.length) return null;
  const when = (d: string) => new Date(d).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  return (
    <div className="s-insruns" role="group" aria-label={label}>
      {items.map((run, i) => {
        const thumbs = loadInsightsRun(run.id).thumbs.slice(0, 3);
        return (
          <button key={run.id} type="button" className="s-insrun" aria-pressed={run.id === activeId} onClick={() => onPick(run)}>
            <span className="st" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element -- local thumbnails from this browser */}
              {thumbs.length ? thumbs.map((src) => <img key={src.slice(-24)} src={src} alt="" />) : [0, 1, 2].map((k) => <i key={k} />)}
            </span>
            <span>{when(run.createdAt)}{i === 0 && <small>{latest}</small>}</span>
          </button>
        );
      })}
    </div>
  );
}
