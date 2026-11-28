// Server component: the post list is static, so the full BLOG_POSTS array
// never reaches the client bundle. Styles in styles/blog.css.
import React from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import '@/styles/blog.css';
import { StudioFrame } from '@/components/studio/StudioFrame';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { BlogCover } from './BlogArt';
import { BackArrow } from './BlogArticle';
import { BLOG_POSTS, type BlogPost } from './posts';

// BLOG_POSTS is in whatever order posts were added to the source file, not
// publish-date order. Sort newest first for the index, without mutating the
// shared export (other consumers, e.g. cluster linking, don't care about order).
const SORTED_POSTS = [...BLOG_POSTS].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="bl-card">
      <div className="cv">
        <BlogCover image={post.image} art={post.art} alt={post.imageAlt} rounded={0} style={{ height: '100%' }} />
        <span className={`bl-tag ${post.tag}`}>{post.tag}</span>
      </div>
      <div className="bd">
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
        <div className="ft">
          <span>Alan Kilic · {post.date}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Clock size={12} aria-hidden="true" />{post.readTime} read</span>
        </div>
      </div>
    </Link>
  );
}

export function BlogIndex() {
  return (
    <StudioFrame>
      <div className="bl">
        <SiteHeader />
        <main className="bl-main wide">
          <div className="bl-ihead">
            <div className="bl-eyebrow">Blog</div>
            <h1>Guides on Instagram, privacy, and follower tracking.</h1>
            <p>Honest takes. No growth hacks. Nothing that gets your account banned.</p>
          </div>
          <div className="bl-grid">
            {SORTED_POSTS.map((post) => <BlogCard key={post.slug} post={post} />)}
          </div>
          <div className="bl-back">
            <Link href="/"><BackArrow />Back to WhoUnfollowed</Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    </StudioFrame>
  );
}
