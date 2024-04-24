"use client";

import { Button, Link } from "@nextui-org/react";
import { Plus } from "@phosphor-icons/react";
import { SalesProductSelector } from "./SalesProductSelector";
import { SalesTable } from "./SalesTable";
import { GetProductsMany, GetProductsSingle } from "@/types/product.type";
import { useEffect, useState } from "react";
import { useGetSalesMutation, useGetSalesQuery } from "@/queries/sales.query";

interface SalesListSectionProps {
  products: GetProductsMany;
}

export function SalesListSection({ products }: SalesListSectionProps) {
  const [tablePage, setTablePage] = useState(1);
  const [productId, setProductId] = useState<string | null>(products[0]?.id);

  const { data, error, isLoading, isFetching, isPending } = useGetSalesQuery({
    productId,
    page: tablePage,
    take: 6,
  });

  return (
    <section className="flex-1 flex flex-col w-full px-8 py-4 gap-y-6">
      <header className="flex flex-row-reverse justify-between">
        <Button
          as={Link}
          href="/sales/add"
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
        >
          Tambah Data Penjualan
        </Button>

        <SalesProductSelector
          products={products}
          productId={productId}
          setProductId={setProductId}
        />
      </header>

      <SalesTable
        count={data?.count}
        sales={data?.sales}
        isLoading={isPending || isLoading || isFetching}
        error={error}
        page={tablePage}
        setPage={setTablePage}
      />
    </section>
  );
}
