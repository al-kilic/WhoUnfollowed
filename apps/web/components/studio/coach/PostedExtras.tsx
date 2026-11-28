'use client';

import { useState } from 'react';
import { BellRing, Flame, Sparkles, Target, Trophy } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useStudio } from '../StudioContext';
import { FormatBadge } from './formats';
import { getPostedV2 } from './postedV2.content';
import { bestPost, daysAgo, isFormat, resultsDue, streakWeeks, weekdayAverages, type PostedItem } from './postedMath';
import { ResultForm } from './PostedForms';
import '@/styles/insights.css';

// "How did your reel from 3 days ago do?": the oldest post still waiting for
// its numbers, with the form right there. Later hides it for this visit.
export function PostedNudge({ items, onDone }: { items: PostedItem[]; onDone: () => void }) {
  const { locale } = useStudio();
  const v = getPostedV2(locale);
  const [skipped, setSkipped] = useState<string[]>([]);
  const due = resultsDue(items).filter((x) => !skipped.includes(x.id));
  const it = due[0];
  if (!it) return null;
  const f = isFormat(it.format) ? v.fmt[it.format] : v.fmt.photo;
  return (
    <section className="s-pnudge" aria-live="polite">
      <BellRing size={16} style={{ color: 'var(--accent)' }} aria-hidden="true" />
      <span style={{ flex: '1 1 240px' }}><b>{v.due(f, daysAgo(it))}</b>{it.hook ? <span className="s-sub-t"> “{it.hook}”</span> : null}{due.length > 1 && <span className="s-sub-t"> · {v.dueMore(due.length - 1)}</span>}</span>
      <button type="button" className="s-btn sec xs" onClick={() => setSkipped((s) => [...s, it.id])}>{v.dueSkip}</button>
      <div style={{ flexBasis: '100%' }}><ResultForm key={it.id} item={it} onDone={onDone} /></div>
    </section>
  );
}

// Which weekdays work, the posting streak and the best post, with the way on
// to goals and Photo insights.
export function PostedRhythm({ items }: { items: PostedItem[] }) {
  const { locale } = useStudio();
  const v = getPostedV2(locale);
  const days = weekdayAverages(items);
  const top = Math.max(0, ...days.map((d) => d.avg));
  const topDay = days.find((d) => d.avg === top && d.n > 0);
  const streak = streakWeeks(items);
  const best = bestPost(items);
  return (
    <section className="s-card s-pad s-col" style={{ gap: 14 }}>
      <div><h3 className="s-h3" style={{ margin: 0 }}>{v.rhythm}</h3><span className="s-sub-t" style={{ fontSize: 12.5 }}>{v.rhythmNote}</span></div>
      <div className="s-pweek" role="img" aria-label={topDay ? v.bestDay(v.days[topDay.day]!) : v.rhythm}>
        {days.map((d) => (
          <div key={d.day} className={topDay && d.day === topDay.day ? 'top' : ''}>
            <i style={{ height: `${top > 0 ? Math.max(4, (d.avg / top) * 100) : 4}%` }} />
            <span>{v.days[d.day]}</span>
          </div>
        ))}
      </div>
      {topDay && <span className="s-sub-t" style={{ fontSize: 13 }}>{v.bestDay(v.days[topDay.day]!)}</span>}
      <div className="s-row" style={{ gap: 14, flexWrap: 'wrap', fontSize: 13.5 }}>
        <span className="s-row" style={{ gap: 6 }}><Flame size={15} style={{ color: streak ? 'var(--warn)' : 'var(--faint)' }} />{streak ? v.streak(streak) : v.noStreak}</span>
        {best && <span className="s-row" style={{ gap: 6, minWidth: 0 }}><Trophy size={15} style={{ color: 'var(--accent)' }} />{v.best}: {isFormat(best.format) && <FormatBadge format={best.format} />}<b style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>{best.hook}</b></span>}
      </div>
      <div className="s-row" style={{ gap: 8, flexWrap: 'wrap' }}>
        <Link href="/app/plan/goals" className="s-btn sec xs"><Target size={13} />{v.toGoals}</Link>
        <Link href="/app/plan/insights" className="s-btn sec xs"><Sparkles size={13} />{v.toInsights}</Link>
      </div>
    </section>
  );
}
