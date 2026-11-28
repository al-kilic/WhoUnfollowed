import type { HomeCopy } from './copy';
import { Rich } from './rich';
import { Ic } from './icons';
import { cv } from './cssVars';

type T = HomeCopy['tools'];
// The Results list's sample rows: handle, avatar colour, filter tags, stamp colour.
const ROWS: [string, string, string, string][] = [
  ['mio.travels', '#4b5a7a', 'ghost old', 'bad'], ['oak.and.ash', '#7a5c3b', 'brand', 'good'], ['kaito.film', '#4a6b44', 'ghost old', 'bad'],
  ['lena.frames', '#3b6e6c', '', 'acc'], ['rue.studio', '#6b4060', 'ghost', 'bad'],
];
const CHIP_KEYS = ['all', 'ghost', 'brand', 'old'];
const CHIP_N = [84, 19, 11, 30];

export function SceneResults({ c }: { c: T['r'] }) {
  return (
    <div className="scene on" data-s="0">
      <div className="sh sg"><span className="oc"><Ic n="check" s={13} />{c.oc}</span><span className="sh-n">{c.sh}</span></div>
      <div className="kpis sg" style={cv({ '--d': 120 })}>
        <div className="kp gl"><b className="num" data-cnt="84">0</b><small>{c.kpi[0]}</small></div>
        <div className="kp gl"><b className="num ghost-n" data-cnt="19">0</b><small>{c.kpi[1]}</small></div>
        <div className="kp gl"><b className="num" data-sorted="">0</b><small>{c.kpi[2]}</small></div>
      </div>
      <div className="fchips sg" style={cv({ '--d': 220 })} role="group" aria-label={c.filterAria}>
        {c.chips.map((t, i) => <button key={CHIP_KEYS[i]} type="button" className={i === 0 ? 'on' : undefined} data-f={CHIP_KEYS[i]}>{t} <i>{CHIP_N[i]}</i></button>)}
      </div>
      <div className="rlist gl sg" style={cv({ '--d': 300 })}>
        {ROWS.map(([h, bg, tags, tone], i) => {
          const [sub, gb, stamp] = c.rows[i]!;
          return (
            <div key={h} className="rr2" data-t={tags}>
              <span className="av" style={{ background: bg }}>{h.charAt(0).toUpperCase()}</span>
              <span className="rn"><b>@{h}</b><small>{sub}</small></span>
              <span className={`gb${tags === 'brand' ? ' br' : ''}`}>{gb}</span>
              <span className={`pill ${tone} stamp`}>{stamp}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const LEFT: [string, string][] = [['jules.makes', '#7a3b3b'], ['pixel.poet', '#3b5a7a']];

export function SceneUnfollowers({ c, locale }: { c: T['u']; locale: string }) {
  const n = (x: number) => x.toLocaleString(locale);
  return (
    <div className="scene" data-s="1">
      <div className="sh sg"><span className="oc bad"><Ic n="minus" s={13} />{c.oc}</span><span className="sh-n">{c.sh}</span></div>
      <div className="xrow sg" style={cv({ '--d': 120 })}>
        <div className="xp gl"><small>{c.from}</small><b className="num">{n(1216)}</b></div>
        <div className="xarr"><span className="xline"><i /></span><b className="num">−12</b></div>
        <div className="xp gl"><small>{c.to}</small><b className="num">{n(1204)}</b></div>
      </div>
      <div className="tl gl sg" style={cv({ '--d': 260 })}>
        <div className="tl-h"><span>{c.tlH}</span><span className="mono">{c.tlN}</span></div>
        <div className="tl-g" data-tl="" />
        <div className="tl-call"><Rich t={c.call} /></div>
      </div>
      <div className="lrows">
        {LEFT.map(([h, bg], i) => (
          <div key={h} className="left-row" style={cv({ '--d': 1500 + i * 200 })}>
            <span className="av" style={{ background: bg }}>{h.charAt(0).toUpperCase()}</span>
            <span><b>@{h}</b><small>{c.left[i]}</small></span>
            <span className="pill bad">{c.leftPill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
