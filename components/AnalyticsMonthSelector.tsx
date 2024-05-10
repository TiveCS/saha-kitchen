"use client";

import { useGetAvailableProductMonths } from "@/queries/product.query";
import { getMonthsInPeriod, toCalendarDate } from "@/utils/calendar-date";
import { formatReadableDate } from "@/utils/formatter";
import {
  CalendarDate,
  DateValue,
  RangeValue,
  Select,
  SelectItem,
  Selection,
} from "@nextui-org/react";
import { useMemo } from "react";

interface AnalyticsMonthSelectorProps {
  period: RangeValue<DateValue> | null;
  setPeriod: (period: RangeValue<DateValue> | null) => void;
  selectedProducts: Selection;
}

export function AnalyticsMonthSelector({
  period,
  setPeriod,
  selectedProducts,
}: AnalyticsMonthSelectorProps) {
  const productIds: string[] = useMemo(
    () => Array.from(selectedProducts).map((id) => id.toString()),
    [selectedProducts]
  );

  const { data: availableMonths, isLoading } =
    useGetAvailableProductMonths(productIds);

  const periods: Map<
    `${string} ${number}`,
    { start: CalendarDate; end: CalendarDate }
  > = useMemo(() => {
    if (!availableMonths) return new Map();

    return getMonthsInPeriod(
      toCalendarDate(availableMonths.firstDate),
      toCalendarDate(availableMonths.latestDate)
    );
  }, [availableMonths]);

  return (
    <Select
      items={periods}
      isLoading={isLoading}
      isDisabled={!availableMonths}
      label="Pilih Periode"
      placeholder="Pilih Periode Analisis"
      selectionMode="single"
      classNames={{
        base: "max-w-sm",
        trigger: "bg-background shadow-small",
      }}
    >
      {([key, item]) => (
        <SelectItem key={key} value={item.start.toString()}>
          {key}
        </SelectItem>
      )}
    </Select>
  );
}
