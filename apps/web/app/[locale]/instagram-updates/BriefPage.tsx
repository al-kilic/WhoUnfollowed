import '@/styles/home-base.css';
import '@/styles/home-page.css';
import '@/styles/pillar.css';
import type { Metadata } from 'next';
import { Link, getPathname } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { OG_LOCALE, ogAlternateLocales } from '@/i18n/ogLocale';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { Ic } from '@/components/home/icons';
import { parseBlocks, renderInline, type Block } from '@/lib/miniMarkdown';
import { getBrief, listBriefDates } from '@/lib/briefs';
import { formatBriefDate, getUpdatesPageContent } from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';
export const UPDATES_PATH = '/instagram-updates';
const pathFor = (date: string | null) => (date ? `${UPDATES_PATH}/${date}` : UPDATES_PATH);

// The free General edition only: includeNiches is always false here, so paid
// editions never reach this page.
async function load(locale: AppLocale, date: string | null) {
  const dates = await listBriefDates();
  const d = date ?? dates[0] ?? null;
  const brief = d && dates.includes(d) ? await getBrief(d, locale, false) : null;
  const general = brief?.editions.find((e) => e.id === 'general' && e.markdown);
  const blocks = general?.markdown ? parseBlocks(general.markdown) : [];
  const first = blocks[0];
  const title = first?.kind === 'h1' ? first.text : null;
  const niches = brief?.editions.filter((e) => e.id !== 'general').map((e) => e.name) ?? [];
  return { dates, date: d, blocks: title ? blocks.slice(1) : blocks, title, niches };
}

export async function briefMetadata(locale: AppLocale, date: string | null): Promise<Metadata> {
  const c = getUpdatesPageContent(locale);
  const { title } = date ? await load(locale, date) : { title: null };
  const pageTitle = date && title ? `${title} (${formatBriefDate(date, locale)})` : c.meta.title;
  const canonical = getPathname({ href: pathFor(date), locale });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, getPathname({ href: pathFor(date), locale: l })]));
  return {
    title: pageTitle,
    description: c.meta.description,
    alternates: { canonical, languages: { ...languages, 'x-default': languages.en }, types: { 'application/rss+xml': `${SITE_URL}/feeds/instagram-updates.xml` } },
    openGraph: { type: 'article', title: pageTitle, description: c.meta.description, url: `${SITE_URL}${canonical}`, locale: OG_LOCALE[locale], alternateLocale: ogAlternateLocales(locale), images: [{ url: `/og/updates/${locale}`, width: 1200, height: 630, alt: c.meta.title }] },
    twitter: { title: pageTitle, description: c.meta.description, images: [`/og/updates/${locale}`] },
  };
}

// The latest brief (date null) or one dated brief. Returns null when that
// date has no brief, so the route can 404.
export async function BriefPage({ locale, date }: { locale: AppLocale; date: string | null }) {
  const c = getUpdatesPageContent(locale);
  const b = await load(locale, date);
  if (date && !b.title) return null;
  const canonical = `${SITE_URL}${getPathname({ href: pathFor(date), locale })}`;
  const when = b.date ? c.weekOf.replace('{date}', formatBriefDate(b.date, locale)) : '';
  const jsonLd = b.date && b.title ? {
    '@context': 'https://schema.org', '@type': 'Article', headline: b.title, description: c.meta.description,
    datePublished: b.date, dateModified: b.date, inLanguage: locale, mainEntityOfPage: canonical,
    author: { '@type': 'Person', name: 'Alan Kilic', url: `${SITE_URL}/author/alan-kilic` },
    publisher: { '@id': `${SITE_URL}/#organization` },
  } : null;
  const older = b.dates.filter((d) => d !== b.date).slice(0, 12);

  return (
    <div className="hm hm-page pl">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <SiteHeader />
      <main>
        <section className="wrap pl-hero">
          <span className="lab">{c.eyebrow}</span>
          {date
            ? <h1>{b.title}<span className="pl-h1sub">{when}</span></h1>
            : <h1>{c.h1}<span className="pl-h1sub">{when}</span></h1>}
          <p className="pl-lead">{c.intro}</p>
        </section>

        <section className="wrap pl-sec pl-brief">
          {!b.title && <p className="pl-p">{c.empty}</p>}
          {!date && b.title && <div className="pl-head"><h2>{b.title}</h2></div>}
          {b.blocks.map((block, i) => <BlockView key={i} block={block} />)}
        </section>

        {b.niches.length > 0 && (
          <section className="wrap pl-final gl">
            <h2>{c.nicheH}</h2>
            <p>{c.nicheBody.replace('{niches}', b.niches.join(', '))}</p>
            <div className="pl-ctas">
              <Link className="btn pri" href="/instagram-coach">{c.nicheCta}<Ic n="arrow" s={14} /></Link>
              <Link className="btn sec" href="/#upload">{c.uploadCta}</Link>
            </div>
          </section>
        )}

        {older.length > 0 && (
          <section className="wrap pl-sec">
            <div className="pl-head"><h2>{c.archiveH}</h2></div>
            <div className="pl-links">
              {older.map((d) => <Link key={d} href={pathFor(d)} className="gl">{c.weekOf.replace('{date}', formatBriefDate(d, locale))}<Ic n="arrow" s={13} /></Link>)}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'ul': return <ul>{block.items.map((item, i) => <li key={i}>{renderInline(item)}</li>)}</ul>;
    case 'ol': return <ol>{block.items.map((item, i) => <li key={i}>{renderInline(item)}</li>)}</ol>;
    case 'p': return <p>{renderInline(block.text)}</p>;
    case 'h3': return <h3>{renderInline(block.text)}</h3>;
    default: return <h2>{renderInline(block.text)}</h2>;
  }
}
