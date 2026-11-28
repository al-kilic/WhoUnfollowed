import { Link } from '@/i18n/navigation';
import type { HomeCopy } from './copy';
import { Rich } from './rich';
import { Ic } from './icons';
import { cv } from './cssVars';

// Privacy: what a password app does with a login (an Instagram-style sheet,
// then what follows), next to what happens here. HomeFx loops both sides.
export function HomePrivacy({ c }: { c: HomeCopy['privacy'] }) {
  return (
    <section className="sec" id="privacy" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head rv"><span className="lab">{c.lab}</span><h2>{c.h2} <span className="h-strike">{c.strike}</span></h2></div>
        <div className="priv-wrap"><div className="priv-aura" aria-hidden="true"><i /><i /><i /></div><div className="priv rv" id="priv"><div className="priv-in">
          <div className="side them">
            <div className="who"><Ic n="x" s={16} style={{ color: 'var(--bad)' }} /><span>{c.them}</span><span className="lab">{c.themSub}</span></div>
            <div className="mock them-m" id="themM">
              <div className="asks"><span className="app3">?</span><span><Rich t={c.asks} /></span></div>
              <div className="igsheet">
                <div className="igl"><span className="igg" aria-hidden="true" /><span className="igw">Instagram</span></div>
                <div className="igs"><Rich t={c.loginTo} /></div>
                <div className="fld">{c.user}</div>
                <div className="fld"><span className="pw" id="pw" /><span className="caret2" /></div>
                <div className="lbtn" id="lbtn">{c.login}</div>
                <div className="perm"><Rich t={c.perm} /></div>
              </div>
              <div className="conseq" id="conseq">
                {c.cq.map(([b, s], i) => (
                  <div key={b} className="cq" style={cv({ '--i': i })}>
                    <span className={`cqi${i === 1 ? ' bad' : i === 2 ? ' warn' : ''}`}>{i === 0 ? 'IG' : i === 1 ? '!' : <Ic n="dl" s={12} />}</span>
                    <span><b>{b}</b><small>{s}</small></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="side us">
            <div className="who"><Ic n="check" s={16} style={{ color: 'var(--accent)' }} />WhoUnfollowed<span className="lab">{c.usSub}</span></div>
            <div className="mock br" id="usM">
              <div className="url"><Ic n="lock" s={12} />whounfollowed.co<span className="tabn">{c.tab}</span></div>
              <div className="file"><span className="ic">ZIP</span><span style={{ flex: 1, display: 'grid', gap: 6 }}><span>{c.file}</span><span className="pb"><i id="pb" /></span></span></div>
              <div className="nettab"><div className="nt-h"><span>{c.net}</span><b className="num">{c.netN}</b></div><div className="nt-empty">{c.netEmpty}</div></div>
              <div className="conseq ok" id="uconseq">
                {c.ucq.map(([b, s], i) => (
                  <div key={b} className="cq" style={cv({ '--i': i })}>
                    <span className={`cqi ${i === 2 ? 'acc' : 'okc'}`}>{i === 0 ? <Ic n="check" s={12} /> : i === 1 ? '84' : <Ic n="lock" s={12} />}</span>
                    <span><b>{b}</b><small>{s}</small></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="ticks">
            {c.ticks.map(([b, s]) => <div key={b} className="tk"><span className="row3"><Ic n="check" s={16} />{b}</span><span>{s}</span></div>)}
          </div>
          <div className="cmp-cta"><Link className="btn sec cmp-b" href="/compare"><span>{c.cmp}</span><Ic n="arrow" s={14} /></Link><span>{c.cmpSub}</span></div>
        </div></div></div>
      </div>
    </section>
  );
}
