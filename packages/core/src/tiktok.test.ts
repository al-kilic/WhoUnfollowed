import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';
import { MissingFilesError, SchemaValidationError } from './errors.js';
import { parseExportZip } from './parser.js';
import { parseTikTokDate, parseTikTokJson, parseTikTokTxt, tiktokListNearCap } from './tiktok.js';

// Synthetic fixtures modeled on community-documented TikTok exports (made-up
// usernames). Replace with a trimmed real export once one is available.

const entry = (u: string, d = '2024-03-05 10:20:30') => ({ Date: d, UserName: u });

const legacyJson = (followers: string[], following: string[]) => ({
  Activity: {
    'Follower List': { FansList: followers.map(u => entry(u)) },
    'Following List': { Following: following.map(u => entry(u)) },
    'Like List': { ItemFavoriteList: [{ Date: '2024-01-01 00:00:00', Link: 'https://x' }] },
  },
  Profile: { 'Profile Information': { ProfileMap: { userName: 'me' } } },
});

const newerJson = (followers: string[], following: string[]) => ({
  'Your Activity': {
    Follower: { FansList: followers.map(u => entry(u)) },
    Following: { Following: following.map(u => entry(u)) },
  },
});

const buf = (z: JSZip) => z.generateAsync({ type: 'arraybuffer' });
const jsonBuf = (o: unknown) => new TextEncoder().encode(JSON.stringify(o)).buffer as ArrayBuffer;

describe('parseTikTokDate', () => {
  it('reads TikTok date strings as UTC', () => {
    expect(parseTikTokDate('2024-03-05 10:20:30')).toBe(Date.UTC(2024, 2, 5, 10, 20, 30) / 1000);
  });
  it('accepts epoch seconds and milliseconds', () => {
    expect(parseTikTokDate(1700000000)).toBe(1700000000);
    expect(parseTikTokDate(1700000000123)).toBe(1700000000);
  });
  it('returns null for junk', () => {
    expect(parseTikTokDate('')).toBeNull();
    expect(parseTikTokDate('not a date')).toBeNull();
    expect(parseTikTokDate(undefined)).toBeNull();
  });
});

describe('parseTikTokJson', () => {
  it('finds lists in the older Activity layout', () => {
    const r = parseTikTokJson(legacyJson(['ann', 'ben'], ['ann', 'cat']));
    expect(r.followers.map(a => a.username)).toEqual(['ann', 'ben']);
    expect(r.following.map(a => a.username)).toEqual(['ann', 'cat']);
    expect(r.following[0]).toEqual({ username: 'ann', href: 'https://www.tiktok.com/@ann', followedAt: Date.UTC(2024, 2, 5, 10, 20, 30) / 1000 });
  });

  it('finds lists in the newer Your Activity layout', () => {
    const r = parseTikTokJson(newerJson(['a.b_c'], ['d']));
    expect(r.followers.map(a => a.username)).toEqual(['a.b_c']);
    expect(r.following.map(a => a.username)).toEqual(['d']);
  });

  it('rejects usernames that are not valid TikTok handles and strips a leading @', () => {
    const r = parseTikTokJson({ Activity: { 'Follower List': { FansList: [
      { UserName: '@ok_name' }, { UserName: 'javascript:alert(1)' }, { UserName: 'has space' }, { UserName: '' }, {},
    ] } } });
    expect(r.followers.map(a => a.username)).toEqual(['ok_name']);
    expect(r.followers[0]!.followedAt).toBeNull();
  });

  it('dedupes repeated usernames case-insensitively', () => {
    const r = parseTikTokJson(legacyJson(['Ann', 'ann', 'ben'], []));
    expect(r.followers.map(a => a.username)).toEqual(['Ann', 'ben']);
  });

  it('accepts empty lists', () => {
    const r = parseTikTokJson(legacyJson([], []));
    expect(r.followers).toEqual([]);
    expect(r.following).toEqual([]);
  });

  it('throws MissingFilesError(tiktok) when Activity was not exported', () => {
    expect(() => parseTikTokJson({ Profile: {} })).toThrow(MissingFilesError);
    try { parseTikTokJson({ Profile: {} }); } catch (e) { expect((e as MissingFilesError).platform).toBe('tiktok'); }
  });

  it('throws on a non-object root', () => {
    expect(() => parseTikTokJson([1, 2])).toThrow(SchemaValidationError);
  });

  it('does not recurse forever on deep nesting', () => {
    let deep: Record<string, unknown> = { FansList: [entry('x')] };
    for (let i = 0; i < 50; i++) deep = { n: deep };
    expect(() => parseTikTokJson(deep)).toThrow(MissingFilesError);
  });
});

describe('parseTikTokTxt', () => {
  it('parses blank-line separated records', () => {
    const txt = 'Date: 2024-03-05 10:20:30\r\nUsername: ann\r\n\r\nDate: 2024-03-06 10:20:30\nUsername: ben\n\n\n';
    const r = parseTikTokTxt(txt);
    expect(r.map(a => a.username)).toEqual(['ann', 'ben']);
    expect(r[1]!.followedAt).toBe(Date.UTC(2024, 2, 6, 10, 20, 30) / 1000);
  });
});

describe('parseExportZip: TikTok', () => {
  it('parses a zipped user_data_tiktok.json', async () => {
    const z = new JSZip();
    z.file('user_data_tiktok.json', JSON.stringify(legacyJson(['ann'], ['ben'])));
    const { snapshot, skippedPlatforms } = await parseExportZip(await buf(z));
    expect(snapshot.platform).toBe('tiktok');
    expect(snapshot.followers.map(a => a.username)).toEqual(['ann']);
    expect(skippedPlatforms).toEqual([]);
  });

  it('parses an older user_data.json inside a folder', async () => {
    const z = new JSZip();
    z.file('TikTok_Data_123/user_data.json', JSON.stringify(newerJson(['ann'], [])));
    const { snapshot } = await parseExportZip(await buf(z));
    expect(snapshot.platform).toBe('tiktok');
  });

  it('parses the TXT export', async () => {
    const z = new JSZip();
    z.file('TikTok_Data/Activity/Follower.txt', 'Date: 2024-01-01 00:00:00\nUsername: ann\n');
    z.file('TikTok_Data/Activity/Following.txt', 'Date: 2024-01-01 00:00:00\nUsername: ben\n');
    const { snapshot } = await parseExportZip(await buf(z));
    expect(snapshot.platform).toBe('tiktok');
    expect(snapshot.followers.map(a => a.username)).toEqual(['ann']);
    expect(snapshot.following.map(a => a.username)).toEqual(['ben']);
  });

  it('accepts the bare JSON file without a zip', async () => {
    const { snapshot } = await parseExportZip(jsonBuf(legacyJson(['ann'], ['ben'])));
    expect(snapshot.platform).toBe('tiktok');
    expect(snapshot.following.map(a => a.username)).toEqual(['ben']);
  });

  it('prefers Instagram when a zip somehow holds both', async () => {
    const z = new JSZip();
    z.file('user_data_tiktok.json', JSON.stringify(legacyJson(['ann'], [])));
    z.file('connections/followers_and_following/followers_1.json', JSON.stringify([]));
    z.file('connections/followers_and_following/following.json', JSON.stringify({ relationships_following: [] }));
    const { snapshot } = await parseExportZip(await buf(z));
    expect(snapshot.platform).toBe('instagram');
  });

  it('reports the TikTok data as missing when Activity is absent', async () => {
    const z = new JSZip();
    z.file('user_data_tiktok.json', JSON.stringify({ Profile: {} }));
    await expect(parseExportZip(await buf(z))).rejects.toMatchObject({ code: 'MISSING_FILES', platform: 'tiktok' });
  });
});

describe('tiktokListNearCap', () => {
  it('flags lists at the 10k export cap', () => {
    const many = Array.from({ length: 9_900 }, (_, i) => ({ username: `u${i}`, href: '', followedAt: null }));
    expect(tiktokListNearCap({ followers: many, following: [] })).toBe(true);
    expect(tiktokListNearCap({ followers: many.slice(0, 500), following: [] })).toBe(false);
  });
});
