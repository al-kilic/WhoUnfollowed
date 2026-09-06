'use client';

import React from 'react';
import { T } from './tokens';
import { Icon } from './atoms';
import { UNLOCK_PRICE_SUMMARY } from '@/lib/pricing';

type CategoryId = 'privacy' | 'product' | 'billing';

interface FaqContent {
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  intro: string;
  stillWondering: string;
  emailUs: string;
  categories: Record<CategoryId, string>;
  items: Record<CategoryId, [string, string][]>;
}

const CATEGORY_ORDER: CategoryId[] = ['privacy', 'product', 'billing'];

function CategoryTabs({ content, activeCat, setActiveCat }: { content: FaqContent; activeCat: CategoryId; setActiveCat: (c: CategoryId) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 4 }}>
      {CATEGORY_ORDER.map(id => {
        const active = activeCat === id;
        return (
          <button
            key={id}
            onClick={() => setActiveCat(id)}
            style={{
              flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 16px', borderRadius: 10,
              background: active ? 'rgba(2,136,143,0.1)' : 'var(--t-surface1)',
              border: `1px solid ${active ? 'rgba(2,136,143,0.3)' : 'var(--t-border1)'}`,
              color: active ? T.ink : T.inkDim,
              fontSize: 13, fontWeight: active ? 600 : 400,
              fontFamily: T.sans, cursor: 'pointer',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
          >
            <span style={{ width: 4, height: 14, borderRadius: 2, background: active ? T.tealLight : 'transparent', transition: 'background 0.2s', flexShrink: 0 }} />
            {content.categories[id]}
            <span style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono }}>{content.items[id].length}</span>
          </button>
        );
      })}
    </div>
  );
}

function Accordion({ content, activeCat }: { content: FaqContent; activeCat: CategoryId }) {
  const [openIdx, setOpenIdx] = React.useState(0);
  React.useEffect(() => setOpenIdx(0), [activeCat]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {content.items[activeCat].map(([q, rawAnswer], i) => {
        const a = rawAnswer.replace('{price}', UNLOCK_PRICE_SUMMARY);
        const open = openIdx === i;
        return (
          <div
            key={`${activeCat}-${i}`}
            style={{
              borderRadius: 14,
              background: open ? 'rgba(2,136,143,0.05)' : 'var(--t-surface1)',
              border: `1px solid ${open ? 'rgba(2,136,143,0.2)' : 'var(--t-border1)'}`,
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <button
              onClick={() => setOpenIdx(open ? -1 : i)}
              style={{ width: '100%', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontFamily: T.serif, fontSize: 18, lineHeight: 1.3, letterSpacing: '-0.01em', color: T.ink }}>{q}</span>
              <span style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                background: open ? T.tealMid : 'var(--t-border1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s',
                transform: open ? 'rotate(45deg)' : 'rotate(0)',
              }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2 V12 M2 7 H12" stroke={open ? T.cream : T.ink} strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </span>
            </button>
            <div style={{ maxHeight: open ? 300 : 0, opacity: open ? 1 : 0, overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
              <div style={{ padding: '0 20px 20px', fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>{a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function FAQSection({ content }: { content: FaqContent }) {
  const [activeCat, setActiveCat] = React.useState<CategoryId>('privacy');

  return (
    <section className="px-4 sm:px-12 pb-24 sm:pb-32">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 14 }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.tealMid, letterSpacing: '0.18em' }}>{content.eyebrow}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--t-border2)' }} />
        </div>

        {/* ── Mobile layout: heading → tabs → accordion → contact ── */}
        <div className="sm:hidden">
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(36px, 10vw, 56px)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 16, color: T.ink }}>
            {content.headlineLine1}<br/>
            <span style={{ fontStyle: 'italic', color: T.tealLight }}>{content.headlineLine2}</span>
          </h2>
          <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.55, marginBottom: 24 }}>
            {content.intro}
          </p>
          <div style={{ marginBottom: 20 }}>
            <CategoryTabs content={content} activeCat={activeCat} setActiveCat={setActiveCat} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <Accordion content={content} activeCat={activeCat} />
          </div>
          <div style={{ padding: '16px', background: 'rgba(244,240,232,0.025)', border: '1px solid var(--t-border1)', borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.tealLight }} />
              <span style={{ fontSize: 12, color: T.tealLight, fontWeight: 600, fontFamily: T.mono }}>{content.stillWondering}</span>
            </div>
            <a href="mailto:hello@whounfollowed.co" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: T.tealLight, fontWeight: 600, textDecoration: 'none' }}>
              hello@whounfollowed.co
              <Icon.arrow size={12} color={T.tealLight} />
            </a>
          </div>
        </div>

        {/* ── Desktop layout: sidebar + accordion ── */}
        <div className="hidden sm:grid" style={{ gridTemplateColumns: '340px 1fr', gap: 64, alignItems: 'flex-start' }}>
          {/* Left: sticky sidebar */}
          <div style={{ position: 'sticky', top: 80 }}>
            <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(40px, 4.5vw, 56px)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 18, color: T.ink }}>
              {content.headlineLine1}<br/>
              <span style={{ fontStyle: 'italic', color: T.tealLight }}>{content.headlineLine2}</span>
            </h2>
            <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.55, marginBottom: 32, maxWidth: 320 }}>
              {content.intro}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 28 }}>
              {CATEGORY_ORDER.map(id => {
                const active = activeCat === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveCat(id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px', borderRadius: 10,
                      background: active ? 'rgba(2,136,143,0.1)' : 'transparent',
                      border: `1px solid ${active ? 'rgba(2,136,143,0.3)' : 'transparent'}`,
                      color: active ? T.ink : T.inkDim,
                      fontSize: 14, fontWeight: active ? 600 : 400,
                      fontFamily: T.sans, cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 4, height: 18, borderRadius: 2, background: active ? T.tealLight : 'transparent', transition: 'background 0.2s' }} />
                      {content.categories[id]}
                    </span>
                    <span style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono }}>{content.items[id].length}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ padding: '18px', background: 'rgba(244,240,232,0.025)', border: '1px solid var(--t-border1)', borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.tealLight, animation: 'glow-soft 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 12, color: T.tealLight, fontWeight: 600, fontFamily: T.mono, letterSpacing: '0.04em' }}>{content.stillWondering}</span>
              </div>
              <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.5, marginBottom: 12 }}>{content.emailUs}</p>
              <a href="mailto:hello@whounfollowed.co" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: T.tealLight, fontWeight: 600, textDecoration: 'none' }}>
                hello@whounfollowed.co
                <Icon.arrow size={12} color={T.tealLight} />
              </a>
            </div>
          </div>

          {/* Right: accordion */}
          <Accordion content={content} activeCat={activeCat} />
        </div>
      </div>
    </section>
  );
}
