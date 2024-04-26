"use client";

import { MaterialStockHistory } from "@/types/material.type";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { EditMaterialStockHistoryForm } from "./EditMaterialStockHistoryForm";

interface EditMaterialStockHistoryModalProps {
  stock: MaterialStockHistory | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMaterialStockHistoryModal({
  stock,
  isOpen,
  onOpenChange,
}: EditMaterialStockHistoryModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Tambah Riwayat Stok</ModalHeader>
            <ModalBody>
              {stock && (
                <EditMaterialStockHistoryForm
                  stock={stock}
                  onSuccess={onClose}
                />
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
