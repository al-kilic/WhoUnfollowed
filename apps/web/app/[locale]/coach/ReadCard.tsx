'use client';

import type { AiRead } from '@ig-tracker/core';
import type { CoachContent } from './content';
import { card, eyebrow } from './ui';
import { T } from '@/components/landing/tokens';

// The AI read of an export. Also used, blurred, as the free preview.
export function ReadCard({ read, c, caption }: { read: AiRead; c: CoachContent; caption?: string }) {
  const r = c.read;
  return (
    <section style={card}>
      <div style={eyebrow}>{c.tabs.read}</div>
      <h3 style={{ fontFamily: T.serif, fontSize: 24, fontWeight: 400, lineHeight: 1.25, margin: 0, color: T.ink }}>{read.headline}</h3>
      {caption && <p style={{ margin: 0, fontSize: 12, color: T.inkMute }}>{caption}</p>}
      <Block title={r.happening}>
        <ul style={list}>{read.happening.map((h) => <li key={h}>{h}</li>)}</ul>
      </Block>
      <Block title={r.stop}>
        <p style={para}><strong style={{ color: T.ink }}>{read.stop.what}.</strong> {read.stop.why}</p>
      </Block>
      <Block title={r.try}>
        <ul style={list}>{read.try.map((t) => <li key={t.what}><strong style={{ color: T.ink }}>{t.what}.</strong> {t.why}</li>)}</ul>
      </Block>
    </section>
  );
}

const list = { margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column' as const, gap: 6, fontSize: 14, lineHeight: 1.55, color: T.inkDim };
const para = { margin: 0, fontSize: 14, lineHeight: 1.55, color: T.inkDim };

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: T.tealLight, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</div>
      {children}
    </div>
  );
}
