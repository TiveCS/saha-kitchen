import { formatNumber, reverseNumberFormat } from "./formatter";

export function handleNumericInputChange(value: string): number {
  const unformatted = reverseNumberFormat(value);

  if (isNaN(Number(unformatted))) return 0;
  return Number(unformatted);
}

export function handleNumericInputDisplay(
  value: string | number | undefined
): string {
  const num = handleNumericInputChange(value?.toString() || "0");

  return formatNumber(num);
}
