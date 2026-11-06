// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { ParsedSnapshot } from '../schemas.js';

// The verdict card: a shareable "personality type" for an account, picked
// from its real numbers. Every archetype whose rule matches is eligible; a
// seed derived from the export picks one (and a line), so the same export
// gives the same card until the user taps "another one", and two people with
// similar numbers rarely get the same card. The copy lives in the app.

export type ArchetypeId =
  | 'loyal_magnet' | 'main_character' | 'quiet_icon' | 'fair_trader' | 'generous_giver'
  | 'hopeful_romantic' | 'ghost_collector' | 'tiny_circle' | 'open_house' | 'selective'
  | 'rising' | 'og' | 'mutual_maximalist' | 'fan_club' | 'collector'
  | 'drama_magnet' | 'untouchable' | 'comeback' | 'balanced' | 'steady';

export interface VerdictStats {
  followers: number;
  following: number;
  mutuals: number;
  oneWay: number; // you follow, they don't
  fans: number; // they follow, you don't
  followBackPct: number; // mutuals / following, 0-100
  ratio: number; // followers / following
  lastYearShare: number; // 0-1, share of dated followers from the last 12 months
  // Only with a previous export of the same platform.
  lost?: number | undefined;
  gained?: number | undefined;
}

type Rule = (s: VerdictStats) => boolean;

// Order matters only for the fallback: 'steady' always matches.
const RULES: [ArchetypeId, Rule][] = [
  ['loyal_magnet', s => s.following >= 20 && s.followBackPct >= 85],
  ['main_character', s => s.followers >= 500 && s.ratio >= 5],
  ['quiet_icon', s => s.followers < 500 && s.ratio >= 2],
  ['fair_trader', s => s.following >= 20 && s.ratio >= 0.95 && s.ratio <= 1.05],
  ['generous_giver', s => s.following >= 50 && s.ratio < 0.5],
  ['hopeful_romantic', s => s.following >= 30 && s.followBackPct < 40],
  ['ghost_collector', s => s.oneWay >= 200],
  ['tiny_circle', s => s.followers > 0 && s.followers < 100 && s.followBackPct >= 70],
  ['open_house', s => s.following >= 2000],
  ['selective', s => s.following < 150 && s.followers >= 300],
  ['rising', s => s.followers >= 50 && s.lastYearShare >= 0.5],
  ['og', s => s.followers >= 50 && s.lastYearShare > 0 && s.lastYearShare < 0.1],
  ['mutual_maximalist', s => s.followers >= 20 && s.mutuals / s.followers >= 0.8],
  ['fan_club', s => s.followers >= 50 && s.fans / s.followers >= 0.6],
  ['collector', s => s.followers > 0 && s.following > s.followers * 3],
  ['drama_magnet', s => (s.lost ?? 0) >= 10],
  ['untouchable', s => s.lost === 0],
  ['comeback', s => s.gained !== undefined && s.lost !== undefined && s.lost > 0 && s.gained > s.lost * 2],
  ['balanced', s => s.followBackPct >= 60 && s.followBackPct < 85],
  ['steady', () => true],
];

export const ARCHETYPE_IDS: ArchetypeId[] = RULES.map(([id]) => id);

export function verdictStats(
  current: Pick<ParsedSnapshot, 'followers' | 'following' | 'exportedAt'>,
  previous?: Pick<ParsedSnapshot, 'followers'>,
): VerdictStats {
  const followerSet = new Set(current.followers.map(a => a.username));
  const followingSet = new Set(current.following.map(a => a.username));
  const mutuals = current.following.filter(a => followerSet.has(a.username)).length;
  const followers = current.followers.length;
  const following = current.following.length;
  const yearAgo = current.exportedAt - 365 * 86400;
  const dated = current.followers.filter(a => a.followedAt !== null);
  const recent = dated.filter(a => a.followedAt! >= yearAgo).length;

  let lost: number | undefined;
  let gained: number | undefined;
  if (previous) {
    const prev = new Set(previous.followers.map(a => a.username));
    lost = [...prev].filter(u => !followerSet.has(u)).length;
    gained = [...followerSet].filter(u => !prev.has(u)).length;
  }

  return {
    followers,
    following,
    mutuals,
    oneWay: following - mutuals,
    fans: current.followers.filter(a => !followingSet.has(a.username)).length,
    followBackPct: following === 0 ? 0 : Math.round((mutuals / following) * 100),
    ratio: following === 0 ? followers : followers / following,
    lastYearShare: dated.length === 0 ? 0 : recent / dated.length,
    lost,
    gained,
  };
}

export function eligibleArchetypes(stats: VerdictStats): ArchetypeId[] {
  const hits = RULES.filter(([id, rule]) => id !== 'steady' && rule(stats)).map(([id]) => id);
  return hits.length > 0 ? hits : ['steady'];
}

// FNV-1a, enough to spread similar inputs apart. Not for security.
export function hashSeed(...parts: (string | number)[]): number {
  let h = 0x811c9dc5;
  for (const ch of parts.join('|')) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export interface Verdict {
  archetype: ArchetypeId;
  // Index into that archetype's lines; the app takes it modulo its line count.
  lineSeed: number;
  stats: VerdictStats;
}

// `spin` changes the pick when the user asks for another card.
export function pickVerdict(stats: VerdictStats, exportedAt: number, spin = 0): Verdict {
  const pool = eligibleArchetypes(stats);
  const seed = hashSeed(stats.followers, stats.following, stats.mutuals, exportedAt, spin);
  return { archetype: pool[seed % pool.length]!, lineSeed: Math.floor(seed / pool.length), stats };
}
