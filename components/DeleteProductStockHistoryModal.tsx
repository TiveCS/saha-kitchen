"use client";

import {
  useDeleteProduct,
  useDeleteProductStockHistory,
} from "@/queries/product.query";
import { ProductStockHistory } from "@/types/product.type";
import { formatReadableDate } from "@/utils/formatter";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { toast } from "sonner";

interface DeleteProductStockHistoryModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  stock: ProductStockHistory | null;
  setStock: (stock: ProductStockHistory | null) => void;
}

export function DeleteProductStockHistoryModal({
  isOpen,
  onClose,
  onOpenChange,
  setStock: setProduct,
  stock,
}: DeleteProductStockHistoryModalProps) {
  const { mutateAsync, isPending } = useDeleteProductStockHistory();

  const handleDelete = async () => {
    if (!stock) return;

    toast.promise(
      async () => {
        const result = await mutateAsync(stock.id);
        setProduct(null);
        onClose();
        return result;
      },
      {
        loading: "Menghapus riwayat stok...",
        success: "Berhasil menghapus riwayat stok",
        error: "Gagal menghapus riwayat stok",
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen && !!stock}
      onOpenChange={onOpenChange}
      isDismissable={!isPending}
      onClose={() => {
        setProduct(null);
        onClose();
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Hapus Riwayat Stok?
            </ModalHeader>
            <ModalBody>
              <p>
                Aksi ini tidak dapat di ubah setelah konfirmasi. Apakah anda
                yakin ingin menghapus riwayat stok pada tanggal{" "}
                <strong>
                  {stock?.createdAt ? formatReadableDate(stock.createdAt) : ""}
                </strong>
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                isLoading={isPending}
                color="danger"
                variant="light"
                onPress={handleDelete}
                isDisabled={!stock}
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
  );
}
