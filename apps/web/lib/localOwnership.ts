import type { SnapshotRecord } from '@/lib/db';

const ANON_SESSION_KEY = 'wu.anonSessionId';

// A per-tab-session id for anonymous (logged-out) use, so snapshots created
// before signing up are scoped to "whoever is using this browser right now",
// not visible to a different anonymous person or account later. Lives in
// sessionStorage on purpose: it disappears when the tab/browser closes, same
// lifecycle as the cloud-sync key in lib/syncKey.ts.
export function getOrCreateAnonSessionId(): string {
  try {
    let id = sessionStorage.getItem(ANON_SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(ANON_SESSION_KEY, id);
    }
    return id;
  } catch {
    // Private browsing or storage disabled: fall back to an in-memory id for
    // this call. Less precise (won't persist across a re-render in some rare
    // cases) but never leaks across identities, which is the actual invariant.
    return `no-storage-${Date.now()}`;
  }
}

// A record is visible to the current viewer if they own it (logged in and
// ownerUserId matches) or it's unclaimed anonymous data from this exact
// browser session (logged out, or not yet claimed after a same-session
// signup). Never matches a different account's data or a different session's
// anonymous data. Single source of truth: every place that reads local
// snapshot/triage data by scanning across records (not by an id the caller
// already knows they own) must filter through this, not reimplement it.
export function isOwnedByCurrentViewer(
  record: Pick<SnapshotRecord, 'ownerUserId' | 'anonSessionId'>,
  currentUserId: string | null,
): boolean {
  if (currentUserId) {
    if (record.ownerUserId === currentUserId) return true;
    if (record.ownerUserId == null && record.anonSessionId === getOrCreateAnonSessionId()) return true;
    return false;
  }
  return record.ownerUserId == null && record.anonSessionId === getOrCreateAnonSessionId();
}
