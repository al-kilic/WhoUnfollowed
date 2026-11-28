import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/studio.css';
import '@/styles/studio-pages.css';

// The new clean look (Geist, neutral greys, teal accent), first used by Studio
// and now by other pages as the site moves to it. Fonts are self-hosted by
// next/font: no request to Google at runtime.
const geist = Geist({ subsets: ['latin', 'latin-ext'], variable: '--font-geist', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });

export function StudioFrame({ children }: { children: ReactNode }) {
  return <div className={`studio ${geist.variable} ${geistMono.variable}`}>{children}</div>;
}
