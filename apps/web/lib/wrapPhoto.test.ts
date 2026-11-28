import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

const photo = (i: number) => ({ url: `https://www.pexels.com/photo/${i}`, photographer: `P${i}`, src: { large2x: `https://images.pexels.com/photos/${i}.jpeg` } });

async function load() {
  vi.resetModules();
  return import('./wrapPhoto');
}

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('photoOfTheDay', () => {
  it('returns null without a key and never calls Pexels', async () => {
    vi.stubEnv('PEXELS_API_KEY', '');
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    const { photoOfTheDay } = await load();
    expect(await photoOfTheDay('post')).toBeNull();
    expect(f).not.toHaveBeenCalled();
  });

  it('asks for upright creator photos for the post slot, landscape scenery for the wrap', async () => {
    vi.stubEnv('PEXELS_API_KEY', 'k');
    const f = vi.fn(async () => new Response(JSON.stringify({ photos: [photo(1), photo(2)] })));
    vi.stubGlobal('fetch', f);
    const { photoOfTheDay } = await load();
    const day = new Date('2026-11-21T10:00:00Z');
    const p = await photoOfTheDay('post', day);
    await photoOfTheDay('wrap', day);
    const urls = f.mock.calls.map((c) => String((c as unknown[])[0]));
    expect(urls[0]).toContain('orientation=portrait');
    expect(urls[1]).toContain('orientation=landscape');
    expect(p?.src).toMatch(/^https:\/\/images\.pexels\.com\//);
  });

  it('fetches once per slot per day', async () => {
    vi.stubEnv('PEXELS_API_KEY', 'k');
    const f = vi.fn(async () => new Response(JSON.stringify({ photos: [photo(1)] })));
    vi.stubGlobal('fetch', f);
    const { photoOfTheDay } = await load();
    const day = new Date('2026-11-21T10:00:00Z');
    await photoOfTheDay('post', day);
    await photoOfTheDay('post', day);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('rejects image links that are not on Pexels', async () => {
    vi.stubEnv('PEXELS_API_KEY', 'k');
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ photos: [{ src: { large2x: 'https://evil.example/x.jpg' } }] }))));
    const { photoOfTheDay } = await load();
    expect(await photoOfTheDay('post')).toBeNull();
  });
});
