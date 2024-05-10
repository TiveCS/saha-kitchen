"use client";

import { useGetSalesTrendsForProducts } from "@/queries/sales.query";
import { Select, SelectItem, Selection, Skeleton } from "@nextui-org/react";
import { useState } from "react";
import { Line } from "react-chartjs-2";

interface AnalyticsSalesTrendsProps {
  selectedProducts: Selection;
}

const MonthLabel = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "Mei",
  6: "Jun",
  7: "Jul",
  8: "Agu",
  9: "Sep",
  10: "Okt",
  11: "Nov",
  12: "Des",
} as const;

const AvailableColors: { border: string; background: string }[] = [
  { border: "rgb(255, 99, 132)", background: "rgb(255, 99, 132)" },
  { border: "rgb(54, 162, 235)", background: "rgb(54, 162, 235)" },
  { border: "rgb(255, 205, 86)", background: "rgb(255, 205, 86)" },
  { border: "rgb(75, 192, 192)", background: "rgb(75, 192, 192)" },
  { border: "rgb(153, 102, 255)", background: "rgb(153, 102, 255)" },
  { border: "rgb(255, 159, 64)", background: "rgb(255, 159, 64)" },
  { border: "rgb(255, 99, 132)", background: "rgb(255, 99, 132)" },
  { border: "rgb(54, 162, 235)", background: "rgb(54, 162, 235)" },
  { border: "rgb(255, 205, 86)", background: "rgb(255, 205, 86)" },
  { border: "rgb(75, 192, 192)", background: "rgb(75, 192, 192)" },
  { border: "rgb(153, 102, 255)", background: "rgb(153, 102, 255)" },
  { border: "rgb(255, 159, 64)", background: "rgb(255, 159, 64)" },
] as const;

function getAvailableColors(index: number) {
  return AvailableColors[index % AvailableColors.length];
}

export function AnalyticsSalesTrends({
  selectedProducts,
}: AnalyticsSalesTrendsProps) {
  const [selectedYear, setSelectedYear] = useState<Selection>(
    new Set<string>()
  );

  const { data, isLoading, isPending, isFetching } =
    useGetSalesTrendsForProducts({
      productIds: Array.from(selectedProducts).map((id) => id.toString()),
      year: selectedYear ? Number(Array.from(selectedYear)[0]) : undefined,
    });

  if (!data || isLoading || isPending || isFetching) {
    return <Skeleton className="bg-default-200 rounded-md h-full w-full" />;
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <header className="flex flex-row justify-between items-center">
          <h6 className="text-sm font-medium">Tren Penjualan Keseluruhan</h6>
          <Select
            placeholder="Pilih Tahun"
            aria-label="Pilih Tahun Tren"
            items={data.availableYears ?? []}
            isLoading={isLoading || isPending}
            selectionMode="single"
            selectedKeys={selectedYear}
            onSelectionChange={setSelectedYear}
            size="sm"
            className="max-w-[8rem]"
            defaultSelectedKeys={[data.availableYears[0]]}
          >
            {data.availableYears.map((year) => (
              <SelectItem key={year} value={year} textValue={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </Select>
        </header>

        {!data.trends || data.trends.size === 0 ? (
          <div className="flex items-center justify-center h-full w-full border border-default-200 rounded-md">
            <p className="text-default-500">Tidak ada data Tren</p>
          </div>
        ) : (
          <Line
            data={{
              labels: Object.values(MonthLabel),
              datasets: Array.from(data.trends).map(([, trend], index) => {
                const color = getAvailableColors(index);
                return {
                  label: trend.productName,
                  data: trend.monthlySales,
                  borderColor: color.border,
                  backgroundColor: color.background,
                };
              }),
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    boxWidth: 8,
                    boxHeight: 8,
                  },
                },
              },
            }}
          />
        )}
      </div>
    </>
  );
}
