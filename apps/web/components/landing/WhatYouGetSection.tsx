import React from 'react';
import { T } from './tokens';
import { Icon } from './atoms';

// Compact expectation-setter, immediately below the hero. Deliberately light:
// two cards and one trust line, nothing more. Should resolve in under 5 seconds
// what a single upload gets you vs. what comparing snapshots over time gets you.

function GetCard({
  eyebrow, title, body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div style={{
      flex: 1, minWidth: 260, padding: '22px 24px', borderRadius: 16,
      background: 'var(--t-surface1)', border: '1px solid var(--t-border1)',
    }}>
      <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
        {eyebrow}
      </div>
      <h3 style={{ fontFamily: T.serif, fontSize: 21, fontWeight: 400, letterSpacing: '-0.01em', color: T.ink, marginBottom: 8 }}>
        {title}
      </h3>
      <p style={{ fontSize: 13.5, color: T.inkDim, lineHeight: 1.55, margin: 0 }}>
        {body}
      </p>
    </div>
  );
}

interface WhatYouGetContent {
  eyebrow: string;
  card1Eyebrow: string;
  card1Title: string;
  card1Body: string;
  card2Eyebrow: string;
  card2Title: string;
  card2Body: string;
  trustLine: string;
}

export function WhatYouGetSection({ content }: { content: WhatYouGetContent }) {
  return (
    <section className="px-4 sm:px-12 pt-14 sm:pt-20 pb-10 sm:pb-14">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.tealMid, letterSpacing: '0.18em' }}>{content.eyebrow}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--t-border2)' }} />
        </div>
        <div className="flex flex-col sm:flex-row" style={{ gap: 14, marginBottom: 18 }}>
          <GetCard
            eyebrow={content.card1Eyebrow}
            title={content.card1Title}
            body={content.card1Body}
          />
          <GetCard
            eyebrow={content.card2Eyebrow}
            title={content.card2Title}
            body={content.card2Body}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 12, color: T.inkMute, fontFamily: T.mono }}>
          <Icon.shield size={12} color={T.tealMid} />
          {content.trustLine}
        </div>
      </div>
    </section>
  );
}
