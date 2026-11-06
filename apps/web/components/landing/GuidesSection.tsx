import React from 'react';
import Link from 'next/link';
import { T } from './tokens';
import { Icon } from './atoms';
import { HOME_GUIDE_SLUGS, type GuidesSectionContent } from './guidesSection.content';

// Plain next/link, not the locale-aware Link: the blog lives only at /blog
// (no /es or /pt prefix), so every locale links to the same URLs.
export function GuidesSection({ content }: { content: GuidesSectionContent }) {
  return (
    <section className="px-4 sm:px-12 py-14 sm:py-20" aria-labelledby="home-guides-heading">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.tealMid, letterSpacing: '0.18em' }}>{content.eyebrow}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--t-border2)' }} />
        </div>
        <h2
          id="home-guides-heading"
          style={{ fontFamily: T.serif, fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: content.note ? 8 : 24 }}
        >
          {content.heading}
        </h2>
        {content.note && (
          <p style={{ fontSize: 13, color: T.inkMute, marginBottom: 24 }}>{content.note}</p>
        )}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 12, listStyle: 'none', padding: 0, margin: 0 }}>
          {HOME_GUIDE_SLUGS.map((slug) => (
            <li key={slug}>
              <Link
                href={`/blog/${slug}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  height: '100%', padding: '18px 20px', borderRadius: 14,
                  background: 'var(--t-surface1)', border: '1px solid var(--t-border1)',
                  color: T.ink, fontSize: 15, lineHeight: 1.4, textDecoration: 'none',
                }}
              >
                <span>{content.titles[slug]}</span>
                <Icon.arrow size={14} color={T.tealMid} />
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/blog"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                height: '100%', padding: '18px 20px', borderRadius: 14,
                border: '1px dashed var(--t-border2)', color: T.tealMid, fontSize: 15, textDecoration: 'none',
              }}
            >
              <span>{content.allGuides}</span>
              <Icon.arrow size={14} color={T.tealMid} />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
