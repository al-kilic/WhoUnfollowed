import { describe, expect, it, vi } from 'vitest';

vi.mock('dexie-react-hooks', () => ({ useLiveQuery: () => [] }));
vi.mock('@/lib/db', () => ({ db: {} }));

import { freeSnapshotLimit } from './useSnapshots';

describe('free saved-export limit', () => {
  it('keeps one export signed out and two with a free account', () => {
    expect(freeSnapshotLimit(false)).toBe(1);
    expect(freeSnapshotLimit(true)).toBe(2);
  });
});
