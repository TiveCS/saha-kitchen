"use client";

import { GetProductsMany } from "@/types/product.type";
import { AnalyticsProductSelector } from "./AnalyticsProductSelector";
import { useState } from "react";
import { AnalyticsTotalSales } from "./AnalyticsSales";
import { Card, CardBody, Selection } from "@nextui-org/react";
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

      <Card id="top-area" className="h-[17rem]">
        <CardBody className="grid grid-cols-3 items-center gap-x-6">
          <AnalyticsTotalSales selectedProducts={selectedProducts} />

          <AnalyticsSalesTrends selectedProducts={selectedProducts} />
        </CardBody>
      </Card>
    </>
  );
}
