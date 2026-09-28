import { T } from '@/components/landing/tokens';
import { PLATFORM_NAME, type Platform } from '@/lib/platform';
import { PlatformIcon } from '@/components/PlatformIcon';

// Big app mark for the results header, so the platform reads at a glance.
function PlatformMark({ platform }: { platform: Platform }) {
  const threads = platform === 'threads';
  return (
    <div style={{
      width: 52, height: 52, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: threads ? '50%' : 15,
      background: threads ? T.ink : 'linear-gradient(140deg, #02888f 0%, #01494d 100%)',
      color: threads ? T.bg : '#f4f0e8',
      boxShadow: threads ? '0 0 0 6px var(--t-surface2)' : '0 10px 28px rgba(2,136,143,0.28)',
    }}>
      <PlatformIcon platform={platform} size={26} />
    </div>
  );
}

// A single hairline "thread" with one loop, drawn in on load. Threads only.
function ThreadLine() {
  return (
    <svg
      className="hidden sm:block"
      aria-hidden="true"
      width="260" height="64" viewBox="0 0 260 64" fill="none"
      style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
    >
      <path
        d="M2 40 C 50 40, 70 14, 104 14 C 136 14, 146 50, 124 52 C 102 54, 104 22, 140 22 C 180 22, 200 44, 258 44"
        stroke="var(--t-inkMute)" strokeWidth="1.25" strokeLinecap="round"
        pathLength={1} strokeDasharray="1"
        style={{ animation: 'thread-draw 1.6s cubic-bezier(0.65,0,0.35,1) both' }}
      />
      <circle cx="258" cy="44" r="2.5" fill="var(--t-ink)" />
    </svg>
  );
}

export function PlatformHero({ platform, eyebrow, exportFrom }: { platform: Platform; eyebrow: string; exportFrom: string }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
      <PlatformMark platform={platform} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em' }}>{eyebrow}</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{PLATFORM_NAME[platform]}</span>
          <span style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono }}>{exportFrom}</span>
        </div>
      </div>
      {platform === 'threads' && <ThreadLine />}
    </div>
  );
}
