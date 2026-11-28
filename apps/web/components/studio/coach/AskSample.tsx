'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Eye, Lock } from 'lucide-react';
import { useStudio } from '../StudioContext';
import { getStudioCoachContent } from './studioCoach.content';
import { staticAskAnswer } from './askAnswers.content';

interface Msg { r: 'u' | 'c'; t: string }

// Ask coach for visitors without Pro AI: each starter question plays its own
// labelled written answer (askAnswers.content.ts). Nothing typed here is sent anywhere.
export function AskSample({ picked }: { picked: string | null }) {
  const { locale, openUpgrade } = useStudio();
  const a = getStudioCoachContent(locale).ask;
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [shown, setShown] = useState<string | null>(null);

  function sample(q: string) {
    setMsgs([{ r: 'u', t: q }]);
    setTyping(true);
    setTimeout(() => { setTyping(false); setMsgs([{ r: 'u', t: q }, { r: 'c', t: staticAskAnswer(locale, q)?.answer ?? a.sample.a }]); }, 900);
  }
  if (picked && picked !== shown) { setShown(picked); sample(picked); }
  const logo = <Image src="/logo.png" alt="" width={18} height={18} />;
  const questions = [a.sample.q, ...a.points].slice(0, 4);

  return (
    <section className="s-card s-conv">
      <div className="s-msgs">
        {msgs.length === 0 && !typing ? (
          <div className="s-cempty">
            <span className="s-cav lg"><Image src="/logo.png" alt="" width={32} height={32} /></span>
            <h2 style={{ fontSize: 19, fontWeight: 600, margin: 0 }}>{a.emptyTitle}</h2>
            <span className="s-sub-t">{a.emptySub}</span>
            <div className="s-grid s-g2" style={{ width: '100%', maxWidth: 520, gap: 10 }}>
              {questions.map((q) => (
                <button key={q} type="button" className="s-card s-sugq" onClick={() => sample(q)}>
                  <span>{q}</span><span className="s-sub-t s-row" style={{ fontSize: 11.5, gap: 4, flex: 'none' }}><Eye size={12} />{a.sampleTag}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {msgs.map((m, i) => (
              <div key={i} className={`s-m ${m.r}`}>
                {m.r === 'c' && <span className="s-cav">{logo}</span>}
                <div className="s-col" style={{ gap: 4, minWidth: 0 }}>
                  <div className="s-bub">{m.t}</div>
                  {m.r === 'c' && <span className="s-sub-t s-row" style={{ fontSize: 12, gap: 4 }}><Eye size={12} />{a.sampleNote}</span>}
                </div>
              </div>
            ))}
            {typing && <div className="s-m c"><span className="s-cav">{logo}</span><div className="s-bub s-typing"><span /><span /><span /></div></div>}
          </>
        )}
      </div>
      <div className="s-composer">
        {msgs.length > 0 && <div className="s-row" style={{ overflowX: 'auto' }}>{a.points.map((q) => <button key={q} type="button" className="s-chip2" onClick={() => sample(q)}>{q}</button>)}</div>}
        <div className="s-cbox">
          <textarea rows={1} placeholder={a.lockedPh} aria-label={a.placeholder} readOnly />
          <button type="button" className="s-btn xs acc" onClick={() => openUpgrade('ask')}><Lock size={12} />{a.unlockAsk}</button>
        </div>
        <div className="s-cnote"><Lock size={13} /><span>{a.note}</span></div>
      </div>
    </section>
  );
}
