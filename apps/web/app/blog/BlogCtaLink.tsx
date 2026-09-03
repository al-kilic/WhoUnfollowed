'use client';

import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { track, trackUpgradeClick, Events } from '@/lib/analytics';

// Thin client island so BlogArticle (a server component, see its own header
// comment) can still track which post's CTA actually gets clicked.
//
// The two CTA kinds mean different things, so they report differently:
// - "primary" links to the free tool (/), not to pricing — logged as its own
//   blog-cta-click event so it isn't misread as upgrade intent.
// - "pro-nudge" links to /pricing — a real upgrade click, so it reuses
//   trackUpgradeClick with source `blog:<slug>`, which already feeds the
//   daily report's existing upgrade-click-source breakdown for free.
export function BlogCtaLink({
  href,
  slug,
  kind,
  style,
  children,
}: {
  href: string;
  slug: string;
  kind: 'primary' | 'pro-nudge';
  style?: CSSProperties;
  children: ReactNode;
}) {
  const onClick = () =>
    kind === 'pro-nudge' ? trackUpgradeClick(`blog:${slug}`) : track(Events.blogCtaClick, { slug });
  return (
    <Link href={href} onClick={onClick} style={style}>
      {children}
    </Link>
  );
}
