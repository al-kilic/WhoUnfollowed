'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { T } from '@/components/landing/tokens';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { PlatformIcon } from '@/components/PlatformIcon';
import { usePlatformTheme } from '@/hooks/usePlatformTheme';
import type { ThreadsPageContent } from './content';

const eyebrowStyle: React.CSSProperties = { fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 };
const h2Style: React.CSSProperties = { fontFamily: T.serif, fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: 22 };
const sectionStyle: React.CSSProperties = { paddingBottom: 56, marginBottom: 56, borderBottom: `1px solid ${T.border1}` };
const arrow = <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

// Landing page for Threads-specific searches. Rendered in the Threads
// monochrome theme so it reads as the Threads side of the product.
export function ThreadsContent({ content: c }: { content: ThreadsPageContent }) {
  usePlatformTheme('threads');

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav />

      <main className="px-4 sm:px-8" style={{ maxWidth: 740, margin: '0 auto', paddingTop: 64, paddingBottom: 96 }}>
        {/* Hero */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ width: 44, height: 44, borderRadius: '50%', background: T.ink, color: T.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlatformIcon platform="threads" size={22} />
            </span>
            <span style={{ ...eyebrowStyle, marginBottom: 0 }}>{c.eyebrow}</span>
          </div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(34px, 6vw, 58px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 20 }}>
            {c.headline}
            <span style={{ display: 'block', fontStyle: 'italic', color: T.inkDim }}>{c.headlineItalic}</span>
          </h1>
          <p style={{ fontSize: 16, color: T.inkDim, lineHeight: 1.7, marginBottom: 28, maxWidth: 580 }}>{c.intro}</p>
          <Link href="/#upload" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px', borderRadius: 12, background: T.teal, color: T.cream, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            {c.uploadCta}{arrow}
          </Link>
        </div>

        <div className="grid grid-cols-3" style={{ gap: 10, marginBottom: 56 }}>
          {c.stats.map(s => (
            <div key={s.label} style={{ padding: '18px 14px', borderRadius: 14, background: T.surface1, border: `1px solid ${T.border1}`, textAlign: 'center' }}>
              <div style={{ fontFamily: T.serif, fontSize: 30, color: T.tealLight, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: T.inkMute, marginTop: 6, fontFamily: T.mono, letterSpacing: '0.04em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* What you get */}
        <section style={sectionStyle}>
          <div style={eyebrowStyle}>{c.whatEyebrow}</div>
          <h2 style={h2Style}>{c.whatHeadline}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 10 }}>
            {c.whatItems.map(item => (
              <div key={item.title} style={{ padding: 16, borderRadius: 12, background: T.surface1, border: `1px solid ${T.border1}` }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.55 }}>{item.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Export steps */}
        <section style={sectionStyle}>
          <div style={eyebrowStyle}>{c.stepsEyebrow}</div>
          <h2 style={h2Style}>{c.stepsHeadline}</h2>
          <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', borderRadius: 16, border: `1px solid ${T.border1}`, overflow: 'hidden' }}>
            {c.steps.map((step, i) => (
              <li key={step.title} id={`step${i + 1}`} style={{ display: 'flex', gap: 18, padding: '18px 20px', background: T.surface1, borderBottom: i < c.steps.length - 1 ? `1px solid ${T.border1}` : 'none' }}>
                <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', border: `1px solid ${T.border3}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: T.mono, color: T.inkDim }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: T.ink, marginBottom: 4 }}>{step.title}</div>
                  <div style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>{step.body}</div>
                </div>
              </li>
            ))}
          </ol>
          <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6, padding: '12px 16px', borderRadius: 10, border: `1px dashed ${T.border3}`, marginBottom: 16 }}>{c.sizeTip}</p>
          <Link href="/how-to-export" style={{ fontSize: 14, color: T.tealLight, textDecoration: 'none', fontWeight: 500 }}>{c.fullGuideLink}</Link>
        </section>

        {/* What we read */}
        <section style={sectionStyle}>
          <div style={eyebrowStyle}>{c.readEyebrow}</div>
          <h2 style={h2Style}>{c.readHeadline}</h2>
          <p style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.7, marginBottom: 14 }}>{c.readBody}</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {c.readFiles.map(f => (
              <li key={f}><code style={{ fontFamily: T.mono, fontSize: 12.5, padding: '4px 10px', borderRadius: 8, background: T.surface2, border: `1px solid ${T.border1}`, color: T.ink }}>{f}</code></li>
            ))}
          </ul>
          <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.7 }}>{c.readNever}</p>
        </section>

        {/* FAQ (static list so every answer is visible to readers and crawlers) */}
        <section style={{ marginBottom: 56 }}>
          <div style={eyebrowStyle}>{c.faqEyebrow}</div>
          <h2 style={h2Style}>{c.faqHeadline}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {c.faq.map(item => (
              <div key={item.q}>
                <h3 style={{ fontFamily: T.serif, fontSize: 19, fontWeight: 400, color: T.ink, lineHeight: 1.3, marginBottom: 6 }}>{item.q}</h3>
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.7 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ padding: 32, borderRadius: 18, background: T.bgCard, border: `1px solid ${T.border1}`, textAlign: 'center' }}>
          <p style={{ fontFamily: T.serif, fontSize: 24, color: T.ink, marginBottom: 6 }}>{c.ctaHeadline}</p>
          <p style={{ fontSize: 14, color: T.inkMute, marginBottom: 22 }}>{c.ctaSubline}</p>
          <Link href="/#upload" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: T.teal, color: T.cream, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            {c.ctaButton}{arrow}
          </Link>
        </div>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${T.border1}` }}>
          <Link href="/" style={{ fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>{c.instagramLink}</Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
