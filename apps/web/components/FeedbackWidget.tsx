'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { RadioGroup } from '@base-ui/react/radio-group';
import { Radio } from '@base-ui/react/radio';
import { feedbackSchema, type FeedbackSentiment } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';

const STORAGE_KEY = 'wu_feedback_submitted';

const SENTIMENTS: Array<{ value: FeedbackSentiment; emoji: string; label: string; reasons: string[] }> = [
  { value: 'angry', emoji: '😠', label: 'Angry', reasons: [
    "Couldn't get my export to work",
    'The upload or parsing broke',
    'Lost my snapshot history',
  ] },
  { value: 'sad', emoji: '😞', label: 'Sad', reasons: [
    'Confusing to use',
    'Missing a feature I needed',
    'Pro price feels high',
  ] },
  { value: 'neutral', emoji: '😐', label: 'Neutral', reasons: [
    'Works, but nothing stood out',
    'Just exploring',
  ] },
  { value: 'happy', emoji: '🙂', label: 'Happy', reasons: [
    'Found exactly who unfollowed me',
    'Clean and easy to use',
  ] },
  { value: 'delighted', emoji: '🤩', label: 'Delighted', reasons: [
    'Exactly what I needed',
    'Already recommending it',
  ] },
];

type Status = 'idle' | 'submitting' | 'success' | 'error';

function focusRing(el: HTMLElement, on: boolean) {
  el.style.boxShadow = on ? `0 0 0 2px ${T.teal}` : 'none';
}

export function FeedbackWidget() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [sentiment, setSentiment] = useState<FeedbackSentiment | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) setAlreadySubmitted(true);
    } catch { /* sessionStorage unavailable */ }
  }, []);

  if (!mounted || alreadySubmitted) return null;

  const selectedMeta = sentiment ? SENTIMENTS.find(s => s.value === sentiment) : null;

  async function handleSubmit() {
    if (!sentiment) return;
    const payload = {
      sentiment,
      reason: reason ?? undefined,
      comment: comment.trim() || undefined,
      page: pathname,
    };
    const parsed = feedbackSchema.safeParse(payload);
    if (!parsed.success) {
      setStatus('error');
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('success');
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
      setTimeout(() => setOpen(false), 2200);
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close feedback form' : 'Give feedback'}
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 1000,
          width: 48, height: 48, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #02888f, #01696f)',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(2,136,143,0.45)',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 3 L13 13 M13 3 L3 13" stroke="#f4f0e8" strokeWidth="1.6" strokeLinecap="round" /></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="#f4f0e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Feedback form"
          style={{
            position: 'fixed', bottom: 80, right: 20, zIndex: 1000,
            width: 320, maxWidth: 'calc(100vw - 32px)',
            background: T.surface1, border: `1px solid ${T.border2}`,
            borderRadius: 18, padding: '18px 18px 16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            animation: 'fade-up 0.25s cubic-bezier(0.16,1,0.3,1) both',
          }}
        >
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🙏</div>
              <p style={{ fontFamily: T.serif, fontSize: 17, color: T.ink, margin: 0 }}>Thanks for the feedback.</p>
            </div>
          ) : (
            <>
              <div style={{ fontFamily: T.serif, fontSize: 17, color: T.ink, marginBottom: 12 }}>
                How&apos;s it going so far?
              </div>

              <RadioGroup
                name="feedback-sentiment"
                aria-label="How's your experience been?"
                value={sentiment}
                onValueChange={(value) => { setSentiment(value as FeedbackSentiment); setReason(null); }}
                style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}
              >
                {SENTIMENTS.map(s => (
                  <Radio.Root
                    key={s.value}
                    value={s.value}
                    aria-label={s.label}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                      flex: 1, padding: '7px 2px', borderRadius: 10, cursor: 'pointer',
                      border: `1px solid ${sentiment === s.value ? T.teal : T.border2}`,
                      background: sentiment === s.value ? 'rgba(2,136,143,0.1)' : 'transparent',
                      transition: 'all 0.15s', outline: 'none',
                    }}
                    onFocus={e => focusRing(e.currentTarget, true)}
                    onBlur={e => focusRing(e.currentTarget, false)}
                  >
                    <span style={{ fontSize: 18 }}>{s.emoji}</span>
                    <span style={{ fontSize: 9, color: T.inkMute, fontFamily: T.mono }}>{s.label}</span>
                  </Radio.Root>
                ))}
              </RadioGroup>

              {selectedMeta && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                  {selectedMeta.reasons.map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(prev => (prev === r ? null : r))}
                      style={{
                        fontSize: 11.5, padding: '6px 10px', borderRadius: 100,
                        border: `1px solid ${reason === r ? T.teal : T.border2}`,
                        background: reason === r ? 'rgba(2,136,143,0.12)' : 'transparent',
                        color: reason === r ? T.ink : T.inkDim,
                        cursor: 'pointer', fontFamily: T.sans, outline: 'none',
                      }}
                      onFocus={e => focusRing(e.currentTarget, true)}
                      onBlur={e => focusRing(e.currentTarget, false)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}

              {sentiment && (
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Anything else? (optional)"
                  maxLength={1000}
                  rows={3}
                  style={{
                    width: '100%', marginTop: 12, padding: '9px 10px', borderRadius: 10,
                    border: `1px solid ${T.border2}`, background: T.bg, color: T.ink,
                    fontFamily: T.sans, fontSize: 13, resize: 'none', outline: 'none',
                  }}
                  onFocus={e => focusRing(e.currentTarget, true)}
                  onBlur={e => focusRing(e.currentTarget, false)}
                />
              )}

              {status === 'error' && (
                <p style={{ fontSize: 12, color: T.terra, marginTop: 10, marginBottom: 0 }}>
                  Something went wrong. Mind trying again?
                </p>
              )}

              <button
                type="button"
                disabled={!sentiment || status === 'submitting'}
                onClick={handleSubmit}
                style={{
                  width: '100%', marginTop: 14, padding: '10px 16px', borderRadius: 12,
                  border: 'none', cursor: sentiment ? 'pointer' : 'not-allowed',
                  background: sentiment ? 'linear-gradient(135deg, #02888f, #01696f)' : T.border2,
                  color: '#f4f0e8', fontFamily: T.sans, fontSize: 13.5, fontWeight: 700,
                  opacity: status === 'submitting' ? 0.7 : 1,
                  outline: 'none',
                }}
                onFocus={e => focusRing(e.currentTarget, true)}
                onBlur={e => focusRing(e.currentTarget, false)}
              >
                {status === 'submitting' ? 'Sending…' : 'Send feedback'}
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
