import type { TargetPlan } from "@/lib/target-plan-persistence";
import type { Word } from "@/lib/vocabulary";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Start of day in local time for a date. */
function startOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

/**
 * 1-based day index (1..days), or 0 if before plan start, or days+1 if after plan end.
 */
export function getDayIndex(plan: TargetPlan, date: Date): number {
  const start = startOfDay(new Date(plan.startDate));
  const today = startOfDay(date);
  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / MS_PER_DAY);
  if (diffDays < 0) return 0;
  if (diffDays >= plan.days) return plan.days + 1;
  return diffDays + 1;
}

export function isPlanActive(plan: TargetPlan, date: Date): boolean {
  const dayIndex = getDayIndex(plan, date);
  return dayIndex >= 1 && dayIndex <= plan.days;
}

export function isPlanNotStarted(plan: TargetPlan, date: Date): boolean {
  return getDayIndex(plan, date) === 0;
}

export function isPlanEnded(plan: TargetPlan, date: Date): boolean {
  return getDayIndex(plan, date) > plan.days;
}

/**
 * Partition allWords into plan.days chunks; returns the chunk for the given 1-based dayIndex.
 */
export function getWordsForDay(allWords: Word[], plan: TargetPlan, dayIndex: number): Word[] {
  if (dayIndex < 1 || dayIndex > plan.days) return [];
  const total = allWords.length;
  const perDay = Math.ceil(total / plan.days);
  const start = (dayIndex - 1) * perDay;
  const end = dayIndex === plan.days ? total : Math.min(start + perDay, total);
  return allWords.slice(start, end);
}

export function getWeekLabel(dayIndex: number, totalDays: number): string {
  if (totalDays <= 0) return "Week 0";
  const week = Math.ceil(dayIndex / 7);
  const totalWeeks = Math.ceil(totalDays / 7);
  return `Week ${week} of ${totalWeeks}`;
}
