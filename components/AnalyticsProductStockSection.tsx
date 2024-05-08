"use client";

import { useGetProductMaterialsStock } from "@/queries/product.query";
import { ProductMaterialStockAnalytic } from "@/types/product.type";
import {
  Card,
  CardBody,
  ScrollShadow,
  Selection,
  Skeleton,
} from "@nextui-org/react";
import { Bar, Chart } from "react-chartjs-2";

interface AnalyticsProductStockSectionProps {
  selectedProducts: Selection;
}

export function AnalyticsProductStockSection({
  selectedProducts,
}: AnalyticsProductStockSectionProps) {
  return (
    <div className="col-span-3 grid grid-cols-2 gap-4">
      {Array.from(selectedProducts).map((productId) => (
        <AnalyticsProductStock
          key={productId}
          productId={productId.toString()}
        />
      ))}
    </div>
  );
}

interface AnalyticsProductStockProps {
  productId: string;
}

export function AnalyticsProductStock({
  productId,
}: AnalyticsProductStockProps) {
  const { data, isLoading } = useGetProductMaterialsStock({ productId });

  if (isLoading)
    return <Skeleton className="h-[12rem] w-full rounded-lg bg-gray-200" />;

  return (
    <Card className="h-fit">
      <CardBody className="flex items-center">
        {data ? (
          <>
            <h6 className="text-sm font-medium mb-1.5">
              Stok Produk {data.productName}
            </h6>

            <Chart
              type="bar"
              data={{
                datasets: [
                  {
                    type: "line",
                    label: "Minimum Stok",
                    data: data.stocks.map(() => 50),
                    borderColor: "#ea580c",
                    backgroundColor: "#ea580c",
                  },
                  {
                    type: "bar",
                    label: "Stok",
                    data: data.stocks.map((stock) => stock.percentage),
                    backgroundColor: "#7dd3fc",
                  },
                ],
                labels: data.stocks.map((stock) => stock.materialName),
              }}
              options={{
                responsive: true,
                interaction: {
                  mode: "index",
                },
                plugins: {
                  legend: { display: true },
                  tooltip: {
                    callbacks: {
                      label(tooltipItem) {
                        const stock = data.stocks[tooltipItem.parsed.x];

                        // if "Minimum Stok"
                        if (tooltipItem.datasetIndex === 0) {
                          return `${tooltipItem.dataset.label}: ${stock.minimumStock}`;
                        }

                        return `${tooltipItem.dataset.label}: ${stock.currentStock}`;
                      },
                      footer(tooltipItems) {
                        let percentage = 0;

                        tooltipItems.forEach((tooltipItem) => {
                          const stock = data.stocks[tooltipItem.parsed.x];
                          percentage = stock.percentage;
                        });

                        return `Persentase Stok: ${percentage}%`;
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    min: 0,
                    max: 100,
                    ticks: {
                      callback: (value) => `${value}%`,
                    },
                  },
                },
              }}
            />
          </>
        ) : (
          <p className="text-default-500">Tidak ada data stok</p>
        )}
      </CardBody>
    </Card>
  );
}
