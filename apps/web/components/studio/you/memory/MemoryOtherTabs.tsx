'use client';

import { Sparkles } from 'lucide-react';
import { useStudio } from '../../StudioContext';
import { getMemoryContent } from './memory.content';
import { archived, weekStart, type LearnedWeek, type MemNote, type Moment, type NoteOp } from './memoryTypes';
import { NoteRow } from './NoteRow';

const Loading = ({ text }: { text: string }) => <div className="s-pad"><span className="s-shim" style={{ width: '50%' }} aria-label={text} /></div>;

// Timeline: the moments the exports show, newest first.
export function MemoryTimelineTab({ moments }: { moments: Moment[] | undefined }) {
  const { locale } = useStudio();
  const t = getMemoryContent(locale);
  if (moments === undefined) return <Loading text={t.loading} />;
  if (!moments.length) return <p className="s-card s-pad s-sub-t" style={{ margin: 0 }}>{t.timelineEmpty}</p>;
  const label = (at: string) => new Date(`${at.length === 7 ? `${at}-01` : at}T12:00:00Z`).toLocaleDateString(locale, at.length === 7 ? { month: 'long', year: 'numeric' } : { day: 'numeric', month: 'short', year: 'numeric' });
  const sorted = [...moments].sort((a, b) => b.at.localeCompare(a.at));
  return (
    <ol className="s-card s-tl">
      {sorted.map((m) => (
        <li key={`${m.kind}-${m.at}`} className={`k-${m.kind}`}>
          <span className="s-tl-d">{label(m.at)}</span>
          <span>{t.moments[m.kind]?.(m.params) ?? m.kind}</span>
        </li>
      ))}
    </ol>
  );
}

// Learned: one short note a week, newest first.
export function MemoryLearnedTab({ weeks }: { weeks: LearnedWeek[] | undefined }) {
  const { locale } = useStudio();
  const t = getMemoryContent(locale);
  if (weeks === undefined) return <Loading text={t.loading} />;
  if (!weeks.length) return <p className="s-card s-pad s-sub-t" style={{ margin: 0 }}>{t.learnedEmpty}</p>;
  return (
    <div className="s-col" style={{ gap: 12 }}>
      {[...weeks].sort((a, b) => b.weekKey.localeCompare(a.weekKey)).map((w) => (
        <section key={w.weekKey} className="s-card s-pad s-col" style={{ gap: 8 }}>
          <span className="s-row" style={{ gap: 8 }}><Sparkles size={14} style={{ color: 'var(--accent)' }} /><b style={{ fontWeight: 600 }}>{t.week(weekStart(w.weekKey)?.toLocaleDateString(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }) ?? w.weekKey)}</b>{!w.seenAt && <span className="s-badge">{t.newWeek}</span>}</span>
          <ul className="s-learned">{w.lines.map((l, i) => <li key={i} className={`k-${l.kind}`}>{l.text}</li>)}</ul>
        </section>
      ))}
    </div>
  );
}

// Archive: notes the coach no longer uses. Still here, still editable.
export function MemoryArchiveTab({ notes, act }: { notes: MemNote[]; act: (op: NoteOp) => Promise<boolean> }) {
  const { locale } = useStudio();
  const t = getMemoryContent(locale);
  const list = archived(notes);
  return (
    <section className="s-card">
      <div className="s-hd"><span className="s-sub-t" style={{ fontSize: 12.5 }}>{t.archiveBody}</span></div>
      <div className="s-notes">{list.length ? list.map((n) => <NoteRow key={n.id} n={n} act={act} />) : <p className="s-pad s-sub-t" style={{ margin: 0 }}>{t.archiveEmpty}</p>}</div>
    </section>
  );
}
