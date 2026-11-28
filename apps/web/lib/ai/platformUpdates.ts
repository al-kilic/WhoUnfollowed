import 'server-only';
import path from 'path';
import { readFile } from 'fs/promises';
import { currentUpdates, platformUpdatesFileSchema, updateLines, type PlatformUpdate } from '@ig-tracker/core';

// The platform updates ledger (content/briefs/platform-updates.json), kept by
// the weekly brief. Read on each call (it is small and changes weekly), checked
// against the schema; a broken file means no updates rather than a failed call.
const FILE = path.join(process.cwd(), 'content', 'briefs', 'platform-updates.json');

export async function loadPlatformUpdates(file: string = FILE): Promise<PlatformUpdate[]> {
  try {
    const parsed = platformUpdatesFileSchema.safeParse(JSON.parse(await readFile(file, 'utf8')));
    return parsed.success ? parsed.data.items : [];
  } catch { return []; }
}

// What the coach may rely on today for this platform, one line each.
export async function platformUpdateLines(platform: string, now: Date = new Date()): Promise<string[]> {
  return updateLines(currentUpdates(await loadPlatformUpdates(), now, [platform]));
}
