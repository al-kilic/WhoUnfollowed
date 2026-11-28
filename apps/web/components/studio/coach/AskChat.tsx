'use client';

import { Fragment, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useShownPlatform } from '@/hooks/useShownPlatform';
import Image from 'next/image';
import type { AiChat } from '@ig-tracker/core';
import { ArrowUp, Lock, Sparkles } from 'lucide-react';
import { postStream } from '@/app/[locale]/coach/api';
import { CoachSeen, type Seen } from './CoachSeen';
import { isSampleOn } from '@/lib/sample/sampleMode';
import { getSampleSeen } from '@/lib/sample/coach/seen';
import { getCoachContent } from '@/app/[locale]/coach/content';
import { contextTurns } from '@/hooks/useChats';
import type { ChatRecord, ChatTurnRecord } from '@/lib/db';
import { useStudio } from '../StudioContext';
import { getStudioCoachContent } from './studioCoach.content';
import { AiError } from './AiError';
import { AskAttachButton, AskAttachChips } from './AskAttach';
import { useAskAttachments } from './useAskAttachments';

// One answer: short paragraphs, and lines starting with "- " as a list.
function Answer({ text }: { text: string }) {
  const blocks: { list: boolean; lines: string[] }[] = [];
  for (const line of text.split('\n').map((l) => l.trim()).filter(Boolean)) {
    const list = line.startsWith('- ');
    const last = blocks[blocks.length - 1];
    if (last && last.list === list && list) last.lines.push(line.slice(2));
    else blocks.push({ list, lines: [list ? line.slice(2) : line] });
  }
  return <>{blocks.map((b, i) => (b.list
    ? <ul key={i} style={{ margin: '4px 0', paddingLeft: 18, display: 'grid', gap: 3 }}>{b.lines.map((l, j) => <li key={j}>{l}</li>)}</ul>
    : <p key={i} style={{ margin: i ? '6px 0 0' : 0 }}>{b.lines[0]}</p>))}</>;
}

// Ask coach for Pro AI members: the conversation, follow-up chips, a deeper
// answer on the last reply, and the composer.
export function AskChat({ chat, append, initial }: { chat: ChatRecord | null; append: (t: ChatTurnRecord[]) => Promise<unknown>; initial: string }) {
  const { locale, userId } = useStudio();
  // The coach answers about the platform on screen (Instagram by default).
  const shown = useShownPlatform(userId);
  const a = getStudioCoachContent(locale).ask;
  const errors = getCoachContent(locale).errors;
  const [draft, setDraft] = useState(initial);
  // Photos, an export report or other Studio data attached to the next question.
  const att = useAskAttachments(userId, shown.platform, locale);
  const [pending, setPending] = useState<{ q: string; deep: boolean; live?: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const turns = chat?.turns ?? [];
  // What the coach saw for the latest answer in this visit (not stored with the chat).
  const [seen, setSeen] = useState<Seen | null>(() => (isSampleOn() ? getSampleSeen() : null));
  const pendingQ = pending?.q, streaming = Boolean(pending?.live);
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [turns.length, pendingQ, streaming]);
  useEffect(() => { setErr(null); }, [chat?.id]);

  async function ask(q: string, deep = false) {
    const text = q.trim();
    if (!text || pending) return;
    setPending({ q: text, deep }); setErr(null);
    if (!deep) setDraft('');
    const attachments = deep ? undefined : att.payload;
    const res = await postStream<AiChat>('/api/ai/chat', { messages: contextTurns([...turns, { role: 'user', text }]), deep, locale, platform: shown.platform, ...(attachments ? { attachments } : {}) },
      (live) => setPending((p) => (p ? { ...p, live } : p)));
    if (!res.ok) {
      setPending(null);
      setErr(errors[res.error as keyof typeof errors] ?? errors.failed);
     
      if (!deep) setDraft(text);
      return;
    }
    setSeen(res.seen ?? null);
    if (attachments) att.clear();
   
    await append([{ role: 'user', text, deep }, { role: 'coach', text: res.data.answer, deep, followUps: res.data.followUps }]);
    setPending(null);
  }
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void ask(draft); } };
  const logo = <span className="s-cav"><Image src="/logo.png" alt="" width={18} height={18} /></span>;
  const lastCoach = turns.length - 1;
  const lastQ = [...turns].reverse().find((t) => t.role === 'user')?.text ?? '';
  const follow = turns[lastCoach]?.role === 'coach' ? turns[lastCoach]!.followUps ?? [] : [];
  const starters = [a.sample.q, ...a.points].slice(0, 4);

  return (
    <section className="s-card s-conv">
      <div className="s-msgs" aria-live="polite">
        {turns.length === 0 && !pending ? (
          <div className="s-cempty">
            <span className="s-cav lg"><Image src="/logo.png" alt="" width={32} height={32} /></span>
            <h2 style={{ fontSize: 19, fontWeight: 600, margin: 0 }}>{a.emptyTitle}</h2>
            <span className="s-sub-t">{a.emptySub}</span>
            <div className="s-grid s-g2" style={{ width: '100%', maxWidth: 520, gap: 10 }}>
              {starters.map((q) => <button key={q} type="button" className="s-card s-sugq" onClick={() => void ask(q)}><span>{q}</span></button>)}
            </div>
          </div>
        ) : (
          <>
            {turns.map((t, i) => (
              <Fragment key={i}>
                {t.role === 'user'
                  ? (t.deep && turns[i - 2]?.text === t.text
                    ? <span className="s-sub-t s-row" style={{ justifyContent: 'center', fontSize: 12, gap: 4 }}><Sparkles size={12} />{a.deepTag}</span>
                    : <div className="s-m u"><div className="s-bub">{t.text}</div></div>)
                  : (
                    <div className="s-m c">{logo}
                      <div className="s-col" style={{ gap: 6, minWidth: 0 }}>
                        <div className="s-bub">{t.deep && <span className="s-badge" style={{ marginBottom: 6 }}><Sparkles size={11} />{a.deepTag}</span>}<Answer text={t.text} /></div>
                        {i === lastCoach && !pending && <CoachSeen seen={seen} />}
                        {i === lastCoach && !t.deep && !pending && (
                          <button type="button" className="s-btn sec xs" style={{ alignSelf: 'flex-start' }} title={a.deeperHint} onClick={() => void ask(lastQ, true)}><Sparkles size={13} />{a.deeper}</button>
                        )}
                      </div>
                    </div>
                  )}
              </Fragment>
            ))}
            {pending && <>
              {!pending.deep && <div className="s-m u"><div className="s-bub">{pending.q}</div></div>}
              <div className="s-m c">{logo}{pending.live ? <div className="s-bub"><Answer text={pending.live} /></div> : <div className="s-bub s-typing"><span /><span /><span /></div>}</div>
            </>}
          </>
        )}
        <div ref={end} />
      </div>
      <div className="s-composer">
        {follow.length > 0 && !pending && <div className="s-row" style={{ overflowX: 'auto' }}>{follow.map((q) => <button key={q} type="button" className="s-chip2" onClick={() => void ask(q)}>{q}</button>)}</div>}
        <AiError text={err} />
        <AskAttachChips att={att} locale={locale} />
        <form className="s-cbox" onSubmit={(e) => { e.preventDefault(); void ask(draft); }}>
          <AskAttachButton att={att} locale={locale} disabled={!!pending} />
          <textarea rows={1} value={draft} maxLength={1000} placeholder={a.placeholder} aria-label={a.placeholder} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKey} />
          <button type="submit" className="s-btn send" aria-label={a.send} disabled={!draft.trim() || !!pending}><ArrowUp size={16} /></button>
        </form>
        <div className="s-cnote" style={{ flexWrap: 'wrap' }}>
          <span className="s-row" style={{ gap: 6 }}><Lock size={13} /><span>{a.note}</span></span>
        </div>
      </div>
    </section>
  );
}
