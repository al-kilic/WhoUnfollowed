import type { ReactNode } from 'react';
import { StudioFrame } from '@/components/studio/StudioFrame';
import '@/styles/site-pages.css';

// A marketing or info page in the new look: the Studio frame (Geist, neutral
// greys, teal accent) plus the heading weight fix for pages built on the old
// landing tokens.
export function SitePage({ children }: { children: ReactNode }) {
  return <StudioFrame><div className="s-site">{children}</div></StudioFrame>;
}
