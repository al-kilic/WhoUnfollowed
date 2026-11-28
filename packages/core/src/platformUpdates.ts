// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { z } from 'zod';

// What changed on Instagram, Threads and TikTok, as a ledger the coach can
// trust: every item has a status, the day it was last checked against a
// source, and the source. Platforms test things on a few accounts, roll them
// back, or quietly stop them, so nothing here is "true forever":
//   - live and rolling-out items fade out 90 days after their last check,
//   - tests fade out after 45 days and never read as available to everyone,
//   - reverted, paused and ended items stay for 120 days as "no longer true",
//     so the coach stops recommending them instead of just forgetting them.
// The weekly brief (the weekly-brief skill) re-checks and updates the ledger.

export const platformUpdateStatuses = ['live', 'rolling_out', 'testing', 'paused', 'reverted', 'ended'] as const;
export type PlatformUpdateStatus = (typeof platformUpdateStatuses)[number];

const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const platformUpdateSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{3,60}$/),
  platform: z.enum(['instagram', 'threads', 'tiktok', 'meta']),
  kind: z.enum(['feature', 'algorithm', 'policy', 'data']).default('feature'),
  summary: z.string().trim().min(10).max(240),
  status: z.enum(platformUpdateStatuses),
  firstSeen: day,
  lastVerified: day,
  // When the status last changed (required for paused, reverted and ended).
  statusChangedAt: day.nullable().default(null),
  source: z.string().url().startsWith('https://'),
  // Short context, e.g. "only in the US" or "Meta rolled this back after a week".
  note: z.string().trim().max(160).nullable().default(null),
  supersedes: z.string().nullable().default(null),
}).refine((u) => !['paused', 'reverted', 'ended'].includes(u.status) || !!u.statusChangedAt, { message: 'statusChangedAt is required when a change stopped' });
export type PlatformUpdate = z.infer<typeof platformUpdateSchema>;

export const platformUpdatesFileSchema = z.object({ updated: day, items: z.array(platformUpdateSchema).max(300) });

export const UPDATE_RULES = { liveDays: 90, staleDays: 60, testingDays: 45, stoppedDays: 120, maxLines: 14 } as const;

const DAY = 86_400_000;
const age = (d: string, now: Date) => Math.floor((now.getTime() - Date.parse(`${d}T12:00:00Z`)) / DAY);

export interface CurrentUpdate { update: PlatformUpdate; stale: boolean }

// The items the coach may use today, newest check first. `platforms` limits
// it to the member's platforms ('meta' items always count).
export function currentUpdates(items: readonly PlatformUpdate[], now: Date, platforms?: readonly string[]): CurrentUpdate[] {
  const superseded = new Set(items.map((u) => u.supersedes).filter((x): x is string => !!x));
  return items
    .filter((u) => !superseded.has(u.id))
    .filter((u) => !platforms || u.platform === 'meta' || platforms.includes(u.platform))
    .filter((u) => {
      if (u.status === 'live' || u.status === 'rolling_out') return age(u.lastVerified, now) <= UPDATE_RULES.liveDays;
      if (u.status === 'testing') return age(u.lastVerified, now) <= UPDATE_RULES.testingDays;
      return age(u.statusChangedAt ?? u.lastVerified, now) <= UPDATE_RULES.stoppedDays;
    })
    .map((u) => ({ update: u, stale: (u.status === 'live' || u.status === 'rolling_out') && age(u.lastVerified, now) > UPDATE_RULES.staleDays }))
    .sort((a, b) => b.update.lastVerified.localeCompare(a.update.lastVerified) || a.update.id.localeCompare(b.update.id));
}

const NAME: Record<PlatformUpdate['platform'], string> = { instagram: 'Instagram', threads: 'Threads', tiktok: 'TikTok', meta: 'Meta' };

// One line per item for the coach's context, with its status and dates.
export function updateLines(current: readonly CurrentUpdate[], max: number = UPDATE_RULES.maxLines): string[] {
  const stopped = current.filter((c) => ['paused', 'reverted', 'ended'].includes(c.update.status));
  const active = current.filter((c) => !stopped.includes(c));
  const line = ({ update: u, stale }: CurrentUpdate): string => {
    const note = u.note ? ` (${u.note})` : '';
    switch (u.status) {
      case 'live': return `- ${NAME[u.platform]}: ${u.summary}${note} [live, checked ${u.lastVerified}${stale ? ', not re-checked lately: say it may have changed' : ''}]`;
      case 'rolling_out': return `- ${NAME[u.platform]}: ${u.summary}${note} [rolling out since ${u.firstSeen}, not everyone has it yet, checked ${u.lastVerified}]`;
      case 'testing': return `- ${NAME[u.platform]}: ${u.summary}${note} [a test on some accounts only, seen ${u.lastVerified}: never promise it]`;
      case 'paused': return `- NO LONGER TRUE (paused ${u.statusChangedAt}): ${NAME[u.platform]}: ${u.summary}${note}`;
      case 'reverted': return `- NO LONGER TRUE (rolled back ${u.statusChangedAt}): ${NAME[u.platform]}: ${u.summary}${note}`;
      case 'ended': return `- NO LONGER TRUE (ended ${u.statusChangedAt}): ${NAME[u.platform]}: ${u.summary}${note}`;
    }
  };
  // Stopped items first, so they are never cut off by the cap.
  return [...stopped, ...active].slice(0, max).map(line);
}
