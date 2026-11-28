import { describe, expect, it } from 'vitest';
import JSZip from 'jszip';
import { contentFromJson, contentSourceOf, mergeContent, readExportContent } from './exportContent.js';

const m = (uri: string, ts?: number, title?: string) => ({ uri, ...(ts ? { creation_timestamp: ts } : {}), ...(title ? { title } : {}) });

describe('contentSourceOf', () => {
  it('knows both layouts and the three lists, and nothing else', () => {
    expect(contentSourceOf('your_instagram_activity/media/posts_1.json')).toBe('posts');
    expect(contentSourceOf('wrap/your_instagram_activity/media/posts_12.json')).toBe('posts');
    expect(contentSourceOf('content/reels.json')).toBe('reels');
    expect(contentSourceOf('your_instagram_activity/media/igtv_videos.json')).toBe('videos');
    expect(contentSourceOf('your_instagram_activity/media/stories.json')).toBeNull();
    expect(contentSourceOf('connections/followers_and_following/followers_1.json')).toBeNull();
  });
});

describe('contentFromJson', () => {
  it('reads photos, carousels and single videos from posts, keeping video-only posts', () => {
    const items = contentFromJson([
      { media: [m('media/posts/a.jpg', 100, 'single')] },
      { title: 'carousel', creation_timestamp: 300, media: [m('media/posts/b.jpg'), m('media/posts/c.mp4'), m('media/posts/d.webp')] },
      { media: [m('media/posts/e.mp4', 200, 'clip')] },
    ], 'posts');
    expect(items.map((i) => [i.format, i.slides, i.caption, i.date])).toEqual([
      ['photo', 1, 'single', 100], ['carousel', 3, 'carousel', 300], ['video', 1, 'clip', 200],
    ]);
  });

  it('reads the wrapped Reels and IGTV shapes', () => {
    const reels = contentFromJson({ ig_reels_media: [{ media: [m('media/reels/r.mp4', 500, 'reel cafÃ©')] }] }, 'reels');
    expect(reels).toEqual([{ date: 500, caption: 'reel café', format: 'reel', slides: 1, uris: ['media/reels/r.mp4'] }]);
    const igtv = contentFromJson({ ig_igtv_media: [{ media: [m('media/igtv/v.mp4', 400)] }] }, 'videos');
    expect(igtv[0]?.format).toBe('video');
  });

  it('skips junk, empty media and missing dates', () => {
    expect(contentFromJson(null, 'posts')).toEqual([]);
    expect(contentFromJson({ nothing: 'here' }, 'reels')).toEqual([]);
    expect(contentFromJson([{ media: [] }, { media: [m('x.jpg')] }, null, 'x'], 'posts')).toEqual([]);
  });
});

describe('mergeContent', () => {
  it('keeps one copy per item, prefers the Reels entry, newest first', () => {
    const posts = contentFromJson([{ media: [m('media/reels/r.mp4', 500)] }, { media: [m('a.jpg', 100)] }], 'posts');
    const reels = contentFromJson({ ig_reels_media: [{ media: [m('media/reels/r.mp4', 500)] }] }, 'reels');
    const all = mergeContent([posts, reels]);
    expect(all.map((i) => [i.date, i.format])).toEqual([[500, 'reel'], [100, 'photo']]);
  });
});

describe('readExportContent', () => {
  it('reads every list inside a wrapping folder and skips a broken file', async () => {
    const zip = new JSZip();
    zip.file('me/your_instagram_activity/media/posts_1.json', JSON.stringify([{ media: [m('media/posts/a.jpg', 100, 'hi')] }]));
    zip.file('me/your_instagram_activity/media/reels.json', JSON.stringify({ ig_reels_media: [{ media: [m('media/reels/r.mp4', 200, 'reel')] }] }));
    zip.file('me/your_instagram_activity/media/igtv_videos.json', '{broken');
    const blob = new Blob([(await zip.generateAsync({ type: 'uint8array' })).slice().buffer as ArrayBuffer]);
    const items = await readExportContent(blob);
    expect(items.map((i) => [i.format, i.caption])).toEqual([['reel', 'reel'], ['photo', 'hi']]);
  });
});

describe('contentFromLabelPosts (newer posts.json)', () => {
  const lvPost = (ts: number, caption: string, top: string, slides: string[]) => ({
    timestamp: ts, media: [],
    label_values: [
      { label: 'Caption', value: caption },
      { label: 'Media', media: [{ uri: top, creation_timestamp: ts }] },
      { dict: slides.map((u) => ({ dict: [{ label: 'Media', media: [{ uri: u }] }, { label: 'Published', value: 'True' }] })), title: '' },
      { label: 'Metadata', dict: [{ dict: [{ label: 'Media', media: [{ uri: 'not/a/slide.jpg' }] }] }] },
    ],
  });

  it('reads slides from the unlabelled list, or the single Media entry', async () => {
    const { contentFromLabelPosts, isLabelPostsFile } = await import('./exportContent.js');
    const items = contentFromLabelPosts([
      lvPost(300, 'three slides cafÃ©', 'media/posts/cover.jpg', ['media/posts/a.jpg', 'media/posts/b.jpg', 'media/posts/c.mp4']),
      lvPost(200, 'single', 'media/posts/s.jpg', []),
      { timestamp: 0, label_values: [] },
      null,
    ]);
    expect(items.map((i) => [i.format, i.slides, i.caption, i.date])).toEqual([['carousel', 3, 'three slides café', 300], ['photo', 1, 'single', 200]]);
    expect(isLabelPostsFile('w/your_instagram_activity/media/posts.json')).toBe(true);
    expect(isLabelPostsFile('your_instagram_activity/media/posts_1.json')).toBe(false);
  });

  it('is used only when posts_N.json is missing', async () => {
    const both = new JSZip();
    both.file('your_instagram_activity/media/posts_1.json', JSON.stringify([{ title: 'old', creation_timestamp: 100, media: [m('media/posts/x.jpg')] }]));
    both.file('your_instagram_activity/media/posts.json', JSON.stringify([lvPost(100, 'new', 'media/posts/y.jpg', [])]));
    const a = await readExportContent(new Blob([(await both.generateAsync({ type: 'uint8array' })).slice().buffer as ArrayBuffer]));
    expect(a.map((i) => i.caption)).toEqual(['old']);
    const only = new JSZip();
    only.file('your_instagram_activity/media/posts.json', JSON.stringify([lvPost(100, 'new', 'media/posts/y.jpg', [])]));
    const b = await readExportContent(new Blob([(await only.generateAsync({ type: 'uint8array' })).slice().buffer as ArrayBuffer]));
    expect(b.map((i) => i.caption)).toEqual(['new']);
  });
});
