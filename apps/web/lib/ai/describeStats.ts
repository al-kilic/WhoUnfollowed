import type { ExportStats } from '@ig-tracker/core';

// Turns stats rows (newest first) into a few plain lines for the model. All the
// arithmetic happens here, so no tokens are spent on it and the numbers are
// always right.

const pct = (x: number | null) => (x === null ? 'not enough data' : `${Math.round(x * 100)}%`);
const signed = (n: number) => (n > 0 ? `+${n}` : String(n));
const date = (sec: number) => new Date(sec * 1000).toISOString().slice(0, 10);

export function describeStats(rows: readonly ExportStats[]): string {
  const [cur, prev] = rows;
  if (!cur) return 'No export numbers yet.';
  const lines = [
    `Latest export (${cur.platform}, ${date(cur.exportedAt)}): ${cur.followers} followers, ${cur.following} following, ${cur.mutuals} mutuals, ${cur.nonFollowers} who don't follow back, ${cur.fans} fans.`,
    `Follow-back rate on accounts followed in the last 12 months: ${pct(cur.followBackRate12m)} (12 months before: ${pct(cur.followBackRatePrev12m)}).`,
  ];
  if (cur.pendingRequests !== null) lines.push(`Unanswered follow requests sent: ${cur.pendingRequests}.`);

  const months = Object.entries(cur.newFollowersByMonth).sort(([a], [b]) => a.localeCompare(b));
  if (months.length) {
    const last12 = months.slice(-12);
    const total = last12.reduce((s, [, n]) => s + n, 0);
    const best = [...months].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([m, n]) => `${m} (+${n})`).join(', ');
    lines.push(`New followers who still follow, by month (last 12): ${last12.map(([m, n]) => `${m}: ${n}`).join(', ')}. Total ${total}.`);
    lines.push(`Biggest months in the last two years: ${best}.`);
  }

  if (prev) {
    const days = Math.max(1, Math.round((cur.exportedAt - prev.exportedAt) / 86_400));
    lines.push(`Change since the previous export ${days} days earlier: followers ${signed(cur.followers - prev.followers)}, following ${signed(cur.following - prev.following)}, mutuals ${signed(cur.mutuals - prev.mutuals)}.`);
  } else {
    lines.push('This is the first export we have numbers for, so there is no "since last time" yet.');
  }
  return lines.join('\n');
}
