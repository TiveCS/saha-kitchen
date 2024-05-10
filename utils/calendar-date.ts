import {
  CalendarDate,
  endOfMonth,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "@internationalized/date";
import { formatReadableDateMonth } from "./formatter";

export function isDateBetween(
  target: CalendarDate,
  range: { from: CalendarDate; to: CalendarDate }
): boolean {
  return target.compare(range.from) >= 0 && target.compare(range.to) <= 0;
}

export function toCalendarDate(date: Date): CalendarDate {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
}

export function getListWeeksOfMonth(
  date: CalendarDate
): { label: string; start: CalendarDate; end: CalendarDate }[] {
  const result: { label: string; start: CalendarDate; end: CalendarDate }[] =
    [];

  let week = 1;
  let startWeek = startOfMonth(date);
  const endMonth = endOfMonth(date);
  let endWeek = startWeek.add({ days: 6 });

  while (startWeek.compare(endMonth) < 0) {
    result.push({ label: `Minggu ${week}`, start: startWeek, end: endWeek });
    startWeek = startWeek.add({ weeks: 1 });
    endWeek = startWeek.add({ days: 6 });
    week++;

    if (endWeek.compare(endMonth) > 0) {
      endWeek = endMonth;
    }
  }

  return result;
}

export function getMonthsInPeriod(
  start: CalendarDate,
  end: CalendarDate
): Map<`${string} ${number}`, { start: CalendarDate; end: CalendarDate }> {
  const result = new Map<
    `${string} ${number}`,
    { start: CalendarDate; end: CalendarDate }
  >();

  let currentMonth = start;

  while (currentMonth.compare(end) <= 0) {
    const key = formatReadableDateMonth(currentMonth);

    if (!result.has(key)) {
      result.set(key, {
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
      });
    }

    currentMonth = currentMonth.add({ days: 1 });
  }

  return result;
}
