'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { feedbackSchema, type FeedbackSentiment } from '@ig-tracker/core';
import { getFeedbackWidgetContent } from '@/components/feedbackWidget.content';
import { useSampleStore } from '@/lib/sample/sampleMode';
import { useStudio } from '../StudioContext';

// Asked once, right after a real parse: how it went, one quick reason, an
// optional note. Same /api/feedback as the old results page (DB + Telegram).
// Hidden in sample mode, and for good once sent or dismissed.
const DONE_KEY = 'wu_results_feedback_done';
const NOT_NOW: Record<string, string> = { en: 'Not now', es: 'Ahora no', pt: 'Agora não' };

export function ResultsFeedback() {
  const { locale } = useStudio();
  const c = getFeedbackWidgetContent(locale);
  const sample = useSampleStore((s) => s.on);
  const page = usePathname();
  const [show, setShow] = useState(false);
  const [mood, setMood] = useState<FeedbackSentiment | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    try { if (!localStorage.getItem(DONE_KEY)) setShow(true); } catch { /* storage blocked: skip */ }
  }, []);
  if (!show || sample) return null;

  const close = () => { try { localStorage.setItem(DONE_KEY, '1'); } catch { /* ignore */ } setShow(false); };
  const meta = mood ? c.sentiments.find((s) => s.value === mood) : null;
  const send = async () => {
    const body = feedbackSchema.safeParse({ sentiment: mood, reason: reason ?? undefined, comment: comment.trim() || undefined, page });
    if (!body.success) return;
    setStatus('sending');
    try {
      const r = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body.data) });
      if (!r.ok) throw new Error('failed');
      setStatus('sent');
      try { localStorage.setItem(DONE_KEY, '1'); } catch { /* ignore */ }
    } catch { setStatus('error'); }
  };

  if (status === 'sent') return <section className="s-card s-fb" role="status"><p className="s-fb-ok">{c.thanks}</p></section>;

  return (
    <section className="s-card s-fb" aria-label={c.dialogAriaLabel}>
      <div className="s-fb-h">
        <b>{c.howsItGoing}</b>
        <button type="button" className="s-fb-x" onClick={close} aria-label={NOT_NOW[locale] ?? NOT_NOW.en}><X size={14} /></button>
      </div>
      <div className="s-fb-moods" role="radiogroup" aria-label={c.radioGroupAriaLabel}>
        {c.sentiments.map((s) => (
          <button key={s.value} type="button" role="radio" aria-checked={mood === s.value} aria-label={s.label} title={s.label}
            className={mood === s.value ? 'on' : undefined} onClick={() => { setMood(s.value); setReason(null); }}>
            <span aria-hidden="true">{s.emoji}</span>
          </button>
        ))}
      </div>
      {meta && (
        <div className="s-col s-fb-more">
          <span className="s-sub-t">{c.pickReason}</span>
          <div className="s-fb-reasons">
            {meta.reasons.map((r) => (
              <button key={r} type="button" className={`s-chip2${reason === r ? ' on' : ''}`} aria-pressed={reason === r} onClick={() => setReason(r)}>{r}</button>
            ))}
          </div>
          {reason && (
            <>
              <textarea className="s-fb-c" rows={2} maxLength={1000} value={comment} onChange={(e) => setComment(e.target.value)} placeholder={c.commentPlaceholder} aria-label={c.commentPlaceholder} />
              {status === 'error' && <span className="s-fb-err" role="alert">{c.errorMessage}</span>}
              <button type="button" className="s-btn" onClick={send} disabled={status === 'sending'}>{status === 'sending' ? c.sending : c.sendFeedback}</button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
