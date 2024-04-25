"use client";

import { GetSalesMany, GetSalesSingle } from "@/types/sales.type";
import { formatNumber, formatReadableDate } from "@/utils/formatter";
import { Chip, useDisclosure } from "@nextui-org/react";
import { PurchaseSystem } from "@prisma/client";
import { useState } from "react";
import { SalesDeleteModal } from "./SalesDeleteModal";
import { SalesTableCellAction } from "./SalesTableCellAction";
import { DataTable, DataTableHandleCellValueArgs } from "./ui/DataTable";

type SalesKeys = keyof GetSalesSingle | "action";

interface SalesTableProps {
  count?: number;
  sales?: GetSalesMany;
  error: Error | null;
  isLoading?: boolean;
  page: number;
  setPage: (page: number) => void;
}

export function SalesTable({
  sales,
  count,
  isLoading,
  error,
  page,
  setPage,
}: SalesTableProps) {
  const columns: { key: SalesKeys; label: string }[] = [
    {
      key: "index",
      label: "NO",
    },
    {
      key: "occurredAt",
      label: "TANGGAL PENJUALAN",
    },
    {
      key: "amount",
      label: "JUMLAH PENJUALAN",
    },
    {
      key: "purchaseSystem",
      label: "SISTEM PEMBELIAN",
    },
    {
      key: "action",
      label: "AKSI",
    },
  ];

  const {
    isOpen: isDeleteDialogOpen,
    onOpen: openDeleteDialog,
    onOpenChange: onDeleteDialogOpenChange,
    onClose: onDeleteDialogClose,
  } = useDisclosure();
  const [deleteSelectedSales, setDeleteSelectedSales] =
    useState<GetSalesSingle | null>(null);

  const handleRowValue = ({
    item,
    key,
    value,
  }: DataTableHandleCellValueArgs<GetSalesSingle>) => {
    if (typeof value === "number") value = formatNumber(value);

    if (value instanceof Date) {
      value = formatReadableDate(value);
    }

    if (key === "action") {
      value = (
        <SalesTableCellAction
          item={item}
          openDeleteDialog={openDeleteDialog}
          setDeleteSelectedSales={setDeleteSelectedSales}
        />
      );
    }

    if (key === "purchaseSystem") {
      switch (value as PurchaseSystem) {
        case PurchaseSystem.READY:
          value = (
            <Chip color="success" variant="flat" size="sm">
              Ready
            </Chip>
          );
          break;
        case PurchaseSystem.PRE_ORDER:
          value = (
            <Chip color="warning" variant="flat" size="sm">
              Pre Order
            </Chip>
          );
      }
    }

    return value;
  };

  return (
    <>
      <SalesDeleteModal
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onOpenChange={onDeleteDialogOpenChange}
        sales={deleteSelectedSales}
        setSales={setDeleteSelectedSales}
      />

      <DataTable
        columns={columns}
        items={sales}
        count={count}
        page={page}
        setPage={setPage}
        emptyContent={"Tidak ada data penjualan yang ditemukan."}
        errorContent={error?.message}
        isLoading={isLoading}
        rowKey={(item) => item.id}
        handleCellValue={handleRowValue}
        classNames={{
          wrapper: "max-h-96",
        }}
      />
    </>
  );
}
