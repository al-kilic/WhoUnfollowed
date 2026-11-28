import { EXPORT_APPS, STUDY_DATE, TOP_APPS } from './data';

// Every number the page, its FAQ and its structured data quote, computed from
// the snapshot so the copy can never disagree with the table.
const yearBefore = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCFullYear(d.getUTCFullYear() - 1);
  return d.toISOString().slice(0, 10);
};

export function studyStats() {
  const n = TOP_APPS.length;
  const stated = TOP_APPS.filter((a) => a.access === 'stated').length;
  const features = TOP_APPS.filter((a) => a.access === 'features').length;
  const unstated = TOP_APPS.filter((a) => a.access === 'unstated').length;
  const topRatings = TOP_APPS.reduce((s, a) => s + a.ratings, 0);
  const exportRatings = EXPORT_APPS.reduce((s, a) => s + a.ratings, 0);
  const cutoff = yearBefore(STUDY_DATE);
  return {
    n,
    stated,
    features,
    needsAccount: stated + features,
    unstated,
    readsExport: 0,
    weekly: TOP_APPS.filter((a) => a.weekly).length,
    stale: TOP_APPS.filter((a) => a.updated < cutoff).length,
    profileViewers: TOP_APPS.filter((a) => a.claimsProfileViewers).length,
    topRatings,
    exportApps: EXPORT_APPS.length,
    exportRatings,
    ratio: Math.round(topRatings / Math.max(exportRatings, 1)),
    biggestExport: Math.max(...EXPORT_APPS.map((a) => a.ratings)),
  };
}

export type StudyStats = ReturnType<typeof studyStats>;

export const fmt = (n: number) => n.toLocaleString('en-US');
