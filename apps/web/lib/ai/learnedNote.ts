// Memory v2 (phase 2E): the weekly "what your coach learned" note. Pure, no
// model call: built from that week's memory events and the member's notes.
// Lines: up to 3 things learned or confirmed this week (most important first),
// notes that are fading (keep them?), notes that disagree, and what the member
// told the coach to forget. Spec section 3 (weekly learned note).

export type LearnedKind = 'learned' | 'confirmed' | 'fading' | 'disputed' | 'forgot';
export interface LearnedLine { kind: LearnedKind; text: string; noteId?: string }

export interface LearnedNoteInput {
  notes: { id: string; body: string; type: string; status: string; importance: number; origin: string; createdAt: Date; lastConfirmedAt: Date; evidenceCount: number; contradictsId: string | null }[];
  events: { kind: string; createdAt: Date }[];
  now: Date;
  locale?: 'en' | 'es' | 'pt';
}

const DAY = 86_400_000;

// ISO week key, e.g. "2026-W48". Weeks start on Monday (UTC).
export function weekKey(d: Date): string {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = Date.UTC(t.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((t.getTime() - yearStart) / DAY + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

// Monday 00:00 UTC of the week that contains d.
export function weekStart(d: Date): Date {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  return new Date(t.getTime() - (day - 1) * DAY);
}

const COPY = {
  en: { fading: (b: string) => `Fading: "${b}". Keep it?`, disputed: (a: string, b: string) => `These disagree: "${a}" and "${b}". Which is right?`, forgot: (n: number) => `You asked your coach to forget ${n === 1 ? 'one note' : `${n} notes`}. It won't bring ${n === 1 ? 'it' : 'them'} up again.` },
  es: { fading: (b: string) => `Se está olvidando: "${b}". ¿Lo mantienes?`, disputed: (a: string, b: string) => `No coinciden: "${a}" y "${b}". ¿Cuál es correcta?`, forgot: (n: number) => `Le pediste a tu coach olvidar ${n === 1 ? 'una nota' : `${n} notas`}. No ${n === 1 ? 'la' : 'las'} volverá a mencionar.` },
  pt: { fading: (b: string) => `Está sumindo: "${b}". Quer manter?`, disputed: (a: string, b: string) => `Estas não batem: "${a}" e "${b}". Qual está certa?`, forgot: (n: number) => `Você pediu ao seu coach para esquecer ${n === 1 ? 'uma nota' : `${n} notas`}. Ele não ${n === 1 ? 'a' : 'as'} vai mencionar de novo.` },
} as const;

export function buildLearnedNote(i: LearnedNoteInput): { weekKey: string; lines: LearnedLine[] } {
  const c = COPY[i.locale ?? 'en'];
  const from = weekStart(i.now).getTime();
  // From Monday on. No upper bound: timestamps stored without a time zone can
  // read back a few hours ahead, and nothing after `now` exists anyway.
  const inWeek = (d: Date) => d.getTime() >= from;
  const live = i.notes.filter((n) => n.status === 'active');
  const fresh = live.filter((n) => inWeek(n.createdAt));
  const confirmed = live.filter((n) => !inWeek(n.createdAt) && inWeek(n.lastConfirmedAt) && n.evidenceCount >= 2);
  const top = [...fresh.map((n) => ({ n, kind: 'learned' as const })), ...confirmed.map((n) => ({ n, kind: 'confirmed' as const }))]
    .sort((a, b) => b.n.importance - a.n.importance || (a.kind === b.kind ? 0 : a.kind === 'learned' ? -1 : 1) || b.n.lastConfirmedAt.getTime() - a.n.lastConfirmedAt.getTime() || a.n.id.localeCompare(b.n.id))
    .slice(0, 3)
    .map(({ n, kind }) => ({ kind, text: n.body, noteId: n.id }));
  const fading = i.notes.filter((n) => n.status === 'faded').sort((a, b) => b.importance - a.importance || a.id.localeCompare(b.id)).slice(0, 2)
    .map((n) => ({ kind: 'fading' as const, text: c.fading(n.body), noteId: n.id }));
  const byId = new Map(i.notes.map((n) => [n.id, n]));
  const disputed = i.notes.filter((n) => n.status === 'disputed' && n.contradictsId && byId.has(n.contradictsId)).slice(0, 1)
    .map((n) => ({ kind: 'disputed' as const, text: c.disputed(byId.get(n.contradictsId!)!.body, n.body), noteId: n.id }));
  const forgotN = i.events.filter((e) => e.kind === 'forget' && inWeek(e.createdAt)).length;
  const forgot = forgotN ? [{ kind: 'forgot' as const, text: c.forgot(forgotN) }] : [];
  return { weekKey: weekKey(i.now), lines: [...top, ...fading, ...disputed, ...forgot] };
}
