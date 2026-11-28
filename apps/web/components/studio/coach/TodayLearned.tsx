'use client';

import { useEffect, useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { LearnedLine } from '@/lib/ai/learnedNote';
import { isSampleOn } from '@/lib/sample/sampleMode';
import { getSampleLearned } from '@/lib/sample/learned';
import { useStudio } from '../StudioContext';
import { getLearnedContent } from './todayLearned.content';

// Today: a slim "This week your coach learned N things" line that opens into
// the list. Shows the newest weekly note until it has been opened once. Built
// on the server with no model call (lib/ai/learnedNote.ts); sample visitors
// see Inês's week without a request.
interface Week { weekKey: string; lines: LearnedLine[]; seenAt: string | null }

export function TodayLearned() {
  const { locale, hasProAi } = useStudio();
  const t = getLearnedContent(locale);
  const [week, setWeek] = useState<Week | null>(null);
  const [open, setOpen] = useState(false);
  const [sample] = useState(() => isSampleOn());

  useEffect(() => {
    if (!hasProAi) return;
    if (sample) { setWeek(getSampleLearned(locale).weeks[0] ?? null); return; }
    let alive = true;
    fetch(`/api/ai/learned?locale=${locale}`, { cache: 'no-store' })
      .then((r) => (r.ok ? (r.json() as Promise<{ weeks: Week[] }>) : { weeks: [] }))
      .then((j) => { if (alive) setWeek(j.weeks.find((w) => !w.seenAt) ?? null); })
      .catch(() => undefined);
    return () => { alive = false; };
  }, [hasProAi, locale, sample]);

  if (!week || !week.lines.length) return null;
  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !sample && !week.seenAt) {
      void fetch('/api/ai/learned', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ weekKey: week.weekKey }) }).catch(() => undefined);
    }
  };
  return (
    <section className="s-card s-learned" aria-label={t.title(week.lines.length)}>
      <button type="button" className="s-learned-h" aria-expanded={open} onClick={toggle}>
        <BookOpen size={14} />
        <b>{t.title(week.lines.length)}</b>
        <span className="s-sub-t">{open ? t.close : t.open}</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div className="s-learned-b">
          <ul>
            {week.lines.map((l, i) => (
              <li key={`${l.kind}-${l.noteId ?? i}`}><span className={`s-learned-k k-${l.kind}`}>{t.kinds[l.kind]}</span><span>{l.text}</span></li>
            ))}
          </ul>
          <Link href="/app/you/memory" className="s-lnk">{t.manage}</Link>
        </div>
      )}
    </section>
  );
}
