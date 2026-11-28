import type { AiPlan, AiPlanCalendarItem } from '@ig-tracker/core';
import { AI_ACTIONS, PLAN_FREE_REVISIONS } from './config';
import { weekdayIndex } from './planDays';

// The AI's 30-day plan (weeks of posts with a weekday) turned into a calendar
// the user can edit: one item per post, placed `day` days after the plan's
// first Monday. A post whose weekday can't be read, or whose day is taken,
// goes to the next free day of that week.
export function calendarFromPlan(plan: AiPlan): AiPlanCalendarItem[] {
  const items: AiPlanCalendarItem[] = [];
  const taken = new Set<number>();
  plan.weeks.slice(0, 5).forEach((w, wi) => {
    for (const p of w.posts) {
      const wd = weekdayIndex(p.day);
      let day = wi * 7 + (wd ?? 0);
      while (taken.has(day) && day < wi * 7 + 6) day++;
      if (taken.has(day)) continue; // a full week: drop the extra rather than spill into the next
      taken.add(day);
      items.push({ day, format: p.format, idea: p.idea, hook: p.hook, posted: false });
    }
  });
  return items.sort((a, b) => a.day - b.day);
}

// Moves one post by `by` days, skipping days that already have a post.
// Returns the items unchanged when there is no free day in that direction.
export function movePost(items: AiPlanCalendarItem[], day: number, by: -1 | 1, lastDay = 29): AiPlanCalendarItem[] {
  const taken = new Set(items.map((i) => i.day));
  let to = day + by;
  while (taken.has(to) && to >= 0 && to <= lastDay) to += by;
  if (to < 0 || to > lastDay) return items;
  return items.map((i) => (i.day === day ? { ...i, day: to } : i)).sort((a, b) => a.day - b.day);
}

// Drag and drop (and keyboard move): the post on `from` goes to `to`. On an
// empty day it simply moves; on a day with a post not yet posted the two swap.
// Posted posts never move, and nothing can land on a posted post's day: null
// means "not allowed" and the calendar stays as it is.
export type DropResult = { items: AiPlanCalendarItem[]; kind: 'moved' | 'swapped' } | null;
export function dropPost(items: AiPlanCalendarItem[], from: number, to: number, lastDay = 29): DropResult {
  if (from === to || to < 0 || to > lastDay) return null;
  const a = items.find((i) => i.day === from);
  if (!a || a.posted) return null;
  const b = items.find((i) => i.day === to);
  if (b?.posted) return null;
  const next = items.map((i) => (i === a ? { ...i, day: to } : i === b ? { ...i, day: from } : i)).sort((x, y) => x.day - y.day);
  return { items: next, kind: b ? 'swapped' : 'moved' };
}

// What the next feedback round on a plan costs: the first PLAN_FREE_REVISIONS
// are included in the plan, then the planRevise price each.
export function revisionCost(revisions: number): number {
  return revisions < PLAN_FREE_REVISIONS ? 0 : AI_ACTIONS.planRevise.credits;
}

// Posts the user already marked as posted stay on their day.
export function mergeCalendar(next: AiPlanCalendarItem[], before: AiPlanCalendarItem[]): AiPlanCalendarItem[] {
  const posted = before.filter((i) => i.posted);
  const taken = new Set(posted.map((i) => i.day));
  return [...posted, ...next.filter((i) => !taken.has(i.day))].sort((a, b) => a.day - b.day);
}

