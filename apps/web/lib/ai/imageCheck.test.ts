import { describe, expect, it } from 'vitest';
import { checkChatImage, underAttachLimit, ATTACH_LIMIT } from './imageCheck';

const url = (type: string, bytes: number[]) => `data:image/${type};base64,${Buffer.from(Uint8Array.from(bytes)).toString('base64')}`;
const be32 = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
const png = (w: number, h: number) => [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52, ...be32(w), ...be32(h), 8, 2, 0, 0, 0];
const jpeg = (w: number, h: number) => [0xff, 0xd8, 0xff, 0xe0, 0, 16, ...Array(14).fill(0), 0xff, 0xc0, 0, 17, 8, h >> 8, h & 255, w >> 8, w & 255, 3, ...Array(12).fill(0)];
const webpX = (w: number, h: number) => [...Buffer.from('RIFF'), 0, 0, 0, 0, ...Buffer.from('WEBPVP8X'), 10, 0, 0, 0, 0, 0, 0, 0, (w - 1) & 255, ((w - 1) >> 8) & 255, 0, (h - 1) & 255, ((h - 1) >> 8) & 255, 0, 0, 0];

describe('checkChatImage', () => {
  it('reads PNG, JPEG and WebP sizes', () => {
    expect(checkChatImage(url('png', png(800, 600)))).toMatchObject({ ok: true, type: 'png', width: 800, height: 600 });
    expect(checkChatImage(url('jpeg', jpeg(1024, 768)))).toMatchObject({ ok: true, type: 'jpeg', width: 1024, height: 768 });
    expect(checkChatImage(url('webp', webpX(640, 480)))).toMatchObject({ ok: true, type: 'webp', width: 640, height: 480 });
  });
  it('rejects a declared type that does not match the bytes', () => {
    expect(checkChatImage(url('jpeg', png(10, 10)))).toEqual({ ok: false, reason: 'mismatch' });
  });
  it('rejects oversized and unreadable images', () => {
    expect(checkChatImage(url('png', png(5000, 100)))).toEqual({ ok: false, reason: 'dimensions' });
    expect(checkChatImage(url('png', [1, 2, 3, 4]))).toEqual({ ok: false, reason: 'unreadable' });
    expect(checkChatImage('data:image/gif;base64,R0lGOD')).toEqual({ ok: false, reason: 'format' });
  });
});

describe('underAttachLimit', () => {
  it('allows a burst up to the limit per member, then blocks until the window passes', () => {
    const t0 = 1_000_000;
    for (let i = 0; i < ATTACH_LIMIT.max; i++) expect(underAttachLimit('u-limit', t0 + i)).toBe(true);
    expect(underAttachLimit('u-limit', t0 + 100)).toBe(false);
    expect(underAttachLimit('u-other', t0 + 100)).toBe(true);
    expect(underAttachLimit('u-limit', t0 + ATTACH_LIMIT.windowMs + 200)).toBe(true);
  });
});
