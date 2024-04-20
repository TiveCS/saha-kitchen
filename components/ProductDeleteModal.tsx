"use client";

import { useDeleteProduct } from "@/queries/product.query";
import { GetProductsSingle } from "@/types/product.type";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { toast } from "sonner";

interface ProductDeleteModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  product: GetProductsSingle | null;
  setProduct: (product: GetProductsSingle | null) => void;
}

export function ProductDeleteModal({
  isOpen,
  onClose,
  onOpenChange,
  setProduct,
  product,
}: ProductDeleteModalProps) {
  const { mutateAsync, isError, isSuccess, isPending, error } =
    useDeleteProduct();

  const handleDelete = async () => {
    if (!product) return;

    toast.promise(
      async () => {
        const result = await mutateAsync(product.id);
        setProduct(null);
        onClose();
        return result;
      },
      {
        loading: "Menghapus produk...",
        success: "Berhasil menghapus produk",
        error: "Gagal menghapus produk",
        description: isError
          ? error?.message
          : isSuccess
          ? `"${product.name}" telah dihapus`
          : undefined,
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen && !!product}
      onOpenChange={onOpenChange}
      onClose={() => {
        setProduct(null);
        onClose();
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Hapus Produk?
            </ModalHeader>
            <ModalBody>
              <p>
                Aksi ini tidak dapat di ubah setelah konfirmasi. Apakah anda
                yakin ingin menghapus produk{" "}
                <span>&quot;{product?.name}&quot;</span>
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                isLoading={isPending}
                color="danger"
                variant="light"
                onPress={handleDelete}
                isDisabled={!product}
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
