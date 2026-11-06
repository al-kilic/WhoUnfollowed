'use client';

import { useEffect, useState } from 'react';
import { T } from '@/components/landing/tokens';
import { track, Events } from '@/lib/analytics';
import { EmailOptInForm } from '@/components/EmailOptInForm';
import type { AppLocale } from '@/i18n/routing';
import { getCreatorAiTeaserContent } from './creatorAiTeaser.content';

// "Something big is coming" strip for the upcoming Creator AI plan. Names the
// plan, promises nothing concrete, and collects a waitlist.
export function CreatorAiTeaser({ locale, placement, defaultEmail }: {
  locale: AppLocale;
  placement: 'pricing' | 'results' | 'home';
  defaultEmail?: string | undefined;
}) {
  const c = getCreatorAiTeaserContent(locale);
  const [joined, setJoined] = useState(false);

  useEffect(() => { track(Events.offerView, { placement: `creator-ai-${placement}` }); }, [placement]);

  return (
    <section
      aria-labelledby={`creator-ai-${placement}`}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: 18, padding: '22px 22px 20px',
        border: `1px solid ${T.border2}`,
        background: `radial-gradient(120% 140% at 100% 0%, ${T.tealGlow} 0%, transparent 55%), ${T.surface1}`,
        display: 'grid', gap: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span aria-hidden style={{ width: 7, height: 7, borderRadius: '50%', background: T.terra, boxShadow: `0 0 0 4px rgba(168,75,47,0.15)`, animation: 'save-pulse 2.2s ease-in-out infinite' }} />
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.terraText, fontFamily: T.mono }}>{c.eyebrow}</span>
      </div>
      <div style={{ display: 'grid', gap: 6 }}>
        <h2 id={`creator-ai-${placement}`} style={{ fontFamily: T.serif, fontWeight: 400, fontSize: 'clamp(22px, 3vw, 28px)', lineHeight: 1.15, letterSpacing: '-0.02em', color: T.ink, margin: 0 }}>
          {c.title}
        </h2>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: T.inkDim, maxWidth: 560 }}>{c.body}</p>
      </div>
      {joined ? (
        <p role="status" style={{ margin: 0, fontSize: 14, fontWeight: 600, color: T.tealMid }}>{c.done}</p>
      ) : (
        <div style={{ display: 'grid', gap: 6, maxWidth: 480 }}>
          <EmailOptInForm
            id={`creator-ai-email-${placement}`}
            source="creator-ai-waitlist"
            locale={locale}
            labels={c}
            defaultEmail={defaultEmail}
            onDone={() => { setJoined(true); track(Events.creatorWaitlist, { placement }); }}
          />
          <span style={{ fontSize: 11.5, color: T.inkMute }}>{c.note}</span>
        </div>
      )}
    </section>
  );
}
