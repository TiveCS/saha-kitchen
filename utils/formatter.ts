import { TIMEZONE } from "@/constants";
import { CalendarDate, DateFormatter } from "@internationalized/date";

const DATE_FORMATTER = new DateFormatter("id-ID", {
  timeZone: TIMEZONE,
  dateStyle: "long",
});

const DATE_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

export function formatNumber(number: number): string {
  return new Intl.NumberFormat("de-DE").format(number);
}

export function reverseNumberFormat(value: string): string {
  return value.trim().replace(/\./g, "").replace(/,/g, ".");
}

export function formatReadableDate(date: Date) {
  return DATE_FORMATTER.format(date);
}

export function formatReadableDateMonth(
  date: CalendarDate
): `${string} ${number}` {
  return `${DATE_MONTHS[date.month - 1]} ${date.year}`;
}
