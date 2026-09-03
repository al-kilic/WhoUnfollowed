import type { Metadata } from 'next';

// page.tsx is a client component and cannot export metadata, so the noindex
// lives here. Results are derived from a user's own upload and must never be
// indexed. robots.ts disallows the path too; this covers crawlers that fetch
// the page directly and ignore robots.txt.
export const metadata: Metadata = {
  title: 'Your results',
  robots: { index: false, follow: false },
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
