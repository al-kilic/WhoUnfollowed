import type { HomeCopy } from './copy';
import { Ic } from './icons';

// The last word: drifting usernames, and one more way to drop the ZIP
// (it scrolls up and opens the picker; HomeFx).
export function HomeFinal({ c }: { c: HomeCopy['final'] }) {
  return (
    <section className="final" id="final">
      <div className="grid-bg" />
      <div className="ghosts" id="ghosts" aria-hidden="true" />
      <div className="wrap" style={{ position: 'relative' }}>
        <h2 className="fin-h">{c.h2a}<br />{c.h2b} <span className="u">{c.h2c}<svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true"><path d="M4 14 C 80 4, 200 4, 296 12" /></svg></span></h2>
        <button className="fin-drop" id="finDrop" type="button"><span className="ic2"><Ic n="up" s={20} /></span><span className="t"><b>{c.drop}</b><span>{c.dropSub}</span></span><span className="go">{c.choose}</span></button>
        <p className="fin-sm">{c.small}</p>
      </div>
    </section>
  );
}
