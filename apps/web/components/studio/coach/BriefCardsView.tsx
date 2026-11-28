'use client';

import Image from 'next/image';
import { ArrowUpRight, Camera, FlaskConical, GalleryHorizontal, Hash, Images, MessageSquareText, Music2, PenLine, Sparkles, Target, Zap } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { renderInline } from '@/lib/miniMarkdown';
import { briefPhoto, type BriefCards, type IdeaFormat } from '@/lib/briefCards';
import { PlatformIcon } from '@/components/PlatformIcon';
import { useStudio } from '../StudioContext';
import { getBriefCardsContent } from './briefCards.content';

const FORMAT_ICON: Record<IdeaFormat, typeof Images> = { reel: Sparkles, carousel: GalleryHorizontal, story: Camera, threads: MessageSquareText, tiktok: Music2, photo: Images, post: Hash };
const link = { color: 'var(--accent)' };

// One weekly brief edition as cards: a hero, the changes with why and what
// to do, the post ideas by format with their hook, and one thing to try.
export function BriefCardsView({ cards, seed }: { cards: BriefCards; seed: string }) {
  const { locale } = useStudio();
  const k = getBriefCardsContent(locale);
  return (
    <div className="s-col" style={{ gap: 18 }}>
      <section className="s-bhero">
        <div className="s-bhero-txt">
          <span className="s-bhero-k">{k.news(cards.news.length)}</span>
          <h2>{cards.title}</h2>
          {cards.lead && <p>{renderInline(cards.lead, link)}</p>}
        </div>
        <div className="s-bhero-art" aria-hidden="true">
          {[0, 1, 2].map((i) => <span key={i} className={`p${i}`}><Image src={briefPhoto(`${seed}:hero:${i}`)} alt="" fill sizes="180px" /></span>)}
        </div>
      </section>

      {cards.news.length > 0 && (
        <section className="s-col" style={{ gap: 10 }}>
          {cards.sections[0] && <h3 className="s-bsec">{cards.sections[0]}</h3>}
          <div className="s-bnews">
            {cards.news.map((n, i) => (
              <article key={n.title || i} className="s-bnc" style={{ ['--dl' as string]: `${i * 70}ms` }}>
                <div className="s-bnc-img"><Image src={briefPhoto(`${seed}:news:${i}`)} alt="" fill sizes="(max-width: 700px) 100vw, 360px" /><span className="s-bnc-chips">{n.platforms.map((p) => <span key={p} className="s-bchip">{p !== 'meta' && <PlatformIcon platform={p} size={11} />}{k.platforms[p]}</span>)}</span></div>
                <div className="s-bnc-body">
                  <h4>{n.title}</h4>
                  {n.body && <p className="s-bnc-p">{renderInline(n.body, link)}</p>}
                  {n.why && <div className="s-bnc-why"><Target size={13} /><span><b>{k.why}</b> {renderInline(n.why, link)}</span></div>}
                  {n.doThis && <div className="s-bnc-do"><Zap size={13} /><span><b>{k.doThis}</b> {renderInline(n.doThis, link)}</span></div>}
                  {n.source && <a className="s-bnc-src" href={n.source.url} target="_blank" rel="noopener noreferrer">{k.source}: {n.source.label}<ArrowUpRight size={12} /></a>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {cards.ideas.length > 0 && (
        <section className="s-col" style={{ gap: 10 }}>
          {cards.sections[1] && <h3 className="s-bsec">{cards.sections[1]}</h3>}
          <div className="s-bideas">
            {cards.ideas.map((idea, i) => {
              const Ic = FORMAT_ICON[idea.format];
              return (
                <article key={i} className={`s-bidea f-${idea.format}`}>
                  <span className="s-bidea-f"><Ic size={14} />{idea.label || k.formats[idea.format]}</span>
                  {idea.title && <h4>{idea.title}</h4>}
                  {idea.body && <p>{renderInline(idea.body, link)}</p>}
                  {idea.hook && <blockquote><span>{k.hook}</span>{idea.hook}</blockquote>}
                  <Link href={`/app/create?topic=${encodeURIComponent(idea.title || idea.body.slice(0, 120))}&format=${idea.format === 'carousel' ? 'carousel' : idea.format === 'photo' ? 'photo' : 'reel'}`} className="s-lnk" style={{ fontSize: 13, marginTop: 'auto' }}><PenLine size={13} />{k.writeIt}</Link>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {cards.tryThis && (
        <section className="s-btry">
          <span className="s-btry-ic"><FlaskConical size={18} /></span>
          <div>
            <span className="s-bhero-k">{cards.sections[2] ?? k.tryLabel}</span>
            <p>{renderInline(cards.tryThis, link)}</p>
          </div>
        </section>
      )}
    </div>
  );
}
