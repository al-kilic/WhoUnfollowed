import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPost, BLOG_POSTS, CLUSTERS } from '../posts';
import { BlogArticle } from '../BlogArticle';
import { GLOSSARY_TERMS } from '../glossary';

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
  // Prefer the post's real cover photo; fall back to the generated site OG image.
  const ogImage = post.image ? `${SITE_URL}${post.image}` : `${SITE_URL}/opengraph-image`;

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
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);
  const published = new Date(post.date);
  const publishedISO = Number.isNaN(published.getTime()) ? undefined : published.toISOString();
  const ogImage = post.image ? `${SITE_URL}${post.image}` : `${SITE_URL}/opengraph-image`;
  // Approximate word count from the raw body for richer Article metadata.
  const wordCount = post.body.split(/\s+/).filter(Boolean).length;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    datePublished: publishedISO,
    dateModified: publishedISO,
    wordCount,
    author: { '@type': 'Person', '@id': `${SITE_URL}/author/alan-kilic#person`, name: 'Alan Kilic', url: `${SITE_URL}/author/alan-kilic` },
    publisher: {
      '@type': 'Organization',
      name: 'WhoUnfollowed',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
    image: ogImage,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  // Pillar posts carry a DefinedTermSet so AI answer engines can cite our
  // definitions of core terms (non-follower, unfollower, ghost follower, etc.)
  const isPillar = post.slug === CLUSTERS[post.cluster].pillarSlug;
  const glossaryJsonLd = isPillar
    ? {
        '@context': 'https://schema.org',
        '@type': 'DefinedTermSet',
        name: 'WhoUnfollowed Instagram Follower Terms',
        url: `${SITE_URL}/blog/${post.slug}`,
        hasDefinedTerm: GLOSSARY_TERMS.map((g) => ({
          '@type': 'DefinedTerm',
          name: g.term,
          description: g.definition,
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {glossaryJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(glossaryJsonLd) }} />
      )}
      <BlogArticle post={post} otherPosts={otherPosts} />
    </>
  );
}
