'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { T } from '@/components/landing/tokens';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';
import type { ContactContent as ContactContentData } from './content';

export function ContactContent({ content }: { content: ContactContentData }) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

        {/* Email card */}
        <div style={{ borderRadius: 16, background: T.bgCard, border: `1px solid ${T.border1}`, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ padding: '20px 22px 16px' }}>
            <div style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{content.emailLabel}</div>
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
