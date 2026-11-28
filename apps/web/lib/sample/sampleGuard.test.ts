import { describe, expect, it, vi } from 'vitest';
import type { DBCore, DBCoreMutateRequest, DBCoreTable } from 'dexie';
import { blocksWrite, sampleGuardMiddleware, SampleWriteBlocked } from './sampleGuard';

const TABLES = ['snapshots', 'triageStates', 'stars', 'plans', 'postPhotos', 'chats'];

function fakeCore() {
  const mutate = vi.fn(async () => ({ numFailures: 0, failures: {}, results: [1], lastResult: 1 }));
  const table = (name: string) => ({ name, mutate }) as unknown as DBCoreTable;
  return { core: { stack: 'dbcore', table } as unknown as DBCore, mutate };
}

describe('sample write guard', () => {
  it('lets every write through when sample mode is off', () => {
    for (const t of TABLES) for (const type of ['add', 'put', 'delete', 'deleteRange']) expect(blocksWrite(t, type, false)).toBe(false);
  });

  it('blocks marks, stars, plans, photos, chats and new saved exports in sample mode', () => {
    for (const t of ['triageStates', 'stars', 'plans', 'postPhotos', 'chats']) for (const type of ['add', 'put', 'delete']) expect(blocksWrite(t, type, true)).toBe(true);
    expect(blocksWrite('snapshots', 'add', true)).toBe(true);
    // Bookkeeping on exports that are already saved can't carry sample data.
    expect(blocksWrite('snapshots', 'put', true)).toBe(false);
  });

  it('rejects the write before it reaches IndexedDB', async () => {
    let on = true;
    const { core, mutate } = fakeCore();
    const create = sampleGuardMiddleware(() => on).create;
    if (!create) throw new Error('middleware has no create');
    const guarded = create(core) as DBCore;
    const req = { type: 'add', values: [{ username: 'lena..frames' }] } as unknown as DBCoreMutateRequest;
    for (const t of ['triageStates', 'stars', 'plans', 'chats', 'postPhotos', 'snapshots']) {
      await expect(guarded.table(t).mutate(req)).rejects.toBeInstanceOf(SampleWriteBlocked);
    }
    expect(mutate).not.toHaveBeenCalled();
    on = false;
    await guarded.table('triageStates').mutate(req);
    expect(mutate).toHaveBeenCalledTimes(1);
  });
});
