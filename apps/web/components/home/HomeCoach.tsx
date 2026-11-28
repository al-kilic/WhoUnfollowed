import type { HomeCopy } from './copy';
import { Ic } from './icons';
import { CoachPanes } from './CoachPanes';
import { CoachStay } from './CoachStay';

// The coach: Create, then Check, then Plan, on one Instagram post. On desktop
// the section pins and scrolling moves through the three (HomeFx); each step
// plays once. Below it: Today, the weekly brief and the reminders.
export function HomeCoach({ c, fx, locale }: { c: HomeCopy['coach']; fx: HomeCopy['fx']; locale: string }) {
  return (
    <section className="sec coach" id="coach">
      <div className="ctrack" id="ctrack"><div className="csticky"><div className="wrap">
        <div className="sec-head c"><span className="lab"><span className="chip">Pro AI</span>&nbsp; {c.lab}</span><h2>{c.h2}</h2></div>
        <div className="stepper" role="tablist" id="stepper">
          {c.steps.map((s, i) => (
            <span key={s} style={{ display: 'contents' }}>
              {i > 0 && <span className="arr" aria-hidden="true"><Ic n="arrow" s={14} /></span>}
              <button className="sp" type="button" role="tab" aria-selected={i === 0} data-c={i}><span className="k">{`0${i + 1}`}</span>{s}<span className="bar" /></button>
            </span>
          ))}
        </div>
        <div className="cstage" id="cstage">
          <div className="phone" id="phone">
            <div className="ig-h"><i />{fx.handle}<small>···</small></div>
            <div className="ig-img">
              <div className="slides" id="slides"><div className="slide s1" /><div className="slide s2" /><div className="slide s3" /></div>
              <span className="ig-count" id="igc">1/3</span>
            </div>
            <div className="ig-dots" id="igd"><i className="on" /><i /><i /></div>
            <div className="ig-ic"><Ic n="like" s={18} /><Ic n="comment" s={18} /><Ic n="send" s={18} /><Ic n="save" s={18} className="bm" /></div>
            <div className="capbox" id="cap" />
          </div>
          <CoachPanes c={c} fx={fx} locale={locale} />
        </div>
        <div className="scrollhint" id="shint" aria-hidden="true">{c.hint}</div>
      </div></div></div>
      <CoachStay c={c} />
    </section>
  );
}
