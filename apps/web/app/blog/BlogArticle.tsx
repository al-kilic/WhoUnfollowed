// Server component on purpose: it renders static article content and imports
// the full BLOG_POSTS array for cluster linking, which must stay out of the
// client bundle. Interactive children (SiteNav, footer) are client islands.
import React from 'react';
import Link from 'next/link';
import { T } from '@/components/landing/tokens';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { BlogArt, BlogCover, type ArtVariant } from './BlogArt';
import { BLOG_POSTS, CLUSTERS, type BlogPost } from './posts';
import { GLOSSARY_TERMS } from './glossary';

const TAG_COLORS: Record<string, { color: string; bg: string }> = {
  Guide: { color: T.tealMid, bg: 'rgba(2,136,143,0.1)' },
  Growth: { color: '#a0956b', bg: 'rgba(160,149,107,0.1)' },
  Privacy: { color: T.terra, bg: 'rgba(168,75,47,0.1)' },
};

// Inline formatting: [text](url) links and **bold**.
function inline(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
      const ext = String(url).startsWith('http');
      return `<a href="${url}" style="color:${T.tealLight};text-decoration:none;font-weight:500"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, (_, b) => `<strong style="color:${T.ink};font-weight:600">${b}</strong>`);
}

// `post.body` is NOT full markdown, it's a small hand-rolled subset. Only the
// syntax explicitly handled below actually renders correctly; anything else
// (blockquotes, code fences, nested/indented lists, single-asterisk italics,
// setext headers, etc.) silently falls through to a plain <p> and prints as
// literal text. Supported block-level syntax (each must be its own
// \n\n-separated paragraph):
//   [[art:variant]]         inline abstract cover art (see ArtVariant)
//   ![alt](src)              image, src usually /blog/<file>.jpg
//   ### text                 h3
//   ## text                  h2
//   - item                   bullet list (every line in the block must start with "- ")
//   1. item                  numbered list (every line must start with "N. ")
//   | a | b |\n|---|---|\n...  pipe table (header row + separator + body rows)
// Supported inline syntax (works inside paragraphs, list items, table cells):
//   **bold**, [text](url)
// If you're generating a new post body, only use the syntax above.
function renderBody(body: string) {
  const blocks = body.split('\n\n');
  return blocks.map((raw, i) => {
    const para = raw.trim();

    // Inline cover-art figure: [[art:variant]]
    const artMatch = para.match(/^\[\[art:(\w+)\]\]$/);
    if (artMatch) {
      const variant = artMatch[1] as ArtVariant;
      return (
        <figure key={i} style={{ margin: '40px 0', borderRadius: 16, overflow: 'hidden', border: `1px solid ${T.border1}`, aspectRatio: '5 / 2' }}>
          <BlogArt variant={variant} alt="" rounded={0} />
        </figure>
      );
    }

    // Markdown image: ![alt](src)
    const imgMatch = para.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      return (
        <figure key={i} style={{ margin: '40px 0' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgMatch[2]} alt={imgMatch[1]} loading="lazy" style={{ width: '100%', borderRadius: 16, border: `1px solid ${T.border1}`, display: 'block' }} />
        </figure>
      );
    }

    if (para.startsWith('### ')) {
      return (
        <h3 key={i} style={{ fontFamily: T.serif, fontSize: 'clamp(19px, 3vw, 23px)', fontWeight: 500, color: T.ink, letterSpacing: '-0.01em', marginTop: 40, marginBottom: 10 }}>
          {para.replace('### ', '')}
        </h3>
      );
    }
    if (para.startsWith('## ')) {
      return (
        <h2 key={i} style={{ fontFamily: T.serif, fontSize: 'clamp(23px, 4vw, 32px)', fontWeight: 400, color: T.ink, letterSpacing: '-0.02em', marginTop: 52, marginBottom: 16 }}>
          {para.replace('## ', '')}
        </h2>
      );
    }
    // Markdown pipe table: header row, |---|---| separator, body rows.
    if (para.startsWith('|')) {
      const rows = para.split('\n').map((r) => r.trim()).filter(Boolean);
      const toCells = (r: string) => r.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
      const isSeparator = (r: string) => /^[|\-:\s]+$/.test(r) && r.includes('-');
      const headerRow = rows[0];
      const separatorRow = rows[1];
      if (headerRow && separatorRow && rows.length >= 2 && isSeparator(separatorRow)) {
        const header = toCells(headerRow);
        const body = rows.slice(2).map(toCells);
        return (
          <div key={i} style={{ overflowX: 'auto', marginBottom: 28, borderRadius: 12, border: `1px solid ${T.border1}` }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
              <thead>
                <tr>
                  {header.map((h, hi) => (
                    <th key={hi} style={{ textAlign: 'left', padding: '12px 16px', background: T.surface1, color: T.ink, fontWeight: 600, borderBottom: `1px solid ${T.border1}`, whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((c, ci) => (
                      <td
                        key={ci}
                        style={{ padding: '12px 16px', color: T.inkDim, borderBottom: ri < body.length - 1 ? `1px solid ${T.border1}` : 'none' }}
                        dangerouslySetInnerHTML={{ __html: inline(c) }}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }

    // Numbered list: "1. text" lines, rendered with real numbering.
    if (/^\d+\.\s/.test(para)) {
      const items = para.split('\n').filter((l) => /^\d+\.\s/.test(l.trim()));
      return (
        <ol key={i} style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {items.map((item, j) => (
            <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 18, color: T.inkDim, lineHeight: 1.75 }}>
              <span style={{ flexShrink: 0, minWidth: 24, fontFamily: T.mono, fontSize: 14, color: T.tealMid, fontWeight: 600, marginTop: 2 }}>
                {item.trim().match(/^\d+/)?.[0]}.
              </span>
              <span dangerouslySetInnerHTML={{ __html: inline(item.replace(/^\s*\d+\.\s/, '')) }} />
            </li>
          ))}
        </ol>
      );
    }

    if (para.startsWith('- ')) {
      const items = para.split('\n').filter((l) => l.trim().startsWith('- '));
      return (
        <ul key={i} style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {items.map((item, j) => (
            <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 18, color: T.inkDim, lineHeight: 1.75 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.tealMid, flexShrink: 0, marginTop: 11 }} />
              <span dangerouslySetInnerHTML={{ __html: inline(item.replace(/^-\s/, '')) }} />
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} style={{ fontSize: 18, color: T.inkDim, lineHeight: 1.85, marginBottom: 28 }} dangerouslySetInnerHTML={{ __html: inline(para) }} />
    );
  });
}

export function BlogArticle({ post, otherPosts }: { post: BlogPost; otherPosts: BlogPost[] }) {
  const tag = TAG_COLORS[post.tag] ?? TAG_COLORS['Guide']!;

  // Pillar-and-cluster linking: supporting posts link up to their pillar,
  // pillars link down to every supporting post in the cluster.
  const cluster = CLUSTERS[post.cluster];
  const isPillar = post.slug === cluster.pillarSlug;
  const clusterPosts = BLOG_POSTS.filter((p) => p.cluster === post.cluster);
  const pillar = clusterPosts.find((p) => p.slug === cluster.pillarSlug);
  const supporting = clusterPosts.filter((p) => p.slug !== cluster.pillarSlug);
  const seriesList = isPillar ? supporting : supporting.filter((p) => p.slug !== post.slug);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav />

      <main className="px-4 sm:px-8" style={{ maxWidth: 760, margin: '0 auto', paddingTop: 56, paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontFamily: T.mono, padding: '3px 10px', borderRadius: 20, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: tag.color, background: tag.bg }}>
              {post.tag}
            </span>
            <span style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono }}>{post.date}</span>
            <span style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono }}>{post.readTime} read</span>
          </div>
          <p style={{ fontSize: 11, fontFamily: T.mono, color: T.inkMute, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 10px' }}>
            WhoUnfollowed Blog
          </p>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 18 }}>
            {post.title}
          </h1>
          <p style={{ fontSize: 20, color: T.inkDim, lineHeight: 1.6, fontWeight: 400 }}>{post.excerpt}</p>
        </div>

        {/* Hero cover */}
        <div style={{ borderRadius: 18, overflow: 'hidden', border: `1px solid ${T.border1}`, aspectRatio: '5 / 2', marginBottom: 8 }}>
          <BlogCover image={post.image} art={post.art} alt={post.imageAlt} rounded={0} priority />
        </div>

        {/* Body */}
        <article style={{ borderTop: `1px solid ${T.border1}`, paddingTop: 40, marginTop: 28 }}>
          {renderBody(post.body)}
        </article>

        {/* CTA: topic-specific when the post defines one (post.cta), generic
            fallback otherwise. Bridges the post's pain straight to the tool. */}
        <div style={{ marginTop: 48, padding: '30px 28px', borderRadius: 16, background: T.surface1, border: `1px solid ${T.border1}`, textAlign: 'center' }}>
          <p style={{ fontFamily: T.serif, fontSize: 23, color: T.ink, marginBottom: 10, letterSpacing: '-0.01em', lineHeight: 1.15 }}>
            {post.cta?.heading ?? 'See your own list.'}
          </p>
          <p style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.6, maxWidth: 460, margin: '0 auto 20px' }}>
            {post.cta?.body ?? 'Upload the export Instagram gives you and see exactly who unfollowed you and who never followed back, right in your browser. No password, nothing uploaded.'}
          </p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 11, background: T.teal, color: T.cream, fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans, boxShadow: `0 6px 20px ${T.tealGlow}` }}>
            {post.cta?.buttonLabel ?? 'Upload your Instagram export'}
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          {post.cta?.proNudge && (
            <p style={{ fontSize: 13, color: T.inkMute, lineHeight: 1.6, marginTop: 18 }}>
              {post.cta.proNudge}{' '}
              <Link href="/pricing" style={{ color: T.tealLight, textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}>See Pro →</Link>
            </p>
          )}
        </div>

        {/* Topic cluster: pillar + series linking. Hidden on a pillar that has
            no supporting posts yet, so it never renders an empty series. */}
        {(!isPillar || seriesList.length > 0) && (
        <div style={{ marginTop: 40, padding: '22px 24px', borderRadius: 16, background: 'rgba(2,136,143,0.045)', border: '1px solid rgba(2,136,143,0.16)' }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
            {isPillar ? `Guide · ${cluster.label}` : 'Part of a guide'}
          </div>

          {!isPillar && pillar && (
            <Link href={`/blog/${pillar.slug}`} style={{ display: 'block', textDecoration: 'none', marginBottom: seriesList.length > 0 ? 16 : 0 }}>
              <div style={{ fontSize: 13, color: T.inkDim, marginBottom: 3 }}>Read the full guide</div>
              <div style={{ fontFamily: T.serif, fontSize: 19, color: T.tealLight, lineHeight: 1.25, letterSpacing: '-0.01em' }}>{pillar.title} →</div>
            </Link>
          )}

          {isPillar && (
            <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.6, marginBottom: seriesList.length > 0 ? 16 : 0 }}>
              This is the main guide on {cluster.label.toLowerCase()}. Keep going with the rest of the series.
            </p>
          )}

          {seriesList.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid rgba(2,136,143,0.14)', paddingTop: 14 }}>
              {seriesList.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 15, color: T.inkDim, textDecoration: 'none', lineHeight: 1.4 }}>
                  <span style={{ color: T.tealMid, flexShrink: 0 }}>→</span>
                  <span>{p.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        )}

        {/* Glossary: shown only on pillar posts, for readers and for AI-answer-engine citation */}
        {isPillar && (
          <div style={{ marginTop: 40 }}>
            <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Glossary</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '22px 24px', borderRadius: 16, background: T.surface1, border: `1px solid ${T.border1}` }}>
              {GLOSSARY_TERMS.map((g) => (
                <div key={g.term}>
                  <div style={{ fontFamily: T.serif, fontSize: 16, color: T.ink, marginBottom: 4 }}>{g.term}</div>
                  <div style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.6 }}>{g.definition}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* More posts */}
        {otherPosts.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>More from the blog</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {otherPosts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none', padding: '14px 16px', borderRadius: 12, background: T.surface1, border: `1px solid ${T.border1}`, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 84, height: 54, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: `1px solid ${T.border1}` }}>
                    <BlogCover image={p.image} art={p.art} alt="" rounded={0} />
                  </div>
                  <div>
                    <div style={{ fontFamily: T.serif, fontSize: 16, color: T.ink, marginBottom: 4, lineHeight: 1.25 }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: T.tealLight, fontWeight: 500 }}>Read →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${T.border1}` }}>
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            All posts
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
