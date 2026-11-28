import Image from 'next/image';
import NextLink from 'next/link';
import { Link } from '@/i18n/navigation';
import { GITHUB, SECURITY } from '@/components/site/header/links';
import type { HomeCopy } from './copy';
import { fill } from './copy';
import { FooterDonate } from './FooterDonate';

// The footer: the small donate row, then four link columns. On other pages
// (base = the localized home path) the in-page links point back to its sections.
export function HomeFooter({ c, base = '' }: { c: HomeCopy['footer']; base?: string }) {
  const [up, tools, coach, pricing, studio] = c.productLinks;
  const [how, instagram, threads, tiktok, compare, guides, coachPage, weekly] = c.learnLinks;
  const [privacy, terms, cookies, refunds, access, security] = c.trustLinks;
  const [about, whatIs, news, source, contact] = c.companyLinks;
  return (
    <footer>
      <div className="wrap">
        <div className="fgrid">
          <div className="fbrand">
            <a className="brand" href={`${base}#top`} style={{ padding: 0 }}><Image src="/logo.png" alt="" width={26} height={26} />WhoUnfollowed</a>
            <p>{c.blurb}</p>
            <FooterDonate c={c} />
          </div>
          <div><h4>{c.product}</h4><a href={`${base}#upload`}>{up}</a><a href={`${base}#tools`}>{tools}</a><a href={`${base}#coach`}>{coach}</a><Link href="/pricing">{pricing}</Link><Link href="/app">{studio}</Link></div>
          <div><h4>{c.learnH}</h4><a href={`${base}#flow`}>{how}</a><Link href="/instagram">{instagram}</Link><Link href="/threads">{threads}</Link><Link href="/tiktok">{tiktok}</Link><Link href="/compare">{compare}</Link><NextLink href="/blog">{guides}</NextLink><Link href="/instagram-coach">{coachPage}</Link><Link href="/instagram-updates">{weekly}</Link></div>
          <div><h4>{c.trust}</h4><Link href="/privacy">{privacy}</Link><Link href="/terms">{terms}</Link><Link href="/cookies">{cookies}</Link><Link href="/refund">{refunds}</Link><Link href="/accessibility">{access}</Link><a href={SECURITY} target="_blank" rel="noopener noreferrer">{security}</a></div>
          <div><h4>{c.company}</h4><Link href="/about">{about}</Link><Link href="/what-is-whounfollowed">{whatIs}</Link><Link href="/changelog">{news}</Link><a href={GITHUB} target="_blank" rel="noopener noreferrer">{source}</a><Link href="/contact">{contact}</Link></div>
        </div>
        <div className="fbot"><span>{fill(c.copy, { y: new Date().getFullYear() })}</span><span>{c.notAffiliated}</span></div>
      </div>
    </footer>
  );
}
