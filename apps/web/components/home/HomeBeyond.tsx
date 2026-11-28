import type { HomeCopy } from './copy';
import { fill } from './copy';
import { Rich } from './rich';
import { Ic } from './icons';
import { BeyondPipe } from './BeyondPipe';

// Why Pro AI is worth it over a plain chat: placed right before pricing, so the objection an
// AI-savvy visitor has is answered just before they see the price. The
// pipeline, then what Pro AI keeps
// running and current behind every answer.
export function HomeBeyond({ c, price }: { c: HomeCopy['beyond']; price: string }) {
  return (
    <section className="sec why" id="why">
      <div className="why-aura" aria-hidden="true"><i /><i /></div>
      <div className="wrap">
        <div className="sec-head c rv">{c.lab && <span className="lab">{c.lab}</span>}<h2>{c.h2}</h2><p>{c.sub}</p></div>
        <BeyondPipe c={c} />
        <div className="why-build gl rv">
          <div>
            <b className="why-h3">{c.buildH}</b>
            <p>{c.buildP}</p>
          </div>
          <ul>
            {c.buildItems.map((t) => <li key={t}><Ic n="check" s={14} />{t}</li>)}
          </ul>
          <p className="why-or"><Rich t={fill(c.buildOr, { price })} /></p>
        </div>
      </div>
    </section>
  );
}
