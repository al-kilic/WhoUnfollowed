import type { PricingMore } from './pricingMore.content';
import { PerkVisual } from './PerkVisual';

// What Pro AI does, one feature per row, alternating sides. Each row has its
// own small button so nobody has to scroll back up to buy.
export function PricingPerks({ m, cta, onBuy, showBuy }: { m: PricingMore; cta: string; onBuy: () => void; showBuy: boolean }) {
  return (
    <section className="sec pr-perks" aria-labelledby="pr-perks-h">
      <div className="wrap">
        <div className="sec-head c">
          <h2 id="pr-perks-h">{m.perksTitle}</h2>
          <p>{m.perksSub}</p>
        </div>
        <div className="pr-perk-list">
          {m.perks.map((p, i) => (
            <article key={p.kind} className={`pr-perk${i % 2 ? ' flip' : ''}`}>
              <div className="pr-perk-t">
                <h3>{p.h}</h3>
                <p>{p.p}</p>
                {showBuy && <button type="button" className="btn pr-perk-b" onClick={onBuy}>{cta}</button>}
              </div>
              <PerkVisual kind={p.kind} s={m.sample} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
