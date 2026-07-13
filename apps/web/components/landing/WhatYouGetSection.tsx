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

export function WhatYouGetSection() {
  return (
    <section className="px-4 sm:px-12 pb-16 sm:pb-20">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.tealMid, letterSpacing: '0.18em' }}>WHAT YOU GET</span>
          <div style={{ flex: 1, height: 1, background: 'var(--t-border2)' }} />
        </div>
        <div className="flex flex-col sm:flex-row" style={{ gap: 14, marginBottom: 18 }}>
          <GetCard
            eyebrow="Today · one export"
            title="See who doesn't follow you back"
            body="Find every account you follow that does not currently follow you."
          />
          <GetCard
            eyebrow="Over time · snapshots"
            title="See who unfollowed you"
            body="Save a snapshot, upload another export later, and compare what changed."
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 12, color: T.inkMute, fontFamily: T.mono }}>
          <Icon.shield size={12} color={T.tealMid} />
          No password. No account connection. Your ZIP is processed locally in this browser.
        </div>
      </div>
    </section>
  );
}
