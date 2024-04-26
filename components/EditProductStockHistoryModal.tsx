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
import { EditProductStockForm } from "./EditProductStockHistoryForm";
import { ProductStockHistory } from "@/types/product.type";

interface EditProductStockHistoryModalProps {
  stock: ProductStockHistory | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProductStockHistoryModal({
  stock,
  isOpen,
  onOpenChange,
}: EditProductStockHistoryModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Tambah Riwayat Stok</ModalHeader>
            <ModalBody>
              {stock && (
                <EditProductStockForm stock={stock} onSuccess={onClose} />
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
