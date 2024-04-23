"use client";

import { GetMaterialsSingle } from "@/types/material.type";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface MaterialTableCellActionProps {
  item: GetMaterialsSingle;
  openDeleteDialog: () => void;
  setDeleteSelectedMaterial: (product: GetMaterialsSingle) => void;
}

export function MaterialTableCellAction({
  item,
  openDeleteDialog,
  setDeleteSelectedMaterial,
}: MaterialTableCellActionProps) {
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
          aria-label="Aksi Baris Bahan Baku"
          onAction={(key) => {
            if (key === "delete") {
              setDeleteSelectedMaterial(item);
              openDeleteDialog();
            }

            if (key === "details") {
              router.push(`/materials/${item.id}`);
            }

            if (key === "edit") {
              router.push(`/materials/${item.id}/edit`);
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
