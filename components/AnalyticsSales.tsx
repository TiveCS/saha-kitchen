"use client";

import { useGetTotalSalesForProducts } from "@/queries/sales.query";
import { Selection, Skeleton } from "@nextui-org/react";
import { Bar } from "react-chartjs-2";

interface AnalyticsTotalSalesProps {
  selectedProducts: Selection;
}

export function AnalyticsTotalSales({
  selectedProducts,
}: AnalyticsTotalSalesProps) {
  const { data, isLoading, isPending } = useGetTotalSalesForProducts({
    productIds: Array.from(selectedProducts).map((id) => id.toString()),
  });

  if (!data || isLoading || isPending)
    return (
      <>
        <Skeleton className="bg-default-300 rounded-md h-full w-full" />
        <Skeleton className="bg-default-300 rounded-md h-full w-full" />
      </>
    );

  if (data.length === 0) {
    return (
      <>
        <div className="flex items-center justify-center h-full w-full border border-default-200 rounded-md">
          <p className="text-default-500">Tidak ada data Penjualan</p>
        </div>

        <div className="flex items-center justify-center h-full w-full border border-default-200 rounded-md">
          <p className="text-default-500">Tidak ada data Penjualan</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col">
        <h6 className="text-sm font-medium">Total Penjualan Keseluruhan</h6>

        <Bar
          data={{
            labels: data.map((d) => d.productName),
            datasets: [
              {
                label: "Total Penjualan",
                data: data.map((d) => d.totalSales),
                backgroundColor: "rgba(53, 162, 235, 0.5)",
              },
            ],
          }}
          options={{
            responsive: true,
          }}
        />
      </div>

      <div className="flex flex-col">
        <h6 className="text-sm font-medium">Grafik Produk Laku</h6>

        <Bar
          data={{
            labels: data.map((d) => d.productName),
            datasets: [
              {
                data: data.map((d) => d.totalSales),
                backgroundColor: "#f9a8d4",
              },
            ],
          }}
          options={{
            responsive: true,
            indexAxis: "y",
            plugins: {
              legend: { display: false },
            },
          }}
        />
      </div>
    </>
  );
}
