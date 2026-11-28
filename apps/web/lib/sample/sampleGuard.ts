// While sample mode is on, IndexedDB refuses every write that could store
// something about the made-up account: marks, stars, unfollow plans, post
// photos, chats, and any new saved export. Updates and deletes on real saved
// exports (ownership bookkeeping) still go through; they can't carry sample
// data. Wired into Dexie in lib/db.ts through sampleGuardMiddleware.
import type { DBCore, Middleware } from 'dexie';

const BLOCKED_TABLES = new Set(['triageStates', 'stars', 'plans', 'postPhotos', 'chats']);

export function blocksWrite(table: string, type: string, sampleOn: boolean): boolean {
  if (!sampleOn) return false;
  if (BLOCKED_TABLES.has(table)) return true;
  return table === 'snapshots' && type === 'add';
}

export class SampleWriteBlocked extends Error {
  constructor(table: string) {
    super(`Sample data is never saved (${table})`);
    this.name = 'SampleWriteBlocked';
  }
}

// Dexie middleware: every write goes through blocksWrite first.
export function sampleGuardMiddleware(isOn: () => boolean): Middleware<DBCore> {
  return {
    stack: 'dbcore',
    name: 'sample-guard',
    create: (down) => ({
      ...down,
      table: (name) => {
        const t = down.table(name);
        return { ...t, mutate: (req) => (blocksWrite(name, req.type, isOn()) ? Promise.reject(new SampleWriteBlocked(name)) : t.mutate(req)) };
      },
    }),
  };
}
