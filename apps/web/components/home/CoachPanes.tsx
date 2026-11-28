import type { HomeCopy } from './copy';
import { Rich } from './rich';
import { Ic } from './icons';
import { postingDays, weekLetters } from './fx/data';

// The three coach panes. Their animations (hooks, typing, the score ring,
// posts dropping into the calendar) are played by HomeFx.
const PLAN: Record<number, 'reel' | 'st2' | 'car'> = { 1: 'reel', 5: 'st2', 8: 'car', 10: 'reel', 12: 'st2' };
const TARGET = 3;

export function CoachPanes({ c, fx, locale }: { c: HomeCopy['coach']; fx: HomeCopy['fx']; locale: string }) {
  const name = { reel: fx.reel, st2: fx.story, car: fx.carousel };
  const days = postingDays(locale);
  return (
    <div className="cpanel">
      <div className="cpane on" data-p="0">
        <h3>{c.create.h3}</h3>
        <div className="card">
          <div className="idea"><span className="pill acc">{c.create.idea}</span><b>{c.create.ideaT}</b></div>
          <div className="hooks" id="hooks">{c.create.hooks.map((h) => <div key={h} className="hook"><span className="r" />{h}</div>)}</div>
          <div className="knobs">{c.create.knobs.map((k) => <span key={k} className="pill acc">{k}</span>)}</div>
        </div>
      </div>
      <div className="cpane" data-p="1">
        <h3>{c.check.h3}</h3>
        <div className="card">
          <div className="score">
            <div className="ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" stroke="var(--line)" /><circle id="ringV" cx="50" cy="50" r="42" stroke="var(--warn)" strokeDasharray="0 264" /></svg><div className="v num" id="ringN">0</div></div>
            <div className="crit">
              {c.check.crit.map(([k, v], i) => (
                <div key={k} className="row2"><span>{k}</span><span className="mono" id={i === 2 ? 'ctaW' : undefined}>{v}</span>
                  <span className="meter"><i id={i === 2 ? 'ctaM' : undefined} data-w={['88%', '72%', '30%'][i]} style={{ width: 0, background: ['var(--good)', 'var(--accent)', 'var(--warn)'][i] }} /></span></div>
              ))}
            </div>
          </div>
          <div className="fix" id="fix"><Ic n="warn" s={16} style={{ color: 'var(--warn)', flex: 'none' }} /><span><Rich t={c.check.fix} /></span></div>
        </div>
      </div>
      <div className="cpane" data-p="2">
        <h3>{c.plan.h3}</h3>
        <div className="card calcard">
          <div className="cal-h"><span className="lab">{c.plan.next}</span><span className="cal-days">{days.map((d) => <i key={d}>{d}</i>)}</span></div>
          <div className="cal" id="cal">
            {weekLetters(locale).map((l, i) => <span key={i} className="dh">{l}</span>)}
            {Array.from({ length: 14 }, (_, k) => {
              const p = PLAN[k], dn = 23 + k > 30 ? 23 + k - 30 : 23 + k;
              return (
                <div key={k} className={`d${k === TARGET ? ' target' : ''}${[1, 3, 5].includes(k % 7) ? ' post' : ''}`}>
                  <span className="dn">{dn}</span>
                  {p && <span className={`p ${p}`}><span>{name[p]}</span></span>}
                  {k === TARGET && <span className="p mine"><span>{fx.yours}</span></span>}
                </div>
              );
            })}
          </div>
          <div className="cal-l">{c.plan.legend.map((l, i) => <span key={l}><i style={{ background: ['var(--accent)', 'var(--vio)', 'var(--warn)'][i] }} />{l}</span>)}</div>
          <div className="pnote" id="pnote" aria-hidden="true"><span className="pn-i"><Ic n="bell" s={14} /></span><span><b>{c.plan.noteT}</b><small>{c.plan.noteB}</small></span><span className="pn-t">{c.plan.now}</span></div>
          <div className="pchips">{c.plan.chips.map((t, i) => <span key={t}><Ic n={(['bell', 'cal', 'check'] as const)[i]!} s={12} />{t}</span>)}</div>
        </div>
      </div>
    </div>
  );
}
