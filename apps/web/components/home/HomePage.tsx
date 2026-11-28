import '@/styles/home-base.css';
import '@/styles/home-header.css';
import '@/styles/home-page.css';
import type { AppLocale } from '@/i18n/routing';
import type { HomeContent } from '@/app/[locale]/homeContent';
import { SiteHeader } from '@/components/site/SiteHeader';
import { getGuidesSectionContent } from '@/components/landing/guidesSection.content';
import { getHomeCopy } from './copy';
import { HM_FONTS } from './fonts';
import { HomeHero } from './HomeHero';
import { HomeMarquee } from './HomeMarquee';
import { HomeTools } from './HomeTools';
import { HomeCoach } from './HomeCoach';
import { HomeFlow } from './HomeFlow';
import { HomePrivacy } from './HomePrivacy';
import { HomePricing, type PricingFacts } from './HomePricing';
import { HomeBeyond } from './HomeBeyond';
import { HomeFaq, type FaqCat } from './HomeFaq';
import { HomeFinal } from './HomeFinal';
import { HomeFooter } from './HomeFooter';
import { HomeFx } from './HomeFx';
import { FeedbackWidget } from './FeedbackWidget';

// The homepage (Quiet Machine, Nov 2026). Sections render on the server;
// client islands are the header, the upload, the donate row and HomeFx,
// which animates the rest. Styles are scoped under .hm.
export function HomePage({ locale, isPro, stats, legacy, pricing, faq }: {
  locale: AppLocale;
  isPro: boolean;
  stats: { snapshots: number; avgNonFollowers: number };
  legacy: HomeContent; // upload errors and dialogs, shared with the old flow
  pricing: PricingFacts;
  faq: Record<FaqCat, [string, string][]>;
}) {
  const c = getHomeCopy(locale);
  return (
    <div className={`hm hm-page ${HM_FONTS}`} id="hm">
      <SiteHeader />
      <main id="top">
        <HomeHero c={c.hero} errors={legacy.hero} isPro={isPro} stats={stats} locale={locale} />
        <HomeMarquee words={c.marquee} />
        <HomeTools c={c.tools} locale={locale} />
        <HomeCoach c={c.coach} fx={c.fx} locale={locale} />
        <HomeFlow c={c.flow} />
        <HomePrivacy c={c.privacy} />
        <HomeBeyond c={c.beyond} price={`$${pricing.price.monthly}`} />
        <HomePricing c={c.pricing} f={pricing} />
        <HomeFaq c={c.faq} items={faq} g={getGuidesSectionContent(locale)} />
        <HomeFinal c={c.final} />
      </main>
      <HomeFooter c={c.footer} />
      <HomeFx locale={locale} t={c.fx} hooks={c.coach.create.hooks} />
      <FeedbackWidget c={c.feedback} locale={locale} />
    </div>
  );
}
