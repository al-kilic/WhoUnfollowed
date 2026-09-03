import type { Metadata } from 'next';

// page.tsx is a client component and cannot export metadata, so the noindex
// lives here. This is the post-purchase set-a-password step, reached by link.
export const metadata: Metadata = {
  title: 'Set your password',
  robots: { index: false, follow: false },
};

export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
