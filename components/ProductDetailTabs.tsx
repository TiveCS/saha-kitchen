"use client";

import { ProductDetail, ProductStockHistory } from "@/types/product.type";
import { Card, CardBody, Tab, Tabs, useDisclosure } from "@nextui-org/react";
import { DataTable, DataTableHandleCellValueArgs } from "./ui/DataTable";
import { formatNumber, formatReadableDate } from "@/utils/formatter";
import { Suspense, useState } from "react";
import Loading from "@/app/(dashboard)/loading";
import { EditProductStockHistoryModal } from "./EditProductStockHistoryModal";
import { ProductStockHistoryTableCell } from "./ProductStockHistoryTableCell";
import { DeleteProductStockHistoryModal } from "./DeleteProductStockHistoryModal";
import { ProductDetailsMaterialsTab } from "./ProductDetailMaterialsTab";

type StockHistoryKeys = keyof ProductStockHistory | "action";

interface ProductDetailStockTabProps {
  product: ProductDetail;
}

function ProductDetailStockTab({ product }: ProductDetailStockTabProps) {
  const stockColumns: { key: StockHistoryKeys; label: string }[] = [
    {
      key: "index",
      label: "NO",
    },
    {
      key: "occurredAt",
      label: "STOK PADA TANGGAL",
    },
    {
      key: "currentStock",
      label: "STOK TERCATAT",
    },
    {
      key: "reporter",
      label: "DICATAT OLEH",
    },
    {
      key: "action",
      label: "AKSI",
    },
  ];

  const [selectedStockHistory, setSelectedStockHistory] =
    useState<ProductStockHistory | null>(null);

  const {
    onOpen: openDeleteDialog,
    isOpen: isDeleteOpen,
    onOpenChange: onOpenChangeDelete,
    onClose: closeDeleteDialog,
  } = useDisclosure();
  const {
    onOpen: openEditDialog,
    isOpen: isEditOpen,
    onOpenChange: onOpenChangeEdit,
  } = useDisclosure();

  const handleStockRowValue = ({
    item,
    key,
    value,
  }: DataTableHandleCellValueArgs<ProductStockHistory>): any => {
    if (typeof value === "number") value = formatNumber(value);

    if (key === "occurredAt") value = formatReadableDate(value);

    if (key === "action")
      return (
        <ProductStockHistoryTableCell
          item={item}
          openDeleteDialog={openDeleteDialog}
          openEditDialog={openEditDialog}
          setSelectedHistory={setSelectedStockHistory}
        />
      );

    return value;
  };

  return (
    <Suspense fallback={<Loading />}>
      <DeleteProductStockHistoryModal
        isOpen={isDeleteOpen}
        onOpenChange={onOpenChangeDelete}
        onClose={closeDeleteDialog}
        stock={selectedStockHistory}
        setStock={setSelectedStockHistory}
      />

      <EditProductStockHistoryModal
        stock={selectedStockHistory}
        isOpen={isEditOpen}
        onOpenChange={onOpenChangeEdit}
      />

      <DataTable
        columns={stockColumns}
        items={product.stockHistories}
        rowKey={(row) => row.id}
        handleCellValue={handleStockRowValue}
        isHeaderSticky
        selectionMode="none"
        emptyContent="Tidak ditemukan data riwayat stok"
        classNames={{
          base: "flex-1 max-h-96",
        }}
      />
    </Suspense>
  );
}

interface ProductDetailTabsProps {
  product: ProductDetail;
}

export function ProductDetailTabs({ product }: ProductDetailTabsProps) {
  return (
    <Tabs
      aria-label="Tab Navigasi Produk"
      variant="underlined"
      color="primary"
      classNames={{
        panel: "flex-1 flex flex-col",
      }}
    >
      <Tab key="stock_history" title="Riwayat Stok">
        <ProductDetailStockTab product={product} />
      </Tab>

      <Tab key="materials" title="Bahan Baku">
        <ProductDetailsMaterialsTab product={product} />
      </Tab>
    </Tabs>
  );
}
