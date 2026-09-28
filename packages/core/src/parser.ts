// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import JSZip from 'jszip';
import {
  FileReadError,
  InvalidZipError,
  MissingFilesError,
  MixedFormatError,
  SchemaValidationError,
} from './errors.js';
import {
  followersFileSchema,
  followingFileSchema,
  labelValuesFileSchema,
  threadsFollowersFileSchema,
  threadsFollowingFileSchema,
  threadsRecentlyUnfollowedFileSchema,
  type Account,
  type Platform,
  type ParsedSnapshot,
  type RelationshipEntry,
  type LabelValuesEntry,
} from './schemas.js';

// ─── JSON helpers ─────────────────────────────────────────────────────────────

// Both JSON account-builders below read an `href`/`URL` field straight out of
// the uploaded export file, and the app renders it as a clickable <a href>
// (dashboard/results/triage link-outs). A crafted or corrupted export could
// put a `javascript:`/`data:` URL there instead of a real profile link;
// clicking it would then execute in the page origin, with access to this
// user's own IndexedDB follower history. Constrain every href to a real
// instagram.com profile URL, falling back to one built from the username
// otherwise — mirrors the strict IG_LINK_RE regex already used on the
// HTML-export path below, which only ever matches instagram.com hrefs.
// Threads exports get the same treatment against threads.com (and the older
// threads.net domain).
function sanitizeIgHref(href: string | undefined, username: string): string {
  if (href && /^https:\/\/www\.instagram\.com\//i.test(href)) return href;
  return `https://www.instagram.com/${username}`;
}

function sanitizeThreadsHref(href: string | undefined, username: string): string {
  if (href && /^https:\/\/www\.threads\.(?:com|net)\//i.test(href)) return href;
  return `https://www.threads.com/${username}`;
}

function labelValuesToAccount(entry: LabelValuesEntry): Account | null {
  const get = (label: string) => entry.label_values.find(lv => lv.label === label)?.value ?? '';
  const username = get('Username');
  if (!username) return null;
  const url = get('URL');
  return {
    username,
    href: sanitizeIgHref(url, username),
    followedAt: entry.timestamp && entry.timestamp > 0 ? entry.timestamp : null,
  };
}

// Returns null for a placeholder entry with no string_list_data (a removed
// or deactivated account Instagram still lists but no longer has profile
// info for) — nothing usable to build an Account from.
function entryToAccount(entry: RelationshipEntry, platform: Platform = 'instagram'): Account | null {
  const item = entry.string_list_data[0];
  if (!item) return null;
  const username = item.value ?? entry.title ?? '';
  return {
    username,
    href: platform === 'threads' ? sanitizeThreadsHref(item.href, username) : sanitizeIgHref(item.href, username),
    followedAt: item.timestamp && item.timestamp > 0 ? item.timestamp : null,
  };
}

async function parseFollowersJson(zip: JSZip, fileNames: string[]): Promise<Account[]> {
  const accounts: Account[] = [];
  for (const fname of fileNames) {
    const raw = await zip.files[fname]!.async('string');
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new SchemaValidationError(fname, 'File is not valid JSON');
    }
    const result = followersFileSchema.safeParse(parsed);
    if (!result.success) {
      throw new SchemaValidationError(fname, result.error.issues[0]?.message ?? 'unknown');
    }
    accounts.push(...result.data.map(e => entryToAccount(e)).filter((a): a is Account => a !== null));
  }
  return accounts;
}

async function parseFollowingJson(zip: JSZip, fileName: string): Promise<Account[]> {
  const raw = await zip.files[fileName]!.async('string');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new SchemaValidationError(fileName, 'File is not valid JSON');
  }
  const result = followingFileSchema.safeParse(parsed);
  if (!result.success) {
    throw new SchemaValidationError(fileName, result.error.issues[0]?.message ?? 'unknown');
  }
  return result.data.relationships_following.map(e => entryToAccount(e)).filter((a): a is Account => a !== null);
}

// ─── Threads helpers ──────────────────────────────────────────────────────────

async function readJson(zip: JSZip, fileName: string): Promise<unknown> {
  const raw = await zip.files[fileName]!.async('string');
  try {
    return JSON.parse(raw);
  } catch {
    throw new SchemaValidationError(fileName, 'File is not valid JSON');
  }
}

async function parseThreadsFollowers(zip: JSZip, fileNames: string[]): Promise<Account[]> {
  const accounts: Account[] = [];
  for (const fname of fileNames) {
    const result = threadsFollowersFileSchema.safeParse(await readJson(zip, fname));
    if (!result.success) {
      throw new SchemaValidationError(fname, result.error.issues[0]?.message ?? 'unknown');
    }
    accounts.push(
      ...result.data.text_post_app_text_post_app_followers
        .map(e => entryToAccount(e, 'threads'))
        .filter((a): a is Account => a !== null),
    );
  }
  return accounts;
}

async function parseThreadsFollowing(zip: JSZip, fileName: string): Promise<Account[]> {
  const result = threadsFollowingFileSchema.safeParse(await readJson(zip, fileName));
  if (!result.success) {
    throw new SchemaValidationError(fileName, result.error.issues[0]?.message ?? 'unknown');
  }
  return result.data.text_post_app_text_post_app_following
    .map(e => entryToAccount(e, 'threads'))
    .filter((a): a is Account => a !== null);
}

// ─── HTML helpers ─────────────────────────────────────────────────────────────

// Instagram HTML exports contain anchor tags like:
//   <a href="https://www.instagram.com/username">username</a>
// We extract all such hrefs. Timestamps are unreliable in HTML exports → null.
// Handles both direct profile URLs and Meta's _u/ redirect prefix:
//   https://www.instagram.com/username
//   https://www.instagram.com/_u/username
const IG_LINK_RE = /href="(https:\/\/www\.instagram\.com\/(?:_u\/)?([^"/?#]+)[^"]*)"/gi;

function parseAccountsFromHtml(html: string): Account[] {
  const accounts: Account[] = [];
  let match: RegExpExecArray | null;
  IG_LINK_RE.lastIndex = 0;
  while ((match = IG_LINK_RE.exec(html)) !== null) {
    const href = match[1];
    const username = match[2];
    if (href && username) {
      accounts.push({ username, href, followedAt: null });
    }
  }
  return accounts;
}

async function parseFollowersHtml(zip: JSZip, fileNames: string[]): Promise<Account[]> {
  const accounts: Account[] = [];
  for (const fname of fileNames) {
    const html = await zip.files[fname]!.async('string');
    accounts.push(...parseAccountsFromHtml(html));
  }
  return accounts;
}

async function parseFollowingHtml(zip: JSZip, fileName: string): Promise<Account[]> {
  const html = await zip.files[fileName]!.async('string');
  return parseAccountsFromHtml(html);
}

// ─── Format detection ─────────────────────────────────────────────────────────

type Format = 'json' | 'html';

interface DetectedFiles {
  format: Format;
  followerFileNames: string[];
  followingFileName: string;
}

// A Meta export can hold Instagram data, Threads data (in a top-level
// `threads/` folder), or both. Threads uses some of the same filenames as
// Instagram (following.json, recently_unfollowed_profiles.json), so the
// Instagram patterns must never look inside a `threads/` folder, and vice versa.
const THREADS_DIR_RE = /(?:^|\/)threads\//i;

function isThreadsPath(name: string): boolean {
  return THREADS_DIR_RE.test(name);
}

interface DetectedThreadsFiles {
  followerFileNames: string[];
  followingFileName: string | undefined;
}

function detectThreadsFiles(fileNames: string[]): DetectedThreadsFiles {
  const inThreads = fileNames.filter(isThreadsPath);
  return {
    // One file today; accept a paginated followers_N.json too, in case Threads
    // splits large lists the way Instagram does.
    followerFileNames: inThreads.filter(n => /\/followers(?:_\d+)?\.json$/i.test(n)).sort(),
    followingFileName: inThreads.find(n => /\/following\.json$/i.test(n)),
  };
}

function hasInstagramRelationshipFiles(fileNames: string[]): boolean {
  return fileNames.some(n => /(?:followers_\d+|following)\.(?:json|html?)$/i.test(n));
}

function detectFiles(fileNames: string[]): DetectedFiles {
  const followerJson = fileNames.filter((n) => /followers_\d+\.json$/i.test(n)).sort();
  const followingJson = fileNames.find((n) => /following\.json$/i.test(n));

  const followerHtml = fileNames.filter((n) => /followers_\d+\.html?$/i.test(n)).sort();
  const followingHtml = fileNames.find((n) => /following\.html?$/i.test(n));

  const hasJson = followerJson.length > 0 || !!followingJson;
  const hasHtml = followerHtml.length > 0 || !!followingHtml;

  if (hasJson && hasHtml) throw new MixedFormatError();

  if (hasHtml) {
    const missing: string[] = [];
    if (followerHtml.length === 0) missing.push('followers_1.html');
    if (!followingHtml) missing.push('following.html');
    if (missing.length > 0) throw new MissingFilesError(missing);
    return { format: 'html', followerFileNames: followerHtml, followingFileName: followingHtml! };
  }

  // Default: JSON (or neither — will throw below)
  const missing: string[] = [];
  if (followerJson.length === 0) missing.push('followers_1.json');
  if (!followingJson) missing.push('following.json');
  if (missing.length > 0) throw new MissingFilesError(missing);

  return { format: 'json', followerFileNames: followerJson, followingFileName: followingJson! };
}

// ─── Filename-based export date ────────────────────────────────────────────

// Neither the JSON nor HTML export payload records when Instagram generated
// the ZIP, but the filename usually does: "instagram-username-2026-08-31-
// L6iOOC8w.zip" (current format) or an older "username_20260831.zip" style.
// Falls back to null (caller uses "now") when nothing plausible is found.
export function extractExportDateFromFilename(filename: string): number | null {
  const candidates: [string, string, string][] = [];
  for (const m of filename.matchAll(/(\d{4})-(\d{2})-(\d{2})/g)) {
    candidates.push([m[1]!, m[2]!, m[3]!]);
  }
  for (const m of filename.matchAll(/(\d{4})(\d{2})(\d{2})/g)) {
    candidates.push([m[1]!, m[2]!, m[3]!]);
  }

  const now = Date.now();
  for (const [y, mo, d] of candidates) {
    const year = Number(y);
    const month = Number(mo);
    const day = Number(d);
    if (year < 2010 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) continue;
    // Noon UTC keeps the date from shifting a day depending on local timezone.
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) continue;
    if (date.getTime() > now) continue; // never trust a future date
    return Math.floor(date.getTime() / 1000);
  }
  return null;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface ParseExportResult {
  snapshot: ParsedSnapshot;
  // Platforms whose data was also in the ZIP but not parsed (today: Threads
  // data inside an export that also has Instagram data).
  skippedPlatforms: Platform[];
}

// Kept for callers that only need the snapshot.
export async function parseInstagramZip(zipFile: File | Blob | ArrayBuffer): Promise<ParsedSnapshot> {
  return (await parseExportZip(zipFile)).snapshot;
}

// Parses a Meta "Download your information" ZIP from Instagram or Threads,
// detecting which one it is from the folder layout.
export async function parseExportZip(zipFile: File | Blob | ArrayBuffer): Promise<ParseExportResult> {
  const filenameDate = zipFile instanceof File ? extractExportDateFromFilename(zipFile.name) : null;

  // Normalize File/Blob → ArrayBuffer so jszip works consistently across envs.
  // On mobile Safari, .arrayBuffer() throws NotReadableError near-instantly for
  // a stale File reference or an iCloud file that hasn't finished downloading
  // to the device. That's a distinct failure from a corrupt/invalid ZIP.
  let input: ArrayBuffer;
  if (zipFile instanceof ArrayBuffer) {
    input = zipFile;
  } else {
    try {
      input = await (zipFile as Blob).arrayBuffer();
    } catch (err) {
      throw new FileReadError(err);
    }
  }

  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(input);
  } catch (err) {
    throw new InvalidZipError(err);
  }

  const allFileNames = Object.keys(zip.files);

  const instagramFileNames = allFileNames.filter(n => !isThreadsPath(n));
  const threadsFiles = detectThreadsFiles(allFileNames);
  const hasThreads = threadsFiles.followerFileNames.length > 0 || !!threadsFiles.followingFileName;

  // Instagram wins when both are present; the caller is told Threads was
  // skipped so it can ask the user to export Threads on its own.
  if (hasThreads && !hasInstagramRelationshipFiles(instagramFileNames)) {
    const snapshot = await parseThreads(zip, allFileNames, threadsFiles, filenameDate);
    return { snapshot, skippedPlatforms: [] };
  }

  const fileNames = instagramFileNames;
  const { format, followerFileNames, followingFileName } = detectFiles(fileNames);

  let followers: Account[];
  let following: Account[];

  if (format === 'html') {
    followers = await parseFollowersHtml(zip, followerFileNames);
    following = await parseFollowingHtml(zip, followingFileName);
  } else {
    followers = await parseFollowersJson(zip, followerFileNames);
    following = await parseFollowingJson(zip, followingFileName);
  }

  // Optional extras — gracefully skip if not present in this export
  const pendingRequests = await parseOptionalRelationships(
    zip, fileNames,
    /pending_follow_requests\.json$/i,
    (data) => {
      const r = labelValuesFileSchema.safeParse(data);
      if (!r.success) return null;
      return r.data.map(labelValuesToAccount).filter((a): a is Account => a !== null);
    },
  );

  const recentlyUnfollowed = await parseOptionalRelationships(
    zip, fileNames,
    /recently_unfollowed_profiles\.json$/i,
    (data) => {
      const r = labelValuesFileSchema.safeParse(data);
      if (!r.success) return null;
      return r.data.map(labelValuesToAccount).filter((a): a is Account => a !== null);
    },
  );

  return {
    snapshot: {
      exportedAt: filenameDate ?? Math.floor(Date.now() / 1000),
      followers,
      following,
      ...(pendingRequests ? { pendingRequests } : {}),
      ...(recentlyUnfollowed ? { recentlyUnfollowed } : {}),
      format,
      platform: 'instagram',
    },
    skippedPlatforms: hasThreads ? ['threads'] : [],
  };
}

async function parseThreads(
  zip: JSZip,
  allFileNames: string[],
  files: DetectedThreadsFiles,
  filenameDate: number | null,
): Promise<ParsedSnapshot> {
  const missing: string[] = [];
  if (files.followerFileNames.length === 0) missing.push('threads/followers.json');
  if (!files.followingFileName) missing.push('threads/following.json');
  if (missing.length > 0) throw new MissingFilesError(missing, 'threads');

  const followers = await parseThreadsFollowers(zip, files.followerFileNames);
  const following = await parseThreadsFollowing(zip, files.followingFileName!);

  // Threads' "follow requests you've received" is the opposite direction of
  // Instagram's pendingRequests (requests *you* sent), so it's not mapped.
  const recentlyUnfollowed = await parseOptionalRelationships(
    zip, allFileNames.filter(isThreadsPath),
    /\/recently_unfollowed_profiles\.json$/i,
    (data) => {
      const r = threadsRecentlyUnfollowedFileSchema.safeParse(data);
      if (!r.success) return null;
      return r.data.text_post_app_text_post_app_unfollowed_users
        .map(e => entryToAccount(e, 'threads'))
        .filter((a): a is Account => a !== null);
    },
  );

  return {
    exportedAt: filenameDate ?? Math.floor(Date.now() / 1000),
    followers,
    following,
    ...(recentlyUnfollowed ? { recentlyUnfollowed } : {}),
    format: 'json',
    platform: 'threads',
  };
}

async function parseOptionalRelationships(
  zip: JSZip,
  fileNames: string[],
  pattern: RegExp,
  parse: (data: unknown) => Account[] | null,
): Promise<Account[] | null> {
  const fname = fileNames.find(n => pattern.test(n));
  if (!fname) return null;
  try {
    const raw = await zip.files[fname]!.async('string');
    return parse(JSON.parse(raw));
  } catch {
    return null;
  }
}