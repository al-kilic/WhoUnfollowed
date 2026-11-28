// Sample data for the homepage's illustrations. Everything here is labelled
// "Sample" on the page. Pure, so both the server markup and HomeFx use it.

// 48 sample handles; each gets one of the 44 bundled Pexels portraits.
export const HANDLES = ['lena.frames', 'oak.and.ash', 'mio.travels', 'rue.studio', 'kaito.film', 'noor.bakes', 'viv.runs', 'the.salt.house', 'jules.makes', 'pixel.poet',
  'sunday.prints', 'ana.on.film', 'marco.eats', 'tess.lifts', 'dev.sketches', 'ines.reads', 'omar.outdoors', 'kiki.ceramics', 'bo.surfs', 'lou.loops',
  'nina.plants', 'theo.trains', 'yuki.draws', 'sam.and.sea', 'ella.edits', 'raf.rides', 'mina.moves', 'gus.grills', 'pia.paints', 'leo.lenses',
  'zoe.zines', 'arlo.audio', 'cami.cooks', 'finn.fixes', 'ivy.inks', 'jon.jogs', 'lia.looks', 'max.maps', 'nora.knits', 'otto.oak',
  'rhea.runs', 'sol.studio', 'tom.tapes', 'uma.urban', 'vic.vinyl', 'wren.writes', 'xavi.x', 'yara.yoga'];

export const AVATARS = Array.from({ length: 44 }, (_, i) => `/home/av/p${String(i + 1).padStart(2, '0')}.jpg`);
export const POST_PHOTOS = Array.from({ length: 10 }, (_, i) => `/home/post/ph${String(i + 1).padStart(2, '0')}.jpg`);

// The hero deck's sample accounts: [don't follow back, you follow, change since last export, last export date].
export const SETS: [number, number, number, string][] = [[84, 1046, 6, '2026-10-02'], [127, 1388, 9, '2026-09-28'], [46, 612, 3, '2026-10-09'], [213, 2140, 14, '2026-09-30']];

// Who left, week by week (12 in 7 weeks; the spike is the week with no posts).
export const WEEKS: [string, number][] = [['2026-10-07', 1], ['2026-10-14', 2], ['2026-10-21', 1], ['2026-10-28', 5], ['2026-11-04', 1], ['2026-11-11', 1], ['2026-11-18', 1]];

// The growth chart's x positions and month ticks.
export const CHART_MONTHS: [number, string][] = [[40, '2026-04-15'], [174, '2026-06-15'], [308, '2026-09-15'], [442, '2026-10-15'], [488, '2026-11-15']];

// "Oct 2" / "2 oct" in the visitor's language, from a fixed date (UTC, so the
// server and the browser agree).
export function shortDay(locale: string, iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).replace('.', '');
}
export function shortMonth(locale: string, iso: string): string {
  const m = new Date(`${iso}T12:00:00Z`).toLocaleDateString(locale, { month: 'short', timeZone: 'UTC' }).replace('.', '');
  return m.charAt(0).toUpperCase() + m.slice(1);
}
export function monthYear(locale: string, iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).replace('.', '');
}
// Monday-first narrow weekday letters, and short names for Tue, Thu and Sat.
export function weekLetters(locale: string): string[] {
  return Array.from({ length: 7 }, (_, i) => new Date(Date.UTC(2026, 10, 23 + i, 12)).toLocaleDateString(locale, { weekday: 'narrow', timeZone: 'UTC' }).toUpperCase());
}
export function postingDays(locale: string): string[] {
  return [24, 26, 28].map((d) => {
    const s = new Date(Date.UTC(2026, 10, d, 12)).toLocaleDateString(locale, { weekday: 'short', timeZone: 'UTC' }).replace('.', '');
    return s.charAt(0).toUpperCase() + s.slice(1);
  });
}
