'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { T } from '@/components/landing/tokens';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { Icon } from '@/components/landing/atoms';
import type { WhatIsContent as WhatIsContentData, FaqItem } from './content';

function FaqItemRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius: 12, border: `1px solid ${open ? 'rgba(2,136,143,0.2)' : T.border1}`, overflow: 'hidden', transition: 'border-color 0.2s', background: open ? 'rgba(2,136,143,0.02)' : 'transparent' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontFamily: T.serif, fontSize: 17, lineHeight: 1.3, color: T.ink, letterSpacing: '-0.01em' }}>{item.q}</span>
        <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: open ? T.tealMid : T.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', transform: open ? 'rotate(45deg)' : 'none' }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 2V12M2 7H12" stroke={open ? T.cream : T.inkMute} strokeWidth="1.6" strokeLinecap="round"/></svg>
        </span>
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ padding: '0 20px 18px', fontSize: 14, color: T.inkDim, lineHeight: 1.7 }}>{item.a}</div>
      </div>
    </div>
  );
}

export function WhatIsContent({ content }: { content: WhatIsContentData }) {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav />

      <main className="px-4 sm:px-8" style={{ maxWidth: 740, margin: '0 auto', paddingTop: 64, paddingBottom: 96 }}>

        {/* Hero */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16 }}>
            {content.eyebrow}
          </div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(34px, 6vw, 58px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 20 }}>
            {content.headline}
            <span style={{ fontStyle: 'italic', color: T.tealLight }}> {content.headlineItalic}</span>
          </h1>
          <p style={{ fontSize: 16, color: T.inkDim, lineHeight: 1.7, marginBottom: 28, maxWidth: 580 }}>
            {content.intro}
          </p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: T.tealLight, textDecoration: 'none' }}>
            {content.seeListNow}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        {/* 3 stats */}
        <div className="grid grid-cols-3" style={{ gap: 10, marginBottom: 64 }}>
          {content.stats.map(s => (
            <div key={s.label} style={{ padding: '18px 14px', borderRadius: 14, background: T.surface1, border: `1px solid ${T.border1}`, textAlign: 'center' }}>
              <div style={{ fontFamily: T.serif, fontSize: 32, color: T.tealLight, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: T.inkMute, marginTop: 6, fontFamily: T.mono, letterSpacing: '0.04em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* The problem */}
        <section style={{ paddingBottom: 56, marginBottom: 56, borderBottom: `1px solid ${T.border1}` }}>
          <div style={{ fontSize: 10, color: T.terra, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>{content.problemEyebrow}</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: 20 }}>
            {content.problemHeadline}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {content.problemItems.map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', borderRadius: 10, background: 'rgba(168,75,47,0.05)', border: '1px solid rgba(168,75,47,0.12)' }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.5 }}>{item.text}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 15, color: T.ink, fontWeight: 500 }}>{content.problemClosing}</p>
        </section>

        {/* How it works */}
        <section style={{ paddingBottom: 56, marginBottom: 56, borderBottom: `1px solid ${T.border1}` }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>{content.howEyebrow}</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: 24 }}>
            {content.howHeadline}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 16, border: `1px solid ${T.border1}`, overflow: 'hidden', marginBottom: 20 }}>
            {content.howSteps.map((item, i) => (
              <div key={item.title} style={{ display: 'flex', gap: 20, padding: '20px 22px', borderBottom: i < 2 ? `1px solid ${T.border1}` : 'none', background: i === 2 ? 'rgba(2,136,143,0.04)' : T.surface1 }}>
                <div style={{ flexShrink: 0, textAlign: 'center', paddingTop: 2 }}>
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: T.tealMid, letterSpacing: '0.1em', marginBottom: 2 }}>{item.time}</div>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 2 ? T.teal : T.surface2, border: `1px solid ${i === 2 ? 'transparent' : T.border2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: T.mono, color: i === 2 ? T.cream : T.inkMute, margin: '0 auto' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 14, color: T.ink, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/how-to-export" style={{ fontSize: 14, color: T.tealLight, textDecoration: 'none', fontWeight: 500 }}>
            {content.fullGuideLink}
          </Link>
        </section>

        {/* WhoUnfollowed vs others comparison */}
        <section style={{ paddingBottom: 56, marginBottom: 56, borderBottom: `1px solid ${T.border1}` }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>{content.whyUsEyebrow}</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: 24 }}>
            {content.whyUsHeadline}
          </h2>
          <div style={{ borderRadius: 16, border: `1px solid ${T.border1}`, overflow: 'hidden' }}>
            {/* Header */}
            <div className="grid grid-cols-3" style={{ background: T.surface1, borderBottom: `1px solid ${T.border1}` }}>
              <div style={{ padding: '12px 16px', fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.08em' }}>{content.compareFeatureHeader}</div>
              <div style={{ padding: '12px 16px', fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.08em', textAlign: 'center', borderLeft: `1px solid ${T.border1}` }}>{content.compareUsHeader}</div>
              <div style={{ padding: '12px 16px', fontSize: 11, color: T.terra, fontFamily: T.mono, letterSpacing: '0.08em', textAlign: 'center', borderLeft: `1px solid ${T.border1}` }}>{content.compareThemHeader}</div>
            </div>
            {content.compareRows.map((row, i) => (
              <div key={row.feature} className="grid grid-cols-3" style={{ borderBottom: i < content.compareRows.length - 1 ? `1px solid ${T.border1}` : 'none' }}>
                <div style={{ padding: '13px 16px', fontSize: 13, color: T.inkDim }}>{row.feature}</div>
                {[row.us, row.them].map((val, ci) => (
                  <div key={ci} style={{ padding: '13px 16px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderLeft: `1px solid ${T.border1}` }}>
                    {val
                      ? <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(2,136,143,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.check size={13} color={T.tealMid} /></span>
                      : <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(168,75,47,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.x size={11} color={T.terra} /></span>
                    }
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* What you get */}
        <section style={{ paddingBottom: 56, marginBottom: 56, borderBottom: `1px solid ${T.border1}` }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>{content.whatYouGetEyebrow}</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: 20 }}>
            {content.whatYouGetHeadline}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 10 }}>
            {content.whatYouGetItems.map(item => (
              <div key={item.title} style={{ display: 'flex', gap: 14, padding: '16px', borderRadius: 12, background: T.surface1, border: `1px solid ${T.border1}` }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 4, fontFamily: T.sans }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.55 }}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>{content.faqEyebrow}</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: 24 }}>
            {content.faqHeadline}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {content.faqItems.map(item => <FaqItemRow key={item.q} item={item} />)}
          </div>
        </section>

        {/* Related guide */}
        <div style={{ marginBottom: 40, padding: '18px 20px', borderRadius: 14, background: T.surface1, border: `1px solid ${T.border1}` }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>{content.relatedGuideEyebrow}</div>
          <Link href="/blog/how-to-see-who-unfollowed-you-on-instagram" style={{ fontFamily: T.serif, fontSize: 18, color: T.tealLight, textDecoration: 'none', lineHeight: 1.3 }}>
            {content.relatedGuideLink}
          </Link>
        </div>

        {/* CTA */}
        <div style={{ padding: '32px', borderRadius: 18, background: T.bgCard, border: `1px solid ${T.border1}`, textAlign: 'center' }}>
          <p style={{ fontFamily: T.serif, fontSize: 18, fontStyle: 'italic', color: T.inkDim, marginBottom: 6 }}>{content.ctaQuote}</p>
          <p style={{ fontSize: 14, color: T.inkMute, marginBottom: 24 }}>{content.ctaSubline}</p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: T.teal, color: T.cream, fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans, boxShadow: `0 6px 20px ${T.tealGlow}` }}>
            {content.ctaButton}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        <div style={{ marginTop: 48, paddingTop: 28, borderTop: `1px solid ${T.border1}` }}>
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
