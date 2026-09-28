import { T } from '@/components/landing/tokens';
import { PLATFORM_NAME, type Platform } from '@/lib/platform';
import { PlatformIcon } from '@/components/PlatformIcon';

// Pill naming which app a snapshot came from, with its glyph.
export function PlatformBadge({ platform }: { platform: Platform }) {
  const threads = platform === 'threads';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 10, fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase',
      padding: '3px 9px 3px 7px', borderRadius: 20,
      color: threads ? T.ink : T.tealLight,
      background: threads ? 'var(--t-surface2)' : 'rgba(var(--t-accent-rgb),0.08)',
      border: threads ? '1px solid var(--t-border3)' : '1px solid rgba(var(--t-accent-rgb),0.25)',
    }}>
      <PlatformIcon platform={platform} size={12} />
      {PLATFORM_NAME[platform]}
    </span>
  );
}
