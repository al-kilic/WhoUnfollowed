// Maps the "day" of a planned post to a weekday (0 = Monday ... 6 = Sunday),
// so Studio can place it on a calendar. The prompt asks for three-letter
// English codes, but answers in Spanish or Portuguese day names are accepted
// too. Anything unrecognised returns null and is listed instead of placed.

const DAYS: string[][] = [
  ['mon', 'monday', 'lun', 'lunes', 'seg', 'segunda', 'segunda-feira'],
  ['tue', 'tuesday', 'mar', 'martes', 'ter', 'terca', 'terça', 'terca-feira', 'terça-feira'],
  ['wed', 'wednesday', 'mie', 'mié', 'miercoles', 'miércoles', 'qua', 'quarta', 'quarta-feira'],
  ['thu', 'thursday', 'jue', 'jueves', 'qui', 'quinta', 'quinta-feira'],
  ['fri', 'friday', 'vie', 'viernes', 'sex', 'sexta', 'sexta-feira'],
  ['sat', 'saturday', 'sab', 'sáb', 'sabado', 'sábado'],
  ['sun', 'sunday', 'dom', 'domingo'],
];

export function weekdayIndex(day: string): number | null {
  const d = day.trim().toLowerCase().replace(/\.$/, '');
  const i = DAYS.findIndex((names) => names.includes(d));
  return i === -1 ? null : i;
}

// The Monday on or after `from` (UTC dates), where a new plan starts.
export function planStart(from: Date): Date {
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  const dow = (d.getUTCDay() + 6) % 7; // 0 = Monday
  if (dow !== 0) d.setUTCDate(d.getUTCDate() + (7 - dow));
  return d;
}

// The plan day (0 = the plan's first Monday) where a checked draft goes:
// within the coming week, a free posting day first, then any free day; after
// that, the next free posting day (or free day when no days are set). Null
// when the plan has no room left.
export function nextPlanDay(start: Date, taken: readonly number[], postingDays: readonly number[], now: Date = new Date(), lastDay = 34): number | null {
  const today = Math.max(0, Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start.getTime()) / 86_400_000));
  const busy = new Set(taken);
  const free = (from: number, to: number, ok: (d: number) => boolean) => {
    for (let d = from; d <= Math.min(to, lastDay); d++) if (!busy.has(d) && ok(d)) return d;
    return null;
  };
  const isPosting = (d: number) => !postingDays.length || postingDays.includes(d % 7);
  return free(today, today + 6, isPosting) ?? free(today, today + 6, () => true) ?? free(today + 7, lastDay, isPosting) ?? free(today + 7, lastDay, () => true);
}
