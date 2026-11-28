import type { HomeCopy } from './copy';
import { Ic, type IconName } from './icons';
import { cv } from './cssVars';
import { Link } from '@/i18n/navigation';

// Under the coach: a row of the other Pro AI features (the read runs only when
// a new export is parsed), then the reminders that keep a plan going. All three reminders exist (see lib/ai/postingReminder.ts,
// lib/ai/checkins.ts and lib/reminders).
export function CoachStay({ c }: { c: HomeCopy['coach'] }) {
  const icons = ['bell', 'mail', 'redo'] as const;
  return (
    <div className="wrap">
      <div className="also rv" aria-label={c.also.lab}>
        <span className="lab">{c.also.lab}</span>
        <ul>
          {c.also.items.map(([ic, t], i) => <li key={t} className="al gl" style={cv({ '--k': i })}><Ic n={ic as IconName} s={15} />{t}</li>)}
          <li className="al more" style={cv({ '--k': c.also.items.length })}>{c.also.more}</li>
        </ul>
      </div>
      <div className="stay" aria-label={c.stayLab}>
        <div className="stay-h"><span className="lab">{c.stayLab}</span><b>{c.stayH}</b></div>
        <div className="stay-g">
          {c.stay.map(([b, t, note], i) => (
            <div key={b} className="sti gl" style={cv({ '--k': i })}>
              <span className="sti-i"><Ic n={icons[i]!} s={16} /></span>
              <span className="sti-x"><b>{b}</b><span>{t}</span></span>
              <span className="sti-n"><i />{note}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="cta-row"><Link className="btn pri" href="/pricing">{c.cta}</Link><span>{c.ctaNote}</span></div>
    </div>
  );
}
