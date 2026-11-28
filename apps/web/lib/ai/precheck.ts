// The rule-based part of Check: fixed criteria counted in code before any
// model sees the draft. Pure and client-safe, so it runs as you type, for
// everyone (no tokens). Pro AI then gets the model's explanation and score,
// which must not contradict these results (see limitOverall).

export type PrecheckState = 'pass' | 'warn' | 'fail';
export type PrecheckSource = 'past' | 'settings' | 'platform';
export type PrecheckId = 'hook_length' | 'caption_limit' | 'question_cta' | 'hashtags' | 'posting_day' | 'format_results';

export interface PrecheckItem {
  id: PrecheckId;
  state: PrecheckState;
  source: PrecheckSource;
  params: Record<string, number | string>;
}

export interface PrecheckInput {
  format: string;
  hook: string;
  caption: string;
  // Posting days from Settings, 0 = Monday.
  postingDays?: readonly number[];
  now?: Date;
  // Results of posts the member logged: the format and new followers after it.
  results?: readonly { format: string; newFollowers: number }[];
}

// Instagram shows about this many characters before "more", and allows 2,200
// characters and 30 hashtags in a caption.
export const HOOK_VISIBLE = 125;
export const CAPTION_MAX = 2200;
export const HASHTAG_MAX = 30;
export const HASHTAG_GOOD = 5;

const CTA = /\?|\b(save|share|comment|tell me|link in bio|follow|dm me|guarda|comparte|comenta|cu[eé]ntame|s[ií]gueme|salva|compartilhe|comente|me conta|me siga)\b/i;

export function precheck(i: PrecheckInput): PrecheckItem[] {
  const out: PrecheckItem[] = [];
  const hook = i.hook.trim();
  out.push({ id: 'hook_length', source: 'platform', params: { length: hook.length, visible: HOOK_VISIBLE },
    state: hook.length === 0 ? 'fail' : hook.length <= HOOK_VISIBLE ? 'pass' : 'warn' });

  const cap = i.caption.trim();
  out.push({ id: 'caption_limit', source: 'platform', params: { length: cap.length, max: CAPTION_MAX },
    state: cap.length > CAPTION_MAX ? 'fail' : cap.length === 0 ? 'warn' : 'pass' });

  out.push({ id: 'question_cta', source: 'platform', params: {}, state: CTA.test(`${hook}\n${cap}`) ? 'pass' : 'warn' });

  const tags = (cap.match(/(^|\s)#[\p{L}\p{N}_]+/gu) ?? []).length;
  out.push({ id: 'hashtags', source: 'platform', params: { count: tags, good: HASHTAG_GOOD, max: HASHTAG_MAX },
    state: tags > HASHTAG_MAX ? 'fail' : tags > HASHTAG_GOOD ? 'warn' : 'pass' });

  const days = [...new Set(i.postingDays ?? [])].filter((d) => d >= 0 && d <= 6).sort();
  if (days.length) {
    const today = ((i.now ?? new Date()).getDay() + 6) % 7;
    const next = days.find((d) => d >= today) ?? days[0]!;
    out.push({ id: 'posting_day', source: 'settings', params: { today, next }, state: days.includes(today) ? 'pass' : 'warn' });
  }

  const res = (i.results ?? []).filter((r) => Number.isFinite(r.newFollowers));
  if (res.length >= 2) {
    const avg = new Map<string, { sum: number; n: number }>();
    for (const r of res) { const a = avg.get(r.format) ?? { sum: 0, n: 0 }; a.sum += r.newFollowers; a.n += 1; avg.set(r.format, a); }
    const means = [...avg].map(([f, a]) => [f, a.sum / a.n] as const).sort((a, b) => b[1] - a[1]);
    const [bestFormat, best] = means[0]!;
    const mine = avg.get(i.format);
    const mean = mine ? mine.sum / mine.n : null;
    out.push({ id: 'format_results', source: 'past',
      params: { best: bestFormat, bestAvg: Math.round(best), mine: mean === null ? -1 : Math.round(mean), posts: res.length },
      state: mean === null ? 'warn' : bestFormat === i.format || mean >= best * 0.8 ? 'pass' : 'warn' });
  }
  return out;
}

// The model's overall score may not say "ready" when a rule failed: each
// failed rule caps it lower. Warnings leave room for judgement.
export function limitOverall(overall: number, items: readonly PrecheckItem[]): number {
  const fails = items.filter((x) => x.state === 'fail').length;
  return fails ? Math.min(overall, 69 - (fails - 1) * 10) : overall;
}

// The rules as plain lines for the model, so it explains them instead of guessing.
export function precheckLines(items: readonly PrecheckItem[]): string {
  return items.map((x) => `- ${x.id}: ${x.state.toUpperCase()} (source: ${x.source}; ${Object.entries(x.params).map(([k, v]) => `${k}=${v}`).join(', ')})`).join('\n');
}
