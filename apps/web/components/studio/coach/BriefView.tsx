'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, FlaskConical, Lightbulb, Lock, Megaphone, Newspaper, PenLine, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { parseBlocks, renderInline } from '@/lib/miniMarkdown';
import type { Brief } from '@/lib/briefs';
import { useStudio } from '../StudioContext';
import { PageHead } from '../PageHead';
import { LockBar } from '../Lock';
import { getStudioCoachContent } from './studioCoach.content';
import { parseBriefCards } from '@/lib/briefCards';
import { BriefCardsView } from './BriefCardsView';

const ICONS = [Newspaper, Lightbulb, FlaskConical, Sparkles];
const TONES = ['tone-blue', 'tone-amber', 'tone-green', 'tone-rose'];
const link = { color: 'var(--accent)' };

// One brief edition, from the skill's markdown: the title and dates up top,
// then each section as its own card with its items as rows.
function Edition({ markdown }: { markdown: string }) {
  const blocks = parseBlocks(markdown);
  const title = blocks.find((b) => b.kind === 'h1');
  const lead = blocks[blocks.indexOf(title!) + 1];
  const sections: { title: string; blocks: typeof blocks }[] = [];
  for (const b of blocks) {
    if (b === title || (b === lead && lead?.kind === 'p')) continue;
    if (b.kind === 'h2') sections.push({ title: b.text, blocks: [] });
    else (sections[sections.length - 1] ?? (sections[0] = { title: '', blocks: [] })).blocks.push(b);
  }
  return (
    <>
      {title && title.kind === 'h1' && (
        <div>
          <h2 style={{ fontSize: 'clamp(22px, 2.6vw, 28px)', fontWeight: 600, letterSpacing: '-.03em', margin: 0 }}>{title.text}</h2>
          {lead?.kind === 'p' && <p className="s-sub-t" style={{ margin: '4px 0 0' }}>{renderInline(lead.text, link)}</p>}
        </div>
      )}
      {sections.map((sec, i) => {
        const Ic = ICONS[i % ICONS.length]!;
        return (
          <section key={sec.title || i} className="s-card">
            {sec.title && <div className="s-hd" style={{ justifyContent: 'flex-start', gap: 10 }}><span className={`s-bic ${TONES[i % TONES.length]}`}><Ic size={15} /></span><h3 className="s-h2">{sec.title}</h3></div>}
            <div className="s-col s-pad" style={{ gap: 10 }}>
              {sec.blocks.map((b, j) => {
                if (b.kind === 'ul' || b.kind === 'ol') {
                  return (
                    <ul key={j} style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 0 }}>
                      {b.items.map((it, k) => <li key={k} style={{ padding: '10px 0', borderTop: k ? '1px solid var(--line)' : undefined, lineHeight: 1.55 }}>{renderInline(it, link)}</li>)}
                    </ul>
                  );
                }
                if (b.kind === 'p') return <p key={j} style={{ margin: 0, lineHeight: 1.6 }}>{renderInline(b.text, link)}</p>;
                return <h4 key={j} className="s-h3">{b.kind === 'h1' || b.kind === 'h2' || b.kind === 'h3' ? b.text : ''}</h4>;
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}

// Cards when the edition has the usual shape, plain sections otherwise.
function EditionView({ markdown, seed }: { markdown: string; seed: string }) {
  const cards = parseBriefCards(markdown);
  return cards ? <BriefCardsView cards={cards} seed={seed} /> : <Edition markdown={markdown} />;
}

// The three visuals of the sample brief, drawn with shapes only (no photos).
function Visual({ n }: { n: number }) {
  if (n === 0) return <div className="s-slides">{[0, 1, 2, 3].map((i) => <span key={i} className={i === 1 ? 'hi' : undefined} />)}</div>;
  if (n === 1) return <div className="s-cmp"><div><i style={{ height: 56 }} /></div><div><i className="lo" style={{ height: 34 }} /></div></div>;
  return <div className="s-fan"><span /><span /><span /></div>;
}

// Shown until the first real brief exists: the brief's layout with sample
// content, clearly labelled.
function SampleBrief() {
  const { locale } = useStudio();
  const k = getStudioCoachContent(locale).brief;
  const [open, setOpen] = useState<number | null>(null);
  const icons = [Megaphone, TrendingUp, Target];
  const tones = ['tone-blue', 'tone-green', 'tone-amber'];
  return (
    <>
      <p className="s-sub-t" style={{ margin: 0 }}>{k.sampleNote}</p>
      <div className="s-grid s-g3">
        {k.cards.map((card, i) => {
          const Ic = icons[i]!;
          return (
            <section key={card.t} className={`s-card s-bcard ${tones[i]}`} style={{ ['--dl' as string]: `${i * 90}ms` }}>
              <div className="s-bvis"><Visual n={i} /><span className="s-vcap">{card.cap}</span></div>
              <div className="s-pad s-col" style={{ gap: 8, flex: 1 }}>
                <span className="s-row s-lab" style={{ color: 'var(--tfg)' }}><Ic size={14} />{card.lab}</span>
                <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{card.t}</h2>
                {open === i && <p className="s-sub-t" style={{ margin: 0 }}>{card.p}</p>}
                <button type="button" className="s-lnk" style={{ marginTop: 'auto', paddingTop: 6, border: 0, background: 'none', cursor: 'pointer', alignSelf: 'flex-start' }} aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                  {open === i ? k.less : k.why}{open === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

// Studio > Plan > Weekly brief. The general edition is free; niche editions
// are Pro AI, and their text is only sent to the browser for Pro AI users.
export function BriefView({ brief, dates }: { brief: Brief | null; dates: string[] }) {
  const { c, locale, openUpgrade } = useStudio();
  const k = getStudioCoachContent(locale).brief;
  const [edition, setEdition] = useState('general');
  const fmt = (d: string) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${d}T12:00:00Z`));
  const current = brief?.editions.find((e) => e.id === edition) ?? brief?.editions[0];
  const monday = (() => { const d = new Date(); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); return d.toISOString().slice(0, 10); })();

  return (
    <>
      <PageHead title={c.nav.brief} sub={k.sub} />
      <section className="s-card s-pad s-row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div className="s-row" style={{ gap: 12 }}>
          <span className="s-bic big tone-blue"><Newspaper size={18} /></span>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>{k.weekOf(fmt(brief?.date ?? monday))}</h2>
            <span className="s-sub-t">{k.editionLine(brief ? (brief.editions.find((e) => e.id === 'general')?.markdown?.match(/^## /gm)?.length ?? 1) : k.cards.length)}</span>
          </div>
          {!brief && <span className="s-badge dashed">{k.sample}</span>}
        </div>
        <Link href="/app/create" className="s-btn"><PenLine size={14} />{k.writeMove}</Link>
      </section>
      {!brief || !current ? <SampleBrief /> : (
        <>
          {brief.editions.length > 1 && (
            <div className="s-seg" role="tablist" aria-label={c.nav.brief}>
              {brief.editions.map((e) => (
                <button key={e.id} type="button" role="tab" aria-selected={e.id === current.id} className={e.id === current.id ? 'on' : undefined}
                  onClick={() => (e.markdown === null ? openUpgrade('coach') : setEdition(e.id))}>
                  {e.id === 'general' ? k.general : e.name}{e.markdown === null && <Lock size={12} />}
                </button>
              ))}
            </div>
          )}
          {current.markdown ? <EditionView markdown={current.markdown} seed={`${brief.date}:${current.id}`} /> : <LockBar feature="coach" text={k.locked} />}
        </>
      )}
      {dates.length > 1 && (
        <section className="s-col" style={{ gap: 6 }}>
          <span className="s-lab">{k.past}</span>
          <div className="s-past">
            {dates.slice(0, 8).map((d) => <Link key={d} href={`/app/plan/brief?d=${d}`} className="s-card s-row" style={{ padding: 10, gap: 10, borderColor: d === brief?.date ? 'var(--ink)' : undefined }}><span className="s-bic tone-blue"><Newspaper size={14} /></span><b style={{ fontWeight: 500, fontSize: 13 }}>{k.weekOf(fmt(d))}</b></Link>)}
          </div>
        </section>
      )}
    </>
  );
}
