"use client";

import Loading from "@/app/(dashboard)/loading";
import { MaterialDetail, MaterialStockHistory } from "@/types/material.type";
import { ProductStockHistory } from "@/types/product.type";
import { formatNumber, formatReadableDate } from "@/utils/formatter";
import { Tab, Tabs, useDisclosure } from "@nextui-org/react";
import { Suspense, useState } from "react";
import { DeleteMaterialStockHistoryModal } from "./DeleteMaterialStockHistoryModal";
import { EditMaterialStockHistoryModal } from "./EditMaterialStockHistoryModal";
import { MaterialStockHistoryTableCell } from "./MaterialStockHistoryTableCell";
import { DataTable, DataTableHandleCellValueArgs } from "./ui/DataTable";

type StockHistoryKeys = keyof ProductStockHistory | "action";

interface MaterialDetailStockTabProps {
  material: MaterialDetail;
}

function MaterialDetailStockTab({ material }: MaterialDetailStockTabProps) {
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
    useState<MaterialStockHistory | null>(null);

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
  }: DataTableHandleCellValueArgs<MaterialStockHistory>): any => {
    if (typeof value === "number") value = formatNumber(value);

    if (key === "occurredAt") value = formatReadableDate(value);

    if (key === "action")
      return (
        <MaterialStockHistoryTableCell
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
      <DeleteMaterialStockHistoryModal
        isOpen={isDeleteOpen}
        onOpenChange={onOpenChangeDelete}
        onClose={closeDeleteDialog}
        stock={selectedStockHistory}
        setStock={setSelectedStockHistory}
      />

      <EditMaterialStockHistoryModal
        stock={selectedStockHistory}
        isOpen={isEditOpen}
        onOpenChange={onOpenChangeEdit}
      />

      <DataTable
        columns={stockColumns}
        items={material.stockHistories}
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

interface MaterialDetailTabsProps {
  material: MaterialDetail;
}

export function MaterialDetailTabs({ material }: MaterialDetailTabsProps) {
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
        <MaterialDetailStockTab material={material} />
      </Tab>
    </Tabs>
  );
}
