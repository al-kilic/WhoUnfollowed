import '@/styles/home-base.css';
import '@/styles/home-page.css';
import '@/styles/pillar.css';
import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { Ic } from '@/components/home/icons';
import type { CoachPageContent } from './content';

// The public coach page, in the same pillar look as /instagram. Server
// rendered, so every answer is visible to readers and crawlers.
export function CoachPageView({ c }: { c: CoachPageContent }) {
  return (
    <div className="hm hm-page pl">
      <SiteHeader />
      <main>
        <section className="wrap pl-hero">
          <span className="lab">{c.eyebrow}</span>
          <h1>{c.h1}<span className="pl-h1sub">{c.h1Sub}</span></h1>
          <p className="pl-lead">{c.intro}</p>
          <div className="pl-ctas">
            <Link className="btn pri" href="/app">{c.ctaStudio}<Ic n="arrow" s={14} /></Link>
            <Link className="btn sec" href="/pricing">{c.ctaPricing}</Link>
          </div>
          <ul className="pl-chips">{c.chips.map((t) => <li key={t}><Ic n="check" s={13} />{t}</li>)}</ul>
        </section>

        <Block lab={c.whyLab} h={c.whyH}>
          <div className="pl-grid">{c.why.map((i) => <div key={i.t} className="gl pl-card"><b>{i.t}</b><p>{i.b}</p></div>)}</div>
        </Block>

        <Block lab={c.doLab} h={c.doH}>
          <div className="pl-grid">{c.do.map((i) => <div key={i.t} className="gl pl-card"><b>{i.t}</b><p>{i.b}</p></div>)}</div>
        </Block>

        <Block lab={c.stayLab} h={c.stayH}>
          <div className="pl-grid">{c.stay.map((i) => <div key={i.t} className="pl-limit"><b>{i.t}</b><p>{i.b}</p></div>)}</div>
          <Link className="pl-more" href="/instagram-updates">{c.more.brief} →</Link>
        </Block>

        <Block lab={c.seesLab} h={c.seesH}>
          <p className="pl-p">{c.sees}</p>
          <p className="pl-p">{c.never}</p>
        </Block>

        <Block lab={c.priceLab} h={c.priceH}>
          <p className="pl-p">{c.priceBody}</p>
          <p className="pl-note">{c.priceFree}</p>
          <Link className="pl-more" href="/pricing">{c.ctaPricing} →</Link>
        </Block>

        <Block lab={c.faqLab} h={c.faqH}>
          <div className="pl-faq">{c.faq.map((f) => <div key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}</div>
        </Block>

        <Block lab={c.moreLab} h={c.moreH}>
          <div className="pl-links">
            <Link href="/instagram" className="gl">{c.more.instagram}<Ic n="arrow" s={13} /></Link>
            <Link href="/instagram-updates" className="gl">{c.more.brief}<Ic n="arrow" s={13} /></Link>
            <Link href="/pricing" className="gl">{c.more.pricing}<Ic n="arrow" s={13} /></Link>
            <Link href="/compare" className="gl">{c.more.compare}<Ic n="arrow" s={13} /></Link>
          </div>
        </Block>

        <section className="wrap pl-final gl">
          <h2>{c.finalH}</h2>
          <p>{c.finalSub}</p>
          <Link className="btn pri" href="/app">{c.ctaStudio}<Ic n="arrow" s={14} /></Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Block({ lab, h, children }: { lab: string; h: string; children: ReactNode }) {
  return (
    <section className="wrap pl-sec">
      <div className="pl-head"><span className="lab">{lab}</span><h2>{h}</h2></div>
      {children}
    </section>
  );
}
