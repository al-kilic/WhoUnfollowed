import { CHAPTER_STARTS, EXPORT_VIDEO } from '@/components/exportVideo/videoChapters';
import { META_EXPORT } from '@/components/site/header/links';
import type { HomeCopy } from './copy';
import { Ic } from './icons';

// How it works: three small looping scenes, then the real export video,
// which plays muted from 0:03 while it's on screen (HomeFx).
const CHAPTERS = [0, 2, 3, 4, 5].map((i) => CHAPTER_STARTS[i]!);
const clock = (t: number) => `0:${String(Math.floor(t)).padStart(2, '0')}`;

export function HomeFlow({ c }: { c: HomeCopy['flow'] }) {
  const [s1, s2, s3] = c.steps;
  return (
    <section className="sec" id="flow">
      <div className="wrap">
        <div className="sec-head c rv"><span className="lab">{c.lab}</span><h2>{c.h2}</h2></div>
        <div className="hiw" id="hiw">
          <div className="hline"><i /></div>
          <div className="hs">
            <div className="mini-v"><div className="ac"><span className="t" /><span className="it">{c.menu[0]}</span><span className="it tg">{c.menu[1]}</span><span className="it">{c.menu[2]}</span></div><span className="cursor"><Ic n="cursor" s={16} /></span></div>
            <span className="k">01</span><h3>{s1![0]}</h3><p>{s1![1]}</p>
            <a className="go" href={META_EXPORT} target="_blank" rel="noopener noreferrer">{c.openMeta}</a>
          </div>
          <div className="hs">
            <div className="mini-v"><div className="tg-list">
              <div className="tgl">{c.toggles[0]}<span className="sw on" /></div><div className="tgl at">{c.toggles[1]}<span className="sw" /></div><div className="tgl">{c.toggles[2]}<span className="sw on" /></div>
            </div></div>
            <span className="k">02</span><h3>{s2![0]}</h3><p>{s2![1]}</p>
          </div>
          <div className="hs">
            <div className="mini-v"><span className="zip">ZIP</span><span className="zbox" /><span className="zok"><Ic n="check" s={12} /></span></div>
            <span className="k">03</span><h3>{s3![0]}</h3><p>{s3![1]}</p>
            <a className="go" href="#upload">{c.goUpload}</a>
          </div>
        </div>
        <div className="vid rv" id="video">
          <video id="vid" src={EXPORT_VIDEO.src} poster={EXPORT_VIDEO.poster} controls playsInline muted preload="metadata" />
          <div className="vinfo"><span className="lab">{c.vLab}</span><h3>{c.vH}</h3>
            <div className="chaps" id="chaps">
              {c.chapters.map((t, i) => <button key={t} type="button" data-t={CHAPTERS[i]}><span>{t}</span><span className="mono">{clock(CHAPTERS[i]!)}</span></button>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
