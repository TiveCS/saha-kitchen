"use client";

import { useGetTotalSalesForProducts } from "@/queries/sales.query";
import { Selection, Skeleton } from "@nextui-org/react";
import { Decimal } from "decimal.js";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";

interface AnalyticsTotalSalesProps {
  selectedProducts: Selection;
}

export function AnalyticsTotalSales({
  selectedProducts,
}: AnalyticsTotalSalesProps) {
  const {
    data: productsSales,
    isLoading,
    isPending,
  } = useGetTotalSalesForProducts({
    productIds: Array.from(selectedProducts).map((id) => id.toString()),
  });

  const soldProductPercentage: Map<string, Decimal> = useMemo(() => {
    const result = new Map<string, Decimal>();
    if (!productsSales) return result;

    productsSales.forEach((product) => {
      const totalSalesDec = new Decimal(product.totalSales);
      const latestStockDec = new Decimal(product.latestStock);

      const percentage = totalSalesDec.div(latestStockDec).times(100);

      result.set(product.productId, percentage);
    });

    return result;
  }, [productsSales]);

  if (!productsSales || isLoading || isPending)
    return (
      <>
        <Skeleton className="bg-default-300 rounded-md h-full w-full" />
        <Skeleton className="bg-default-300 rounded-md h-full w-full" />
      </>
    );

  if (productsSales.length === 0) {
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
            labels: productsSales.map((d) => d.productName),
            datasets: [
              {
                label: "Total Penjualan",
                data: productsSales.map((d) => d.totalSales),
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
            labels: productsSales.map((d) => d.productName),
            datasets: [
              {
                data: productsSales.map(
                  (d) => soldProductPercentage.get(d.productId)?.toNumber() || 0
                ),
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
            scales: {
              x: {
                min: 0,
                max: 100,
                ticks: {
                  callback: (value) => `${value}%`,
                },
              },
            },
          }}
        />
      </div>
    </>
  );
}
