import Link from 'next/link';
import type { Metadata } from 'next';
import { T } from '@/components/landing/tokens';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions for using WhoUnfollowed.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '56px 32px 80px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 14 }}>LEGAL</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 12 }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: 13, color: T.inkMute, fontFamily: T.mono }}>Last updated: August 31, 2026</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <Section title="1. Acceptance of Terms">
            By accessing or using WhoUnfollowed, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
          </Section>

          <Section title="2. Description of Service">
            WhoUnfollowed is a client-side tool that allows users to parse their own Instagram data exports to compare follower and following lists. The core functionality runs entirely in your browser.
          </Section>

          <Section title="3. User Responsibilities">
            You are responsible for obtaining your own data from Instagram and for any actions you take based on the information provided by WhoUnfollowed. WhoUnfollowed is not responsible for any actions taken against your Instagram account by Meta/Instagram.
          </Section>

          <Section title="4. Privacy & Data">
            Your privacy is important to us. Please review our <Link href="/privacy" style={{ color: T.tealLight, textDecoration: 'none' }}>Privacy Policy</Link> to understand how we handle your information.
          </Section>

          <Section title="5. Pro">
            WhoUnfollowed Pro is an optional paid upgrade that provides additional features. It is a one-time payment that unlocks Pro access for a fixed period (30 or 365 days), not a recurring subscription, and there is no auto-renewal or ongoing billing. Please refer to our <Link href="/refund" style={{ color: T.tealLight, textDecoration: 'none' }}>Refund Policy</Link> for information regarding refunds.
          </Section>

          <Section title="6. Disclaimer of Warranties">
            The service is provided "as is" and "as available" without any warranties of any kind. We do not guarantee that the service will be uninterrupted or error-free.
          </Section>

          <Section title="7. Limitation of Liability">
            To the maximum extent permitted by law, WhoUnfollowed shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
          </Section>

          <Section title="8. Modifications to Terms">
            We reserve the right to modify these terms at any time. Your continued use of the service after such modifications constitutes your acceptance of the new terms.
          </Section>

          <Section title="9. Contact">
            If you have any questions about these Terms, please contact us at <a href="mailto:hello@whounfollowed.co" style={{ color: T.tealLight, textDecoration: 'none' }}>hello@whounfollowed.co</a>.
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
