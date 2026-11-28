import { Ic } from '@/components/home/icons';
import type { Cell, PricingMore } from './pricingMore.content';

// Every feature of every plan in one table. On phones the table scrolls
// inside its own box, the feature column stays put.
function Value({ v, m }: { v: Cell; m: PricingMore }) {
  if (v === true) return <span className="pr-yes"><Ic n="check" s={15} /><span className="sr-only">{m.yes}</span></span>;
  if (v === false) return <span className="pr-no" aria-label={m.no}>·</span>;
  return <span className="pr-txt">{v}</span>;
}

export function PricingCompare({ m, footnote, refill }: { m: PricingMore; footnote: string; refill: string }) {
  return (
    <section className="sec pr-compare" id="compare" aria-labelledby="pr-compare-h">
      <div className="wrap">
        <div className="sec-head c"><h2 id="pr-compare-h">{m.compareTitle}</h2></div>
        <div className="pr-tbl-wrap" tabIndex={0} role="region" aria-labelledby="pr-compare-h">
          <table className="pr-tbl">
            <thead>
              <tr><th scope="col">{m.cols.feature}</th><th scope="col">{m.cols.free}</th><th scope="col" className="hl">{m.cols.pro}</th><th scope="col">{m.cols.life}</th></tr>
            </thead>
            {m.groups.map((g) => (
              <tbody key={g.label}>
                <tr className="pr-grp"><th scope="colgroup" colSpan={4}>{g.label}</th></tr>
                {g.rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">{r.label}</th>
                    <td><Value v={r.free} m={m} /></td>
                    <td className="hl"><Value v={r.pro} m={m} /></td>
                    <td><Value v={r.life} m={m} /></td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
        <p className="pr-foot">{footnote}</p>
        <p className="pr-foot">{refill}</p>
      </div>
    </section>
  );
}
