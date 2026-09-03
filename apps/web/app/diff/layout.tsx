import type { Metadata } from 'next';

// page.tsx is a client component and cannot export metadata, so the noindex
// lives here. Snapshot comparisons are per-user data and must never be indexed.
export const metadata: Metadata = {
  title: 'Compare snapshots',
  robots: { index: false, follow: false },
};

export default function DiffLayout({ children }: { children: React.ReactNode }) {
  return children;
}
