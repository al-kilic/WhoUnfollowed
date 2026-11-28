import { contentStats, exportContentMoments, exportMoments, insightsStats, voiceStats, type ContentStats, type ExportInsights, type InsightsStats, type Moment, type VoiceStats } from '@ig-tracker/core';
import { buildLedger, type Ledger } from '@/lib/ai/ledger';
import type { NoteView, LearnedWeek } from '@/lib/ai/notesView';
import { getSampleContent } from './sampleContent';
import { SAMPLE_EXPORTS, SAMPLE_EXPORTED_AT, SAMPLE_FLOW, getSampleSnapshots } from './sampleSnapshot';
import { getSampleCoach } from './coach';

// Memory v2 (phase 2E): what Inês's coach knows and learned, for sample mode.
// Same shapes as GET /api/ai/notes, /api/ai/learned and /api/ai/moments, so
// the memory pages can show them without a request. Every number agrees with
// the rest of her sample: Tue, Thu and Sat posts, the Oct 22 carousel (+52),
// a quiet July and August, 32% of followers arriving on a Thursday.

type L = 'en' | 'es' | 'pt';
const lang = (l: string): L => (l === 'es' || l === 'pt' ? l : 'en');
const iso = (d: string) => new Date(`${d}T12:00:00Z`).toISOString();
const id = (n: number) => `5a3e1e00-0000-4000-8000-${String(n).padStart(12, '0')}`;

type Seed = { n: number; type: string; source: string; at: string; origin: 'user' | 'coach' | 'code'; importance: number; confidence: number; pinned?: boolean; status?: string; tags?: string[]; body: Record<L, string>; example?: { before: string; after: string } };

const SEEDS: Seed[] = [
  { n: 1, type: 'fact', source: 'user', at: '2026-02-23', origin: 'user', importance: 5, confidence: 1, pinned: true, body: { en: 'Film photographer in Lisbon. Shoots Portra 400 and HP5.', es: 'Fotógrafa analógica en Lisboa. Dispara Portra 400 y HP5.', pt: 'Fotógrafa analógica em Lisboa. Fotografa com Portra 400 e HP5.' } },
  { n: 2, type: 'goal', source: 'chat', at: '2026-11-20', origin: 'user', importance: 5, confidence: 1, pinned: true, body: { en: 'Wants 2,000 followers. September 2027 is the honest date, not March.', es: 'Quiere 2.000 seguidores. Septiembre de 2027 es la fecha realista, no marzo.', pt: 'Quer 2.000 seguidores. Setembro de 2027 é a data realista, não março.' } },
  { n: 3, type: 'what_worked', source: 'export', at: '2026-11-20', origin: 'code', importance: 4, confidence: 0.8, tags: ['format:carousel'], body: { en: 'Carousels bring about 42 new followers a post, 2.2x your average (2 posts).', es: 'Los carruseles traen unos 42 seguidores nuevos por publicación, 2.2x tu media (2 publicaciones).', pt: 'Os carrosséis trazem uns 42 seguidores novos por post, 2.2x a sua média (2 posts).' } },
  { n: 4, type: 'what_worked', source: 'check', at: '2026-10-25', origin: 'coach', importance: 4, confidence: 0.8, tags: ['format:carousel', 'topic:teaching'], body: { en: 'Teaching carousels (problem, cause, fix) bring the most followers: 52 after Oct 22.', es: 'Los carruseles que enseñan (problema, causa, solución) traen más seguidores: 52 tras el 22 de oct.', pt: 'Carrosséis que ensinam (problema, causa, solução) trazem mais seguidores: 52 depois de 22 de out.' } },
  { n: 5, type: 'what_didnt', source: 'export', at: '2026-11-20', origin: 'code', importance: 3, confidence: 0.8, tags: ['format:photo'], body: { en: 'Single photos bring about 4 new followers a post, well under your average (2 posts).', es: 'Las fotos sueltas traen unos 4 seguidores nuevos por publicación, muy por debajo de tu media (2 publicaciones).', pt: 'As fotos únicas trazem uns 4 seguidores novos por post, bem abaixo da sua média (2 posts).' } },
  { n: 6, type: 'like', source: 'signals', at: '2026-11-12', origin: 'code', importance: 4, confidence: 0.7, tags: ['tone:short'], body: { en: 'Prefers short captions: picked the shortest option 4 times out of 5.', es: 'Prefiere textos cortos: eligió la opción más corta 4 de 5 veces.', pt: 'Prefere legendas curtas: escolheu a opção mais curta 4 de 5 vezes.' }, example: { before: 'This roll taught me more about light than any book I have read this year.', after: 'This roll taught me more than a book.' } },
  { n: 7, type: 'dislike', source: 'signals', at: '2026-11-21', origin: 'code', importance: 4, confidence: 0.7, tags: ['hashtags'], body: { en: 'Cuts broad hashtags like #photography from drafts.', es: 'Quita hashtags genéricos como #photography de los borradores.', pt: 'Corta hashtags genéricas como #photography dos rascunhos.' }, example: { before: '#film #35mm #photography #travel #lisbon', after: '#film #35mm #lisbon' } },
  { n: 8, type: 'voice', source: 'draft', at: '2026-11-03', origin: 'coach', importance: 3, confidence: 0.7, body: { en: 'Writes short first-person lines about light and waiting.', es: 'Escribe frases cortas en primera persona sobre la luz y la espera.', pt: 'Escreve frases curtas em primeira pessoa sobre luz e espera.' } },
  { n: 9, type: 'audience', source: 'read', at: '2026-11-20', origin: 'coach', importance: 4, confidence: 0.8, tags: ['time:thursday'], body: { en: '32% of followers found her on a Thursday, the day her carousels go out.', es: 'El 32% de sus seguidores la encontró un jueves, el día de sus carruseles.', pt: '32% dos seguidores a acharam numa quinta, o dia dos carrosséis.' } },
  { n: 10, type: 'audience', source: 'read', at: '2026-11-20', origin: 'coach', importance: 3, confidence: 0.7, body: { en: 'Nobody who arrived with the autumn carousels has left.', es: 'Nadie que llegó con los carruseles de otoño se ha ido.', pt: 'Ninguém que chegou com os carrosséis de outono saiu.' } },
  { n: 11, type: 'context', source: 'read', at: '2026-11-20', origin: 'coach', importance: 3, confidence: 0.8, body: { en: 'Posted once in July and August 2026. The quiet months, not the posts, cost followers.', es: 'Publicó una vez en julio y agosto de 2026. Los meses tranquilos, no los posts, costaron seguidores.', pt: 'Postou uma vez em julho e agosto de 2026. Os meses parados, não os posts, custaram seguidores.' } },
  { n: 12, type: 'like', source: 'chat', at: '2026-11-22', origin: 'coach', importance: 3, confidence: 0.7, tags: ['format:reel'], body: { en: 'Wants one short teaching Reel a week, not Reels for their own sake.', es: 'Quiere un Reel corto que enseñe por semana, no Reels porque sí.', pt: 'Quer um Reel curto que ensine por semana, não Reels por Reels.' } },
  { n: 13, type: 'fact', source: 'backfill', at: '2026-06-18', origin: 'coach', importance: 2, confidence: 0.4, status: 'faded', body: { en: 'Posts at 9 a.m.', es: 'Publica a las 9 de la mañana.', pt: 'Posta às 9 da manhã.' } },
  { n: 14, type: 'photo', source: 'insights', at: '2026-11-15', origin: 'coach', importance: 3, confidence: 0.7, tags: ['light:blue-hour'], body: { en: 'Blue-hour and warm-light frames get the most saves.', es: 'Las fotos de hora azul y luz cálida son las más guardadas.', pt: 'Fotos da hora azul e de luz quente são as mais salvas.' } },
];

export function getSampleNotes(locale: string): { notes: NoteView[]; disputed: [string, string][] } {
  const l = lang(locale);
  return {
    notes: SEEDS.map((s) => ({
      id: id(s.n), type: s.type, body: s.body[l], examples: s.example ? [s.example] : [], tags: s.tags ?? [], source: s.source, sourceAt: iso(s.at),
      origin: s.origin, confidence: s.confidence, importance: s.importance, pinned: !!s.pinned, status: s.status ?? 'active', createdAt: iso(s.at), lastConfirmedAt: iso(s.at),
    })),
    disputed: [],
  };
}

const FADING: Record<L, (b: string) => string> = { en: (b) => `Fading: "${b}". Keep it?`, es: (b) => `Se está olvidando: "${b}". ¿Lo mantienes?`, pt: (b) => `Está sumindo: "${b}". Quer manter?` };

// One weekly note: the week of her Nov 20 export.
export function getSampleLearned(locale: string): { weeks: LearnedWeek[] } {
  const l = lang(locale);
  const body = (n: number) => SEEDS.find((s) => s.n === n)!.body[l];
  return {
    weeks: [{
      weekKey: '2026-W47',
      lines: [
        { kind: 'learned', text: body(7), noteId: id(7) },
        { kind: 'confirmed', text: body(3), noteId: id(3) },
        { kind: 'learned', text: body(9), noteId: id(9) },
        { kind: 'fading', text: FADING[l](body(13)), noteId: id(13) },
      ],
      seenAt: null,
    }],
  };
}

export function getSampleMoments(): { moments: { platform: string; kind: string; at: string; params: Record<string, number | string> }[] } {
  const all = [...exportMoments(getSampleSnapshots()), ...exportContentMoments(getSampleContentStats(), getSampleInsights())];
  return { moments: all.map((m: Moment) => ({ platform: 'instagram', ...m })).sort((a, b) => b.at.localeCompare(a.at)) };
}

// The six posts she logged, against her three exports.
export function getSampleLedger(): Ledger {
  const posted = getSampleCoach('en').posted;
  return buildLedger(
    posted.map((p) => ({ format: p.format, topic: p.title, postedAt: new Date(p.postedAt), results: JSON.stringify(p.results) })),
    SAMPLE_EXPORTS.map((t, i) => ({ exportedAt: t, followers: SAMPLE_FLOW.followers[i]! })),
  );
}

export function getSampleContentStats(): ContentStats {
  return contentStats(getSampleContent(), { now: SAMPLE_EXPORTED_AT });
}

export function getSampleVoice(): VoiceStats {
  const items = getSampleContent().filter((i) => i.date >= SAMPLE_EXPORTED_AT - 365 * 86_400).slice(0, 12);
  return voiceStats(items.map((i) => i.caption));
}

// Instagram's own numbers for Inês, as her full export would hold them: the
// last ten posts with reach (carousels do best), three stories a week for two
// years (reach drifting down lately), and her last 90 days. Fixed numbers, no
// randomness, so the sample reads the same every time.
export function getSampleInsights(): InsightsStats {
  const now = SAMPLE_EXPORTED_AT;
  const content = getSampleContent();
  const base: Record<string, number> = { carousel: 820, photo: 430, reel: 610, video: 380 };
  const posts = content.slice(0, 10).map((c, k) => {
    const reach = base[c.format]! + ((k * 37) % 90);
    return { at: c.date, kind: c.format === 'reel' ? 'reel' as const : 'post' as const, reach, impressions: Math.round(reach * 1.2), plays: c.format === 'reel' ? Math.round(reach * 1.4) : null,
      likes: Math.round(reach * 0.11), comments: 3 + (k % 4), saves: c.format === 'carousel' ? 14 + (k % 5) : 3 + (k % 3), shares: 1 + (k % 3), follows: c.format === 'carousel' ? 9 + (k % 4) : 2 + (k % 2), profileVisits: 6 + (k % 5) };
  });
  const stories = Array.from({ length: 312 }, (_, k) => {
    const at = now - Math.floor(k * (7 / 3) * 86_400) - 3_600 * (k % 5);
    const reach = Math.round((k < 39 ? 150 : 210) + ((k * 13) % 30));
    return { at, reach, impressions: reach + 8, forward: Math.round(reach * 0.7), back: 3, next: 12, exited: Math.round(reach * (k < 39 ? 0.31 : 0.2)), replies: k % 6 === 0 ? 2 : 0, shares: 0, profileVisits: k % 3 === 0 ? 2 : 1 };
  });
  const followers = SAMPLE_FLOW.followers[SAMPLE_FLOW.followers.length - 1]!;
  const ins: ExportInsights = {
    posts, stories, lives: 0,
    account: {
      range: 'Aug 25 - Nov 22', followers, followersDeltaPct: 3.1, follows: 214, unfollows: 121,
      reached: 9_800, reachedDeltaPct: -6.4, followerReachPct: 88, nonFollowerReachPct: 12,
      impressions: 41_000, profileVisits: 1_350, linkTaps: 42, interactions: 4_100, interactionsDeltaPct: 4.2,
      postInteractions: 2_600, storyInteractions: 1_200, reelsInteractions: 300, engaged: 610, engagedNonFollowerPct: 9.5,
      weekdayActivity: [1_020, 1_050, 1_080, 1_390, 1_100, 1_060, 900],
      ages: [{ bucket: '18-24', pct: 22.1 }, { bucket: '25-34', pct: 47.3 }, { bucket: '35-44', pct: 19.8 }, { bucket: '45-54', pct: 7.2 }],
      menPct: 46.5, womenPct: 53.5,
      countries: [{ name: 'Portugal', pct: 41.2 }, { name: 'Brazil', pct: 14.6 }, { name: 'Spain', pct: 6.9 }],
      cities: [{ name: 'Lisbon', pct: 24.3 }, { name: 'Porto', pct: 7.8 }, { name: 'São Paulo', pct: 4.1 }],
    },
  };
  return insightsStats(ins, content, { now });
}
