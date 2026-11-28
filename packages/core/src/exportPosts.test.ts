import { describe, expect, it } from 'vitest';
import JSZip from 'jszip';
import { fixMetaText, openExportPosts, postsFromJson } from './exportPosts.js';

describe('postsFromJson', () => {
  it('reads single and multi-photo posts, newest first, skipping video-only posts', () => {
    const posts = postsFromJson([
      { media: [{ uri: 'media/posts/202601/a.jpg', creation_timestamp: 100, title: 'single' }] },
      { title: 'carousel', creation_timestamp: 300, media: [{ uri: 'media/posts/202602/b.jpg' }, { uri: 'media/posts/202602/c.mp4' }, { uri: 'media/posts/202602/d.webp' }] },
      { media: [{ uri: 'media/posts/202603/e.mp4', creation_timestamp: 200 }] },
    ]);
    expect(posts).toEqual([
      { date: 300, caption: 'carousel', photos: ['media/posts/202602/b.jpg', 'media/posts/202602/d.webp'], slides: 3 },
      { date: 100, caption: 'single', photos: ['media/posts/202601/a.jpg'], slides: 1 },
    ]);
  });
  it('ignores junk', () => {
    expect(postsFromJson({})).toEqual([]);
    expect(postsFromJson([{ media: 'x' }, null])).toEqual([]);
  });
});

describe('fixMetaText', () => {
  it('repairs UTF-8 written as single bytes, and leaves clean text alone', () => {
    expect(fixMetaText('cafÃ© ð\u009f\u0093¸')).toBe('café 📸');
    expect(fixMetaText('muscat, briefly …')).toBe('muscat, briefly …');
  });
});

describe('openExportPosts', () => {
  it('finds posts in either layout and reads a photo, inside a wrapping folder', async () => {
    const zip = new JSZip();
    zip.file('instagram-me-2026/your_instagram_activity/media/posts_1.json', JSON.stringify([{ media: [{ uri: 'media/posts/202601/a.jpg', creation_timestamp: 100, title: 'hi' }] }]));
    zip.file('instagram-me-2026/media/posts/202601/a.jpg', new Uint8Array([255, 216, 255]));
    const blob = new Blob([(await zip.generateAsync({ type: 'uint8array' })).slice().buffer as ArrayBuffer]);
    const res = await openExportPosts(blob);
    expect(res.posts).toHaveLength(1);
    const photo = await res.photo(res.posts[0]!.photos[0]!);
    expect(photo?.type).toBe('image/jpeg');
    expect(photo?.size).toBe(3);
  });
});
