"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ARCHETYPE_IDS: () => ARCHETYPE_IDS,
  FileReadError: () => FileReadError,
  InvalidZipError: () => InvalidZipError,
  MissingFilesError: () => MissingFilesError,
  MixedFormatError: () => MixedFormatError,
  PACE_PER_DAY: () => PACE_PER_DAY,
  SUB_BATCH: () => SUB_BATCH,
  SchemaValidationError: () => SchemaValidationError,
  TIKTOK_LIST_CAP: () => TIKTOK_LIST_CAP,
  analyzeSnapshot: () => analyzeSnapshot,
  buildPlan: () => buildPlan,
  compareSnapshots: () => compareSnapshots,
  contactMessageSchema: () => contactMessageSchema,
  contactSources: () => contactSources,
  daysAtEachPace: () => daysAtEachPace,
  detectDeltaExport: () => detectDeltaExport,
  eligibleArchetypes: () => eligibleArchetypes,
  emailOptInSchema: () => emailOptInSchema,
  emailOptInSources: () => emailOptInSources,
  feedbackSchema: () => feedbackSchema,
  feedbackSentiments: () => feedbackSentiments,
  findGhostFollowers: () => findGhostFollowers,
  growthTimeline: () => growthTimeline,
  hashSeed: () => hashSeed,
  parseExportZip: () => parseExportZip,
  parseInstagramZip: () => parseInstagramZip,
  pickVerdict: () => pickVerdict,
  planProgress: () => planProgress,
  plannerCadences: () => plannerCadences,
  plannerSyncSchema: () => plannerSyncSchema,
  platformSchema: () => platformSchema,
  platforms: () => platforms,
  runHealthChecks: () => runHealthChecks,
  snapshotPlatform: () => snapshotPlatform,
  tiktokHref: () => tiktokHref,
  tiktokListNearCap: () => tiktokListNearCap,
  verdictStats: () => verdictStats
});
module.exports = __toCommonJS(index_exports);

// src/parser.ts
var import_jszip = __toESM(require("jszip"), 1);

// src/errors.ts
var FileReadError = class extends Error {
  code = "FILE_READ";
  constructor(cause) {
    super(
      "Your browser could not read this file. If it is synced via iCloud, Google Drive, or another cloud service, make sure it has fully downloaded to your device, then try again."
    );
    this.name = "FileReadError";
    if (cause instanceof Error) this.cause = cause;
  }
};
var InvalidZipError = class extends Error {
  code = "INVALID_ZIP";
  constructor(cause) {
    super("The file you uploaded is not a valid ZIP archive. Please try downloading it again from Instagram.");
    this.name = "InvalidZipError";
    if (cause instanceof Error) this.cause = cause;
  }
};
var MissingFilesError = class extends Error {
  code = "MISSING_FILES";
  platform;
  shape;
  constructor(missing, platform = "instagram") {
    super(
      platform === "tiktok" ? `Your TikTok export is missing the follower lists: ${missing.join(", ")}. Make sure "Activity" (or "All data") was included when requesting your data.` : `Your ${platform === "threads" ? "Threads" : "Instagram"} export is missing required files: ${missing.join(", ")}. Make sure you selected "Followers and Following" when requesting your data, and that you chose JSON format.`
    );
    this.name = "MissingFilesError";
    this.platform = platform;
  }
};
var MixedFormatError = class extends Error {
  code = "MIXED_FORMAT";
  constructor() {
    super(
      "Your export contains a mix of JSON and HTML files. Please re-download your Instagram data and choose a single format (JSON recommended)."
    );
    this.name = "MixedFormatError";
  }
};
var SchemaValidationError = class extends Error {
  code = "SCHEMA_VALIDATION";
  // Closed-set reason for analytics (never the file name or raw detail).
  reason;
  constructor(filename, detail) {
    super(
      `The file "${filename}" in your export has an unexpected format. Instagram may have changed their export structure. Detail: ${detail}`
    );
    this.name = "SchemaValidationError";
    this.reason = detail === "File is not valid JSON" ? "not_json" : "shape_mismatch";
  }
};

// src/schemas.ts
var import_zod = require("zod");
var stringListItemSchema = import_zod.z.object({
  // Tolerant on purpose: a missing href or timestamp key used to fail the whole
  // file. The parser rebuilds the profile link from the username instead.
  href: import_zod.z.string().nullish(),
  value: import_zod.z.string().nullish(),
  // Real exports have shown `null` here (in addition to the documented `0`)
  // for accounts with no recorded follow time — see entryToAccount in parser.ts.
  timestamp: import_zod.z.number().nullish()
});
var relationshipEntrySchema = import_zod.z.object({
  title: import_zod.z.string().nullish(),
  media_list_data: import_zod.z.array(import_zod.z.unknown()).optional(),
  // A strict tuple-of-exactly-1 used to be required here, but a real Instagram
  // export can contain a zero-length string_list_data for an account Instagram
  // has since removed/deactivated (no resolvable profile info left) — that
  // used to fail the *entire* file's validation over one placeholder entry.
  // Accept 0 or 1 items; parser.ts's entryToAccount skips the empty ones.
  // Missing key treated like an empty list; extra items are ignored (first wins).
  string_list_data: import_zod.z.array(stringListItemSchema).default([])
}).refine((e) => e.title != null || e.string_list_data.length > 0, {
  // An entry with neither a title nor any data is a different structure
  // entirely, not a placeholder. Fail loudly instead of parsing to nothing.
  message: "Entry has no title and no string_list_data"
});
var followersFileSchema = import_zod.z.array(relationshipEntrySchema);
var followingFileSchema = import_zod.z.object({
  relationships_following: import_zod.z.array(relationshipEntrySchema)
});
var threadsFollowersFileSchema = import_zod.z.object({
  text_post_app_text_post_app_followers: import_zod.z.array(relationshipEntrySchema)
});
var threadsFollowingFileSchema = import_zod.z.object({
  text_post_app_text_post_app_following: import_zod.z.array(relationshipEntrySchema)
});
var threadsRecentlyUnfollowedFileSchema = import_zod.z.object({
  text_post_app_text_post_app_unfollowed_users: import_zod.z.array(relationshipEntrySchema)
});
var platforms = ["instagram", "threads", "tiktok"];
var platformSchema = import_zod.z.enum(platforms);
var accountSchema = import_zod.z.object({
  username: import_zod.z.string(),
  href: import_zod.z.string(),
  followedAt: import_zod.z.number().nullable()
});
var labelValuesEntrySchema = import_zod.z.object({
  timestamp: import_zod.z.number().optional(),
  label_values: import_zod.z.array(import_zod.z.object({ label: import_zod.z.string(), value: import_zod.z.string() })),
  fbid: import_zod.z.string().optional()
});
var labelValuesFileSchema = import_zod.z.array(labelValuesEntrySchema);
var pendingRequestsFileSchema = import_zod.z.object({
  relationships_follow_requests_sent: import_zod.z.array(relationshipEntrySchema)
});
var recentlyUnfollowedFileSchema = import_zod.z.object({
  relationships_unfollowed_users: import_zod.z.array(relationshipEntrySchema)
});
var parsedSnapshotSchema = import_zod.z.object({
  exportedAt: import_zod.z.number(),
  followers: import_zod.z.array(accountSchema),
  following: import_zod.z.array(accountSchema),
  pendingRequests: import_zod.z.array(accountSchema).optional(),
  recentlyUnfollowed: import_zod.z.array(accountSchema).optional(),
  // Which export format this snapshot was parsed from. HTML exports don't
  // include follow timestamps, so the UI can use this to explain why some
  // data (follow age, growth trends) may be missing. Optional so older
  // snapshots already saved in a user's IndexedDB (from before this field
  // existed) still validate.
  format: import_zod.z.enum(["json", "html"]).optional(),
  // Which app the export came from. Optional for the same reason as `format`:
  // snapshots saved before Threads support existed have no value and are
  // always Instagram. Read it through snapshotPlatform(), never directly.
  platform: platformSchema.optional()
});
function snapshotPlatform(snapshot) {
  return snapshot.platform ?? "instagram";
}
var feedbackSentiments = ["angry", "sad", "neutral", "happy", "delighted"];
var feedbackSchema = import_zod.z.object({
  sentiment: import_zod.z.enum(feedbackSentiments),
  reason: import_zod.z.string().trim().max(200).optional(),
  comment: import_zod.z.string().trim().max(1e3).optional(),
  page: import_zod.z.string().trim().max(200)
});
var contactSources = ["contact_page", "homepage_widget"];
var contactMessageSchema = import_zod.z.object({
  name: import_zod.z.string().trim().max(120).optional(),
  // Optional here: the homepage widget allows an anonymous note with no
  // reply expected. The /contact page's own form makes it required in its
  // client-side validation before the request is even sent.
  email: import_zod.z.string().trim().toLowerCase().email().max(320).optional(),
  message: import_zod.z.string().trim().min(1).max(2e3),
  topic: import_zod.z.string().trim().max(60).optional(),
  source: import_zod.z.enum(contactSources),
  page: import_zod.z.string().trim().max(200).optional()
});
var emailOptInSources = [
  "results",
  "snapshot-limit",
  "reveal",
  "welcome",
  "creator-ai-waitlist"
];
var emailOptInSchema = import_zod.z.object({
  email: import_zod.z.string().trim().toLowerCase().email().max(320),
  source: import_zod.z.enum(emailOptInSources),
  locale: import_zod.z.enum(["en", "es", "pt"]).optional(),
  // Must be an explicit true from the form, never inferred.
  consent: import_zod.z.literal(true)
});
var plannerCadences = ["weekly", "daily", "off"];
var plannerSyncSchema = import_zod.z.object({
  platform: platformSchema,
  total: import_zod.z.number().int().min(0).max(1e5),
  done: import_zod.z.number().int().min(0).max(1e5),
  perDay: import_zod.z.number().int().min(1).max(500),
  cadence: import_zod.z.enum(plannerCadences),
  locale: import_zod.z.enum(["en", "es", "pt"]).optional()
}).refine((v) => v.done <= v.total, { message: "done exceeds total" });

// src/tiktok.ts
var FOLLOWER_LIST_KEYS = ["fanslist", "followerlist", "followers", "follower"];
var FOLLOWING_LIST_KEYS = ["following", "followinglist"];
var USERNAME_KEYS = ["username", "uniqueid", "user_name"];
var DATE_KEYS = ["date", "time", "createtime"];
var TIKTOK_USERNAME_RE = /^[A-Za-z0-9._]{1,64}$/;
var TIKTOK_JSON_RE = /(?:^|\/)user_data(?:_tiktok)?\.json$/i;
var TIKTOK_TXT_FOLLOWER_RE = /(?:^|\/)(?:follower|followers|fans)(?:[ _]list)?\.txt$/i;
var TIKTOK_TXT_FOLLOWING_RE = /(?:^|\/)following(?:[ _]list)?\.txt$/i;
function tiktokHref(username) {
  return `https://www.tiktok.com/@${username}`;
}
function cleanUsername(raw) {
  if (typeof raw !== "string") return null;
  const u = raw.trim().replace(/^@/, "");
  return TIKTOK_USERNAME_RE.test(u) ? u : null;
}
function parseTikTokDate(raw) {
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) {
    return Math.floor(raw > 1e12 ? raw / 1e3 : raw);
  }
  if (typeof raw !== "string" || !raw.trim()) return null;
  const s = raw.trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/.exec(s);
  if (m) {
    const ms2 = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] ?? 0));
    return Number.isFinite(ms2) && ms2 > 0 ? Math.floor(ms2 / 1e3) : null;
  }
  const ms = Date.parse(s);
  return Number.isFinite(ms) && ms > 0 ? Math.floor(ms / 1e3) : null;
}
function pick(obj, keys) {
  for (const [k, v] of Object.entries(obj)) {
    if (keys.includes(k.toLowerCase().replace(/[\s_-]/g, ""))) return v;
  }
  return void 0;
}
function toAccount(item) {
  if (!item || typeof item !== "object") return null;
  const rec = item;
  const username = cleanUsername(pick(rec, USERNAME_KEYS));
  if (!username) return null;
  return { username, href: tiktokHref(username), followedAt: parseTikTokDate(pick(rec, DATE_KEYS)) };
}
function isAccountArray(v) {
  if (!Array.isArray(v)) return false;
  if (v.length === 0) return true;
  const first = v[0];
  return !!first && typeof first === "object" && pick(first, USERNAME_KEYS) !== void 0;
}
function findList(node, keys, depth = 0) {
  if (!node || typeof node !== "object" || depth > 6) return null;
  if (Array.isArray(node)) return null;
  for (const [k, v] of Object.entries(node)) {
    const norm = k.toLowerCase().replace(/[\s_-]/g, "");
    if (keys.includes(norm) && isAccountArray(v)) return v;
  }
  for (const v of Object.values(node)) {
    const found = findList(v, keys, depth + 1);
    if (found) return found;
  }
  return null;
}
function dedupe(accounts) {
  const seen = /* @__PURE__ */ new Set();
  return accounts.filter((a) => {
    const key = a.username.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function parseTikTokJson(data, fileName = "user_data_tiktok.json") {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new SchemaValidationError(fileName, "Expected a JSON object");
  }
  const followerList = findList(data, FOLLOWER_LIST_KEYS);
  const followingList = findList(data, FOLLOWING_LIST_KEYS);
  if (!followerList && !followingList) {
    throw new MissingFilesError(["Follower", "Following"], "tiktok");
  }
  const map = (list) => dedupe((list ?? []).map(toAccount).filter((a) => a !== null));
  return { followers: map(followerList), following: map(followingList) };
}
function parseTikTokTxt(text) {
  const accounts = [];
  for (const block of text.replace(/\r\n?/g, "\n").split(/\n\s*\n/)) {
    const rec = {};
    for (const line of block.split("\n")) {
      const i = line.indexOf(":");
      if (i <= 0) continue;
      rec[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    const a = toAccount(rec);
    if (a) accounts.push(a);
  }
  return dedupe(accounts);
}
function hasTikTokFiles(fileNames) {
  return fileNames.some((n) => TIKTOK_JSON_RE.test(n) || TIKTOK_TXT_FOLLOWER_RE.test(n) || TIKTOK_TXT_FOLLOWING_RE.test(n));
}
var TIKTOK_LIST_CAP = 1e4;
function tiktokListNearCap(snapshot) {
  return snapshot.followers.length >= TIKTOK_LIST_CAP * 0.98 || snapshot.following.length >= TIKTOK_LIST_CAP * 0.98;
}
async function parseTikTokZip(zip, fileNames, filenameDate) {
  const jsonName = fileNames.find((n) => TIKTOK_JSON_RE.test(n));
  let lists;
  if (jsonName) {
    const raw = await zip.files[jsonName].async("string");
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new SchemaValidationError(jsonName, "File is not valid JSON");
    }
    lists = parseTikTokJson(parsed, jsonName);
  } else {
    const followerName = fileNames.find((n) => TIKTOK_TXT_FOLLOWER_RE.test(n));
    const followingName = fileNames.find((n) => TIKTOK_TXT_FOLLOWING_RE.test(n));
    const missing = [];
    if (!followerName) missing.push("Follower.txt");
    if (!followingName) missing.push("Following.txt");
    if (missing.length === 2) throw new MissingFilesError(missing, "tiktok");
    lists = {
      followers: followerName ? parseTikTokTxt(await zip.files[followerName].async("string")) : [],
      following: followingName ? parseTikTokTxt(await zip.files[followingName].async("string")) : []
    };
  }
  return {
    exportedAt: filenameDate ?? Math.floor(Date.now() / 1e3),
    followers: lists.followers,
    following: lists.following,
    format: "json",
    platform: "tiktok"
  };
}

// src/parser.ts
function sanitizeIgHref(href, username) {
  if (href && /^https:\/\/www\.instagram\.com\//i.test(href)) return href;
  return `https://www.instagram.com/${username}`;
}
function sanitizeThreadsHref(href, username) {
  if (href && /^https:\/\/www\.threads\.(?:com|net)\//i.test(href)) return href;
  return `https://www.threads.com/${username}`;
}
function labelValuesToAccount(entry) {
  const get = (label) => entry.label_values.find((lv) => lv.label === label)?.value ?? "";
  const username = get("Username");
  if (!username) return null;
  const url = get("URL");
  return {
    username,
    href: sanitizeIgHref(url, username),
    followedAt: entry.timestamp && entry.timestamp > 0 ? entry.timestamp : null
  };
}
function entryToAccount(entry, platform = "instagram") {
  const item = entry.string_list_data[0];
  if (!item) return null;
  const username = item.value ?? entry.title ?? "";
  if (!username) return null;
  const href = item.href ?? "";
  return {
    username,
    href: platform === "threads" ? sanitizeThreadsHref(href, username) : sanitizeIgHref(href, username),
    followedAt: item.timestamp && item.timestamp > 0 ? item.timestamp : null
  };
}
async function parseFollowersJson(zip, fileNames) {
  const accounts = [];
  for (const fname of fileNames) {
    const raw = await zip.files[fname].async("string");
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new SchemaValidationError(fname, "File is not valid JSON");
    }
    const result = followersFileSchema.safeParse(parsed);
    if (!result.success) {
      throw new SchemaValidationError(fname, result.error.issues[0]?.message ?? "unknown");
    }
    accounts.push(...result.data.map((e) => entryToAccount(e)).filter((a) => a !== null));
  }
  return accounts;
}
async function parseFollowingJson(zip, fileName) {
  const raw = await zip.files[fileName].async("string");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new SchemaValidationError(fileName, "File is not valid JSON");
  }
  const result = followingFileSchema.safeParse(parsed);
  if (!result.success) {
    throw new SchemaValidationError(fileName, result.error.issues[0]?.message ?? "unknown");
  }
  return result.data.relationships_following.map((e) => entryToAccount(e)).filter((a) => a !== null);
}
async function readJson(zip, fileName) {
  const raw = await zip.files[fileName].async("string");
  try {
    return JSON.parse(raw);
  } catch {
    throw new SchemaValidationError(fileName, "File is not valid JSON");
  }
}
async function parseThreadsFollowers(zip, fileNames) {
  const accounts = [];
  for (const fname of fileNames) {
    const result = threadsFollowersFileSchema.safeParse(await readJson(zip, fname));
    if (!result.success) {
      throw new SchemaValidationError(fname, result.error.issues[0]?.message ?? "unknown");
    }
    accounts.push(
      ...result.data.text_post_app_text_post_app_followers.map((e) => entryToAccount(e, "threads")).filter((a) => a !== null)
    );
  }
  return accounts;
}
async function parseThreadsFollowing(zip, fileName) {
  const result = threadsFollowingFileSchema.safeParse(await readJson(zip, fileName));
  if (!result.success) {
    throw new SchemaValidationError(fileName, result.error.issues[0]?.message ?? "unknown");
  }
  return result.data.text_post_app_text_post_app_following.map((e) => entryToAccount(e, "threads")).filter((a) => a !== null);
}
var IG_LINK_RE = /href="(https:\/\/www\.instagram\.com\/(?:_u\/)?([^"/?#]+)[^"]*)"/gi;
var HTML_DATE_AFTER_LINK_RE = /^[^>]*>[^<]*<\/a>\s*<\/div>\s*<div>\s*([A-Za-z]{3})[a-z]*\.? (\d{1,2}), (\d{4}),? (\d{1,2}):(\d{2})\s*([ap]m)?\s*<\/div>/i;
var MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
function parseHtmlDateAfterLink(html, from) {
  const m = HTML_DATE_AFTER_LINK_RE.exec(html.slice(from, from + 300));
  if (!m) return null;
  const month = MONTHS.indexOf(m[1].toLowerCase());
  if (month < 0) return null;
  let hour = Number(m[4]);
  const ampm = m[6]?.toLowerCase();
  if (ampm === "pm" && hour < 12) hour += 12;
  if (ampm === "am" && hour === 12) hour = 0;
  const ms = Date.UTC(Number(m[3]), month, Number(m[2]), hour, Number(m[5]));
  return Number.isFinite(ms) && ms > 0 ? Math.floor(ms / 1e3) : null;
}
function extractHtmlGeneratedAt(html) {
  const m = /<time datetime="(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?Z)"/i.exec(html);
  if (!m) return null;
  const ms = Date.parse(m[1]);
  return Number.isFinite(ms) && ms > 0 && ms <= Date.now() ? Math.floor(ms / 1e3) : null;
}
function parseAccountsFromHtml(html) {
  const accounts = [];
  let match;
  IG_LINK_RE.lastIndex = 0;
  while ((match = IG_LINK_RE.exec(html)) !== null) {
    const href = match[1];
    const username = match[2];
    if (href && username) {
      accounts.push({ username, href, followedAt: parseHtmlDateAfterLink(html, IG_LINK_RE.lastIndex) });
    }
  }
  return accounts;
}
async function parseFollowersHtml(zip, fileNames) {
  const accounts = [];
  for (const fname of fileNames) {
    const html = await zip.files[fname].async("string");
    accounts.push(...parseAccountsFromHtml(html));
  }
  return accounts;
}
var THREADS_DIR_RE = /(?:^|\/)threads\//i;
function isThreadsPath(name) {
  return THREADS_DIR_RE.test(name);
}
function detectThreadsFiles(fileNames) {
  const inThreads = fileNames.filter(isThreadsPath);
  return {
    // One file today; accept a paginated followers_N.json too, in case Threads
    // splits large lists the way Instagram does.
    followerFileNames: inThreads.filter((n) => /\/followers(?:_\d+)?\.json$/i.test(n)).sort(),
    followingFileName: inThreads.find((n) => /\/following\.json$/i.test(n))
  };
}
function hasInstagramRelationshipFiles(fileNames) {
  return fileNames.some((n) => /(?:followers_\d+|following)\.(?:json|html?)$/i.test(n));
}
function detectFiles(fileNames) {
  const followerJson = fileNames.filter((n) => /followers_\d+\.json$/i.test(n)).sort();
  const followingJson = fileNames.find((n) => /following\.json$/i.test(n));
  const followerHtml = fileNames.filter((n) => /followers_\d+\.html?$/i.test(n)).sort();
  const followingHtml = fileNames.find((n) => /following\.html?$/i.test(n));
  const hasJson = followerJson.length > 0 || !!followingJson;
  const hasHtml = followerHtml.length > 0 || !!followingHtml;
  if (hasJson && hasHtml) throw new MixedFormatError();
  if (hasHtml) {
    const missing2 = [];
    if (followerHtml.length === 0) missing2.push("followers_1.html");
    if (!followingHtml) missing2.push("following.html");
    if (missing2.length > 0) throw new MissingFilesError(missing2);
    return { format: "html", followerFileNames: followerHtml, followingFileName: followingHtml };
  }
  const missing = [];
  if (followerJson.length === 0) missing.push("followers_1.json");
  if (!followingJson) missing.push("following.json");
  if (missing.length > 0) throw new MissingFilesError(missing);
  return { format: "json", followerFileNames: followerJson, followingFileName: followingJson };
}
function extractExportDateFromFilename(filename) {
  const candidates = [];
  for (const re of [/(\d{4})-(\d{2})-(\d{2})/g, /(\d{4})(\d{2})(\d{2})/g]) {
    let m;
    while ((m = re.exec(filename)) !== null) candidates.push([m[1], m[2], m[3]]);
  }
  const now = Date.now();
  for (const [y, mo, d] of candidates) {
    const year = Number(y);
    const month = Number(mo);
    const day = Number(d);
    if (year < 2010 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) continue;
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) continue;
    if (date.getTime() > now) continue;
    return Math.floor(date.getTime() / 1e3);
  }
  return null;
}
async function parseInstagramZip(zipFile) {
  return (await parseExportZip(zipFile)).snapshot;
}
async function parseExportZip(zipFile) {
  let filenameDate = null;
  try {
    filenameDate = zipFile instanceof File ? extractExportDateFromFilename(zipFile.name) : null;
  } catch {
    filenameDate = null;
  }
  let input;
  if (zipFile instanceof ArrayBuffer) {
    input = zipFile;
  } else {
    try {
      input = await zipFile.arrayBuffer();
    } catch (err) {
      throw new FileReadError(err);
    }
  }
  if (looksLikeJson(input)) return { snapshot: parseBareTikTokJson(input, filenameDate), skippedPlatforms: [] };
  let zip;
  try {
    zip = await import_jszip.default.loadAsync(input);
  } catch (err) {
    throw new InvalidZipError(err);
  }
  const allFileNames = Object.keys(zip.files);
  try {
    return await parseZipContents(zip, allFileNames, filenameDate);
  } catch (err) {
    if (err instanceof MissingFilesError) err.shape = zipShape(allFileNames);
    throw err;
  }
}
function zipShape(allFileNames) {
  const files = allFileNames.filter((n) => !n.endsWith("/"));
  return {
    fileCount: files.length,
    hasConnectionsFolder: allFileNames.some((n) => /(?:^|\/)connections\//i.test(n)),
    hasMediaFolder: allFileNames.some((n) => /(?:^|\/)media\//i.test(n)),
    hasThreadsFolder: allFileNames.some(isThreadsPath),
    hasHtmlFiles: files.some((n) => /\.html?$/i.test(n)),
    hasTikTokFiles: hasTikTokFiles(files)
  };
}
async function parseZipContents(zip, allFileNames, filenameDate) {
  const instagramFileNames = allFileNames.filter((n) => !isThreadsPath(n));
  if (hasTikTokFiles(allFileNames) && !hasInstagramRelationshipFiles(instagramFileNames) && !allFileNames.some(isThreadsPath)) {
    return { snapshot: await parseTikTokZip(zip, allFileNames, filenameDate), skippedPlatforms: [] };
  }
  const threadsFiles = detectThreadsFiles(allFileNames);
  const hasThreads = threadsFiles.followerFileNames.length > 0 || !!threadsFiles.followingFileName;
  if (hasThreads && !hasInstagramRelationshipFiles(instagramFileNames)) {
    const snapshot = await parseThreads(zip, allFileNames, threadsFiles, filenameDate);
    return { snapshot, skippedPlatforms: [] };
  }
  if (!hasInstagramRelationshipFiles(instagramFileNames) && allFileNames.some(isThreadsPath)) {
    throw new MissingFilesError(["threads/followers.json", "threads/following.json"], "threads");
  }
  const fileNames = instagramFileNames;
  const { format, followerFileNames, followingFileName } = detectFiles(fileNames);
  let followers;
  let following;
  let exportedAt = filenameDate;
  if (format === "html") {
    followers = await parseFollowersHtml(zip, followerFileNames);
    const followingHtml = await zip.files[followingFileName].async("string");
    following = parseAccountsFromHtml(followingHtml);
    exportedAt ??= extractHtmlGeneratedAt(followingHtml);
  } else {
    followers = await parseFollowersJson(zip, followerFileNames);
    following = await parseFollowingJson(zip, followingFileName);
  }
  const pendingRequests = await parseOptionalRelationships(
    zip,
    fileNames,
    /pending_follow_requests\.json$/i,
    (data) => {
      const r = labelValuesFileSchema.safeParse(data);
      if (!r.success) return null;
      return r.data.map(labelValuesToAccount).filter((a) => a !== null);
    }
  );
  const recentlyUnfollowed = await parseOptionalRelationships(
    zip,
    fileNames,
    /recently_unfollowed_profiles\.json$/i,
    (data) => {
      const r = labelValuesFileSchema.safeParse(data);
      if (!r.success) return null;
      return r.data.map(labelValuesToAccount).filter((a) => a !== null);
    }
  );
  return {
    snapshot: {
      exportedAt: exportedAt ?? Math.floor(Date.now() / 1e3),
      followers,
      following,
      ...pendingRequests ? { pendingRequests } : {},
      ...recentlyUnfollowed ? { recentlyUnfollowed } : {},
      format,
      platform: "instagram"
    },
    skippedPlatforms: hasThreads ? ["threads"] : []
  };
}
async function parseThreads(zip, allFileNames, files, filenameDate) {
  const missing = [];
  if (files.followerFileNames.length === 0) missing.push("threads/followers.json");
  if (!files.followingFileName) missing.push("threads/following.json");
  if (missing.length > 0) throw new MissingFilesError(missing, "threads");
  const followers = await parseThreadsFollowers(zip, files.followerFileNames);
  const following = await parseThreadsFollowing(zip, files.followingFileName);
  const recentlyUnfollowed = await parseOptionalRelationships(
    zip,
    allFileNames.filter(isThreadsPath),
    /\/recently_unfollowed_profiles\.json$/i,
    (data) => {
      const r = threadsRecentlyUnfollowedFileSchema.safeParse(data);
      if (!r.success) return null;
      return r.data.text_post_app_text_post_app_unfollowed_users.map((e) => entryToAccount(e, "threads")).filter((a) => a !== null);
    }
  );
  return {
    exportedAt: filenameDate ?? Math.floor(Date.now() / 1e3),
    followers,
    following,
    ...recentlyUnfollowed ? { recentlyUnfollowed } : {},
    format: "json",
    platform: "threads"
  };
}
async function parseOptionalRelationships(zip, fileNames, pattern, parse) {
  const fname = fileNames.find((n) => pattern.test(n));
  if (!fname) return null;
  try {
    const raw = await zip.files[fname].async("string");
    return parse(JSON.parse(raw));
  } catch {
    return null;
  }
}
function looksLikeJson(buf) {
  const head = new Uint8Array(buf, 0, Math.min(buf.byteLength, 64));
  for (const b of head) {
    if (b === 32 || b === 9 || b === 10 || b === 13 || b === 239 || b === 187 || b === 191) continue;
    return b === 123;
  }
  return false;
}
function parseBareTikTokJson(buf, filenameDate) {
  let data;
  try {
    data = JSON.parse(new TextDecoder("utf-8").decode(buf));
  } catch {
    throw new SchemaValidationError("user_data_tiktok.json", "File is not valid JSON");
  }
  const { followers, following } = parseTikTokJson(data);
  return {
    exportedAt: filenameDate ?? Math.floor(Date.now() / 1e3),
    followers,
    following,
    format: "json",
    platform: "tiktok"
  };
}

// src/delta.ts
var SMALL_COUNT_THRESHOLD = 50;
var RECENT_WINDOW_DAYS = 14;
var DROP_THRESHOLD = 0.8;
var DATE_RANGE_WINDOW_DAYS = 370;
var DATE_RANGE_MIN_FOLLOWERS = 20;
var DATE_RANGE_MIN_FOLLOWERS_THREADS = 50;
function detectDeltaExport(snapshot, previousSnapshot) {
  const reasons = [];
  const recentCutoff = snapshot.exportedAt - RECENT_WINDOW_DAYS * 86400;
  if (snapshotPlatform(snapshot) === "instagram" && snapshot.followers.length < SMALL_COUNT_THRESHOLD) {
    reasons.push("small_counts");
  }
  const withTimestamp = [
    ...snapshot.followers.filter((a) => a.followedAt !== null),
    ...snapshot.following.filter((a) => a.followedAt !== null)
  ];
  if (withTimestamp.length >= 3) {
    const allRecent = withTimestamp.every((a) => (a.followedAt ?? 0) >= recentCutoff);
    if (allRecent) reasons.push("all_recent_timestamps");
  }
  const datedFollowers = snapshot.followers.filter((a) => a.followedAt !== null);
  const minFollowers = snapshotPlatform(snapshot) === "threads" ? DATE_RANGE_MIN_FOLLOWERS_THREADS : DATE_RANGE_MIN_FOLLOWERS;
  if (!reasons.includes("all_recent_timestamps") && datedFollowers.length >= minFollowers && datedFollowers.length >= snapshot.followers.length * 0.9) {
    const oldest = datedFollowers.reduce((min, a) => Math.min(min, a.followedAt ?? Infinity), Infinity);
    if (snapshot.exportedAt - oldest <= DATE_RANGE_WINDOW_DAYS * 86400) {
      reasons.push("limited_date_range");
    }
  }
  if (previousSnapshot) {
    const prevCount = previousSnapshot.followers.length;
    const newCount = snapshot.followers.length;
    if (prevCount > 0 && newCount < prevCount * (1 - DROP_THRESHOLD)) {
      reasons.push("massive_count_drop");
    }
  }
  return { isDelta: reasons.length > 0, reasons };
}

// src/diff.ts
function byUsername(a, b) {
  return a.username.localeCompare(b.username);
}
function analyzeSnapshot(snapshot) {
  const followerSet = new Set(snapshot.followers.map((a) => a.username));
  const followingSet = new Set(snapshot.following.map((a) => a.username));
  const followerMap = new Map(snapshot.followers.map((a) => [a.username, a]));
  const followingMap = new Map(snapshot.following.map((a) => [a.username, a]));
  const nonFollowers = [];
  const mutuals = [];
  for (const username of followingSet) {
    if (!followerSet.has(username)) {
      nonFollowers.push(followingMap.get(username));
    } else {
      mutuals.push(followingMap.get(username));
    }
  }
  const fans = [];
  for (const username of followerSet) {
    if (!followingSet.has(username)) {
      fans.push(followerMap.get(username));
    }
  }
  const totalFollowers = snapshot.followers.length;
  const totalFollowing = snapshot.following.length;
  const ratio = totalFollowing === 0 ? 0 : totalFollowers / totalFollowing;
  return {
    nonFollowers: nonFollowers.sort(byUsername),
    fans: fans.sort(byUsername),
    mutuals: mutuals.sort(byUsername),
    totalFollowers,
    totalFollowing,
    ratio
  };
}
function compareSnapshots(old, current) {
  const oldFollowerSet = new Set(old.followers.map((a) => a.username));
  const currentFollowerSet = new Set(current.followers.map((a) => a.username));
  const oldFollowingSet = new Set(old.following.map((a) => a.username));
  const currentFollowingSet = new Set(current.following.map((a) => a.username));
  const currentFollowerMap = new Map(current.followers.map((a) => [a.username, a]));
  const oldFollowerMap = new Map(old.followers.map((a) => [a.username, a]));
  const currentFollowingMap = new Map(current.following.map((a) => [a.username, a]));
  const oldFollowingMap = new Map(old.following.map((a) => [a.username, a]));
  const newFollowers = [];
  for (const username of currentFollowerSet) {
    if (!oldFollowerSet.has(username)) {
      newFollowers.push(currentFollowerMap.get(username));
    }
  }
  const lostFollowers = [];
  for (const username of oldFollowerSet) {
    if (!currentFollowerSet.has(username)) {
      lostFollowers.push(oldFollowerMap.get(username));
    }
  }
  const newFollowing = [];
  for (const username of currentFollowingSet) {
    if (!oldFollowingSet.has(username)) {
      newFollowing.push(currentFollowingMap.get(username));
    }
  }
  const unfollowed = [];
  for (const username of oldFollowingSet) {
    if (!currentFollowingSet.has(username)) {
      unfollowed.push(oldFollowingMap.get(username));
    }
  }
  const periodDays = (current.exportedAt - old.exportedAt) / 86400;
  return {
    newFollowers: newFollowers.sort(byUsername),
    lostFollowers: lostFollowers.sort(byUsername),
    newFollowing: newFollowing.sort(byUsername),
    unfollowed: unfollowed.sort(byUsername),
    periodDays
  };
}
function findGhostFollowers(snapshot, options) {
  const minTenureDays = options?.minTenureDays ?? 180;
  const minTenureSeconds = minTenureDays * 86400;
  const followingSet = new Set(snapshot.following.map((a) => a.username));
  const now = Math.floor(Date.now() / 1e3);
  return snapshot.followers.filter((account) => {
    if (followingSet.has(account.username)) return false;
    if (account.followedAt === null) return false;
    return now - account.followedAt >= minTenureSeconds;
  }).sort(byUsername);
}

// src/tools/healthChecks.ts
var DAY = 86400;
var FOLLOWING_CAP = { instagram: 7500, tiktok: 1e4 };
var clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
var ageDays = (ts, now) => Math.floor((now - ts) / DAY);
var stalePending = ({ current, now }) => {
  const old = (current.pendingRequests ?? []).filter((a) => a.followedAt !== null && ageDays(a.followedAt, now) >= 180);
  if (old.length === 0) return null;
  const oldest = Math.max(...old.map((a) => ageDays(a.followedAt, now)));
  return { id: "stale_pending", impact: clamp(40 + old.length * 2), params: { count: old.length, months: Math.floor(oldest / 30) }, accounts: old };
};
var followBackGapYear = ({ current, followerSet }) => {
  const byYear = /* @__PURE__ */ new Map();
  for (const a of current.following) {
    if (a.followedAt === null) continue;
    const y = new Date(a.followedAt * 1e3).getUTCFullYear();
    const b = byYear.get(y) ?? { total: 0, oneWay: [] };
    b.total++;
    if (!followerSet.has(a.username)) b.oneWay.push(a);
    byYear.set(y, b);
  }
  let worst = null;
  for (const [year, b] of byYear) {
    if (b.total < 10) continue;
    const rate = b.oneWay.length / b.total;
    if (rate < 0.6) continue;
    if (!worst || rate > worst.oneWay.length / worst.total) worst = { year, ...b };
  }
  if (!worst) return null;
  const pct = Math.round(worst.oneWay.length / worst.total * 100);
  return { id: "follow_back_gap_year", impact: clamp(30 + pct / 2), params: { year: worst.year, total: worst.total, count: worst.oneWay.length, pct }, accounts: worst.oneWay };
};
var oldOneWay = ({ oneWay, now }) => {
  const old = oneWay.filter((a) => a.followedAt !== null && ageDays(a.followedAt, now) >= 730);
  if (old.length < 5) return null;
  return { id: "old_one_way", impact: clamp(35 + old.length / 4), params: { count: old.length }, accounts: old };
};
var suddenDrop = ({ current, previous }) => {
  if (!previous) return null;
  const cmp = compareSnapshots(previous, current);
  const lost = cmp.lostFollowers.length;
  const base = previous.followers.length || 1;
  if (lost < 10 || lost / base < 0.03) return null;
  const pct = Math.round(lost / base * 1e3) / 10;
  return { id: "sudden_drop", impact: clamp(60 + pct * 3), params: { count: lost, pct, days: Math.max(1, Math.round(cmp.periodDays)) }, accounts: cmp.lostFollowers };
};
var mutualsLost = ({ current, previous }) => {
  if (!previous) return null;
  const prevFollowing = new Set(previous.following.map((a) => a.username));
  const nowFollowers = new Set(current.followers.map((a) => a.username));
  const nowFollowing = new Set(current.following.map((a) => a.username));
  const lost = previous.followers.filter((a) => prevFollowing.has(a.username) && nowFollowing.has(a.username) && !nowFollowers.has(a.username));
  if (lost.length === 0) return null;
  return { id: "mutuals_lost", impact: clamp(55 + lost.length * 3), params: { count: lost.length }, accounts: lost };
};
var followBurst = ({ current, now, followerSet }) => {
  const byDay = /* @__PURE__ */ new Map();
  for (const a of current.following) {
    if (a.followedAt === null || ageDays(a.followedAt, now) > 730) continue;
    const d = new Date(a.followedAt * 1e3).toISOString().slice(0, 10);
    const list = byDay.get(d) ?? [];
    list.push(a);
    byDay.set(d, list);
  }
  let best = null;
  for (const e of byDay) if (!best || e[1].length > best[1].length) best = e;
  if (!best || best[1].length < 30) return null;
  const back = best[1].filter((a) => followerSet.has(a.username)).length;
  return { id: "follow_burst", impact: clamp(25 + best[1].length / 3), params: { date: best[0], count: best[1].length, followedBack: back }, accounts: best[1].filter((a) => !followerSet.has(a.username)) };
};
var fansUnanswered = ({ current, followingSet, now }) => {
  const recent = current.followers.filter((a) => !followingSet.has(a.username) && a.followedAt !== null && ageDays(a.followedAt, now) <= 30);
  if (recent.length < 3) return null;
  return { id: "fans_unanswered", impact: clamp(20 + recent.length), params: { count: recent.length }, accounts: recent };
};
var ratioImbalance = ({ current, oneWay }) => {
  const followers = current.followers.length;
  const following = current.following.length;
  if (following < 300 || following < followers * 1.5) return null;
  return { id: "ratio_imbalance", impact: clamp(30 + following / Math.max(1, followers) * 8), params: { followers, following, oneWay: oneWay.length }, accounts: [] };
};
var followingLimit = ({ current, platform, oneWay }) => {
  const cap = FOLLOWING_CAP[platform];
  if (!cap || current.following.length < cap * 0.9) return null;
  return { id: "following_limit", impact: 80, params: { following: current.following.length, cap, left: Math.max(0, cap - current.following.length), oneWay: oneWay.length }, accounts: [] };
};
var secondExport = ({ previous }) => previous ? null : { id: "second_export", impact: 15, params: {}, accounts: [] };
var RULES = [
  stalePending,
  followBackGapYear,
  oldOneWay,
  suddenDrop,
  mutualsLost,
  followBurst,
  fansUnanswered,
  ratioImbalance,
  followingLimit,
  secondExport
];
function runHealthChecks({ current, previous, now = Math.floor(Date.now() / 1e3) }) {
  const followerSet = new Set(current.followers.map((a) => a.username));
  const followingSet = new Set(current.following.map((a) => a.username));
  const ctx = {
    current,
    previous: previous && snapshotPlatform(previous) === snapshotPlatform(current) ? previous : void 0,
    now,
    platform: snapshotPlatform(current),
    followerSet,
    followingSet,
    oneWay: current.following.filter((a) => !followerSet.has(a.username))
  };
  const ranked = RULES.map((r) => r(ctx)).filter((f) => f !== null).sort((a, b) => b.impact - a.impact);
  return dropOverlapping(ranked);
}
var CLEANUP_LISTS = /* @__PURE__ */ new Set(["follow_back_gap_year", "old_one_way"]);
function dropOverlapping(ranked) {
  const kept = [];
  const covered = /* @__PURE__ */ new Set();
  for (const f of ranked) {
    if (!CLEANUP_LISTS.has(f.id)) {
      kept.push(f);
      continue;
    }
    if (f.accounts.length > 0) {
      const overlap = f.accounts.filter((a) => covered.has(a.username)).length;
      if (overlap / f.accounts.length >= 0.8) continue;
    }
    kept.push(f);
    for (const a of f.accounts) covered.add(a.username);
  }
  return kept;
}

// src/tools/growthTimeline.ts
var monthKey = (ts) => new Date(ts * 1e3).toISOString().slice(0, 7);
function nextMonth(key) {
  const [y, m] = key.split("-").map(Number);
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
}
function countByMonth(accounts) {
  const out = /* @__PURE__ */ new Map();
  for (const a of accounts) {
    if (a.followedAt === null) continue;
    const k = monthKey(a.followedAt);
    out.set(k, (out.get(k) ?? 0) + 1);
  }
  return out;
}
function growthTimeline(snapshot) {
  const f = countByMonth(snapshot.followers);
  const g = countByMonth(snapshot.following);
  const dated = snapshot.followers.filter((a) => a.followedAt !== null).length;
  const undated = snapshot.followers.length - dated;
  const keys = [...f.keys(), ...g.keys()].sort();
  if (keys.length === 0) return { months: [], best: null, dated, undated, lastYearShare: 0 };
  const end = monthKey(snapshot.exportedAt);
  const last = keys[keys.length - 1] > end ? keys[keys.length - 1] : end;
  const months = [];
  for (let k = keys[0], i = 0; k <= last && i < 300; k = nextMonth(k), i++) {
    months.push({ month: k, followers: f.get(k) ?? 0, following: g.get(k) ?? 0 });
  }
  let best = null;
  for (const m of months) if (m.followers > 0 && (!best || m.followers > best.followers)) best = m;
  const yearAgo = snapshot.exportedAt - 365 * 86400;
  const recent = snapshot.followers.filter((a) => a.followedAt !== null && a.followedAt >= yearAgo).length;
  return { months, best, dated, undated, lastYearShare: dated === 0 ? 0 : recent / dated };
}

// src/tools/verdict.ts
var RULES2 = [
  ["loyal_magnet", (s) => s.following >= 20 && s.followBackPct >= 85],
  ["main_character", (s) => s.followers >= 500 && s.ratio >= 5],
  ["quiet_icon", (s) => s.followers < 500 && s.ratio >= 2],
  ["fair_trader", (s) => s.following >= 20 && s.ratio >= 0.95 && s.ratio <= 1.05],
  ["generous_giver", (s) => s.following >= 50 && s.ratio < 0.5],
  ["hopeful_romantic", (s) => s.following >= 30 && s.followBackPct < 40],
  ["ghost_collector", (s) => s.oneWay >= 200],
  ["tiny_circle", (s) => s.followers > 0 && s.followers < 100 && s.followBackPct >= 70],
  ["open_house", (s) => s.following >= 2e3],
  ["selective", (s) => s.following < 150 && s.followers >= 300],
  ["rising", (s) => s.followers >= 50 && s.lastYearShare >= 0.5],
  ["og", (s) => s.followers >= 50 && s.lastYearShare > 0 && s.lastYearShare < 0.1],
  ["mutual_maximalist", (s) => s.followers >= 20 && s.mutuals / s.followers >= 0.8],
  ["fan_club", (s) => s.followers >= 50 && s.fans / s.followers >= 0.6],
  ["collector", (s) => s.followers > 0 && s.following > s.followers * 3],
  ["drama_magnet", (s) => (s.lost ?? 0) >= 10],
  ["untouchable", (s) => s.lost === 0],
  ["comeback", (s) => s.gained !== void 0 && s.lost !== void 0 && s.lost > 0 && s.gained > s.lost * 2],
  ["balanced", (s) => s.followBackPct >= 60 && s.followBackPct < 85],
  ["steady", () => true]
];
var ARCHETYPE_IDS = RULES2.map(([id]) => id);
function verdictStats(current, previous) {
  const followerSet = new Set(current.followers.map((a) => a.username));
  const followingSet = new Set(current.following.map((a) => a.username));
  const mutuals = current.following.filter((a) => followerSet.has(a.username)).length;
  const followers = current.followers.length;
  const following = current.following.length;
  const yearAgo = current.exportedAt - 365 * 86400;
  const dated = current.followers.filter((a) => a.followedAt !== null);
  const recent = dated.filter((a) => a.followedAt >= yearAgo).length;
  let lost;
  let gained;
  if (previous) {
    const prev = new Set(previous.followers.map((a) => a.username));
    lost = [...prev].filter((u) => !followerSet.has(u)).length;
    gained = [...followerSet].filter((u) => !prev.has(u)).length;
  }
  return {
    followers,
    following,
    mutuals,
    oneWay: following - mutuals,
    fans: current.followers.filter((a) => !followingSet.has(a.username)).length,
    followBackPct: following === 0 ? 0 : Math.round(mutuals / following * 100),
    ratio: following === 0 ? followers : followers / following,
    lastYearShare: dated.length === 0 ? 0 : recent / dated.length,
    lost,
    gained
  };
}
function eligibleArchetypes(stats) {
  const hits = RULES2.filter(([id, rule]) => id !== "steady" && rule(stats)).map(([id]) => id);
  return hits.length > 0 ? hits : ["steady"];
}
function hashSeed(...parts) {
  let h = 2166136261;
  for (const ch of parts.join("|")) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}
function pickVerdict(stats, exportedAt, spin = 0) {
  const pool = eligibleArchetypes(stats);
  const seed = hashSeed(stats.followers, stats.following, stats.mutuals, exportedAt, spin);
  return { archetype: pool[seed % pool.length], lineSeed: Math.floor(seed / pool.length), stats };
}

// src/tools/unfollowPlanner.ts
var PACE_PER_DAY = { gentle: 20, steady: 40, quick: 80 };
var SUB_BATCH = 10;
function buildPlan({ accounts, pace, starred, order = "oldest" }) {
  const perDay = PACE_PER_DAY[pace];
  const seen = /* @__PURE__ */ new Set();
  let skippedStarred = 0;
  const list = [];
  for (const a of accounts) {
    if (seen.has(a.username)) continue;
    seen.add(a.username);
    if (starred?.has(a.username)) {
      skippedStarred++;
      continue;
    }
    list.push(a);
  }
  list.sort(order === "az" ? (a, b) => a.username.localeCompare(b.username) : (a, b) => (a.followedAt ?? Infinity) - (b.followedAt ?? Infinity) || a.username.localeCompare(b.username));
  const batches = [];
  for (let i = 0; i < list.length; i += perDay) batches.push(list.slice(i, i + perDay).map((a) => a.username));
  return { pace, perDay, batches, total: list.length, skippedStarred };
}
function planProgress(plan, done) {
  let doneCount = 0;
  let currentBatch = -1;
  let currentBatchLeft = 0;
  plan.batches.forEach((batch, i) => {
    const left2 = batch.filter((u) => !done.has(u)).length;
    doneCount += batch.length - left2;
    if (currentBatch === -1 && left2 > 0) {
      currentBatch = i;
      currentBatchLeft = left2;
    }
  });
  const left = plan.total - doneCount;
  return {
    done: doneCount,
    left,
    daysLeft: Math.ceil(left / plan.perDay),
    currentBatch,
    currentBatchLeft,
    pct: plan.total === 0 ? 100 : Math.round(doneCount / plan.total * 100)
  };
}
function daysAtEachPace(total) {
  return {
    gentle: Math.ceil(total / PACE_PER_DAY.gentle),
    steady: Math.ceil(total / PACE_PER_DAY.steady),
    quick: Math.ceil(total / PACE_PER_DAY.quick)
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ARCHETYPE_IDS,
  FileReadError,
  InvalidZipError,
  MissingFilesError,
  MixedFormatError,
  PACE_PER_DAY,
  SUB_BATCH,
  SchemaValidationError,
  TIKTOK_LIST_CAP,
  analyzeSnapshot,
  buildPlan,
  compareSnapshots,
  contactMessageSchema,
  contactSources,
  daysAtEachPace,
  detectDeltaExport,
  eligibleArchetypes,
  emailOptInSchema,
  emailOptInSources,
  feedbackSchema,
  feedbackSentiments,
  findGhostFollowers,
  growthTimeline,
  hashSeed,
  parseExportZip,
  parseInstagramZip,
  pickVerdict,
  planProgress,
  plannerCadences,
  plannerSyncSchema,
  platformSchema,
  platforms,
  runHealthChecks,
  snapshotPlatform,
  tiktokHref,
  tiktokListNearCap,
  verdictStats
});
