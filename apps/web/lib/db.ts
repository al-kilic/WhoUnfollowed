import Dexie, { type Table } from 'dexie';
import type { ParsedSnapshot } from '@ig-tracker/core';

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

class IgTrackerDb extends Dexie {
  snapshots!: Table<SnapshotRecord, number>;
  triageStates!: Table<TriageRecord, number>;

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
  }
}

export const db = new IgTrackerDb();
