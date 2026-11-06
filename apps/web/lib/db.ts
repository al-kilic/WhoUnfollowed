import Dexie, { type Table } from 'dexie';
import type { Pace, ParsedSnapshot, Platform } from '@ig-tracker/core';

export interface SnapshotRecord {
  id?: number;
  label: string;
  exportedAt: number;
  savedAt: number;
  data: ParsedSnapshot;
  cloudId?: string; // UUID from cloud_snapshots table if synced
  // Ownership scoping so two people sharing a browser never see each other's
  // data. Exactly one of these is set for any record created after this field
  // was added: ownerUserId once someone is logged in, anonSessionId (cleared
  // when the tab/browser closes) while logged out. Records from before this
  // field existed have both undefined, see migrateLegacyOwnership in
  // useSnapshots.ts for the one-time backfill.
  ownerUserId?: string | null;
  anonSessionId?: string | null;
}

export type TriageState = 'not_a_fan' | 'let_it_slide' | 'done' | 'check_later' | 'deactivated';

export interface TriageRecord {
  id?: number;
  snapshotKey: number; // exportedAt timestamp
  username: string;
  state: TriageState;
  updatedAt: number;
}

// A starred account ("one of my people"): never suggested for unfollowing,
// flagged first if they leave. Pro, so always tied to a logged-in user.
export interface StarRecord {
  id?: number;
  owner: string; // user id
  platform: Platform;
  username: string;
  createdAt: number;
}

// The unfollow planner's saved plan and progress, one per user and platform.
// Usernames stay here, in this browser; the server only ever gets counts.
export interface PlanRecord {
  owner: string;
  platform: Platform;
  pace: Pace;
  // Nudge email setting; undefined on plans saved before emails existed (= weekly).
  cadence?: 'weekly' | 'daily' | 'off';
  batches: string[][];
  done: string[];
  createdAt: number;
  updatedAt: number;
}

class IgTrackerDb extends Dexie {
  snapshots!: Table<SnapshotRecord, number>;
  triageStates!: Table<TriageRecord, number>;
  stars!: Table<StarRecord, number>;
  plans!: Table<PlanRecord, [string, Platform]>;

  constructor() {
    super('ig-tracker');
    this.version(1).stores({
      snapshots: '++id, exportedAt, savedAt',
    });
    this.version(2).stores({
      snapshots: '++id, exportedAt, savedAt',
      triageStates: '++id, [snapshotKey+username], snapshotKey',
    });
    this.version(3).stores({
      snapshots: '++id, exportedAt, savedAt, cloudId',
      triageStates: '++id, [snapshotKey+username], snapshotKey',
    });
    this.version(4).stores({
      snapshots: '++id, exportedAt, savedAt, cloudId, ownerUserId, anonSessionId',
      triageStates: '++id, [snapshotKey+username], snapshotKey',
    });
    // v5: stars and unfollow plans (tools). Adds tables only, nothing to migrate.
    this.version(5).stores({
      snapshots: '++id, exportedAt, savedAt, cloudId, ownerUserId, anonSessionId',
      triageStates: '++id, [snapshotKey+username], snapshotKey',
      stars: '++id, &[owner+platform+username], [owner+platform]',
      plans: '[owner+platform]',
    });
  }
}

export const db = new IgTrackerDb();
