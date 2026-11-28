import { ImageResponse } from 'next/og';

// A share image in the new look (neutral dark, teal accent), for pages that
// have their own OG image. The root app/opengraph-image.tsx keeps the old card.
export const OG_SIZE = { width: 1200, height: 630 };

export function ogCard({ kicker, title, sub }: { kicker: string; title: string; sub: string }): ImageResponse {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0b0f0f', padding: '72px 88px', fontFamily: 'sans-serif', position: 'relative' }}>
      <div style={{ position: 'absolute', top: -160, right: -120, width: 560, height: 560, borderRadius: '50%', background: '#3cc4c2', opacity: 0.12, filter: 'blur(90px)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#3cc4c2' }} />
        <div style={{ color: '#b4bfbd', fontSize: 22, fontWeight: 600, letterSpacing: '0.04em' }}>WhoUnfollowed</div>
        <div style={{ color: '#3cc4c2', fontSize: 18, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginLeft: 18 }}>{kicker}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 980 }}>
        <div style={{ color: '#eaf0ef', fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>{title}</div>
        <div style={{ color: '#b4bfbd', fontSize: 28, lineHeight: 1.4 }}>{sub}</div>
      </div>
      <div style={{ display: 'flex', alignSelf: 'flex-start', alignItems: 'center', gap: 10, background: 'rgba(60,196,194,0.13)', border: '1px solid rgba(60,196,194,0.35)', borderRadius: 999, padding: '10px 22px' }}>
        <div style={{ color: '#3cc4c2', fontSize: 20, fontWeight: 600 }}>whounfollowed.co</div>
      </div>
    </div>,
    { ...OG_SIZE },
  );
}
