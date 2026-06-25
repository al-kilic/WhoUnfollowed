'use client';

import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { trackUpgradeClick } from '@/lib/analytics';

// Client wrapper so the server-rendered account page can track which upgrade CTA
// was clicked.
export function UpgradeLink({
  source,
  href = '/pricing',
  style,
  children,
}: {
  source: string;
  href?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <Link href={href} onClick={() => trackUpgradeClick(source)} style={style}>
      {children}
    </Link>
  );
}
