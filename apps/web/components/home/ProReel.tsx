import Image from 'next/image';
import type { HomeCopy } from './copy';
import { Link } from '@/i18n/navigation';
import { Ic } from './icons';
import { cv } from './cssVars';
import { AVATARS } from './fx/data';

// The Pro AI card's sample: four short scenes, one per headline feature,
// played like stories (fx/proReel.ts). Every scene is in the markup, so with
// no script or reduced motion the first one simply stays. The whole box links
// to Studio's sample mode; the progress bars above the link jump scenes.
const RING = 2 * Math.PI * 19;

export function ProReel({ c }: { c: HomeCopy['pricing']['preel'] }) {
  const t = c.scenes;
  return (
    <div className="fprev gl preel" id="preel" role="group" aria-label={c.aria}>
      <div className="pr-seg">
        {t.map((s, i) => (
          <button key={s} type="button" data-i={i} aria-label={s} aria-pressed={i === 0} className={i === 0 ? 'on' : undefined}><i /></button>
        ))}
      </div>
      <div className="pr-stage" aria-hidden="true">
        <div className="pr-sc on" data-k="0">
          <span className="pr-t">{t[0]}</span>
          <div className="pr-unf">
            <span className="av ph"><Image src={AVATARS[6]!} alt="" width={30} height={30} /></span>
            <b>@viv.runs</b>
            <span className="pr-pill bad">{c.left}</span>
          </div>
          <span className="pr-sub">{c.since}</span>
        </div>
        <div className="pr-sc" data-k="1">
          <span className="pr-t">{t[1]}</span>
          <div className="pr-score">
            <span className="pr-ring">
              <svg viewBox="0 0 44 44" width="46" height="46"><circle cx="22" cy="22" r="19" className="rb" /><circle cx="22" cy="22" r="19" className="rf" style={cv({ '--len': RING.toFixed(1) })} /></svg>
              <b className="pr-n">87</b>
            </span>
            <span className="pr-chips">
              <span className="pr-pill good"><Ic n="check" s={11} />{c.good}</span>
              <span className="pr-pill warn">{c.fix}</span>
            </span>
          </div>
        </div>
        <div className="pr-sc" data-k="2">
          <span className="pr-t">{t[2]}</span>
          <div className="pr-chat">
            <span className="pr-q">{c.ask}</span>
            <p className="pr-a"><span className="pr-type" data-text={c.answer}>{c.answer}</span><i className="pr-caret" /></p>
          </div>
        </div>
        <div className="pr-sc" data-k="3">
          <span className="pr-t">{t[3]}</span>
          <div className="pr-note">
            <span className="pr-nb" />
            <div className="pr-nc">
              <span className="pr-ni"><Ic n="bell" s={13} /></span>
              <span className="pr-nx">
                <span className="pr-nh"><b>{c.app}</b><em>{c.now}</em></span>
                <b>{c.noteT}</b>
                <span>{c.noteB}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="pr-foot">
        <span className="pr-smp">{c.sample}</span>
        <Link className="pr-go" href="/app/results?sample=1&from=pricing" data-umami-event="Pro Reel Clicked">{c.go}<Ic n="arrow" s={12} /></Link>
      </div>
    </div>
  );
}
