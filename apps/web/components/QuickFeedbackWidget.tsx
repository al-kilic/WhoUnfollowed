'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { T } from '@/components/landing/tokens';
import { EN_QUICK_FEEDBACK_WIDGET, type QuickFeedbackWidgetContent } from '@/components/quickFeedbackWidget.content';

const STORAGE_KEY = 'wu_quick_feedback_submitted';

type Status = 'idle' | 'submitting' | 'success' | 'error';

function focusRing(el: HTMLElement, on: boolean) {
  el.style.boxShadow = on ? `0 0 0 2px ${T.teal}` : 'none';
}

// Homepage-only counterpart to FeedbackWidget (which shows on /results and
// /dashboard, after someone has actually used the product). A homepage
// visitor has no "how's it going" context yet, so this skips the sentiment
// picker: just a free-text box and an optional email, straight to /api/contact.
export function QuickFeedbackWidget({ content: c = EN_QUICK_FEEDBACK_WIDGET }: { content?: QuickFeedbackWidgetContent } = {}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(() => {
    if (typeof window === 'undefined') return false;
    try { return sessionStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
  });

  if (alreadySubmitted) return null;

  async function handleSubmit() {
    setErrorMsg(null);
    const trimmedMessage = message.trim();
    const trimmedEmail = email.trim();

    if (!trimmedMessage) {
      setErrorMsg(c.errorMissingMessage);
      return;
    }
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg(c.errorInvalidEmail);
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Email is genuinely optional here (unlike /contact's form) — omit
          // it entirely rather than sending a placeholder when left blank.
          ...(trimmedEmail ? { email: trimmedEmail } : {}),
          message: trimmedMessage,
          source: 'homepage_widget',
          page: pathname,
        }),
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('success');
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
      setTimeout(() => { setOpen(false); setAlreadySubmitted(true); }, 2200);
    } catch {
      setStatus('error');
      setErrorMsg(c.errorGeneric);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label={open ? c.ariaToggleClose : c.ariaToggleOpen}
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
          aria-label={c.dialogAriaLabel}
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
              <p style={{ fontFamily: T.serif, fontSize: 17, color: T.ink, margin: 0 }}>{c.thanks}</p>
            </div>
          ) : (
            <>
              <div style={{ fontFamily: T.serif, fontSize: 17, color: T.ink, marginBottom: 4 }}>
                {c.heading}
              </div>
              <p style={{ fontSize: 12.5, color: T.inkMute, margin: '0 0 12px', lineHeight: 1.5 }}>
                {c.subheading}
              </p>

              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={c.messagePlaceholder}
                maxLength={2000}
                rows={3}
                autoFocus
                style={{
                  width: '100%', padding: '9px 10px', borderRadius: 10,
                  border: `1px solid ${T.border2}`, background: T.bg, color: T.ink,
                  fontFamily: T.sans, fontSize: 13, resize: 'none', outline: 'none',
                }}
                onFocus={e => focusRing(e.currentTarget, true)}
                onBlur={e => focusRing(e.currentTarget, false)}
              />

              <label style={{ display: 'block', marginTop: 10 }}>
                <span style={{ display: 'block', fontSize: 11, color: T.inkMute, marginBottom: 5 }}>
                  {c.emailLabel} <span style={{ opacity: 0.8 }}>({c.emailOptional})</span>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  maxLength={320}
                  style={{
                    width: '100%', padding: '9px 10px', borderRadius: 10,
                    border: `1px solid ${T.border2}`, background: T.bg, color: T.ink,
                    fontFamily: T.sans, fontSize: 13, outline: 'none',
                  }}
                  onFocus={e => focusRing(e.currentTarget, true)}
                  onBlur={e => focusRing(e.currentTarget, false)}
                />
              </label>

              {errorMsg && (
                <p style={{ fontSize: 12, color: T.terra, marginTop: 10, marginBottom: 0 }}>
                  {errorMsg}
                </p>
              )}

              <button
                type="button"
                disabled={status === 'submitting'}
                onClick={handleSubmit}
                style={{
                  width: '100%', marginTop: 14, padding: '10px 16px', borderRadius: 12,
                  border: 'none', cursor: status === 'submitting' ? 'default' : 'pointer',
                  background: 'linear-gradient(135deg, #02888f, #01696f)',
                  color: '#f4f0e8', fontFamily: T.sans, fontSize: 13.5, fontWeight: 700,
                  opacity: status === 'submitting' ? 0.7 : 1,
                  outline: 'none',
                }}
                onFocus={e => focusRing(e.currentTarget, true)}
                onBlur={e => focusRing(e.currentTarget, false)}
              >
                {status === 'submitting' ? c.sending : c.send}
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
