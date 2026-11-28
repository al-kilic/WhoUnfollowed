import type { Metadata } from 'next';
import Link from 'next/link';
import '@/styles/blog.css';
import { StudioFrame } from '@/components/studio/StudioFrame';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { BLOG_POSTS } from '@/app/blog/posts';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';
const AUTHOR_URL = `${SITE_URL}/author/alan-kilic`;

export const metadata: Metadata = {
  title: 'Alan Kilic, Founder of WhoUnfollowed',
  description:
    'Alan Kilic is the independent developer behind WhoUnfollowed, building privacy-first software under Alcatraz Studio. Read his guides on Instagram followers, unfollowers, and data privacy.',
  alternates: { canonical: AUTHOR_URL },
  openGraph: {
    type: 'profile',
    title: 'Alan Kilic, Founder of WhoUnfollowed',
    description:
      'The independent developer behind WhoUnfollowed. Privacy-first software under Alcatraz Studio, and guides on Instagram followers, unfollowers, and data privacy.',
    url: AUTHOR_URL,
    siteName: 'WhoUnfollowed',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alan Kilic, Founder of WhoUnfollowed',
    description: 'Independent developer behind WhoUnfollowed. Privacy-first software, honest guides.',
  },
};

// Canonical author entity. The #person @id is reused by blog Article author
// links and the /about ProfilePage so engines resolve one consistent Person.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    '@id': `${AUTHOR_URL}#person`,
    name: 'Alan Kilic',
    url: AUTHOR_URL,
    jobTitle: 'Founder and developer',
    description:
      'Independent developer and photographer building privacy-first software under the name Alcatraz Studio.',
    knowsAbout: [
      'Instagram followers',
      'Instagram unfollowers',
      'Data privacy',
      'GDPR data portability',
    ],
    sameAs: ['https://github.com/al-kilic'],
    worksFor: { '@id': `${SITE_URL}/#organization` },
  },
};

export default function AuthorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StudioFrame>
        <div className="bl">
          <SiteHeader />

          <main className="bl-main">
            <div className="bl-eyebrow">Author</div>

            <div className="bl-author">
              <span className="bl-av" aria-hidden="true">A</span>
              <div>
                <h1>Alan Kilic</h1>
                <p>Founder and developer of WhoUnfollowed. Building privacy-first software under Alcatraz Studio.</p>
              </div>
            </div>

            <div className="bl-bio">
              <p>
                I build small, honest tools that give people control over their own data. WhoUnfollowed exists
                because every other Instagram follower tracker asks for a password it has no business asking for.
                This one never does. You upload the export Instagram or Threads already gives you, and your browser reads it locally.
              </p>
              <p style={{ margin: 0 }}>
                I write the guides on this site myself, drawn from building the parser and watching how real Instagram
                exports behave. The goal is straight answers, not hype: what Instagram actually notifies, why counts drop
                overnight, and how to read your own data without handing it to anyone.
              </p>
            </div>

            <div className="bl-links">
              <a className="s-btn sec" href="https://github.com/al-kilic" target="_blank" rel="noopener noreferrer">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
                github.com/al-kilic
              </a>
              <a className="s-btn sec" href="mailto:hello@whounfollowed.co">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 4 L8 9 L14 4" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round"/></svg>
                Email
              </a>
              <Link className="s-btn sec" href="/about">More about the project</Link>
            </div>

            <div className="bl-sec">
              <div className="bl-eyebrow">Written by Alan</div>
              <div className="bl-plist">
                {BLOG_POSTS.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}>
                    <small>{post.tag} · {post.readTime}</small>
                    <b>{post.title}</b>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bl-back">
              <Link href="/">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Back to WhoUnfollowed
              </Link>
            </div>
          </main>

          <SiteFooter />
        </div>
      </StudioFrame>
    </>
  );
}
