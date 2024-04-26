"use client";

import { useGetMaterials } from "@/queries/material.query";
import { StockStatus } from "@/types/app.type";
import { GetMaterialsSingle } from "@/types/material.type";
import { formatNumber } from "@/utils/formatter";
import { toPascalCase } from "@/utils/string";
import { Chip, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MaterialDeleteModal } from "./MaterialDeleteModal";
import { MaterialTableCellAction } from "./MaterialTableCellAction";
import { DataTable, DataTableHandleCellValueArgs } from "./ui/DataTable";

type MaterialKeys = keyof GetMaterialsSingle | "action";

export function MaterialsTable() {
  const router = useRouter();
  const columns: { key: MaterialKeys; label: string }[] = [
    {
      key: "index",
      label: "NO",
    },
    {
      key: "name",
      label: "NAMA BAHAN",
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
      key: "unit",
      label: "SATUAN",
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
  const { data, isLoading, error, isPending } = useGetMaterials({ page });

  const {
    isOpen: isDeleteDialogOpen,
    onOpen: openDeleteDialog,
    onOpenChange: onDeleteDialogOpenChange,
    onClose: onDeleteDialogClose,
  } = useDisclosure();
  const [deleteSelectedMaterial, setDeleteSelectedMaterial] =
    useState<GetMaterialsSingle | null>(null);

  const handleRowValue = ({
    key: columnKey,
    item,
    value,
  }: DataTableHandleCellValueArgs<GetMaterialsSingle>): any => {
    if (typeof value === "number") value = formatNumber(value);

    if (columnKey === "stockStatus") {
      const stockStatus = value as GetMaterialsSingle["stockStatus"];
      const isOk = stockStatus === StockStatus.OK;
      value = (
        <Chip size="sm" color={isOk ? "success" : "warning"} variant="flat">
          {isOk ? "Stok OK" : "Restock"}
        </Chip>
      );
    }

    if (columnKey === "unit") {
      value = toPascalCase(value);
    }

    if (columnKey === "action") {
      value = (
        <MaterialTableCellAction
          item={item}
          openDeleteDialog={openDeleteDialog}
          setDeleteSelectedMaterial={setDeleteSelectedMaterial}
        />
      );
    }
    return value;
  };

  return (
    <>
      <MaterialDeleteModal
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onOpenChange={onDeleteDialogOpenChange}
        material={deleteSelectedMaterial}
        setMaterial={setDeleteSelectedMaterial}
      />

      <DataTable
        columns={columns}
        items={data?.materials}
        count={data?.count}
        page={page}
        setPage={setPage}
        emptyContent={"Tidak ada bahan baku yang ditemukan."}
        errorContent={error?.message}
        isLoading={isPending || isLoading}
        onRowAction={(key) => router.push(`/materials/${key}`)}
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
