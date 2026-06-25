import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPost, BLOG_POSTS } from '../posts';
import { BlogArticle } from '../BlogArticle';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Post not found' };

  const url = `${SITE_URL}/blog/${post.slug}`;
  const published = new Date(post.date);

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: [post.primaryKeyword],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.metaTitle,
      description: post.metaDescription,
      url,
      siteName: 'WhoUnfollowed',
      publishedTime: Number.isNaN(published.getTime()) ? undefined : published.toISOString(),
      authors: ['Alan Kilic'],
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: post.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);
  const published = new Date(post.date);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    datePublished: Number.isNaN(published.getTime()) ? undefined : published.toISOString(),
    author: { '@type': 'Person', name: 'Alan Kilic' },
    publisher: {
      '@type': 'Organization',
      name: 'WhoUnfollowed',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
    image: `${SITE_URL}/opengraph-image`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogArticle post={post} otherPosts={otherPosts} />
    </>
  );
}
