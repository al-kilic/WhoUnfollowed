import '@/styles/home-base.css';
import '@/styles/home-page.css';
import '@/styles/pillar.css';
import type { ReactNode } from 'react';
import NextLink from 'next/link';
import { Link } from '@/i18n/navigation';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { Ic } from '@/components/home/icons';
import { META_EXPORT, TOP_GUIDES, blogHref } from '@/components/site/header/links';
import type { InstagramPageContent } from './content';

// The Instagram pillar page: a guide in the homepage's look. Server rendered,
// every answer visible to readers and crawlers.
export function InstagramContent({ c, guideTitles }: { c: InstagramPageContent; guideTitles: Record<string, string> }) {
  return (
    <div className="hm hm-page pl">
      <SiteHeader />
      <main>
        <section className="wrap pl-hero">
          <span className="lab">{c.eyebrow}</span>
          <h1>{c.h1}<span className="pl-h1sub">{c.h1Sub}</span></h1>
          <p className="pl-lead">{c.intro}</p>
          <div className="pl-ctas">
            <Link className="btn pri" href="/#upload">{c.ctaUpload}<Ic n="arrow" s={14} /></Link>
            <a className="btn sec" href={META_EXPORT} target="_blank" rel="noopener noreferrer">{c.ctaExport} ↗</a>
          </div>
          <ul className="pl-chips">{c.chips.map((t) => <li key={t}><Ic n="check" s={13} />{t}</li>)}</ul>
        </section>

        <Block lab={c.diffLab} h={c.diffH}>
          <div className="pl-two">
            {c.diff.map((d, i) => <div key={d.t} className={`gl pl-card${i === 1 ? ' hi' : ''}`}><b>{d.t}</b><p>{d.b}</p></div>)}
          </div>
          <p className="pl-note">{c.diffNote}</p>
        </Block>

        <Block lab={c.stepsLab} h={c.stepsH} id="export">
          <ol className="pl-steps">
            {c.steps.map((s, i) => <li key={s.t} id={`step${i + 1}`} className="gl"><span className="pl-n">{String(i + 1).padStart(2, '0')}</span><span><b>{s.t}</b><p>{s.b}</p></span></li>)}
          </ol>
          <p className="pl-tip"><Ic n="warn" s={14} />{c.stepsTip}</p>
          <Link className="pl-more" href="/how-to-export">{c.stepsGuide} →</Link>
        </Block>

        <Block lab={c.listsLab} h={c.listsH}>
          <div className="pl-grid">{c.lists.map((l) => <div key={l.t} className="gl pl-card"><b>{l.t}</b><p>{l.b}</p></div>)}</div>
        </Block>

        <Block lab={c.limitsLab} h={c.limitsH}>
          <div className="pl-grid">{c.limits.map((l) => <div key={l.t} className="pl-limit"><b>{l.t}</b><p>{l.b}</p></div>)}</div>
        </Block>

        <Block lab={c.readLab} h={c.readH}>
          <p className="pl-p">{c.readBody}</p>
          <ul className="pl-files">{c.readFiles.map((f) => <li key={f}><code>{f}</code></li>)}</ul>
          <p className="pl-p">{c.readNever}</p>
        </Block>

        <Block lab={c.faqLab} h={c.faqH}>
          <div className="pl-faq">{c.faq.map((f) => <div key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}</div>
        </Block>

        <Block lab={c.moreLab} h={c.moreH}>
          <div className="pl-links">
            {TOP_GUIDES.map((s) => <NextLink key={s} href={blogHref(s)} className="gl">{guideTitles[s]}<Ic n="arrow" s={13} /></NextLink>)}
            <Link href="/how-to-export" className="gl">{c.morePlatforms.guide}<Ic n="arrow" s={13} /></Link>
            <Link href="/threads" className="gl">{c.morePlatforms.threads}<Ic n="arrow" s={13} /></Link>
            <Link href="/tiktok" className="gl">{c.morePlatforms.tiktok}<Ic n="arrow" s={13} /></Link>
            <Link href="/compare" className="gl">{c.morePlatforms.compare}<Ic n="arrow" s={13} /></Link>
          </div>
        </Block>

        <section className="wrap pl-final gl">
          <h2>{c.finalH}</h2>
          <p>{c.finalSub}</p>
          <Link className="btn pri" href="/#upload">{c.ctaUpload}<Ic n="arrow" s={14} /></Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Block({ lab, h, id, children }: { lab: string; h: string; id?: string; children: ReactNode }) {
  return (
    <section className="wrap pl-sec" id={id}>
      <div className="pl-head"><span className="lab">{lab}</span><h2>{h}</h2></div>
      {children}
    </section>
  );
}
