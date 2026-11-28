// Server component on purpose: it renders static article content and imports
// the full BLOG_POSTS array for cluster linking, which must stay out of the
// client bundle. Interactive children (header, footer) are client islands.
import React from 'react';
import Link from 'next/link';
import '@/styles/blog.css';
import { StudioFrame } from '@/components/studio/StudioFrame';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { BlogCover } from './BlogArt';
import { renderBody } from './blogBody';
import { BlogCluster, BlogCta, BlogFaq, BlogGlossary, BlogMore } from './BlogExtras';
import type { BlogPost } from './posts';

export const BackArrow = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export function BlogArticle({ post, otherPosts }: { post: BlogPost; otherPosts: BlogPost[] }) {
  return (
    <StudioFrame>
      <div className="bl">
        <SiteHeader />

        <main className="bl-main">
          <header className="bl-head">
            <div className="bl-meta">
              <span className={`bl-tag ${post.tag}`}>{post.tag}</span>
              <span>{post.date}</span>
              <span className="dot" aria-hidden="true" />
              <span>{post.readTime} read</span>
            </div>
            <p className="bl-eyebrow">WhoUnfollowed Blog</p>
            <h1 className="bl-title">{post.title}</h1>
            <p className="bl-lede">{post.excerpt}</p>
            <div className="bl-byline">
              <span className="bl-av" aria-hidden="true">A</span>
              <span>By <Link href="/author/alan-kilic">Alan Kilic</Link></span>
            </div>
          </header>

          <div className="bl-cover">
            <BlogCover image={post.image} art={post.art} alt={post.imageAlt} rounded={0} priority />
          </div>

          <article className="bl-prose">{renderBody(post.body)}</article>

          <BlogFaq post={post} />
          <BlogCta post={post} />
          <BlogCluster post={post} />
          <BlogGlossary post={post} />
          <BlogMore posts={otherPosts} />

          <div className="bl-back">
            <Link href="/blog"><BackArrow />All posts</Link>
          </div>
        </main>

        <SiteFooter />
      </div>
    </StudioFrame>
  );
}
