import type { Account, ParsedSnapshot } from '@ig-tracker/core';
import type { SnapshotRecord } from '@/lib/db';

// The made-up account behind "Try it with sample data": a film photographer
// in Lisbon who posts carousels and Reels on Tuesdays, Thursdays and
// Saturdays. Three exports over nine months, so comparisons, growth and
// history all have something to show. Built in the browser from fixed word
// lists with a seeded random number generator: every visitor sees the same
// account and nothing is downloaded.
//
// Every handle has two periods in a row ("lena..frames"). Instagram usernames
// can't contain consecutive periods, so no sample handle can ever be a real
// person's account.

export const SAMPLE_HANDLE = 'ines..onfilm';

const T = (iso: string) => Math.floor(Date.parse(`${iso}T10:00:00Z`) / 1000);
const DAY = 86_400;
const YEAR = 365 * DAY;

// The three exports, oldest first. The newest one is the one on screen.
export const SAMPLE_EXPORTS = [T('2026-02-22'), T('2026-06-18'), T('2026-11-20')] as const;
export const SAMPLE_EXPORTED_AT = SAMPLE_EXPORTS[2];
export const SAMPLE_COUNTS = { followers: 1240, following: 1050, notBack: 87, pending: 23, unfollowed: 12 } as const;

// Followers in each export, and who came and went between them. The coach
// content (sampleCoach) quotes these numbers, so they live in one place.
export const SAMPLE_FLOW = {
  followers: [1066, 1158, 1240],
  following: [1012, 1031, 1050],
  // Between export 1 and 2, then between 2 and 3.
  gained: [129, 113],
  lost: [37, 31],
} as const;

// The posts that brought followers: their Thursday and how many people
// started following in the three days after.
export const SAMPLE_POSTS = [
  { at: T('2026-09-10'), followers: 31 },
  { at: T('2026-10-01'), followers: 19 },
  { at: T('2026-10-22'), followers: 52 },
  { at: T('2026-11-05'), followers: 6 },
] as const;

// The week in March 2022 when 41 accounts were followed in seven days.
export const SAMPLE_SPREE = T('2022-03-03');

const FIRST = ['lena', 'marco', 'ines', 'jonas', 'clara', 'tomas', 'nora', 'luca', 'elif', 'sara', 'pablo', 'mila', 'anton', 'rosa', 'felix', 'ada', 'hugo', 'vera', 'oskar', 'iris',
  'leo', 'maya', 'emil', 'zoe', 'nico', 'lucia', 'theo', 'alba', 'kai', 'ruth', 'joana', 'duarte', 'filipa', 'rui', 'beatriz', 'miguel', 'carla', 'tiago', 'marta', 'nuno',
  'sofia', 'goncalo', 'rita', 'pedro', 'helena', 'andre', 'catarina', 'diogo', 'mariana', 'vasco', 'julia', 'bruno', 'lara', 'simao', 'eva', 'martim', 'ana', 'ivo', 'teresa', 'raul'];
const SECOND = ['frames', 'grain', 'studio', 'travels', 'draws', 'reads', 'films', 'bakes', 'shoots', 'plants', 'surfs', 'makes', 'writes', 'rides', 'paints', 'notes', 'daily', 'works',
  'lab', 'light', 'darkroom', 'portra', 'tram', 'alfama', 'tiles', 'coffee', 'walks', 'atlas', 'harbour', 'ceramics', 'linen', 'press', 'archive', 'roll', 'lens', 'kitchen', 'garden',
  'stories', 'sketches', 'records', 'ferry', 'bairro', 'sunday', 'mornings', 'objects', 'colour', 'type', 'print', 'paper', 'field'];
const SUFFIX = ['', '', '', 'pt', 'lx', 'co', 'mov'];

// Mulberry32: small, fast and deterministic.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

const acc = (username: string, followedAt: number | null): Account => ({ username, href: '', followedAt });

// Distinct handles in a few real-looking shapes, never with a number tacked on.
function handles(n: number, rand: () => number): string[] {
  const out = new Set<string>();
  while (out.size < n) {
    const a = FIRST[Math.floor(rand() * FIRST.length)]!;
    const b = SECOND[Math.floor(rand() * SECOND.length)]!;
    const s = SUFFIX[Math.floor(rand() * SUFFIX.length)]!;
    const shape = rand();
    const name = shape < 0.55 ? `${a}..${b}` : shape < 0.8 ? `${b}..${a}` : `${a}.${b}..${s || 'studio'}`;
    if (name !== SAMPLE_HANDLE) out.add(name);
  }
  return [...out];
}

interface Built { snapshots: [ParsedSnapshot, ParsedSnapshot, ParsedSnapshot] }
let cached: Built | null = null;

function build(): Built {
  const rand = rng(20261120);
  const [e1, e2, e3] = SAMPLE_EXPORTS;
  const { notBack: N, pending: P, unfollowed: U } = SAMPLE_COUNTS;
  const F3 = SAMPLE_FLOW.followers[2];
  const G3 = SAMPLE_FLOW.following[2];
  const mutualN = G3 - N; // 963 both ways
  const fanN = F3 - mutualN; // 277 follow her, she doesn't follow back
  const [gain12, gain23] = SAMPLE_FLOW.gained;
  const [lost12, lost23] = SAMPLE_FLOW.lost;

  const names = handles(F3 + N + lost12 + lost23 + P + U + 40, rand);
  let k = 0;
  const take = (n: number) => names.slice(k, (k += n));
  const mutual = take(mutualN);
  const notBack = take(N);
  const fans = take(fanN);
  const pending = take(P);
  const unfollowed = take(U);
  const left12 = take(lost12); // followed in export 1, gone by export 2
  const left23 = take(lost23); // followed in export 2, gone by export 3

  // Who arrived in each window: the newest gain23 of the current followers
  // came after export 2, the gain12 before them after export 1.
  const current = [...mutual, ...fans];
  const new23 = new Set(current.slice(-gain23));
  const new12 = new Set(current.slice(-(gain23 + gain12), -gain23));

  // Follow dates. About a quarter of older follows land on a Thursday: that is
  // the day her posts go out and when most people find her.
  const thursday = (t: number) => t - (((Math.floor(t / DAY) + 3) % 7 + 7) % 7 - 3) * DAY;
  const older = (maxYears: number, before: number) => {
    let t = before - Math.floor(rand() * maxYears * YEAR) - DAY;
    t = rand() < 0.2 ? thursday(t) : t;
    // Keep the follow spree week to the 41 accounts it is about.
    return t >= SAMPLE_SPREE - 3 * DAY && t < SAMPLE_SPREE + 10 * DAY ? t - 30 * DAY : t;
  };
  const inWindow = (from: number, to: number) => from + Math.floor(rand() * (to - from - DAY));
  // The newest followers came in bursts after the four posts.
  const burst: number[] = [];
  for (const p of SAMPLE_POSTS) for (let i = 0; i < p.followers; i++) burst.push(p.at + Math.floor(rand() * 2.5 * DAY));
  while (burst.length < gain23) burst.push(thursday(inWindow(e2, e3)));
  let bi = 0;
  const followerDate = (u: string, i: number) => {
    if (i === 0) return T('2017-02-14'); // the oldest follower: nine years ago
    if (new23.has(u)) return burst[bi++]!;
    if (new12.has(u)) return rand() < 0.4 ? thursday(inWindow(e1, e2)) : inWindow(e1, e2);
    return older(8.8, e1);
  };
  const followerAt = new Map(current.map((u, i) => [u, followerDate(u, i)]));
  // A follower who later left keeps a date from before the export they left after.
  const goneAt = (before: number) => older(4, before);
  const left12At = new Map(left12.map((u) => [u, goneAt(e1)]));
  const left23At = new Map(left23.map((u) => [u, goneAt(e2)]));

  const followingAt = new Map<string, number>();
  [...notBack, ...mutual].forEach((u, i) => followingAt.set(u, i < 41 ? SAMPLE_SPREE + Math.floor(rand() * 7 * DAY) : older(8.5, e3)));

  const byNewest = (a: Account, b: Account) => (b.followedAt ?? 0) - (a.followedAt ?? 0);
  const snap = (at: number, followers: string[], following: string[]): ParsedSnapshot => ({
    exportedAt: at,
    followers: followers.map((u) => acc(u, followerAt.get(u) ?? left12At.get(u) ?? left23At.get(u) ?? null)).sort(byNewest),
    following: following.map((u) => acc(u, followingAt.get(u) ?? null)).sort(byNewest),
    // Requests she sent and that are still waiting; the oldest from 2021.
    pendingRequests: pending.map((u, i) => acc(u, i === 0 ? T('2021-04-01') : older(3, at))).filter((a) => (a.followedAt ?? 0) < at).sort(byNewest),
    recentlyUnfollowed: unfollowed.map((u) => acc(u, at - Math.floor(rand() * 90) * DAY)).sort(byNewest),
    format: 'json',
    platform: 'instagram',
  });

  // Export 1: before the new12 and new23 arrivals, with left12 and left23 still following.
  const f1 = [...current.filter((u) => !new12.has(u) && !new23.has(u)), ...left12, ...left23];
  const f2 = [...current.filter((u) => !new23.has(u)), ...left23];
  const fol = [...notBack, ...mutual];
  // Earlier exports follow fewer accounts: the ones she followed most recently weren't there yet.
  const byRecentFollow = [...fol].sort((x, y) => (followingAt.get(y) ?? 0) - (followingAt.get(x) ?? 0));
  const without = (n: number) => { const drop = new Set(byRecentFollow.slice(0, n)); return fol.filter((u) => !drop.has(u)); };
  const g1 = without(SAMPLE_FLOW.following[2] - SAMPLE_FLOW.following[0]);
  const g2 = without(SAMPLE_FLOW.following[2] - SAMPLE_FLOW.following[1]);
  return { snapshots: [snap(e1, f1, g1), snap(e2, f2, g2), snap(e3, current, fol)] };
}

// The export on screen (the newest of the three).
export function getSampleSnapshot(): ParsedSnapshot {
  cached ??= build();
  return cached.snapshots[2];
}

// All three exports, oldest first.
export function getSampleSnapshots(): readonly ParsedSnapshot[] {
  cached ??= build();
  return cached.snapshots;
}

const LABELS = ['Feb 22, 2026', 'Jun 18, 2026', 'Nov 20, 2026'];

// The three exports shaped like saved records, newest first (as
// useSnapshotList returns them). Negative ids: they never exist in IndexedDB.
export function getSampleRecords(): SnapshotRecord[] {
  return getSampleSnapshots().map((data, i) => ({ id: -(i + 1), label: LABELS[i]!, exportedAt: data.exportedAt, savedAt: data.exportedAt * 1000, data, ownerUserId: null, anonSessionId: null }))
    .reverse();
}

export function isSampleSnapshot(s: Pick<ParsedSnapshot, 'exportedAt'> | null | undefined): boolean {
  return !!s && (SAMPLE_EXPORTS as readonly number[]).includes(s.exportedAt);
}
