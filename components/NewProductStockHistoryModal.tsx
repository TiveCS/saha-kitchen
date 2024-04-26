"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { NewProductStockHistoryForm } from "./NewProductStockHistoryForm";
import { Plus } from "@phosphor-icons/react";

interface NewProductStockHistoryModalProps {
  productId: string;
}

export function NewProductStockHistoryModal({
  productId,
}: NewProductStockHistoryModalProps) {
  const { onOpen, onOpenChange, isOpen } = useDisclosure();

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Tambah Riwayat Stok</ModalHeader>
              <ModalBody>
                <NewProductStockHistoryForm
                  productId={productId}
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
