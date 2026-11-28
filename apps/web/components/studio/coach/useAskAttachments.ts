'use client';

import { useCallback, useMemo, useState } from 'react';
import { AI_CHAT_LIMITS, type AiChatAttachments, type AiInsights } from '@ig-tracker/core';
import { prepareCover } from '@/app/[locale]/coach/coverImage';
import { useSnapshotList, type SnapshotRecord } from '@/hooks/useSnapshots';
import { useSampleOn } from '@/lib/sample/sampleMode';
import { getSampleRecords } from '@/lib/sample/sampleSnapshot';
import { PLATFORM_NAME, snapshotPlatform, type Platform } from '@/lib/platform';
import { checkSummary, fitsContext, goalSummary, insightsSummary, planSummary, radarSummary, reportSummary, type AskContextItem } from '@/lib/askContext';
import { getAskAttachContent } from './askAttach.content';

export interface AskPhoto { url: string; thumb: string }

// Photos are shrunk in the browser until they fit the server's per-photo limit.
async function shrink(file: File): Promise<string | null> {
  for (const [side, q] of [[1024, 0.8], [800, 0.72], [600, 0.65]] as const) {
    const url = await prepareCover(file, side, q).catch(() => null);
    if (url && url.length <= AI_CHAT_LIMITS.imageChars) return url;
  }
  return null;
}

const getJson = async <T,>(url: string): Promise<T | null> => {
  const r = await fetch(url, { cache: 'no-store' }).catch(() => null);
  return r?.ok ? ((await r.json()) as T) : null;
};

// What the member has attached to the next question in Ask coach.
export function useAskAttachments(userId: string | null, platform: Platform, locale: string) {
  const t = getAskAttachContent(locale);
  const sample = useSampleOn();
  const saved = useSnapshotList(userId);
  const exports: SnapshotRecord[] = useMemo(() => (sample ? getSampleRecords() : saved), [sample, saved]);
  const [photos, setPhotos] = useState<AskPhoto[]>([]);
  const [context, setContext] = useState<AskContextItem[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const date = (sec: number) => new Date(sec * 1000).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });

  const addContext = useCallback((item: AskContextItem) => {
    if (!item.text.trim()) { setNote(t.nothing); return; }
    setContext((cur) => {
      const next = [...cur.filter((c) => c.label !== item.label), item];
      if (!fitsContext(next)) { setNote(t.tooMuch); return cur; }
      setNote(null);
      return next;
    });
  }, [t]);

  const addPhotos = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const room = AI_CHAT_LIMITS.images - photos.length;
    if (room <= 0) { setNote(t.maxPhotos); return; }
    const picked = [...files].filter((f) => f.type.startsWith('image/')).slice(0, room);
    const out: AskPhoto[] = [];
    for (const f of picked) { const url = await shrink(f); if (url) out.push({ url, thumb: URL.createObjectURL(f) }); }
    setPhotos((cur) => [...cur, ...out].slice(0, AI_CHAT_LIMITS.images));
    setNote(files.length > room ? t.maxPhotos : null);
  }, [photos.length, t]);

  const addReport = useCallback((rec: SnapshotRecord) => {
    const p = snapshotPlatform(rec.data);
    const prev = exports.filter((e) => snapshotPlatform(e.data) === p && e.data.exportedAt < rec.data.exportedAt).sort((a, b) => b.data.exportedAt - a.data.exportedAt)[0];
    addContext({ kind: 'report', label: t.labels.report(PLATFORM_NAME[p], date(rec.data.exportedAt)), text: reportSummary(rec.data, prev?.data ?? null) });
  }, [exports, addContext, t]); // eslint-disable-line react-hooks/exhaustive-deps

  const latestOf = (p: Platform) => exports.filter((e) => snapshotPlatform(e.data) === p).sort((a, b) => b.data.exportedAt - a.data.exportedAt)[0];
  const add = useCallback(async (kind: 'plan' | 'goal' | 'insights' | 'check' | 'radar') => {
    if (kind === 'radar') { const rec = latestOf(platform); addContext({ kind, label: t.labels.radar(PLATFORM_NAME[platform]), text: rec ? radarSummary(rec.data) : '' }); return; }
    if (kind === 'plan') { const j = await getJson<{ plan: { data: Parameters<typeof planSummary>[0]; calendar: Parameters<typeof planSummary>[1] } | null }>('/api/ai/content?kind=plan'); addContext({ kind, label: t.labels.plan, text: planSummary(j?.plan?.data ?? null, j?.plan?.calendar ?? []) }); return; }
    if (kind === 'goal') { const j = await getJson<Parameters<typeof goalSummary>[0]>(`/api/ai/goal?platform=${platform}`); addContext({ kind, label: t.labels.goal(PLATFORM_NAME[platform]), text: goalSummary(j) }); return; }
    if (kind === 'insights') { const j = await getJson<{ items: { data: AiInsights }[] }>('/api/ai/content?kind=insights'); addContext({ kind, label: t.labels.insights, text: insightsSummary(j?.items?.[0]?.data ?? null) }); return; }
    const j = await getJson<{ items: Parameters<typeof checkSummary>[0] }>('/api/ai/content');
    addContext({ kind, label: t.labels.check, text: checkSummary(j?.items ?? []) });
  }, [platform, addContext, t]); // eslint-disable-line react-hooks/exhaustive-deps

  const removePhoto = (i: number) => setPhotos((cur) => { URL.revokeObjectURL(cur[i]?.thumb ?? ''); return cur.filter((_, k) => k !== i); });
  const removeContext = (label: string) => setContext((cur) => cur.filter((c) => c.label !== label));
  const clear = () => { photos.forEach((p) => URL.revokeObjectURL(p.thumb)); setPhotos([]); setContext([]); setNote(null); };
  const payload: AiChatAttachments | undefined = photos.length || context.length ? { images: photos.map((p) => p.url), context } : undefined;

  return { exports, photos, context, note, addPhotos, addReport, add, removePhoto, removeContext, clear, payload, date };
}
