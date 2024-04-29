"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { NewProductMaterialForm } from "./NewProductMaterialForm";
import { NewProductStockHistoryForm } from "./NewProductStockHistoryForm";
import { ProductDetail } from "@/types/product.type";

interface NewProductStockHistoryModalProps {
  product: ProductDetail;
}

export function NewProductStockHistoryModal({
  product,
}: NewProductStockHistoryModalProps) {
  const {
    onOpen: onOpenAddStock,
    onOpenChange: onOpenChangeAddStock,
    isOpen: isOpenAddStock,
  } = useDisclosure();

  const {
    onOpen: onOpenAddMaterial,
    onOpenChange: onOpenChangeAddMaterial,
    isOpen: isOpenAddMaterial,
  } = useDisclosure();

  return (
    <>
      <Modal isOpen={isOpenAddStock} onOpenChange={onOpenChangeAddStock}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Tambah Riwayat Stok</ModalHeader>
              <ModalBody>
                <NewProductStockHistoryForm
                  productId={product.id}
                  onSuccess={onClose}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenAddMaterial} onOpenChange={onOpenChangeAddMaterial}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Tambah Bahan Baku</ModalHeader>
              <ModalBody>
                <NewProductMaterialForm product={product} onSuccess={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="flex flex-row gap-x-4">
        <Button variant="bordered" color="primary" onPress={onOpenAddMaterial}>
          Tambah Bahan Baku
        </Button>

        <Button onPress={onOpenAddStock} color="primary">
          Tambah Riwayat Stok
        </Button>
      </div>
    </>
  );
}
