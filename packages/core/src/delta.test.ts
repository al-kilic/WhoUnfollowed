import { describe, it, expect, beforeEach, vi } from 'vitest';
import { detectDeltaExport } from './delta.js';
import type { ParsedSnapshot } from './schemas.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NOW = 1_747_000_000; // fixed "now" for deterministic tests

function makeAccount(username: string, followedAt: number | null = null) {
  return { username, href: `https://www.instagram.com/${username}`, followedAt };
}

function makeSnapshot(
  followerCount: number,
  followingCount: number,
  opts: {
    followerTimestamps?: number[];
    followingTimestamps?: number[];
  } = {},
): ParsedSnapshot {
  const followers = Array.from({ length: followerCount }, (_, i) => {
    const ts = opts.followerTimestamps?.[i] ?? null;
    return makeAccount(`follower_${i}`, ts);
  });
  const following = Array.from({ length: followingCount }, (_, i) => {
    const ts = opts.followingTimestamps?.[i] ?? null;
    return makeAccount(`following_${i}`, ts);
  });
  return { exportedAt: NOW, followers, following };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('detectDeltaExport', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW * 1000);
  });

  // ── Full snapshots — should NOT trigger ───────────────────────────────────

  it('does not flag a normal full snapshot', () => {
    const snap = makeSnapshot(1_769, 1_306);
    expect(detectDeltaExport(snap).isDelta).toBe(false);
  });

  it('does not flag a mid-size account', () => {
    const snap = makeSnapshot(500, 300);
    expect(detectDeltaExport(snap).isDelta).toBe(false);
  });

  it('does not flag when follower count > 50 even if following is low', () => {
    // followers = 1200, following = 45 — followers is large so not a delta
    const snap = makeSnapshot(1_200, 45);
    expect(detectDeltaExport(snap).isDelta).toBe(false);
  });

  it('flags when followers < 50 even if following is large (real delta pattern)', () => {
    // Real pattern: delta has 2 new followers but full following list of 1,310
    const snap = makeSnapshot(2, 1_310);
    const result = detectDeltaExport(snap);
    expect(result.isDelta).toBe(true);
    expect(result.reasons).toContain('small_counts');
  });

  it('does not flag a full snapshot with old timestamps', () => {
    // Timestamps spanning 2 years — clearly not a recent delta
    const oldTs = NOW - 365 * 86400 * 2;
    const snap = makeSnapshot(1_500, 800, {
      followerTimestamps: Array.from({ length: 1_500 }, (_, i) => oldTs + i * 1000),
    });
    expect(detectDeltaExport(snap).isDelta).toBe(false);
  });

  it('does not flag when timestamps span more than 14 days', () => {
    const twoWeeksAgo = NOW - 15 * 86400;
    const snap = makeSnapshot(200, 150, {
      followerTimestamps: [twoWeeksAgo, NOW - 5 * 86400, NOW - 1 * 86400],
      followingTimestamps: [twoWeeksAgo + 1, NOW - 7 * 86400],
    });
    expect(detectDeltaExport(snap).isDelta).toBe(false);
  });

  // ── Signal B1: small counts ───────────────────────────────────────────────

  it('flags when both follower and following counts are under 50', () => {
    const snap = makeSnapshot(5, 3);
    const result = detectDeltaExport(snap);
    expect(result.isDelta).toBe(true);
    expect(result.reasons).toContain('small_counts');
  });

  it('flags at exactly 49/49', () => {
    const snap = makeSnapshot(49, 49);
    expect(detectDeltaExport(snap).isDelta).toBe(true);
  });

  it('does not flag when followers = 50 (threshold is exclusive)', () => {
    const snap = makeSnapshot(50, 1_000);
    expect(detectDeltaExport(snap).isDelta).toBe(false);
  });

  it('flags when followers = 49 regardless of following count', () => {
    const snap = makeSnapshot(49, 1_500);
    expect(detectDeltaExport(snap).isDelta).toBe(true);
  });

  // ── Signal B2: all recent timestamps ─────────────────────────────────────

  it('flags when all timestamps are within last 14 days', () => {
    const recentTs = (daysAgo: number) => NOW - daysAgo * 86400;
    const snap = makeSnapshot(80, 60, {
      followerTimestamps: [recentTs(1), recentTs(3), recentTs(5), recentTs(7)],
      followingTimestamps: [recentTs(2), recentTs(4), recentTs(6)],
    });
    const result = detectDeltaExport(snap);
    expect(result.isDelta).toBe(true);
    expect(result.reasons).toContain('all_recent_timestamps');
  });

  it('does not flag B2 when fewer than 3 timestamped entries', () => {
    // Only 2 timestamped entries — not enough signal
    const snap = makeSnapshot(10, 8, {
      followerTimestamps: [NOW - 86400, NOW - 2 * 86400],
    });
    // May still flag B1 (small counts), but NOT B2
    const result = detectDeltaExport(snap);
    expect(result.reasons).not.toContain('all_recent_timestamps');
  });

  it('does not flag B2 when any timestamp is older than 14 days', () => {
    const snap = makeSnapshot(100, 80, {
      followerTimestamps: [NOW - 86400, NOW - 20 * 86400, NOW - 3 * 86400], // one old one
      followingTimestamps: [NOW - 2 * 86400, NOW - 5 * 86400],
    });
    expect(detectDeltaExport(snap).reasons).not.toContain('all_recent_timestamps');
  });

  // ── Signal C: massive count drop vs previous snapshot ────────────────────

  it('flags when follower count drops 80%+ vs previous snapshot', () => {
    const previous = makeSnapshot(1_769, 1_306);
    const current  = makeSnapshot(12, 10); // 99% drop
    const result = detectDeltaExport(current, previous);
    expect(result.isDelta).toBe(true);
    expect(result.reasons).toContain('massive_count_drop');
  });

  it('flags at exactly 80% drop', () => {
    const previous = makeSnapshot(1_000, 500);
    const current  = makeSnapshot(199, 400); // 80.1% drop
    expect(detectDeltaExport(current, previous).reasons).toContain('massive_count_drop');
  });

  it('does not flag C when drop is under 80%', () => {
    const previous = makeSnapshot(1_000, 500);
    const current  = makeSnapshot(300, 450); // 70% drop — under threshold
    expect(detectDeltaExport(current, previous).reasons).not.toContain('massive_count_drop');
  });

  it('does not flag C without a previous snapshot', () => {
    const current = makeSnapshot(5, 3);
    // Only B1 fires — not C
    const result = detectDeltaExport(current);
    expect(result.reasons).not.toContain('massive_count_drop');
  });

  // ── New account false positive handling ──────────────────────────────────

  it('new account with old timestamps does not trigger B2', () => {
    // New account with 20 followers but some followed a month ago
    const snap = makeSnapshot(20, 15, {
      followerTimestamps: [NOW - 30 * 86400, NOW - 5 * 86400, NOW - 1 * 86400],
    });
    // B1 fires (counts < 50) but B2 does NOT (has an old timestamp)
    const result = detectDeltaExport(snap);
    expect(result.reasons).toContain('small_counts');
    expect(result.reasons).not.toContain('all_recent_timestamps');
  });

  // ── Multiple signals ─────────────────────────────────────────────────────

  it('reports multiple reasons when multiple signals fire', () => {
    const recentTs = NOW - 3 * 86400;
    const previous = makeSnapshot(1_500, 800);
    const current = makeSnapshot(8, 5, {
      followerTimestamps: [recentTs, recentTs + 100, recentTs + 200],
      followingTimestamps: [recentTs + 50, recentTs + 150],
    });
    const result = detectDeltaExport(current, previous);
    expect(result.isDelta).toBe(true);
    expect(result.reasons).toContain('small_counts');
    expect(result.reasons).toContain('all_recent_timestamps');
    expect(result.reasons).toContain('massive_count_drop');
  });

  // ── Signal D: export made with a shorter date range than All time ────────

  const DAY = 86400;
  // n follow times spread evenly over the `spanDays` before the export.
  const spread = (n: number, spanDays: number) =>
    Array.from({ length: n }, (_, i) => NOW - Math.round(((i + 1) / n) * spanDays * DAY));

  it('flags a "Last year" export: no follower older than a year, old following', () => {
    const snap = makeSnapshot(600, 900, {
      followerTimestamps: spread(600, 360),
      followingTimestamps: spread(900, 3 * 365),
    });
    expect(detectDeltaExport(snap).reasons).toEqual(['limited_date_range']);
  });

  it('flags a "Last year" export where both lists were trimmed', () => {
    const snap = makeSnapshot(600, 400, {
      followerTimestamps: spread(600, 364),
      followingTimestamps: spread(400, 364),
    });
    expect(detectDeltaExport(snap).reasons).toEqual(['limited_date_range']);
  });

  it('flags a "Last 3 months" export', () => {
    const snap = makeSnapshot(200, 300, {
      followerTimestamps: spread(200, 89),
      followingTimestamps: spread(300, 89),
    });
    expect(detectDeltaExport(snap).reasons).toEqual(['limited_date_range']);
  });

  it('does not flag D when some followers are older than a year', () => {
    const snap = makeSnapshot(600, 400, {
      followerTimestamps: spread(600, 2 * 365),
      followingTimestamps: spread(400, 2 * 365),
    });
    expect(detectDeltaExport(snap).isDelta).toBe(false);
  });

  it('measures D from the export date, not today', () => {
    // A full export made two years ago, uploaded today.
    const exportedAt = NOW - 2 * 365 * DAY;
    const snap = {
      ...makeSnapshot(300, 300),
      exportedAt,
    };
    snap.followers = snap.followers.map((a, i) => ({ ...a, followedAt: exportedAt - (i + 1) * 3 * DAY }));
    expect(detectDeltaExport(snap).reasons).not.toContain('limited_date_range');
  });

  it('does not flag D for undated (old HTML) exports', () => {
    const snap = makeSnapshot(600, 400);
    expect(detectDeltaExport(snap).reasons).not.toContain('limited_date_range');
  });

  it('does not flag D with fewer than 20 dated followers (small Threads accounts)', () => {
    const snap = { ...makeSnapshot(14, 28, { followerTimestamps: spread(14, 150), followingTimestamps: spread(28, 150) }), platform: 'threads' as const };
    expect(detectDeltaExport(snap).isDelta).toBe(false);
  });

  it('needs 50 dated followers before flagging D on Threads', () => {
    const opts = (n: number) => ({ followerTimestamps: spread(n, 300), followingTimestamps: spread(n, 300) });
    expect(detectDeltaExport({ ...makeSnapshot(40, 40, opts(40)), platform: 'threads' }).isDelta).toBe(false);
    expect(detectDeltaExport({ ...makeSnapshot(60, 60, opts(60)), platform: 'threads' }).reasons).toEqual(['limited_date_range']);
  });

  it('does not add D on top of B2 for a fully recent export', () => {
    const snap = makeSnapshot(100, 100, {
      followerTimestamps: spread(100, 10),
      followingTimestamps: spread(100, 10),
    });
    expect(detectDeltaExport(snap).reasons).toEqual(['all_recent_timestamps']);
  });
});
