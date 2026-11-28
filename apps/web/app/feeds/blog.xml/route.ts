import { BLOG_POSTS } from '@/app/blog/posts';
import { rss } from '@/lib/feeds/rss';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

// RSS for the blog, newest first.
export function GET(): Response {
  const items = BLOG_POSTS.map((p) => {
    const d = new Date(p.date);
    return { title: p.title, link: `${SITE_URL}/blog/${p.slug}`, description: p.excerpt, date: Number.isNaN(d.getTime()) ? null : d };
  }).sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
  return rss({
    title: 'WhoUnfollowed blog',
    link: `${SITE_URL}/blog`,
    self: `${SITE_URL}/feeds/blog.xml`,
    description: 'Guides on Instagram, Threads and TikTok followers, unfollowers and privacy.',
    language: 'en',
    items,
  });
}
