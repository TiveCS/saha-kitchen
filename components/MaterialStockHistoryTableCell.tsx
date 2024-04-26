"use client";

import { MaterialStockHistory } from "@/types/material.type";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { DotsThreeVertical } from "@phosphor-icons/react";

interface MaterialStockHistoryTableCellProps {
  item: MaterialStockHistory;
  openDeleteDialog: () => void;
  openEditDialog: () => void;
  setSelectedHistory: (stockHistory: MaterialStockHistory | null) => void;
}

export function MaterialStockHistoryTableCell({
  item,
  openDeleteDialog,
  openEditDialog,
  setSelectedHistory,
}: MaterialStockHistoryTableCellProps) {
  return (
    <div className="relative flex justify-start items-center gap-2">
      <Dropdown>
        <DropdownTrigger>
          <Button size="sm" isIconOnly variant="light">
            <DotsThreeVertical className="w-6 h-6" />
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          aria-label="Aksi Baris Riwayat Stok"
          onAction={(key) => {
            if (key === "delete") {
              setSelectedHistory(item);
              openDeleteDialog();
            }

            if (key === "edit") {
              setSelectedHistory(item);
              openEditDialog();
            }
          }}
        >
          <DropdownItem key={"edit"}>Edit</DropdownItem>
          <DropdownItem key={"delete"} className="text-danger" color="danger">
            Hapus
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
