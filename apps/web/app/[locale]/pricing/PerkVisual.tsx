import { Ic } from '@/components/home/icons';
import type { PerkKind, PricingMore } from './pricingMore.content';

// A small labelled example of each Pro AI feature, in the page's own look.
// Every one says "Sample": the text is illustrative, never a real result, and
// it carries no figures or real usernames.
type S = PricingMore['sample'];

const PLAN: (keyof S['planTypes'] | null)[] = ['reel', null, 'carousel', null, 'photo', null, 'carousel'];
const RADAR = [30, 52, 78, 60];

function Body({ kind, s }: { kind: PerkKind; s: S }) {
  switch (kind) {
    case 'coach':
      return (
        <>
          <p className="pv-q">{s.coachQ}</p>
          <div className="pv-a"><span className="pv-dot" aria-hidden="true" /><p>{s.coachA}</p></div>
        </>
      );
    case 'check':
      return (
        <>
          <div className="pv-head"><b>{s.checkTitle}</b><span className="pv-badge">{s.checkBadge}</span></div>
          <ul className="pv-list">
            {s.checkFixes.map((f) => <li key={f}><span className="pv-fix" aria-hidden="true" />{f}</li>)}
            <li><span className="pv-ok" aria-hidden="true"><Ic n="check" s={10} /></span>{s.checkOk}</li>
          </ul>
        </>
      );
    case 'voice':
      return (
        <>
          <div className="pv-tabs">{s.voiceTabs.map((t, i) => <span key={t} className={i === 0 ? 'on' : ''}>{t}</span>)}</div>
          <p className="pv-quote">{s.voiceText}</p>
        </>
      );
    case 'plan':
      return (
        <div className="pv-week">
          {s.planDays.map((d, i) => {
            const t = PLAN[i];
            return <div key={d} className={t ? 'on' : ''}><span>{d}</span>{t && <b>{s.planTypes[t]}</b>}</div>;
          })}
        </div>
      );
    case 'left':
      return (
        <>
          <div className="pv-head"><b>{s.leftTitle}</b></div>
          {['@ana•••', '@lens•••', '@studio•••'].map((h) => (
            <div key={h} className="pv-row"><span className="pv-av" aria-hidden="true">{h.charAt(1).toUpperCase()}</span><span className="pv-h">{h}</span><span className="pv-gone">{s.leftTag}</span></div>
          ))}
        </>
      );
    case 'radar':
      return (
        <>
          <div className="pv-head"><b>{s.radarTitle}</b></div>
          <div className="pv-chart">
            <span className="pv-y">{s.radarY}</span>
            <div className="pv-bars" aria-hidden="true">{RADAR.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
            <div className="pv-x">{s.radarX.map((x) => <span key={x}>{x}</span>)}</div>
          </div>
        </>
      );
  }
}

export function PerkVisual({ kind, s }: { kind: PerkKind; s: S }) {
  return (
    <figure className={`pv pv-${kind}`}>
      <Body kind={kind} s={s} />
    </figure>
  );
}
