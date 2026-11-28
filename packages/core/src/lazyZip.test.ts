import { describe, expect, it } from 'vitest';
import JSZip from 'jszip';
import { openLazyZip, openZipReader } from './lazyZip.js';

const blobOf = async (zip: JSZip, compression: 'STORE' | 'DEFLATE') =>
  new Blob([(await zip.generateAsync({ type: 'uint8array', compression })).slice().buffer as ArrayBuffer]);

const sample = () => {
  const z = new JSZip();
  z.file('wrap/your_instagram_activity/media/posts_1.json', JSON.stringify([{ title: 'café', creation_timestamp: 1 }]));
  z.file('wrap/media/posts/a.jpg', new Uint8Array([1, 2, 3, 4, 5]));
  z.file('wrap/logged_information/ünïcode.json', '{"x":"ü"}');
  z.folder('wrap/empty');
  return z;
};

describe('openLazyZip', () => {
  for (const c of ['STORE', 'DEFLATE'] as const) {
    it(`reads names, text and bytes (${c})`, async () => {
      const r = await openLazyZip(await blobOf(sample(), c));
      expect(r.names.filter((n) => !n.endsWith('/')).sort()).toEqual(['wrap/logged_information/ünïcode.json', 'wrap/media/posts/a.jpg', 'wrap/your_instagram_activity/media/posts_1.json']);
      expect(r.names).toContain('wrap/empty/');
      expect(JSON.parse((await r.text('wrap/your_instagram_activity/media/posts_1.json'))!)[0].title).toBe('café');
      expect([...(await r.bytes('wrap/media/posts/a.jpg'))!]).toEqual([1, 2, 3, 4, 5]);
      expect(await r.text('wrap/logged_information/ünïcode.json')).toBe('{"x":"ü"}');
      expect(await r.bytes('missing')).toBeNull();
    });
  }

  it('reads a large deflated entry', async () => {
    const z = new JSZip();
    const big = 'x'.repeat(2_000_000);
    z.file('big.txt', big);
    expect((await (await openLazyZip(await blobOf(z, 'DEFLATE'))).text('big.txt'))?.length).toBe(big.length);
  });

  it('throws on something that is not a zip, and openZipReader gives up the same way', async () => {
    await expect(openLazyZip(new Blob(['hello']))).rejects.toThrow();
    await expect(openZipReader(new Blob(['hello']))).rejects.toThrow();
  });
});

describe('openZipReader fallback', () => {
  it('uses JSZip when the browser cannot inflate lazily, with the same result', async () => {
    const z = new JSZip();
    z.file('a/followers_1.json', '[1]');
    const blob = new Blob([(await z.generateAsync({ type: 'uint8array', compression: 'DEFLATE' })).slice().buffer as ArrayBuffer]);
    const lazy = await openZipReader(blob, true);
    const old = await openZipReader(blob, false);
    expect(await old.text('a/followers_1.json')).toBe('[1]');
    expect(await lazy.text('a/followers_1.json')).toBe('[1]');
    expect(old.names.filter((n) => !n.endsWith('/'))).toEqual(lazy.names.filter((n) => !n.endsWith('/')));
  });
});
