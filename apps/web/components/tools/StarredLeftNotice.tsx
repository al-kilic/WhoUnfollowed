'use client';

import type { Account } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';
import type { AppLocale } from '@/i18n/routing';
import { useStars } from '@/hooks/useStars';
import type { Platform } from '@/lib/platform';
import { getStarsContent } from './stars.content';
import { fill } from './ToolCard';

// Top of the comparison: starred people who unfollowed, before anyone else.
export function StarredLeftNotice({ owner, platform, lost, locale }: {
  owner: string | null; platform: Platform; lost: Account[]; locale: AppLocale;
}) {
  const { stars } = useStars(owner, platform);
  const starredLeft = lost.filter(a => stars.has(a.username));
  if (starredLeft.length === 0) return null;
  const c = getStarsContent(locale);
  return (
    <div role="status" style={{ marginBottom: 24, padding: '12px 16px', borderRadius: 12, border: '1px solid var(--t-terra)', color: T.terraText, fontSize: 14 }}>
      <strong style={{ fontWeight: 600 }}>{fill(c.left, { count: starredLeft.length })}</strong>
      <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {starredLeft.map(a => (
          <li key={a.username}>
            <a href={a.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: T.mono, fontSize: 12.5, color: T.terraText }}>@{a.username}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
