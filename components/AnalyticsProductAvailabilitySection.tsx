"use client";

import { useGetProductsAvailabilityAnalytics } from "@/queries/product.query";
import { getLocalTimeZone, today } from "@internationalized/date";
import {
  Card,
  CardBody,
  CardHeader,
  DateRangePicker,
  Selection,
  Skeleton,
} from "@nextui-org/react";
import { CalendarDots } from "@phosphor-icons/react";
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

  const { data, isLoading } = useGetProductsAvailabilityAnalytics({
    productIds,
    startPeriodDate,
    endPeriodDate,
  });

  if (isLoading) {
    return <Skeleton className="col-span-2 bg-gray-200 rounded-lg" />;
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="gap-y-4 flex flex-col flex-1 mb-4">
          <h6>Grafik Persediaan Produk</h6>

          <DateRangePicker
            label="Periode"
            size="sm"
            fullWidth
            maxValue={today(getLocalTimeZone())}
            selectorIcon={<CalendarDots className="w-5 h-5" />}
          />
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
