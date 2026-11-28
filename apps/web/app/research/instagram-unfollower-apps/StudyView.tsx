import '@/styles/home-base.css';
import '@/styles/home-page.css';
import '@/styles/pillar.css';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { Ic } from '@/components/home/icons';
import type { StudyContent } from './content';
import type { StudyStats } from './stats';
import { ExportTable, StudyTable } from './StudyTables';

// The App Store study, in the pillar look. Server rendered: every number is in
// the HTML for readers, crawlers and AI answer engines.
export function StudyView({ c, s }: { c: StudyContent; s: StudyStats }) {
  const seg = [
    { key: 'account', n: s.needsAccount, color: 'var(--st-acc)', label: c.legend.account },
    { key: 'unstated', n: s.unstated, color: 'var(--st-un)', label: c.legend.unstated },
  ];
  return (
    <div className="hm hm-page pl">
      <SiteHeader />
      <main className="pl-study">
        <section className="wrap pl-hero">
          <span className="lab">{c.eyebrow}</span>
          <h1>{c.h1}<span className="pl-h1sub">{c.h1Sub}</span></h1>
          <p className="pl-lead">{c.lead}</p>
        </section>

        <Block lab={c.findingsH} h={c.barLabel}>
          <div className="st-bar" role="img" aria-label={`${c.barLabel}: ${seg.map((x) => `${x.label} ${x.n}`).join(', ')}, ${c.legend.export} ${s.readsExport}`}>
            {seg.map((x) => <span key={x.key} title={`${x.label}: ${x.n} of ${s.n}`} style={{ width: `${(x.n / s.n) * 100}%`, background: x.color }} />)}
          </div>
          <ul className="st-legend">
            {seg.map((x) => <li key={x.key}><i style={{ background: x.color }} />{x.label}: <b>{x.n}</b></li>)}
            <li><i style={{ background: 'transparent' }} />{c.legend.export}: <b>{s.readsExport}</b></li>
          </ul>
          <div className="st-tiles" style={{ marginTop: 28 }}>
            {c.tiles.map((t) => <div key={t.t} className="gl st-tile"><b>{t.n}</b><p>{t.t}</p></div>)}
          </div>
        </Block>

        <Block lab="Ratings" h={c.gapH}>
          <p className="pl-p" style={{ maxWidth: 760 }}>{c.gap}</p>
        </Block>

        <Block lab="Context" h={c.whyH}>
          <ul className="st-list">{c.why.map((w) => <li key={w}>{w}</li>)}</ul>
        </Block>

        <Block lab="Data" h={c.tableH}>
          <p className="pl-note" style={{ marginBottom: 14 }}>{c.tableNote}</p>
          <StudyTable c={c} />
        </Block>

        <Block lab="No login" h={c.exportH}>
          <p className="pl-note" style={{ marginBottom: 14 }}>{c.exportNote}</p>
          <ExportTable c={c} />
        </Block>

        <Block lab="Method" h={c.methodH}>
          <ol className="st-list">{c.method.map((m) => <li key={m}>{m}</li>)}</ol>
          <h3 style={{ margin: '28px 0 10px', fontSize: 18 }}>{c.limitsH}</h3>
          <ul className="st-list">{c.limits.map((m) => <li key={m}>{m}</li>)}</ul>
        </Block>

        <Block lab="FAQ" h={c.faqH}>
          <div className="pl-faq">{c.faq.map((f) => <div key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}</div>
        </Block>

        <Block lab="Cite" h={c.citeH}>
          <p className="pl-p">{c.cite}</p>
          <a className="pl-more" href="/research/instagram-unfollower-apps/data.csv" download>{c.csv} →</a>
        </Block>

        <section className="wrap pl-final gl">
          <h2>{c.ctaH}</h2>
          <p>{c.ctaSub}</p>
          <div className="pl-ctas" style={{ justifyContent: 'center' }}>
            <Link className="btn pri" href="/#upload">{c.cta}<Ic n="arrow" s={14} /></Link>
            <Link className="btn sec" href="/compare">{c.compare}</Link>
          </div>
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
