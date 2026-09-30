import { T } from '@/components/landing/tokens';
import type { HowToExportContent as HowToExportContentData } from './content';
import { Callout, Hint, NavPath, Step, ZipCTA } from './parts';

// The "Export to Google Drive" steps. Not covered by the video guide.
export function DriveSteps({ content }: { content: HowToExportContentData }) {
  return (
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
  );
}
