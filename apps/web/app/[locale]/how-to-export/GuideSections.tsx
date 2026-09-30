import Link from 'next/link';
import { T } from '@/components/landing/tokens';
import type { HowToExportContent as HowToExportContentData } from './content';
import { Callout } from './parts';

// Reference sections below the steps: timing, ZIP structure, troubleshooting, FAQ.
export function GuideSections({ content }: { content: HowToExportContentData }) {
  return (
    <>
    {/* ── SECTION A: How long does it take? ── */}
    <div style={{ marginTop: 72, paddingTop: 56, borderTop: '1px solid var(--t-border1)' }}>
      <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 12 }}>{content.timing.eyebrow}</div>
      <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 400, letterSpacing: '-0.02em', color: T.ink, marginBottom: 20, lineHeight: 1.1 }}>{content.timing.headline}</h2>
      <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.7, marginBottom: 20 }}>{content.timing.intro}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {content.timing.items.map((item) => (
          <div key={item} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderRadius: 10, background: 'var(--t-surface1)', border: '1px solid var(--t-border1)', fontSize: 14, color: T.inkDim, lineHeight: 1.6 }}>
            <span style={{ color: T.tealMid, flexShrink: 0, marginTop: 2 }}>·</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
      <Callout variant="warning">{content.timing.warning}</Callout>
    </div>

    {/* ── SECTION B: What's inside the ZIP? ── */}
    <div style={{ marginTop: 72, paddingTop: 56, borderTop: '1px solid var(--t-border1)' }}>
      <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 12 }}>{content.structure.eyebrow}</div>
      <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 400, letterSpacing: '-0.02em', color: T.ink, marginBottom: 20, lineHeight: 1.1 }}>{content.structure.headline}</h2>

      {/* Folder tree */}
      <div style={{ borderRadius: 14, border: '1px solid var(--t-border2)', background: 'var(--t-surface1)', overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--t-border1)', fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.1em' }}>{content.structure.folderLabel}</div>
        <pre style={{ margin: 0, padding: '16px', fontFamily: T.mono, fontSize: 13, color: T.inkDim, lineHeight: 1.8, overflowX: 'auto' }}>{`instagram-username-20260428.zip
└── followers_and_following/
├── followers_1.json      ← ${content.structure.treeComment1}
└── following.json        ← ${content.structure.treeComment2}`}</pre>
      </div>

      <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.7, marginBottom: 20 }}>
        {content.structure.body}
      </p>

      {/* JSON sample */}
      <div style={{ borderRadius: 14, border: '1px solid var(--t-border2)', background: 'var(--t-surface1)', overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--t-border1)', fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.1em' }}>{content.structure.jsonSampleLabel}</div>
        <pre style={{ margin: 0, padding: '16px', fontFamily: T.mono, fontSize: 12, color: T.inkDim, lineHeight: 1.8, overflowX: 'auto' }}>{`[
  {
"string_list_data": [{
  "value": "username",
  "timestamp": 1714512000
}]
  }
]`}</pre>
      </div>

      <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.7, marginBottom: 32 }}>
        {content.structure.closing}
      </p>

      {/* Mini CTA */}
      <div style={{ padding: '20px 24px', borderRadius: 14, border: `1px solid rgba(2,136,143,0.25)`, background: 'rgba(2,136,143,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 14, color: T.inkDim }}>{content.structure.miniCtaLabel}</span>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: T.tealLight, textDecoration: 'none' }}>
          {content.structure.miniCtaButton}
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </div>
    </div>

    {/* ── SECTION C: Troubleshooting ── */}
    <div style={{ marginTop: 72, paddingTop: 56, borderTop: '1px solid var(--t-border1)' }}>
      <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 12 }}>{content.troubleshooting.eyebrow}</div>
      <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 400, letterSpacing: '-0.02em', color: T.ink, marginBottom: 32, lineHeight: 1.1 }}>{content.troubleshooting.headline}</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {content.troubleshooting.items.map((item, i, arr) => (
          <div key={item.q} style={{ padding: '24px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--t-border1)' : 'none' }}>
            <h3 style={{ fontFamily: T.serif, fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: '-0.01em', marginBottom: 10, lineHeight: 1.3 }}>{item.q}</h3>
            <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.7, margin: 0 }}>{item.a}</p>
          </div>
        ))}
      </div>
    </div>

    {/* ── FAQ ── */}
    <div style={{ marginTop: 72, paddingTop: 56, borderTop: '1px solid var(--t-border1)' }}>
      <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 12 }}>{content.faq.eyebrow}</div>
      <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 400, letterSpacing: '-0.02em', color: T.ink, marginBottom: 32, lineHeight: 1.1 }}>{content.faq.headline}</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {content.faq.items.map((item, i, arr) => (
          <div key={item.q} style={{ padding: '20px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--t-border1)' : 'none' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 8, lineHeight: 1.4 }}>{item.q}</div>
            <div style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.7 }}>{item.a}</div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
