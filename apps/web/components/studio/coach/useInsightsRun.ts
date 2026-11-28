'use client';

import { useState } from 'react';
import type { AiInsights } from '@ig-tracker/core';
import { postAction } from '@/app/[locale]/coach/api';
import { prepareCover } from '@/app/[locale]/coach/coverImage';
import { getCoachContent } from '@/app/[locale]/coach/content';
import { saveInsightsRun } from '@/lib/insightsThumbs';
import { NO_NUMS, type PostNums } from '@/lib/insightsPick';
import type { AppLocale } from '@/i18n/routing';
import type { Seen } from './CoachSeen';

export interface RunPost { file: File; url: string; place: string; date: string | null; caption: string; nums: PostNums; key?: string | undefined; format?: 'photo' | 'carousel' | undefined }
export interface InsightsShown { id?: string | undefined; data: AiInsights; thumbs: string[]; nums?: PostNums[] | undefined; dates?: (string | null)[] | undefined; seen: Seen | null; keys?: (string | undefined)[] | undefined; captions?: string[] | undefined; formats?: ('photo' | 'carousel' | undefined)[] | undefined }

// Sends the posts once (photos resized here, never stored on the server),
// then keeps small thumbnails, the numbers and dates in this browser so the
// run can be shown again later.
export function useInsightsRun(locale: AppLocale, onSaved: () => void) {
  const c = getCoachContent(locale);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  async function run(posts: RunPost[]): Promise<InsightsShown | null> {
    if (busy || posts.length < 3) return null;
    setBusy(true); setErr(null);
    try {
      const body = await Promise.all(posts.map(async (p) => ({
        photo: await prepareCover(p.file), place: p.place.trim(), date: p.date || null, caption: p.caption.trim(),
        likes: p.nums.likes, comments: p.nums.comments, saves: p.nums.saves, shares: p.nums.shares, reach: p.nums.reach,
      })));
      const res = await postAction<AiInsights>('/api/ai/insights', { posts: body, locale, platform: 'instagram' });
      if (!res.ok) { setErr(c.errors[res.error as keyof typeof c.errors] ?? c.errors.failed); return null; }
      const nums = posts.map((p) => p.nums ?? NO_NUMS);
      const dates = posts.map((p) => p.date);
      void Promise.all(posts.map((p) => prepareCover(p.file, 240, 0.65)))
        .then((thumbs) => { saveInsightsRun(res.logId, { thumbs, nums, dates }); onSaved(); })
        .catch(() => onSaved());
      return { id: res.logId, data: res.data, thumbs: posts.map((p) => p.url), nums, dates, seen: res.seen ?? null, keys: posts.map((p) => p.key), captions: posts.map((p) => p.caption), formats: posts.map((p) => p.format) };
    } catch { setErr(c.errors.failed); return null; } finally { setBusy(false); }
  }
  return { run, busy, err, working: c.working };
}
