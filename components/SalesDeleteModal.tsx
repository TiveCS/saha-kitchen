"use client";

import { useDeleteSales } from "@/queries/sales.query";
import { GetSalesSingle } from "@/types/sales.type";
import { formatNumber, formatReadableDate } from "@/utils/formatter";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { toast } from "sonner";

interface SalesDeleteModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  sales: GetSalesSingle | null;
  setSales: (sales: GetSalesSingle | null) => void;
}

export function SalesDeleteModal({
  isOpen,
  onClose,
  onOpenChange,
  setSales,
  sales,
}: SalesDeleteModalProps) {
  const { mutateAsync, isError, isSuccess, isPending, error } =
    useDeleteSales();

  const handleDelete = async () => {
    if (!sales) return;

    toast.promise(
      async () => {
        const result = await mutateAsync(sales.id);
        setSales(null);
        onClose();
        return result;
      },
      {
        loading: "Menghapus data penjualan...",
        success: "Berhasil menghapus data penjualan",
        error: "Gagal menghapus data penjualan",
        description: isError
          ? error?.message
          : isSuccess
          ? `"Data penjualan pada ${formatReadableDate(
              sales.occurredAt
            )}" telah dihapus`
          : undefined,
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen && !!sales}
      onOpenChange={onOpenChange}
      onClose={() => {
        setSales(null);
        onClose();
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Hapus Data Penjualan?
            </ModalHeader>
            <ModalBody>
              <p>
                Aksi ini tidak dapat di ubah setelah konfirmasi. Apakah anda
                yakin ingin menghapus data penjualan pada tanggal{" "}
                <strong>{sales && formatReadableDate(sales.occurredAt)}</strong>
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                isLoading={isPending}
                color="danger"
                variant="light"
                onPress={handleDelete}
                isDisabled={!sales}
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
