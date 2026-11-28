import type { AppLocale } from '@/i18n/routing';
import type { HomeContent } from '@/app/[locale]/homeContent';
import type { HomeCopy } from './copy';
import { fill } from './copy';
import { Ic } from './icons';
import { HeroUpload } from './HeroUpload';
import { SETS, shortDay } from './fx/data';

// The hero: headline, the drop box, the live counters, and the sample deck
// on the right (filled and animated by HomeFx).
export function HomeHero({ c, errors, isPro, stats, locale }: {
  c: HomeCopy['hero']; errors: HomeContent['hero']; isPro: boolean;
  stats: { snapshots: number; avgNonFollowers: number }; locale: AppLocale;
}) {
  const n = (x: number) => x.toLocaleString(locale);
  const icons = ['lock', 'code', 'check'] as const;
  return (
    <section className="hero" id="upload">
      <div className="h-amb" aria-hidden="true"><i /><i /><i /><i /><span className="h-noise" /></div>
      <div className="h-glow" aria-hidden="true" />
      <div className="wrap">
        <div>
          <div className="eyebrow lab">
            {c.eyebrow.map((t, i) => <span key={t}><Ic n={icons[i]!} s={13} /><span>{t}</span></span>)}
          </div>
          <h1 className="h1">
            <span className="ln"><span>{c.h1a}</span></span>
            <span className="ln"><span>{c.h1b}</span></span>
            <span className="ln"><span><span>{c.h1c}</span> <span className="strike">{c.h1e}</span></span></span>
            <span className="ln plat"><span>{c.h1p}</span></span>
          </h1>
          <HeroUpload c={c} errors={errors} isPro={isPro} />
          <div className="proof rv" aria-label={fill(c.proofAria, { a: n(stats.snapshots), b: n(stats.avgNonFollowers) })}>
            <div className="pf"><span className="odo" data-n={stats.snapshots}>{n(stats.snapshots)}</span><span className="pl">{c.proof[0]}</span></div>
            <div className="pf"><span className="odo bad" data-n={stats.avgNonFollowers}>{n(stats.avgNonFollowers)}</span><span className="pl">{c.proof[1]}</span></div>
            <div className="pf"><span className="odo zero-n" data-n={0}>0</span><span className="pl"><Ic n="check" s={11} className="pl-ok" /><span>{c.proof[2]}</span></span></div>
          </div>
        </div>
        <div className="machine" id="machine">
          <div className="dk" id="win">
            <div className="dk-head" aria-live="off">
              <div className="dk-n"><span className="dk-cnt num" id="bigN">{n(SETS[0]![0])}</span><span className="dk-t"><b>{c.deckT}</b><span>{c.deckOf} <b className="num" id="bigM">{n(SETS[0]![1])}</b> {c.deckPeople}</span></span></div>
              <span className="dk-delta"><b id="dlt">+{SETS[0]![2]}</b> {c.since} <span id="dld">{shortDay(locale, SETS[0]![3])}</span></span>
              <div className="split" aria-hidden="true"><i className="a" id="splA" /><i className="b" id="splB" /></div>
            </div>
            <div className="deck" id="deck" />
          </div>
        </div>
      </div>
    </section>
  );
}
