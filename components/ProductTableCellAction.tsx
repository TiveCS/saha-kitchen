"use client";

import { GetProductsSingle } from "@/types/product.type";
import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface ProductTableCellActionProps {
  item: GetProductsSingle;
  openDeleteDialog: () => void;
  setDeleteSelectedProduct: (product: GetProductsSingle) => void;
}

export function ProductTableCellAction({
  item,
  openDeleteDialog,
  setDeleteSelectedProduct,
}: ProductTableCellActionProps) {
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
              setDeleteSelectedProduct(item);
              openDeleteDialog();
            }

            if (key === "details") {
              router.push(`/products/${item.id}`);
            }

            if (key === "edit") {
              router.push(`/products/${item.id}/edit`);
            }
          }}
        >
          <DropdownItem key={"details"}>Detail</DropdownItem>
          <DropdownItem key={"edit"}>Edit</DropdownItem>
          <DropdownItem key={"delete"} className="text-danger" color="danger">
            Hapus
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
