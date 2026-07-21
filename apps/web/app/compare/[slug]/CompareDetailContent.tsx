'use client';

import React from 'react';
import Link from 'next/link';
import { T } from '@/components/landing/tokens';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { type Comparison, COMPARISONS } from '../comparisons';
import { Icon } from '@/components/landing/atoms';

// Maps a comparison row's feature text to a representative icon. Deliberately
// generic/abstract (lock, shield, server...), never a competitor's actual
// brand mark, so this works for any competitor without any trademark or
// copyright exposure.
function featureIcon(feature: string): keyof typeof Icon {
  const f = feature.toLowerCase();
  if (f.includes('password')) return 'lock';
  if (f.includes('ban')) return 'shield';
  if (f.includes('server')) return 'server';
  if (f.includes('open source')) return 'code';
  if (f.includes('signup') || f.includes('account')) return 'lock';
  if (f.includes('free') || f.includes('offline') || f.includes('browser') || f.includes('install')) return 'bolt';
  return 'shield';
}

export function CompareDetailContent({ c }: { c: Comparison }) {
  const others = COMPARISONS.filter(x => x.slug !== c.slug);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav />

      <main className="px-4 sm:px-8" style={{ maxWidth: 720, margin: '0 auto', paddingTop: 56, paddingBottom: 80 }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <Link href="/compare" style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            All comparisons
          </Link>

          {/* Abstract "vs" badge: neutral shapes only, never a competitor's actual logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(2,136,143,0.1)', border: `1px solid rgba(2,136,143,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon.shield size={22} color={T.tealMid} />
            </div>
            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.inkMute, letterSpacing: '0.1em', flexShrink: 0 }}>VS</span>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(168,75,47,0.08)', border: `1px solid rgba(168,75,47,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon.lock size={22} color={T.terra} />
            </div>
          </div>

          <p style={{ fontSize: 11, fontFamily: T.mono, color: T.tealMid, letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 8px' }}>WhoUnfollowed vs</p>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 400, letterSpacing: '-0.03em', color: T.ink, lineHeight: 1.05, marginBottom: 16 }}>
            {c.competitorName}
          </h1>
          <p style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.65 }}>{c.excerpt}</p>
        </div>

        {/* Comparison table */}
        <div style={{ borderRadius: 16, border: `1px solid ${T.border1}`, overflow: 'hidden', marginBottom: 40 }}>
          <div className="grid grid-cols-3" style={{ background: T.surface1, borderBottom: `1px solid ${T.border1}` }}>
            <div style={{ padding: '12px 16px', fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.08em' }}>Feature</div>
            <div style={{ padding: '12px 16px', fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.08em', textAlign: 'center', borderLeft: `1px solid ${T.border1}` }}>WhoUnfollowed</div>
            <div style={{ padding: '12px 16px', fontSize: 11, color: T.terra, fontFamily: T.mono, letterSpacing: '0.08em', textAlign: 'center', borderLeft: `1px solid ${T.border1}` }}>{c.competitorName}</div>
          </div>
          {c.rows.map((row, i) => {
            const RowIcon = Icon[featureIcon(row.feature)];
            return (
              <div key={row.feature} className="grid grid-cols-3" style={{ borderBottom: i < c.rows.length - 1 ? `1px solid ${T.border1}` : 'none' }}>
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: T.inkDim }}>
                  <span style={{ flexShrink: 0, opacity: 0.6, display: 'flex' }}><RowIcon size={14} color={T.inkMute} /></span>
                  {row.feature}
                </div>
                {[row.us, row.them].map((val, ci) => (
                  <div key={ci} style={{ padding: '12px 16px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderLeft: `1px solid ${T.border1}` }}>
                    {val
                      ? <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(2,136,143,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.check size={13} color={T.tealMid} /></span>
                      : <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(168,75,47,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.x size={11} color={T.terra} /></span>
                    }
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Body */}
        <article style={{ marginBottom: 40 }}>
          {c.body.split('\n\n').map((para, i) => (
            <p key={i} style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.75, marginBottom: 18 }}>{para}</p>
          ))}
        </article>

        {/* Verdict */}
        <div style={{ padding: '20px 22px', borderRadius: 14, background: T.surface1, border: `1px solid ${T.border2}`, marginBottom: 32 }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Verdict</div>
          <p style={{ fontSize: 15, color: T.ink, lineHeight: 1.65, margin: 0 }}>{c.verdict}</p>
        </div>

        {/* Related guide */}
        <div style={{ marginBottom: 40, padding: '18px 20px', borderRadius: 14, background: T.surface1, border: `1px solid ${T.border1}` }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>Related reading</div>
          <Link href="/blog/why-instagram-follower-trackers-ask-for-your-password" style={{ fontFamily: T.serif, fontSize: 18, color: T.tealLight, textDecoration: 'none', lineHeight: 1.3 }}>
            Why Instagram follower trackers ask for your password →
          </Link>
        </div>

        {/* CTA */}
        <div style={{ padding: '24px', borderRadius: 16, background: 'rgba(2,136,143,0.06)', border: '1px solid rgba(2,136,143,0.2)', textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 14, color: T.inkDim, marginBottom: 16 }}>{c.cta}</p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 11, background: T.teal, color: T.cream, fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans, boxShadow: `0 6px 20px ${T.tealGlow}` }}>
            Try WhoUnfollowed free →
          </Link>
        </div>

        {/* Other comparisons */}
        {others.length > 0 && (
          <div>
            <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>More comparisons</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {others.map(o => (
                <Link key={o.slug} href={`/compare/${o.slug}`} style={{ textDecoration: 'none', padding: '14px 18px', borderRadius: 12, background: T.surface1, border: `1px solid ${T.border1}`, display: 'block' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.borderColor = T.border3}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.borderColor = T.border1}>
                  <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>WhoUnfollowed vs</div>
                  <div style={{ fontSize: 15, color: T.ink, fontFamily: T.serif }}>{o.competitorName} →</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <LandingFooter />
    </div>
  );
}
