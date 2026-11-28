'use client';

import { useState } from 'react';
import type { AiRead } from '@ig-tracker/core';
import { Ban, CalendarDays, ChevronDown, ChevronUp, Gauge, PenLine, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useStudio } from '../StudioContext';
import { getStudioCoachContent } from './studioCoach.content';
import { getTodayContent } from './today.content';
import { CoachSeen, type Seen } from './CoachSeen';

// The coach's read: the headline and two lines, the rest on request.
export function ReadBody({ read, seen }: { read: AiRead; seen?: Seen | null | undefined }) {
  const { locale } = useStudio();
  const k = getStudioCoachContent(locale).today;
  const t = getTodayContent(locale);
  const [open, setOpen] = useState(false);
  return (
    <>
      <span className="s-lab s-row" style={{ gap: 6, borderTop: '1px solid var(--line)', paddingTop: 14 }}><Sparkles size={13} style={{ color: 'var(--accent)' }} />{t.coachRead}</span>
      <h3 style={{ fontSize: 16, letterSpacing: '-.01em', lineHeight: 1.3, fontWeight: 600, margin: 0 }}>{read.headline}</h3>
      {open ? (
        <>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 4, color: 'var(--mute)', fontSize: 14 }}>{read.happening.map((h) => <li key={h}>{h}</li>)}</ul>
          <div className="s-grid s-g2" style={{ gap: 12 }}>
            <div className="s-row" style={{ alignItems: 'flex-start', gap: 10 }}>
              <span className="s-bic tone-rose"><Ban size={15} /></span>
              <div><div className="s-lab">{k.stop}</div><b style={{ fontWeight: 600 }}>{read.stop.what}</b><div className="s-sub-t">{read.stop.why}</div></div>
            </div>
            <div className="s-row" style={{ alignItems: 'flex-start', gap: 10 }}>
              <span className="s-bic tone-green"><Sparkles size={15} /></span>
              <div><div className="s-lab">{k.tryNext}</div>{read.try.map((x) => <div key={x.what} style={{ marginBottom: 6 }}><b style={{ fontWeight: 600 }}>{x.what}</b><div className="s-sub-t">{x.why}</div>
                <Link href={`/app/create?topic=${encodeURIComponent(x.what.slice(0, 300))}`} className="s-lnk" style={{ fontSize: 13 }}><PenLine size={12} />{t.loop.write}</Link></div>)}</div>
            </div>
          </div>
          <div className="s-row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <Link href="/app/create/check" className="s-btn sec xs"><Gauge size={13} />{t.loop.check}</Link>
            <Link href="/app/plan" className="s-btn sec xs"><CalendarDays size={13} />{t.loop.plan}</Link>
          </div>
          <CoachSeen seen={seen} />
        </>
      ) : <p className="s-sub-t s-clamp2" style={{ margin: 0, fontSize: 14 }}>{read.happening.join(' ')}</p>}
      <button type="button" className="s-lnk" style={{ alignSelf: 'flex-start' }} aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? t.hideRead : t.showRead}{open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
    </>
  );
}
