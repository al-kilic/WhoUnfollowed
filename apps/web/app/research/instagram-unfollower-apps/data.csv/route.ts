import { EXPORT_APPS, STUDY_DATE, TOP_APPS } from '../data';

// The study's data as CSV, for anyone who wants to check or reuse it.
const cell = (v: string | number | boolean | null) => {
  const s = v === null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function GET(): Response {
  const head = ['group', 'rank', 'app', 'developer', 'app_store_id', 'ratings', 'stars', 'last_update', 'access', 'evidence', 'prices_listed', 'weekly_plan', 'claims_profile_viewers', 'snapshot_date'];
  const rows = [
    ...TOP_APPS.map((a) => ['top30', a.rank, a.name, a.developer, a.id, a.ratings, a.stars, a.updated, a.access, a.evidence, a.price, a.weekly, a.claimsProfileViewers, STUDY_DATE]),
    ...EXPORT_APPS.map((a) => ['reads_official_export', null, a.name, a.developer, a.id, a.ratings, null, a.updated, 'export', null, null, null, null, STUDY_DATE]),
  ];
  const body = [head, ...rows].map((r) => r.map(cell).join(',')).join('\n') + '\n';
  return new Response(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="instagram-unfollower-apps-2026-11.csv"',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
