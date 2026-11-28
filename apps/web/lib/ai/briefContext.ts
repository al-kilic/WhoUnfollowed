import 'server-only';
import { getBrief, listBriefDates } from '@/lib/briefs';
import { briefDigest, nicheEdition } from './briefContext.digest';

// The latest weekly brief, shortened for the coach: the title, the bold lead
// of each "This week" item and the one thing to try. The edition follows the
// member's niche when one matches, otherwise the general one.

export interface BriefContext { date: string; edition: string; lines: string[] }

export async function latestBriefContext(niche: string | null | undefined): Promise<BriefContext | null> {
  const [date] = await listBriefDates();
  if (!date) return null;
  const brief = await getBrief(date, 'en', true);
  if (!brief) return null;
  const want = nicheEdition(niche);
  const ed = brief.editions.find((e) => e.id === want && e.markdown) ?? brief.editions.find((e) => e.id === 'general' && e.markdown);
  if (!ed?.markdown) return null;
  const d = briefDigest(ed.markdown);
  return {
    date, edition: ed.id,
    lines: [`Weekly brief of ${date} (${ed.id}): ${d.title}`, ...d.items.map((i) => `- ${i}`), ...(d.tryLine ? [`One thing to try: ${d.tryLine}`] : [])],
  };
}
