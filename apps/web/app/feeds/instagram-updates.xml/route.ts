import { getBrief, listBriefDates } from '@/lib/briefs';
import { rss } from '@/lib/feeds/rss';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

// RSS for the free weekly brief (English, General edition only).
export async function GET(): Promise<Response> {
  const dates = (await listBriefDates()).slice(0, 30);
  const items = await Promise.all(dates.map(async (date) => {
    const md = (await getBrief(date, 'en', false))?.editions.find((e) => e.id === 'general')?.markdown ?? '';
    const title = /^#\s+(.+)$/m.exec(md)?.[1] ?? `Weekly brief, ${date}`;
    // The first paragraph after the title ("Covers November 9 to 21, 2026.").
    const lead = md.split('\n').map((l) => l.trim()).find((l) => l && !l.startsWith('#') && !l.startsWith('-')) ?? '';
    return { title, link: `${SITE_URL}/instagram-updates/${date}`, description: lead, date: new Date(`${date}T12:00:00Z`) };
  }));
  return rss({
    title: 'Instagram updates this week, by WhoUnfollowed',
    link: `${SITE_URL}/instagram-updates`,
    self: `${SITE_URL}/feeds/instagram-updates.xml`,
    description: 'A free weekly brief on what changed on Instagram, Threads and TikTok, and what to do about it.',
    language: 'en',
    items,
  });
}
