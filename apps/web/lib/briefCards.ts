// Turns a weekly brief edition (markdown written by the weekly-brief skill)
// into cards: the news items with "why it matters" and "do this", the post
// ideas with their format and hook, and the one thing to try. Works for the
// en/es/pt editions (same structure, translated markers). Returns null when
// the markdown doesn't have that shape, so the page can fall back to text.

export type BriefPlatform = 'instagram' | 'threads' | 'tiktok' | 'meta';
export type IdeaFormat = 'reel' | 'carousel' | 'story' | 'threads' | 'tiktok' | 'photo' | 'post';

export interface BriefNews { title: string; body: string; why: string | null; doThis: string | null; source: { label: string; url: string } | null; platforms: BriefPlatform[] }
export interface BriefIdea { format: IdeaFormat; label: string; title: string; body: string; hook: string | null }
export interface BriefCards { title: string; lead: string | null; sections: string[]; news: BriefNews[]; ideas: BriefIdea[]; tryThis: string | null }

const WHY = /\b(?:Why it matters|Por qué importa|Por que importa):\s*/i;
const DO = /\b(?:Do this|Haz esto|Faça isto|Faça isso|O que fazer):\s*/i;
const HOOK = /\b(?:Hook|Gancho)(?:\s*\([^)]*\))?:\s*/i;
const LINK_END = /\s*\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)\s*$/;

export function platformsIn(text: string): BriefPlatform[] {
  const out: BriefPlatform[] = [];
  if (/instagram|\breels?\b|\bstor(?:y|ies)\b/i.test(text)) out.push('instagram');
  if (/threads/i.test(text)) out.push('threads');
  if (/tiktok/i.test(text)) out.push('tiktok');
  if (/\bmeta\b|facebook/i.test(text) && !out.includes('instagram')) out.push('meta');
  return out;
}

export function formatOf(text: string): IdeaFormat {
  const t = text.toLowerCase();
  if (/tiktok/.test(t) && !/reel/.test(t)) return 'tiktok';
  if (/reel|tiktok/.test(t)) return 'reel';
  if (/carousel|carrusel|carrossel/.test(t)) return 'carousel';
  if (/stor(y|ies)/.test(t)) return 'story';
  if (/threads/.test(t)) return 'threads';
  if (/photo|foto/.test(t)) return 'photo';
  return 'post';
}

const items = (section: string) => section.split('\n').filter((l) => /^\s*[-*]\s+/.test(l)).map((l) => l.replace(/^\s*[-*]\s+/, '').trim());
const bold = (s: string) => { const m = s.match(/^\*\*(.+?)\*\*\s*(.*)$/s); return m ? { head: m[1]!.trim(), rest: m[2]!.trim() } : { head: '', rest: s }; };

export function parseBriefCards(md: string): BriefCards | null {
  const title = md.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (!title) return null;
  const parts = md.split(/^##\s+/m);
  const intro = (parts[0] ?? '').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const secs = parts.slice(1).map((p) => ({ name: p.split('\n')[0]!.trim(), body: p.slice(p.indexOf('\n') + 1) }));
  if (secs.length < 2) return null;

  const news = items(secs[0]!.body).map((raw): BriefNews => {
    const link = raw.match(LINK_END);
    const noLink = link ? raw.replace(LINK_END, '') : raw;
    const { head, rest } = bold(noLink);
    const [beforeWhy, afterWhy] = rest.split(WHY);
    const [why, doThis] = afterWhy !== undefined ? afterWhy.split(DO) : [undefined, undefined];
    const body = (beforeWhy ?? '').trim();
    return { title: head.replace(/\.$/, ''), body, why: why?.trim() || null, doThis: doThis?.trim() || null, source: link ? { label: link[1]!, url: link[2]! } : null, platforms: platformsIn(`${head} ${body}`) };
  });

  const ideas = items(secs[1]!.body).map((raw): BriefIdea => {
    const { head, rest } = bold(raw);
    const h = head.replace(/:$/, '');
    const comma = h.indexOf(',');
    const label = comma > 0 ? h.slice(0, comma).trim() : h;
    const ideaTitle = comma > 0 ? h.slice(comma + 1).trim().replace(/^["“]|["”]$/g, '') : '';
    const [body, hook] = rest.split(HOOK);
    return { format: formatOf(label), label, title: ideaTitle, body: (body ?? '').trim(), hook: hook?.trim().replace(/^["“]|["”]$/g, '') || null };
  });

  const last = secs.length >= 3 ? secs[secs.length - 1]! : null;
  const tryThis = last ? last.body.split('\n').map((l) => l.trim()).filter(Boolean).join(' ') || null : null;
  if (!news.length && !ideas.length) return null;
  return { title, lead: intro[0] ?? null, sections: secs.map((s) => s.name), news, ideas, tryThis };
}

// A bundled photo for a card, picked the same way every time (no hotlinking).
export const BRIEF_PHOTOS = ['ph01', 'ph02', 'ph03', 'ph04', 'ph05', 'ph06', 'ph07', 'ph08', 'ph09', 'ph10'].map((n) => `/home/post/${n}.jpg`);
export function briefPhoto(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  return BRIEF_PHOTOS[Math.abs(h) % BRIEF_PHOTOS.length]!;
}
