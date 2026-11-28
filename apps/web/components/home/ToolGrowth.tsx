import type { HomeCopy } from './copy';
import { Rich } from './rich';
import { Ic } from './icons';
import { cv } from './cssVars';
import { CHART_MONTHS, shortMonth } from './fx/data';

// Growth: every export on one line, with the posts that brought people in.
// HomeFx draws the gained/lost bars, moves the dot and places the pins.
export function SceneGrowth({ c, locale }: { c: HomeCopy['tools']['g']; locale: string }) {
  const k = (x: number) => `${(x / 1000).toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}k`;
  return (
    <div className="scene" data-s="3">
      <div className="sh sg"><span className="oc"><Ic n="up" s={13} />{c.oc}</span><span className="sh-n">{c.sh}</span></div>
      <div className="kpis sg" style={cv({ '--d': 120 })}>
        <div className="kp gl"><b className="num" style={{ color: 'var(--good)' }} data-cnt="376" data-pre="+">0</b><small>{c.kpi[0]}</small></div>
        <div className="kp gl"><b className="num" style={{ color: 'var(--bad)' }} data-cnt="232" data-pre="−">0</b><small>{c.kpi[1]}</small></div>
        <div className="kp gl"><b className="num">3x</b><small>{c.kpi[2]}</small></div>
      </div>
      <div className="gchart gl sg" style={cv({ '--d': 240 })}>
        <svg className="chart" viewBox="0 0 520 250" aria-hidden="true">
          <defs><linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--accent)" stopOpacity=".32" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></linearGradient></defs>
          {[20, 70, 120, 170].map((y) => <line key={y} className="gl" x1="40" y1={y} x2="510" y2={y} />)}
          {[1300, 1200, 1100, 1000].map((v, i) => <text key={v} x="0" y={24 + i * 50}>{k(v)}</text>)}
          <path className="ar" d="M40 158 L107 146 L174 135 L241 115 L308 85 L375 71 L442 52 L510 58 L510 170 L40 170Z" fill="url(#gArea)" />
          <path className="ln" d="M40 158 L107 146 L174 135 L241 115 L308 85 L375 71 L442 52 L510 58" />
          <g data-gbars="" />
          <line className="gl" x1="40" y1="212" x2="510" y2="212" />
          <circle r="5" cx="40" cy="158" fill="var(--accent)" stroke="var(--surface)" strokeWidth="3" />
          {CHART_MONTHS.map(([x, iso]) => <text key={iso} x={x} y="248">{shortMonth(locale, iso)}</text>)}
        </svg>
        <span className="gpin" data-pin="0" style={cv({ '--px': '59.2%', '--py': '34%' })}><Rich t={c.pins[0]!} /></span>
        <span className="gpin" data-pin="1" style={cv({ '--px': '85%', '--py': '20.8%' })}><Rich t={c.pins[1]!} /></span>
        <span className="tip" />
      </div>
      <div className="nudge gl sg" style={cv({ '--d': 2200 })}><span className="nd-i"><Ic n="comment" s={15} /></span><span><Rich t={c.nudge} /></span><span className="chip">Pro AI</span></div>
    </div>
  );
}
