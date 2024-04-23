"use client";

import { useDeleteMaterial } from "@/queries/material.query";
import { GetMaterialsSingle } from "@/types/material.type";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { toast } from "sonner";

interface MaterialDeleteModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  material: GetMaterialsSingle | null;
  setMaterial: (material: GetMaterialsSingle | null) => void;
}

export function MaterialDeleteModal({
  isOpen,
  onClose,
  onOpenChange,
  setMaterial,
  material,
}: MaterialDeleteModalProps) {
  const { mutateAsync, isError, isSuccess, isPending, error } =
    useDeleteMaterial();

  const handleDelete = async () => {
    if (!material) return;

    toast.promise(
      async () => {
        const result = await mutateAsync(material.id);
        setMaterial(null);
        onClose();
        return result;
      },
      {
        loading: "Menghapus bahan baku...",
        success: "Berhasil menghapus bahan baku",
        error: "Gagal menghapus bahan baku",
        description: isError
          ? error?.message
          : isSuccess
          ? `"${material.name}" telah dihapus`
          : undefined,
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen && !!material}
      onOpenChange={onOpenChange}
      onClose={() => {
        setMaterial(null);
        onClose();
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Hapus Bahan Baku?
            </ModalHeader>
            <ModalBody>
              <p>
                Aksi ini tidak dapat di ubah setelah konfirmasi. Apakah anda
                yakin ingin menghapus bahan baku{" "}
                <span>&quot;{material?.name}&quot;</span>
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                isLoading={isPending}
                color="danger"
                variant="light"
                onPress={handleDelete}
                isDisabled={!material}
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
