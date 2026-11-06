// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type JSZip from 'jszip';
import { MissingFilesError, SchemaValidationError } from './errors.js';
import type { Account, ParsedSnapshot } from './schemas.js';

// TikTok's "Download your data" export (Settings > Account > Download your
// data). Two formats exist:
//
// JSON: one big file, `user_data_tiktok.json` (older exports: `user_data.json`),
//   with the lists nested a few levels down, e.g.
//     { "Activity": { "Follower List": { "FansList": [{ "Date": "2024-01-02 03:04:05", "UserName": "ann" }] },
//                     "Following List": { "Following": [{ "Date": "...", "UserName": "ben" }] } } }
//   Newer exports have renamed the outer sections ("Your Activity", "Follower",
//   "Following"), so the parser walks the tree for the inner list keys instead
//   of trusting a fixed path.
// TXT (TikTok's default): a folder of text files, one per section, with
//   records like "Date: 2024-01-02 03:04:05\nUsername: ann" separated by
//   blank lines.
//
// NOT YET VERIFIED against a real export from this project's users. Built from
// community-documented layouts; check with a real file before relying on it.

// Keys that hold the two lists, compared case-insensitively.
const FOLLOWER_LIST_KEYS = ['fanslist', 'followerlist', 'followers', 'follower'];
const FOLLOWING_LIST_KEYS = ['following', 'followinglist'];
const USERNAME_KEYS = ['username', 'uniqueid', 'user_name'];
const DATE_KEYS = ['date', 'time', 'createtime'];

// TikTok usernames are letters, digits, underscores and periods (max 24).
// Anything else is rejected rather than turned into a link.
const TIKTOK_USERNAME_RE = /^[A-Za-z0-9._]{1,64}$/;

export const TIKTOK_JSON_RE = /(?:^|\/)user_data(?:_tiktok)?\.json$/i;
const TIKTOK_TXT_FOLLOWER_RE = /(?:^|\/)(?:follower|followers|fans)(?:[ _]list)?\.txt$/i;
const TIKTOK_TXT_FOLLOWING_RE = /(?:^|\/)following(?:[ _]list)?\.txt$/i;

export function tiktokHref(username: string): string {
  return `https://www.tiktok.com/@${username}`;
}

function cleanUsername(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const u = raw.trim().replace(/^@/, '');
  return TIKTOK_USERNAME_RE.test(u) ? u : null;
}

// "2024-01-02 03:04:05" (UTC, as TikTok writes it), ISO strings, or epoch
// seconds/milliseconds. Returns epoch seconds or null.
export function parseTikTokDate(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
    return Math.floor(raw > 1e12 ? raw / 1000 : raw);
  }
  if (typeof raw !== 'string' || !raw.trim()) return null;
  const s = raw.trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/.exec(s);
  if (m) {
    const ms = Date.UTC(+m[1]!, +m[2]! - 1, +m[3]!, +m[4]!, +m[5]!, +(m[6] ?? 0));
    return Number.isFinite(ms) && ms > 0 ? Math.floor(ms / 1000) : null;
  }
  const ms = Date.parse(s);
  return Number.isFinite(ms) && ms > 0 ? Math.floor(ms / 1000) : null;
}

function pick(obj: Record<string, unknown>, keys: string[]): unknown {
  for (const [k, v] of Object.entries(obj)) {
    if (keys.includes(k.toLowerCase().replace(/[\s_-]/g, ''))) return v;
  }
  return undefined;
}

function toAccount(item: unknown): Account | null {
  if (!item || typeof item !== 'object') return null;
  const rec = item as Record<string, unknown>;
  const username = cleanUsername(pick(rec, USERNAME_KEYS));
  if (!username) return null;
  return { username, href: tiktokHref(username), followedAt: parseTikTokDate(pick(rec, DATE_KEYS)) };
}

function isAccountArray(v: unknown): v is unknown[] {
  if (!Array.isArray(v)) return false;
  // An empty list is a valid (empty) list; otherwise the first item must look
  // like a TikTok account record.
  if (v.length === 0) return true;
  const first = v[0];
  return !!first && typeof first === 'object' && pick(first as Record<string, unknown>, USERNAME_KEYS) !== undefined;
}

// Depth-first search for the first array under one of `keys` that holds
// account records. Bounded depth so a hostile file can't recurse forever.
function findList(node: unknown, keys: string[], depth = 0): unknown[] | null {
  if (!node || typeof node !== 'object' || depth > 6) return null;
  if (Array.isArray(node)) return null;
  for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
    const norm = k.toLowerCase().replace(/[\s_-]/g, '');
    if (keys.includes(norm) && isAccountArray(v)) return v;
  }
  for (const v of Object.values(node as Record<string, unknown>)) {
    const found = findList(v, keys, depth + 1);
    if (found) return found;
  }
  return null;
}

function dedupe(accounts: Account[]): Account[] {
  const seen = new Set<string>();
  return accounts.filter(a => {
    const key = a.username.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Parses the TikTok JSON export object. Throws MissingFilesError when neither
// list is present (the user left "Activity" out of the request).
export function parseTikTokJson(data: unknown, fileName = 'user_data_tiktok.json'): { followers: Account[]; following: Account[] } {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new SchemaValidationError(fileName, 'Expected a JSON object');
  }
  const followerList = findList(data, FOLLOWER_LIST_KEYS);
  const followingList = findList(data, FOLLOWING_LIST_KEYS);
  if (!followerList && !followingList) {
    throw new MissingFilesError(['Follower', 'Following'], 'tiktok');
  }
  const map = (list: unknown[] | null) =>
    dedupe((list ?? []).map(toAccount).filter((a): a is Account => a !== null));
  return { followers: map(followerList), following: map(followingList) };
}

// Parses one TikTok TXT section file: "Key: value" lines, blank-line separated.
export function parseTikTokTxt(text: string): Account[] {
  const accounts: Account[] = [];
  for (const block of text.replace(/\r\n?/g, '\n').split(/\n\s*\n/)) {
    const rec: Record<string, string> = {};
    for (const line of block.split('\n')) {
      const i = line.indexOf(':');
      if (i <= 0) continue;
      rec[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    const a = toAccount(rec);
    if (a) accounts.push(a);
  }
  return dedupe(accounts);
}

export function hasTikTokFiles(fileNames: string[]): boolean {
  return fileNames.some(n => TIKTOK_JSON_RE.test(n) || TIKTOK_TXT_FOLLOWER_RE.test(n) || TIKTOK_TXT_FOLLOWING_RE.test(n));
}

// TikTok reportedly caps the follower list in the export at about the most
// recent 10,000. The UI warns when a list is at or near the cap.
export const TIKTOK_LIST_CAP = 10_000;

export function tiktokListNearCap(snapshot: Pick<ParsedSnapshot, 'followers' | 'following'>): boolean {
  return snapshot.followers.length >= TIKTOK_LIST_CAP * 0.98 || snapshot.following.length >= TIKTOK_LIST_CAP * 0.98;
}

export async function parseTikTokZip(zip: JSZip, fileNames: string[], filenameDate: number | null): Promise<ParsedSnapshot> {
  const jsonName = fileNames.find(n => TIKTOK_JSON_RE.test(n));
  let lists: { followers: Account[]; following: Account[] };

  if (jsonName) {
    const raw = await zip.files[jsonName]!.async('string');
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new SchemaValidationError(jsonName, 'File is not valid JSON');
    }
    lists = parseTikTokJson(parsed, jsonName);
  } else {
    const followerName = fileNames.find(n => TIKTOK_TXT_FOLLOWER_RE.test(n));
    const followingName = fileNames.find(n => TIKTOK_TXT_FOLLOWING_RE.test(n));
    const missing: string[] = [];
    if (!followerName) missing.push('Follower.txt');
    if (!followingName) missing.push('Following.txt');
    if (missing.length === 2) throw new MissingFilesError(missing, 'tiktok');
    lists = {
      followers: followerName ? parseTikTokTxt(await zip.files[followerName]!.async('string')) : [],
      following: followingName ? parseTikTokTxt(await zip.files[followingName]!.async('string')) : [],
    };
  }

  return {
    exportedAt: filenameDate ?? Math.floor(Date.now() / 1000),
    followers: lists.followers,
    following: lists.following,
    format: 'json',
    platform: 'tiktok',
  };
}
