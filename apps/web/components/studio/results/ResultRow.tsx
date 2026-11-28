'use client';

import type { Account } from '@ig-tracker/core';
import { Check, Clock, ExternalLink, Heart, UserMinus, UserX } from 'lucide-react';
import type { TriageState } from '@/hooks/useTriage';
import { PLATFORM_NAME, profileHref, type Platform } from '@/lib/platform';
import { useStudio } from '../StudioContext';
import { Hint } from '../Hint';
import { useSampleOn } from '@/lib/sample/sampleMode';
import { getResultsContent } from './results.content';

export type Filter = 'all' | 'untriaged' | TriageState;
export const FILTERS: Filter[] = ['all', 'untriaged', 'let_it_slide', 'not_a_fan', 'done', 'check_later', 'deactivated'];

// The marks, in the order people decide: keep, plan to unfollow, done, later.
const MARKS: [TriageState, 'keep' | 'unfollow' | 'done' | 'later', typeof Heart][] = [
  ['let_it_slide', 'keep', Heart], ['not_a_fan', 'unfollow', UserMinus], ['done', 'done', Check], ['check_later', 'later', Clock],
];

// One account: the username links to the profile (new tab), since when, and
// the four marks with words on them.
export function ResultRow({ account: x, tab, platform, state, since, onMark, visited, onVisit }: {
  account: Account; tab: 'noBack' | 'fans' | 'mutuals' | 'left'; platform: Platform; state: TriageState | undefined; since: [string, string] | null; onMark: (s: TriageState | null) => void; visited: boolean; onVisit: () => void;
}) {
  const { locale } = useStudio();
  const t = getResultsContent(locale);
  // Sample handles can't exist on Instagram, so there is no profile to open.
  const sample = useSampleOn();
  const app = PLATFORM_NAME[platform];
  const fmt = (s: number) => new Date(s * 1000).toLocaleDateString(locale, { month: 'short', year: 'numeric' });
  const sub = tab === 'left' ? (since ? t.leftSince(since[0], since[1]) : '') : !x.followedAt ? t.noDate : tab === 'noBack' ? t.followingSince(fmt(x.followedAt)) : t.followsSince(fmt(x.followedAt));
  return (
    <div className={`s-rr${state ? ` m-${state}` : ''}${visited ? ' vis' : ''}`}>
      <span className="s-uav" aria-hidden="true">{x.username.slice(0, 1).toUpperCase()}</span>
      <div className="s-rname">
        {sample
          ? <b>@{x.username}{visited && <span className="s-visb">{t.visited}</span>}</b>
          : <a className="s-ulink" href={profileHref(platform, x.username)} target="_blank" rel="noopener noreferrer" title={t.openOn(x.username, app)} onClick={onVisit}>
            <b>@{x.username}</b><ExternalLink size={12} aria-hidden="true" className="s-ulink-ic" />{visited && <span className="s-visb">{t.visited}</span>}
          </a>}
        <span className="s-sub-t">{sub}{state === 'deactivated' ? ` · ${t.deactivated}` : ''}</span>
      </div>
      {tab === 'noBack' && (
        <div className="s-marks" role="group" aria-label={`@${x.username}`}>
          {MARKS.map(([s, k, Ic]) => (
            <Hint key={s} text={t.markHints[k]} side="top">
              <button type="button" className={`k-${k}${state === s ? ' on' : ''}`} aria-pressed={state === s} onClick={() => onMark(state === s ? null : s)}>
                <Ic size={13} />{t.marks[k]}
              </button>
            </Hint>
          ))}
          {/* Deactivated, deleted or suspended accounts stay in exports for a
              while; this quieter mark clears them from the list. */}
          <Hint text={`${t.marks.dead}. ${t.markHints.dead}`} side="top">
            <button type="button" className={`k-dead${state === 'deactivated' ? ' on' : ''}`} aria-pressed={state === 'deactivated'} aria-label={t.marks.dead} onClick={() => onMark(state === 'deactivated' ? null : 'deactivated')}>
              <UserX size={14} />
            </button>
          </Hint>
        </div>
      )}
    </div>
  );
}
