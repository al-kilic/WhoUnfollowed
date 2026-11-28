'use client';

import { Check } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { T } from '@/components/landing/tokens';
import { track } from '@/lib/analytics';
import { getStudioDoorContent } from './studioDoor.content';

// The one way from /results into Studio. Keeps the id the "today" hint under
// the headline jumps to.
export function StudioDoor({ locale }: { locale: AppLocale }) {
  const c = getStudioDoorContent(locale);
  return (
    <section id="radar-teaser" style={{ marginTop: 32, scrollMarginTop: 96, borderRadius: 18, border: `1px solid ${T.tealMid}`, background: T.surface1, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '0.12em', color: T.tealMid }}>{c.eyebrow}</div>
      <h2 style={{ fontFamily: T.sans, fontSize: 24, fontWeight: 600, margin: 0, color: T.ink, letterSpacing: '-0.02em' }}>{c.title}</h2>
      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: T.inkDim }}>{c.body}</p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
        {c.points.map((p) => (
          <li key={p} style={{ display: 'flex', gap: 10, fontSize: 14.5, color: T.ink }}><Check size={17} style={{ color: T.tealLight, flexShrink: 0, marginTop: 2 }} />{p}</li>
        ))}
      </ul>
      <Link href="/app/radar" onClick={() => track('studio-open', { from: 'results' })} style={{ alignSelf: 'flex-start', marginTop: 4, padding: '12px 22px', borderRadius: 11, background: T.teal, color: T.onTeal, textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>
        {c.cta}
      </Link>
      <p style={{ margin: 0, fontSize: 12.5, color: T.inkMute }}>{c.note}</p>
    </section>
  );
}
