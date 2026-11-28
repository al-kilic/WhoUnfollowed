'use client';

import type { ContextSources } from '@/lib/ai/coachContext';
import { useStudio } from '../StudioContext';
import { getCoachSeenContent } from './coachSeen.content';

export interface Seen { text: string; sources: ContextSources }

// The source line under a coach answer, built from what was really in the
// context.
export function sourceParts(s: ContextSources, locale: string, t: ReturnType<typeof getCoachSeenContent>): string[] {
  const month = (sec: number) => new Date(sec * 1000).toLocaleDateString(locale, { month: 'short', year: 'numeric' });
  const day = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  return [
    ...(s.exports ? [t.exports(s.exports, s.since ? month(s.since) : '')] : []),
    ...(s.goal ? [t.goal] : []),
    ...(s.posted ? [t.posted(s.posted)] : []),
    ...(s.memory ? [t.memory] : []),
    ...(s.facts ? [t.facts(s.facts)] : []),
    ...(s.brief ? [t.brief(day(s.brief))] : []),
  ];
}

export function CoachSeen({ seen }: { seen: Seen | null | undefined }) {
  const { locale } = useStudio();
  if (!seen) return null;
  const t = getCoachSeenContent(locale);
  const parts = sourceParts(seen.sources, locale, t);
  return (
    <div className="s-seen">
      {parts.length > 0 && <p className="s-seen-src">{t.from} {parts.join(' · ')}</p>}
    </div>
  );
}
