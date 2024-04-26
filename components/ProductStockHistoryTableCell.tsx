"use client";

import { ProductStockHistory } from "@/types/product.type";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { DotsThreeVertical } from "@phosphor-icons/react";

interface ProductStockHistoryTableCellProps {
  item: ProductStockHistory;
  openDeleteDialog: () => void;
  openEditDialog: () => void;
  setSelectedHistory: (stockHistory: ProductStockHistory | null) => void;
}

export function ProductStockHistoryTableCell({
  item,
  openDeleteDialog,
  openEditDialog,
  setSelectedHistory,
}: ProductStockHistoryTableCellProps) {
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
