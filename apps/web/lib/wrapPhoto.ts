import 'server-only';

// One free photo a day per card (the 3-month wrap, the verdict poster, the
// sample post on the homepage), from Pexels (free to use,
// no attribution required, credit shown anyway). Fetched by our server and
// served from our own domain, so a visitor's browser never talks to Pexels.
// Without PEXELS_API_KEY the card falls back to its gradient.

export interface WrapPhoto { src: string; photographer: string; page: string }

const SCENERY = ['landscape at golden hour', 'city at night', 'mountain lake', 'ocean coast', 'desert road', 'forest light', 'snowy mountains', 'old town street'];
// The homepage's sample post: the kind of photo a creator would post, upright
// like an Instagram post. Its caption is written to fit any of these.
const CREATOR = ['travel photography', 'coffee shop morning', 'street portrait', 'healthy breakfast', 'surf beach', 'film photography', 'cozy reading', 'city cycling'];
export type PhotoSlot = 'wrap' | 'verdict' | 'post';
// Each slot uses a different topic and a different pick, so two cards never
// show the same photo on the same day.
const SLOT: Record<PhotoSlot, { offset: number; topics: string[]; orientation: 'landscape' | 'portrait' }> = {
  wrap: { offset: 0, topics: SCENERY, orientation: 'landscape' },
  verdict: { offset: 3, topics: SCENERY, orientation: 'landscape' },
  post: { offset: 0, topics: CREATOR, orientation: 'portrait' },
};
export const PHOTO_SLOTS = Object.keys(SLOT) as PhotoSlot[];
const cache = new Map<PhotoSlot, { day: string; photo: WrapPhoto | null }>();

interface PexelsPhoto { url?: unknown; photographer?: unknown; src?: { large2x?: unknown; large?: unknown } }

export async function photoOfTheDay(slot: PhotoSlot = 'wrap', now: Date = new Date()): Promise<WrapPhoto | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;
  const day = now.toISOString().slice(0, 10);
  const hit = cache.get(slot);
  if (hit?.day === day) return hit.photo;
  const { offset, topics, orientation } = SLOT[slot];
  const n = Math.floor(now.getTime() / 86_400_000) + offset;
  const topic = topics[n % topics.length]!;
  try {
    const r = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(topic)}&orientation=${orientation}&per_page=40`, { headers: { Authorization: key }, cache: 'no-store' });
    if (!r.ok) throw new Error(`pexels ${r.status}`);
    const list = ((await r.json()) as { photos?: PexelsPhoto[] }).photos ?? [];
    const p = list[n % Math.max(1, list.length)];
    const src = p?.src?.large2x ?? p?.src?.large;
    const photo = p && typeof src === 'string' && /^https:\/\/images\.pexels\.com\//.test(src)
      ? { src, photographer: typeof p.photographer === 'string' ? p.photographer : '', page: typeof p.url === 'string' ? p.url : 'https://www.pexels.com' }
      : null;
    cache.set(slot, { day, photo });
    return photo;
  } catch (err) {
    console.error('[wrap-photo] fetch failed:', err);
    cache.set(slot, { day, photo: null });
    return null;
  }
}
