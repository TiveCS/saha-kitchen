"use client";

import { GetUsersSingle } from "@/types/users.type";
import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  cn,
} from "@nextui-org/react";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UsersTableCellActionProps {
  item: GetUsersSingle;
  openDeleteDialog: () => void;
  setDeleteSelectedUser: (user: GetUsersSingle | null) => void;
}

export function UsersTableCellAction({
  item,
  openDeleteDialog,
  setDeleteSelectedUser,
}: UsersTableCellActionProps) {
  const router = useRouter();
  const session = useSession();

  if (!session) return null;

  return (
    <div className="relative flex justify-start items-center gap-2">
      <Dropdown>
        <DropdownTrigger>
          <Button size="sm" isIconOnly variant="light">
            <DotsThreeVertical className="w-6 h-6" />
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          aria-label="Aksi Baris User"
          disabledKeys={session.data?.user.id === item.id ? ["delete"] : []}
          onAction={(key) => {
            if (key === "delete" && session.data?.user.id !== item.id) {
              setDeleteSelectedUser(item);
              openDeleteDialog();
            }

            if (key === "edit") {
              router.push(`/users/${item.id}/edit`);
            }
          }}
        >
          <DropdownItem key={"edit"}>Edit</DropdownItem>
          <DropdownItem
            key={"delete"}
            className={cn(
              "text-danger",
              session.data?.user.id === item.id && "hidden"
            )}
            color="danger"
          >
            Hapus
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
