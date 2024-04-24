"use client";

import { GetSalesSingle } from "@/types/sales.type";
import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface SalesTableCellActionProps {
  item: GetSalesSingle;
  openDeleteDialog: () => void;
  setDeleteSelectedSales: (Sales: GetSalesSingle) => void;
}

export function SalesTableCellAction({
  item,
  openDeleteDialog,
  setDeleteSelectedSales,
}: SalesTableCellActionProps) {
  const router = useRouter();

  return (
    <div className="relative flex justify-start items-center gap-2">
      <Dropdown>
        <DropdownTrigger>
          <Button size="sm" isIconOnly variant="light">
            <DotsThreeVertical className="w-6 h-6" />
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          aria-label="Aksi Baris Produk"
          onAction={(key) => {
            if (key === "delete") {
              setDeleteSelectedSales(item);
              openDeleteDialog();
            }

            if (key === "details") {
              router.push(`/sales/${item.id}`);
            }

            if (key === "edit") {
              router.push(`/sales/${item.id}/edit`);
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
