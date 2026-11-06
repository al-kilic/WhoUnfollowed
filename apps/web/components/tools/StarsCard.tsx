'use client';

import { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import type { Account, ParsedSnapshot } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';
import type { AppLocale } from '@/i18n/routing';
import { getStarsContent } from './stars.content';
import { Events, track } from '@/lib/analytics';
import { ToolCard, ToolLabel, ToolSub, ToolTitle, fill, fmt } from './ToolCard';

const SHOW = 60;

// Mutuals with a star toggle. Starred first. `previous` (same platform) lets
// it flag starred people who stopped following since then.
export function StarsCard({ mutuals, current, previous, stars, onToggle, locale, pro }: {
  mutuals: Account[];
  current: ParsedSnapshot;
  previous?: ParsedSnapshot | undefined;
  stars: ReadonlySet<string>;
  onToggle: (username: string) => void;
  locale: AppLocale;
  pro?: string | undefined;
}) {
  const c = getStarsContent(locale);
  const [q, setQ] = useState('');

  const leftStarred = useMemo(() => {
    if (!previous) return null;
    const nowFollowers = new Set(current.followers.map(a => a.username));
    return previous.followers.filter(a => stars.has(a.username) && !nowFollowers.has(a.username));
  }, [previous, current, stars]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase().replace(/^@/, '');
    const filtered = needle ? mutuals.filter(a => a.username.toLowerCase().includes(needle)) : mutuals;
    return [...filtered].sort((a, b) => Number(stars.has(b.username)) - Number(stars.has(a.username)) || a.username.localeCompare(b.username));
  }, [mutuals, q, stars]);

  return (
    <ToolCard>
      <ToolLabel pro={pro}>{c.label}</ToolLabel>
      <ToolTitle>{c.title}</ToolTitle>
      <ToolSub>{c.sub}</ToolSub>
      {leftStarred && (
        <div role="status" style={{ fontSize: 13.5, padding: '10px 12px', borderRadius: 10, marginBottom: 12, border: `1px solid ${leftStarred.length ? 'var(--t-terra)' : 'var(--t-border2)'}`, color: leftStarred.length ? T.terraText : T.inkDim }}>
          {leftStarred.length ? fill(c.left, { count: leftStarred.length }) : c.leftNone}
          {leftStarred.length > 0 && <div style={{ fontFamily: T.mono, fontSize: 12.5, marginTop: 6 }}>{leftStarred.map(a => `@${a.username}`).join('  ')}</div>}
        </div>
      )}
      {mutuals.length === 0 ? <p style={{ fontSize: 13.5, color: T.inkMute }}>{c.empty}</p> : (
        <>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
            <input
              type="search" value={q} onChange={e => setQ(e.target.value)} placeholder={c.search} aria-label={c.search}
              style={{ flex: 1, minWidth: 0, padding: '8px 12px', borderRadius: 10, border: '1px solid var(--t-border2)', background: 'var(--t-bgCard)', color: T.ink, fontSize: 13.5, fontFamily: 'inherit' }}
            />
            <span style={{ fontSize: 12, color: T.inkMute, whiteSpace: 'nowrap' }}>{fill(c.starredCount, { count: fmt(stars.size, locale) })}</span>
          </div>
          {list.length === 0 ? <p style={{ fontSize: 13, color: T.inkMute }}>{c.noMatch}</p> : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 6, maxHeight: 300, overflowY: 'auto' }}>
              {list.slice(0, SHOW).map(a => {
                const on = stars.has(a.username);
                return (
                  <li key={a.username}>
                    <button
                      type="button" aria-pressed={on} aria-label={fill(on ? c.unstar : c.star, { name: `@${a.username}` })} onClick={() => { track(Events.starToggled, { on: !on }); onToggle(a.username); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 10px', borderRadius: 9, cursor: 'pointer', fontFamily: T.mono, fontSize: 12.5, textAlign: 'left', color: T.ink, background: on ? 'rgba(var(--t-accent-rgb),0.08)' : 'transparent', border: `1px solid ${on ? 'var(--t-tealMid)' : 'var(--t-border1)'}` }}
                    >
                      <Star size={14} strokeWidth={1.8} aria-hidden="true" fill={on ? 'currentColor' : 'none'} style={{ color: on ? 'var(--t-tealLight)' : 'var(--t-inkMute)', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{a.username}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {list.length > SHOW && <p style={{ fontSize: 12, color: T.inkMute, marginTop: 8 }}>{fill(c.more, { count: fmt(list.length - SHOW, locale) })}</p>}
        </>
      )}
    </ToolCard>
  );
}
