import '@/styles/home-base.css';
import '@/styles/home-header.css';
import '@/styles/home-page.css';
import { useLocale } from 'next-intl';
import { routing, type AppLocale } from '@/i18n/routing';
import { getHomeCopy } from '@/components/home/copy';
import { HomeFooter } from '@/components/home/HomeFooter';

// The homepage footer for every other page: same links and donate row, with
// the homepage's in-page links pointing back to "/".
export function SiteFooter() {
  const locale = useLocale() as AppLocale;
  const home = locale === routing.defaultLocale ? '/' : `/${locale}`;
  return (
    <div className="hm hm-foot">
      <HomeFooter c={getHomeCopy(locale).footer} base={home} />
    </div>
  );
}
