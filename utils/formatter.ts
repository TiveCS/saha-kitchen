import { DateFormatter, getLocalTimeZone } from "@internationalized/date";

const DATE_FORMATTER = new DateFormatter("id-ID", {
  timeZone: getLocalTimeZone(),
  dateStyle: "long",
});

export function formatNumber(number: number): string {
  return new Intl.NumberFormat("de-DE").format(number);
}

export function reverseNumberFormat(value: string): string {
  return value.trim().replace(/\./g, "").replace(/,/g, ".");
}
export function formatReadableDate(date: Date) {
  return DATE_FORMATTER.format(date);
}
