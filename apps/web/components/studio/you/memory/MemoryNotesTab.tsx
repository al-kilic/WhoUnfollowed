'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStudio } from '../../StudioContext';
import { getMemoryContent } from './memory.content';
import { ADD_TYPES, GROUPS, grouped, type MemNote, type NoteOp, type NotesPayload } from './memoryTypes';
import { NoteRow } from './NoteRow';
import { getTeachContent } from './teach.content';

// Notes: disagreements first, then every group, then a way to add one.
export function MemoryNotesTab({ data, act }: { data: NotesPayload; act: (op: NoteOp) => Promise<boolean> }) {
  const { locale } = useStudio();
  const t = getMemoryContent(locale);
  const byId = new Map(data.notes.map((n) => [n.id, n]));
  const pairs = data.disputed.map(([a, b]) => [byId.get(a), byId.get(b)]).filter((p): p is [MemNote, MemNote] => !!p[0] && !!p[1]);
  const groups = grouped(data.notes);
  const k = getTeachContent(locale);

  return (
    <div className="s-col" style={{ gap: 14 }}>
      <div><h2 className="s-teach-h">{k.knowsTitle}</h2><p className="s-sub-t" style={{ margin: '2px 0 0' }}>{k.knowsSub}</p></div>
      {pairs.map(([a, b]) => (
        <section key={`${a.id}-${b.id}`} className="s-card s-pad s-dispute">
          <b>{t.disputeTitle}</b>
          <span className="s-sub-t" style={{ fontSize: 12.5 }}>{t.disputeBody}</span>
          <div className="s-dispute-g">
            {[[a, b], [b, a]].map(([keep, drop]) => (
              <button key={keep!.id} type="button" className="s-dispute-o" onClick={() => void act({ op: 'resolve', id: drop!.id, keepId: keep!.id })}>
                <span>{keep!.body}</span><span className="s-btn sec xs">{t.thisOne}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
      {GROUPS.map((g) => (
        <section key={g} className="s-card">
          <div className="s-hd"><b>{t.groups[g]}</b><span className="s-sub-t" style={{ fontSize: 12 }}>{groups[g].length || ''}</span></div>
          <div className="s-notes">
            {groups[g].length ? groups[g].map((n) => <NoteRow key={n.id} n={n} act={act} />) : <p className="s-pad s-sub-t" style={{ margin: 0, fontSize: 13 }}>{t.groupEmpty}</p>}
          </div>
        </section>
      ))}
      <AddNote act={act} />
    </div>
  );
}

function AddNote({ act }: { act: (op: NoteOp) => Promise<boolean> }) {
  const { locale } = useStudio();
  const t = getMemoryContent(locale);
  const [body, setBody] = useState('');
  const [type, setType] = useState('fact');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const add = async () => {
    const ok = await act({ op: 'add', body: body.trim(), type });
    setMsg({ ok, text: ok ? t.added : t.failed });
    if (ok) setBody('');
  };
  return (
    <section className="s-card s-pad s-col" style={{ gap: 10 }}>
      <b>{t.addTitle}</b>
      <div className="s-addnote">
        <input value={body} maxLength={240} placeholder={t.addPlaceholder} aria-label={t.addTitle} onChange={(e) => { setBody(e.target.value); setMsg(null); }}
          onKeyDown={(e) => { if (e.key === 'Enter' && body.trim()) void add(); }} />
        <select value={type} aria-label={t.addType} onChange={(e) => setType(e.target.value)}>
          {ADD_TYPES.map(([ty, g]) => <option key={ty} value={ty}>{t.groups[g]}</option>)}
        </select>
        <button type="button" className="s-btn xs" disabled={!body.trim()} onClick={() => void add()}><Plus size={13} />{t.add}</button>
      </div>
      {msg && <span role="status" style={{ fontSize: 13, color: msg.ok ? 'var(--good)' : 'var(--bad)' }}>{msg.text}</span>}
    </section>
  );
}
