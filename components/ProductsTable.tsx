"use client";

import { useGetProducts } from "@/queries/product.query";
import { StockStatus } from "@/types/app.type";
import { GetProductsSingle } from "@/types/product.type";
import { formatNumber } from "@/utils/formatter";
import { Chip, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductDeleteModal } from "./ProductDeleteModal";
import { ProductTableCellAction } from "./ProductTableCellAction";
import { DataTable, DataTableHandleCellValueArgs } from "./ui/DataTable";

type ProductKeys = keyof GetProductsSingle | "action";

interface ProductsTableProps {}

export function ProductsTable({}: ProductsTableProps) {
  const router = useRouter();
  const columns: { key: ProductKeys; label: string }[] = [
    {
      key: "index",
      label: "NO",
    },
    {
      key: "name",
      label: "NAMA PRODUK",
    },
    {
      key: "minimumStock",
      label: "STOK MINIMUM",
    },
    {
      key: "stock",
      label: "STOK SAAT INI",
    },
    {
      key: "price",
      label: "HARGA SATUAN (Rp)",
    },
    {
      key: "asset",
      label: "TOTAL ASET (Rp)",
    },
    {
      key: "stockStatus",
      label: "STATUS",
    },
    {
      key: "action",
      label: "AKSI",
    },
  ];

  const [page, setPage] = useState(1);

  const { data, isLoading, isPending, error } = useGetProducts({
    page,
    take: 6,
  });

  const {
    isOpen: isDeleteDialogOpen,
    onOpen: openDeleteDialog,
    onOpenChange: onDeleteDialogOpenChange,
    onClose: onDeleteDialogClose,
  } = useDisclosure();
  const [deleteSelectedProduct, setDeleteSelectedProduct] =
    useState<GetProductsSingle | null>(null);

  const handleRowValue = ({
    item,
    key: columnKey,
    value,
  }: DataTableHandleCellValueArgs<GetProductsSingle>): any => {
    if (typeof value === "number") value = formatNumber(value);

    if (columnKey === "stockStatus") {
      const stockStatus = value as GetProductsSingle["stockStatus"];
      const isOk = stockStatus === StockStatus.OK;
      value = (
        <Chip size="sm" color={isOk ? "success" : "warning"} variant="flat">
          {isOk ? "Stok OK" : "Restock"}
        </Chip>
      );
    }

    if (columnKey === "action") {
      value = (
        <ProductTableCellAction
          item={item}
          openDeleteDialog={openDeleteDialog}
          setDeleteSelectedProduct={setDeleteSelectedProduct}
        />
      );
    }
    return value;
  };

  return (
    <>
      <ProductDeleteModal
        product={deleteSelectedProduct}
        setProduct={setDeleteSelectedProduct}
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onOpenChange={onDeleteDialogOpenChange}
      />

      <DataTable
        columns={columns}
        items={data?.products}
        count={data?.count}
        page={page}
        setPage={setPage}
        emptyContent={"Tidak ada produk yang ditemukan."}
        errorContent={error?.message}
        isLoading={isPending || isLoading}
        onRowAction={(key) => router.push(`/products/${key}`)}
        handleCellValue={handleRowValue}
        rowKey={(item) => item.id}
        classNames={{
          wrapper: "max-h-96",
          tr: "cursor-pointer",
        }}
      />
    </>
  );
}
