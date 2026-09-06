'use client';

import { useState } from 'react';
import Link from 'next/link';
import { T } from '@/components/landing/tokens';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';
import type { HowToExportContent as HowToExportContentData } from './content';

// ─── Shared CTA card ─────────────────────────────────────────────────────────

function ZipCTA({ content }: { content: HowToExportContentData }) {
  return (
    <div style={{ marginTop: 56, padding: '32px 36px', borderRadius: 20, border: `1px solid rgba(2,136,143,0.3)`, background: 'rgba(2,136,143,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontFamily: T.serif, fontSize: 24, color: T.ink, letterSpacing: '-0.01em', marginBottom: 6 }}>{content.zipCtaTitle}</div>
        <div style={{ fontSize: 14, color: T.inkDim }}>{content.zipCtaBody}</div>
      </div>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', borderRadius: 12, background: T.teal, color: T.cream, fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans, whiteSpace: 'nowrap' }}>
        {content.zipCtaButton}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 H11 M11 7 L8 4 M11 7 L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </Link>
    </div>
  );
}

export function HowToExportContent({ content }: { content: HowToExportContentData }) {
  const [tab, setTab] = useState<'device' | 'drive'>('device');

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '56px 32px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 14 }}>{content.eyebrow}</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 16 }}>
            {content.headline}
          </h1>
          <p style={{ fontSize: 16, color: T.inkDim, lineHeight: 1.6, maxWidth: 560, marginBottom: 12 }}>
            {content.intro}
          </p>
          <Link href="/what-is-whounfollowed" style={{ fontSize: 13, color: T.inkDim, textDecoration: 'none', borderBottom: '1px solid var(--t-border3)', paddingBottom: 1 }}>
            {content.newHereLink}
          </Link>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 40, padding: 4, borderRadius: 14, background: 'var(--t-surface2)', border: '1px solid var(--t-border1)', width: 'fit-content' }}>
          <TabButton active={tab === 'device'} onClick={() => setTab('device')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 16 V8 M12 8 L9 11 M12 8 L15 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/></svg>
            {content.deviceTab}
          </TabButton>
          <TabButton active={tab === 'drive'} onClick={() => setTab('drive')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 17 L8.5 7 L14 17 H3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M14 17 L19.5 7 M8.5 7 H19.5 L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {content.driveTab}
          </TabButton>
        </div>

        {/* ── TAB: DOWNLOAD TO DEVICE ── */}
        {tab === 'device' && (
          <>
            <Callout variant="tip">{content.device.tip}</Callout>

            <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 40 }}>
              <Step n={1} title={content.device.step1.title}>
                <a href="https://accountscenter.instagram.com/info_and_permissions/dyi/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, background: 'rgba(2,136,143,0.1)', border: '1px solid rgba(2,136,143,0.3)', color: T.tealLight, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                  {content.device.step1.openButton}
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <NavPath steps={content.device.step1.nav} />
                <Hint>{content.device.step1.hint}</Hint>
              </Step>

              <Step n={2} title={content.device.step2.title}>
                <NavPath steps={content.device.step2.nav} />
              </Step>

              <Step n={3} title={content.device.step3.title}>
                <NavPath steps={content.device.step3.nav} />
                <Hint>{content.device.step3.hint}</Hint>
              </Step>

              <Step n={4} title={content.device.step4.title}>
                <NavPath steps={content.device.step4.nav} />
                <div style={{ borderRadius: 14, border: '1px solid var(--t-border2)', background: 'var(--t-surface1)', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--t-border1)', fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.1em' }}>{content.device.step4.customizeHeader}</div>
                  {content.device.step4.items.map((label, i) => {
                    const checked = i === 0;
                    return (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderBottom: i < 4 ? '1px solid var(--t-surface2)' : 'none', background: checked ? 'rgba(2,136,143,0.06)' : 'transparent' }}>
                        <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${checked ? T.tealMid : 'rgba(244,240,232,0.2)'}`, background: checked ? T.tealMid : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {checked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5 L4 7 L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <span style={{ fontSize: 13, color: checked ? T.ink : T.inkMute, fontWeight: checked ? 600 : 400 }}>{label}</span>
                        {checked && <span style={{ marginLeft: 'auto', fontSize: 10, color: T.tealLight, fontFamily: T.mono, padding: '2px 8px', borderRadius: 20, background: 'rgba(2,136,143,0.15)' }}>{content.device.step4.required}</span>}
                      </div>
                    );
                  })}
                </div>
                <Hint>{content.device.step4.hint}</Hint>
              </Step>

              <Step n={5} title={content.device.step5.title}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ padding: '14px 16px', borderRadius: 12, border: `2px solid ${T.tealMid}`, background: 'rgba(2,136,143,0.08)' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.tealLight, marginBottom: 4 }}>{content.device.step5.jsonLabel}</div>
                    <div style={{ fontSize: 12, color: T.inkDim }}>{content.device.step5.jsonDesc}</div>
                  </div>
                  <div style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid var(--t-border2)', background: 'var(--t-surface1)', opacity: 0.5 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: T.inkDim, marginBottom: 4 }}>{content.device.step5.htmlLabel}</div>
                    <div style={{ fontSize: 12, color: T.inkMute }}>{content.device.step5.htmlDesc}</div>
                  </div>
                </div>
                <Hint>{content.device.step5.hint}</Hint>
              </Step>

              <Step n={6} title={content.device.step6.title}>
                <div style={{ padding: '16px', borderRadius: 14, border: '1px solid var(--t-border2)', background: 'var(--t-surface1)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(2,136,143,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke={T.tealMid} strokeWidth="1.5"/><path d="M3 8 L12 13 L21 8" stroke={T.tealMid} strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{content.device.step6.emailSubject}</div>
                    <div style={{ fontSize: 11, color: T.inkMute, marginTop: 2 }}>From: security-noreply@instagram.com</div>
                    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--t-border2)', fontSize: 11, color: T.inkDim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>instagram-username-20260428.zip</div>
                      <div style={{ padding: '8px 14px', borderRadius: 8, background: T.tealMid, fontSize: 11, fontWeight: 600, color: T.cream, whiteSpace: 'nowrap' }}>Download</div>
                    </div>
                  </div>
                </div>
                <Hint>{content.device.step6.hint}</Hint>
              </Step>
            </div>

            <div style={{ marginTop: 32 }}>
              <Callout variant="warning">{content.device.warning}</Callout>
            </div>
            <ZipCTA content={content} />
          </>
        )}

        {/* ── TAB: EXPORT TO GOOGLE DRIVE ── */}
        {tab === 'drive' && (
          <>
            <Callout variant="tip">{content.drive.tip}</Callout>

            <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 40 }}>
              <Step n={1} title={content.drive.step1.title}>
                <a href="https://accountscenter.instagram.com/info_and_permissions/dyi/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, background: 'rgba(2,136,143,0.1)', border: '1px solid rgba(2,136,143,0.3)', color: T.tealLight, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                  {content.drive.step1.openButton}
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <NavPath steps={content.drive.step1.nav} />
                <Hint>{content.drive.step1.hint}</Hint>
              </Step>
              <Step n={2} title={content.drive.step2.title}>
                <NavPath steps={content.drive.step2.nav} />
              </Step>
              <Step n={3} title={content.drive.step3.title}>
                <NavPath steps={content.drive.step3.nav} />
                <Hint>{content.drive.step3.hint}</Hint>
              </Step>
              <Step n={4} title={content.drive.step4.title}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {content.drive.step4.platforms.map((p) => (
                    <div key={p.name} style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--t-border2)', background: 'var(--t-surface1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: T.ink, fontWeight: 500 }}>{p.name}</span>
                      <span style={{ fontSize: 10, color: p.note === content.drive.step4.platforms[0]!.note ? T.tealLight : T.inkMute, fontFamily: T.mono }}>{p.note}</span>
                    </div>
                  ))}
                </div>
                <Hint>{content.drive.step4.hint}</Hint>
              </Step>
              <Step n={5} title={content.drive.step5.title}>
                <NavPath steps={content.drive.step5.nav} />
                <Hint>{content.drive.step5.hint}</Hint>
              </Step>
              <Step n={6} title={content.drive.step6.title}>
                <Hint>{content.drive.step6.hint}</Hint>
              </Step>
            </div>

            <div style={{ marginTop: 32 }}>
              <Callout variant="tip">{content.drive.tip2}</Callout>
            </div>
            <ZipCTA content={content} />
          </>
        )}

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

        {/* Related guide */}
        <div style={{ marginTop: 40, padding: '18px 20px', borderRadius: 14, background: 'var(--t-surface1)', border: '1px solid var(--t-border1)' }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 8 }}>{content.relatedGuideEyebrow}</div>
          <Link href="/blog/how-to-download-your-instagram-data" style={{ fontFamily: T.serif, fontSize: 18, color: T.tealLight, textDecoration: 'none', lineHeight: 1.3 }}>
            {content.relatedGuideLink}
          </Link>
        </div>

        {/* Second CTA */}
        <ZipCTA content={content} />

        <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--t-border1)' }}>
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 400, background: active ? T.teal : 'transparent', color: active ? T.cream : T.inkDim, transition: 'all 0.15s ease', fontFamily: 'inherit' }}>
      {children}
    </button>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: T.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.mono, fontSize: 13, fontWeight: 700, color: T.cream }}>{n}</div>
        <div style={{ flex: 1, width: 1, background: 'var(--t-border1)', minHeight: 24, marginTop: 8 }} />
      </div>
      <div style={{ flex: 1, paddingBottom: 8, minWidth: 0 }}>
        <h2 style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: '-0.01em', marginBottom: 14, lineHeight: 1.2 }}>{title}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
      </div>
    </div>
  );
}

function NavPath({ steps }: { steps: string[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      {steps.map((step, i) => (
        <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ padding: '4px 10px', borderRadius: 6, background: 'var(--t-surface2)', border: '1px solid var(--t-border2)', fontSize: 12, color: T.inkDim, fontFamily: T.mono }}>{step}</span>
          {i < steps.length - 1 && <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7 H11 M11 7 L8 4 M11 7 L8 10" stroke={T.inkMute} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </span>
      ))}
    </div>
  );
}

// Small, muted secondary text: the "why" or edge case, subordinate to the
// primary tap sequence (NavPath) or visual mock above it in a Step.
function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 12.5, color: T.inkMute, lineHeight: 1.6, margin: 0 }}>
      {children}
    </p>
  );
}

function Callout({ variant, children }: { variant: 'warning' | 'tip'; children: React.ReactNode }) {
  const isTip = variant === 'tip';
  return (
    <div style={{ padding: '14px 18px', borderRadius: 12, border: `1px solid ${isTip ? 'rgba(2,136,143,0.3)' : 'rgba(168,75,47,0.3)'}`, background: isTip ? 'rgba(2,136,143,0.06)' : 'rgba(168,75,47,0.06)', display: 'flex', gap: 12, fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
        {isTip ? <><circle cx="12" cy="12" r="9" stroke={T.tealMid} strokeWidth="1.5"/><path d="M12 8 V12 M12 15.5 V16" stroke={T.tealMid} strokeWidth="1.8" strokeLinecap="round"/></> : <><path d="M12 4 L21 20 H3 Z" stroke={T.terra} strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 10 V14 M12 17 V17.5" stroke={T.terra} strokeWidth="1.8" strokeLinecap="round"/></>}
      </svg>
      <p style={{ margin: 0 }}>{children}</p>
    </div>
  );
}

import type React from 'react';
