'use client';

import { useState } from 'react';
import { Pencil, Pin, PinOff, Trash2 } from 'lucide-react';
import { useStudio } from '../../StudioContext';
import { getMemoryContent } from './memory.content';
import type { MemNote, NoteOp } from './memoryTypes';

// One remembered note: the text, its tags, where it came from, how sure the
// coach is, and Pin / Edit / Forget. Fading notes ask to be kept.
export function NoteRow({ n, act }: { n: MemNote; act: (op: NoteOp) => Promise<boolean> }) {
  const { locale } = useStudio();
  const t = getMemoryContent(locale);
  const [edit, setEdit] = useState<string | null>(null);
  const [ask, setAsk] = useState(false);
  const [err, setErr] = useState(false);
  const at = n.sourceAt ?? n.lastConfirmedAt ?? n.createdAt;
  const date = at ? new Date(at).toLocaleDateString(locale, { day: 'numeric', month: 'short' }) : '';
  const fading = n.status === 'faded';
  const run = async (op: NoteOp) => { setErr(false); const ok = await act(op); if (!ok) setErr(true); return ok; };

  return (
    <div className={`s-note${fading ? ' fading' : ''}${n.pinned ? ' pinned' : ''}`}>
      {edit !== null ? (
        <div className="s-col" style={{ gap: 8 }}>
          <textarea className="s-note-ed" value={edit} maxLength={240} aria-label={t.edit} onChange={(e) => setEdit(e.target.value)} />
          <span className="s-row" style={{ gap: 8 }}>
            <button type="button" className="s-btn xs" disabled={!edit.trim()} onClick={() => void run({ op: 'edit', id: n.id, body: edit.trim() }).then((ok) => { if (ok) setEdit(null); })}>{t.save}</button>
            <button type="button" className="s-btn sec xs" onClick={() => setEdit(null)}>{t.cancel}</button>
          </span>
        </div>
      ) : (
        <>
          <p className="s-note-b">{n.body}</p>
          {n.examples[0] && (n.examples[0].before ? <p className="s-note-ex"><s>{n.examples[0].before}</s> {n.examples[0].after}</p> : n.examples[0].text ? <p className="s-note-ex">“{n.examples[0].text}”</p> : null)}
          <div className="s-note-meta">
            {n.tags.slice(0, 4).map((g) => <span key={g} className="s-note-tag">{g.replace(/^[a-z]+:/, '')}</span>)}
            <span>{t.from(t.sources[n.source] ?? n.source, date)}</span>
            <span className={`s-note-conf${n.origin === 'user' || n.confidence >= 0.75 ? ' sure' : ''}`}>{n.origin === 'user' ? t.yours : n.confidence >= 0.75 ? t.sure : t.guessing}</span>
          </div>
        </>
      )}
      {edit === null && (
        <div className="s-note-act">
          {fading && <button type="button" className="s-btn sec xs" onClick={() => void run({ op: 'keep', id: n.id })}>{t.keep}</button>}
          <button type="button" className="s-icb" aria-label={n.pinned ? t.unpin : t.pin} title={n.pinned ? t.unpin : t.pin} aria-pressed={n.pinned} onClick={() => void run({ op: n.pinned ? 'unpin' : 'pin', id: n.id })}>{n.pinned ? <PinOff size={14} /> : <Pin size={14} />}</button>
          <button type="button" className="s-icb" aria-label={t.edit} title={t.edit} onClick={() => setEdit(n.body)}><Pencil size={14} /></button>
          <button type="button" className="s-icb" aria-label={t.forget} title={t.forget} onClick={() => setAsk(true)}><Trash2 size={14} /></button>
        </div>
      )}
      {fading && edit === null && <span className="s-note-fade">{t.fading}</span>}
      {ask && (
        <div className="s-note-ask" role="alertdialog" aria-label={t.forget}>
          <span>{t.forgetAsk}</span>
          <span className="s-row" style={{ gap: 8 }}>
            <button type="button" className="s-btn xs" style={{ background: 'var(--bad)', color: '#fff' }} onClick={() => { setAsk(false); void run({ op: 'forget', id: n.id }); }}>{t.forgetYes}</button>
            <button type="button" className="s-btn sec xs" onClick={() => setAsk(false)}>{t.cancel}</button>
          </span>
        </div>
      )}
      {err && <span role="alert" className="s-note-err">{t.failed}</span>}
    </div>
  );
}
