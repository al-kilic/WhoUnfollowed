'use client';

import { useEffect, useState } from 'react';
import { Eye, Lock, MessageCircle, Sparkles, SquarePen, Trash2 } from 'lucide-react';
import { useChats } from '@/hooks/useChats';
import type { ChatRecord } from '@/lib/db';
import { isSampleOn } from '@/lib/sample/sampleMode';
import { getSampleCoach } from '@/lib/sample/coach';
import { useStudio } from '../StudioContext';
import { PageHead } from '../PageHead';
import { getStudioCoachContent } from './studioCoach.content';
import { AskChat } from './AskChat';
import { AskSample } from './AskSample';

// Studio > Ask coach. Pro AI members chat with the coach (part of the
// monthly coach use; no counts shown). Chats are kept in this browser
// only. Visitors without Pro AI see that asking is part of Pro AI and can play
// labelled sample answers.
export function AskPage() {
  const { c, locale, hasProAi, openUpgrade, userId } = useStudio();
  const a = getStudioCoachContent(locale).ask;
  // Sample mode: three example chats about the made-up account, in memory only.
  const [seed] = useState<ChatRecord[] | null>(() => (isSampleOn() ? sampleChats(locale) : null));
  const chats = useChats(userId ?? 'me', seed);
  const [picked, setPicked] = useState<string | null>(null);
  const [initial, setInitial] = useState<string | null>(null);
  // A question handed over from Today (?q=...) lands in the box, not sent.
  useEffect(() => {
    try { setInitial(new URLSearchParams(window.location.search).get('q')?.slice(0, 1000) ?? ''); } catch { setInitial(''); }
  }, []);

  const status = hasProAi
    ? <span className="s-badge"><MessageCircle size={12} />{a.included}</span>
    : <button type="button" className="s-badge acc" onClick={() => openUpgrade('ask')}><Lock size={11} />{c.lock.proAi}</button>;

  return (
    <>
      <PageHead title={c.nav.ask} sub={a.body} actions={<>
        {status}
        <button type="button" className="s-btn sec" onClick={() => (hasProAi ? chats.startNew() : setPicked(null))}><SquarePen size={14} />{a.newChat}</button>
      </>} />
      <div className={hasProAi ? 's-nextci' : 's-lockbar'}>
        <Sparkles size={16} />
        <span style={{ flex: '1 1 220px' }}>{hasProAi ? a.proLine : a.freeLine}</span>
        {!hasProAi && <button type="button" className="s-btn xs acc" onClick={() => openUpgrade('ask')}>{a.unlockAsk}</button>}
      </div>
      <div className="s-chat">
        <aside className="s-card s-threads">
          <div className="s-hd"><h3 className="s-h3">{a.chats}</h3>{!hasProAi && <span className="s-sub-t" style={{ fontSize: 12 }}>{a.sampleTag}</span>}</div>
          {hasProAi ? (
            chats.chats.length === 0
              ? <p className="s-sub-t" style={{ margin: 0, padding: '10px 14px', fontSize: 13 }}>{a.noChats}</p>
              : chats.chats.map((t) => (
                <div key={t.id} className={`s-th s-row${chats.current?.id === t.id ? ' on' : ''}`} style={{ gap: 6 }}>
                  <button type="button" style={{ all: 'unset', cursor: 'pointer', flex: 1, minWidth: 0 }} onClick={() => chats.open(t.id)}>
                    <b style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</b>
                    <span className="s-sub-t" style={{ fontSize: 12 }}>{new Date(t.updatedAt).toLocaleDateString(locale, { day: 'numeric', month: 'short' })}</span>
                  </button>
                  <button type="button" className="s-ib" aria-label={`${a.removeChat}: ${t.title}`} onClick={() => void chats.remove(t.id)}><Trash2 size={13} /></button>
                </div>
              ))
          ) : a.threads.map((t) => (
            <button key={t.t} type="button" className={`s-th${picked === t.t ? ' on' : ''}`} onClick={() => setPicked(t.t)}><b>{t.t}</b><span className="s-sub-t s-row" style={{ fontSize: 12, gap: 4 }}><Eye size={11} />{a.sampleTag}</span></button>
          ))}
        </aside>
        {hasProAi
          ? (initial !== null && <AskChat key={chats.current?.id ?? 'new'} chat={chats.current} append={chats.append} initial={chats.current ? '' : initial} />)
          : <AskSample picked={picked} />}
      </div>
    </>
  );
}

function sampleChats(locale: string): ChatRecord[] {
  return getSampleCoach(locale).chats.map((c, i) => ({
    id: `sample-chat-${i}`, owner: 'sample', title: c.title, updatedAt: Date.now() - i * 86_400_000,
    turns: c.turns.flatMap((t) => [{ role: 'user' as const, text: t.q }, { role: 'coach' as const, text: t.a.answer, followUps: t.a.followUps }]),
  }));
}
