import { T } from '@/components/landing/tokens';
import type { HowToExportContent as HowToExportContentData } from './content';
import { Callout, Hint, NavPath, Step, ZipCTA } from './parts';

interface Props {
  content: HowToExportContentData;
  // Index (0-5) of the step the video guide is currently showing.
  activeStep: number;
  onWatchStep: (index: number) => void;
}

// The six "Download to device" steps. Each one is tied to a chapter of the
// video guide: see videoChapters.ts and useVideoStepSync.ts.
export function DeviceSteps({ content, activeStep, onWatchStep }: Props) {
  const sync = (n: number) => ({
    n,
    anchor: `step${n}`,
    active: activeStep === n - 1,
    onWatch: () => onWatchStep(n - 1),
    watchLabel: content.video.watchStep,
    activeLabel: content.video.onScreen,
  });

  return (
    <>
      <Callout variant="tip">{content.device.tip}</Callout>

      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 40 }}>
        <Step {...sync(1)} title={content.device.step1.title}>
          <a href="https://accountscenter.instagram.com/info_and_permissions/dyi/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, background: 'rgba(2,136,143,0.1)', border: '1px solid rgba(2,136,143,0.3)', color: T.tealLight, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            {content.device.step1.openButton}
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <NavPath steps={content.device.step1.nav} />
          <Hint>{content.device.step1.hint}</Hint>
        </Step>

        <Step {...sync(2)} title={content.device.step2.title}>
          <NavPath steps={content.device.step2.nav} />
        </Step>

        <Step {...sync(3)} title={content.device.step3.title}>
          <NavPath steps={content.device.step3.nav} />
          <Hint>{content.device.step3.hint}</Hint>
        </Step>

        <Step {...sync(4)} title={content.device.step4.title}>
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

        <Step {...sync(5)} title={content.device.step5.title}>
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

        <Step {...sync(6)} title={content.device.step6.title}>
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
  );
}
