import NextLink from 'next/link';
import { HOME_GUIDE_SLUGS, type GuidesSectionContent } from '@/components/landing/guidesSection.content';
import type { HomeCopy } from './copy';
import { fill } from './copy';
import { Ic } from './icons';

export type FaqCat = 'privacy' | 'product' | 'billing';
export const FAQ_CATS: FaqCat[] = ['privacy', 'product', 'billing'];
// How many questions show before "Show all".
const SHOW = 3;
// The order the guides list shows them in (by HOME_GUIDE_SLUGS index).
const GUIDE_ORDER = [0, 2, 1, 3, 4];

// Fills the FAQ's code-owned values. page.tsx uses the same for the FAQPage
// structured data, so the two always match.
export function faqItems(c: HomeCopy['faq'], vars: Record<string, string | number>): Record<FaqCat, [string, string][]> {
  const out = {} as Record<FaqCat, [string, string][]>;
  for (const k of FAQ_CATS) out[k] = c.items[k].map(([q, a]) => [q ?? '', fill(a ?? '', vars)] as [string, string]);
  return out;
}

// Questions (every answer is in the page; HomeFx switches the category and
// the "Show all" toggle) next to a slim list of guides.
export function HomeFaq({ c, items, g }: { c: HomeCopy['faq']; items: Record<FaqCat, [string, string][]>; g: GuidesSectionContent }) {
  return (
    <section className="sec qa" id="faq">
      <div className="wrap">
        <div className="qa-g">
          <div className="qa-l rv">
            <div className="qa-h"><span className="lab">{c.lab}</span><h2>{c.h2}</h2></div>
            <div className="qcat" id="qcat">
              {FAQ_CATS.map((k, i) => <button key={k} type="button" aria-pressed={i === 0} data-q={k}>{c.cats[i]}</button>)}
            </div>
            <div id="qlist">
              {FAQ_CATS.map((k, ci) => items[k].map(([q, a], i) => (
                <details key={q} data-cat={k} data-k={i} open={ci === 0 && i === 0} hidden={ci !== 0 || i >= SHOW}>
                  <summary>{q}<span className="pm" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></span></summary>
                  <p>{a}</p>
                </details>
              )))}
            </div>
            <button className="qmore" id="qmore" type="button" data-all={c.showAll} data-few={c.showFewer} data-show={SHOW} hidden={items.privacy.length <= SHOW}>{fill(c.showAll, { n: items.privacy.length })}</button>
          </div>
          <aside className="qa-r rv" id="guides" aria-label={c.gLab}>
            <div className="qa-h"><span className="lab">{c.gLab}</span><b>{c.gH}</b></div>
            {GUIDE_ORDER.map((i) => {
              const slug = HOME_GUIDE_SLUGS[i]!;
              return <NextLink key={slug} className="gl-i" href={`/blog/${slug}`}><span className="gl-t">{c.gTags[i]}</span><b>{g.titles[slug]}</b><Ic n="arrow" s={15} /></NextLink>;
            })}
            <NextLink className="gl-all" href="/blog">{c.gAll}<Ic n="arrow" s={14} /></NextLink>
            {c.gNote && <span className="gl-note">{c.gNote}</span>}
          </aside>
        </div>
      </div>
    </section>
  );
}
