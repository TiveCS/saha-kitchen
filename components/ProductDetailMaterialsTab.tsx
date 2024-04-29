"use client";

import { ProductDetail, ProductMaterialDetail } from "@/types/product.type";
import { DataTable, DataTableHandleCellValueArgs } from "./ui/DataTable";
import { useState } from "react";
import { formatNumber } from "@/utils/formatter";
import { toPascalCase } from "@/utils/string";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { StockStatus } from "@/types/app.type";
import { Trash } from "@phosphor-icons/react";
import { useRemoveProductMaterials } from "@/queries/product.query";
import { toast } from "sonner";

interface ProductDetailMaterialsTabProps {
  product: ProductDetail;
}

type ProductMaterialKeys = keyof ProductMaterialDetail | "action";

export function ProductDetailsMaterialsTab({
  product,
}: ProductDetailMaterialsTabProps) {
  const columns: { key: ProductMaterialKeys; label: string }[] = [
    {
      key: "name",
      label: "BAHAN BAKU",
    },
    {
      key: "minimumStock",
      label: "STOK MINIMUM",
    },
    {
      key: "currentStock",
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

  const [selectedMaterial, setSelectedMaterial] =
    useState<ProductMaterialDetail | null>(null);

  const { mutateAsync: mutateRemoveMaterial, isPending: isRemovingMaterial } =
    useRemoveProductMaterials();

  const {
    isOpen: isDeleteOpen,
    onOpenChange: onOpenChangeDelete,
    onOpen: openDeleteDialog,
  } = useDisclosure();

  const handleRowValue = ({
    item,
    key,
    value,
  }: DataTableHandleCellValueArgs<ProductMaterialDetail>): any => {
    if (typeof value === "number") value = formatNumber(value);

    if (key === "unit") value = toPascalCase(value);

    if (key === "stockStatus")
      value = (
        <Chip
          size="sm"
          variant="flat"
          color={value === StockStatus.OK ? "success" : "warning"}
        >
          {value === StockStatus.OK ? "Stok OK" : "Restock"}
        </Chip>
      );

    if (key === "action") {
      return (
        <Button
          size="sm"
          variant="light"
          color="danger"
          isIconOnly
          onClick={() => {
            setSelectedMaterial(item);
            openDeleteDialog();
          }}
        >
          <Trash className="h-4 w-4" />
        </Button>
      );
    }

    return value;
  };

  return (
    <>
      <Modal
        isDismissable={!isRemovingMaterial}
        isOpen={isDeleteOpen}
        onOpenChange={onOpenChangeDelete}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                Hapus Bahan Baku {selectedMaterial?.name}?
              </ModalHeader>

              <ModalBody>
                <p>
                  Aksi ini tidak dapat di ubah setelah konfirmasi. Apakah anda
                  yakin ingin menghapus bahan baku{" "}
                  <strong>{selectedMaterial?.name}</strong> dari produk{" "}
                  <strong>{product.name}</strong>?
                </p>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  isLoading={false}
                  isDisabled={!selectedMaterial}
                  onPress={async () => {
                    if (!selectedMaterial) return;

                    const toastId = toast.loading("Menghapus bahan baku...");

                    await mutateRemoveMaterial(
                      {
                        productId: product.id,
                        materialIds: [selectedMaterial.id],
                      },
                      {
                        onSuccess: () => {
                          toast.success(
                            "Bahan baku berhasil dihapus dari produk",
                            {
                              id: toastId,
                            }
                          );

                          setSelectedMaterial(null);
                          onClose();
                        },
                        onError: (error) => {
                          toast.error(
                            "Gagal menghapus bahan baku dari produk",
                            {
                              id: toastId,
                              description:
                                error instanceof Error
                                  ? error.message
                                  : undefined,
                            }
                          );
                        },
                      }
                    );
                  }}
                >
                  Hapus
                </Button>
                <Button color="primary" onPress={onClose}>
                  Batalkan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <DataTable
        columns={columns}
        items={product.materials}
        rowKey={(item) => item.id}
        emptyContent="Tidak ditemukan data bahan baku produk"
        handleCellValue={handleRowValue}
        aria-label="Tabel Bahan Baku Produk"
        classNames={{
          base: "flex-1 max-h-96",
        }}
      />
    </>
  );
}
