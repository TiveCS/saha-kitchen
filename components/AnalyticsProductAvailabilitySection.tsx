"use client";

import { useGetProductsAvailabilityAnalytics } from "@/queries/product.query";
import { getListWeeksOfMonth, toCalendarDate } from "@/utils/calendar-date";
import { formatReadableDate, formatReadableDateMonth } from "@/utils/formatter";
import { getLocalTimeZone } from "@internationalized/date";
import {
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
  Skeleton,
  type Selection,
} from "@nextui-org/react";
import { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";

interface AnalyticsProductAvailabilitySectionProps {
  selectedProducts: Selection;
  startPeriodDate?: Date;
  endPeriodDate?: Date;
}

export function AnalyticsProductAvailabilitySection({
  selectedProducts,
  startPeriodDate,
  endPeriodDate,
}: AnalyticsProductAvailabilitySectionProps) {
  const productIds = Array.from(selectedProducts).map((productId) =>
    productId.toString()
  );

  const [selectedWeek, setSelectedWeek] = useState<Selection>(new Set());

  const weeks = useMemo(() => {
    if (!startPeriodDate) return;

    return getListWeeksOfMonth(toCalendarDate(startPeriodDate));
  }, [startPeriodDate]);

  const selectedPeriod = useMemo(() => {
    if (!weeks || weeks.length === 0) return;

    return weeks.find((week) => {
      return Array.from(selectedWeek).includes(week.label);
    });
  }, [selectedWeek, weeks]);

  const { data, isLoading } = useGetProductsAvailabilityAnalytics({
    productIds,
    startPeriodDate: selectedPeriod?.start.toDate(getLocalTimeZone()),
    endPeriodDate: selectedPeriod?.end.toDate(getLocalTimeZone()),
  });

  if (isLoading) {
    return <Skeleton className="col-span-2 bg-gray-200 rounded-lg" />;
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="gap-y-4 flex flex-col flex-1 mb-4">
          <h6>Grafik Persediaan Produk</h6>

          <Select
            label="Pilihan Minggu"
            placeholder="Pilih periode dalam minggu"
            items={weeks ?? []}
            isDisabled={!weeks || weeks.length === 0}
            selectedKeys={selectedWeek}
            size="sm"
            labelPlacement="outside"
            onSelectionChange={(keys) => {
              setSelectedWeek(keys);
            }}
            selectionMode="single"
          >
            {(item) => {
              const { label } = item;
              const formattedStart = formatReadableDate(
                item.start.toDate(getLocalTimeZone())
              );
              const formattedEnd = formatReadableDate(
                item.end.toDate(getLocalTimeZone())
              );
              const displayLabel = `${label} - (${formattedStart} - ${formattedEnd})`;

              return (
                <SelectItem key={label} value={label}>
                  {displayLabel}
                </SelectItem>
              );
            }}
          </Select>
        </div>
      </CardHeader>

      <CardBody className="flex items-center">
        {data ? (
          <Bar
            data={{
              labels: data.map((p) => p.productName),
              datasets: [
                {
                  label: "Stok Terbaru",
                  data: data.map((p) => p.latestStock),
                  backgroundColor: "#7dd3fc",
                },
                {
                  label: "Terjual",
                  data: data.map((p) => p.sales),
                  backgroundColor: "#6ee7b7",
                },
                {
                  label: "Stok Akhir",
                  data: data.map((p) => p.currentStock),
                  backgroundColor: "#f87171",
                },
              ],
            }}
            options={{
              interaction: {
                mode: "index",
              },
            }}
          />
        ) : (
          <p>Data tidak tersedia</p>
        )}
      </CardBody>
    </Card>
  );
}
