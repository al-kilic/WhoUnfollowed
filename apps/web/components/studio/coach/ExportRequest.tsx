'use client';

import { useEffect, useState } from 'react';
import { BellRing, CalendarPlus, Download, ExternalLink, Info } from 'lucide-react';
import { useStudio } from '../StudioContext';
import { getInsightsContent } from './insights.content';

// Step 1 of pulling posts: open Meta's export page with the right choices
// spelled out, then an optional reminder in the member's own calendar
// (a Google Calendar link or an .ics file). Nothing is sent to our server.

const META_DYI = 'https://accountscenter.instagram.com/info_and_permissions/dyi/';
const KEY = 'wu:export-requested-at';
const MIN_H = 2, MAX_H = 48;

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

function icsFile(at: Date, title: string, body: string, url: string): Blob {
  const end = new Date(at.getTime() + 15 * 60_000);
  const esc = (s: string) => s.replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//WhoUnfollowed//Export reminder//EN', 'BEGIN:VEVENT',
    `UID:${Date.now()}-export@whounfollowed.co`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(at)}`, `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(title)}`, `DESCRIPTION:${esc(`${body}\n${url}`)}`, `URL:${url}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(title)}`, 'TRIGGER:PT0M', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ];
  return new Blob([lines.join('\r\n')], { type: 'text/calendar' });
}

export function ExportRequest() {
  const { locale } = useStudio();
  const t = getInsightsContent(locale);
  const [asked, setAsked] = useState<number | null>(null);
  const [hours, setHours] = useState(24);
  useEffect(() => { try { const v = Number(localStorage.getItem(KEY)); if (v > Date.now() - 7 * 86_400_000) setAsked(v); } catch { /* storage blocked */ } }, []);

  const open = () => {
    const now = Date.now();
    setAsked(now);
    try { localStorage.setItem(KEY, String(now)); } catch { /* storage blocked */ }
  };
  const at = new Date((asked ?? Date.now()) + hours * 3_600_000);
  const back = typeof window === 'undefined' ? '' : `${window.location.origin}${window.location.pathname}`;
  const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(t.remindTitle)}&dates=${stamp(at)}/${stamp(new Date(at.getTime() + 15 * 60_000))}&details=${encodeURIComponent(`${t.remindBody}\n${back}`)}`;
  const downloadIcs = () => {
    const u = URL.createObjectURL(icsFile(at, t.remindTitle, t.remindBody, back));
    const a = document.createElement('a');
    a.href = u; a.download = 'instagram-export-reminder.ics'; a.click();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
  };
  const ago = asked ? new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-Math.round((Date.now() - asked) / 3_600_000), 'hour') : '';
  const when = new Intl.DateTimeFormat(locale, { weekday: 'short', hour: 'numeric', minute: '2-digit' }).format(at);

  return (
    <div className="s-col" style={{ gap: 12 }}>
      <ol className="s-exp-steps">{t.pick.map((p) => <li key={p}>{p}</li>)}</ol>
      <div className="s-nextci"><Info size={16} /><span><b style={{ fontWeight: 600 }}>{t.important}</b></span></div>
      <a href={META_DYI} target="_blank" rel="noopener noreferrer" className="s-btn" style={{ alignSelf: 'flex-start' }} onClick={open}><ExternalLink size={14} />{t.openMeta}</a>
      {asked && (
        <div className="s-exp-rem">
          <span className="s-sub-t" style={{ fontSize: 13 }}>{t.requested(ago)}</span>
          <label className="s-row" style={{ gap: 10, flexWrap: 'wrap' }}>
            <BellRing size={15} /><span style={{ fontWeight: 500 }}>{t.remindIn}</span>
            <input type="range" min={MIN_H} max={MAX_H} step={1} value={hours} onChange={(e) => setHours(Number(e.target.value))} aria-valuetext={t.hours(hours)} style={{ flex: '1 1 140px' }} />
            <b style={{ fontWeight: 600, minWidth: 72 }}>{t.hours(hours)}</b>
          </label>
          <span className="s-sub-t" style={{ fontSize: 12.5 }}>{when}</span>
          <div className="s-row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <a href={google} target="_blank" rel="noopener noreferrer" className="s-btn sec xs"><CalendarPlus size={13} />{t.google}</a>
            <button type="button" className="s-btn sec xs" onClick={downloadIcs}><Download size={13} />{t.ics}</button>
          </div>
          <span className="s-sub-t" style={{ fontSize: 12 }}>{t.remindNote}</span>
        </div>
      )}
    </div>
  );
}
