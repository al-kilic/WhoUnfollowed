import type { HomeCopy } from './copy';
import { SceneResults, SceneUnfollowers } from './ToolScenes';
import { SceneRadar } from './ToolRadar';
import { SceneGrowth } from './ToolGrowth';

// "What you get": the steps scroll on the left while one glass window
// stays pinned on the right and plays each tool's scene (HomeFx drives it).
// On phones each step gets its own copy of the scene.
export function HomeTools({ c, locale }: { c: HomeCopy['tools']; locale: string }) {
  return (
    <section className="sec" id="tools">
      <div className="wrap">
        <div className="sec-head rv"><span className="lab">{c.lab}</span><h2>{c.h2}</h2></div>
        <div className="tools">
          <div className="steps" id="steps">
            {c.steps.map(([h3, p], i) => (
              <div key={h3} className={`st${i === 0 ? ' on' : ''}`} data-scene={i} data-lab={c.labs[i]}>
                <span className="idx"><b>{`0${i + 1}`}</b> / 04</span>
                <div className="tag"><span className="pill acc">{i === 0 ? c.free : 'Pro AI'}</span></div>
                <h3>{h3}</h3><p>{p}</p>
                <div className="mobile-scene" data-ms={i} />
              </div>
            ))}
          </div>
          <div className="stage-wrap"><div className="stage"><div className="t-aura" aria-hidden="true"><i /><i /><i /></div>
            <div className="win" id="stageWin">
              <div className="win-bar"><span className="dots"><i /><i /><i /></span><span className="lab" id="stageLab">{c.labs[0]}</span></div>
              <SceneResults c={c.r} />
              <SceneUnfollowers c={c.u} locale={locale} />
              <SceneRadar c={c.rd} />
              <SceneGrowth c={c.g} locale={locale} />
              <div className="rail"><i id="rail" /></div>
            </div>
          </div></div>
        </div>
      </div>
    </section>
  );
}
