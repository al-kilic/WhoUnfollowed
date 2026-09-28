import { Link } from '@/i18n/navigation';
import { T } from '@/components/landing/tokens';
import { PLATFORM_NAME, type Platform } from '@/lib/platform';
import { PlatformIcon } from '@/components/PlatformIcon';
import type { DashboardContent } from './content';

// Radar body when the selected platform has no snapshot on this device yet.
export function PlatformEmptyPanel({ platform, c }: { platform: Platform; c: DashboardContent }) {
  const app = PLATFORM_NAME[platform];
  return (
    <main className="px-4 sm:px-8" style={{ maxWidth: 520, margin: '0 auto', padding: '56px 16px 88px', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: T.surface2, border: `1px solid ${T.border2}`, marginBottom: 24, color: T.inkDim }}>
        <PlatformIcon platform={platform} size={28} />
      </div>
      <h1 style={{ fontFamily: T.serif, fontSize: 28, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1.15 }}>
        {c.platformEmpty.title(app)}
      </h1>
      <p style={{ fontSize: 14.5, color: T.inkDim, lineHeight: 1.6, marginBottom: 28 }}>
        {c.platformEmpty.body(app)}
      </p>
      <Link
        href="/"
        style={{ display: 'inline-block', fontSize: 14, fontWeight: 600, color: T.cream, textDecoration: 'none', padding: '11px 20px', borderRadius: 10, background: T.teal, border: '1px solid rgba(2,136,143,0.5)' }}
      >
        {c.platformEmpty.cta}
      </Link>
    </main>
  );
}
