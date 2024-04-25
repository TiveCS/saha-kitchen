"use client";

import { useDeleteUser } from "@/queries/users.query";
import { GetUsersSingle } from "@/types/users.type";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { toast } from "sonner";

interface UserDeleteModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  user: GetUsersSingle | null;
  setUser: (user: GetUsersSingle | null) => void;
}

export function UserDeleteModal({
  isOpen,
  onClose,
  onOpenChange,
  setUser,
  user,
}: UserDeleteModalProps) {
  const { mutateAsync, isError, isSuccess, isPending, error } = useDeleteUser();

  const handleDelete = async () => {
    if (!user) return;

    toast.promise(
      async () => {
        const result = await mutateAsync(user.id);
        setUser(null);
        onClose();
        return result;
      },
      {
        loading: "Menghapus data user...",
        success: "Berhasil menghapus data user",
        error: "Gagal menghapus data user",
        description: isError
          ? error?.message
          : isSuccess
          ? `User "${user.username}" telah dihapus`
          : undefined,
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen && !!user}
      onOpenChange={onOpenChange}
      onClose={() => {
        setUser(null);
        onClose();
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Hapus User?
            </ModalHeader>
            <ModalBody>
              <p>
                Aksi ini tidak dapat di ubah setelah konfirmasi. Apakah anda
                yakin ingin menghapus user dengan username{" "}
                <strong>{user?.username}</strong>?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                isLoading={isPending}
                color="danger"
                variant="light"
                onPress={handleDelete}
                isDisabled={!user}
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
