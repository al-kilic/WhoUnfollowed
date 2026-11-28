'use client';

import { useState } from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { aiThumbChips } from '@ig-tracker/core';
import { sendSignal } from '@/lib/ai/signalClient';
import { useStudio } from '../StudioContext';
import { getAnswerThumbsContent } from './answerThumbs.content';

type Action = 'read' | 'draft' | 'check' | 'ideas' | 'chat' | 'plan' | 'insights';
type Chip = (typeof aiThumbChips)[number];

// Thumbs under a coach answer. A thumbs down asks what was off, in one tap.
// Saved as a signal (Pro AI only, never in sample mode) so the coach can learn.
export function AnswerThumbs({ action, logId }: { action: Action; logId?: string | null }) {
  const { locale } = useStudio();
  const t = getAnswerThumbsContent(locale);
  const [vote, setVote] = useState<'up' | 'down' | null>(null);
  const [chip, setChip] = useState<Chip | null>(null);
  const contentLogId = logId && /^[0-9a-f-]{36}$/i.test(logId) ? logId : null;
  const send = (up: boolean, c: Chip | null) => sendSignal({ kind: 'thumb', action, contentLogId, up, chip: c });

  const pick = (v: 'up' | 'down') => {
    if (vote) return;
    setVote(v);
    if (v === 'up') send(true, null);
  };
  const pickChip = (c: Chip) => { if (chip) return; setChip(c); send(false, c); };

  return (
    <div className="s-thumbs" role="group" aria-label={t.ask}>
      {!vote ? (
        <>
          <span className="s-sub-t">{t.ask}</span>
          <button type="button" className="s-thumb" aria-label={t.up} onClick={() => pick('up')}><ThumbsUp size={14} /></button>
          <button type="button" className="s-thumb" aria-label={t.down} onClick={() => pick('down')}><ThumbsDown size={14} /></button>
        </>
      ) : vote === 'down' && !chip ? (
        <>
          <span className="s-sub-t">{t.why}</span>
          {aiThumbChips.map((c) => <button key={c} type="button" className="s-chip" onClick={() => pickChip(c)}>{t.chips[c]}</button>)}
        </>
      ) : <span className="s-sub-t" role="status">{t.thanks}</span>}
    </div>
  );
}
