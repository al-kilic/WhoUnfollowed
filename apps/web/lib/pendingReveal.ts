// Which two local snapshots a free user was looking at when they chose to buy
// from the unfollower reveal, so the page they land on after paying can link
// straight to that comparison. Only snapshot ids (numbers) are stored, in this
// browser. A convenience: if storage is unavailable, the comparison is still
// one click away in history.
const KEY = 'wu:pending-reveal';

export interface PendingReveal {
  oldId: number;
  newId: number;
}

export function savePendingReveal(value: PendingReveal): void {
  try { localStorage.setItem(KEY, JSON.stringify(value)); } catch {}
}

export function readPendingReveal(): PendingReveal | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<PendingReveal>;
    return typeof v.oldId === 'number' && typeof v.newId === 'number' ? { oldId: v.oldId, newId: v.newId } : null;
  } catch {
    return null;
  }
}

export function clearPendingReveal(): void {
  try { localStorage.removeItem(KEY); } catch {}
}
