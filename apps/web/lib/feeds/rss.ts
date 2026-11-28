// A small RSS 2.0 writer for the blog and the weekly brief feeds. Feed readers
// and AI answer engines both use these to find new pages fast.

export interface RssItem { title: string; link: string; description: string; date: Date | null }

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function rss({ title, link, self, description, language, items }: {
  title: string; link: string; self: string; description: string; language: string; items: RssItem[];
}): Response {
  const newest = items.find((i) => i.date)?.date;
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(title)}</title>
<link>${esc(link)}</link>
<atom:link href="${esc(self)}" rel="self" type="application/rss+xml"/>
<description>${esc(description)}</description>
<language>${esc(language)}</language>
${newest ? `<lastBuildDate>${newest.toUTCString()}</lastBuildDate>\n` : ''}${items.map((i) => `<item>
<title>${esc(i.title)}</title>
<link>${esc(i.link)}</link>
<guid isPermaLink="true">${esc(i.link)}</guid>
${i.date ? `<pubDate>${i.date.toUTCString()}</pubDate>\n` : ''}<description>${esc(i.description)}</description>
</item>`).join('\n')}
</channel>
</rss>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
