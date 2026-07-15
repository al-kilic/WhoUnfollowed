'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Clock } from 'lucide-react';
import { T } from '@/components/landing/tokens';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { BlogCover } from './BlogArt';
import { BLOG_POSTS, type BlogPost } from './posts';

// BLOG_POSTS is in whatever order posts were added to the source file, not
// publish-date order. Sort newest first for the index, without mutating the
// shared export (other consumers, e.g. cluster linking, don't care about order).
const SORTED_POSTS = [...BLOG_POSTS].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

const TAG_COLORS: Record<string, { color: string }> = {
  Guide: { color: '#5fc4c8' },
  Growth: { color: '#c8a96e' },
  Privacy: { color: '#d4735a' },
};

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const [hovered, setHovered] = React.useState(false);
  const tag = TAG_COLORS[post.tag] ?? TAG_COLORS['Guide']!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            border: `1px solid ${hovered ? 'rgba(2,136,143,0.45)' : T.border1}`,
            background: T.bgCard,
            boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(2,136,143,0.1)` : '0 2px 12px rgba(0,0,0,0.06)',
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          }}
        >
          {/* Cover illustration */}
          <div style={{ position: 'relative', height: 168, overflow: 'hidden' }}>
            <BlogCover image={post.image} art={post.art} alt={post.imageAlt} rounded={0} style={{ height: '100%' }} />
            {/* Tag badge */}
            <div style={{ position: 'absolute', top: 14, left: 14 }}>
              <span style={{ fontSize: 10, fontFamily: T.mono, padding: '4px 10px', borderRadius: 20, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: tag.color, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: `1px solid ${tag.color}40` }}>
                {post.tag}
              </span>
            </div>
            {/* Hover read overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(3px)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.25s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#01696f', color: '#f4f0e8', padding: '10px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, fontFamily: T.sans, boxShadow: '0 4px 20px rgba(1,105,111,0.5)' }}>
                <BookOpen size={15} />
                Read Article
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '20px 22px 22px' }}>
            <h2 style={{ fontFamily: T.serif, fontSize: 18, fontWeight: 400, color: T.ink, lineHeight: 1.3, letterSpacing: '-0.01em', marginBottom: 10 }}>
              {post.title}
            </h2>
            <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.65, marginBottom: 18, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {post.excerpt}
            </p>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${T.border1}`, paddingTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, #014d52, #01696f)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#f4f0e8', fontFamily: T.serif, flexShrink: 0 }}>A</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, lineHeight: 1.2 }}>Alan Kilic</div>
                  <div style={{ fontSize: 11, color: T.inkMute }}>{post.date}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: T.inkMute }}>
                <Clock size={11} />
                {post.readTime} read
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function BlogIndex() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav />

      <main className="px-4 sm:px-8" style={{ maxWidth: 900, margin: '0 auto', paddingTop: 56, paddingBottom: 80 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 }}>Blog</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 400, letterSpacing: '-0.03em', color: T.ink, marginBottom: 10 }}>
            Guides on Instagram, privacy, and follower tracking.
          </h1>
          <p style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.6 }}>
            Honest takes. No growth hacks. Nothing that gets your account banned.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 20 }}>
          {SORTED_POSTS.map((post, i) => <BlogCard key={post.slug} post={post} index={i} />)}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: 48, paddingTop: 28, borderTop: `1px solid ${T.border1}` }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Back to WhoUnfollowed
          </Link>
        </motion.div>
      </main>

      <LandingFooter />
    </div>
  );
}
