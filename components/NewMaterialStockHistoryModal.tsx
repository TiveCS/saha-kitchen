"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Plus } from "@phosphor-icons/react";
import { NewMaterialStockHistoryForm } from "./NewMaterialStockHistoryForm";

interface NewMaterialStockHistoryModalProps {
  materialId: string;
}

export function NewMaterialStockHistoryModal({
  materialId,
}: NewMaterialStockHistoryModalProps) {
  const { onOpen, onOpenChange, isOpen } = useDisclosure();

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Tambah Riwayat Stok</ModalHeader>
              <ModalBody>
                <NewMaterialStockHistoryForm
                  materialId={materialId}
                  onSuccess={onClose}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Button
        onPress={onOpen}
        color="primary"
        startContent={<Plus className="h-4 w-4" />}
      >
        Tambah Riwayat Stok
      </Button>
    </>
  );
}
