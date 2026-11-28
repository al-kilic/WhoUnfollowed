import type { AiLocale } from './prompts';
import type { NewNote } from './noteMath';

// Memory v2 (phase 2B): turns what members do with answers (signals) into
// notes, by fixed rules. Pure and deterministic; no model call. The notes
// carry real examples (before and after), so the coach can copy the taste.
// Spec section 3.

export interface SignalRow {
  kind: string;
  action: string;
  payload: string;
  createdAt: Date;
}

interface Diff { lengthDelta: number; emojiDelta: number; hashtagDelta: number; removed: string[] }
type Payload = { text?: string; before?: string; after?: string; up?: boolean; chip?: string | null; diff?: Diff };

export interface Proposal {
  // Stable key per rule, so a rule confirms its own note instead of adding twice.
  rule: string;
  note: NewNote;
}

export interface LearnResult {
  proposals: Proposal[];
  // Lower the confidence of voice notes (two "not my voice" thumbs in a week).
  lowerVoice: boolean;
}

const T: Record<AiLocale, {
  short: string; hashtags: string; emojis: string; trims: string; phrase: (p: string) => string; tooLong: string; generic: string; hooks: string;
}> = {
  en: {
    short: 'Prefers short, one-line captions', hashtags: 'Removes hashtags from drafts', emojis: 'Cuts emojis from drafts',
    trims: 'Trims drafts to be shorter', phrase: (p) => `Doesn't say "${p}"`, tooLong: 'Finds long answers too long',
    generic: 'Wants specific suggestions, not generic ones', hooks: 'Often uses the suggested alternative hooks',
  },
  es: {
    short: 'Prefiere textos cortos, de una línea', hashtags: 'Quita los hashtags de los borradores', emojis: 'Quita los emojis de los borradores',
    trims: 'Acorta los borradores', phrase: (p) => `No dice "${p}"`, tooLong: 'Le parecen largas las respuestas largas',
    generic: 'Quiere sugerencias concretas, no genéricas', hooks: 'Suele usar los ganchos alternativos sugeridos',
  },
  pt: {
    short: 'Prefere legendas curtas, de uma linha', hashtags: 'Tira as hashtags dos rascunhos', emojis: 'Tira os emojis dos rascunhos',
    trims: 'Encurta os rascunhos', phrase: (p) => `Não diz "${p}"`, tooLong: 'Acha longas as respostas longas',
    generic: 'Quer sugestões específicas, não genéricas', hooks: 'Costuma usar os ganchos alternativos sugeridos',
  },
};

const parse = (s: string): Payload => { try { return JSON.parse(s) as Payload; } catch { return {}; } };
const SHORT_CHARS = 100;
const WEEK = 7 * 86_400_000;

// Looks at the member's recent signals (newest first) and proposes notes.
export function learnFromSignals(signals: SignalRow[], locale: AiLocale, now: Date): LearnResult {
  const t = T[locale];
  const rows = [...signals].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((s) => ({ ...s, p: parse(s.payload) }));
  const picks = rows.filter((r) => r.kind === 'draft_pick').slice(0, 5);
  const edits = rows.filter((r) => r.kind === 'draft_edit' && r.p.diff);
  const thumbsDown = rows.filter((r) => r.kind === 'thumb' && r.p.up === false && now.getTime() - r.createdAt.getTime() <= WEEK);
  const hooks = rows.filter((r) => r.kind === 'hook_used');
  const out: Proposal[] = [];
  const ex = (rs: typeof rows) => rs.slice(0, 3).map((r) => (r.p.before || r.p.after ? { before: (r.p.before ?? '').slice(0, 300), after: (r.p.after ?? '').slice(0, 300) } : { text: (r.p.text ?? '').slice(0, 300) }));

  // 3 of the last 5 picked options are short.
  const shortPicks = picks.filter((r) => (r.p.text ?? '').length > 0 && (r.p.text ?? '').length <= SHORT_CHARS);
  if (picks.length >= 3 && shortPicks.length >= 3) {
    out.push({ rule: 'short_captions', note: { type: 'like', body: t.short, examples: ex(shortPicks), tags: ['tone:short'], source: 'signals', origin: 'code', confidence: 0.7, importance: 4 } });
  }
  const hashtagEdits = edits.filter((r) => r.p.diff!.hashtagDelta < 0);
  if (hashtagEdits.length >= 2) {
    out.push({ rule: 'no_hashtags', note: { type: 'dislike', body: t.hashtags, examples: ex(hashtagEdits), tags: ['hashtags'], source: 'signals', origin: 'code', confidence: 0.7, importance: 4 } });
  }
  const emojiEdits = edits.filter((r) => r.p.diff!.emojiDelta < 0);
  if (emojiEdits.length >= 2) {
    out.push({ rule: 'no_emojis', note: { type: 'dislike', body: t.emojis, examples: ex(emojiEdits), tags: ['emoji'], source: 'signals', origin: 'code', confidence: 0.7, importance: 4 } });
  }
  const trims = edits.filter((r) => r.p.diff!.lengthDelta <= -20);
  if (trims.length >= 2) {
    out.push({ rule: 'trims', note: { type: 'like', body: t.trims, examples: ex(trims), tags: ['tone:short'], source: 'signals', origin: 'code', confidence: 0.6, importance: 3 } });
  }
  // The same phrase removed in two edits.
  const removed = new Map<string, number>();
  for (const r of edits) for (const ph of new Set(r.p.diff!.removed.map((x) => x.trim().toLowerCase()).filter((x) => x.length >= 4))) removed.set(ph, (removed.get(ph) ?? 0) + 1);
  for (const [ph, n] of removed) {
    if (n >= 2) out.push({ rule: `phrase:${ph}`, note: { type: 'dislike', body: t.phrase(ph.slice(0, 60)), tags: ['phrase'], source: 'signals', origin: 'code', confidence: 0.7, importance: 4 } });
  }
  const chips = (c: string) => thumbsDown.filter((r) => r.p.chip === c).length;
  if (chips('too_long') >= 2) out.push({ rule: 'too_long', note: { type: 'dislike', body: t.tooLong, tags: ['length'], source: 'signals', origin: 'code', confidence: 0.6, importance: 3 } });
  if (chips('too_generic') >= 2) out.push({ rule: 'too_generic', note: { type: 'dislike', body: t.generic, tags: ['specific'], source: 'signals', origin: 'code', confidence: 0.6, importance: 4 } });
  if (hooks.length >= 3) out.push({ rule: 'alt_hooks', note: { type: 'like', body: t.hooks, examples: ex(hooks), tags: ['hook'], source: 'signals', origin: 'code', confidence: 0.5, importance: 2 } });

  return { proposals: out, lowerVoice: chips('not_my_voice') >= 2 };
}
