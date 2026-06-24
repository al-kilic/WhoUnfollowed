// Tracks whether a free user has already used their one CSV export. Client-side
// only (privacy-first: nothing about exports is sent to a server). It's a soft
// limit / upgrade nudge, not DRM.
const FREE_CSV_KEY = 'wu:free-csv-export-used';

export function freeCsvExportUsed(): boolean {
  try {
    return localStorage.getItem(FREE_CSV_KEY) === '1';
  } catch {
    return false;
  }
}

export function markFreeCsvExportUsed(): void {
  try {
    localStorage.setItem(FREE_CSV_KEY, '1');
  } catch {
    // ignore (private mode etc.) — worst case the nudge doesn't persist
  }
}
