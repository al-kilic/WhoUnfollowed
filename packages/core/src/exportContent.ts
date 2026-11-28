// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { fixMetaText } from './exportPosts.js';
import { openZipReader, type ZipReader } from './lazyZip.js';
import { CONTENT_FORMATS, type ContentFormat } from './contentFormats.js';
export { CONTENT_FORMATS, type ContentFormat };

// Everything the member posted, read from a full Instagram export ("All
// information"), in the browser: feed posts (photo, carousel, single video),
// Reels and older IGTV videos. Only dates, captions, formats and media paths;
// Instagram's export has no like or view counts. This feeds the coach's
// content history and voice profile, which are worked out from it in the
// browser (coach/contentStats.ts, coach/voiceStats.ts).
//
// Known layouts (both handled, with or without a wrapping folder):
//   your_instagram_activity/media/posts_N.json   array of { media[], title?, creation_timestamp? }
//   your_instagram_activity/media/reels.json     { ig_reels_media: [{ media[] }] }
//   your_instagram_activity/media/igtv_videos.json { ig_igtv_media: [{ media[] }] }
//   content/posts_N.json, content/reels.json, content/igtv_videos.json (older exports)
//   your_instagram_activity/media/posts.json     Meta's newer label_values layout of the same
//     posts; read only when no posts_N.json is there (see contentFromLabelPosts)
// The posts, Reels and newer posts.json shapes were checked against a real
// full export (Nov 2026); IGTV is from Meta's documented layout.

export type ContentSource = 'posts' | 'reels' | 'videos';

export interface ExportContentItem {
  // Unix seconds.
  date: number;
  caption: string;
  format: ContentFormat;
  slides: number;
  // Media paths inside the ZIP, in order. Used to tell items apart, never sent.
  uris: string[];
}

interface RawMedia { uri?: unknown; creation_timestamp?: unknown; title?: unknown }
interface RawItem { media?: unknown; title?: unknown; creation_timestamp?: unknown }

const VIDEO = /\.(mp4|mov|m4v|webm)$/i;
const FILE = /(^|\/)(your_instagram_activity\/media|content)\/(posts_\d+|reels|igtv_videos)\.json$/;

// Which list a path inside the ZIP is, or null when it isn't one we read.
export function contentSourceOf(path: string): ContentSource | null {
  const m = FILE.exec(path);
  if (!m) return null;
  const name = m[3]!;
  return name === 'reels' ? 'reels' : name === 'igtv_videos' ? 'videos' : 'posts';
}

// The array of items inside one file, whatever wrapper it uses.
function itemsOf(raw: unknown): RawItem[] {
  if (Array.isArray(raw)) return raw as RawItem[];
  if (raw && typeof raw === 'object') {
    for (const v of Object.values(raw as Record<string, unknown>)) if (Array.isArray(v)) return v as RawItem[];
  }
  return [];
}

export function contentFromJson(raw: unknown, source: ContentSource): ExportContentItem[] {
  const out: ExportContentItem[] = [];
  for (const item of itemsOf(raw)) {
    if (!item || typeof item !== 'object') continue;
    const media = Array.isArray(item.media) ? (item.media as RawMedia[]) : [];
    const uris = media.map((m) => (m && typeof m.uri === 'string' ? m.uri : '')).filter(Boolean);
    if (!uris.length) continue;
    const first = media[0];
    const date = typeof item.creation_timestamp === 'number' ? item.creation_timestamp
      : typeof first?.creation_timestamp === 'number' ? first.creation_timestamp : 0;
    if (!date) continue;
    const title = typeof item.title === 'string' && item.title ? item.title : typeof first?.title === 'string' ? first.title : '';
    const format: ContentFormat = source === 'reels' ? 'reel' : source === 'videos' ? 'video'
      : uris.length > 1 ? 'carousel' : VIDEO.test(uris[0]!) ? 'video' : 'photo';
    out.push({ date, caption: fixMetaText(title).trim(), format, slides: uris.length, uris });
  }
  return out;
}

// Meta's newer layout: [{ timestamp, label_values: [{ label: 'Caption', value },
// { label: 'Media', media: [first] }, { dict: [{ dict: [{ label: 'Media', media }] }] }] }].
// The unlabelled dict lists the slides; a single photo has only the 'Media' entry.
type Lv = { label?: unknown; value?: unknown; media?: unknown; dict?: unknown };
const LABEL_POSTS = /(^|\/)your_instagram_activity\/media\/posts\.json$/;
export function isLabelPostsFile(path: string): boolean { return LABEL_POSTS.test(path); }

function urisOf(media: unknown): string[] {
  return Array.isArray(media) ? (media as RawMedia[]).map((m) => (m && typeof m.uri === 'string' ? m.uri : '')).filter(Boolean) : [];
}

export function contentFromLabelPosts(raw: unknown): ExportContentItem[] {
  if (!Array.isArray(raw)) return [];
  const out: ExportContentItem[] = [];
  for (const item of raw as { timestamp?: unknown; label_values?: unknown }[]) {
    const lv = item && Array.isArray(item.label_values) ? (item.label_values as Lv[]) : [];
    if (!lv.length) continue;
    const top = lv.filter((x) => x?.label === 'Media').flatMap((x) => urisOf(x.media));
    const slides: string[] = [];
    for (const x of lv) {
      if (x?.label !== undefined || !Array.isArray(x?.dict)) continue;
      for (const it of x.dict as { dict?: unknown }[]) {
        if (!it || !Array.isArray(it.dict)) continue;
        for (const y of it.dict as Lv[]) if (y?.label === 'Media') slides.push(...urisOf(y.media));
      }
    }
    const uris = slides.length ? slides : top;
    const date = typeof item.timestamp === 'number' ? item.timestamp : 0;
    if (!uris.length || !date) continue;
    const cap = lv.find((x) => x?.label === 'Caption')?.value;
    const format: ContentFormat = uris.length > 1 ? 'carousel' : VIDEO.test(uris[0]!) ? 'video' : 'photo';
    out.push({ date, caption: fixMetaText(typeof cap === 'string' ? cap : '').trim(), format, slides: uris.length, uris });
  }
  return out;
}

// One list, newest first, with an item that appears in two files kept once
// (a Reel can also show up in posts_1.json; the Reels file wins).
export function mergeContent(lists: readonly ExportContentItem[][]): ExportContentItem[] {
  const byUri = new Map<string, ExportContentItem>();
  for (const list of lists) {
    for (const it of list) {
      const key = it.uris[0]!;
      const had = byUri.get(key);
      if (!had || (it.format === 'reel' && had.format !== 'reel')) byUri.set(key, it);
    }
  }
  return [...byUri.values()].sort((a, b) => b.date - a.date);
}

// Reads every post, Reel and video list in an export ZIP. Broken files are skipped.
// Only the list files are read, never the photos (see lazyZip.ts).
export async function readExportContent(file: Blob): Promise<ExportContentItem[]> {
  return contentFromZip(await openZipReader(file));
}

export async function contentFromZip(zip: ZipReader): Promise<ExportContentItem[]> {
  const order: Record<ContentSource, number> = { posts: 0, videos: 1, reels: 2 };
  const files = zip.names
    .map((name) => ({ name, source: contentSourceOf(name) }))
    .filter((f): f is { name: string; source: ContentSource } => f.source !== null)
    .sort((a, b) => order[a.source] - order[b.source]);
  const lists: ExportContentItem[][] = [];
  for (const f of files) {
    try { lists.push(contentFromJson(JSON.parse((await zip.text(f.name)) ?? 'null'), f.source)); } catch { /* skip a broken file */ }
  }
  // No posts from posts_N.json: fall back to the newer posts.json layout.
  if (!lists.some((l) => l.some((i) => i.format !== 'reel'))) {
    const name = zip.names.find(isLabelPostsFile);
    if (name) try { lists.unshift(contentFromLabelPosts(JSON.parse((await zip.text(name)) ?? 'null'))); } catch { /* skip */ }
  }
  return mergeContent(lists);
}
