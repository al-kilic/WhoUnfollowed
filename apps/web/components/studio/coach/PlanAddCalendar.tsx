'use client';

import { BellRing, CalendarPlus, Download } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getCoachContent } from '@/app/[locale]/coach/content';
import { localizedPathname } from '@/i18n/localizedPathname';
import { buildIcs, googleCalendarLink, planDayAt, type CalEvent } from '@/lib/planIcs';
import { useStudio } from '../StudioContext';
import { getPlanContent } from './plan.content';
import { DAY_MS, type Item } from './PlanCalendar';

// Plan > Add to calendar: the whole plan as one .ics file, or one post as a
// Google Calendar link or .ics. Built here in the browser; nothing is sent.

function useEvents(planId: string, start: Date) {
  const { locale, coach } = useStudio();
  const p = getPlanContent(locale);
  const fmt = getCoachContent(locale).formats;
  const time = coach.state?.prefs?.bestTime ?? null;
  const url = typeof window === 'undefined' ? '' : `${window.location.origin}${localizedPathname('/app/plan', locale)}`;
  return (it: Item): CalEvent => ({
    uid: `${planId}-${it.day}@whounfollowed.co`,
    title: `${p.calTitle(fmt[it.format])} · ${it.idea.length > 60 ? `${it.idea.slice(0, 59).trimEnd()}…` : it.idea}`,
    description: [it.idea, it.hook && `"${it.hook}"`].filter(Boolean).join('\n'),
    url,
    start: planDayAt(start, it.day, time),
  });
}

function download(events: CalEvent[], name: string) {
  const u = URL.createObjectURL(new Blob([buildIcs(events)], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = u; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}

// Every post still to come (not posted, today or later).
export function AddPlanToCalendar({ planId, start, items }: { planId: string; start: Date; items: Item[] }) {
  const { locale } = useStudio();
  const p = getPlanContent(locale);
  const toEvent = useEvents(planId, start);
  const today = Math.floor((Date.now() - start.getTime()) / DAY_MS);
  const upcoming = items.filter((i) => !i.posted && i.day >= today);
  return (
    <button type="button" className="s-btn sec" disabled={!upcoming.length} title={upcoming.length ? p.calNote : p.calNone}
      onClick={() => download(upcoming.map(toEvent), 'posting-plan.ics')}>
      <CalendarPlus size={14} />{p.calAll}
    </button>
  );
}

export function AddPostToCalendar({ planId, start, item }: { planId: string; start: Date; item: Item }) {
  const { locale, coach } = useStudio();
  // The posting-day email is the other way to be reminded; offer it while it's off.
  const emailOff = coach.state?.prefs ? !coach.state.prefs.postingReminder : false;
  const p = getPlanContent(locale);
  const e = useEvents(planId, start)(item);
  return (
    <div className="s-col" style={{ gap: 6 }}>
      <span className="s-lab">{p.calPost}</span>
      <div className="s-row" style={{ flexWrap: 'wrap', gap: 8 }}>
        <a className="s-btn sec xs" href={googleCalendarLink(e)} target="_blank" rel="noopener noreferrer"><CalendarPlus size={13} />{p.calGoogle}</a>
        <button type="button" className="s-btn sec xs" onClick={() => download([e], `post-${item.day + 1}.ics`)}><Download size={13} />{p.calIcs}</button>
      </div>
      {emailOff && <Link href="/app/you#calendar" className="s-lnk" style={{ fontSize: 13 }}><BellRing size={12} />{p.remindEmail}</Link>}
    </div>
  );
}
