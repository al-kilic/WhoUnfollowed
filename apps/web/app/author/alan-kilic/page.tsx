import type { Metadata } from 'next';
import Link from 'next/link';
import { T } from '@/components/landing/tokens';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';
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
      <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
        <SiteNav />

        <main className="px-4 sm:px-8" style={{ maxWidth: 720, margin: '0 auto', paddingTop: 64, paddingBottom: 96 }}>
          {/* Header */}
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16 }}>
            Author
          </div>

          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap' }}>
            <div style={{
              width: 72, height: 72, borderRadius: 18, flexShrink: 0,
              background: `linear-gradient(135deg, ${T.teal} 0%, #014d52 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontFamily: T.serif, color: T.cream,
              boxShadow: `0 8px 24px ${T.tealGlow}`,
            }}>
              A
            </div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(30px, 5vw, 46px)', fontWeight: 400, letterSpacing: '-0.03em', color: T.ink, lineHeight: 1.05, marginBottom: 8 }}>
                Alan Kilic
              </h1>
              <p style={{ fontSize: 14, color: T.inkDim, marginBottom: 0 }}>
                Founder and developer of WhoUnfollowed. Building privacy-first software under Alcatraz Studio.
              </p>
            </div>
          </div>

          {/* Bio */}
          <div style={{ fontSize: 16, color: T.inkDim, lineHeight: 1.75, marginBottom: 28, maxWidth: 620 }}>
            <p style={{ marginBottom: 16 }}>
              I build small, honest tools that give people control over their own data. WhoUnfollowed exists
              because every other Instagram follower tracker asks for a password it has no business asking for.
              This one never does. You upload the export Instagram already gives you, and your browser reads it locally.
            </p>
            <p style={{ margin: 0 }}>
              I write the guides on this site myself, drawn from building the parser and watching how real Instagram
              exports behave. The goal is straight answers, not hype: what Instagram actually notifies, why counts drop
              overnight, and how to read your own data without handing it to anyone.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 56 }}>
            <a href="https://github.com/al-kilic" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 10, border: `1px solid ${T.border2}`, background: T.surface1, color: T.inkDim, textDecoration: 'none', fontSize: 13, fontFamily: T.mono }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
              github.com/al-kilic
            </a>
            <a href="mailto:hello@whounfollowed.co"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 10, border: `1px solid ${T.border2}`, background: T.surface1, color: T.inkDim, textDecoration: 'none', fontSize: 13, fontFamily: T.mono }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 4 L8 9 L14 4" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round"/></svg>
              Email
            </a>
            <Link href="/about"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 10, border: `1px solid ${T.border2}`, background: T.surface1, color: T.inkDim, textDecoration: 'none', fontSize: 13, fontFamily: T.mono }}>
              More about the project
            </Link>
          </div>

          {/* Written by Alan */}
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16 }}>
            Written by Alan
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {BLOG_POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                style={{ textDecoration: 'none', padding: '16px 18px', borderRadius: 12, background: T.surface1, border: `1px solid ${T.border1}`, display: 'block' }}>
                <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                  {post.tag} · {post.readTime}
                </div>
                <div style={{ fontSize: 16, color: T.ink, fontFamily: T.serif, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                  {post.title}
                </div>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: 48, paddingTop: 28, borderTop: `1px solid ${T.border1}` }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back to WhoUnfollowed
            </Link>
          </div>
        </main>

        <LandingFooter />
      </div>
    </>
  );
}
