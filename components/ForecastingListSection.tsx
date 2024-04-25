"use client";

import { useGetForecasting } from "@/queries/forecasting.query";
import { GetForecastingSingle } from "@/types/forecasting.type";
import { GetProductsMany } from "@/types/product.type";
import { formatNumber } from "@/utils/formatter";
import { useState } from "react";
import { ProductSelector } from "./ProductSelector";
import { DataTable, DataTableHandleCellValueArgs } from "./ui/DataTable";

type ForecastingKeys = keyof GetForecastingSingle;

interface ForecastingListSectionProps {
  products: GetProductsMany;
}

export function ForecastingListSection({
  products,
}: ForecastingListSectionProps) {
  const [productId, setProductId] = useState<string | null>(
    products[0]?.id ?? null
  );

  const { data, error, isLoading, isFetching, isPending } = useGetForecasting({
    productId,
  });

  const columns: { key: ForecastingKeys; label: string }[] = [
    {
      key: "week",
      label: "MINGGU",
    },
    {
      key: "sales",
      label: "JUMLAH PENJUALAN",
    },
    {
      key: "movingAverage",
      label: "MOVING AVERAGE",
    },
  ];

  const handleRowValue = ({
    key,
    value,
  }: DataTableHandleCellValueArgs<GetForecastingSingle>): any => {
    if (key === "movingAverage" && value === -1) return "-";

    if (typeof value === "number") value = formatNumber(value);

    return value;
  };

  return (
    <section className="flex-1 flex flex-col w-full px-8 py-4 gap-y-6">
      <header className="flex flex-row-reverse justify-between">
        <ProductSelector
          products={products}
          productId={productId}
          setProductId={setProductId}
        />
      </header>

      <DataTable
        columns={columns}
        items={data}
        emptyContent={"Tidak ada data forecasting yang ditemukan."}
        errorContent={error?.message}
        isLoading={isLoading || isFetching || isPending}
        handleCellValue={handleRowValue}
        rowKey={(item) => item.week.toString()}
        selectionMode="none"
        classNames={{
          wrapper: "max-h-96",
        }}
      />
    </section>
  );
}
