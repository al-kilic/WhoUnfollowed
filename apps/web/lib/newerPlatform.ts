import type { Platform } from '@/lib/platform';

// The other platform whose newest export is newer than the one on screen
// (the newest of those when several are), or null.
export function newerPlatform(newest: ReadonlyMap<Platform, number>, here: Platform, hereAt: number): Platform | null {
  let best: Platform | null = null;
  for (const [p, at] of newest) {
    if (p !== here && at > hereAt && (best === null || at > newest.get(best)!)) best = p;
  }
  return best;
}
