"use client";

import { TIMEZONE } from "@/constants";
import { GetProductsMany } from "@/types/product.type";
import {
  Card,
  CardBody,
  DateValue,
  RangeValue,
  Selection,
} from "@nextui-org/react";
import { useState } from "react";
import { AnalyticsMonthSelector } from "./AnalyticsMonthSelector";
import { AnalyticsProductAvailabilitySection } from "./AnalyticsProductAvailabilitySection";
import { AnalyticsProductMaterialStockSection } from "./AnalyticsProductMaterialsStockSection";
import { AnalyticsProductSelector } from "./AnalyticsProductSelector";
import { AnalyticsTotalSales } from "./AnalyticsSales";
import { AnalyticsSalesTrends } from "./AnalyticsSalesTrends";

interface AnalyticsSectionProps {
  products: GetProductsMany;
}

export function AnalyticsSection({ products }: AnalyticsSectionProps) {
  const [selectedProducts, setSelectedProducts] = useState<Selection>(
    new Set(
      products
        .map((product) => product?.id)
        .filter((id) => id !== undefined)
        .slice(0, 4)
    )
  );

  const [period, setPeriod] = useState<RangeValue<DateValue> | null>(null);

  const startPeriod = period?.start.toDate(TIMEZONE);
  const endPeriod = period?.end.toDate(TIMEZONE);

  return (
    <>
      <section
        id="product-selector"
        className="mb-6 grid grid-cols-2 items-center gap-x-8"
      >
        <AnalyticsProductSelector
          products={products}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />

        <AnalyticsMonthSelector
          selectedProducts={selectedProducts}
          period={period}
          setPeriod={setPeriod}
        />
      </section>

      <div className="flex flex-col gap-y-2">
        <Card id="top-area">
          <CardBody className="grid grid-cols-3 items-center gap-x-6">
            <AnalyticsTotalSales
              selectedProducts={selectedProducts}
              startOccurredDate={startPeriod}
              endOccurredDate={endPeriod}
            />

            <AnalyticsSalesTrends selectedProducts={selectedProducts} />
          </CardBody>
        </Card>

        <div className="grid grid-cols-5 gap-x-6 min-h-[32rem] py-4">
          <AnalyticsProductAvailabilitySection
            selectedProducts={selectedProducts}
            startPeriodDate={startPeriod}
            endPeriodDate={endPeriod}
          />

          <AnalyticsProductMaterialStockSection
            selectedProducts={selectedProducts}
          />
        </div>
      </div>
    </>
  );
}
