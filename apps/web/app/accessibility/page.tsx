import Link from 'next/link';
import type { Metadata } from 'next';
import { T } from '@/components/landing/tokens';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';

export const metadata: Metadata = {
  title: 'Accessibility',
  description: 'Our commitment to making WhoUnfollowed usable for everyone, including people using screen readers, keyboards, or other assistive technology.',
  alternates: { canonical: '/accessibility' },
};

export default function AccessibilityPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '56px 32px 80px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 14 }}>LEGAL</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 12 }}>
            Accessibility
          </h1>
          <p style={{ fontSize: 13, color: T.inkMute, fontFamily: T.mono }}>Last updated: September 5, 2026</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <Section title="Our Commitment">
            WhoUnfollowed should work for everyone, including people who use a screen reader, navigate by keyboard only, or rely on other assistive technology. Accessibility is not an afterthought we bolt on. We treat it as part of building the product correctly.
          </Section>

          <Section title="What We've Done">
            The site is built with semantic HTML, so headings, landmarks, and links are structured the way assistive technology expects. Buttons and forms are keyboard-navigable. Images carry alt text. Both the dark and light themes are designed with text contrast in mind, and the theme toggle respects your system preference by default.
          </Section>

          <Section title="Where We're Still Catching Up">
            <strong style={{ color: T.ink }}>We are not going to claim full compliance we haven't verified.</strong>
            <br /><br />
            The Pro dashboard's charts (follower growth, follow ratio over time, follow age) now carry text descriptions for screen readers, and the click-to-filter bar chart has a keyboard-accessible equivalent. What's still incomplete: none of this has been tested with a real screen reader end to end, only built to the spec, so treat it as improved, not verified.
          </Section>

          <Section title="Our Standard">
            We use the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA as our working target. This is a goal we're building toward, not a certification we hold.
          </Section>

          <Section title="Tell Us What's Broken">
            If you hit a barrier using WhoUnfollowed with a screen reader, keyboard, or any other assistive technology, email us at <a href="mailto:hello@whounfollowed.co" style={{ color: T.teal }}>hello@whounfollowed.co</a> with what happened and the page you were on. We read every message and fix real barriers.
          </Section>
        </div>

        <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--t-border1)' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to WhoUnfollowed
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: '-0.01em', marginBottom: 12 }}>{title}</h2>
      <div style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}
