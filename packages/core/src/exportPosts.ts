import { openZipReader } from './lazyZip.js';

// Reads the user's own posts from a full Instagram export ("All information"):
// the date, the caption and the photos, in the browser. Instagram's export does
// not include like counts; those are added by hand. Two layouts are known:
// your_instagram_activity/media/posts_1.json (current) and content/posts_1.json.

export interface ExportPost {
  // Unix seconds.
  date: number;
  caption: string;
  // Paths of the post's photos inside the ZIP, in slide order (videos skipped).
  photos: string[];
  slides: number;
}

export interface ExportPosts {
  posts: ExportPost[];
  // One photo from the ZIP as a Blob, for a preview or an upload to the coach.
  photo(path: string): Promise<Blob | null>;
}

interface RawMedia { uri?: unknown; creation_timestamp?: unknown; title?: unknown }
interface RawPost { media?: unknown; title?: unknown; creation_timestamp?: unknown }

const PHOTO = /\.(jpe?g|png|webp)$/i;
const POSTS_FILE = /(^|\/)(your_instagram_activity\/media|content)\/posts_\d+\.json$/;

// Meta writes UTF-8 bytes as separate characters ("cafÃ©"); this turns them back.
export function fixMetaText(s: string): string {
  if (!/[À-ÿ][\u0080-¿]/.test(s)) return s;
  try {
    const bytes = Uint8Array.from(s, (ch) => ch.charCodeAt(0) & 0xff);
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return s;
  }
}

export function postsFromJson(raw: unknown): ExportPost[] {
  if (!Array.isArray(raw)) return [];
  const out: ExportPost[] = [];
  for (const item of raw as RawPost[]) {
    const media = Array.isArray(item?.media) ? (item.media as RawMedia[]) : [];
    if (!media.length) continue;
    const uris = media.map((m) => (typeof m.uri === 'string' ? m.uri : '')).filter(Boolean);
    const photos = uris.filter((u) => PHOTO.test(u));
    const date = typeof item.creation_timestamp === 'number' ? item.creation_timestamp
      : typeof media[0]?.creation_timestamp === 'number' ? (media[0].creation_timestamp as number) : 0;
    const title = typeof item.title === 'string' && item.title ? item.title : typeof media[0]?.title === 'string' ? (media[0].title as string) : '';
    if (!photos.length || !date) continue;
    out.push({ date, caption: fixMetaText(title).trim(), photos, slides: uris.length });
  }
  return out.sort((a, b) => b.date - a.date);
}

export async function openExportPosts(file: Blob): Promise<ExportPosts> {
  const zip = await openZipReader(file);
  const names = zip.names;
  const lists = names.filter((n) => POSTS_FILE.test(n));
  const posts: ExportPost[] = [];
  for (const name of lists) {
    try { posts.push(...postsFromJson(JSON.parse((await zip.text(name)) ?? 'null'))); } catch { /* skip a broken file */ }
  }
  posts.sort((a, b) => b.date - a.date);
  // A URI is relative to the export root; the ZIP may wrap everything in one folder.
  const find = (path: string) => (names.includes(path) ? path : names.find((n) => n.endsWith(`/${path}`)) ?? null);
  return {
    posts,
    async photo(path) {
      const name = find(path);
      const bytes = name ? await zip.bytes(name) : null;
      if (!bytes) return null;
      const type = /\.png$/i.test(path) ? 'image/png' : /\.webp$/i.test(path) ? 'image/webp' : 'image/jpeg';
      return new Blob([bytes.slice().buffer as ArrayBuffer], { type });
    },
  };
}
