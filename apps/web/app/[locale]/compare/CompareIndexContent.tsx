'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, X, Minus, ShieldCheck, Sparkles, BarChart3, Tag } from 'lucide-react';
import { T } from '@/components/landing/tokens';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';
import type { CompareIndexContent as CompareIndexContentData, Val } from './indexContent';

const CATEGORY_ICON: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  ShieldCheck, Sparkles, BarChart3, Tag,
};

// ── Cell renderer ─────────────────────────────────────────────────────────────

function Cell({ val, highlight, content }: { val: Val; highlight: boolean; content: CompareIndexContentData }) {
  const base: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '13px 10px', fontSize: 12, fontFamily: T.mono,
    borderRight: `1px solid ${T.border1}`,
    background: highlight ? 'rgba(2,136,143,0.04)' : 'transparent',
    minWidth: 0,
  };

  if (val === true)  return <div style={base}><span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(2,136,143,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} color={T.tealMid} strokeWidth={2.5} /></span></div>;
  if (val === false) return <div style={base}><span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(168,75,47,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={11} color={T.terra} strokeWidth={2.5} /></span></div>;
  if (val === 'partial' || val === 'limited') return <div style={base}><span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(160,149,107,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={11} color="#a0956b" strokeWidth={2.5} /></span></div>;
  if (val === 'paid')  return <div style={{ ...base, color: '#a0956b' }}>{content.paidLabel}</div>;
  if (val === 'soon')  return <div style={{ ...base, color: T.terra }}>{content.soonLabel}</div>;
  return <div style={{ ...base, color: T.inkDim }}>{val}</div>;
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function CompareIndexContent({ content }: { content: CompareIndexContentData }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);

  const competitors = content.competitorNames.map((name, i) => ({ id: String(i), name, highlight: i === 0 }));

  const syncScroll = () => {
    if (headerRef.current && scrollRef.current) {
      headerRef.current.scrollLeft = scrollRef.current.scrollLeft;
    }
  };

  const COL = `240px repeat(${competitors.length}, minmax(120px, 1fr))`;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav />

      <main style={{ paddingBottom: 80 }}>
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="px-4 sm:px-8" style={{ maxWidth: 760, margin: '0 auto', paddingTop: 52, paddingBottom: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>{content.eyebrow}</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 400, letterSpacing: '-0.03em', color: T.ink, marginBottom: 14 }}>
            {content.headline}
          </h1>
          <p style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.65, maxWidth: 560, margin: '0 auto 28px' }}>
            {content.intro}
          </p>
        </motion.div>

        {/* Sticky column headers — outside scroll container so position:sticky works */}
        <div style={{ position: 'sticky', top: 65, zIndex: 50, overflow: 'hidden', background: T.bg, boxShadow: `0 2px 12px rgba(0,0,0,0.08)` }}>
          <div ref={headerRef} style={{ minWidth: 1040, padding: '0 24px', display: 'grid', gridTemplateColumns: COL, borderBottom: `2px solid ${T.border2}`, pointerEvents: 'none', userSelect: 'none' }}>
            <div style={{ padding: '13px 14px', fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.08em', borderRight: `1px solid ${T.border1}` }}>{content.featureHeader}</div>
            {competitors.map(c => (
              <div key={c.id} style={{
                padding: '12px 10px', textAlign: 'center',
                borderRight: `1px solid ${T.border1}`,
                background: c.highlight ? 'rgba(2,136,143,0.07)' : T.bg,
                borderTop: c.highlight ? `2px solid ${T.tealMid}` : `2px solid transparent`,
                marginTop: c.highlight ? -2 : 0,
              }}>
                {c.highlight && <div style={{ fontSize: 8, color: T.tealMid, fontFamily: T.mono, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>{content.youAreHere}</div>}
                <div style={{ fontSize: 11, fontWeight: c.highlight ? 700 : 500, color: c.highlight ? T.tealLight : T.inkDim, fontFamily: T.sans, lineHeight: 1.2 }}>{c.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Table body — scrolls horizontally, syncs header */}
        <div ref={scrollRef} onScroll={syncScroll} style={{ overflowX: 'auto', paddingBottom: 32, WebkitOverflowScrolling: 'touch' }}>
          <div style={{ minWidth: 1040, padding: '0 24px' }}>

            {/* Feature groups */}
            {content.features.map((group) => {
              const CategoryIcon = CATEGORY_ICON[group.icon];
              return (
              <div key={group.category}>
                {/* Category header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: COL,
                  background: T.bgPanel,
                  borderTop: `2px solid ${T.border2}`,
                  borderBottom: `1px solid ${T.border2}`,
                }}>
                  <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 700, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase', borderRight: `1px solid ${T.border1}` }}>
                    {CategoryIcon && <CategoryIcon size={13} color={T.tealMid} strokeWidth={2} />}
                    {group.category}
                  </div>
                  {competitors.map(c => (
                    <div key={c.id} style={{ borderRight: `1px solid ${T.border1}`, background: c.highlight ? 'rgba(2,136,143,0.05)' : 'transparent' }} />
                  ))}
                </div>

                {/* Feature rows — zebra striped for readability */}
                {group.rows.map((row, ri) => (
                  <div
                    key={row.label}
                    style={{
                      display: 'grid', gridTemplateColumns: COL,
                      borderBottom: `1px solid ${T.border1}`,
                      background: ri % 2 === 0 ? 'transparent' : T.surface1,
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = `rgba(2,136,143,0.04)`)}
                    onMouseLeave={e => (e.currentTarget.style.background = ri % 2 === 0 ? 'transparent' : T.surface1)}
                  >
                    <div style={{ padding: '10px 16px', fontSize: 13, color: T.ink, borderRight: `1px solid ${T.border1}`, display: 'flex', alignItems: 'center', lineHeight: 1.3 }}>
                      {row.label}
                    </div>
                    {competitors.map((c, ci) => (
                      <Cell key={c.id} val={row.values[ci] ?? false} highlight={c.highlight} content={content} />
                    ))}
                  </div>
                ))}
              </div>
              );
            })}

            {/* CTA row */}
            <div style={{ display: 'grid', gridTemplateColumns: COL, borderTop: `2px solid ${T.border2}`, background: T.surface1 }}>
              <div style={{ padding: '20px 16px', borderRight: `1px solid ${T.border1}`, display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono }}>{content.getStarted}</span>
              </div>
              {competitors.map(c => (
                <div key={c.id} style={{ padding: '16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${T.border1}`, background: c.highlight ? 'rgba(2,136,143,0.06)' : 'transparent' }}>
                  {c.highlight ? (
                    <Link href="/" style={{ padding: '8px 16px', borderRadius: 9, background: T.teal, color: T.cream, fontSize: 12, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans, whiteSpace: 'nowrap', boxShadow: `0 4px 16px ${T.tealGlow}` }}>
                      {content.tryFree}
                    </Link>
                  ) : (
                    <span style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono }}>{content.requiresLogin}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ padding: '14px 24px', display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { icon: '✓', color: T.tealMid, bg: 'rgba(2,136,143,0.12)', label: content.legendAvailable },
            { icon: '×', color: T.terra,   bg: 'rgba(168,75,47,0.1)',  label: content.legendNotAvailable },
            { icon: '–', color: '#a0956b', bg: 'rgba(160,149,107,0.12)', label: content.legendLimited },
          ].map(item => (
            <span key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: T.inkMute, fontFamily: T.mono }}>
              <span style={{ width: 16, height: 16, borderRadius: '50%', background: item.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: item.color, fontWeight: 700, flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </span>
          ))}
        </div>

        {/* Individual comparison links */}
        <div className="px-4 sm:px-8" style={{ maxWidth: 760, margin: '0 auto', paddingTop: 16 }}>
          <div style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono, marginBottom: 12 }}>{content.detailedComparisonsLabel}</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {content.detailedComparisonLinks.map(l => (
              <Link key={l.slug} href={`/compare/${l.slug}`} style={{ fontSize: 12, color: T.tealLight, textDecoration: 'none', padding: '5px 12px', borderRadius: 20, border: `1px solid rgba(2,136,143,0.2)`, background: 'rgba(2,136,143,0.04)', fontFamily: T.mono }}>
                {l.label} →
              </Link>
            ))}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
