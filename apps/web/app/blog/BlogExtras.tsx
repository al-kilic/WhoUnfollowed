// The sections after a post body: FAQ, CTA, topic cluster, glossary and more
// posts. Server only. Styles in styles/blog.css.
import React from 'react';
import Link from 'next/link';
import { BlogCover } from './BlogArt';
import { BlogCtaLink } from './BlogCtaLink';
import { BLOG_POSTS, CLUSTERS, type BlogPost } from './posts';
import { GLOSSARY_TERMS } from './glossary';

const Arrow = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

// FAQ: visible Q&A matching the FAQPage JSON-LD emitted in page.tsx, so AI
// answer engines can extract and cite each answer directly.
export function BlogFaq({ post }: { post: BlogPost }) {
  if (!post.faq || post.faq.length === 0) return null;
  return (
    <section className="bl-sec">
      <h2 className="bl-h2">Frequently asked questions</h2>
      <div className="bl-faq">
        {post.faq.map((item, i) => (
          <div key={i}>
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// CTA: topic-specific when the post defines one (post.cta), generic fallback
// otherwise. Bridges the post's pain straight to the tool.
export function BlogCta({ post }: { post: BlogPost }) {
  return (
    <div className="bl-cta">
      <p className="bl-cta-h">{post.cta?.heading ?? 'See your own list.'}</p>
      <p className="bl-cta-p">
        {post.cta?.body ?? 'Upload the export Instagram gives you and see exactly who unfollowed you and who never followed back, right in your browser. No password, nothing uploaded.'}
      </p>
      <BlogCtaLink href="/" slug={post.slug} kind="primary" className="s-btn acc">
        {post.cta?.buttonLabel ?? 'Upload your Instagram export'}
        <Arrow />
      </BlogCtaLink>
      {post.cta?.proNudge && (
        <p className="bl-cta-nudge">
          {post.cta.proNudge}{' '}
          <BlogCtaLink href="/pricing" slug={post.slug} kind="pro-nudge" className="bl-link" style={{ whiteSpace: 'nowrap' }}>See Pro AI →</BlogCtaLink>
        </p>
      )}
      {post.cta?.coachNudge && (
        <p className="bl-cta-nudge">
          {post.cta.coachNudge}{' '}
          <BlogCtaLink href="/instagram-coach" slug={post.slug} kind="pro-nudge" className="bl-link" style={{ whiteSpace: 'nowrap' }}>Meet the coach →</BlogCtaLink>
        </p>
      )}
    </div>
  );
}

// Pillar-and-cluster linking: supporting posts link up to their pillar,
// pillars link down to every supporting post in the cluster. Hidden on a
// pillar with no supporting posts yet, so it never renders an empty series.
export function BlogCluster({ post }: { post: BlogPost }) {
  const cluster = CLUSTERS[post.cluster];
  const isPillar = post.slug === cluster.pillarSlug;
  const clusterPosts = BLOG_POSTS.filter((p) => p.cluster === post.cluster);
  const pillar = clusterPosts.find((p) => p.slug === cluster.pillarSlug);
  const supporting = clusterPosts.filter((p) => p.slug !== cluster.pillarSlug);
  const seriesList = isPillar ? supporting : supporting.filter((p) => p.slug !== post.slug);
  if (isPillar && seriesList.length === 0) return null;
  return (
    <div className="bl-box acc">
      <div className="bl-eyebrow">{isPillar ? `Guide · ${cluster.label}` : 'Part of a guide'}</div>
      {!isPillar && pillar && (
        <Link href={`/blog/${pillar.slug}`} className="bl-pillar" style={seriesList.length > 0 ? undefined : { marginBottom: 0 }}>
          <small>Read the full guide</small>
          <b>{pillar.title} →</b>
        </Link>
      )}
      {isPillar && <p>This is the main guide on {cluster.label.toLowerCase()}. Keep going with the rest of the series.</p>}
      {seriesList.length > 0 && (
        <div className="bl-series">
          {seriesList.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`}><span>→</span><span>{p.title}</span></Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Glossary: only on pillar posts, for readers and for AI-answer-engine citation.
export function BlogGlossary({ post }: { post: BlogPost }) {
  if (post.slug !== CLUSTERS[post.cluster].pillarSlug) return null;
  return (
    <div className="bl-sec" style={{ borderTop: 0, paddingTop: 0 }}>
      <div className="bl-eyebrow" style={{ color: 'var(--faint)' }}>Glossary</div>
      <div className="bl-box bl-gloss" style={{ marginTop: 0 }}>
        {GLOSSARY_TERMS.map((g) => (
          <div key={g.term}><b>{g.term}</b><span>{g.definition}</span></div>
        ))}
      </div>
    </div>
  );
}

export function BlogMore({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  return (
    <div className="bl-sec" style={{ borderTop: 0, paddingTop: 0 }}>
      <div className="bl-eyebrow" style={{ color: 'var(--faint)' }}>More from the blog</div>
      <div className="bl-more">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`}>
            <span className="th"><BlogCover image={p.image} art={p.art} alt="" rounded={0} /></span>
            <span><b>{p.title}</b><small>Read →</small></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
