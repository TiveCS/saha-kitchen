"use client";

import { GetProductsMany } from "@/types/product.type";
import { AnalyticsProductSelector } from "./AnalyticsProductSelector";
import { useState } from "react";
import { AnalyticsTotalSales } from "./AnalyticsSales";
import { Card, CardBody, Selection } from "@nextui-org/react";

interface AnalyticsSectionProps {
  products: GetProductsMany;
}

export function AnalyticsSection({ products }: AnalyticsSectionProps) {
  const [selectedProducts, setSelectedProducts] = useState<Selection>(
    new Set()
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

      <Card id="top-area" className="h-64">
        <CardBody className="grid grid-cols-3 gap-x-6">
          <AnalyticsTotalSales selectedProducts={selectedProducts} />
        </CardBody>
      </Card>
    </>
  );
}
