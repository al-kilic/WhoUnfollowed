import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import type { HomeCopy } from './copy';
import { fill } from './copy';
import { Rich } from './rich';
import { Ic } from './icons';
import { PlanMark, PriceNum } from './PlanMark';
import { ProReel } from './ProReel';

// Everything priced comes from lib/pricing.ts (page.tsx).
export interface PricingFacts {
  price: { monthly: number; yearly: number };
  standard: { monthly: number; yearly: number } | null; // set while launch prices run
  increaseOn: string; // the date launch prices end, already formatted
  savePct: number;
  topup: { price: number; months: number };
}

const usd = (n: number) => `$${n}`;

// Free and Pro AI. The Monthly / Yearly switch (HomeFx) toggles .yearly on
// .plans; both texts are in the page, so nothing is typed in by script.
export function HomePricing({ c, f }: { c: HomeCopy['pricing']; f: PricingFacts }) {
  const note = (k: 'monthly' | 'yearly') => (f.standard ? fill(c.launchNote, { date: f.increaseOn, price: usd(f.standard[k]) }) : '');
  // Both texts share one grid cell, so the card keeps its size when the switch flips.
  const both = (m: ReactNode, y: ReactNode) => <span className="bsw"><i className="bm-m">{m}</i><i className="bm-y" aria-hidden="true">{y}</i></span>;
  return (
    <section className="sec" id="pricing" style={{ background: 'var(--bg2)', borderBlock: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="sec-head c rv"><span className="lab">{c.lab}</span><h2>{c.h2}</h2></div>
        <div className="bill" role="group" aria-label={c.billAria}>
          <button type="button" aria-pressed="true" data-b="m">{c.monthly}</button>
          <button type="button" aria-pressed="false" data-b="y">{c.yearly}<span className="save">{fill(c.save, { p: f.savePct })}</span></button>
        </div>
        <div className="plans rv">
          <div className="plan pf-free">
            <div className="pt"><span className="pt-n"><PlanMark kind="free" /><b>{c.free}</b></span><span className="pt-tag">{c.noSignUp}</span></div>
            <div className="price"><span className="p num"><PriceNum n={0} /></span><span className="pu">{c.forever}</span></div>
            <ul>{c.freeList.map((t) => <li key={t}><Ic n="check" s={14} />{t}</li>)}</ul>
            <div className="fprev gl" id="fprev" aria-hidden="true"><div className="fp-h"><b className="num" id="fpN">84</b><span>{c.fprev}</span></div><div className="fp-l" id="fpL" /></div>
            <a className="btn pbtn" href="#upload">{c.useFree}</a><p className="note">{c.freeNote}</p>
          </div>
          <div className="plan hl">
            <div className="pt"><span className="pt-n"><PlanMark kind="pro" /><b>{c.pro}</b></span><span className="pt-tag">{c.everything}</span></div>
            <div className="price"><span className="p num">{both(<PriceNum n={f.price.monthly} />, <PriceNum n={f.price.yearly} />)}</span><span className="pu">{both(c.perMonth, c.perYear)}</span></div>
            <ul>
              {c.proList.map((t) => <li key={t}><Ic n="check" s={14} />{t}</li>)}
              <li><Ic n="check" s={14} /><span><Rich t={c.credits} /></span></li>
            </ul>
            <ProReel c={c.preel} />
            <Link className="see-all" href="/pricing">{c.seeAll}<Ic n="arrow" s={13} /></Link>
            <Link className="btn pbtn pri2" href="/pricing">{c.start}</Link>
            <p className="note">{both(note('monthly'), note('yearly'))}</p>
          </div>
        </div>
        <p className="topup">{fill(c.topup, { p: usd(f.topup.price), m: f.topup.months })}</p>
      </div>
    </section>
  );
}
