import { T } from '@/components/landing/tokens';
import { PLATFORM_NAME, type Platform } from '@/lib/platform';
import { PlatformIcon } from '@/components/PlatformIcon';

// Big app mark for the results header, so the platform reads at a glance.
function PlatformMark({ platform }: { platform: Platform }) {
  const threads = platform === 'threads';
  return (
    <div className="size-10 xl:size-[52px]" style={{
      flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: threads ? '50%' : 13,
      background: threads ? T.ink : 'linear-gradient(140deg, #02888f 0%, #01494d 100%)',
      color: threads ? T.bg : '#f4f0e8',
      boxShadow: threads ? '0 0 0 6px var(--t-surface2)' : '0 10px 28px rgba(2,136,143,0.28)',
    }}>
      <PlatformIcon platform={platform} size={22} />
    </div>
  );
}

// A single hairline "thread" with one loop, drawn in on load. Threads only.
function ThreadLine() {
  return (
    <svg
      className="hidden sm:block xl:hidden"
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

// Wide screens: parked in the left gutter beside the headline, so the page
// opens on the number. Narrower: a compact row above the headline.
export function PlatformHero({ platform, eyebrow, exportFrom }: { platform: Platform; eyebrow: string; exportFrom: string }) {
  return (
    <div className="relative mb-4 flex items-center gap-3 xl:absolute xl:right-full xl:top-10 xl:mb-0 xl:w-[170px] xl:flex-col xl:items-end xl:gap-2.5 xl:text-right">
      <PlatformMark platform={platform} />
      <div className="flex flex-col gap-0.5 xl:items-end">
        <span style={{ fontSize: 10.5, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em' }}>{eyebrow}</span>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 xl:flex-col xl:items-end">
          <span style={{ fontFamily: T.serif, fontSize: 20, color: T.ink, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{PLATFORM_NAME[platform]}</span>
          <span style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono }}><span className="xl:hidden">· </span>{exportFrom}</span>
        </div>
      </div>
      {platform === 'threads' && <ThreadLine />}
    </div>
  );
}
