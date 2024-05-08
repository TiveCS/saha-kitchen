"use client";

import { GetProductsMany } from "@/types/product.type";
import { Card, CardBody, Selection } from "@nextui-org/react";
import { useState } from "react";
import { AnalyticsProductSelector } from "./AnalyticsProductSelector";
import { AnalyticsProductStockSection } from "./AnalyticsProductStockSection";
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

  return (
    <>
      <section id="product-selector" className="mb-6">
        <AnalyticsProductSelector
          products={products}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      </section>

      <div className="flex flex-col gap-y-2">
        <Card id="top-area" className="h-[18rem]">
          <CardBody className="grid grid-cols-3 items-center gap-x-6">
            <AnalyticsTotalSales selectedProducts={selectedProducts} />

            <AnalyticsSalesTrends selectedProducts={selectedProducts} />
          </CardBody>
        </Card>

        <div className="grid grid-cols-5 gap-x-6 min-h-[32rem] py-4">
          <Card className="col-span-2">
            <CardBody>test</CardBody>
          </Card>

          <AnalyticsProductStockSection selectedProducts={selectedProducts} />
        </div>
      </div>
    </>
  );
}
