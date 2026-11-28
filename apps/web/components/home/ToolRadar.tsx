import type { HomeCopy } from './copy';
import { Ic } from './icons';
import { cv } from './cssVars';

// Radar: the follow-back ring with a sweep, and four facts the app hides.
// Blips and cards are paired by data-b / data-i (HomeFx pings them in turn).
export function SceneRadar({ c }: { c: HomeCopy['tools']['rd'] }) {
  const [pend, oldest, gone, spree] = c.cards;
  return (
    <div className="scene" data-s="2">
      <div className="sh sg"><span className="oc"><Ic n="check" s={13} />{c.oc}</span><span className="sh-n">{c.sh}</span></div>
      <div className="rad-w">
        <div className="radar sg" style={cv({ '--d': 100 })}>
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="98" className="rtick" /><circle cx="100" cy="100" r="88" className="rg" stroke="var(--line)" />
            <circle className="seg" cx="100" cy="100" r="88" stroke="var(--accent)" strokeDasharray="442 553" data-len="442" data-off="0" transform="rotate(-90 100 100)" style={cv({ '--d': 200 })} />
            <circle className="seg" cx="100" cy="100" r="88" stroke="var(--good)" strokeDasharray="72 553" data-len="72" data-off="-445" transform="rotate(-90 100 100)" style={cv({ '--d': 700 })} />
            <circle className="seg" cx="100" cy="100" r="88" stroke="var(--bad)" strokeDasharray="33 553" data-len="33" data-off="-520" transform="rotate(-90 100 100)" style={cv({ '--d': 1000 })} />
            <circle cx="100" cy="100" r="66" className="rl" /><circle cx="100" cy="100" r="44" className="rl" /><circle cx="100" cy="100" r="22" className="rl" />
            <line x1="100" y1="22" x2="100" y2="178" className="rl" /><line x1="22" y1="100" x2="178" y2="100" className="rl" />
          </svg>
          <span className="sweep" />
          <i className="blip" data-b="0" style={cv({ '--x': '66%', '--y': '30%' })} /><i className="blip" data-b="1" style={cv({ '--x': '70%', '--y': '66%' })} />
          <i className="blip" data-b="2" style={cv({ '--x': '32%', '--y': '70%' })} /><i className="blip" data-b="3" style={cv({ '--x': '30%', '--y': '34%' })} />
          <div className="rc"><b className="num" data-pct="">0%</b><small>{c.rc}</small></div>
        </div>
        <div className="icards">
          <div className="ic gl" data-i="3"><span className="ic-l"><i style={{ background: 'var(--vio)' }} />{pend![0]}</span><b className="num" data-cnt="23">0</b><small>{pend![1]}</small>
            <div className="ic-v"><span className="stk pend"><span className="av ic-av" /><span className="av ic-av" /><span className="av ic-av" /></span><span className="wchip"><Ic n="clock" s={11} />{pend![2]}</span></div></div>
          <div className="ic gl" data-i="0"><span className="ic-l"><i style={{ background: 'var(--accent)' }} />{oldest![0]}</span><b className="num" data-cnt="9" data-suf={c.yrs}>0</b><small>{oldest![1]}</small>
            <div className="ic-v"><span className="av ic-av" /><span className="ic-tl"><i /></span><span className="ic-m">{oldest![2]}</span></div></div>
          <div className="ic gl" data-i="1"><span className="ic-l"><i style={{ background: 'var(--ink2)' }} />{gone![0]}</span><b className="num" data-cnt="12">0</b><small>{gone![1]}</small>
            <div className="ic-v"><span className="stk gone"><span className="av ic-av" /><span className="av ic-av" /><span className="av ic-av" /><span className="av ic-av" /></span><span className="ic-m">{gone![2]}</span></div></div>
          <div className="ic gl" data-i="2"><span className="ic-l"><i style={{ background: 'var(--warn)' }} />{spree![0]}</span><b className="num" data-cnt="41">0</b><small>{spree![1]}</small>
            <div className="ic-v"><svg className="spark" viewBox="0 0 120 26" aria-hidden="true"><polyline points="0,22 12,21 24,20 36,22 48,19 60,21 72,3 84,20 96,21 108,19 120,21" /><circle cx="72" cy="3" r="3" /></svg><span className="ic-m">{spree![2]}</span></div></div>
        </div>
      </div>
      <div className="legend2 sg" style={cv({ '--d': 1500 })}>
        <span><i style={{ background: 'var(--accent)' }} />{c.legend[0]}</span><span><i style={{ background: 'var(--good)' }} />{c.legend[1]}</span><span><i style={{ background: 'var(--bad)' }} />{c.legend[2]}</span>
      </div>
    </div>
  );
}
