import type { AiInsightsStats, ContentStats, VoiceStats } from '@ig-tracker/core';

// Memory v2 (phase 2E): how the member's voice and posting history read in
// the coach's context. Pure. The voice card sits in the cached core, so it is
// byte-stable: rounded numbers, examples in a fixed order, no dates. The
// history line moves with each export and goes in the uncached part.

const pct = (x: number) => `${Math.round(x * 100)}%`;

export function voiceCard(stats: VoiceStats | null, exemplars: readonly string[]): string[] {
  if (!stats || stats.captions < 3) return [];
  const bits = [
    stats.medianWords != null ? `about ${Math.round(stats.medianWords)} words a caption` : null,
    `${pct(stats.shortShare)} short`,
    stats.hashtagMedian != null ? `${Math.round(stats.hashtagMedian)} hashtags usually` : null,
    `emoji in ${pct(stats.emojiShare)}`,
    `questions in ${pct(stats.questionShare)}`,
    `first person in ${pct(stats.firstPersonShare)}`,
    stats.lowercaseStartShare >= 0.5 ? 'often starts in lowercase' : null,
  ].filter(Boolean).join(', ');
  return [
    `From ${stats.captions} of their captions: ${bits}.`,
    ...exemplars.slice(0, 4).map((e) => `> ${e.replace(/\s+/g, ' ').trim()}`),
  ];
}

const FORMAT_WORD: Record<string, string> = { photo: 'single photos', carousel: 'carousels', reel: 'Reels', video: 'videos' };

export function historyLines(c: ContentStats | null): string[] {
  if (!c || !c.total) return [];
  const mix = Object.entries(c.mix90).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${pct(v)} ${FORMAT_WORD[k] ?? k}`).join(', ');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const top = c.weekday.map((n, i) => ({ n, i })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 3).map((x) => days[x.i]).join(', ');
  return [
    `${c.posts30} posts in the last 30 days, ${c.posts90} in 90, ${c.posts365} in a year.${mix ? ` Last 90 days: ${mix}.` : ''}`,
    [
      c.medianGapDays != null ? `Usually ${Math.round(c.medianGapDays)} days between posts` : null,
      c.currentGapDays != null ? `${Math.round(c.currentGapDays)} days since the last one` : null,
      top ? `posts most on ${top}` : null,
      c.medianHashtags != null ? `${Math.round(c.medianHashtags)} hashtags usually` : null,
    ].filter(Boolean).join('; ') + '.',
  ];
}

// Instagram's own numbers from the export, in the uncached part next to the
// history. At most five short lines; numbers, days and top countries only.
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const r = (n: number) => Math.round(n).toLocaleString('en-US');
const signed = (n: number) => `${n > 0 ? '+' : ''}${Math.round(n * 10) / 10}%`;

export function insightsLines(i: AiInsightsStats | null | undefined): string[] {
  if (!i) return [];
  const out: string[] = [];
  const a = i.account;
  if (a) {
    const bits = [
      a.followers != null ? `${r(a.followers)} followers${a.followersDeltaPct != null ? ` (${signed(a.followersDeltaPct)} vs the period before)` : ''}` : null,
      a.follows != null && a.unfollows != null ? `${r(a.follows)} follows and ${r(a.unfollows)} unfollows` : null,
      a.reached != null ? `reached ${r(a.reached)} accounts${a.reachedDeltaPct != null ? ` (${signed(a.reachedDeltaPct)})` : ''}${a.nonFollowerReachPct != null ? `, ${Math.round(a.nonFollowerReachPct)}% not following` : ''}` : null,
      a.profileVisits != null ? `${r(a.profileVisits)} profile visits` : null,
      a.linkTaps != null ? `${r(a.linkTaps)} link taps` : null,
    ].filter(Boolean);
    if (bits.length) out.push(`Instagram's numbers for ${a.range ?? 'the last 90 days'}: ${bits.join(', ')}.`);
    const who = [
      a.topAge ? `mostly ${a.topAge} (${Math.round(a.topAgePct ?? 0)}%)` : null,
      a.womenPct != null ? `${Math.round(a.womenPct)}% women` : null,
      a.countries.length ? `top countries ${a.countries.map((c) => `${c.name} ${Math.round(c.pct)}%`).join(', ')}` : null,
      a.activityPeak != null && (a.activityLiftPct ?? 0) >= 10 ? `followers most active on ${DAY_NAMES[a.activityPeak]} (${signed(a.activityLiftPct ?? 0)} vs average)` : null,
    ].filter(Boolean);
    if (who.length) out.push(`Audience: ${who.join('; ')}.`);
  }
  const s = i.stories;
  if (s && s.last365 > 0) {
    out.push([
      `Stories: ${s.last90} in the last 90 days, ${s.last365} in a year`,
      s.medianReach90 != null ? `median reach ${r(s.medianReach90)}${s.medianReachBefore != null ? ` (${r(s.medianReachBefore)} earlier in the year)` : ''}` : null,
      s.exitPct90 != null ? `${Math.round(s.exitPct90)}% of viewers leave on a typical story` : null,
      s.repliesPer100 != null ? `${s.repliesPer100} replies per 100 reached` : null,
    ].filter(Boolean).join('; ') + '.');
  }
  const f = i.formats.filter((x) => x.medianReach != null);
  if (f.length) {
    const n = f.reduce((t, x) => t + x.posts, 0);
    out.push(`Per-post numbers Instagram kept (${n} posts): ${f.map((x) => `${FORMAT_WORD[x.format] ?? x.format} median reach ${r(x.medianReach!)}${x.medianLikes != null ? `, ${r(x.medianLikes)} likes` : ''}${x.medianSaves != null ? `, ${r(x.medianSaves)} saves` : ''} (${x.posts})`).join('; ')}.`);
    const best = [...i.posts].filter((p) => p.reach != null).sort((x, y) => y.reach! - x.reach!)[0];
    if (best && n >= 3) out.push(`Best of those: a ${(FORMAT_WORD[best.format] ?? best.format).replace(/s$/, '')} on ${best.date} reached ${r(best.reach!)}${best.saves != null ? ` with ${r(best.saves)} saves` : ''}${best.follows != null ? ` and ${r(best.follows)} follows` : ''}.`);
  }
  return out;
}
