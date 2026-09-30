'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Link as LocaleLink } from '@/i18n/navigation';
import { PlatformIcon } from '@/components/PlatformIcon';
import { T } from '@/components/landing/tokens';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';
import type { HowToExportContent as HowToExportContentData } from './content';
import { DeviceSteps } from './DeviceSteps';
import { DriveSteps } from './DriveSteps';
import { ExportVideo } from './ExportVideo';
import { GuideSections } from './GuideSections';
import { TabButton, ZipCTA } from './parts';
import { useVideoStepSync } from './useVideoStepSync';

export function HowToExportContent({ content }: { content: HowToExportContentData }) {
  const [tab, setTab] = useState<'device' | 'drive'>('device');
  const sync = useVideoStepSync(tab === 'device');

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav />

      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '56px 32px 80px' }}>
        <div className="export-narrow">
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
            <div style={{ marginTop: 20, display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 16px', borderRadius: 12, border: '1px solid var(--t-border2)', background: 'var(--t-surface1)', maxWidth: 560 }}>
              <span style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', background: T.ink, color: T.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <PlatformIcon platform="threads" size={16} />
              </span>
              <div style={{ fontSize: 13.5, color: T.inkDim, lineHeight: 1.55 }}>
                <strong style={{ color: T.ink, fontWeight: 600 }}>{content.threadsCallout.title}</strong>{' '}
                {content.threadsCallout.body}{' '}
                <LocaleLink href="/threads" style={{ color: T.tealLight, textDecoration: 'none', fontWeight: 600 }}>{content.threadsCallout.link}</LocaleLink>
              </div>
            </div>
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
        </div>

        {/* Device tab: the video guide stays pinned beside (desktop) or above
            (mobile) the six steps, and unpins once the steps end. */}
        {tab === 'device' && (
          <div className="export-split">
            <div className="export-video">
              <ExportVideo content={content} sync={sync} />
            </div>
            <div ref={sync.stepsRef} className="export-steps">
              <DeviceSteps content={content} activeStep={sync.activeStep} onWatchStep={sync.seekToStep} />
            </div>
          </div>
        )}

        <div className="export-narrow">
          {tab === 'drive' && <DriveSteps content={content} />}

          <GuideSections content={content} />

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
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
