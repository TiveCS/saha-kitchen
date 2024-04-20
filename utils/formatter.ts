export function formatNumber(number: number): string {
  return new Intl.NumberFormat('de-DE').format(number);
}

export function reverseNumberFormat(value: string): string {
  return value.trim().replace(/\./g, '').replace(/,/g, '.');
}