'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { T } from '@/components/landing/tokens';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';
import type { ContactContent as ContactContentData } from './content';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactContent({ content }: { content: ContactContentData }) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const EMAIL = 'hello@whounfollowed.co';

  function copyEmail() {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const subject = selectedTopic
    ? `[${content.topics.find(t => t.id === selectedTopic)?.label}] WhoUnfollowed`
    : 'WhoUnfollowed';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedEmail) {
      setErrorMsg(content.form.errorMissingEmail);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg(content.form.errorInvalidEmail);
      return;
    }
    if (!trimmedMessage) {
      setErrorMsg(content.form.errorMissingMessage);
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: trimmedEmail,
          message: trimmedMessage,
          topic: selectedTopic ? content.topics.find(t => t.id === selectedTopic)?.label : undefined,
          source: 'contact_page',
          page: pathname,
        }),
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg(content.form.errorGeneric);
    }
  }

  function resetForm() {
    setName('');
    setEmail('');
    setMessage('');
    setStatus('idle');
    setErrorMsg(null);
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav />

      <main className="px-4 sm:px-8" style={{ maxWidth: 640, margin: '0 auto', paddingTop: 64, paddingBottom: 96 }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16 }}>{content.eyebrow}</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 16 }}>
            {content.headline}
          </h1>
          <p style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.65 }}>
            {content.intro}
          </p>
          <p style={{ fontSize: 13, color: T.inkMute, marginTop: 10 }}>
            {content.quickQuestionPrefix}{' '}
            <Link href="/how-to-export" style={{ color: T.tealLight, textDecoration: 'none', borderBottom: `1px solid ${T.tealLight}` }}>{content.exportGuideLink}</Link>
            {' '}{content.orWord}{' '}
            <Link href="/what-is-whounfollowed" style={{ color: T.tealLight, textDecoration: 'none', borderBottom: `1px solid ${T.tealLight}` }}>{content.faqLink}</Link>
            {' '}{content.quickQuestionSuffix}
          </p>
        </div>

        {/* Topic selector */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>{content.whatIsThisAbout}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {content.topics.map(topic => {
              const active = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(active ? null : topic.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                    borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                    background: active ? 'rgba(2,136,143,0.08)' : T.surface1,
                    border: `1px solid ${active ? 'rgba(2,136,143,0.3)' : T.border1}`,
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: active ? T.tealMid : T.border2, flexShrink: 0, transition: 'background 0.15s' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: active ? 600 : 400, color: active ? T.ink : T.inkDim, fontFamily: T.sans, marginBottom: 2 }}>{topic.label}</div>
                    <div style={{ fontSize: 12, color: T.inkMute }}>{topic.desc}</div>
                  </div>
                  {active && <span style={{ fontSize: 16, color: T.tealMid, lineHeight: 1 }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Direct-message form */}
        <div style={{ borderRadius: 16, background: T.bgCard, border: `1px solid ${T.border1}`, padding: '22px 22px 20px', marginBottom: 24 }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>✓</div>
              <div style={{ fontFamily: T.serif, fontSize: 19, color: T.ink, marginBottom: 8 }}>{content.form.successTitle}</div>
              <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6, marginBottom: 16 }}>{content.form.successBody}</p>
              <button
                type="button"
                onClick={resetForm}
                style={{ fontSize: 12, color: T.tealMid, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.sans, textDecoration: 'underline' }}
              >
                {content.form.sendAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>{content.form.heading}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <label style={{ display: 'block' }}>
                  <span style={{ display: 'block', fontSize: 12, color: T.inkDim, marginBottom: 6 }}>
                    {content.form.nameLabel} <span style={{ color: T.inkMute }}>({content.form.nameOptional})</span>
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    maxLength={120}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${T.border2}`, background: T.bg, color: T.ink, fontFamily: T.sans, fontSize: 14, outline: 'none' }}
                  />
                </label>

                <label style={{ display: 'block' }}>
                  <span style={{ display: 'block', fontSize: 12, color: T.inkDim, marginBottom: 6 }}>{content.form.emailLabel}</span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    maxLength={320}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${T.border2}`, background: T.bg, color: T.ink, fontFamily: T.sans, fontSize: 14, outline: 'none' }}
                  />
                </label>

                <label style={{ display: 'block' }}>
                  <span style={{ display: 'block', fontSize: 12, color: T.inkDim, marginBottom: 6 }}>{content.form.messageLabel}</span>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={content.form.messagePlaceholder}
                    required
                    maxLength={2000}
                    rows={5}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${T.border2}`, background: T.bg, color: T.ink, fontFamily: T.sans, fontSize: 14, outline: 'none', resize: 'vertical' }}
                  />
                </label>
              </div>

              {errorMsg && (
                <p style={{ fontSize: 12, color: T.terra, marginTop: 12, marginBottom: 0 }}>{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                style={{
                  width: '100%', marginTop: 16, padding: '12px 16px', borderRadius: 12,
                  border: 'none', cursor: status === 'submitting' ? 'default' : 'pointer',
                  background: T.teal, color: T.cream, fontFamily: T.sans, fontSize: 14, fontWeight: 600,
                  opacity: status === 'submitting' ? 0.7 : 1,
                  boxShadow: `0 4px 16px ${T.tealGlow}`,
                }}
              >
                {status === 'submitting' ? content.form.sending : content.form.send}
              </button>
            </form>
          )}
        </div>

        {/* Email card (fallback) */}
        <div style={{ borderRadius: 16, background: T.bgCard, border: `1px solid ${T.border1}`, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ padding: '20px 22px 16px' }}>
            <div style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{content.form.orEmailDirectly}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: T.mono, fontSize: 16, color: T.ink }}>{EMAIL}</span>
              <button
                onClick={copyEmail}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '9px 16px', borderRadius: 10,
                  background: copied ? 'rgba(2,136,143,0.12)' : T.teal, color: copied ? T.tealLight : T.cream,
                  border: 'none', fontSize: 13, fontWeight: 600, fontFamily: T.sans, cursor: 'pointer',
                  boxShadow: copied ? 'none' : `0 4px 16px ${T.tealGlow}`, transition: 'all 0.15s',
                }}
              >
                {copied ? content.copied : content.copyEmail}
              </button>
            </div>
          </div>
          <div style={{ padding: '14px 22px', borderTop: `1px solid ${T.border1}`, background: T.surface1, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <a
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: T.inkDim, textDecoration: 'none', fontSize: 12, fontFamily: T.mono, borderBottom: `1px solid ${T.border2}` }}
            >
              {content.openInMailApp}
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            {selectedTopic && (
              <span style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono }}>
                {content.subjectPrefilled}
              </span>
            )}
          </div>
        </div>

        {/* Response expectations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 48 }}>
          {content.responseRows.map(row => (
            <div key={row.label} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderRadius: 10, background: T.surface1, border: `1px solid ${T.border1}` }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: T.tealMid, flexShrink: 0, marginTop: 6 }} />
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.ink, fontFamily: T.sans }}>{row.label}: </span>
                <span style={{ fontSize: 13, color: T.inkDim }}>{row.detail}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ paddingTop: 28, borderTop: `1px solid ${T.border1}` }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {content.backToHome}
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
