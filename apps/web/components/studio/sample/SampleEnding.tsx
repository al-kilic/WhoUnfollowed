'use client';

import { ArrowRight, CalendarPlus, Download, ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { buildIcs, googleCalendarLink, type CalEvent } from '@/lib/planIcs';
import { trackSample, useSampleStore } from '@/lib/sample/sampleMode';
import { useStudio } from '../StudioContext';
import { getSampleContent } from './sample.content';

const META_EXPORT = 'https://accountscenter.instagram.com/info_and_permissions/dyi/';

// The end of the sample: how to get your own export, plus a reminder to check
// the inbox in 24 hours. The reminder is built in the browser; nothing is sent.
export function SampleEnding() {
  const { locale } = useStudio();
  const t = getSampleContent(locale).end;
  const exit = useSampleStore((s) => s.exit);
  const event = (): CalEvent => ({
    uid: `export-reminder-${Date.now()}@whounfollowed.co`,
    title: t.evTitle,
    description: t.evBody,
    url: 'https://whounfollowed.co/#upload',
    start: new Date(Date.now() + 24 * 3_600_000),
    minutes: 15,
  });
  const ics = () => {
    trackSample('Sample Reminder Added', { via: 'ics' });
    const url = URL.createObjectURL(new Blob([buildIcs([event()])], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'export-reminder.ics'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <section className="s-card s-pad s-sample-end" aria-labelledby="sample-end-t">
      <h2 id="sample-end-t" style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: '-.02em' }}>{t.title}</h2>
      <p className="s-sub-t" style={{ margin: '4px 0 16px', fontSize: 14 }}>{t.sub}</p>
      <ol className="s-sample-steps">
        {t.steps.map(([h, b], i) => (
          <li key={h}><span className="n">{i + 1}</span><span><b>{h}</b><span className="s-sub-t">{b}</span></span></li>
        ))}
      </ol>
      <div className="s-row" style={{ flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
        <a className="s-btn" href={META_EXPORT} target="_blank" rel="noopener noreferrer" onClick={() => trackSample('Sample Export Started')}>
          {t.open}<ExternalLink size={14} />
        </a>
        <Link href="/#upload" className="s-btn sec" onClick={exit}>{t.have}<ArrowRight size={14} /></Link>
      </div>
      <div className="s-sample-remind">
        <span className="s-row" style={{ gap: 6, fontSize: 13, fontWeight: 600 }}><CalendarPlus size={14} />{t.remindT}</span>
        <div className="s-row" style={{ gap: 6, flexWrap: 'wrap' }}>
          <a className="s-btn sec xs" href={googleCalendarLink(event())} target="_blank" rel="noopener noreferrer" onClick={() => trackSample('Sample Reminder Added', { via: 'google' })}>{t.google}</a>
          <button type="button" className="s-btn sec xs" onClick={ics}><Download size={13} />{t.ics}</button>
        </div>
      </div>
    </section>
  );
}
