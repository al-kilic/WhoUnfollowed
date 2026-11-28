'use client';

import type { CSSProperties } from 'react';
import { Gauge, Sparkles, Wrench } from 'lucide-react';
import { getCoachContent } from '@/app/[locale]/coach/content';
import { useStudio } from '../StudioContext';
import { FORMAT_ICON, type Format } from './formats';
import { getCreateContent } from './create.content';
import { RollingRing } from './ProPreview';

// Empty states for Create: a moving example of what you get, labelled as an
// example, so the page shows its value before the coach is used.

const CRITERIA = ['hook', 'clarity', 'value', 'fit_you', 'fit_trend', 'action'] as const;
const DEMO = [82, 64, 90, 72, 48, 76];
const tone = (v: number) => (v >= 75 ? 'var(--good)' : v >= 55 ? 'var(--warn)' : 'var(--bad)');

export function CheckEmpty() {
  const { locale } = useStudio();
  const k = getCreateContent(locale).k;
  const crit = getCoachContent(locale).check.criteria;
  return (
    <section className="s-card s-chke">
      <div className="s-hd"><h3 className="s-h3 s-row" style={{ gap: 6 }}><Gauge size={15} />{k.demoTitle}</h3><span className="s-badge">{k.example}</span></div>
      <div className="s-pad s-chke-b" aria-hidden="true">
        <div className="s-chke-post"><span className="scan" /><i /><i /><i /></div>
        <div className="s-col" style={{ gap: 12, flex: 1, minWidth: 0 }}>
          <div className="s-row" style={{ gap: 12 }}><RollingRing lo={58} hi={94} size={64} /><span className="s-sub-t" style={{ fontSize: 13 }}>{k.outOf}</span></div>
          <div className="s-col" style={{ gap: 7 }}>
            {CRITERIA.map((c, i) => (
              <div key={c} className="s-chke-row">
                <span>{crit[c]}</span>
                <span className="tr"><i style={{ '--w': `${DEMO[i]}%`, background: tone(DEMO[i]!), animationDelay: `${i * 0.18}s` } as CSSProperties} /></span>
              </div>
            ))}
          </div>
          <div className="s-chke-fix"><Wrench size={13} /><b>{k.demoFixLab}</b><span>{k.demoFix}</span></div>
        </div>
      </div>
      <p className="s-pad s-sub-t" style={{ margin: 0, borderTop: '1px solid var(--line)', fontSize: 13.5 }}>{k.empty}</p>
    </section>
  );
}

const FMTS: Format[] = ['reel', 'carousel', 'photo'];

export function IdeasEmpty({ busy, onAsk }: { busy: boolean; onAsk: () => void }) {
  const { locale } = useStudio();
  const i = getCreateContent(locale).i;
  const c = getCoachContent(locale);
  return (
    <section className="s-card s-ide">
      <div className="s-ide-art" aria-hidden="true">
        {FMTS.map((f, n) => {
          const Ic = FORMAT_ICON[f];
          return (
            <div key={f} className={`s-ide-card f-${f}`} style={{ '--n': n } as CSSProperties}>
              <span className="top"><Ic size={18} /></span>
              <b>{i.demo[n]}</b>
              <span className="ln" /><span className="ln s" />
            </div>
          );
        })}
      </div>
      <div className="s-col s-ide-copy">
        <span className="s-lab s-row" style={{ gap: 6 }}><Sparkles size={13} />{c.formats.reel} · {c.formats.carousel} · {c.formats.photo}</span>
        <h2>{i.heroTitle}</h2>
        <p className="s-sub-t" style={{ margin: 0 }}>{i.heroBody}</p>
        <ol className="s-ide-steps">{i.steps.map((s, n) => <li key={s}><span>{n + 1}</span>{s}</li>)}</ol>
        <button type="button" className="s-btn" style={{ alignSelf: 'flex-start' }} disabled={busy} onClick={onAsk}><Sparkles size={14} />{busy ? c.working : i.get5}</button>
      </div>
    </section>
  );
}
